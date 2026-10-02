import React, { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import RoombaRobot from './RoombaRobot'

/**
 * MASTER WORKSTATION ANCHORS & SEATING AUDIT
 * Open-Plan Staff Workspace Grid (3 Rows x 3 Columns) + Private Executive Glass Office (Victor COO)
 *
 * Row 1 (Front):
 * - Col 1 (Left): Velocia (Growth Strategy - Red)
 * - Col 2 (Center): Scout (Content Strategist - Green/Amber)
 * - Col 3 (Right): Reserved Desk 1 (Cyan)
 *
 * Row 2 (Middle):
 * - Col 1 (Left): Sherloc (Frontline Voice - Joy Golden)
 * - Col 2 (Center): Watson (Technical Bridge - Sadness Indigo)
 * - Col 3 (Right): Reserved Desk 2 (Emerald)
 *
 * Row 3 (Back, near Server Racks):
 * - Col 1 (Left): Nara (Telemetry CS & Server Diagnostics - Disgust Teal)
 * - Col 2 (Center): Reserved Desk 3 (Purple)
 * - Col 3 (Right): Reserved Desk 4 (Pink)
 *
 * Private Executive Glass Office (Victor COO):
 * - Seated inside private executive office enclosed by tinted glass partitions
 */
export const WORKSTATION_ANCHORS = {
  // Row 1 (Front)
  velocia: {
    id: 'velocia',
    name: 'Velocia',
    row: 1,
    col: 1,
    deskPos: [-5.2, 0, 1.2],
    seatPos: [-5.2, 0.05, 0.72],
    rotation: [0, 0, 0],
    role: 'Growth Strategy',
    color: '#ef4444'
  },
  scout: {
    id: 'scout',
    name: 'Scout',
    row: 1,
    col: 2,
    deskPos: [-2.7, 0, 1.2],
    seatPos: [-2.7, 0.05, 0.72],
    rotation: [0, 0, 0],
    role: 'Content Strategist',
    color: '#a855f7'
  },
  reserved_1: {
    id: 'reserved_1',
    name: 'Reserve Desk 1',
    row: 1,
    col: 3,
    deskPos: [-0.2, 0, 1.2],
    seatPos: [-0.2, 0, 0.72],
    rotation: [0, 0, 0],
    role: 'Reserved Workstation',
    color: '#06b6d4'
  },

  // Row 2 (Middle)
  sherloc: {
    id: 'sherloc',
    name: 'Sherloc',
    row: 2,
    col: 1,
    deskPos: [-5.2, 0, -1.2],
    seatPos: [-5.2, 0.05, -1.68],
    rotation: [0, 0, 0],
    role: 'Frontline Support',
    color: '#facc15'
  },
  watson: {
    id: 'watson',
    name: 'Watson',
    row: 2,
    col: 2,
    deskPos: [-2.7, 0, -1.2],
    seatPos: [-2.7, 0.05, -1.68],
    rotation: [0, 0, 0],
    role: 'Technical Bridge',
    color: '#1d4ed8'
  },
  reserved_2: {
    id: 'reserved_2',
    name: 'Reserve Desk 2',
    row: 2,
    col: 3,
    deskPos: [-0.2, 0, -1.2],
    seatPos: [-0.2, 0, -1.68],
    rotation: [0, 0, 0],
    role: 'Reserved Workstation',
    color: '#10b981'
  },

  // Row 3 (Back, near Server Racks)
  nara: {
    id: 'nara',
    name: 'Nara',
    row: 3,
    col: 1,
    deskPos: [-5.2, 0, -3.6],
    seatPos: [-5.2, 0.05, -4.08],
    rotation: [0, 0, 0],
    role: 'Telemetry CS & Server Diagnostics',
    color: '#10b981'
  },
  reserved_3: {
    id: 'reserved_3',
    name: 'Reserve Desk 3',
    row: 3,
    col: 2,
    deskPos: [-2.7, 0, -3.6],
    seatPos: [-2.7, 0.05, -4.08],
    rotation: [0, 0, 0],
    role: 'Reserved Workstation',
    color: '#8b5cf6'
  },
  reserved_4: {
    id: 'reserved_4',
    name: 'Reserve Desk 4',
    row: 3,
    col: 3,
    deskPos: [-0.2, 0, -3.6],
    seatPos: [-0.2, 0, -4.08],
    rotation: [0, 0, 0],
    role: 'Reserved Workstation',
    color: '#ec4899'
  },

  // Private Executive Glass Office (Victor COO)
  coo: {
    id: 'coo',
    name: 'Victor COO',
    deskPos: [5.7, 0, -4.0],
    seatPos: [5.7, 0.05, -4.48],
    rotation: [0, 0, 0],
    role: 'Chief Operating Officer',
    color: '#334155'
  }
}

/**
 * Procedural CS Support Flowchart Texture
 */
function useSupportFlowTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 640
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = '#0f172a'
    ctx.font = 'bold 30px sans-serif'
    ctx.fillText('💬 ORIN 24/7 SUPPORT & TRIAGE FLOW', 40, 60)

    ctx.strokeStyle = '#e2e8f0'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(40, 90)
    ctx.lineTo(canvas.width - 40, 90)
    ctx.stroke()

    // Flow steps
    ctx.fillStyle = '#fef2f2'
    ctx.fillRect(60, 140, 240, 150)
    ctx.strokeStyle = '#f87171'
    ctx.strokeRect(60, 140, 240, 150)
    ctx.fillStyle = '#991b1b'
    ctx.font = 'bold 20px sans-serif'
    ctx.fillText('1. WA Inbound', 85, 185)
    ctx.font = '16px sans-serif'
    ctx.fillText('• Validasi Nomor', 85, 220)
    ctx.fillText('• FAQ Otomatis', 85, 250)

    ctx.fillStyle = '#64748b'
    ctx.font = 'bold 28px sans-serif'
    ctx.fillText('➔', 320, 225)

    ctx.fillStyle = '#f0f9ff'
    ctx.fillRect(380, 140, 260, 150)
    ctx.strokeStyle = '#38bdf8'
    ctx.strokeRect(380, 140, 260, 150)
    ctx.fillStyle = '#0369a1'
    ctx.font = 'bold 20px sans-serif'
    ctx.fillText('2. Intelligent Triage', 405, 185)
    ctx.font = '16px sans-serif'
    ctx.fillText('• Telemetri GPS ➔ Nara', 405, 220)
    ctx.fillText('• Tech Firmware ➔ Watson', 405, 250)

    ctx.fillStyle = '#64748b'
    ctx.fillText('➔', 665, 225)

    ctx.fillStyle = '#f0fdf4'
    ctx.fillRect(720, 140, 240, 150)
    ctx.strokeStyle = '#4ade80'
    ctx.strokeRect(720, 140, 240, 150)
    ctx.fillStyle = '#166534'
    ctx.font = 'bold 20px sans-serif'
    ctx.fillText('3. Knowledge Loop', 740, 185)
    ctx.font = '16px sans-serif'
    ctx.fillText('• Q&A Harvested', 740, 220)
    ctx.fillText('• Vector RAG Sync', 740, 250)

    // Performance bar
    ctx.fillStyle = '#f8fafc'
    ctx.fillRect(60, 340, 900, 240)
    ctx.strokeStyle = '#cbd5e1'
    ctx.strokeRect(60, 340, 900, 240)
    ctx.fillStyle = '#0f172a'
    ctx.font = 'bold 24px sans-serif'
    ctx.fillText('📊 Live Frontline Performance', 90, 390)
    ctx.fillStyle = '#059669'
    ctx.font = 'bold 44px sans-serif'
    ctx.fillText('99.4%', 90, 470)
    ctx.font = '18px sans-serif'
    ctx.fillStyle = '#64748b'
    ctx.fillText('First Response Rate', 90, 520)

    ctx.fillStyle = '#2563eb'
    ctx.font = 'bold 44px sans-serif'
    ctx.fillText('14s', 420, 470)
    ctx.font = '18px sans-serif'
    ctx.fillStyle = '#64748b'
    ctx.fillText('Average Latency', 420, 520)

    ctx.fillStyle = '#d97706'
    ctx.font = 'bold 44px sans-serif'
    ctx.fillText('1,420+', 720, 470)
    ctx.font = '18px sans-serif'
    ctx.fillStyle = '#64748b'
    ctx.fillText('Resolved Tickets', 720, 520)

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])
}

/**
 * Procedural Sprint Growth Curve Texture
 */
function useSprintGrowthTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 640
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = '#0f172a'
    ctx.font = 'bold 32px sans-serif'
    ctx.fillText('📈 MARKETING & SPRINT OKRs', 50, 65)

    ctx.strokeStyle = '#38bdf8'
    ctx.lineWidth = 8
    ctx.beginPath()
    const points = [[60, 480], [180, 440], [320, 460], [480, 320], [640, 340], [800, 220], [960, 160]]
    points.forEach(([x, y], i) => {
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()

    // Glowing points
    points.forEach(([x, y]) => {
      ctx.beginPath()
      ctx.arc(x, y, 10, 0, Math.PI * 2)
      ctx.fillStyle = '#0284c7'
      ctx.fill()
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fillStyle = '#ffffff'
      ctx.fill()
    })

    // Metric badge
    ctx.fillStyle = '#f0fdf4'
    ctx.fillRect(680, 280, 280, 120)
    ctx.strokeStyle = '#86efac'
    ctx.strokeRect(680, 280, 280, 120)
    ctx.fillStyle = '#15803d'
    ctx.font = 'bold 42px sans-serif'
    ctx.fillText('+142.8%', 710, 345)
    ctx.font = '600 20px sans-serif'
    ctx.fillText('Sprint Conversion Lift', 710, 380)

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])
}

/**
 * 1. FLOATING DIORAMA BASE PLATFORM (18.0 x 14.0)
 */
function FloatingPlatform() {
  const platformGeometry = useMemo(() => {
    const width = 18.0
    const depth = 14.0
    const radius = 1.0
    const height = 0.35

    const shape = new THREE.Shape()
    const x = -width / 2
    const z = -depth / 2
    const w = width
    const d = depth
    const r = radius

    shape.moveTo(x + r, z)
    shape.lineTo(x + w - r, z)
    shape.quadraticCurveTo(x + w, z, x + w, z + r)
    shape.lineTo(x + w, z + d - r)
    shape.quadraticCurveTo(x + w, z + d, x + w - r, z + d)
    shape.lineTo(x + r, z + d)
    shape.quadraticCurveTo(x, z + d, x, z + d - r)
    shape.lineTo(x, z + r)
    shape.quadraticCurveTo(x, z, x + r, z)

    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: height,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.05,
      bevelThickness: 0.05
    })
    geom.rotateX(Math.PI / 2)
    geom.translate(0, -0.05, 0)
    return geom
  }, [])

  return (
    <group position={[0, 0, 0]}>
      {/* Matte Porcelain Clay Base */}
      <mesh geometry={platformGeometry} receiveShadow castShadow>
        <meshStandardMaterial color="#f8fafc" roughness={0.7} metalness={0.02} />
      </mesh>
      {/* Inset Slate Pedestal */}
      <mesh position={[0, -0.26, 0]} receiveShadow>
        <boxGeometry args={[17.6, 0.22, 13.6]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.65} metalness={0.06} />
      </mesh>
      {/* Dark Base Trim */}
      <mesh position={[0, -0.4, 0]} receiveShadow>
        <boxGeometry args={[17.0, 0.08, 13.0]} />
        <meshStandardMaterial color="#64748b" roughness={0.8} />
      </mesh>
    </group>
  )
}

/**
 * Modern Ergonomic Office Swivel Chair
 */
function ErgonomicOfficeChair({ position = [0, 0, 0], rotation = [0, 0, 0], isOccupied = false }) {
  return (
    <group position={position} rotation={rotation}>
      {/* 5-Star Wheel Base */}
      <mesh position={[0, 0.04, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.24, 0.03, 10]} />
        <meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Hydraulic Stem */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.28, 8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
      </mesh>
      {/* Seat Cushion */}
      <mesh position={[0, 0.36, 0]} castShadow>
        <boxGeometry args={[0.38, 0.06, 0.36]} />
        <meshStandardMaterial color="#334155" roughness={0.6} />
      </mesh>
      {/* Ergonomic Curved Backrest */}
      <mesh position={[0, 0.6, -0.16]} rotation={[0.08, 0, 0]} castShadow>
        <boxGeometry args={[0.36, 0.42, 0.05]} />
        <meshStandardMaterial color="#1e293b" roughness={0.65} />
      </mesh>
      {/* Armrests */}
      <mesh position={[-0.2, 0.48, 0]} castShadow>
        <boxGeometry args={[0.04, 0.16, 0.22]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh position={[0.2, 0.48, 0]} castShadow>
        <boxGeometry args={[0.04, 0.16, 0.22]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
    </group>
  )
}

/**
 * Modern Office Workstation Desk with Monitor, Keyboard, and Mousepad
 * Supports occupied staff desks and clickable reserved desks with hover card
 */
function WorkstationDesk({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  monitorColor = '#38bdf8',
  hasDualMonitors = false,
  isReserved = false,
  chairPosition = [0, 0, -0.48],
  chairRotation = [0, 0, 0]
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Desk Surface */}
      <mesh position={[0, 0.58, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.045, 0.72]} />
        <meshStandardMaterial color="#ffffff" roughness={0.65} metalness={0.02} />
      </mesh>
      {/* Desk Metal Legs */}
      {[-0.68, 0.68].map((lx, idx) => (
        <mesh key={idx} position={[lx, 0.28, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.56, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.7} />
        </mesh>
      ))}

      {/* Primary Computer Monitor (Faces South towards seated agent) */}
      <group position={[hasDualMonitors ? -0.22 : 0, 0.82, 0.16]} rotation={[0, Math.PI, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.3, 0.02]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0, 0, 0.012]}>
          <planeGeometry args={[0.47, 0.27]} />
          <meshBasicMaterial color={isReserved ? '#334155' : monitorColor} />
        </mesh>
        {/* Stand */}
        <mesh position={[0, -0.18, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.14, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.7} />
        </mesh>
      </group>

      {/* Optional Dual Monitor (Ergonomically angled towards seated agent) */}
      {hasDualMonitors && (
        <group position={[0.26, 0.82, 0.16]} rotation={[0, Math.PI + 0.25, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.48, 0.3, 0.02]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <planeGeometry args={[0.45, 0.27]} />
            <meshBasicMaterial color={isReserved ? '#1e293b' : '#10b981'} />
          </mesh>
          <mesh position={[0, -0.18, 0]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.14, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.7} />
          </mesh>
        </group>
      )}

      {/* Keyboard & Mousepad: placed at Z = -0.18 so seated agent at Z = -0.48 with 0.30 arm reach rests hands directly on keyboard */}
      <mesh position={[0, 0.61, -0.18]} castShadow>
        <boxGeometry args={[0.32, 0.008, 0.12]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.3} />
      </mesh>
      <mesh position={[0.22, 0.608, -0.18]}>
        <cylinderGeometry args={[0.025, 0.025, 0.005, 12]} />
        <meshStandardMaterial color="#0284c7" />
      </mesh>

      {/* Ergonomic Office Chair */}
      <ErgonomicOfficeChair
        position={chairPosition}
        rotation={chairRotation}
      />
    </group>
  )
}

/**
 * Solid Perimeter Wall
 */
function SolidWall({ position = [0, 0, 0], size = [2, 1.3, 0.08], color = '#ffffff' }) {
  return (
    <group position={position}>
      {/* Wall Panel */}
      <mesh position={[0, size[1] / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[size[0], size[1], size[2]]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Top Molding Trim */}
      <mesh position={[0, size[1] + 0.02, 0]} castShadow>
        <boxGeometry args={[size[0] + 0.02, 0.04, size[2] + 0.04]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
      </mesh>
    </group>
  )
}

/**
 * Modern Semi-Transparent Tinted Glass Partition Wall for Private Executive Office
 */
function GlassPartitionWall({
  position = [0, 0, 0],
  size = [2, 1.4, 0.08],
  rotation = [0, 0, 0]
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Bottom Aluminum Baseboard */}
      <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
        <boxGeometry args={[size[0], 0.12, size[2]]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
      {/* Top Aluminum Header Frame */}
      <mesh position={[0, size[1] - 0.04, 0]} castShadow>
        <boxGeometry args={[size[0], 0.08, size[2]]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Vertical Aluminum Side Posts */}
      {[-size[0] / 2 + 0.03, size[0] / 2 - 0.03].map((px, idx) => (
        <mesh key={idx} position={[px, size[1] / 2, 0]} castShadow>
          <boxGeometry args={[0.06, size[1], size[2]]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
      {/* Semi-Transparent Tinted Glass Pane */}
      <mesh position={[0, size[1] / 2, 0]}>
        <boxGeometry args={[size[0] - 0.08, size[1] - 0.2, 0.02]} />
        <meshStandardMaterial
          color="#38bdf8"
          transparent
          opacity={0.35}
          roughness={0.1}
          metalness={0.15}
        />
      </mesh>
    </group>
  )
}

/**
 * Animated Server Rack Tower with Blinking LEDs
 */
function BlinkingServerRack({ position = [0, 0, 0] }) {
  const ledRef = useRef()

  useFrame((state) => {
    if (!ledRef.current) return
    const t = state.clock.getElapsedTime()
    ledRef.current.children.forEach((child, i) => {
      if (child.material) {
        child.material.emissiveIntensity = 0.5 + Math.sin(t * 7 + i * 1.6) * 1.8
      }
    })
  })

  return (
    <group position={position}>
      {/* Server Tower Cabinet */}
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 1.8, 0.65]} />
        <meshStandardMaterial color="#090d16" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Front Glass Pane */}
      <mesh position={[0, 0.9, 0.33]}>
        <boxGeometry args={[0.72, 1.7, 0.02]} />
        <meshStandardMaterial color="#0284c7" transparent opacity={0.3} />
      </mesh>
      {/* Blinking Server Blades */}
      <group ref={ledRef} position={[0, 0.25, 0.31]}>
        {[0, 0.25, 0.5, 0.75, 1.0, 1.25].map((y, idx) => (
          <mesh key={idx} position={[0, y, 0]}>
            <boxGeometry args={[0.62, 0.1, 0.02]} />
            <meshStandardMaterial
              color={idx % 2 === 0 ? '#38bdf8' : '#10b981'}
              emissive={idx % 2 === 0 ? '#38bdf8' : '#10b981'}
              emissiveIntensity={1.5}
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}

/**
 * Animated 3D Glass Aquarium
 */
function AnimatedAquarium({ position = [0, 0, 0] }) {
  const fishRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (fishRef.current) {
      fishRef.current.position.x = Math.sin(t * 1.2) * 0.22
      fishRef.current.position.y = 0.52 + Math.cos(t * 1.8) * 0.05
      fishRef.current.rotation.y = Math.cos(t * 1.2) > 0 ? 0 : Math.PI
    }
  })

  return (
    <group position={position}>
      {/* Cabinet Stand */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.7, 0.5]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
      {/* Water Fill */}
      <mesh position={[0, 0.83, 0]}>
        <boxGeometry args={[0.78, 0.44, 0.38]} />
        <meshStandardMaterial color="#0284c7" transparent opacity={0.45} roughness={0.1} />
      </mesh>
      {/* Animated Fish */}
      <mesh ref={fishRef} position={[0, 0.52, 0]}>
        <coneGeometry args={[0.025, 0.08, 8]} />
        <meshStandardMaterial color="#f97316" roughness={0.3} />
      </mesh>
      {/* Aquarium Hood Lamp */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[0.84, 0.04, 0.44]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <pointLight position={[0, 1.0, 0]} color="#38bdf8" intensity={1.2} distance={2.5} />
    </group>
  )
}

/**
 * ZONE 1: UNIFIED OPEN-PLAN STAFF WORKSPACE (3 Rows x 3 Columns Modular Grid)
 * - All internal partitions removed: spacious, bright, collaborative open office floor.
 * - Row 1 (Front): Velocia (Red), Scout (Green), Reserved Desk 1 (Cyan).
 * - Row 2 (Middle): Nara (Sky Blue), Watson (Indigo/Purple), Reserved Desk 2 (Emerald).
 * - Row 3 (Back): Sherloc (Warm Gold), Reserved Desk 3 (Purple), Reserved Desk 4 (Pink).
 * - Back Wall: High-tech blinking server rack towers and telemetry diagnostics board.
 */
function OpenPlanStaffArea() {
  const flowTex = useSupportFlowTexture()

  return (
    <group name="open-plan-staff-area">
      {/* Unified Floor Carpet (Spacious clean off-white / light slate) */}
      <mesh position={[-3.2, 0.005, 0.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10.4, 12.8]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.75} />
      </mesh>

      {/* Perimeter Walls (Outer Diaroma Boundary only - NO internal dividing partitions) */}
      {/* North Wall behind Servers */}
      <SolidWall position={[-3.2, 0, -6.4]} size={[10.4, 1.3, 0.08]} color="#ffffff" />
      {/* West Exterior Wall */}
      <SolidWall position={[-8.4, 0, 0.0]} size={[0.08, 1.3, 12.8]} color="#ffffff" />
      {/* South Perimeter Wall with Main Entrance Opening */}
      <SolidWall position={[-5.8, 0, 6.4]} size={[5.2, 1.3, 0.08]} color="#ffffff" />
      <SolidWall position={[-0.6, 0, 6.4]} size={[3.2, 1.3, 0.08]} color="#ffffff" />

      {/* Support Flowchart Whiteboard mounted on West Wall */}
      <group position={[-8.1, 0, -0.5]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 1.15, 0]} castShadow>
          <boxGeometry args={[2.2, 1.25, 0.04]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.4} />
        </mesh>
        <mesh position={[0, 1.15, 0.025]}>
          <planeGeometry args={[2.12, 1.17]} />
          <meshBasicMaterial map={flowTex} />
        </mesh>
      </group>

      {/* Modular Server Rack Battery (Snapped together tightly without gaps) */}
      <group name="modular-server-battery">
        {/* Three tightly snapped server rack towers (width: 0.8 each, x_offset = 0.8) */}
        <BlinkingServerRack position={[-6.0, 0, -5.8]} />
        <BlinkingServerRack position={[-5.2, 0, -5.8]} />
        <BlinkingServerRack position={[-4.4, 0, -5.8]} />

        {/* Top Connecting Header Cable Tray */}
        <mesh position={[-5.2, 1.82, -5.8]} castShadow>
          <boxGeometry args={[2.44, 0.05, 0.66]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.4} />
        </mesh>

        {/* Server Telemetry Status Terminal adjacent to server battery */}
        <group position={[-3.3, 0, -5.8]}>
          <mesh position={[0, 0.9, 0]} castShadow>
            <boxGeometry args={[1.2, 1.8, 0.4]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} />
          </mesh>
          <mesh position={[0, 1.1, 0.21]}>
            <planeGeometry args={[1.0, 0.6]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
        </group>
      </group>

      {/* ========================================================
          3 ROWS x 3 COLUMNS MODULAR DESK GRID
          All workstations facing +Z (South towards corridor)
          Monitors rotated Math.PI to face seated staff at -Z
         ======================================================== */}

      {/* --- ROW 1 (FRONT): Velocia, Scout, Reserved Desk 1 --- */}
      {/* Meja 1: Velocia (Growth Strategy - Merah) */}
      <WorkstationDesk
        position={WORKSTATION_ANCHORS.velocia.deskPos}
        monitorColor="#ef4444"
        hasDualMonitors={false}
      />
      {/* Meja 2: Scout (Content Strategist - Ungu Lilac) */}
      <WorkstationDesk
        position={WORKSTATION_ANCHORS.scout.deskPos}
        monitorColor="#a855f7"
        hasDualMonitors={false}
      />
      {/* Meja 3: Meja Kosong Cadangan 1 (Reserve Desk 1) */}
      <WorkstationDesk
        position={WORKSTATION_ANCHORS.reserved_1.deskPos}
        monitorColor="#06b6d4"
        hasDualMonitors={false}
        isReserved={true}
      />

      {/* --- ROW 2 (MIDDLE): Sherloc, Watson, Reserved Desk 2 --- */}
      {/* Meja 4: Sherloc (Frontline Voice - Kuning Emas) */}
      <group position={WORKSTATION_ANCHORS.sherloc.deskPos}>
        <WorkstationDesk
          position={[0, 0, 0]}
          monitorColor="#facc15"
          hasDualMonitors={true}
        />
        {/* Headset Prop on Desk */}
        <group position={[-0.6, 0.62, -0.05]} rotation={[Math.PI / 2, 0, 0.4]}>
          <mesh castShadow>
            <torusGeometry args={[0.08, 0.015, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[-0.08, 0, 0]} castShadow>
            <sphereGeometry args={[0.03, 10, 10]} />
            <meshStandardMaterial color="#facc15" />
          </mesh>
          <mesh position={[0.08, 0, 0]} castShadow>
            <sphereGeometry args={[0.03, 10, 10]} />
            <meshStandardMaterial color="#facc15" />
          </mesh>
        </group>
        {/* Standing Notification Lamp */}
        <group position={[0.9, 0, 0.1]}>
          <mesh position={[0, 0.03, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.12, 0.04, 16]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
          <mesh position={[0, 0.7, 0]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 1.35, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.7} />
          </mesh>
          <mesh position={[0, 1.4, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={2.5} />
          </mesh>
          <pointLight position={[0, 1.4, 0]} color="#facc15" intensity={1.5} distance={3.5} />
        </group>
      </group>

      {/* Meja 5: Watson (Technical Bridge - Ungu/Indigo) */}
      <WorkstationDesk
        position={WORKSTATION_ANCHORS.watson.deskPos}
        monitorColor="#1d4ed8"
        hasDualMonitors={true}
      />
      {/* Meja 6: Meja Kosong Cadangan 2 (Reserve Desk 2) */}
      <WorkstationDesk
        position={WORKSTATION_ANCHORS.reserved_2.deskPos}
        monitorColor="#10b981"
        hasDualMonitors={false}
        isReserved={true}
      />

      {/* --- ROW 3 (BACK, tepat di depan Server Racks): Nara, Reserved Desk 3, Reserved Desk 4 --- */}
      {/* Meja 7: Nara (Telemetry CS & Server Diagnostics - Hijau Mint / Teal) */}
      <WorkstationDesk
        position={WORKSTATION_ANCHORS.nara.deskPos}
        monitorColor="#10b981"
        hasDualMonitors={true}
      />

      {/* Meja 8: Meja Kosong Cadangan 3 (Reserve Desk 3) */}
      <WorkstationDesk
        position={WORKSTATION_ANCHORS.reserved_3.deskPos}
        monitorColor="#8b5cf6"
        hasDualMonitors={false}
        isReserved={true}
      />

      {/* Meja 9: Meja Kosong Cadangan 4 (Reserve Desk 4) */}
      <WorkstationDesk
        position={WORKSTATION_ANCHORS.reserved_4.deskPos}
        monitorColor="#ec4899"
        hasDualMonitors={false}
        isReserved={true}
      />
    </group>
  )
}

/**
 * ZONE 2: PRIVATE EXECUTIVE GLASS OFFICE FOR COO VICTOR
 * - Enclosed in modern tinted semi-transparent glass partitions (opacity: 0.35, transparent: true, roughness: 0.1)
 * - Open access doorway facing the main corridor
 * - Director's executive desk, laptop with Telegram feed facing Victor, brass lamp, executive chair, visitor chair
 * - Back bookshelf and tall indoor potted plant
 */
function ExecutiveCOOGlassOffice() {
  return (
    <group name="coo-executive-glass-office">
      {/* Plush Clean White Executive Rug */}
      <mesh position={[5.7, 0.005, -4.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[5.4, 4.8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.7} />
      </mesh>

      {/* North Wall (Back Perimeter) */}
      <SolidWall position={[5.7, 0, -6.4]} size={[5.4, 1.4, 0.08]} color="#ffffff" />
      {/* East Wall (Right Exterior Perimeter) */}
      <SolidWall position={[8.4, 0, -4.0]} size={[0.08, 1.4, 4.8]} color="#ffffff" />

      {/* West Tinted Glass Partition (Dividing COO Office from Open Staff Workspace) */}
      <GlassPartitionWall
        position={[3.0, 0, -4.0]}
        size={[4.8, 1.4, 0.08]}
        rotation={[0, Math.PI / 2, 0]}
      />

      {/* South Front Glass Partition (Facing Corridor / Lounge) with Open Doorway */}
      <GlassPartitionWall
        position={[3.8, 0, -1.6]}
        size={[1.6, 1.4, 0.08]}
      />
      <GlassPartitionWall
        position={[7.2, 0, -1.6]}
        size={[2.4, 1.4, 0.08]}
      />
      {/* Open Doorway at X=4.6 to 6.0 */}

      {/* Executive Clean Modern White Director Desk */}
      <group position={WORKSTATION_ANCHORS.coo.deskPos}>
        <mesh position={[0, 0.58, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.0, 0.06, 0.85]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} metalness={0.05} />
        </mesh>
        {/* Side Panels */}
        {[-0.92, 0.92].map((lx, idx) => (
          <mesh key={idx} position={[lx, 0.28, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.08, 0.56, 0.8]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.5} />
          </mesh>
        ))}
        {/* Leather Desk Blotter */}
        <mesh position={[0, 0.615, -0.18]} castShadow>
          <boxGeometry args={[0.85, 0.008, 0.45]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
        </mesh>

        {/* Executive Laptop (Telegram Gateway Feed) - Centered under Victor's hands, screen tilted facing Victor */}
        <group position={[0, 0.62, -0.18]}>
          <mesh position={[0, 0.005, 0]} castShadow>
            <boxGeometry args={[0.3, 0.012, 0.2]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.012, 0]}>
            <boxGeometry args={[0.26, 0.002, 0.14]} />
            <meshStandardMaterial color="#1e293b" roughness={0.4} />
          </mesh>
          <group position={[0, 0.01, 0.09]} rotation={[0.25, 0, 0]}>
            <mesh position={[0, 0.1, 0]} castShadow>
              <boxGeometry args={[0.3, 0.2, 0.01]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            <mesh position={[0, 0.1, -0.006]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[0.28, 0.18]} />
              <meshBasicMaterial color="#9333ea" />
            </mesh>
          </group>
        </group>

        {/* Brass Desk Lamp */}
        <group position={[0.75, 0.62, 0.15]}>
          <mesh position={[0, 0.02, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.07, 0.04, 12]} />
            <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.18, 0]} castShadow>
            <cylinderGeometry args={[0.01, 0.01, 0.32, 8]} />
            <meshStandardMaterial color="#eab308" metalness={0.9} />
          </mesh>
          <mesh position={[-0.06, 0.32, 0]} rotation={[0, 0, -0.4]} castShadow>
            <coneGeometry args={[0.08, 0.12, 12]} />
            <meshStandardMaterial color="#ca8a04" metalness={0.8} />
          </mesh>
          <pointLight position={[-0.06, 0.28, 0]} color="#fef08a" intensity={1.2} distance={2.5} />
        </group>

        {/* High-Back Executive Leather Chair for Victor COO */}
        <group position={[0, 0, -0.48]}>
          <ErgonomicOfficeChair />
          <mesh position={[0, 0.94, -0.18]} castShadow>
            <boxGeometry args={[0.32, 0.22, 0.06]} />
            <meshStandardMaterial color="#0f172a" roughness={0.6} />
          </mesh>
        </group>

        {/* Visitor Chair */}
        <ErgonomicOfficeChair position={[0, 0, 0.7]} rotation={[0, Math.PI, 0]} />
      </group>

      {/* Executive Bookshelf on Back Wall */}
      <group position={[5.7, 0, -6.1]}>
        <mesh position={[0, 0.95, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 1.9, 0.38]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>
        {[-0.45, 0.05, 0.55].map((sy, sidx) => (
          <group key={sidx} position={[0, sy + 0.95, 0.05]}>
            {[-0.7, -0.2, 0.4].map((bx, bidx) => (
              <mesh key={bidx} position={[bx, 0, 0]} castShadow>
                <boxGeometry args={[0.26, 0.26, 0.22]} />
                <meshStandardMaterial
                  color={['#38bdf8', '#f59e0b', '#ef4444', '#10b981'][(sidx + bidx) % 4]}
                  roughness={0.6}
                />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* Tall Indoor Potted Plant in Corner */}
      <group position={[7.6, 0, -5.6]}>
        {/* Clay Pot */}
        <mesh position={[0, 0.24, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.16, 0.48, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.6} />
        </mesh>
        {/* Plant Stem & Foliage */}
        <mesh position={[0, 0.75, 0]} castShadow>
          <sphereGeometry args={[0.36, 12, 12]} />
          <meshStandardMaterial color="#15803d" roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.05, 0]} castShadow>
          <sphereGeometry args={[0.26, 12, 12]} />
          <meshStandardMaterial color="#16a34a" roughness={0.7} />
        </mesh>
      </group>
    </group>
  )
}

/**
 * ZONE 3: CENTRAL SOCIAL LOUNGE, BREAKROOM & PANTRY
 * Located in front-right area (facing COO office and open staff grid)
 */
function CentralSocialLounge() {
  const sprintTex = useSprintGrowthTexture()

  return (
    <group name="central-social-lounge">
      {/* Lounge Floor Carpet */}
      <mesh position={[5.4, 0.005, 3.4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6.0, 6.0]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.8} />
      </mesh>

      {/* East Exterior Perimeter Wall */}
      <SolidWall position={[8.4, 0, 3.4]} size={[0.08, 1.3, 6.0]} color="#ffffff" />
      {/* South Perimeter Wall */}
      <SolidWall position={[5.4, 0, 6.4]} size={[6.0, 1.3, 0.08]} color="#ffffff" />

      {/* Sprint OKR Whiteboard mounted on East Wall */}
      <group position={[8.1, 0, 3.6]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0, 1.15, 0]} castShadow>
          <boxGeometry args={[2.0, 1.2, 0.04]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.4} />
        </mesh>
        <mesh position={[0, 1.15, 0.025]}>
          <planeGeometry args={[1.92, 1.12]} />
          <meshBasicMaterial map={sprintTex} />
        </mesh>
      </group>

      {/* Designer Patterned Rug */}
      <mesh position={[5.4, 0.01, 3.6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.2, 2.4]} />
        <meshStandardMaterial color="#e0e7ff" roughness={0.9} />
      </mesh>

      {/* Plush Beige Lounge Sofa */}
      <group position={[5.4, 0, 2.8]}>
        <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.26, 0.75]} />
          <meshStandardMaterial color="#ffffff" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.5, -0.3]}>
          <boxGeometry args={[2.2, 0.38, 0.18]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.7} />
        </mesh>
        {[-1.05, 1.05].map((ax, idx) => (
          <mesh key={idx} position={[ax, 0.36, 0]} castShadow>
            <boxGeometry args={[0.16, 0.26, 0.75]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
        ))}
      </group>

      {/* Round Coffee Table */}
      <group position={[5.4, 0, 3.8]}>
        <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.04, 24]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.11, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.08, 0.2, 12]} />
          <meshStandardMaterial color="#d4a373" />
        </mesh>
      </group>

      {/* Beanbags */}
      <mesh position={[3.8, 0.16, 4.4]} castShadow>
        <sphereGeometry args={[0.26, 16, 16]} />
        <meshStandardMaterial color="#f43f5e" roughness={0.8} />
      </mesh>
      <mesh position={[7.0, 0.16, 4.4]} castShadow>
        <sphereGeometry args={[0.26, 16, 16]} />
        <meshStandardMaterial color="#06b6d4" roughness={0.8} />
      </mesh>

      {/* Pantry Kitchenette Counter */}
      <group position={[3.6, 0, 0.4]}>
        <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 1.04, 0.55]} />
          <meshStandardMaterial color="#ffffff" roughness={0.6} />
        </mesh>
        <mesh position={[0, 1.05, 0]} castShadow>
          <boxGeometry args={[1.56, 0.06, 0.6]} />
          <meshStandardMaterial color="#d4a373" roughness={0.5} />
        </mesh>
        {/* Espresso Machine */}
        <group position={[-0.4, 1.2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.28, 0.26, 0.22]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.7} />
          </mesh>
        </group>
        {/* Water Dispenser */}
        <group position={[0.4, 1.25, 0]}>
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.24, 0.32, 0.22]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 0.28, 0]} castShadow>
            <cylinderGeometry args={[0.09, 0.11, 0.28, 16]} />
            <meshStandardMaterial color="#0284c7" transparent opacity={0.7} />
          </mesh>
        </group>
      </group>

      {/* 3D Glass Aquarium */}
      <AnimatedAquarium position={[7.2, 0, 0.4]} />

      {/* Reception Counter Desk near Entrance */}
      <group position={[-1.5, 0, 5.0]}>
        <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 1.1, 0.45]} />
          <meshStandardMaterial color="#ffffff" roughness={0.65} metalness={0.02} />
        </mesh>
        <mesh position={[0, 1.12, 0]} castShadow>
          <boxGeometry args={[1.9, 0.05, 0.52]} />
          <meshStandardMaterial color="#fcd34d" roughness={0.5} />
        </mesh>
        <mesh position={[0, 1.25, 0]} rotation={[0, -0.3, 0]} castShadow>
          <boxGeometry args={[0.35, 0.22, 0.02]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0, 0.7, 0.24]}>
          <planeGeometry args={[1.2, 0.3]} />
          <meshBasicMaterial color="#d97706" />
        </mesh>
      </group>
    </group>
  )
}

/**
 * MAIN DIORAMA OFFICE COMPONENT
 * Features:
 * 1. Unified Open-Plan Staff Workspace with 3x3 Modular Desk Grid (Velocia, Scout, Nara, Watson, Sherloc + 4 Reserve Desks)
 * 2. High-Tech IT Server Wall with Blinking Status LEDs
 * 3. Private Executive Tinted Glass Office for COO Victor
 * 4. Central Social Lounge, Pantry, & Reception
 * 5. Autonomous Floor Cleaning Robot (Roomba)
 */
export default function DioramaOffice() {
  return (
    <group name="gather-diorama-root">
      {/* 1. Large Rounded Floor Platform (18.0 x 14.0) */}
      <FloatingPlatform />

      {/* 2. Zone 1: Unified Open-Plan Staff Workspace (3x3 Desk Grid + Server Racks) */}
      <OpenPlanStaffArea />

      {/* 3. Zone 2: Private Executive Glass Office for COO Victor */}
      <ExecutiveCOOGlassOffice />

      {/* 4. Zone 3: Central Social Lounge, Breakroom & Pantry */}
      <CentralSocialLounge />

      {/* 5. Autonomous Floor Cleaning Robot (Roomba) */}
      <RoombaRobot />
    </group>
  )
}
