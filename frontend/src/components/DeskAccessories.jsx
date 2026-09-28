import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Charming Miniature Office Glass Aquarium with Swimming Goldfish & Betta,
 * Aquatic Plants, River Pebbles, Gentle Cyan Glow & Bubbles
 */
function MiniAquarium({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const fishRef1 = useRef()
  const fishRef2 = useRef()
  const bubbleRef1 = useRef()
  const bubbleRef2 = useRef()
  const [isHovered, setIsHovered] = useState(false)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    // Fish 1 (Goldfish) swimming in a gentle figure-8
    if (fishRef1.current) {
      fishRef1.current.position.x = Math.sin(t * 1.2) * 0.08
      fishRef1.current.position.z = Math.cos(t * 0.9) * 0.04
      fishRef1.current.position.y = 0.09 + Math.sin(t * 2.0) * 0.015
      fishRef1.current.rotation.y = Math.cos(t * 1.2) > 0 ? 0 : Math.PI
    }
    // Fish 2 (Cyan Betta) swimming in counter rhythm
    if (fishRef2.current) {
      fishRef2.current.position.x = Math.cos(t * 1.4) * 0.07
      fishRef2.current.position.z = Math.sin(t * 1.1) * 0.04
      fishRef2.current.position.y = 0.065 + Math.sin(t * 2.5 + 1) * 0.012
      fishRef2.current.rotation.y = -Math.sin(t * 1.4) > 0 ? 0 : Math.PI
    }
    // Bubbles rising
    if (bubbleRef1.current) {
      bubbleRef1.current.position.y = 0.03 + ((t * 0.12) % 0.13)
      bubbleRef1.current.material.opacity = Math.max(0, 0.6 - (((t * 0.12) % 0.13) / 0.13) * 0.5)
    }
    if (bubbleRef2.current) {
      bubbleRef2.current.position.y = 0.03 + (((t + 0.5) * 0.10) % 0.13)
      bubbleRef2.current.material.opacity = Math.max(0, 0.6 - ((((t + 0.5) * 0.10) % 0.13) / 0.13) * 0.5)
    }
  })

  const tankW = 0.30
  const tankH = 0.18
  const tankD = 0.18

  return (
    <group
      position={position}
      rotation={rotation}
      onPointerOver={(e) => {
        e.stopPropagation()
        setIsHovered(true)
      }}
      onPointerOut={() => setIsHovered(false)}
    >
      {/* Soft aquatic cyan point light */}
      <pointLight position={[0, 0.14, 0]} color="#38bdf8" intensity={0.9} distance={1.2} />

      {/* Black Modern Pedestal Base Mat */}
      <mesh position={[0, 0.005, 0]} receiveShadow>
        <boxGeometry args={[tankW + 0.02, 0.01, tankD + 0.02]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} />
      </mesh>

      {/* Clear Glass Outer Tank */}
      <mesh position={[0, tankH / 2 + 0.01, 0]}>
        <boxGeometry args={[tankW, tankH, tankD]} />
        <meshStandardMaterial
          color="#e0f2fe"
          transparent
          opacity={0.32}
          roughness={0.05}
          metalness={0.1}
          depthWrite={false}
        />
      </mesh>

      {/* Crystal Clear Water Volume */}
      <mesh position={[0, (tankH - 0.025) / 2 + 0.01, 0]}>
        <boxGeometry args={[tankW - 0.012, tankH - 0.025, tankD - 0.012]} />
        <meshStandardMaterial
          color="#06b6d4"
          transparent
          opacity={0.42}
          roughness={0.1}
          metalness={0.05}
        />
      </mesh>

      {/* Natural River Sand / Gravel Bed */}
      <mesh position={[0, 0.016, 0]}>
        <boxGeometry args={[tankW - 0.016, 0.014, tankD - 0.016]} />
        <meshStandardMaterial color="#d4b996" roughness={0.9} />
      </mesh>

      {/* Smooth River Stones / Pebbles */}
      <mesh position={[-0.07, 0.026, -0.04]}>
        <sphereGeometry args={[0.018, 10, 8]} />
        <meshStandardMaterial color="#475569" roughness={0.6} />
      </mesh>
      <mesh position={[-0.04, 0.024, -0.03]}>
        <sphereGeometry args={[0.014, 10, 8]} />
        <meshStandardMaterial color="#64748b" roughness={0.6} />
      </mesh>
      <mesh position={[0.07, 0.025, 0.04]}>
        <sphereGeometry args={[0.016, 10, 8]} />
        <meshStandardMaterial color="#334155" roughness={0.6} />
      </mesh>

      {/* Green Aquatic Plant Cluster (Seaweed / Moss) */}
      <group position={[-0.07, 0.022, 0.03]}>
        {[
          { h: 0.08, rot: [0.1, 0, 0.15], x: 0, z: 0 },
          { h: 0.10, rot: [-0.15, 0.4, 0.05], x: 0.015, z: 0.015 },
          { h: 0.07, rot: [0.2, -0.3, -0.1], x: -0.015, z: 0.01 },
          { h: 0.09, rot: [-0.05, 0.8, -0.2], x: 0.02, z: -0.015 }
        ].map((stem, idx) => (
          <mesh
            key={idx}
            position={[stem.x, stem.h / 2, stem.z]}
            rotation={stem.rot}
          >
            <cylinderGeometry args={[0.003, 0.005, stem.h, 6]} />
            <meshStandardMaterial color="#15803d" roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* Animated Rising Bubbles */}
      <mesh ref={bubbleRef1} position={[-0.06, 0.04, -0.03]}>
        <sphereGeometry args={[0.005, 8, 8]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.6} roughness={0.1} />
      </mesh>
      <mesh ref={bubbleRef2} position={[-0.055, 0.04, -0.025]}>
        <sphereGeometry args={[0.0035, 8, 8]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.6} roughness={0.1} />
      </mesh>

      {/* Fish 1: Orange Goldfish */}
      <group ref={fishRef1} position={[0, 0.09, 0]}>
        <mesh scale={[1.8, 1, 0.5]}>
          <sphereGeometry args={[0.016, 12, 10]} />
          <meshStandardMaterial color="#f97316" roughness={0.3} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0, 0]} scale={[0.4, 1.05, 0.55]}>
          <sphereGeometry args={[0.016, 8, 8]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </mesh>
        <mesh position={[-0.026, 0, 0]} rotation={[0, 0, 0.4]}>
          <coneGeometry args={[0.01, 0.02, 6]} />
          <meshStandardMaterial color="#ea580c" roughness={0.3} />
        </mesh>
      </group>

      {/* Fish 2: Vibrant Cyan Betta / Guppy */}
      <group ref={fishRef2} position={[0, 0.065, 0]}>
        <mesh scale={[1.6, 0.9, 0.45]}>
          <sphereGeometry args={[0.013, 12, 10]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} metalness={0.1} />
        </mesh>
        <mesh position={[-0.02, 0, 0]} rotation={[0, 0, 0.3]}>
          <coneGeometry args={[0.009, 0.018, 6]} />
          <meshStandardMaterial color="#facc15" roughness={0.3} />
        </mesh>
      </group>

      {/* Slim LED Hood Lamp on Top */}
      <mesh position={[0, tankH + 0.014, 0]}>
        <boxGeometry args={[tankW - 0.04, 0.01, 0.05]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, tankH + 0.008, 0]}>
        <boxGeometry args={[tankW - 0.06, 0.002, 0.035]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* Interactive Tooltip on Hover */}
      {isHovered && (
        <Html position={[0, tankH + 0.16, 0]} center distanceFactor={12} zIndexRange={[10, 20]}>
          <div className="bg-slate-900/95 backdrop-blur-md text-white px-3 py-1.5 rounded-xl shadow-xl border border-cyan-500/40 text-center whitespace-nowrap pointer-events-none select-none animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-1.5 justify-center">
              <span className="text-sm">🐠</span>
              <span className="text-xs font-bold text-cyan-300">Nara's Mini Aquarium</span>
            </div>
            <p className="text-[10px] text-slate-300 mt-0.5">
              Goldie & Neon berenang tenang menemani Nara bertugas
            </p>
          </div>
        </Html>
      )}
    </group>
  )
}


/**
 * Single decorative hardcover book with colored cover and paper page block
 */
function Book({
  width = 0.22,
  thickness = 0.035,
  depth = 0.16,
  color = '#dc2626',
  position = [0, 0, 0],
  rotation = [0, 0, 0]
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Outer Cover & Binding */}
      <mesh position={[0, thickness / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, thickness, depth]} />
        <meshStandardMaterial
          color={color}
          roughness={0.38}
          metalness={0.06}
        />
      </mesh>
      {/* Inner Cream Paper Block */}
      <mesh position={[0.006, thickness / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width - 0.012, thickness - 0.006, depth - 0.012]} />
        <meshStandardMaterial
          color="#fefce8"
          roughness={0.88}
        />
      </mesh>
    </group>
  )
}

/**
 * Ceramic Coffee Mug with coffee inside
 */
function CoffeeMug({ color = '#0284c7', position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Ceramic Mug Body */}
      <mesh position={[0, 0.042, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.034, 0.029, 0.084, 16]} />
        <meshStandardMaterial color={color} roughness={0.22} metalness={0.08} />
      </mesh>
      {/* Dark Espresso Surface */}
      <mesh position={[0, 0.078, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.004, 16]} />
        <meshStandardMaterial color="#2a170a" roughness={0.15} />
      </mesh>
    </group>
  )
}

/**
 * Post-it / Sticky Note Pad
 */
function StickyNotes({ color = '#fef08a', position = [0, 0, 0], rotation = [0, 0.15, 0] }) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={[0.07, 0.012, 0.07]} />
      <meshStandardMaterial color={color} roughness={0.65} />
    </mesh>
  )
}

/**
 * Document Container / Archive Banker Box with Lid, Label, and Finger Pull Ring
 */
function ArchiveDocumentBox({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  boxColor = '#c59b6c', // Kraft cardboard or white
  lidColor = '#f8fafc',
  width = 0.24,
  height = 0.17,
  depth = 0.32
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Box Body */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={boxColor} roughness={0.68} />
      </mesh>
      {/* Box Lid */}
      <mesh position={[0, height + 0.012, 0]} castShadow>
        <boxGeometry args={[width + 0.016, 0.024, depth + 0.016]} />
        <meshStandardMaterial color={lidColor} roughness={0.55} />
      </mesh>
      {/* Front Label Card Slot */}
      <mesh position={[0, height * 0.58, depth / 2 + 0.002]}>
        <boxGeometry args={[width * 0.44, height * 0.32, 0.004]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      {/* Black Text Indicator Lines on Label */}
      <mesh position={[0, height * 0.62, depth / 2 + 0.005]}>
        <boxGeometry args={[width * 0.32, 0.005, 0.002]} />
        <meshBasicMaterial color="#334155" />
      </mesh>
      <mesh position={[0, height * 0.54, depth / 2 + 0.005]}>
        <boxGeometry args={[width * 0.28, 0.005, 0.002]} />
        <meshBasicMaterial color="#64748b" />
      </mesh>
      {/* Metal Finger Pull Ring / Grommet */}
      <mesh position={[0, height * 0.28, depth / 2 + 0.003]}>
        <cylinderGeometry args={[0.012, 0.012, 0.004, 16]} />
        <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  )
}

/**
 * Row of 5 Vertical Lever-Arch Document Binders / Magazine File Boxes
 */
function VerticalMagazineBinders({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const binders = [
    { color: '#1e3a8a', labelColor: '#f8fafc' }, // Navy Blue
    { color: '#b91c1c', labelColor: '#f8fafc' }, // Crimson Red
    { color: '#f8fafc', labelColor: '#0f172a' }, // Crisp White
    { color: '#0f766e', labelColor: '#f8fafc' }, // Deep Teal
    { color: '#334155', labelColor: '#f8fafc' }  // Charcoal Slate
  ]
  const binderW = 0.046
  const binderH = 0.24
  const binderD = 0.18

  return (
    <group position={position} rotation={rotation}>
      {binders.map((b, i) => {
        const xOffset = (i - 2) * (binderW + 0.004)
        return (
          <group key={i} position={[xOffset, 0, 0]}>
            {/* Binder Body */}
            <mesh position={[0, binderH / 2, 0]} castShadow receiveShadow>
              <boxGeometry args={[binderW, binderH, binderD]} />
              <meshStandardMaterial color={b.color} roughness={0.4} metalness={0.06} />
            </mesh>
            {/* White Spine Label */}
            <mesh position={[0, binderH * 0.65, binderD / 2 + 0.001]}>
              <boxGeometry args={[binderW * 0.72, binderH * 0.42, 0.002]} />
              <meshStandardMaterial color={b.labelColor} roughness={0.8} />
            </mesh>
            {/* Metal Spine Finger Hole */}
            <mesh position={[0, binderH * 0.25, binderD / 2 + 0.002]}>
              <circleGeometry args={[0.01, 16]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

/**
 * 2-Tier Stackable Document Letter Tray with Papers
 */
function DocumentTrayStack({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Tier 1 (Lower Tray) */}
      <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.22, 0.035, 0.30]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Lower Tray Papers */}
      <mesh position={[0, 0.038, 0.01]}>
        <boxGeometry args={[0.19, 0.018, 0.26]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>

      {/* 4 Corner Metal Spacers */}
      {[-0.095, 0.095].map((x, xi) =>
        [-0.13, 0.13].map((z, zi) => (
          <mesh key={`${xi}-${zi}`} position={[x, 0.06, z]}>
            <cylinderGeometry args={[0.004, 0.004, 0.05, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
          </mesh>
        ))
      )}

      {/* Tier 2 (Upper Tray) */}
      <mesh position={[0, 0.09, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.22, 0.035, 0.30]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Upper Tray Papers with Yellow Flag */}
      <mesh position={[0, 0.108, 0.01]}>
        <boxGeometry args={[0.19, 0.014, 0.26]} />
        <meshStandardMaterial color="#fefce8" roughness={0.9} />
      </mesh>
      {/* Sticky Tab sticking out */}
      <mesh position={[0.06, 0.116, 0.14]} rotation={[0, 0.1, 0]}>
        <boxGeometry args={[0.04, 0.002, 0.02]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.6} />
      </mesh>
    </group>
  )
}

/**
 * Renders colorful decorative books, notebooks, mugs, sticky notes,
 * and comprehensive corporate document containers & archive storage.
 */
export default function DeskAccessories({ isColorful = true }) {
  if (!isColorful) return null

  return (
    <group name="office-accessories">
      {/* ======================================================== */}
      {/* WORKSTATION 1: VELOCIA (MARKETING LEAD)                  */}
      {/* Desk center: [1.40, 0.504, -3.16]                        */}
      {/* ======================================================== */}
      <group position={[1.78, 0.504, -3.22]} rotation={[0, -0.15, 0]}>
        <Book width={0.22} thickness={0.034} depth={0.16} color="#1e3a8a" position={[0, 0, 0]} />
        <Book width={0.20} thickness={0.028} depth={0.15} color="#dc2626" position={[0.01, 0.034, 0.005]} rotation={[0, 0.08, 0]} />
        <Book width={0.18} thickness={0.024} depth={0.14} color="#f59e0b" position={[-0.005, 0.062, 0.01]} rotation={[0, -0.06, 0]} />
      </group>
      <StickyNotes color="#fef08a" position={[1.76, 0.51, -2.96]} rotation={[0, 0.2, 0]} />
      <CoffeeMug color="#0284c7" position={[1.05, 0.504, -3.26]} />

      {/* ======================================================== */}
      {/* WORKSTATION 2: SCOUT (RESEARCHER & WRITER)               */}
      {/* Desk center: [3.17, 0.504, -3.16]                        */}
      {/* ======================================================== */}
      <group position={[2.84, 0.504, -3.24]} rotation={[0, 0.12, 0]}>
        <Book width={0.23} thickness={0.036} depth={0.16} color="#15803d" position={[0, 0, 0]} />
        <Book width={0.21} thickness={0.030} depth={0.15} color="#4338ca" position={[0.008, 0.036, -0.005]} rotation={[0, -0.07, 0]} />
        <Book width={0.18} thickness={0.022} depth={0.14} color="#f43f5e" position={[-0.005, 0.066, 0.008]} rotation={[0, 0.05, 0]} />
      </group>
      <StickyNotes color="#a7f3d0" position={[2.86, 0.51, -2.98]} rotation={[0, -0.15, 0]} />
      <CoffeeMug color="#10b981" position={[3.52, 0.504, -3.28]} />

      {/* ======================================================== */}
      {/* WORKSTATION 3: NARA (OFFLINE CS REMINDER)                */}
      {/* Desk center: [1.258, 0.504, -2.42] (Facing South)        */}
      {/* ======================================================== */}
      <group position={[1.56, 0.504, -2.36]} rotation={[0, 0.18, 0]}>
        <Book width={0.22} thickness={0.034} depth={0.15} color="#7c3aed" position={[0, 0, 0]} />
        <Book width={0.20} thickness={0.026} depth={0.14} color="#06b6d4" position={[0.006, 0.034, 0.006]} rotation={[0, -0.08, 0]} />
      </group>
      <StickyNotes color="#bae6fd" position={[1.58, 0.51, -2.62]} rotation={[0, 0.3, 0]} />
      <CoffeeMug color="#f97316" position={[0.92, 0.504, -2.34]} />

      {/* ======================================================== */}
      {/* WORKSTATION 4: WATSON (TECH ESCALATION & KNOWLEDGE LOOP) */}
      {/* Desk center: [3.029, 0.504, -2.42] (Facing South)        */}
      {/* ======================================================== */}
      <group position={[3.32, 0.504, -2.36]} rotation={[0, -0.1, 0]}>
        <Book width={0.22} thickness={0.034} depth={0.15} color="#4338ca" position={[0, 0, 0]} />
        <Book width={0.20} thickness={0.026} depth={0.14} color="#6366f1" position={[-0.005, 0.034, 0.005]} rotation={[0, 0.09, 0]} />
      </group>
      <StickyNotes color="#c7d2fe" position={[3.34, 0.51, -2.62]} rotation={[0, -0.2, 0]} />
      <CoffeeMug color="#4f46e5" position={[2.68, 0.504, -2.34]} />

      {/* ======================================================== */}
      {/* FRONT DESK / RECEPTION: SHERLOC (FRONTLINE CS)           */}
      {/* Counter surface: Y = 0.548, X = [-4.3 to -3.4], Z ~ 3.95 */}
      {/* ======================================================== */}
      <group position={[-3.68, 0.548, 4.02]} rotation={[0, 0.12, 0]}>
        <Book width={0.21} thickness={0.024} depth={0.15} color="#d97706" position={[0, 0, 0]} />
        {/* Reception Bell */}
        <group position={[0.22, 0, -0.05]}>
          <mesh position={[0, 0.008, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.052, 0.015, 16]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.032, 0]} castShadow>
            <sphereGeometry args={[0.036, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.92} roughness={0.18} />
          </mesh>
          <mesh position={[0, 0.046, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.014, 8]} />
            <meshStandardMaterial color="#d97706" metalness={0.95} roughness={0.15} />
          </mesh>
        </group>
      </group>
      <CoffeeMug color="#f59e0b" position={[-4.52, 0.548, 4.06]} />
      <StickyNotes color="#fef08a" position={[-4.54, 0.554, 4.22]} rotation={[0, 0.25, 0]} />

      {/* ======================================================== */}
      {/* CAFE / COFFEE TABLE: [-2.96, 0.504, -3.45]               */}
      {/* ======================================================== */}
      <group position={[-2.82, 0.44, -3.38]} rotation={[0, 0.35, 0]}>
        <Book width={0.24} thickness={0.028} depth={0.19} color="#c2410c" position={[0, 0, 0]} />
        <Book width={0.21} thickness={0.022} depth={0.16} color="#65a30d" position={[0.01, 0.028, 0.01]} rotation={[0, -0.15, 0]} />
      </group>

      {/* ======================================================== */}
      {/* STORAGE CABINET TO THE LEFT OF VELOCIA & NARA:           */}
      {/* Node: [-4.79, 0, -3.64]                                  */}
      {/* Using the built-in 3D model boxes (no floating overlays) */}
      {/* ======================================================== */}

      {/* ======================================================== */}
      {/* LOW WHITE CABINET TO THE LEFT OF NARA:                   */}
      {/* Exact surface center: X = -1.136, Y = 0.505, Z < -1.818  */}
      {/* Features:                                                */}
      {/* - Small Charming 3D Glass Aquarium with Swimming Fish,   */}
      {/*   Aquatic Plants, Pebbles & Gentle Glowing Light         */}
      {/* - Neat Stack of Colorful Books                           */}
      {/* ======================================================== */}
      {/* 1. Charming Glass Aquarium with Goldfish & Betta */}
      <MiniAquarium
        position={[-1.136, 0.505, -2.15]}
        rotation={[0, Math.PI / 2, 0]}
      />

      {/* 2. Neat Stack of Hardcover Books next to Aquarium */}
      <group position={[-1.136, 0.505, -2.60]} rotation={[0, 0.08, 0]}>
        <Book width={0.24} thickness={0.034} depth={0.16} color="#0f766e" position={[0, 0, 0]} />
        <Book width={0.21} thickness={0.028} depth={0.15} color="#b45309" position={[0.008, 0.034, 0.005]} rotation={[0, -0.07, 0]} />
        <Book width={0.19} thickness={0.022} depth={0.14} color="#1e3a8a" position={[-0.005, 0.062, -0.005]} rotation={[0, 0.05, 0]} />
      </group>

      {/* 3. Small Notebook with Sticky Notes */}
      <group position={[-1.136, 0.505, -2.95]} rotation={[0, -0.12, 0]}>
        <Book width={0.18} thickness={0.016} depth={0.13} color="#475569" position={[0, 0, 0]} />
        <StickyNotes color="#fef08a" position={[0, 0.018, 0]} rotation={[0, 0.2, 0]} />
      </group>
    </group>
  )
}
