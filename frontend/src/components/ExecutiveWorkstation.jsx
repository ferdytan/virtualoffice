import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Executive Workstation & Desk for the COO (Chief Operating Officer).
 * Features:
 * - Matte Slate & Dark Smoked Walnut Executive Desk with Gold Accents
 * - Ergonomic High-Back Executive Leather Chair
 * - Ultra-wide Panoramic Curved Monitor with live COO Orchestrator Graphics
 * - Brass/Gold Nameplate: "COO - CHIEF OPERATING OFFICER"
 * - Modern Minimalist Architectural Desk Lamp with warm glow
 * - Leather Desk Pad, Tablet, Gold Pen Holder, and Espresso Mug
 */
export default function ExecutiveWorkstation({
  position = [-1.8, 0, 0.35],
  rotation = [0, 0, 0],
  isSelected = false,
  onClick = () => {}
}) {
  const [hovered, setHovered] = useState(false)
  const pulseRef = useRef()

  useFrame(({ clock }) => {
    if (pulseRef.current) {
      pulseRef.current.intensity = 0.8 + Math.sin(clock.getElapsedTime() * 2) * 0.2
    }
  })

  // Colors
  const deskTopColor = '#292524'       // Dark smoked walnut
  const deskBodyColor = '#1e293b'      // Matte slate / charcoal #334155 / #1e293b
  const goldAccent = '#d97706'         // Metallic gold accent
  const leatherPadColor = '#0f172a'    // Deep obsidian leather pad
  const monitorGlow = '#38bdf8'        // Sky cyan live glow

  return (
    <group
      position={position}
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
    >
      {/* Soft warm desk lamp light */}
      <pointLight
        ref={pulseRef}
        position={[0.55, 0.85, 0.05]}
        color="#fef08a"
        intensity={0.9}
        distance={2.2}
      />

      {/* ------------------------------------------------------------- */}
      {/* 1. EXECUTIVE DESK STRUCTURE                                   */}
      {/* ------------------------------------------------------------- */}
      {/* Main Smoked Walnut Tabletop (Width 1.50m x Depth 0.76m x 0.04m) */}
      <mesh position={[0, 0.70, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.50, 0.04, 0.76]} />
        <meshStandardMaterial
          color={deskTopColor}
          roughness={0.28}
          metalness={0.12}
        />
      </mesh>

      {/* Gold Trim Inlay around Tabletop Edge */}
      <mesh position={[0, 0.695, 0]} castShadow>
        <boxGeometry args={[1.52, 0.015, 0.78]} />
        <meshStandardMaterial
          color={goldAccent}
          roughness={0.25}
          metalness={0.85}
        />
      </mesh>

      {/* Left Pedestal Cabinet / Legs (Matte Charcoal Slate) */}
      <mesh position={[-0.62, 0.34, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.22, 0.68, 0.70]} />
        <meshStandardMaterial
          color={deskBodyColor}
          roughness={0.42}
          metalness={0.25}
        />
      </mesh>
      {/* Left Cabinet Gold Handles */}
      <mesh position={[-0.50, 0.45, 0.355]} castShadow>
        <boxGeometry args={[0.015, 0.08, 0.015]} />
        <meshStandardMaterial color={goldAccent} metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[-0.50, 0.25, 0.355]} castShadow>
        <boxGeometry args={[0.015, 0.08, 0.015]} />
        <meshStandardMaterial color={goldAccent} metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Right Pedestal Leg (Open Architectural Slate Frame) */}
      <mesh position={[0.62, 0.34, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.22, 0.68, 0.70]} />
        <meshStandardMaterial
          color={deskBodyColor}
          roughness={0.42}
          metalness={0.25}
        />
      </mesh>

      {/* Modesty Panel (Backboard facing south) */}
      <mesh position={[0, 0.42, -0.32]} castShadow>
        <boxGeometry args={[1.05, 0.48, 0.02]} />
        <meshStandardMaterial color="#0f172a" roughness={0.45} />
      </mesh>

      {/* ------------------------------------------------------------- */}
      {/* 2. ACCESSORIES ON DESK SURFACE (Y = 0.72)                     */}
      {/* ------------------------------------------------------------- */}
      {/* Obsidian Leather Desk Pad */}
      <mesh position={[0, 0.722, 0.06]} receiveShadow>
        <boxGeometry args={[0.82, 0.004, 0.46]} />
        <meshStandardMaterial color={leatherPadColor} roughness={0.65} />
      </mesh>

      {/* Ultra-Slim Executive Keyboard & Glass Touchpad */}
      <mesh position={[0, 0.726, 0.16]} castShadow>
        <boxGeometry args={[0.34, 0.008, 0.12]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0.24, 0.725, 0.16]} castShadow>
        <boxGeometry args={[0.08, 0.006, 0.11]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.2} />
      </mesh>

      {/* Ultra-Wide Curved Executive Monitor Stand & Arm */}
      <mesh position={[0, 0.73, -0.18]} castShadow>
        <cylinderGeometry args={[0.09, 0.11, 0.015, 24]} />
        <meshStandardMaterial color={goldAccent} metalness={0.88} roughness={0.22} />
      </mesh>
      <mesh position={[0, 0.88, -0.22]} castShadow>
        <cylinderGeometry args={[0.018, 0.018, 0.32, 16]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Ultra-Wide Curved Monitor Chassis (43" Aspect Ratio) */}
      <group position={[0, 1.02, -0.19]}>
        {/* Curved Back Bezel */}
        <mesh castShadow>
          <boxGeometry args={[0.86, 0.38, 0.025]} />
          <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.2} />
        </mesh>

        {/* Glowing Screen Face with live COO command dashboard graphics */}
        <mesh position={[0, 0, 0.014]}>
          <planeGeometry args={[0.84, 0.36]} />
          <meshStandardMaterial
            color="#090d16"
            emissive={monitorGlow}
            emissiveIntensity={0.28}
            roughness={0.15}
          />
        </mesh>
      </group>

      {/* ------------------------------------------------------------- */}
      {/* 3. EXECUTIVE ACCESSORIES & GOLD NAMEPLATE                     */}
      {/* ------------------------------------------------------------- */}
      {/* Triangular Brass Nameplate */}
      <group position={[-0.45, 0.724, -0.18]} rotation={[0, 0.25, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.26, 0.035, 0.04]} />
          <meshStandardMaterial color={goldAccent} metalness={0.92} roughness={0.18} />
        </mesh>
      </group>

      {/* Modern Brass/Gold Architectural Lamp */}
      <group position={[0.55, 0.722, -0.12]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.06, 0.07, 0.015, 24]} />
          <meshStandardMaterial color={goldAccent} metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.18, 0]} rotation={[0, 0, -0.15]} castShadow>
          <cylinderGeometry args={[0.008, 0.008, 0.36, 12]} />
          <meshStandardMaterial color="#1e293b" metalness={0.6} />
        </mesh>
        <mesh position={[-0.08, 0.34, 0]} rotation={[0, 0, 0.4]} castShadow>
          <boxGeometry args={[0.18, 0.02, 0.06]} />
          <meshStandardMaterial color={goldAccent} metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Ceramic Espresso Mug & Gold Spoon */}
      <group position={[-0.48, 0.722, 0.12]}>
        <mesh position={[0, 0.035, 0]} castShadow>
          <cylinderGeometry args={[0.032, 0.028, 0.07, 20]} />
          <meshStandardMaterial color="#1e293b" roughness={0.25} />
        </mesh>
        {/* Gold saucer */}
        <mesh position={[0, 0.004, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.008, 20]} />
          <meshStandardMaterial color={goldAccent} metalness={0.88} roughness={0.2} />
        </mesh>
      </group>

      {/* Slim Executive Tablet / Document Folder */}
      <group position={[0.42, 0.724, 0.14]} rotation={[0, -0.12, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.18, 0.008, 0.25]} />
          <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.3} />
        </mesh>
      </group>

      {/* ------------------------------------------------------------- */}
      {/* 4. EXECUTIVE LEATHER HIGH-BACK CHAIR                          */}
      {/* Located at Z = +0.45 behind the desk                          */}
      {/* ------------------------------------------------------------- */}
      <group position={[0, 0, 0.48]} rotation={[0, Math.PI, 0]}>
        {/* Star Base & Wheels */}
        <mesh position={[0, 0.06, 0]} castShadow>
          <cylinderGeometry args={[0.26, 0.26, 0.025, 5]} />
          <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.22, 0]} castShadow>
          <cylinderGeometry args={[0.022, 0.022, 0.30, 16]} />
          <meshStandardMaterial color={goldAccent} metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Thick Contoured Leather Seat Cushion */}
        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.48, 0.09, 0.46]} />
          <meshStandardMaterial color="#18181b" roughness={0.4} />
        </mesh>
        {/* High Ergonomic Backrest with Integrated Headrest */}
        <mesh position={[0, 0.82, -0.21]} rotation={[0.06, 0, 0]} castShadow>
          <boxGeometry args={[0.46, 0.72, 0.08]} />
          <meshStandardMaterial color="#18181b" roughness={0.4} />
        </mesh>
        {/* Gold Trim Line on Backrest Spine */}
        <mesh position={[0, 0.82, -0.255]} rotation={[0.06, 0, 0]} castShadow>
          <boxGeometry args={[0.02, 0.65, 0.015]} />
          <meshStandardMaterial color={goldAccent} metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Padded Armrests */}
        <mesh position={[-0.25, 0.58, -0.04]} castShadow>
          <boxGeometry args={[0.05, 0.03, 0.26]} />
          <meshStandardMaterial color="#18181b" roughness={0.4} />
        </mesh>
        <mesh position={[0.25, 0.58, -0.04]} castShadow>
          <boxGeometry args={[0.05, 0.03, 0.26]} />
          <meshStandardMaterial color="#18181b" roughness={0.4} />
        </mesh>
      </group>

      {/* Interactive Selection / Hover Ground Ring */}
      {(hovered || isSelected) && (
        <mesh position={[0, 0.012, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.95, 1.05, 36]} />
          <meshBasicMaterial
            color={goldAccent}
            transparent
            opacity={isSelected ? 0.9 : 0.6}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Floating 3D Badge on Hover */}
      {hovered && !isSelected && (
        <Html position={[0, 1.45, 0]} center distanceFactor={11} zIndexRange={[20, 30]}>
          <div className="bg-slate-900/95 backdrop-blur-md text-white px-3 py-1.5 rounded-xl shadow-xl border border-amber-500/40 text-center whitespace-nowrap pointer-events-none select-none">
            <div className="flex items-center gap-1.5 justify-center">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-black tracking-tight text-amber-300">
                Executive Workstation &bull; COO
              </span>
            </div>
            <p className="text-[10px] text-slate-300 font-medium">
              Klik untuk membuka Executive Command Center
            </p>
          </div>
        </Html>
      )}
    </group>
  )
}
