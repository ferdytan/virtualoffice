import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Animated rising steam particles from freshly brewed espresso or tea
 */
function SteamParticles({ offset = [0, 0, 0], scale = 1, speed = 0.25 }) {
  const steamRef1 = useRef()
  const steamRef2 = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (steamRef1.current) {
      steamRef1.current.position.y = offset[1] + ((t * speed) % 0.32)
      steamRef1.current.scale.setScalar(scale * (0.6 + ((t * speed) % 0.32) * 2.0))
      steamRef1.current.material.opacity = Math.max(0, 0.28 - ((t * speed) % 0.32))
    }
    if (steamRef2.current) {
      steamRef2.current.position.y = offset[1] + (((t + 0.45) * (speed * 0.9)) % 0.32)
      steamRef2.current.scale.setScalar(scale * (0.6 + (((t + 0.45) * (speed * 0.9)) % 0.32) * 2.0))
      steamRef2.current.material.opacity = Math.max(0, 0.28 - (((t + 0.45) * (speed * 0.9)) % 0.32))
    }
  })

  return (
    <group position={[offset[0], 0, offset[2]]}>
      <mesh ref={steamRef1} position={[-0.03, offset[1], 0]}>
        <sphereGeometry args={[0.032, 10, 10]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={steamRef2} position={[0.03, offset[1], 0]}>
        <sphereGeometry args={[0.028, 10, 10]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

/**
 * Sleek Retro 2-Slice Bread Toaster with Golden Toast
 */
function OfficeToaster({ position = [0, 0, 0], isPopped = true }) {
  return (
    <group position={position}>
      {/* Chrome / Stainless Steel Main Chassis */}
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.22, 0.15, 0.16]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.92} roughness={0.15} />
      </mesh>

      {/* Black Accent Bottom Base Trim */}
      <mesh position={[0, 0.012, 0]} castShadow>
        <boxGeometry args={[0.23, 0.024, 0.17]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} />
      </mesh>

      {/* Top Slots */}
      <mesh position={[0, 0.156, -0.03]}>
        <boxGeometry args={[0.16, 0.005, 0.025]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.156, 0.03]}>
        <boxGeometry args={[0.16, 0.005, 0.025]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>

      {/* Golden Toast Slices popping up */}
      <group position={[-0.01, isPopped ? 0.20 : 0.16, -0.03]} rotation={[0.05, 0, 0.04]}>
        {/* Toast Body */}
        <mesh castShadow>
          <boxGeometry args={[0.11, 0.10, 0.014]} />
          <meshStandardMaterial color="#d97706" roughness={0.65} />
        </mesh>
        {/* Golden Crust Rim */}
        <mesh position={[0, 0.045, 0]}>
          <boxGeometry args={[0.112, 0.016, 0.016]} />
          <meshStandardMaterial color="#92400e" roughness={0.7} />
        </mesh>
      </group>

      <group position={[0.02, isPopped ? 0.195 : 0.155, 0.03]} rotation={[-0.04, 0, -0.03]}>
        <mesh castShadow>
          <boxGeometry args={[0.11, 0.10, 0.014]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.65} />
        </mesh>
        <mesh position={[0, 0.045, 0]}>
          <boxGeometry args={[0.112, 0.016, 0.016]} />
          <meshStandardMaterial color="#92400e" roughness={0.7} />
        </mesh>
      </group>

      {/* Side Slider Lever */}
      <mesh position={[0.115, isPopped ? 0.11 : 0.05, 0]}>
        <boxGeometry args={[0.018, 0.014, 0.03]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} />
      </mesh>

      {/* Front Toast Browning Dial Knob */}
      <mesh position={[0, 0.06, 0.082]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.016, 0.016, 0.008, 16]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} />
      </mesh>

      {/* Small Ceramic Bread Plate with Butter Knife */}
      <group position={[0.18, 0.008, 0.02]}>
        <mesh receiveShadow>
          <cylinderGeometry args={[0.085, 0.075, 0.012, 20]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} />
        </mesh>
        {/* Butter Knife */}
        <mesh position={[0, 0.01, 0.02]} rotation={[0, 0.4, 0]}>
          <boxGeometry args={[0.11, 0.004, 0.012]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </group>
  )
}

/**
 * Modern Glass Electric Tea Kettle / Tea Maker
 */
function OfficeTeaMaker({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* 360-degree Heating Base */}
      <mesh position={[0, 0.01, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.075, 0.08, 0.02, 24]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Subtle Blue Power LED Ring on base */}
      <mesh position={[0, 0.021, 0]}>
        <ringGeometry args={[0.065, 0.072, 24]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* Transparent Borosilicate Glass Jug */}
      <mesh position={[0, 0.11, 0]} castShadow>
        <cylinderGeometry args={[0.065, 0.07, 0.18, 24]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.38}
          roughness={0.1}
          metalness={0.05}
        />
      </mesh>

      {/* Amber Tea Liquid inside */}
      <mesh position={[0, 0.09, 0]}>
        <cylinderGeometry args={[0.06, 0.064, 0.13, 24]} />
        <meshStandardMaterial
          color="#b45309"
          transparent
          opacity={0.82}
          roughness={0.15}
        />
      </mesh>

      {/* Floating Lemon Slice in Tea */}
      <mesh position={[0.015, 0.14, 0]} rotation={[0.4, 0.2, 0.8]}>
        <cylinderGeometry args={[0.024, 0.024, 0.005, 16]} />
        <meshStandardMaterial color="#facc15" roughness={0.4} />
      </mesh>

      {/* Stainless Steel Lid & Spout Rim */}
      <mesh position={[0, 0.205, 0]}>
        <cylinderGeometry args={[0.068, 0.068, 0.02, 24]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.15} />
      </mesh>
      {/* Lid Handle Knob */}
      <mesh position={[0, 0.225, 0]}>
        <sphereGeometry args={[0.014, 12, 12]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} />
      </mesh>

      {/* Ergonomic Handle */}
      <mesh position={[-0.082, 0.12, 0]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.02, 0.14, 0.022]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} />
      </mesh>

      {/* Rising Tea Steam */}
      <SteamParticles offset={[0.02, 0.22, 0]} scale={0.7} speed={0.2} />

      {/* 2 Matching Glass Teacups & Saucers */}
      <group position={[0.13, 0.006, 0.05]}>
        {/* Saucer */}
        <mesh receiveShadow>
          <cylinderGeometry args={[0.05, 0.04, 0.008, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} />
        </mesh>
        {/* Glass Cup with Tea */}
        <mesh position={[0, 0.025, 0]} castShadow>
          <cylinderGeometry args={[0.034, 0.024, 0.042, 16]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.4} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0.022, 0]}>
          <cylinderGeometry args={[0.03, 0.022, 0.034, 16]} />
          <meshStandardMaterial color="#d97706" transparent opacity={0.85} roughness={0.2} />
        </mesh>
      </group>
    </group>
  )
}

/**
 * Modern Beverage / Fresh Juice Dispenser with Citruses
 */
function OfficeJuiceDispenser({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Heavy Stainless Steel Pedestal Base Stand */}
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.085, 0.095, 0.08, 24]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.18} />
      </mesh>

      {/* Transparent Glass Beverage Cylinder */}
      <mesh position={[0, 0.21, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.26, 24]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.32}
          roughness={0.08}
          metalness={0.05}
        />
      </mesh>

      {/* Fresh Vibrant Orange Juice Liquid */}
      <mesh position={[0, 0.19, 0]}>
        <cylinderGeometry args={[0.076, 0.076, 0.21, 24]} />
        <meshStandardMaterial
          color="#ea580c"
          transparent
          opacity={0.88}
          roughness={0.25}
        />
      </mesh>

      {/* Floating Orange Slices */}
      <mesh position={[-0.02, 0.24, 0.02]} rotation={[0.6, 0.3, 0.2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.006, 16]} />
        <meshStandardMaterial color="#fed7aa" roughness={0.4} />
      </mesh>
      <mesh position={[0.02, 0.16, -0.02]} rotation={[-0.4, 0.5, -0.3]}>
        <cylinderGeometry args={[0.028, 0.028, 0.006, 16]} />
        <meshStandardMaterial color="#fed7aa" roughness={0.4} />
      </mesh>

      {/* Dispenser Metal Tap / Spigot */}
      <group position={[0, 0.11, 0.095]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.035, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.1} />
        </mesh>
        {/* Tap Handle Lever */}
        <mesh position={[0, 0.02, 0.01]}>
          <cylinderGeometry args={[0.005, 0.005, 0.03, 8]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} />
        </mesh>
      </group>

      {/* Polished Metal Top Lid with Finial */}
      <mesh position={[0, 0.345, 0]}>
        <cylinderGeometry args={[0.085, 0.085, 0.02, 24]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.92} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0.365, 0]}>
        <sphereGeometry args={[0.016, 12, 12]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* 2 Clear Glass Tumblers with Orange Juice & Eco Straws */}
      <group position={[0.13, 0, 0.06]}>
        <mesh position={[0, 0.04, 0]} castShadow>
          <cylinderGeometry args={[0.026, 0.022, 0.08, 16]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.35} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.032, 0]}>
          <cylinderGeometry args={[0.023, 0.02, 0.06, 16]} />
          <meshStandardMaterial color="#f97316" transparent opacity={0.88} roughness={0.2} />
        </mesh>
        {/* Paper Drinking Straw */}
        <mesh position={[0.008, 0.065, 0]} rotation={[0.1, 0, 0.2]}>
          <cylinderGeometry args={[0.003, 0.003, 0.10, 8]} />
          <meshStandardMaterial color="#0284c7" roughness={0.5} />
        </mesh>
      </group>
    </group>
  )
}

/**
 * Potted Pothos / Trailing Vine Plant sitting on cabinet corner
 */
function CabinetMiniPlant({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Matte White Hexagonal Ceramic Pot */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.055, 0.045, 0.10, 6]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </mesh>
      {/* Dark Soil */}
      <mesh position={[0, 0.095, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.01, 12]} />
        <meshStandardMaterial color="#271b12" roughness={0.9} />
      </mesh>

      {/* Lush Green Trailing Foliage Leaf Clusters */}
      <group position={[0, 0.11, 0]}>
        <mesh position={[0.02, 0.01, 0.02]} rotation={[0.4, 0.3, 0.2]} castShadow>
          <sphereGeometry args={[0.038, 8, 8]} />
          <meshStandardMaterial color="#15803d" roughness={0.35} />
        </mesh>
        <mesh position={[-0.02, 0.02, -0.01]} rotation={[-0.3, 0.4, -0.2]} castShadow>
          <sphereGeometry args={[0.034, 8, 8]} />
          <meshStandardMaterial color="#22c55e" roughness={0.35} />
        </mesh>
        <mesh position={[0.01, -0.02, 0.04]} rotation={[0.8, -0.2, 0.5]} castShadow>
          <sphereGeometry args={[0.032, 8, 8]} />
          <meshStandardMaterial color="#16a34a" roughness={0.35} />
        </mesh>
        <mesh position={[-0.03, -0.04, 0.03]} rotation={[1.1, 0.1, -0.4]} castShadow>
          <sphereGeometry args={[0.026, 8, 8]} />
          <meshStandardMaterial color="#15803d" roughness={0.35} />
        </mesh>
      </group>
    </group>
  )
}

/**
 * Full Office Refreshment Station & Credenza Cabinet behind Watson & Nara.
 * Features:
 * - Wide Scandinavian Oak / Walnut Credenza Cabinet with storage doors
 * - High-end Dual-Portafilter Espresso Machine with rising steam
 * - Retro 2-slice Toaster with golden toast popping out
 * - Electric Glass Tea Kettle with amber tea and teacups
 * - Citrus Juice Dispenser with floating orange slices
 * - Potted trailing plant and cups
 */
export default function CoffeeCorner({
  // Resting directly on top of the existing cabinet behind the whiteboard (Z = 2.05, surface Y = 0.505)
  position = [2.70, 0.505, 2.05],
  rotation = [0, Math.PI, 0],
  isColorful = true
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [brewCount, setBrewCount] = useState(48)
  const [activeItem, setActiveItem] = useState(null) // 'coffee' | 'toaster' | 'tea' | 'juice'

  const handleInteract = (item) => {
    setActiveItem(item)
    if (item === 'coffee') setBrewCount((prev) => prev + 1)
    setTimeout(() => setActiveItem(null), 3000)
  }

  const espressoBodyColor = isColorful ? '#0f172a' : '#1e293b'

  // Countertop surface is flush with the existing cabinet top (local Y = 0)
  const counterY = 0

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
      {/* Ambient warm overhead refreshment glow */}
      <pointLight position={[0, 0.8, 0.1]} color="#fff7ed" intensity={0.9} distance={2.5} />

      {/* ======================================================== */}
      {/* 1. ESPRESSO COFFEE MACHINE                               */}
      {/* ======================================================== */}
      <group
        position={[-0.58, counterY, 0.02]}
        onClick={(e) => {
          e.stopPropagation()
          handleInteract('coffee')
        }}
        cursor="pointer"
      >
        {/* Chassis */}
        <mesh position={[0, 0.19, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.36, 0.38, 0.30]} />
          <meshStandardMaterial color={espressoBodyColor} metalness={0.78} roughness={0.22} />
        </mesh>
        {/* Chrome Front Faceplate */}
        <mesh position={[0, 0.20, 0.152]} castShadow>
          <boxGeometry args={[0.32, 0.28, 0.008]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.92} roughness={0.12} />
        </mesh>
        {/* Top Cup Warming Rail with Stacked Espresso Cups */}
        <mesh position={[0, 0.385, 0]}>
          <boxGeometry args={[0.36, 0.012, 0.30]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>
        <group position={[-0.08, 0.40, 0]}>
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.03, 0.022, 0.04, 16]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.055, 0]}>
            <cylinderGeometry args={[0.03, 0.022, 0.04, 16]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.2} />
          </mesh>
        </group>
        <group position={[0.08, 0.40, 0]}>
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.03, 0.022, 0.04, 16]} />
            <meshStandardMaterial color="#ef4444" roughness={0.2} />
          </mesh>
        </group>
        {/* Dual Coffee Bean Hoppers */}
        <mesh position={[-0.07, 0.45, -0.04]}>
          <cylinderGeometry args={[0.04, 0.032, 0.08, 16]} />
          <meshStandardMaterial color="#2d1a0c" roughness={0.3} metalness={0.1} />
        </mesh>
        <mesh position={[0.07, 0.45, -0.04]}>
          <cylinderGeometry args={[0.04, 0.032, 0.08, 16]} />
          <meshStandardMaterial color="#2d1a0c" roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Drip Tray & Dual Chrome Group Heads */}
        <mesh position={[0, 0.03, 0.17]} castShadow receiveShadow>
          <boxGeometry args={[0.32, 0.06, 0.16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Two Espresso Cups on Drip Tray */}
        <mesh position={[-0.06, 0.085, 0.16]}>
          <cylinderGeometry args={[0.028, 0.02, 0.045, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        <mesh position={[0.06, 0.085, 0.16]}>
          <cylinderGeometry args={[0.028, 0.02, 0.045, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        {/* Portafilters with Handles */}
        <group position={[-0.06, 0.18, 0.15]}>
          <cylinderGeometry args={[0.026, 0.026, 0.02, 16]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.1} />
        </group>
        <group position={[0.06, 0.18, 0.15]}>
          <cylinderGeometry args={[0.026, 0.026, 0.02, 16]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.1} />
        </group>
        {/* Steam Effect */}
        <SteamParticles offset={[0, 0.22, 0.14]} scale={0.9} speed={0.24} />
      </group>

      {/* ======================================================== */}
      {/* 3. RETRO BREAD TOASTER (CENTER-LEFT)                     */}
      {/* ======================================================== */}
      <group
        onClick={(e) => {
          e.stopPropagation()
          handleInteract('toaster')
        }}
        cursor="pointer"
      >
        <OfficeToaster
          position={[-0.18, counterY, 0.04]}
          isPopped={activeItem === 'toaster' || isHovered}
        />
      </group>

      {/* ======================================================== */}
      {/* 4. ELECTRIC GLASS TEA MAKER (CENTER-RIGHT)               */}
      {/* ======================================================== */}
      <group
        onClick={(e) => {
          e.stopPropagation()
          handleInteract('tea')
        }}
        cursor="pointer"
      >
        <OfficeTeaMaker position={[0.26, counterY, 0.03]} />
      </group>

      {/* ======================================================== */}
      {/* 5. CITRUS JUICE DISPENSER (RIGHT SIDE)                   */}
      {/* ======================================================== */}
      <group
        onClick={(e) => {
          e.stopPropagation()
          handleInteract('juice')
        }}
        cursor="pointer"
      >
        <OfficeJuiceDispenser position={[0.68, counterY, 0.02]} />
      </group>

      {/* ======================================================== */}
      {/* 6. TRAILING POTHOS PLANT ON CABINET CORNER               */}
      {/* ======================================================== */}
      <CabinetMiniPlant position={[0.96, counterY, 0.06]} />

      {/* Floating 3D Badge on Hover / Interaction */}
      {(isHovered || activeItem) && (
        <Html position={[0, counterY + 0.62, 0.15]} center distanceFactor={14} zIndexRange={[10, 20]}>
          <div className="bg-slate-900/95 backdrop-blur-md text-white px-3.5 py-2 rounded-2xl shadow-xl border border-amber-500/40 text-center whitespace-nowrap pointer-events-none select-none animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 justify-center">
              <span className="text-sm">
                {activeItem === 'coffee'
                  ? '☕'
                  : activeItem === 'toaster'
                  ? '🍞'
                  : activeItem === 'tea'
                  ? '🍵'
                  : activeItem === 'juice'
                  ? '🍊'
                  : '☕🥪'}
              </span>
              <span className="text-xs font-black tracking-tight text-amber-300">
                {activeItem === 'coffee'
                  ? 'Menyeduh Espresso...'
                  : activeItem === 'toaster'
                  ? 'Memanggang Roti Hangat!'
                  : activeItem === 'tea'
                  ? 'Menyeduh Teh Melati Hangat...'
                  : activeItem === 'juice'
                  ? 'Menuangkan Jus Jeruk Segar...'
                  : 'Office Pantry & Break Corner'}
              </span>
            </div>
            <p className="text-[10px] text-slate-300 font-medium mt-0.5">
              {activeItem
                ? 'Nikmati rehat sejenak sebelum kembali bertugas!'
                : `Total ${brewCount} porsi disajikan • Espresso • Toaster • Tea Maker • Juice`}
            </p>
          </div>
        </Html>
      )}
    </group>
  )
}
