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
  Bot
} from 'lucide-react'
import AgentCloseUpAvatar from './AgentCloseUpAvatar'

/**
 * Sidebar Component
 * Displays agent details, task brief form, response history,
 * and the prominent "📞 Call Agent" button.
 */
export default function Sidebar({
  agent,
  onClose,
  onOpenCall,
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
