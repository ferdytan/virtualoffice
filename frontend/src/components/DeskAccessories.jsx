import React from 'react'
import * as THREE from 'three'

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
 * Renders colorful decorative books, notebooks, mugs, and sticky notes
 * across workstation desks, the coffee table, and the storage cabinet.
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
        {/* Book stack: Navy Blue, Crimson Red, Gold Amber */}
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
        {/* Book stack: Emerald Green, Royal Indigo, Coral Pink */}
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
        {/* Book stack: Violet Purple & Cyan Blue Technical Manuals */}
        <Book width={0.22} thickness={0.034} depth={0.15} color="#7c3aed" position={[0, 0, 0]} />
        <Book width={0.20} thickness={0.026} depth={0.14} color="#06b6d4" position={[0.006, 0.034, 0.006]} rotation={[0, -0.08, 0]} />
      </group>
      <StickyNotes color="#bae6fd" position={[1.58, 0.51, -2.62]} rotation={[0, 0.3, 0]} />
      <CoffeeMug color="#f97316" position={[0.92, 0.504, -2.34]} />

      {/* ======================================================== */}
      {/* WORKSTATION 4: TEAM DESK                                 */}
      {/* Desk center: [3.029, 0.504, -2.42] (Facing South)        */}
      {/* ======================================================== */}
      <group position={[3.32, 0.504, -2.36]} rotation={[0, -0.1, 0]}>
        {/* Book stack: Amber Gold & Forest Green */}
        <Book width={0.21} thickness={0.032} depth={0.15} color="#d97706" position={[0, 0, 0]} />
        <Book width={0.19} thickness={0.025} depth={0.14} color="#059669" position={[-0.005, 0.032, 0.005]} rotation={[0, 0.09, 0]} />
      </group>
      <CoffeeMug color="#8b5cf6" position={[2.68, 0.504, -2.34]} />

      {/* ======================================================== */}
      {/* CAFE / COFFEE TABLE: [-2.96, 0.504, -3.45]               */}
      {/* ======================================================== */}
      <group position={[-2.82, 0.44, -3.38]} rotation={[0, 0.35, 0]}>
        <Book width={0.24} thickness={0.028} depth={0.19} color="#c2410c" position={[0, 0, 0]} />
        <Book width={0.21} thickness={0.022} depth={0.16} color="#65a30d" position={[0.01, 0.028, 0.01]} rotation={[0, -0.15, 0]} />
      </group>

      {/* ======================================================== */}
      {/* CABINET CREDENZA: [-4.79, 0, -3.64]                      */}
      {/* Top surface height approx ~0.82m                          */}
      {/* Standing row of colorful reference books                 */}
      {/* ======================================================== */}
      <group position={[-4.72, 0.82, -3.55]} rotation={[0, Math.PI / 2, 0]}>
        <Book width={0.18} thickness={0.032} depth={0.15} color="#b91c1c" position={[-0.08, 0, 0]} />
        <Book width={0.19} thickness={0.036} depth={0.15} color="#1d4ed8" position={[-0.04, 0, 0]} />
        <Book width={0.17} thickness={0.028} depth={0.14} color="#047857" position={[0, 0, 0]} />
        <Book width={0.20} thickness={0.038} depth={0.15} color="#b45309" position={[0.04, 0, 0]} />
        <Book width={0.18} thickness={0.030} depth={0.14} color="#6d28d9" position={[0.08, 0, 0]} />
      </group>
    </group>
  )
}
