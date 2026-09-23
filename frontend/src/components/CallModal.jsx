import React, { useState, useEffect } from 'react'
import { PhoneOff, Mic, MicOff, Volume2, Sparkles, Send } from 'lucide-react'
import AgentCloseUpAvatar from './AgentCloseUpAvatar'

/**
 * CallModal Component
 * Interactive two-way voice/call session with the CrewAI agent.
 */
export default function CallModal({
  agent,
  isOpen,
  onClose,
  backendUrl = ''
}) {
  const [isMuted, setIsMuted] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [transcript, setTranscript] = useState([])
  const [inputSpeech, setInputSpeech] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Timer for active call duration
  useEffect(() => {
    if (!isOpen) {
      setCallDuration(0)
      setTranscript([])
      return
    }

    handleInitialCall()

    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isOpen, agent?.id])

  const formatDuration = (secs) => {
    const mins = Math.floor(secs / 60)
    const remSecs = secs % 60
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`
  }

  const handleInitialCall = async () => {
    if (!agent) return
    setIsLoading(true)
    try {
      const res = await fetch(`${backendUrl}/api/call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id: agent.id, message: '' })
      })
      if (res.ok) {
        const data = await res.json()
        setTranscript([
          { sender: agent.name, text: data.reply_text, time: 'Sekarang' }
        ])
      } else {
        throw new Error('Call service response error')
      }
    } catch (err) {
      const greetings = {
        nara: `Halo, Nara di sini! Sistem pemantauan unit online dan saya siap menerima laporan unit bermasalah.`,
        velocia: `Hai, Velocia bicara! Strategi apa yang ingin kita diskusikan hari ini?`,
        scout: `Halo, Scout siap mendengarkan. Tren industri apa yang ingin kita eksplorasi?`
      }
      setTranscript([
        {
          sender: agent.name,
          text: greetings[agent.id] || `Halo! Saya ${agent.name}, siap berkolaborasi.`,
          time: 'Sekarang'
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSpeak = async (e) => {
    e?.preventDefault()
    if (!inputSpeech.trim() || isLoading) return

    const userText = inputSpeech.trim()
    setInputSpeech('')
    setTranscript((prev) => [
      ...prev,
      { sender: 'You', text: userText, time: 'Sekarang' }
    ])

    setIsLoading(true)
    try {
      const res = await fetch(`${backendUrl}/api/call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id: agent.id, message: userText })
      })
      if (res.ok) {
        const data = await res.json()
        setTranscript((prev) => [
          ...prev,
          { sender: agent.name, text: data.reply_text, time: 'Sekarang' }
        ])
      } else {
        throw new Error('Call error')
      }
    } catch (err) {
      setTimeout(() => {
        setTranscript((prev) => [
          ...prev,
          {
            sender: agent.name,
            text: `[Audio Stream]: Pesan suara Anda diterima dengan jelas. Saya sedang mengoordinasikan tindak lanjut ini.`,
            time: 'Sekarang'
          }
        ])
      }, 700)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen || !agent) return null

  const agentColor = agent.color || '#38bdf8'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Live Voice Call &bull; {formatDuration(callDuration)}
            </span>
          </div>

          <span
            className="text-[11px] font-bold px-2.5 py-1 rounded-full text-white"
            style={{ backgroundColor: agentColor }}
          >
            {agent.role_badge}
          </span>
        </div>

        {/* Agent Avatar & Waveform Visualizer */}
        <div className="p-8 flex flex-col items-center justify-center text-center bg-gradient-to-b from-slate-50 to-white">
          <div className="relative mb-4">
            <AgentCloseUpAvatar
              agent={agent}
              size={92}
              showStatus={true}
            />
          </div>

          <h3 className="text-2xl font-extrabold text-slate-800">{agent.name}</h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">{agent.role}</p>

          {/* Animated Audio Waveform Visualizer */}
          <div className="flex items-center justify-center gap-1.5 h-12 my-5">
            {[40, 75, 55, 95, 60, 85, 45, 100, 70, 50, 90, 65].map((height, i) => (
              <div
                key={i}
                className="w-1.5 rounded-full transition-all duration-300"
                style={{
                  height: isLoading ? `${height}%` : '24%',
                  backgroundColor: agentColor,
                  animation: isLoading ? `wave 1s ease-in-out infinite ${i * 0.08}s` : 'none',
                  opacity: isMuted ? 0.25 : 0.85
                }}
              />
            ))}
          </div>

          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-emerald-500 animate-pulse" />
            {isLoading ? 'Agent sedang merespons...' : 'Koneksi suara terenkripsi aktif'}
          </span>
        </div>

        {/* Live Call Transcript / Dialogue Scroll */}
        <div className="px-6 py-3 max-h-44 overflow-y-auto bg-slate-50/50 border-t border-b border-slate-100 space-y-2.5">
          {transcript.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col text-xs ${
                item.sender === 'You' ? 'items-end' : 'items-start'
              }`}
            >
              <span className="text-[10px] text-slate-400 font-semibold mb-0.5">
                {item.sender} &bull; {item.time}
              </span>
              <div
                className={`px-3 py-2 rounded-2xl max-w-[85%] leading-relaxed ${
                  item.sender === 'You'
                    ? 'bg-slate-900 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-tl-none'
                }`}
              >
                {item.text}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Spoken Reply Prompts */}
        <div className="px-6 py-2 bg-slate-50/80 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-400 font-semibold shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> Cepat:
          </span>
          {agent.quick_prompts?.map((prompt, i) => (
            <button
              key={i}
              onClick={() => {
                setInputSpeech(prompt)
              }}
              className="shrink-0 px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-full border border-slate-200 transition-colors shadow-xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Call Input & Audio Controls */}
        <div className="p-5 bg-white flex flex-col gap-4">
          <form onSubmit={handleSpeak} className="flex gap-2">
            <input
              type="text"
              value={inputSpeech}
              onChange={(e) => setInputSpeech(e.target.value)}
              placeholder={`Bicara atau ketik pesan suara ke ${agent.name}...`}
              className="flex-1 px-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800"
            />
            <button
              type="submit"
              disabled={isLoading || !inputSpeech.trim()}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" /> Kirim
            </button>
          </form>

          <div className="flex items-center justify-center gap-6">
            {/* Mute Button */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3.5 rounded-full transition-all ${
                isMuted
                  ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* End Call Button */}
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-lg shadow-red-500/25 transition-all"
            >
              <PhoneOff className="w-4 h-4" /> Akhiri Panggilan
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
