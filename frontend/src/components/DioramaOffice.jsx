import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import RoombaRobot from './RoombaRobot'

/**
 * Creates dynamic high-res canvas textures for procedural presentation boards,
 * holographic monitors, and tablet screens matching the curated clay diorama.
 */
function useDashboardScreenTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 640
    const ctx = canvas.getContext('2d')

    // Clean Whiteboard Canvas
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Header Bar
    ctx.fillStyle = '#0f172a'
    ctx.font = 'bold 32px sans-serif'
    ctx.fillText('📊 MARKETING & SPRINT OKRs', 50, 65)

    ctx.fillStyle = '#64748b'
    ctx.font = '600 20px sans-serif'
    ctx.fillText('Active Channels: 6 Agents • Live Execution Stream', 50, 100)

    // Divider line
    ctx.strokeStyle = '#e2e8f0'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(40, 120)
    ctx.lineTo(canvas.width - 40, 120)
    ctx.stroke()

    // Upward Trending Blue Curve
    ctx.strokeStyle = '#38bdf8'
    ctx.lineWidth = 8
    ctx.beginPath()
    const curvePoints = [
      [60, 480],
      [160, 440],
      [280, 460],
      [420, 320],
      [560, 360],
      [720, 240],
      [880, 190],
      [960, 160]
    ]
    curvePoints.forEach(([x, y], i) => {
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()

    // Curve glowing points
    curvePoints.forEach(([x, y]) => {
      ctx.beginPath()
      ctx.arc(x, y, 10, 0, Math.PI * 2)
      ctx.fillStyle = '#0284c7'
      ctx.fill()
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fillStyle = '#ffffff'
      ctx.fill()
    })

    // Bar Chart
    const bars = [120, 180, 150, 240, 290, 260, 340]
    const barWidth = 42
    const startX = 80
    const baseY = 550
    bars.forEach((h, i) => {
      const x = startX + i * 78
      ctx.fillStyle = i % 2 === 0 ? '#f59e0b' : '#f43f5e'
      ctx.fillRect(x, baseY - h, barWidth, h)
    })

    // OKR Metric Badges on Right
    ctx.fillStyle = '#f0fdf4'
    ctx.fillRect(680, 280, 280, 110)
    ctx.strokeStyle = '#86efac'
    ctx.strokeRect(680, 280, 280, 110)

    ctx.fillStyle = '#15803d'
    ctx.font = 'bold 36px sans-serif'
    ctx.fillText('+142.8%', 710, 335)
    ctx.font = '600 18px sans-serif'
    ctx.fillText('Sprint Conversion Lift', 710, 368)

    // Task checklist on bottom right
    ctx.fillStyle = '#f8fafc'
    ctx.fillRect(680, 410, 280, 140)
    ctx.fillStyle = '#0f172a'
    ctx.font = 'bold 18px sans-serif'
    ctx.fillText('✔️ WhatsApp Inbound OK', 705, 445)
    ctx.fillText('✔️ Fleet Telemetry Nominal', 705, 480)
    ctx.fillText('✔️ RAG Knowledge Synced', 705, 515)

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])
}

/**
 * Procedural CS Support Flowchart Texture for Frontline Whiteboard
 */
function useSupportFlowTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 640
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Header
    ctx.fillStyle = '#0f172a'
    ctx.font = 'bold 30px sans-serif'
    ctx.fillText('💬 ORIN 24/7 SUPPORT & TRIAGE FLOW', 40, 60)

    ctx.strokeStyle = '#e2e8f0'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(40, 90)
    ctx.lineTo(canvas.width - 40, 90)
    ctx.stroke()

    // Step 1: Inbound
    ctx.fillStyle = '#fef2f2'
    ctx.fillRect(60, 140, 240, 160)
    ctx.strokeStyle = '#f87171'
    ctx.strokeRect(60, 140, 240, 160)
    ctx.fillStyle = '#991b1b'
    ctx.font = 'bold 20px sans-serif'
    ctx.fillText('1. WA Inbound', 85, 185)
    ctx.font = '16px sans-serif'
    ctx.fillText('• Validasi Nomor', 85, 220)
    ctx.fillText('• FAQ Otomatis', 85, 250)
    ctx.fillText('• Customer Profiling', 85, 280)

    // Arrow 1
    ctx.fillStyle = '#64748b'
    ctx.font = 'bold 28px sans-serif'
    ctx.fillText('➔', 320, 225)

    // Step 2: Triage
    ctx.fillStyle = '#f0f9ff'
    ctx.fillRect(380, 140, 260, 160)
    ctx.strokeStyle = '#38bdf8'
    ctx.strokeRect(380, 140, 260, 160)
    ctx.fillStyle = '#0369a1'
    ctx.font = 'bold 20px sans-serif'
    ctx.fillText('2. Intelligent Triage', 405, 185)
    ctx.font = '16px sans-serif'
    ctx.fillText('• Issue GPS ➔ Nara', 405, 220)
    ctx.fillText('• Tech Firmware ➔ Watson', 405, 250)
    ctx.fillText('• Escalation ➔ COO', 405, 280)

    // Arrow 2
    ctx.fillStyle = '#64748b'
    ctx.fillText('➔', 665, 225)

    // Step 3: Resolution & RAG
    ctx.fillStyle = '#f0fdf4'
    ctx.fillRect(720, 140, 240, 160)
    ctx.strokeStyle = '#4ade80'
    ctx.strokeRect(720, 140, 240, 160)
    ctx.fillStyle = '#166534'
    ctx.font = 'bold 20px sans-serif'
    ctx.fillText('3. Knowledge Loop', 740, 185)
    ctx.font = '16px sans-serif'
    ctx.fillText('• Q&A Harvested', 740, 220)
    ctx.fillText('• Vector RAG Sync', 740, 250)
    ctx.fillText('• Feedback Closed', 740, 280)

    // Stats bar below
    ctx.fillStyle = '#f8fafc'
    ctx.fillRect(60, 360, 900, 220)
    ctx.strokeStyle = '#cbd5e1'
    ctx.strokeRect(60, 360, 900, 220)

    ctx.fillStyle = '#0f172a'
    ctx.font = 'bold 24px sans-serif'
    ctx.fillText('📊 Live CS Performance', 90, 410)
    ctx.fillStyle = '#059669'
    ctx.font = 'bold 36px sans-serif'
    ctx.fillText('99.4%', 90, 480)
    ctx.font = '16px sans-serif'
    ctx.fillStyle = '#64748b'
    ctx.fillText('First Response Rate', 90, 520)

    ctx.fillStyle = '#2563eb'
    ctx.font = 'bold 36px sans-serif'
    ctx.fillText('14s', 420, 480)
    ctx.font = '16px sans-serif'
    ctx.fillStyle = '#64748b'
    ctx.fillText('Average Latency', 420, 520)

    ctx.fillStyle = '#d97706'
    ctx.font = 'bold 36px sans-serif'
    ctx.fillText('1,420+', 720, 480)
    ctx.font = '16px sans-serif'
    ctx.fillStyle = '#64748b'
    ctx.fillText('Resolved This Week', 720, 520)

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])
}

/**
 * 1. FLOATING DIORAMA PLATFORM (Expanded for Gather-Style Layout: 17.0 x 12.8)
 */
function FloatingPlatform() {
  const platformGeometry = useMemo(() => {
    const width = 17.0
    const depth = 12.8
    const radius = 1.2
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

    const extrudeSettings = {
      depth: height,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.06,
      bevelThickness: 0.05
    }

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings)
    geom.rotateX(Math.PI / 2)
    geom.translate(0, -0.05, 0)
    return geom
  }, [])

  return (
    <group position={[0, 0, 0]}>
      {/* Matte Porcelain Clay Base */}
      <mesh geometry={platformGeometry} receiveShadow castShadow>
        <meshStandardMaterial color="#ffffff" roughness={0.65} metalness={0.02} />
      </mesh>
      {/* Architectural Inset Pedestal Base */}
      <mesh position={[0, -0.26, 0]} receiveShadow>
        <boxGeometry args={[16.6, 0.22, 12.4]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.65} metalness={0.06} />
      </mesh>
      {/* Recessed Dark Shadow Base Rim */}
      <mesh position={[0, -0.4, 0]} receiveShadow>
        <boxGeometry args={[16.0, 0.08, 11.8]} />
        <meshStandardMaterial color="#64748b" roughness={0.8} />
      </mesh>
    </group>
  )
}

/**
 * Modern Ergonomic Office Swivel Chair
 */
function ErgonomicOfficeChair({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* 5-Star Wheel Base */}
      <mesh position={[0, 0.04, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.24, 0.03, 10]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Chrome Stem */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.32, 10]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Curved Seat Cushion */}
      <mesh position={[0, 0.38, 0]} castShadow>
        <boxGeometry args={[0.38, 0.07, 0.36]} />
        <meshStandardMaterial color="#ffffff" roughness={0.6} metalness={0.02} />
      </mesh>
      {/* Ergonomic Curved Backrest */}
      <mesh position={[0, 0.62, -0.16]} rotation={[0.08, 0, 0]} castShadow>
        <boxGeometry args={[0.36, 0.44, 0.05]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.65} metalness={0.02} />
      </mesh>
      {/* Armrests */}
      <mesh position={[-0.2, 0.5, 0]} castShadow>
        <boxGeometry args={[0.04, 0.18, 0.24]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.5} />
      </mesh>
      <mesh position={[0.2, 0.5, 0]} castShadow>
        <boxGeometry args={[0.04, 0.18, 0.24]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.5} />
      </mesh>
    </group>
  )
}

/**
 * Tinted Glass / Low Partition Divider
 */
function PartitionWall({ position = [0, 0, 0], size = [2, 1.1, 0.06], isGlass = false }) {
  return (
    <group position={position}>
      {/* Base Rail */}
      <mesh position={[0, 0.03, 0]} castShadow>
        <boxGeometry args={[size[0], 0.06, size[2] + 0.04]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Panel */}
      <mesh position={[0, size[1] / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[size[0] - 0.04, size[1] - 0.06, size[2]]} />
        {isGlass ? (
          <meshStandardMaterial
            color="#bae6fd"
            transparent
            opacity={0.45}
            roughness={0.2}
            metalness={0.1}
          />
        ) : (
          <meshStandardMaterial
            color="#f1f5f9"
            roughness={0.7}
            metalness={0.02}
          />
        )}
      </mesh>
      {/* Top Wood/Aluminum Cap */}
      <mesh position={[0, size[1], 0]} castShadow>
        <boxGeometry args={[size[0], 0.04, size[2] + 0.02]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.5} />
      </mesh>
    </group>
  )
}

/**
 * ZONE 1: FRONTLINE & CUSTOMER EXPERIENCE ROOM (Front-Left)
 * - Curved reception counter with monitor
 * - Interactive support flowchart whiteboard
 * - Station Sherloc: CS desk, headset prop, standing notification lamp
 */
function FrontlineRoom({ position = [-4.6, 0, 3.4] }) {
  const flowTex = useSupportFlowTexture()

  return (
    <group position={position}>
      {/* Curved Reception Counter Desk */}
      <group position={[1.8, 0, -1.6]}>
        <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 1.1, 0.45]} />
          <meshStandardMaterial color="#ffffff" roughness={0.65} metalness={0.02} />
        </mesh>
        {/* Wood Counter Top */}
        <mesh position={[0, 1.12, 0]} castShadow>
          <boxGeometry args={[1.9, 0.05, 0.52]} />
          <meshStandardMaterial color="#fcd34d" roughness={0.5} />
        </mesh>
        {/* Reception Monitor */}
        <mesh position={[0, 1.25, 0]} rotation={[0, -0.3, 0]} castShadow>
          <boxGeometry args={[0.35, 0.22, 0.02]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Welcome Signage */}
        <mesh position={[0, 0.7, 0.24]}>
          <planeGeometry args={[1.2, 0.3]} />
          <meshBasicMaterial color="#d97706" />
        </mesh>
      </group>

      {/* Support Flowchart Whiteboard */}
      <group position={[-1.6, 0, 1.2]} rotation={[0, 0.35, 0]}>
        {/* Board Frame */}
        <mesh position={[0, 1.15, 0]} castShadow>
          <boxGeometry args={[1.9, 1.2, 0.04]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.4} />
        </mesh>
        {/* Texture Face */}
        <mesh position={[0, 1.15, 0.025]}>
          <planeGeometry args={[1.82, 1.12]} />
          <meshBasicMaterial map={flowTex} />
        </mesh>
        {/* Wheeled Legs */}
        {[-0.8, 0.8].map((lx, idx) => (
          <group key={idx} position={[lx, 0.5, 0]}>
            <mesh position={[0, 0, 0]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 1.0, 8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.7} />
            </mesh>
            <mesh position={[0, -0.48, 0]} castShadow>
              <boxGeometry args={[0.08, 0.04, 0.3]} />
              <meshStandardMaterial color="#64748b" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Sherloc's CS Workstation Desk */}
      <group position={[0.1, 0, -0.2]}>
        {/* Desk */}
        <mesh position={[0, 0.58, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.045, 0.75]} />
          <meshStandardMaterial color="#ffffff" roughness={0.65} metalness={0.04} />
        </mesh>
        {/* Legs */}
        {[-0.82, 0.82].map((lx, idx) => (
          <mesh key={idx} position={[lx, 0.28, 0]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.56, 10]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} />
          </mesh>
        ))}

        {/* Dual CS Monitors */}
        <group position={[-0.25, 0.8, 0.15]} rotation={[0, 0.1, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.55, 0.32, 0.02]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <planeGeometry args={[0.52, 0.29]} />
            <meshBasicMaterial color="#f43f5e" />
          </mesh>
        </group>
        <group position={[0.35, 0.8, 0.12]} rotation={[0, -0.2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.55, 0.32, 0.02]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <planeGeometry args={[0.52, 0.29]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>

        {/* Headset Prop on Desk */}
        <group position={[-0.65, 0.63, -0.1]} rotation={[Math.PI / 2, 0, 0.4]}>
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

        {/* Standing Notification Lamp (Warm Gold Glow) */}
        <group position={[0.95, 0, 0.2]}>
          <mesh position={[0, 0.03, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.14, 0.05, 16]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
          <mesh position={[0, 0.75, 0]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 1.45, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.7} />
          </mesh>
          <mesh position={[0, 1.48, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#fbbf24"
              emissiveIntensity={2.5}
            />
          </mesh>
          <pointLight position={[0, 1.48, 0]} color="#fbbf24" intensity={1.5} distance={3.5} />
        </group>

        {/* Ergonomic Chair for Sherloc */}
        <ErgonomicOfficeChair position={[0, 0, -0.55]} rotation={[0, 0, 0]} />
      </group>
    </group>
  )
}

/**
 * Animated Mini Server Rack with Blinking LEDs
 */
function MiniServerRack({ position = [0, 0, 0] }) {
  const ledRef = useRef()

  useFrame((state) => {
    if (!ledRef.current) return
    const t = state.clock.getElapsedTime()
    ledRef.current.children.forEach((child, i) => {
      if (child.material) {
        child.material.emissiveIntensity = 0.5 + Math.sin(t * 8 + i * 1.5) * 1.5
      }
    })
  })

  return (
    <group position={position}>
      {/* Server Tower Housing */}
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.65, 1.6, 0.6]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Glass Front Door */}
      <mesh position={[0, 0.8, 0.31]}>
        <boxGeometry args={[0.58, 1.52, 0.02]} />
        <meshStandardMaterial color="#0284c7" transparent opacity={0.35} />
      </mesh>
      {/* Blinking Rack Blade Blades */}
      <group ref={ledRef} position={[0, 0.2, 0.29]}>
        {[0, 0.25, 0.5, 0.75, 1.0, 1.25].map((y, idx) => (
          <mesh key={idx} position={[0, y, 0]}>
            <boxGeometry args={[0.5, 0.08, 0.02]} />
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
 * ZONE 2: CORE OPERATIONS & TELEMETRY LAB (Back-Center/Left)
 * - Workstations for Watson (Diagnostics & Logs) & Nara (Fleet Telemetry)
 * - Server rack with blinking LEDs
 */
function OperationsLab({ position = [-0.6, 0, -3.2] }) {
  return (
    <group position={position}>
      {/* Workstation 1: Watson's Diagnostic & Escalation Desk */}
      <group position={[-1.2, 0, 0]}>
        <mesh position={[0, 0.58, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.7, 0.045, 0.75]} />
          <meshStandardMaterial color="#ffffff" roughness={0.65} metalness={0.04} />
        </mesh>
        {/* Legs */}
        {[-0.78, 0.78].map((lx, idx) => (
          <mesh key={idx} position={[lx, 0.28, 0]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.56, 10]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} />
          </mesh>
        ))}
        {/* Curved Ultrawide Monitor (Diagnostics) */}
        <group position={[0, 0.85, 0.18]}>
          <mesh castShadow>
            <boxGeometry args={[0.72, 0.28, 0.03]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 0, 0.017]}>
            <planeGeometry args={[0.68, 0.25]} />
            <meshBasicMaterial color="#1d4ed8" />
          </mesh>
        </group>
        {/* Diagnostic Oscilloscope / CPU Box */}
        <mesh position={[-0.55, 0.68, 0.1]} castShadow>
          <boxGeometry args={[0.26, 0.16, 0.22]} />
          <meshStandardMaterial color="#334155" metalness={0.5} />
        </mesh>
        {/* Keyboard & Mouse */}
        <mesh position={[0, 0.61, -0.1]} castShadow>
          <boxGeometry args={[0.34, 0.01, 0.12]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
        {/* Watson's Ergonomic Chair */}
        <ErgonomicOfficeChair position={[0, 0, -0.55]} rotation={[0, 0, 0]} />
      </group>

      {/* Workstation 2: Nara's Fleet GPS Telemetry Desk */}
      <group position={[1.2, 0, 0]}>
        <mesh position={[0, 0.58, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.7, 0.045, 0.75]} />
          <meshStandardMaterial color="#ffffff" roughness={0.65} metalness={0.04} />
        </mesh>
        {/* Legs */}
        {[-0.78, 0.78].map((lx, idx) => (
          <mesh key={idx} position={[lx, 0.28, 0]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.56, 10]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} />
          </mesh>
        ))}
        {/* Dual Telemetry Monitors */}
        <group position={[-0.22, 0.82, 0.18]} rotation={[0, 0.15, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.5, 0.3, 0.02]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <planeGeometry args={[0.47, 0.27]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>
        <group position={[0.32, 0.82, 0.16]} rotation={[0, -0.15, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.5, 0.3, 0.02]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <planeGeometry args={[0.47, 0.27]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
        </group>
        {/* Nara's Ergonomic Chair */}
        <ErgonomicOfficeChair position={[0, 0, -0.55]} rotation={[0, 0, 0]} />
      </group>

      {/* Acoustic Divider Between Desks */}
      <PartitionWall position={[0, 0, 0]} size={[0.08, 0.95, 0.75]} />

      {/* Mini Server Rack in Back Corner */}
      <MiniServerRack position={[-2.4, 0, -1.8]} />
    </group>
  )
}

/**
 * ZONE 3: EXECUTIVE & COORDINATION OFFICE (Back-Right)
 * - Executive dark wood desk, open laptop (Telegram/Orchestration feed)
 * - Bookshelf / file cabinet behind desk
 * - Station COO
 */
function ExecutiveOffice({ position = [5.4, 0, -3.2] }) {
  return (
    <group position={position}>
      {/* Executive Wooden Desk */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.58, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.1, 0.06, 0.85]} />
          <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.2} />
        </mesh>
        {/* Solid Wood Side Panels */}
        {[-0.98, 0.98].map((lx, idx) => (
          <mesh key={idx} position={[lx, 0.28, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.08, 0.56, 0.8]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} />
          </mesh>
        ))}
        {/* Leather Desk Blotter */}
        <mesh position={[0, 0.615, 0]} castShadow>
          <boxGeometry args={[0.85, 0.008, 0.45]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
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
        <group position={[0.75, 0.62, 0.2]}>
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
        <group position={[0, 0, -0.58]}>
          <ErgonomicOfficeChair />
          {/* Taller Leather Headrest */}
          <mesh position={[0, 0.94, -0.18]} castShadow>
            <boxGeometry args={[0.32, 0.22, 0.06]} />
            <meshStandardMaterial color="#334155" roughness={0.6} />
          </mesh>
        </group>
      </group>

      {/* Bookshelf & File Cabinet Behind Desk */}
      <group position={[0, 0, -1.8]}>
        <mesh position={[0, 0.95, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 1.9, 0.4]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
        {/* Shelves & Colorful Books */}
        {[-0.45, 0.05, 0.55].map((sy, sidx) => (
          <group key={sidx} position={[0, sy + 0.95, 0.05]}>
            {/* Shelf board */}
            <mesh position={[0, -0.15, 0]}>
              <boxGeometry args={[2.1, 0.03, 0.35]} />
              <meshStandardMaterial color="#334155" />
            </mesh>
            {/* Book clusters */}
            {[-0.7, -0.2, 0.4].map((bx, bidx) => (
              <mesh key={bidx} position={[bx, 0, 0]} castShadow>
                <boxGeometry args={[0.25, 0.26, 0.22]} />
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
 * ZONE 4: GROWTH & CREATIVE WORKSHOP (Mid-Right)
 * - Brainstorming table, moodboards, reference books, design tablets
 * - Standing interactive presentation whiteboard
 * - Workstations for Velocia & Scout
 */
function CreativeWorkshop({ position = [5.2, 0, 1.2] }) {
  const boardTex = useDashboardScreenTexture()

  return (
    <group position={position}>
      {/* Standing Presentation Whiteboard Screen */}
      <group position={[-1.6, 0, -0.2]} rotation={[0, 0.4, 0]}>
        <mesh position={[0, 1.15, 0]} castShadow>
          <boxGeometry args={[1.9, 1.2, 0.04]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.4} />
        </mesh>
        <mesh position={[0, 1.15, 0.025]}>
          <planeGeometry args={[1.82, 1.12]} />
          <meshBasicMaterial map={boardTex} />
        </mesh>
        {[-0.8, 0.8].map((lx, idx) => (
          <mesh key={idx} position={[lx, 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 1.0, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.7} />
          </mesh>
        ))}
      </group>

      {/* Brainstorming Long Desk (Velocia & Scout) */}
      <group position={[0.4, 0, 0]}>
        <mesh position={[0, 0.58, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.045, 0.8]} />
          <meshStandardMaterial color="#ffffff" roughness={0.65} metalness={0.04} />
        </mesh>
        {[-1.0, 1.0].map((lx, idx) => (
          <mesh key={idx} position={[lx, 0.28, 0]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.56, 10]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} />
          </mesh>
        ))}

        {/* Velocia's Strategy Laptop & Notes */}
        <group position={[-0.6, 0.61, 0.1]}>
          <mesh castShadow>
            <boxGeometry args={[0.28, 0.012, 0.18]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.8} />
          </mesh>
          <mesh position={[0.26, 0, 0]} castShadow>
            <boxGeometry args={[0.16, 0.01, 0.22]} />
            <meshStandardMaterial color="#fca5a5" />
          </mesh>
        </group>

        {/* Scout's Design Tablet & Color Swatches */}
        <group position={[0.6, 0.61, 0.1]}>
          <mesh rotation={[0, 0.15, 0]} castShadow>
            <boxGeometry args={[0.22, 0.01, 0.3]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0.24, 0, -0.05]} castShadow>
            <boxGeometry args={[0.14, 0.008, 0.18]} />
            <meshStandardMaterial color="#fef08a" />
          </mesh>
        </group>

        {/* Ergonomic Chairs */}
        <ErgonomicOfficeChair position={[-0.6, 0, -0.55]} rotation={[0, 0, 0]} />
        <ErgonomicOfficeChair position={[0.6, 0, -0.55]} rotation={[0, 0, 0]} />
      </group>
    </group>
  )
}

/**
 * Animated 3D Glass Aquarium with Swimming Fish
 */
function AnimatedAquarium({ position = [0, 0, 0] }) {
  const fish1Ref = useRef()
  const fish2Ref = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (fish1Ref.current) {
      fish1Ref.current.position.x = Math.sin(t * 1.2) * 0.25
      fish1Ref.current.position.y = 0.55 + Math.cos(t * 1.8) * 0.06
      fish1Ref.current.rotation.y = Math.cos(t * 1.2) > 0 ? 0 : Math.PI
    }
    if (fish2Ref.current) {
      fish2Ref.current.position.x = -Math.sin(t * 0.9) * 0.2
      fish2Ref.current.position.y = 0.42 + Math.sin(t * 2.2) * 0.05
      fish2Ref.current.rotation.y = -Math.cos(t * 0.9) > 0 ? 0 : Math.PI
    }
  })

  return (
    <group position={position}>
      {/* Cabinet Stand */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.7, 0.5]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>
      {/* Glass Tank */}
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[0.82, 0.5, 0.42]} />
        <meshStandardMaterial
          color="#38bdf8"
          transparent
          opacity={0.35}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>
      {/* Water Fill */}
      <mesh position={[0, 0.83, 0]}>
        <boxGeometry args={[0.78, 0.44, 0.38]} />
        <meshStandardMaterial
          color="#0284c7"
          transparent
          opacity={0.45}
          roughness={0.1}
        />
      </mesh>
      {/* Gravel Bed */}
      <mesh position={[0, 0.63, 0]}>
        <boxGeometry args={[0.78, 0.04, 0.38]} />
        <meshStandardMaterial color="#d4a373" roughness={0.9} />
      </mesh>
      {/* Aquatic Plants */}
      <mesh position={[-0.25, 0.75, 0]}>
        <cylinderGeometry args={[0.01, 0.04, 0.22, 6]} />
        <meshStandardMaterial color="#15803d" />
      </mesh>
      {/* Animated Fish 1 (Orange Goldfish) */}
      <mesh ref={fish1Ref} position={[0, 0.8, 0]}>
        <coneGeometry args={[0.025, 0.08, 8]} />
        <meshStandardMaterial color="#f97316" roughness={0.3} />
      </mesh>
      {/* Animated Fish 2 (Yellow Guppy) */}
      <mesh ref={fish2Ref} position={[0, 0.75, 0]}>
        <coneGeometry args={[0.02, 0.06, 8]} />
        <meshStandardMaterial color="#eab308" roughness={0.3} />
      </mesh>
      {/* Top Aquarium Hood & Lamp */}
      <mesh position={[0, 1.12, 0]}>
        <boxGeometry args={[0.84, 0.04, 0.44]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <pointLight position={[0, 1.0, 0]} color="#38bdf8" intensity={1.2} distance={2.5} />
    </group>
  )
}

/**
 * ZONE 5: PANTRY, BREAKROOM & SOCIAL LOUNGE
 * - 5A: Pantry & Aquarium Corner (Back-Left)
 * - 5B: Social Lounge & Breakroom (Front-Right)
 */
function PantryAndSocialLounge() {
  return (
    <>
      {/* 5A: PANTRY & AQUARIUM CORNER (Back-Left) */}
      <group position={[-5.8, 0, -3.2]}>
        {/* Kitchen Pantry Counter */}
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.9, 1.04, 0.6]} />
            <meshStandardMaterial color="#ffffff" roughness={0.6} />
          </mesh>
          {/* Wood Countertop */}
          <mesh position={[0, 1.05, 0]} castShadow>
            <boxGeometry args={[1.96, 0.06, 0.66]} />
            <meshStandardMaterial color="#d4a373" roughness={0.5} />
          </mesh>
          {/* Espresso Machine */}
          <group position={[-0.55, 1.2, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.3, 0.28, 0.25]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.7} />
            </mesh>
            <mesh position={[0, -0.06, 0.14]} castShadow>
              <cylinderGeometry args={[0.03, 0.02, 0.05, 10]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>
          {/* Water Gallon Dispenser */}
          <group position={[0.55, 1.25, 0]}>
            {/* Dispenser Body */}
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[0.26, 0.35, 0.25]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            {/* Inverted Blue Water Bottle */}
            <mesh position={[0, 0.32, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.12, 0.32, 16]} />
              <meshStandardMaterial color="#0284c7" transparent opacity={0.7} />
            </mesh>
          </group>
        </group>

        {/* 3D Glass Aquarium */}
        <AnimatedAquarium position={[-1.8, 0, 0.5]} />
      </group>

      {/* 5B: SOCIAL LOUNGE & BREAKROOM (Front-Right) */}
      <group position={[3.6, 0, 4.0]}>
        {/* Colorful Designer Rug */}
        <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[3.6, 2.5]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.016, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[3.3, 2.2]} />
          <meshStandardMaterial color="#e0e7ff" roughness={0.9} />
        </mesh>

        {/* Plush Long Lounge Sofa */}
        <group position={[0, 0, -0.6]}>
          <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.5, 0.26, 0.8]} />
            <meshStandardMaterial color="#ffffff" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.5, -0.32]} castShadow>
            <boxGeometry args={[2.5, 0.38, 0.18]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.7} />
          </mesh>
          {[-1.2, 1.2].map((ax, idx) => (
            <mesh key={idx} position={[ax, 0.36, 0]} castShadow>
              <boxGeometry args={[0.18, 0.26, 0.8]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.7} />
            </mesh>
          ))}
        </group>

        {/* Round Coffee Table */}
        <group position={[0, 0, 0.4]}>
          <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.45, 0.45, 0.04, 24]} />
            <meshStandardMaterial color="#ffffff" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.11, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.1, 0.2, 12]} />
            <meshStandardMaterial color="#d4a373" roughness={0.6} />
          </mesh>
          {/* Magazines on table */}
          <mesh position={[0.08, 0.25, 0]} rotation={[0, 0.2, 0]} castShadow>
            <boxGeometry args={[0.2, 0.01, 0.26]} />
            <meshStandardMaterial color="#38bdf8" />
          </mesh>
        </group>

        {/* Cute Plush Beanbags */}
        <group position={[-1.3, 0, 0.6]}>
          <mesh position={[0, 0.18, 0]} castShadow>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="#f43f5e" roughness={0.8} />
          </mesh>
        </group>
        <group position={[1.3, 0, 0.6]}>
          <mesh position={[0, 0.18, 0]} castShadow>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="#06b6d4" roughness={0.8} />
          </mesh>
        </group>

        {/* Tall Potted Monstera Plant */}
        <group position={[2.0, 0, -0.6]}>
          <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.24, 0.18, 0.6, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.8, 0]} castShadow>
            <cylinderGeometry args={[0.025, 0.035, 0.6, 8]} />
            <meshStandardMaterial color="#78350f" roughness={0.7} />
          </mesh>
          {[0.8, 0.95, 1.1, 1.25].map((ly, lidx) => (
            <group key={lidx} position={[0, ly, 0]} rotation={[0, (lidx * Math.PI) / 2 + 0.3, 0]}>
              <mesh position={[0.18, 0, 0]} rotation={[0, 0, -0.3]} castShadow>
                <sphereGeometry args={[0.22, 8, 8]} />
                <meshStandardMaterial color="#15803d" roughness={0.5} />
              </mesh>
            </group>
          ))}
        </group>
      </group>
    </>
  )
}

/**
 * 2. GATHER-STYLE ROOM PARTITIONS
 * Semi-open partitions, tinted glass walls, and hallway dividers
 */
function RoomPartitions() {
  return (
    <group name="office-partitions">
      {/* Frontline Room Partition (Dividing Frontline from Hallway) */}
      <PartitionWall position={[-4.8, 0, 1.4]} size={[4.5, 1.1, 0.06]} isGlass={false} />
      <PartitionWall position={[-2.4, 0, 3.6]} size={[0.06, 1.1, 4.2]} isGlass={true} />

      {/* Executive COO Office Glass Enclosure */}
      <PartitionWall position={[3.2, 0, -3.4]} size={[0.06, 1.5, 4.4]} isGlass={true} />
      <PartitionWall position={[5.4, 0, -1.2]} size={[4.2, 1.2, 0.06]} isGlass={true} />

      {/* Workshop Low Bookshelf Partition */}
      <PartitionWall position={[3.2, 0, 1.2]} size={[0.06, 1.1, 4.2]} isGlass={false} />
      <PartitionWall position={[5.4, 0, 2.8]} size={[4.2, 1.1, 0.06]} isGlass={false} />

      {/* Hallway Potted Planters at Intersections */}
      {[-1.2, 1.8].map((px, idx) => (
        <group key={idx} position={[px, 0, 0.8]}>
          <mesh position={[0, 0.22, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.14, 0.44, 12]} />
            <meshStandardMaterial color="#ffffff" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.52, 0]} castShadow>
            <sphereGeometry args={[0.18, 10, 10]} />
            <meshStandardMaterial color="#16a34a" roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/**
 * MAIN DIORAMA OFFICE COMPONENT
 * Curated Clay Gather-Style 1-Floor Map with 5 Functional Zones & Roomba Robot
 */
export default function DioramaOffice() {
  return (
    <group name="gather-style-clay-diorama-root">
      {/* 1. Flat Rounded Porcelain Clay Platform */}
      <FloatingPlatform />

      {/* 2. Room Partitions & Dividers */}
      <RoomPartitions />

      {/* 3. Zone 1: Frontline & Customer Experience (Sherloc) */}
      <FrontlineRoom />

      {/* 4. Zone 2: Core Operations & Telemetry Lab (Watson & Nara) */}
      <OperationsLab />

      {/* 5. Zone 3: Executive & Coordination Office (COO) */}
      <ExecutiveOffice />

      {/* 6. Zone 4: Growth & Creative Workshop (Velocia & Scout) */}
      <CreativeWorkshop />

      {/* 7. Zone 5: Pantry, Aquarium & Social Lounge */}
      <PantryAndSocialLounge />

      {/* 8. Autonomous Floor Cleaning Robot (Roomba) */}
      <RoombaRobot />
    </group>
  )
}
