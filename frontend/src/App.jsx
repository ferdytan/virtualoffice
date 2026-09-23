import React, { useState, useEffect } from 'react'
import OfficeScene from './components/OfficeScene'
import Sidebar from './components/Sidebar'
import KanbanBar from './components/KanbanBar'
import CallModal from './components/CallModal'
import AgentCloseUpAvatar from './components/AgentCloseUpAvatar'
import {
  RotateCcw
} from 'lucide-react'

// Agent configurations matching 2x2 face-to-face collaborative office pod
const INITIAL_AGENTS = [
  {
    id: 'nara',
    name: 'Nara',
    role: 'CS & Offline Unit Reminder',
    role_badge: 'REMINDER CS',
    color: '#38bdf8',
    color_name: 'Sky Blue',
    position: [1.08, 0, -1.89],
    rotation: [0, Math.PI, 0], // Facing South (-Z), directly face-to-face with Velocia
    model: 'gpt-4o-mini',
    description: 'Bertanggung jawab memantau dan memberi notifikasi unit offline secara real-time.',
    quick_prompts: [
      'Cek unit offline yang membutuhkan eskalasi',
      'Kirim notifikasi pengingat ke teknisi lapangan',
      'Buat ringkasan status kesehatan unit hari ini'
    ]
  },
  {
    id: 'velocia',
    name: 'Velocia',
    role: 'Marketing Strategist & Lead',
    role_badge: 'MARKETING STRATEGIST',
    color: '#ef4444',
    color_name: 'Solid Red',
    position: [1.58, 0, -3.69],
    rotation: [0, 0, 0], // Facing North (+Z), directly face-to-face with Nara
    model: 'gpt-4o-mini',
    description: 'Bertanggung jawab merancang strategi kampanye dan mendelegasikan riset.',
    quick_prompts: [
      'Rancang strategi kampanye peluncuran fitur baru Q4',
      'Delegasikan brief riset kompetitor ke Scout',
      'Buat rencana A/B testing untuk landing page'
    ]
  },
  {
    id: 'scout',
    name: 'Scout',
    role: 'News Researcher & Writer',
    role_badge: 'RESEARCHER',
    color: '#22c55e',
    color_name: 'Solid Green',
    position: [3.35, 0, -3.69],
    rotation: [0, 0, 0], // Facing North (+Z) alongside Velocia
    model: 'gpt-4o-mini',
    description: 'Bertanggung jawab meriset tren industri dan menulis draf artikel/blog.',
    quick_prompts: [
      'Riset 3 tren AI Agent terbaru minggu ini',
      'Tulis draf artikel blog: Masa Depan Virtual Office 3D',
      'Kompilasi studi kasus implementasi LLM di workflow industri'
    ]
  }
]

const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Heartbeat Ping Audit Unit Regional',
    agent_id: 'nara',
    agent_name: 'Nara',
    status: 'IN PROGRESS',
    updated_at: 'Baru saja'
  },
  {
    id: 'task-2',
    title: 'Q4 Growth Campaign Blueprint',
    agent_id: 'velocia',
    agent_name: 'Velocia',
    status: 'SCHEDULED',
    updated_at: '10 mnt lalu'
  },
  {
    id: 'task-3',
    title: 'Benchmark Tren AI Spatial Workspace 2026',
    agent_id: 'scout',
    agent_name: 'Scout',
    status: 'DONE',
    updated_at: '1 jam lalu'
  },
  {
    id: 'task-4',
    title: 'Eskalasi Tiket #CS-8924 Unit Offline',
    agent_id: 'nara',
    agent_name: 'Nara',
    status: 'ON HOLD',
    updated_at: 'Menunggu teknisi'
  }
]

export default function App() {
  const [agents, setAgents] = useState(INITIAL_AGENTS)
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCallModalOpen, setIsCallModalOpen] = useState(false)
  const [backendStatus, setBackendStatus] = useState('checking')
  const [tasks, setTasks] = useState(INITIAL_TASKS)
  const [chatHistory, setChatHistory] = useState({
    nara: [],
    velocia: [],
    scout: []
  })
  const [isLoadingBrief, setIsLoadingBrief] = useState(false)

  const backendUrl = ''

  // Poll backend health and fetch agents / tasks
  useEffect(() => {
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
    const timer = setInterval(checkBackend, 15000)
    return () => clearInterval(timer)
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

  // Active displayed agent in top-left panel
  const displayedAgent = selectedAgent || agents.find((a) => a.id === 'velocia') || agents[0]

  // Handle task brief submission
  const handleSendBrief = async (agentId, message) => {
    setIsLoadingBrief(true)

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
            { user: message, response: data.response, time: 'Baru saja' }
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
        if (agentId === 'nara') {
          fallbackResponse = `🚨 [Nara Telemetry Check]\nUnit scan selesai untuk instruksi: "${message}". Sistem online mencatat 45/48 unit berfungsi stabil, notifikasi ke teknisi telah diterbitkan.`
        } else if (agentId === 'velocia') {
          fallbackResponse = `🎯 [Velocia Growth Strategy]\nBrief "${message}" telah dipetakan ke dalam rencana kampanye 4 fase. Tugas riset data telah didelegasikan ke Scout.`
        } else {
          fallbackResponse = `📰 [Scout Trend Research]\nSintesis informasi untuk "${message}" berhasil dikompilasi. Data tren dan draf artikel siap dipublikasikan.`
        }

        setChatHistory((prev) => ({
          ...prev,
          [agentId]: [
            ...(prev[agentId] || []),
            { user: message, response: fallbackResponse, time: 'Baru saja' }
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
    }
  }

  const handleOpenCall = (agent) => {
    setSelectedAgent(agent)
    setIsCallModalOpen(true)
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#eef2f6]">
      {/* --- TOP HEADER OVERLAY --- */}
      <header className="fixed top-0 left-0 right-0 z-30 pointer-events-none p-4 sm:p-6 flex items-center justify-between">
        {/* Top-Left Panel with Large Close-Up Avatar */}
        <div className="pointer-events-auto flex items-center gap-3.5 bg-white/95 backdrop-blur-xl p-2.5 pr-5 rounded-2xl shadow-xl border border-slate-200/80 hover:shadow-2xl transition-all">
          <AgentCloseUpAvatar
            agent={displayedAgent}
            size={52}
            showStatus={true}
            onClick={handleCycleAgent}
          />

          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black text-slate-900 tracking-tight">
                VIRTUAL OFFICE AI
              </h1>
              <span
                className="text-[10px] font-extrabold px-1.5 py-0.5 rounded text-white shadow-2xs tracking-wide"
                style={{ backgroundColor: displayedAgent.color }}
              >
                {displayedAgent.name}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-1.5 mt-0.5">
              <span>{displayedAgent.role_badge || displayedAgent.role}</span>
              <span className="text-slate-300">&bull;</span>
              <span className="text-slate-400 font-normal">Klik avatar untuk rotasi</span>
            </p>
          </div>
        </div>

        {/* Quick Agent Jump & Status */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Quick Agent Jump Buttons */}
          <div className="hidden md:flex items-center gap-1.5 bg-white/90 backdrop-blur-xl p-1.5 rounded-2xl shadow-lg border border-slate-200/80">
            {agents.map((agent) => {
              const isCurrent = selectedAgent?.id === agent.id
              return (
                <button
                  key={agent.id}
                  onClick={() => handleSelectAgent(agent)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: agent.color }}
                  />
                  {agent.name}
                </button>
              )
            })}
          </div>

          {/* Reset Camera View Button */}
          <button
            onClick={() => handleSelectAgent(null)}
            className="p-2.5 bg-white/90 backdrop-blur-xl hover:bg-white text-slate-600 hover:text-slate-900 rounded-2xl shadow-lg border border-slate-200/80 transition-all active:scale-95"
            title="Reset Posisi Kamera"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Backend Connection Status Badge */}
          <div className="flex items-center gap-2 px-3.5 py-2.5 bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/80">
            {backendStatus === 'crewai_live' ? (
              <>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold text-slate-800">
                  CrewAI Live
                </span>
              </>
            ) : backendStatus === 'connected' ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-slate-800">
                  Backend Connected
                </span>
              </>
            ) : (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-700">
                  Simulation Mode
                </span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* --- 3D OFFICE SCENE CANVAS --- */}
      <main className="w-full h-full">
        <OfficeScene
          agents={agents}
          selectedAgent={selectedAgent}
          onSelectAgent={handleSelectAgent}
        />
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
          onSendBrief={handleSendBrief}
          onUpdateAgentModel={handleUpdateAgentModel}
          onSelectAvatarType={handleSelectAvatarType}
          chatHistory={chatHistory[selectedAgent.id] || []}
          isLoading={isLoadingBrief}
        />
      )}

      {/* --- KANBAN STATUS BAR (BOTTOM) --- */}
      <KanbanBar
        tasks={tasks}
        onSelectAgentById={handleSelectAgentById}
      />

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
