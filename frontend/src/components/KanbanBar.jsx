import React, { useState } from 'react'
import {
  Calendar,
  Clock,
  PlayCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
  Zap,
  Filter
} from 'lucide-react'

/**
 * KanbanBar Component (Vertical & Collapsible)
 * Positioned on the left side directly beneath the active selected AI Agent card.
 * Width matches the AI Agent card exactly.
 * Supports expanding / collapsing for a clean, distraction-free 3D workspace.
 */
export default function KanbanBar({
  tasks = [],
  onSelectAgentById
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeFilter, setActiveFilter] = useState('ALL') // 'ALL' | 'IN PROGRESS' | 'ON HOLD' | 'DONE' | 'SCHEDULED'

  // Status definitions
  const columns = [
    {
      key: 'IN PROGRESS',
      title: 'In Progress',
      icon: PlayCircle,
      color: 'text-indigo-600',
      activeBg: 'bg-indigo-600 text-white',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      dotColor: 'bg-indigo-500',
      hasPing: true
    },
    {
      key: 'ON HOLD',
      title: 'On Hold',
      icon: Clock,
      color: 'text-amber-600',
      activeBg: 'bg-amber-600 text-white',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      dotColor: 'bg-amber-500'
    },
    {
      key: 'DONE',
      title: 'Done',
      icon: CheckCircle2,
      color: 'text-emerald-600',
      activeBg: 'bg-emerald-600 text-white',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dotColor: 'bg-emerald-500'
    },
    {
      key: 'SCHEDULED',
      title: 'Scheduled',
      icon: Calendar,
      color: 'text-sky-600',
      activeBg: 'bg-sky-600 text-white',
      badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
      dotColor: 'bg-sky-500'
    }
  ]

  // Count by status
  const counts = columns.reduce((acc, col) => {
    acc[col.key] = tasks.filter((t) => (t.status || 'SCHEDULED') === col.key).length
    return acc
  }, {})

  const inProgressCount = counts['IN PROGRESS'] || 0
  const onHoldCount = counts['ON HOLD'] || 0

  // Filter tasks based on activeFilter
  const filteredTasks = activeFilter === 'ALL'
    ? tasks
    : tasks.filter((t) => (t.status || 'SCHEDULED') === activeFilter)

  const getAgentColor = (agentId) => {
    switch (agentId?.toLowerCase()) {
      case 'sherloc':
        return '#f59e0b'
      case 'watson':
        return '#6366f1'
      case 'nara':
        return '#38bdf8'
      case 'velocia':
        return '#ef4444'
      case 'scout':
        return '#22c55e'
      default:
        return '#94a3b8'
    }
  }

  return (
    <div className="w-full pointer-events-auto select-none transition-all duration-300">
      {/* --- COLLAPSIBLE TOGGLE BUTTON (When collapsed or expanded header) --- */}
      {!isExpanded ? (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/80 hover:bg-white text-slate-800 text-xs font-bold transition-all active:scale-[0.99] cursor-pointer group"
          title="Buka Workflow Kanban Bar"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold tracking-tight truncate">Workflow Kanban</span>
            <span className="bg-slate-900 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold shrink-0">
              {tasks.length}
            </span>

            {inProgressCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded-full font-bold shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                <span>{inProgressCount} Aktif</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-slate-400 group-hover:text-slate-700">
            <span className="text-[10px] font-semibold hidden xs:inline">Buka</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </button>
      ) : (
        /* --- EXPANDED VERTICAL KANBAN CARD --- */
        <div className="w-full bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-2xl p-3 flex flex-col gap-2.5 animate-in slide-in-from-top-2 duration-200">
          {/* Header with Title & Collapse Button */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-slate-900 text-white">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-black text-slate-900 tracking-tight">
                Workflow Kanban
              </span>
              <span className="bg-slate-900 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
                {tasks.length}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
              title="Tutup / Lipat Kanban"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>

          {/* Status Filter Tabs (Horizontal Pills) */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar text-[10px] font-bold">
            <button
              type="button"
              onClick={() => setActiveFilter('ALL')}
              className={`px-2 py-1 rounded-lg transition-all shrink-0 cursor-pointer ${
                activeFilter === 'ALL'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua ({tasks.length})
            </button>

            {columns.map((col) => {
              const count = counts[col.key] || 0
              const isActive = activeFilter === col.key
              return (
                <button
                  key={col.key}
                  type="button"
                  onClick={() => setActiveFilter(col.key)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? col.activeBg + ' shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${col.dotColor} ${col.hasPing && count > 0 ? 'animate-ping' : ''}`} />
                  <span>{col.title} ({count})</span>
                </button>
              )
            })}
          </div>

          {/* Vertical Tasks Stream */}
          <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
            {filteredTasks.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs font-medium italic">
                Tidak ada task dalam status ini
              </div>
            ) : (
              filteredTasks.map((task) => {
                const agentColor = getAgentColor(task.agent_id)
                const statusCol = columns.find((c) => c.key === task.status) || columns[3]

                return (
                  <div
                    key={task.id}
                    onClick={() => onSelectAgentById && onSelectAgentById(task.agent_id)}
                    className="group p-2.5 bg-slate-50/80 hover:bg-white rounded-xl border border-slate-200/70 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col gap-1"
                    title={`Klik untuk fokus ke agen ${task.agent_name || task.agent_id}`}
                  >
                    {/* Top Row: Agent Pill + Status Badge + Time */}
                    <div className="flex items-center justify-between gap-1 text-[10px]">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: agentColor }}
                        />
                        <span className="font-extrabold text-slate-800 uppercase tracking-tight truncate">
                          {task.agent_name || task.agent_id}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`px-1.5 py-0.2 rounded-md font-extrabold text-[9px] border ${statusCol.badgeBg}`}>
                          {task.status || 'SCHEDULED'}
                        </span>
                        <span className="text-slate-400 text-[9px] font-medium">
                          {task.updated_at || 'Baru saja'}
                        </span>
                      </div>
                    </div>

                    {/* Task Title */}
                    <p className="text-xs font-semibold text-slate-800 group-hover:text-slate-900 leading-snug line-clamp-2">
                      {task.title}
                    </p>
                  </div>
                )
              })
            )}
          </div>

          {/* Footer Bar */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live SSE Sync
            </span>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="text-slate-500 hover:text-slate-900 font-bold transition-colors cursor-pointer"
            >
              Ringkas ▲
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
