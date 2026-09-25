import React, { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

// Waypoints forming a smooth, safe patrol route around the office
const PATROL_ROUTE = [
  new THREE.Vector3(1.8, 0.08, -0.6),    // In front of 4-desk pod
  new THREE.Vector3(0.3, 0.08, 0.8),     // Center corridor
  new THREE.Vector3(2.2, 0.08, 1.8),     // Meeting & whiteboard zone
  new THREE.Vector3(1.6, 0.08, 3.0),     // Boardroom corner
  new THREE.Vector3(-0.8, 0.08, 2.8),    // Crossing towards cafe/counter
  new THREE.Vector3(-2.2, 0.08, 2.4),    // Coffee bar approach
  new THREE.Vector3(-2.5, 0.08, 0.6),    // Lounge / sofa corridor
  new THREE.Vector3(-1.6, 0.08, -1.2),   // Cafe table corner
  new THREE.Vector3(0.5, 0.08, -1.2)     // Return to desk entrance
]

export default function OfficeNPC({ isColorful = true }) {
  const botGroupRef = useRef()
  const lidarRef = useRef()
  const sweeperLeftRef = useRef()
  const sweeperRightRef = useRef()
  const beaconRef = useRef()
  const floorGlowRef = useRef()

  const [currentWpIndex, setCurrentWpIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [statusText, setStatusText] = useState('Membersihkan lantai & mengantar kopi')

  // Temp vectors for movement calculations to avoid memory allocations in useFrame
  const targetVec = useMemo(() => new THREE.Vector3(), [])
  const moveDir = useMemo(() => new THREE.Vector3(), [])

  useFrame((state, delta) => {
    if (!botGroupRef.current) return

    const t = state.clock.getElapsedTime()
    const targetWp = PATROL_ROUTE[currentWpIndex]
    targetVec.copy(targetWp)

    // Current position
    const currentPos = botGroupRef.current.position

    // Direction vector to target waypoint
    moveDir.subVectors(targetVec, currentPos)
    moveDir.y = 0 // maintain flat ground level
    const dist = moveDir.length()

    // When waypoint is reached, advance to next
    if (dist < 0.2) {
      setCurrentWpIndex((prev) => (prev + 1) % PATROL_ROUTE.length)
      if (Math.random() > 0.65) {
        const statuses = [
          'Membersihkan lantai ruang kerja',
          'Mengantar cangkir kopi ke meja tim',
          'Sensor Lidar: Koridor aman',
          'Baterai 97% • Mode patroli otonom'
        ]
        setStatusText(statuses[Math.floor(Math.random() * statuses.length)])
      }
    } else {
      // Normalize and move
      moveDir.normalize()
      const speed = 0.65 * delta
      currentPos.x += moveDir.x * speed
      currentPos.z += moveDir.z * speed

      // Smoothly rotate towards heading angle
      const targetAngle = Math.atan2(moveDir.x, moveDir.z)
      const currentAngle = botGroupRef.current.rotation.y
      // Shortest angle interpolation
      let diff = (targetAngle - currentAngle) % (Math.PI * 2)
      if (diff < -Math.PI) diff += Math.PI * 2
      if (diff > Math.PI) diff -= Math.PI * 2
      botGroupRef.current.rotation.y += diff * Math.min(1, delta * 5)
    }

    // Gentle floating/bobbing motion
    botGroupRef.current.position.y = 0.08 + Math.sin(t * 8) * 0.006

    // Rotate LIDAR sensor turret continuously
    if (lidarRef.current) {
      lidarRef.current.rotation.y += delta * 6
    }

    // Spin dual front sweeper brushes
    if (sweeperLeftRef.current) {
      sweeperLeftRef.current.rotation.y += delta * 14
    }
    if (sweeperRightRef.current) {
      sweeperRightRef.current.rotation.y -= delta * 14
    }

    // Flashing antenna beacon
    if (beaconRef.current) {
      beaconRef.current.material.opacity = 0.4 + Math.sin(t * 6) * 0.5
    }

    // Floor vacuum glow breathing
    if (floorGlowRef.current) {
      floorGlowRef.current.material.opacity = 0.35 + Math.sin(t * 4) * 0.15
    }
  })

  // Theme colors
  const chassisColor = isColorful ? '#0f172a' : '#1e293b'
  const accentTrimColor = isColorful ? '#38bdf8' : '#64748b'
  const visorColor = isColorful ? '#06b6d4' : '#38bdf8'

  return (
    <group
      ref={botGroupRef}
      position={[1.8, 0.08, -0.6]}
      onPointerOver={(e) => {
        e.stopPropagation()
        setIsHovered(true)
      }}
      onPointerOut={() => setIsHovered(false)}
      cursor="pointer"
    >
      {/* Soft Cyan Floor Suction Vacuum Glow */}
      <mesh
        ref={floorGlowRef}
        position={[0, -0.075, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.18, 0.34, 32]} />
        <meshBasicMaterial
          color={accentTrimColor}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Main Disc Chassis (Roomba / Cleaning Bot body) */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.26, 0.28, 0.1, 32]} />
        <meshStandardMaterial
          color={chassisColor}
          roughness={0.25}
          metalness={0.65}
        />
      </mesh>

      {/* Beveled Top Shell Plate */}
      <mesh position={[0, 0.052, 0]}>
        <cylinderGeometry args={[0.23, 0.25, 0.015, 32]} />
        <meshStandardMaterial
          color="#334155"
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>

      {/* Outer Protective Rubber Bumper */}
      <mesh position={[0, -0.01, 0]}>
        <cylinderGeometry args={[0.282, 0.282, 0.05, 32]} />
        <meshStandardMaterial color="#020617" roughness={0.9} />
      </mesh>

      {/* Decorative Accent Ring */}
      <mesh position={[0, 0.058, 0]}>
        <torusGeometry args={[0.21, 0.008, 12, 32]} />
        <meshStandardMaterial
          color={accentTrimColor}
          emissive={accentTrimColor}
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Rotating LIDAR Laser Turret on Top */}
      <group ref={lidarRef} position={[0, 0.08, 0.04]}>
        {/* Turret Base */}
        <mesh>
          <cylinderGeometry args={[0.055, 0.065, 0.045, 20]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Optical Sensor Slot */}
        <mesh position={[0, 0.01, 0.045]}>
          <boxGeometry args={[0.04, 0.015, 0.02]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      </group>

      {/* Antenna with Flashing Beacon Light */}
      <group position={[-0.1, 0.06, -0.1]}>
        {/* Rod */}
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.004, 0.004, 0.16, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} />
        </mesh>
        {/* Flashing Beacon Bulb */}
        <mesh ref={beaconRef} position={[0, 0.165, 0]}>
          <sphereGeometry args={[0.018, 12, 12]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.9} />
        </mesh>
      </group>

      {/* Front Curved Face Display / Visor */}
      <mesh position={[0, 0.005, 0.23]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[0.22, 0.055, 0.02]} />
        <meshStandardMaterial color="#020617" roughness={0.1} />
      </mesh>

      {/* Glowing Digital Eyes & Smile Expression on Face Visor */}
      <group position={[0, 0.008, 0.242]}>
        {/* Left Eye */}
        <mesh position={[-0.045, 0.005, 0]}>
          <circleGeometry args={[0.012, 12]} />
          <meshBasicMaterial color={visorColor} />
        </mesh>
        {/* Right Eye */}
        <mesh position={[0.045, 0.005, 0]}>
          <circleGeometry args={[0.012, 12]} />
          <meshBasicMaterial color={visorColor} />
        </mesh>
        {/* Cute Smile Arc */}
        <mesh position={[0, -0.012, 0]} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.04, 0.006]} />
          <meshBasicMaterial color={visorColor} />
        </mesh>
      </group>

      {/* Left Sweeper Brush (Front-Left) */}
      <group ref={sweeperLeftRef} position={[-0.22, -0.04, 0.16]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.01, 8]} />
          <meshStandardMaterial color="#f59e0b" wireframe />
        </mesh>
      </group>

      {/* Right Sweeper Brush (Front-Right) */}
      <group ref={sweeperRightRef} position={[0.22, -0.04, 0.16]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.01, 8]} />
          <meshStandardMaterial color="#f59e0b" wireframe />
        </mesh>
      </group>

      {/* Top Delivery Tray carrying a miniature Coffee Mug (Office Boy service function) */}
      <group position={[0.07, 0.06, -0.05]}>
        {/* Mini Tray */}
        <mesh position={[0, 0.005, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.01, 16]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        {/* Ceramic Coffee Mug */}
        <mesh position={[0, 0.035, 0]}>
          <cylinderGeometry args={[0.026, 0.02, 0.045, 16]} />
          <meshStandardMaterial color={isColorful ? '#ef4444' : '#f8fafc'} roughness={0.2} />
        </mesh>
        {/* Mug Handle */}
        <mesh position={[0.032, 0.035, 0]}>
          <torusGeometry args={[0.012, 0.004, 8, 12]} />
          <meshStandardMaterial color={isColorful ? '#ef4444' : '#f8fafc'} />
        </mesh>
      </group>

      {/* Interactive Tooltip on Hover */}
      {isHovered && (
        <Html position={[0, 0.45, 0]} center distanceFactor={12} zIndexRange={[15, 25]}>
          <div className="bg-slate-900/95 backdrop-blur-md text-white px-3 py-1.5 rounded-2xl shadow-xl border border-sky-400/40 text-center whitespace-nowrap pointer-events-none select-none animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-1.5 justify-center">
              <span className="text-xs">🤖</span>
              <span className="text-xs font-black text-sky-300">CleanBot-01</span>
              <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                OFFICE BOY NPC
              </span>
            </div>
            <p className="text-[10px] text-slate-300 font-medium mt-0.5">
              {statusText}
            </p>
          </div>
        </Html>
      )}
    </group>
  )
}
