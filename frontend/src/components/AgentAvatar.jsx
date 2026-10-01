import React, { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Procedural Gather-Style Pixel Art Texture Generator
 * Creates authentic razor-sharp 16-bit retro pixel textures with THREE.NearestFilter.
 */
function useGatherPixelTextures(agentId) {
  return useMemo(() => {
    // 32x32 pixel face canvas
    const faceCanvas = document.createElement('canvas')
    faceCanvas.width = 32
    faceCanvas.height = 32
    const fctx = faceCanvas.getContext('2d')
    fctx.imageSmoothingEnabled = false

    // 32x32 pixel body canvas
    const bodyCanvas = document.createElement('canvas')
    bodyCanvas.width = 32
    bodyCanvas.height = 32
    const bctx = bodyCanvas.getContext('2d')
    bctx.imageSmoothingEnabled = false

    const p = (ctx, x, y, w, h, col) => {
      ctx.fillStyle = col
      ctx.fillRect(x, y, w, h)
    }

    // Default palette
    const skin = '#fcd34d'
    const skinShadow = '#f59e0b'
    const eye = '#0f172a'
    const eyeHighlight = '#ffffff'
    const blush = '#fda4af'

    // ==========================================
    // 1. FACE PIXEL ART
    // ==========================================
    // Skin base
    p(fctx, 4, 6, 24, 22, skin)
    p(fctx, 4, 26, 24, 2, skinShadow)

    if (agentId === 'coo') {
      // COO: Male executive. Dark hair, gold glasses, serious confident expression
      // Dark neat hair
      p(fctx, 2, 2, 28, 8, '#1e293b')
      p(fctx, 2, 8, 4, 10, '#1e293b')
      p(fctx, 26, 8, 4, 10, '#1e293b')
      p(fctx, 8, 8, 16, 3, '#334155')
      // Eyes
      p(fctx, 8, 16, 4, 4, eye)
      p(fctx, 20, 16, 4, 4, eye)
      p(fctx, 9, 16, 2, 2, eyeHighlight)
      p(fctx, 21, 16, 2, 2, eyeHighlight)
      // Gold executive glasses frame
      p(fctx, 6, 14, 8, 8, '#eab308')
      p(fctx, 7, 15, 6, 6, skin)
      p(fctx, 8, 16, 4, 4, eye)
      p(fctx, 9, 16, 2, 2, eyeHighlight)
      p(fctx, 18, 14, 8, 8, '#eab308')
      p(fctx, 19, 15, 6, 6, skin)
      p(fctx, 20, 16, 4, 4, eye)
      p(fctx, 21, 16, 2, 2, eyeHighlight)
      p(fctx, 14, 17, 4, 2, '#eab308') // Bridge
      // Mouth
      p(fctx, 14, 25, 4, 2, '#b45309')

    } else if (agentId === 'sherloc') {
      // Sherloc: Male Frontline CS. Brown swept hair, CS Headset
      // Brown casual swept hair
      p(fctx, 2, 2, 28, 9, '#78350f')
      p(fctx, 2, 9, 5, 10, '#78350f')
      p(fctx, 25, 9, 5, 10, '#78350f')
      p(fctx, 8, 9, 14, 4, '#92400e')
      // CS Headset headband over hair
      p(fctx, 1, 1, 30, 3, '#1e293b')
      p(fctx, 1, 11, 4, 8, '#d97706') // Ear cups
      p(fctx, 27, 11, 4, 8, '#d97706')
      // Eyes
      p(fctx, 8, 16, 4, 4, eye)
      p(fctx, 20, 16, 4, 4, eye)
      p(fctx, 9, 16, 2, 2, eyeHighlight)
      p(fctx, 21, 16, 2, 2, eyeHighlight)
      // Smile
      p(fctx, 13, 24, 6, 2, '#dc2626')

    } else if (agentId === 'watson') {
      // Watson: Male Tech Analyst. Deep navy hair, analyst glasses, smart focus
      // Deep navy/black hair
      p(fctx, 2, 2, 28, 9, '#0f172a')
      p(fctx, 2, 9, 4, 9, '#0f172a')
      p(fctx, 26, 9, 4, 9, '#0f172a')
      p(fctx, 6, 9, 8, 3, '#1e3a8a')
      // Slate glasses
      p(fctx, 7, 14, 7, 7, '#94a3b8')
      p(fctx, 8, 15, 5, 5, skin)
      p(fctx, 9, 16, 3, 3, eye)
      p(fctx, 10, 16, 1, 1, eyeHighlight)
      p(fctx, 18, 14, 7, 7, '#94a3b8')
      p(fctx, 19, 15, 5, 5, skin)
      p(fctx, 20, 16, 3, 3, eye)
      p(fctx, 21, 16, 1, 1, eyeHighlight)
      p(fctx, 14, 16, 4, 2, '#94a3b8')
      // Mouth
      p(fctx, 14, 25, 4, 2, '#b45309')

    } else if (agentId === 'nara') {
      // Nara: Female CS & Telemetry. Sky-blue bob cut, anime eyes, blush
      // Sky-blue pastel bob hair
      p(fctx, 2, 2, 28, 10, '#0284c7')
      p(fctx, 1, 8, 6, 18, '#38bdf8') // Bob side fringes
      p(fctx, 25, 8, 6, 18, '#38bdf8')
      p(fctx, 8, 10, 16, 3, '#38bdf8')
      // Feminine expressive pixel eyes
      p(fctx, 8, 15, 4, 5, eye)
      p(fctx, 20, 15, 4, 5, eye)
      p(fctx, 9, 15, 2, 2, eyeHighlight)
      p(fctx, 21, 15, 2, 2, eyeHighlight)
      p(fctx, 9, 18, 2, 2, '#38bdf8') // Blue pupil reflection
      p(fctx, 21, 18, 2, 2, '#38bdf8')
      // Sweet pink cheeks
      p(fctx, 6, 21, 4, 3, blush)
      p(fctx, 22, 21, 4, 3, blush)
      // Smile
      p(fctx, 14, 23, 4, 2, '#f43f5e')

    } else if (agentId === 'velocia') {
      // Velocia: Female Strategy Lead. Crimson wavy hair, feminine anime eyes, blush
      // Flowing crimson hair
      p(fctx, 2, 2, 28, 10, '#dc2626')
      p(fctx, 0, 8, 6, 22, '#ef4444') // Long flowing locks
      p(fctx, 26, 8, 6, 22, '#ef4444')
      p(fctx, 8, 10, 16, 4, '#f87171')
      // Feminine anime eyes
      p(fctx, 8, 15, 4, 5, eye)
      p(fctx, 20, 15, 4, 5, eye)
      p(fctx, 9, 15, 2, 2, eyeHighlight)
      p(fctx, 21, 15, 2, 2, eyeHighlight)
      p(fctx, 9, 18, 2, 2, '#ef4444')
      p(fctx, 21, 18, 2, 2, '#ef4444')
      // Blush
      p(fctx, 6, 21, 4, 3, blush)
      p(fctx, 22, 21, 4, 3, blush)
      // Red smile
      p(fctx, 14, 24, 4, 2, '#dc2626')

    } else {
      // Scout: Male/Mascot Content Creator. Amber hair, top bun, round glasses
      // Amber hair with top knot
      p(fctx, 2, 4, 28, 8, '#b45309')
      p(fctx, 12, 0, 8, 5, '#d97706') // Top bun
      p(fctx, 2, 10, 5, 8, '#b45309')
      p(fctx, 25, 10, 5, 8, '#b45309')
      // Round reading glasses
      p(fctx, 7, 14, 7, 7, '#d97706')
      p(fctx, 8, 15, 5, 5, skin)
      p(fctx, 9, 16, 3, 3, eye)
      p(fctx, 10, 16, 1, 1, eyeHighlight)
      p(fctx, 18, 14, 7, 7, '#d97706')
      p(fctx, 19, 15, 5, 5, skin)
      p(fctx, 20, 16, 3, 3, eye)
      p(fctx, 21, 16, 1, 1, eyeHighlight)
      p(fctx, 14, 16, 4, 2, '#d97706')
      // Smile
      p(fctx, 13, 24, 6, 2, '#f59e0b')
    }

    // ==========================================
    // 2. BODY / OUTFIT PIXEL ART
    // ==========================================
    if (agentId === 'coo') {
      // Slate/Charcoal executive suit, white collar, blue tie
      p(bctx, 4, 2, 24, 26, '#334155')
      p(bctx, 12, 2, 8, 6, '#ffffff') // Shirt collar
      p(bctx, 14, 6, 4, 14, '#1d4ed8') // Tie
      p(bctx, 4, 28, 24, 4, '#1e293b') // Belt/pants
    } else if (agentId === 'sherloc') {
      // Amber jacket with white inner shirt
      p(bctx, 4, 2, 24, 26, '#d97706')
      p(bctx, 12, 2, 8, 22, '#ffffff') // Inner tee
      p(bctx, 4, 28, 24, 4, '#334155')
    } else if (agentId === 'watson') {
      // Deep navy buttoned shirt
      p(bctx, 4, 2, 24, 26, '#1d4ed8')
      p(bctx, 14, 4, 4, 22, '#1e3a8a') // Placket
      p(bctx, 15, 8, 2, 2, '#ffffff')  // Buttons
      p(bctx, 15, 14, 2, 2, '#ffffff')
      p(bctx, 15, 20, 2, 2, '#ffffff')
      p(bctx, 4, 28, 24, 4, '#1e293b')
    } else if (agentId === 'nara') {
      // Sky blue tech vest with telemetry ID badge
      p(bctx, 4, 2, 24, 26, '#38bdf8')
      p(bctx, 13, 2, 6, 6, '#ffffff')
      p(bctx, 8, 10, 6, 8, '#0284c7')  // ID badge
      p(bctx, 9, 12, 4, 4, '#ffffff')
      p(bctx, 4, 28, 24, 4, '#0f172a')
    } else if (agentId === 'velocia') {
      // Coral red stylish blazer with white top
      p(bctx, 4, 2, 24, 26, '#ef4444')
      p(bctx, 12, 2, 8, 12, '#ffffff') // Inner blouse
      p(bctx, 4, 28, 24, 4, '#ffffff') // White pants
    } else {
      // Scout: Warm mustard knit sweater
      p(bctx, 4, 2, 24, 26, '#f59e0b')
      p(bctx, 6, 12, 8, 10, '#d97706') // Notebook pocket
      p(bctx, 4, 28, 24, 4, '#1e293b')
    }

    const faceTex = new THREE.CanvasTexture(faceCanvas)
    faceTex.magFilter = THREE.NearestFilter
    faceTex.minFilter = THREE.NearestFilter
    faceTex.colorSpace = THREE.SRGBColorSpace

    const bodyTex = new THREE.CanvasTexture(bodyCanvas)
    bodyTex.magFilter = THREE.NearestFilter
    bodyTex.minFilter = THREE.NearestFilter
    bodyTex.colorSpace = THREE.SRGBColorSpace

    return { faceTex, bodyTex }
  }, [agentId])
}

/**
 * 3D Gather-Style Pixel Art Chibi Character
 * Features authentic crisp pixel-textured box meshes with typing animations.
 */
function GatherPixelCharacter({ agentId, isHovered, isSelected }) {
  const { faceTex, bodyTex } = useGatherPixelTextures(agentId)
  const headRef = useRef()
  const leftArmRef = useRef()
  const rightArmRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    // Typing arm bounce on keyboard
    if (leftArmRef.current) {
      leftArmRef.current.position.y = 0.44 + Math.sin(t * 14) * 0.015
    }
    if (rightArmRef.current) {
      rightArmRef.current.position.y = 0.44 + Math.cos(t * 14) * 0.015
    }
    // Subtle head focus bobbing
    if (headRef.current) {
      headRef.current.rotation.x = 0.08 + Math.sin(t * 2.5) * 0.02
      headRef.current.rotation.y = Math.sin(t * 1.5) * 0.02
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* 1. HEAD WITH PIXEL ART FACE */}
      <group ref={headRef} position={[0, 0.78, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.46, 0.44, 0.42]} />
          <meshStandardMaterial map={faceTex} roughness={0.6} />
        </mesh>
      </group>

      {/* 2. TORSO WITH PIXEL ART OUTFIT */}
      <group position={[0, 0.42, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.38, 0.4, 0.28]} />
          <meshStandardMaterial map={bodyTex} roughness={0.6} />
        </mesh>
      </group>

      {/* 3. ARMS RESTING ON DESK TYPING AT KEYBOARD */}
      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.22, 0.44, 0.16]}>
        <mesh castShadow rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.1, 0.1, 0.32]} />
          <meshStandardMaterial color="#334155" roughness={0.6} />
        </mesh>
        {/* Pixel Hand */}
        <mesh position={[0, -0.02, 0.16]} castShadow>
          <boxGeometry args={[0.08, 0.06, 0.08]} />
          <meshStandardMaterial color="#fcd34d" roughness={0.6} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.22, 0.44, 0.16]}>
        <mesh castShadow rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.1, 0.1, 0.32]} />
          <meshStandardMaterial color="#334155" roughness={0.6} />
        </mesh>
        {/* Pixel Hand */}
        <mesh position={[0, -0.02, 0.16]} castShadow>
          <boxGeometry args={[0.08, 0.06, 0.08]} />
          <meshStandardMaterial color="#fcd34d" roughness={0.6} />
        </mesh>
      </group>

      {/* 4. LEGS SEATED ON CHAIR */}
      <group position={[-0.1, 0.18, 0.08]}>
        <mesh castShadow rotation={[1.4, 0, 0]}>
          <boxGeometry args={[0.12, 0.12, 0.28]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
      </group>
      <group position={[0.1, 0.18, 0.08]}>
        <mesh castShadow rotation={[1.4, 0, 0]}>
          <boxGeometry args={[0.12, 0.12, 0.28]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
      </group>
    </group>
  )
}

/**
 * Main AgentAvatar Component
 * Permanently and naturally seated at workstation desk typing on keyboard.
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

  const showActionCard = isSelected || hovered

  const handleApprove = () => {
    setIsApproved(true)
    setTimeout(() => setIsApproved(false), 3000)
  }

  // Sample tasks per agent
  const sampleTasks = {
    sherloc: 'WhatsApp Inbound: Validasi nomor pelanggan #CUST-9821 & triage otomatis aktif.',
    watson: 'Technical Escalation: Solusi firmware GPS disinkronkan ke Knowledge Base RAG.',
    nara: 'Telemetri Armada: 48 unit GPS offline terpantau, broadcast aman terjadwal.',
    velocia: 'Marketing OKR: Analisis pasar Fuel Sensor naik +142.8% siap dipresentasikan.',
    scout: 'Creative Content: Draf artikel edukasi kunci ganda & sensor Orin siap direview.',
    coo: 'Delegasi Eksekutif: 6 task cluster tersinkronisasi dengan Telegram Gateway.'
  }

  return (
    <group position={position} rotation={rotation} name={`agent-avatar-${agent.id}`}>
      {/* 3D Floating Action Card / Name Pill */}
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
                {sampleTasks[agent.id] || agent.description}
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
              <span className="text-[11px] font-bold text-white tracking-tight leading-none">
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

      {/* Selection Glow Ring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.38, 0.48, 32]} />
        <meshBasicMaterial
          color={agent.color || '#3b82f6'}
          transparent
          opacity={isSelected ? 0.95 : hovered ? 0.65 : 0.25}
          depthWrite={false}
        />
      </mesh>

      {/* 3D Gather-Style Pixel Chibi Character Seated at Desk */}
      <GatherPixelCharacter
        agentId={agent.id}
        isHovered={hovered}
        isSelected={isSelected}
      />
    </group>
  )
}
