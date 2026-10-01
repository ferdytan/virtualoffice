import React, { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Character configuration matching the user's uploaded reference image (Nendoroid anime chibi style):
 * - Sherloc: Bunny Girl (🐰) with long brown hair, bangs, tall bunny ears, pink hoodie & skirt
 * - Watson: Cat Boy (🐱) with spiky black hair, cat ears, cat tail, white hoodie, coffee mug
 * - Nara: Cyber Telemetry Chibi (📡) with blue hair, radar antenna ears & pulsing beacon
 * - Scout: Fox Girl (🦊) with golden amber hair, fluffy fox ears, big bushy fox tail, tablet
 * - Velocia: Strategy Lead (📈) with crimson hair, coral ears & red ribbon
 * - COO: Bear Supervisor (🐻) with brown hair, round bear ears, gold wire-frame glasses, purple hoodie
 */
const CHARACTER_PRESETS = {
  sherloc: {
    emoji: '🐰',
    animal: 'Bunny',
    skinColor: '#ffe5d9',
    hairColor: '#78350f', // warm chestnut brown
    hairStyle: 'twin_buns',
    earType: 'bunny',
    eyeColor: '#f43f5e', // coral rose
    outfitColor: '#fb7185', // coral pink hoodie
    secondaryColor: '#ffffff', // white skirt
    prop: null,
    hasTail: false
  },
  watson: {
    emoji: '🐱',
    animal: 'Cat',
    skinColor: '#ffe5d9',
    hairColor: '#1e293b', // stylish dark charcoal
    hairStyle: 'spiky_boy',
    earType: 'cat',
    eyeColor: '#0284c7', // cyber blue
    outfitColor: '#f8fafc', // white hoodie
    secondaryColor: '#0284c7', // cyber blue accents
    prop: 'coffee',
    hasTail: 'cat'
  },
  nara: {
    emoji: '📡',
    animal: 'Radar',
    skinColor: '#ffe5d9',
    hairColor: '#0284c7', // vibrant cyan/sky blue
    hairStyle: 'bob_cut',
    earType: 'radar',
    eyeColor: '#38bdf8', // sky blue
    outfitColor: '#38bdf8', // tech blue jacket
    secondaryColor: '#0f172a', // dark navy pants
    prop: null,
    hasTail: false
  },
  scout: {
    emoji: '🦊',
    animal: 'Fox',
    skinColor: '#ffe5d9',
    hairColor: '#d97706', // golden amber / honey
    hairStyle: 'layered_fox',
    earType: 'fox',
    eyeColor: '#f59e0b', // amber gold
    outfitColor: '#f59e0b', // warm amber knit sweater
    secondaryColor: '#ffffff', // white pleated skirt
    prop: 'tablet',
    hasTail: 'fox'
  },
  velocia: {
    emoji: '📈',
    animal: 'Strategy',
    skinColor: '#ffe5d9',
    hairColor: '#991b1b', // rich crimson
    hairStyle: 'side_ponytail',
    earType: 'fox_red',
    eyeColor: '#ef4444', // ruby red
    outfitColor: '#ef4444', // stylish crimson blazer
    secondaryColor: '#ffffff',
    prop: null,
    hasTail: false
  },
  coo: {
    emoji: '🐻',
    animal: 'Bear',
    skinColor: '#ffe5d9',
    hairColor: '#451a03', // dark mocha brown
    hairStyle: 'short_boy',
    earType: 'bear',
    eyeColor: '#78350f', // warm hazel
    outfitColor: '#a855f7', // royal purple hoodie
    secondaryColor: '#334155', // slate trousers
    prop: 'glasses',
    hasTail: false
  }
}

/**
 * 3D Kemonomimi Animal Ears
 */
function KemonomimiEars({ earType = 'bunny', isHovered }) {
  const leftEarRef = useRef()
  const rightEarRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    // Subtle natural ear twitch
    const twitch = isHovered ? Math.sin(t * 12) * 0.12 : Math.sin(t * 3) * 0.03
    if (leftEarRef.current) leftEarRef.current.rotation.z = -0.15 + twitch
    if (rightEarRef.current) rightEarRef.current.rotation.z = 0.15 - twitch
  })

  switch (earType) {
    case 'bunny':
      return (
        <group position={[0, 0.28, -0.02]}>
          {/* Left Bunny Ear */}
          <group ref={leftEarRef} position={[-0.14, 0, 0]} rotation={[-0.1, 0, -0.15]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.045, 0.055, 0.36, 16]} />
              <meshStandardMaterial color="#ffffff" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0, 0.022]}>
              <cylinderGeometry args={[0.026, 0.038, 0.3, 16]} />
              <meshStandardMaterial color="#fbcfe8" roughness={0.4} />
            </mesh>
          </group>
          {/* Right Bunny Ear */}
          <group ref={rightEarRef} position={[0.14, 0, 0]} rotation={[-0.1, 0, 0.15]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.045, 0.055, 0.36, 16]} />
              <meshStandardMaterial color="#ffffff" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0, 0.022]}>
              <cylinderGeometry args={[0.026, 0.038, 0.3, 16]} />
              <meshStandardMaterial color="#fbcfe8" roughness={0.4} />
            </mesh>
          </group>
        </group>
      )

    case 'cat':
      return (
        <group position={[0, 0.25, -0.02]}>
          {/* Left Cat Ear */}
          <group ref={leftEarRef} position={[-0.16, 0, 0]} rotation={[0.08, 0.1, -0.25]}>
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
          <group ref={rightEarRef} position={[0.16, 0, 0]} rotation={[0.08, -0.1, 0.25]}>
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

    case 'fox':
    case 'fox_red':
      const outerColor = earType === 'fox_red' ? '#ef4444' : '#d97706'
      return (
        <group position={[0, 0.25, -0.02]}>
          <group ref={leftEarRef} position={[-0.16, 0, 0]} rotation={[0.1, 0.08, -0.22]}>
            <mesh castShadow>
              <coneGeometry args={[0.09, 0.19, 4]} />
              <meshStandardMaterial color={outerColor} roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.01, 0.025]}>
              <coneGeometry args={[0.055, 0.13, 4]} />
              <meshStandardMaterial color="#fef3c7" roughness={0.4} />
            </mesh>
          </group>
          <group ref={rightEarRef} position={[0.16, 0, 0]} rotation={[0.1, -0.08, 0.22]}>
            <mesh castShadow>
              <coneGeometry args={[0.09, 0.19, 4]} />
              <meshStandardMaterial color={outerColor} roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.01, 0.025]}>
              <coneGeometry args={[0.055, 0.13, 4]} />
              <meshStandardMaterial color="#fef3c7" roughness={0.4} />
            </mesh>
          </group>
        </group>
      )

    case 'bear':
      return (
        <group position={[0, 0.24, -0.02]}>
          <group ref={leftEarRef} position={[-0.18, 0, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.075, 16, 16]} />
              <meshStandardMaterial color="#451a03" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0, 0.025]}>
              <sphereGeometry args={[0.048, 12, 12]} />
              <meshStandardMaterial color="#d6d3d1" roughness={0.5} />
            </mesh>
          </group>
          <group ref={rightEarRef} position={[0.18, 0, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.075, 16, 16]} />
              <meshStandardMaterial color="#451a03" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0, 0.025]}>
              <sphereGeometry args={[0.048, 12, 12]} />
              <meshStandardMaterial color="#d6d3d1" roughness={0.5} />
            </mesh>
          </group>
        </group>
      )

    case 'radar':
      return (
        <group position={[0, 0.25, 0]}>
          <group position={[-0.16, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.065, 0.065, 0.065, 16]} />
              <meshStandardMaterial color="#0284c7" />
            </mesh>
          </group>
          <group position={[0.16, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.065, 0.065, 0.065, 16]} />
              <meshStandardMaterial color="#0284c7" />
            </mesh>
          </group>
          {/* Pulsing Beacon Antenna */}
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.012, 0.016, 0.18, 8]} />
            <meshStandardMaterial color="#38bdf8" />
          </mesh>
          <mesh position={[0, 0.21, 0]}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2.5} />
          </mesh>
        </group>
      )

    default:
      return null
  }
}

/**
 * 3D Sculpted Anime Hair
 */
function AnimeHair({ hairStyle = 'twin_buns', hairColor = '#78350f' }) {
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.35 }),
    [hairColor]
  )

  return (
    <group position={[0, 0.02, 0]}>
      {/* Hair Cap Volume (Back & Top of Head) */}
      <mesh position={[0, 0.04, -0.03]} castShadow>
        <sphereGeometry args={[0.29, 20, 20]} />
        <primitive object={mat} attach="material" />
      </mesh>

      {/* Front Anime Bangs / Fringe */}
      <group position={[0, 0.14, 0.18]} rotation={[0.25, 0, 0]}>
        {[-0.14, -0.07, 0, 0.07, 0.14].map((bx, idx) => (
          <mesh key={idx} position={[bx, -Math.abs(bx) * 0.2, 0]} castShadow>
            <cylinderGeometry args={[0.032, 0.015, 0.15, 8]} />
            <primitive object={mat} attach="material" />
          </mesh>
        ))}
      </group>

      {/* Side Locks Framing Face */}
      <mesh position={[-0.23, -0.08, 0.06]} rotation={[0, 0, 0.18]} castShadow>
        <cylinderGeometry args={[0.045, 0.02, 0.32, 10]} />
        <primitive object={mat} attach="material" />
      </mesh>
      <mesh position={[0.23, -0.08, 0.06]} rotation={[0, 0, -0.18]} castShadow>
        <cylinderGeometry args={[0.045, 0.02, 0.32, 10]} />
        <primitive object={mat} attach="material" />
      </mesh>

      {/* Style-specific strands */}
      {hairStyle === 'twin_buns' && (
        <>
          {/* Twin Low Pigtails */}
          <mesh position={[-0.24, -0.16, -0.12]} rotation={[0.2, 0, 0.35]} castShadow>
            <cylinderGeometry args={[0.05, 0.025, 0.38, 10]} />
            <primitive object={mat} attach="material" />
          </mesh>
          <mesh position={[0.24, -0.16, -0.12]} rotation={[0.2, 0, -0.35]} castShadow>
            <cylinderGeometry args={[0.05, 0.025, 0.38, 10]} />
            <primitive object={mat} attach="material" />
          </mesh>
        </>
      )}

      {hairStyle === 'layered_fox' && (
        <>
          {/* Long Flowing Back Hair */}
          <mesh position={[0, -0.18, -0.16]} rotation={[-0.15, 0, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.24, 0.42, 12]} />
            <primitive object={mat} attach="material" />
          </mesh>
        </>
      )}
    </group>
  )
}

/**
 * Animated Animal Tail
 */
function AnimatedTail({ tailType = 'cat', isHovered }) {
  const tailRef = useRef()

  useFrame(({ clock }) => {
    if (!tailRef.current) return
    const t = clock.getElapsedTime()
    const speed = isHovered ? 5.5 : 2.5
    tailRef.current.rotation.y = Math.sin(t * speed) * 0.28
    tailRef.current.rotation.z = Math.cos(t * speed * 0.8) * 0.15
  })

  if (tailType === 'cat') {
    // Sleek Cat Tail with white tip
    return (
      <group ref={tailRef} position={[0, 0.38, -0.18]} rotation={[0.65, 0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.025, 0.035, 0.42, 10]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.22, 0]} castShadow>
          <sphereGeometry args={[0.035, 10, 10]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </mesh>
      </group>
    )
  }

  if (tailType === 'fox') {
    // Big Fluffy Fox Tail with White Tip
    return (
      <group ref={tailRef} position={[0, 0.42, -0.22]} rotation={[0.8, 0, 0]}>
        <mesh castShadow>
          <coneGeometry args={[0.13, 0.46, 12]} />
          <meshStandardMaterial color="#d97706" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.24, 0]} castShadow>
          <coneGeometry args={[0.085, 0.18, 12]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
      </group>
    )
  }

  return null
}

/**
 * Authentic 3D Anime Chibi Avatar (Nendoroid Proportions)
 */
function ChibiAnimeCharacter({
  preset,
  isHovered,
  isSelected,
  agent
}) {
  const rootRef = useRef()
  const headRef = useRef()
  const rightArmRef = useRef()

  // Cute procedural breathing & idle sway
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    if (rootRef.current) {
      // Gentle breathing bob
      rootRef.current.position.y = Math.sin(t * 2.5) * 0.015
    }

    if (headRef.current) {
      // Subtle head tilt
      headRef.current.rotation.z = Math.sin(t * 1.5) * 0.03
      headRef.current.rotation.x = Math.sin(t * 2) * 0.02
    }

    if (rightArmRef.current) {
      // Happy wave when hovered or selected!
      if (isHovered || isSelected) {
        rightArmRef.current.rotation.z = -1.2 + Math.sin(t * 9) * 0.35
        rightArmRef.current.rotation.x = 0.5
      } else {
        rightArmRef.current.rotation.z = -0.25
        rightArmRef.current.rotation.x = 0
      }
    }
  })

  return (
    <group ref={rootRef} position={[0, 0, 0]}>
      {/* ========================================================
          1. CHIBI HEAD & ANIME FACE (Large Round Head)
          ======================================================== */}
      <group ref={headRef} position={[0, 0.88, 0]}>
        {/* Soft Peach Skin Anime Head Sphere */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.27, 24, 24]} />
          <meshStandardMaterial color={preset.skinColor} roughness={0.3} />
        </mesh>

        {/* 3D Sculpted Anime Hair */}
        <AnimeHair hairStyle={preset.hairStyle} hairColor={preset.hairColor} />

        {/* Kemonomimi Ears on Top of Head */}
        <KemonomimiEars earType={preset.earType} isHovered={isHovered || isSelected} />

        {/* Sparkling Big Anime Eyes */}
        {/* Left Eye */}
        <group position={[-0.09, 0.02, 0.245]} rotation={[-0.05, -0.15, 0]}>
          <mesh>
            <circleGeometry args={[0.046, 20]} />
            <meshBasicMaterial color="#1e293b" />
          </mesh>
          {/* Eye Iris with Agent Color */}
          <mesh position={[0, -0.008, 0.002]}>
            <circleGeometry args={[0.038, 20]} />
            <meshBasicMaterial color={preset.eyeColor} />
          </mesh>
          {/* Specular Highlight Sparkle */}
          <mesh position={[-0.014, 0.014, 0.004]}>
            <circleGeometry args={[0.014, 12]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* Right Eye */}
        <group position={[0.09, 0.02, 0.245]} rotation={[-0.05, 0.15, 0]}>
          <mesh>
            <circleGeometry args={[0.046, 20]} />
            <meshBasicMaterial color="#1e293b" />
          </mesh>
          {/* Eye Iris with Agent Color */}
          <mesh position={[0, -0.008, 0.002]}>
            <circleGeometry args={[0.038, 20]} />
            <meshBasicMaterial color={preset.eyeColor} />
          </mesh>
          {/* Specular Highlight Sparkle */}
          <mesh position={[-0.014, 0.014, 0.004]}>
            <circleGeometry args={[0.014, 12]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* Rosy Blushing Anime Cheeks */}
        <mesh position={[-0.14, -0.06, 0.22]}>
          <circleGeometry args={[0.035, 16]} />
          <meshBasicMaterial color="#fda4af" transparent opacity={0.65} />
        </mesh>
        <mesh position={[0.14, -0.06, 0.22]}>
          <circleGeometry args={[0.035, 16]} />
          <meshBasicMaterial color="#fda4af" transparent opacity={0.65} />
        </mesh>

        {/* Cute Smiling Anime Mouth */}
        <mesh position={[0, -0.08, 0.255]}>
          <circleGeometry args={[0.024, 16, 0, Math.PI]} />
          <meshBasicMaterial color="#f43f5e" />
        </mesh>

        {/* COO Gold Wire-Frame Glasses */}
        {preset.prop === 'glasses' && (
          <group position={[0, 0.02, 0.26]}>
            <mesh position={[-0.09, 0, 0]}>
              <torusGeometry args={[0.055, 0.006, 8, 24]} />
              <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0.09, 0, 0]}>
              <torusGeometry args={[0.055, 0.006, 8, 24]} />
              <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.015, 0]}>
              <boxGeometry args={[0.05, 0.006, 0.006]} />
              <meshStandardMaterial color="#eab308" metalness={0.9} />
            </mesh>
          </group>
        )}
      </group>

      {/* ========================================================
          2. CHIBI BODY & OUTFIT
          ======================================================== */}
      {/* Torso / Cute Hoodie */}
      <group position={[0, 0.46, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.16, 0.2, 0.36, 16]} />
          <meshStandardMaterial color={preset.outfitColor} roughness={0.35} />
        </mesh>

        {/* Hoodie Collar / Drawstrings */}
        <mesh position={[0, 0.16, 0.08]} castShadow>
          <torusGeometry args={[0.14, 0.035, 8, 20]} />
          <meshStandardMaterial color={preset.secondaryColor} roughness={0.4} />
        </mesh>

        {/* Skirt or Lower Hem */}
        <mesh position={[0, -0.16, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.24, 0.12, 16]} />
          <meshStandardMaterial color={preset.secondaryColor} roughness={0.4} />
        </mesh>
      </group>

      {/* ========================================================
          3. ARMS & LEGS
          ======================================================== */}
      {/* Left Arm (Resting or holding prop) */}
      <group position={[-0.22, 0.52, 0]} rotation={[0.2, 0, 0.25]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.045, 0.04, 0.28, 10]} />
          <meshStandardMaterial color={preset.outfitColor} roughness={0.35} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.15, 0]} castShadow>
          <sphereGeometry args={[0.048, 12, 12]} />
          <meshStandardMaterial color={preset.skinColor} roughness={0.3} />
        </mesh>

        {/* Handheld Props */}
        {preset.prop === 'coffee' && (
          <group position={[0, -0.16, 0.12]} rotation={[0.2, -0.3, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.045, 0.04, 0.09, 14]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.04, 0]}>
              <circleGeometry args={[0.038, 14]} />
              <meshStandardMaterial color="#3e2723" roughness={0.1} />
            </mesh>
          </group>
        )}

        {preset.prop === 'tablet' && (
          <group position={[0, -0.15, 0.12]} rotation={[0.6, -0.2, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.16, 0.22, 0.01]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} />
            </mesh>
            <mesh position={[0, 0, 0.006]}>
              <planeGeometry args={[0.14, 0.2]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
          </group>
        )}
      </group>

      {/* Right Arm (Waving on hover/select) */}
      <group ref={rightArmRef} position={[0.22, 0.52, 0]}>
        <mesh position={[0, -0.12, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.04, 0.28, 10]} />
          <meshStandardMaterial color={preset.outfitColor} roughness={0.35} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.26, 0]} castShadow>
          <sphereGeometry args={[0.048, 12, 12]} />
          <meshStandardMaterial color={preset.skinColor} roughness={0.3} />
        </mesh>
      </group>

      {/* Legs & Cute Sneakers */}
      {/* Left Leg */}
      <group position={[-0.09, 0.16, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.048, 0.045, 0.24, 10]} />
          <meshStandardMaterial color={preset.skinColor} roughness={0.3} />
        </mesh>
        {/* Sneaker Shoe */}
        <mesh position={[0, -0.14, 0.03]} castShadow>
          <boxGeometry args={[0.09, 0.07, 0.15]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group position={[0.09, 0.16, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.048, 0.045, 0.24, 10]} />
          <meshStandardMaterial color={preset.skinColor} roughness={0.3} />
        </mesh>
        {/* Sneaker Shoe */}
        <mesh position={[0, -0.14, 0.03]} castShadow>
          <boxGeometry args={[0.09, 0.07, 0.15]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
      </group>

      {/* Animated Tail if present */}
      {preset.hasTail && (
        <AnimatedTail tailType={preset.hasTail} isHovered={isHovered || isSelected} />
      )}
    </group>
  )
}

/**
 * Main AgentAvatar Component:
 * - Authentic 3D Chibi Anime Character (matching reference image)
 * - Strict requirement: Floating label only shows the character's NAME (no role/task)
 * - Generous 1.9m hitbox for effortless clicking
 */
export default function AgentAvatar({
  agent,
  isSelected,
  onSelect,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  hideTooltip = false
}) {
  const [hovered, setHovered] = useState(false)
  const preset = CHARACTER_PRESETS[agent.id] || CHARACTER_PRESETS.sherloc

  return (
    <group
      position={position}
      rotation={rotation}
      name={`agent-avatar-${agent.id}`}
    >
      {/* ========================================================
          STRICT USER REQUIREMENT:
          Floating Label ONLY shows the character's NAME with mascot emoji!
          No role, no task description!
          ======================================================== */}
      {!hideTooltip && (
        <Html
          position={[0, 1.45, 0]}
          center
          distanceFactor={10}
          zIndexRange={[1, 15]}
          style={{ pointerEvents: 'none' }}
        >
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/95 hover:bg-slate-900 text-white shadow-xl border border-white/40 backdrop-blur-sm select-none transition-transform duration-200 hover:scale-105 relative cursor-pointer whitespace-nowrap">
            <span className="text-sm leading-none">{preset.emoji}</span>
            <span className="text-[11px] font-black text-white tracking-tight leading-none">
              {agent.name}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0 ml-0.5" />
            {/* Little pointer triangle below badge */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-x-3 border-x-transparent border-t-4 border-t-slate-900/95" />
          </div>
        </Html>
      )}

      {/* ========================================================
          GENEROUS 3D CLICK & HOVER HITBOX VOLUME (1.9m Diameter)
          Makes clicking effortless without needing precision on body
          ======================================================== */}
      <mesh
        position={[0, 0.75, 0]}
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
        <cylinderGeometry args={[0.95, 0.95, 1.7, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Visual Floor Interactive Selection Ring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.42, 0.52, 32]} />
        <meshBasicMaterial
          color={preset.outfitColor}
          transparent
          opacity={isSelected ? 0.95 : hovered ? 0.65 : 0.3}
          depthWrite={false}
        />
      </mesh>

      {/* Authentic 3D Chibi Character Model */}
      <ChibiAnimeCharacter
        preset={preset}
        isHovered={hovered}
        isSelected={isSelected}
        agent={agent}
      />
    </group>
  )
}
