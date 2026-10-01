import React, { useState, useEffect } from 'react'
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
  Settings,
  LayoutDashboard,
  FileText,
  Copy,
  Check,
  ExternalLink,
  Compass,
  Eye
} from 'lucide-react'
import AgentCloseUpAvatar from './AgentCloseUpAvatar'
import AgentAvatarSettingsView from './AgentAvatarSettingsView'

/**
 * Sidebar Component
 * Displays agent details, task brief form, response history,
 * with streamlined actions (Call Agent & Open Workspace Dashboard),
 * and an in-place panel transition to AgentAvatarSettingsView when clicking the gear icon.
 */
export default function Sidebar({
  agent,
  onClose,
  onOpenCall,
  onOpenDashboardModal,
  onSendBrief,
  onScoutGenerateArticle,
  chatHistory = [],
  isLoading = false,
  onSelectAvatarType,
  onUpdateAgentModel,
  onUpdateAgentColor,
  onUpdateAgentStatus
}) {
  const [panelView, setPanelView] = useState('profile') // 'profile' | 'avatar_settings'
  const [briefInput, setBriefInput] = useState('')
  const [copiedIdx, setCopiedIdx] = useState(null)
  const [readerArticle, setReaderArticle] = useState(null)

  const copyText = (text, id) => {
    if (!text) return
    navigator.clipboard?.writeText(text)
    setCopiedIdx(id)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  useEffect(() => {
    setPanelView('profile')
  }, [agent?.id])

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

  return (
    <div className="fixed top-0 right-0 w-full sm:w-[440px] h-full z-40 bg-white/95 backdrop-blur-xl border-l border-slate-200/80 shadow-2xl flex flex-col transition-all duration-300 animate-in slide-in-from-right">
      {panelView === 'avatar_settings' ? (
        <AgentAvatarSettingsView
          agent={agent}
          onSelectAvatarType={onSelectAvatarType}
          onUpdateAgentModel={onUpdateAgentModel}
          onUpdateAgentColor={onUpdateAgentColor}
          onUpdateAgentStatus={onUpdateAgentStatus}
          onBack={() => setPanelView('profile')}
          onClose={onClose}
        />
      ) : (
        <>
          {/* --- Header & Close --- */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60 shrink-0">
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
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              title="Tutup Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* --- Agent Info Banner --- */}
          <div className="p-6 border-b border-slate-100 shrink-0">
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

                  {/* Gear / Settings button for Avatar */}
                  <button
                    type="button"
                    onClick={() => setPanelView('avatar_settings')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
                    title="Pengaturan Avatar & Warna 3D"
                  >
                    <Settings className="w-4 h-4" />
                  </button>

              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded text-white tracking-wide ml-auto shrink-0"
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

              {/* Interactive Status Pill */}
              <button
                type="button"
                onClick={() => {
                  const current = (agent.status || (agent.id === 'nara' ? 'working' : 'available')).toLowerCase()
                  const nextStatus = current === 'available' ? 'working' : current === 'working' ? 'not_available' : 'available'
                  if (onUpdateAgentStatus) onUpdateAgentStatus(agent.id, nextStatus)
                }}
                className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-bold text-[10px] uppercase border transition-all cursor-pointer ${
                  (agent.status || (agent.id === 'nara' ? 'working' : 'available')).toLowerCase() === 'working'
                    ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                    : (agent.status || '').toLowerCase() === 'not_available'
                    ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                }`}
                title="Klik untuk mengubah status agent (Available / Working / Not Available)"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${
                  (agent.status || (agent.id === 'nara' ? 'working' : 'available')).toLowerCase() === 'working'
                    ? 'bg-amber-500 animate-ping'
                    : (agent.status || '').toLowerCase() === 'not_available'
                    ? 'bg-rose-500'
                    : 'bg-emerald-500'
                }`} />
                <span>
                  {(agent.status || (agent.id === 'nara' ? 'working' : 'available')).toLowerCase() === 'working'
                    ? 'Working'
                    : (agent.status || '').toLowerCase() === 'not_available'
                    ? 'Not Available'
                    : 'Available'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Backstory & Description */}
        <p className="mt-3.5 text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
          {agent.description}
        </p>

        {/* --- PROMINENT ACTION BUTTONS: CALL & DASHBOARD --- */}
        <div className="grid grid-cols-2 gap-2.5 mt-4">
          <button
            type="button"
            onClick={() => onOpenCall(agent)}
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer group"
          >
            <Phone className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
            <span>Panggil (Call)</span>
          </button>

          <button
            type="button"
            onClick={onOpenDashboardModal}
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer group"
            style={
              agent.id === 'nara'
                ? { background: 'linear-gradient(135deg, #0284c7, #0369a1)' }
                : agent.id === 'scout'
                ? { background: 'linear-gradient(135deg, #16a34a, #15803d)' }
                : undefined
            }
          >
            <LayoutDashboard className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
            <span>Buka Dashboard</span>
          </button>
        </div>
      </div>

      {/* --- Chat / Brief Conversation Feed --- */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Bot className="w-3.5 h-3.5" /> Brief & Task Execution Log
        </div>

        {/* --- Scout Strategic Article Quick Actions (Only for Scout) --- */}
        {agent.id === 'scout' && (
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/90 rounded-2xl space-y-2.5 mb-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black tracking-wider text-emerald-800 uppercase flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-emerald-600" />
                Scout Copywriting Engine (Soft-Selling Orin)
              </span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                Pilar Orin 2026
              </span>
            </div>

            <p className="text-[11px] text-emerald-900/80 leading-snug">
              Pilih pilar topik riset untuk memanen berita aktual dan membuat draf artikel berstruktur 5 babak:
            </p>

            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  if (onScoutGenerateArticle) {
                    onScoutGenerateArticle('curanmor', 'fokus perbandingan kunci ganda fisik vs GPS Tracker Orin')
                  } else {
                    onSendBrief(agent.id, 'Riset kasus curanmor terbaru & buat artikel kunci ganda vs GPS Tracker Orin')
                  }
                }}
                className="p-2.5 bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 border border-emerald-200/80 rounded-xl text-left text-xs font-bold transition-all shadow-2xs flex items-center justify-between cursor-pointer group disabled:opacity-50"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-base shrink-0">🚨</span>
                  <div className="min-w-0">
                    <div className="font-extrabold text-slate-900 group-hover:text-emerald-900 text-xs truncate">
                      Curanmor & Kunci Ganda
                    </div>
                    <div className="text-[10px] text-slate-500 font-normal truncate">
                      Riset berita kriminal & soft-selling remote cut-off
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  if (onScoutGenerateArticle) {
                    onScoutGenerateArticle('fuel_management', 'fokus kebocoran kencing solar rest area dan sensor BBM Orin')
                  } else {
                    onSendBrief(agent.id, 'Buat artikel soft-selling kebocoran BBM armada dan solusi Fuel Sensor Orin')
                  }
                }}
                className="p-2.5 bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 border border-emerald-200/80 rounded-xl text-left text-xs font-bold transition-all shadow-2xs flex items-center justify-between cursor-pointer group disabled:opacity-50"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-base shrink-0">⛽</span>
                  <div className="min-w-0">
                    <div className="font-extrabold text-slate-900 group-hover:text-emerald-900 text-xs truncate">
                      Kebocoran BBM & Kencing Solar
                    </div>
                    <div className="text-[10px] text-slate-500 font-normal truncate">
                      Audit nota manual vs sensor solar presisi Orin
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  if (onScoutGenerateArticle) {
                    onScoutGenerateArticle('logistics_tips', 'fokus preventive maintenance berbasis engine hour')
                  } else {
                    onSendBrief(agent.id, 'Susun artikel strategi preventive maintenance vs risiko downtime armada truk')
                  }
                }}
                className="p-2.5 bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 border border-emerald-200/80 rounded-xl text-left text-xs font-bold transition-all shadow-2xs flex items-center justify-between cursor-pointer group disabled:opacity-50"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-base shrink-0">🚛</span>
                  <div className="min-w-0">
                    <div className="font-extrabold text-slate-900 group-hover:text-emerald-900 text-xs truncate">
                      Preventive Maintenance Armada
                    </div>
                    <div className="text-[10px] text-slate-500 font-normal truncate">
                      Pola servis berkala vs telemetri Engine Hours
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            </div>
          </div>
        )}

        {chatHistory.length === 0 ? (
          <div className="text-center py-8 px-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-600">
              Belum ada interaksi dengan {agent.name}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Kirimkan brief tugas atau gunakan tombol generator di atas untuk memulai riset artikel.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {chatHistory.map((item, idx) => {
              const isArticle = item.article || item.response?.includes('### 🎯') || item.response?.includes('📰 **Scout Engine')
              const rawText = item.article?.content_markdown || item.response || ''

              return (
                <div key={idx} className="space-y-2">
                  {/* User Prompt */}
                  <div className="flex items-start justify-end gap-2">
                    <div className="bg-slate-900 text-white text-xs p-3 rounded-2xl rounded-tr-xs max-w-[85%] shadow-sm">
                      {item.message || item.user}
                    </div>
                  </div>

                  {/* Agent Response */}
                  <div className="flex items-start gap-2.5">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-black shrink-0 shadow-sm mt-0.5"
                      style={{ backgroundColor: agentColor }}
                    >
                      {agent.name.charAt(0)}
                    </div>
                    <div className="bg-slate-100 text-slate-800 text-xs p-3.5 rounded-2xl rounded-tl-xs max-w-[92%] border border-slate-200/60 leading-relaxed shadow-xs relative">
                      {isArticle ? (
                        <div className="space-y-2.5">
                          {/* Article Header Card */}
                          <div className="flex items-center justify-between pb-2 border-b border-emerald-200/80">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white uppercase tracking-wider">
                                {item.article?.category || 'Strategi Konten Orin'}
                              </span>
                              <span className="text-[10px] text-slate-500 font-medium">
                                {item.article?.read_time || '5 mnt baca'}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              5 Babak Narasi
                            </span>
                          </div>

                          {/* Title */}
                          <h4 className="text-xs font-black text-slate-900 leading-snug">
                            {item.article?.title || 'Draf Copywriting Strategis Scout'}
                          </h4>

                          {/* Excerpt / Hook Preview */}
                          <p className="text-[11px] text-slate-600 italic bg-white/80 p-2.5 rounded-xl border border-slate-200/70 leading-relaxed">
                            "{item.article?.excerpt || item.article?.hook || item.response?.slice(0, 140)}..."
                          </p>

                          {/* 5-Babak Flow Badges */}
                          <div className="grid grid-cols-2 gap-1 text-[9px] font-semibold text-slate-600">
                            <span className="bg-white/60 px-2 py-1 rounded border border-slate-200/50">1. Hook & Realita</span>
                            <span className="bg-white/60 px-2 py-1 rounded border border-slate-200/50">2. Bedah Masalah</span>
                            <span className="bg-white/60 px-2 py-1 rounded border border-slate-200/50">3. Edukasi Preventif</span>
                            <span className="bg-white/60 px-2 py-1 rounded border border-slate-200/50 text-emerald-700 font-bold">4. Soft-Selling Orin</span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1.5 pt-1">
                            <button
                              type="button"
                              onClick={() => setReaderArticle(item.article || { title: item.article?.title || 'Draf Naskah Scout', content_markdown: rawText })}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-[11px] font-bold rounded-xl shadow-xs transition-all cursor-pointer shrink-0 whitespace-nowrap"
                            >
                              <Eye className="w-3.5 h-3.5 shrink-0" />
                              <span className="whitespace-nowrap">Baca Lengkap</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => copyText(rawText, `chat-copy-${idx}`)}
                              className="flex items-center justify-center gap-1 py-2 px-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-bold rounded-xl transition-all cursor-pointer shrink-0 whitespace-nowrap"
                              title="Salin Naskah Markdown"
                            >
                              {copiedIdx === `chat-copy-${idx}` ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <span className="text-emerald-700 whitespace-nowrap">Tersalin</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                  <span className="whitespace-nowrap">Salin</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={onOpenDashboardModal}
                              className="p-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl transition-all cursor-pointer shrink-0"
                              title="Buka di Dashboard Penuh"
                            >
                              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="whitespace-pre-line">{item.response}</p>
                      )}

                      <span className="text-[9px] font-medium text-slate-400 mt-2 block text-right">
                        {item.timestamp || item.time || 'Baru saja'}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Loading Spinner during task delegation */}
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-600 text-xs bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 animate-pulse">
            <div
              className="w-3.5 h-3.5 border-2 border-t-transparent rounded-full animate-spin shrink-0"
              style={{ borderColor: agentColor, borderTopColor: 'transparent' }}
            />
            <span>
              {agent.id === 'scout'
                ? 'Scout sedang memindai berita aktual (Detik, Suara Surabaya, Pilar Media) dan meracik draf copywriting 5 babak...'
                : `${agent.name} sedang memproses brief dan menganalisis tugas...`}
            </span>
          </div>
        )}
      </div>

      {/* --- Quick Prompts & Brief Input Form --- */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/60 space-y-3">
        {/* Quick Prompts Suggestions */}
        {agent.quick_prompts && agent.quick_prompts.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Saran Cepat:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {agent.quick_prompts.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleQuickPrompt(prompt)}
                  className="text-[11px] text-slate-600 bg-white hover:bg-slate-100 hover:text-slate-900 border border-slate-200 px-2.5 py-1 rounded-lg transition-colors text-left flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate max-w-[340px]">{prompt}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={briefInput}
            onChange={(e) => setBriefInput(e.target.value)}
            placeholder={`Ketik brief tugas untuk ${agent.name}...`}
            disabled={isLoading}
            className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!briefInput.trim() || isLoading}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 active:scale-95 disabled:opacity-40 text-white rounded-xl transition-all cursor-pointer shadow-md disabled:cursor-not-allowed shrink-0"
            title="Kirim Brief"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* --- Full Article Reader Modal --- */}
      {readerArticle && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col border border-slate-200 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                  {readerArticle.category || 'Artikel Edukatif Scout'}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {readerArticle.read_time || '5 menit baca'}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => copyText(readerArticle.content_markdown || readerArticle.title, 'modal-copy')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap"
                >
                  {copiedIdx === 'modal-copy' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="whitespace-nowrap">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="whitespace-nowrap">Salin Naskah</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setReaderArticle(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5 shrink-0" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              <h2 className="text-lg font-black text-slate-900 leading-snug">
                {readerArticle.title}
              </h2>
              {readerArticle.excerpt && (
                <p className="text-xs font-medium text-slate-600 italic bg-slate-50 p-3.5 rounded-2xl border border-slate-100 leading-relaxed">
                  "{readerArticle.excerpt}"
                </p>
              )}
              <div className="prose prose-slate max-w-none text-xs leading-relaxed space-y-3 pt-2 text-slate-800 whitespace-pre-line">
                {readerArticle.content_markdown || readerArticle.response}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs rounded-b-3xl shrink-0">
              <span className="text-[11px] text-slate-400 font-medium">
                Draf copywriting terstruktur 5-babak dengan soft-selling Orin
              </span>
              <button
                type="button"
                onClick={() => setReaderArticle(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer shrink-0 whitespace-nowrap"
              >
                <span className="whitespace-nowrap">Selesai Membaca</span>
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  )
}
