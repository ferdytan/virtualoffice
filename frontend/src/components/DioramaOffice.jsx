import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import RoombaRobot from './RoombaRobot'

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
 */
function WorkstationDesk({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  monitorColor = '#38bdf8',
  hasDualMonitors = false,
  isOccupied = false,
  chairPosition = [0, 0, -0.55],
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

      {/* Primary Computer Monitor */}
      <group position={[hasDualMonitors ? -0.22 : 0, 0.82, 0.16]}>
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.3, 0.02]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0, 0, 0.012]}>
          <planeGeometry args={[0.47, 0.27]} />
          <meshBasicMaterial color={monitorColor} />
        </mesh>
        {/* Stand */}
        <mesh position={[0, -0.18, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.14, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.7} />
        </mesh>
      </group>

      {/* Optional Dual Monitor */}
      {hasDualMonitors && (
        <group position={[0.3, 0.82, 0.14]} rotation={[0, -0.2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.48, 0.3, 0.02]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <planeGeometry args={[0.45, 0.27]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
          <mesh position={[0, -0.18, 0]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.14, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.7} />
          </mesh>
        </group>
      )}

      {/* Keyboard & Mousepad */}
      <mesh position={[0, 0.61, -0.08]} castShadow>
        <boxGeometry args={[0.32, 0.008, 0.12]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.3} />
      </mesh>
      <mesh position={[0.22, 0.608, -0.08]}>
        <cylinderGeometry args={[0.025, 0.025, 0.005, 12]} />
        <meshStandardMaterial color="#0284c7" />
      </mesh>

      {/* Ergonomic Office Chair */}
      <ErgonomicOfficeChair
        position={chairPosition}
        rotation={chairRotation}
        isOccupied={isOccupied}
      />
    </group>
  )
}

/**
 * Solid Gather-Style Partition Wall
 */
function SolidWall({ position = [0, 0, 0], size = [2, 1.3, 0.08], color = '#cbd5e1' }) {
  return (
    <group position={position}>
      {/* Wall Panel */}
      <mesh position={[0, size[1] / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[size[0], size[1], size[2]]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Top Wood/Slate Molding Trim */}
      <mesh position={[0, size[1] + 0.02, 0]} castShadow>
        <boxGeometry args={[size[0] + 0.02, 0.04, size[2] + 0.04]} />
        <meshStandardMaterial color="#475569" roughness={0.5} />
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
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
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
 * ROOM 1: EXECUTIVE COO PRIVATE OFFICE (Back-Right)
 * - Enclosed private office room with walls and door opening
 * - Executive dark wood desk, laptop running Telegram feed, brass lamp, executive chair
 * - Bookshelf against the back wall
 */
function ExecutiveCOORoom() {
  return (
    <group name="coo-executive-room">
      {/* Room Flooring Carpet */}
      <mesh position={[6.0, 0.005, -4.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4.8, 4.8]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Enclosed Private Room Walls */}
      {/* Back Wall */}
      <SolidWall position={[6.0, 0, -6.4]} size={[4.8, 1.3, 0.08]} color="#334155" />
      {/* Right Exterior Wall */}
      <SolidWall position={[8.4, 0, -4.0]} size={[0.08, 1.3, 4.8]} color="#334155" />
      {/* Left Wall dividing from Operations */}
      <SolidWall position={[3.6, 0, -4.0]} size={[0.08, 1.3, 4.8]} color="#334155" />
      {/* Front Wall with Doorway Opening */}
      <SolidWall position={[4.6, 0, -1.6]} size={[2.0, 1.3, 0.08]} color="#334155" />
      <SolidWall position={[7.6, 0, -1.6]} size={[1.6, 1.3, 0.08]} color="#334155" />

      {/* Executive Wooden Desk */}
      <group position={[6.0, 0, -4.2]}>
        <mesh position={[0, 0.58, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.0, 0.06, 0.85]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.2} />
        </mesh>
        {/* Solid Wood Side Panels */}
        {[-0.92, 0.92].map((lx, idx) => (
          <mesh key={idx} position={[lx, 0.28, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.08, 0.56, 0.8]} />
            <meshStandardMaterial color="#0f172a" roughness={0.5} />
          </mesh>
        ))}
        {/* Leather Desk Blotter */}
        <mesh position={[0, 0.615, 0]} castShadow>
          <boxGeometry args={[0.85, 0.008, 0.45]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>

        {/* Executive Laptop (Telegram Gateway Feed) */}
        <group position={[0, 0.62, 0.05]}>
          <mesh position={[0, 0.005, 0]} castShadow>
            <boxGeometry args={[0.3, 0.012, 0.2]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
          </mesh>
          <group position={[0, 0.01, -0.1]} rotation={[-0.3, 0, 0]}>
            <mesh position={[0, 0.1, 0]} castShadow>
              <boxGeometry args={[0.3, 0.2, 0.01]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            <mesh position={[0, 0.1, 0.006]}>
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

        {/* High-Back Executive Leather Chair for COO */}
        <group position={[0, 0, -0.6]}>
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
      <group position={[6.0, 0, -6.1]}>
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
    </group>
  )
}

/**
 * ROOM 2: DATACENTER & TELEMETRY LAB (Back-Left - Nara's Station)
 * - Server racks against the back wall with blinking status LEDs
 * - Telemetry console desk facing the server rack
 * - Nara seated/standing right here facing North towards the server racks
 */
function DatacenterTelemetryRoom() {
  return (
    <group name="datacenter-telemetry-room">
      {/* High-Tech Dark Grid Floor */}
      <mesh position={[-6.0, 0.005, -4.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4.8, 4.8]} />
        <meshStandardMaterial color="#090d16" roughness={0.7} />
      </mesh>

      {/* Enclosed Server Room Walls */}
      {/* Back Wall */}
      <SolidWall position={[-6.0, 0, -6.4]} size={[4.8, 1.3, 0.08]} color="#1e293b" />
      {/* Left Exterior Wall */}
      <SolidWall position={[-8.4, 0, -4.0]} size={[0.08, 1.3, 4.8]} color="#1e293b" />
      {/* Right Wall dividing from Operations */}
      <SolidWall position={[-3.6, 0, -4.0]} size={[0.08, 1.3, 4.8]} color="#1e293b" />
      {/* Front Wall with Doorway */}
      <SolidWall position={[-7.4, 0, -1.6]} size={[2.0, 1.3, 0.08]} color="#1e293b" />
      <SolidWall position={[-4.4, 0, -1.6]} size={[1.6, 1.3, 0.08]} color="#1e293b" />

      {/* Row of Blinking Server Rack Towers against Back Wall */}
      <BlinkingServerRack position={[-7.0, 0, -5.8]} />
      <BlinkingServerRack position={[-5.6, 0, -5.8]} />
      <BlinkingServerRack position={[-4.2, 0, -5.8]} />

      {/* Telemetry Console Desk facing North directly into the Server Racks */}
      <group position={[-5.8, 0, -4.6]}>
        <mesh position={[0, 0.58, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.045, 0.7]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>
        {/* Legs */}
        {[-0.8, 0.8].map((lx, idx) => (
          <mesh key={idx} position={[lx, 0.28, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.56, 8]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
        ))}

        {/* Dual Telemetry Fleet Monitors (Facing South towards Nara) */}
        <group position={[-0.25, 0.82, -0.12]}>
          <mesh castShadow>
            <boxGeometry args={[0.55, 0.32, 0.02]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <planeGeometry args={[0.52, 0.29]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>
        <group position={[0.35, 0.82, -0.1]} rotation={[0, -0.15, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.55, 0.32, 0.02]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <planeGeometry args={[0.52, 0.29]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
        </group>

        {/* Keyboard & Diagnostics Terminal */}
        <mesh position={[0, 0.61, 0.1]} castShadow>
          <boxGeometry args={[0.34, 0.008, 0.12]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>

        {/* Ergonomic Swivel Chair where Nara Sits */}
        <ErgonomicOfficeChair position={[0, 0, 0.8]} rotation={[0, 0, 0]} />
      </group>
    </group>
  )
}

/**
 * ROOM 3: TECH & OPERATIONS CUBICLE BAY (Back-Center)
 * - Watson's Workstation + 3 Empty Desks ready for future agents
 */
function TechOperationsBay() {
  return (
    <group name="tech-operations-bay">
      {/* 4-Desk Modular Cubicle Pod */}
      {/* Desk 1: Watson's Diagnostic Desk */}
      <WorkstationDesk
        position={[-1.2, 0, -4.5]}
        hasDualMonitors={true}
        monitorColor="#1d4ed8"
        chairPosition={[0, 0, 0.6]}
        chairRotation={[0, 0, 0]}
      />

      {/* Desk 2: Empty Desk for Future Tech Agent */}
      <WorkstationDesk
        position={[1.2, 0, -4.5]}
        hasDualMonitors={true}
        monitorColor="#38bdf8"
        chairPosition={[0, 0, 0.6]}
        chairRotation={[0, 0, 0]}
      />

      {/* Desk 3: Empty Desk for Future Agent */}
      <WorkstationDesk
        position={[-1.2, 0, -2.5]}
        hasDualMonitors={false}
        monitorColor="#10b981"
        chairPosition={[0, 0, -0.6]}
        chairRotation={[0, Math.PI, 0]}
      />

      {/* Desk 4: Empty Desk for Future Agent */}
      <WorkstationDesk
        position={[1.2, 0, -2.5]}
        hasDualMonitors={false}
        monitorColor="#f59e0b"
        chairPosition={[0, 0, -0.6]}
        chairRotation={[0, Math.PI, 0]}
      />

      {/* Cubicle Center Acoustic Divider */}
      <SolidWall position={[0, 0, -3.5]} size={[0.06, 0.9, 3.2]} color="#94a3b8" />
      <SolidWall position={[0, 0, -3.5]} size={[3.2, 0.9, 0.06]} color="#94a3b8" />
    </group>
  )
}

/**
 * ROOM 4: FRONTLINE CS & RECEPTION (Front-Left - Sherloc & Future CS Agent)
 * - Sherloc's Workstation + Empty CS Desk + Reception Counter + Flowchart Whiteboard
 */
function FrontlineCSRoom() {
  const flowTex = useSupportFlowTexture()

  return (
    <group name="frontline-cs-room">
      {/* Room Flooring */}
      <mesh position={[-5.8, 0.005, 3.8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[5.2, 5.2]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.8} />
      </mesh>

      {/* Frontline Walls */}
      <SolidWall position={[-8.4, 0, 3.8]} size={[0.08, 1.3, 5.2]} color="#cbd5e1" />
      <SolidWall position={[-5.8, 0, 6.4]} size={[5.2, 1.3, 0.08]} color="#cbd5e1" />
      <SolidWall position={[-3.2, 0, 4.8]} size={[0.08, 1.3, 3.2]} color="#cbd5e1" />

      {/* Desk 1: Sherloc's CS Workstation */}
      <group position={[-6.0, 0, 4.0]}>
        <WorkstationDesk
          position={[0, 0, 0]}
          hasDualMonitors={true}
          monitorColor="#f43f5e"
          chairPosition={[0, 0, -0.6]}
          chairRotation={[0, 0, 0]}
        />
        {/* Headset Prop on Desk */}
        <group position={[-0.6, 0.62, -0.05]} rotation={[Math.PI / 2, 0, 0.4]}>
          <mesh castShadow>
            <torusGeometry args={[0.08, 0.015, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[-0.08, 0, 0]} castShadow>
            <sphereGeometry args={[0.03, 10, 10]} />
            <meshStandardMaterial color="#d97706" />
          </mesh>
          <mesh position={[0.08, 0, 0]} castShadow>
            <sphereGeometry args={[0.03, 10, 10]} />
            <meshStandardMaterial color="#d97706" />
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
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2.5} />
          </mesh>
          <pointLight position={[0, 1.4, 0]} color="#fbbf24" intensity={1.5} distance={3.5} />
        </group>
      </group>

      {/* Desk 2: Empty CS Desk ready for Future Agent */}
      <WorkstationDesk
        position={[-4.0, 0, 4.0]}
        hasDualMonitors={false}
        monitorColor="#38bdf8"
        chairPosition={[0, 0, -0.6]}
        chairRotation={[0, 0, 0]}
      />

      {/* Support Flowchart Whiteboard */}
      <group position={[-8.1, 0, 3.8]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 1.15, 0]} castShadow>
          <boxGeometry args={[1.9, 1.2, 0.04]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.4} />
        </mesh>
        <mesh position={[0, 1.15, 0.025]}>
          <planeGeometry args={[1.82, 1.12]} />
          <meshBasicMaterial map={flowTex} />
        </mesh>
      </group>

      {/* Reception Counter Desk near Entrance */}
      <group position={[-4.5, 0, 1.8]}>
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
 * ROOM 5: GROWTH & CREATIVE WORKSHOP (Front-Right - Velocia & Scout & Future Agent)
 * - Workstations for Velocia and Scout + 1 Empty Desk + Sprint OKR Whiteboard
 */
function CreativeWorkshopRoom() {
  const sprintTex = useSprintGrowthTexture()

  return (
    <group name="creative-workshop-room">
      {/* Flooring */}
      <mesh position={[5.8, 0.005, 3.8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[5.2, 5.2]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.8} />
      </mesh>

      {/* Walls */}
      <SolidWall position={[8.4, 0, 3.8]} size={[0.08, 1.3, 5.2]} color="#cbd5e1" />
      <SolidWall position={[5.8, 0, 6.4]} size={[5.2, 1.3, 0.08]} color="#cbd5e1" />
      <SolidWall position={[3.2, 0, 4.8]} size={[0.08, 1.3, 3.2]} color="#cbd5e1" />

      {/* Sprint OKR Whiteboard on North Wall */}
      <group position={[5.8, 0, 1.4]} rotation={[0, 0, 0]}>
        <mesh position={[0, 1.15, 0]} castShadow>
          <boxGeometry args={[2.0, 1.2, 0.04]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.4} />
        </mesh>
        <mesh position={[0, 1.15, 0.025]}>
          <planeGeometry args={[1.92, 1.12]} />
          <meshBasicMaterial map={sprintTex} />
        </mesh>
      </group>

      {/* Desk 1: Velocia's Strategy Workstation */}
      <WorkstationDesk
        position={[4.8, 0, 4.2]}
        hasDualMonitors={false}
        monitorColor="#ef4444"
        chairPosition={[0, 0, -0.6]}
        chairRotation={[0, 0, 0]}
      />

      {/* Desk 2: Scout's Creative Workstation */}
      <WorkstationDesk
        position={[6.8, 0, 4.2]}
        hasDualMonitors={false}
        monitorColor="#f59e0b"
        chairPosition={[0, 0, -0.6]}
        chairRotation={[0, 0, 0]}
      />

      {/* Desk 3: Empty Desk ready for Future Growth Agent */}
      <WorkstationDesk
        position={[5.8, 0, 5.8]}
        hasDualMonitors={true}
        monitorColor="#10b981"
        chairPosition={[0, 0, -0.6]}
        chairRotation={[0, 0, 0]}
      />
    </group>
  )
}

/**
 * ROOM 6: CENTRAL SOCIAL LOUNGE, BREAKROOM & PANTRY
 */
function CentralSocialLounge() {
  return (
    <group name="central-social-lounge" position={[0, 0, 2.5]}>
      {/* Designer Patterned Rug */}
      <mesh position={[0, 0.01, 1.8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.8, 2.2]} />
        <meshStandardMaterial color="#e0e7ff" roughness={0.9} />
      </mesh>

      {/* Plush Beige Lounge Sofa */}
      <group position={[0, 0, 1.2]}>
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
      <group position={[0, 0, 2.1]}>
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
      <mesh position={[-1.0, 0.16, 2.2]} castShadow>
        <sphereGeometry args={[0.26, 16, 16]} />
        <meshStandardMaterial color="#f43f5e" roughness={0.8} />
      </mesh>
      <mesh position={[1.0, 0.16, 2.2]} castShadow>
        <sphereGeometry args={[0.26, 16, 16]} />
        <meshStandardMaterial color="#06b6d4" roughness={0.8} />
      </mesh>

      {/* Pantry Kitchenette Counter */}
      <group position={[-1.8, 0, -1.0]}>
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
      <AnimatedAquarium position={[1.8, 0, -1.0]} />
    </group>
  )
}

/**
 * MAIN DIORAMA OFFICE COMPONENT
 * Full Gather-Inspired Functional Floor Map with 6 Dedicated Rooms
 */
export default function DioramaOffice() {
  return (
    <group name="gather-diorama-root">
      {/* 1. Large Rounded Floor Platform (18.0 x 14.0) */}
      <FloatingPlatform />

      {/* 2. Room 1: Executive COO Private Office (Back-Right) */}
      <ExecutiveCOORoom />

      {/* 3. Room 2: Datacenter & Telemetry Lab (Back-Left - Nara) */}
      <DatacenterTelemetryRoom />

      {/* 4. Room 3: Tech & Operations Bay (Back-Center - Watson & Future Agents) */}
      <TechOperationsBay />

      {/* 5. Room 4: Frontline CS & Reception (Front-Left - Sherloc & Future CS Agent) */}
      <FrontlineCSRoom />

      {/* 6. Room 5: Growth & Creative Workshop (Front-Right - Velocia & Scout & Future Agent) */}
      <CreativeWorkshopRoom />

      {/* 7. Room 6: Central Social Lounge, Breakroom & Pantry */}
      <CentralSocialLounge />

      {/* 8. Autonomous Floor Cleaning Robot (Roomba) */}
      <RoombaRobot />
    </group>
  )
}
