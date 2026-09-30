import React, { useState } from 'react'
import {
  Network,
  ArrowRight,
  ArrowLeftRight,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Cpu,
  Database,
  MessageSquare,
  FileText,
  TrendingUp,
  Layers,
  Sparkles,
  Zap,
  HelpCircle,
  Clock,
  ShieldCheck,
  Send,
  PhoneCall,
  Share2
} from 'lucide-react'

export default function AgentFlowchartView() {
  const [selectedScenario, setSelectedScenario] = useState('offline_unit') // 'all' | 'offline_unit' | 'tech_escalation' | 'telemetry_broadcast' | 'analytics_sop'
  const [focusedAgent, setFocusedAgent] = useState('sherloc') // 'sherloc' | 'watson' | 'nara' | 'velocia' | 'scout' | null

  // SCENARIO DEFINITIONS
  const SCENARIOS = [
    {
      id: 'offline_unit',
      title: '🚨 Customer Tanya Unit Offline',
      badge: 'Utama / Prioritas CS',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      description: 'Sherloc menerima keluhan GPS offline, mendelegasikan pengecekan telemetri ke Nara, dan mengoordinasikan tindak lanjut ke Watson.',
      activeAgents: ['sherloc', 'nara', 'watson'],
      activeConnections: ['customer-sherloc', 'sherloc-nara', 'nara-api', 'nara-sherloc', 'sherloc-watson', 'watson-groups']
    },
    {
      id: 'tech_escalation',
      title: '🛠️ Eskalasi Teknis & Knowledge Harvester',
      badge: 'RAG & Firmware',
      badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      description: 'Sherloc mengeskalasikan error kode sensor/ECU ke Watson. Watson berkoordinasi ke insinyur dan memanen solusi ke Vector DB.',
      activeAgents: ['sherloc', 'watson'],
      activeConnections: ['sherloc-watson', 'watson-engineers', 'engineers-watson', 'watson-vectordb', 'watson-sherloc']
    },
    {
      id: 'telemetry_broadcast',
      title: '📡 Safe Broadcast & Feedback Grup PRO',
      badge: 'Otomasi Telemetri',
      badgeColor: 'bg-sky-100 text-sky-900 border-sky-300',
      description: 'Nara mengaudit armada offline harian, menyusun broadcast anti-ban (jitter 15-45s) via Watson ke grup WA pelanggan, dan menerima feedback.',
      activeAgents: ['nara', 'watson'],
      activeConnections: ['nara-api', 'nara-watson', 'watson-progroups', 'progroups-watson', 'watson-nara']
    },
    {
      id: 'analytics_sop',
      title: '📊 Downstream Analytics & SOP Mandiri',
      badge: 'Growth & Efficiency',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      description: 'Velocia menambang tren pasar dari log chat Sherloc, mengarahkan riset Scout, dan menerbitkan panduan SOP untuk memangkas 35% tiket repetitif.',
      activeAgents: ['sherloc', 'velocia', 'scout'],
      activeConnections: ['sherloc-velocia', 'velocia-scout', 'scout-sherloc']
    },
    {
      id: 'all',
      title: '🌐 Semua Koneksi (Full Mesh View)',
      badge: 'Ekosistem Lengkap',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
      description: 'Menampilkan peta interkoneksi lengkap seluruh 5 AI Agent beserta integrasi API, database, dan channel WhatsApp.',
      activeAgents: ['sherloc', 'watson', 'nara', 'velocia', 'scout'],
      activeConnections: [
        'customer-sherloc', 'sherloc-nara', 'nara-api', 'nara-sherloc', 'sherloc-watson',
        'watson-engineers', 'engineers-watson', 'watson-vectordb', 'watson-sherloc',
        'nara-watson', 'watson-progroups', 'progroups-watson', 'watson-nara',
        'sherloc-velocia', 'velocia-scout', 'scout-sherloc'
      ]
    }
  ]

  const activeScenarioObj = SCENARIOS.find((s) => s.id === selectedScenario) || SCENARIOS[0]

  // AGENT METADATA FOR DISPLAY
  const AGENT_NODES = {
    sherloc: {
      id: 'sherloc',
      name: 'Sherloc',
      role: 'Frontline Voice & CS WhatsApp',
      roleBadge: 'FRONTLINE CS',
      color: '#f59e0b',
      bgLight: 'bg-amber-500/10',
      border: 'border-amber-400',
      text: 'text-amber-700',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
      desc: 'Garda terdepan kontak langsung pelanggan (The Face). Memvalidasi user, menjawab FAQ, delegasi GPS ke Nara, dan eskalasi teknis ke Watson.',
      canConnectTo: [
        { to: 'nara', label: 'Cek Telemetri GPS Offline', condition: 'Customer mengeluhkan GPS mati / sinyal hilang' },
        { to: 'watson', label: 'Eskalasi Kendala Teknis / ECU', condition: 'Error kode E-402, sensor anomali, butuh insinyur' },
        { to: 'velocia', label: 'Downstream Chat Intelligence', condition: 'Log percakapan dianalisis untuk tren kata kunci' }
      ]
    },
    nara: {
      id: 'nara',
      name: 'Nara',
      role: 'CS & Telemetri Unit Offline Reminder',
      roleBadge: 'REMINDER CS',
      color: '#38bdf8',
      bgLight: 'bg-sky-500/10',
      border: 'border-sky-400',
      text: 'text-sky-700',
      badgeBg: 'bg-sky-100 text-sky-800 border-sky-200',
      desc: 'Spesialis pemantau perangkat telemetri IoT. Menerapkan aturan CAM > 72h, siklus kalender audit, dan diagnosis baterai/GSM.',
      canConnectTo: [
        { to: 'sherloc', label: 'Diagnosis Cepat Unit Offline', condition: 'Hasil inspeksi voltase aki & GSM dikirim untuk dibalas ke customer' },
        { to: 'watson', label: 'Format Safe Broadcast WA Group', condition: 'Menyiapkan draft laporan rekap offline dengan anti-ban jitter' }
      ]
    },
    watson: {
      id: 'watson',
      name: 'Watson',
      role: 'Technical Escalation & Knowledge Loop Lead',
      roleBadge: 'TECH ESCALATION',
      color: '#6366f1',
      bgLight: 'bg-indigo-500/10',
      border: 'border-indigo-400',
      text: 'text-indigo-700',
      badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      desc: 'Jembatan teknis ke tim manajemen & insinyur Orin. Menjalankan Knowledge Harvester (RAG) dan mengeksekusi broadcast aman.',
      canConnectTo: [
        { to: 'sherloc', label: 'Jawaban Solusi Insinyur', condition: 'Menerjemahkan instruksi teknis ke bahasa ramah pelanggan' },
        { to: 'nara', label: 'Inbound Feedback Grup Pelanggan', condition: 'Meneruskan konfirmasi servis bengkel / aki dilepas ke state tracker' }
      ]
    },
    velocia: {
      id: 'velocia',
      name: 'Velocia',
      role: 'Marketing Strategist & Lead',
      roleBadge: 'MARKETING STRATEGIST',
      color: '#ef4444',
      bgLight: 'bg-rose-500/10',
      border: 'border-rose-400',
      text: 'text-rose-700',
      badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
      desc: 'Strategis pertumbuhan pasar berbasis data. Menganalisis chat volume, lonjakan permintaan fitur (Sensor BBM +32%), dan merancang bundling.',
      canConnectTo: [
        { to: 'scout', label: 'Brief Riset Topik & Validasi SOP', condition: 'Mengarahkan riset tren kompetitor dan formulasi SOP mandiri' }
      ]
    },
    scout: {
      id: 'scout',
      name: 'Scout',
      role: 'Researcher & SOP Writer',
      roleBadge: 'RESEARCHER',
      color: '#22c55e',
      bgLight: 'bg-emerald-500/10',
      border: 'border-emerald-400',
      text: 'text-emerald-700',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      desc: 'Peneliti mandiri dan penulis SOP operasional. Menghasilkan panduan self-service untuk mengurangi beban tiket repetitif CS hingga 35%.',
      canConnectTo: [
        { to: 'sherloc', label: 'Publikasi Panduan Mandiri SOP', condition: 'Memberikan materi solusi FAQ cepat (reset password, geofence)' }
      ]
    }
  }

  // STEP BY STEP SCENARIO WALKTHROUGH DATA
  const SCENARIO_STEPS = {
    offline_unit: [
      {
        step: 1,
        sender: 'Pelanggan (WhatsApp)',
        receiver: 'Sherloc (Frontline Voice)',
        action: 'Inbound Customer Message',
        example: '"Halo CS, truk kami B 1842 KZA di aplikasi statusnya offline sejak kemarin. Tolong dicek ya."',
        badge: 'WA Inbound'
      },
      {
        step: 2,
        sender: 'Sherloc',
        receiver: 'Nara (Telemetry Specialist)',
        action: 'Pendelegasian Tugas Pengecekan GPS (Delegation)',
        example: 'Sherloc mengenali nomor plat B 1842 KZA, mendeteksi kata kunci "offline", dan langsung mendelegasikan brief telemetri ke Nara.',
        badge: 'Delegasi Otomatis'
      },
      {
        step: 3,
        sender: 'Nara',
        receiver: 'Orin Telemetry Admin API',
        action: 'Pulling Live Heartbeat & CAM Rule Filtering',
        example: 'Nara query endpoint live telemetri: mendeteksi voltase aki 11.2V (under-voltage), GSM 1 Bar, dan mengecek toleransi CAM > 72 jam.',
        badge: 'API Telemetri'
      },
      {
        step: 4,
        sender: 'Nara',
        receiver: 'Sherloc & Watson',
        action: 'Hasil Diagnosis Dikembalikan',
        example: 'Nara mengonfirmasi ke Sherloc: "Unit under-voltage aki drop". Nara juga memberi tahu Watson untuk menyiapkan tiket pemantauan teknisi.',
        badge: 'Status Resolved'
      },
      {
        step: 5,
        sender: 'Sherloc',
        receiver: 'Pelanggan (WhatsApp)',
        action: 'Respon Ramah Frontline CS ke Pelanggan',
        example: '"Halo Pak Budi, unit B 1842 KZA terdeteksi drop tegangan aki ke 11.2V. Mohon periksa saklar aki kendaraan di pool ya Pak."',
        badge: 'CS Delivery'
      }
    ],
    tech_escalation: [
      {
        step: 1,
        sender: 'Sherloc',
        receiver: 'Watson',
        action: 'Eskalasi Tiket Error Firmware / ECU',
        example: 'Sherloc menerima error kode anomali sensor BBM fluktuasi > 20% dan meneruskan tiket #TIK-482 ke Watson (status diubah ke ON HOLD).',
        badge: 'Eskalasi Level 2'
      },
      {
        step: 2,
        sender: 'Watson',
        receiver: 'WhatsApp Group Manajemen & Insinyur',
        action: 'Forward Masalah ke Tim Lead Engineer',
        example: 'Watson mem-forward detail teknis ke grup WA internal: "Mohon arahan penanganan error sensor fuel fluktuasi pada unit D 9912 ABE."',
        badge: 'Internal Bridge'
      },
      {
        step: 3,
        sender: 'Lead Insinyur (Dimas)',
        receiver: 'Watson',
        action: 'Balasan Solusi dari Insinyur di Grup WA',
        example: 'Dimas: "Aktifkan moving-average filter tingkat 3 lewat OTA telemetri portal, flush buffer 60 detik."',
        badge: 'Tech Reply'
      },
      {
        step: 4,
        sender: 'Watson',
        receiver: 'Vector DB Knowledge Base (RAG)',
        action: 'Knowledge Harvester Otomatis',
        example: 'Watson memanen Q&A tersebut ke dalam Vector DB (QA-02) agar jika pertanyaan serupa muncul kembali, AI bisa menjawab instan.',
        badge: 'RAG Harvesting'
      },
      {
        step: 5,
        sender: 'Watson',
        receiver: 'Sherloc',
        action: 'Penyerahan Solusi Ramah Customer',
        example: 'Watson mengemas solusi teknis ke bahasa sederhana dan menyerahkannya ke Sherloc untuk dikirimkan ke pelanggan.',
        badge: 'Handoff'
      }
    ],
    telemetry_broadcast: [
      {
        step: 1,
        sender: 'Nara Engine',
        receiver: 'Siklus Kalender & Filter CAM',
        action: 'Evaluasi Kalender (Tgl 1 Full Audit vs Tgl 2+ Delta)',
        example: 'Nara memisahkan unit CAM (grace period <= 72 jam) dan memetakan unit offline ke grup WhatsApp Customer PRO (PT RAMA, LNJ, dll.).',
        badge: 'Audit Kalender'
      },
      {
        step: 2,
        sender: 'Nara',
        receiver: 'Watson (Gateway Delivery)',
        action: 'Penyusunan Format Pesan Humanized & Anti-Banned',
        example: 'Nara menyerahkan daftar unit offline yang telah di-hash per pelanggan ke Watson untuk dieksekusi broadcast aman.',
        badge: 'Anti-Ban Jitter'
      },
      {
        step: 3,
        sender: 'Watson',
        receiver: 'Grup WhatsApp Customer PRO',
        action: 'Safe Broadcast dengan Delay Jitter 15-45 Detik',
        example: 'Watson menyiarkan peringatan berkala ke grup WA pelanggan dengan jeda acak dan simulasi status "sedang mengetik" (composing).',
        badge: 'Safe Broadcast'
      },
      {
        step: 4,
        sender: 'Member Grup Customer PRO',
        receiver: 'Watson & Nara (Feedback Loop)',
        action: 'Balasan WhatsApp: Perbaikan Bengkel / Aki Dicabut',
        example: 'Pelanggan: "Unit sedang masuk bengkel overhaul mesin minggu ini." Watson menangkap pesan dan meneruskannya ke Nara.',
        badge: 'Inbound Feedback'
      },
      {
        step: 5,
        sender: 'Nara',
        receiver: 'Offline State Tracker (SQLite)',
        action: 'Maintenance Mode: Pause Notifikasi 7 Hari',
        example: 'Nara mem-pause pengiriman peringatan unit tersebut selama 7 hari kalender dan mencatat riwayat ke database.',
        badge: 'Auto Suppress'
      }
    ],
    analytics_sop: [
      {
        step: 1,
        sender: 'Sherloc Chat Logs',
        receiver: 'Velocia (Marketing Strategist)',
        action: 'Batch Mining Kata Kunci & Downstream Chat Analytics',
        example: 'Velocia menganalisis 150+ chat log Sherloc: menemukan lonjakan minat Fuel Sensor BBM (+32%) dan Promo Bundling 5-10 unit (+25%).',
        badge: 'Market Mining'
      },
      {
        step: 2,
        sender: 'Velocia',
        receiver: 'Scout (Researcher)',
        action: 'Pendelegasian Brief Analisis Keluhan Repetitif',
        example: 'Velocia mendelegasikan riset komplain repetitif ke Scout untuk dicarikan solusi panduan mandiri.',
        badge: 'Brief Delegasi'
      },
      {
        step: 3,
        sender: 'Scout',
        receiver: 'Draf SOP Mandiri (Self-Service Guides)',
        action: 'Penyusunan 3 SOP Pemecahan Masalah Mandiri',
        example: 'Scout menerbitkan 3 SOP: (1) Reset PIN Portal Orin, (2) Ekspor Rute Perjalanan > 30 Hari, (3) Notifikasi Geofence WA.',
        badge: 'SOP Published'
      },
      {
        step: 4,
        sender: 'Scout',
        receiver: 'Sherloc (Frontline CS)',
        action: 'Reduksi Beban Kerja Frontline Customer Care 35%',
        example: 'Sherloc kini dapat langsung membagikan link SOP mandiri kepada pelanggan saat keluhan repetitif masuk, menghemat waktu agen.',
        badge: '35% CS Deflection'
      }
    ],
    all: [
      {
        step: 1,
        sender: 'Sherloc',
        receiver: 'Nara',
        action: 'Delegasi Unit Offline',
        example: 'Pengecekan telemetri real-time saat ada komplain GPS tidak aktif.',
        badge: 'Sherloc ➔ Nara'
      },
      {
        step: 2,
        sender: 'Sherloc',
        receiver: 'Watson',
        action: 'Eskalasi Isu Teknis',
        example: 'Eskalasi error firmware / sensor tingkat lanjut ke insinyur.',
        badge: 'Sherloc ➔ Watson'
      },
      {
        step: 3,
        sender: 'Nara',
        receiver: 'Watson',
        action: 'Orkestrasi Safe Broadcast WA',
        example: 'Laporan rekap unit offline disiarkan via WhatsApp Gateway Watson.',
        badge: 'Nara ➔ Watson'
      },
      {
        step: 4,
        sender: 'Watson',
        receiver: 'Nara',
        action: 'Routing Feedback Inbound',
        example: 'Klarifikasi unit masuk bengkel / aki dilepas diserahkan ke state tracker Nara.',
        badge: 'Watson ➔ Nara'
      },
      {
        step: 5,
        sender: 'Sherloc',
        receiver: 'Velocia',
        action: 'Downstream Chat Log Stream',
        example: 'Log percakapan frontline ditambang untuk membaca tren pasar & sentimen.',
        badge: 'Sherloc ➔ Velocia'
      },
      {
        step: 6,
        sender: 'Velocia',
        receiver: 'Scout',
        action: 'Brief Riset & SOP',
        example: 'Mendelegasikan riset isu repetitif untuk dibuatkan panduan mandiri.',
        badge: 'Velocia ➔ Scout'
      },
      {
        step: 7,
        sender: 'Scout',
        receiver: 'Sherloc',
        action: 'Publikasi SOP Mandiri',
        example: 'Panduan self-service digunakan frontline untuk memangkas beban tiket repetitif.',
        badge: 'Scout ➔ Sherloc'
      }
    ]
  }

  const currentSteps = SCENARIO_STEPS[selectedScenario] || SCENARIO_STEPS.offline_unit

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* --- TOP BANNER / HEADER --- */}
      <div className="p-6 bg-linear-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-3xl text-white shadow-md relative overflow-hidden border border-slate-700/50">
        <div className="absolute right-0 top-0 w-80 h-full bg-linear-to-l from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold text-amber-300 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Agent Workflow Architecture & Interkoneksi</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              <Network className="w-6 h-6 text-sky-400" />
              Diagram Alur & Koneksi AI Agent
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Peta interkoneksi, routing pesan cerdas, pendelegasian tugas mandiri, dan protokol kolaborasi 
              antar 5 AI Agent dalam ekosistem Virtual Office Orin.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status Jaringan</div>
              <div className="text-xs font-extrabold text-emerald-400 flex items-center gap-1.5 justify-end">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Semua Jalur Aktif
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SCENARIO SELECTOR CARDS --- */}
      <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-700" />
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Pilih Alur Kerja / Skenario Koneksi
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            Klik skenario untuk memfilter diagram dan urutan langkah delegasi
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {SCENARIOS.map((sc) => {
            const isSelected = selectedScenario === sc.id
            return (
              <button
                key={sc.id}
                onClick={() => setSelectedScenario(sc.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-slate-900 bg-slate-900 text-white shadow-md ring-2 ring-slate-900/10'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 text-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black tracking-tight">{sc.title}</span>
                    <span
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${
                        isSelected ? 'bg-white/20 text-white border-white/20' : sc.badgeColor
                      }`}
                    >
                      {sc.badge}
                    </span>
                  </div>
                  <p className={`text-[11px] leading-relaxed line-clamp-2 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {sc.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* --- INTERACTIVE VISUAL FLOWCHART GRAPH CANVAS --- */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-indigo-600" />
              Peta Visual Topologi Interkoneksi (5 Agen + External Nodes)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Klik pada kartu agen untuk mengunci fokus koneksi (Source & Destination).
            </p>
          </div>

          <div className="flex items-center gap-2">
            {focusedAgent && (
              <button
                onClick={() => setFocusedAgent(null)}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                Reset Fokus Agen
              </button>
            )}
            <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg">
              Mode: {activeScenarioObj.title}
            </span>
          </div>
        </div>

        {/* --- VISUAL CANVAS GRID --- */}
        <div className="relative bg-slate-900 rounded-3xl p-6 sm:p-8 text-white overflow-hidden shadow-inner border border-slate-800">
          {/* Subtle Grid Background Pattern */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />

          {/* Top Row: External Inputs */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800/80">
            {/* Input 1: WhatsApp Customer */}
            <div className="flex items-center gap-3 bg-slate-800/90 border border-slate-700 px-3.5 py-2 rounded-2xl shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Inbound Trigger</div>
                <div className="text-xs font-bold text-slate-200">WhatsApp Customer</div>
              </div>
            </div>

            {/* Directed Connection to Sherloc */}
            <div className="hidden md:flex items-center gap-1.5 text-xs text-amber-400 font-bold bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20 animate-pulse">
              <span>Chat / Audio Inbound</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>

            {/* Input 2: Orin Telemetry API */}
            <div className="flex items-center gap-3 bg-slate-800/90 border border-slate-700 px-3.5 py-2 rounded-2xl shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-sm">
                <Radio className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Live Telemetry API</div>
                <div className="text-xs font-bold text-slate-200">admin-api.orin.id</div>
              </div>
            </div>

            {/* Input 3: WhatsApp Group Engineers */}
            <div className="flex items-center gap-3 bg-slate-800/90 border border-slate-700 px-3.5 py-2 rounded-2xl shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                <Cpu className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Internal Management</div>
                <div className="text-xs font-bold text-slate-200">WA Group Insinyur</div>
              </div>
            </div>
          </div>

          {/* Core Row 1: The 3 Core Operational Agents (Sherloc, Nara, Watson) */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            {/* AGENT 1: SHERLOC */}
            <div
              onClick={() => setFocusedAgent(focusedAgent === 'sherloc' ? null : 'sherloc')}
              className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative ${
                focusedAgent === 'sherloc'
                  ? 'border-amber-400 bg-amber-950/40 shadow-lg ring-4 ring-amber-500/20'
                  : activeScenarioObj.activeAgents.includes('sherloc')
                  ? 'border-amber-500/60 bg-slate-800/80 hover:bg-slate-800'
                  : 'border-slate-800 bg-slate-850/40 opacity-40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-md"
                    style={{ backgroundColor: AGENT_NODES.sherloc.color }}
                  >
                    SH
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">{AGENT_NODES.sherloc.name}</h4>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                      {AGENT_NODES.sherloc.roleBadge}
                    </span>
                  </div>
                </div>
                {focusedAgent === 'sherloc' && (
                  <span className="text-[9px] font-extrabold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                    Fokus Aktif
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {AGENT_NODES.sherloc.desc}
              </p>

              <div className="space-y-1.5 pt-3 border-t border-slate-700/60">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400/90 flex items-center gap-1">
                  <ArrowRight className="w-3 h-3" />
                  Koneksi Keluar (Delegasi):
                </div>
                <div className="flex flex-col gap-1 text-[11px] text-slate-200">
                  <span className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-xl border border-slate-700/60">
                    <span className="w-2 h-2 rounded-full bg-sky-400" />
                    <strong>➔ Nara:</strong> Delegasi GPS Offline & Status Unit
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-xl border border-slate-700/60">
                    <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    <strong>➔ Watson:</strong> Eskalasi Teknis ECU / Firmware
                  </span>
                </div>
              </div>
            </div>

            {/* AGENT 2: NARA */}
            <div
              onClick={() => setFocusedAgent(focusedAgent === 'nara' ? null : 'nara')}
              className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative ${
                focusedAgent === 'nara'
                  ? 'border-sky-400 bg-sky-950/40 shadow-lg ring-4 ring-sky-500/20'
                  : activeScenarioObj.activeAgents.includes('nara')
                  ? 'border-sky-500/60 bg-slate-800/80 hover:bg-slate-800'
                  : 'border-slate-800 bg-slate-850/40 opacity-40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-slate-950 font-black text-sm shadow-md"
                    style={{ backgroundColor: AGENT_NODES.nara.color }}
                  >
                    NR
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">{AGENT_NODES.nara.name}</h4>
                    <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
                      {AGENT_NODES.nara.roleBadge}
                    </span>
                  </div>
                </div>
                {focusedAgent === 'nara' && (
                  <span className="text-[9px] font-extrabold bg-sky-400 text-slate-950 px-2 py-0.5 rounded-full">
                    Fokus Aktif
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {AGENT_NODES.nara.desc}
              </p>

              <div className="space-y-1.5 pt-3 border-t border-slate-700/60">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-sky-400/90 flex items-center gap-1">
                  <ArrowRight className="w-3 h-3" />
                  Koneksi Keluar & Integrasi:
                </div>
                <div className="flex flex-col gap-1 text-[11px] text-slate-200">
                  <span className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-xl border border-slate-700/60">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <strong>➔ Sherloc:</strong> Respon Data Telemetri Baterai/GSM
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-xl border border-slate-700/60">
                    <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    <strong>➔ Watson:</strong> Safe Broadcast Anti-Ban WA Group
                  </span>
                </div>
              </div>
            </div>

            {/* AGENT 3: WATSON */}
            <div
              onClick={() => setFocusedAgent(focusedAgent === 'watson' ? null : 'watson')}
              className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative ${
                focusedAgent === 'watson'
                  ? 'border-indigo-400 bg-indigo-950/40 shadow-lg ring-4 ring-indigo-500/20'
                  : activeScenarioObj.activeAgents.includes('watson')
                  ? 'border-indigo-500/60 bg-slate-800/80 hover:bg-slate-800'
                  : 'border-slate-800 bg-slate-850/40 opacity-40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-md"
                    style={{ backgroundColor: AGENT_NODES.watson.color }}
                  >
                    WT
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">{AGENT_NODES.watson.name}</h4>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                      {AGENT_NODES.watson.roleBadge}
                    </span>
                  </div>
                </div>
                {focusedAgent === 'watson' && (
                  <span className="text-[9px] font-extrabold bg-indigo-400 text-white px-2 py-0.5 rounded-full">
                    Fokus Aktif
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {AGENT_NODES.watson.desc}
              </p>

              <div className="space-y-1.5 pt-3 border-t border-slate-700/60">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400/90 flex items-center gap-1">
                  <ArrowRight className="w-3 h-3" />
                  Koneksi Keluar & Feedback:
                </div>
                <div className="flex flex-col gap-1 text-[11px] text-slate-200">
                  <span className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-xl border border-slate-700/60">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <strong>➔ Sherloc:</strong> Instruksi Solusi Tervalidasi
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-xl border border-slate-700/60">
                    <span className="w-2 h-2 rounded-full bg-sky-400" />
                    <strong>➔ Nara:</strong> Feedback Grup (Servis Bengkel 7 Hari)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Core Row 2: Downstream & Research Pod (Velocia & Scout) */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            {/* AGENT 4: VELOCIA */}
            <div
              onClick={() => setFocusedAgent(focusedAgent === 'velocia' ? null : 'velocia')}
              className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative ${
                focusedAgent === 'velocia'
                  ? 'border-rose-400 bg-rose-950/40 shadow-lg ring-4 ring-rose-500/20'
                  : activeScenarioObj.activeAgents.includes('velocia')
                  ? 'border-rose-500/60 bg-slate-800/80 hover:bg-slate-800'
                  : 'border-slate-800 bg-slate-850/40 opacity-40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-md"
                    style={{ backgroundColor: AGENT_NODES.velocia.color }}
                  >
                    VL
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">{AGENT_NODES.velocia.name}</h4>
                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                      {AGENT_NODES.velocia.roleBadge}
                    </span>
                  </div>
                </div>
                {focusedAgent === 'velocia' && (
                  <span className="text-[9px] font-extrabold bg-rose-400 text-white px-2 py-0.5 rounded-full">
                    Fokus Aktif
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {AGENT_NODES.velocia.desc}
              </p>

              <div className="space-y-1.5 pt-3 border-t border-slate-700/60">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-rose-400/90 flex items-center gap-1">
                  <ArrowRight className="w-3 h-3" />
                  Koneksi Antar Agen:
                </div>
                <div className="flex flex-col gap-1 text-[11px] text-slate-200">
                  <span className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-xl border border-slate-700/60">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <strong>➔ Scout:</strong> Brief Riset Tren & Solusi Mandiri
                  </span>
                </div>
              </div>
            </div>

            {/* AGENT 5: SCOUT */}
            <div
              onClick={() => setFocusedAgent(focusedAgent === 'scout' ? null : 'scout')}
              className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative ${
                focusedAgent === 'scout'
                  ? 'border-emerald-400 bg-emerald-950/40 shadow-lg ring-4 ring-emerald-500/20'
                  : activeScenarioObj.activeAgents.includes('scout')
                  ? 'border-emerald-500/60 bg-slate-800/80 hover:bg-slate-800'
                  : 'border-slate-800 bg-slate-850/40 opacity-40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-md"
                    style={{ backgroundColor: AGENT_NODES.scout.color }}
                  >
                    SC
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">{AGENT_NODES.scout.name}</h4>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                      {AGENT_NODES.scout.roleBadge}
                    </span>
                  </div>
                </div>
                {focusedAgent === 'scout' && (
                  <span className="text-[9px] font-extrabold bg-emerald-400 text-slate-950 px-2 py-0.5 rounded-full">
                    Fokus Aktif
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {AGENT_NODES.scout.desc}
              </p>

              <div className="space-y-1.5 pt-3 border-t border-slate-700/60">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400/90 flex items-center gap-1">
                  <ArrowRight className="w-3 h-3" />
                  Koneksi Antar Agen:
                </div>
                <div className="flex flex-col gap-1 text-[11px] text-slate-200">
                  <span className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-xl border border-slate-700/60">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <strong>➔ Sherloc:</strong> Penerbitan Draf SOP Mandiri (Defleksi CS 35%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Knowledge Storage & Customer WhatsApp Groups */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
            {/* Output 1: Vector DB RAG */}
            <div className="flex items-center gap-3 bg-slate-800/90 border border-slate-700 px-3.5 py-2 rounded-2xl shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
                <Database className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Vector DB RAG Store</div>
                <div className="text-xs font-bold text-slate-200">Harvested Knowledge Base</div>
              </div>
            </div>

            {/* Output 2: WhatsApp Group Customer PRO */}
            <div className="flex items-center gap-3 bg-slate-800/90 border border-slate-700 px-3.5 py-2 rounded-2xl shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Customer PRO Groups</div>
                <div className="text-xs font-bold text-slate-200">Safe Broadcast 15-45s Jitter</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SCENARIO STEP-BY-STEP SIMULATION WALKTHROUGH --- */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-black text-slate-900">
              Urutan Langkah Eksekusi Alur Kerja ({activeScenarioObj.title})
            </h3>
          </div>
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
            {currentSteps.length} Langkah Terjadwal
          </span>
        </div>

        <div className="space-y-3 pt-1">
          {currentSteps.map((st, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5 sm:mt-0">
                  {st.step}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black text-slate-900">{st.sender}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                    <span className="text-xs font-black text-indigo-700">{st.receiver}</span>
                    <span className="text-[10px] font-extrabold bg-indigo-50 text-indigo-800 border border-indigo-200 px-2 py-0.5 rounded-md">
                      {st.badge}
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-700">
                    {st.action}
                  </div>
                  <div className="text-[11px] text-slate-500 italic bg-white p-2.5 rounded-xl border border-slate-200/80 mt-1">
                    {st.example}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- DELEGATION & COLLABORATION MATRIX TABLE --- */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-black text-slate-900">
              Matriks Protokol Delegasi Antar AI Agent (Aturan Bisnis Orin)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Terintegrasi dengan CrewAI & REST API
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Pengirim (Source)</th>
                <th className="py-3 px-4">Penerima (Target)</th>
                <th className="py-3 px-4">Kondisi Pemicu (Trigger)</th>
                <th className="py-3 px-4">Aksi / Protokol Otomasi</th>
                <th className="py-3 px-4">Data Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr className="hover:bg-slate-50/80">
                <td className="py-3 px-4 font-bold text-amber-700">Sherloc</td>
                <td className="py-3 px-4 font-bold text-sky-700">Nara</td>
                <td className="py-3 px-4">Customer mengeluhkan unit GPS offline / tidak muncul di peta</td>
                <td className="py-3 px-4">Pendelegasian instan inspeksi telemetri, tegangan aki & sinyal GSM</td>
                <td className="py-3 px-4 font-mono text-[10px] text-slate-500">nopol, imei, customer_id</td>
              </tr>
              <tr className="hover:bg-slate-50/80">
                <td className="py-3 px-4 font-bold text-sky-700">Nara</td>
                <td className="py-3 px-4 font-bold text-amber-700">Sherloc</td>
                <td className="py-3 px-4">Hasil audit status GPS selesai diambil dari Orin Telemetry API</td>
                <td className="py-3 px-4">Ringkasan diagnosis voltase dan durasi offline untuk dikirimkan ke chat</td>
                <td className="py-3 px-4 font-mono text-[10px] text-slate-500">voltage, duration, gsm_bars</td>
              </tr>
              <tr className="hover:bg-slate-50/80">
                <td className="py-3 px-4 font-bold text-amber-700">Sherloc</td>
                <td className="py-3 px-4 font-bold text-indigo-700">Watson</td>
                <td className="py-3 px-4">Anomali teknis ECU, error kode E-402, sensor BBM fluktuatif</td>
                <td className="py-3 px-4">Pembuatan tiket eskalasi level 2, status diatur ke ON HOLD</td>
                <td className="py-3 px-4 font-mono text-[10px] text-slate-500">ticket_id, anomaly_code</td>
              </tr>
              <tr className="hover:bg-slate-50/80">
                <td className="py-3 px-4 font-bold text-indigo-700">Watson</td>
                <td className="py-3 px-4 font-bold text-amber-700">Sherloc</td>
                <td className="py-3 px-4">Balasan teknis dari insinyur di grup WhatsApp telah tervalidasi</td>
                <td className="py-3 px-4">Menerjemahkan bahasa insinyur ke penjelasan ramah pelanggan</td>
                <td className="py-3 px-4 font-mono text-[10px] text-slate-500">solution_text, customer_ready</td>
              </tr>
              <tr className="hover:bg-slate-50/80">
                <td className="py-3 px-4 font-bold text-sky-700">Nara</td>
                <td className="py-3 px-4 font-bold text-indigo-700">Watson</td>
                <td className="py-3 px-4">Jadwal audit harian (Tgl 1 Full Audit vs Tgl 2+ Delta)</td>
                <td className="py-3 px-4">Orkestrasi Safe Broadcast grup WA dengan jitter 15-45s anti-ban</td>
                <td className="py-3 px-4 font-mono text-[10px] text-slate-500">grouped_reports, jitter_range</td>
              </tr>
              <tr className="hover:bg-slate-50/80">
                <td className="py-3 px-4 font-bold text-indigo-700">Watson</td>
                <td className="py-3 px-4 font-bold text-sky-700">Nara</td>
                <td className="py-3 px-4">Balasan pelanggan di grup WA: unit di bengkel / aki dicopot</td>
                <td className="py-3 px-4">Update database state tracker: jeda notifikasi 7 hari kalender</td>
                <td className="py-3 px-4 font-mono text-[10px] text-slate-500">intent: WORKSHOP_MAINTENANCE</td>
              </tr>
              <tr className="hover:bg-slate-50/80">
                <td className="py-3 px-4 font-bold text-amber-700">Sherloc</td>
                <td className="py-3 px-4 font-bold text-rose-700">Velocia</td>
                <td className="py-3 px-4">Akumulasi log chat percakapan pelanggan terkumpul</td>
                <td className="py-3 px-4">Data mining tren keyword produk, minat bundling & komplain</td>
                <td className="py-3 px-4 font-mono text-[10px] text-slate-500">chat_logs, sentiment_stream</td>
              </tr>
              <tr className="hover:bg-slate-50/80">
                <td className="py-3 px-4 font-bold text-rose-700">Velocia</td>
                <td className="py-3 px-4 font-bold text-emerald-700">Scout</td>
                <td className="py-3 px-4">Temuan isu komplain repetitif (reset PIN, ekspor rute)</td>
                <td className="py-3 px-4">Pendelegasian brief riset SOP panduan mandiri</td>
                <td className="py-3 px-4 font-mono text-[10px] text-slate-500">research_brief, repetitive_qa</td>
              </tr>
              <tr className="hover:bg-slate-50/80">
                <td className="py-3 px-4 font-bold text-emerald-700">Scout</td>
                <td className="py-3 px-4 font-bold text-amber-700">Sherloc</td>
                <td className="py-3 px-4">Dokumen panduan mandiri (SOP Self-Service) selesai disusun</td>
                <td className="py-3 px-4">Pemberian template solusi mandiri untuk defleksi tiket CS 35%</td>
                <td className="py-3 px-4 font-mono text-[10px] text-slate-500">sop_markdown, self_service_urls</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
