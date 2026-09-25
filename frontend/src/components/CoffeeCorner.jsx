import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Animated rising steam particles from freshly brewed espresso
 */
function SteamParticles() {
  const steamRef1 = useRef()
  const steamRef2 = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (steamRef1.current) {
      steamRef1.current.position.y = 0.28 + ((t * 0.25) % 0.35)
      steamRef1.current.scale.setScalar(0.7 + ((t * 0.25) % 0.35) * 1.8)
      steamRef1.current.material.opacity = Math.max(0, 0.35 - ((t * 0.25) % 0.35))
    }
    if (steamRef2.current) {
      steamRef2.current.position.y = 0.28 + (((t + 0.5) * 0.22) % 0.35)
      steamRef2.current.scale.setScalar(0.7 + (((t + 0.5) * 0.22) % 0.35) * 1.8)
      steamRef2.current.material.opacity = Math.max(0, 0.35 - (((t + 0.5) * 0.22) % 0.35))
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Steam puff 1 */}
      <mesh ref={steamRef1} position={[-0.05, 0.28, 0.12]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Steam puff 2 */}
      <mesh ref={steamRef2} position={[0.05, 0.28, 0.12]}>
        <sphereGeometry args={[0.032, 12, 12]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

export default function CoffeeCorner({
  position = [-3.18, 0.54, 3.82],
  rotation = [0, 0.2, 0],
  isColorful = true
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [brewCount, setBrewCount] = useState(42)
  const [isBrewing, setIsBrewing] = useState(false)

  const handleBrew = (e) => {
    e.stopPropagation()
    setIsBrewing(true)
    setBrewCount((prev) => prev + 1)
    setTimeout(() => setIsBrewing(false), 2500)
  }

  // Color schemes
  const bodyColor = isColorful ? '#1e293b' : '#334155'
  const accentColor = isColorful ? '#b45309' : '#64748b' // Warm bronze/copper or slate
  const cupColors = isColorful ? ['#f59e0b', '#38bdf8', '#ef4444', '#10b981'] : ['#e2e8f0', '#cbd5e1', '#94a3b8']

  return (
    <group
      position={position}
      rotation={rotation}
      onPointerOver={(e) => {
        e.stopPropagation()
        setIsHovered(true)
      }}
      onPointerOut={() => setIsHovered(false)}
      onClick={handleBrew}
      cursor="pointer"
    >
      {/* Ambient warm glow under/around coffee machine */}
      <pointLight position={[0, 0.35, 0.15]} color="#ffeedd" intensity={0.8} distance={1.8} />

      {/* === MAIN ESPRESSO MACHINE HOUSING === */}
      {/* Main Chassis Box */}
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.38, 0.44, 0.32]} />
        <meshStandardMaterial
          color={bodyColor}
          metalness={0.75}
          roughness={0.25}
        />
      </mesh>

      {/* Chrome Front Faceplate */}
      <mesh position={[0, 0.24, 0.162]} castShadow>
        <boxGeometry args={[0.34, 0.32, 0.01]} />
        <meshStandardMaterial
          color="#f8fafc"
          metalness={0.92}
          roughness={0.12}
        />
      </mesh>

      {/* Warm Copper / Wood Top & Side Trim Accents */}
      <mesh position={[0, 0.445, 0]}>
        <boxGeometry args={[0.385, 0.015, 0.325]} />
        <meshStandardMaterial
          color={accentColor}
          metalness={0.65}
          roughness={0.3}
        />
      </mesh>

      {/* Top Cup Warming Rail */}
      <mesh position={[0, 0.47, -0.1]}>
        <boxGeometry args={[0.35, 0.04, 0.01]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.47, 0.1]}>
        <boxGeometry args={[0.35, 0.04, 0.01]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Stacked Espresso Cups on Top Rail */}
      <group position={[-0.1, 0.46, 0]}>
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.032, 0.024, 0.045, 16]} />
          <meshStandardMaterial color={cupColors[0]} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.065, 0]}>
          <cylinderGeometry args={[0.032, 0.024, 0.045, 16]} />
          <meshStandardMaterial color={cupColors[1 % cupColors.length]} roughness={0.2} />
        </mesh>
      </group>

      <group position={[0.1, 0.46, 0]}>
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.032, 0.024, 0.045, 16]} />
          <meshStandardMaterial color={cupColors[2 % cupColors.length]} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.065, 0]}>
          <cylinderGeometry args={[0.032, 0.024, 0.045, 16]} />
          <meshStandardMaterial color={cupColors[3 % cupColors.length]} roughness={0.2} />
        </mesh>
      </group>

      {/* Transparent Dual Coffee Bean Hoppers */}
      <mesh position={[-0.08, 0.52, -0.05]}>
        <cylinderGeometry args={[0.045, 0.035, 0.09, 16]} />
        <meshStandardMaterial
          color="#38220f"
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[0.08, 0.52, -0.05]}>
        <cylinderGeometry args={[0.045, 0.035, 0.09, 16]} />
        <meshStandardMaterial
          color="#38220f"
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Pressure Gauges (Glowing Round Dials) */}
      <mesh position={[-0.08, 0.32, 0.168]}>
        <circleGeometry args={[0.026, 16]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
      <mesh position={[0.08, 0.32, 0.168]}>
        <circleGeometry args={[0.026, 16]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>

      {/* Dual Group Heads & Chrome Portafilters */}
      {/* Portafilter 1 */}
      <group position={[-0.065, 0.22, 0.165]}>
        <mesh>
          <cylinderGeometry args={[0.032, 0.032, 0.025, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Handle */}
        <mesh position={[0, -0.015, 0.08]} rotation={[0.2, 0, 0]}>
          <cylinderGeometry args={[0.01, 0.012, 0.12, 12]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>
      </group>

      {/* Portafilter 2 */}
      <group position={[0.065, 0.22, 0.165]}>
        <mesh>
          <cylinderGeometry args={[0.032, 0.032, 0.025, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Handle */}
        <mesh position={[0, -0.015, 0.08]} rotation={[0.2, 0, 0]}>
          <cylinderGeometry args={[0.01, 0.012, 0.12, 12]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>
      </group>

      {/* Stainless Drip Tray Base */}
      <mesh position={[0, 0.04, 0.19]} castShadow receiveShadow>
        <boxGeometry args={[0.34, 0.08, 0.18]} />
        <meshStandardMaterial
          color="#94a3b8"
          metalness={0.85}
          roughness={0.2}
        />
      </mesh>
      {/* Slotted Grille on Drip Tray */}
      <mesh position={[0, 0.081, 0.19]}>
        <boxGeometry args={[0.31, 0.005, 0.15]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Two Espresso Cups on Drip Tray under spouts */}
      <mesh position={[-0.065, 0.115, 0.17]}>
        <cylinderGeometry args={[0.032, 0.022, 0.05, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.15} />
      </mesh>
      <mesh position={[0.065, 0.115, 0.17]}>
        <cylinderGeometry args={[0.032, 0.022, 0.05, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.15} />
      </mesh>

      {/* Rising Steam Effect */}
      <SteamParticles />

      {/* Coffee Syrup Bottles next to the machine */}
      <group position={[0.27, 0.12, 0.04]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.028, 0.028, 0.22, 16]} />
          <meshStandardMaterial color="#d97706" transparent opacity={0.85} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.13, 0]}>
          <cylinderGeometry args={[0.008, 0.01, 0.05, 12]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.8} />
        </mesh>
      </group>

      <group position={[0.27, 0.12, 0.12]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.028, 0.028, 0.22, 16]} />
          <meshStandardMaterial color="#b45309" transparent opacity={0.85} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.13, 0]}>
          <cylinderGeometry args={[0.008, 0.01, 0.05, 12]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.8} />
        </mesh>
      </group>

      {/* Floating 3D Badge on Hover / Click */}
      {(isHovered || isBrewing) && (
        <Html position={[0, 0.68, 0.15]} center distanceFactor={14} zIndexRange={[10, 20]}>
          <div className="bg-slate-900/95 backdrop-blur-md text-white px-3 py-2 rounded-2xl shadow-xl border border-amber-500/40 text-center whitespace-nowrap pointer-events-none select-none animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-1.5 justify-center">
              <span className="text-sm">☕</span>
              <span className="text-xs font-black tracking-tight text-amber-300">
                {isBrewing ? 'Sedang Menyeduh Espresso...' : 'AI Coffee Bar & Espresso'}
              </span>
            </div>
            <p className="text-[10px] text-slate-300 font-medium mt-0.5">
              {isBrewing
                ? 'Harum kopi segar tercium di seluruh kantor!'
                : `Total ${brewCount} cangkir disajikan • Klik untuk seduh`}
            </p>
          </div>
        </Html>
      )}
    </group>
  )
}
