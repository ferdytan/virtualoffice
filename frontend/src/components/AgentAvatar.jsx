import React, { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

/**
 * INSIDE OUT THEMATIC CHARACTER PRESETS
 *
 * 1. Sherloc (Joy):
 *    - Siluet: Ramping, dinamis, kepala sedikit lonjong dengan senyum lebar dan rambut runcing ringan (pixie cut spike).
 *    - Warna: Kuning terang hangat / Golden glow (#facc15). Gender: Pria.
 *
 * 2. Watson (Sadness):
 *    - Siluet: Bentuk membulat lembut (chubby teardrop body), kepala bulat besar dengan frame kacamata tebal khas peneliti/analis.
 *    - Warna: Biru tua indigo / Navy (#1d4ed8). Gender: Pria.
 *
 * 3. Velocia (Anger):
 *    - Siluet: Bentuk kotak kompak / kokoh (boxy silhouette), bahu tegap, alis tajam bersudut, ekspresi determinasi tinggi.
 *    - Warna: Merah bata / Ruby Crimson (#ef4444). Gender: Wanita.
 *
 * 4. Nara (Disgust):
 *    - Siluet: Anggun, proporsional elegan, syal/kerah mini, rambut bob rapi dengan ekspresi cermat mengamati layar.
 *    - Warna: Hijau mint / Teal pastel (#10b981). Gender: Wanita.
 *
 * 5. Scout (Fear):
 *    - Siluet: Tinggi kurus, sedikit membungkuk fokus, mata besar bulat ekspresif, memegang tablet/notebook.
 *    - Warna: Ungu muda / Lilac (#a855f7). Gender: Pria / Mascot.
 *
 * 6. Victor (Executive COO):
 *    - Siluet: Proporsi tegap formal (executive look), jas kerja simpel dengan garis tegas, rambut samping rapi, kacamata elegan.
 *    - Warna: Deep Slate / Charcoal (#334155). Gender: Pria.
 */
export const CHARACTER_PRESETS = {
  sherloc: {
    emoji: '☀️',
    archetype: 'joy',
    name: 'Sherloc',
    gender: 'male',
    roleTitle: 'Frontline Voice & Communicator',
    themeColor: '#facc15',
    secondaryColor: '#fef08a',
    accentColor: '#38bdf8',
    sampleTask: 'WhatsApp Inbound: Validasi nomor telepon pelanggan baru #CUST-9821 siap didelegasikan.'
  },
  watson: {
    emoji: '💧',
    archetype: 'sadness',
    name: 'Watson',
    gender: 'male',
    roleTitle: 'Technical Escalation & Knowledge Loop',
    themeColor: '#1d4ed8',
    secondaryColor: '#bfdbfe',
    accentColor: '#3b82f6',
    sampleTask: 'Technical Escalation: Solusi firmware GPS disinkronkan ke Knowledge Base Vector DB RAG.'
  },
  velocia: {
    emoji: '🔥',
    archetype: 'anger',
    name: 'Velocia',
    gender: 'female',
    roleTitle: 'Marketing Strategist & Lead',
    themeColor: '#ef4444',
    secondaryColor: '#fca5a5',
    accentColor: '#f97316',
    sampleTask: 'Strategi OKR: Analisis tren permintaan pasar Fuel Sensor naik +142.8% siap dipresentasikan.'
  },
  nara: {
    emoji: '🍃',
    archetype: 'disgust',
    name: 'Nara',
    gender: 'female',
    roleTitle: 'Telemetry CS & Server Diagnostics',
    themeColor: '#10b981',
    secondaryColor: '#a7f3d0',
    accentColor: '#f43f5e',
    sampleTask: 'Telemetri Armada: 48 unit GPS offline terdeteksi di rak server. Broadcast pengingat anti-banned terjadwal.'
  },
  scout: {
    emoji: '⚡',
    archetype: 'fear',
    name: 'Scout',
    gender: 'male',
    roleTitle: 'Content Creator & Strategic Copywriter',
    themeColor: '#a855f7',
    secondaryColor: '#e9d5ff',
    accentColor: '#dc2626',
    sampleTask: 'Draf Artikel: Mengapa Kunci Ganda Tak Cukup & Solusi Sensor Orin siap untuk review publikasi.'
  },
  coo: {
    emoji: '💼',
    archetype: 'executive',
    name: 'Victor COO',
    gender: 'male',
    roleTitle: 'Chief Operating Officer & Orchestrator',
    themeColor: '#334155',
    secondaryColor: '#cbd5e1',
    accentColor: '#fbbf24',
    sampleTask: 'Delegasi Eksekutif: 6 task cluster tersinkronisasi dengan Telegram Gateway Direktur.'
  }
}

/**
 * 1. JOY (Sherloc) - Ceria, Ramping & Energik
 */
function JoyCharacter({ preset, isHovered, isSelected }) {
  const headRef = useRef()
  const rightArmRef = useRef()
  const leftArmRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    // Dynamic bouncy idle & energetic head tilt
    if (headRef.current) {
      headRef.current.rotation.z = Math.sin(t * 3) * 0.04
      headRef.current.rotation.x = 0.06 + Math.sin(t * 4) * 0.02
    }
    // Quick, energetic typing keystrokes
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = 0.22 + Math.sin(t * 16) * 0.05
    }
    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = 0.22 + Math.cos(t * 16) * 0.05
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Head: Sedikit lonjong dengan senyum lebar */}
      <group ref={headRef} position={[0, 0.86, 0]}>
        {/* Slightly elongated head */}
        <mesh scale={[0.96, 1.06, 0.96]} castShadow receiveShadow>
          <sphereGeometry args={[0.24, 24, 24]} />
          <meshStandardMaterial color="#fef08a" roughness={0.6} />
        </mesh>

        {/* Pixie Cut Spikes (Stylized bright hair spikes pointing playfully upward) */}
        <group position={[0, 0.14, 0]}>
          {[-0.14, -0.07, 0, 0.07, 0.14].map((x, idx) => (
            <mesh
              key={idx}
              position={[x, 0.14 - Math.abs(x) * 0.3, -0.02]}
              rotation={[0.1, 0, -x * 1.5]}
              castShadow
            >
              <coneGeometry args={[0.045, 0.16, 8]} />
              <meshStandardMaterial color="#38bdf8" roughness={0.5} />
            </mesh>
          ))}
          {/* Back hair fill */}
          <mesh position={[0, 0.02, -0.08]} castShadow>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.5} />
          </mesh>
        </group>

        {/* Big Joyful Anime Eyes with Bright Sparkles */}
        {[-0.085, 0.085].map((x, idx) => (
          <group key={idx} position={[x, 0.02, 0.22]} rotation={[-0.04, x * 1.2, 0]}>
            <mesh>
              <circleGeometry args={[0.045, 20]} />
              <meshBasicMaterial color="#1e293b" />
            </mesh>
            <mesh position={[0, -0.005, 0.001]}>
              <circleGeometry args={[0.038, 20]} />
              <meshBasicMaterial color="#d97706" />
            </mesh>
            <mesh position={[-0.012, 0.012, 0.002]}>
              <circleGeometry args={[0.016, 12]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0.012, -0.012, 0.002]}>
              <circleGeometry args={[0.008, 12]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        ))}

        {/* Wide Joyful Smile */}
        <group position={[0, -0.11, 0.23]} rotation={[0.1, 0, 0]}>
          <mesh>
            <torusGeometry args={[0.05, 0.008, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#b45309" roughness={0.4} />
          </mesh>
          {/* Rosy cheeks */}
          <mesh position={[-0.12, 0.03, -0.02]}>
            <circleGeometry args={[0.028, 16]} />
            <meshBasicMaterial color="#fca5a5" transparent opacity={0.65} />
          </mesh>
          <mesh position={[0.12, 0.03, -0.02]}>
            <circleGeometry args={[0.028, 16]} />
            <meshBasicMaterial color="#fca5a5" transparent opacity={0.65} />
          </mesh>
        </group>

        {/* CS Headset with boom mic */}
        <group position={[0, 0.06, 0]}>
          <mesh>
            <torusGeometry args={[0.25, 0.012, 8, 24, Math.PI]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[-0.24, 0, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.045, 0.04, 16]} />
            <meshStandardMaterial color="#facc15" />
          </mesh>
          <mesh position={[0.24, 0, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.045, 0.04, 16]} />
            <meshStandardMaterial color="#facc15" />
          </mesh>
          {/* Mic boom */}
          <mesh position={[-0.24, -0.08, 0.12]} rotation={[0.4, 0.3, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.18, 8]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          <mesh position={[-0.18, -0.16, 0.20]}>
            <sphereGeometry args={[0.016, 10, 10]} />
            <meshStandardMaterial color="#facc15" />
          </mesh>
        </group>
      </group>

      {/* Torso: Ramping, dinamis (slender tapered body) */}
      <group position={[0, 0.42, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.13, 0.16, 0.40, 16]} />
          <meshStandardMaterial color="#facc15" roughness={0.6} />
        </mesh>
        {/* Clean collar accent */}
        <mesh position={[0, 0.18, 0.06]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.16, 0.04, 0.1]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
      </group>

      {/* Arms: Ramping lincah mengetik di keyboard */}
      <group ref={leftArmRef} position={[-0.17, 0.54, 0.04]} rotation={[0.22, 0.1, 0]}>
        <mesh castShadow position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.036, 0.032, 0.24, 10]} />
          <meshStandardMaterial color="#facc15" roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.01, 0.25]} castShadow>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial color="#fef08a" roughness={0.6} />
        </mesh>
      </group>

      <group ref={rightArmRef} position={[0.17, 0.54, 0.04]} rotation={[0.22, -0.1, 0]}>
        <mesh castShadow position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.036, 0.032, 0.24, 10]} />
          <meshStandardMaterial color="#facc15" roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.01, 0.25]} castShadow>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial color="#fef08a" roughness={0.6} />
        </mesh>
      </group>

      {/* Legs: Seated on Chair in Charcoal Trousers */}
      {[-0.08, 0.08].map((x, idx) => (
        <group key={idx} position={[x, 0.18, 0.06]} rotation={[1.35, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.045, 0.04, 0.26, 12]} />
            <meshStandardMaterial color="#334155" roughness={0.7} />
          </mesh>
          <mesh position={[0, -0.15, 0.04]} castShadow>
            <boxGeometry args={[0.08, 0.07, 0.14]} />
            <meshStandardMaterial color="#ffffff" roughness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/**
 * 2. SADNESS (Watson) - Bentuk Membulat Lembut (Chubby Teardrop Body) & Kacamata Tebal
 */
function SadnessCharacter({ preset, isHovered, isSelected }) {
  const headRef = useRef()
  const rightArmRef = useRef()
  const leftArmRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    // Calm, contemplative idle head tilt
    if (headRef.current) {
      headRef.current.rotation.z = Math.sin(t * 1.5) * 0.02
      headRef.current.rotation.x = 0.08 + Math.sin(t * 1.8) * 0.015
    }
    // Gentle, rhythmic analyst keystrokes
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = 0.18 + Math.sin(t * 8) * 0.025
    }
    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = 0.18 + Math.cos(t * 8) * 0.025
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Head: Bulat besar dengan kacamata tebal khas analis */}
      <group ref={headRef} position={[0, 0.84, 0]}>
        {/* Large Round Head */}
        <mesh scale={[1.05, 1.0, 1.05]} castShadow receiveShadow>
          <sphereGeometry args={[0.28, 24, 24]} />
          <meshStandardMaterial color="#bfdbfe" roughness={0.7} />
        </mesh>

        {/* Soft Side-Swept Blue Bob Hair */}
        <group position={[0, 0.08, -0.04]}>
          <mesh castShadow>
            <sphereGeometry args={[0.29, 24, 24]} />
            <meshStandardMaterial color="#1e3a8a" roughness={0.6} />
          </mesh>
          {/* Swept bangs across forehead */}
          <mesh position={[-0.08, 0.16, 0.14]} rotation={[0.2, 0.2, -0.4]} castShadow>
            <boxGeometry args={[0.26, 0.12, 0.14]} />
            <meshStandardMaterial color="#1e3a8a" roughness={0.6} />
          </mesh>
        </group>

        {/* Big Thick Researcher Glasses */}
        <group position={[0, 0.02, 0.24]}>
          {/* Left Frame */}
          <mesh position={[-0.095, 0, 0]}>
            <torusGeometry args={[0.075, 0.016, 16, 24]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.2} />
          </mesh>
          {/* Right Frame */}
          <mesh position={[0.095, 0, 0]}>
            <torusGeometry args={[0.075, 0.016, 16, 24]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.2} />
          </mesh>
          {/* Bridge */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.05, 0.014, 0.01]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          {/* Glass Lenses sheen */}
          <mesh position={[-0.095, 0, -0.002]}>
            <circleGeometry args={[0.065, 20]} />
            <meshStandardMaterial color="#93c5fd" transparent opacity={0.35} />
          </mesh>
          <mesh position={[0.095, 0, -0.002]}>
            <circleGeometry args={[0.065, 20]} />
            <meshStandardMaterial color="#93c5fd" transparent opacity={0.35} />
          </mesh>
        </group>

        {/* Thoughtful Eyes behind glasses */}
        {[-0.095, 0.095].map((x, idx) => (
          <group key={idx} position={[x, 0.02, 0.23]}>
            <mesh>
              <circleGeometry args={[0.042, 20]} />
              <meshBasicMaterial color="#1e293b" />
            </mesh>
            <mesh position={[0, -0.004, 0.001]}>
              <circleGeometry args={[0.034, 20]} />
              <meshBasicMaterial color="#1d4ed8" />
            </mesh>
            <mesh position={[-0.01, 0.01, 0.002]}>
              <circleGeometry args={[0.012, 12]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        ))}

        {/* Gentle, modest mouth */}
        <mesh position={[0, -0.12, 0.25]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.06, 0.01, 0.01]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
      </group>

      {/* Torso: Chubby Teardrop Body (Soft pear shape sweater) */}
      <group position={[0, 0.38, 0]}>
        {/* Soft rounded sweater belly */}
        <mesh scale={[1.18, 0.96, 1.14]} castShadow receiveShadow>
          <sphereGeometry args={[0.27, 24, 24]} />
          <meshStandardMaterial color="#1d4ed8" roughness={0.8} />
        </mesh>
        {/* High Ribbed Turtleneck Collar */}
        <mesh position={[0, 0.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.13, 0.048, 12, 24]} />
          <meshStandardMaterial color="#1e40af" roughness={0.85} />
        </mesh>
      </group>

      {/* Arms: Chubby rounded sleeves with hands resting on keyboard */}
      <group ref={leftArmRef} position={[-0.20, 0.50, 0.05]} rotation={[0.18, 0.08, 0]}>
        <mesh castShadow position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.052, 0.22, 12]} />
          <meshStandardMaterial color="#1d4ed8" roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.01, 0.24]} castShadow>
          <sphereGeometry args={[0.046, 12, 12]} />
          <meshStandardMaterial color="#bfdbfe" roughness={0.7} />
        </mesh>
      </group>

      <group ref={rightArmRef} position={[0.20, 0.50, 0.05]} rotation={[0.18, -0.08, 0]}>
        <mesh castShadow position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.052, 0.22, 12]} />
          <meshStandardMaterial color="#1d4ed8" roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.01, 0.24]} castShadow>
          <sphereGeometry args={[0.046, 12, 12]} />
          <meshStandardMaterial color="#bfdbfe" roughness={0.7} />
        </mesh>
      </group>

      {/* Legs: Chubby seated legs in navy trousers */}
      {[-0.10, 0.10].map((x, idx) => (
        <group key={idx} position={[x, 0.18, 0.06]} rotation={[1.35, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.055, 0.048, 0.24, 12]} />
            <meshStandardMaterial color="#1e293b" roughness={0.7} />
          </mesh>
          <mesh position={[0, -0.14, 0.04]} castShadow>
            <boxGeometry args={[0.09, 0.08, 0.14]} />
            <meshStandardMaterial color="#ffffff" roughness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/**
 * 3. ANGER (Velocia) - Bentuk Kotak Kompak (Boxy Silhouette), Bahu Tegap & Berapi-api
 */
function AngerCharacter({ preset, isHovered, isSelected }) {
  const headRef = useRef()
  const rightArmRef = useRef()
  const leftArmRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    // Firm, determined head movements
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 2) * 0.03
      headRef.current.rotation.x = 0.04 + Math.sin(t * 3) * 0.01
    }
    // Sturdy, decisive keystrokes
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = 0.22 + Math.sin(t * 14) * 0.04
    }
    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = 0.22 + Math.cos(t * 14) * 0.04
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Head: Boxy compact head with strong jawline & fiery crown */}
      <group ref={headRef} position={[0, 0.82, 0]}>
        {/* Boxy head mesh */}
        <mesh scale={[1.12, 0.94, 0.98]} castShadow receiveShadow>
          <boxGeometry args={[0.38, 0.32, 0.32]} />
          <meshStandardMaterial color="#f87171" roughness={0.6} />
        </mesh>

        {/* Crown of Fiery Spikes (Blazing hair flames) */}
        <group position={[0, 0.16, 0]}>
          {[-0.14, -0.07, 0, 0.07, 0.14].map((x, idx) => (
            <mesh
              key={idx}
              position={[x, 0.12 - Math.abs(x) * 0.2, 0]}
              rotation={[0.1, 0, -x * 1.8]}
              castShadow
            >
              <coneGeometry args={[0.045, 0.20, 8]} />
              <meshStandardMaterial
                color={idx % 2 === 0 ? '#ef4444' : '#f97316'}
                emissive={idx % 2 === 0 ? '#dc2626' : '#ea580c'}
                emissiveIntensity={0.6}
              />
            </mesh>
          ))}
        </group>

        {/* Sharp V-Angled Determined Eyebrows */}
        <group position={[-0.08, 0.08, 0.165]} rotation={[0, 0, -0.32]}>
          <mesh>
            <boxGeometry args={[0.10, 0.024, 0.015]} />
            <meshStandardMaterial color="#991b1b" />
          </mesh>
        </group>
        <group position={[0.08, 0.08, 0.165]} rotation={[0, 0, 0.32]}>
          <mesh>
            <boxGeometry args={[0.10, 0.024, 0.015]} />
            <meshStandardMaterial color="#991b1b" />
          </mesh>
        </group>

        {/* Determined Sharp Eyes */}
        {[-0.08, 0.08].map((x, idx) => (
          <group key={idx} position={[x, 0.02, 0.165]}>
            <mesh>
              <boxGeometry args={[0.065, 0.045, 0.01]} />
              <meshBasicMaterial color="#1e293b" />
            </mesh>
            <mesh position={[0, -0.005, 0.001]}>
              <circleGeometry args={[0.022, 16]} />
              <meshBasicMaterial color="#ef4444" />
            </mesh>
            <mesh position={[-0.008, 0.008, 0.002]}>
              <circleGeometry args={[0.008, 10]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        ))}

        {/* Resolute, firm mouth */}
        <mesh position={[0, -0.09, 0.165]}>
          <boxGeometry args={[0.10, 0.016, 0.01]} />
          <meshStandardMaterial color="#7f1d1d" />
        </mesh>
      </group>

      {/* Torso: Boxy Silhouette (Compact, broad-shouldered ruby crimson blazer) */}
      <group position={[0, 0.40, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.42, 0.38, 0.30]} />
          <meshStandardMaterial color="#ef4444" roughness={0.65} />
        </mesh>
        {/* White shirt insert */}
        <mesh position={[0, 0.08, 0.152]}>
          <boxGeometry args={[0.14, 0.22, 0.01]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
        {/* Crimson necktie */}
        <mesh position={[0, 0.02, 0.158]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.04, 0.18, 0.01]} />
          <meshStandardMaterial color="#991b1b" />
        </mesh>
        {/* Broad shoulder pads */}
        {[-0.20, 0.20].map((x, idx) => (
          <mesh key={idx} position={[x, 0.16, 0]} castShadow>
            <boxGeometry args={[0.06, 0.06, 0.28]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
        ))}
      </group>

      {/* Arms: Solid sturdy arms with sharp typing cadence */}
      <group ref={leftArmRef} position={[-0.22, 0.52, 0.04]} rotation={[0.22, 0.12, 0]}>
        <mesh castShadow position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.07, 0.07, 0.24]} />
          <meshStandardMaterial color="#dc2626" roughness={0.65} />
        </mesh>
        <mesh position={[0, -0.01, 0.25]} castShadow>
          <sphereGeometry args={[0.042, 12, 12]} />
          <meshStandardMaterial color="#f87171" roughness={0.6} />
        </mesh>
      </group>

      <group ref={rightArmRef} position={[0.22, 0.52, 0.04]} rotation={[0.22, -0.12, 0]}>
        <mesh castShadow position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.07, 0.07, 0.24]} />
          <meshStandardMaterial color="#dc2626" roughness={0.65} />
        </mesh>
        <mesh position={[0, -0.01, 0.25]} castShadow>
          <sphereGeometry args={[0.042, 12, 12]} />
          <meshStandardMaterial color="#f87171" roughness={0.6} />
        </mesh>
      </group>

      {/* Legs: Sturdy seated trousers */}
      {[-0.09, 0.09].map((x, idx) => (
        <group key={idx} position={[x, 0.18, 0.06]} rotation={[1.35, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.09, 0.08, 0.26]} />
            <meshStandardMaterial color="#1e293b" roughness={0.7} />
          </mesh>
          <mesh position={[0, -0.14, 0.04]} castShadow>
            <boxGeometry args={[0.09, 0.07, 0.14]} />
            <meshStandardMaterial color="#ffffff" roughness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/**
 * 4. DISGUST (Nara) - Anggun, Proporsional Elegan, Syal Mini & Rambut Bob Rapi
 */
function DisgustCharacter({ preset, isHovered, isSelected }) {
  const headRef = useRef()
  const rightArmRef = useRef()
  const leftArmRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    // Graceful, precise head movements observing telemetry
    if (headRef.current) {
      headRef.current.rotation.z = Math.sin(t * 2) * 0.02
      headRef.current.rotation.x = 0.06 + Math.sin(t * 2.5) * 0.015
    }
    // Refined, rhythmic typing
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = 0.20 + Math.sin(t * 11) * 0.03
    }
    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = 0.20 + Math.cos(t * 11) * 0.03
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Head: Anggun, proporsional dengan rambut bob rapi mengkilap */}
      <group ref={headRef} position={[0, 0.84, 0]}>
        {/* Elegant oval head */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.23, 24, 24]} />
          <meshStandardMaterial color="#d1fae5" roughness={0.55} />
        </mesh>

        {/* Neat Glossy Bob Cut Hair with Inward Curls */}
        <group position={[0, 0.06, -0.02]}>
          <mesh castShadow>
            <sphereGeometry args={[0.25, 24, 24]} />
            <meshStandardMaterial color="#047857" roughness={0.4} />
          </mesh>
          {/* Bob side drapes */}
          {[-0.14, 0.14].map((x, idx) => (
            <mesh key={idx} position={[x, -0.12, 0.02]} rotation={[0, 0, x * 0.5]} castShadow>
              <cylinderGeometry args={[0.07, 0.09, 0.22, 16]} />
              <meshStandardMaterial color="#047857" roughness={0.4} />
            </mesh>
          ))}
          {/* Back curl */}
          <mesh position={[0, -0.14, -0.08]} castShadow>
            <cylinderGeometry args={[0.22, 0.24, 0.18, 16]} />
            <meshStandardMaterial color="#047857" roughness={0.4} />
          </mesh>
        </group>

        {/* Discerning Almond Eyes with Anime Eyelashes */}
        {[-0.08, 0.08].map((x, idx) => (
          <group key={idx} position={[x, 0.02, 0.215]} rotation={[-0.04, x * 1.0, 0]}>
            <mesh>
              <circleGeometry args={[0.040, 20]} />
              <meshBasicMaterial color="#1e293b" />
            </mesh>
            <mesh position={[0, -0.004, 0.001]}>
              <circleGeometry args={[0.032, 20]} />
              <meshBasicMaterial color="#10b981" />
            </mesh>
            <mesh position={[-0.01, 0.01, 0.002]}>
              <circleGeometry args={[0.012, 12]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            {/* Eyelash wing */}
            <mesh position={[x > 0 ? 0.03 : -0.03, 0.025, 0.002]} rotation={[0, 0, x > 0 ? 0.4 : -0.4]}>
              <boxGeometry args={[0.025, 0.008, 0.001]} />
              <meshBasicMaterial color="#064e3b" />
            </mesh>
          </group>
        ))}

        {/* Stylish arched eyebrow */}
        <group position={[-0.08, 0.075, 0.215]} rotation={[0, 0, 0.1]}>
          <boxGeometry args={[0.06, 0.012, 0.005]} />
          <meshStandardMaterial color="#064e3b" />
        </group>
        <group position={[0.08, 0.085, 0.215]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.06, 0.012, 0.005]} />
          <meshStandardMaterial color="#064e3b" />
        </group>

        {/* Small Stylish Smirk */}
        <mesh position={[0.02, -0.10, 0.22]}>
          <torusGeometry args={[0.025, 0.006, 8, 12, Math.PI * 0.8]} />
          <meshStandardMaterial color="#047857" />
        </mesh>

        {/* Telemetry Ear Communicator Pin */}
        <mesh position={[-0.23, 0.02, 0]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshStandardMaterial color="#f43f5e" emissive="#f43f5e" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* Torso: Anggun, proporsional elegan (tapered mint dress) */}
      <group position={[0, 0.42, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.11, 0.15, 0.42, 16]} />
          <meshStandardMaterial color="#10b981" roughness={0.6} />
        </mesh>

        {/* Signature Stylish Ascot Scarf (Pink/Magenta mini scarf around neck) */}
        <group position={[0, 0.20, 0.08]}>
          {/* Scarf knot */}
          <mesh position={[0, 0, 0]} castShadow>
            <sphereGeometry args={[0.038, 12, 12]} />
            <meshStandardMaterial color="#f43f5e" roughness={0.5} />
          </mesh>
          {/* Flowing scarf tails */}
          <mesh position={[-0.03, -0.06, 0.02]} rotation={[0.2, 0, 0.3]} castShadow>
            <boxGeometry args={[0.04, 0.12, 0.012]} />
            <meshStandardMaterial color="#f43f5e" roughness={0.5} />
          </mesh>
          <mesh position={[0.03, -0.07, 0.02]} rotation={[0.2, 0, -0.3]} castShadow>
            <boxGeometry args={[0.04, 0.14, 0.012]} />
            <meshStandardMaterial color="#f43f5e" roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* Arms: Slender elegant hands typing gracefully */}
      <group ref={leftArmRef} position={[-0.16, 0.54, 0.04]} rotation={[0.20, 0.08, 0]}>
        <mesh castShadow position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.034, 0.030, 0.24, 10]} />
          <meshStandardMaterial color="#10b981" roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.01, 0.25]} castShadow>
          <sphereGeometry args={[0.038, 12, 12]} />
          <meshStandardMaterial color="#d1fae5" roughness={0.6} />
        </mesh>
      </group>

      <group ref={rightArmRef} position={[0.16, 0.54, 0.04]} rotation={[0.20, -0.08, 0]}>
        <mesh castShadow position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.034, 0.030, 0.24, 10]} />
          <meshStandardMaterial color="#10b981" roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.01, 0.25]} castShadow>
          <sphereGeometry args={[0.038, 12, 12]} />
          <meshStandardMaterial color="#d1fae5" roughness={0.6} />
        </mesh>
      </group>

      {/* Legs: Slender slacks */}
      {[-0.075, 0.075].map((x, idx) => (
        <group key={idx} position={[x, 0.18, 0.06]} rotation={[1.35, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.042, 0.036, 0.26, 12]} />
            <meshStandardMaterial color="#064e3b" roughness={0.7} />
          </mesh>
          <mesh position={[0, -0.15, 0.04]} castShadow>
            <boxGeometry args={[0.075, 0.065, 0.14]} />
            <meshStandardMaterial color="#f43f5e" roughness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/**
 * 5. FEAR (Scout) - Tinggi Kurus, Waspada, Mata Bulat Besar & Tablet Kerja
 */
function FearCharacter({ preset, isHovered, isSelected }) {
  const headRef = useRef()
  const rightArmRef = useRef()
  const leftArmRef = useRef()
  const antennaRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    // Alert, slightly nervous twitchy head
    if (headRef.current) {
      headRef.current.rotation.z = Math.sin(t * 5) * 0.02
      headRef.current.rotation.x = 0.08 + Math.sin(t * 6) * 0.02
    }
    // Twitchy hair antenna
    if (antennaRef.current) {
      antennaRef.current.rotation.z = Math.sin(t * 8) * 0.15
    }
    // Fast keystrokes
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = 0.24 + Math.sin(t * 20) * 0.04
    }
    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = 0.24 + Math.cos(t * 20) * 0.04
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Head: Tapered slender head, big alert eyes, twitchy antenna hair strand */}
      <group ref={headRef} position={[0, 0.88, 0.04]}>
        {/* Tapered oval head */}
        <mesh scale={[0.92, 1.12, 0.92]} castShadow receiveShadow>
          <sphereGeometry args={[0.21, 24, 24]} />
          <meshStandardMaterial color="#ede9fe" roughness={0.6} />
        </mesh>

        {/* Expressive Curled Hair Antenna Strand */}
        <group ref={antennaRef} position={[0, 0.24, 0]}>
          <mesh position={[0, 0.08, 0]} rotation={[0, 0, 0.3]}>
            <cylinderGeometry args={[0.008, 0.012, 0.18, 8]} />
            <meshStandardMaterial color="#7e22ce" />
          </mesh>
          <mesh position={[0.05, 0.18, 0]}>
            <sphereGeometry args={[0.025, 10, 10]} />
            <meshStandardMaterial color="#7e22ce" />
          </mesh>
        </group>

        {/* Big Wide Alert Eyes */}
        {[-0.08, 0.08].map((x, idx) => (
          <group key={idx} position={[x, 0.02, 0.19]} rotation={[-0.04, x * 0.8, 0]}>
            <mesh>
              <circleGeometry args={[0.055, 20]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, 0, 0.001]}>
              <circleGeometry args={[0.046, 20]} />
              <meshBasicMaterial color="#1e1b4b" />
            </mesh>
            <mesh position={[0, -0.003, 0.002]}>
              <circleGeometry args={[0.038, 20]} />
              <meshBasicMaterial color="#a855f7" />
            </mesh>
            <mesh position={[-0.01, 0.01, 0.003]}>
              <circleGeometry args={[0.014, 12]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        ))}

        {/* Worried / Vigilant Eyebrows */}
        <group position={[-0.08, 0.09, 0.19]} rotation={[0, 0, 0.25]}>
          <boxGeometry args={[0.07, 0.014, 0.005]} />
          <meshStandardMaterial color="#581c87" />
        </group>
        <group position={[0.08, 0.09, 0.19]} rotation={[0, 0, -0.25]}>
          <boxGeometry args={[0.07, 0.014, 0.005]} />
          <meshStandardMaterial color="#581c87" />
        </group>

        {/* Small nervous mouth */}
        <mesh position={[0, -0.10, 0.20]}>
          <circleGeometry args={[0.018, 16]} />
          <meshBasicMaterial color="#4a044e" />
        </mesh>
      </group>

      {/* Torso: Tinggi kurus, membungkuk fokus (slender lilac sweater vest) */}
      <group position={[0, 0.42, 0]} rotation={[0.08, 0, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.09, 0.12, 0.48, 16]} />
          <meshStandardMaterial color="#a855f7" roughness={0.7} />
        </mesh>
        {/* White shirt collar */}
        <mesh position={[0, 0.22, 0.05]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.13, 0.04, 0.08]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
        {/* Miniature Red Bow Tie */}
        <mesh position={[0, 0.20, 0.10]} castShadow>
          <boxGeometry args={[0.06, 0.028, 0.02]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
      </group>

      {/* Arms: Slender arms typing with tablet on desk */}
      <group ref={leftArmRef} position={[-0.14, 0.54, 0.04]} rotation={[0.24, 0.08, 0]}>
        <mesh castShadow position={[0, 0, 0.14]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.030, 0.026, 0.28, 10]} />
          <meshStandardMaterial color="#a855f7" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.01, 0.28]} castShadow>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#ede9fe" roughness={0.6} />
        </mesh>
      </group>

      <group ref={rightArmRef} position={[0.14, 0.54, 0.04]} rotation={[0.24, -0.08, 0]}>
        <mesh castShadow position={[0, 0, 0.14]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.030, 0.026, 0.28, 10]} />
          <meshStandardMaterial color="#a855f7" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.01, 0.28]} castShadow>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#ede9fe" roughness={0.6} />
        </mesh>

        {/* Digital Notepad / Tablet on Desk */}
        <group position={[0.14, -0.04, 0.24]} rotation={[-0.1, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.18, 0.008, 0.22]} />
            <meshStandardMaterial color="#1e1b4b" />
          </mesh>
          <mesh position={[0, 0.005, 0]}>
            <planeGeometry args={[0.16, 0.20]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>
        </group>
      </group>

      {/* Legs: Tall thin slacks */}
      {[-0.065, 0.065].map((x, idx) => (
        <group key={idx} position={[x, 0.18, 0.06]} rotation={[1.35, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.036, 0.030, 0.30, 12]} />
            <meshStandardMaterial color="#3b0764" roughness={0.7} />
          </mesh>
          <mesh position={[0, -0.16, 0.04]} castShadow>
            <boxGeometry args={[0.07, 0.06, 0.14]} />
            <meshStandardMaterial color="#ffffff" roughness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/**
 * 6. VICTOR (COO) - Proporsi Tegap Formal (Executive Look), Rambut Samping Rapi & Kacamata Elegan
 */
function ExecutiveCOOCharacter({ preset, isHovered, isSelected }) {
  const headRef = useRef()
  const rightArmRef = useRef()
  const leftArmRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    // Composed, visionary leadership posture
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 1.2) * 0.02
      headRef.current.rotation.x = 0.05 + Math.sin(t * 1.5) * 0.01
    }
    // Measured, authoritative keystrokes
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = 0.20 + Math.sin(t * 10) * 0.03
    }
    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = 0.20 + Math.cos(t * 10) * 0.03
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Head: Proporsional, rambut sisir samping rapi eksekutif & kacamata emas */}
      <group ref={headRef} position={[0, 0.88, 0]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.26, 24, 24]} />
          <meshStandardMaterial color="#ffedd5" roughness={0.6} />
        </mesh>

        {/* Neat Executive Side-Part Hair */}
        <group position={[0, 0.10, -0.03]}>
          <mesh castShadow>
            <sphereGeometry args={[0.27, 24, 24]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} />
          </mesh>
          {/* Side part comb */}
          <mesh position={[0.06, 0.14, 0.14]} rotation={[0.3, 0.2, -0.3]} castShadow>
            <boxGeometry args={[0.22, 0.07, 0.14]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} />
          </mesh>
        </group>

        {/* Elegant Gold-Rimmed Executive Glasses */}
        <group position={[0, 0.02, 0.24]}>
          {[-0.09, 0.09].map((x, idx) => (
            <mesh key={idx} position={[x, 0, 0]}>
              <boxGeometry args={[0.11, 0.065, 0.012]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
            </mesh>
          ))}
          {/* Bridge */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.06, 0.012, 0.01]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.8} />
          </mesh>
        </group>

        {/* Focused Executive Eyes behind glasses */}
        {[-0.09, 0.09].map((x, idx) => (
          <group key={idx} position={[x, 0.02, 0.23]}>
            <mesh>
              <circleGeometry args={[0.038, 20]} />
              <meshBasicMaterial color="#1e293b" />
            </mesh>
            <mesh position={[0, -0.003, 0.001]}>
              <circleGeometry args={[0.030, 20]} />
              <meshBasicMaterial color="#475569" />
            </mesh>
            <mesh position={[-0.01, 0.01, 0.002]}>
              <circleGeometry args={[0.010, 10]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        ))}

        {/* Calm, visionary expression */}
        <mesh position={[0, -0.11, 0.24]}>
          <boxGeometry args={[0.08, 0.014, 0.01]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
      </group>

      {/* Torso: Proporsi Tegap Formal (Executive Charcoal Suit) */}
      <group position={[0, 0.44, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.42, 0.46, 0.30]} />
          <meshStandardMaterial color="#334155" roughness={0.65} />
        </mesh>
        {/* Crisp white dress shirt */}
        <mesh position={[0, 0.12, 0.152]}>
          <boxGeometry args={[0.14, 0.24, 0.01]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
        {/* Silk royal navy tie */}
        <mesh position={[0, 0.04, 0.158]}>
          <boxGeometry args={[0.045, 0.22, 0.01]} />
          <meshStandardMaterial color="#1d4ed8" />
        </mesh>
      </group>

      {/* Arms: Authoritative sleeves with measured keystrokes */}
      <group ref={leftArmRef} position={[-0.22, 0.56, 0.04]} rotation={[0.20, 0.10, 0]}>
        <mesh castShadow position={[0, 0, 0.14]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.07, 0.07, 0.26]} />
          <meshStandardMaterial color="#334155" roughness={0.65} />
        </mesh>
        <mesh position={[0, -0.01, 0.27]} castShadow>
          <sphereGeometry args={[0.044, 12, 12]} />
          <meshStandardMaterial color="#ffedd5" roughness={0.6} />
        </mesh>
      </group>

      <group ref={rightArmRef} position={[0.22, 0.56, 0.04]} rotation={[0.20, -0.10, 0]}>
        <mesh castShadow position={[0, 0, 0.14]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.07, 0.07, 0.26]} />
          <meshStandardMaterial color="#334155" roughness={0.65} />
        </mesh>
        <mesh position={[0, -0.01, 0.27]} castShadow>
          <sphereGeometry args={[0.044, 12, 12]} />
          <meshStandardMaterial color="#ffedd5" roughness={0.6} />
        </mesh>
      </group>

      {/* Legs: Executive suit slacks */}
      {[-0.09, 0.09].map((x, idx) => (
        <group key={idx} position={[x, 0.18, 0.06]} rotation={[1.35, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.09, 0.08, 0.26]} />
            <meshStandardMaterial color="#1e293b" roughness={0.7} />
          </mesh>
          <mesh position={[0, -0.14, 0.04]} castShadow>
            <boxGeometry args={[0.09, 0.07, 0.14]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/**
 * Dispatcher for Inside Out Characters
 */
export function InsideOutCharacter({
  agentId,
  preset,
  isHovered,
  isSelected
}) {
  const archetype = preset?.archetype || agentId

  switch (archetype) {
    case 'joy':
    case 'sherloc':
      return <JoyCharacter preset={preset} isHovered={isHovered} isSelected={isSelected} />
    case 'sadness':
    case 'watson':
      return <SadnessCharacter preset={preset} isHovered={isHovered} isSelected={isSelected} />
    case 'anger':
    case 'velocia':
      return <AngerCharacter preset={preset} isHovered={isHovered} isSelected={isSelected} />
    case 'disgust':
    case 'nara':
      return <DisgustCharacter preset={preset} isHovered={isHovered} isSelected={isSelected} />
    case 'fear':
    case 'scout':
      return <FearCharacter preset={preset} isHovered={isHovered} isSelected={isSelected} />
    case 'executive':
    case 'coo':
    default:
      return <ExecutiveCOOCharacter preset={preset} isHovered={isHovered} isSelected={isSelected} />
  }
}

/**
 * Main AgentAvatar Component
 * Features:
 * 1. Inside Out Distinct Silhouettes & Body Proportions
 * 2. High-Performance Invisible Raycast Collider Hitbox (easy clicking)
 * 3. 3D Floating Action Card & Selection Ring
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
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: preset.themeColor }}
                  />
                  <span className="text-xs font-black tracking-tight text-slate-900 leading-none">
                    {agent.name}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400">Online</span>
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
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0 ml-0.5"
                style={{ backgroundColor: preset.themeColor }}
              />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-x-3 border-x-transparent border-t-4 border-t-slate-900/90" />
            </div>
          )}
        </Html>
      )}

      {/* INTERACTIVE GROUP WITH INVISIBLE RAYCAST COLLIDER HITBOX */}
      <group
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
        {/* Visual Mesh Karakter Inside Out */}
        <InsideOutCharacter
          agentId={agent.id}
          preset={preset}
          isHovered={hovered}
          isSelected={isSelected}
        />

        {/* Invisible Hitbox Besar untuk memudahkan klik tanpa pixel precision */}
        <mesh position={[0, 0.75, 0]}>
          <cylinderGeometry args={[0.7, 0.7, 1.8, 16]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>

      {/* Selection Glow Ring on Floor */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.38, 0.48, 32]} />
        <meshBasicMaterial
          color={preset.themeColor}
          transparent
          opacity={isSelected ? 0.95 : hovered ? 0.65 : 0.25}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
