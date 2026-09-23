import React, { useState, useRef } from 'react'
import {
  X,
  Phone,
  Send,
  Cpu,
  Sparkles,
  CheckCircle2,
  Clock,
  ChevronRight,
  Bot,
  Upload,
  RotateCcw,
  Box,
  Check,
  AlertCircle
} from 'lucide-react'
import AgentCloseUpAvatar from './AgentCloseUpAvatar'

/**
 * Sidebar Component
 * Displays agent details, task brief form, response history,
 * 3D GLB model customizer, and the prominent "📞 Call Agent" button.
 */
export default function Sidebar({
  agent,
  onClose,
  onOpenCall,
  onSendBrief,
  onUpdateAgentModel,
  chatHistory = [],
  isLoading = false
}) {
  const [briefInput, setBriefInput] = useState('')
  const fileInputRef = useRef(null)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState(null)

  if (!agent) return null

  const agentColor = agent.color || '#38bdf8'

  const handleSubmit = (e) => {
    e?.preventDefault()
    if (!briefInput.trim() || isLoading) return
    onSendBrief(agent.id, briefInput.trim())
    setBriefInput('')
  }

  const handleQuickPrompt = (prompt) => {
    setBriefInput(prompt)
  }

  const handleModelUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const filename = file.name.toLowerCase()
    if (!filename.endsWith('.glb') && !filename.endsWith('.gltf')) {
      setUploadMessage({ type: 'error', text: 'Format tidak didukung. Harap pilih file .glb atau .gltf' })
      setTimeout(() => setUploadMessage(null), 3500)
      return
    }

    setUploadLoading(true)
    setUploadMessage({ type: 'info', text: 'Menerapkan model 3D...' })

    // Instant local preview via Blob URL
    const localBlobUrl = URL.createObjectURL(file)
    if (onUpdateAgentModel) {
      onUpdateAgentModel(agent.id, localBlobUrl, file.name)
    }

    // Persist to backend server
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch(`/api/agents/${agent.id}/model`, {
        method: 'POST',
        body: formData
      })
      if (res.ok) {
        const data = await res.json()
        if (onUpdateAgentModel) {
          onUpdateAgentModel(agent.id, data.custom_model_url, data.custom_model_name)
        }
        setUploadMessage({ type: 'success', text: `Model ${file.name} berhasil diterapkan!` })
      } else {
        setUploadMessage({ type: 'success', text: `Model ${file.name} aktif di sesi ini.` })
      }
    } catch (err) {
      setUploadMessage({ type: 'success', text: `Model ${file.name} aktif di sesi ini.` })
    } finally {
      setUploadLoading(false)
      setTimeout(() => setUploadMessage(null), 4000)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleResetModel = async () => {
    setUploadLoading(true)
    try {
      await fetch(`/api/agents/${agent.id}/model`, { method: 'DELETE' })
    } catch (e) {
      // ignore
    }
    if (onUpdateAgentModel) {
      onUpdateAgentModel(agent.id, null, null)
    }
    setUploadLoading(false)
    setUploadMessage({ type: 'success', text: 'Avatar berhasil dikembalikan ke default!' })
    setTimeout(() => setUploadMessage(null), 3000)
  }

  return (
    <div className="fixed top-0 right-0 w-full sm:w-[440px] h-full z-40 bg-white/95 backdrop-blur-xl border-l border-slate-200/80 shadow-2xl flex flex-col transition-all duration-300 animate-in slide-in-from-right">
      {/* --- Header & Close --- */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
        <div className="flex items-center gap-2.5">
          <div
            className="w-3.5 h-3.5 rounded-full"
            style={{ backgroundColor: agentColor }}
          />
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Agent Profile
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          title="Tutup Panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* --- Agent Info Banner --- */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-start gap-4">
          {/* Large Close-up Avatar Icon */}
          <AgentCloseUpAvatar
            agent={agent}
            size={68}
            showStatus={true}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-extrabold text-slate-900 truncate">
                {agent.name}
              </h2>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded text-white tracking-wide"
                style={{ backgroundColor: agentColor }}
              >
                {agent.role_badge}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-600 line-clamp-1">
              {agent.role}
            </p>

            {/* Model & Status tags */}
            <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                <Cpu className="w-3 h-3 text-slate-600" />
                {agent.model || 'gpt-4o-mini'}
              </span>
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Backstory & Description */}
        <p className="mt-3.5 text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
          {agent.description}
        </p>

        {/* --- 3D AVATAR MODEL CUSTOMIZER CARD --- */}
        <div className="mt-3.5 p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Box className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-bold text-slate-800">
                Model Karakter 3D (.glb)
              </span>
            </div>
            {agent.custom_model_url || agent.customModelUrl ? (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                Model Kustom Aktif
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Default Chibi
              </span>
            )}
          </div>

          <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
            {agent.custom_model_url || agent.customModelUrl
              ? `Sedang menggunakan: ${agent.custom_model_name || 'custom_model.glb'}. Klik tombol "Kembalikan ke Default" jika ingin kembali ke bentuk semula.`
              : `Sedang menggunakan karakter bawaan (The Delegation Chibi). Anda bisa mengunggah file .glb kustom untuk ${agent.name}.`}
          </p>

          <div className="flex flex-col gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleModelUpload}
              accept=".glb,.gltf"
              className="hidden"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadLoading}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                {uploadLoading
                  ? 'Memproses...'
                  : agent.custom_model_url || agent.customModelUrl
                  ? 'Ganti Model .glb Lain'
                  : 'Upload GLB Karakter'}
              </button>

              <button
                onClick={handleResetModel}
                disabled={uploadLoading || (!agent.custom_model_url && !agent.customModelUrl)}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 font-bold text-xs rounded-xl transition-all cursor-pointer ${
                  agent.custom_model_url || agent.customModelUrl
                    ? 'bg-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 border border-slate-300 text-slate-800 active:scale-[0.98]'
                    : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                }`}
                title="Kembalikan ke avatar default The Delegation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Kembalikan ke Default
              </button>
            </div>

            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <span>💡</span>
              <span>Anda bebas mengganti atau mereset ke bentuk default kapan saja.</span>
            </div>
          </div>

          {uploadMessage && (
            <div
              className={`mt-2.5 p-2 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 animate-in fade-in ${
                uploadMessage.type === 'error'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              {uploadMessage.type === 'error' ? (
                <AlertCircle className="w-3.5 h-3.5 text-red-500" />
              ) : (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              )}
              {uploadMessage.text}
            </div>
          )}
        </div>

        {/* --- PROMINENT CALL BUTTON --- */}
        <div className="mt-4">
          <button
            onClick={() => onOpenCall(agent)}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-slate-900/10 transition-all group"
          >
            <Phone className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
            📞 Call Agent ({agent.name})
          </button>
        </div>
      </div>

      {/* --- Chat / Brief Conversation Feed --- */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Bot className="w-3.5 h-3.5" /> Brief & Task Execution Log
        </div>

        {chatHistory.length === 0 ? (
          <div className="text-center py-8 px-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-medium text-slate-500">
              Belum ada brief tugas untuk {agent.name}.
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Kirimkan instruksi atau pilih salah satu prompt cepat di bawah.
            </p>
          </div>
        ) : (
          chatHistory.map((item, idx) => (
            <div key={idx} className="space-y-2">
              {/* User Brief Message */}
              <div className="flex justify-end">
                <div className="bg-slate-900 text-white text-xs px-3.5 py-2.5 rounded-2xl rounded-tr-none max-w-[85%] shadow-sm leading-relaxed">
                  <div className="text-[10px] text-slate-400 font-semibold mb-0.5">
                    Brief Instruksi
                  </div>
                  {item.user}
                </div>
              </div>

              {/* Agent Response Card */}
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 text-slate-800 text-xs p-3.5 rounded-2xl rounded-tl-none max-w-[92%] shadow-sm leading-relaxed space-y-1.5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1 text-[10px] text-slate-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: agentColor }}
                      />
                      {agent.name} &bull; CrewAI Result
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 font-bold">
                      <CheckCircle2 className="w-3 h-3" /> Selesai
                    </span>
                  </div>
                  <div className="text-slate-700 whitespace-pre-line text-xs font-normal">
                    {item.response}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Loading / Execution indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
            <span className="w-2 h-2 rounded-full bg-slate-900 animate-ping" />
            <span className="font-semibold">{agent.name} sedang mengeksekusi tugas CrewAI...</span>
          </div>
        )}
      </div>

      {/* --- Quick Action Prompt Chips --- */}
      <div className="px-5 py-2 bg-slate-50/80 border-t border-slate-100">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-[11px]">
          <span className="text-slate-400 font-semibold shrink-0">Cepat:</span>
          {agent.quick_prompts?.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleQuickPrompt(prompt)}
              className="shrink-0 px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 font-medium rounded-lg border border-slate-200 transition-colors shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* --- Task Brief Input Form --- */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={briefInput}
            onChange={(e) => setBriefInput(e.target.value)}
            placeholder={`Beri tugas atau brief ke ${agent.name}...`}
            className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800 text-slate-800 placeholder-slate-400"
          />
          <button
            type="submit"
            disabled={isLoading || !briefInput.trim()}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" /> Kirim
          </button>
        </form>
      </div>
    </div>
  )
}
