import React, { useMemo } from 'react'
import * as THREE from 'three'

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

    // Upward Trending Blue Curve (as seen in reference image)
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

    // Bar Chart (Pastel orange & coral like in reference image)
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
 * 1. FLOATING DIORAMA PLATFORM
 * Porcelain warm matte clay base with rounded chamfered corners on X-Z plane.
 * Surface flush at Y = 0.
 */
function FloatingPlatform() {
  const platformGeometry = useMemo(() => {
    const width = 14.8
    const depth = 10.8
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
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.65}
          metalness={0.02}
        />
      </mesh>
      {/* Architectural Inset Pedestal Base */}
      <mesh position={[0, -0.26, 0]} receiveShadow>
        <boxGeometry args={[14.4, 0.22, 10.4]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.65} metalness={0.06} />
      </mesh>
      {/* Recessed Dark Shadow Base Rim */}
      <mesh position={[0, -0.4, 0]} receiveShadow>
        <boxGeometry args={[13.8, 0.08, 9.8]} />
        <meshStandardMaterial color="#64748b" roughness={0.8} />
      </mesh>
    </group>
  )
}

/**
 * Modern Ergonomic White Office Swivel Chair
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
 * Sleek Modern Open Laptop on Desk
 */
function SleekLaptop({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.006, 0]} castShadow>
        <boxGeometry args={[0.26, 0.012, 0.18]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.8} roughness={0.2} />
      </mesh>
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
 * Curved Ultrawide Monitor with Chrome Stand
 */
function CurvedUltrawideMonitor({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Base */}
      <mesh position={[0, 0.015, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.1, 0.02, 16]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.7} />
      </mesh>
      {/* Vertical Chrome Stem */}
      <mesh position={[0, 0.14, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.24, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} />
      </mesh>
      {/* Curved Screen Housing */}
      <mesh position={[0, 0.24, 0]} castShadow>
        <boxGeometry args={[0.66, 0.24, 0.025]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} />
      </mesh>
      {/* Glowing Screen Plane */}
      <mesh position={[0, 0.24, 0.014]}>
        <planeGeometry args={[0.62, 0.21]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
    </group>
  )
}

/**
 * CLUSTER 1: CENTER WORKSTATION CLUSTER (Dual Desks Berhadapan)
 * - 2 pasang meja kerja putih membulat yang saling berhadapan dengan partisi rendah di tengahnya
 * - Dilengkapi layar monitor ganda melengkung, keyboard tipis, mousepad, dan tablet mini
 * - Ergonomic swivel chairs untuk Watson & Nara
 */
function CenterWorkstationCluster({ position = [0.75, 0, -0.4] }) {
  return (
    <group position={position}>
      {/* Desk 1 (South facing Desk for Watson) */}
      <mesh position={[0, 0.58, 0.45]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.045, 0.65]} />
        <meshStandardMaterial color="#ffffff" roughness={0.65} metalness={0.04} />
      </mesh>

      {/* Desk 2 (North facing Desk for Nara) */}
      <mesh position={[0, 0.58, -0.45]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.045, 0.65]} />
        <meshStandardMaterial color="#ffffff" roughness={0.65} metalness={0.04} />
      </mesh>

      {/* Chrome Desk Legs */}
      {[-1.02, 1.02].map((lx, idx) => (
        <group key={idx} position={[lx, 0.28, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.56, 10]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Low Frosted Privacy Divider Screen in Center */}
      <mesh position={[0, 0.74, 0]}>
        <boxGeometry args={[2.1, 0.28, 0.02]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.5} transparent opacity={0.85} />
      </mesh>

      {/* Desk 1 Props (Watson's Workstation) */}
      {/* Keyboard & Mousepad */}
      <mesh position={[0, 0.61, 0.38]} castShadow>
        <boxGeometry args={[0.34, 0.008, 0.12]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.4} />
      </mesh>
      <mesh position={[0.26, 0.608, 0.38]}>
        <cylinderGeometry args={[0.03, 0.03, 0.006, 16]} />
        <meshStandardMaterial color="#0284c7" />
      </mesh>
      {/* Dual Curved Ultrawide Monitor */}
      <CurvedUltrawideMonitor position={[0, 0.61, 0.62]} rotation={[0, Math.PI, 0]} />
      {/* Mini Tablet */}
      <mesh position={[-0.48, 0.61, 0.38]} rotation={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.16, 0.008, 0.22]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      {/* Coffee Mug */}
      <mesh position={[0.55, 0.65, 0.45]} castShadow>
        <cylinderGeometry args={[0.035, 0.03, 0.08, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>

      {/* Desk 2 Props (Nara's Workstation) */}
      <SleekLaptop position={[0, 0.61, -0.42]} rotation={[0, 0, 0]} />
      <mesh position={[0.5, 0.61, -0.42]} rotation={[0, -0.15, 0]} castShadow>
        <boxGeometry args={[0.16, 0.008, 0.22]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* Ergonomic Office Chairs for Watson & Nara */}
      {/* Watson's chair (facing North towards desk) */}
      <ErgonomicOfficeChair position={[0, 0, 0.95]} rotation={[0, 0, 0]} />
      {/* Nara's chair (facing South towards desk) */}
      <ErgonomicOfficeChair position={[0, 0, -0.95]} rotation={[0, Math.PI, 0]} />
    </group>
  )
}

/**
 * CLUSTER 2: LEFT CORNER: INTERACTIVE MEETING AREA
 * - Meja bundar putih (round discussion table) dengan proyektor/kamera konferensi di tengahnya
 * - Papan presentasi berdiri (Standing Interactive Dashboard Screen) dengan kurva analitik
 * - Sherloc sitting & Velocia standing pointing at screen
 */
function InteractiveMeetingArea({ position = [-3.0, 0, 0.3] }) {
  const boardTex = useDashboardScreenTexture()

  return (
    <group position={position}>
      {/* LARGE STANDING PRESENTATION WHITEBOARD SCREEN */}
      <group position={[-1.2, 0, -1.0]} rotation={[0, 0.4, 0]}>
        {/* Wheeled Stems */}
        <mesh position={[-0.85, 0.04, 0]} castShadow>
          <boxGeometry args={[0.08, 0.06, 0.45]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.7} />
        </mesh>
        <mesh position={[0.85, 0.04, 0]} castShadow>
          <boxGeometry args={[0.08, 0.06, 0.45]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.7} />
        </mesh>
        <mesh position={[-0.85, 0.68, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 1.25, 10]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
        <mesh position={[0.85, 0.68, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 1.25, 10]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
        {/* Screen Frame */}
        <mesh position={[0, 1.05, 0]} castShadow>
          <boxGeometry args={[1.9, 1.1, 0.04]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
        {/* Screen Canvas Surface */}
        <mesh position={[0, 1.05, 0.025]}>
          <planeGeometry args={[1.82, 1.02]} />
          <meshBasicMaterial map={boardTex} />
        </mesh>
      </group>

      {/* ROUND DISCUSSION TABLE WITH CONFERENCE CAMERA PUCK */}
      <group position={[0.5, 0, 0.3]}>
        <mesh position={[0, 0.02, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.38, 0.04, 24]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.56, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
        {/* Round White Tabletop */}
        <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.78, 0.78, 0.045, 32]} />
          <meshStandardMaterial color="#ffffff" roughness={0.65} metalness={0.04} />
        </mesh>
        {/* 360-degree Conference Speaker/Camera Puck */}
        <mesh position={[0, 0.64, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.09, 0.05, 16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.6} />
        </mesh>
      </group>

      {/* Ergonomic Chair for Sherloc (facing table & board) */}
      <ErgonomicOfficeChair position={[0.5, 0, 1.25]} rotation={[0, 0, 0]} />
    </group>
  )
}

/**
 * CLUSTER 3: FOREGROUND / FRONT CORNER: LOUNGE & EXECUTIVE SPOT
 * - Sofa putih modular berbentuk L atau sepasang armchair santai
 * - Meja kopi mini
 * - Tanaman pot hias tinggi (indoor potted monstera / fiddle-leaf fig)
 * - COO & Scout sitting on sofa
 */
function LoungeExecutiveSpot({ position = [2.0, 0, 2.3] }) {
  return (
    <group position={position}>
      {/* MODULAR L-SHAPED PLUSH WHITE LOUNGE SOFA */}
      {/* Main Couch Bench */}
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.9, 0.24, 0.72]} />
        <meshStandardMaterial color="#ffffff" roughness={0.7} metalness={0.02} />
      </mesh>
      {/* Plush Rounded Backrest */}
      <mesh position={[0, 0.44, -0.28]} castShadow>
        <boxGeometry args={[1.9, 0.32, 0.18]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.7} metalness={0.02} />
      </mesh>
      {/* Left Armrest */}
      <mesh position={[-0.92, 0.34, 0]} castShadow>
        <boxGeometry args={[0.16, 0.24, 0.72]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.7} />
      </mesh>
      {/* Right Armrest */}
      <mesh position={[0.92, 0.34, 0]} castShadow>
        <boxGeometry args={[0.16, 0.24, 0.72]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.7} />
      </mesh>

      {/* Low Modern Coffee Table */}
      <group position={[0, 0, 0.85]}>
        <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.04, 24]} />
          <meshStandardMaterial color="#ffffff" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.08, 0.2, 12]} />
          <meshStandardMaterial color="#d4a373" roughness={0.5} />
        </mesh>
        {/* Coffee cup */}
        <mesh position={[0, 0.24, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.025, 0.06, 12]} />
          <meshStandardMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* TALL INDOOR POTTED MONSTERA / FIDDLE-LEAF TREE */}
      <group position={[1.5, 0, -0.4]}>
        {/* Ribbed White Ceramic Planter */}
        <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.24, 0.18, 0.56, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
        {/* Trunk */}
        <mesh position={[0, 0.75, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.035, 0.55, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
        {/* Broad Green Monstera Leaves */}
        {[0.75, 0.9, 1.05, 1.2].map((ly, lidx) => (
          <group key={lidx} position={[0, ly, 0]} rotation={[0, (lidx * Math.PI) / 2 + 0.3, 0]}>
            <mesh position={[0.16, 0, 0]} rotation={[0, 0, -0.32]} castShadow>
              <sphereGeometry args={[0.2, 8, 8]} />
              <meshStandardMaterial color="#15803d" roughness={0.5} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  )
}

/**
 * High-Tech Glass Datacenter Hub Accent (Background corner)
 */
function DatacenterHubAccent({ position = [-0.5, 0, -3.2] }) {
  return (
    <group position={position}>
      {/* Server Tower Rack */}
      {[-0.5, 0.5].map((rx, idx) => (
        <group key={idx} position={[rx, 0, 0]}>
          <mesh position={[0, 0.75, 0]} castShadow>
            <boxGeometry args={[0.55, 1.45, 0.5]} />
            <meshStandardMaterial color="#090d16" roughness={0.4} metalness={0.7} />
          </mesh>
          {/* LED Blades */}
          {[0.2, 0.5, 0.8, 1.1, 1.35].map((by, bidx) => (
            <mesh key={bidx} position={[0, by, 0.26]}>
              <boxGeometry args={[0.45, 0.16, 0.02]} />
              <meshStandardMaterial
                color={(idx + bidx) % 2 === 0 ? '#38bdf8' : '#34d399'}
                emissive={(idx + bidx) % 2 === 0 ? '#38bdf8' : '#34d399'}
                emissiveIntensity={2.0}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

/**
 * Main DioramaOffice Component
 * Curated Clay Isometric Diorama with 3 Main Clusters
 */
export default function DioramaOffice() {
  return (
    <group name="curated-clay-diorama-root">
      {/* 1. Flat Rounded Porcelain Clay Platform */}
      <FloatingPlatform />

      {/* 2. Cluster 1: Center Workstation Cluster (Watson & Nara) */}
      <CenterWorkstationCluster position={[0.75, 0, -0.4]} />

      {/* 3. Cluster 2: Left Meeting Area (Sherloc & Velocia) */}
      <InteractiveMeetingArea position={[-3.0, 0, 0.3]} />

      {/* 4. Cluster 3: Foreground Lounge & Executive Spot (COO & Scout) */}
      <LoungeExecutiveSpot position={[2.0, 0, 2.3]} />

      {/* 5. Background Datacenter Hub Accent */}
      <DatacenterHubAccent position={[-0.2, 0, -3.2]} />
    </group>
  )
}
