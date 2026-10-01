import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Autonomous Floor Cleaning Robot (Roomba Cleaner)
 * Navigates hallways between functional zones in the diorama office.
 * Features beveled clay body, chrome front bumper, laser sensor dome, and glowing status LED.
 */
export default function RoombaRobot() {
  const robotRef = useRef()
  const ledRef = useRef()

  // Open hallway patrol waypoints strictly within central thoroughfare
  const WAYPOINTS = [
    [-2.6, 0.06, 0.2],   // Frontline hallway junction
    [0.0, 0.06, 0.2],    // Central crossroad
    [2.6, 0.06, 0.2],    // Executive/Workshop junction
    [2.6, 0.06, -0.6],   // Corridor turn
    [0.0, 0.06, -0.6],   // Central thoroughfare
    [-2.6, 0.06, -0.6]   // Datacenter corridor turn
  ]

  const currentWpIndex = useRef(0)
  const currentPos = useRef(new THREE.Vector3(WAYPOINTS[0][0], 0.06, WAYPOINTS[0][1]))
  const targetAngle = useRef(0)
  const currentAngle = useRef(0)

  useFrame((state, delta) => {
    if (!robotRef.current) return

    const t = state.clock.getElapsedTime()
    const targetWp = WAYPOINTS[currentWpIndex.current]
    const targetVec = new THREE.Vector3(targetWp[0], 0.06, targetWp[2])

    // Move smoothly towards current waypoint
    const distance = currentPos.current.distanceTo(targetVec)
    const speed = 0.9 * delta // Smooth leisurely cleaning speed

    if (distance < 0.15) {
      // Advance to next waypoint
      currentWpIndex.current = (currentWpIndex.current + 1) % WAYPOINTS.length
    } else {
      const dir = new THREE.Vector3().subVectors(targetVec, currentPos.current).normalize()
      currentPos.current.addScaledVector(dir, speed)

      // Calculate target yaw angle
      targetAngle.current = Math.atan2(dir.x, dir.z)
    }

    // Smoothly interpolate rotation heading
    let angleDiff = targetAngle.current - currentAngle.current
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2
    currentAngle.current += angleDiff * Math.min(delta * 4, 1)

    robotRef.current.position.copy(currentPos.current)
    robotRef.current.rotation.y = currentAngle.current

    // Pulsing cyan/green cleaning LED
    if (ledRef.current) {
      const pulse = 0.5 + Math.sin(t * 4) * 0.5
      ledRef.current.emissiveIntensity = 1.2 + pulse * 1.5
    }
  })

  return (
    <group ref={robotRef} position={[WAYPOINTS[0][0], 0.06, WAYPOINTS[0][2]]}>
      {/* Main Circular Disc Body (Matte Slate Finish) */}
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.24, 0.07, 32]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Front Chrome Collision Bumper */}
      <mesh position={[0, 0.042, 0.12]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.3, 0.05, 0.12]} />
        <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Top Outer Trim Ring */}
      <mesh position={[0, 0.077, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.16, 0.21, 32]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} />
      </mesh>

      {/* Central Laser LIDAR Sensor Turret */}
      <mesh position={[0, 0.09, -0.04]} castShadow>
        <cylinderGeometry args={[0.055, 0.06, 0.035, 24]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Status LED Ring Indicator (Pulsing Cyan-Green) */}
      <mesh position={[0, 0.082, 0.05]}>
        <circleGeometry args={[0.024, 16]} />
        <meshStandardMaterial
          ref={ledRef}
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={2.0}
        />
      </mesh>

      {/* Subtle Under-Chassis Ground Shadow / Vacuum Glow */}
      <mesh position={[0, -0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.08, 0.26, 24]} />
        <meshBasicMaterial color="#0284c7" transparent opacity={0.15} />
      </mesh>
    </group>
  )
}
