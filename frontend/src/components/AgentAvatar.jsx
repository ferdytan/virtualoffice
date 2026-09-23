import React, { useRef, useEffect, useMemo, useState, Suspense, Component } from 'react'
import { useGLTF, useAnimations, Html } from '@react-three/drei'
import { RoundedBoxGeometry } from 'three-stdlib'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js'
import * as THREE from 'three'

/**
 * Error boundary component to catch GLB loading or parsing errors,
 * gracefully falling back to the default avatar so the 3D scene never crashes.
 */
class ModelErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(error) {
    console.warn('[AgentAvatar] Custom GLB failed to load, falling back to default:', error)
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || null
    }
    return this.props.children
  }
}

/**
 * Inner component that loads and renders the 3D model.
 * Supports:
 * 1. 'default': Authentic spherical claymorphic chibi avatar from The Delegation
 * 2. 'boxhead': Rounded-cube chibi character matching user reference photos (#94beea pastel head, determined face, #446889 slate body)
 * 3. 'custom': User-uploaded .glb file with auto-scaling and bounding-box fit
 */
function CharacterModel({
  modelUrl,
  avatarType = 'default',
  agent,
  hovered,
  isSelected,
  initialAnimation = 'Sit_Work'
}) {
  const groupRef = useRef()
  const { scene, animations } = useGLTF(modelUrl, '/draco/')
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { actions } = useAnimations(animations, groupRef)

  // Configure materials, accessories, and BoxHead head attachment
  useEffect(() => {
    if (!clone) return

    if (avatarType === 'custom') {
      // Custom Uploaded 3D Model: auto-scale and center to fit the chair
      const bbox = new THREE.Box3().setFromObject(clone)
      const height = bbox.max.y - bbox.min.y
      if (height > 0) {
        const targetHeight = 1.1 // standard sitting chibi height
        const scale = targetHeight / height
        clone.scale.set(scale, scale, scale)
        clone.position.y = -bbox.min.y * scale
      }

      clone.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })
    } else if (avatarType === 'boxhead') {
      // BoxHead Chibi Character (from user photos):
      // 1. Body: Darker slate blue (#446889) or agent color
      const bodyColor = new THREE.Color('#446889')
      clone.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true

          if (child.name === 'body') {
            child.material = new THREE.MeshStandardMaterial({
              color: bodyColor,
              roughness: 0.32,
              metalness: 0.05
            })
          } else if (child.name === 'eyes' || child.name === 'mouth' || child.name === 'cap' || child.name === 'headphones') {
            child.visible = false
          }
        }
      })

      // 2. Attach RoundedBox Head directly to the skeleton 'head' bone
      const headBone = clone.getObjectByName('head')
      if (headBone) {
        // Remove any previous instance of boxhead_group
        const existing = headBone.getObjectByName('boxhead_group')
        if (existing) headBone.remove(existing)

        const boxGroup = new THREE.Group()
        boxGroup.name = 'boxhead_group'

        // 3D Rounded Box Head (soft chamfered cube)
        // args: width, height, depth, segments, radius
        const headGeom = new RoundedBoxGeometry(0.45, 0.44, 0.46, 8, 0.085)
        const headMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color('#94beea'),
          roughness: 0.35,
          metalness: 0.04
        })
        const headMesh = new THREE.Mesh(headGeom, headMat)
        headMesh.castShadow = true
        headMesh.receiveShadow = true
        headMesh.position.set(0, 0.22, 0.02)
        boxGroup.add(headMesh)

        // Front Face plate with determined eyebrows, anime eyes with white catchlight speculars, and inverted-V mouth
        const faceTex = new THREE.TextureLoader().load('/textures/boxhead_face_features.png')
        faceTex.colorSpace = THREE.SRGBColorSpace
        const faceGeom = new THREE.PlaneGeometry(0.38, 0.38)
        const faceMat = new THREE.MeshStandardMaterial({
          map: faceTex,
          transparent: true,
          alphaTest: 0.02,
          roughness: 0.35,
          polygonOffset: true,
          polygonOffsetFactor: -1
        })
        const faceMesh = new THREE.Mesh(faceGeom, faceMat)
        faceMesh.position.set(0, 0.22, 0.252)
        boxGroup.add(faceMesh)

        headBone.add(boxGroup)
      }
    } else {
      // Default Chibi Avatar: clean claymorphic finish, hidden accessories
      const agentColor = new THREE.Color(agent.color || '#ef4444')
      clone.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true

          if (child.name === 'body') {
            child.material = new THREE.MeshStandardMaterial({
              color: agentColor,
              roughness: 0.32,
              metalness: 0.05
            })
          } else if (child.name === 'eyes' || child.name === 'mouth') {
            child.visible = true
            child.renderOrder = 2
          } else if (child.name === 'cap' || child.name === 'headphones') {
            child.visible = false
          }
        }
      })

      // Ensure no leftover boxhead on default
      const headBone = clone.getObjectByName('head')
      if (headBone) {
        const existing = headBone.getObjectByName('boxhead_group')
        if (existing) headBone.remove(existing)
      }
    }

    return () => {
      const hb = clone?.getObjectByName('head')
      const existing = hb?.getObjectByName('boxhead_group')
      if (existing && hb) hb.remove(existing)
    }
  }, [clone, avatarType, agent.color])

  // Play skeletal animations
  useEffect(() => {
    if (!actions || Object.keys(actions).length === 0) return

    if (avatarType !== 'custom') {
      // Default and BoxHead use character.glb animations: Sit_Work typing by default, Wave on hover/select
      const defaultAnim = actions[initialAnimation] || actions['Sit_Work'] || actions['Idle']
      const waveAnim = actions['Wave']

      if (hovered || isSelected) {
        if (waveAnim) {
          waveAnim.reset().fadeIn(0.2).play()
          if (defaultAnim && defaultAnim !== waveAnim) {
            defaultAnim.fadeOut(0.2)
          }
        }
      } else {
        if (defaultAnim) {
          defaultAnim.reset().fadeIn(0.25).play()
        }
        if (waveAnim && waveAnim !== defaultAnim) {
          waveAnim.fadeOut(0.25)
        }
      }
    } else {
      // Custom model animations: find Sit, Work, Idle, or default to the first animation
      const animNames = Object.keys(actions)
      let targetAnim = null
      for (const name of animNames) {
        const lower = name.toLowerCase()
        if (lower.includes('sit') || lower.includes('work') || lower.includes('idle')) {
          targetAnim = actions[name]
          break
        }
      }
      if (!targetAnim && animNames.length > 0) {
        targetAnim = actions[animNames[0]]
      }
      if (targetAnim) {
        targetAnim.reset().fadeIn(0.3).play()
      }
    }
  }, [actions, avatarType, hovered, isSelected, initialAnimation])

  return (
    <group ref={groupRef}>
      <primitive object={clone} />
    </group>
  )
}

/**
 * AgentAvatar Component
 * Supports:
 * - 'default': Classic spherical chibi avatar
 * - 'boxhead': Rounded-cube chibi avatar (user's photos)
 * - 'custom': User-uploaded GLB model
 */
export default function AgentAvatar({
  agent,
  isSelected,
  onSelect,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  initialAnimation = 'Sit_Work'
}) {
  const [hovered, setHovered] = useState(false)
  const agentColor = agent.color || '#38bdf8'

  const customModelUrl = agent.custom_model_url || agent.customModelUrl
  const avatarType = agent.avatar_type || (customModelUrl ? 'custom' : 'default')

  const effectiveModelUrl = avatarType === 'custom' && customModelUrl
    ? customModelUrl
    : '/models/character.glb'

  return (
    <group
      position={position}
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(agent)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
    >
      {/* --- Floating Hover Badge Pill --- */}
      {(hovered || isSelected) && (
        <Html
          position={[0, 1.45, 0]}
          center
          distanceFactor={9}
          style={{ pointerEvents: 'none' }}
        >
          <div className="flex items-center gap-2 bg-slate-950/92 text-white px-3.5 py-1.5 rounded-full shadow-2xl border border-slate-700/80 backdrop-blur-md whitespace-nowrap animate-in fade-in zoom-in duration-150">
            {/* Blinking Dot */}
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
            </span>

            {/* Role Title */}
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-100">
              {agent.role_badge || agent.role || 'AGENT'}
            </span>

            {/* Agent Short Tag */}
            <span
              className="text-[10px] font-extrabold px-1.5 py-0.5 rounded text-white"
              style={{ backgroundColor: agentColor }}
            >
              {agent.name}
            </span>

            {avatarType === 'boxhead' && (
              <span className="text-[9px] bg-sky-600 font-bold px-1.5 py-0.5 rounded text-white uppercase tracking-wider">
                BoxHead
              </span>
            )}

            {avatarType === 'custom' && (
              <span className="text-[9px] bg-purple-600/80 font-bold px-1.5 py-0.5 rounded text-white uppercase tracking-wider">
                Custom GLB
              </span>
            )}
          </div>
        </Html>
      )}

      {/* --- Floor Selection Glow Ring --- */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 0.72, 32]} />
        <meshBasicMaterial
          color={agentColor}
          transparent
          opacity={isSelected ? 0.9 : hovered ? 0.45 : 0.12}
        />
      </mesh>

      {/* --- 3D Character Renderer with Error Boundary & Suspense --- */}
      <ModelErrorBoundary
        fallback={
          <CharacterModel
            modelUrl="/models/character.glb"
            avatarType="default"
            agent={agent}
            hovered={hovered}
            isSelected={isSelected}
            initialAnimation={initialAnimation}
          />
        }
      >
        <Suspense fallback={null}>
          <CharacterModel
            key={`${avatarType}_${effectiveModelUrl}`}
            modelUrl={effectiveModelUrl}
            avatarType={avatarType}
            agent={agent}
            hovered={hovered}
            isSelected={isSelected}
            initialAnimation={initialAnimation}
          />
        </Suspense>
      </ModelErrorBoundary>
    </group>
  )
}

useGLTF.preload('/models/character.glb', '/draco/')
