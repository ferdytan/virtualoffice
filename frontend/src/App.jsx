import React, { useState, useEffect } from 'react'
import OfficeScene from './components/OfficeScene'
import Sidebar from './components/Sidebar'
import KanbanBar from './components/KanbanBar'
import CallModal from './components/CallModal'
import AgentWorkspaceView from './components/AgentWorkspaceView'
import AgentCloseUpAvatar from './components/AgentCloseUpAvatar'
import SettingsPageView from './components/SettingsPageView'
import { GoogleMapsFloatingWidget } from './components/GoogleMapsViewControl'
import {
  RotateCcw,
  Palette,
  Settings,
  Layers,
  Zap,
  Bot
} from 'lucide-react'

// 5-Agent Collaborative Ecosystem: Frontline (Sherloc), Escalation (Watson), CS Telemetry (Nara), Marketing (Velocia), Research (Scout)
const INITIAL_AGENTS = [
  {
    id: 'sherloc',
    name: 'Sherloc',
    role: 'Frontline WhatsApp & Customer Face',
    role_badge: 'FRONTLINE CS (SHERLOC)',
    status: 'working',
    color: '#d97706',
    color_name: 'Warm Gold',
    position: [-4.5, 0.05, 2.65], // Zone 1: Frontline & CS Room
    rotation: [0, 0, 0],
    model: 'gpt-4o-mini',
    description: 'Satu-satunya Frontline Voice & Face WhatsApp customer. Memvalidasi nomor telepon/email pengguna, menjawab FAQ, serta mendelegasikan issue GPS ke Nara dan eskalasi teknis ke Watson.',
    quick_prompts: [
      'Simulasikan chat inbound WhatsApp pelanggan Orin',
      'Validasi nomor telepon pelanggan baru dan cek paket langganan',
      'Delegasikan pengecekan GPS offline ke Nara',
      'Eskalasi issue firmware anomali ke Watson'
    ]
  },
  {
    id: 'watson',
    name: 'Watson',
    role: 'Technical Escalation & Knowledge Loop',
    role_badge: 'TECH ANALYST (WATSON)',
    status: 'available',
    color: '#1d4ed8',
    color_name: 'Deep Navy',
    position: [-1.8, 0.05, -3.75], // Zone 2: Core Operations & Diagnostics Lab
    rotation: [0, 0, 0],
    model: 'gpt-4o-mini',
    description: 'Jembatan eskalasi teknis ke WhatsApp Group Tim Manajemen & Lead internal. Menerima solusi eskalasi dan secara otomatis memanen pasangan Q&A ke Knowledge Base / RAG.',
    quick_prompts: [
      'Tinjau tiket eskalasi menunggu respon tim manajemen',
      'Simulasikan balasan manajemen grup dan injeksi ke Knowledge Base',
      'Sinkronisasi knowledge base pasangan Q&A baru ke Sherloc'
    ]
  },
  {
    id: 'nara',
    name: 'Nara',
    role: 'CS & Offline Unit Reminder',
    role_badge: 'TELEMETRY CS (NARA)',
    status: 'working',
    color: '#38bdf8',
    color_name: 'Sky Blue',
    position: [0.6, 0.05, -3.75], // Zone 2: Core Operations & Telemetry Lab
    rotation: [0, 0, 0],
    model: 'gpt-4o-mini',
    description: 'Bertanggung jawab memantau telemetri GPS offline secara real-time dari Server Datacenter dan broadcast pengingat aman anti-banned (jitter random 15-45s & typing status).',
    quick_prompts: [
      'Cek unit offline yang membutuhkan eskalasi',
      'Kirim safe group broadcast dengan anti-banned delay',
      'Buat ringkasan status kesehatan unit hari ini'
    ]
  },
  {
    id: 'velocia',
    name: 'Velocia',
    role: 'Marketing Strategist & Lead',
    role_badge: 'STRATEGY LEAD (VELOCIA)',
    status: 'available',
    color: '#ef4444',
    color_name: 'Solid Red',
    position: [5.0, 0.05, 0.65], // Zone 4: Growth & Creative Workshop
    rotation: [0, 0, 0],
    model: 'gpt-4o-mini',
    description: 'Menelan log chat selesai dari Sherloc, menganalisis tren permintaan pasar (fuel sensor, mini GPS, promo bundling), dan merancang strategi pertumbuhan di depan papan presentasi.',
    quick_prompts: [
      'Analisis tren permintaan pasar dari log chat Sherloc',
      'Rancang strategi bundling produk Fuel Sensor & GPS Mini',
      'Delegasikan brief riset isu teknis berulang ke Scout'
    ]
  },
  {
    id: 'scout',
    name: 'Scout',
    role: 'Content Creator Manager & Strategic Copywriter',
    role_badge: 'CONTENT CREATOR (SCOUT)',
    status: 'available',
    color: '#f59e0b',
    color_name: 'Golden Amber',
    position: [6.2, 0.05, 0.65], // Zone 4: Growth & Creative Workshop
    rotation: [0, 0, 0],
    model: 'gpt-4o-mini',
    description: 'Content Creator Manager & Strategic Copywriter di ekosistem Orin. Meriset berita kriminalitas & logistik, menyusun strategi artikel konversi tinggi dengan tablet catatan kerja.',
    quick_prompts: [
      'Riset berita curanmor terkini & buat artikel: Mengapa Kunci Ganda Tak Lagi Cukup',
      'Buat artikel soft-selling: Kebocoran BBM armada logistik & solusi Fuel Sensor Orin',
      'Susun strategi artikel: Preventive maintenance vs risiko downtime armada truk'
    ]
  },
  {
    id: 'coo',
    name: 'COO',
    role: 'Chief Operating Officer & Executive Orchestrator',
    role_badge: 'EXECUTIVE LEAD (COO)',
    status: 'working',
    color: '#334155',
    color_name: 'Slate Executive',
    position: [5.4, 0.05, -3.78], // Zone 3: Executive & Coordination Office
    rotation: [0, 0, 0],
    model: 'gpt-4o-mini',
    description: 'Pimpinan operasional & master delegator Virtual Office Orin. Menerima instruksi Direktur via Telegram Bot pribadi, memecah tugas, mendelegasikannya ke spesialis, dan memantau dari ruang kerja eksekutif.',
    quick_prompts: [
      'Cek status Nara dan suruh Scout cari bahan artikel curanmor',
      'Instruksikan audit telemetri unit offline & evaluasi aturan CAM',
      'Minta Velocia kaji tren pasar dan Scout siapkan draf promosi BBM'
    ]
  }
]

// Real-time Kanban tasks mapping matching mission brief:
// IN PROGRESS: Sherloc responding live chat / Nara scanning units
// ON HOLD: Watson waiting for reply from WA Group Management
// DONE: Velocia analytics & Scout tutorial drafts complete
const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Live Chat WhatsApp: Validasi Akun #CUST-9821',
    agent_id: 'sherloc',
    agent_name: 'Sherloc',
    role_badge: 'FRONTLINE CS',
    status: 'IN PROGRESS',
    updated_at: 'Baru saja'
  },
  {
    id: 'task-2',
    title: 'Eskalasi Firmware ECU #TIK-481 ke Grup Manajemen',
    agent_id: 'watson',
    agent_name: 'Watson',
    role_badge: 'TECH ESCALATION',
    status: 'ON HOLD',
    updated_at: 'Menunggu Tim Lead'
  },
  {
    id: 'task-3',
    title: 'Safe Broadcast Anti-Banned: Scan 48 Unit GPS',
    agent_id: 'nara',
    agent_name: 'Nara',
    role_badge: 'REMINDER CS',
    status: 'IN PROGRESS',
    updated_at: 'Jitter 24s aktif'
  },
  {
    id: 'task-4',
    title: 'Rekap Tren Permintaan Pasar: Fuel Sensor & Mini GPS',
    agent_id: 'velocia',
    agent_name: 'Velocia',
    role_badge: 'MARKETING STRATEGIST',
    status: 'DONE',
    updated_at: 'Selesai dianalisis'
  },
  {
    id: 'task-5',
    title: 'Artikel: Maraknya Curanmor & Mengapa Kunci Ganda Tak Cukup',
    agent_id: 'scout',
    agent_name: 'Scout',
    role_badge: 'CONTENT STRATEGIST',
    status: 'DONE',
    updated_at: 'Draf terbit'
  },
  {
    id: 'task-6',
    title: 'Batch Injeksi Q&A Knowledge Harvester ke Vector DB',
    agent_id: 'watson',
    agent_name: 'Watson',
    role_badge: 'TECH ESCALATION',
    status: 'SCHEDULED',
    updated_at: 'Terjadwal 22:00'
  }
]

export default function App() {
  const [agents, setAgents] = useState(INITIAL_AGENTS)
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCallModalOpen, setIsCallModalOpen] = useState(false)
  const [scenerySettings, setScenerySettings] = useState(() => {
    try {
      const saved = localStorage.getItem('virtual_office_scenery_settings')
      if (saved) {
        const parsed = JSON.parse(saved)
        // Granite was removed per user request; default is 'white', or 'parquet'
        const cleanFloor = parsed.floorType === 'parquet' ? 'parquet' : 'white'
        return {
          theme: parsed.theme || 'colorful',
          floorType: cleanFloor,
          showNPC: parsed.showNPC !== false,
          showCoffeeCorner: parsed.showCoffeeCorner !== false
        }
      }
    } catch (e) {
      // ignore
    }
    return {
      theme: 'colorful', // 'colorful' | 'minimalist'
      floorType: 'white', // Default floor is now 'white' per user request
      showNPC: true,
      showCoffeeCorner: true
    }
  })

  const handleUpdateScenerySettings = (newSettings) => {
    setScenerySettings(newSettings)
    try {
      localStorage.setItem('virtual_office_scenery_settings', JSON.stringify(newSettings))
    } catch (e) {
      // ignore
    }
  }

  const [viewMode, setViewMode] = useState('office') // 'office' | 'agent_workspace'
  const [cameraViewMode, setCameraViewMode] = useState('isometric') // 'isometric' | 'top_down'
  const [cameraResetCounter, setCameraResetCounter] = useState(0)
  const [zoomTrigger, setZoomTrigger] = useState(null)
  const [backendStatus, setBackendStatus] = useState('checking')
  const [tasks, setTasks] = useState(INITIAL_TASKS)
  const [isKanbanOpen, setIsKanbanOpen] = useState(false)
  const [chatHistory, setChatHistory] = useState({
    sherloc: [],
    watson: [],
    nara: [],
    velocia: [],
    scout: []
  })
  const [isLoadingBrief, setIsLoadingBrief] = useState(false)

  const backendUrl = ''

  // Connect to SSE stream for live real-time task updates and poll health/agents
  useEffect(() => {
    let eventSource = null

    const setupSSE = () => {
      try {
        eventSource = new EventSource(`${backendUrl}/api/crew/tasks/stream`)
        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            if (data.tasks && Array.isArray(data.tasks)) {
              setTasks(data.tasks)
            }
            if (data.agents && Array.isArray(data.agents)) {
              setAgents((prev) =>
                prev.map((a) => {
                  const fresh = data.agents.find((fa) => fa.id === a.id)
                  return fresh ? { ...a, ...fresh } : a
                })
              )
            }
          } catch (e) {
            // Ignore parse errors on keepalive ping
          }
        }
        eventSource.onerror = () => {
          if (eventSource) eventSource.close()
        }
      } catch (err) {
        // Fallback to normal polling if SSE is unsupported
      }
    }

    const checkBackend = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/health`)
        if (res.ok) {
          const data = await res.json()
          setBackendStatus(data.crewai_available ? 'crewai_live' : 'connected')

          // Fetch fresh agents metadata
          const agentsRes = await fetch(`${backendUrl}/api/agents`)
          if (agentsRes.ok) {
            const agentsData = await agentsRes.json()
            if (agentsData.agents && agentsData.agents.length > 0) {
              setAgents((prev) =>
                prev.map((a) => {
                  const fresh = agentsData.agents.find((fa) => fa.id === a.id)
                  return fresh ? { ...a, ...fresh } : a
                })
              )
            }
          }

          // Fetch fresh tasks
          const tasksRes = await fetch(`${backendUrl}/api/tasks`)
          if (tasksRes.ok) {
            const tasksData = await tasksRes.json()
            const allTasks = Object.values(tasksData.columns).flat()
            if (allTasks.length > 0) {
              setTasks(allTasks)
            }
          }
        } else {
          setBackendStatus('demo')
        }
      } catch (err) {
        setBackendStatus('demo')
      }
    }

    checkBackend()
    setupSSE()
    const timer = setInterval(checkBackend, 12000)

    return () => {
      clearInterval(timer)
      if (eventSource) eventSource.close()
    }
  }, [])

  // Agent selection handler
  const handleSelectAgent = (agent) => {
    setSelectedAgent(agent)
    setIsSidebarOpen(!!agent)
  }

  const handleSelectAgentById = (agentId) => {
    const found = agents.find((a) => a.id.toLowerCase() === agentId?.toLowerCase())
    if (found) {
      handleSelectAgent(found)
    }
  }

  // Cycle to next agent when clicking top-left avatar
  const handleCycleAgent = () => {
    const currentIndex = agents.findIndex((a) => a.id === selectedAgent?.id)
    const nextIndex = (currentIndex + 1) % agents.length
    handleSelectAgent(agents[nextIndex])
  }

  // Handle updating agent 3D model (custom GLB upload or reset to default)
  const handleUpdateAgentModel = (agentId, modelUrl, modelName) => {
    setAgents((prev) =>
      prev.map((a) =>
        a.id === agentId
          ? {
              ...a,
              avatar_type: modelUrl ? 'custom' : 'default',
              custom_model_url: modelUrl,
              customModelUrl: modelUrl,
              custom_model_name: modelName
            }
          : a
      )
    )
    setSelectedAgent((prev) =>
      prev && prev.id === agentId
        ? {
            ...prev,
            avatar_type: modelUrl ? 'custom' : 'default',
            custom_model_url: modelUrl,
            customModelUrl: modelUrl,
            custom_model_name: modelName
          }
        : prev
    )
  }

  // Handle switching avatar preset type ('default' | 'boxhead' | 'custom')
  const handleSelectAvatarType = async (agentId, avatarType) => {
    setAgents((prev) =>
      prev.map((a) =>
        a.id === agentId
          ? { ...a, avatar_type: avatarType }
          : a
      )
    )
    setSelectedAgent((prev) =>
      prev && prev.id === agentId
        ? { ...prev, avatar_type: avatarType }
        : prev
    )

    try {
      await fetch(`/api/agents/${agentId}/avatar-type`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar_type: avatarType })
      })
    } catch (err) {
      console.warn('Failed to persist avatar_type to backend:', err)
    }
  }

  // Handle updating agent primary theme color
  const handleUpdateAgentColor = async (agentId, color) => {
    setAgents((prev) =>
      prev.map((a) =>
        a.id === agentId
          ? { ...a, color }
          : a
      )
    )
    setSelectedAgent((prev) =>
      prev && prev.id === agentId
        ? { ...prev, color }
        : prev
    )

    try {
      await fetch(`/api/agents/${agentId}/color`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ color })
      })
    } catch (err) {
      console.warn('Failed to persist color to backend:', err)
    }
  }

  // Handle updating agent availability status ('available' | 'working' | 'not_available')
  const handleUpdateAgentStatus = (agentId, status) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === agentId ? { ...a, status } : a))
    )
    setSelectedAgent((prev) =>
      prev && prev.id === agentId ? { ...prev, status } : prev
    )
  }

  // Active displayed agent in top-left panel (default to Sherloc as Frontline Voice)
  const displayedAgent = selectedAgent || agents.find((a) => a.id === 'sherloc') || agents[0]

  // Handle task brief submission
  const handleSendBrief = async (agentId, message) => {
    setIsLoadingBrief(true)
    if (agentId === 'scout') {
      handleUpdateAgentStatus('scout', 'working')
    }

    const tempTaskId = `task-${Date.now()}`
    const tempTask = {
      id: tempTaskId,
      title: message.length > 40 ? message.slice(0, 37) + '...' : message,
      agent_id: agentId,
      agent_name: selectedAgent?.name || agentId,
      status: 'IN PROGRESS',
      updated_at: 'Baru saja'
    }
    setTasks((prev) => [tempTask, ...prev])

    try {
      const res = await fetch(`${backendUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id: agentId, message })
      })

      if (res.ok) {
        const data = await res.json()
        setChatHistory((prev) => ({
          ...prev,
          [agentId]: [
            ...(prev[agentId] || []),
            { message: message, user: message, response: data.response, time: 'Baru saja', timestamp: 'Baru saja' }
          ]
        }))

        setTasks((prev) =>
          prev.map((t) =>
            t.id === tempTaskId ? { ...t, status: 'DONE', updated_at: 'Selesai' } : t
          )
        )
      } else {
        throw new Error('Chat API returned error')
      }
    } catch (err) {
      setTimeout(() => {
        let fallbackResponse = ''
        if (agentId === 'sherloc') {
          fallbackResponse = `🟡 [Sherloc Frontline Voice]\nPesan customer: "${message}" berhasil diproses.\n• Verifikasi: Pelanggan Orin Aktif\n• Status Tindakan: Dijawab via Knowledge Base SOP & tiket eskalasi sinkron dengan Watson.`
        } else if (agentId === 'watson') {
          fallbackResponse = `🟣 [Watson Technical Escalation & Knowledge Harvester]\nIsu: "${message}" diteruskan ke WhatsApp Group Tim Manajemen & Lead.\n• Solusi tersinkron dan pasangan Q&A baru berhasil diinjeksikan ke Vector DB / Knowledge Base.`
        } else if (agentId === 'nara') {
          fallbackResponse = `🚨 [Nara Telemetry Check]\nUnit scan selesai untuk instruksi: "${message}". Sistem online mencatat 45/48 unit berfungsi stabil, notifikasi ke teknisi telah diterbitkan via Safe Broadcast (anti-banned delay aktif).`
        } else if (agentId === 'velocia') {
          fallbackResponse = `🎯 [Velocia Growth Strategy]\nBrief "${message}" telah dipetakan ke dalam analisis tren permintaan pasar dari log chat Sherloc (permintaan fuel sensor & GPS tracker mini melonjak).`
        } else {
          fallbackResponse = `📰 **Scout Engine: Draf Copywriting Strategis**\n\n### 🎯 **Maraknya Aksi Curanmor di Area Parkir Terbuka: Pola Waktu Rawan dan Mengapa Kunci Ganda Saja Tak Lagi Cukup**\n*Gembok fisik dan kunci setang hanya menunda pencuri hitungan detik. Ketika proteksi mekanik gagal, pelacak digital tersembunyi menjadi jaring pengaman terakhir yang logis.*\n\n**1. Hook & Realita Lapangan:**\nLaporan curanmor kembali mendominasi berita radio Suara Surabaya dan Detik News. Pelaku hanya butuh 3—10 detik melumpuhkan kunci kontak motor di area parkir terbuka.\n\n**2. Bedah Modus & Akar Masalah:**\nKunci setang dan gembok fisik dengan mudah dilumpuhkan dengan kunci T baja modifikasi atau cairan kimia perontok. Kelemahan fatalnya: tidak ada peringatan seketika saat pembobolan terjadi.\n\n**3. Pilar Edukasi Preventif:**\nParkir di area terang ber-CCTV, gunakan gembok berbahan boron carbide, dan pasang pelacak digital independen.\n\n**4. Solusi Teknologi Orin:**\nORIN GPS Tracker dilengkapi Live Tracking Google Maps & Remote Engine Cut-Off untuk mematikan mesin dari jauh, serta ORIN Tag² plug-and-play Apple Find My.\n\n**5. Call-to-Action (CTA):**\nKonsultasikan kebutuhan pengamanan armada atau kendaraan Anda di orin.id sekarang juga.`
        }

        setChatHistory((prev) => ({
          ...prev,
          [agentId]: [
            ...(prev[agentId] || []),
            { message: message, user: message, response: fallbackResponse, time: 'Baru saja', timestamp: 'Baru saja' }
          ]
        }))

        setTasks((prev) =>
          prev.map((t) =>
            t.id === tempTaskId ? { ...t, status: 'DONE', updated_at: 'Selesai' } : t
          )
        )
      }, 900)
    } finally {
      setIsLoadingBrief(false)
      if (agentId === 'scout') {
        setTimeout(() => {
          handleUpdateAgentStatus('scout', 'available')
        }, 1200)
      }
    }
  }

  // Dedicated Scout Article Generation handler with 3D avatar & Kanban synchronization
  const handleScoutGenerateArticle = async (topic, customInstructions = '') => {
    setIsLoadingBrief(true)
    handleUpdateAgentStatus('scout', 'working')

    const tempTaskId = `task-${Date.now()}`
    const cleanTopic = topic || 'curanmor'
    const tempTask = {
      id: tempTaskId,
      title: `Riset Berita & Draf Artikel: ${cleanTopic.length > 22 ? cleanTopic.slice(0, 19) + '...' : cleanTopic}`,
      agent_id: 'scout',
      agent_name: 'Scout',
      role_badge: 'CONTENT STRATEGIST',
      status: 'IN PROGRESS',
      updated_at: 'Baru saja'
    }
    setTasks((prev) => [tempTask, ...prev])

    try {
      const res = await fetch(`${backendUrl}/api/scout/generate-article`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: cleanTopic, custom_instructions: customInstructions })
      })

      if (res.ok) {
        const article = await res.json()
        const sources = article.harvested_sources || []
        const sourcesText = sources.map((s) => `${s.source}`).slice(0, 3).join(', ')

        const formattedResponse = `📰 **Scout Engine: Draf Copywriting Strategis Selesai**\n\n### 🎯 **${article.title}**\n*${article.excerpt}*\n\n**1. Hook & Realita Lapangan:**\n${article.hook}\n\n**2. Bedah Modus & Celah Masalah:**\n${article.problem_analysis}\n\n**3. Pilar Edukasi Preventif Objektif:**\n${article.educational_solution}\n\n**4. Solusi Teknologi & Soft-Selling Orin:**\n${article.soft_selling}\n\n**5. Call-to-Action (CTA):**\n${article.cta}\n\n---\n📊 **Metadata SEO & Distribusi:**\n• **Kategori**: \`${article.category}\` | **Estimasi Baca**: \`${article.read_time}\`\n• **Target Keywords**: \`${(article.keywords || []).slice(0, 4).join(', ')}\`\n• **Rujukan Berita Aktual Terpantau**: ${sourcesText || 'Detik News, Suara Surabaya, Pilar Media'}\n\n*(Draf naskah lengkap telah disinkronkan ke tab Articles Scout dan siap disalin/diterbitkan)*`

        setChatHistory((prev) => ({
          ...prev,
          scout: [
            ...(prev.scout || []),
            {
              message: `Riset Berita & Tulis Artikel: ${cleanTopic}`,
              user: `Riset Berita & Tulis Artikel: ${cleanTopic}`,
              response: formattedResponse,
              time: 'Baru saja',
              timestamp: 'Baru saja',
              article: article
            }
          ]
        }))

        setTasks((prev) =>
          prev.map((t) =>
            t.id === tempTaskId ? { ...t, status: 'DONE', updated_at: 'Selesai' } : t
          )
        )
      } else {
        throw new Error('Gagal memanggil Scout API')
      }
    } catch (err) {
      console.warn('Scout generate article error, calling brief fallback:', err)
      await handleSendBrief('scout', `Riset berita dan buat naskah artikel tentang ${cleanTopic}`)
    } finally {
      setIsLoadingBrief(false)
      setTimeout(() => {
        handleUpdateAgentStatus('scout', 'available')
      }, 1200)
    }
  }

  const handleOpenCall = (agent) => {
    setSelectedAgent(agent)
    setIsCallModalOpen(true)
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#eef2f6]">
      {/* --- TOP HEADER OVERLAY (OFFICE VIEW ONLY) --- */}
      {viewMode === 'office' && (
        <>
          <header className="fixed top-3 left-3 right-3 sm:top-4 sm:left-6 sm:right-6 z-30 pointer-events-none flex items-center justify-between gap-3">
            {/* Left: Brand & Focused Agent Badge */}
            <div className="pointer-events-auto flex items-center gap-2.5 bg-white/90 backdrop-blur-xl px-3 py-1.5 rounded-2xl shadow-lg border border-slate-200/80 hover:shadow-xl transition-all">
              <AgentCloseUpAvatar
                agent={displayedAgent}
                size={38}
                showStatus={true}
                onClick={handleCycleAgent}
              />
              <div className="flex flex-col justify-center min-w-0 pr-1">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-xs font-black text-slate-900 tracking-tight">ORIN OFFICE</h1>
                  <span
                    className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full text-white shadow-2xs tracking-wide shrink-0"
                    style={{ backgroundColor: displayedAgent.color }}
                  >
                    {displayedAgent.name}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium truncate flex items-center gap-1">
                  <span>{displayedAgent.role_badge || displayedAgent.role}</span>
                  <span className="text-slate-300 hidden sm:inline">&bull;</span>
                  <span className="text-slate-400 font-normal hidden sm:inline">Klik untuk rotasi</span>
                </p>
              </div>
            </div>

            {/* Center: Quick Agent Switcher (Desktop/Tablet) */}
            <div className="pointer-events-auto hidden md:flex items-center gap-1 bg-white/90 backdrop-blur-xl p-1 rounded-2xl shadow-lg border border-slate-200/80">
              {agents.map((agent) => {
                const isCurrent = (selectedAgent?.id || displayedAgent?.id) === agent.id
                return (
                  <button
                    key={agent.id}
                    onClick={() => handleSelectAgent(agent)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: agent.color }}
                    />
                    <span>{agent.name}</span>
                  </button>
                )
              })}
            </div>

            {/* Right: Actions (Kanban, Local LLM Status, Settings, Reset Camera) */}
            <div className="pointer-events-auto flex items-center gap-2">
              {/* Kanban Toggle Button */}
              <button
                onClick={() => setIsKanbanOpen(!isKanbanOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-bold transition-all shadow-lg border cursor-pointer active:scale-95 ${
                  isKanbanOpen
                    ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-slate-900/20'
                    : 'bg-white/90 backdrop-blur-xl text-slate-700 hover:bg-white border-slate-200/80'
                }`}
                title="Buka / Tutup Workflow Kanban Board"
              >
                <Layers className="w-4 h-4 text-indigo-500" />
                <span className="hidden sm:inline font-extrabold">Kanban</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  isKanbanOpen ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-800'
                }`}>
                  {tasks.length}
                </span>
                {tasks.filter((t) => (t.status || '') === 'IN PROGRESS').length > 0 && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                )}
              </button>

              {/* Local LLM / Ollama Status Badge */}
              <div
                onClick={() => setViewMode('settings')}
                className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/80 cursor-pointer hover:bg-white transition-all group"
                title="Local AI Engine: Gemma 3 (12B) Online via Ollama. Klik untuk membuka pengaturan."
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                  Ollama (12B)
                </span>
              </div>

              {/* Settings Page Button (Gear icon) */}
              <button
                onClick={() => setViewMode('settings')}
                className="p-2.5 bg-white/90 backdrop-blur-xl hover:bg-white text-slate-600 hover:text-slate-900 rounded-2xl shadow-lg border border-slate-200/80 transition-all active:scale-95 cursor-pointer"
                title="Buka Pengaturan Sistem & Workspace"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Reset Camera View Button */}
              <button
                onClick={() => {
                  handleSelectAgent(null)
                  setCameraResetCounter((c) => c + 1)
                }}
                className="p-2.5 bg-white/90 backdrop-blur-xl hover:bg-white text-slate-600 hover:text-slate-900 rounded-2xl shadow-lg border border-slate-200/80 transition-all active:scale-95 cursor-pointer"
                title="Reset Posisi Kamera ke Default"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Floating Kanban Bar (Smooth animated dropdown beneath top-right Kanban menu button) */}
          {isKanbanOpen && (
            <div className="fixed top-16 sm:top-18 right-3 sm:right-6 z-30 w-80 sm:w-[380px] animate-in fade-in slide-in-from-top-3 duration-200">
              <KanbanBar
                tasks={tasks}
                onSelectAgentById={handleSelectAgentById}
                isExpanded={true}
                onClose={() => setIsKanbanOpen(false)}
              />
            </div>
          )}
        </>
      )}

      {/* If in Settings Page Mode, render the dedicated SettingsPageView */}
      {viewMode === 'settings' ? (
        <SettingsPageView
          scenerySettings={scenerySettings}
          onUpdateScenerySettings={handleUpdateScenerySettings}
          agents={agents}
          onUpdateAgentColor={handleUpdateAgentColor}
          onSelectAvatarType={handleSelectAvatarType}
          onBackToOffice={() => setViewMode('office')}
        />
      ) : viewMode === 'agent_workspace' ? (
        <AgentWorkspaceView
          agent={selectedAgent || agents[0]}
          agents={agents}
          onSelectAgent={handleSelectAgent}
          onBackToOffice={() => setViewMode('office')}
          onOpenCall={handleOpenCall}
          onSendBrief={handleSendBrief}
          onScoutGenerateArticle={handleScoutGenerateArticle}
          onSelectAvatarType={handleSelectAvatarType}
          onUpdateAgentModel={handleUpdateAgentModel}
          onUpdateAgentColor={handleUpdateAgentColor}
          onUpdateAgentStatus={handleUpdateAgentStatus}
        />
      ) : (
        <>
          {/* --- 3D OFFICE SCENE CANVAS --- */}
          <main className="w-full h-full">
            <OfficeScene
              agents={agents}
              selectedAgent={selectedAgent}
              onSelectAgent={handleSelectAgent}
              hideTooltip={isCallModalOpen || isSidebarOpen}
              scenerySettings={scenerySettings}
              cameraViewMode={cameraViewMode}
              resetKey={cameraResetCounter}
              zoomTrigger={zoomTrigger}
            />

            {/* --- GOOGLE MAPS FLOATING CONTROLS (RIGHT SIDE) --- */}
            {!isSidebarOpen && (
              <GoogleMapsFloatingWidget
                cameraViewMode={cameraViewMode}
                onToggleViewMode={() =>
                  setCameraViewMode((prev) => (prev === 'isometric' ? 'top_down' : 'isometric'))
                }
                onResetCamera={() => {
                  handleSelectAgent(null)
                  setCameraResetCounter((c) => c + 1)
                }}
                onZoomIn={() => setZoomTrigger({ action: 'in', id: Date.now() })}
                onZoomOut={() => setZoomTrigger({ action: 'out', id: Date.now() })}
              />
            )}
          </main>

          {/* --- SIDEBAR AGENT PROFILE & BRIEF --- */}
          {isSidebarOpen && selectedAgent && (
            <Sidebar
              agent={selectedAgent}
              onClose={() => {
                setIsSidebarOpen(false)
                setSelectedAgent(null)
              }}
              onOpenCall={handleOpenCall}
              onOpenDashboardModal={() => {
                setViewMode('agent_workspace')
                setIsSidebarOpen(false)
              }}
              onSendBrief={handleSendBrief}
              onScoutGenerateArticle={handleScoutGenerateArticle}
              chatHistory={chatHistory[selectedAgent.id] || []}
              isLoading={isLoadingBrief}
              onSelectAvatarType={handleSelectAvatarType}
              onUpdateAgentModel={handleUpdateAgentModel}
              onUpdateAgentColor={handleUpdateAgentColor}
              onUpdateAgentStatus={handleUpdateAgentStatus}
            />
          )}
        </>
      )}

      {/* --- INTERACTIVE TWO-WAY VOICE CALL MODAL --- */}
      {isCallModalOpen && (
        <CallModal
          agent={selectedAgent}
          isOpen={isCallModalOpen}
          onClose={() => setIsCallModalOpen(false)}
          backendUrl={backendUrl}
        />
      )}
    </div>
  )
}
