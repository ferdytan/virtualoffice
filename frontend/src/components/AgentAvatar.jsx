import React, { useRef, useEffect, useMemo, useState, Suspense, Component } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations, useTexture, RoundedBox, Html } from '@react-three/drei'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js'
import * as THREE from 'three'

/**
 * Real-time Autonomous Routines for each agent matching the Tycoon simulation brief
 */
const AGENT_ROUTINES = {
  sherloc: {
    icon: '💬',
    title: 'Validasi Akun #CUST-9821',
    routine: 'Menjawab chat inbound WhatsApp & validasi paket langganan Orin',
    shortText: '💬 Live Chat'
  },
  watson: {
    icon: '⚡',
    title: 'Eskalasi Firmware #TIK-481',
    routine: 'Menghubungkan eskalasi tim lead & panen pasangan Q&A ke RAG',
    shortText: '⚡ Harvest Q&A'
  },
  nara: {
    icon: '📡',
    title: 'Scan Telemetri GPS (48 Unit)',
    routine: 'Memantau unit offline & safe broadcast anti-banned delay',
    shortText: '📡 48 Unit GPS'
  },
  velocia: {
    icon: '📈',
    title: 'Strategi Growth & Sensor BBM',
    routine: 'Analisis log percakapan selesai & susun strategi bundling promo',
    shortText: '📈 Riset Growth'
  },
  scout: {
    icon: '✍️',
    title: 'Draf Edukasi Anti-Maling',
    routine: 'Menulis artikel konversi Orin berdasar riset logistik & berita',
    shortText: '✍️ Tulis Edukasi'
  },
  coo: {
    icon: '👑',
    title: 'Executive Orchestrator',
    routine: 'Menerima instruksi Telegram Bot, memecah & delegasi ke spesialis',
    shortText: '👑 Orchestrator'
  }
}

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
 * Face plate component for the BoxHead character,
 * rendering the determined eyebrows, anime eyes with white catchlight highlights,
 * and inverted-V mouth.
 */
function BoxHeadFacePlate() {
  const texture = useTexture('/textures/boxhead_face_features.png')
  return (
    <mesh position={[0, 0.01, 0.228]}>
      <planeGeometry args={[0.38, 0.38]} />
      <meshStandardMaterial
        map={texture}
        transparent={true}
        alphaTest={0.02}
        roughness={0.32}
        polygonOffset={true}
        polygonOffsetFactor={-2}
      />
    </mesh>
  )
}

/**
 * Procedural Thematic Mascot Accessories for each agent role:
 * - Sherloc: CS Headset with boom mic & glowing tip
 * - Watson: Cyber Smart Glasses & Escalation Antenna
 * - Nara: Telemetry Antenna & Mini Satellite Dish with blinking cyan beacon
 * - Velocia: Marketing Headphone Band with rose-gold metallic earcups
 * - Scout: Writer's Cap / Beret with yellow quill/pencil tucked behind ear
 * - COO: Executive Gold Crown with royal violet gemstone
 */
function AgentThematicAccessory({ agentId }) {
  const beaconRef = useRef()

  useFrame((state) => {
    if (beaconRef.current) {
      beaconRef.current.intensity = 0.8 + Math.sin(state.clock.getElapsedTime() * 6) * 0.4
    }
  })

  switch (agentId) {
    case 'sherloc':
      // Frontline CS: Professional Amber Headset with Boom Mic
      return (
        <group position={[0, 0, 0]}>
          {/* Headband spanning top of head */}
          <mesh position={[0, 0.23, 0]}>
            <torusGeometry args={[0.24, 0.02, 12, 32, Math.PI]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Left Ear Cup */}
          <mesh position={[-0.24, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.07, 0.07, 0.05, 16]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.4} />
          </mesh>
          {/* Right Ear Cup */}
          <mesh position={[0.24, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.07, 0.07, 0.05, 16]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.4} />
          </mesh>
          {/* Microphone Boom curving towards mouth */}
          <mesh position={[-0.14, -0.07, 0.16]} rotation={[0.4, 0.35, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.22, 8]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} />
          </mesh>
          {/* Glowing Green Mic Tip */}
          <mesh position={[-0.05, -0.15, 0.23]}>
            <sphereGeometry args={[0.018, 12, 12]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
        </group>
      )

    case 'watson':
      // Technical Escalation: Cyber Visor / Smart Tech Glasses + Mini Escalation Antenna
      return (
        <group position={[0, 0, 0]}>
          {/* Indigo Cyber Smart Glasses Frame */}
          <mesh position={[0, 0.04, 0.235]}>
            <boxGeometry args={[0.34, 0.07, 0.02]} />
            <meshStandardMaterial color="#312e81" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Left Glowing Lens */}
          <mesh position={[-0.08, 0.04, 0.246]}>
            <planeGeometry args={[0.11, 0.05]} />
            <meshBasicMaterial color="#6366f1" />
          </mesh>
          {/* Right Glowing Lens */}
          <mesh position={[0.08, 0.04, 0.246]}>
            <planeGeometry args={[0.11, 0.05]} />
            <meshBasicMaterial color="#6366f1" />
          </mesh>
          {/* Cyber Antenna on right side */}
          <mesh position={[0.22, 0.24, 0]} rotation={[0, 0, -0.15]}>
            <cylinderGeometry args={[0.006, 0.01, 0.16, 8]} />
            <meshStandardMaterial color="#4338ca" metalness={0.8} />
          </mesh>
          <mesh position={[0.245, 0.32, 0]}>
            <sphereGeometry args={[0.02, 12, 12]} />
            <meshBasicMaterial color="#818cf8" />
          </mesh>
        </group>
      )

    case 'nara':
      // CS & Offline GPS Telemetry: Satellite Dish & Telemetry Beacon
      return (
        <group position={[0, 0, 0]}>
          {/* Antenna Mast on top of head */}
          <mesh position={[0, 0.27, 0]}>
            <cylinderGeometry args={[0.012, 0.02, 0.12, 12]} />
            <meshStandardMaterial color="#0284c7" metalness={0.7} />
          </mesh>
          {/* Mini Satellite Parabolic Dish */}
          <mesh position={[0, 0.34, 0]} rotation={[-0.35, 0, 0]}>
            <sphereGeometry args={[0.09, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
            <meshStandardMaterial color="#38bdf8" metalness={0.5} roughness={0.3} side={THREE.DoubleSide} />
          </mesh>
          {/* Pulsing Beacon Diode */}
          <mesh position={[0, 0.36, 0.04]}>
            <sphereGeometry args={[0.022, 12, 12]} />
            <meshBasicMaterial color="#00f0ff" />
          </mesh>
          <pointLight ref={beaconRef} position={[0, 0.38, 0.04]} color="#00f0ff" distance={1.2} intensity={0.8} />
        </group>
      )

    case 'velocia':
      // Marketing Strategist: Vibrant Red Marketing Headphone Band + Gold Accents
      return (
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0.23, 0]}>
            <torusGeometry args={[0.24, 0.022, 12, 32, Math.PI]} />
            <meshStandardMaterial color="#ef4444" roughness={0.3} />
          </mesh>
          {/* Left Cushion */}
          <mesh position={[-0.24, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.075, 0.075, 0.05, 16]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.4} />
          </mesh>
          {/* Left Gold Trim */}
          <mesh position={[-0.266, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.05, 0.05, 0.01, 16]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Right Cushion */}
          <mesh position={[0.24, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.075, 0.075, 0.05, 16]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.4} />
          </mesh>
          {/* Right Gold Trim */}
          <mesh position={[0.266, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.05, 0.05, 0.01, 16]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.85} roughness={0.2} />
          </mesh>
        </group>
      )

    case 'scout':
      // Content Creator & Copywriter: Green Beret / Writer's Cap + Yellow Quill / Pencil
      return (
        <group position={[0, 0, 0]}>
          {/* Beret / Newsboy Cap Dome tilted playfully */}
          <mesh position={[0, 0.23, -0.01]} rotation={[-0.1, 0, 0.12]}>
            <cylinderGeometry args={[0.25, 0.22, 0.08, 20]} />
            <meshStandardMaterial color="#15803d" roughness={0.6} />
          </mesh>
          {/* Cap Brim */}
          <mesh position={[0, 0.21, 0.16]} rotation={[0.25, 0, 0.12]}>
            <boxGeometry args={[0.26, 0.02, 0.12]} />
            <meshStandardMaterial color="#14532d" roughness={0.5} />
          </mesh>
          {/* Yellow Pencil tucked behind right ear */}
          <group position={[0.22, 0.1, 0.02]} rotation={[0.4, 0, -0.25]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.014, 0.014, 0.22, 6]} />
              <meshStandardMaterial color="#eab308" roughness={0.3} />
            </mesh>
            {/* Pencil Tip */}
            <mesh position={[0, 0.12, 0]}>
              <coneGeometry args={[0.014, 0.04, 6]} />
              <meshStandardMaterial color="#fef08a" />
            </mesh>
            {/* Graphite Lead Point */}
            <mesh position={[0, 0.142, 0]}>
              <coneGeometry args={[0.007, 0.015, 6]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
          </group>
        </group>
      )

    case 'coo':
      // Executive Orchestrator (Supervisor): Royal Executive Gold Crown
      return (
        <group position={[0, 0, 0]}>
          {/* Crown Base Ring */}
          <mesh position={[0, 0.23, 0]}>
            <cylinderGeometry args={[0.18, 0.17, 0.04, 20]} />
            <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.15} />
          </mesh>
          {/* 5 Crown Spikes */}
          {[0, 1.25, 2.5, 3.75, 5.0].map((rot, idx) => (
            <mesh
              key={idx}
              position={[Math.sin(rot) * 0.16, 0.27, Math.cos(rot) * 0.16]}
              rotation={[0, rot, 0]}
            >
              <coneGeometry args={[0.035, 0.08, 4]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.92} roughness={0.12} />
            </mesh>
          ))}
          {/* Center Royal Violet Gemstone */}
          <mesh position={[0, 0.245, 0.18]}>
            <octahedronGeometry args={[0.026]} />
            <meshStandardMaterial color="#c084fc" metalness={0.5} roughness={0.1} />
          </mesh>
        </group>
      )

    default:
      return null
  }
}

/**
 * 3D BoxHead Rig:
 * Dynamically tracks the skeleton's 'head' bone world transform every frame.
 * Features:
 * - Chamfered rounded-cube head with unified color matching the body.
 * - Smooth tapered neck collar mesh that seamlessly seals the junction between
 *   the box bottom and the body collarbone without gaps or jagged artifacts.
 * - Synchronized skeletal animation movement (typing, nodding, waving).
 * - Distinct role-based mascot accessories.
 */
function BoxHeadRig({ clone, color, agentId }) {
  const boxRef = useRef()
  const tempPos = useMemo(() => new THREE.Vector3(), [])
  const tempQuat = useMemo(() => new THREE.Quaternion(), [])
  const parentQuat = useMemo(() => new THREE.Quaternion(), [])
  const offset = useMemo(() => new THREE.Vector3(0, 0.17, 0.01), [])
  const rotatedOffset = useMemo(() => new THREE.Vector3(), [])

  useFrame(() => {
    if (!boxRef.current || !clone) return
    const headBone = clone.getObjectByName('head')
    if (headBone) {
      headBone.getWorldPosition(tempPos)
      headBone.getWorldQuaternion(tempQuat)

      // Apply head bone rotation to the neck-to-head center offset
      rotatedOffset.copy(offset).applyQuaternion(tempQuat)
      tempPos.add(rotatedOffset)

      // Convert world position into parent group's local space
      if (boxRef.current.parent) {
        boxRef.current.parent.worldToLocal(tempPos)

        // Convert world rotation into parent group's local space
        boxRef.current.parent.getWorldQuaternion(parentQuat)
        parentQuat.invert()
        tempQuat.premultiply(parentQuat)
      }

      boxRef.current.position.copy(tempPos)
      boxRef.current.quaternion.copy(tempQuat)
    }
  })

  const headColor = new THREE.Color(color)

  return (
    <group ref={boxRef}>
      {/* Authentic Chamfered Rounded Cube Head (Unified color with body) */}
      <RoundedBox args={[0.45, 0.44, 0.45]} radius={0.085} smoothness={8} castShadow receiveShadow>
        <meshStandardMaterial
          color={headColor}
          roughness={0.32}
          metalness={0.05}
        />
      </RoundedBox>

      {/* Smooth Tapered Neck Collar - seamlessly closes the gap at the neck */}
      <mesh position={[0, -0.21, -0.005]} castShadow receiveShadow>
        <cylinderGeometry args={[0.09, 0.13, 0.08, 32]} />
        <meshStandardMaterial
          color={headColor}
          roughness={0.32}
          metalness={0.05}
        />
      </mesh>

      {/* Front Face Features */}
      <Suspense fallback={null}>
        <BoxHeadFacePlate />
      </Suspense>

      {/* Role-based Thematic Accessory */}
      <AgentThematicAccessory agentId={agentId} />
    </group>
  )
}

/**
 * Head Bone Accessory Rig for default spherical chibi avatars:
 * Dynamically tracks the 'head' bone so default avatars also wear cute mascot accessories!
 */
function HeadBoneAccessoryRig({ clone, agentId }) {
  const groupRef = useRef()
  const tempPos = useMemo(() => new THREE.Vector3(), [])
  const tempQuat = useMemo(() => new THREE.Quaternion(), [])
  const parentQuat = useMemo(() => new THREE.Quaternion(), [])
  const offset = useMemo(() => new THREE.Vector3(0, 0.18, 0.01), [])
  const rotatedOffset = useMemo(() => new THREE.Vector3(), [])

  useFrame(() => {
    if (!groupRef.current || !clone) return
    const headBone = clone.getObjectByName('head')
    if (headBone) {
      headBone.getWorldPosition(tempPos)
      headBone.getWorldQuaternion(tempQuat)

      rotatedOffset.copy(offset).applyQuaternion(tempQuat)
      tempPos.add(rotatedOffset)

      if (groupRef.current.parent) {
        groupRef.current.parent.worldToLocal(tempPos)
        groupRef.current.parent.getWorldQuaternion(parentQuat)
        parentQuat.invert()
        tempQuat.premultiply(parentQuat)
      }

      groupRef.current.position.copy(tempPos)
      groupRef.current.quaternion.copy(tempQuat)
    }
  })

  return (
    <group ref={groupRef}>
      <AgentThematicAccessory agentId={agentId} />
    </group>
  )
}

/**
 * Inner component that loads and renders the 3D model.
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

  // Configure materials, accessories, and head visibility
  useEffect(() => {
    if (!clone) return

    const agentColor = new THREE.Color(agent.color || '#38bdf8')

    if (avatarType === 'custom') {
      const bbox = new THREE.Box3().setFromObject(clone)
      const height = bbox.max.y - bbox.min.y
      if (height > 0) {
        const targetHeight = 1.1
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
      clone.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true

          if (child.name === 'body') {
            const bodyMat = new THREE.MeshStandardMaterial({
              color: agentColor,
              roughness: 0.32,
              metalness: 0.05
            })
            bodyMat.onBeforeCompile = (shader) => {
              shader.vertexShader = shader.vertexShader.replace(
                '#include <begin_vertex>',
                `#include <begin_vertex>
                 if (position.y > 0.58) {
                   transformed = vec3(0.0);
                 }
                `
              )
            }
            child.material = bodyMat
          } else if (child.name === 'eyes' || child.name === 'mouth' || child.name === 'cap' || child.name === 'headphones') {
            child.visible = false
          }
        }
      })
    } else {
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
    }
  }, [clone, avatarType, agent.color])

  // Play skeletal animations
  useEffect(() => {
    if (!actions || Object.keys(actions).length === 0) return

    if (avatarType !== 'custom') {
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
      {avatarType === 'boxhead' ? (
        <BoxHeadRig clone={clone} color={agent.color || '#38bdf8'} agentId={agent.id} />
      ) : (
        <HeadBoneAccessoryRig clone={clone} agentId={agent.id} />
      )}
    </group>
  )
}

/**
 * AgentAvatar Component
 * Features:
 * - Cute Mascots with role-based outfits & 3D accessories
 * - Animated floating speech/thought bubbles showing live autonomous routines
 * - Rich expand-on-hover/select status card
 * - Generous 1.9m hitbox & smooth floor indicators
 */
export default function AgentAvatar({
  agent,
  isSelected,
  onSelect,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  initialAnimation = 'Sit_Work',
  hideTooltip = false
}) {
  const [hovered, setHovered] = useState(false)
  const agentColor = agent.color || '#38bdf8'

  const customModelUrl = agent.custom_model_url || agent.customModelUrl
  const avatarType = agent.avatar_type || (customModelUrl ? 'custom' : 'boxhead')
  const routine = AGENT_ROUTINES[agent.id] || {
    icon: '⚡',
    title: agent.role || 'Active Agent',
    routine: agent.description || 'Autonomous agent routine',
    shortText: '⚡ Active'
  }

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
      {/* ========================================================
          FLOATING SPEECH / THOUGHT BUBBLE & STATUS CARD
          Tycoon game aesthetic: Bouncy pill when idle, full card on hover/select
          ======================================================== */}
      {!hideTooltip && (
        <Html
          position={[0, 1.48, 0]}
          center
          distanceFactor={9.5}
          zIndexRange={[1, 15]}
          style={{ pointerEvents: 'none' }}
        >
          {hovered || isSelected ? (
            /* --- Expanded Rich Status Card (on Hover / Selection) --- */
            <div className="flex flex-col items-start bg-slate-950/95 text-white px-3.5 py-2.5 rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-md whitespace-nowrap select-none animate-in fade-in zoom-in-95 duration-150 text-left min-w-[190px] relative">
              {/* Top row: Agent Name + Status Pill */}
              <div className="flex items-center justify-between gap-3 w-full">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black tracking-tight text-white leading-none">
                    {agent.name}
                  </span>
                  <span className="text-xs">{routine.icon}</span>
                </div>

                {(() => {
                  const rawStatus = (agent.status || (agent.id === 'nara' ? 'working' : 'available')).toLowerCase()
                  const isWorking = rawStatus === 'working' || rawStatus === 'sibuk'
                  const isNotAvailable = rawStatus === 'not_available' || rawStatus === 'offline'
                  const statusLabel = isWorking ? 'Working' : isNotAvailable ? 'Offline' : 'Ready'

                  return (
                    <span
                      className={`inline-flex items-center gap-1 text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-md leading-none shrink-0 ${
                        isWorking
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : isNotAvailable
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          isWorking ? 'bg-amber-400 animate-ping' : isNotAvailable ? 'bg-rose-400' : 'bg-emerald-400'
                        }`}
                      />
                      <span>{statusLabel}</span>
                    </span>
                  )
                })()}
              </div>

              {/* Role Badge */}
              <span className="text-[8px] font-bold tracking-wider uppercase text-slate-400 mt-1 leading-none">
                {agent.role_badge || agent.role || 'AGENT'}
              </span>

              {/* Live Routine Description */}
              <div className="mt-2 pt-2 border-t border-slate-800/80 w-full">
                <div className="flex items-center gap-1 text-[9.5px] font-bold text-amber-300">
                  <span>{routine.title}</span>
                </div>
                <p className="text-[8.5px] text-slate-300 font-medium leading-snug mt-0.5 max-w-[200px] whitespace-normal">
                  {routine.routine}
                </p>
              </div>

              {/* Click prompt */}
              <span className="text-[7.5px] font-semibold text-slate-500 mt-1.5">
                💡 Klik untuk delegasi & workspace
              </span>

              {/* Pointer Triangle Arrow pointing down to head */}
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-6 border-t-slate-950/95" />
            </div>
          ) : (
            /* --- Compact Floating Routine Bubble Pill (Tycoon Game Style) --- */
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white shadow-xl border border-white/25 backdrop-blur-xs select-none transition-transform duration-200 hover:scale-105 relative cursor-pointer">
              <span className="text-xs leading-none">{routine.icon}</span>
              <span className="text-[9px] font-extrabold text-slate-100 tracking-tight leading-none">
                {routine.shortText}
              </span>
              {/* Animated Live Pulse Dot */}
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0 ml-0.5" />
              {/* Pointer Triangle */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-x-3 border-x-transparent border-t-4 border-t-slate-900/90" />
            </div>
          )}
        </Html>
      )}

      {/* --- Generous 3D Click & Hover Hitbox Volume (1.9m Diameter cylinder around agent and desk) --- */}
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

      {/* --- Generous Ground Click Hitbox Disc --- */}
      <mesh
        position={[0, 0.015, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
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
        <circleGeometry args={[0.95, 32]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* --- Visual Floor Interactive Area Disc (Soft Glow + Perimeter Ring + Core) --- */}
      <mesh position={[0, 0.018, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.92, 32]} />
        <meshBasicMaterial
          color={agentColor}
          transparent
          opacity={isSelected ? 0.28 : hovered ? 0.16 : 0.05}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.84, 0.94, 32]} />
        <meshBasicMaterial
          color={agentColor}
          transparent
          opacity={isSelected ? 0.95 : hovered ? 0.7 : 0.22}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[0, 0.022, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.42, 0.52, 32]} />
        <meshBasicMaterial
          color={agentColor}
          transparent
          opacity={isSelected ? 0.9 : hovered ? 0.55 : 0.15}
          depthWrite={false}
        />
      </mesh>

      {/* --- 3D Character Renderer with Error Boundary & Suspense --- */}
      <ModelErrorBoundary
        fallback={
          <CharacterModel
            modelUrl="/models/character.glb"
            avatarType="boxhead"
            agent={agent}
            hovered={hovered}
            isSelected={isSelected}
            initialAnimation={initialAnimation}
          />
        }
      >
        <Suspense fallback={null}>
          <CharacterModel
            key={`${avatarType}_${effectiveModelUrl}_${agent.color}`}
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
useTexture.preload('/textures/boxhead_face_features.png')
