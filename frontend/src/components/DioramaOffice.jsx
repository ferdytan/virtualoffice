import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Creates dynamic high-res canvas textures for procedural holographic screens,
 * signs, and easel paintings without needing external image assets.
 */
function useHolographicScreenTexture(type = 'analytics') {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 512
    const ctx = canvas.getContext('2d')

    if (type === 'analytics') {
      // Top-Left Coral Red Holographic Screen (Marketing / CS Analytics)
      ctx.fillStyle = '#1c0f16'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Header Bar
      const grad = ctx.createLinearGradient(0, 0, canvas.width, 0)
      grad.addColorStop(0, '#f43f5e')
      grad.addColorStop(1, '#fb7185')
      ctx.fillStyle = grad
      ctx.fillRect(24, 24, canvas.width - 48, 48)

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 26px sans-serif'
      ctx.fillText('⚡ AI AGENT ANALYTICS & TELEMETRY STREAM', 45, 58)

      // Bar Chart
      const bars = [160, 240, 190, 310, 270, 360, 330, 410, 440, 380, 460]
      const barWidth = 48
      const startX = 55
      const baseY = 420
      bars.forEach((h, i) => {
        const x = startX + i * 82
        const barGrad = ctx.createLinearGradient(0, baseY - h, 0, baseY)
        barGrad.addColorStop(0, '#fb7185')
        barGrad.addColorStop(1, '#9f1239')
        ctx.fillStyle = barGrad
        ctx.fillRect(x, baseY - h, barWidth, h)

        ctx.fillStyle = '#fecdd3'
        ctx.font = 'bold 16px sans-serif'
        ctx.fillText(`${h}k`, x + 6, baseY - h - 10)
      })

      // Grid Lines
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.35)'
      ctx.lineWidth = 1.5
      for (let y = 140; y <= baseY; y += 70) {
        ctx.beginPath()
        ctx.moveTo(40, y)
        ctx.lineTo(canvas.width - 40, y)
        ctx.stroke()
      }
    } else if (type === 'code') {
      // Top-Right Cyan Holographic Screen (Code / Technical Data)
      ctx.fillStyle = '#061325'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Header Bar
      const grad = ctx.createLinearGradient(0, 0, canvas.width, 0)
      grad.addColorStop(0, '#0284c7')
      grad.addColorStop(1, '#38bdf8')
      ctx.fillStyle = grad
      ctx.fillRect(24, 24, canvas.width - 48, 48)

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 26px monospace'
      ctx.fillText('⚙️ SYSTEM PROTOCOL & KNOWLEDGE PIPELINE', 45, 58)

      const codeLines = [
        'import { Orchestrator, RAGKnowledgeLoop } from "@orin/ai";',
        'const cluster = await initAutonomousAgentCluster({ workers: 5 });',
        '>> [SHERLOC] Inbound WhatsApp stream: 42 active channels verified.',
        '>> [WATSON]  Synthesizing Q&A pairs from engineering escalation #481.',
        '>> [NARA]    Scanning 83 fleet telemetry units: All signals nominal.',
        '>> [SCOUT]   Compiling anti-theft logistics article with 98.4% conversion.',
        'cluster.syncKnowledgeBase({ autoHeal: true, latency: "14ms" });',
        'return { status: "ACTIVE_AUTONOMOUS", throughput: "1,240 req/s" };'
      ]

      ctx.font = '21px monospace'
      codeLines.forEach((line, i) => {
        ctx.fillStyle = line.startsWith('>>') ? '#34d399' : i % 2 === 0 ? '#38bdf8' : '#bae6fd'
        ctx.fillText(line, 50, 130 + i * 38)
      })
    } else if (type === 'painting') {
      // Bottom-Right Art Easel Painting (Cute clouds & flowers)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height)
      skyGrad.addColorStop(0, '#bae6fd')
      skyGrad.addColorStop(0.65, '#fef9c3')
      skyGrad.addColorStop(1, '#bbf7d0')
      ctx.fillStyle = skyGrad
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Fluffy white clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
      function drawCloud(cx, cy, s) {
        ctx.beginPath()
        ctx.arc(cx, cy, 50 * s, 0, Math.PI * 2)
        ctx.arc(cx + 40 * s, cy - 20 * s, 60 * s, 0, Math.PI * 2)
        ctx.arc(cx + 90 * s, cy, 50 * s, 0, Math.PI * 2)
        ctx.arc(cx + 45 * s, cy + 20 * s, 45 * s, 0, Math.PI * 2)
        ctx.fill()
      }
      drawCloud(220, 160, 1.2)
      drawCloud(680, 130, 0.9)

      // Cute Smiling Sun
      ctx.beginPath()
      ctx.arc(120, 100, 50, 0, Math.PI * 2)
      ctx.fillStyle = '#f59e0b'
      ctx.fill()

      // Cute Little Flowers in grass
      const flowerColors = ['#f43f5e', '#ec4899', '#f97316', '#a855f7', '#eab308']
      for (let x = 60; x < canvas.width; x += 65) {
        const y = 420 + Math.sin(x) * 30
        ctx.beginPath()
        ctx.arc(x, y, 16, 0, Math.PI * 2)
        ctx.fillStyle = flowerColors[(x / 65) % flowerColors.length]
        ctx.fill()
        ctx.beginPath()
        ctx.arc(x, y, 6, 0, Math.PI * 2)
        ctx.fillStyle = '#fef08a'
        ctx.fill()
      }
    } else if (type === 'meeting_screen') {
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Analytics wave
      ctx.strokeStyle = '#38bdf8'
      ctx.lineWidth = 6
      ctx.beginPath()
      for (let x = 0; x < canvas.width; x += 10) {
        const y = 256 + Math.sin(x * 0.015) * 80 + Math.cos(x * 0.03) * 40
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 36px sans-serif'
      ctx.fillText('MONTHLY STRATEGIC GOALS & OKRs', 60, 70)
      ctx.fillStyle = '#34d399'
      ctx.font = 'bold 28px sans-serif'
      ctx.fillText('Target Achieved: +142.8% YoY Growth', 60, 440)
    }

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [type])
}

/**
 * 1. DIORAMA BASE PLATFORM
 * A clean, solid, floating porcelain diorama slab with smoothly rounded chamfered corners on the horizontal plane.
 * Flawlessly flat top surface flush at Y = 0. NO outer walls or rims!
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
    // Rotate so extrusion points DOWNWARD along -Y
    geom.rotateX(Math.PI / 2)
    // Align top surface exactly flush at Y = 0
    geom.translate(0, -0.05, 0)
    return geom
  }, [])

  return (
    <group position={[0, 0, 0]}>
      {/* Floating Porcelain Diorama Slab */}
      <mesh geometry={platformGeometry} receiveShadow castShadow>
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.2}
          metalness={0.02}
        />
      </mesh>

      {/* Subtle Chamfered Edge Line */}
      <mesh position={[0, -0.38, 0]} receiveShadow>
        <cylinderGeometry args={[8.8, 8.8, 0.04, 32]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.4} />
      </mesh>
    </group>
  )
}

/**
 * 2. NEON HEXAGONAL FLOOR PODS
 * 14cm thick glowing neon tube perimeter, pastel floor pad, props, and signpost.
 */
function NeonHexZone({
  position = [0, 0, 0],
  color = '#f43f5e',
  glowColor = '#fb7185',
  bgTint = '#ffe4e6',
  propType = 'screen', // 'screen_red' | 'screen_blue' | 'purple_orb' | 'art_easel'
  radius = 2.1
}) {
  const lightRef = useRef()
  const screenTex = useHolographicScreenTexture(
    propType === 'screen_red' ? 'analytics' :
    propType === 'screen_blue' ? 'code' :
    propType === 'art_easel' ? 'painting' : 'analytics'
  )

  useFrame(({ clock }) => {
    if (lightRef.current) {
      const t = clock.getElapsedTime()
      lightRef.current.intensity = 1.0 + Math.sin(t * 3.5) * 0.25
    }
  })

  // Hexagon vertices
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
      {/* Tinted Hexagonal Floor Pad (Flush on Diorama Floor) */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 6]} receiveShadow>
        <circleGeometry args={[radius * 0.98, 6]} />
        <meshStandardMaterial color={bgTint} roughness={0.3} />
      </mesh>

      {/* Bold Glowing Neon Hexagonal Perimeter Tube */}
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

      {/* Point light for soft neon spill */}
      <pointLight
        ref={lightRef}
        position={[0, 0.35, 0]}
        color={glowColor}
        distance={3.2}
        intensity={1.0}
      />

      {/* Standing Circular Icon Signpost */}
      <group position={[radius * 0.75, 0, -radius * 0.78]}>
        <mesh position={[0, 0.02, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.22, 0.04, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.85, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
        {/* Glowing Head Sign */}
        <group position={[0, 0.95, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.22, 0.22, 0.05, 24]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.028]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.18, 24]} />
            <meshStandardMaterial color={color} emissive={glowColor} emissiveIntensity={1.5} />
          </mesh>
        </group>
      </group>

      {/* White Bookshelf with Colorful Books & Mini Succulents */}
      <group position={[-radius * 0.65, 0, -radius * 0.82]} rotation={[0, 0.35, 0]}>
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.7, 0.3]} />
          <meshStandardMaterial color="#ffffff" roughness={0.25} />
        </mesh>
        {/* Colorful Books */}
        {[-0.35, -0.2, -0.05, 0.1, 0.25, 0.4].map((bx, i) => (
          <mesh key={i} position={[bx, 0.5, 0]} castShadow>
            <boxGeometry args={[0.08, 0.2, 0.16]} />
            <meshStandardMaterial color={['#f43f5e', '#38bdf8', '#a855f7', '#fbbf24', '#34d399', '#f97316'][i]} roughness={0.4} />
          </mesh>
        ))}
        {/* Mini Potted Plant */}
        <group position={[0.4, 0.76, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.05, 0.04, 0.08, 12]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[0, 0.07, 0]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#16a34a" roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* A. Curved Holographic Dashboard Display (Red or Blue) */}
      {(propType === 'screen_red' || propType === 'screen_blue') && (
        <group position={[0, 0, -radius * 0.92]}>
          <mesh position={[0, 0.06, 0]} castShadow>
            <boxGeometry args={[1.2, 0.12, 0.35]} />
            <meshStandardMaterial color="#ffffff" roughness={0.25} />
          </mesh>
          <mesh position={[-0.4, 0.45, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.7, 10]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} />
          </mesh>
          <mesh position={[0.4, 0.45, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.7, 10]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} />
          </mesh>
          {/* Curved Monitor Housing */}
          <mesh position={[0, 1.05, 0]} castShadow>
            <boxGeometry args={[2.3, 1.1, 0.06]} />
            <meshStandardMaterial color="#ffffff" roughness={0.25} />
          </mesh>
          {/* Glowing Screen */}
          <mesh position={[0, 1.05, 0.035]}>
            <planeGeometry args={[2.2, 1.0]} />
            <meshBasicMaterial map={screenTex} />
          </mesh>
        </group>
      )}

      {/* B. Glowing Purple Crystal Orb Lamp on Cube Pedestal */}
      {propType === 'purple_orb' && (
        <group position={[radius * 0.75, 0, 0.35]}>
          <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.6, 0.6, 0.6]} />
            <meshStandardMaterial color="#ffffff" roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.61, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.16, 0.22, 24]} />
            <meshBasicMaterial color="#a855f7" />
          </mesh>
          <mesh position={[0, 0.8, 0]}>
            <sphereGeometry args={[0.18, 24, 24]} />
            <meshStandardMaterial
              color="#c084fc"
              emissive="#a855f7"
              emissiveIntensity={1.8}
              roughness={0.15}
            />
          </mesh>
          <pointLight position={[0, 0.85, 0]} color="#a855f7" distance={2.5} intensity={1.5} />
        </group>
      )}

      {/* C. Wooden Art Easel with Cute Painting (Clouds & Flowers) */}
      {propType === 'art_easel' && (
        <group position={[radius * 0.72, 0, 0.2]} rotation={[0, -0.45, 0]}>
          <mesh position={[-0.3, 0.65, 0.08]} rotation={[0.1, 0, 0.12]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 1.35, 8]} />
            <meshStandardMaterial color="#d97706" roughness={0.6} />
          </mesh>
          <mesh position={[0.3, 0.65, 0.08]} rotation={[0.1, 0, -0.12]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 1.35, 8]} />
            <meshStandardMaterial color="#d97706" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.6, -0.28]} rotation={[-0.2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 1.3, 8]} />
            <meshStandardMaterial color="#b45309" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.68, 0.1]} castShadow>
            <boxGeometry args={[0.8, 0.035, 0.07]} />
            <meshStandardMaterial color="#92400e" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.98, 0.12]} rotation={[-0.1, 0, 0]} castShadow>
            <boxGeometry args={[0.72, 0.55, 0.02]} />
            <meshStandardMaterial map={screenTex} roughness={0.7} />
          </mesh>
        </group>
      )}
    </group>
  )
}

/**
 * 3. CENTRAL GLASS SERVER ROOM ("AI AGENT OFFICE")
 * High-tech glass server cube with glowing racks, blue cloud logo, and sliding doors.
 * Open-top roof perimeter frame so interior is completely visible from above!
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
      {/* Base Floor Pad */}
      <mesh position={[0, 0.015, 0]} receiveShadow>
        <boxGeometry args={[width, 0.03, depth]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} />
      </mesh>

      {/* Open-top White Frame Lip (Clean trim, NOT a solid roof!) */}
      {/* Front Trim */}
      <mesh position={[0, height, depth / 2]} castShadow>
        <boxGeometry args={[width, 0.08, 0.14]} />
        <meshStandardMaterial color="#ffffff" roughness={0.25} />
      </mesh>
      {/* Back Trim */}
      <mesh position={[0, height, -depth / 2]} castShadow>
        <boxGeometry args={[width, 0.08, 0.14]} />
        <meshStandardMaterial color="#ffffff" roughness={0.25} />
      </mesh>
      {/* Left Trim */}
      <mesh position={[-width / 2, height, 0]} castShadow>
        <boxGeometry args={[0.14, 0.08, depth]} />
        <meshStandardMaterial color="#ffffff" roughness={0.25} />
      </mesh>
      {/* Right Trim */}
      <mesh position={[width / 2, height, 0]} castShadow>
        <boxGeometry args={[0.14, 0.08, depth]} />
        <meshStandardMaterial color="#ffffff" roughness={0.25} />
      </mesh>

      {/* Left Wall (White Frame with Glass Panel) */}
      <mesh position={[-width / 2, height / 2, 0]} castShadow>
        <boxGeometry args={[0.06, height, depth]} />
        <meshStandardMaterial color="#ffffff" roughness={0.25} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[width / 2, height / 2, 0]} castShadow>
        <boxGeometry args={[0.06, height, depth]} />
        <meshStandardMaterial color="#ffffff" roughness={0.25} />
      </mesh>

      {/* Back Solid Dark Wall */}
      <mesh position={[0, height / 2, -depth / 2]} castShadow>
        <boxGeometry args={[width, height, 0.06]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} />
      </mesh>

      {/* Front Glass Wall Panels */}
      <mesh position={[-1.4, height / 2, depth / 2]}>
        <boxGeometry args={[1.5, height - 0.08, 0.02]} />
        <meshStandardMaterial color="#38bdf8" transparent={true} opacity={0.3} roughness={0.1} />
      </mesh>
      <mesh position={[1.4, height / 2, depth / 2]}>
        <boxGeometry args={[1.5, height - 0.08, 0.02]} />
        <meshStandardMaterial color="#38bdf8" transparent={true} opacity={0.3} roughness={0.1} />
      </mesh>

      {/* Sliding Glass Doors with Silver Handles */}
      <mesh position={[-0.32, height / 2, depth / 2 + 0.01]}>
        <boxGeometry args={[0.62, height - 0.08, 0.015]} />
        <meshStandardMaterial color="#e0f2fe" transparent={true} opacity={0.35} roughness={0.05} />
      </mesh>
      <mesh position={[0.32, height / 2, depth / 2 + 0.01]}>
        <boxGeometry args={[0.62, height - 0.08, 0.015]} />
        <meshStandardMaterial color="#e0f2fe" transparent={true} opacity={0.35} roughness={0.05} />
      </mesh>
      <mesh position={[-0.04, 0.75, depth / 2 + 0.025]} castShadow>
        <cylinderGeometry args={[0.01, 0.01, 0.4, 8]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.9} />
      </mesh>
      <mesh position={[0.04, 0.75, depth / 2 + 0.025]} castShadow>
        <cylinderGeometry args={[0.01, 0.01, 0.4, 8]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.9} />
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

      {/* HIGH-TECH SERVER RACKS WITH BLINKING LEDS */}
      {[-1.2, -0.4, 0.4, 1.2].map((rx, idx) => (
        <group key={idx} position={[rx, 0, -0.3]}>
          <mesh position={[0, 0.75, 0]} castShadow>
            <boxGeometry args={[0.65, 1.45, 0.6]} />
            <meshStandardMaterial color="#090d16" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Stacked Blades with LED Matrix */}
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

      {/* Glowing Neon Blue Cloud Badge on Back Wall */}
      <group position={[0, 1.0, -depth / 2 + 0.08]}>
        <mesh>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={2.2} />
        </mesh>
        <pointLight ref={ledRef} position={[0, 0, 0.2]} color="#00f0ff" distance={3.5} intensity={2.0} />
      </group>

      {/* Flanking Potted Plants */}
      <group position={[-width / 2 + 0.35, 0, depth / 2 + 0.35]}>
        <mesh position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.16, 0.4, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.5, 0]} castShadow>
          <sphereGeometry args={[0.28, 12, 12]} />
          <meshStandardMaterial color="#15803d" roughness={0.4} />
        </mesh>
      </group>
      <group position={[width / 2 - 0.35, 0, depth / 2 + 0.35]}>
        <mesh position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.16, 0.4, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.5, 0]} castShadow>
          <sphereGeometry args={[0.28, 12, 12]} />
          <meshStandardMaterial color="#15803d" roughness={0.4} />
        </mesh>
      </group>
    </group>
  )
}

/**
 * 4. GLASS CONFERENCE / MEETING ROOM (FRONT-LEFT)
 * Low glass partition walls (height 1.4m), oval table, 6 beige chairs, analytics screen, flipchart easel.
 */
function GlassMeetingRoom({ position = [-2.1, 0, 2.1] }) {
  const meetingTex = useHolographicScreenTexture('meeting_screen')
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

      {/* Low Glass Perimeter Walls */}
      {/* Left Wall */}
      <mesh position={[-width / 2, height / 2, 0]}>
        <boxGeometry args={[0.04, height, depth]} />
        <meshStandardMaterial color="#38bdf8" transparent={true} opacity={0.25} roughness={0.1} />
      </mesh>
      {/* Back Wall */}
      <mesh position={[0, height / 2, -depth / 2]}>
        <boxGeometry args={[width, height, 0.04]} />
        <meshStandardMaterial color="#38bdf8" transparent={true} opacity={0.25} roughness={0.1} />
      </mesh>
      {/* Front Left Wall Panel */}
      <mesh position={[-width / 4, height / 2, depth / 2]}>
        <boxGeometry args={[width / 2, height, 0.04]} />
        <meshStandardMaterial color="#38bdf8" transparent={true} opacity={0.25} roughness={0.1} />
      </mesh>

      {/* Wall Monitor with Analytics Chart */}
      <mesh position={[0, 1.05, -depth / 2 + 0.03]} castShadow>
        <boxGeometry args={[1.5, 0.8, 0.03]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0, 1.05, -depth / 2 + 0.05]}>
        <planeGeometry args={[1.42, 0.72]} />
        <meshBasicMaterial map={meetingTex} />
      </mesh>

      {/* White Oval Conference Table */}
      <group position={[0, 0, 0.1]}>
        <mesh position={[0, 0.62, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.1, 0.05, 0.75]} />
          <meshStandardMaterial color="#ffffff" roughness={0.25} />
        </mesh>
        <mesh position={[-0.75, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.6, 12]} />
          <meshStandardMaterial color="#64748b" metalness={0.7} />
        </mesh>
        <mesh position={[0.75, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.6, 12]} />
          <meshStandardMaterial color="#64748b" metalness={0.7} />
        </mesh>
      </group>

      {/* 6 Modern Beige Swivel Executive Chairs */}
      {[
        [-0.7, 0, -0.45, Math.PI],
        [0, 0, -0.45, Math.PI],
        [0.7, 0, -0.45, Math.PI],
        [-0.7, 0, 0.65, 0],
        [0, 0, 0.65, 0],
        [0.7, 0, 0.65, 0]
      ].map(([cx, cy, cz, rot], i) => (
        <group key={i} position={[cx, cy, cz]} rotation={[0, rot, 0]}>
          <mesh position={[0, 0.16, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.32, 8]} />
            <meshStandardMaterial color="#334155" metalness={0.7} />
          </mesh>
          <mesh position={[0, 0.34, 0]} castShadow>
            <boxGeometry args={[0.36, 0.07, 0.34]} />
            <meshStandardMaterial color="#e5d5c5" roughness={0.65} />
          </mesh>
          <mesh position={[0, 0.54, -0.15]} castShadow>
            <boxGeometry args={[0.36, 0.38, 0.05]} />
            <meshStandardMaterial color="#d4c3b3" roughness={0.65} />
          </mesh>
        </group>
      ))}

      {/* Presentation Flipchart Easel */}
      <group position={[1.35, 0, -0.75]} rotation={[0, -0.45, 0]}>
        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[0.6, 0.85, 0.025]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        <mesh position={[-0.22, 0.32, 0]} rotation={[0, 0, 0.12]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.7, 8]} />
          <meshStandardMaterial color="#d97706" />
        </mesh>
        <mesh position={[0.22, 0.32, 0]} rotation={[0, 0, -0.12]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.7, 8]} />
          <meshStandardMaterial color="#d97706" />
        </mesh>
      </group>
    </group>
  )
}

/**
 * 5. COZY CAFE & PANTRY LOUNGE (FRONT-RIGHT)
 * Wood back wall, floating shelves with mugs, 3 pendant lights, coffee machine,
 * beverage cooler, 2 round dining tables, planter hedge box.
 */
function CozyCafeLounge({ position = [2.1, 0, 2.1] }) {
  const width = 3.8
  const depth = 3.2
  const height = 1.45

  return (
    <group position={position}>
      {/* Warm Floor Pad */}
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <boxGeometry args={[width, 0.02, depth]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.4} />
      </mesh>

      {/* Back Wall (Natural Scandinavian Oak Wood) */}
      <mesh position={[0, height / 2, -depth / 2 + 0.03]} castShadow>
        <boxGeometry args={[width, height, 0.05]} />
        <meshStandardMaterial color="#d4a373" roughness={0.45} />
      </mesh>

      {/* Floating Wooden Shelves with Mugs */}
      {[0.95, 1.25].map((sy, sidx) => (
        <group key={sidx} position={[0, sy, -depth / 2 + 0.15]}>
          <mesh castShadow>
            <boxGeometry args={[2.2, 0.035, 0.2]} />
            <meshStandardMaterial color="#b07d50" roughness={0.4} />
          </mesh>
          {[-0.8, -0.5, -0.2, 0.2, 0.5, 0.8].map((mx, midx) => (
            <mesh key={midx} position={[mx, 0.07, 0]} castShadow>
              <cylinderGeometry args={[0.035, 0.03, 0.07, 12]} />
              <meshStandardMaterial color={['#f43f5e', '#38bdf8', '#fbbf24', '#ffffff', '#10b981', '#a855f7'][midx]} />
            </mesh>
          ))}
        </group>
      ))}

      {/* 3 Hanging Warm Pendant Lights */}
      {[-0.7, 0, 0.7].map((lx, lidx) => (
        <group key={lidx} position={[lx, height - 0.1, -0.65]}>
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 0.24, 6]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={1.5} />
          </mesh>
          <pointLight position={[0, -0.05, 0]} color="#fffbeb" distance={2.0} intensity={1.0} />
        </group>
      ))}

      {/* Wooden Main Counter Desk with Espresso Machine */}
      <group position={[0, 0, -depth / 2 + 0.55]}>
        <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.3, 0.6, 0.55]} />
          <meshStandardMaterial color="#c68b59" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.61, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.34, 0.035, 0.58]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        {/* Espresso Machine */}
        <group position={[-0.65, 0.64, 0]}>
          <mesh position={[0, 0.16, 0]} castShadow>
            <boxGeometry args={[0.32, 0.32, 0.28]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.17, 0.145]}>
            <boxGeometry args={[0.28, 0.22, 0.01]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.9} />
          </mesh>
        </group>
      </group>

      {/* Beverage Vending Cooler / Glass Refrigerator */}
      <group position={[1.45, 0, -depth / 2 + 0.55]}>
        <mesh position={[0, 0.65, 0]} castShadow>
          <boxGeometry args={[0.65, 1.3, 0.55]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.3} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.65, 0.28]}>
          <boxGeometry args={[0.58, 1.2, 0.015]} />
          <meshStandardMaterial color="#38bdf8" transparent={true} opacity={0.3} roughness={0.1} />
        </mesh>
        {[0.3, 0.58, 0.86, 1.14].map((dy, didx) => (
          <group key={didx} position={[0, dy, 0.08]}>
            {[-0.18, -0.06, 0.06, 0.18].map((dx, col) => (
              <mesh key={col} position={[dx, 0, 0]}>
                <cylinderGeometry args={[0.026, 0.026, 0.1, 10]} />
                <meshStandardMaterial color={['#ef4444', '#3b82f6', '#10b981', '#f59e0b'][(didx + col) % 4]} />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* 2 Round Dining Tables with 4 Chairs each */}
      {[
        [-0.85, 0, 0.55],
        [0.85, 0, 0.55]
      ].map(([tx, ty, tz], tidx) => (
        <group key={tidx} position={[tx, ty, tz]}>
          <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.5, 0.5, 0.04, 24]} />
            <meshStandardMaterial color="#e5c29f" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.26, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.1, 0.52, 16]} />
            <meshStandardMaterial color="#c68b59" />
          </mesh>

          {/* 4 Beige Chairs */}
          {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((angle, cidx) => {
            const cx = Math.cos(angle) * 0.68
            const cz = Math.sin(angle) * 0.68
            return (
              <group key={cidx} position={[cx, 0, cz]} rotation={[0, -angle - Math.PI / 2, 0]}>
                <mesh position={[0, 0.15, 0]} castShadow>
                  <cylinderGeometry args={[0.02, 0.02, 0.3, 6]} />
                  <meshStandardMaterial color="#b48a60" />
                </mesh>
                <mesh position={[0, 0.32, 0]} castShadow>
                  <boxGeometry args={[0.28, 0.05, 0.26]} />
                  <meshStandardMaterial color="#e5d5c5" roughness={0.6} />
                </mesh>
                <mesh position={[0, 0.48, -0.11]} castShadow>
                  <boxGeometry args={[0.28, 0.3, 0.04]} />
                  <meshStandardMaterial color="#d4c3b3" roughness={0.6} />
                </mesh>
              </group>
            )
          })}
        </group>
      ))}

      {/* Low Planter Hedge Box with Lush Green Bushes */}
      <group position={[-0.8, 0, depth / 2 + 0.12]}>
        <mesh position={[0, 0.14, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.4, 0.28, 0.28]} />
          <meshStandardMaterial color="#d4a373" roughness={0.4} />
        </mesh>
        {[-0.45, -0.22, 0, 0.22, 0.45].map((bx, bidx) => (
          <mesh key={bidx} position={[bx, 0.34, 0]} castShadow>
            <sphereGeometry args={[0.15, 10, 10]} />
            <meshStandardMaterial color="#16a34a" roughness={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

/**
 * 6. PERIMETER POTTED INDOOR PLANTS
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
            <cylinderGeometry args={[0.24, 0.18, 0.44, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.58, 0]} castShadow>
            <sphereGeometry args={[0.3, 12, 12]} />
            <meshStandardMaterial color="#16a34a" roughness={0.35} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/**
 * Main DioramaOffice Component
 * Directly replicates the layout, zones, aesthetics, and props from the user's reference image!
 */
export default function DioramaOffice() {
  return (
    <group name="diorama-office-root">
      {/* 1. Flat Rounded Diorama Base Platform (Flush at Y = 0) */}
      <DioramaPlatform />

      {/* 2. Top-Center Glass Server Room ("AI AGENT OFFICE") */}
      <CentralServerRoom position={[0, 0, -2.5]} />

      {/* 3. Front-Left Glass Meeting Room */}
      <GlassMeetingRoom position={[-2.1, 0, 2.1]} />

      {/* 4. Front-Right Cozy Cafe & Lounge Room */}
      <CozyCafeLounge position={[2.1, 0, 2.1]} />

      {/* 5. 4 Outer Neon Hexagonal Floor Pods */}
      {/* Pod 1 (Top-Left): Coral/Red (Sherloc / Frontline CS) with Red Holographic Screen */}
      <NeonHexZone
        position={[-5.3, 0, -2.5]}
        color="#f43f5e"
        glowColor="#fb7185"
        bgTint="#ffe4e6"
        propType="screen_red"
        radius={2.1}
      />

      {/* Pod 2 (Top-Right): Cyan/Blue (Watson / Tech Escalation) with Blue Code Holographic Screen */}
      <NeonHexZone
        position={[5.3, 0, -2.5]}
        color="#0284c7"
        glowColor="#38bdf8"
        bgTint="#e0f2fe"
        propType="screen_blue"
        radius={2.1}
      />

      {/* Pod 3 (Bottom-Left): Royal Purple (COO / Supervisor) with Purple Glowing Crystal Orb */}
      <NeonHexZone
        position={[-5.3, 0, 2.1]}
        color="#a855f7"
        glowColor="#c084fc"
        bgTint="#f3e8ff"
        propType="purple_orb"
        radius={2.1}
      />

      {/* Pod 4 (Bottom-Right): Warm Amber/Gold (Scout / Content & Creative) with Art Easel */}
      <NeonHexZone
        position={[5.3, 0, 2.1]}
        color="#f59e0b"
        glowColor="#fbbf24"
        bgTint="#fef3c7"
        propType="art_easel"
        radius={2.1}
      />

      {/* 6. Perimeter Greenery (Potted Plants in White Pots) */}
      <PerimeterPots />
    </group>
  )
}
