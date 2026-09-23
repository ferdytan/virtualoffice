import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Procedurally draws rich, vibrant browser dashboard canvases.
 * Converts each canvas into a high-resolution Three.js CanvasTexture.
 */
function createBrowserTexture(type) {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 620
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  // 1. Browser Window Background
  const bgColors = {
    velocia: '#0f172a', // Deep slate navy
    scout: '#051b14',   // Cyber emerald
    nara: '#07162c',    // Electric midnight blue
    team: '#12131f'     // Deep IDE dark
  }
  ctx.fillStyle = bgColors[type] || '#0f172a'
  ctx.fillRect(0, 0, 1024, 620)

  // 2. Browser Title Bar & Tabs
  ctx.fillStyle = '#1e293b'
  ctx.fillRect(0, 0, 1024, 64)

  // Window control dots (Mac style)
  ctx.beginPath(); ctx.arc(32, 32, 9, 0, Math.PI * 2); ctx.fillStyle = '#ef4444'; ctx.fill()
  ctx.beginPath(); ctx.arc(60, 32, 9, 0, Math.PI * 2); ctx.fillStyle = '#f59e0b'; ctx.fill()
  ctx.beginPath(); ctx.arc(88, 32, 9, 0, Math.PI * 2); ctx.fillStyle = '#10b981'; ctx.fill()

  // Tab Header
  const tabTitles = {
    velocia: '📊 Growth Analytics & Campaigns',
    scout: '🔍 Tech Trends & AI Radar',
    nara: '🚨 Unit Telemetry & CS Escalations',
    team: '💻 agent_pipeline.py — IDE'
  }
  const tabColors = {
    velocia: '#ef4444',
    scout: '#22c55e',
    nara: '#38bdf8',
    team: '#a855f7'
  }

  // Active Tab
  ctx.fillStyle = '#334155'
  ctx.beginPath()
  ctx.roundRect(120, 12, 320, 44, [8, 8, 0, 0])
  ctx.fill()

  // Tab dot indicator
  ctx.beginPath(); ctx.arc(142, 34, 6, 0, Math.PI * 2)
  ctx.fillStyle = tabColors[type] || '#38bdf8'
  ctx.fill()

  ctx.font = 'bold 18px "Inter", -apple-system, sans-serif'
  ctx.fillStyle = '#f8fafc'
  ctx.fillText(tabTitles[type] || 'Dashboard', 160, 40)

  // Inactive Tab
  ctx.fillStyle = '#1e293b'
  ctx.font = '16px "Inter", sans-serif'
  ctx.fillStyle = '#64748b'
  ctx.fillText('+ New Tab', 460, 40)

  // 3. Browser Address / URL Bar
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 64, 1024, 48)

  ctx.fillStyle = '#1e293b'
  ctx.beginPath()
  ctx.roundRect(120, 72, 784, 32, 16)
  ctx.fill()

  const urls = {
    velocia: '🔒 https://marketing.virtualoffice.ai/growth/campaigns/live',
    scout: '🔒 https://research.virtualoffice.ai/ai-agents/radar/trends',
    nara: '🔒 https://ops.virtualoffice.ai/cs/telemetry/live-monitor',
    team: '🔒 https://github.com/ferdytan/virtualoffice'
  }
  ctx.font = '15px "Courier New", monospace'
  ctx.fillStyle = '#94a3b8'
  ctx.fillText(urls[type] || 'https://virtualoffice.ai', 145, 94)

  // 4. Content Area Based on Agent Type
  if (type === 'velocia') {
    // === VELOCIA: VIBRANT MARKETING & GROWTH DASHBOARD ===
    // Header
    ctx.font = 'bold 26px "Inter", sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText('CAMPAIGN GROWTH & PERFORMANCE METRICS', 40, 160)

    // Pulse status
    ctx.beginPath(); ctx.arc(940, 152, 7, 0, Math.PI * 2); ctx.fillStyle = '#10b981'; ctx.fill()
    ctx.font = 'bold 15px "Inter", sans-serif'; ctx.fillStyle = '#10b981'; ctx.fillText('LIVE SYNC', 840, 157)

    // 3 KPI Cards
    const cards = [
      { label: 'CONVERSION ROI', value: '+38.4%', sub: 'Target: +25%', grad: ['#ef4444', '#f43f5e'] },
      { label: 'ACTIVE REACH', value: '184.2K', sub: 'Weekly Imp: 2.1M', grad: ['#8b5cf6', '#6366f1'] },
      { label: 'DELEGATED LEADS', value: '12,940', sub: 'Qualified 94%', grad: ['#f59e0b', '#d97706'] }
    ]

    cards.forEach((c, i) => {
      const x = 40 + i * 315
      const grad = ctx.createLinearGradient(x, 185, x + 300, 310)
      grad.addColorStop(0, c.grad[0])
      grad.addColorStop(1, c.grad[1])

      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.roundRect(x, 185, 300, 115, 14)
      ctx.fill()

      ctx.font = 'bold 14px "Inter", sans-serif'
      ctx.fillStyle = '#ffffff'
      ctx.fillText(c.label, x + 20, 218)

      ctx.font = 'bold 36px "Inter", sans-serif'
      ctx.fillText(c.value, x + 20, 262)

      ctx.font = '14px "Inter", sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.85)'
      ctx.fillText(c.sub, x + 20, 288)
    })

    // Colorful Multi-Bar Chart
    ctx.fillStyle = '#1e293b'
    ctx.beginPath()
    ctx.roundRect(40, 325, 520, 265, 14)
    ctx.fill()

    ctx.font = 'bold 18px "Inter", sans-serif'
    ctx.fillStyle = '#f8fafc'
    ctx.fillText('Channel Lead Generation (Weekly)', 65, 360)

    const barColors = ['#ef4444', '#f97316', '#facc15', '#10b981', '#06b6d4', '#8b5cf6', '#ec4899']
    const barHeights = [140, 95, 180, 130, 205, 160, 190]
    const barLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    barHeights.forEach((h, i) => {
      const bx = 75 + i * 65
      const by = 550 - h
      ctx.fillStyle = barColors[i]
      ctx.beginPath()
      ctx.roundRect(bx, by, 42, h, [6, 6, 0, 0])
      ctx.fill()

      ctx.font = '14px "Inter", sans-serif'
      ctx.fillStyle = '#94a3b8'
      ctx.fillText(barLabels[i], bx + 6, 575)
    })

    // Glowing Neon Sparkline Area Chart (Right panel)
    ctx.fillStyle = '#1e293b'
    ctx.beginPath()
    ctx.roundRect(585, 325, 395, 265, 14)
    ctx.fill()

    ctx.font = 'bold 18px "Inter", sans-serif'
    ctx.fillStyle = '#f8fafc'
    ctx.fillText('Real-Time Conversion Wave', 610, 360)

    // Area Fill
    const waveGrad = ctx.createLinearGradient(0, 380, 0, 560)
    waveGrad.addColorStop(0, 'rgba(244, 63, 94, 0.45)')
    waveGrad.addColorStop(1, 'rgba(244, 63, 94, 0.0)')

    ctx.beginPath()
    ctx.moveTo(610, 500)
    ctx.bezierCurveTo(670, 420, 720, 520, 780, 440)
    ctx.bezierCurveTo(830, 380, 890, 480, 955, 410)
    ctx.lineTo(955, 550)
    ctx.lineTo(610, 550)
    ctx.closePath()
    ctx.fillStyle = waveGrad
    ctx.fill()

    // Stroke
    ctx.beginPath()
    ctx.moveTo(610, 500)
    ctx.bezierCurveTo(670, 420, 720, 520, 780, 440)
    ctx.bezierCurveTo(830, 380, 890, 480, 955, 410)
    ctx.strokeStyle = '#f43f5e'
    ctx.lineWidth = 4
    ctx.stroke()

    // Pulse dot at tip
    ctx.beginPath(); ctx.arc(955, 410, 6, 0, Math.PI * 2); ctx.fillStyle = '#ffffff'; ctx.fill()

  } else if (type === 'scout') {
    // === SCOUT: DEEP TECH RESEARCH & AI TRENDS RADAR ===
    ctx.font = 'bold 26px "Inter", sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText('GLOBAL AI INTELLIGENCE & RESEARCH RADAR', 40, 160)

    ctx.beginPath(); ctx.arc(940, 152, 7, 0, Math.PI * 2); ctx.fillStyle = '#22c55e'; ctx.fill()
    ctx.font = 'bold 15px "Inter", sans-serif'; ctx.fillStyle = '#22c55e'; ctx.fillText('SCANNING ACTIVE', 785, 157)

    // Left Column: Latest Research Feeds with Tags
    ctx.fillStyle = '#0f291e'
    ctx.beginPath()
    ctx.roundRect(40, 185, 540, 405, 14)
    ctx.fill()

    ctx.font = 'bold 18px "Inter", sans-serif'
    ctx.fillStyle = '#4ade80'
    ctx.fillText('📡 Detected Breakthroughs & Emerging Papers', 65, 225)

    const feeds = [
      { tag: 'AUTONOMOUS', title: 'Self-Organizing Agent Collectives in 3D Spaces', time: '4m ago', color: '#10b981' },
      { tag: 'REASONING', title: 'Test-Time Compute Scaling & Tree Search', time: '12m ago', color: '#06b6d4' },
      { tag: 'BENCHMARK', title: 'CrewAI vs AutoGen Enterprise Latency Eval', time: '28m ago', color: '#eab308' },
      { tag: 'WORKFLOW', title: 'Real-time WebSocket Multi-Agent Telemetry', time: '1h ago', color: '#a855f7' },
      { tag: 'MULTIMODAL', title: 'Spatial Audio & Chibi 3D Avatars for SaaS', time: '2h ago', color: '#ec4899' }
    ]

    feeds.forEach((f, i) => {
      const fy = 255 + i * 65
      // Tag badge
      ctx.fillStyle = f.color
      ctx.beginPath()
      ctx.roundRect(65, fy, 115, 24, 6)
      ctx.fill()

      ctx.font = 'bold 11px "Inter", sans-serif'
      ctx.fillStyle = '#000000'
      ctx.fillText(f.tag, 75, fy + 16)

      // Title & Time
      ctx.font = '15px "Inter", sans-serif'
      ctx.fillStyle = '#f8fafc'
      ctx.fillText(f.title, 195, fy + 17)

      ctx.font = '13px "Inter", sans-serif'
      ctx.fillStyle = '#64748b'
      ctx.fillText(f.time, 510, fy + 17)

      // Divider line
      ctx.strokeStyle = '#1e3a2b'
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(65, fy + 38); ctx.lineTo(555, fy + 38); ctx.stroke()
    })

    // Right Column: Cyber Radar & Spectrum
    ctx.fillStyle = '#0f291e'
    ctx.beginPath()
    ctx.roundRect(605, 185, 375, 405, 14)
    ctx.fill()

    ctx.font = 'bold 18px "Inter", sans-serif'
    ctx.fillStyle = '#4ade80'
    ctx.fillText('Agent Consensus Radar', 630, 225)

    // Radar concentric circles
    const rcx = 792, rcy = 360
    ctx.strokeStyle = '#1e4835'
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.arc(rcx, rcy, 105, 0, Math.PI * 2); ctx.stroke()
    ctx.beginPath(); ctx.arc(rcx, rcy, 70, 0, Math.PI * 2); ctx.stroke()
    ctx.beginPath(); ctx.arc(rcx, rcy, 35, 0, Math.PI * 2); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(rcx - 115, rcy); ctx.lineTo(rcx + 115, rcy); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(rcx, rcy - 115); ctx.lineTo(rcx, rcy + 115); ctx.stroke()

    // Radar scan beam
    const radarGrad = ctx.createRadialGradient(rcx, rcy, 0, rcx, rcy, 105)
    radarGrad.addColorStop(0, 'rgba(34, 197, 94, 0.4)')
    radarGrad.addColorStop(1, 'rgba(34, 197, 94, 0.0)')
    ctx.fillStyle = radarGrad
    ctx.beginPath()
    ctx.moveTo(rcx, rcy)
    ctx.arc(rcx, rcy, 105, -Math.PI / 4, Math.PI / 6)
    ctx.closePath()
    ctx.fill()

    // Blips
    const blips = [
      { x: rcx + 40, y: rcy - 50, c: '#22c55e' },
      { x: rcx - 55, y: rcy + 30, c: '#06b6d4' },
      { x: rcx + 65, y: rcy + 45, c: '#eab308' },
      { x: rcx - 20, y: rcy - 75, c: '#10b981' }
    ]
    blips.forEach(b => {
      ctx.beginPath(); ctx.arc(b.x, b.y, 5, 0, Math.PI * 2); ctx.fillStyle = b.c; ctx.fill()
    })

    // Radar Footer stats
    ctx.font = 'bold 15px "Courier New", monospace'
    ctx.fillStyle = '#4ade80'
    ctx.fillText('SIGNAL: 99.4% | 14,820 SOURCES', 655, 530)
    ctx.font = '13px "Inter", sans-serif'; ctx.fillStyle = '#94a3b8'
    ctx.fillText('Next auto-synthesis batch in 04:12s', 675, 555)

  } else if (type === 'nara') {
    // === NARA: UNIT TELEMETRY & CS ESCALATIONS MONITOR ===
    ctx.font = 'bold 26px "Inter", sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText('UNIT HEALTH TELEMETRY & CS ESCALATIONS', 40, 160)

    // Healthy badge
    ctx.fillStyle = '#10b981'
    ctx.beginPath(); ctx.roundRect(800, 136, 180, 32, 16); ctx.fill()
    ctx.font = 'bold 14px "Inter", sans-serif'; ctx.fillStyle = '#022c22'
    ctx.fillText('● ALL UNITS ONLINE', 818, 157)

    // Left Column: Server Cluster Matrix
    ctx.fillStyle = '#0c2242'
    ctx.beginPath()
    ctx.roundRect(40, 185, 450, 405, 14)
    ctx.fill()

    ctx.font = 'bold 18px "Inter", sans-serif'
    ctx.fillStyle = '#38bdf8'
    ctx.fillText('🖥️ Active Device Fleet (32 Units)', 65, 225)

    // 4x8 Grid of colorful server node status pills
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 6; col++) {
        const nx = 65 + col * 68
        const ny = 250 + row * 60
        const isAmber = (row === 1 && col === 3) || (row === 3 && col === 1)
        const nodeColor = isAmber ? '#f59e0b' : '#10b981'

        ctx.fillStyle = '#15325b'
        ctx.beginPath()
        ctx.roundRect(nx, ny, 58, 46, 8)
        ctx.fill()

        ctx.beginPath(); ctx.arc(nx + 18, ny + 23, 6, 0, Math.PI * 2)
        ctx.fillStyle = nodeColor; ctx.fill()

        ctx.font = 'bold 12px "Courier New", monospace'
        ctx.fillStyle = '#93c5fd'
        ctx.fillText(`U-${row * 6 + col + 1}`, nx + 28, ny + 27)
      }
    }

    // Status Summary at bottom of cluster
    ctx.font = 'bold 15px "Inter", sans-serif'; ctx.fillStyle = '#e2e8f0'
    ctx.fillText('System Health: 99.8%  •  Offline: 0  •  Latency: 18ms', 65, 545)

    // Right Column: Heartbeat Waveform & CS Escalation Tickets
    ctx.fillStyle = '#0c2242'
    ctx.beginPath()
    ctx.roundRect(515, 185, 465, 405, 14)
    ctx.fill()

    ctx.font = 'bold 18px "Inter", sans-serif'
    ctx.fillStyle = '#38bdf8'
    ctx.fillText('Live Heartbeat Pulse (Telemetry Stream)', 540, 225)

    // Heartbeat ECG Line
    ctx.beginPath()
    ctx.moveTo(540, 280)
    ctx.lineTo(600, 280)
    ctx.lineTo(620, 240)
    ctx.lineTo(640, 315)
    ctx.lineTo(660, 260)
    ctx.lineTo(680, 280)
    ctx.lineTo(760, 280)
    ctx.lineTo(780, 235)
    ctx.lineTo(800, 320)
    ctx.lineTo(820, 255)
    ctx.lineTo(840, 280)
    ctx.lineTo(950, 280)
    ctx.strokeStyle = '#38bdf8'
    ctx.lineWidth = 4
    ctx.shadowColor = '#38bdf8'
    ctx.shadowBlur = 10
    ctx.stroke()
    ctx.shadowBlur = 0 // Reset

    // Recent CS Escalation Action Log
    ctx.font = 'bold 17px "Inter", sans-serif'
    ctx.fillStyle = '#f8fafc'
    ctx.fillText('Recent Automated Escalations & Reminders', 540, 365)

    const tickets = [
      { id: '#4821', unit: 'Unit B-12', action: 'WhatsApp Reminder: Payment', badge: 'SENT', badgeColor: '#38bdf8' },
      { id: '#4822', unit: 'Unit C-04', action: 'Offline Auto-Reboot Trigger', badge: 'RESOLVED', badgeColor: '#10b981' },
      { id: '#4823', unit: 'Unit A-09', action: 'Firmware sync verified', badge: 'SUCCESS', badgeColor: '#10b981' }
    ]

    tickets.forEach((t, i) => {
      const ty = 395 + i * 55
      ctx.fillStyle = '#15325b'
      ctx.beginPath()
      ctx.roundRect(540, ty, 420, 44, 8)
      ctx.fill()

      ctx.font = 'bold 13px "Courier New", monospace'
      ctx.fillStyle = '#38bdf8'
      ctx.fillText(t.id, 555, ty + 27)

      ctx.font = '14px "Inter", sans-serif'
      ctx.fillStyle = '#f1f5f9'
      ctx.fillText(`${t.unit} • ${t.action}`, 615, ty + 27)

      ctx.fillStyle = t.badgeColor
      ctx.beginPath()
      ctx.roundRect(875, ty + 10, 75, 24, 6)
      ctx.fill()

      ctx.font = 'bold 11px "Inter", sans-serif'
      ctx.fillStyle = '#000000'
      ctx.fillText(t.badge, 885, ty + 26)
    })

  } else {
    // === TEAM DESK 4: CODE IDE & SYNTAX HIGHLIGHTED WORKSPACE ===
    ctx.font = 'bold 26px "Inter", sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText('DEV WORKSPACE — VIRTUAL OFFICE CLUSTER', 40, 160)

    ctx.fillStyle = '#1e1f38'
    ctx.beginPath()
    ctx.roundRect(40, 185, 940, 405, 14)
    ctx.fill()

    // File Tabs
    ctx.fillStyle = '#2b2d4f'
    ctx.fillRect(40, 185, 940, 40)
    ctx.font = '14px "Inter", sans-serif'; ctx.fillStyle = '#f8fafc'
    ctx.fillText('agent_pipeline.py  ×', 65, 210)
    ctx.fillStyle = '#94a3b8'
    ctx.fillText('OfficeScene.jsx', 230, 210)
    ctx.fillText('terminal', 380, 210)

    // Code lines
    const codeLines = [
      { num: '1', tokens: [{ t: 'from ', c: '#c678dd' }, { t: 'crewai ', c: '#e5c07b' }, { t: 'import ', c: '#c678dd' }, { t: 'Agent, Crew, Task', c: '#61afef' }] },
      { num: '2', tokens: [{ t: 'from ', c: '#c678dd' }, { t: 'virtual_office.agents ', c: '#e5c07b' }, { t: 'import ', c: '#c678dd' }, { t: 'NARA, VELOCIA, SCOUT', c: '#98c379' }] },
      { num: '3', tokens: [{ t: '' }] },
      { num: '4', tokens: [{ t: '# 2x2 Collaborative Face-to-Face Office Pod', c: '#5c6370' }] },
      { num: '5', tokens: [{ t: 'office_pod = ', c: '#e06c75' }, { t: 'VirtualOfficePod(', c: '#61afef' }, { t: 'layout="2x2_island"', c: '#98c379' }, { t: ')', c: '#abb2bf' }] },
      { num: '6', tokens: [{ t: 'office_pod.dock_agent(', c: '#61afef' }, { t: '"nara", ', c: '#98c379' }, { t: 'role="Reminder CS"', c: '#d19a66' }, { t: ')', c: '#abb2bf' }] },
      { num: '7', tokens: [{ t: 'office_pod.dock_agent(', c: '#61afef' }, { t: '"velocia", ', c: '#98c379' }, { t: 'role="Marketing Strategist"', c: '#d19a66' }, { t: ')', c: '#abb2bf' }] },
      { num: '8', tokens: [{ t: 'office_pod.dock_agent(', c: '#61afef' }, { t: '"scout", ', c: '#98c379' }, { t: 'role="Tech Researcher"', c: '#d19a66' }, { t: ')', c: '#abb2bf' }] },
      { num: '9', tokens: [{ t: 'await office_pod.start_autonomous_collaboration()', c: '#61afef' }] }
    ]

    codeLines.forEach((line, i) => {
      const ly = 258 + i * 24
      ctx.font = '14px "Courier New", monospace'
      ctx.fillStyle = '#5c6370'
      ctx.fillText(line.num, 60, ly)

      let lx = 100
      if (line.tokens) {
        line.tokens.forEach(tok => {
          ctx.fillStyle = tok.c || '#abb2bf'
          ctx.fillText(tok.t, lx, ly)
          lx += ctx.measureText(tok.t).width
        })
      }
    })

    // Mini Terminal at bottom of editor
    ctx.fillStyle = '#111222'
    ctx.beginPath()
    ctx.roundRect(55, 490, 910, 85, 8)
    ctx.fill()

    ctx.font = 'bold 13px "Courier New", monospace'
    ctx.fillStyle = '#10b981'
    ctx.fillText('● [vite:dev] HMR active — Virtual Office 3D Pod synchronized', 75, 520)
    ctx.fillStyle = '#38bdf8'
    ctx.fillText('● [backend] FastAPI crew server healthy at 127.0.0.1:8000 (status 200)', 75, 545)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.generateMipmaps = true
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.needsUpdate = true

  return texture
}

/**
 * ScreenDisplays Component
 * Mounts 4 high-definition, glowing colorful browser displays directly onto
 * the computer monitors of the 4-desk workstation pod.
 */
export default function ScreenDisplays({ onSelectAgent, agents = [] }) {
  const groupRef = useRef()

  // Generate textures for the 4 desks
  const velociaTexture = useMemo(() => createBrowserTexture('velocia'), [])
  const scoutTexture = useMemo(() => createBrowserTexture('scout'), [])
  const naraTexture = useMemo(() => createBrowserTexture('nara'), [])
  const teamTexture = useMemo(() => createBrowserTexture('team'), [])

  // Create glowing emissive materials
  const velociaMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: velociaTexture,
        emissiveMap: velociaTexture,
        emissive: new THREE.Color('#ffffff'),
        emissiveIntensity: 0.7,
        roughness: 0.15,
        metalness: 0.05
      }),
    [velociaTexture]
  )

  const scoutMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: scoutTexture,
        emissiveMap: scoutTexture,
        emissive: new THREE.Color('#ffffff'),
        emissiveIntensity: 0.7,
        roughness: 0.15,
        metalness: 0.05
      }),
    [scoutTexture]
  )

  const naraMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: naraTexture,
        emissiveMap: naraTexture,
        emissive: new THREE.Color('#ffffff'),
        emissiveIntensity: 0.7,
        roughness: 0.15,
        metalness: 0.05
      }),
    [naraTexture]
  )

  const teamMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: teamTexture,
        emissiveMap: teamTexture,
        emissive: new THREE.Color('#ffffff'),
        emissiveIntensity: 0.7,
        roughness: 0.15,
        metalness: 0.05
      }),
    [teamTexture]
  )

  // Gentle, subtle emissive screen glow oscillation to make the screens feel alive
  useFrame((state) => {
    const pulse = 0.7 + Math.sin(state.clock.elapsedTime * 2.5) * 0.06
    if (velociaMat) velociaMat.emissiveIntensity = pulse
    if (scoutMat) scoutMat.emissiveIntensity = pulse
    if (naraMat) naraMat.emissiveIntensity = pulse
    if (teamMat) teamMat.emissiveIntensity = pulse
  })

  // Quick lookup helper for selecting agents on screen click
  const velociaAgent = agents.find((a) => a.id === 'velocia')
  const scoutAgent = agents.find((a) => a.id === 'scout')
  const naraAgent = agents.find((a) => a.id === 'nara')

  // Exact monitor screen surface coordinates
  // Desk 1 (Velocia): PC at [1.59, 0.50, -3.21], rotation [0, Math.PI, 0] -> screen faces -Z
  // Desk 2 (Scout):   PC at [3.36, 0.50, -3.21], rotation [0, Math.PI, 0] -> screen faces -Z
  // Desk 3 (Nara):    PC at [1.21, 0.50, -2.37], rotation [0, 0, 0]       -> screen faces +Z
  // Desk 4 (Team):    PC at [2.98, 0.50, -2.37], rotation [0, 0, 0]       -> screen faces +Z
  const screenWidth = 0.42
  const screenHeight = 0.25

  return (
    <group ref={groupRef}>
      {/* 1. Velocia's Screen (Desk 1) */}
      <mesh
        position={[1.588, 0.735, -3.32]}
        rotation={[0, Math.PI, 0]}
        material={velociaMat}
        onClick={(e) => {
          e.stopPropagation()
          if (velociaAgent && onSelectAgent) onSelectAgent(velociaAgent)
        }}
      >
        <planeGeometry args={[screenWidth, screenHeight]} />
      </mesh>

      {/* 2. Scout's Screen (Desk 2) */}
      <mesh
        position={[3.359, 0.735, -3.32]}
        rotation={[0, Math.PI, 0]}
        material={scoutMat}
        onClick={(e) => {
          e.stopPropagation()
          if (scoutAgent && onSelectAgent) onSelectAgent(scoutAgent)
        }}
      >
        <planeGeometry args={[screenWidth, screenHeight]} />
      </mesh>

      {/* 3. Nara's Screen (Desk 3) */}
      <mesh
        position={[1.207, 0.735, -2.26]}
        rotation={[0, 0, 0]}
        material={naraMat}
        onClick={(e) => {
          e.stopPropagation()
          if (naraAgent && onSelectAgent) onSelectAgent(naraAgent)
        }}
      >
        <planeGeometry args={[screenWidth, screenHeight]} />
      </mesh>

      {/* 4. Team Sandbox Screen (Desk 4, opposite Scout) */}
      <mesh
        position={[2.977, 0.735, -2.26]}
        rotation={[0, 0, 0]}
        material={teamMat}
      >
        <planeGeometry args={[screenWidth, screenHeight]} />
      </mesh>
    </group>
  )
}
