import React, { useRef, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import AgentAvatar from './AgentAvatar'

/**
 * Camera controller that smoothly transitions focus when an agent is selected.
 */
function CameraRig({ selectedAgent }) {
  const controlsRef = useRef()
  // Default workspace center in the 4-desk pod
  const defaultTarget = React.useMemo(() => new THREE.Vector3(2.28, 0.6, -2.79), [])

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

/**
 * Loads and renders the office environment from The Delegation (office.glb).
 * Symmetrically aligns the 4 workstation desks into a neat 2x2 face-to-face team pod:
 * - South Row (Desk 1 & 2): Velocia & Scout facing North (+Z)
 * - North Row (Desk 3 & 4): Nara & Team Desk facing South (-Z), perfectly face-to-face!
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

    // --- ALIGN DESK 3 & 4 TO FACE-TO-FACE WITH DESK 1 & 2 ---
    // Desk 1: [1.40, 0, -3.16], Desk 2: [3.17, 0, -3.16]
    // Desk 3 & 4 are placed back-to-back at Z = -2.42, facing Z = 0 (South)

    // Desk 3 (opposite Desk 1 / Velocia)
    const desk3 = scene.getObjectByName('static-work-desk.003')
    if (desk3) {
      desk3.position.set(1.40, 0, -2.42)
      desk3.rotation.set(0, 0, 0)
    }
    const chair3 = scene.getObjectByName('static-work-chair.003')
    if (chair3) {
      chair3.position.set(1.22, 0, -1.89)
      chair3.rotation.set(0, 0, 0)
    }
    const pc3 = scene.getObjectByName('static-pc')
    if (pc3) {
      pc3.position.set(1.21, 0.5, -2.37)
      pc3.rotation.set(0, 0, 0)
    }
    const flexo3 = scene.getObjectByName('static-flexo')
    if (flexo3) {
      flexo3.position.set(1.91, 0.5, -2.51)
      flexo3.rotation.set(0, 0, 0)
    }

    // Desk 4 (opposite Desk 2 / Scout)
    const desk4 = scene.getObjectByName('static-work-desk.004')
    if (desk4) {
      desk4.position.set(3.17, 0, -2.42)
      desk4.rotation.set(0, 0, 0)
    }
    const chair4 = scene.getObjectByName('static-work-chair.004')
    if (chair4) {
      chair4.position.set(2.99, 0, -1.89)
      chair4.rotation.set(0, 0, 0)
    }
    const pc4 = scene.getObjectByName('static-pc.003')
    if (pc4) {
      pc4.position.set(2.98, 0.5, -2.37)
      pc4.rotation.set(0, 0, 0)
    }
    const flexo4 = scene.getObjectByName('static-flexo.003')
    if (flexo4) {
      flexo4.position.set(3.68, 0.5, -2.51)
      flexo4.rotation.set(0, 0, 0)
    }
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
        camera={{ position: [9, 8.5, 13], fov: 40 }}
        gl={{ antialias: true, alpha: false }}
      >
        {/* Warm Canvas Background */}
        <color attach="background" args={['#eef2f6']} />

        {/* Ambient & Directional Lighting Setup (matching The Delegation Stage) */}
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

        {/* Subtle Accent Fill Light */}
        <directionalLight position={[-8, 12, -8]} intensity={0.35} color="#bae6fd" />

        <Suspense fallback={null}>
          {/* Authentic Office Environment with neat 2x2 face-to-face pod */}
          <DelegationOffice />

          {/* 3D Agent Avatars sitting at designated clean workstations */}
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

        {/* Soft Contact Shadow */}
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
