import React, { useRef, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import AgentAvatar from './AgentAvatar'
import ScreenDisplays from './ScreenDisplays'
import LightBeams from './LightBeams'
import CoffeeCorner from './CoffeeCorner'
import OfficeNPC from './OfficeNPC'

/**
 * Camera controller that smoothly transitions focus when an agent is selected.
 */
function CameraRig({ selectedAgent }) {
  const controlsRef = useRef()
  // Default workspace center in the 4-desk pod
  const defaultTarget = React.useMemo(() => new THREE.Vector3(2.21, 0.6, -2.79), [])

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
 * Supports dynamic scenery theme: 'colorful' (warm wood, colored seats, cozy accents) vs 'minimalist' (pure white).
 */
function DelegationOffice({ theme = 'colorful' }) {
  const { scene } = useGLTF('/models/office.glb', '/draco/')
  const isColorful = theme === 'colorful'

  useEffect(() => {
    if (!scene) return

    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
        const name = (child.name || '').toLowerCase()
        const parentName = (child.parent?.name || '').toLowerCase()

        if (name.includes('navmesh') || parentName.includes('navmesh')) {
          child.visible = false
          return
        }

        if (isColorful) {
          // --- VIBRANT MODERN THEME (Aksen Kayu Hangat & Sentuhan Warna) ---
          // Work desks: Warm light oak wood top
          if (
            name.includes('work-desk') ||
            parentName.includes('work-desk') ||
            name === 'cube.008' ||
            name === 'cube.012' ||
            name === 'cube.017' ||
            name === 'cube.020'
          ) {
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#d4bf9c'), // Warm Scandinavian oak
              roughness: 0.38,
              metalness: 0.04
            })
          }
          // Work Chairs: Designer color fabric cushions
          else if (name.includes('chair.001') || parentName.includes('chair.001') || name === 'cube.010') {
            // Velocia's chair: Coral
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#f87171'),
              roughness: 0.55
            })
          } else if (name.includes('chair.002') || parentName.includes('chair.002') || name === 'cube.014') {
            // Scout's chair: Mint / Emerald
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#34d399'),
              roughness: 0.55
            })
          } else if (name.includes('chair.003') || parentName.includes('chair.003') || name === 'cube.019') {
            // Nara's chair: Sky Blue
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#60a5fa'),
              roughness: 0.55
            })
          } else if (name.includes('chair.004') || parentName.includes('chair.004') || name === 'cube.022') {
            // Team chair: Lavender
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#a78bfa'),
              roughness: 0.55
            })
          }
          // Lounge Sofa: Cozy warm amber / terracotta
          else if (name.includes('sofa') || parentName.includes('sofa') || name === 'cube.006') {
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#d97706'),
              roughness: 0.65
            })
          }
          // Counter & Cafe Table: Warm rich walnut
          else if (
            name.includes('counter') ||
            parentName.includes('counter') ||
            name.includes('cafe-table') ||
            parentName.includes('cafe-table')
          ) {
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#946b45'),
              roughness: 0.42,
              metalness: 0.05
            })
          }
          // Plants: Fresh vibrant leafy green
          else if (
            name.includes('plant') ||
            parentName.includes('plant') ||
            name === 'circle.002' ||
            name === 'circle.004'
          ) {
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#16a34a'),
              roughness: 0.3
            })
          }
          // Border glow line
          else if (name.startsWith('colored') || parentName.startsWith('colored')) {
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#0284c7'),
              roughness: 0.4
            })
          }
        } else {
          // --- MINIMALIST PURE WHITE THEME (Clean Scandinavian White) ---
          if (name.startsWith('colored') || parentName.startsWith('colored')) {
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#38bdf8'),
              roughness: 0.5
            })
          } else if (!name.includes('pc') && !name.includes('laptop')) {
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#f8fafc'),
              roughness: 0.45,
              metalness: 0.05
            })
          }
        }
      }
    })

    // --- ALIGN WORKSTATION 3 & 4 TO FACE-TO-FACE WITH WORKSTATION 1 & 2 ---
    // Desk 1 (Velocia): [1.40, 0, -3.16], Desk 2 (Scout): [3.17, 0, -3.16]
    // Desk 3 (Nara) & Desk 4 (Team) are placed flush back-to-back at Z = -2.42, facing Z = 0 (South)

    // Desk 3 & accessories (opposite Desk 1 / Velocia)
    const desk3 = findSceneNode(scene, 'static-work-desk.003', 'static-work-desk003', 'Cube.017')
    repositionNode(desk3, 1.258, 0, -2.42, 0, 0, 0)

    const chair3 = findSceneNode(scene, 'static-work-chair.003', 'static-work-chair003', 'Cube.019')
    repositionNode(chair3, 1.08, 0, -1.89, 0, 0, 0)

    const pc3 = findSceneNode(scene, 'static-pc', 'Cube.016')
    repositionNode(pc3, 1.07, 0.504, -2.37, 0, 0, 0)

    const flexo3 = findSceneNode(scene, 'static-flexo', 'Cube.018')
    repositionNode(flexo3, 1.77, 0.504, -2.51, 0, 0, 0)

    // Desk 4 & accessories (opposite Desk 2 / Scout)
    const desk4 = findSceneNode(scene, 'static-work-desk.004', 'static-work-desk004', 'Cube.020')
    repositionNode(desk4, 3.029, 0, -2.42, 0, 0, 0)

    const chair4 = findSceneNode(scene, 'static-work-chair.004', 'static-work-chair004', 'Cube.022')
    repositionNode(chair4, 2.85, 0, -1.89, 0, 0, 0)

    const pc4 = findSceneNode(scene, 'static-pc.003', 'static-pc003', 'Cube.015')
    repositionNode(pc4, 2.84, 0.504, -2.37, 0, 0, 0)

    const flexo4 = findSceneNode(scene, 'static-flexo.003', 'static-flexo003', 'Cube.021')
    repositionNode(flexo4, 3.54, 0.504, -2.51, 0, 0, 0)
  }, [scene, isColorful])

  return <primitive object={scene} />
}

useGLTF.preload('/models/office.glb', '/draco/')

/**
 * Main OfficeScene Component
 */
export default function OfficeScene({
  agents = [],
  selectedAgent,
  onSelectAgent,
  hideTooltip = false,
  scenerySettings = {
    theme: 'colorful',
    showLightBeams: true,
    showNPC: true,
    showCoffeeCorner: true
  }
}) {
  const isColorful = scenerySettings?.theme === 'colorful'

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        shadows
        camera={{ position: [9, 8.5, 13], fov: 40 }}
        gl={{ antialias: true, alpha: false }}
      >
        {/* Canvas Background: Warm tint in colorful mode, clean slate in minimalist */}
        <color attach="background" args={[isColorful ? '#f1f5f9' : '#eef2f6']} />

        {/* Ambient & Directional Lighting Setup */}
        <ambientLight intensity={Math.PI * (isColorful ? 0.95 : 0.9)} />
        <hemisphereLight
          skyColor="#ffffff"
          groundColor={isColorful ? '#e2e8f0' : '#cbd5e1'}
          intensity={0.55}
        />

        <directionalLight
          position={[10, 20, 10]}
          intensity={Math.PI * 0.65}
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
        <pointLight position={[1.77, 1.15, -2.51]} color="#ffeedd" intensity={0.65} distance={2.5} />
        <pointLight position={[3.54, 1.15, -2.51]} color="#ffeedd" intensity={0.65} distance={2.5} />
        <pointLight position={[0.89, 1.15, -3.07]} color="#ffeedd" intensity={0.65} distance={2.5} />
        <pointLight position={[2.66, 1.15, -3.07]} color="#ffeedd" intensity={0.65} distance={2.5} />

        <Suspense fallback={null}>
          {/* Authentic Office Environment with dynamic theme styling */}
          <DelegationOffice theme={scenerySettings?.theme || 'colorful'} />

          {/* 4 Active Glowing & Colorful Browser Displays mounted on workstation monitors */}
          <ScreenDisplays agents={agents} onSelectAgent={onSelectAgent} />

          {/* Visible Lamp Beams & Desk Glows */}
          {scenerySettings?.showLightBeams && (
            <LightBeams isColorful={isColorful} />
          )}

          {/* Espresso Coffee Corner & Lounge Bar */}
          {scenerySettings?.showCoffeeCorner && (
            <CoffeeCorner isColorful={isColorful} />
          )}

          {/* Autonomous NPC Cleaning & Coffee Delivery Robot */}
          {scenerySettings?.showNPC && (
            <OfficeNPC isColorful={isColorful} />
          )}

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
              hideTooltip={hideTooltip}
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
