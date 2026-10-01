import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Creates dynamic high-res canvas textures for procedural presentation boards,
 * holographic monitors, and easel paintings matching the reference image.
 */
function useOfficeScreenTexture(type = 'presentation_board') {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 640
    const ctx = canvas.getContext('2d')

    if (type === 'presentation_board') {
      // Whiteboard with clean modern analytics matching reference image
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

      // Upward Trending Blue Curve (like in reference image)
      ctx.strokeStyle = '#38bdf8'
      ctx.lineWidth = 7
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
        ctx.arc(x, y, 9, 0, Math.PI * 2)
        ctx.fillStyle = '#0284c7'
        ctx.fill()
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fillStyle = '#ffffff'
        ctx.fill()
      })

      // Bar Chart (Pastel orange / coral like reference image)
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
    } else if (type === 'analytics') {
      ctx.fillStyle = '#1c0f16'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 28px sans-serif'
      ctx.fillText('⚡ AI AGENT ANALYTICS STREAM', 50, 60)
    } else if (type === 'code') {
      ctx.fillStyle = '#061325'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#38bdf8'
      ctx.font = 'bold 24px monospace'
      ctx.fillText('⚙️ SYSTEM PROTOCOL & KNOWLEDGE HARVESTER', 50, 60)
    } else if (type === 'painting') {
      ctx.fillStyle = '#bae6fd'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [type])
}

/**
 * 1. DIORAMA BASE PLATFORM
 * Flat porcelain diorama slab flush at Y = 0 with smooth rounded corners.
 */
function DioramaPlatform() {
  const platformGeometry = useMemo(() => {
    const width = 17.6
    const depth = 12.0
    const radius = 1.4
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
      <mesh geometry={platformGeometry} receiveShadow castShadow>
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.2}
          metalness={0.02}
        />
      </mesh>
      {/* Subtle chamfer line */}
      <mesh position={[0, -0.38, 0]} receiveShadow>
        <cylinderGeometry args={[8.8, 8.8, 0.04, 32]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.4} />
      </mesh>
    </group>
  )
}

/**
 * Modern Ergonomic White Office Swivel Chair (with armrests & star base)
 */
function ErgonomicOfficeChair({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* 5-Star Wheel Base */}
      <mesh position={[0, 0.04, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.24, 0.03, 10]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Chrome Hydraulic Stem */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.32, 10]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Seat Cushion (Curved White/Beige) */}
      <mesh position={[0, 0.38, 0]} castShadow>
        <boxGeometry args={[0.38, 0.07, 0.36]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>
      {/* Ergonomic Curved Mesh Backrest */}
      <mesh position={[0, 0.62, -0.16]} rotation={[0.08, 0, 0]} castShadow>
        <boxGeometry args={[0.36, 0.44, 0.05]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.5} />
      </mesh>
      {/* Left Armrest */}
      <mesh position={[-0.2, 0.5, 0]} castShadow>
        <boxGeometry args={[0.04, 0.18, 0.24]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.5} />
      </mesh>
      {/* Right Armrest */}
      <mesh position={[0.2, 0.5, 0]} castShadow>
        <boxGeometry args={[0.04, 0.18, 0.24]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.5} />
      </mesh>
    </group>
  )
}

/**
 * Modern Sleek Laptop on Desk
 */
function SleekLaptop({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Base Keyboard */}
      <mesh position={[0, 0.006, 0]} castShadow>
        <boxGeometry args={[0.26, 0.012, 0.18]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Open Screen */}
      <group position={[0, 0.012, -0.09]} rotation={[-0.35, 0, 0]}>
        <mesh position={[0, 0.085, 0]} castShadow>
          <boxGeometry args={[0.26, 0.17, 0.008]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0, 0.085, 0.005]}>
          <planeGeometry args={[0.24, 0.15]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>
    </group>
  )
}

/**
 * 2. COLLABORATIVE MEETING & WHITEBOARD ROOM (FRONT-LEFT)
 * Replicates the collaborative zone in the user's reference image:
 * - Large standing presentation whiteboard on silver stand with analytics charts
 * - Round white meeting table with 360-degree video puck
 * - 4 modern ergonomic white office chairs
 * - Low glass partition
 */
function CollaborativeMeetingZone({ position = [-2.1, 0, 2.1] }) {
  const boardTex = useOfficeScreenTexture('presentation_board')
  const width = 3.8
  const depth = 3.2
  const height = 1.45

  return (
    <group position={position}>
      {/* Floor Pad */}
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <boxGeometry args={[width, 0.02, depth]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.35} />
      </mesh>

      {/* Low Glass Partition Wall on Left & Back */}
      <mesh position={[-width / 2, height / 2, 0]}>
        <boxGeometry args={[0.04, height, depth]} />
        <meshStandardMaterial color="#38bdf8" transparent={true} opacity={0.2} roughness={0.1} />
      </mesh>
      <mesh position={[0, height / 2, -depth / 2]}>
        <boxGeometry args={[width, height, 0.04]} />
        <meshStandardMaterial color="#38bdf8" transparent={true} opacity={0.2} roughness={0.1} />
      </mesh>

      {/* LARGE STANDING PRESENTATION WHITEBOARD (like in reference image) */}
      <group position={[-0.85, 0, -0.45]} rotation={[0, 0.35, 0]}>
        {/* Silver Wheeled Base */}
        <mesh position={[-0.8, 0.04, 0]} castShadow>
          <boxGeometry args={[0.08, 0.06, 0.45]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.7} />
        </mesh>
        <mesh position={[0.8, 0.04, 0]} castShadow>
          <boxGeometry args={[0.08, 0.06, 0.45]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.7} />
        </mesh>
        {/* Vertical Stems */}
        <mesh position={[-0.8, 0.65, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 1.2, 10]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
        <mesh position={[0.8, 0.65, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 1.2, 10]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
        {/* Whiteboard Frame */}
        <mesh position={[0, 0.95, 0]} castShadow>
          <boxGeometry args={[1.85, 1.05, 0.04]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} />
        </mesh>
        {/* Whiteboard Content with Charts */}
        <mesh position={[0, 0.95, 0.025]}>
          <planeGeometry args={[1.78, 0.98]} />
          <meshBasicMaterial map={boardTex} />
        </mesh>
        {/* Marker Tray */}
        <mesh position={[0, 0.41, 0.04]} castShadow>
          <boxGeometry args={[0.9, 0.025, 0.06]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.5} />
        </mesh>
      </group>

      {/* ROUND COLLABORATIVE MEETING TABLE (like in reference image) */}
      <group position={[0.45, 0, 0.35]}>
        {/* Central Pedestal Base */}
        <mesh position={[0, 0.02, 0]} castShadow>
          <cylinderGeometry args={[0.32, 0.36, 0.04, 24]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.56, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
        {/* White Round Tabletop */}
        <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.75, 0.75, 0.045, 32]} />
          <meshStandardMaterial color="#ffffff" roughness={0.25} />
        </mesh>
        {/* 360-degree White Video Conference Puck / Camera */}
        <mesh position={[0, 0.64, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.09, 0.05, 16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.6} />
        </mesh>
      </group>

      {/* Modern Ergonomic White Swivel Chairs around Table */}
      <ErgonomicOfficeChair position={[0.45, 0, -0.45]} rotation={[0, 0, 0]} />
      <ErgonomicOfficeChair position={[1.15, 0, 0.35]} rotation={[0, -Math.PI / 2, 0]} />
      <ErgonomicOfficeChair position={[0.45, 0, 1.15]} rotation={[0, Math.PI, 0]} />
    </group>
  )
}

/**
 * 3. MODERN ERGONOMIC WORKSTATIONS & LOUNGE (FRONT-RIGHT)
 * Replicates the back-to-back workstations and plush curved sofas from the reference image:
 * - Dual back-to-back white desks with privacy screen
 * - Dual laptops and ultra-wide monitor
 * - Ergonomic white mesh chairs
 * - Plush curved white lounge sofa with fiddle-leaf fig tree
 */
function ModernWorkstationLoungeZone({ position = [2.1, 0, 2.1] }) {
  const width = 3.8
  const depth = 3.2

  return (
    <group position={position}>
      {/* Floor Pad */}
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <boxGeometry args={[width, 0.02, depth]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.35} />
      </mesh>

      {/* ========================================================
          A. DUAL BACK-TO-BACK WORKSTATIONS (like Miro & Ara desks)
          ======================================================== */}
      <group position={[0, 0, -0.65]}>
        {/* Main Curved White Desk 1 (Front Facing) */}
        <mesh position={[0, 0.58, 0.28]} castShadow receiveShadow>
          <boxGeometry args={[2.1, 0.045, 0.62]} />
          <meshStandardMaterial color="#ffffff" roughness={0.25} />
        </mesh>
        {/* Desk 2 (Back Facing) */}
        <mesh position={[0, 0.58, -0.36]} castShadow receiveShadow>
          <boxGeometry args={[2.1, 0.045, 0.62]} />
          <meshStandardMaterial color="#ffffff" roughness={0.25} />
        </mesh>
        {/* Sleek Chrome Desk Legs */}
        {[-0.98, 0.98].map((lx, idx) => (
          <group key={idx} position={[lx, 0.28, -0.04]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.025, 0.025, 0.56, 10]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.8} />
            </mesh>
          </group>
        ))}

        {/* Frosted White Center Privacy Divider */}
        <mesh position={[0, 0.76, -0.04]}>
          <boxGeometry args={[2.0, 0.32, 0.02]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.3} transparent opacity={0.85} />
        </mesh>

        {/* Laptops and Workstation Props */}
        <SleekLaptop position={[-0.45, 0.61, 0.28]} rotation={[0, 0, 0]} />
        <SleekLaptop position={[0.45, 0.61, 0.28]} rotation={[0, 0.1, 0]} />
        <SleekLaptop position={[-0.45, 0.61, -0.36]} rotation={[0, Math.PI, 0]} />

        {/* Curved Ultra-wide Monitor on Desk 2 */}
        <group position={[0.35, 0.61, -0.38]} rotation={[0, Math.PI, 0]}>
          <mesh position={[0, 0.02, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.09, 0.02, 16]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.7} />
          </mesh>
          <mesh position={[0, 0.14, 0]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.24, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.24, 0]} castShadow>
            <boxGeometry args={[0.62, 0.22, 0.02]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 0.24, 0.012]}>
            <planeGeometry args={[0.58, 0.19]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>

        {/* Ergonomic Chairs for Workstations */}
        <ErgonomicOfficeChair position={[-0.45, 0, 0.82]} rotation={[0, 0, 0]} />
        <ErgonomicOfficeChair position={[0.45, 0, 0.82]} rotation={[0, 0, 0]} />
        <ErgonomicOfficeChair position={[-0.45, 0, -0.92]} rotation={[0, Math.PI, 0]} />
      </group>

      {/* ========================================================
          B. PLUSH MODERN WHITE LOUNGE SOFA (like in reference image)
          ======================================================== */}
      <group position={[0, 0, 1.05]}>
        {/* Curved White Loveseat Couch */}
        <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.7, 0.24, 0.65]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.5} />
        </mesh>
        {/* Soft Rounded Backrest */}
        <mesh position={[0, 0.44, -0.26]} castShadow>
          <boxGeometry args={[1.7, 0.32, 0.16]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.5} />
        </mesh>
        {/* Left & Right Plush Armrests */}
        <mesh position={[-0.82, 0.34, 0]} castShadow>
          <boxGeometry args={[0.16, 0.24, 0.65]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.5} />
        </mesh>
        <mesh position={[0.82, 0.34, 0]} castShadow>
          <boxGeometry args={[0.16, 0.24, 0.65]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.5} />
        </mesh>
      </group>

      {/* Tall Fiddle-Leaf Fig Tree in Fluted White Planter */}
      <group position={[-1.4, 0, 0.95]}>
        <mesh position={[0, 0.26, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.22, 0.18, 0.52, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.25} />
        </mesh>
        {/* Plant Trunk */}
        <mesh position={[0, 0.72, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.035, 0.5, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.6} />
        </mesh>
        {/* Broad Green Leaves */}
        {[0.7, 0.85, 1.0, 1.15].map((ly, lidx) => (
          <group key={lidx} position={[0, ly, 0]} rotation={[0, (lidx * Math.PI) / 2, 0]}>
            <mesh position={[0.14, 0, 0]} rotation={[0, 0, -0.3]} castShadow>
              <sphereGeometry args={[0.18, 8, 8]} />
              <meshStandardMaterial color="#15803d" roughness={0.4} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  )
}

/**
 * 4. CENTRAL HIGH-TECH GLASS SERVER ROOM ("AI AGENT OFFICE")
 * Server racks with blinking LEDs, blue cloud badge, glass sliding doors.
 */
function CentralServerRoom({ position = [0, 0, -2.5] }) {
  const ledRef = useRef()

  useFrame(({ clock }) => {
    if (ledRef.current) {
      const t = clock.getElapsedTime()
      ledRef.current.intensity = 1.6 + Math.sin(t * 6) * 0.4
    }
  })

  const width = 4.6
  const depth = 2.8
  const height = 1.65

  return (
    <group position={position}>
      {/* Floor Pad */}
      <mesh position={[0, 0.015, 0]} receiveShadow>
        <boxGeometry args={[width, 0.03, depth]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} />
      </mesh>

      {/* Open-top White Frame Lip */}
      <mesh position={[0, height, depth / 2]} castShadow>
        <boxGeometry args={[width, 0.08, 0.14]} />
        <meshStandardMaterial color="#ffffff" roughness={0.25} />
      </mesh>
      <mesh position={[0, height, -depth / 2]} castShadow>
        <boxGeometry args={[width, 0.08, 0.14]} />
        <meshStandardMaterial color="#ffffff" roughness={0.25} />
      </mesh>
      <mesh position={[-width / 2, height, 0]} castShadow>
        <boxGeometry args={[0.14, 0.08, depth]} />
        <meshStandardMaterial color="#ffffff" roughness={0.25} />
      </mesh>
      <mesh position={[width / 2, height, 0]} castShadow>
        <boxGeometry args={[0.14, 0.08, depth]} />
        <meshStandardMaterial color="#ffffff" roughness={0.25} />
      </mesh>

      {/* Walls */}
      <mesh position={[-width / 2, height / 2, 0]} castShadow>
        <boxGeometry args={[0.06, height, depth]} />
        <meshStandardMaterial color="#ffffff" roughness={0.25} />
      </mesh>
      <mesh position={[width / 2, height / 2, 0]} castShadow>
        <boxGeometry args={[0.06, height, depth]} />
        <meshStandardMaterial color="#ffffff" roughness={0.25} />
      </mesh>
      <mesh position={[0, height / 2, -depth / 2]} castShadow>
        <boxGeometry args={[width, height, 0.06]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} />
      </mesh>

      {/* Front Glass Panels & Sliding Doors */}
      <mesh position={[-1.4, height / 2, depth / 2]}>
        <boxGeometry args={[1.5, height - 0.08, 0.02]} />
        <meshStandardMaterial color="#38bdf8" transparent={true} opacity={0.3} roughness={0.1} />
      </mesh>
      <mesh position={[1.4, height / 2, depth / 2]}>
        <boxGeometry args={[1.5, height - 0.08, 0.02]} />
        <meshStandardMaterial color="#38bdf8" transparent={true} opacity={0.3} roughness={0.1} />
      </mesh>

      {/* Sliding Glass Doors */}
      <mesh position={[-0.32, height / 2, depth / 2 + 0.01]}>
        <boxGeometry args={[0.62, height - 0.08, 0.015]} />
        <meshStandardMaterial color="#e0f2fe" transparent={true} opacity={0.35} roughness={0.05} />
      </mesh>
      <mesh position={[0.32, height / 2, depth / 2 + 0.01]}>
        <boxGeometry args={[0.62, height - 0.08, 0.015]} />
        <meshStandardMaterial color="#e0f2fe" transparent={true} opacity={0.35} roughness={0.05} />
      </mesh>

      {/* Front Signboard: "AI AGENT OFFICE" */}
      <group position={[-1.35, 1.15, depth / 2 + 0.04]}>
        <mesh>
          <planeGeometry args={[1.3, 0.45]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.06, 0.005]}>
          <planeGeometry args={[1.15, 0.15]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0, -0.09, 0.005]}>
          <planeGeometry args={[1.15, 0.11]} />
          <meshBasicMaterial color="#a855f7" />
        </mesh>
      </group>

      {/* SERVER RACKS WITH BLINKING LEDS */}
      {[-1.2, -0.4, 0.4, 1.2].map((rx, idx) => (
        <group key={idx} position={[rx, 0, -0.3]}>
          <mesh position={[0, 0.75, 0]} castShadow>
            <boxGeometry args={[0.65, 1.45, 0.6]} />
            <meshStandardMaterial color="#090d16" metalness={0.8} roughness={0.2} />
          </mesh>
          {[0.2, 0.48, 0.76, 1.04, 1.32].map((by, bidx) => (
            <group key={bidx} position={[0, by, 0.31]}>
              <mesh>
                <boxGeometry args={[0.55, 0.18, 0.02]} />
                <meshStandardMaterial color="#1e293b" metalness={0.6} />
              </mesh>
              {[-0.2, -0.1, 0, 0.1, 0.2].map((lx, lidx) => (
                <mesh key={lidx} position={[lx, 0, 0.015]}>
                  <circleGeometry args={[0.015, 8]} />
                  <meshStandardMaterial
                    color={(idx + bidx + lidx) % 2 === 0 ? '#38bdf8' : '#34d399'}
                    emissive={(idx + bidx + lidx) % 2 === 0 ? '#38bdf8' : '#34d399'}
                    emissiveIntensity={2.2}
                  />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      ))}

      {/* Glowing Neon Blue Cloud Badge */}
      <group position={[0, 1.0, -depth / 2 + 0.08]}>
        <mesh>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={2.2} />
        </mesh>
        <pointLight ref={ledRef} position={[0, 0, 0.2]} color="#00f0ff" distance={3.5} intensity={2.0} />
      </group>
    </group>
  )
}

/**
 * 5. NEON HEXAGONAL FLOOR PODS
 */
function NeonHexZone({
  position = [0, 0, 0],
  color = '#f43f5e',
  glowColor = '#fb7185',
  bgTint = '#ffe4e6',
  radius = 2.1
}) {
  const points = useMemo(() => {
    const pts = []
    const sides = 6
    for (let i = 0; i <= sides; i++) {
      const angle = (i * Math.PI * 2) / sides + Math.PI / 6
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0.012, Math.sin(angle) * radius))
    }
    return pts
  }, [radius])

  return (
    <group position={position}>
      {/* Tinted Hexagonal Floor Pad */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 6]} receiveShadow>
        <circleGeometry args={[radius * 0.98, 6]} />
        <meshStandardMaterial color={bgTint} roughness={0.3} />
      </mesh>

      {/* Glowing Neon Perimeter Tube */}
      {points.slice(0, 6).map((p, idx) => {
        const next = points[idx + 1]
        const mid = new THREE.Vector3().addVectors(p, next).multiplyScalar(0.5)
        const len = p.distanceTo(next)
        const angle = Math.atan2(next.x - p.x, next.z - p.z)

        return (
          <mesh
            key={idx}
            position={[mid.x, 0.02, mid.z]}
            rotation={[0, angle + Math.PI / 2, 0]}
          >
            <cylinderGeometry args={[0.045, 0.045, len, 10]} />
            <meshStandardMaterial
              color={color}
              emissive={glowColor}
              emissiveIntensity={2.0}
              roughness={0.1}
            />
          </mesh>
        )
      })}
    </group>
  )
}

/**
 * 6. PERIMETER POTTED FIDDLE-LEAF FIG INDOOR PLANTS
 */
function PerimeterPots() {
  const positions = [
    [-7.5, 0, -4.8],
    [-7.5, 0, 0],
    [-7.5, 0, 4.8],
    [7.5, 0, -4.8],
    [7.5, 0, 0],
    [7.5, 0, 4.8],
    [-5.0, 0, 5.2],
    [5.0, 0, 5.2],
    [-5.0, 0, -5.2],
    [5.0, 0, -5.2]
  ]

  return (
    <group>
      {positions.map(([px, py, pz], idx) => (
        <group key={idx} position={[px, py, pz]}>
          <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.22, 0.17, 0.44, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.58, 0]} castShadow>
            <sphereGeometry args={[0.28, 12, 12]} />
            <meshStandardMaterial color="#16a34a" roughness={0.35} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/**
 * Main DioramaOffice Component
 */
export default function DioramaOffice() {
  return (
    <group name="diorama-office-root">
      {/* 1. Flat Rounded Diorama Base Platform (Flush at Y = 0) */}
      <DioramaPlatform />

      {/* 2. Central High-Tech Glass Server Room ("AI AGENT OFFICE") */}
      <CentralServerRoom position={[0, 0, -2.5]} />

      {/* 3. Front-Left Collaborative Meeting Room (Whiteboard, Round Table, Chairs) */}
      <CollaborativeMeetingZone position={[-2.1, 0, 2.1]} />

      {/* 4. Front-Right Modern Workstations & Plush Lounge Sofa Zone */}
      <ModernWorkstationLoungeZone position={[2.1, 0, 2.1]} />

      {/* 5. 4 Outer Neon Hexagonal Floor Pods */}
      {/* Pod 1 (Top-Left): Sherloc (Bunny Boy) */}
      <NeonHexZone
        position={[-5.3, 0, -2.5]}
        color="#f43f5e"
        glowColor="#fb7185"
        bgTint="#ffe4e6"
        radius={2.1}
      />

      {/* Pod 2 (Top-Right): Watson (Cat Boy) */}
      <NeonHexZone
        position={[5.3, 0, -2.5]}
        color="#0284c7"
        glowColor="#38bdf8"
        bgTint="#e0f2fe"
        radius={2.1}
      />

      {/* Pod 3 (Bottom-Left): COO (Bear Supervisor Male) */}
      <NeonHexZone
        position={[-5.3, 0, 2.1]}
        color="#a855f7"
        glowColor="#c084fc"
        bgTint="#f3e8ff"
        radius={2.1}
      />

      {/* Pod 4 (Bottom-Right): Scout (Fox Girl) */}
      <NeonHexZone
        position={[5.3, 0, 2.1]}
        color="#f59e0b"
        glowColor="#fbbf24"
        bgTint="#fef3c7"
        radius={2.1}
      />

      {/* 6. Perimeter Greenery */}
      <PerimeterPots />
    </group>
  )
}
