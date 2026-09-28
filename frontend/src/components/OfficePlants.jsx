import React from 'react'
import * as THREE from 'three'

/**
 * Large Monstera Deliciosa in a modern white ceramic floor pot
 */
function MonsteraFloorPlant({ position = [0, 0, 0], scale = 1 }) {
  // Leaf rotation angles and positions for a lush, organic fan
  const leafData = [
    { pos: [0.08, 0.42, 0.06], rot: [0.35, 0.2, -0.4], size: [0.22, 0.32] },
    { pos: [-0.08, 0.46, -0.05], rot: [-0.3, 0.8, 0.35], size: [0.24, 0.34] },
    { pos: [0.12, 0.55, -0.08], rot: [-0.2, -0.6, -0.3], size: [0.26, 0.36] },
    { pos: [-0.10, 0.58, 0.10], rot: [0.4, 1.4, 0.25], size: [0.25, 0.35] },
    { pos: [0.02, 0.68, 0.02], rot: [0.1, 0.4, -0.1], size: [0.28, 0.38] },
    { pos: [-0.04, 0.36, 0.12], rot: [0.55, 0.6, 0.4], size: [0.18, 0.26] },
    { pos: [0.10, 0.34, -0.12], rot: [-0.45, -0.8, -0.5], size: [0.19, 0.27] }
  ]

  return (
    <group position={position} scale={scale}>
      {/* Cylindrical White Ceramic Planter Pot */}
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.20, 0.16, 0.36, 24]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.25} />
      </mesh>
      {/* Saucer Base */}
      <mesh position={[0, 0.012, 0]} receiveShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.024, 24]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
      </mesh>
      {/* Dark Moist Soil */}
      <mesh position={[0, 0.34, 0]}>
        <cylinderGeometry args={[0.19, 0.19, 0.02, 24]} />
        <meshStandardMaterial color="#1f1610" roughness={0.9} />
      </mesh>
      {/* River Pebbles */}
      <mesh position={[0.06, 0.355, 0.04]}>
        <sphereGeometry args={[0.024, 8, 8]} />
        <meshStandardMaterial color="#64748b" roughness={0.5} />
      </mesh>
      <mesh position={[-0.05, 0.355, -0.06]}>
        <sphereGeometry args={[0.028, 8, 8]} />
        <meshStandardMaterial color="#475569" roughness={0.5} />
      </mesh>

      {/* Main Stems & Leaves */}
      {leafData.map((l, idx) => (
        <group key={idx}>
          {/* Curved Stem */}
          <mesh position={[l.pos[0] * 0.5, (0.34 + l.pos[1]) / 2, l.pos[2] * 0.5]}>
            <cylinderGeometry args={[0.007, 0.011, l.pos[1] - 0.28, 8]} />
            <meshStandardMaterial color="#166534" roughness={0.4} />
          </mesh>
          {/* Broad Heart-Shaped Monstera Leaf Blade */}
          <mesh position={l.pos} rotation={l.rot} castShadow>
            <boxGeometry args={[l.size[0], 0.004, l.size[1]]} />
            <meshStandardMaterial
              color={idx % 2 === 0 ? '#15803d' : '#16a34a'}
              roughness={0.32}
              metalness={0.04}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/**
 * Tall Snake Plant (Sansevieria) in mid-century fluted pot with wood tripod stand
 */
function SnakePlant({ position = [0, 0, 0], scale = 1 }) {
  // Upright sword leaves at slight outward angles
  const leaves = [
    { pos: [0, 0.52, 0], rot: [0.05, 0.2, 0.02], height: 0.62 },
    { pos: [0.04, 0.48, 0.03], rot: [0.12, 0.6, -0.08], height: 0.56 },
    { pos: [-0.04, 0.46, -0.03], rot: [-0.10, -0.5, 0.10], height: 0.54 },
    { pos: [-0.03, 0.44, 0.04], rot: [0.14, -0.8, 0.06], height: 0.50 },
    { pos: [0.05, 0.45, -0.02], rot: [-0.08, 1.2, -0.12], height: 0.52 },
    { pos: [0.01, 0.38, -0.05], rot: [-0.16, 0.1, -0.04], height: 0.42 },
    { pos: [-0.05, 0.36, -0.01], rot: [-0.06, -1.4, 0.15], height: 0.40 },
    { pos: [0.02, 0.35, 0.05], rot: [0.18, 0.3, 0.05], height: 0.38 }
  ]

  return (
    <group position={position} scale={scale}>
      {/* Wooden Tripod Legs */}
      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, i) => (
        <mesh
          key={i}
          position={[Math.cos(angle) * 0.14, 0.10, Math.sin(angle) * 0.14]}
          rotation={[0.1 * Math.sin(angle), 0, -0.1 * Math.cos(angle)]}
          castShadow
        >
          <cylinderGeometry args={[0.012, 0.01, 0.20, 10]} />
          <meshStandardMaterial color="#78350f" roughness={0.4} />
        </mesh>
      ))}

      {/* Modern Matte Ceramic Planter Pot */}
      <mesh position={[0, 0.20, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.13, 0.24, 24]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.3} />
      </mesh>

      {/* Soil */}
      <mesh position={[0, 0.31, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.02, 20]} />
        <meshStandardMaterial color="#2d1d13" roughness={0.9} />
      </mesh>

      {/* Sword-like Variegated Leaves */}
      {leaves.map((leaf, idx) => (
        <group key={idx} position={leaf.pos} rotation={leaf.rot}>
          {/* Main Leaf Core (Deep Forest Green) */}
          <mesh castShadow>
            <boxGeometry args={[0.065, leaf.height, 0.008]} />
            <meshStandardMaterial color="#14532d" roughness={0.35} />
          </mesh>
          {/* Golden Yellow Margin Edge Accent */}
          <mesh position={[0.034, 0, 0]}>
            <boxGeometry args={[0.005, leaf.height * 0.96, 0.009]} />
            <meshStandardMaterial color="#eab308" roughness={0.4} />
          </mesh>
          <mesh position={[-0.034, 0, 0]}>
            <boxGeometry args={[0.005, leaf.height * 0.96, 0.009]} />
            <meshStandardMaterial color="#eab308" roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/**
 * Lush Areca Palm / Rubber Tree in Terracotta Planter (Lounge / Cafe area)
 */
function PalmFloorPlant({ position = [0, 0, 0], scale = 1 }) {
  const fronds = [
    { pos: [0.14, 0.44, 0.08], rot: [0.4, 0.3, -0.6], len: 0.44 },
    { pos: [-0.14, 0.48, -0.06], rot: [-0.4, 0.7, 0.55], len: 0.46 },
    { pos: [0.08, 0.56, -0.12], rot: [-0.5, -0.5, -0.4], len: 0.48 },
    { pos: [-0.10, 0.58, 0.10], rot: [0.45, 1.2, 0.4], len: 0.45 },
    { pos: [0, 0.65, 0], rot: [0.1, 0.2, 0.05], len: 0.50 }
  ]

  return (
    <group position={position} scale={scale}>
      {/* Flared Terracotta Pot */}
      <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.16, 0.32, 24]} />
        <meshStandardMaterial color="#c2410c" roughness={0.65} />
      </mesh>
      {/* Terracotta Rim */}
      <mesh position={[0, 0.31, 0]}>
        <cylinderGeometry args={[0.23, 0.22, 0.03, 24]} />
        <meshStandardMaterial color="#9a3412" roughness={0.65} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, 0.30, 0]}>
        <cylinderGeometry args={[0.21, 0.21, 0.02, 24]} />
        <meshStandardMaterial color="#1e1814" roughness={0.9} />
      </mesh>

      {/* Stems & Palm Fronds */}
      {fronds.map((f, i) => (
        <group key={i}>
          {/* Bamboo-style Stem */}
          <mesh position={[f.pos[0] * 0.4, (0.3 + f.pos[1]) / 2, f.pos[2] * 0.4]}>
            <cylinderGeometry args={[0.009, 0.014, f.pos[1] - 0.26, 8]} />
            <meshStandardMaterial color="#65a30d" roughness={0.5} />
          </mesh>
          {/* Arching Frond Blade */}
          <mesh position={f.pos} rotation={f.rot} castShadow>
            <boxGeometry args={[0.12, 0.003, f.len]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#15803d' : '#22c55e'}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/**
 * Desktop Succulent in Geometric Terracotta Pot (for Velocia's desk)
 */
function DeskSucculent({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Hexagonal Mini Pot */}
      <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.04, 0.032, 0.06, 6]} />
        <meshStandardMaterial color="#ea580c" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.058, 0]}>
        <cylinderGeometry args={[0.036, 0.036, 0.006, 12]} />
        <meshStandardMaterial color="#291a10" roughness={0.9} />
      </mesh>
      {/* Rosette Succulent Leaves */}
      {[0, 1, 2, 3, 4].map((layer) => (
        <group key={layer} position={[0, 0.06 + layer * 0.008, 0]} rotation={[0, layer * 0.6, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.055 - layer * 0.008, 0.008, 0.055 - layer * 0.008]} />
            <meshStandardMaterial color={layer % 2 === 0 ? '#16a34a' : '#4ade80'} roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/**
 * Desktop Aloe Vera in Modern Cube Pot (for Watson's desk)
 */
function DeskAloe({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* White Ceramic Cube Pot */}
      <mesh position={[0, 0.035, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.07, 0.07, 0.07]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.068, 0]}>
        <boxGeometry args={[0.064, 0.006, 0.064]} />
        <meshStandardMaterial color="#1a120b" roughness={0.9} />
      </mesh>
      {/* Spiked Aloe Leaves */}
      {[
        { rot: [0.2, 0, 0.15], h: 0.09 },
        { rot: [-0.2, 0.8, -0.1], h: 0.08 },
        { rot: [0.1, -0.8, 0.2], h: 0.085 },
        { rot: [-0.15, -1.8, 0.1], h: 0.075 },
        { rot: [0.05, 2.2, -0.15], h: 0.07 }
      ].map((l, i) => (
        <mesh key={i} position={[0, 0.07 + l.h / 2, 0]} rotation={l.rot} castShadow>
          <coneGeometry args={[0.012, l.h, 6]} />
          <meshStandardMaterial color="#15803d" roughness={0.35} />
        </mesh>
      ))}
    </group>
  )
}

/**
 * Elegant Reception Bonsai Planter on Sherloc's front desk
 */
function ReceptionBonsai({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Low Oval Dark Slate Dish */}
      <mesh position={[0, 0.015, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.09, 0.08, 0.03, 16]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} />
      </mesh>
      {/* Moss Bed */}
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.085, 0.085, 0.008, 16]} />
        <meshStandardMaterial color="#4d7c0f" roughness={0.8} />
      </mesh>
      {/* Gnarled Wood Trunk */}
      <mesh position={[0, 0.065, 0]} rotation={[0.15, 0.3, -0.2]} castShadow>
        <cylinderGeometry args={[0.01, 0.018, 0.08, 8]} />
        <meshStandardMaterial color="#5c3818" roughness={0.7} />
      </mesh>
      <mesh position={[0.02, 0.105, 0.01]} rotation={[-0.2, 0.5, 0.3]} castShadow>
        <cylinderGeometry args={[0.008, 0.01, 0.06, 8]} />
        <meshStandardMaterial color="#5c3818" roughness={0.7} />
      </mesh>
      {/* Cloud Foliage Pads */}
      <mesh position={[0.03, 0.13, 0.02]} castShadow>
        <sphereGeometry args={[0.045, 10, 8]} />
        <meshStandardMaterial color="#15803d" roughness={0.35} />
      </mesh>
      <mesh position={[-0.02, 0.11, -0.01]} castShadow>
        <sphereGeometry args={[0.038, 8, 8]} />
        <meshStandardMaterial color="#166534" roughness={0.35} />
      </mesh>
    </group>
  )
}

/**
 * Renders all vibrant, lively office plants throughout the space
 */
export default function OfficePlants({ isColorful = true }) {
  if (!isColorful) return null

  return (
    <group name="office-plants">
      {/* 1. Large Monstera Floor Plant near Presentation Board */}
      <MonsteraFloorPlant position={[3.85, 0, 1.65]} scale={1.1} />

      {/* 2. Tall Snake Plant in Fluted Stand between Reception & Workstation Pod */}
      <SnakePlant position={[-0.95, 0, 0.15]} scale={1.05} />

      {/* 3. Areca Palm in Terracotta Pot near Cafe Table / Lounge */}
      <PalmFloorPlant position={[-1.95, 0, -4.25]} scale={1.15} />

      {/* 4. Large Ficus / Rubber Plant near Entrance Hallway */}
      <MonsteraFloorPlant position={[-1.35, 0, 4.35]} scale={1.0} />

      {/* 5. Desktop Succulent on Velocia's Desk */}
      <DeskSucculent position={[0.82, 0.504, -3.05]} />

      {/* 6. Desktop Aloe Vera on Watson's Desk */}
      <DeskAloe position={[3.58, 0.504, -2.42]} />

      {/* 7. Elegant Reception Bonsai Dish on Sherloc's Front Desk */}
      <ReceptionBonsai position={[-4.58, 0.548, 3.82]} />
    </group>
  )
}
