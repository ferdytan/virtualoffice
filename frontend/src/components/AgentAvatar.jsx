import React, { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Classic Cute Clay 3D Anime Chibi Character Presets:
 *
 * MALE CHARACTERS (Gender: Pria):
 * - COO (🐻): Executive Lead. Neat dark hair, gold glasses, charcoal/slate suit (#334155), bear ears.
 * - Sherloc (🐰): Frontline CS. Casual swept brown hair, CS headset, warm gold jacket (#d97706), bunny ears.
 * - Watson (🐱): Tech Analyst. Deep navy hair, analyst glasses, indigo shirt (#1d4ed8), cat ears.
 * - Scout (🦊): Content Creator. Amber top-knot, reading glasses, warm mustard sweater (#f59e0b), fox ears.
 *
 * FEMALE CHARACTERS (Gender: Wanita):
 * - Nara (📡): CS & Telemetry. Sky-blue pastel (#38bdf8), neat bob cut, radar ear beacon, blush anime eyes.
 * - Velocia (📈): Strategy Lead. Energetic coral/red (#ef4444), long flowing wavy hair, red fox ears.
 */
const CHARACTER_PRESETS = {
  sherloc: {
    emoji: '🐰',
    animal: 'Frontline CS',
    gender: 'male',
    agentNum: 'AGENT 1',
    skinColor: '#ffd7ba',
    hairColor: '#78350f',
    hairStyle: 'boy_swept',
    earType: 'bunny',
    eyeColor: '#d97706',
    outfitColor: '#d97706', // warm amber/gold jacket
    secondaryColor: '#ffffff',
    bottomColor: '#334155',
    prop: 'headset',
    hasGlasses: false,
    sampleTask: 'WhatsApp Inbound: Validasi nomor telepon pelanggan baru #CUST-9821 siap didelegasikan.'
  },
  watson: {
    emoji: '🐱',
    animal: 'Tech Analyst',
    gender: 'male',
    agentNum: 'AGENT 2',
    skinColor: '#ffd7ba',
    hairColor: '#0f172a',
    hairStyle: 'spiky_clay',
    earType: 'cat',
    eyeColor: '#1d4ed8',
    outfitColor: '#1d4ed8', // deep navy / indigo shirt
    secondaryColor: '#ffffff',
    bottomColor: '#1e293b',
    prop: 'glasses',
    hasGlasses: true,
    sampleTask: 'Technical Escalation: Solusi firmware GPS disinkronkan ke Knowledge Base Vector DB RAG.'
  },
  nara: {
    emoji: '📡',
    animal: 'Telemetry CS',
    gender: 'female',
    agentNum: 'AGENT 3',
    skinColor: '#ffd7ba',
    hairColor: '#0284c7',
    hairStyle: 'bob_cut',
    earType: 'radar',
    eyeColor: '#38bdf8',
    outfitColor: '#38bdf8', // sky blue pastel jacket
    secondaryColor: '#ffffff',
    bottomColor: '#0f172a',
    prop: null,
    hasGlasses: false,
    sampleTask: 'Telemetri Armada: 48 unit GPS offline terdeteksi. Broadcast pengingat anti-banned terjadwal.'
  },
  scout: {
    emoji: '🦊',
    animal: 'Content Creator',
    gender: 'male',
    agentNum: 'AGENT 4',
    skinColor: '#ffd7ba',
    hairColor: '#b45309',
    hairStyle: 'top_bun',
    earType: 'fox',
    eyeColor: '#f59e0b',
    outfitColor: '#f59e0b', // warm mustard/amber sweater
    secondaryColor: '#ffffff',
    bottomColor: '#1e293b',
    prop: 'tablet',
    hasGlasses: true,
    sampleTask: 'Draf Artikel: Mengapa Kunci Ganda Tak Cukup & Solusi Sensor Orin siap untuk review publikasi.'
  },
  velocia: {
    emoji: '📈',
    animal: 'Strategy Lead',
    gender: 'female',
    agentNum: 'AGENT 5',
    skinColor: '#ffd7ba',
    hairColor: '#dc2626',
    hairStyle: 'long_wavy',
    earType: 'fox_red',
    eyeColor: '#ef4444',
    outfitColor: '#ef4444', // coral / red blazer
    secondaryColor: '#ffffff',
    bottomColor: '#ffffff',
    prop: null,
    hasGlasses: false,
    sampleTask: 'Strategi OKR: Analisis tren permintaan pasar Fuel Sensor naik +142.8% siap dipresentasikan.'
  },
  coo: {
    emoji: '🐻',
    animal: 'Executive Lead',
    gender: 'male',
    agentNum: 'LEAD',
    skinColor: '#ffd7ba',
    hairColor: '#1e293b',
    hairStyle: 'executive_boy',
    earType: 'bear',
    eyeColor: '#64748b',
    outfitColor: '#334155', // Charcoal/Slate executive suit
    secondaryColor: '#ffffff',
    bottomColor: '#1e293b',
    prop: 'glasses',
    hasGlasses: true,
    sampleTask: 'Delegasi Eksekutif: 6 task cluster tersinkronisasi dengan Telegram Gateway Direktur.'
  }
}

/**
 * 3D Kemonomimi Animal Ears with Idle & Hover Twitch
 */
function KemonomimiEars({ earType = 'bunny', isHovered }) {
  const leftEarRef = useRef()
  const rightEarRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const twitch = isHovered ? Math.sin(t * 10) * 0.12 : Math.sin(t * 3) * 0.03
    if (leftEarRef.current) leftEarRef.current.rotation.z = -0.14 + twitch
    if (rightEarRef.current) rightEarRef.current.rotation.z = 0.14 - twitch
  })

  if (earType === 'bunny') {
    return (
      <group position={[0, 0.28, 0]}>
        <group ref={leftEarRef} position={[-0.09, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.035, 0.05, 0.38, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <cylinderGeometry args={[0.018, 0.026, 0.3, 16]} />
            <meshStandardMaterial color="#fca5a5" roughness={0.6} />
          </mesh>
        </group>
        <group ref={rightEarRef} position={[0.09, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.035, 0.05, 0.38, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <cylinderGeometry args={[0.018, 0.026, 0.3, 16]} />
            <meshStandardMaterial color="#fca5a5" roughness={0.6} />
          </mesh>
        </group>
      </group>
    )
  }

  if (earType === 'cat') {
    return (
      <group position={[0, 0.24, 0]}>
        <group ref={leftEarRef} position={[-0.14, 0, 0]} rotation={[0, 0, -0.2]}>
          <mesh castShadow>
            <coneGeometry args={[0.08, 0.14, 16]} />
            <meshStandardMaterial color="#0f172a" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <coneGeometry args={[0.045, 0.09, 16]} />
            <meshStandardMaterial color="#bae6fd" roughness={0.5} />
          </mesh>
        </group>
        <group ref={rightEarRef} position={[0.14, 0, 0]} rotation={[0, 0, 0.2]}>
          <mesh castShadow>
            <coneGeometry args={[0.08, 0.14, 16]} />
            <meshStandardMaterial color="#0f172a" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <coneGeometry args={[0.045, 0.09, 16]} />
            <meshStandardMaterial color="#bae6fd" roughness={0.5} />
          </mesh>
        </group>
      </group>
    )
  }

  if (earType === 'fox' || earType === 'fox_red') {
    const isRed = earType === 'fox_red'
    const mainCol = isRed ? '#dc2626' : '#d97706'
    return (
      <group position={[0, 0.24, 0]}>
        <group ref={leftEarRef} position={[-0.14, 0, 0]} rotation={[0, 0, -0.25]}>
          <mesh castShadow>
            <coneGeometry args={[0.085, 0.16, 16]} />
            <meshStandardMaterial color={mainCol} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <coneGeometry args={[0.045, 0.1, 16]} />
            <meshStandardMaterial color="#fef08a" roughness={0.5} />
          </mesh>
        </group>
        <group ref={rightEarRef} position={[0.14, 0, 0]} rotation={[0, 0, 0.25]}>
          <mesh castShadow>
            <coneGeometry args={[0.085, 0.16, 16]} />
            <meshStandardMaterial color={mainCol} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <coneGeometry args={[0.045, 0.1, 16]} />
            <meshStandardMaterial color="#fef08a" roughness={0.5} />
          </mesh>
        </group>
      </group>
    )
  }

  if (earType === 'bear') {
    return (
      <group position={[0, 0.22, 0]}>
        <group ref={leftEarRef} position={[-0.16, 0, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial color="#1e293b" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <sphereGeometry args={[0.042, 16, 16]} />
            <meshStandardMaterial color="#64748b" roughness={0.6} />
          </mesh>
        </group>
        <group ref={rightEarRef} position={[0.16, 0, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial color="#1e293b" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <sphereGeometry args={[0.042, 16, 16]} />
            <meshStandardMaterial color="#64748b" roughness={0.6} />
          </mesh>
        </group>
      </group>
    )
  }

  // Radar Antenna for Nara
  return (
    <group position={[0, 0.24, 0]}>
      <mesh position={[-0.1, 0.08, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.008, 0.008, 0.16, 8]} />
        <meshStandardMaterial color="#0284c7" metalness={0.7} />
      </mesh>
      <mesh position={[-0.14, 0.16, 0]}>
        <sphereGeometry args={[0.024, 12, 12]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={2} />
      </mesh>
    </group>
  )
}

/**
 * Procedural Sculpted Clay Hair
 */
function SculptedClayHair({ hairStyle = 'boy_swept', hairColor = '#854d0e' }) {
  if (hairStyle === 'top_bun') {
    return (
      <group position={[0, 0.12, -0.04]}>
        <mesh castShadow>
          <sphereGeometry args={[0.27, 24, 24]} />
          <meshStandardMaterial color={hairColor} roughness={0.55} />
        </mesh>
        <mesh position={[0, 0.26, -0.02]} castShadow>
          <sphereGeometry args={[0.13, 20, 20]} />
          <meshStandardMaterial color={hairColor} roughness={0.55} />
        </mesh>
      </group>
    )
  }

  if (hairStyle === 'long_wavy') {
    return (
      <group position={[0, 0.08, -0.06]}>
        <mesh castShadow>
          <sphereGeometry args={[0.28, 24, 24]} />
          <meshStandardMaterial color={hairColor} roughness={0.55} />
        </mesh>
        {[-0.18, 0.18].map((tx, idx) => (
          <mesh key={idx} position={[tx, -0.22, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.08, 0.44, 16]} />
            <meshStandardMaterial color={hairColor} roughness={0.55} />
          </mesh>
        ))}
      </group>
    )
  }

  if (hairStyle === 'bob_cut') {
    return (
      <group position={[0, 0.08, -0.04]}>
        <mesh castShadow>
          <sphereGeometry args={[0.28, 24, 24]} />
          <meshStandardMaterial color={hairColor} roughness={0.55} />
        </mesh>
        <mesh position={[0, -0.1, -0.06]} castShadow>
          <cylinderGeometry args={[0.26, 0.28, 0.22, 16]} />
          <meshStandardMaterial color={hairColor} roughness={0.55} />
        </mesh>
      </group>
    )
  }

  // Short neat / swept boy style (Watson, Sherloc, COO)
  return (
    <group position={[0, 0.1, -0.04]}>
      <mesh castShadow>
        <sphereGeometry args={[0.27, 24, 24]} />
        <meshStandardMaterial color={hairColor} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.12, 0.16]} rotation={[0.4, 0, 0]} castShadow>
        <boxGeometry args={[0.22, 0.08, 0.14]} />
        <meshStandardMaterial color={hairColor} roughness={0.55} />
      </mesh>
    </group>
  )
}

/**
 * Classic Clay Chibi Character (Seated at Workstation Typing on Keyboard)
 */
function ClassicClayChibi({
  agentId,
  preset,
  isHovered,
  isSelected
}) {
  const headRef = useRef()
  const rightArmRef = useRef()
  const leftArmRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Subtle head focus
    if (headRef.current) {
      headRef.current.rotation.z = Math.sin(t * 1.5) * 0.02
      headRef.current.rotation.x = 0.08 + Math.sin(t * 2) * 0.015
    }

    // Natural typing bounce on keyboard (hands tap keys at desk surface)
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = 0.2 + Math.sin(t * 14) * 0.04
    }
    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = 0.2 + Math.cos(t * 14) * 0.04
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* 1. HEAD & FACE */}
      <group ref={headRef} position={[0, 0.84, 0]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.27, 24, 24]} />
          <meshStandardMaterial color={preset.skinColor} roughness={0.65} metalness={0.04} />
        </mesh>

        <SculptedClayHair hairStyle={preset.hairStyle} hairColor={preset.hairColor} />
        <KemonomimiEars earType={preset.earType} isHovered={isHovered || isSelected} />

        {/* Big Expressive Chibi Eyes */}
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

        {/* Cute Smile */}
        <mesh position={[0, -0.08, 0.255]}>
          <circleGeometry args={[0.024, 16, 0, Math.PI]} />
          <meshBasicMaterial color="#f43f5e" />
        </mesh>

        {/* Glasses for COO, Watson, and Scout */}
        {(preset.hasGlasses || preset.prop === 'glasses') && (
          <group position={[0, 0.02, 0.26]}>
            <mesh position={[-0.09, 0, 0]}>
              <torusGeometry args={[0.055, 0.006, 8, 24]} />
              <meshStandardMaterial
                color={agentId === 'coo' ? '#eab308' : agentId === 'watson' ? '#94a3b8' : '#d97706'}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            <mesh position={[0.09, 0, 0]}>
              <torusGeometry args={[0.055, 0.006, 8, 24]} />
              <meshStandardMaterial
                color={agentId === 'coo' ? '#eab308' : agentId === 'watson' ? '#94a3b8' : '#d97706'}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            <mesh position={[0, 0.015, 0]}>
              <boxGeometry args={[0.05, 0.006, 0.006]} />
              <meshStandardMaterial
                color={agentId === 'coo' ? '#eab308' : agentId === 'watson' ? '#94a3b8' : '#d97706'}
                metalness={0.8}
              />
            </mesh>
          </group>
        )}

        {/* CS Headset for Sherloc */}
        {agentId === 'sherloc' && (
          <group position={[0, -0.02, 0]}>
            <mesh position={[0, -0.16, 0.04]} rotation={[0.4, 0, 0]}>
              <torusGeometry args={[0.2, 0.025, 8, 24, Math.PI * 1.4]} />
              <meshStandardMaterial color="#1e293b" metalness={0.6} />
            </mesh>
            <mesh position={[-0.24, -0.06, 0]} rotation={[0, 0, 0.2]}>
              <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
              <meshStandardMaterial color="#d97706" />
            </mesh>
            <mesh position={[0.24, -0.06, 0]} rotation={[0, 0, -0.2]}>
              <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
              <meshStandardMaterial color="#d97706" />
            </mesh>
          </group>
        )}
      </group>

      {/* 2. TORSO / OUTFIT */}
      <group position={[0, 0.44, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.16, 0.2, 0.36, 16]} />
          <meshStandardMaterial color={preset.outfitColor} roughness={0.65} metalness={0.04} />
        </mesh>

        <mesh position={[0, 0.16, 0.08]} castShadow>
          <torusGeometry args={[0.14, 0.038, 8, 20]} />
          <meshStandardMaterial color={preset.secondaryColor} roughness={0.6} />
        </mesh>

        {/* Bottom Trousers/Skirt */}
        <mesh position={[0, -0.17, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.2, 0.1, 16]} />
          <meshStandardMaterial color={preset.bottomColor} roughness={0.65} metalness={0.04} />
        </mesh>
      </group>

      {/* 3. ARMS & HANDS EXTENDING FORWARD TO REST & TYPE ON KEYBOARD */}
      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.18, 0.54, 0.04]} rotation={[0.2, 0.1, 0]}>
        <mesh castShadow position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.042, 0.038, 0.24, 10]} />
          <meshStandardMaterial color={preset.outfitColor} roughness={0.65} />
        </mesh>
        {/* Clay Hand tapping on keyboard */}
        <mesh position={[0, -0.01, 0.25]} castShadow>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color={preset.skinColor} roughness={0.6} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.18, 0.54, 0.04]} rotation={[0.2, -0.1, 0]}>
        <mesh castShadow position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.042, 0.038, 0.24, 10]} />
          <meshStandardMaterial color={preset.outfitColor} roughness={0.65} />
        </mesh>
        {/* Clay Hand tapping on keyboard */}
        <mesh position={[0, -0.01, 0.25]} castShadow>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color={preset.skinColor} roughness={0.6} />
        </mesh>

        {/* Design Tablet for Scout on Desk */}
        {preset.prop === 'tablet' && (
          <group position={[0.08, -0.02, 0.22]} rotation={[-0.1, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.18, 0.008, 0.22]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            <mesh position={[0, 0.005, 0]}>
              <planeGeometry args={[0.16, 0.2]} />
              <meshBasicMaterial color="#fef08a" />
            </mesh>
          </group>
        )}
      </group>

      {/* 4. LEGS SEATED ON CHAIR */}
      <group position={[-0.09, 0.18, 0.06]} rotation={[1.35, 0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.05, 0.045, 0.26, 12]} />
          <meshStandardMaterial color={preset.bottomColor} roughness={0.65} />
        </mesh>
        <mesh position={[0, -0.15, 0.04]} castShadow>
          <boxGeometry args={[0.09, 0.07, 0.14]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
      </group>

      <group position={[0.09, 0.18, 0.06]} rotation={[1.35, 0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.05, 0.045, 0.26, 12]} />
          <meshStandardMaterial color={preset.bottomColor} roughness={0.65} />
        </mesh>
        <mesh position={[0, -0.15, 0.04]} castShadow>
          <boxGeometry args={[0.09, 0.07, 0.14]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
      </group>
    </group>
  )
}

/**
 * Main AgentAvatar Component (Classic Chibi 3D Model stationed at Workstations)
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

  const showActionCard = isSelected || hovered

  const handleApprove = () => {
    setIsApproved(true)
    setTimeout(() => setIsApproved(false), 3000)
  }

  return (
    <group position={position} rotation={rotation} name={`agent-avatar-${agent.id}`}>
      {/* 3D FLOATING ACTION CARD / COMPACT NAME PILL */}
      {!hideTooltip && (
        <Html
          position={[0, 1.45, 0]}
          center
          distanceFactor={11}
          zIndexRange={[1, 20]}
          style={{ pointerEvents: 'none' }}
        >
          {showActionCard ? (
            <div className="bg-white text-slate-900 border-2 border-slate-900 rounded-2xl shadow-2xl p-3.5 min-w-[250px] max-w-[280px] select-none text-left relative animate-in fade-in zoom-in-95 duration-200 pointer-events-auto">
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
                <span className="text-[10px] font-semibold text-slate-400">9m 58s Left</span>
              </div>

              <p className="text-[11px] leading-relaxed text-slate-600 font-medium mb-3 line-clamp-2">
                {preset.sampleTask || agent.description}
              </p>

              <div className="flex items-center justify-end gap-2 pt-1.5 border-t border-slate-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelect(agent)
                  }}
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-700 hover:text-slate-900 border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Review first
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleApprove()
                  }}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold text-white transition-all shadow-sm cursor-pointer ${
                    isApproved
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                  }`}
                >
                  {isApproved ? 'Approved ✔' : 'Approve'}
                </button>
              </div>

              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-6 border-x-transparent border-t-8 border-t-slate-900" />
              <div className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-0 h-0 border-x-5 border-x-transparent border-t-7 border-t-white" />
            </div>
          ) : (
            <div
              onClick={(e) => {
                e.stopPropagation()
                onSelect(agent)
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 hover:bg-slate-950 text-white shadow-xl border border-white/20 backdrop-blur-sm select-none transition-transform duration-200 hover:scale-105 relative cursor-pointer whitespace-nowrap pointer-events-auto"
            >
              <span className="text-xs leading-none">{preset.emoji}</span>
              <span className="text-[11px] font-black text-white tracking-tight leading-none">
                {agent.name}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0 ml-0.5" />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-x-3 border-x-transparent border-t-4 border-t-slate-900/90" />
            </div>
          )}
        </Html>
      )}

      {/* Hitbox Volume for Easy Clicking */}
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

      {/* Selection Ring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.38, 0.48, 32]} />
        <meshBasicMaterial
          color={preset.outfitColor}
          transparent
          opacity={isSelected ? 0.95 : hovered ? 0.65 : 0.25}
          depthWrite={false}
        />
      </mesh>

      {/* Classic 3D Clay Chibi Avatar */}
      <ClassicClayChibi
        agentId={agent.id}
        preset={preset}
        isHovered={hovered}
        isSelected={isSelected}
      />
    </group>
  )
}
