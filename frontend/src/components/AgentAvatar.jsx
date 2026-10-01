import React, { useRef, useEffect, useMemo, useState, Suspense, Component } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations, Html } from '@react-three/drei'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js'
import * as THREE from 'three'

/**
 * Mascot mapping matching the user's reference image:
 * - Sherloc: Bunny (🐰)
 * - Watson: Cat (🐱)
 * - Nara: Telemetry (📡)
 * - Velocia: Strategy / Deer (📈)
 * - Scout: Fox (🦊)
 * - COO: Bear / Supervisor (🐻)
 */
const AGENT_MASCOTS = {
  sherloc: { emoji: '🐰', animal: 'Bunny', earType: 'bunny' },
  watson: { emoji: '🐱', animal: 'Cat', earType: 'cat' },
  nara: { emoji: '📡', animal: 'Radar', earType: 'radar' },
  velocia: { emoji: '📈', animal: 'Red Fox', earType: 'fox_red' },
  scout: { emoji: '🦊', animal: 'Fox', earType: 'fox' },
  coo: { emoji: '🐻', animal: 'Bear', earType: 'bear' }
}

/**
 * Kemonomimi 3D Animal Ears:
 * - Bunny Ears for Sherloc (white with pink interior)
 * - Cat Ears for Watson (black with pink interior)
 * - Bear Ears & gold glasses for COO
 * - Fox Ears for Scout (amber with white fluff)
 * - Radar Ears for Nara
 */
function KemonomimiEars({ earType = 'bunny', agentId }) {
  switch (earType) {
    case 'bunny':
      // Tall upright bunny ears
      return (
        <group position={[0, 0.28, -0.02]}>
          {/* Left Ear */}
          <group position={[-0.14, 0, 0]} rotation={[-0.1, 0, -0.14]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.045, 0.055, 0.38, 16]} />
              <meshStandardMaterial color="#ffffff" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0, 0.022]}>
              <cylinderGeometry args={[0.026, 0.038, 0.32, 16]} />
              <meshStandardMaterial color="#fbcfe8" roughness={0.4} />
            </mesh>
          </group>
          {/* Right Ear */}
          <group position={[0.14, 0, 0]} rotation={[-0.1, 0, 0.14]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.045, 0.055, 0.38, 16]} />
              <meshStandardMaterial color="#ffffff" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0, 0.022]}>
              <cylinderGeometry args={[0.026, 0.038, 0.32, 16]} />
              <meshStandardMaterial color="#fbcfe8" roughness={0.4} />
            </mesh>
          </group>
        </group>
      )

    case 'cat':
      // Sleek triangular cat ears
      return (
        <group position={[0, 0.26, -0.02]}>
          {/* Left Cat Ear */}
          <group position={[-0.16, 0, 0]} rotation={[0.1, 0.12, -0.28]}>
            <mesh castShadow>
              <coneGeometry args={[0.085, 0.18, 4]} />
              <meshStandardMaterial color="#1e293b" roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.01, 0.02]}>
              <coneGeometry args={[0.055, 0.13, 4]} />
              <meshStandardMaterial color="#f472b6" roughness={0.3} />
            </mesh>
          </group>
          {/* Right Cat Ear */}
          <group position={[0.16, 0, 0]} rotation={[0.1, -0.12, 0.28]}>
            <mesh castShadow>
              <coneGeometry args={[0.085, 0.18, 4]} />
              <meshStandardMaterial color="#1e293b" roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.01, 0.02]}>
              <coneGeometry args={[0.055, 0.13, 4]} />
              <meshStandardMaterial color="#f472b6" roughness={0.3} />
            </mesh>
          </group>
        </group>
      )

    case 'bear':
      // Round bear ears & stylish gold round eyeglasses
      return (
        <group position={[0, 0.24, -0.02]}>
          {/* Left Ear */}
          <group position={[-0.18, 0, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.075, 16, 16]} />
              <meshStandardMaterial color="#44403c" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0, 0.025]}>
              <sphereGeometry args={[0.05, 12, 12]} />
              <meshStandardMaterial color="#d6d3d1" roughness={0.5} />
            </mesh>
          </group>
          {/* Right Ear */}
          <group position={[0.18, 0, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.075, 16, 16]} />
              <meshStandardMaterial color="#44403c" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0, 0.025]}>
              <sphereGeometry args={[0.05, 12, 12]} />
              <meshStandardMaterial color="#d6d3d1" roughness={0.5} />
            </mesh>
          </group>
          {/* Round Wire-Frame Glasses across eyes */}
          <group position={[0, -0.18, 0.22]}>
            <mesh position={[-0.08, 0, 0]}>
              <torusGeometry args={[0.065, 0.007, 8, 24]} />
              <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0.08, 0, 0]}>
              <torusGeometry args={[0.065, 0.007, 8, 24]} />
              <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.02, 0]}>
              <boxGeometry args={[0.06, 0.007, 0.007]} />
              <meshStandardMaterial color="#eab308" metalness={0.9} />
            </mesh>
          </group>
        </group>
      )

    case 'fox':
    case 'fox_red':
      // Pointed fluffy fox ears
      const earColor = earType === 'fox_red' ? '#ef4444' : '#d97706'
      return (
        <group position={[0, 0.26, -0.02]}>
          <group position={[-0.16, 0, 0]} rotation={[0.12, 0.1, -0.22]}>
            <mesh castShadow>
              <coneGeometry args={[0.09, 0.18, 4]} />
              <meshStandardMaterial color={earColor} roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.01, 0.025]}>
              <coneGeometry args={[0.055, 0.13, 4]} />
              <meshStandardMaterial color="#fef3c7" roughness={0.4} />
            </mesh>
          </group>
          <group position={[0.16, 0, 0]} rotation={[0.12, -0.1, 0.22]}>
            <mesh castShadow>
              <coneGeometry args={[0.09, 0.18, 4]} />
              <meshStandardMaterial color={earColor} roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.01, 0.025]}>
              <coneGeometry args={[0.055, 0.13, 4]} />
              <meshStandardMaterial color="#fef3c7" roughness={0.4} />
            </mesh>
          </group>
        </group>
      )

    case 'radar':
      // Tech radar ears & beacon for Nara
      return (
        <group position={[0, 0.26, 0]}>
          <group position={[-0.15, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.06, 0.06, 0.06, 16]} />
              <meshStandardMaterial color="#0284c7" />
            </mesh>
          </group>
          <group position={[0.15, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.06, 0.06, 0.06, 16]} />
              <meshStandardMaterial color="#0284c7" />
            </mesh>
          </group>
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.01, 0.015, 0.16, 8]} />
            <meshStandardMaterial color="#38bdf8" />
          </mesh>
          <mesh position={[0, 0.18, 0]}>
            <sphereGeometry args={[0.028, 12, 12]} />
            <meshBasicMaterial color="#00f0ff" />
          </mesh>
        </group>
      )

    default:
      return null
  }
}

/**
 * Head bone accessory rig:
 * Seamlessly tracks the head bone of character.glb
 */
function HeadBoneAccessoryRig({ clone, agent }) {
  const headRef = useRef()
  const tempPos = useMemo(() => new THREE.Vector3(), [])
  const tempQuat = useMemo(() => new THREE.Quaternion(), [])
  const parentQuat = useMemo(() => new THREE.Quaternion(), [])
  const offset = useMemo(() => new THREE.Vector3(0, 0.22, 0.01), [])
  const rotatedOffset = useMemo(() => new THREE.Vector3(), [])

  const mascot = AGENT_MASCOTS[agent.id] || { earType: 'bunny' }

  useFrame(() => {
    if (!headRef.current || !clone) return
    const headBone = clone.getObjectByName('head')
    if (headBone) {
      headBone.getWorldPosition(tempPos)
      headBone.getWorldQuaternion(tempQuat)

      rotatedOffset.copy(offset).applyQuaternion(tempQuat)
      tempPos.add(rotatedOffset)

      if (headRef.current.parent) {
        headRef.current.parent.worldToLocal(tempPos)
        headRef.current.parent.getWorldQuaternion(parentQuat)
        parentQuat.invert()
        tempQuat.premultiply(parentQuat)
      }

      headRef.current.position.copy(tempPos)
      headRef.current.quaternion.copy(tempQuat)
    }
  })

  return (
    <group ref={headRef}>
      <KemonomimiEars earType={mascot.earType} agentId={agent.id} />
    </group>
  )
}

/**
 * Hips bone accessory rig for animated tail:
 * Tracks hips bone and sways gently with clock
 */
function HipsBoneTailRig({ clone, agentId }) {
  const tailRef = useRef()
  const tempPos = useMemo(() => new THREE.Vector3(), [])
  const tempQuat = useMemo(() => new THREE.Quaternion(), [])
  const parentQuat = useMemo(() => new THREE.Quaternion(), [])
  const offset = useMemo(() => new THREE.Vector3(0, -0.05, -0.15), [])
  const rotatedOffset = useMemo(() => new THREE.Vector3(), [])

  useFrame(({ clock }) => {
    if (!tailRef.current || !clone) return
    const hipsBone = clone.getObjectByName('hips')
    if (hipsBone) {
      hipsBone.getWorldPosition(tempPos)
      hipsBone.getWorldQuaternion(tempQuat)

      rotatedOffset.copy(offset).applyQuaternion(tempQuat)
      tempPos.add(rotatedOffset)

      if (tailRef.current.parent) {
        tailRef.current.parent.worldToLocal(tempPos)
        tailRef.current.parent.getWorldQuaternion(parentQuat)
        parentQuat.invert()
        tempQuat.premultiply(parentQuat)
      }

      tailRef.current.position.copy(tempPos)
      tailRef.current.quaternion.copy(tempQuat)

      // Gentle tail swish
      const t = clock.getElapsedTime()
      tailRef.current.rotation.z += Math.sin(t * 2.5) * 0.15
      tailRef.current.rotation.y += Math.cos(t * 2) * 0.1
    }
  })

  if (agentId === 'watson') {
    // Sleek Cat Tail
    return (
      <group ref={tailRef} rotation={[0.8, 0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.022, 0.03, 0.42, 8]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.21, 0]} castShadow>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
      </group>
    )
  }

  if (agentId === 'scout') {
    // Big Fluffy Fox Tail
    return (
      <group ref={tailRef} rotation={[0.85, 0, 0]}>
        <mesh castShadow>
          <coneGeometry args={[0.11, 0.45, 8]} />
          <meshStandardMaterial color="#d97706" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.22, 0]} castShadow>
          <coneGeometry args={[0.075, 0.16, 8]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
      </group>
    )
  }

  return null
}

/**
 * Hand-Held Props:
 * - Coffee Mug for Watson & COO
 * - Digital Tablet for Scout & Sherloc
 */
function HandHeldProp({ agentId }) {
  if (agentId === 'watson' || agentId === 'coo') {
    return (
      <group position={[0.26, 0.65, 0.2]} rotation={[0.2, -0.3, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.05, 0.045, 0.1, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.045, 0]}>
          <circleGeometry args={[0.042, 16]} />
          <meshStandardMaterial color="#3e2723" roughness={0.1} />
        </mesh>
        <mesh position={[0.055, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.028, 0.008, 8, 16]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
      </group>
    )
  }

  if (agentId === 'scout' || agentId === 'sherloc') {
    return (
      <group position={[0.24, 0.62, 0.22]} rotation={[0.6, -0.25, 0.1]}>
        <mesh castShadow>
          <boxGeometry args={[0.18, 0.26, 0.012]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.008]}>
          <planeGeometry args={[0.16, 0.23]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>
    )
  }

  return null
}

/**
 * Inner Character Model Component:
 * Reliably colors the character body, hides cap/headphones, renders eyes & mouth,
 * and attaches Kemonomimi ears & tails!
 */
function CharacterModel({
  modelUrl = '/models/character.glb',
  agent,
  hovered,
  isSelected,
  initialAnimation = 'Idle'
}) {
  const groupRef = useRef()
  const { scene, animations } = useGLTF(modelUrl, '/draco/')
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { actions } = useAnimations(animations, groupRef)

  // Configure materials cleanly
  useEffect(() => {
    if (!clone) return
    const agentColor = new THREE.Color(agent.color || '#38bdf8')

    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true

        if (child.name === 'body') {
          // Color body with agent theme color
          child.material = new THREE.MeshStandardMaterial({
            color: agentColor,
            roughness: 0.38,
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
  }, [clone, agent.color])

  // Play animation (Idle by default, Wave on hover/select)
  useEffect(() => {
    if (!actions || Object.keys(actions).length === 0) return

    const defaultAnim = actions['Idle'] || actions['LookAround'] || actions[initialAnimation]
    const waveAnim = actions['Wave'] || actions['Happy']

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
  }, [actions, hovered, isSelected, initialAnimation])

  return (
    <group ref={groupRef}>
      <primitive object={clone} />
      {/* 3D Kemonomimi Animal Ears on Head */}
      <HeadBoneAccessoryRig clone={clone} agent={agent} />
      {/* Animated Animal Tail on Hips */}
      <HipsBoneTailRig clone={clone} agentId={agent.id} />
      {/* Hand-held props */}
      <HandHeldProp agentId={agent.id} />
    </group>
  )
}

/**
 * Error boundary fallback
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
    console.warn('[AgentAvatar] GLB load error:', error)
  }
  render() {
    if (this.state.hasError) return this.props.fallback || null
    return this.props.children
  }
}

/**
 * AgentAvatar Component
 * Features:
 * - Floating label displays the AGENT NAME (e.g. 🐰 Sherloc, 🐱 Watson, 📡 Nara, etc.)
 * - Reliable 3D chibi model with Kemonomimi ears & tails
 * - Generous 1.9m hitbox & selection ring
 */
export default function AgentAvatar({
  agent,
  isSelected,
  onSelect,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  initialAnimation = 'Idle',
  hideTooltip = false
}) {
  const [hovered, setHovered] = useState(false)
  const agentColor = agent.color || '#38bdf8'
  const mascot = AGENT_MASCOTS[agent.id] || { emoji: '🤖', animal: 'Agent' }

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
      {/* ========================================================
          FLOATING LABEL: MENAMPILKAN NAMA AGENT
          (Sesuai permintaan: "untuk label jangan isi role atau tugas nya tapi namanya")
          ======================================================== */}
      {!hideTooltip && (
        <Html
          position={[0, 1.55, 0]}
          center
          distanceFactor={10}
          zIndexRange={[1, 15]}
          style={{ pointerEvents: 'none' }}
        >
          {hovered || isSelected ? (
            /* --- Expanded Card (On Hover / Select) --- */
            <div className="flex flex-col items-start bg-slate-950/95 text-white px-3.5 py-2.5 rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-md whitespace-nowrap select-none animate-in fade-in zoom-in-95 duration-150 text-left min-w-[170px] relative">
              <div className="flex items-center justify-between gap-3 w-full">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{mascot.emoji}</span>
                  <span className="text-sm font-black tracking-tight text-white leading-none">
                    {agent.name}
                  </span>
                </div>

                <span className="inline-flex items-center gap-1 text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-md leading-none shrink-0 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>ONLINE</span>
                </span>
              </div>

              <span className="text-[8px] font-bold tracking-wider uppercase text-slate-400 mt-1 leading-none">
                {mascot.animal}
              </span>

              <span className="text-[7.5px] font-semibold text-slate-500 mt-2 pt-1.5 border-t border-slate-800/80 w-full">
                💡 Klik untuk membuka panel tugas & brief
              </span>

              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-6 border-t-slate-950/95" />
            </div>
          ) : (
            /* --- Compact Floating Label Pill: NAMA AGENT (Contoh: 🐰 Sherloc, 🐱 Watson, 📡 Nara) --- */
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/92 hover:bg-slate-900 text-white shadow-xl border border-white/30 backdrop-blur-xs select-none transition-transform duration-200 hover:scale-105 relative cursor-pointer">
              <span className="text-xs leading-none">{mascot.emoji}</span>
              <span className="text-[10px] font-black text-white tracking-tight leading-none">
                {agent.name}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0 ml-0.5" />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-x-3 border-x-transparent border-t-4 border-t-slate-900/92" />
            </div>
          )}
        </Html>
      )}

      {/* --- Generous 3D Click & Hover Hitbox Volume (1.9m Diameter) --- */}
      <mesh
        position={[0, 1.0, 0]}
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
        <cylinderGeometry args={[0.95, 0.95, 2.0, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* --- Visual Floor Interactive Ring --- */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.45, 0.55, 32]} />
        <meshBasicMaterial
          color={agentColor}
          transparent
          opacity={isSelected ? 0.95 : hovered ? 0.65 : 0.3}
          depthWrite={false}
        />
      </mesh>

      {/* --- 3D Character Model --- */}
      <ModelErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <CharacterModel
            modelUrl="/models/character.glb"
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
