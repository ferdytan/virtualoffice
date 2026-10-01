import React, { useState, useEffect } from 'react'
import {
  ArrowLeft,
  Palette,
  Bot,
  Coffee,
  Check,
  RotateCcw,
  Sliders,
  Settings,
  Bell,
  Cpu,
  Volume2,
  Shield,
  Layers,
  Sparkles,
  Server,
  Radio,
  Clock,
  UserCheck,
  Network,
  RefreshCw,
  Zap,
  Copy,
  CheckCircle2,
  AlertCircle,
  Send,
  Eye,
  EyeOff,
  Save,
  Key,
  ExternalLink,
  PlugZap
} from 'lucide-react'
import AgentFlowchartView from './AgentFlowchartView'

export default function SettingsPageView({
  scenerySettings,
  onUpdateScenerySettings,
  agents = [],
  onUpdateAgentColor,
  onSelectAvatarType,
  onBackToOffice
}) {
  const [activeTab, setActiveTab] = useState('integrations') // 'integrations' | 'scenery' | 'agents' | 'workflow' | 'telemetry' | 'system' | 'llm'
  const [selectedAgentId, setSelectedAgentId] = useState(agents[0]?.id || 'nara')

  // Notification / audio dummy preferences
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [pingInterval, setPingInterval] = useState('30s')
  const [waAutoEscalate, setWaAutoEscalate] = useState(true)

  // === INTEGRATIONS TAB STATE ===
  const [intLoading, setIntLoading] = useState(false)
  const [intSaving, setIntSaving] = useState(false)
  const [intToast, setIntToast] = useState(null) // { type: 'success'|'error', msg: '' }
  const [showBotToken, setShowBotToken] = useState(false)
  const [showOrinToken, setShowOrinToken] = useState(false)
  const [showOpenAiKey, setShowOpenAiKey] = useState(false)
  const [testingTelegram, setTestingTelegram] = useState(false)
  const [telegramTestResult, setTelegramTestResult] = useState(null)
  const [intSettings, setIntSettings] = useState({
    TELEGRAM_BOT_TOKEN: '',
    TELEGRAM_OWNER_CHAT_ID: '',
    ORIN_API_TOKEN: '',
    ORIN_API_URL: 'https://admin-api.orin.id/api/devices/offline',
    OPENAI_API_KEY: '',
    OLLAMA_BASE_URL: 'http://172.17.0.1:11434',
    OLLAMA_MODEL: 'gemma3:12b',
    LLM_PROVIDER: 'ollama',
    COO_AUTONOMY_LEVEL: 'full',
    NOTIFY_ON_TASK_DONE: true
  })
  const [intHas, setIntHas] = useState({}) // has_telegram_bot_token etc.

  // Local LLM / Ollama Engine state
  const [llmStatus, setLlmStatus] = useState(null)
  const [llmLoading, setLlmLoading] = useState(false)
  const [llmActiveModel, setLlmActiveModel] = useState('gemma3:12b')
  const [llmSwitching, setLlmSwitching] = useState(false)
  const [llmTestPrompt, setLlmTestPrompt] = useState('Jelaskan peran ORIN GPS Tracker dalam mendeteksi dan mencegah pencurian kendaraan secara ringkas.')
  const [llmTesting, setLlmTesting] = useState(false)
  const [llmTestResult, setLlmTestResult] = useState(null)
  const [copiedPromptId, setCopiedPromptId] = useState(false)

  const fetchLlmStatus = async () => {
    try {
      setLlmLoading(true)
      const res = await fetch('/api/llm/status')
      if (res.ok) {
        const data = await res.json()
        setLlmStatus(data)
        if (data.active_model) {
          setLlmActiveModel(data.active_model)
        }
      }
    } catch (err) {
      console.warn('Failed to fetch LLM status:', err)
    } finally {
      setLlmLoading(false)
    }
  }

  useEffect(() => {
    fetchLlmStatus()
    fetchIntSettings()
  }, [])

  // === INTEGRATION FETCH / SAVE / TEST ===
  const fetchIntSettings = async () => {
    try {
      setIntLoading(true)
      const res = await fetch('/api/settings')
      if (res.ok) {
        const data = await res.json()
        if (data.settings) {
          setIntSettings((prev) => ({ ...prev, ...data.settings }))
          setIntHas(
            Object.fromEntries(
              Object.entries(data.settings).filter(([k]) => k.startsWith('has_'))
            )
          )
        }
      }
    } catch (err) {
      console.warn('Failed to load integration settings:', err)
    } finally {
      setIntLoading(false)
    }
  }

  const handleSaveIntSettings = async () => {
    try {
      setIntSaving(true)
      setIntToast(null)
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(intSettings)
      })
      const data = await res.json()
      if (res.ok) {
        setIntToast({ type: 'success', msg: '✅ Pengaturan berhasil disimpan dan aktif seketika!' })
        if (data.settings) {
          setIntSettings((prev) => ({ ...prev, ...data.settings }))
        }
      } else {
        setIntToast({ type: 'error', msg: data.detail || 'Gagal menyimpan konfigurasi.' })
      }
    } catch (err) {
      setIntToast({ type: 'error', msg: `Koneksi ke backend gagal: ${err.message}` })
    } finally {
      setIntSaving(false)
      setTimeout(() => setIntToast(null), 5000)
    }
  }

  const handleTestTelegram = async () => {
    try {
      setTestingTelegram(true)
      setTelegramTestResult(null)
      const res = await fetch('/api/settings/telegram/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bot_token: intSettings.TELEGRAM_BOT_TOKEN || undefined,
          owner_chat_id: intSettings.TELEGRAM_OWNER_CHAT_ID || undefined
        })
      })
      const data = await res.json()
      if (res.ok) {
        setTelegramTestResult({ success: true, message: data.detail?.message || 'Pesan uji coba berhasil dikirim ke Telegram Owner!' })
      } else {
        setTelegramTestResult({ success: false, message: data.detail || 'Gagal memverifikasi koneksi Telegram.' })
      }
    } catch (err) {
      setTelegramTestResult({ success: false, message: `Koneksi gagal: ${err.message}` })
    } finally {
      setTestingTelegram(false)
    }
  }

  const handleSwitchModel = async (modelName) => {
    try {
      setLlmSwitching(true)
      const res = await fetch('/api/llm/switch-model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: modelName })
      })
      if (res.ok) {
        setLlmActiveModel(modelName)
        fetchLlmStatus()
      }
    } catch (err) {
      console.error('Failed to switch model:', err)
    } finally {
      setLlmSwitching(false)
    }
  }

  const handleRunLlmTest = async () => {
    if (!llmTestPrompt.trim()) return
    try {
      setLlmTesting(true)
      setLlmTestResult(null)
      const res = await fetch('/api/llm/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: llmTestPrompt, model: llmActiveModel })
      })
      const data = await res.json()
      setLlmTestResult(data)
    } catch (err) {
      console.error('Test prompt failed:', err)
      setLlmTestResult({ success: false, error: String(err) })
    } finally {
      setLlmTesting(false)
    }
  }

  const isColorful = scenerySettings.theme === 'colorful'

  const handleToggleScenery = (key) => {
    onUpdateScenerySettings({
      ...scenerySettings,
      [key]: !scenerySettings[key]
    })
  }

  const handleSelectTheme = (theme) => {
    onUpdateScenerySettings({
      ...scenerySettings,
      theme
    })
  }

  const handleSelectFloor = (floorType) => {
    onUpdateScenerySettings({
      ...scenerySettings,
      floorType
    })
  }

  const handleResetScenery = () => {
    onUpdateScenerySettings({
      theme: 'colorful',
      floorType: 'white', // Default is white per user request
      showNPC: true,
      showCoffeeCorner: true
    })
  }

  const currentAgent = agents.find((a) => a.id === selectedAgentId) || agents[0]

  const PRESET_COLORS = [
    { name: 'Sky Blue', hex: '#38bdf8' },
    { name: 'Emerald', hex: '#10b981' },
    { name: 'Violet', hex: '#8b5cf6' },
    { name: 'Coral Red', hex: '#ef4444' },
    { name: 'Amber Gold', hex: '#f59e0b' },
    { name: 'Cyan Neon', hex: '#06b6d4' },
    { name: 'Dark Slate', hex: '#1e293b' },
    { name: 'Magenta Pink', hex: '#ec4899' }
  ]

  return (
    <div className="h-screen w-full flex flex-col bg-slate-100 overflow-hidden select-none animate-in fade-in duration-150">
      {/* --- TOP SETTINGS NAVIGATION BAR --- */}
      <header className="h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          {/* Back to 3D Office Button */}
          <button
            onClick={onBackToOffice}
            className="flex items-center gap-1.5 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
            title="Kembali ke Ruang Kantor 3D"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
            <span>Kembali ke Ruang Kantor 3D</span>
          </button>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* Breadcrumb Title */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Virtual Office</span>
            <span>/</span>
            <span className="text-slate-900 font-extrabold flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-slate-700" />
              Pusat Pengaturan Sistem & Workspace
            </span>
          </div>
        </div>

        {/* Right Status Badge */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Pengaturan tersimpan otomatis</span>
        </div>
      </header>

      {/* --- SETTINGS BODY: LEFT SIDEBAR TABS / RIGHT CONTENT --- */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Category Navigation */}
        <aside className="w-64 lg:w-72 shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-y-auto">
          {/* Natural Sidebar Header with Breathing Room */}
          <div className="p-5 pb-3.5 border-b border-slate-100">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
              Panel Konfigurasi
            </span>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-700 shrink-0">
                <Sliders className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-black text-slate-900 leading-tight truncate">
                  Pusat Pengaturan
                </h3>
                <span className="text-[10px] text-slate-400 font-medium block">
                  Virtual Office & AI
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3.5 space-y-1.5 flex-1">
            {/* Tab 0: Integrasi & Gateway (NEW - FEATURED) */}
            <button
              onClick={() => setActiveTab('integrations')}
              className={`w-full p-3 rounded-2xl text-left transition-all cursor-pointer flex items-center gap-3 ${
                activeTab === 'integrations'
                  ? 'bg-sky-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:bg-sky-50 font-medium border border-sky-100'
              }`}
            >
              <PlugZap className={`w-4 h-4 shrink-0 ${activeTab === 'integrations' ? 'text-amber-300' : 'text-sky-500'}`} />
              <div className="text-xs min-w-0">
                <div className="font-bold truncate flex items-center gap-1.5">
                  Integrasi & Gateway
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${activeTab === 'integrations' ? 'bg-white/20 text-white' : 'bg-sky-100 text-sky-700'}`}>
                    NEW
                  </span>
                </div>
                <div className={`text-[10px] truncate ${activeTab === 'integrations' ? 'text-sky-100' : 'text-slate-400'}`}>
                  Telegram Bot, API Keys, COO
                </div>
              </div>
            </button>

            {/* Tab 1: Suasana & Visual 3D */}
            <button
              onClick={() => setActiveTab('scenery')}
              className={`w-full p-3 rounded-2xl text-left transition-all cursor-pointer flex items-center gap-3 ${
                activeTab === 'scenery'
                  ? 'bg-slate-900 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:bg-slate-50 font-medium'
              }`}
            >
              <Palette className={`w-4 h-4 shrink-0 ${activeTab === 'scenery' ? 'text-amber-400' : 'text-slate-400'}`} />
              <div className="text-xs min-w-0">
                <div className="font-bold truncate">Suasana & Tema Ruang 3D</div>
                <div className={`text-[10px] truncate ${activeTab === 'scenery' ? 'text-slate-300' : 'text-slate-400'}`}>
                  Warna kantor, NPC, & mesin kopi
                </div>
              </div>
            </button>

            {/* Tab 2: Karakter & Avatar AI */}
            <button
              onClick={() => setActiveTab('agents')}
              className={`w-full p-3 rounded-2xl text-left transition-all cursor-pointer flex items-center gap-3 ${
                activeTab === 'agents'
                  ? 'bg-slate-900 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:bg-slate-50 font-medium'
              }`}
            >
              <UserCheck className={`w-4 h-4 shrink-0 ${activeTab === 'agents' ? 'text-sky-400' : 'text-slate-400'}`} />
              <div className="text-xs min-w-0">
                <div className="font-bold truncate">Profil & Karakter AI</div>
                <div className={`text-[10px] truncate ${activeTab === 'agents' ? 'text-slate-300' : 'text-slate-400'}`}>
                  Warna tema & bentuk 3D agent
                </div>
              </div>
            </button>

            {/* Tab 3: Alur Kerja & Koneksi Antar Agent */}
            <button
              onClick={() => setActiveTab('workflow')}
              className={`w-full p-3 rounded-2xl text-left transition-all cursor-pointer flex items-center gap-3 ${
                activeTab === 'workflow'
                  ? 'bg-slate-900 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:bg-slate-50 font-medium'
              }`}
            >
              <Network className={`w-4 h-4 shrink-0 ${activeTab === 'workflow' ? 'text-indigo-400' : 'text-slate-400'}`} />
              <div className="text-xs min-w-0">
                <div className="font-bold truncate">Alur Kerja & Koneksi Agent</div>
                <div className={`text-[10px] truncate ${activeTab === 'workflow' ? 'text-slate-300' : 'text-slate-400'}`}>
                  Flowchart Sherloc, Nara & Watson
                </div>
              </div>
            </button>

            {/* Tab 4: Telemetri & Notifikasi */}
            <button
              onClick={() => setActiveTab('telemetry')}
              className={`w-full p-3 rounded-2xl text-left transition-all cursor-pointer flex items-center gap-3 ${
                activeTab === 'telemetry'
                  ? 'bg-slate-900 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:bg-slate-50 font-medium'
              }`}
            >
              <Radio className={`w-4 h-4 shrink-0 ${activeTab === 'telemetry' ? 'text-emerald-400' : 'text-slate-400'}`} />
              <div className="text-xs min-w-0">
                <div className="font-bold truncate">Telemetri & Notifikasi</div>
                <div className={`text-[10px] truncate ${activeTab === 'telemetry' ? 'text-slate-300' : 'text-slate-400'}`}>
                  Interval ping & eskalasi WA
                </div>
              </div>
            </button>

            {/* Tab 5: Sistem & Audio */}
            <button
              onClick={() => setActiveTab('system')}
              className={`w-full p-3 rounded-2xl text-left transition-all cursor-pointer flex items-center gap-3 ${
                activeTab === 'system'
                  ? 'bg-slate-900 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:bg-slate-50 font-medium'
              }`}
            >
              <Cpu className={`w-4 h-4 shrink-0 ${activeTab === 'system' ? 'text-purple-400' : 'text-slate-400'}`} />
              <div className="text-xs min-w-0">
                <div className="font-bold truncate">Sistem & Audio</div>
                <div className={`text-[10px] truncate ${activeTab === 'system' ? 'text-slate-300' : 'text-slate-400'}`}>
                  Efek suara & integrasi API
                </div>
              </div>
            </button>

            {/* Tab 6: Local LLM Engine (Ollama) */}
            <button
              onClick={() => setActiveTab('llm')}
              className={`w-full p-3 rounded-2xl text-left transition-all cursor-pointer flex items-center gap-3 ${
                activeTab === 'llm'
                  ? 'bg-slate-900 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:bg-slate-50 font-medium'
              }`}
            >
              <Server className={`w-4 h-4 shrink-0 ${activeTab === 'llm' ? 'text-emerald-400' : 'text-slate-400'}`} />
              <div className="text-xs min-w-0">
                <div className="font-bold flex items-center gap-1.5">
                  <span className="truncate">LLM Engine (Ollama)</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                </div>
                <div className={`text-[10px] truncate ${activeTab === 'llm' ? 'text-slate-300' : 'text-slate-400'}`}>
                  Local AI • Zero Cloud Cost
                </div>
              </div>
            </button>
          </nav>

          {/* Sidebar Footer Info Card */}
          <div className="p-3.5 mt-auto">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Ollama Engine
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-white text-slate-700 rounded border border-slate-200 font-bold">
                  {llmActiveModel?.replace(':latest', '')}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Zero Cloud API Cost • 100% Private Data
              </p>
            </div>
          </div>
        </aside>

        {/* Right Main Content Panel */}
        <main className="flex-1 bg-slate-50/70 p-6 sm:p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">

            {/* ======================================================== */}
            {/* TAB 0: INTEGRASI & GATEWAY                               */}
            {/* ======================================================== */}
            {activeTab === 'integrations' && (
              <div className="space-y-6 animate-in fade-in duration-200">

                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                      <PlugZap className="w-5 h-5 text-sky-600" />
                      Integrasi & Gateway
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Kelola koneksi Telegram Bot, API Keys, dan protokol orkestrasi COO Agent.
                    </p>
                  </div>
                  {/* Toast */}
                  {intToast && (
                    <div className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold border animate-in fade-in duration-150 ${
                      intToast.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}>
                      {intToast.type === 'success'
                        ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                      <span>{intToast.msg}</span>
                    </div>
                  )}
                </div>

                {/* ── SECTION A: TELEGRAM BOT GATEWAY ── */}
                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-5">
                  {/* Section Header */}
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-2xl bg-sky-100 flex items-center justify-center shrink-0">
                      <Send className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">Telegram Bot Gateway</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Hubungkan bot Telegram agar COO menerima instruksi dan mengirimkan laporan proaktif langsung ke ponsel Owner.
                      </p>
                    </div>
                    {intHas.has_telegram_bot_token && (
                      <span className="ml-auto text-[10px] font-black text-emerald-700 bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Terkonfigurasi
                      </span>
                    )}
                  </div>

                  {/* N8N-style node flow visualization */}
                  <div className="p-4 bg-slate-950 rounded-2xl overflow-x-auto">
                    <div className="flex items-center gap-0 min-w-max">
                      {/* Node: Telegram */}
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-14 h-14 rounded-2xl bg-sky-500 flex items-center justify-center shadow-lg">
                          <Send className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-[10px] font-bold text-sky-400 text-center whitespace-nowrap">Telegram<br />Webhook</span>
                      </div>
                      {/* Arrow */}
                      <div className="flex items-center px-2 pb-5">
                        <div className="h-0.5 w-8 bg-sky-500/60" />
                        <div className="w-0 h-0 border-y-4 border-y-transparent border-l-8 border-l-sky-500/60" />
                      </div>
                      {/* Node: Security */}
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg">
                          <Shield className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-[10px] font-bold text-amber-400 text-center whitespace-nowrap">Validasi<br />Owner ID</span>
                      </div>
                      {/* Arrow */}
                      <div className="flex items-center px-2 pb-5">
                        <div className="h-0.5 w-8 bg-amber-500/60" />
                        <div className="w-0 h-0 border-y-4 border-y-transparent border-l-8 border-l-amber-500/60" />
                      </div>
                      {/* Node: COO */}
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg ring-2 ring-indigo-400/50">
                          <Bot className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-[10px] font-bold text-indigo-400 text-center whitespace-nowrap">COO<br />Orchestrator</span>
                      </div>
                      {/* Arrow */}
                      <div className="flex items-center px-2 pb-5">
                        <div className="h-0.5 w-8 bg-indigo-500/60" />
                        <div className="w-0 h-0 border-y-4 border-y-transparent border-l-8 border-l-indigo-500/60" />
                      </div>
                      {/* Nodes: Agents */}
                      <div className="flex flex-col gap-1.5">
                        {[
                          { label: 'Nara', color: 'bg-emerald-500' },
                          { label: 'Scout', color: 'bg-violet-500' },
                          { label: 'Watson', color: 'bg-orange-500' },
                        ].map(a => (
                          <div key={a.label} className={`px-3 py-1.5 rounded-xl ${a.color} text-white text-[10px] font-bold flex items-center gap-1.5 shadow`}>
                            <Zap className="w-3 h-3" /> {a.label}
                          </div>
                        ))}
                      </div>
                      {/* Arrow back */}
                      <div className="flex items-center px-2 pb-5">
                        <div className="h-0.5 w-8 bg-emerald-500/60" />
                        <div className="w-0 h-0 border-y-4 border-y-transparent border-l-8 border-l-emerald-500/60" />
                      </div>
                      {/* Node: Report */}
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg">
                          <Send className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400 text-center whitespace-nowrap">Laporan<br />ke Owner</span>
                      </div>
                    </div>
                  </div>

                  {/* Bot Token */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>TELEGRAM_BOT_TOKEN</span>
                      <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="text-[10px] text-sky-600 font-semibold flex items-center gap-1 hover:underline">
                        Buat via @BotFather <ExternalLink className="w-3 h-3" />
                      </a>
                    </label>
                    <div className="relative">
                      <input
                        type={showBotToken ? 'text' : 'password'}
                        value={intSettings.TELEGRAM_BOT_TOKEN || ''}
                        onChange={(e) => setIntSettings({ ...intSettings, TELEGRAM_BOT_TOKEN: e.target.value })}
                        placeholder="7123456789:AAHkLp..."
                        className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
                      />
                      <button type="button" onClick={() => setShowBotToken(!showBotToken)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showBotToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {intHas.has_telegram_bot_token && (
                      <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Token tersimpan di backend (isi ulang untuk mengganti)
                      </p>
                    )}
                  </div>

                  {/* Owner Chat ID */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>TELEGRAM_OWNER_CHAT_ID <span className="text-emerald-600">(Security Whitelist)</span></span>
                      <a href="https://t.me/userinfobot" target="_blank" rel="noreferrer" className="text-[10px] text-sky-600 font-semibold flex items-center gap-1 hover:underline">
                        Cek via @userinfobot <ExternalLink className="w-3 h-3" />
                      </a>
                    </label>
                    <input
                      type="text"
                      value={intSettings.TELEGRAM_OWNER_CHAT_ID || ''}
                      onChange={(e) => setIntSettings({ ...intSettings, TELEGRAM_OWNER_CHAT_ID: e.target.value })}
                      placeholder="Contoh: 123456789"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
                    />
                    <p className="text-[11px] text-slate-400">Hanya chat dari ID ini yang direspons. Pesan dari pihak lain otomatis ditolak.</p>
                  </div>

                  {/* Test Telegram Connection */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h5 className="text-xs font-black text-slate-900">Uji Koneksi Bot Telegram</h5>
                        <p className="text-[11px] text-slate-500">Kirim pesan ping ke ponsel Owner untuk verifikasi token.</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleTestTelegram}
                        disabled={testingTelegram}
                        className="py-2 px-4 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0 whitespace-nowrap"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${testingTelegram ? 'animate-spin' : ''}`} />
                        {testingTelegram ? 'Menguji...' : 'Test Connection'}
                      </button>
                    </div>
                    {telegramTestResult && (
                      <div className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                        telegramTestResult.success
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-rose-50 border-rose-200 text-rose-800'
                      }`}>
                        {telegramTestResult.success
                          ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
                        <div>
                          <p className="font-bold">{telegramTestResult.success ? 'Koneksi Sukses!' : 'Pengujian Gagal'}</p>
                          <p className="text-[11px] mt-0.5">{telegramTestResult.message}</p>
                        </div>
                      </div>
                    )}
                    {/* Webhook instruction */}
                    <div className="p-3 bg-slate-900 rounded-xl text-[10px] font-mono text-slate-300 space-y-1.5">
                      <div className="flex items-center justify-between text-slate-500 text-[9px] uppercase">
                        <span>Daftar Webhook ke Telegram (production)</span>
                        <span className="text-emerald-400 font-bold">POST</span>
                      </div>
                      <code className="text-emerald-300 block break-all">
                        curl -F "url=https://YOUR_DOMAIN/api/webhook/telegram" https://api.telegram.org/botYOUR_TOKEN/setWebhook
                      </code>
                    </div>
                  </div>
                </div>

                {/* ── SECTION B: API KEYS ── */}
                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-5">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
                      <Key className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">API Keys & LLM Engine</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">Token akses ke Orin Admin API dan konfigurasi model AI (cloud/lokal).</p>
                    </div>
                  </div>

                  {/* Orin API Token */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>ORIN_API_TOKEN</span>
                      <span className="text-[10px] text-sky-600 font-bold bg-sky-50 px-2 py-0.5 rounded">Live Telemetry</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showOrinToken ? 'text' : 'password'}
                        value={intSettings.ORIN_API_TOKEN || ''}
                        onChange={(e) => setIntSettings({ ...intSettings, ORIN_API_TOKEN: e.target.value })}
                        placeholder="20639|AwZwUDmpoUa2..."
                        className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition"
                      />
                      <button type="button" onClick={() => setShowOrinToken(!showOrinToken)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showOrinToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* OpenAI API Key */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>OPENAI_API_KEY <span className="text-slate-400 font-normal">(opsional, jika memakai cloud model)</span></span>
                    </label>
                    <div className="relative">
                      <input
                        type={showOpenAiKey ? 'text' : 'password'}
                        value={intSettings.OPENAI_API_KEY || ''}
                        onChange={(e) => setIntSettings({ ...intSettings, OPENAI_API_KEY: e.target.value })}
                        placeholder="sk-proj-..."
                        className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition"
                      />
                      <button type="button" onClick={() => setShowOpenAiKey(!showOpenAiKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showOpenAiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Ollama settings */}
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-emerald-700" />
                        <h5 className="text-xs font-bold text-emerald-950">Local LLM (Ollama)</h5>
                      </div>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">GRATIS • ZERO CLOUD</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Ollama Host URL</label>
                        <input
                          type="text"
                          value={intSettings.OLLAMA_BASE_URL || ''}
                          onChange={(e) => setIntSettings({ ...intSettings, OLLAMA_BASE_URL: e.target.value })}
                          placeholder="http://172.17.0.1:11434"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Model Default</label>
                        <input
                          type="text"
                          value={intSettings.OLLAMA_MODEL || ''}
                          onChange={(e) => setIntSettings({ ...intSettings, OLLAMA_MODEL: e.target.value })}
                          placeholder="gemma3:12b"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── SECTION C: COO PROTOCOL ── */}
                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-5">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center shrink-0">
                      <Shield className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">Protokol Delegasi COO</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">Atur level otonomi dan notifikasi dari COO Orchestrator.</p>
                    </div>
                  </div>

                  {/* Autonomy Level */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">Tingkat Otonomi Delegasi</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'full', label: 'Full Autonomous', desc: 'COO langsung eksekusi tanpa konfirmasi.' },
                        { value: 'supervised', label: 'Supervised / Review', desc: 'Menunggu persetujuan Direktur sebelum dispatch.' }
                      ].map(opt => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setIntSettings({ ...intSettings, COO_AUTONOMY_LEVEL: opt.value })}
                          className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                            intSettings.COO_AUTONOMY_LEVEL === opt.value
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <div className="font-bold text-xs flex items-center justify-between mb-1">
                            <span>{opt.label}</span>
                            {intSettings.COO_AUTONOMY_LEVEL === opt.value && <Check className="w-4 h-4 text-emerald-400" />}
                          </div>
                          <p className={`text-[10px] leading-relaxed ${intSettings.COO_AUTONOMY_LEVEL === opt.value ? 'text-slate-300' : 'text-slate-500'}`}>
                            {opt.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notify toggle */}
                  <div
                    onClick={() => setIntSettings({ ...intSettings, NOTIFY_ON_TASK_DONE: !intSettings.NOTIFY_ON_TASK_DONE })}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div>
                      <h6 className="text-xs font-bold text-slate-900">Notifikasi Proaktif ke Telegram</h6>
                      <p className="text-[11px] text-slate-500">Kirim laporan eksekutif setelah penugasan selesai.</p>
                    </div>
                    <div className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 shrink-0 ${intSettings.NOTIFY_ON_TASK_DONE ? 'bg-sky-600' : 'bg-slate-300'}`}>
                      <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${intSettings.NOTIFY_ON_TASK_DONE ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                  </div>
                </div>

                {/* SAVE BUTTON */}
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                    <span>Perubahan aktif tanpa restart server (Hot Reload)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveIntSettings}
                    disabled={intSaving || intLoading}
                    className="py-2.5 px-6 bg-sky-600 hover:bg-sky-500 text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
                  >
                    <Save className={`w-3.5 h-3.5 ${intSaving ? 'animate-spin' : ''}`} />
                    {intSaving ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
                  </button>
                </div>

              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 1: SUASANA & TEMA RUANG 3D                           */}
            {/* ======================================================== */}
            {activeTab === 'scenery' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                  <div>
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Palette className="w-5 h-5 text-slate-700" />
                      Pilihan Tema Suasana Ruang Kerja 3D
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Pilih gaya estetika perabotan dan pencahayaan yang diterapkan pada ruang kantor virtual Anda.
                    </p>
                  </div>

                  {/* Theme Option Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {/* Option A: Ruang Berwarna (Vibrant Modern) */}
                    <div
                      onClick={() => handleSelectTheme('colorful')}
                      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        isColorful
                          ? 'border-slate-900 bg-amber-50/30 shadow-md ring-2 ring-slate-900/10'
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-2xl">🎨</span>
                          {isColorful && (
                            <span className="flex items-center gap-1 text-[10px] font-extrabold text-slate-900 bg-slate-200/80 px-2.5 py-0.5 rounded-full">
                              <Check className="w-3 h-3 text-slate-900" />
                              Sedang Digunakan
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-black text-slate-900 mb-1">
                          Ruang Berwarna (Vibrant Modern)
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Aksen kayu hangat (*warm oak & walnut*), bantalan kursi desainer warna-warni (*coral, mint, sky blue*), sofa cozy, dan tanaman hijau cerah.
                        </p>
                      </div>

                      <div className="mt-4 flex items-center gap-1.5 pt-2 border-t border-slate-100">
                        <span className="w-3.5 h-3.5 rounded-full bg-[#d4bf9c]" title="Scandinavian Oak" />
                        <span className="w-3.5 h-3.5 rounded-full bg-[#f87171]" title="Coral Cushion" />
                        <span className="w-3.5 h-3.5 rounded-full bg-[#34d399]" title="Mint Cushion" />
                        <span className="w-3.5 h-3.5 rounded-full bg-[#60a5fa]" title="Sky Cushion" />
                        <span className="w-3.5 h-3.5 rounded-full bg-[#d97706]" title="Warm Amber Sofa" />
                      </div>
                    </div>

                    {/* Option B: Minimalis Putih (Clean Scandinavian) */}
                    <div
                      onClick={() => handleSelectTheme('minimalist')}
                      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        !isColorful
                          ? 'border-slate-900 bg-slate-50 shadow-md ring-2 ring-slate-900/10'
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-2xl">⚪</span>
                          {!isColorful && (
                            <span className="flex items-center gap-1 text-[10px] font-extrabold text-slate-900 bg-slate-200/80 px-2.5 py-0.5 rounded-full">
                              <Check className="w-3 h-3 text-slate-900" />
                              Sedang Digunakan
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-black text-slate-900 mb-1">
                          Minimalis Putih (Clean Scandinavian)
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Tampilan monokrom serba putih dan abu-abu slate bersih seperti setup bawaan orisinil The Delegation.
                        </p>
                      </div>

                      <div className="mt-4 flex items-center gap-1.5 pt-2 border-t border-slate-100">
                        <span className="w-3.5 h-3.5 rounded-full bg-[#f8fafc] border border-slate-300" />
                        <span className="w-3.5 h-3.5 rounded-full bg-[#e2e8f0]" />
                        <span className="w-3.5 h-3.5 rounded-full bg-[#94a3b8]" />
                        <span className="w-3.5 h-3.5 rounded-full bg-[#475569]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION: FLOOR MATERIAL SETTINGS */}
                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                        <Layers className="w-5 h-5 text-slate-700" />
                        Pilihan Material & Tekstur Lantai Workspace
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Pilih jenis lantai untuk menciptakan suasana ruang kantor yang lebih hidup (*liveable*) dan estetik.
                      </p>
                    </div>

                    <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 uppercase">
                      {scenerySettings.floorType || 'white'}
                    </span>
                  </div>

                  {/* Floor Option Cards: White (Default) / Parquet */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {/* Option 1: Putih Bersih (Clean Studio White - Default) */}
                    <div
                      onClick={() => handleSelectFloor('white')}
                      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        (scenerySettings.floorType || 'white') === 'white'
                          ? 'border-slate-900 bg-slate-50 shadow-sm ring-2 ring-slate-900/10'
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xl">⚪</span>
                          {(scenerySettings.floorType || 'white') === 'white' ? (
                            <span className="flex items-center gap-1 text-[10px] font-extrabold text-slate-900 bg-slate-200/90 px-2.5 py-0.5 rounded-full">
                              <Check className="w-3 h-3 text-slate-900" />
                              Aktif (Default)
                            </span>
                          ) : (
                            <span className="text-[9px] font-extrabold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                              Default Sistem
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-black text-slate-900 mb-1">
                          Putih Studio Bersih
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Ubin studio putih bersih dengan garis nat halus minimalis, memberikan kesan lapang, terang, dan modern.
                        </p>
                      </div>

                      {/* Swatch Preview */}
                      <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-[#f8fafc] border border-slate-300" />
                        <span className="w-3 h-3 rounded-full bg-[#e2e8f0]" />
                        <span className="text-[10px] font-semibold text-slate-400 ml-1">Studio White Tiles</span>
                      </div>
                    </div>

                    {/* Option 2: Parket Kayu Hangat (Oak Wood Parquet) */}
                    <div
                      onClick={() => handleSelectFloor('parquet')}
                      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        scenerySettings.floorType === 'parquet'
                          ? 'border-slate-900 bg-amber-50/40 shadow-sm ring-2 ring-slate-900/10'
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xl">🪵</span>
                          {scenerySettings.floorType === 'parquet' ? (
                            <span className="flex items-center gap-1 text-[10px] font-extrabold text-slate-900 bg-slate-200/90 px-2.5 py-0.5 rounded-full">
                              <Check className="w-3 h-3 text-slate-900" />
                              Aktif
                            </span>
                          ) : (
                            <span className="text-[9px] font-extrabold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                              Pilihan Hangat
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-black text-slate-900 mb-1">
                          Parket Kayu Hangat
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Papan kayu oak Skandinavia dengan garis serat alami dan pola sambungan rapi, menghadirkan nuansa kantor yang hangat, hidup, dan nyaman.
                        </p>
                      </div>

                      {/* Swatch Preview */}
                      <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-[#c8965a]" />
                        <span className="w-3 h-3 rounded-full bg-[#b88448]" />
                        <span className="w-3 h-3 rounded-full bg-[#d4a367]" />
                        <span className="text-[10px] font-semibold text-slate-400 ml-1">Oak Parquet Planks</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Decorative & Interactive Elements */}
                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Elemen Interaktif & Aksesoris Tambahan
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Aktifkan atau nonaktifkan elemen hidup di dalam ruang kantor 3D.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    {/* Toggle: NPC Cleaning Robot */}
                    <div
                      onClick={() => handleToggleScenery('showNPC')}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100/70 transition-colors"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="p-2.5 rounded-xl bg-sky-100 text-sky-700">
                          <Bot className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-900">
                            NPC Cleaning Robot & Office Boy (CleanBot-01)
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Robot otonom berpatroli mengitari koridor kantor, mengepel lantai, dan membawa cangkir kopi tim.
                          </p>
                        </div>
                      </div>

                      <div
                        className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 shrink-0 ${
                          scenerySettings.showNPC ? 'bg-slate-900' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                            scenerySettings.showNPC ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Toggle: Coffee Machine */}
                    <div
                      onClick={() => handleToggleScenery('showCoffeeCorner')}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100/70 transition-colors"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="p-2.5 rounded-xl bg-orange-100 text-orange-700">
                          <Coffee className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-900">
                            Mesin Kopi Espresso & Lounge Bar
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Mesin espresso 3D di meja pantry dengan uap panas naik dan cangkir keramik interaktif.
                          </p>
                        </div>
                      </div>

                      <div
                        className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 shrink-0 ${
                          scenerySettings.showCoffeeCorner ? 'bg-slate-900' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                            scenerySettings.showCoffeeCorner ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleResetScenery}
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Kembalikan ke Default Ruang Berwarna</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 2: PROFIL & KARAKTER AI AGENT                        */}
            {/* ======================================================== */}
            {activeTab === 'agents' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-5">
                  <div>
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-slate-700" />
                      Kustomisasi Identitas & Bentuk 3D AI Agent
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Pilih agen untuk mengatur warna tema primer dan model karakter bawaan.
                    </p>
                  </div>

                  {/* Agent Selector Pills */}
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                    {agents.map((ag) => {
                      const isSel = ag.id === selectedAgentId
                      return (
                        <button
                          key={ag.id}
                          onClick={() => setSelectedAgentId(ag.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                            isSel
                              ? 'bg-slate-900 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ag.color }} />
                          {ag.name}
                        </button>
                      )
                    })}
                  </div>

                  {/* Current Agent Config Card */}
                  {currentAgent && (
                    <div className="space-y-5">
                      {/* Color Palette Picker */}
                      <div>
                        <label className="text-xs font-black uppercase tracking-wider text-slate-800 mb-2.5 block">
                          Warna Identitas Utama ({currentAgent.name})
                        </label>
                        <div className="flex flex-wrap items-center gap-3">
                          {PRESET_COLORS.map((col) => {
                            const isCur = currentAgent.color?.toLowerCase() === col.hex.toLowerCase()
                            return (
                              <button
                                key={col.hex}
                                type="button"
                                onClick={() => onUpdateAgentColor?.(currentAgent.id, col.hex)}
                                className={`relative w-9 h-9 rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center ${
                                  isCur ? 'ring-2 ring-slate-900 ring-offset-2 scale-110 shadow-sm' : 'hover:scale-105'
                                }`}
                                style={{ backgroundColor: col.hex }}
                                title={col.name}
                              >
                                {isCur && <Check className="w-4 h-4 text-white drop-shadow" />}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Character Preset Switcher */}
                      <div>
                        <label className="text-xs font-black uppercase tracking-wider text-slate-800 mb-2.5 block">
                          Bentuk Karakter 3D
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {/* Chibi Klasik */}
                          <div
                            onClick={() => onSelectAvatarType?.(currentAgent.id, 'default')}
                            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                              currentAgent.avatar_type === 'default'
                                ? 'border-slate-900 bg-slate-50 shadow-xs'
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <h4 className="text-xs font-black text-slate-900 mb-1">Chibi Klasik</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">Avatar bulat orisinil The Delegation.</p>
                          </div>

                          {/* BoxHead Chibi */}
                          <div
                            onClick={() => onSelectAvatarType?.(currentAgent.id, 'boxhead')}
                            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                              currentAgent.avatar_type === 'boxhead'
                                ? 'border-slate-900 bg-slate-50 shadow-xs'
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <h4 className="text-xs font-black text-slate-900 mb-1">BoxHead Chibi</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">Kepala kotak kubus dengan penutup leher mulus.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 3: ALUR KERJA & KONEKSI ANTAR AGENT (FLOWCHART)      */}
            {/* ======================================================== */}
            {activeTab === 'workflow' && (
              <AgentFlowchartView />
            )}

            {/* ======================================================== */}
            {/* TAB 4: TELEMETRI & NOTIFIKASI                            */}
            {/* ======================================================== */}
            {activeTab === 'telemetry' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-5">
                  <div>
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Radio className="w-5 h-5 text-slate-700" />
                      Konfigurasi Telemetri Unit & Eskalasi Otomatis
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Atur frekuensi pemantauan detak unit IoT regional dan saluran peringatan teknisi.
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    {/* Ping Interval Selector */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-slate-900">Frekuensi Heartbeat Audit</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Interval otomatis Nara memeriksa status online 1.248 unit regional.</p>
                      </div>

                      <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
                        {['15s', '30s', '60s', '5m'].map((intvl) => (
                          <button
                            key={intvl}
                            onClick={() => setPingInterval(intvl)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                              pingInterval === intvl ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {intvl}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Auto Escalation Toggle */}
                    <div
                      onClick={() => setWaAutoEscalate(!waAutoEscalate)}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100/70 transition-colors"
                    >
                      <div>
                        <h4 className="text-xs font-black text-slate-900">Eskalasi Otomatis WhatsApp ke Teknisi PJ</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Kirim pesan WhatsApp otomatis ketika unit mengalami downtime lebih dari 15 menit.</p>
                      </div>

                      <div
                        className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 shrink-0 ${
                          waAutoEscalate ? 'bg-slate-900' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                            waAutoEscalate ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 4: SISTEM & AUDIO                                    */}
            {/* ======================================================== */}
            {activeTab === 'system' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-5">
                  <div>
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-slate-700" />
                      Preferensi Sistem, Audio, & Integrasi API
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Pengaturan audio interaktif dan status arsitektur multi-agent CrewAI.
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    {/* Audio Toggle */}
                    <div
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100/70 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                          <Volume2 className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-900">Efek Suara Interaktif Ruang Kantor</h4>
                          <p className="text-xs text-slate-500 mt-0.5">Suara atmosfer kerja 3D, seduh mesin kopi, dan klik perabotan.</p>
                        </div>
                      </div>

                      <div
                        className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 shrink-0 ${
                          soundEnabled ? 'bg-slate-900' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                            soundEnabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Server Info Card */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-slate-200 text-slate-800">
                          <Server className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-900">Backend Multi-Agent API</h4>
                          <p className="text-xs text-slate-500 mt-0.5">FastAPI Server v1.0.0 • CrewAI Engine Integration</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                        Online (Port 8000)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 5: LOCAL LLM ENGINE (OLLAMA LOCAL)                   */}
            {/* ======================================================== */}
            {activeTab === 'llm' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Header & Connectivity Status Card */}
                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          LOCAL INFERENCE ACTIVE
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          Zero Cloud API Cost • 100% Private Data
                        </span>
                      </div>
                      <h3 className="text-base font-black text-slate-900 flex items-center gap-2 pt-1">
                        <Server className="w-5 h-5 text-emerald-600" />
                        Konfigurasi Local LLM Server (Ollama)
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                        Virtual Office AI menggunakan server Ollama lokal untuk seluruh pemrosesan naskah Scout, brief agent, dan penalaran otonom tanpa memerlukan langganan OpenAI berbayar.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/80 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Port 11434 Terhubung
                      </span>
                    </div>
                  </div>

                  {/* Dedicated Server Connection Bar with 1-Line Refresh Action */}
                  <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-600 shrink-0 shadow-2xs">
                        <Radio className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-black text-slate-900">
                            {llmStatus?.base_url || 'http://172.17.0.1:11434'}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
                            HTTP 200 OK
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                          Terdeteksi {llmStatus?.models_count || 3} model lokal • Respons latency normal
                        </p>
                      </div>
                    </div>

                    {/* Single-line refresh button with clear placement */}
                    <button
                      type="button"
                      onClick={fetchLlmStatus}
                      disabled={llmLoading}
                      className="px-4 py-2 bg-white hover:bg-slate-100 active:scale-95 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 shadow-xs transition-all flex items-center justify-center gap-2 shrink-0 whitespace-nowrap cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${llmLoading ? 'animate-spin text-emerald-600' : 'text-slate-500'}`} />
                      <span className="whitespace-nowrap">{llmLoading ? 'Memeriksa Server...' : 'Cek Status Server'}</span>
                    </button>
                  </div>

                  {/* Server Telemetry Metrics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
                    <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Server Endpoint:
                      </span>
                      <p className="text-xs font-mono font-bold text-slate-800 mt-1.5 flex items-center gap-1.5 truncate">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        <span className="truncate">{llmStatus?.base_url || 'http://172.17.0.1:11434'}</span>
                      </p>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Model Aktif Sistem:
                      </span>
                      <p className="text-xs font-mono font-black text-emerald-700 mt-1.5 flex items-center gap-1.5 truncate">
                        <Zap className="w-3.5 h-3.5 fill-current shrink-0" />
                        <span className="truncate">{llmActiveModel}</span>
                      </p>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Akselerasi Perangkat:
                      </span>
                      <p className="text-xs font-bold text-slate-800 mt-1.5 flex items-center gap-1.5 truncate">
                        <Cpu className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span className="truncate">NVIDIA GTX 750 (4GB) + CPU</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Model Selector Card */}
                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      Pilihan Model Ollama Terpasang
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pilih model yang digunakan sebagai otak agen AI di ruang kantor virtual Anda.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        name: 'gemma3:12b',
                        label: 'Gemma 3 (12B)',
                        badge: 'Rekomendasi Penulisan',
                        color: 'border-emerald-500 bg-emerald-50/30',
                        desc: 'Parameter 12.2B Google. Sangat cerdas untuk copywriting Scout, penalaran 5-babak narasi, dan strategi marketing.',
                        speed: 'CPU + VRAM Split (~1.7 tps)'
                      },
                      {
                        name: 'llama3.2:latest',
                        label: 'Llama 3.2 (3B)',
                        badge: 'Super Cepat (100% GPU)',
                        color: 'border-blue-500 bg-blue-50/30',
                        desc: 'Parameter 3.2B Meta. Pas di VRAM 4GB GTX 750, respons instan untuk chat & respons customer service cepat.',
                        speed: '100% VRAM GPU (~25 tps)'
                      },
                      {
                        name: 'gemma3:4b',
                        label: 'Gemma 3 (4B)',
                        badge: 'Seimbang',
                        color: 'border-purple-500 bg-purple-50/30',
                        desc: 'Parameter 4.3B Google. Model kompak yang seimbang antara kecepatan dan pemahaman konteks bahasa Indonesia.',
                        speed: 'Sebagian besar VRAM (~15 tps)'
                      }
                    ].map((m) => {
                      const isSelected = llmActiveModel === m.name
                      return (
                        <div
                          key={m.name}
                          onClick={() => handleSwitchModel(m.name)}
                          className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'border-slate-900 bg-slate-50/80 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                          }`}
                        >
                          <div className="space-y-2.5">
                            {/* Card Top: Title and Selection Indicator */}
                            <div className="flex items-center justify-between gap-2">
                              <h5 className="text-xs font-black text-slate-900">{m.label}</h5>
                              {isSelected ? (
                                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-900 text-white flex items-center gap-1 shadow-2xs shrink-0">
                                  <Check className="w-2.5 h-2.5" />
                                  Aktif
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-slate-400 shrink-0 hover:text-slate-600">
                                  Pilih Model
                                </span>
                              )}
                            </div>

                            {/* Badge row: Dedicated line for feature badge & tech tag */}
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${
                                isSelected
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                  : 'bg-slate-100 text-slate-600 border-slate-200'
                              }`}>
                                {m.badge}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                {m.name}
                              </span>
                            </div>

                            {/* Card Description with generous line-height */}
                            <p className="text-xs text-slate-600 leading-relaxed pt-0.5">
                              {m.desc}
                            </p>
                          </div>

                          {/* Card Footer with clean separation */}
                          <div className="pt-3.5 mt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                            <span className="text-slate-400 font-medium">Hardware:</span>
                            <span className="font-bold text-slate-700">{m.speed}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Live Inference Testing Playground */}
                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <Bot className="w-4 h-4 text-emerald-600" />
                      Uji Inferensi Cepat Model Local
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Kirimkan instruksi ke <strong className="text-slate-800">{llmActiveModel}</strong> untuk mengukur kecepatan respon dan kualitas bahasa.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <textarea
                      rows={3}
                      value={llmTestPrompt}
                      onChange={(e) => setLlmTestPrompt(e.target.value)}
                      placeholder="Masukkan pertanyaan atau prompt untuk diuji..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-400 font-medium">
                        Model: <strong className="text-slate-700">{llmActiveModel}</strong> via <code className="text-slate-600">http://172.17.0.1:11434</code>
                      </span>

                      <button
                        onClick={handleRunLlmTest}
                        disabled={llmTesting || !llmTestPrompt.trim()}
                        className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                      >
                        {llmTesting ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Menghasilkan Respon...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 fill-current" />
                            <span>Uji Generasi Sekarang</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Test Result Display */}
                  {llmTestResult && (
                    <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-2 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Respon Selesai ({llmTestResult.duration_seconds ? `${llmTestResult.duration_seconds} detik` : 'Instan'})
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {llmTestResult.model} • {llmTestResult.finish_reason || 'stop'}
                        </span>
                      </div>

                      <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-line font-serif">
                        {llmTestResult.content || llmTestResult.error || 'Tidak ada respon.'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
