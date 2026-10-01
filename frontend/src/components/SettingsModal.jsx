import React, { useState, useEffect } from 'react'
import {
  X,
  Send,
  Shield,
  Key,
  Database,
  Cpu,
  Bot,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  Radio,
  ExternalLink,
  Save,
  Check,
  Zap
} from 'lucide-react'

export default function SettingsModal({
  isOpen,
  onClose,
  onSettingsSaved
}) {
  const [activeTab, setActiveTab] = useState('telegram') // 'telegram' | 'apikeys' | 'coo'
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toastMessage, setToastMessage] = null
  const [toastType, setToastType] = useState('success') // 'success' | 'error'
  const [fieldErrors, setFieldErrors] = useState({})

  // Settings state
  const [settings, setSettings] = useState({
    TELEGRAM_BOT_TOKEN: '',
    TELEGRAM_OWNER_CHAT_ID: '',
    ORIN_API_TOKEN: '',
    ORIN_API_URL: 'https://admin-api.orin.id/api/devices/offline',
    OPENAI_API_KEY: '',
    OPENAI_MODEL_NAME: 'gpt-4o-mini',
    OLLAMA_BASE_URL: 'http://172.17.0.1:11434',
    OLLAMA_MODEL: 'gemma3:12b',
    LLM_PROVIDER: 'ollama',
    COO_AUTONOMY_LEVEL: 'full',
    NOTIFY_ON_TASK_DONE: true
  })

  // Show/hide passwords
  const [showBotToken, setShowBotToken] = useState(false)
  const [showOpenAiKey, setShowOpenAiKey] = useState(false)
  const [showOrinToken, setShowOrinToken] = useState(false)

  // Testing Telegram
  const [testingTelegram, setTestingTelegram] = useState(false)
  const [telegramTestResult, setTelegramTestResult] = useState(null)

  // Fetch settings when modal opens
  const fetchSettings = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/settings')
      if (res.ok) {
        const data = await res.json()
        if (data.settings) {
          setSettings((prev) => ({
            ...prev,
            ...data.settings
          }))
        }
      }
    } catch (err) {
      console.warn('Failed to load settings:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchSettings()
      setTelegramTestResult(null)
      setToastMessage(null)
    }
  }, [isOpen])

  // Save Settings handler
  const handleSave = async (e) => {
    if (e) e.preventDefault()
    // Validate required fields before saving
    const errors = {};
    if (!settings.TELEGRAM_BOT_TOKEN?.trim()) {
      errors.TELEGRAM_BOT_TOKEN = 'Bot token wajib diisi.';
    }
    if (!settings.TELEGRAM_OWNER_CHAT_ID?.trim()) {
      errors.TELEGRAM_OWNER_CHAT_ID = 'Owner Chat ID wajib diisi.';
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setToastType('error');
      setToastMessage('Perbaiki kesalahan pada formulir sebelum menyimpan.');
      return;
    }
    try {
      setSaving(true)
      setToastMessage(null)

      const payload = { ...settings }

      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (res.ok) {
        setToastType('success')
        setToastMessage('Pengaturan berhasil disimpan dan aktif seketika tanpa restart!')
        if (onSettingsSaved) onSettingsSaved(data.settings)
        setTimeout(() => {
          setToastMessage(null)
        }, 4000)
      } else {
        setToastType('error')
        setToastMessage(data.detail || 'Gagal menyimpan konfigurasi.')
      }
    } catch (err) {
      setToastType('error')
      setToastMessage(`Error koneksi ke backend: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  // Test Telegram Bot Connection
  const handleTestTelegram = async () => {
    try {
      setTestingTelegram(true)
      setTelegramTestResult(null)

      const res = await fetch('/api/settings/telegram/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bot_token: settings.TELEGRAM_BOT_TOKEN || undefined,
          owner_chat_id: settings.TELEGRAM_OWNER_CHAT_ID || undefined
        })
      })

      const data = await res.json()

      if (res.ok) {
        setTelegramTestResult({
          success: true,
          message: data.detail?.message || 'Koneksi Telegram valid! Pesan uji coba berhasil dikirim ke Owner.'
        })
      } else {
        setTelegramTestResult({
          success: false,
          message: data.detail || 'Gagal memverifikasi Telegram Bot API.'
        })
      }
    } catch (err) {
      setTelegramTestResult({
        success: false,
        message: `Koneksi gagal: ${err.message}`
      })
    } finally {
      setTestingTelegram(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header Bar */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight text-white flex items-center gap-2">
                <span>Pengaturan Sistem &amp; Gateway Integrasi</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  PHASE 3 ACTIVE
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Kelola Telegram Bot Gateway, Kredensial API, dan Orkestrasi Eksekutif COO.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success / Error Toast Notification */}
        {toastMessage && (
          <div
            className={`py-3 px-5 text-xs font-bold flex items-center justify-between border-b ${
              toastType === 'success'
                ? 'bg-emerald-500 text-white border-emerald-600'
                : 'bg-rose-500 text-white border-rose-600'
            }`}
          >
            <div className="flex items-center gap-2">
              {toastType === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{toastMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-white/80 hover:text-white cursor-pointer ml-3 font-mono text-sm"
            >
              &times;
            </button>
          </div>
        )}

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 p-2 bg-slate-100/90 border-b border-slate-200 text-xs font-bold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('telegram')}
            className={`py-2 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'telegram'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Send className="w-3.5 h-3.5 text-sky-500" />
            <span>Telegram Gateway (Owner)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('apikeys')}
            className={`py-2 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'apikeys'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-amber-500" />
            <span>API Keys &amp; Engine LLM</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('coo')}
            className={`py-2 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'coo'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-indigo-500" />
            <span>Protokol Delegasi COO</span>
          </button>
        </div>

        {/* Modal Body / Tab Contents */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* TAB 1: TELEGRAM BOT INTEGRATION */}
          {activeTab === 'telegram' && (
            <div className="space-y-4">
              <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 flex items-start gap-3 text-xs text-sky-900 leading-relaxed">
                <Send className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black text-sky-950 mb-0.5">
                    Telegram Direct Channel to COO Orchestrator
                  </h4>
                  <p>
                    Instruksi yang dikirim dari Telegram pribadi Owner akan diterima melalui native webhook,
                    dianalisis oleh <strong>COO Agent</strong>, didelegasikan ke spesialis (Nara, Scout, Watson,
                    Velocia, Sherloc), dan hasil akhirnya dilaporkan secara proaktif kembali ke Telegram ponsel Anda.
                  </p>
                </div>
              </div>

              {/* Bot Token Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>TELEGRAM_BOT_TOKEN (dari @BotFather)</span>
                  <span className="text-[10px] text-slate-400 font-mono">Wajib untuk gateway</span>
                </label>
                      <div className="relative">
        <input
          type={showBotToken ? 'text' : 'password'}
          value={settings.TELEGRAM_BOT_TOKEN || ''}
          onChange={(e) =>
            setSettings({ ...settings, TELEGRAM_BOT_TOKEN: e.target.value })
          }
          placeholder="Contoh: 7123456789:AAHkLp..."
          className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
        />
        <button
          type="button"
          onClick={() => setShowBotToken(!showBotToken)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          {showBotToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
        {fieldErrors.TELEGRAM_BOT_TOKEN && (
          <p className="text-rose-500 text-xs mt-1">{fieldErrors.TELEGRAM_BOT_TOKEN}</p>
        )}
      </div>
                <p className="text-[11px] text-slate-400">
                  Buat bot baru melalui <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="text-sky-600 underline font-semibold">@BotFather</a> di Telegram dan tempel API token di sini.
                </p>
              </div>

              {/* Owner Chat ID Field (Security Whitelist) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>TELEGRAM_OWNER_CHAT_ID (Security Whitelist)</span>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    Whitelist Aktif
                  </span>
                </label>
                <input
                  type="text"
                  value={settings.TELEGRAM_OWNER_CHAT_ID || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, TELEGRAM_OWNER_CHAT_ID: e.target.value })
                  }
                  placeholder="Contoh: 123456789"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
                {fieldErrors.TELEGRAM_OWNER_CHAT_ID && (
                  <p className="text-rose-500 text-xs mt-1">{fieldErrors.TELEGRAM_OWNER_CHAT_ID}</p>
                )}
                <p className="text-[11px] text-slate-400">
                  ID akun Telegram Anda. Hanya chat dari ID ini yang direspons oleh COO; pesan dari pihak lain akan ditolak demi keamanan. Dapatkan ID via <a href="https://t.me/userinfobot" target="_blank" rel="noreferrer" className="text-sky-600 underline font-semibold">@userinfobot</a>.
                </p>
              </div>

              {/* Test Connection Action & Result */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h5 className="text-xs font-black text-slate-900">Uji Coba Koneksi Bot Telegram</h5>
                    <p className="text-[11px] text-slate-500">
                      Mengirim pesan konfirmasi langsung ke ponsel Owner via Bot API.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleTestTelegram}
                    disabled={testingTelegram}
                    className="py-2 px-4 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0 whitespace-nowrap"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testingTelegram ? 'animate-spin' : ''}`} />
                    <span>{testingTelegram ? 'Memverifikasi...' : 'Test Connection'}</span>
                  </button>
                </div>

                {telegramTestResult && (
                  <div
                    className={`p-3 rounded-xl border text-xs leading-relaxed flex items-start gap-2 ${
                      telegramTestResult.success
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}
                  >
                    {telegramTestResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-bold">
                        {telegramTestResult.success ? 'Koneksi Sukses!' : 'Pengujian Gagal'}
                      </p>
                      <p className="text-[11px] mt-0.5">{telegramTestResult.message}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Webhook Endpoint Info */}
              <div className="p-3.5 bg-slate-900 text-slate-200 rounded-2xl text-xs space-y-1.5 font-mono">
                <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase">
                  <span>FastAPI Native Webhook Endpoint</span>
                  <span className="text-emerald-400 font-bold">READY</span>
                </div>
                <div className="p-2 bg-slate-800 rounded-xl text-[11px] text-emerald-300 break-all select-all">
                  POST /api/webhook/telegram
                </div>
                <p className="text-[10px] text-slate-400 font-sans">
                  Untuk mendaftarkan webhook online saat hosting ke domain publik:
                  <code className="text-amber-300 block mt-1 bg-slate-950 p-1.5 rounded">
                    curl -F "url=https://YOUR_DOMAIN/api/webhook/telegram" https://api.telegram.org/botYOUR_TOKEN/setWebhook
                  </code>
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: API KEYS & ENGINE LLM */}
          {activeTab === 'apikeys' && (
            <div className="space-y-4">
              {/* Orin Admin API Token */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>ORIN_API_TOKEN (Telemetri Perangkat Orin)</span>
                  <span className="text-[10px] text-sky-600 font-bold bg-sky-50 px-2 py-0.5 rounded">
                    Live Telemetry
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showOrinToken ? 'text' : 'password'}
                    value={settings.ORIN_API_TOKEN || ''}
                    onChange={(e) =>
                      setSettings({ ...settings, ORIN_API_TOKEN: e.target.value })
                    }
                    placeholder="20639|AwZwUDmpoUa2..."
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOrinToken(!showOrinToken)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showOrinToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Token otorisasi Bearer untuk mengambil live feed unit offline dari server pusat Orin.
                </p>
              </div>

              {/* OpenAI API Key */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>OPENAI_API_KEY (Opsional jika memakai Ollama lokal)</span>
                  <span className="text-[10px] text-slate-400">Cloud Model</span>
                </label>
                <div className="relative">
                  <input
                    type={showOpenAiKey ? 'text' : 'password'}
                    value={settings.OPENAI_API_KEY || ''}
                    onChange={(e) =>
                      setSettings({ ...settings, OPENAI_API_KEY: e.target.value })
                    }
                    placeholder="sk-proj-..."
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOpenAiKey(!showOpenAiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showOpenAiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Local Ollama Settings */}
              <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-emerald-700" />
                    <h5 className="text-xs font-bold text-emerald-950">Local LLM Server (Ollama)</h5>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                    GRATIS / ZERO CLOUD COST
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Ollama Host URL</label>
                    <input
                      type="text"
                      value={settings.OLLAMA_BASE_URL || ''}
                      onChange={(e) =>
                        setSettings({ ...settings, OLLAMA_BASE_URL: e.target.value })
                      }
                      placeholder="http://172.17.0.1:11434"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Model Default</label>
                    <input
                      type="text"
                      value={settings.OLLAMA_MODEL || ''}
                      onChange={(e) =>
                        setSettings({ ...settings, OLLAMA_MODEL: e.target.value })
                      }
                      placeholder="gemma3:12b"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                <p className="text-[10px] text-emerald-800 leading-relaxed">
                  Semua pembuatan draf artikel Scout dan respon cerdas agent dapat diproses secara lokal
                  menggunakan model <code>gemma3:12b</code> tanpa biaya API pihak ketiga.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: PROTOKOL COO */}
          {activeTab === 'coo' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-400" />
                    <h5 className="text-xs font-black uppercase tracking-wider text-white">
                      COO Delegation &amp; Orchestration Protocol
                    </h5>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono font-bold">
                    CHIEF OPERATING OFFICER
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  COO bertindak sebagai <strong>Executive Master Delegator</strong> yang menerima instruksi
                  dari Direktur melalui Telegram atau Web UI, memecah tugas menjadi sub-pekerjaan untuk spesialis
                  (Nara, Scout, Watson, Velocia, Sherloc), memantau latar belakang di Kanban, dan melapor kembali.
                </p>
              </div>

              {/* Autonomy Level Switcher */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Tingkat Otonomi Delegasi</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, COO_AUTONOMY_LEVEL: 'full' })}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      settings.COO_AUTONOMY_LEVEL === 'full'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between mb-1">
                      <span>Full Autonomous</span>
                      {settings.COO_AUTONOMY_LEVEL === 'full' && <Check className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <p className={`text-[10px] leading-relaxed ${settings.COO_AUTONOMY_LEVEL === 'full' ? 'text-slate-300' : 'text-slate-500'}`}>
                      COO langsung mengeksekusi dan mengoordinasikan seluruh agen spesialis tanpa perlu konfirmasi berulang.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, COO_AUTONOMY_LEVEL: 'supervised' })}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      settings.COO_AUTONOMY_LEVEL === 'supervised'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between mb-1">
                      <span>Supervised / Review</span>
                      {settings.COO_AUTONOMY_LEVEL === 'supervised' && <Check className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <p className={`text-[10px] leading-relaxed ${settings.COO_AUTONOMY_LEVEL === 'supervised' ? 'text-slate-300' : 'text-slate-500'}`}>
                      Tugas didelegasikan, draf disiapkan, dan COO menunggu persetujuan Direktur sebelum dispatch final.
                    </p>
                  </button>
                </div>
              </div>

              {/* Notification Toggle */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h6 className="text-xs font-bold text-slate-900">Notifikasi Proaktif ke Telegram</h6>
                  <p className="text-[11px] text-slate-500">
                    Kirim laporan eksekutif lengkap ke Telegram Owner segera setelah penugasan selesai di background.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(settings.NOTIFY_ON_TASK_DONE)}
                  onChange={(e) =>
                    setSettings({ ...settings, NOTIFY_ON_TASK_DONE: e.target.checked })
                  }
                  className="w-5 h-5 accent-slate-900 rounded cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions Bar */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-1.5 font-mono">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>Perubahan aktif seketika (Hot Dynamic Reload)</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-2xs transition-all cursor-pointer"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0 whitespace-nowrap active:scale-95"
            >
              <Save className={`w-3.5 h-3.5 ${saving ? 'animate-spin' : 'text-emerald-400'}`} />
              <span>{saving ? 'Menyimpan...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
