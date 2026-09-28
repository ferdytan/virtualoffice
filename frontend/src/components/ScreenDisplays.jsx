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
    sherloc: '#161309', // Dark amber obsidian
    watson: '#0d1127',  // Deep electric indigo
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
    sherloc: '🟢 Sherloc — WhatsApp Live Frontline Desk',
    watson: '⚡ Watson — Escalation Bridge & Knowledge Loop',
    velocia: '📊 Growth Analytics & Campaigns',
    scout: '🔍 Tech Trends & AI Radar',
    nara: '🚨 Unit Telemetry & Safe Broadcast',
    team: '💻 agent_pipeline.py — IDE'
  }
  const tabColors = {
    sherloc: '#f59e0b',
    watson: '#6366f1',
    velocia: '#ef4444',
    scout: '#22c55e',
    nara: '#38bdf8',
    team: '#a855f7'
  }

  // Active Tab
  ctx.fillStyle = '#334155'
  ctx.beginPath()
  ctx.roundRect(120, 12, 360, 44, [8, 8, 0, 0])
  ctx.fill()

  // Tab dot indicator
  ctx.beginPath(); ctx.arc(142, 34, 6, 0, Math.PI * 2)
  ctx.fillStyle = tabColors[type] || '#38bdf8'
  ctx.fill()

  ctx.font = 'bold 17px "Inter", -apple-system, sans-serif'
  ctx.fillStyle = '#f8fafc'
  ctx.fillText(tabTitles[type] || 'Dashboard', 160, 40)

  // Inactive Tab
  ctx.fillStyle = '#1e293b'
  ctx.font = '16px "Inter", sans-serif'
  ctx.fillStyle = '#64748b'
  ctx.fillText('+ New Tab', 500, 40)

  // 3. Browser Address / URL Bar
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 64, 1024, 48)

  ctx.fillStyle = '#1e293b'
  ctx.beginPath()
  ctx.roundRect(120, 72, 784, 32, 16)
  ctx.fill()

  const urls = {
    sherloc: '🔒 https://wa.virtualoffice.ai/sherloc/frontline-inbox/live-webhook',
    watson: '🔒 https://ops.virtualoffice.ai/watson/escalation-bridge/rag-loop',
    velocia: '🔒 https://marketing.virtualoffice.ai/growth/campaigns/live',
    scout: '🔒 https://research.virtualoffice.ai/ai-agents/radar/trends',
    nara: '🔒 https://ops.virtualoffice.ai/cs/telemetry/safe-broadcast',
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
    ctx.font = 'bold 24px "Inter", sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText('NARA ENGINE • OFFLINE TELEMETRY & SMART DISPATCH', 40, 160)

    // Healthy badge
    ctx.fillStyle = '#0ea5e9'
    ctx.beginPath(); ctx.roundRect(750, 136, 230, 32, 16); ctx.fill()
    ctx.font = 'bold 13px "Inter", sans-serif'; ctx.fillStyle = '#ffffff'
    ctx.fillText('● CAM RULE & WATSON DISPATCH', 765, 157)

    // Left Column: Server Cluster Matrix
    ctx.fillStyle = '#0c2242'
    ctx.beginPath()
    ctx.roundRect(40, 185, 450, 405, 14)
    ctx.fill()

    ctx.font = 'bold 18px "Inter", sans-serif'
    ctx.fillStyle = '#38bdf8'
    ctx.fillText('📡 Orin Telemetry Fleet (Live API)', 65, 225)

    // 4x8 Grid of colorful server node status pills
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 6; col++) {
        const nx = 65 + col * 68
        const ny = 250 + row * 60
        const isCam = (row === 0 && col === 2) || (row === 2 && col === 4)
        const isOffline = (row === 1 && col === 1) || (row === 3 && col === 0)
        const nodeColor = isOffline ? '#ef4444' : isCam ? '#a855f7' : '#10b981'

        ctx.fillStyle = '#15325b'
        ctx.beginPath()
        ctx.roundRect(nx, ny, 58, 46, 8)
        ctx.fill()

        ctx.beginPath(); ctx.arc(nx + 18, ny + 23, 6, 0, Math.PI * 2)
        ctx.fillStyle = nodeColor; ctx.fill()

        ctx.font = 'bold 11px "Courier New", monospace'
        ctx.fillStyle = '#93c5fd'
        ctx.fillText(isCam ? 'CAM' : `U-${row * 6 + col + 1}`, nx + 28, ny + 27)
      }
    }

    // Status Summary at bottom of cluster
    ctx.font = 'bold 14px "Inter", sans-serif'; ctx.fillStyle = '#e2e8f0'
    ctx.fillText('API Total: 1.050  •  Qualified: 9  •  CAM Grace: 1  •  Jitter: 15-45s', 65, 545)

    // Right Column: Heartbeat Waveform & CS Escalation Tickets
    ctx.fillStyle = '#0c2242'
    ctx.beginPath()
    ctx.roundRect(515, 185, 465, 405, 14)
    ctx.fill()

    ctx.font = 'bold 18px "Inter", sans-serif'
    ctx.fillStyle = '#38bdf8'
    ctx.fillText('Watson Anti-Ban Dispatch & Feedback Loop', 540, 225)

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
    ctx.fillText('Customer PRO WhatsApp Group Dispatch', 540, 365)

    const tickets = [
      { id: 'PT RAMA', unit: 'Fleet Ops Support', action: 'Full Audit (Tanggal 1)', badge: 'SENT', badgeColor: '#38bdf8' },
      { id: 'LOGISTIK', unit: 'B 1842 KZA', action: 'Inbound Teknisi Tiket', badge: 'RESOLVED', badgeColor: '#10b981' },
      { id: 'EXPRESS', unit: 'D 9912 ABE', action: 'Delta Report (0 Flags)', badge: 'DELIVERED', badgeColor: '#10b981' }
    ]

    tickets.forEach((t, i) => {
      const ty = 395 + i * 55
      ctx.fillStyle = '#15325b'
      ctx.beginPath()
      ctx.roundRect(540, ty, 420, 44, 8)
      ctx.fill()

      ctx.font = 'bold 12px "Courier New", monospace'
      ctx.fillStyle = '#38bdf8'
      ctx.fillText(t.id, 555, ty + 27)

      ctx.font = '13px "Inter", sans-serif'
      ctx.fillStyle = '#f1f5f9'
      ctx.fillText(`${t.unit} • ${t.action}`, 645, ty + 27)

      ctx.fillStyle = t.badgeColor
      ctx.beginPath()
      ctx.roundRect(865, ty + 10, 85, 24, 6)
      ctx.fill()

      ctx.font = 'bold 10px "Inter", sans-serif'
      ctx.fillStyle = '#ffffff'
      ctx.fillText(t.badge, 875, ty + 26)
    })

  } else if (type === 'watson') {
    // === WATSON: TECHNICAL ESCALATION & KNOWLEDGE LOOP ===
    ctx.font = 'bold 24px "Inter", sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText('TECHNICAL ESCALATION & KNOWLEDGE HARVESTER', 40, 160)

    // Bridge Status Badge
    ctx.fillStyle = '#6366f1'
    ctx.beginPath(); ctx.roundRect(750, 136, 230, 32, 16); ctx.fill()
    ctx.font = 'bold 13px "Inter", sans-serif'; ctx.fillStyle = '#ffffff'
    ctx.fillText('● WA MANAGEMENT BRIDGE', 768, 157)

    // 3 KPI Cards
    const cards = [
      { label: 'ESCALATED TICKETS', value: '12 Tiket', sub: '3 Pending Management', grad: ['#4f46e5', '#6366f1'] },
      { label: 'INTERNAL WA GROUP', value: 'Connected', sub: '24 Lead Engineers', grad: ['#7c3aed', '#a855f7'] },
      { label: 'HARVESTED Q&A', value: '148 Pairs', sub: 'Vector DB Synced', grad: ['#0284c7', '#38bdf8'] }
    ]

    cards.forEach((c, i) => {
      const x = 40 + i * 315
      const grad = ctx.createLinearGradient(x, 185, x + 300, 305)
      grad.addColorStop(0, c.grad[0])
      grad.addColorStop(1, c.grad[1])

      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.roundRect(x, 185, 300, 110, 14)
      ctx.fill()

      ctx.font = 'bold 13px "Inter", sans-serif'; ctx.fillStyle = '#ffffff'
      ctx.fillText(c.label, x + 18, 216)

      ctx.font = 'bold 32px "Inter", sans-serif'
      ctx.fillText(c.value, x + 18, 258)

      ctx.font = '13px "Inter", sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.85)'
      ctx.fillText(c.sub, x + 18, 282)
    })

    // Left Panel: WhatsApp Group Internal Stream
    ctx.fillStyle = '#151733'
    ctx.beginPath()
    ctx.roundRect(40, 315, 520, 275, 14)
    ctx.fill()

    ctx.font = 'bold 17px "Inter", sans-serif'; ctx.fillStyle = '#a5b4fc'
    ctx.fillText('💬 Internal WA Group: "Orin Lead Engineers"', 65, 350)

    const chatItems = [
      { sender: 'Watson', msg: '🚨 #TIK-481: Anomali sinyal ECU error E-402 unit JKT-402', role: 'Watson Escalation', time: '14:20', col: '#818cf8' },
      { sender: 'Dimas (Lead)', msg: 'Gunakan protokol SMS restart: kirim "RESTART#402" ke no SIM unit.', role: 'Engineering Lead', time: '14:22', col: '#34d399' },
      { sender: 'Watson', msg: '✅ Jawaban diteruskan ke Sherloc & disuntikkan ke RAG Knowledge Base!', role: 'Watson Loop', time: '14:23', col: '#a5b4fc' }
    ]

    chatItems.forEach((item, idx) => {
      const cy = 370 + idx * 68
      ctx.fillStyle = '#1e2246'
      ctx.beginPath(); ctx.roundRect(60, cy, 480, 58, 10); ctx.fill()

      ctx.font = 'bold 12px "Inter", sans-serif'; ctx.fillStyle = item.col
      ctx.fillText(item.sender, 75, cy + 22)
      ctx.font = '10px "Inter", sans-serif'; ctx.fillStyle = '#94a3b8'
      ctx.fillText(`• ${item.role} (${item.time})`, 135, cy + 22)

      ctx.font = '13px "Inter", sans-serif'; ctx.fillStyle = '#f1f5f9'
      ctx.fillText(item.msg, 75, cy + 44)
    })

    // Right Panel: Knowledge Harvester / Vector DB Loop
    ctx.fillStyle = '#151733'
    ctx.beginPath()
    ctx.roundRect(585, 315, 395, 275, 14)
    ctx.fill()

    ctx.font = 'bold 17px "Inter", sans-serif'; ctx.fillStyle = '#a5b4fc'
    ctx.fillText('🧠 Knowledge Ingestion Vector Store', 610, 350)

    const vectors = [
      { q: 'Solusi Lampu Merah Kedip E-402', cat: 'FIRMWARE', score: '0.96 Sim' },
      { q: 'Verifikasi Pelanggan Orin Pasca Bayar', cat: 'BILLING', score: '0.94 Sim' },
      { q: 'Sinkronisasi Ulang Geofence Radar', cat: 'TELEMETRY', score: '0.91 Sim' }
    ]

    vectors.forEach((v, idx) => {
      const vy = 375 + idx * 64
      ctx.fillStyle = '#1e2246'
      ctx.beginPath(); ctx.roundRect(605, vy, 355, 52, 10); ctx.fill()

      ctx.font = 'bold 11px "Courier New", monospace'; ctx.fillStyle = '#c084fc'
      ctx.fillText(`[${v.cat}]`, 620, vy + 22)

      ctx.font = 'bold 13px "Inter", sans-serif'; ctx.fillStyle = '#ffffff'
      ctx.fillText(v.q, 620, vy + 42)

      ctx.font = 'bold 12px "Inter", sans-serif'; ctx.fillStyle = '#34d399'
      ctx.fillText(v.score, 885, vy + 32)
    })

  } else if (type === 'sherloc') {
    // === SHERLOC: FRONTLINE WHATSAPP & CUSTOMER DESK ===
    ctx.font = 'bold 24px "Inter", sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText('WHATSAPP CUSTOMER FRONTLINE & LIVE DISPATCH', 40, 160)

    // Single Communicator Badge
    ctx.fillStyle = '#f59e0b'
    ctx.beginPath(); ctx.roundRect(740, 136, 240, 32, 16); ctx.fill()
    ctx.font = 'bold 13px "Inter", sans-serif'; ctx.fillStyle = '#000000'
    ctx.fillText('● SINGLE COMMUNICATOR', 760, 157)

    // 3 KPI Cards
    const cards = [
      { label: 'ACTIVE INBOUND CHATS', value: '38 Sesi', sub: 'Avg Reply: 3.8s', grad: ['#d97706', '#f59e0b'] },
      { label: 'VERIFIED USERS', value: '96.2%', sub: 'Pelanggan Orin Aktif', grad: ['#b45309', '#ea580c'] },
      { label: 'DELEGATION RATE', value: '18 Tiket', sub: 'Nara (GPS) & Watson', grad: ['#c2410c', '#e11d48'] }
    ]

    cards.forEach((c, i) => {
      const x = 40 + i * 315
      const grad = ctx.createLinearGradient(x, 185, x + 300, 305)
      grad.addColorStop(0, c.grad[0])
      grad.addColorStop(1, c.grad[1])

      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.roundRect(x, 185, 300, 110, 14)
      ctx.fill()

      ctx.font = 'bold 13px "Inter", sans-serif'; ctx.fillStyle = '#ffffff'
      ctx.fillText(c.label, x + 18, 216)

      ctx.font = 'bold 32px "Inter", sans-serif'
      ctx.fillText(c.value, x + 18, 258)

      ctx.font = '13px "Inter", sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.85)'
      ctx.fillText(c.sub, x + 18, 282)
    })

    // Left Panel: Real-Time WhatsApp Inbound Feed
    ctx.fillStyle = '#221a08'
    ctx.beginPath()
    ctx.roundRect(40, 315, 520, 275, 14)
    ctx.fill()

    ctx.font = 'bold 17px "Inter", sans-serif'; ctx.fillStyle = '#fde68a'
    ctx.fillText('📲 WhatsApp Customer Live Stream', 65, 350)

    const chats = [
      { name: 'Budi Santoso', phone: '+62 812-8899-1234', text: 'Unit B-1842-KZA offline dari kemarin, tolong dicek!', tag: 'ORIN USER', tagCol: '#10b981' },
      { name: 'Siti Rahma', phone: '+62 813-7766-5544', text: 'Tanya diskon paket 5 unit armada truk ekspedisi...', tag: 'CALON', tagCol: '#38bdf8' },
      { name: 'Hendra W.', phone: '+62 856-1122-3344', text: 'Lampu GPS kedip merah cepat error code E-402', tag: 'ESKALASI', tagCol: '#f43f5e' }
    ]

    chats.forEach((c, idx) => {
      const cy = 370 + idx * 68
      ctx.fillStyle = '#2f240e'
      ctx.beginPath(); ctx.roundRect(60, cy, 480, 58, 10); ctx.fill()

      ctx.font = 'bold 13px "Inter", sans-serif'; ctx.fillStyle = '#ffffff'
      ctx.fillText(`${c.name} (${c.phone})`, 75, cy + 22)

      ctx.fillStyle = c.tagCol
      ctx.beginPath(); ctx.roundRect(430, cy + 8, 95, 20, 5); ctx.fill()
      ctx.font = 'bold 10px "Inter", sans-serif'; ctx.fillStyle = '#000000'
      ctx.fillText(c.tag, 442, cy + 22)

      ctx.font = '13px "Inter", sans-serif'; ctx.fillStyle = '#fef08a'
      ctx.fillText(c.text, 75, cy + 45)
    })

    // Right Panel: Frontline Dispatch Pipeline
    ctx.fillStyle = '#221a08'
    ctx.beginPath()
    ctx.roundRect(585, 315, 395, 275, 14)
    ctx.fill()

    ctx.font = 'bold 17px "Inter", sans-serif'; ctx.fillStyle = '#fde68a'
    ctx.fillText('⚡ Dispatch & Delegation Actions', 610, 350)

    const actions = [
      { act: 'FAQ Knowledge Match', sub: 'Paket Orin Fleets 2026 (98% confidence)', icon: '📖', col: '#10b981' },
      { act: 'Delegasi ke Nara', sub: 'Scan Telemetri Unit B-1842-KZA', icon: '📡', col: '#38bdf8' },
      { act: 'Eskalasi ke Watson', sub: 'Tiket Firmware ECU Error E-402', icon: '⚡', col: '#a855f7' }
    ]

    actions.forEach((a, idx) => {
      const ay = 375 + idx * 64
      ctx.fillStyle = '#2f240e'
      ctx.beginPath(); ctx.roundRect(605, ay, 355, 52, 10); ctx.fill()

      ctx.font = '16px "Inter", sans-serif'; ctx.fillText(a.icon, 620, ay + 33)
      ctx.font = 'bold 13px "Inter", sans-serif'; ctx.fillStyle = a.col
      ctx.fillText(a.act, 650, ay + 23)
      ctx.font = '11px "Inter", sans-serif'; ctx.fillStyle = '#e2e8f0'
      ctx.fillText(a.sub, 650, ay + 42)
    })

  } else {
    // === TEAM / DEFAULT BACKUP: CODE IDE ===
    ctx.font = 'bold 26px "Inter", sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText('DEV WORKSPACE — VIRTUAL OFFICE CLUSTER', 40, 160)

    ctx.fillStyle = '#1e1f38'
    ctx.beginPath()
    ctx.roundRect(40, 185, 940, 405, 14)
    ctx.fill()

    ctx.fillStyle = '#2b2d4f'
    ctx.fillRect(40, 185, 940, 40)
    ctx.font = '14px "Inter", sans-serif'; ctx.fillStyle = '#f8fafc'
    ctx.fillText('agent_pipeline.py  ×', 65, 210)
    ctx.fillStyle = '#94a3b8'
    ctx.fillText('OfficeScene.jsx', 230, 210)
    ctx.fillText('terminal', 380, 210)
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

  // Generate textures for all 5 agent workstations & frontline
  const sherlocTexture = useMemo(() => createBrowserTexture('sherloc'), [])
  const watsonTexture = useMemo(() => createBrowserTexture('watson'), [])
  const velociaTexture = useMemo(() => createBrowserTexture('velocia'), [])
  const scoutTexture = useMemo(() => createBrowserTexture('scout'), [])
  const naraTexture = useMemo(() => createBrowserTexture('nara'), [])

  // Create glowing emissive materials with polygonOffset to guarantee visibility in front of monitor/laptop mesh
  const sherlocMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: sherlocTexture,
        emissiveMap: sherlocTexture,
        emissive: new THREE.Color('#ffffff'),
        emissiveIntensity: 0.85,
        roughness: 0.15,
        metalness: 0.05,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        polygonOffsetUnits: -4
      }),
    [sherlocTexture]
  )

  const watsonMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: watsonTexture,
        emissiveMap: watsonTexture,
        emissive: new THREE.Color('#ffffff'),
        emissiveIntensity: 0.85,
        roughness: 0.15,
        metalness: 0.05,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        polygonOffsetUnits: -4
      }),
    [watsonTexture]
  )

  const velociaMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: velociaTexture,
        emissiveMap: velociaTexture,
        emissive: new THREE.Color('#ffffff'),
        emissiveIntensity: 0.85,
        roughness: 0.15,
        metalness: 0.05,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        polygonOffsetUnits: -4
      }),
    [velociaTexture]
  )

  const scoutMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: scoutTexture,
        emissiveMap: scoutTexture,
        emissive: new THREE.Color('#ffffff'),
        emissiveIntensity: 0.85,
        roughness: 0.15,
        metalness: 0.05,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        polygonOffsetUnits: -4
      }),
    [scoutTexture]
  )

  const naraMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: naraTexture,
        emissiveMap: naraTexture,
        emissive: new THREE.Color('#ffffff'),
        emissiveIntensity: 0.85,
        roughness: 0.15,
        metalness: 0.05,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        polygonOffsetUnits: -4
      }),
    [naraTexture]
  )

  // Gentle, subtle emissive screen glow oscillation to make the active screens feel alive
  useFrame((state) => {
    const pulse = 0.85 + Math.sin(state.clock.elapsedTime * 2.5) * 0.06
    if (sherlocMat) sherlocMat.emissiveIntensity = pulse
    if (watsonMat) watsonMat.emissiveIntensity = pulse
    if (velociaMat) velociaMat.emissiveIntensity = pulse
    if (scoutMat) scoutMat.emissiveIntensity = pulse
    if (naraMat) naraMat.emissiveIntensity = pulse
  })

  // Quick lookup helper for selecting agents on screen click
  const sherlocAgent = agents.find((a) => a.id === 'sherloc')
  const watsonAgent = agents.find((a) => a.id === 'watson')
  const velociaAgent = agents.find((a) => a.id === 'velocia')
  const scoutAgent = agents.find((a) => a.id === 'scout')
  const naraAgent = agents.find((a) => a.id === 'nara')

  // Exact monitor screen surface coordinates attached cleanly onto monitor glass face
  // Desk 1 (Velocia): PC at [1.588, 0.504, -3.212], rot [0, Math.PI, 0] -> screen at [1.580, 0.805, -3.210]
  // Desk 2 (Scout):   PC at [3.359, 0.504, -3.212], rot [0, Math.PI, 0] -> screen at [3.351, 0.805, -3.210]
  // Desk 3 (Nara):    PC at [1.070, 0.504, -2.370], rot [0, 0, 0]       -> screen at [1.078, 0.805, -2.370]
  // Desk 4 (Watson):  PC at [2.840, 0.504, -2.370], rot [0, 0, 0]       -> screen at [2.848, 0.805, -2.370]
  // Front Desk (Sherloc): Laptop at [-4.164, 0.548, 3.995], rot [0, Math.PI, 0] -> screen at [-4.164, 0.725, 4.08]
  const screenWidth = 0.38
  const screenHeight = 0.25
  const laptopWidth = 0.34
  const laptopHeight = 0.22

  return (
    <group ref={groupRef}>
      {/* 1. Velocia's Screen (Desk 1) - Flush on monitor glass face */}
      <mesh
        position={[1.580, 0.805, -3.210]}
        rotation={[0, Math.PI, 0]}
        material={velociaMat}
        onClick={(e) => {
          e.stopPropagation()
          if (velociaAgent && onSelectAgent) onSelectAgent(velociaAgent)
        }}
      >
        <planeGeometry args={[screenWidth, screenHeight]} />
      </mesh>

      {/* 2. Scout's Screen (Desk 2) - Flush on monitor glass face */}
      <mesh
        position={[3.351, 0.805, -3.210]}
        rotation={[0, Math.PI, 0]}
        material={scoutMat}
        onClick={(e) => {
          e.stopPropagation()
          if (scoutAgent && onSelectAgent) onSelectAgent(scoutAgent)
        }}
      >
        <planeGeometry args={[screenWidth, screenHeight]} />
      </mesh>

      {/* 3. Nara's Screen (Desk 3) - Flush on monitor glass face */}
      <mesh
        position={[1.078, 0.805, -2.370]}
        rotation={[0, 0, 0]}
        material={naraMat}
        onClick={(e) => {
          e.stopPropagation()
          if (naraAgent && onSelectAgent) onSelectAgent(naraAgent)
        }}
      >
        <planeGeometry args={[screenWidth, screenHeight]} />
      </mesh>

      {/* 4. Watson's Screen (Desk 4, alongside Nara) - Escalation & Knowledge Harvester */}
      <mesh
        position={[2.848, 0.805, -2.370]}
        rotation={[0, 0, 0]}
        material={watsonMat}
        onClick={(e) => {
          e.stopPropagation()
          if (watsonAgent && onSelectAgent) onSelectAgent(watsonAgent)
        }}
      >
        <planeGeometry args={[screenWidth, screenHeight]} />
      </mesh>

      {/* 5. Sherloc's Front Desk Laptop Screen (Meja Resepsionis Utama) */}
      <mesh
        position={[-4.164, 0.725, 4.08]}
        rotation={[0.18, 0, 0]}
        material={sherlocMat}
        onClick={(e) => {
          e.stopPropagation()
          if (sherlocAgent && onSelectAgent) onSelectAgent(sherlocAgent)
        }}
      >
        <planeGeometry args={[laptopWidth, laptopHeight]} />
      </mesh>
    </group>
  )
}
