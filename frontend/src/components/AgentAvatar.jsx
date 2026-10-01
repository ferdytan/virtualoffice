import React, { useRef, useEffect, useMemo, useState, Suspense, Component } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations, RoundedBox, Html } from '@react-three/drei'
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
 * Generates an adorable Anime Chibi Face Texture with large sparkling eyes,
 * double white catchlights, colorful irises, cute blush, and sweet smile.
 */
function useAnimeFaceTexture(agentId = 'sherloc', eyeColor = '#3b82f6') {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')

    // Transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Eye specifications
    const leftEyeX = 160
    const rightEyeX = 352
    const eyeY = 220
    const eyeWidth = 56
    const eyeHeight = 78

    function drawAnimeEye(cx, cy) {
      // 1. Black Upper Eyelash Arc
      ctx.beginPath()
      ctx.ellipse(cx, cy - eyeHeight * 0.45, eyeWidth * 1.15, 14, 0, 0, Math.PI * 2)
      ctx.fillStyle = '#1e1b18'
      ctx.fill()

      // Side flick / cat eyelash
      ctx.beginPath()
      ctx.ellipse(cx + (cx < 256 ? -eyeWidth * 0.9 : eyeWidth * 0.9), cy - eyeHeight * 0.42, 12, 6, cx < 256 ? -0.4 : 0.4, 0, Math.PI * 2)
      ctx.fillStyle = '#1e1b18'
      ctx.fill()

      // 2. Iris Base (Gradient)
      const grad = ctx.createLinearGradient(0, cy - eyeHeight / 2, 0, cy + eyeHeight / 2)
      grad.addColorStop(0, '#0f172a')
      grad.addColorStop(0.35, eyeColor)
      grad.addColorStop(1, '#bae6fd')

      ctx.beginPath()
      ctx.ellipse(cx, cy, eyeWidth, eyeHeight, 0, 0, Math.PI * 2)
      ctx.fillStyle = grad
      ctx.fill()

      // 3. Pupil
      ctx.beginPath()
      ctx.ellipse(cx, cy + 6, eyeWidth * 0.55, eyeHeight * 0.55, 0, 0, Math.PI * 2)
      ctx.fillStyle = '#090d16'
      ctx.fill()

      // 4. Sparkling White Catchlights
      // Big primary highlight
      ctx.beginPath()
      ctx.ellipse(cx - 14, cy - 18, 16, 22, -0.2, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
      ctx.fill()

      // Small secondary highlight
      ctx.beginPath()
      ctx.arc(cx + 16, cy + 18, 9, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
      ctx.fill()

      // Tiny sparkle
      ctx.beginPath()
      ctx.arc(cx - 8, cy + 24, 5, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)'
      ctx.fill()
    }

    drawAnimeEye(leftEyeX, eyeY)
    drawAnimeEye(rightEyeX, eyeY)

    // Soft Eyebrows
    ctx.strokeStyle = '#292524'
    ctx.lineWidth = 6
    ctx.lineCap = 'round'
    // Left eyebrow
    ctx.beginPath()
    ctx.arc(leftEyeX + 8, eyeY - 80, 48, Math.PI * 1.15, Math.PI * 1.8)
    ctx.stroke()
    // Right eyebrow
    ctx.beginPath()
    ctx.arc(rightEyeX - 8, eyeY - 80, 48, Math.PI * 1.2, Math.PI * 1.85)
    ctx.stroke()

    // Rosy Blushing Cheeks
    ctx.fillStyle = 'rgba(251, 113, 133, 0.45)'
    ctx.beginPath()
    ctx.ellipse(135, eyeY + eyeHeight * 0.8, 38, 18, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(377, eyeY + eyeHeight * 0.8, 38, 18, 0, 0, Math.PI * 2)
    ctx.fill()

    // Cute Smile / Inverted-V Mouth
    ctx.strokeStyle = '#be123c'
    ctx.lineWidth = 5
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.arc(256, 365, 20, 0.15 * Math.PI, 0.85 * Math.PI)
    ctx.stroke()

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [agentId, eyeColor])
}

/**
 * Kemonomimi 3D Animal Ears & Tail Props:
 * Directly matches the reference image:
 * - sherloc: Bunny Girl (Pink/White ears)
 * - watson: Cat Boy (Dark cat ears + curved cat tail, sipping coffee)
 * - coo: Bear Boy (Round bear ears + round eyeglasses)
 * - scout: Fox Girl (Pointed amber fox ears + fluffy fox tail)
 * - nara: Tech radar ears
 * - velocia: Coral ears
 */
function KemonomimiAccessories({ agentId }) {
  const tailRef = useRef()

  useFrame(({ clock }) => {
    if (tailRef.current) {
      const t = clock.getElapsedTime()
      tailRef.current.rotation.z = Math.sin(t * 2.5) * 0.15
      tailRef.current.rotation.y = Math.cos(t * 2) * 0.12
    }
  })

  switch (agentId) {
    case 'sherloc':
      // 1. Bunny Ears (Kelinci) - Cute tall upright ears with pink interior
      return (
        <group position={[0, 0, 0]}>
          {/* Left Bunny Ear */}
          <group position={[-0.14, 0.28, -0.02]} rotation={[-0.1, 0, -0.15]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.045, 0.055, 0.38, 16]} />
              <meshStandardMaterial color="#ffffff" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0, 0.022]}>
              <cylinderGeometry args={[0.028, 0.038, 0.32, 16]} />
              <meshStandardMaterial color="#fbcfe8" roughness={0.4} />
            </mesh>
          </group>
          {/* Right Bunny Ear (curved playfully) */}
          <group position={[0.14, 0.28, -0.02]} rotation={[-0.1, 0, 0.15]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.045, 0.055, 0.38, 16]} />
              <meshStandardMaterial color="#ffffff" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0, 0.022]}>
              <cylinderGeometry args={[0.028, 0.038, 0.32, 16]} />
              <meshStandardMaterial color="#fbcfe8" roughness={0.4} />
            </mesh>
          </group>
        </group>
      )

    case 'watson':
      // 2. Cat Ears & Cat Tail (Kucing) - Sleek black ears & curved swishing tail
      return (
        <group position={[0, 0, 0]}>
          {/* Left Cat Ear */}
          <group position={[-0.16, 0.25, -0.02]} rotation={[0.1, 0.15, -0.28]}>
            <mesh castShadow>
              <coneGeometry args={[0.085, 0.16, 4]} />
              <meshStandardMaterial color="#1e293b" roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.01, 0.02]} rotation={[0, 0, 0]}>
              <coneGeometry args={[0.055, 0.12, 4]} />
              <meshStandardMaterial color="#f472b6" roughness={0.3} />
            </mesh>
          </group>
          {/* Right Cat Ear */}
          <group position={[0.16, 0.25, -0.02]} rotation={[0.1, -0.15, 0.28]}>
            <mesh castShadow>
              <coneGeometry args={[0.085, 0.16, 4]} />
              <meshStandardMaterial color="#1e293b" roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.01, 0.02]} rotation={[0, 0, 0]}>
              <coneGeometry args={[0.055, 0.12, 4]} />
              <meshStandardMaterial color="#f472b6" roughness={0.3} />
            </mesh>
          </group>
          {/* Swishing Cat Tail */}
          <group ref={tailRef} position={[0, -0.45, -0.18]} rotation={[0.8, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.025, 0.032, 0.45, 8]} />
              <meshStandardMaterial color="#1e293b" roughness={0.4} />
            </mesh>
            {/* White tip */}
            <mesh position={[0, 0.22, 0]} castShadow>
              <sphereGeometry args={[0.032, 8, 8]} />
              <meshStandardMaterial color="#f8fafc" />
            </mesh>
          </group>
        </group>
      )

    case 'coo':
      // 3. Bear Ears & Round Wire Glasses (Beruang)
      return (
        <group position={[0, 0, 0]}>
          {/* Left Bear Ear */}
          <group position={[-0.18, 0.24, -0.02]}>
            <mesh castShadow>
              <sphereGeometry args={[0.075, 16, 16]} />
              <meshStandardMaterial color="#44403c" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0, 0.025]}>
              <sphereGeometry args={[0.05, 12, 12]} />
              <meshStandardMaterial color="#d6d3d1" roughness={0.5} />
            </mesh>
          </group>
          {/* Right Bear Ear */}
          <group position={[0.18, 0.24, -0.02]}>
            <mesh castShadow>
              <sphereGeometry args={[0.075, 16, 16]} />
              <meshStandardMaterial color="#44403c" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0, 0.025]}>
              <sphereGeometry args={[0.05, 12, 12]} />
              <meshStandardMaterial color="#d6d3d1" roughness={0.5} />
            </mesh>
          </group>
          {/* Stylish Round Wire-Frame Glasses */}
          <group position={[0, 0.02, 0.23]}>
            {/* Left Rim */}
            <mesh position={[-0.08, 0, 0]}>
              <torusGeometry args={[0.065, 0.007, 8, 24]} />
              <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Right Rim */}
            <mesh position={[0.08, 0, 0]}>
              <torusGeometry args={[0.065, 0.007, 8, 24]} />
              <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Center Bridge */}
            <mesh position={[0, 0.02, 0]}>
              <boxGeometry args={[0.06, 0.007, 0.007]} />
              <meshStandardMaterial color="#eab308" metalness={0.9} />
            </mesh>
          </group>
        </group>
      )

    case 'scout':
      // 4. Fox Ears & Fluffy Fox Tail (Rubah / Kitsune)
      return (
        <group position={[0, 0, 0]}>
          {/* Left Fox Ear */}
          <group position={[-0.16, 0.26, -0.02]} rotation={[0.12, 0.1, -0.22]}>
            <mesh castShadow>
              <coneGeometry args={[0.09, 0.18, 4]} />
              <meshStandardMaterial color="#d97706" roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.01, 0.025]}>
              <coneGeometry args={[0.055, 0.13, 4]} />
              <meshStandardMaterial color="#fef3c7" roughness={0.4} />
            </mesh>
          </group>
          {/* Right Fox Ear */}
          <group position={[0.16, 0.26, -0.02]} rotation={[0.12, -0.1, 0.22]}>
            <mesh castShadow>
              <coneGeometry args={[0.09, 0.18, 4]} />
              <meshStandardMaterial color="#d97706" roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.01, 0.025]}>
              <coneGeometry args={[0.055, 0.13, 4]} />
              <meshStandardMaterial color="#fef3c7" roughness={0.4} />
            </mesh>
          </group>
          {/* Big Fluffy Fox Tail */}
          <group ref={tailRef} position={[0, -0.42, -0.18]} rotation={[0.85, 0, 0]}>
            <mesh castShadow>
              <coneGeometry args={[0.12, 0.48, 8]} />
              <meshStandardMaterial color="#d97706" roughness={0.5} />
            </mesh>
            {/* Fluffy White Tip */}
            <mesh position={[0, 0.24, 0]} castShadow>
              <coneGeometry args={[0.08, 0.16, 8]} />
              <meshStandardMaterial color="#ffffff" roughness={0.5} />
            </mesh>
          </group>
        </group>
      )

    case 'nara':
      // 5. Tech Radar Ears & Telemetry Beacon
      return (
        <group position={[0, 0, 0]}>
          <group position={[-0.15, 0.24, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.06, 0.06, 0.06, 16]} />
              <meshStandardMaterial color="#0284c7" />
            </mesh>
          </group>
          <group position={[0.15, 0.24, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.06, 0.06, 0.06, 16]} />
              <meshStandardMaterial color="#0284c7" />
            </mesh>
          </group>
          {/* Telemetry Antenna */}
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.01, 0.015, 0.18, 8]} />
            <meshStandardMaterial color="#38bdf8" />
          </mesh>
          <mesh position={[0, 0.4, 0]}>
            <sphereGeometry args={[0.028, 12, 12]} />
            <meshBasicMaterial color="#00f0ff" />
          </mesh>
        </group>
      )

    case 'velocia':
      // 6. Coral Bunny / Fox Ears
      return (
        <group position={[0, 0, 0]}>
          <group position={[-0.14, 0.26, 0]} rotation={[0, 0, -0.2]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.04, 0.05, 0.28, 12]} />
              <meshStandardMaterial color="#ef4444" />
            </mesh>
          </group>
          <group position={[0.14, 0.26, 0]} rotation={[0, 0, 0.2]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.04, 0.05, 0.28, 12]} />
              <meshStandardMaterial color="#ef4444" />
            </mesh>
          </group>
        </group>
      )

    default:
      return null
  }
}

/**
 * 3D Anime Chibi Head Rig:
 * Dynamically tracks the 'head' bone with soft peach skin tone,
 * styled anime hair bangs, anime face features, and Kemonomimi animal ears.
 */
function AnimeChibiHeadRig({ clone, agent }) {
  const headRef = useRef()
  const tempPos = useMemo(() => new THREE.Vector3(), [])
  const tempQuat = useMemo(() => new THREE.Quaternion(), [])
  const parentQuat = useMemo(() => new THREE.Quaternion(), [])
  const offset = useMemo(() => new THREE.Vector3(0, 0.17, 0.01), [])
  const rotatedOffset = useMemo(() => new THREE.Vector3(), [])

  const eyeColor = agent.color || '#3b82f6'
  const animeFaceTex = useAnimeFaceTexture(agent.id, eyeColor)

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

  // Skin tone (Soft anime porcelain peach)
  const skinColor = '#ffdfcf'
  // Hair color matching character role
  const hairColor =
    agent.id === 'watson' ? '#1e293b' : // Black cat hair
    agent.id === 'scout' ? '#d97706' :  // Golden amber fox hair
    agent.id === 'coo' ? '#292524' :    // Dark brown bear hair
    agent.id === 'sherloc' ? '#854d0e' : // Warm brown bunny hair
    '#334155'

  return (
    <group ref={headRef}>
      {/* 1. Smooth Rounded Anime Chibi Head */}
      <RoundedBox args={[0.44, 0.44, 0.42]} radius={0.12} smoothness={8} castShadow receiveShadow>
        <meshStandardMaterial color={skinColor} roughness={0.38} />
      </RoundedBox>

      {/* 2. Seamless Neck Collar */}
      <mesh position={[0, -0.21, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.12, 0.08, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.38} />
      </mesh>

      {/* 3. Front Anime Face Plate (Sparkling eyes, blush, smile) */}
      <mesh position={[0, 0.01, 0.216]}>
        <planeGeometry args={[0.42, 0.42]} />
        <meshStandardMaterial
          map={animeFaceTex}
          transparent={true}
          roughness={0.25}
          polygonOffset={true}
          polygonOffsetFactor={-2}
        />
      </mesh>

      {/* 4. Styled Anime Hair Bangs & Locks */}
      {/* Hair Cap Back */}
      <mesh position={[0, 0.08, -0.06]} castShadow>
        <sphereGeometry args={[0.24, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
        <meshStandardMaterial color={hairColor} roughness={0.5} />
      </mesh>
      {/* Front Bang Locks */}
      {[-0.15, -0.05, 0.06, 0.16].map((bx, i) => (
        <mesh key={i} position={[bx, 0.18, 0.18]} rotation={[0.2, 0, (i - 1.5) * 0.12]} castShadow>
          <coneGeometry args={[0.05, 0.16, 6]} />
          <meshStandardMaterial color={hairColor} roughness={0.5} />
        </mesh>
      ))}
      {/* Side Hair Tufts framing cheeks */}
      <mesh position={[-0.22, -0.04, 0.08]} rotation={[0, 0, 0.15]} castShadow>
        <cylinderGeometry args={[0.035, 0.02, 0.28, 8]} />
        <meshStandardMaterial color={hairColor} roughness={0.5} />
      </mesh>
      <mesh position={[0.22, -0.04, 0.08]} rotation={[0, 0, -0.15]} castShadow>
        <cylinderGeometry args={[0.035, 0.02, 0.28, 8]} />
        <meshStandardMaterial color={hairColor} roughness={0.5} />
      </mesh>

      {/* 5. Kemonomimi 3D Animal Ears & Accessories */}
      <KemonomimiAccessories agentId={agent.id} />
    </group>
  )
}

/**
 * Hand-Held Props attached to Avatar:
 * - Coffee Mug (for Cat and Bear characters, sipping coffee)
 * - Digital Tablet (for Fox and Bunny characters)
 */
function HandHeldProp({ agentId }) {
  if (agentId === 'watson' || agentId === 'coo') {
    // Steaming Ceramic Coffee Mug
    return (
      <group position={[0.26, 0.65, 0.2]} rotation={[0.2, -0.3, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.05, 0.045, 0.1, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} />
        </mesh>
        {/* Dark Espresso inside */}
        <mesh position={[0, 0.045, 0]}>
          <circleGeometry args={[0.042, 16]} />
          <meshStandardMaterial color="#3e2723" roughness={0.1} />
        </mesh>
        {/* Mug Handle */}
        <mesh position={[0.055, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.028, 0.008, 8, 16]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
      </group>
    )
  }

  if (agentId === 'scout' || agentId === 'sherloc') {
    // Digital Smart Tablet / Notepad
    return (
      <group position={[0.24, 0.62, 0.22]} rotation={[0.6, -0.25, 0.1]}>
        <mesh castShadow>
          <boxGeometry args={[0.18, 0.26, 0.012]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
        {/* Glowing Screen */}
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
 * CharacterModel:
 * Loads character.glb, skins body with pastel outfit, hides default head & accessories,
 * and attaches the AnimeChibiHeadRig and HandHeldProps!
 */
function CharacterModel({
  modelUrl,
  agent,
  hovered,
  isSelected,
  initialAnimation = 'Idle'
}) {
  const groupRef = useRef()
  const { scene, animations } = useGLTF(modelUrl, '/draco/')
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { actions } = useAnimations(animations, groupRef)

  // Configure materials: pastel outfit and hide default cap/headphones/eyes
  useEffect(() => {
    if (!clone) return
    const agentColor = new THREE.Color(agent.color || '#38bdf8')

    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true

        if (child.name === 'body') {
          // Stylish Pastel Chibi Outfit Material
          const bodyMat = new THREE.MeshStandardMaterial({
            color: agentColor,
            roughness: 0.45,
            metalness: 0.02
          })
          // Hide old round head vertices above collar (Y > 0.58)
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
  }, [clone, agent.color])

  // Play skeletal animations: Idle standing, Wave when hovered/selected
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
      {/* 3D Anime Chibi Head with Kemonomimi Ears */}
      <AnimeChibiHeadRig clone={clone} agent={agent} />
      {/* Hand-held props (Coffee mug, Tablet) */}
      <HandHeldProp agentId={agent.id} />
    </group>
  )
}

/**
 * Error boundary component
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
 * Direct Nendoroid Anime Chibi figurine style matching the user's reference image!
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
  const routine = AGENT_ROUTINES[agent.id] || {
    icon: '⚡',
    title: agent.role || 'Active Agent',
    routine: agent.description || 'Autonomous agent routine',
    shortText: '⚡ Active'
  }

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
            /* --- Expanded Rich Status Card (on Hover / Selection) --- */
            <div className="flex flex-col items-start bg-slate-950/95 text-white px-3.5 py-2.5 rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-md whitespace-nowrap select-none animate-in fade-in zoom-in-95 duration-150 text-left min-w-[190px] relative">
              <div className="flex items-center justify-between gap-3 w-full">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black tracking-tight text-white leading-none">
                    {agent.name}
                  </span>
                  <span className="text-xs">{routine.icon}</span>
                </div>

                <span className="inline-flex items-center gap-1 text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-md leading-none shrink-0 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>ONLINE</span>
                </span>
              </div>

              <span className="text-[8px] font-bold tracking-wider uppercase text-slate-400 mt-1 leading-none">
                {agent.role_badge || agent.role || 'AGENT'}
              </span>

              <div className="mt-2 pt-2 border-t border-slate-800/80 w-full">
                <div className="flex items-center gap-1 text-[9.5px] font-bold text-amber-300">
                  <span>{routine.title}</span>
                </div>
                <p className="text-[8.5px] text-slate-300 font-medium leading-snug mt-0.5 max-w-[200px] whitespace-normal">
                  {routine.routine}
                </p>
              </div>

              <span className="text-[7.5px] font-semibold text-slate-500 mt-1.5">
                💡 Klik untuk membuka panel tugas & brief
              </span>

              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-6 border-t-slate-950/95" />
            </div>
          ) : (
            /* --- Compact Floating Routine Bubble Pill --- */
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white shadow-xl border border-white/25 backdrop-blur-xs select-none transition-transform duration-200 hover:scale-105 relative cursor-pointer">
              <span className="text-xs leading-none">{routine.icon}</span>
              <span className="text-[9px] font-extrabold text-slate-100 tracking-tight leading-none">
                {routine.shortText}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0 ml-0.5" />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-x-3 border-x-transparent border-t-4 border-t-slate-900/90" />
            </div>
          )}
        </Html>
      )}

      {/* --- Generous 3D Click & Hover Hitbox Volume (1.9m Diameter cylinder) --- */}
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
      <mesh position={[0, 0.018, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.45, 0.55, 32]} />
        <meshBasicMaterial
          color={agentColor}
          transparent
          opacity={isSelected ? 0.9 : hovered ? 0.6 : 0.25}
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
