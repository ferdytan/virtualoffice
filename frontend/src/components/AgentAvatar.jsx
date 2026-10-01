import React, { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Character Presets matching the Clay 3D Toy / Chibi aesthetic from the reference image:
 *
 * MALE CHARACTERS (Gender: Pria):
 * - Sherloc (🐰): Bunny Boy. Stylish boyish swept caramel clay hair, tall bunny ears, coral hoodie, dark trousers, white chunky sneakers.
 * - Watson (🐱): Cat Boy. Wavy spiky deep blue/navy clay hair (like Miro in reference image), black cat ears, cat tail, cozy white hoodie, holding coffee mug.
 * - COO (🐻): Bear Male Supervisor. Layered dark mocha clay hair, round bear ears, gold wire-frame glasses, royal purple executive sweater, charcoal trousers.
 *
 * FEMALE CHARACTERS (Gender: Wanita):
 * - Nara (📡): Cyber Telemetry. Sky-blue bob clay hair, radar antenna ears with pulsing beacon, tech jacket.
 * - Scout (🦊): Creative Strategist. Golden-amber clay hair with high top-knot bun (like Ara in reference image), fluffy fox ears, big bushy fox tail, mustard knit sweater, tablet.
 * - Velocia (📈): Marketing Strategist. Flowing crimson clay hair past shoulders (like the presenter in reference image), coral ears, crimson blazer, chic skirt.
 */
const CHARACTER_PRESETS = {
  sherloc: {
    emoji: '🐰',
    animal: 'Bunny Boy',
    gender: 'male',
    skinColor: '#ffd7ba',
    hairColor: '#854d0e', // warm caramel clay brown
    hairStyle: 'boy_swept',
    earType: 'bunny',
    eyeColor: '#f43f5e',
    outfitColor: '#f43f5e', // coral rose hoodie
    secondaryColor: '#ffffff', // white collar
    bottomColor: '#334155', // dark charcoal trousers (Male)
    prop: null,
    hasTail: false
  },
  watson: {
    emoji: '🐱',
    animal: 'Cat Boy',
    gender: 'male',
    skinColor: '#ffd7ba',
    hairColor: '#1d4ed8', // rich blue/navy sculpted clay hair (like Miro)
    hairStyle: 'spiky_clay',
    earType: 'cat',
    eyeColor: '#0284c7',
    outfitColor: '#f8fafc', // cozy off-white hoodie
    secondaryColor: '#0284c7', // cyber blue accents
    bottomColor: '#1e293b', // dark denim jeans (Male)
    prop: 'coffee',
    hasTail: 'cat'
  },
  nara: {
    emoji: '📡',
    animal: 'Radar',
    gender: 'female',
    skinColor: '#ffd7ba',
    hairColor: '#0284c7', // vibrant cyan/sky blue
    hairStyle: 'bob_cut',
    earType: 'radar',
    eyeColor: '#38bdf8',
    outfitColor: '#38bdf8', // tech blue jacket
    secondaryColor: '#ffffff',
    bottomColor: '#0f172a',
    prop: null,
    hasTail: false
  },
  scout: {
    emoji: '🦊',
    animal: 'Fox Girl',
    gender: 'female',
    skinColor: '#ffd7ba',
    hairColor: '#d97706', // golden amber / honey (like Ara)
    hairStyle: 'top_bun', // high top-knot bun like Ara in reference image
    earType: 'fox',
    eyeColor: '#f59e0b',
    outfitColor: '#f59e0b', // warm mustard/amber knit sweater
    secondaryColor: '#ffffff', // white skirt
    bottomColor: '#ffffff',
    prop: 'tablet',
    hasTail: 'fox'
  },
  velocia: {
    emoji: '📈',
    animal: 'Strategy Lead',
    gender: 'female',
    skinColor: '#ffd7ba',
    hairColor: '#dc2626', // rich flowing crimson/coral hair (like presenter)
    hairStyle: 'long_wavy',
    earType: 'fox_red',
    eyeColor: '#ef4444',
    outfitColor: '#ef4444', // stylish crimson blazer
    secondaryColor: '#ffffff',
    bottomColor: '#ffffff',
    prop: null,
    hasTail: false
  },
  coo: {
    emoji: '🐻',
    animal: 'Bear Supervisor',
    gender: 'male',
    skinColor: '#ffd7ba',
    hairColor: '#451a03', // dark mocha brown clay hair
    hairStyle: 'executive_boy',
    earType: 'bear',
    eyeColor: '#78350f',
    outfitColor: '#9333ea', // royal purple executive sweater
    secondaryColor: '#ffffff',
    bottomColor: '#1e293b', // charcoal executive trousers (Male)
    prop: 'glasses',
    hasTail: false
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
          {/* Left Bunny Ear */}
          <group ref={leftEarRef} position={[-0.14, 0, 0]} rotation={[-0.08, 0, -0.14]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.045, 0.055, 0.35, 16]} />
              <meshStandardMaterial color="#ffffff" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0, 0.022]}>
              <cylinderGeometry args={[0.026, 0.038, 0.28, 16]} />
              <meshStandardMaterial color="#fbcfe8" roughness={0.6} />
            </mesh>
          </group>
          {/* Right Bunny Ear */}
          <group ref={rightEarRef} position={[0.14, 0, 0]} rotation={[-0.08, 0, 0.14]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.045, 0.055, 0.35, 16]} />
              <meshStandardMaterial color="#ffffff" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0, 0.022]}>
              <cylinderGeometry args={[0.026, 0.038, 0.28, 16]} />
              <meshStandardMaterial color="#fbcfe8" roughness={0.6} />
            </mesh>
          </group>
        </group>
      )

    case 'cat':
      return (
        <group position={[0, 0.26, -0.02]}>
          {/* Left Cat Ear */}
          <group ref={leftEarRef} position={[-0.16, 0, 0]} rotation={[0.08, 0.08, -0.24]}>
            <mesh castShadow>
              <coneGeometry args={[0.085, 0.17, 4]} />
              <meshStandardMaterial color="#1e293b" roughness={0.5} />
            </mesh>
            <mesh position={[0, -0.01, 0.02]}>
              <coneGeometry args={[0.055, 0.12, 4]} />
              <meshStandardMaterial color="#f472b6" roughness={0.5} />
            </mesh>
          </group>
          {/* Right Cat Ear */}
          <group ref={rightEarRef} position={[0.16, 0, 0]} rotation={[0.08, -0.08, 0.24]}>
            <mesh castShadow>
              <coneGeometry args={[0.085, 0.17, 4]} />
              <meshStandardMaterial color="#1e293b" roughness={0.5} />
            </mesh>
            <mesh position={[0, -0.01, 0.02]}>
              <coneGeometry args={[0.055, 0.12, 4]} />
              <meshStandardMaterial color="#f472b6" roughness={0.5} />
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
              <meshStandardMaterial color={outerColor} roughness={0.5} />
            </mesh>
            <mesh position={[0, -0.01, 0.022]}>
              <coneGeometry args={[0.055, 0.12, 4]} />
              <meshStandardMaterial color="#fef3c7" roughness={0.6} />
            </mesh>
          </group>
          <group ref={rightEarRef} position={[0.16, 0, 0]} rotation={[0.08, -0.06, 0.22]}>
            <mesh castShadow>
              <coneGeometry args={[0.09, 0.18, 4]} />
              <meshStandardMaterial color={outerColor} roughness={0.5} />
            </mesh>
            <mesh position={[0, -0.01, 0.022]}>
              <coneGeometry args={[0.055, 0.12, 4]} />
              <meshStandardMaterial color="#fef3c7" roughness={0.6} />
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
              <meshStandardMaterial color="#451a03" roughness={0.6} />
            </mesh>
            <mesh position={[0, 0, 0.022]}>
              <sphereGeometry args={[0.048, 12, 12]} />
              <meshStandardMaterial color="#d6d3d1" roughness={0.6} />
            </mesh>
          </group>
          <group ref={rightEarRef} position={[0.18, 0, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.075, 16, 16]} />
              <meshStandardMaterial color="#451a03" roughness={0.6} />
            </mesh>
            <mesh position={[0, 0, 0.022]}>
              <sphereGeometry args={[0.048, 12, 12]} />
              <meshStandardMaterial color="#d6d3d1" roughness={0.6} />
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
              <meshStandardMaterial color="#0284c7" roughness={0.4} />
            </mesh>
          </group>
          <group position={[0.16, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.06, 0.06, 0.06, 16]} />
              <meshStandardMaterial color="#0284c7" roughness={0.4} />
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
    () => new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.55 }),
    [hairColor]
  )

  return (
    <group position={[0, 0.03, 0]}>
      {/* Main Voluminous Clay Cap (Back & Crown of Head) */}
      <mesh position={[0, 0.04, -0.03]} castShadow>
        <sphereGeometry args={[0.29, 20, 20]} />
        <primitive object={mat} attach="material" />
      </mesh>

      {/* STYLE 1: BOYISH SWEPT CLAY HAIR (Sherloc - Bunny Boy) */}
      {hairStyle === 'boy_swept' && (
        <>
          {/* Swept Front Fringe Clumps */}
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
          {/* Neat sideburns */}
          <mesh position={[-0.24, -0.06, 0.06]} castShadow>
            <cylinderGeometry args={[0.04, 0.02, 0.22, 8]} />
            <primitive object={mat} attach="material" />
          </mesh>
          <mesh position={[0.24, -0.06, 0.06]} castShadow>
            <cylinderGeometry args={[0.04, 0.02, 0.22, 8]} />
            <primitive object={mat} attach="material" />
          </mesh>
        </>
      )}

      {/* STYLE 2: SPIKY/WAVY BLUE CLAY HAIR (Watson - Cat Boy, like Miro in reference image!) */}
      {hairStyle === 'spiky_clay' && (
        <group position={[0, 0.15, 0]}>
          {/* Voluminous sculptural wavy clay puffs */}
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
          {/* Front lock framing forehead */}
          <mesh position={[0, -0.02, 0.2]} rotation={[0.2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.02, 0.14, 8]} />
            <primitive object={mat} attach="material" />
          </mesh>
        </group>
      )}

      {/* STYLE 3: HIGH TOP-KNOT BUN & GLASSES (Scout - Fox Girl, like Ara in reference image!) */}
      {hairStyle === 'top_bun' && (
        <>
          {/* Prominent High Clay Top Bun */}
          <group position={[0, 0.32, -0.05]}>
            <mesh castShadow>
              <sphereGeometry args={[0.14, 16, 16]} />
              <primitive object={mat} attach="material" />
            </mesh>
            {/* Cute Hair Tie Ribbon */}
            <mesh position={[0, -0.08, 0]}>
              <torusGeometry args={[0.09, 0.02, 8, 16]} />
              <meshStandardMaterial color="#f43f5e" roughness={0.4} />
            </mesh>
          </group>
          {/* Front cute fringe */}
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
          {/* Side tendrils */}
          <mesh position={[-0.22, -0.1, 0.05]} castShadow>
            <cylinderGeometry args={[0.035, 0.02, 0.26, 8]} />
            <primitive object={mat} attach="material" />
          </mesh>
          <mesh position={[0.22, -0.1, 0.05]} castShadow>
            <cylinderGeometry args={[0.035, 0.02, 0.26, 8]} />
            <primitive object={mat} attach="material" />
          </mesh>
        </>
      )}

      {/* STYLE 4: LONG FLOWING WAVY CLAY HAIR (Velocia - Presenter in reference image!) */}
      {hairStyle === 'long_wavy' && (
        <>
          {/* Front fringe */}
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
          {/* Long cascading clay waves framing shoulders */}
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

      {/* STYLE 5: EXECUTIVE LAYERED MALE HAIR (COO - Bear Male Supervisor) */}
      {hairStyle === 'executive_boy' && (
        <group position={[0, 0.15, 0]}>
          <mesh position={[0, 0.05, 0.08]} castShadow>
            <sphereGeometry args={[0.12, 12, 12]} />
            <primitive object={mat} attach="material" />
          </mesh>
          <mesh position={[-0.22, -0.08, 0.04]} castShadow>
            <cylinderGeometry args={[0.04, 0.02, 0.2, 8]} />
            <primitive object={mat} attach="material" />
          </mesh>
          <mesh position={[0.22, -0.08, 0.04]} castShadow>
            <cylinderGeometry args={[0.04, 0.02, 0.2, 8]} />
            <primitive object={mat} attach="material" />
          </mesh>
        </group>
      )}

      {/* STYLE 6: CYBER BOB CUT (Nara) */}
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
 * Animated Tail for Cat (Watson) and Fox (Scout)
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
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.22, 0]} castShadow>
          <sphereGeometry args={[0.035, 10, 10]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
      </group>
    )
  }

  if (tailType === 'fox') {
    return (
      <group ref={tailRef} position={[0, 0.42, -0.22]} rotation={[0.8, 0, 0]}>
        <mesh castShadow>
          <coneGeometry args={[0.13, 0.46, 12]} />
          <meshStandardMaterial color="#d97706" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.24, 0]} castShadow>
          <coneGeometry args={[0.085, 0.18, 12]} />
          <meshStandardMaterial color="#ffffff" roughness={0.6} />
        </mesh>
      </group>
    )
  }

  return null
}

/**
 * 3D Clay Toy Chibi Character Component
 */
function ClayChibiCharacter({
  preset,
  isHovered,
  isSelected,
  agent
}) {
  const rootRef = useRef()
  const headRef = useRef()
  const rightArmRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    if (rootRef.current) {
      rootRef.current.position.y = Math.sin(t * 2.5) * 0.015
    }

    if (headRef.current) {
      headRef.current.rotation.z = Math.sin(t * 1.5) * 0.025
      headRef.current.rotation.x = Math.sin(t * 2) * 0.015
    }

    if (rightArmRef.current) {
      if (isHovered || isSelected) {
        rightArmRef.current.rotation.z = -1.2 + Math.sin(t * 9) * 0.32
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
          1. CHIBI CLAY HEAD & FACE
          ======================================================== */}
      <group ref={headRef} position={[0, 0.88, 0]}>
        {/* Soft Peach Clay Head */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.27, 24, 24]} />
          <meshStandardMaterial color={preset.skinColor} roughness={0.5} />
        </mesh>

        {/* Sculpted Voluminous Clay Hair */}
        <SculptedClayHair hairStyle={preset.hairStyle} hairColor={preset.hairColor} />

        {/* Kemonomimi Ears on Head */}
        <KemonomimiEars earType={preset.earType} isHovered={isHovered || isSelected} />

        {/* Cute Stylized Eyes */}
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

        {/* Cute Blushing Rosy Cheeks */}
        <mesh position={[-0.14, -0.06, 0.22]}>
          <circleGeometry args={[0.035, 16]} />
          <meshBasicMaterial color="#fda4af" transparent opacity={0.65} />
        </mesh>
        <mesh position={[0.14, -0.06, 0.22]}>
          <circleGeometry args={[0.035, 16]} />
          <meshBasicMaterial color="#fda4af" transparent opacity={0.65} />
        </mesh>

        {/* Sweet Smiling Mouth */}
        <mesh position={[0, -0.08, 0.255]}>
          <circleGeometry args={[0.024, 16, 0, Math.PI]} />
          <meshBasicMaterial color="#f43f5e" />
        </mesh>

        {/* Gold Wire-Frame Glasses for COO */}
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
          2. PUFFY CLAY SWEATER / HOODIE (TORSO)
          ======================================================== */}
      <group position={[0, 0.46, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.16, 0.2, 0.36, 16]} />
          <meshStandardMaterial color={preset.outfitColor} roughness={0.5} />
        </mesh>

        {/* Puffy Rolled Neck Collar */}
        <mesh position={[0, 0.16, 0.08]} castShadow>
          <torusGeometry args={[0.14, 0.038, 8, 20]} />
          <meshStandardMaterial color={preset.secondaryColor} roughness={0.5} />
        </mesh>

        {/* Male Trousers vs Female Skirt */}
        {preset.gender === 'male' ? (
          // Male: Sleek trousers hem
          <mesh position={[0, -0.17, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.2, 0.1, 16]} />
            <meshStandardMaterial color={preset.bottomColor} roughness={0.55} />
          </mesh>
        ) : (
          // Female: Cute flared skirt
          <mesh position={[0, -0.16, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.25, 0.12, 16]} />
            <meshStandardMaterial color={preset.bottomColor} roughness={0.5} />
          </mesh>
        )}
      </group>

      {/* ========================================================
          3. ARMS, LEGS & ACCESSORIES
          ======================================================== */}
      {/* Left Arm */}
      <group position={[-0.22, 0.52, 0]} rotation={[0.2, 0, 0.25]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.045, 0.04, 0.28, 10]} />
          <meshStandardMaterial color={preset.outfitColor} roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.15, 0]} castShadow>
          <sphereGeometry args={[0.048, 12, 12]} />
          <meshStandardMaterial color={preset.skinColor} roughness={0.5} />
        </mesh>

        {/* Handheld Props */}
        {preset.prop === 'coffee' && (
          <group position={[0, -0.16, 0.12]} rotation={[0.2, -0.3, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.045, 0.04, 0.09, 14]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.04, 0]}>
              <circleGeometry args={[0.038, 14]} />
              <meshStandardMaterial color="#3e2723" roughness={0.2} />
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
          <meshStandardMaterial color={preset.outfitColor} roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.26, 0]} castShadow>
          <sphereGeometry args={[0.048, 12, 12]} />
          <meshStandardMaterial color={preset.skinColor} roughness={0.5} />
        </mesh>
      </group>

      {/* Male Trousers vs Female Legs */}
      {/* Left Leg */}
      <group position={[-0.09, 0.16, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.048, 0.045, 0.24, 10]} />
          <meshStandardMaterial
            color={preset.gender === 'male' ? preset.bottomColor : preset.skinColor}
            roughness={0.55}
          />
        </mesh>
        <mesh position={[0, -0.14, 0.03]} castShadow>
          <boxGeometry args={[0.09, 0.07, 0.15]} />
          <meshStandardMaterial color="#ffffff" roughness={0.35} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group position={[0.09, 0.16, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.048, 0.045, 0.24, 10]} />
          <meshStandardMaterial
            color={preset.gender === 'male' ? preset.bottomColor : preset.skinColor}
            roughness={0.55}
          />
        </mesh>
        <mesh position={[0, -0.14, 0.03]} castShadow>
          <boxGeometry args={[0.09, 0.07, 0.15]} />
          <meshStandardMaterial color="#ffffff" roughness={0.35} />
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
 * Main AgentAvatar Component
 * - Styled in the Clay 3D Toy / Chibi aesthetic from the user's reference image
 * - Strict User Constraint: Floating label strictly displays the character's NAME only
 * - Sherloc, Watson, and COO are styled as MALE (Pria)
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
          FLOATING LABEL PILL:
          Strict User Constraint: Display strictly NAME & EMOJI (No role / task)
          ======================================================== */}
      {!hideTooltip && (
        <Html
          position={[0, 1.45, 0]}
          center
          distanceFactor={10}
          zIndexRange={[1, 15]}
          style={{ pointerEvents: 'none' }}
        >
          {isSelected || hovered ? (
            /* --- Speech Bubble Card (Inspired by reference image) --- */
            <div className="flex flex-col items-start bg-slate-950/95 text-white px-3.5 py-2 rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-md whitespace-nowrap select-none animate-in fade-in zoom-in-95 duration-150 text-left min-w-[150px] relative pointer-events-auto">
              <div className="flex items-center justify-between gap-3 w-full">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{preset.emoji}</span>
                  <span className="text-xs font-black tracking-tight text-white leading-none">
                    {agent.name}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md leading-none shrink-0 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>ONLINE</span>
                </span>
              </div>
              <div className="mt-1.5 pt-1.5 border-t border-slate-800/80 flex items-center justify-between w-full text-[9px] text-slate-300">
                <span className="text-slate-400 text-[8.5px]">
                  {preset.animal} ({preset.gender === 'male' ? 'Pria' : 'Wanita'})
                </span>
                <span className="text-cyan-400 font-bold text-[8.5px]">Klik untuk Brief</span>
              </div>
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-6 border-t-slate-950/95" />
            </div>
          ) : (
            /* --- Compact Floating Pill: NAMA AGENT & EMOJI --- */
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/95 hover:bg-slate-900 text-white shadow-xl border border-white/40 backdrop-blur-sm select-none transition-transform duration-200 hover:scale-105 relative cursor-pointer whitespace-nowrap">
              <span className="text-xs leading-none">{preset.emoji}</span>
              <span className="text-[11px] font-black text-white tracking-tight leading-none">
                {agent.name}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0 ml-0.5" />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-x-3 border-x-transparent border-t-4 border-t-slate-900/95" />
            </div>
          )}
        </Html>
      )}

      {/* ========================================================
          GENEROUS 3D CLICK HITBOX VOLUME (1.9m Diameter)
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

      {/* 3D Clay Toy Chibi Character */}
      <ClayChibiCharacter
        preset={preset}
        isHovered={hovered}
        isSelected={isSelected}
        agent={agent}
      />
    </group>
  )
}
