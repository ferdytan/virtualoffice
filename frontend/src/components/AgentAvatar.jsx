import React, { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Character Presets matching the Clay 3D Toy / Chibi aesthetic from the reference image:
 *
 * MALE CHARACTERS (Gender: Pria):
 * - Sherloc (🐰): Bunny Boy. Stylish caramel clay hair, tall bunny ears, coral hoodie, dark trousers, white sneakers. Sitting in meeting chair.
 * - Watson (🐱): Cat Boy. Wavy spiky deep navy/blue clay hair (like Miro in reference image), black cat ears, cat tail, cozy white hoodie, dark jeans. Sitting at workstation typing.
 * - COO (🐻): Bear Male Supervisor. Layered mocha clay hair, round bear ears, gold wire-frame glasses, royal purple sweater, charcoal trousers. Sitting relaxed on lounge sofa with executive tablet.
 *
 * FEMALE CHARACTERS (Gender: Wanita):
 * - Nara (📡): Cyber Specialist. Sky-blue bob clay hair, radar antenna ears with pulsing beacon, tech jacket. Sitting at workstation typing.
 * - Scout (🦊): Creative Fox. Golden-amber clay hair with high top-knot bun (like Ara in reference image!), fluffy fox ears, big bushy fox tail, mustard knit sweater. Sitting on lounge sofa with notes tablet.
 * - Velocia (📈): Strategy Lead. Flowing crimson clay hair past shoulders (like the presenter in reference image!), coral ears, crimson blazer. Standing at whiteboard pointing at growth curve.
 */
const CHARACTER_PRESETS = {
  sherloc: {
    emoji: '🐰',
    animal: 'Bunny Boy',
    gender: 'male',
    agentNum: 'AGENT 1',
    skinColor: '#ffd7ba',
    hairColor: '#854d0e',
    hairStyle: 'boy_swept',
    earType: 'bunny',
    eyeColor: '#f43f5e',
    outfitColor: '#f43f5e', // coral rose hoodie
    secondaryColor: '#ffffff',
    bottomColor: '#334155', // dark charcoal trousers
    prop: null,
    hasTail: false,
    defaultPose: 'sitting_meeting',
    sampleTask: 'WhatsApp Inbound: Validasi nomor telepon pelanggan baru #CUST-9821 siap didelegasikan.'
  },
  watson: {
    emoji: '🐱',
    animal: 'Cat Boy',
    gender: 'male',
    agentNum: 'AGENT 2',
    skinColor: '#ffd7ba',
    hairColor: '#1d4ed8', // rich navy/blue sculpted clay hair (like Miro)
    hairStyle: 'spiky_clay',
    earType: 'cat',
    eyeColor: '#0284c7',
    outfitColor: '#f8fafc', // cozy off-white hoodie
    secondaryColor: '#0284c7',
    bottomColor: '#1e293b', // dark denim jeans
    prop: 'typing',
    hasTail: 'cat',
    defaultPose: 'sitting_typing',
    sampleTask: 'September channel plan is drafted. The launch copy needs your approval before it goes live.'
  },
  nara: {
    emoji: '📡',
    animal: 'Radar Specialist',
    gender: 'female',
    agentNum: 'AGENT 3',
    skinColor: '#ffd7ba',
    hairColor: '#0284c7', // vibrant cyan/sky blue
    hairStyle: 'bob_cut',
    earType: 'radar',
    eyeColor: '#38bdf8',
    outfitColor: '#38bdf8', // tech blue jacket
    secondaryColor: '#ffffff',
    bottomColor: '#0f172a',
    prop: 'typing',
    hasTail: false,
    defaultPose: 'sitting_typing',
    sampleTask: 'Telemetri Armada: 48 unit GPS offline terdeteksi. Broadcast pengingat anti-banned dijadwalkan.'
  },
  scout: {
    emoji: '🦊',
    animal: 'Fox Creator',
    gender: 'female',
    agentNum: 'AGENT 4',
    skinColor: '#ffd7ba',
    hairColor: '#d97706', // golden amber / honey
    hairStyle: 'top_bun', // high top-knot bun like Ara in reference image
    earType: 'fox',
    eyeColor: '#f59e0b',
    outfitColor: '#f59e0b', // warm mustard/amber knit sweater
    secondaryColor: '#ffffff',
    bottomColor: '#ffffff',
    prop: 'tablet',
    hasTail: 'fox',
    defaultPose: 'sitting_lounge',
    sampleTask: 'Draf Artikel: Mengapa Kunci Ganda Tak Cukup & Solusi Sensor Orin siap untuk review publikasi.'
  },
  velocia: {
    emoji: '📈',
    animal: 'Strategy Lead',
    gender: 'female',
    agentNum: 'AGENT 5',
    skinColor: '#ffd7ba',
    hairColor: '#dc2626', // rich flowing crimson/coral hair
    hairStyle: 'long_wavy',
    earType: 'fox_red',
    eyeColor: '#ef4444',
    outfitColor: '#ef4444', // stylish crimson blazer
    secondaryColor: '#ffffff',
    bottomColor: '#ffffff',
    prop: null,
    hasTail: false,
    defaultPose: 'standing_pointing',
    sampleTask: 'Strategi OKR: Analisis tren permintaan pasar Fuel Sensor naik +142.8% siap dipresentasikan.'
  },
  coo: {
    emoji: '🐻',
    animal: 'Bear Supervisor',
    gender: 'male',
    agentNum: 'LEAD',
    skinColor: '#ffd7ba',
    hairColor: '#451a03', // dark mocha brown clay hair
    hairStyle: 'executive_boy',
    earType: 'bear',
    eyeColor: '#78350f',
    outfitColor: '#9333ea', // royal purple executive sweater
    secondaryColor: '#ffffff',
    bottomColor: '#1e293b', // charcoal executive trousers
    prop: 'glasses',
    hasTail: false,
    defaultPose: 'sitting_lounge',
    sampleTask: 'Delegasi Eksekutif: 6 task cluster tersinkronisasi dengan Telegram Gateway Direktur.'
  }
}

/**
 * 3D Kemonomimi Animal Ears (Smooth Clay Finish)
 */
function KemonomimiEars({ earType = 'bunny', isHovered }) {
  const leftEarRef = useRef()
  const rightEarRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const twitch = isHovered ? Math.sin(t * 10) * 0.1 : Math.sin(t * 3) * 0.025
    if (leftEarRef.current) leftEarRef.current.rotation.z = -0.14 + twitch
    if (rightEarRef.current) rightEarRef.current.rotation.z = 0.14 - twitch
  })

  switch (earType) {
    case 'bunny':
      return (
        <group position={[0, 0.28, -0.02]}>
          <group ref={leftEarRef} position={[-0.14, 0, 0]} rotation={[-0.08, 0, -0.14]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.045, 0.055, 0.35, 16]} />
              <meshStandardMaterial color="#ffffff" roughness={0.65} metalness={0.04} />
            </mesh>
            <mesh position={[0, 0, 0.022]}>
              <cylinderGeometry args={[0.026, 0.038, 0.28, 16]} />
              <meshStandardMaterial color="#fbcfe8" roughness={0.7} metalness={0.02} />
            </mesh>
          </group>
          <group ref={rightEarRef} position={[0.14, 0, 0]} rotation={[-0.08, 0, 0.14]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.045, 0.055, 0.35, 16]} />
              <meshStandardMaterial color="#ffffff" roughness={0.65} metalness={0.04} />
            </mesh>
            <mesh position={[0, 0, 0.022]}>
              <cylinderGeometry args={[0.026, 0.038, 0.28, 16]} />
              <meshStandardMaterial color="#fbcfe8" roughness={0.7} metalness={0.02} />
            </mesh>
          </group>
        </group>
      )

    case 'cat':
      return (
        <group position={[0, 0.26, -0.02]}>
          <group ref={leftEarRef} position={[-0.16, 0, 0]} rotation={[0.08, 0.08, -0.24]}>
            <mesh castShadow>
              <coneGeometry args={[0.085, 0.17, 4]} />
              <meshStandardMaterial color="#1e293b" roughness={0.65} metalness={0.04} />
            </mesh>
            <mesh position={[0, -0.01, 0.02]}>
              <coneGeometry args={[0.055, 0.12, 4]} />
              <meshStandardMaterial color="#f472b6" roughness={0.65} metalness={0.02} />
            </mesh>
          </group>
          <group ref={rightEarRef} position={[0.16, 0, 0]} rotation={[0.08, -0.08, 0.24]}>
            <mesh castShadow>
              <coneGeometry args={[0.085, 0.17, 4]} />
              <meshStandardMaterial color="#1e293b" roughness={0.65} metalness={0.04} />
            </mesh>
            <mesh position={[0, -0.01, 0.02]}>
              <coneGeometry args={[0.055, 0.12, 4]} />
              <meshStandardMaterial color="#f472b6" roughness={0.65} metalness={0.02} />
            </mesh>
          </group>
        </group>
      )

    case 'fox':
    case 'fox_red':
      const outerColor = earType === 'fox_red' ? '#ef4444' : '#d97706'
      return (
        <group position={[0, 0.26, -0.02]}>
          <group ref={leftEarRef} position={[-0.16, 0, 0]} rotation={[0.08, 0.06, -0.22]}>
            <mesh castShadow>
              <coneGeometry args={[0.09, 0.18, 4]} />
              <meshStandardMaterial color={outerColor} roughness={0.65} metalness={0.04} />
            </mesh>
            <mesh position={[0, -0.01, 0.022]}>
              <coneGeometry args={[0.055, 0.12, 4]} />
              <meshStandardMaterial color="#fef3c7" roughness={0.7} metalness={0.02} />
            </mesh>
          </group>
          <group ref={rightEarRef} position={[0.16, 0, 0]} rotation={[0.08, -0.06, 0.22]}>
            <mesh castShadow>
              <coneGeometry args={[0.09, 0.18, 4]} />
              <meshStandardMaterial color={outerColor} roughness={0.65} metalness={0.04} />
            </mesh>
            <mesh position={[0, -0.01, 0.022]}>
              <coneGeometry args={[0.055, 0.12, 4]} />
              <meshStandardMaterial color="#fef3c7" roughness={0.7} metalness={0.02} />
            </mesh>
          </group>
        </group>
      )

    case 'bear':
      return (
        <group position={[0, 0.25, -0.02]}>
          <group ref={leftEarRef} position={[-0.18, 0, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.075, 16, 16]} />
              <meshStandardMaterial color="#451a03" roughness={0.65} metalness={0.04} />
            </mesh>
            <mesh position={[0, 0, 0.022]}>
              <sphereGeometry args={[0.048, 12, 12]} />
              <meshStandardMaterial color="#d6d3d1" roughness={0.7} metalness={0.02} />
            </mesh>
          </group>
          <group ref={rightEarRef} position={[0.18, 0, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.075, 16, 16]} />
              <meshStandardMaterial color="#451a03" roughness={0.65} metalness={0.04} />
            </mesh>
            <mesh position={[0, 0, 0.022]}>
              <sphereGeometry args={[0.048, 12, 12]} />
              <meshStandardMaterial color="#d6d3d1" roughness={0.7} metalness={0.02} />
            </mesh>
          </group>
        </group>
      )

    case 'radar':
      return (
        <group position={[0, 0.26, 0]}>
          <group position={[-0.16, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.06, 0.06, 0.06, 16]} />
              <meshStandardMaterial color="#0284c7" roughness={0.5} />
            </mesh>
          </group>
          <group position={[0.16, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.06, 0.06, 0.06, 16]} />
              <meshStandardMaterial color="#0284c7" roughness={0.5} />
            </mesh>
          </group>
          <mesh position={[0, 0.09, 0]}>
            <cylinderGeometry args={[0.012, 0.015, 0.18, 8]} />
            <meshStandardMaterial color="#38bdf8" />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2.2} />
          </mesh>
        </group>
      )

    default:
      return null
  }
}

/**
 * Sculpted Voluminous Clay Hair (matching Clay 3D Toy style in reference image)
 */
function SculptedClayHair({ hairStyle = 'boy_swept', hairColor = '#854d0e' }) {
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.65, metalness: 0.04 }),
    [hairColor]
  )

  return (
    <group position={[0, 0.03, 0]}>
      {/* Main Clay Cap */}
      <mesh position={[0, 0.04, -0.03]} castShadow>
        <sphereGeometry args={[0.29, 20, 20]} />
        <primitive object={mat} attach="material" />
      </mesh>

      {/* Swept Boyish Hair (Sherloc) */}
      {hairStyle === 'boy_swept' && (
        <group position={[0, 0.16, 0.16]} rotation={[0.2, -0.15, 0]}>
          <mesh position={[-0.1, 0, 0]} castShadow>
            <sphereGeometry args={[0.09, 12, 12]} />
            <primitive object={mat} attach="material" />
          </mesh>
          <mesh position={[0.02, 0.02, 0.03]} castShadow>
            <sphereGeometry args={[0.085, 12, 12]} />
            <primitive object={mat} attach="material" />
          </mesh>
          <mesh position={[0.13, -0.02, 0]} castShadow>
            <sphereGeometry args={[0.075, 12, 12]} />
            <primitive object={mat} attach="material" />
          </mesh>
        </group>
      )}

      {/* Wavy Spiky Clay (Watson - Miro in reference) */}
      {hairStyle === 'spiky_clay' && (
        <group position={[0, 0.15, 0]}>
          {[
            [-0.12, 0.08, 0.1, 0.1],
            [0.02, 0.12, 0.08, 0.11],
            [0.14, 0.06, 0.09, 0.095],
            [-0.16, 0.02, -0.05, 0.1],
            [0.16, 0.02, -0.05, 0.1],
            [0, 0.14, -0.1, 0.12]
          ].map(([px, py, pz, r], idx) => (
            <mesh key={idx} position={[px, py, pz]} castShadow>
              <sphereGeometry args={[r, 12, 12]} />
              <primitive object={mat} attach="material" />
            </mesh>
          ))}
        </group>
      )}

      {/* High Top-Knot Bun (Scout - Ara in reference) */}
      {hairStyle === 'top_bun' && (
        <>
          <group position={[0, 0.32, -0.05]}>
            <mesh castShadow>
              <sphereGeometry args={[0.14, 16, 16]} />
              <primitive object={mat} attach="material" />
            </mesh>
            <mesh position={[0, -0.08, 0]}>
              <torusGeometry args={[0.09, 0.02, 8, 16]} />
              <meshStandardMaterial color="#f43f5e" roughness={0.5} />
            </mesh>
          </group>
          <group position={[0, 0.15, 0.18]} rotation={[0.2, 0, 0]}>
            <mesh position={[-0.08, 0, 0]} castShadow>
              <sphereGeometry args={[0.07, 10, 10]} />
              <primitive object={mat} attach="material" />
            </mesh>
            <mesh position={[0.08, 0, 0]} castShadow>
              <sphereGeometry args={[0.07, 10, 10]} />
              <primitive object={mat} attach="material" />
            </mesh>
          </group>
        </>
      )}

      {/* Long Flowing Wavy Hair (Velocia) */}
      {hairStyle === 'long_wavy' && (
        <>
          <group position={[0, 0.15, 0.18]} rotation={[0.2, 0, 0]}>
            <mesh position={[-0.07, 0, 0]} castShadow>
              <sphereGeometry args={[0.075, 10, 10]} />
              <primitive object={mat} attach="material" />
            </mesh>
            <mesh position={[0.07, 0, 0]} castShadow>
              <sphereGeometry args={[0.075, 10, 10]} />
              <primitive object={mat} attach="material" />
            </mesh>
          </group>
          <mesh position={[-0.22, -0.2, -0.05]} rotation={[0.1, 0, 0.15]} castShadow>
            <cylinderGeometry args={[0.07, 0.04, 0.42, 10]} />
            <primitive object={mat} attach="material" />
          </mesh>
          <mesh position={[0.22, -0.2, -0.05]} rotation={[0.1, 0, -0.15]} castShadow>
            <cylinderGeometry args={[0.07, 0.04, 0.42, 10]} />
            <primitive object={mat} attach="material" />
          </mesh>
        </>
      )}

      {/* Executive Boy Hair (COO) */}
      {hairStyle === 'executive_boy' && (
        <group position={[0, 0.15, 0]}>
          <mesh position={[0, 0.05, 0.08]} castShadow>
            <sphereGeometry args={[0.12, 12, 12]} />
            <primitive object={mat} attach="material" />
          </mesh>
        </group>
      )}

      {/* Cyber Bob Cut (Nara) */}
      {hairStyle === 'bob_cut' && (
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0.14, 0.16]} rotation={[0.25, 0, 0]} castShadow>
            <boxGeometry args={[0.28, 0.08, 0.06]} />
            <primitive object={mat} attach="material" />
          </mesh>
          <mesh position={[-0.22, -0.08, 0.02]} castShadow>
            <cylinderGeometry args={[0.05, 0.035, 0.26, 8]} />
            <primitive object={mat} attach="material" />
          </mesh>
          <mesh position={[0.22, -0.08, 0.02]} castShadow>
            <cylinderGeometry args={[0.05, 0.035, 0.26, 8]} />
            <primitive object={mat} attach="material" />
          </mesh>
        </group>
      )}
    </group>
  )
}

/**
 * Animated Tail for Watson and Scout
 */
function AnimatedTail({ tailType = 'cat', isHovered }) {
  const tailRef = useRef()

  useFrame(({ clock }) => {
    if (!tailRef.current) return
    const t = clock.getElapsedTime()
    const speed = isHovered ? 5.5 : 2.5
    tailRef.current.rotation.y = Math.sin(t * speed) * 0.26
    tailRef.current.rotation.z = Math.cos(t * speed * 0.8) * 0.14
  })

  if (tailType === 'cat') {
    return (
      <group ref={tailRef} position={[0, 0.38, -0.18]} rotation={[0.65, 0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.025, 0.035, 0.42, 10]} />
          <meshStandardMaterial color="#1e293b" roughness={0.65} metalness={0.04} />
        </mesh>
        <mesh position={[0, 0.22, 0]} castShadow>
          <sphereGeometry args={[0.035, 10, 10]} />
          <meshStandardMaterial color="#ffffff" roughness={0.65} metalness={0.04} />
        </mesh>
      </group>
    )
  }

  if (tailType === 'fox') {
    return (
      <group ref={tailRef} position={[0, 0.42, -0.22]} rotation={[0.8, 0, 0]}>
        <mesh castShadow>
          <coneGeometry args={[0.13, 0.46, 12]} />
          <meshStandardMaterial color="#d97706" roughness={0.7} metalness={0.04} />
        </mesh>
        <mesh position={[0, 0.24, 0]} castShadow>
          <coneGeometry args={[0.085, 0.18, 12]} />
          <meshStandardMaterial color="#ffffff" roughness={0.7} metalness={0.04} />
        </mesh>
      </group>
    )
  }

  return null
}

/**
 * Natural Posed Clay Chibi Character:
 * Poses:
 * - 'sitting_typing': sitting in office chair, hands over desk typing (Watson, Nara)
 * - 'standing_pointing': standing, right hand pointing at board (Velocia)
 * - 'sitting_meeting': sitting in round table chair, attentive (Sherloc)
 * - 'sitting_lounge': relaxed lounge sitting holding tablet (COO, Scout)
 */
function NaturalPosedCharacter({
  preset,
  isHovered,
  isSelected,
  pose = 'sitting_typing'
}) {
  const rootRef = useRef()
  const headRef = useRef()
  const rightArmRef = useRef()
  const leftArmRef = useRef()

  const isSitting = pose.startsWith('sitting')
  const yOffset = isSitting ? -0.18 : 0

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    if (rootRef.current) {
      rootRef.current.position.y = yOffset + Math.sin(t * 2.5) * 0.012
    }

    if (headRef.current) {
      headRef.current.rotation.z = Math.sin(t * 1.5) * 0.02
      headRef.current.rotation.x = Math.sin(t * 2) * 0.015
    }

    // Arm interactions
    if (pose === 'sitting_typing') {
      // Subtle typing finger bounce
      if (rightArmRef.current) rightArmRef.current.rotation.x = 0.85 + Math.sin(t * 12) * 0.04
      if (leftArmRef.current) leftArmRef.current.rotation.x = 0.85 + Math.cos(t * 12) * 0.04
    } else if (pose === 'standing_pointing') {
      // Right arm raised pointing at presentation board
      if (rightArmRef.current) rightArmRef.current.rotation.z = -1.35 + Math.sin(t * 2) * 0.06
      if (rightArmRef.current) rightArmRef.current.rotation.x = 0.4
    } else if (isHovered || isSelected) {
      // Wave happily on hover/select
      if (rightArmRef.current) {
        rightArmRef.current.rotation.z = -1.2 + Math.sin(t * 9) * 0.32
        rightArmRef.current.rotation.x = 0.5
      }
    }
  })

  return (
    <group ref={rootRef} position={[0, yOffset, 0]}>
      {/* 1. HEAD & FACE */}
      <group ref={headRef} position={[0, 0.88, 0]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.27, 24, 24]} />
          <meshStandardMaterial color={preset.skinColor} roughness={0.65} metalness={0.04} />
        </mesh>

        <SculptedClayHair hairStyle={preset.hairStyle} hairColor={preset.hairColor} />
        <KemonomimiEars earType={preset.earType} isHovered={isHovered || isSelected} />

        {/* Eyes */}
        <group position={[-0.09, 0.02, 0.245]} rotation={[-0.05, -0.15, 0]}>
          <mesh>
            <circleGeometry args={[0.046, 20]} />
            <meshBasicMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0, -0.008, 0.002]}>
            <circleGeometry args={[0.038, 20]} />
            <meshBasicMaterial color={preset.eyeColor} />
          </mesh>
          <mesh position={[-0.014, 0.014, 0.004]}>
            <circleGeometry args={[0.014, 12]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        <group position={[0.09, 0.02, 0.245]} rotation={[-0.05, 0.15, 0]}>
          <mesh>
            <circleGeometry args={[0.046, 20]} />
            <meshBasicMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0, -0.008, 0.002]}>
            <circleGeometry args={[0.038, 20]} />
            <meshBasicMaterial color={preset.eyeColor} />
          </mesh>
          <mesh position={[-0.014, 0.014, 0.004]}>
            <circleGeometry args={[0.014, 12]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* Blushing Cheeks */}
        <mesh position={[-0.14, -0.06, 0.22]}>
          <circleGeometry args={[0.035, 16]} />
          <meshBasicMaterial color="#fda4af" transparent opacity={0.65} />
        </mesh>
        <mesh position={[0.14, -0.06, 0.22]}>
          <circleGeometry args={[0.035, 16]} />
          <meshBasicMaterial color="#fda4af" transparent opacity={0.65} />
        </mesh>

        {/* Mouth */}
        <mesh position={[0, -0.08, 0.255]}>
          <circleGeometry args={[0.024, 16, 0, Math.PI]} />
          <meshBasicMaterial color="#f43f5e" />
        </mesh>

        {/* Gold Glasses for COO */}
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

      {/* 2. TORSO / HOODIE */}
      <group position={[0, 0.46, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.16, 0.2, 0.36, 16]} />
          <meshStandardMaterial color={preset.outfitColor} roughness={0.65} metalness={0.04} />
        </mesh>

        <mesh position={[0, 0.16, 0.08]} castShadow>
          <torusGeometry args={[0.14, 0.038, 8, 20]} />
          <meshStandardMaterial color={preset.secondaryColor} roughness={0.6} />
        </mesh>

        {preset.gender === 'male' ? (
          <mesh position={[0, -0.17, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.2, 0.1, 16]} />
            <meshStandardMaterial color={preset.bottomColor} roughness={0.65} metalness={0.04} />
          </mesh>
        ) : (
          <mesh position={[0, -0.16, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.25, 0.12, 16]} />
            <meshStandardMaterial color={preset.bottomColor} roughness={0.65} />
          </mesh>
        )}
      </group>

      {/* 3. ARMS & HANDS */}
      {/* Left Arm */}
      <group
        ref={leftArmRef}
        position={[-0.22, 0.52, 0]}
        rotation={
          pose === 'sitting_typing'
            ? [0.85, 0.3, 0.1]
            : pose === 'sitting_lounge'
            ? [0.5, 0.4, -0.1]
            : [0.2, 0, 0.25]
        }
      >
        <mesh castShadow>
          <cylinderGeometry args={[0.045, 0.04, 0.28, 10]} />
          <meshStandardMaterial color={preset.outfitColor} roughness={0.65} />
        </mesh>
        <mesh position={[0, -0.15, 0]} castShadow>
          <sphereGeometry args={[0.048, 12, 12]} />
          <meshStandardMaterial color={preset.skinColor} roughness={0.6} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group
        ref={rightArmRef}
        position={[0.22, 0.52, 0]}
        rotation={
          pose === 'sitting_typing'
            ? [0.85, -0.3, -0.1]
            : pose === 'standing_pointing'
            ? [0.4, 0, -1.35]
            : pose === 'sitting_lounge'
            ? [0.5, -0.4, 0.1]
            : [0.2, 0, -0.25]
        }
      >
        <mesh castShadow>
          <cylinderGeometry args={[0.045, 0.04, 0.28, 10]} />
          <meshStandardMaterial color={preset.outfitColor} roughness={0.65} />
        </mesh>
        <mesh position={[0, -0.15, 0]} castShadow>
          <sphereGeometry args={[0.048, 12, 12]} />
          <meshStandardMaterial color={preset.skinColor} roughness={0.6} />
        </mesh>
      </group>

      {/* Lounge Tablet Prop for COO & Scout */}
      {pose === 'sitting_lounge' && (
        <group position={[0, 0.38, 0.22]} rotation={[0.6, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.2, 0.26, 0.012]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0, 0.008]}>
            <planeGeometry args={[0.18, 0.24]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>
      )}

      {/* 4. LEGS (Natural Sitting vs Standing) */}
      {isSitting ? (
        /* Sitting: Thighs forward horizontal, shins down */
        <group position={[0, 0.32, 0]}>
          {/* Left Thigh */}
          <group position={[-0.09, 0, 0]} rotation={[Math.PI / 2.2, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.048, 0.045, 0.26, 10]} />
              <meshStandardMaterial
                color={preset.gender === 'male' ? preset.bottomColor : preset.skinColor}
                roughness={0.65}
              />
            </mesh>
            {/* Left Shin down */}
            <group position={[0, 0.14, 0]} rotation={[-Math.PI / 2.1, 0, 0]}>
              <mesh position={[0, -0.1, 0]} castShadow>
                <cylinderGeometry args={[0.045, 0.042, 0.22, 10]} />
                <meshStandardMaterial
                  color={preset.gender === 'male' ? preset.bottomColor : preset.skinColor}
                  roughness={0.65}
                />
              </mesh>
              {/* Sneaker */}
              <mesh position={[0, -0.22, 0.05]} castShadow>
                <boxGeometry args={[0.09, 0.065, 0.15]} />
                <meshStandardMaterial color="#ffffff" roughness={0.4} />
              </mesh>
            </group>
          </group>

          {/* Right Thigh */}
          <group position={[0.09, 0, 0]} rotation={[Math.PI / 2.2, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.048, 0.045, 0.26, 10]} />
              <meshStandardMaterial
                color={preset.gender === 'male' ? preset.bottomColor : preset.skinColor}
                roughness={0.65}
              />
            </mesh>
            {/* Right Shin down */}
            <group position={[0, 0.14, 0]} rotation={[-Math.PI / 2.1, 0, 0]}>
              <mesh position={[0, -0.1, 0]} castShadow>
                <cylinderGeometry args={[0.045, 0.042, 0.22, 10]} />
                <meshStandardMaterial
                  color={preset.gender === 'male' ? preset.bottomColor : preset.skinColor}
                  roughness={0.65}
                />
              </mesh>
              {/* Sneaker */}
              <mesh position={[0, -0.22, 0.05]} castShadow>
                <boxGeometry args={[0.09, 0.065, 0.15]} />
                <meshStandardMaterial color="#ffffff" roughness={0.4} />
              </mesh>
            </group>
          </group>
        </group>
      ) : (
        /* Standing Upright */
        <group position={[0, 0.16, 0]}>
          <group position={[-0.09, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.048, 0.045, 0.24, 10]} />
              <meshStandardMaterial color={preset.skinColor} roughness={0.65} />
            </mesh>
            <mesh position={[0, -0.14, 0.03]} castShadow>
              <boxGeometry args={[0.09, 0.07, 0.15]} />
              <meshStandardMaterial color="#ffffff" roughness={0.4} />
            </mesh>
          </group>
          <group position={[0.09, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.048, 0.045, 0.24, 10]} />
              <meshStandardMaterial color={preset.skinColor} roughness={0.65} />
            </mesh>
            <mesh position={[0, -0.14, 0.03]} castShadow>
              <boxGeometry args={[0.09, 0.07, 0.15]} />
              <meshStandardMaterial color="#ffffff" roughness={0.4} />
            </mesh>
          </group>
        </group>
      )}

      {/* Animated Tail if present */}
      {preset.hasTail && (
        <AnimatedTail tailType={preset.hasTail} isHovered={isHovered || isSelected} />
      )}
    </group>
  )
}

/**
 * Main AgentAvatar Component:
 * - Clay Isometric Diorama Character
 * - Section 3: Floating Action Card with "NEEDS YOU", task summary, "Review first" and "Approve" buttons!
 * - Compact name pill when idle
 * - Natural sitting vs standing posture matching cluster
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
  const [isApproved, setIsApproved] = useState(false)
  const preset = CHARACTER_PRESETS[agent.id] || CHARACTER_PRESETS.sherloc

  // Watson is the hero active agent with pending task (like Miro in reference image), or when selected/hovered
  const showActionCard = isSelected || hovered || agent.id === 'watson'

  const handleApprove = () => {
    setIsApproved(true)
    setTimeout(() => setIsApproved(false), 3000)
  }

  return (
    <group
      position={position}
      rotation={rotation}
      name={`agent-avatar-${agent.id}`}
    >
      {/* ========================================================
          SECTION 3: 3D FLOATING ACTION CARD (HERO UI ELEMENT)
          ======================================================== */}
      {!hideTooltip && (
        <Html
          position={[0, 1.48, 0]}
          center
          distanceFactor={10}
          zIndexRange={[1, 20]}
          style={{ pointerEvents: 'none' }}
        >
          {showActionCard ? (
            /* --- EXPANDED FLOATING ACTION CARD (REFERENCE UI HERO) --- */
            <div className="bg-white text-slate-900 border-2 border-slate-900 rounded-2xl shadow-2xl p-4 min-w-[270px] max-w-[310px] select-none text-left relative animate-in fade-in zoom-in-95 duration-200 pointer-events-auto">
              {/* Header: [NEEDS YOU] • Agent Name     9m 58s Left */}
              <div className="flex items-center justify-between gap-2 w-full mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="bg-slate-950 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider">
                    NEEDS YOU
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span className="text-xs font-black tracking-tight text-slate-900 leading-none">
                    {agent.name}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400">
                  9m 58s Left
                </span>
              </div>

              {/* Body: Task summary */}
              <p className="text-[11px] leading-relaxed text-slate-600 font-medium mb-3 line-clamp-3">
                {preset.sampleTask}
              </p>

              {/* Footer: Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelect(agent)
                  }}
                  className="px-3 py-1 rounded-full text-[11px] font-bold text-slate-700 hover:text-slate-900 border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Review first
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleApprove()
                  }}
                  className={`px-3.5 py-1 rounded-full text-[11px] font-bold text-white transition-all shadow-sm cursor-pointer ${
                    isApproved
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                  }`}
                >
                  {isApproved ? 'Approved ✔' : 'Approve'}
                </button>
              </div>

              {/* Speech Bubble Downward Notch Pointer */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-slate-900" />
              <div className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-0 h-0 border-x-7 border-x-transparent border-t-7 border-t-white" />
            </div>
          ) : (
            /* --- SLEEK COMPACT NAME PILL (Strictly Name & Mascot) --- */
            <div
              onClick={(e) => {
                e.stopPropagation()
                onSelect(agent)
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/95 hover:bg-slate-900 text-white shadow-xl border border-white/30 backdrop-blur-sm select-none transition-transform duration-200 hover:scale-105 relative cursor-pointer whitespace-nowrap pointer-events-auto"
            >
              <span className="text-xs leading-none">{preset.emoji}</span>
              <span className="text-[11px] font-black text-white tracking-tight leading-none">
                {agent.name}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider ml-0.5">
                {preset.agentNum}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0 ml-0.5" />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-x-3 border-x-transparent border-t-4 border-t-slate-900/95" />
            </div>
          )}
        </Html>
      )}

      {/* ========================================================
          GENEROUS 3D HITBOX VOLUME FOR CLICKING
          ======================================================== */}
      <mesh
        position={[0, 0.65, 0]}
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
        <cylinderGeometry args={[0.9, 0.9, 1.6, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Interactive Selection Ring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.38, 0.48, 32]} />
        <meshBasicMaterial
          color={preset.outfitColor}
          transparent
          opacity={isSelected ? 0.95 : hovered ? 0.65 : 0.25}
          depthWrite={false}
        />
      </mesh>

      {/* 3D Natural Posed Character */}
      <NaturalPosedCharacter
        preset={preset}
        isHovered={hovered}
        isSelected={isSelected}
        pose={preset.defaultPose}
      />
    </group>
  )
}
