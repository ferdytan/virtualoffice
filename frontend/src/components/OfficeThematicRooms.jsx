import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Procedural low frosted glass and pastel wood partition panel.
 * Height 0.95m keeps isometric sightlines open while clearly separating rooms.
 */
function PartitionWall({ position, rotation = [0, 0, 0], length = 2.4, isColorful = true }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Wooden Baseboard */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[length, 0.2, 0.08]} />
        <meshStandardMaterial
          color={isColorful ? '#d8b48f' : '#e2e8f0'}
          roughness={0.4}
        />
      </mesh>

      {/* Slender End Posts */}
      <mesh position={[-length / 2, 0.48, 0]} castShadow>
        <boxGeometry args={[0.06, 0.96, 0.08]} />
        <meshStandardMaterial color={isColorful ? '#64748b' : '#94a3b8'} metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[length / 2, 0.48, 0]} castShadow>
        <boxGeometry args={[0.06, 0.96, 0.08]} />
        <meshStandardMaterial color={isColorful ? '#64748b' : '#94a3b8'} metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Top Cap Rail */}
      <mesh position={[0, 0.94, 0]} castShadow>
        <boxGeometry args={[length, 0.04, 0.08]} />
        <meshStandardMaterial color={isColorful ? '#b48a60' : '#cbd5e1'} roughness={0.3} />
      </mesh>

      {/* Frosted Semi-Transparent Glass Insert */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[length - 0.12, 0.72, 0.02]} />
        <meshPhysicalMaterial
          color={isColorful ? '#e0f2fe' : '#ffffff'}
          transmission={0.7}
          opacity={0.55}
          transparent={true}
          roughness={0.2}
          ior={1.4}
          thickness={0.05}
        />
      </mesh>
    </group>
  )
}

/**
 * Modular Area Carpet (Rug) with colored border and soft pastel tint.
 */
function AreaRug({ position, size = [3.2, 3.2], color = '#fef3c7', borderColor = '#fde68a' }) {
  return (
    <group position={position}>
      {/* Outer Border */}
      <mesh position={[0, 0.011, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[size[0] + 0.12, size[1] + 0.12]} />
        <meshStandardMaterial color={borderColor} roughness={0.7} />
      </mesh>
      {/* Main Rug Body */}
      <mesh position={[0, 0.013, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[size[0], size[1]]} />
        <meshStandardMaterial color={color} roughness={0.65} />
      </mesh>
    </group>
  )
}

/**
 * Mini Server Rack for Tech & Operations Lab (Watson & Nara)
 * Features blinking status LED diodes and stacked blade chassis.
 */
function MiniServerRack({ position, rotation = [0, 0, 0] }) {
  const ledRef = useRef()

  useFrame((state) => {
    if (ledRef.current) {
      const t = state.clock.getElapsedTime()
      ledRef.current.intensity = 0.8 + Math.sin(t * 8) * 0.4
    }
  })

  return (
    <group position={position} rotation={rotation}>
      {/* Rack Outer Cabinet */}
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.65, 1.8, 0.65]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.25} />
      </mesh>

      {/* Front Tinted Glass Panel */}
      <mesh position={[0, 0.9, 0.33]}>
        <boxGeometry args={[0.58, 1.7, 0.02]} />
        <meshPhysicalMaterial color="#0284c7" transmission={0.65} transparent opacity={0.6} roughness={0.1} />
      </mesh>

      {/* Server Chassis Blades */}
      {[0.3, 0.6, 0.9, 1.2, 1.5].map((y, idx) => (
        <group key={idx} position={[0, y, 0.3]}>
          <mesh castShadow>
            <boxGeometry args={[0.54, 0.18, 0.05]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* LED Indicators */}
          <mesh position={[-0.18, 0, 0.03]}>
            <circleGeometry args={[0.015, 12]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
          <mesh position={[-0.13, 0, 0.03]}>
            <circleGeometry args={[0.015, 12]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
          <mesh position={[-0.08, 0, 0.03]}>
            <circleGeometry args={[0.015, 12]} />
            <meshBasicMaterial color="#6366f1" />
          </mesh>
        </group>
      ))}

      {/* Dynamic Rack Glow Light */}
      <pointLight ref={ledRef} position={[0, 1.0, 0.45]} color="#38bdf8" distance={2.5} intensity={1.2} />
    </group>
  )
}

/**
 * Creative Corkboard for Growth & Research Corner (Velocia & Scout)
 * Pinned sticky notes and idea sketches.
 */
function CorkboardKanban({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Pine Wood Frame */}
      <mesh position={[0, 1.45, 0]} castShadow>
        <boxGeometry args={[1.7, 1.1, 0.05]} />
        <meshStandardMaterial color="#92400e" roughness={0.4} />
      </mesh>

      {/* Cork Board Panel */}
      <mesh position={[0, 1.45, 0.03]} castShadow receiveShadow>
        <boxGeometry args={[1.56, 0.96, 0.02]} />
        <meshStandardMaterial color="#d97706" roughness={0.9} />
      </mesh>

      {/* Colorful Pinned Sticky Notes */}
      <mesh position={[-0.45, 1.65, 0.05]} rotation={[0, 0, 0.06]}>
        <planeGeometry args={[0.22, 0.22]} />
        <meshBasicMaterial color="#f43f5e" />
      </mesh>
      <mesh position={[-0.15, 1.68, 0.05]} rotation={[0, 0, -0.04]}>
        <planeGeometry args={[0.22, 0.22]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>
      <mesh position={[0.2, 1.62, 0.05]} rotation={[0, 0, 0.08]}>
        <planeGeometry args={[0.24, 0.2]} />
        <meshBasicMaterial color="#34d399" />
      </mesh>
      <mesh position={[0.5, 1.64, 0.05]} rotation={[0, 0, -0.05]}>
        <planeGeometry args={[0.2, 0.22]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* Lower Row Notes */}
      <mesh position={[-0.35, 1.3, 0.05]} rotation={[0, 0, -0.07]}>
        <planeGeometry args={[0.28, 0.18]} />
        <meshBasicMaterial color="#fef08a" />
      </mesh>
      <mesh position={[0.05, 1.28, 0.05]} rotation={[0, 0, 0.04]}>
        <planeGeometry args={[0.24, 0.2]} />
        <meshBasicMaterial color="#c084fc" />
      </mesh>
      <mesh position={[0.42, 1.32, 0.05]} rotation={[0, 0, 0.05]}>
        <planeGeometry args={[0.26, 0.18]} />
        <meshBasicMaterial color="#fda4af" />
      </mesh>
    </group>
  )
}

/**
 * Knowledge Library Storeroom / RAG Archive Shelving Unit
 * Represents notes and knowledge base as requested:
 * "represent my notes or knowledge base as a storeroom or library"
 */
function KnowledgeLibraryStoreroom({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Wooden Bookshelf Frame */}
      <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 2.0, 0.38]} />
        <meshStandardMaterial color="#3e2723" roughness={0.4} />
      </mesh>

      {/* Shelves Inner Hollow */}
      <mesh position={[0, 1.0, 0.03]}>
        <boxGeometry args={[1.1, 1.9, 0.34]} />
        <meshStandardMaterial color="#2d1a0c" roughness={0.6} />
      </mesh>

      {/* 3 Shelf Dividers */}
      {[0.5, 1.0, 1.5].map((y, idx) => (
        <mesh key={idx} position={[0, y, 0.03]} castShadow>
          <boxGeometry args={[1.1, 0.04, 0.34]} />
          <meshStandardMaterial color="#4a2c11" roughness={0.4} />
        </mesh>
      ))}

      {/* Categorized Knowledge Base Binders / Books */}
      {/* Top Shelf: SOP & Documentation (Cyan & Blue) */}
      {[-0.4, -0.28, -0.16, -0.04, 0.08, 0.2, 0.32].map((x, i) => (
        <mesh key={`top-${i}`} position={[x, 1.7, 0.03]} castShadow>
          <boxGeometry args={[0.08, 0.34, 0.24]} />
          <meshStandardMaterial color={['#0284c7', '#0369a1', '#38bdf8', '#0ea5e9', '#0284c7', '#bae6fd', '#075985'][i]} roughness={0.3} />
        </mesh>
      ))}

      {/* Middle Shelf: Technical & Firmware Logs (Indigo & Violet) */}
      {[-0.38, -0.25, -0.12, 0.01, 0.14, 0.27].map((x, i) => (
        <mesh key={`mid-${i}`} position={[x, 1.2, 0.03]} castShadow>
          <boxGeometry args={[0.09, 0.32, 0.22]} />
          <meshStandardMaterial color={['#6366f1', '#4f46e5', '#818cf8', '#7c3aed', '#a855f7', '#4338ca'][i]} roughness={0.3} />
        </mesh>
      ))}

      {/* Bottom Shelf: Storage Archive Archive Boxes (Warm Cardboard Brown) */}
      {[-0.26, 0.26].map((x, i) => (
        <group key={`box-${i}`} position={[x, 0.25, 0.03]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.42, 0.38, 0.3]} />
            <meshStandardMaterial color={i === 0 ? '#b45309' : '#92400e'} roughness={0.8} />
          </mesh>
          {/* Label Tag */}
          <mesh position={[0, 0, 0.155]}>
            <planeGeometry args={[0.18, 0.09]} />
            <meshBasicMaterial color="#fef3c7" />
          </mesh>
        </group>
      ))}

      {/* Plaque: "KNOWLEDGE BASE ARCHIVE" */}
      <group position={[0, 2.06, 0.12]}>
        <mesh castShadow>
          <boxGeometry args={[0.9, 0.14, 0.02]} />
          <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.012]}>
          <planeGeometry args={[0.84, 0.1]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>
    </group>
  )
}

/**
 * Potted Monstera Deliciosa Plant (Cozy Indoor Greenery)
 */
function CozyMonsteraPlant({ position }) {
  return (
    <group position={position}>
      {/* Ceramic Pot */}
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.16, 0.44, 20]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.25} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.04, 16]} />
        <meshStandardMaterial color="#3f2e21" roughness={0.9} />
      </mesh>

      {/* Broad Lush Green Monstera Leaves */}
      {[0, 1.25, 2.5, 3.75, 5.0].map((rot, idx) => (
        <group key={idx} position={[0, 0.44, 0]} rotation={[0.28, rot, 0.18]}>
          {/* Stem */}
          <mesh position={[0, 0.2, 0]} castShadow>
            <cylinderGeometry args={[0.012, 0.016, 0.42, 8]} />
            <meshStandardMaterial color="#15803d" roughness={0.3} />
          </mesh>
          {/* Broad Leaf */}
          <mesh position={[0, 0.42, 0]} rotation={[0.3, 0, 0]} castShadow>
            <circleGeometry args={[0.16, 16]} />
            <meshStandardMaterial color="#16a34a" side={THREE.DoubleSide} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/**
 * Main OfficeThematicRooms Component
 * Renders the 4 thematic zone partitions, modular rugs, custom furniture, and cozy details.
 */
export default function OfficeThematicRooms({ isColorful = true }) {
  return (
    <group name="thematic-rooms-overlay">
      {/* ========================================================
          1. MODULAR COLOR-CODED AREA RUGS (CARPETS)
          ======================================================== */}
      {/* Zone 1: Reception / Front Desk (Pastel Amber Rug) */}
      <AreaRug
        position={[-3.8, 0, 4.1]}
        size={[2.6, 2.2]}
        color={isColorful ? '#fef3c7' : '#f1f5f9'}
        borderColor={isColorful ? '#fde68a' : '#e2e8f0'}
      />

      {/* Zone 2: Executive COO Suite (Pastel Royal Violet Rug) */}
      <AreaRug
        position={[-1.8, 0, 0.6]}
        size={[2.5, 2.2]}
        color={isColorful ? '#fae8ff' : '#f1f5f9'}
        borderColor={isColorful ? '#f0abfc' : '#e2e8f0'}
      />

      {/* Zone 3: Tech & Operations Lab (Watson & Nara - Pastel Indigo / Sky Blue Rug) */}
      <AreaRug
        position={[2.0, 0, -2.1]}
        size={[3.0, 1.8]}
        color={isColorful ? '#e0e7ff' : '#f1f5f9'}
        borderColor={isColorful ? '#c7d2fe' : '#e2e8f0'}
      />

      {/* Zone 4: Creative & Growth Corner (Velocia & Scout - Pastel Mint / Rose Rug) */}
      <AreaRug
        position={[2.4, 0, -3.4]}
        size={[3.0, 1.8]}
        color={isColorful ? '#dcfce7' : '#f1f5f9'}
        borderColor={isColorful ? '#bbf7d0' : '#e2e8f0'}
      />

      {/* Zone 5: Cafe & Break Lounge (Pastel Warm Orange / Peach Rug) */}
      <AreaRug
        position={[-2.8, 0, -3.4]}
        size={[2.2, 2.2]}
        color={isColorful ? '#ffedd5' : '#f1f5f9'}
        borderColor={isColorful ? '#fed7aa' : '#e2e8f0'}
      />

      {/* ========================================================
          2. LOW FROSTED MODULAR PARTITION WALLS (0.95m Height)
          Keeps sightlines completely clear while defining 4 distinct rooms!
          ======================================================== */}
      {/* Partition A: Private divider for Executive COO Suite */}
      <PartitionWall
        position={[-0.75, 0, 0.5]}
        rotation={[0, Math.PI / 2, 0]}
        length={2.2}
        isColorful={isColorful}
      />

      {/* Partition B: Flanking divider for Workstation / Lab Wing */}
      <PartitionWall
        position={[0.0, 0, -2.7]}
        rotation={[0, Math.PI / 2, 0]}
        length={2.6}
        isColorful={isColorful}
      />

      {/* Partition C: Reception Lobby subtle divider */}
      <PartitionWall
        position={[-2.5, 0, 4.2]}
        rotation={[0, Math.PI / 2, 0]}
        length={1.6}
        isColorful={isColorful}
      />

      {/* ========================================================
          3. THEMATIC GADGETS & KNOWLEDGE ARCHIVE
          ======================================================== */}
      {/* Mini Server Rack for Watson & Nara (Tech Lab) */}
      <MiniServerRack position={[4.0, 0, -1.8]} rotation={[0, -Math.PI / 2, 0]} />

      {/* Corkboard Kanban for Velocia & Scout (Creative Corner) */}
      <CorkboardKanban position={[2.4, 0, -4.4]} rotation={[0, 0, 0]} />

      {/* Knowledge Library / Storeroom (Archive & RAG notes) */}
      <KnowledgeLibraryStoreroom position={[-4.5, 0, -1.8]} rotation={[0, Math.PI / 2, 0]} />

      {/* ========================================================
          4. COZY PLANTS & ACCENTS IN ROOM CORNERS
          ======================================================== */}
      <CozyMonsteraPlant position={[-4.5, 0, 1.8]} />
      <CozyMonsteraPlant position={[4.4, 0, 1.2]} />
      <CozyMonsteraPlant position={[-4.5, 0, -4.0]} />
      <CozyMonsteraPlant position={[-1.2, 0, 4.4]} />
    </group>
  )
}
