import React, { useRef, useEffect, useMemo, useState } from 'react'
import { useGLTF, useAnimations, Html } from '@react-three/drei'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js'
import * as THREE from 'three'

/**
 * AgentAvatar Component
 * Uses the authentic rigged 3D character model from The Delegation (character.glb).
 * 
 * FIXES IMPLEMENTED:
 * 1. Head accessories: The unrigged static meshes in character.glb (which previously floated
 *    detached from the moving head) are hidden. In their place, clean, perfectly-fitted
 *    accessories are parented directly to the skeletal 'head' bone so they move 100% in sync
 *    with every head nod, tilt, and animation without any distortion or floating.
 * 2. Character body colors: Vibrant solid colors (#38bdf8 for Nara, #ef4444 for Velocia, #22c55e for Scout).
 * 3. Skeletal animations: Sit_Work typing by default, smoothly crossfading to Wave on hover/select.
 * 4. Floating badge: Sleek black pill badge with blinking red dot and role title above head.
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

  // Configure materials and attach accessories directly to head bone
  useEffect(() => {
    if (!clone) return
    const agentColor = new THREE.Color(agent.color || '#ef4444')
    const agentId = agent.id?.toLowerCase()

    // Find the skeletal head bone
    const headBone = clone.getObjectByName('head')

    // Clean up any previously attached accessory group on headBone
    if (headBone) {
      const existing = headBone.getObjectByName('agent-head-accessory')
      if (existing) headBone.remove(existing)
    }

    // Traverse and configure mesh materials
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
          // Keep authentic textured eyes and mouth
          child.renderOrder = 2
        } else if (child.name === 'cap' || child.name === 'headphones') {
          // ALWAYS hide the unrigged static meshes that cause floating glitches
          child.visible = false
        }
      }
    })

    // Attach perfectly fitted accessories directly to the head bone
    if (headBone) {
      const accessoryGroup = new THREE.Group()
      accessoryGroup.name = 'agent-head-accessory'

      if (agentId === 'scout') {
        // Scout: Clean green research cap / visor fitted to the head
        const capCrown = new THREE.Mesh(
          new THREE.SphereGeometry(0.33, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2.3),
          new THREE.MeshStandardMaterial({ color: '#166534', roughness: 0.4 })
        )
        capCrown.position.set(0, 0.42, 0)

        const capBrim = new THREE.Mesh(
          new THREE.CylinderGeometry(0.35, 0.36, 0.025, 16, 1, false, -Math.PI / 3, (2 * Math.PI) / 3),
          new THREE.MeshStandardMaterial({ color: '#14532d', roughness: 0.4 })
        )
        capBrim.position.set(0, 0.42, 0.18)
        capBrim.rotation.set(0.18, 0, 0)

        accessoryGroup.add(capCrown)
        accessoryGroup.add(capBrim)
      } else {
        // Nara & Velocia: Sleek, high-tech headset fitted to head
        const cupGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.05, 16)
        const cupMat = new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.25 })

        // Left earcup
        const leftCup = new THREE.Mesh(cupGeo, cupMat)
        leftCup.position.set(-0.33, 0.40, 0)
        leftCup.rotation.set(0, 0, Math.PI / 2)

        // Right earcup
        const rightCup = new THREE.Mesh(cupGeo, cupMat)
        rightCup.position.set(0.33, 0.40, 0)
        rightCup.rotation.set(0, 0, Math.PI / 2)

        // Headband arch
        const bandGeo = new THREE.TorusGeometry(0.34, 0.02, 12, 24, Math.PI)
        const headband = new THREE.Mesh(bandGeo, cupMat)
        headband.position.set(0, 0.40, 0)
        headband.rotation.set(0, 0, -Math.PI / 2)

        // Sleek mic boom
        const micBoom = new THREE.Mesh(
          new THREE.CylinderGeometry(0.01, 0.01, 0.16, 8),
          cupMat
        )
        micBoom.position.set(-0.30, 0.34, 0.09)
        micBoom.rotation.set(Math.PI / 3, 0, -Math.PI / 8)

        const micTip = new THREE.Mesh(
          new THREE.SphereGeometry(0.024, 12, 12),
          new THREE.MeshStandardMaterial({ color: agentColor, roughness: 0.2 })
        )
        micTip.position.set(-0.28, 0.28, 0.17)

        accessoryGroup.add(leftCup)
        accessoryGroup.add(rightCup)
        accessoryGroup.add(headband)
        accessoryGroup.add(micBoom)
        accessoryGroup.add(micTip)
      }

      headBone.add(accessoryGroup)
    }
  }, [clone, agent.color, agent.id])

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
