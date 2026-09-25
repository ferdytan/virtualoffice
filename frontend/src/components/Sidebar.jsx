import React, { useState } from 'react'
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
  LayoutDashboard
} from 'lucide-react'
import AgentCloseUpAvatar from './AgentCloseUpAvatar'

/**
 * Sidebar Component
 * Displays agent details, task brief form, response history,
 * with streamlined actions (Call Agent & Open Workspace Dashboard),
 * and a gear icon next to the agent name to open AvatarModal.
 */
export default function Sidebar({
  agent,
  onClose,
  onOpenCall,
  onOpenAvatarModal,
  onOpenDashboardModal,
  onSendBrief,
  chatHistory = [],
  isLoading = false
}) {
  const [briefInput, setBriefInput] = useState('')

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
          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
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

              {/* Gear / Settings button for Avatar */}
              <button
                type="button"
                onClick={onOpenAvatarModal}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
                title="Pengaturan Avatar 3D"
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

        {chatHistory.length === 0 ? (
          <div className="text-center py-8 px-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-600">
              Belum ada interaksi dengan {agent.name}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Kirimkan brief tugas atau gunakan quick prompt di bawah untuk memulai delegasi.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {chatHistory.map((item, idx) => (
              <div key={idx} className="space-y-2">
                {/* User Prompt */}
                <div className="flex items-start justify-end gap-2">
                  <div className="bg-slate-900 text-white text-xs p-3 rounded-2xl rounded-tr-xs max-w-[85%] shadow-sm">
                    {item.message}
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
                  <div className="bg-slate-100 text-slate-800 text-xs p-3.5 rounded-2xl rounded-tl-xs max-w-[90%] border border-slate-200/60 leading-relaxed shadow-xs">
                    <p className="whitespace-pre-line">{item.response}</p>
                    <span className="text-[9px] font-medium text-slate-400 mt-2 block text-right">
                      {item.timestamp || 'Baru saja'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loading Spinner during task delegation */}
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-500 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 animate-pulse">
            <div
              className="w-3.5 h-3.5 border-2 border-t-transparent rounded-full animate-spin shrink-0"
              style={{ borderColor: agentColor, borderTopColor: 'transparent' }}
            />
            <span>{agent.name} sedang memproses brief dan menganalisis tugas...</span>
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
    </div>
  )
}
