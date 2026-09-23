import React, { useRef, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import AgentAvatar from './AgentAvatar'

/**
 * Camera controller that smoothly transitions target when an agent is selected.
 */
function CameraRig({ selectedAgent }) {
  const controlsRef = useRef()
  // Default workspace center in The Delegation office
  const defaultTarget = useMemoVector(2.1, 0.6, -2.4)

  useFrame(() => {
    if (!controlsRef.current) return
    if (selectedAgent && selectedAgent.position) {
      const targetPos = new THREE.Vector3(
        selectedAgent.position[0],
        0.75,
        selectedAgent.position[2]
      )
      controlsRef.current.target.lerp(targetPos, 0.06)
    } else {
      controlsRef.current.target.lerp(defaultTarget, 0.05)
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
      maxDistance={25}
      maxPolarAngle={Math.PI / 2.15}
      minPolarAngle={Math.PI / 6}
    />
  )
}

function useMemoVector(x, y, z) {
  return React.useMemo(() => new THREE.Vector3(x, y, z), [x, y, z])
}

/**
 * Loads and renders the authentic office environment from The Delegation (office.glb).
 */
function DelegationOffice() {
  const { scene } = useGLTF('/models/office.glb', '/draco/')

  useEffect(() => {
    if (!scene) return
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
        const name = child.name.toLowerCase()
        if (name.includes('navmesh')) {
          child.visible = false
        }
        if (name.startsWith('colored')) {
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#38bdf8'),
            roughness: 0.5
          })
        }
      }
    })
  }, [scene])

  return <primitive object={scene} />
}

useGLTF.preload('/models/office.glb', '/draco/')

/**
 * Main OfficeScene Component
 */
export default function OfficeScene({
  agents = [],
  selectedAgent,
  onSelectAgent
}) {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        shadows
        camera={{ position: [9, 8.5, 12], fov: 42 }}
        gl={{ antialias: true, alpha: false }}
      >
        {/* Soft Warm Off-White Ambient Background */}
        <color attach="background" args={['#eef2f6']} />

        {/* Ambient & Directional Lighting Setup (matching The Delegation stage) */}
        <ambientLight intensity={Math.PI * 0.9} />
        <hemisphereLight skyColor="#ffffff" groundColor="#cbd5e1" intensity={0.5} />

        <directionalLight
          position={[10, 20, 10]}
          intensity={Math.PI * 0.6}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.1}
          shadow-camera-far={60}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
          shadow-bias={-0.0001}
          shadow-radius={2}
        />

        {/* Subtle Accent Light */}
        <directionalLight position={[-8, 12, -8]} intensity={0.35} color="#bae6fd" />

        <Suspense fallback={null}>
          {/* Authentic Office Environment */}
          <DelegationOffice />

          {/* 3D Agent Avatars sitting at designated workstations */}
          {agents.map((agent) => (
            <AgentAvatar
              key={agent.id}
              agent={agent}
              isSelected={selectedAgent?.id === agent.id}
              onSelect={onSelectAgent}
              position={agent.position || [0, 0, 0]}
              rotation={agent.rotation || [0, 0, 0]}
              initialAnimation="Sit_Work"
            />
          ))}
        </Suspense>

        {/* Ground click catcher to deselect */}
        <mesh
          position={[0, -0.05, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          onClick={() => onSelectAgent(null)}
          visible={false}
        >
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial />
        </mesh>

        {/* Contact Shadow for smooth ground integration */}
        <ContactShadows
          position={[0, 0.005, 0]}
          opacity={0.35}
          scale={22}
          blur={1.6}
          far={5}
        />

        {/* Dynamic Camera Orbit & Lerping Controls */}
        <CameraRig selectedAgent={selectedAgent} />
      </Canvas>
    </div>
  )
}
