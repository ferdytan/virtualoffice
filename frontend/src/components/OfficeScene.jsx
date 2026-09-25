import React, { useRef, useEffect, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, useTexture, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import AgentAvatar from './AgentAvatar'
import ScreenDisplays from './ScreenDisplays'
import CoffeeCorner from './CoffeeCorner'
import OfficeNPC from './OfficeNPC'
import DeskAccessories from './DeskAccessories'

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
 * Custom colorizer for the storage shelf rack (Cube.002 / static-cabinet).
 * Distinguishes the wooden shelf frame (coklat kayu) from the cardboard storage boxes (coklat karton)
 * with individual shade variations across different boxes using per-vertex colors.
 */
function colorizeCabinetMesh(mesh) {
  const geom = mesh.geometry
  if (!geom || !geom.attributes.position) return

  const pos = geom.attributes.position.array
  const numVerts = geom.attributes.position.count
  const indices = geom.index ? geom.index.array : null
  const numFaces = indices ? indices.length / 3 : Math.floor(numVerts / 3)

  // Disjoint Set / Union-Find on vertices to partition connected geometry parts
  const parent = new Int32Array(numVerts)
  for (let i = 0; i < numVerts; i++) parent[i] = i

  function find(i) {
    let root = i
    while (root !== parent[root]) root = parent[root]
    let curr = i
    while (curr !== root) {
      const nxt = parent[curr]
      parent[curr] = root
      curr = nxt
    }
    return root
  }

  function union(i, j) {
    const r1 = find(i)
    const r2 = find(j)
    if (r1 !== r2) parent[r1] = r2
  }

  // Union all vertices of each face
  for (let f = 0; f < numFaces; f++) {
    const a = indices ? indices[f * 3] : f * 3
    const b = indices ? indices[f * 3 + 1] : f * 3 + 1
    const c = indices ? indices[f * 3 + 2] : f * 3 + 2
    union(a, b)
    union(b, c)
  }

  // Aggregate components with bounding boxes
  const compMap = new Map()
  for (let v = 0; v < numVerts; v++) {
    const root = find(v)
    let comp = compMap.get(root)
    if (!comp) {
      comp = {
        root,
        verts: [],
        minX: Infinity, maxX: -Infinity,
        minY: Infinity, maxY: -Infinity,
        minZ: Infinity, maxZ: -Infinity
      }
      compMap.set(root, comp)
    }
    comp.verts.push(v)
    const x = pos[v * 3]
    const y = pos[v * 3 + 1]
    const z = pos[v * 3 + 2]
    if (x < comp.minX) comp.minX = x; if (x > comp.maxX) comp.maxX = x
    if (y < comp.minY) comp.minY = y; if (y > comp.maxY) comp.maxY = y
    if (z < comp.minZ) comp.minZ = z; if (z > comp.maxZ) comp.maxZ = z
  }

  const components = Array.from(compMap.values()).map(comp => {
    comp.sizeX = comp.maxX - comp.minX
    comp.sizeY = comp.maxY - comp.minY
    comp.sizeZ = comp.maxZ - comp.minZ
    comp.centerX = (comp.minX + comp.maxX) / 2
    comp.centerY = (comp.minY + comp.maxY) / 2
    comp.centerZ = (comp.minZ + comp.maxZ) / 2
    return comp
  })

  // Scandinavian natural wood brown for the rack frame and shelves (coklat kayu)
  const woodRackColor = new THREE.Color('#7c4826')

  // Cardboard Kraft palette with varied natural tones (coklat karton beragam)
  const cardboardPalette = [
    new THREE.Color('#c59b6c'), // Classic kraft paper cardboard
    new THREE.Color('#b58750'), // Golden warm tan cardboard
    new THREE.Color('#cca275'), // Light buff kraft cardboard
    new THREE.Color('#a87948'), // Deeper recycled cardboard
    new THREE.Color('#be915d'), // Medium raw cardboard
  ]

  // Identify rack vs boxes
  // The rack has long horizontal shelves (sizeX > 0.65) and tall A-frame uprights (sizeY > 0.55)
  const compColors = new Map()
  const boxComponents = []

  components.forEach(comp => {
    const isRack = comp.sizeX > 0.65 || comp.sizeY > 0.55
    if (isRack) {
      compColors.set(comp.root, woodRackColor)
    } else {
      boxComponents.push(comp)
    }
  })

  // Group box components (e.g. body + lid of the same physical box) by XZ position
  const boxGroups = []
  boxComponents.forEach(comp => {
    let group = boxGroups.find(g => Math.hypot(g.centerX - comp.centerX, g.centerZ - comp.centerZ) < 0.22)
    if (!group) {
      group = { centerX: comp.centerX, centerZ: comp.centerZ, comps: [] }
      boxGroups.push(group)
    }
    group.comps.push(comp)
  })

  // Sort box groups from left to right along X axis
  boxGroups.sort((a, b) => a.centerX - b.centerX)

  boxGroups.forEach((g, gIdx) => {
    const baseCol = cardboardPalette[gIdx % cardboardPalette.length]
    const minSizeY = Math.min(...g.comps.map(c => c.sizeY))
    g.comps.forEach(comp => {
      const isLid = g.comps.length > 1 && (comp.sizeY === minSizeY || comp.sizeY < 0.09)
      const col = isLid ? baseCol.clone().offsetHSL(0, 0.03, -0.05) : baseCol
      compColors.set(comp.root, col)
    })
  })

  const colorAttr = new Float32Array(numVerts * 3)
  for (let v = 0; v < numVerts; v++) {
    const root = find(v)
    const col = compColors.get(root) || woodRackColor
    colorAttr[v * 3] = col.r
    colorAttr[v * 3 + 1] = col.g
    colorAttr[v * 3 + 2] = col.b
  }

  geom.setAttribute('color', new THREE.BufferAttribute(colorAttr, 3))
  geom.attributes.color.needsUpdate = true

  mesh.material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.58,
    metalness: 0.04
  })
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
  const floorType = scenerySettings?.floorType === 'white' ? 'white' : 'parquet'
  const isColorful = theme === 'colorful'

  const textures = useTexture({
    parquet: '/textures/parquet.png',
    white: '/textures/white_tiles.png'
  })

  const floorTex = textures[floorType] || textures.parquet

  useEffect(() => {
    if (!scene || !floorTex) return

    floorTex.wrapS = THREE.RepeatWrapping
    floorTex.wrapT = THREE.RepeatWrapping
    // Plane.001 UV range is ~5.7 units across 10m:
    // repeat 1.0 = ~5.6 repeats across 10m (each plank ~45cm x 11cm, perfect parquet scale!)
    // white tile repeat 1.5 = ~8.5 repeats across 10m
    floorTex.repeat.set(floorType === 'white' ? 1.5 : 1.0, floorType === 'white' ? 1.5 : 1.0)
    floorTex.colorSpace = THREE.SRGBColorSpace
    floorTex.anisotropy = 16
    floorTex.needsUpdate = true

    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
        const name = (child.name || '').toLowerCase()
        const parentName = (child.parent?.name || '').toLowerCase()

        if (name.includes('navmesh') || parentName.includes('navmesh') || name === 'plane.002' || name === 'plane002') {
          child.visible = false
          return
        }

        // --- 1. FLOOR TEXTURE (PARQUET / WHITE) ---
        if (name.includes('floor') || parentName.includes('floor') || name === 'plane.001' || name === 'plane001') {
          child.material = new THREE.MeshStandardMaterial({
            map: floorTex,
            roughness: floorType === 'white' ? 0.42 : 0.32,
            metalness: 0.02
          })
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
            name === 'cube.003' ||
            name === 'cube010' ||
            name === 'cube014' ||
            name === 'cube019' ||
            name === 'cube022' ||
            name === 'cube003'
          ) {
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#252b33'), // Dark charcoal/graphite ergonomic office chair
              roughness: 0.45,
              metalness: 0.08
            })
          }
          // --- 3. COFFEE TABLE CHAIRS: WARM RICH COGNAC / SADDLE BROWN (COKLAT) ---
          else if (
            (name.includes('chair') || parentName.includes('chair') ||
             name.startsWith('circle') || parentName.startsWith('circle')) &&
            !name.includes('work') && !parentName.includes('work') &&
            !name.includes('plant') && !parentName.includes('plant')
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
            name === 'cube.020' ||
            name === 'cube008' ||
            name === 'cube012' ||
            name === 'cube017' ||
            name === 'cube020'
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
            name === 'cube.001' ||
            name === 'cube001'
          ) {
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#9e6b42'), // Warm honey walnut
              roughness: 0.38,
              metalness: 0.05
            })
          }
          // --- 6. STORAGE CABINET / SHELVING RACK: WOOD BROWN FRAME & MULTI-TONED CARDBOARD BOXES ---
          else if (
            name.includes('cabinet') ||
            parentName.includes('cabinet') ||
            name === 'cube.002' ||
            name === 'cube002'
          ) {
            colorizeCabinetMesh(child)
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
            name === 'cube.006' ||
            name === 'cube006'
          ) {
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#b45309'),
              roughness: 0.65
            })
          }
          // --- 9. DESK LAMPS: CLEAN WHITE / LIGHT ARCHITECTURAL GRAY (PUTIH / ABU2 MUDA) ---
          else if (
            name.includes('flexo') ||
            parentName.includes('flexo') ||
            name === 'cube.009' ||
            name === 'cube.013' ||
            name === 'cube.018' ||
            name === 'cube.021' ||
            name === 'cube009' ||
            name === 'cube013' ||
            name === 'cube018' ||
            name === 'cube021'
          ) {
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#f1f5f9'), // Clean off-white / light architectural gray
              roughness: 0.25,
              metalness: 0.12
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
useTexture.preload('/textures/parquet.png')
useTexture.preload('/textures/white_tiles.png')

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
