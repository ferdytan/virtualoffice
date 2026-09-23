import React, { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Grid, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import AgentAvatar from './AgentAvatar'

/**
 * Camera controller that smoothly transitions focus when an agent is selected.
 */
function CameraRig({ selectedAgent }) {
  const controlsRef = useRef()

  useFrame(() => {
    if (!controlsRef.current) return
    if (selectedAgent && selectedAgent.podPosition) {
      const [px, , pz] = selectedAgent.podPosition
      controlsRef.current.target.lerp(new THREE.Vector3(px, 0.85, pz), 0.06)
    } else {
      controlsRef.current.target.lerp(new THREE.Vector3(0, 0.7, 0.1), 0.05)
    }
    controlsRef.current.update()
  })

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.06}
      minDistance={4}
      maxDistance={24}
      maxPolarAngle={Math.PI / 2.15}
      minPolarAngle={Math.PI / 6}
    />
  )
}

/**
 * Modular Executive Workstation Pod
 * Combines desk, monitor with glowing UI, ergonomic chair, and character
 * with harmonious spacing and zero overlapping.
 */
function WorkstationPod({
  position,
  rotation = [0, 0, 0],
  agent,
  isSelected,
  onSelectAgent
}) {
  const agentColor = agent.color || '#38bdf8'
  const agentId = agent.id?.toLowerCase()

  return (
    <group position={position} rotation={rotation}>
      {/* --- Executive Matte White Desk --- */}
      <mesh position={[0, 0.72, 0.12]} castShadow receiveShadow>
        <boxGeometry args={[2.3, 0.05, 1.15]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.8} metalness={0.05} />
      </mesh>

      {/* Desk Metallic Slim Legs */}
      <mesh position={[-1.05, 0.36, -0.38]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.72, 16]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.7} />
      </mesh>
      <mesh position={[1.05, 0.36, -0.38]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.72, 16]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.7} />
      </mesh>
      <mesh position={[-1.05, 0.36, 0.62]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.72, 16]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.7} />
      </mesh>
      <mesh position={[1.05, 0.36, 0.62]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.72, 16]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.7} />
      </mesh>

      {/* Desk Mat Blotter with Agent Color Accent */}
      <mesh position={[0, 0.748, 0.05]}>
        <boxGeometry args={[1.3, 0.005, 0.65]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.749, -0.27]}>
        <boxGeometry args={[1.3, 0.004, 0.02]} />
        <meshBasicMaterial color={agentColor} />
      </mesh>

      {/* Keyboard & Mouse */}
      <mesh position={[0, 0.755, -0.05]}>
        <boxGeometry args={[0.48, 0.012, 0.16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.8} />
      </mesh>
      <mesh position={[0.35, 0.755, -0.05]}>
        <boxGeometry args={[0.08, 0.015, 0.12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.8} />
      </mesh>

      {/* --- Monitors & Displays --- */}
      {agentId === 'nara' ? (
        /* Nara: Dual Telemetry Screens */
        <group position={[0, 1.05, 0.42]}>
          {/* Main Landscape Monitor */}
          <group position={[-0.45, 0, 0]} rotation={[0, 0.12, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.95, 0.52, 0.03]} />
              <meshStandardMaterial color="#0f172a" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0, -0.016]}>
              <boxGeometry args={[0.9, 0.48, 0.005]} />
              <meshStandardMaterial
                color="#0284c7"
                emissive="#0284c7"
                emissiveIntensity={0.35}
                roughness={0.3}
              />
            </mesh>
          </group>

          {/* Secondary Portrait Monitor */}
          <group position={[0.45, 0.05, 0]} rotation={[0, -0.2, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.45, 0.62, 0.03]} />
              <meshStandardMaterial color="#0f172a" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0, -0.016]}>
              <boxGeometry args={[0.41, 0.58, 0.005]} />
              <meshStandardMaterial
                color="#38bdf8"
                emissive="#38bdf8"
                emissiveIntensity={0.3}
                roughness={0.3}
              />
            </mesh>
          </group>

          {/* Stand */}
          <mesh position={[0, -0.2, 0.05]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.25, 16]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.6} />
          </mesh>
        </group>
      ) : agentId === 'velocia' ? (
        /* Velocia: Ultrawide Strategic Command Screen */
        <group position={[0, 1.05, 0.42]}>
          <mesh castShadow>
            <boxGeometry args={[1.4, 0.5, 0.03]} />
            <meshStandardMaterial color="#0f172a" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0, -0.016]}>
            <boxGeometry args={[1.35, 0.46, 0.005]} />
            <meshStandardMaterial
              color="#dc2626"
              emissive="#ef4444"
              emissiveIntensity={0.35}
              roughness={0.3}
            />
          </mesh>
          {/* Stand */}
          <mesh position={[0, -0.2, 0.05]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.25, 16]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.6} />
          </mesh>
        </group>
      ) : (
        /* Scout: Curved Research Screen & Digital Tablet */
        <group position={[0, 1.05, 0.42]}>
          <mesh castShadow>
            <boxGeometry args={[1.15, 0.52, 0.03]} />
            <meshStandardMaterial color="#0f172a" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0, -0.016]}>
            <boxGeometry args={[1.1, 0.48, 0.005]} />
            <meshStandardMaterial
              color="#16a34a"
              emissive="#22c55e"
              emissiveIntensity={0.35}
              roughness={0.3}
            />
          </mesh>
          {/* Stand */}
          <mesh position={[0, -0.2, 0.05]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.25, 16]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.6} />
          </mesh>
          {/* Digital Tablet on Desk */}
          <mesh position={[0.55, -0.29, -0.32]} rotation={[-0.1, -0.2, 0]}>
            <boxGeometry args={[0.22, 0.01, 0.3]} />
            <meshStandardMaterial color="#22c55e" emissive="#15803d" emissiveIntensity={0.2} />
          </mesh>
        </group>
      )}

      {/* Desk Succulent Plant */}
      <group position={[-0.85, 0.74, 0.35]}>
        <mesh position={[0, 0.06, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.05, 0.12, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.15, 0]} castShadow>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#22c55e" roughness={0.5} />
        </mesh>
      </group>

      {/* Modern Desk Lamp */}
      <group position={[0.85, 0.74, 0.35]}>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.03, 16]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.32, 12]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.34, -0.06]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.09, 0.1, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.5} />
        </mesh>
      </group>

      {/* --- Ergonomic Office Chair --- */}
      <group position={[0, 0, -0.55]}>
        {/* Seat Cushion */}
        <mesh position={[0, 0.46, 0]} castShadow>
          <boxGeometry args={[0.55, 0.08, 0.55]} />
          <meshStandardMaterial color="#ffffff" roughness={0.7} />
        </mesh>
        {/* Backrest */}
        <mesh position={[0, 0.82, -0.24]} rotation={[0.08, 0, 0]} castShadow>
          <boxGeometry args={[0.5, 0.6, 0.06]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.7} />
        </mesh>
        {/* Central Stem */}
        <mesh position={[0, 0.23, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.42, 16]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.5} />
        </mesh>
        {/* 5-Spoke Wheel Base */}
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.04, 16]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.5} />
        </mesh>

        {/* --- 3D Rigged Agent Character Sitting on Chair --- */}
        <AgentAvatar
          agent={agent}
          isSelected={isSelected}
          onSelect={onSelectAgent}
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          initialAnimation="Sit_Work"
        />
      </group>
    </group>
  )
}

/**
 * Architectural Office Backdrop (Whiteboard, Refreshment area, Planters)
 */
function OfficeDecor() {
  return (
    <group>
      {/* Minimalist Presentation Glass Whiteboard */}
      <group position={[0, 1.8, -4.5]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4.6, 2.3, 0.06]} />
          <meshStandardMaterial color="#ffffff" roughness={0.15} metalness={0.05} />
        </mesh>
        <mesh position={[0, 0, -0.02]}>
          <boxGeometry args={[4.7, 2.4, 0.02]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
        </mesh>
        {/* Diagram Cards on Whiteboard */}
        <mesh position={[-1.2, 0.35, 0.04]}>
          <planeGeometry args={[1.3, 0.8]} />
          <meshBasicMaterial color="#e0f2fe" />
        </mesh>
        <mesh position={[0.9, 0.15, 0.04]}>
          <planeGeometry args={[1.8, 1.0]} />
          <meshBasicMaterial color="#f0fdf4" />
        </mesh>
      </group>

      {/* Back-Left Refreshment & Coffee Counter */}
      <group position={[-5.2, 0.5, -3.2]} rotation={[0, Math.PI / 2, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.8, 1.0, 0.8]} />
          <meshStandardMaterial color="#ffffff" roughness={0.8} />
        </mesh>
        {/* Espresso Machine */}
        <mesh position={[0.4, 0.65, 0]} castShadow>
          <boxGeometry args={[0.4, 0.35, 0.35]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>
      </group>

      {/* Back-Right Low Credenza & Archives */}
      <group position={[5.2, 0.45, -3.2]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.8, 0.9, 0.7]} />
          <meshStandardMaterial color="#ffffff" roughness={0.8} />
        </mesh>
      </group>

      {/* Large Floor Plants */}
      <group position={[-5.0, 0, 1.8]}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.18, 0.6, 24]} />
          <meshStandardMaterial color="#ffffff" roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.85, 0]} castShadow>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshStandardMaterial color="#22c55e" roughness={0.6} />
        </mesh>
        <mesh position={[0.1, 1.1, 0.05]} castShadow>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color="#16a34a" roughness={0.6} />
        </mesh>
      </group>

      <group position={[5.0, 0, 1.8]}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.18, 0.6, 24]} />
          <meshStandardMaterial color="#ffffff" roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.85, 0]} castShadow>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshStandardMaterial color="#22c55e" roughness={0.6} />
        </mesh>
        <mesh position={[-0.08, 1.1, -0.05]} castShadow>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color="#16a34a" roughness={0.6} />
        </mesh>
      </group>
    </group>
  )
}

/**
 * Main OfficeScene Component
 */
export default function OfficeScene({
  agents = [],
  selectedAgent,
  onSelectAgent
}) {
  // Pod layout mapping: spacious, distinct executive positions
  const pods = [
    {
      id: 'nara',
      position: [-3.8, 0, -0.5],
      rotation: [0, 0.35, 0] // angled 20° towards room center
    },
    {
      id: 'velocia',
      position: [0.0, 0, 1.0],
      rotation: [0, 0, 0] // executive command center forward
    },
    {
      id: 'scout',
      position: [3.8, 0, -0.5],
      rotation: [0, -0.35, 0] // angled -20° towards room center
    }
  ]

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        shadows
        camera={{ position: [8, 9, 13], fov: 38 }}
        gl={{ antialias: true, alpha: false }}
      >
        {/* Soft Warm Off-White Ambient Canvas Background */}
        <color attach="background" args={['#eef2f6']} />

        {/* Ambient & Soft Directional Lighting */}
        <ambientLight intensity={1.2} />
        <hemisphereLight skyColor="#ffffff" groundColor="#cbd5e1" intensity={0.6} />

        <directionalLight
          position={[10, 18, 10]}
          intensity={1.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.1}
          shadow-camera-far={45}
          shadow-camera-left={-9}
          shadow-camera-right={9}
          shadow-camera-top={9}
          shadow-camera-bottom={-9}
          shadow-bias={-0.0002}
        />

        <directionalLight position={[-8, 12, -6]} intensity={0.4} color="#93c5fd" />

        {/* --- Crisp Matte Floor with Isometric Grid --- */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.01, 0]}
          receiveShadow
          onClick={() => onSelectAgent(null)}
        >
          <planeGeometry args={[35, 35]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.85} metalness={0.02} />
        </mesh>

        <Grid
          position={[0, 0.001, 0]}
          args={[26, 26]}
          cellSize={1.0}
          cellThickness={0.5}
          cellColor="#e2e8f0"
          sectionSize={3.0}
          sectionThickness={1.0}
          sectionColor="#cbd5e1"
          fadeDistance={22}
          fadeStrength={1.2}
        />

        {/* Elevated Claymorphic Floor Slab */}
        <mesh position={[0, -0.22, 0]} receiveShadow>
          <boxGeometry args={[14.5, 0.42, 12]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.9} />
        </mesh>

        {/* Soft Ground Contact Shadow */}
        <ContactShadows
          position={[0, 0.005, 0]}
          opacity={0.35}
          scale={18}
          blur={1.8}
          far={4.5}
        />

        {/* Office Architecture & Decor */}
        <OfficeDecor />

        {/* --- The 3 Spacious Workstation Pods --- */}
        <Suspense fallback={null}>
          {pods.map((pod) => {
            const agent = agents.find((a) => a.id.toLowerCase() === pod.id)
            if (!agent) return null

            return (
              <WorkstationPod
                key={pod.id}
                position={pod.position}
                rotation={pod.rotation}
                agent={{ ...agent, podPosition: pod.position }}
                isSelected={selectedAgent?.id === agent.id}
                onSelectAgent={onSelectAgent}
              />
            )
          })}
        </Suspense>

        {/* Dynamic Camera Orbit & Focus Controller */}
        <CameraRig selectedAgent={selectedAgent} />
      </Canvas>
    </div>
  )
}
