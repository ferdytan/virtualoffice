import React, { useState } from 'react'
import {
  Calendar,
  Clock,
  PlayCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles
} from 'lucide-react'

/**
 * KanbanBar Component
 * Horizontal 4-column status bar docked at the bottom of the screen.
 * Columns: SCHEDULED, ON HOLD, IN PROGRESS, DONE.
 */
export default function KanbanBar({
  tasks = [],
  onSelectAgentById
}) {
  const [isExpanded, setIsExpanded] = useState(true)

  // Status column definitions
  const columns = [
    {
      key: 'SCHEDULED',
      title: 'SCHEDULED',
      icon: Calendar,
      color: 'text-sky-600',
      bgLight: 'bg-sky-50',
      badgeBg: 'bg-sky-100 text-sky-800 border-sky-200'
    },
    {
      key: 'ON HOLD',
      title: 'ON HOLD',
      icon: Clock,
      color: 'text-amber-600',
      bgLight: 'bg-amber-50',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200'
    },
    {
      key: 'IN PROGRESS',
      title: 'IN PROGRESS',
      icon: PlayCircle,
      color: 'text-indigo-600',
      bgLight: 'bg-indigo-50',
      badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      hasSpinner: true
    },
    {
      key: 'DONE',
      title: 'DONE',
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bgLight: 'bg-emerald-50',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    }
  ]

  // Group tasks by status
  const groupedTasks = columns.reduce((acc, col) => {
    acc[col.key] = tasks.filter((t) => (t.status || 'SCHEDULED') === col.key)
    return acc
  }, {})

  const getAgentColor = (agentId) => {
    switch (agentId?.toLowerCase()) {
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
    <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-4">
        {/* Toggle Bar / Header */}
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all active:scale-95"
          >
            <Layers className="w-3.5 h-3.5 text-slate-900" />
            <span>Workflow Kanban Bar</span>
            <span className="bg-slate-900 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {tasks.length}
            </span>
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>
        </div>

        {/* Collapsible Kanban Board */}
        {isExpanded && (
          <div className="pointer-events-auto bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-3 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {columns.map((col) => {
                const IconComponent = col.icon
                const colTasks = groupedTasks[col.key] || []

                return (
                  <div
                    key={col.key}
                    className="flex flex-col bg-slate-50/70 rounded-xl p-2.5 border border-slate-200/60 min-h-[110px]"
                  >
                    {/* Column Header */}
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/60">
                      <div className="flex items-center gap-1.5">
                        <IconComponent className={`w-3.5 h-3.5 ${col.color}`} />
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
                          {col.title}
                        </span>
                        {col.hasSpinner && colTasks.length > 0 && (
                          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 font-mono px-1.5 py-0.5 bg-white rounded border border-slate-200">
                        {colTasks.length}
                      </span>
                    </div>

                    {/* Task Cards List */}
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-0.5">
                      {colTasks.length === 0 ? (
                        <div className="text-[11px] text-slate-400 italic text-center py-4">
                          Kosong
                        </div>
                      ) : (
                        colTasks.map((task) => {
                          const agentColor = getAgentColor(task.agent_id)
                          return (
                            <div
                              key={task.id}
                              onClick={() => onSelectAgentById && onSelectAgentById(task.agent_id)}
                              className="group p-2 bg-white hover:bg-slate-50 rounded-lg border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className="w-2 h-2 rounded-full shrink-0"
                                    style={{ backgroundColor: agentColor }}
                                  />
                                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tight">
                                    {task.agent_name || task.agent_id}
                                  </span>
                                </div>
                                <span className="text-[9px] text-slate-400 font-medium">
                                  {task.updated_at || 'Baru saja'}
                                </span>
                              </div>

                              <p className="text-[11px] font-medium text-slate-800 line-clamp-1 group-hover:text-slate-900">
                                {task.title}
                              </p>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
