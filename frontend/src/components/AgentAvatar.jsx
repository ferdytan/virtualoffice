import React, { useRef, useEffect, useMemo, useState } from 'react'
import { useGLTF, useAnimations, Html } from '@react-three/drei'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js'
import * as THREE from 'three'

/**
 * AgentAvatar Component
 * Uses the authentic rigged 3D character model from The Delegation (character.glb).
 * 
 * - Pure, clean, accessory-free glossy chibi character (no clunky hats or headphones)
 * - Authentic expressive textured eyes and mouth
 * - Vibrant solid colors (#38bdf8 for Nara, #ef4444 for Velocia, #22c55e for Scout)
 * - Skeletal animations: Sit_Work typing at desk by default, smoothly crossfading to Wave on hover/select
 * - Floating badge: Sleek black pill badge with blinking red dot and role title above head
 * - Floor selection glow ring
 */
export default function AgentAvatar({
  agent,
  isSelected,
  onSelect,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  initialAnimation = 'Sit_Work'
}) {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)

  // Load character.glb with local draco decoders
  const { scene, animations } = useGLTF('/models/character.glb', '/draco/')
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { actions } = useAnimations(animations, groupRef)

  // Configure materials: clean glossy finish, NO ACCESSORIES
  useEffect(() => {
    if (!clone) return
    const agentColor = new THREE.Color(agent.color || '#ef4444')

    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true

        if (child.name === 'body') {
          // Clean, smooth, vibrant solid claymorphic finish
          child.material = new THREE.MeshStandardMaterial({
            color: agentColor,
            roughness: 0.32,
            metalness: 0.05
          })
        } else if (child.name === 'eyes' || child.name === 'mouth') {
          // Keep authentic textured expressive face features
          child.renderOrder = 2
        } else if (child.name === 'cap' || child.name === 'headphones') {
          // Completely hide all accessories for clean, iconic chibi look
          child.visible = false
        }
      }
    })
  }, [clone, agent.color])

  // Play animation: Sit_Work typing by default, Wave on hover/select
  useEffect(() => {
    if (!actions) return
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
  }, [actions, hovered, isSelected, initialAnimation])

  const agentColor = agent.color || '#38bdf8'

  return (
    <group
      ref={groupRef}
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
            {/* Blinking Red Dot */}
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

      {/* --- Cloned 3D Rigged Model Primitive --- */}
      <primitive object={clone} />
    </group>
  )
}

useGLTF.preload('/models/character.glb', '/draco/')
