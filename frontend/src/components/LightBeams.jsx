import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Coordinates of the 4 workstation flexo lamps in the office
const DESK_LAMPS = [
  // Desk 1 (Velocia - South-West)
  {
    id: 'lamp-1',
    lampPos: [0.89, 1.05, -3.07],
    deskTarget: [1.39, 0.505, -3.15],
    color: '#fed7aa',
    glowColor: '#ffedd5',
    radius: 0.38
  },
  // Desk 2 (Scout - South-East)
  {
    id: 'lamp-2',
    lampPos: [2.66, 1.05, -3.07],
    deskTarget: [3.16, 0.505, -3.15],
    color: '#fed7aa',
    glowColor: '#ffedd5',
    radius: 0.38
  },
  // Desk 3 (Nara - North-West, face-to-face)
  {
    id: 'lamp-3',
    lampPos: [1.77, 1.05, -2.51],
    deskTarget: [1.26, 0.505, -2.42],
    color: '#fed7aa',
    glowColor: '#ffedd5',
    radius: 0.38
  },
  // Desk 4 (Team Desk - North-East, face-to-face)
  {
    id: 'lamp-4',
    lampPos: [3.54, 1.05, -2.51],
    deskTarget: [3.03, 0.505, -2.42],
    color: '#fed7aa',
    glowColor: '#ffedd5',
    radius: 0.38
  }
]

function SingleLightBeam({ lamp, isColorful }) {
  const beamRef = useRef()
  const poolRef = useRef()

  // Calculate direction and height from lamp head to desk surface
  const startY = lamp.lampPos[1]
  const endY = lamp.deskTarget[1]
  const height = Math.abs(startY - endY)
  const midY = (startY + endY) / 2
  const midX = (lamp.lampPos[0] + lamp.deskTarget[0]) / 2
  const midZ = (lamp.lampPos[2] + lamp.deskTarget[2]) / 2

  // Subtle breathing light intensity animation
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const pulse = Math.sin(t * 2.2 + lamp.id.charCodeAt(5)) * 0.05 + 1.0
    if (beamRef.current) {
      beamRef.current.material.opacity = (isColorful ? 0.32 : 0.22) * pulse
    }
    if (poolRef.current) {
      poolRef.current.material.opacity = (isColorful ? 0.45 : 0.32) * pulse
    }
  })

  return (
    <group>
      {/* Light Source Bulb Glow at lamp shade */}
      <mesh position={lamp.lampPos}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial
          color={lamp.color}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Volumetric Light Beam Cone radiating downwards */}
      <mesh
        ref={beamRef}
        position={[midX, midY, midZ]}
      >
        <cylinderGeometry
          args={[0.07, lamp.radius * 1.3, height, 24, 1, true]}
        />
        <meshBasicMaterial
          color={lamp.color}
          transparent
          opacity={isColorful ? 0.3 : 0.2}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Illuminated Light Pool on Desk Surface */}
      <mesh
        ref={poolRef}
        position={[lamp.deskTarget[0], lamp.deskTarget[1] + 0.002, lamp.deskTarget[2]]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[lamp.radius, 32]} />
        <meshBasicMaterial
          color={lamp.glowColor}
          transparent
          opacity={isColorful ? 0.45 : 0.32}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Inner bright hotspot disk */}
      <mesh
        position={[lamp.deskTarget[0], lamp.deskTarget[1] + 0.003, lamp.deskTarget[2]]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[lamp.radius * 0.45, 24]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={isColorful ? 0.35 : 0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

export default function LightBeams({ isColorful = true }) {
  return (
    <group name="office-light-beams">
      {DESK_LAMPS.map((lamp) => (
        <SingleLightBeam
          key={lamp.id}
          lamp={lamp}
          isColorful={isColorful}
        />
      ))}
    </group>
  )
}
