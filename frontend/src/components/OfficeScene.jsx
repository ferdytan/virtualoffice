import React, { useRef, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import AgentAvatar from './AgentAvatar'
import ScreenDisplays from './ScreenDisplays'

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
 * Helper to reliably find a node or mesh in the Three.js scene,
 * handling Three.js PropertyBinding name sanitization (e.g. dots stripped).
 */
function findSceneNode(scene, ...candidateNames) {
  for (const name of candidateNames) {
    let obj = scene.getObjectByName(name)
    if (obj) return obj
    const sanitized = name.replace(/\./g, '')
    obj = scene.getObjectByName(sanitized)
    if (obj) return obj
  }

  let match = null
  scene.traverse((child) => {
    if (match) return
    const cName = (child.name || '').toLowerCase()
    const uName = (child.userData?.name || '').toLowerCase()
    for (const name of candidateNames) {
      const target = name.toLowerCase()
      const cleanTarget = name.replace(/[\._\-]/g, '').toLowerCase()
      if (
        cName === target ||
        uName === target ||
        cName.replace(/[\._\-]/g, '') === cleanTarget ||
        uName.replace(/[\._\-]/g, '') === cleanTarget
      ) {
        match = child
        return
      }
    }
  })
  return match
}

/**
 * Helper to update position, rotation, and force matrix recalculations.
 */
function repositionNode(node, x, y, z, rx = 0, ry = 0, rz = 0) {
  if (!node) return false
  node.position.set(x, y, z)
  node.rotation.set(rx, ry, rz)
  node.updateMatrix()
  node.updateMatrixWorld(true)
  return true
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

    // --- ALIGN WORKSTATION 3 & 4 TO FACE-TO-FACE WITH WORKSTATION 1 & 2 ---
    // Desk 1 (Velocia): [1.40, 0, -3.16], Desk 2 (Scout): [3.17, 0, -3.16]
    // Desk 3 (Nara) & Desk 4 (Team) are placed flush back-to-back at Z = -2.42, facing Z = 0 (South)

    // Desk 3 & accessories (opposite Desk 1 / Velocia)
    const desk3 = findSceneNode(scene, 'static-work-desk.003', 'static-work-desk003', 'Cube.017')
    repositionNode(desk3, 1.40, 0, -2.42, 0, 0, 0)

    const chair3 = findSceneNode(scene, 'static-work-chair.003', 'static-work-chair003', 'Cube.019')
    repositionNode(chair3, 1.22, 0, -1.89, 0, 0, 0)

    const pc3 = findSceneNode(scene, 'static-pc', 'Cube.016')
    repositionNode(pc3, 1.21, 0.504, -2.37, 0, 0, 0)

    const flexo3 = findSceneNode(scene, 'static-flexo', 'Cube.018')
    repositionNode(flexo3, 1.91, 0.504, -2.51, 0, 0, 0)

    // Desk 4 & accessories (opposite Desk 2 / Scout)
    const desk4 = findSceneNode(scene, 'static-work-desk.004', 'static-work-desk004', 'Cube.020')
    repositionNode(desk4, 3.17, 0, -2.42, 0, 0, 0)

    const chair4 = findSceneNode(scene, 'static-work-chair.004', 'static-work-chair004', 'Cube.022')
    repositionNode(chair4, 2.99, 0, -1.89, 0, 0, 0)

    const pc4 = findSceneNode(scene, 'static-pc.003', 'static-pc003', 'Cube.015')
    repositionNode(pc4, 2.98, 0.504, -2.37, 0, 0, 0)

    const flexo4 = findSceneNode(scene, 'static-flexo.003', 'static-flexo003', 'Cube.021')
    repositionNode(flexo4, 3.68, 0.504, -2.51, 0, 0, 0)
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

        {/* Warm Desk Lamp Ambient Accents over the 4-desk pod */}
        <pointLight position={[1.91, 1.15, -2.51]} color="#ffeedd" intensity={0.6} distance={2.5} />
        <pointLight position={[3.68, 1.15, -2.51]} color="#ffeedd" intensity={0.6} distance={2.5} />
        <pointLight position={[0.89, 1.15, -3.07]} color="#ffeedd" intensity={0.6} distance={2.5} />
        <pointLight position={[2.66, 1.15, -3.07]} color="#ffeedd" intensity={0.6} distance={2.5} />

        <Suspense fallback={null}>
          {/* Authentic Office Environment with neat 2x2 face-to-face pod */}
          <DelegationOffice />

          {/* 4 Active Glowing & Colorful Browser Displays mounted on workstation monitors */}
          <ScreenDisplays agents={agents} onSelectAgent={onSelectAgent} />

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
