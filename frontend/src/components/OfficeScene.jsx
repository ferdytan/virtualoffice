import React, { useRef, useEffect, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import AgentAvatar from './AgentAvatar'
import ScreenDisplays from './ScreenDisplays'
import CoffeeCorner from './CoffeeCorner'
import OfficeNPC from './OfficeNPC'
import DeskAccessories from './DeskAccessories'

/**
 * Procedurally generates realistic tile and plank textures for the office floor:
 * - 'parquet': Warm Scandinavian oak wood parquet planks with natural grain
 * - 'granite': Polished charcoal/slate granite stone tiles with mineral flecks
 * - 'white': Clean studio white tile grid with crisp grout lines
 */
function createFloorTexture(type = 'parquet') {
  if (typeof document === 'undefined') return null
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  if (type === 'granite') {
    // Elegant Polished Charcoal / Slate Granite Tiles
    ctx.fillStyle = '#2d3748'
    ctx.fillRect(0, 0, 512, 512)

    const tileSize = 128
    const tileColors = ['#283142', '#334155', '#242e3d', '#3a4a61']

    for (let y = 0; y < 512; y += tileSize) {
      for (let x = 0; x < 512; x += tileSize) {
        const cIdx = Math.floor((x / tileSize + y / tileSize) % tileColors.length)
        ctx.fillStyle = tileColors[cIdx]
        ctx.fillRect(x, y, tileSize, tileSize)

        // Granite speckles / mineral flecks
        for (let s = 0; s < 50; s++) {
          const sx = x + Math.random() * tileSize
          const sy = y + Math.random() * tileSize
          ctx.fillStyle = Math.random() > 0.4 ? 'rgba(255,255,255,0.22)' : 'rgba(15,23,42,0.45)'
          ctx.beginPath()
          ctx.arc(sx, sy, Math.random() * 2 + 0.5, 0, Math.PI * 2)
          ctx.fill()
        }

        // Grout line
        ctx.strokeStyle = '#1a202c'
        ctx.lineWidth = 2
        ctx.strokeRect(x, y, tileSize, tileSize)
      }
    }
  } else if (type === 'white') {
    // Studio White Tile Grid
    ctx.fillStyle = '#f8fafc'
    ctx.fillRect(0, 0, 512, 512)

    const tileSize = 128
    for (let y = 0; y < 512; y += tileSize) {
      for (let x = 0; x < 512; x += tileSize) {
        ctx.fillStyle = ((x / tileSize) + (y / tileSize)) % 2 === 0 ? '#f8fafc' : '#f1f5f9'
        ctx.fillRect(x, y, tileSize, tileSize)

        ctx.strokeStyle = '#e2e8f0'
        ctx.lineWidth = 1.5
        ctx.strokeRect(x, y, tileSize, tileSize)
      }
    }
  } else {
    // 'parquet' - Warm Scandinavian Oak Wood Parquet Planks
    ctx.fillStyle = '#b88c56'
    ctx.fillRect(0, 0, 512, 512)

    const plankHeight = 32
    const plankWidth = 128
    const woodColors = [
      '#bf935d', '#b5864e', '#c49963', '#ad7e46', '#c99f69', '#ba8c53'
    ]

    for (let y = 0; y < 512; y += plankHeight) {
      const rowOffset = (y / plankHeight) % 2 === 0 ? 0 : plankWidth / 2
      for (let x = -plankWidth; x < 512 + plankWidth; x += plankWidth) {
        const posX = x + rowOffset
        const seed = Math.abs(Math.sin(posX * 12.9898 + y * 78.233))
        const colorIdx = Math.floor(seed * woodColors.length) % woodColors.length
        ctx.fillStyle = woodColors[colorIdx]
        ctx.fillRect(posX, y, plankWidth, plankHeight)

        // Wood grain streaks
        ctx.fillStyle = 'rgba(70, 40, 15, 0.08)'
        for (let g = 0; g < 4; g++) {
          const gy = y + 4 + g * 7
          ctx.fillRect(posX + 2, gy, plankWidth - 4, 1.5)
        }

        // Dark plank seams
        ctx.strokeStyle = '#6d4822'
        ctx.lineWidth = 1.2
        ctx.strokeRect(posX, y, plankWidth, plankHeight)
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(type === 'parquet' ? 8 : 6, type === 'parquet' ? 8 : 6)
  texture.needsUpdate = true
  return texture
}

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
function DelegationOffice({ scenerySettings }) {
  const { scene } = useGLTF('/models/office.glb', '/draco/')
  const theme = scenerySettings?.theme || 'colorful'
  const floorType = scenerySettings?.floorType || 'parquet'
  const isColorful = theme === 'colorful'

  const floorTex = useMemo(() => createFloorTexture(floorType), [floorType])

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

        // --- 1. FLOOR TEXTURE (PARQUET / GRANITE / WHITE) ---
        if (name.includes('floor') || parentName.includes('floor') || name === 'plane.001') {
          if (floorTex) {
            child.material = new THREE.MeshStandardMaterial({
              map: floorTex,
              roughness: floorType === 'granite' ? 0.2 : floorType === 'parquet' ? 0.38 : 0.45,
              metalness: floorType === 'granite' ? 0.08 : 0.02
            })
          }
          return
        }

        if (isColorful) {
          // --- 2. WORK CHAIRS: SLEEK DARK GRAPHITE / CHARCOAL (ABU2 / HITAM) ---
          if (
            name.includes('work-chair') ||
            parentName.includes('work-chair') ||
            name === 'cube.010' ||
            name === 'cube.014' ||
            name === 'cube.019' ||
            name === 'cube.022' ||
            name === 'cube.003'
          ) {
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#252b33'), // Dark charcoal/graphite ergonomic office chair
              roughness: 0.45,
              metalness: 0.08
            })
          }
          // --- 3. COFFEE TABLE CHAIRS: WARM RICH COGNAC / SADDLE BROWN (COKLAT) ---
          else if (
            name === 'static-chair' ||
            name === 'static-chair.001' ||
            parentName === 'static-chair' ||
            parentName === 'static-chair.001' ||
            name === 'circle.001' ||
            name === 'circle.003'
          ) {
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#783818'), // Warm rich saddle brown / cognac
              roughness: 0.52,
              metalness: 0.05
            })
          }
          // --- 4. WORK DESKS: WARM SCANDINAVIAN OAK TOP ---
          else if (
            name.includes('work-desk') ||
            parentName.includes('work-desk') ||
            name === 'cube.008' ||
            name === 'cube.012' ||
            name === 'cube.017' ||
            name === 'cube.020'
          ) {
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#d4bf9c'), // Warm Scandinavian oak
              roughness: 0.36,
              metalness: 0.04
            })
          }
          // --- 5. COFFEE TABLE: WARM HONEY WALNUT ---
          else if (
            name.includes('cafe-table') ||
            parentName.includes('cafe-table') ||
            name === 'cube.001'
          ) {
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#9e6b42'), // Warm honey walnut
              roughness: 0.38,
              metalness: 0.05
            })
          }
          // --- 6. STORAGE CABINET CREDENZA: MODERN DEEP SLATE GRAY ---
          else if (
            name.includes('cabinet') ||
            parentName.includes('cabinet') ||
            name === 'cube.002'
          ) {
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#475569'), // Slate gray credenza
              roughness: 0.42,
              metalness: 0.1
            })
          }
          // --- 7. BARISTA COUNTER: WARM MAHOGANY BAR ---
          else if (
            name.includes('counter') ||
            parentName.includes('counter') ||
            name === 'cube'
          ) {
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#6b4226'), // Rich mahogany barista counter
              roughness: 0.36,
              metalness: 0.06
            })
          }
          // --- 8. LOUNGE SOFA: WARM AMBER / TERRACOTTA ---
          else if (
            name.includes('sofa') ||
            parentName.includes('sofa') ||
            name === 'cube.006'
          ) {
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#b45309'),
              roughness: 0.65
            })
          }
          // --- 9. DESK LAMPS: ARCHITECTURAL MATTE DARK SLATE ---
          else if (
            name.includes('flexo') ||
            parentName.includes('flexo') ||
            name === 'cube.009' ||
            name === 'cube.013' ||
            name === 'cube.018' ||
            name === 'cube.021'
          ) {
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#334155'), // Architectural matte dark slate
              roughness: 0.32,
              metalness: 0.25
            })
          }
          // --- 10. PLANTS: FRESH VIBRANT MONSTERA GREEN ---
          else if (
            name.includes('plant') ||
            parentName.includes('plant') ||
            name === 'circle.002' ||
            name === 'circle.004'
          ) {
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#15803d'),
              roughness: 0.3
            })
          }
          // --- 11. PRESENTATION / KANBAN BOARD ---
          else if (name.includes('board') || parentName.includes('board') || name === 'cube.005') {
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#0284c7'),
              roughness: 0.4
            })
          }
          // --- 12. BORDER GLOW LINE ---
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
  }, [scene, isColorful, floorTex, floorType])

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
    floorType: 'parquet',
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

        <Suspense fallback={null}>
          {/* Authentic Office Environment with dynamic floor & furniture styling */}
          <DelegationOffice scenerySettings={scenerySettings} />

          {/* Decorative Colorful Books, Notebooks, Mugs & Sticky Notes on Desks */}
          <DeskAccessories isColorful={isColorful} />

          {/* 4 Active Glowing & Colorful Browser Displays mounted on workstation monitors */}
          <ScreenDisplays agents={agents} onSelectAgent={onSelectAgent} />

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
