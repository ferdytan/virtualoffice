import React, { useState, useEffect, useMemo } from 'react'
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  BarChart3,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  FileText,
  Send,
  Radio,
  WifiOff,
  BellRing,
  Target,
  DollarSign,
  Copy,
  Check,
  Phone,
  Settings,
  Bot,
  ChevronRight,
  Search,
  Filter,
  RefreshCw,
  MessageSquare,
  ShieldAlert,
  Server,
  MapPin,
  ExternalLink,
  UserCheck,
  CheckCircle,
  HelpCircle,
  Layers,
  Cpu,
  Database,
  User,
  Users,
  Smartphone,
  Zap,
  CheckCheck,
  Play,
  Activity,
  Flame,
  ShieldCheck,
  Wrench,
  Video,
  X,
  Edit,
  Edit3,
  Plus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import AgentCloseUpAvatar from './AgentCloseUpAvatar'
import AgentAvatarSettingsView from './AgentAvatarSettingsView'

export default function AgentWorkspaceView({
  agent,
  agents = [],
  onSelectAgent,
  onBackToOffice,
  onOpenCall,
  onSendBrief,
  onSelectAvatarType,
  onUpdateAgentModel,
  onUpdateAgentColor,
  onUpdateAgentStatus
}) {
  const [leftPanelView, setLeftPanelView] = useState('menu') // 'menu' | 'avatar_settings'
  const [copiedId, setCopiedId] = useState(null)

  useEffect(() => {
    setLeftPanelView('menu')
  }, [agent?.id])
  const [briefInput, setBriefInput] = useState('')
  const [briefFeedback, setBriefFeedback] = useState(null)

  // Default active tabs per agent
  const [sherlocTab, setSherlocTab] = useState('inbox') // 'inbox' | 'validation' | 'webhook_sim'
  const [watsonTab, setWatsonTab] = useState('escalations') // 'escalations' | 'group_bridge' | 'knowledge_harvester'
  const [velociaTab, setVelociaTab] = useState('september_plan') // 'september_plan' | ... | 'market_intelligence'
  const [naraTab, setNaraTab] = useState('offline_units') // 'offline_units' | 'telemetry' | 'safe_broadcast'
  const [scoutTab, setScoutTab] = useState('articles') // 'articles' | 'trends' | 'recurring_issues'

  // Search & filter state for Nara's data table
  const [unitSearch, setUnitSearch] = useState('')
  const [severityFilter, setSeverityFilter] = useState('ALL') // ALL, KRITIS, TINGGI, SEDANG
  const [unitSortField, setUnitSortField] = useState('nopol') // 'nopol' | 'device_type' | 'customer_name' | 'offline_duration'
  const [unitSortDirection, setUnitSortDirection] = useState('asc') // 'asc' | 'desc'

  const handleToggleSort = (field) => {
    if (unitSortField === field) {
      setUnitSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setUnitSortField(field)
      setUnitSortDirection('asc')
    }
  }

  // Notification simulation state for Nara's actions
  const [pingedUnits, setPingedUnits] = useState({})
  const [escalatedUnits, setEscalatedUnits] = useState({})
  const [isBroadcasting, setIsBroadcasting] = useState(false)
  const [broadcastProgress, setBroadcastProgress] = useState(null)

  // --- NARA ENGINE EXTENDED INTERACTIVE STATE ---
  const [naraLiveReport, setNaraLiveReport] = useState(null)
  const [naraLoading, setNaraLoading] = useState(false)
  const [naraAuditMode, setNaraAuditMode] = useState(false) // false = Delta, true = Day 1 Full Audit
  const [naraDayOverride, setNaraDayOverride] = useState(null)
  const [naraTableFilter, setNaraTableFilter] = useState('ALL_QUALIFIED') // 'ALL_QUALIFIED' | 'CAM_GRACE' | 'ALL_ORIN'
  const [naraSelectedCustomerTab, setNaraSelectedCustomerTab] = useState(null)
  const [naraDispatching, setNaraDispatching] = useState(false)
  const [naraDispatchResult, setNaraDispatchResult] = useState(null)
  const [naraFeedbackSender, setNaraFeedbackSender] = useState('Pak Bambang (Fleet Ops PT RAMA)')
  const [naraFeedbackMsg, setNaraFeedbackMsg] = useState('Tolong kirim teknisi untuk cek GPS truk L8374VG di pool Legundi.')
  const [naraFeedbackSending, setNaraFeedbackSending] = useState(false)
  const [naraFeedbackResult, setNaraFeedbackResult] = useState(null)
  const [naraFeedbackPreset, setNaraFeedbackPreset] = useState('technician')

  // Customer Group Mapping Modal State (1 Akun = 1 Grup WA)
  const [showGroupModal, setShowGroupModal] = useState(false)
  const [editCustomerId, setEditCustomerId] = useState('')
  const [editCustomerName, setEditCustomerName] = useState('')
  const [inputGroupName, setInputGroupName] = useState('')
  const [inputGroupJid, setInputGroupJid] = useState('')
  const [inputGroupPic, setInputGroupPic] = useState('PIC Operasional')
  const [savingGroupMapping, setSavingGroupMapping] = useState(false)
  const [groupMappingSuccessMsg, setGroupMappingSuccessMsg] = useState(null)
  const [customerGroupMappingsList, setCustomerGroupMappingsList] = useState([])

  // Draft Chat Copy & Dispatch Interaction
  const [draftChatCopyFeedback, setDraftChatCopyFeedback] = useState(null)
  const [isEditingDraft, setIsEditingDraft] = useState(false)
  const [customDraftTexts, setCustomDraftTexts] = useState({})
  const [singleCustomerDispatching, setSingleCustomerDispatching] = useState(false)
  const [singleDispatchFeedback, setSingleDispatchFeedback] = useState(null)

  // Sherloc Interactive State
  const [selectedChatId, setSelectedChatId] = useState('chat-1')
  const [sherlocReplyInput, setSherlocReplyInput] = useState('')
  const [sherlocChatActionFeedback, setSherlocChatActionFeedback] = useState(null)
  const [customerSearchQuery, setCustomerSearchQuery] = useState('')
  const [simCustomerName, setSimCustomerName] = useState('Ahmad Fauzi')
  const [simCustomerPhone, setSimCustomerPhone] = useState('+62 812-9988-7766')
  const [simCustomerMsg, setSimCustomerMsg] = useState('Halo admin Sherloc, GPS unit truk B 1029 SS mati total tidak update dari semalam.')
  const [simWebhookSending, setSimWebhookSending] = useState(false)
  const [simWebhookResult, setSimWebhookResult] = useState(null)

  // Watson Interactive State
  const [selectedTicketId, setSelectedTicketId] = useState('TIK-481')
  const [mgmtReplyInput, setMgmtReplyInput] = useState('')
  const [mgmtReplySending, setMgmtReplySending] = useState(false)
  const [mgmtActionFeedback, setMgmtActionFeedback] = useState(null)
  const [ragSearchQuery, setRagSearchQuery] = useState('')

  if (!agent) return null

  const agentColor = agent.color || '#38bdf8'
  const agentId = agent.id.toLowerCase()

  const copyToClipboard = (text, id) => {
    navigator.clipboard?.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleSendQuickBrief = (e) => {
    e?.preventDefault()
    if (!briefInput.trim()) return
    if (onSendBrief) {
      onSendBrief(agent.id, briefInput.trim())
    }
    setBriefFeedback(`Brief berhasil didelegasikan ke ${agent.name}!`)
    setBriefInput('')
    setTimeout(() => setBriefFeedback(null), 3500)
  }

  // --- SHERLOC WHATSAPP INBOUND CHATS DATA ---
  const [sherlocChats, setSherlocChats] = useState([
    {
      id: 'chat-1',
      sender: 'Budi Santoso',
      phone: '+62 812-8899-1234',
      userType: 'Pelanggan Orin',
      plate: 'B 1842 KZA',
      vehicle: 'Toyota Hilux Double Cabin',
      lastPing: 'Offline sejak kemarin 14:20 WIB',
      message: 'Pak Sherloc, unit GPS mobil operasional saya B 1842 KZA tiba-tiba mati tidak update lokasi dari kemarin siang. Mohon bantuannya untuk dicek apakah ada kendala sinyal.',
      timestamp: 'Baru saja (10:14 WIB)',
      status: 'MENUNGGU BALASAN',
      statusColor: 'bg-amber-100 text-amber-800 border-amber-300',
      actionNeeded: 'Pengecekan Telemetri GPS (Delegasi Nara)',
      replies: [
        { from: 'Budi Santoso', text: 'Pak Sherloc, unit GPS mobil operasional saya B 1842 KZA tiba-tiba mati tidak update lokasi dari kemarin siang. Mohon bantuannya untuk dicek.', time: '10:14 WIB' }
      ]
    },
    {
      id: 'chat-2',
      sender: 'Siti Rahma',
      phone: '+62 813-7766-5544',
      userType: 'Calon Pelanggan',
      plate: 'Armada Baru (5 Truk)',
      vehicle: 'Hino Dutro 130 HD',
      lastPing: 'Belum Terpasang',
      message: 'Halo admin Sherloc! Mau tanya kalau kami pasang GPS Orin untuk 5 armada truk ekspedisi di Cikarang, apakah ada diskon bundling dan gratis pasang di lokasi?',
      timestamp: '12 mnt lalu (10:02 WIB)',
      status: 'TERSEDIA FAQ RAG',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      actionNeeded: 'Jawab Paket Langganan & Promo Bundling',
      replies: [
        { from: 'Siti Rahma', text: 'Halo admin Sherloc! Mau tanya kalau kami pasang GPS Orin untuk 5 armada truk ekspedisi di Cikarang, apakah ada diskon bundling dan gratis pasang di lokasi?', time: '10:02 WIB' }
      ]
    },
    {
      id: 'chat-3',
      sender: 'Hendra Wijaya',
      phone: '+62 856-1122-3344',
      userType: 'Pelanggan Orin',
      plate: 'D 9912 ABE',
      vehicle: 'Isuzu Giga Wingbox',
      lastPing: 'Online (Indikator Anomali)',
      message: 'Selamat pagi, lampu indikator unit GPS kami kedip merah cepat berulang-ulang dengan kode error E-402 di aplikasi. Sudah coba mati-hidupkan kontak tetap tidak mau sinkron.',
      timestamp: '25 mnt lalu (09:49 WIB)',
      status: 'PERLU ESKALASI',
      statusColor: 'bg-purple-100 text-purple-800 border-purple-300',
      actionNeeded: 'Eskalasi ke Watson (Issue Teknis ECU)',
      replies: [
        { from: 'Hendra Wijaya', text: 'Selamat pagi, lampu indikator unit GPS kami kedip merah cepat berulang-ulang dengan kode error E-402 di aplikasi. Sudah coba mati-hidupkan kontak tetap tidak mau sinkron.', time: '09:49 WIB' }
      ]
    }
  ])

  // --- ORIN CUSTOMER USER DATABASE ---
  const ORIN_USER_DATABASE = [
    {
      phone: '+62 812-8899-1234',
      name: 'Budi Santoso',
      email: 'budi.santoso@logistikjaya.co.id',
      company: 'PT Logistik Jaya Abadi',
      type: 'Pelanggan Orin Aktif',
      plate: 'B 1842 KZA',
      imei: '864902049182341',
      package: 'Orin Fleet Pro 1 Tahun',
      status: 'Aktif (Expired: 15 Des 2026)',
      deviceModel: 'Orin Tracker OBD-II v4'
    },
    {
      phone: '+62 856-1122-3344',
      name: 'Hendra Wijaya',
      email: 'hendra@expresstrans.com',
      company: 'Express Trans Cargo',
      type: 'Pelanggan Orin Aktif',
      plate: 'D 9912 ABE',
      imei: '864902049901234',
      package: 'Orin Heavy Duty CAN-Bus',
      status: 'Aktif (Expired: 20 Nov 2026)',
      deviceModel: 'Orin Fleet Heavy Sensor'
    },
    {
      phone: '+62 813-7766-5544',
      name: 'Siti Rahma',
      email: 'siti.rahma@gmail.com',
      company: 'CV Rahma Berkah Mandiri',
      type: 'Calon Pelanggan',
      plate: '-',
      imei: '-',
      package: 'Prospek Armada 5 Truk',
      status: 'Tahap Negosiasi Bundling Q4',
      deviceModel: '-'
    },
    {
      phone: '+62 811-2233-4455',
      name: 'Irwan Setiadi',
      email: 'irwan@nusantara-mining.com',
      company: 'Nusantara Mining Resources',
      type: 'Pelanggan Orin Aktif',
      plate: 'KT 8192 LK',
      imei: '864902041122334',
      package: 'Orin Satellite Dual-Mode',
      status: 'Aktif (Expired: 10 Jan 2027)',
      deviceModel: 'Orin Mining Geo-Sens'
    }
  ]

  // --- WATSON TECHNICAL ESCALATION TICKETS DATA ---
  const [watsonTickets, setWatsonTickets] = useState([
    {
      id: 'TIK-481',
      title: 'Lampu Indikator Kedip Merah & Error Code E-402',
      customer: 'Hendra Wijaya (+62 856-1122-3344)',
      vehicle: 'Isuzu Giga D 9912 ABE',
      sherlocNote: 'Pelanggan mencoba reset kontak 3x tetap gagal. Butuh instruksi teknis engineering.',
      status: 'TERJAWAB (Q&A TERHARVEST)',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      solution: 'Gunakan protokol SMS restart modul: kirim perintah "RESTART#402" ke nomor SIM unit. Tunggu 60 detik hingga lampu LED berubah biru stabil.',
      managementReply: 'Jawaban Dimas (Lead Eng): "Kirim SMS restart kode 402, anomali handshake buffer pasca update firmware."',
      harvested: true
    },
    {
      id: 'TIK-482',
      title: 'SIM Card Modem Lock Pasca Roaming Antar Pulau',
      customer: 'PT Kargo Lintas (+62 812-3344-5566)',
      vehicle: 'Fuso Tronton B 9021 WX',
      sherlocNote: 'Unit menyeberang Merak-Bakauheni, paket data tidak dial-up kembali otomatis.',
      status: 'MENUNGGU BALASAN MANAGEMENT',
      statusColor: 'bg-amber-100 text-amber-800 border-amber-300',
      solution: 'Menunggu instruksi APN gateway roaming dari grup manajemen internal...',
      managementReply: 'Menunggu respon di WA Group "Orin Lead Engineers"...',
      harvested: false
    },
    {
      id: 'TIK-483',
      title: 'Fluktuasi Sensor Bahan Bakar (BBM) Kapasitif > 25%',
      customer: 'Armada Tambang Kalbar (+62 811-7788-9900)',
      vehicle: 'Dump Truck KT 4821 OP',
      sherlocNote: 'Grafik fuel sensor melonjak tajam saat kendaraan melewati medan off-road.',
      status: 'TERJAWAB (Q&A TERHARVEST)',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      solution: 'Aktifkan moving-average filter tingkat 3 di portal telemetry via OTA kalibrasi 5Hz.',
      managementReply: 'Hendra (VP Tech): "Aktifkan moving-average filter tingkat 3 di portal telemetry OTA."',
      harvested: true
    }
  ])

  // --- WATSON HARVESTED Q&A DATABASE (VECTOR STORE) ---
  const [harvestedQA, setHarvestedQA] = useState([
    {
      id: 'QA-01',
      question: 'Bagaimana cara mengatasi lampu indikator GPS kedip merah dengan error E-402?',
      answer: 'Kirim SMS "RESTART#402" ke nomor kartu SIM di dalam unit. Tunggu 60 detik untuk flushing buffer dan sinkronisasi modem GSM.',
      category: 'FIRMWARE & HARDWARE',
      confidence: '98.5%',
      source: 'WA Group Reply by Dimas (Lead Engineer)',
      status: 'Vector DB Synced'
    },
    {
      id: 'QA-02',
      question: 'Berapa batas toleransi fluktuasi sensor BBM kapasitif dan bagaimana solusinya?',
      answer: 'Toleransi normal adalah <5%. Jika fluktuasi >20%, aktifkan moving-average filter tingkat 3 melalui portal telemetri OTA.',
      category: 'SENSOR TELEMETRI',
      confidence: '95.2%',
      source: 'WA Group Reply by Hendra (VP Tech)',
      status: 'Vector DB Synced'
    },
    {
      id: 'QA-03',
      question: 'Bagaimana memulihkan GPS yang terkunci APN pasca roaming penyeberangan kapal laut?',
      answer: 'Gunakan perintah USSD OTA *888# atau kirim perintah remote switch APN ke backup gateway: "SET#APN#ORINROAM".',
      category: 'NETWORK & TELECOM',
      confidence: '93.8%',
      source: 'WA Group Reply by Tim Infra',
      status: 'Vector DB Synced'
    }
  ])

  // --- NARA SAFE BROADCAST QUEUE DATA ---
  const NARA_SAFE_BROADCAST_QUEUE = [
    {
      group: 'Grup WhatsApp Teknisi Regional Jabodetabek',
      units: 'UNIT-JKT-402, UNIT-JKT-105',
      delayJitter: 'Jitter 28 detik (Random 15-45s)',
      typingStatus: 'Typing simulator (composing 3.5s)',
      template: 'Template C (Rotasi Anti-Spam)',
      status: 'Siap Kirim'
    },
    {
      group: 'Grup WhatsApp Respon Cepat Jawa Timur',
      units: 'UNIT-SBY-108',
      delayJitter: 'Jitter 41 detik (Random 15-45s)',
      typingStatus: 'Typing simulator (composing 4.0s)',
      template: 'Template A (Rotasi Anti-Spam)',
      status: 'Dalam Antrean'
    },
    {
      group: 'Grup WhatsApp Teknisi Jawa Barat',
      units: 'UNIT-BDG-214',
      delayJitter: 'Jitter 19 detik (Random 15-45s)',
      typingStatus: 'Typing simulator (composing 3.0s)',
      template: 'Template B (Rotasi Anti-Spam)',
      status: 'Dalam Antrean'
    }
  ]

  // --- VELOCIA MARKET TRENDS FROM SHERLOC CHAT LOGS ---
  const VELOCIA_MARKET_TRENDS = [
    { keyword: 'Sensor BBM (Fuel Sensor)', count: 54, growth: '+32%', sentiment: 'Sangat Tinggi', note: 'Permintaan audit solar dan deteksi pencurian BBM armada logistik' },
    { keyword: 'GPS Tracker Mini / Portable Magnet', count: 41, growth: '+18%', sentiment: 'Tinggi', note: 'Kebutuhan proteksi rental mobil & leasing tanpa potong kabel aki' },
    { keyword: 'Promo Bundling Armada 5-10 Unit', count: 36, growth: '+25%', sentiment: 'Sangat Positif', note: 'Calon pelanggan enterprise mencari diskon setup awal kuartal Q4' },
    { keyword: 'Fitur Matikan Mesin Jarak Jauh (Immobilizer)', count: 29, growth: '+12%', sentiment: 'Stabil', note: 'Kebutuhan standar keamanan anti-pencurian kendaraan' }
  ]

  // --- SCOUT RECURRING ISSUES & SOP TUTORIAL DRAFTS ---
  const SCOUT_RECURRING_ISSUES = [
    { issue: 'Lupa Password Akun & Reset PIN Portal Orin', frequency: '38 tiket/minggu', priority: 'TINGGI', impact: 'Beban CS 35%', sopStatus: 'Draf Panduan Selesai' },
    { issue: 'Ekspor Riwayat Rute Perjalanan > 30 Hari', frequency: '24 tiket/minggu', priority: 'SEDANG', impact: 'Beban CS 22%', sopStatus: 'Draf Panduan Selesai' },
    { issue: 'Notifikasi Geofence Tidak Masuk ke WhatsApp', frequency: '17 tiket/minggu', priority: 'SEDANG', impact: 'Beban CS 15%', sopStatus: 'Draf Panduan Selesai' }
  ]

  // --- VELOCIA MARKETING PLANS DATA ---
  const VELOCIA_PLANS = {
    september_plan: {
      id: 'september_plan',
      title: '30 Day Plan Marketing September',
      badge: 'SEDANG BERJALAN',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      period: '1 September — 30 September 2026',
      budget: 'Rp 145.000.000',
      targetKPI: '2.500 Sign-ups / 180 B2B Enterprise Leads',
      objective: 'Akselerasi akuisisi pengguna awal untuk platform Virtual Office 3D melalui strategi funnel multi-channel dan demo interaktif terpandu.',
      weeklyMilestones: [
        {
          week: 'Minggu 1',
          dateRange: '1 - 7 Sept',
          title: 'Brand Awareness & Influencer Teaser Sprint',
          items: [
            'Rilis video teaser berdurasi 45 detik: "Ruang Kerja Masa Depan Telah Tiba" di LinkedIn & X.',
            'Kemitraan dengan 5 tech influencer untuk unboxing demo 3D Virtual Office.',
            'Optimalisasi SEO halaman pendaftaran dan setup Google Ads Search Campaign.'
          ],
          status: 'Selesai'
        },
        {
          week: 'Minggu 2',
          dateRange: '8 - 14 Sept',
          title: 'Peluncuran Interaktif & Webinar Eksklusif',
          items: [
            'Webinar Live Demo: "Mendelegasikan Tugas ke 3 AI Agent Otonom dalam 5 Menit".',
            'Program Referral Karyawan: Dapatkan akses gratis 3 bulan untuk setiap tim yang diajak.',
            'Distribusi siaran pers ke portal berita teknologi terkemuka.'
          ],
          status: 'Selesai'
        },
        {
          week: 'Minggu 3',
          dateRange: '15 - 21 Sept',
          title: 'Retargeting Funnel & Mid-Month Conversion Push',
          items: [
            'Retargeting pengunjung demo yang belum mendaftar dengan studi kasus efisiensi kerja tim.',
            'Email blast seri edukasi: Cara kerja Nara, Velocia, dan Scout dalam menghemat 30 jam kerja/minggu.',
            'A/B testing 3 headline utama landing page untuk meningkatkan conversion rate dari 3.2% ke 4.8%.'
          ],
          status: 'Berlangsung'
        },
        {
          week: 'Minggu 4',
          dateRange: '22 - 30 Sept',
          title: 'Showcase Testimonial & Review Kuartal',
          items: [
            'Publikasi studi kasus keberhasilan klien pilot enterprise sektor fintech.',
            'Evaluasi biaya akuisisi (CAC) per channel dan realokasi sisa anggaran ke channel berkinerja tertinggi.',
            'Finalisasi materi promosi menyambut kuartal IV (Q4).'
          ],
          status: 'Terjadwal'
        }
      ],
      channels: [
        { name: 'LinkedIn Ads & Organic Thought Leadership', share: '40%', percentage: 40, budget: 'Rp 58.000.000', note: 'Target C-Level, VP Eng, & Founders' },
        { name: 'Google Ads & Performance Max Search', share: '30%', percentage: 30, budget: 'Rp 43.500.000', note: 'Kata kunci intent tinggi: AI office, remote tool' },
        { name: 'Kemitraan & Influencer Tech Collaboration', share: '20%', percentage: 20, budget: 'Rp 29.000.000', note: 'Demo video review & co-marketing sprint' },
        { name: 'Email Marketing & Retargeting Lead Funnel', share: '10%', percentage: 10, budget: 'Rp 14.500.000', note: 'Drip campaign 5 seri edukasi otomatis' }
      ]
    },
    pameran_oktober: {
      id: 'pameran_oktober',
      title: 'Program Pameran Oktober',
      badge: 'TERENCANA / LOGISTIK',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      period: '12 — 15 Oktober 2026',
      budget: 'Rp 220.000.000',
      targetKPI: '400+ Qualified Enterprise Leads / 25 Closed Pilot Deals',
      objective: 'Menjadi sorotan utama di Tech Expo Indonesia 2026 dengan booth experiential 3D interaktif yang memungkinkan pengunjung berinteraksi langsung dengan AI Agent.',
      weeklyMilestones: [
        {
          week: 'Fase Persiapan',
          dateRange: '1 - 10 Okt',
          title: 'Pembangunan Booth & Rigging Hardware Interaktif',
          items: [
            'Pemasangan layar LED cembung 3x2m untuk menampilkan ruang kerja Virtual Office 3D secara 1:1 skala nyata.',
            'Setup 4 unit terminal demo bagi pengunjung untuk mencoba briefing ke Nara, Velocia, dan Scout.',
            'Pencetakan QR badge VIP dan materi brosur eksklusif hard-cover.'
          ],
          status: 'Persiapan'
        },
        {
          week: 'Fase Eksekusi',
          dateRange: '12 - 15 Okt',
          title: 'Hari Pameran & Sesi Keynote Panggung Utama',
          items: [
            'Sesi Keynote panggung utama: "Arsitektur Multi-Agent 3D: Memangkas Silo Komunikasi Perusahaan".',
            'Live voice briefing interaktif di booth: Memanggil agen dan melihat respon seketika di monitor 3D.',
            'VIP Networking Dinner bersama 30 CTO & VP of Technology pada malam ke-2.'
          ],
          status: 'Terjadwal'
        },
        {
          week: 'Fase Follow-up',
          dateRange: '16 - 25 Okt',
          title: 'Nurturing & Penutupan Kesepakatan Pilot',
          items: [
            'Pemasukan 400+ lead ke sistem CRM dengan segmentasi tingkat kesiapan.',
            'Penawaran uji coba khusus 30 hari pilot terpandu bagi 50 enterprise terpilih.',
            'Pengiriman ringkasan materi dan rekaman sesi keynote kepada seluruh pengunjung booth.'
          ],
          status: 'Terjadwal'
        }
      ],
      channels: [
        { name: 'Sewa Lahan Booth & Konstruksi Arsitektural', share: '50%', percentage: 50, budget: 'Rp 110.000.000', note: 'Paviliun 6x6 meter di hall utama expo' },
        { name: 'Hardware Audio-Visual & Curved LED 3D Wall', share: '25%', percentage: 25, budget: 'Rp 55.000.000', note: 'Layar interaktif 4K & mikrofon spatial directional' },
        { name: 'VIP Executive Dinner & Hospitality', share: '15%', percentage: 15, budget: 'Rp 33.000.000', note: 'Private suite reservation untuk 30 VIP CTO' },
        { name: 'Merchandise Premium & Collateral Kit', share: '10%', percentage: 10, budget: 'Rp 22.000.000', note: 'Hardcover lookbook & souvenir kustom tim' }
      ]
    },
    collab_oktober: {
      id: 'collab_oktober',
      title: 'Plan Collab Oktober',
      badge: 'NEGOSIASI / MOU',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      period: '1 Oktober — 31 Oktober 2026',
      budget: 'Rp 85.000.000',
      targetKPI: '3 Kemitraan Strategis / 50.000 Cross-Audience Reach',
      objective: 'Membangun aliansi strategis dengan penyedia SaaS enterprise dan produsen hardware spatial untuk co-marketing dan bundling produk.',
      weeklyMilestones: [
        {
          week: 'Kolaborasi 1',
          dateRange: '1 - 10 Okt',
          title: 'Bundling Display Workstation Hardware Partner',
          items: [
            'Kerjasama dengan produsen monitor ultra-wide: Demo Virtual Office dipasang pre-installed di display showroom resmi.',
            'Diskon bundling: Pembelian layar workstation mendapatkan lisensi 6 bulan Virtual Office AI.'
          ],
          status: 'MOU Draft'
        },
        {
          week: 'Kolaborasi 2',
          dateRange: '11 - 20 Okt',
          title: 'Co-Branded Webinar & Enterprise Cloud Marketplace',
          items: [
            'Listing Virtual Office AI di marketplace cloud terkemuka.',
            'Pelaksanaan seri webinar kolaboratif: "Automated CS & Task Management di Era AI Spatial".'
          ],
          status: 'Finalisasi'
        },
        {
          week: 'Kolaborasi 3',
          dateRange: '21 - 31 Okt',
          title: 'Komunitas Developer & Startup Accelerator Hub',
          items: [
            'Sponsor utama workshop virtual office di inkubator startup regional.',
            'Penyediaan API key uji coba bagi 100 startup peserta program inkubasi.'
          ],
          status: 'Konfirmasi'
        }
      ],
      channels: [
        { name: 'Co-Branded Events & Workshop Nasional', share: '45%', percentage: 45, budget: 'Rp 38.250.000', note: '3 kota besar bersama partner cloud' },
        { name: 'Marketing Collateral & PR Bersama', share: '30%', percentage: 30, budget: 'Rp 25.500.000', note: 'Joint press release & feature artikel tech portal' },
        { name: 'Legal Review & Integrasi Teknis MOU API', share: '25%', percentage: 25, budget: 'Rp 21.250.000', note: 'Notaris, agreement, dan endpoint connector' }
      ]
    },
    end_year_sale: {
      id: 'end_year_sale',
      title: 'Plan End Year Sale (Q4 Promo)',
      badge: 'PERSIAPAN AKHIR TAHUN',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      period: '15 November — 31 Desember 2026',
      budget: 'Rp 190.000.000',
      targetKPI: 'Rp 1.25 Milyar Pendapatan Baru / 350 Langganan Tahunan',
      objective: 'Memanfaatkan momen penutupan anggaran perusahaan akhir tahun dengan penawaran diskon lisensi tahunan bernilai tinggi dan insentif upgrade.',
      weeklyMilestones: [
        {
          week: 'Fase 1',
          dateRange: '15 - 24 Nov',
          title: 'Kampanye "Early Bird 2027 Workspace Upgrade"',
          items: [
            'Pemberitahuan awal kepada pengguna gratis dan freemium mengenai penawaran akhir tahun.',
            'Rilis kalkulator ROI online: Hitung berapa biaya operasional yang dihemat dengan beralih ke paket tahunan.'
          ],
          status: 'Draft'
        },
        {
          week: 'Fase 2',
          dateRange: '25 Nov - 5 Des',
          title: 'Flash Sale: Diskon 40% Paket Lisensi Tahunan Enterprise',
          items: [
            'Penawaran terbatas: Diskon 40% untuk komitmen tahunan paket tim 10+ kursi.',
            'Bonus gratis setup kustom 3D avatar & integrasi workflow internal perusahaan.',
            'Kampanye retargeting agresif di seluruh platform digital.'
          ],
          status: 'Draft'
        },
        {
          week: 'Fase 3',
          dateRange: '20 - 31 Des',
          title: 'Hitung Mundur Akhir Tahun: "Gunakan Sisa Budget Q4"',
          items: [
            'Email blast berorientasi CFO/Finance: "Maksimalkan Sisa Alokasi Anggaran 2026 untuk Efisiensi 2027".',
            'Sistem invoice instan dengan tanggal pembukuan 2026 untuk memudahkan administrasi pajak klien.'
          ],
          status: 'Draft'
        }
      ],
      channels: [
        { name: 'Diskon Promosi & Subsider Kupon Tahunan', share: '40%', percentage: 40, budget: 'Rp 76.000.000', note: 'Potongan harga paket bundling tahunan enterprise' },
        { name: 'Kampanye Iklan Paid Search & Retargeting', share: '35%', percentage: 35, budget: 'Rp 66.500.000', note: 'Iklan Google Search, LinkedIn sponsored content' },
        { name: 'Email Automation & Outbound Sales Team', share: '25%', percentage: 25, budget: 'Rp 47.500.000', note: 'Direct outreach ke 500 akun prospek aktif' }
      ]
    }
  }

  // Filtered units for Nara (Live Orin Telemetry)
  const filteredUnits = useMemo(() => {
    if (!naraLiveReport) {
      return []
    }

    let rawList = []
    if (naraTableFilter === 'ALL_QUALIFIED') {
      rawList = naraLiveReport.valid_devices || []
    } else if (naraTableFilter === 'CAM_GRACE') {
      rawList = naraLiveReport.suppressed_cam_devices || []
    } else {
      rawList = [...(naraLiveReport.valid_devices || []), ...(naraLiveReport.suppressed_cam_devices || [])]
    }

    const query = unitSearch.toLowerCase().trim()
    let list = rawList.filter((dev) => {
      if (!query) return true
      return (
        String(dev.nopol || '').toLowerCase().includes(query) ||
        String(dev.device_name || '').toLowerCase().includes(query) ||
        String(dev.device_sn || '').toLowerCase().includes(query) ||
        String(dev.customer_name || '').toLowerCase().includes(query) ||
        String(dev.device_type || '').toLowerCase().includes(query)
      )
    })

    // Sort according to unitSortField & unitSortDirection
    list.sort((a, b) => {
      if (unitSortField === 'nopol') {
        const valA = (a.nopol || a.device_name || a.id || '').toString().toLowerCase()
        const valB = (b.nopol || b.device_name || b.id || '').toString().toLowerCase()
        return unitSortDirection === 'asc' ? valA.localeCompare(valB, undefined, { numeric: true }) : valB.localeCompare(valA, undefined, { numeric: true })
      }
      if (unitSortField === 'device_type') {
        const typeA = (a.device_type || (a.is_cam ? 'CAM' : 'GPS')).toString().toLowerCase()
        const typeB = (b.device_type || (b.is_cam ? 'CAM' : 'GPS')).toString().toLowerCase()
        return unitSortDirection === 'asc' ? typeA.localeCompare(typeB) : typeB.localeCompare(typeA)
      }
      if (unitSortField === 'customer_name') {
        const custA = (a.customer_name || '').toString().toLowerCase()
        const custB = (b.customer_name || '').toString().toLowerCase()
        return unitSortDirection === 'asc' ? custA.localeCompare(custB) : custB.localeCompare(custA)
      }
      if (unitSortField === 'offline_duration') {
        const numA = Number(a.offline_hours ?? 0)
        const numB = Number(b.offline_hours ?? 0)
        return unitSortDirection === 'asc' ? numA - numB : numB - numA
      }
      return 0
    })

    return list
  }, [naraLiveReport, naraTableFilter, unitSearch, unitSortField, unitSortDirection])

  // --- SCOUT RESEARCH & ARTICLE LAB DATA ---
  const SCOUT_ARTICLES = [
    {
      id: 'article-1',
      title: 'Masa Depan Virtual Office 3D: Kolaborasi Multi-Agent Tanpa Batas di 2026',
      category: 'TREN TEKNOLOGI',
      readTime: '6 menit baca',
      seoScore: '94/100',
      status: 'Siap Publikasi',
      summary: 'Analisis komprehensif mengenai bagaimana ruang kerja 3D spasial menggantikan platform meeting 2D statis dan meningkatkan engagement tim hingga 35%.',
      content: `Dunia kerja hybrid telah mencapai titik balik krusial di tahun 2026. Selama bertahun-tahun, platform video conference dua dimensi telah menjadi standar, namun fenomena "Zoom fatigue" dan hilangnya rasa kebersamaan fisik menjadi tantangan besar bagi produktivitas tim jarak jauh.

Virtual Office 3D hadir bukan sekadar sebagai visualisasi grafis, melainkan arsitektur ruang kerja kolaboratif yang menggabungkan spatial computing dengan agen kecerdasan buatan otonom. Dengan representasi spasial 3D, interaksi antar anggota tim terasa natural—seperti menengok ke meja rekan kerja, mengadakan diskusi spontan di lounge, hingga mendelegasikan tugas ke AI Agent yang duduk tepat di seberang meja Anda.

Hasil uji coba industri menunjukkan bahwa ruang kerja spasial 3D mampu mempersingkat waktu koordinasi tim hingga 40% dan mengembalikan budaya kantor yang dinamis tanpa mengorbankan fleksibilitas kerja jarak jauh.`
    },
    {
      id: 'article-2',
      title: 'Studi Kasus: Bagaimana AI Agent Otonom Menghemat 40 Jam Kerja Tim Setiap Minggu',
      category: 'STUDI KASUS ENTERPRISE',
      readTime: '8 menit baca',
      seoScore: '91/100',
      status: 'Siap Publikasi',
      summary: 'Kajian nyata implementasi tim multi-agent (CS Reminder, Strategist, dan Researcher) pada perusahaan logistik berskala nasional.',
      content: `Mengelola operasional ribuan unit regional dan ratusan tiket eskalasi setiap hari biasanya membutuhkan tim koordinator beranggotakan puluhan staf. Namun, keterlambatan informasi dan human error seringkali membuat unit offline tidak tertangani selama berjam-jam.

Dengan menempatkan agen otonom khusus—seperti Nara yang bertugas mengaudit detak telemetri dan langsung mengontak teknisi lapangan via WhatsApp otomatis—rata-rata waktu respon terhadap unit bermasalah terpangkas dari 90 menit menjadi hanya 4.2 menit.

Sementara itu, agen riset dan strategi marketing seperti Scout dan Velocia mengotomatisasi penyusunan draf proposal, riset kompetitor mingguan, dan kalender promosi secara instan tanpa perlu menunggu rapat koordinasi berjam-jam.`
    },
    {
      id: 'article-3',
      title: 'WebGL & React Three Fiber di Lingkungan Korporat: Standar Baru Web App Modern',
      category: 'ENGINEERING & UI/UX',
      readTime: '5 menit baca',
      seoScore: '88/100',
      status: 'Draf Peninjauan',
      summary: 'Panduan teknis bagi tim pengembang web dalam mengimplementasikan 3D web canvas berperforma tinggi dengan Three.js tanpa membebani memori browser pengguna.',
      content: `Dahulu grafis 3D interaktif pada web dianggap berat dan hanya cocok untuk website pameran portofolio khusus. Namun dengan evolusi WebGL2, kompresi mesh Draco, serta ekosistem React Three Fiber yang matang, antarmuka 3D kini menjadi standar antarmuka bisnis modern.

Kuncinya terletak pada teknik optimasi aset: penggunaan skeletal animation terkompresi, contact shadows yang efisien, dan rendering terarah hanya saat viewport aktif. Hal ini memungkinkan dashboard 3D berjalan mulus pada 60 FPS bahkan di laptop kantoran standar.`
    }
  ]

  const handlePingUnit = (unitId) => {
    setPingedUnits((prev) => ({ ...prev, [unitId]: 'Ping OK (38ms)' }))
    setTimeout(() => {
      setPingedUnits((prev) => ({ ...prev, [unitId]: null }))
    }, 4000)
  }

  const handleEscalateUnit = (unitId, techName) => {
    setEscalatedUnits((prev) => ({ ...prev, [unitId]: `WA Terkirim ke ${techName}!` }))
    setTimeout(() => {
      setEscalatedUnits((prev) => ({ ...prev, [unitId]: null }))
    }, 4500)
  }

  const handleDelegatePlan = (planTitle) => {
    if (onSendBrief) {
      onSendBrief(agent.id, `Tolong evaluasi dan siapkan eksekusi detail untuk: ${planTitle}`)
      setBriefFeedback(`Rencana "${planTitle}" didelegasikan ke ${agent.name}!`)
      setTimeout(() => setBriefFeedback(null), 3500)
    }
  }

  // --- SHERLOC ACTIONS ---
  const handleSherlocSendReply = (chatId) => {
    if (!sherlocReplyInput.trim()) return
    setSherlocChats((prev) =>
      prev.map((c) => {
        if (c.id === chatId) {
          return {
            ...c,
            status: 'SUDAH DIBALAS',
            statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
            replies: [
              ...(c.replies || []),
              {
                from: 'Sherloc (Frontline Voice)',
                text: sherlocReplyInput.trim(),
                time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
              }
            ]
          }
        }
        return c
      })
    )
    setSherlocChatActionFeedback('Balasan terkirim ke customer!')
    setSherlocReplyInput('')
    setTimeout(() => setSherlocChatActionFeedback(null), 3000)
  }

  const handleSherlocDelegateToNara = (chat) => {
    const brief = `Pengecekan telemetri & ping untuk unit ${chat.plate} (${chat.vehicle}) milik ${chat.sender}. Kendala: ${chat.message}`
    if (onSendBrief) {
      onSendBrief('nara', brief)
    }
    setSherlocChats((prev) =>
      prev.map((c) =>
        c.id === chat.id
          ? {
              ...c,
              status: 'DIDELEGASIKAN KE NARA',
              statusColor: 'bg-blue-100 text-blue-800 border-blue-300',
              replies: [
                ...(c.replies || []),
                {
                  from: 'System (Internal Protocol)',
                  text: `[Delegasi ke Nara]: Nara sedang melakukan inspeksi detak telemetri & sinyal GSM untuk plat ${chat.plate}.`,
                  time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
                }
              ]
            }
          : c
      )
    )
    setSherlocChatActionFeedback(`Tugas deteksi unit ${chat.plate} diteruskan ke Nara!`)
    setTimeout(() => setSherlocChatActionFeedback(null), 3500)
  }

  const handleSherlocEscalateToWatson = (chat) => {
    const brief = `Eskalasi teknis ECU/Modem unit ${chat.plate} milik ${chat.sender}. Isu: ${chat.message}`
    if (onSendBrief) {
      onSendBrief('watson', brief)
    }
    setSherlocChats((prev) =>
      prev.map((c) =>
        c.id === chat.id
          ? {
              ...c,
              status: 'DIESKALASI KE WATSON',
              statusColor: 'bg-purple-100 text-purple-800 border-purple-300',
              replies: [
                ...(c.replies || []),
                {
                  from: 'System (Internal Protocol)',
                  text: `[Eskalasi ke Watson]: Diteruskan ke WhatsApp Group Tim Manajemen Orin untuk resolusi firmware/sensor.`,
                  time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
                }
              ]
            }
          : c
      )
    )
    setSherlocChatActionFeedback(`Eskalasi teknis dikirim ke Watson & WA Management!`)
    setTimeout(() => setSherlocChatActionFeedback(null), 3500)
  }

  const handleTriggerInboundWebhook = async (e) => {
    e?.preventDefault()
    if (!simCustomerMsg.trim()) return
    setSimWebhookSending(true)
    setSimWebhookResult(null)

    try {
      const res = await fetch('/api/webhook/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: simCustomerPhone,
          sender_name: simCustomerName,
          message: simCustomerMsg,
          timestamp: new Date().toISOString()
        })
      })
      const data = await res.json()
      setSimWebhookResult(data)

      const newChat = {
        id: `chat-${Date.now()}`,
        sender: simCustomerName,
        phone: simCustomerPhone,
        userType: data.user_type || 'Pelanggan Orin',
        plate: data.plate || 'B 1029 SS',
        vehicle: data.vehicle || 'Mitsubishi Canter HD',
        lastPing: 'Live Inbound Stream',
        message: simCustomerMsg,
        timestamp: 'Baru saja',
        status: data.action === 'escalated' ? 'DIESKALASI KE WATSON' : 'MENUNGGU BALASAN',
        statusColor: data.action === 'escalated' ? 'bg-purple-100 text-purple-800 border-purple-300' : 'bg-amber-100 text-amber-800 border-amber-300',
        actionNeeded: data.action || 'Respon Frontline',
        replies: [
          { from: simCustomerName, text: simCustomerMsg, time: 'Baru saja' },
          ...(data.reply ? [{ from: 'Sherloc (Frontline Voice)', text: data.reply, time: 'Baru saja' }] : [])
        ]
      }
      setSherlocChats((prev) => [newChat, ...prev])
      setSelectedChatId(newChat.id)
    } catch (err) {
      const simulatedReply = `Halo Bapak/Ibu ${simCustomerName}, terima kasih telah menghubungi Customer Care Orin. Pesan Anda telah kami terima dan tim Sherloc sedang melakukan verifikasi data armada ${simCustomerPhone}.`
      const data = {
        status: 'simulated_success',
        user_type: 'Pelanggan Orin',
        plate: 'B 1029 SS',
        vehicle: 'Armada Truk',
        intent: 'Kendala GPS Offline',
        reply: simulatedReply
      }
      setSimWebhookResult(data)
      const newChat = {
        id: `chat-${Date.now()}`,
        sender: simCustomerName,
        phone: simCustomerPhone,
        userType: 'Pelanggan Orin',
        plate: 'B 1029 SS',
        vehicle: 'Armada Truk',
        lastPing: 'Live Inbound Stream',
        message: simCustomerMsg,
        timestamp: 'Baru saja',
        status: 'MENUNGGU BALASAN',
        statusColor: 'bg-amber-100 text-amber-800 border-amber-300',
        actionNeeded: 'Pengecekan Telemetri GPS (Delegasi Nara)',
        replies: [
          { from: simCustomerName, text: simCustomerMsg, time: 'Baru saja' },
          { from: 'Sherloc (Frontline Voice)', text: simulatedReply, time: 'Baru saja' }
        ]
      }
      setSherlocChats((prev) => [newChat, ...prev])
      setSelectedChatId(newChat.id)
    } finally {
      setSimWebhookSending(false)
    }
  }

  // --- WATSON ACTIONS ---
  const handleWatsonSendManagementReply = async (ticketId) => {
    if (!mgmtReplyInput.trim()) return
    setMgmtReplySending(true)

    try {
      const res = await fetch('/api/webhook/management-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket_id: ticketId,
          reply_by: 'Dimas (Lead Eng)',
          reply_text: mgmtReplyInput.trim()
        })
      })
      await res.json()
      setMgmtActionFeedback('Balasan manajemen terdistribusi dan Q&A berhasil di-harvest ke Knowledge Base!')
    } catch (err) {
      setMgmtActionFeedback('Simulasi: Balasan manajemen diterima dan di-harvest ke Knowledge Base!')
    } finally {
      setWatsonTickets((prev) =>
        prev.map((t) => {
          if (t.id === ticketId) {
            return {
              ...t,
              status: 'TERJAWAB (Q&A TERHARVEST)',
              statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
              solution: mgmtReplyInput.trim(),
              managementReply: `Jawaban Dimas (Lead Eng): "${mgmtReplyInput.trim()}"`,
              harvested: true
            }
          }
          return t
        })
      )
      const currentTicket = watsonTickets.find((t) => t.id === ticketId)
      if (currentTicket) {
        setHarvestedQA((prev) => [
          {
            id: `QA-${Date.now().toString().slice(-3)}`,
            question: currentTicket.title,
            answer: mgmtReplyInput.trim(),
            category: 'ESKALASI RESOLUSI',
            confidence: '96.8%',
            source: 'WA Group Reply by Dimas (Lead Eng)',
            status: 'Vector DB Synced'
          },
          ...prev
        ])
      }
      setMgmtReplyInput('')
      setMgmtReplySending(false)
      setTimeout(() => setMgmtActionFeedback(null), 3500)
    }
  }

  // --- NARA SAFE BROADCAST RUNNER ---
  const handleTriggerSafeBroadcast = () => {
    setIsBroadcasting(true)
    setBroadcastProgress('Memulai protokol Anti-Banned: Inisialisasi Jitter...')
    setTimeout(() => {
      setBroadcastProgress('Mengirim Grup Jabodetabek: Jitter 28s + Typing Composing (3.5s)...')
      setTimeout(() => {
        setBroadcastProgress('Mengirim Grup Jawa Timur: Jitter 41s + Template Rotator A...')
        setTimeout(() => {
          setBroadcastProgress('Mengirim Grup Jawa Barat: Selesai tanpa anomali flag spam!')
          setTimeout(() => {
            setIsBroadcasting(false)
            setBroadcastProgress('Semua 3 grup berhasil menerima broadcast aman (0 flagged)!')
            setTimeout(() => setBroadcastProgress(null), 4000)
          }, 1500)
        }, 1500)
      }, 1500)
    }, 1200)
  }

  // --- NARA ENGINE API HANDLERS ---
  const fetchNaraEngineData = async (forceAudit = naraAuditMode, dayOverride = naraDayOverride) => {
    setNaraLoading(true)
    try {
      let url = `/api/nara/test-run?limit=100&force_audit=${forceAudit}`
      if (dayOverride !== null && dayOverride !== undefined) {
        url += `&day_override=${dayOverride}`
      }
      const res = await fetch(url)
      const data = await res.json()
      setNaraLiveReport(data)
      if (data.customer_reports && data.customer_reports.length > 0) {
        setNaraSelectedCustomerTab((prev) => prev || data.customer_reports[0].customer_id)
      }
    } catch (err) {
      console.error('Error fetching Nara live data', err)
    } finally {
      setNaraLoading(false)
    }
  }

  useEffect(() => {
    if (agentId === 'nara') {
      fetchNaraEngineData(naraAuditMode, naraDayOverride)
    }
  }, [agentId, naraAuditMode, naraDayOverride])

  const handleTriggerNaraDispatch = async () => {
    setNaraDispatching(true)
    setNaraDispatchResult(null)
    try {
      const res = await fetch('/api/nara/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          force_audit: naraAuditMode,
          day_override: naraDayOverride
        })
      })
      const data = await res.json()
      setNaraDispatchResult(data.dispatch_result)
      fetchNaraEngineData(naraAuditMode, naraDayOverride)
    } catch (err) {
      console.error('Failed to trigger Nara dispatch', err)
    } finally {
      setNaraDispatching(false)
    }
  }

  const handleNaraFeedbackSubmit = async (e) => {
    e?.preventDefault()
    if (!naraFeedbackMsg.trim()) return
    setNaraFeedbackSending(true)
    setNaraFeedbackResult(null)
    try {
      const res = await fetch('/api/nara/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: 30706,
          wa_group_id: '120363028391823@g.us',
          sender_name: naraFeedbackSender,
          message: naraFeedbackMsg,
          quoted_message: 'Peringatan unit telemetri offline'
        })
      })
      const data = await res.json()
      setNaraFeedbackResult(data.feedback)
    } catch (err) {
      console.error('Failed to process feedback', err)
    } finally {
      setNaraFeedbackSending(false)
    }
  }

  const handleApplyFeedbackPreset = (type) => {
    setNaraFeedbackPreset(type)
    if (type === 'technician') {
      setNaraFeedbackMsg('Tolong jadwalkan teknisi untuk periksa GPS unit L8374VG di pool Legundi besok pagi.')
    } else if (type === 'workshop') {
      setNaraFeedbackMsg('Unit truk L8374VG sedang masuk bengkel resmi untuk overhaul mesin dan servis rutin 7 hari.')
    } else if (type === 'battery') {
      setNaraFeedbackMsg('Aki kendaraan truk L8374VG sengaja dicabut karena armada sedang parkir lama di garasi.')
    }
  }

  // Fetch existing customer group mappings from database
  const fetchCustomerGroupMappings = async () => {
    try {
      const res = await fetch('/api/nara/customer-groups')
      const data = await res.json()
      if (data.mappings) {
        setCustomerGroupMappingsList(data.mappings)
      }
    } catch (err) {
      console.error('Failed to load group mappings', err)
    }
  }

  // Open group mapping modal prefilled for a customer account
  const handleOpenGroupModal = (customerId = '', customerName = '', existingGroupName = '', existingJid = '', existingPic = '') => {
    setEditCustomerId(customerId !== undefined && customerId !== null ? String(customerId) : '')
    setEditCustomerName(customerName || '')
    setInputGroupName(existingGroupName || (customerName ? `ONB ${customerName}` : ''))
    setInputGroupJid(existingJid || '')
    setInputGroupPic(existingPic || 'PIC Operasional')
    setGroupMappingSuccessMsg(null)
    setShowGroupModal(true)
    fetchCustomerGroupMappings()
  }

  // Save customer group mapping (1 Akun Pelanggan = 1 Grup WA)
  const handleSaveCustomerGroupMapping = async (e) => {
    e?.preventDefault()
    if (!inputGroupName.trim()) return
    setSavingGroupMapping(true)
    setGroupMappingSuccessMsg(null)
    try {
      const res = await fetch('/api/nara/customer-group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: editCustomerId || editCustomerName || 'CUST',
          customer_name: editCustomerName || `Pelanggan #${editCustomerId}`,
          wa_group_name: inputGroupName.trim(),
          wa_group_id: inputGroupJid.trim() || undefined,
          pic: inputGroupPic.trim() || 'PIC Operasional'
        })
      })
      const data = await res.json()
      if (data.status === 'success') {
        setGroupMappingSuccessMsg(`Grup WhatsApp '${data.wa_group_name}' berhasil dipetakan ke akun '${data.customer_name}' (${data.units_updated} unit terpengaruh)!`)
        fetchNaraEngineData(naraAuditMode, naraDayOverride)
        fetchCustomerGroupMappings()
        setTimeout(() => {
          setShowGroupModal(false)
          setGroupMappingSuccessMsg(null)
        }, 1600)
      }
    } catch (err) {
      console.error('Failed to save group mapping', err)
    } finally {
      setSavingGroupMapping(false)
    }
  }

  // Copy draft chat to clipboard (Human Agent Tool)
  const handleCopyDraftChat = (text, customerName = '') => {
    if (!text) return
    navigator.clipboard?.writeText(text)
    setDraftChatCopyFeedback(`✅ Draft pesan WhatsApp untuk ${customerName || 'Grup Pelanggan'} berhasil disalin ke clipboard!`)
    setTimeout(() => {
      setDraftChatCopyFeedback(null)
    }, 3500)
  }

  // Dispatch single customer group report via Watson
  const handleDispatchSingleCustomer = async (customerId, customerName) => {
    setSingleCustomerDispatching(true)
    setSingleDispatchFeedback(null)
    try {
      const res = await fetch('/api/nara/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_ids: [customerId],
          force_audit: naraAuditMode,
          day_override: naraDayOverride
        })
      })
      const data = await res.json()
      setSingleDispatchFeedback(`🚀 Laporan berhasil dikirim ke grup '${customerName}' via Watson Gateway (Anti-Ban safe)!`)
      fetchNaraEngineData(naraAuditMode, naraDayOverride)
      setTimeout(() => setSingleDispatchFeedback(null), 4500)
    } catch (err) {
      console.error('Failed single dispatch', err)
      setSingleDispatchFeedback('Gagal mendispatch pesan')
    } finally {
      setSingleCustomerDispatching(false)
    }
  }

  // Available customer accounts derived from telemetry & mappings
  const availableCustomerAccounts = useMemo(() => {
    const list = []
    const seen = new Set()
    if (naraLiveReport?.customer_reports) {
      naraLiveReport.customer_reports.forEach((rep) => {
        if (!seen.has(String(rep.customer_id))) {
          seen.add(String(rep.customer_id))
          list.push({
            id: rep.customer_id,
            name: rep.customer_name,
            wa_group_name: rep.wa_group_name,
            wa_group_id: rep.wa_group_id,
            unit_count: rep.counts?.total_offline || 0
          })
        }
      })
    }
    if (naraLiveReport?.valid_devices) {
      naraLiveReport.valid_devices.forEach((dev) => {
        if (dev.customer_id && !seen.has(String(dev.customer_id))) {
          seen.add(String(dev.customer_id))
          list.push({
            id: dev.customer_id,
            name: dev.customer_name || `Pelanggan #${dev.customer_id}`,
            wa_group_name: dev.wa_group_name || `Grup Orin - ${dev.customer_name}`,
            wa_group_id: dev.wa_group_id,
            unit_count: 1
          })
        }
      })
    }
    customerGroupMappingsList.forEach((m) => {
      if (!seen.has(String(m.customer_id))) {
        seen.add(String(m.customer_id))
        list.push({
          id: m.customer_id,
          name: m.customer_name,
          wa_group_name: m.wa_group_name,
          wa_group_id: m.wa_group_id,
          unit_count: 0
        })
      }
    })
    if (!seen.has('LNJ')) {
      list.unshift({ id: 'LNJ', name: 'LNJ', wa_group_name: 'ONB LNJ', unit_count: 0 })
    }
    return list
  }, [naraLiveReport, customerGroupMappingsList])

  return (
    <div className="h-screen w-full flex flex-col bg-slate-100 overflow-hidden select-none animate-in fade-in duration-150">
      {/* --- TOP WORKSPACE NAVIGATION BAR --- */}
      <header className="h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          {/* Back to 3D Office Button */}
          <button
            onClick={onBackToOffice}
            className="flex items-center gap-1.5 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
            title="Kembali ke Ruang Kantor 3D"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
            <span>Kembali ke 3D Office</span>
          </button>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* Breadcrumb Title */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Workspace</span>
            <span>/</span>
            <span className="text-slate-900 font-extrabold flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: agentColor }} />
              Dashboard {agent.name}
            </span>
          </div>
        </div>

        {/* Center / Right Controls: Agent Switcher + Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Quick Agent Switcher Pills */}
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            {agents.map((ag) => {
              const isCurrent = ag.id === agent.id
              return (
                <button
                  key={ag.id}
                  onClick={() => onSelectAgent(ag)}
                  className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-white shadow-xs text-slate-900'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ag.color }} />
                  {ag.name}
                </button>
              )
            })}
          </div>

          {/* Gear icon for avatar */}
          <button
            onClick={() => setLeftPanelView((prev) => (prev === 'avatar_settings' ? 'menu' : 'avatar_settings'))}
            className={`p-2 rounded-xl active:scale-95 transition-all cursor-pointer border ${
              leftPanelView === 'avatar_settings'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 border-slate-200/60'
            }`}
            title="Pengaturan Avatar & Warna 3D"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Call Agent Button */}
          <button
            onClick={() => onOpenCall(agent)}
            className="flex items-center gap-1.5 py-1.5 px-3 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Panggil (Call)</span>
          </button>
        </div>
      </header>

      {/* --- SPLIT LAYOUT: 20% LEFT PANEL / 80% RIGHT WORKSPACE --- */}
      <div className="flex-1 flex overflow-hidden">
        {/* ======================================================== */}
        {/* LEFT CONTROL PANEL (20-22% WIDTH)                        */}
        {/* ======================================================== */}
        <aside className="w-72 lg:w-80 shrink-0 bg-white border-r border-slate-200/90 flex flex-col overflow-hidden">
          {leftPanelView === 'avatar_settings' ? (
            <AgentAvatarSettingsView
              agent={agent}
              onSelectAvatarType={onSelectAvatarType}
              onUpdateAgentModel={onUpdateAgentModel}
              onUpdateAgentColor={onUpdateAgentColor}
              onUpdateAgentStatus={onUpdateAgentStatus}
              onBack={() => setLeftPanelView('menu')}
            />
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
              {/* Agent Profile Hero */}
              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 shrink-0">
                <div className="flex items-center gap-3 mb-2.5">
                  <AgentCloseUpAvatar agent={agent} size={48} showStatus={true} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-black text-slate-900 truncate">{agent.name}</h3>
                      <button
                        type="button"
                        onClick={() => setLeftPanelView('avatar_settings')}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-colors cursor-pointer"
                        title="Pengaturan Avatar & Warna 3D"
                      >
                        <Settings className="w-3.5 h-3.5" />
                      </button>
                      <span
                        className="text-[9px] font-extrabold px-1.5 py-0.2 rounded text-white tracking-wider uppercase shadow-2xs ml-auto shrink-0"
                        style={{ backgroundColor: agentColor }}
                      >
                        {agent.role_badge}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-1 mt-0.5">
                      <p className="text-[11px] text-slate-500 font-medium truncate">{agent.role}</p>

                      {/* Interactive Status Pill */}
                      <button
                        type="button"
                        onClick={() => {
                          const current = (agent.status || (agent.id === 'nara' ? 'working' : 'available')).toLowerCase()
                          const nextStatus = current === 'available' ? 'working' : current === 'working' ? 'not_available' : 'available'
                          if (onUpdateAgentStatus) onUpdateAgentStatus(agent.id, nextStatus)
                        }}
                        className={`inline-flex items-center gap-1 text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded-md border shrink-0 cursor-pointer transition-all ${
                          (agent.status || (agent.id === 'nara' ? 'working' : 'available')).toLowerCase() === 'working'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : (agent.status || '').toLowerCase() === 'not_available'
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        }`}
                        title="Klik untuk mengubah status agent"
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

                <p className="text-[11px] text-slate-600 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-200/70">
                  {agent.description}
                </p>
              </div>

          {/* Vertical Menu Navigation for Modules */}
          <div className="space-y-1.5 flex-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-1 block mb-1">
              Spesifikasi & Menu Dashboard
            </span>

            {/* SHERLOC MENU TABS */}
            {agentId === 'sherloc' && (
              <div className="space-y-1.5">
                <button
                  onClick={() => setSherlocTab('inbox')}
                  className={`w-full p-2.5 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between ${
                    sherlocTab === 'inbox'
                      ? 'bg-slate-900 text-white shadow-xs font-bold text-xs'
                      : 'bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 font-medium text-xs'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <MessageSquare className={`w-3.5 h-3.5 ${sherlocTab === 'inbox' ? 'text-amber-400' : 'text-amber-600'}`} />
                    WhatsApp Live Inbound (3)
                  </span>
                  {sherlocTab === 'inbox' && <ChevronRight className="w-3.5 h-3.5 text-white shrink-0" />}
                </button>

                <button
                  onClick={() => setSherlocTab('validation')}
                  className={`w-full p-2.5 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between ${
                    sherlocTab === 'validation'
                      ? 'bg-slate-900 text-white shadow-xs font-bold text-xs'
                      : 'bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 font-medium text-xs'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <UserCheck className={`w-3.5 h-3.5 ${sherlocTab === 'validation' ? 'text-amber-400' : 'text-slate-600'}`} />
                    Validasi Pelanggan Orin
                  </span>
                  {sherlocTab === 'validation' && <ChevronRight className="w-3.5 h-3.5 text-white shrink-0" />}
                </button>

                <button
                  onClick={() => setSherlocTab('webhook_sim')}
                  className={`w-full p-2.5 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between ${
                    sherlocTab === 'webhook_sim'
                      ? 'bg-slate-900 text-white shadow-xs font-bold text-xs'
                      : 'bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 font-medium text-xs'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <ExternalLink className={`w-3.5 h-3.5 ${sherlocTab === 'webhook_sim' ? 'text-amber-400' : 'text-slate-600'}`} />
                    Simulator Webhook Inbound
                  </span>
                  {sherlocTab === 'webhook_sim' && <ChevronRight className="w-3.5 h-3.5 text-white shrink-0" />}
                </button>
              </div>
            )}

            {/* WATSON MENU TABS */}
            {agentId === 'watson' && (
              <div className="space-y-1.5">
                <button
                  onClick={() => setWatsonTab('escalations')}
                  className={`w-full p-2.5 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between ${
                    watsonTab === 'escalations'
                      ? 'bg-slate-900 text-white shadow-xs font-bold text-xs'
                      : 'bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 font-medium text-xs'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <AlertTriangle className={`w-3.5 h-3.5 ${watsonTab === 'escalations' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                    Eskalasi Teknis Tiket (3)
                  </span>
                  {watsonTab === 'escalations' && <ChevronRight className="w-3.5 h-3.5 text-white shrink-0" />}
                </button>

                <button
                  onClick={() => setWatsonTab('group_bridge')}
                  className={`w-full p-2.5 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between ${
                    watsonTab === 'group_bridge'
                      ? 'bg-slate-900 text-white shadow-xs font-bold text-xs'
                      : 'bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 font-medium text-xs'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <MessageSquare className={`w-3.5 h-3.5 ${watsonTab === 'group_bridge' ? 'text-indigo-400' : 'text-slate-600'}`} />
                    WA Group Tim Manajemen
                  </span>
                  {watsonTab === 'group_bridge' && <ChevronRight className="w-3.5 h-3.5 text-white shrink-0" />}
                </button>

                <button
                  onClick={() => setWatsonTab('knowledge_harvester')}
                  className={`w-full p-2.5 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between ${
                    watsonTab === 'knowledge_harvester'
                      ? 'bg-slate-900 text-white shadow-xs font-bold text-xs'
                      : 'bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 font-medium text-xs'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Server className={`w-3.5 h-3.5 ${watsonTab === 'knowledge_harvester' ? 'text-indigo-400' : 'text-slate-600'}`} />
                    Knowledge Harvester (RAG)
                  </span>
                  {watsonTab === 'knowledge_harvester' && <ChevronRight className="w-3.5 h-3.5 text-white shrink-0" />}
                </button>
              </div>
            )}

            {/* VELOCIA MENU TABS */}
            {agentId === 'velocia' && (
              <div className="space-y-1.5">
                <button
                  onClick={() => setVelociaTab('market_intelligence')}
                  className={`w-full p-2.5 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between ${
                    velociaTab === 'market_intelligence'
                      ? 'bg-slate-900 text-white shadow-xs font-bold text-xs'
                      : 'bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 font-medium text-xs'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <BarChart3 className={`w-3.5 h-3.5 ${velociaTab === 'market_intelligence' ? 'text-red-400' : 'text-red-500'}`} />
                    Market Intelligence (Chat Log)
                  </span>
                  {velociaTab === 'market_intelligence' && <ChevronRight className="w-3.5 h-3.5 text-white shrink-0" />}
                </button>

                {Object.values(VELOCIA_PLANS).map((plan) => {
                  const isActive = velociaTab === plan.id
                  return (
                    <button
                      key={plan.id}
                      onClick={() => setVelociaTab(plan.id)}
                      className={`w-full p-2.5 rounded-xl text-left transition-all cursor-pointer flex flex-col gap-1 ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold truncate">{plan.title}</span>
                        {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded w-fit ${
                        isActive ? 'bg-white/20 text-white' : plan.badgeColor
                      }`}>
                        {plan.badge}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}

            {/* NARA MENU TABS */}
            {agentId === 'nara' && (
              <div className="space-y-1.5">
                <button
                  onClick={() => setNaraTab('offline_units')}
                  className={`w-full p-2.5 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between ${
                    naraTab === 'offline_units'
                      ? 'bg-slate-900 text-white shadow-xs font-bold text-xs'
                      : 'bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 font-medium text-xs'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <AlertTriangle className={`w-3.5 h-3.5 ${naraTab === 'offline_units' ? 'text-amber-400' : 'text-rose-500'}`} />
                    Unit Offline & Aturan CAM
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${naraTab === 'offline_units' ? 'bg-amber-400 text-slate-900 font-bold' : 'bg-slate-100 text-slate-600'}`}>
                    {naraLiveReport?.summary?.total_valid_offline ?? 9}
                  </span>
                </button>

                <button
                  onClick={() => setNaraTab('customer_dispatch')}
                  className={`w-full p-2.5 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between ${
                    naraTab === 'customer_dispatch'
                      ? 'bg-slate-900 text-white shadow-xs font-bold text-xs'
                      : 'bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 font-medium text-xs'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <MessageSquare className={`w-3.5 h-3.5 ${naraTab === 'customer_dispatch' ? 'text-sky-400' : 'text-slate-600'}`} />
                    Draft Chat &amp; Grup WA
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${naraTab === 'customer_dispatch' ? 'bg-sky-400 text-slate-900 font-bold' : 'bg-slate-100 text-slate-600'}`}>
                    {naraLiveReport?.customer_reports?.length ?? 4}
                  </span>
                </button>

                <button
                  onClick={() => setNaraTab('feedback_loop')}
                  className={`w-full p-2.5 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between ${
                    naraTab === 'feedback_loop'
                      ? 'bg-slate-900 text-white shadow-xs font-bold text-xs'
                      : 'bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 font-medium text-xs'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <MessageSquare className={`w-3.5 h-3.5 ${naraTab === 'feedback_loop' ? 'text-emerald-400' : 'text-slate-600'}`} />
                    Feedback Loop (Inbound)
                  </span>
                  {naraTab === 'feedback_loop' && <ChevronRight className="w-3.5 h-3.5 text-white shrink-0" />}
                </button>

                <button
                  onClick={() => setNaraTab('safe_broadcast')}
                  className={`w-full p-2.5 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between ${
                    naraTab === 'safe_broadcast'
                      ? 'bg-slate-900 text-white shadow-xs font-bold text-xs'
                      : 'bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 font-medium text-xs'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className={`w-3.5 h-3.5 ${naraTab === 'safe_broadcast' ? 'text-emerald-400' : 'text-slate-600'}`} />
                    Safe Broadcast Teknisi
                  </span>
                  {naraTab === 'safe_broadcast' && <ChevronRight className="w-3.5 h-3.5 text-white shrink-0" />}
                </button>

                <button
                  onClick={() => setNaraTab('telemetry')}
                  className={`w-full p-2.5 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between ${
                    naraTab === 'telemetry'
                      ? 'bg-slate-900 text-white shadow-xs font-bold text-xs'
                      : 'bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 font-medium text-xs'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Radio className={`w-3.5 h-3.5 ${naraTab === 'telemetry' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    Statistik Uptime Regional
                  </span>
                  {naraTab === 'telemetry' && <ChevronRight className="w-3.5 h-3.5 text-white shrink-0" />}
                </button>
              </div>
            )}

            {/* SCOUT MENU TABS */}
            {agentId === 'scout' && (
              <div className="space-y-1.5">
                <button
                  onClick={() => setScoutTab('recurring_issues')}
                  className={`w-full p-2.5 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between ${
                    scoutTab === 'recurring_issues'
                      ? 'bg-slate-900 text-white shadow-xs font-bold text-xs'
                      : 'bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 font-medium text-xs'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Bot className={`w-3.5 h-3.5 ${scoutTab === 'recurring_issues' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    Isu Berulang & SOP Writer
                  </span>
                  {scoutTab === 'recurring_issues' && <ChevronRight className="w-3.5 h-3.5 text-white shrink-0" />}
                </button>

                <button
                  onClick={() => setScoutTab('articles')}
                  className={`w-full p-2.5 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between ${
                    scoutTab === 'articles'
                      ? 'bg-slate-900 text-white shadow-xs font-bold text-xs'
                      : 'bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 font-medium text-xs'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <FileText className={`w-3.5 h-3.5 ${scoutTab === 'articles' ? 'text-emerald-400' : 'text-slate-600'}`} />
                    Draf Naskah Artikel (3)
                  </span>
                  {scoutTab === 'articles' && <ChevronRight className="w-3.5 h-3.5 text-white shrink-0" />}
                </button>

                <button
                  onClick={() => setScoutTab('trends')}
                  className={`w-full p-2.5 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between ${
                    scoutTab === 'trends'
                      ? 'bg-slate-900 text-white shadow-xs font-bold text-xs'
                      : 'bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 font-medium text-xs'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <TrendingUp className={`w-3.5 h-3.5 ${scoutTab === 'trends' ? 'text-emerald-400' : 'text-slate-600'}`} />
                    Radar Tren AI 2026
                  </span>
                  {scoutTab === 'trends' && <ChevronRight className="w-3.5 h-3.5 text-white shrink-0" />}
                </button>
              </div>
            )}
          </div>

          {/* Quick Task Brief Box */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 mt-auto">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Kirim Brief Cepat ke {agent.name}
            </span>
            <form onSubmit={handleSendQuickBrief} className="flex gap-1.5">
              <input
                type="text"
                value={briefInput}
                onChange={(e) => setBriefInput(e.target.value)}
                placeholder="Instruksi tugas..."
                className="flex-1 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
              <button
                type="submit"
                className="p-2 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white rounded-xl cursor-pointer"
              >
                <Send className="w-3 h-3" />
              </button>
            </form>
            {briefFeedback && (
              <p className="text-[10px] font-bold text-emerald-600 animate-in fade-in">
                ✓ {briefFeedback}
              </p>
            )}
          </div>
            </div>
          )}
        </aside>

        {/* ======================================================== */}
        {/* RIGHT MAIN WORKSPACE (80% WIDTH)                         */}
        {/* ======================================================== */}
        <main className="flex-1 bg-slate-50/70 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* ======================================================== */}
          {/* SHERLOC WORKSPACE VIEW (FRONTLINE WA & VALIDATION)       */}
          {/* ======================================================== */}
          {agentId === 'sherloc' && (
            <div className="max-w-6xl mx-auto space-y-5 animate-in fade-in duration-200">
              {/* Tab: INBOX */}
              {sherlocTab === 'inbox' && (
                <div className="space-y-5">
                  {/* Sherloc Top Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                      <div className="flex items-center justify-between text-amber-600 mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider">Inbound WhatsApp</span>
                        <MessageSquare className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-xl font-black text-slate-900">{sherlocChats.length} Percakapan</p>
                      <span className="text-[10px] text-amber-600 font-semibold">1 Menunggu respon</span>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                      <div className="flex items-center justify-between text-emerald-600 mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider">Verifikasi Pelanggan</span>
                        <UserCheck className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-xl font-black text-slate-900">100% Akurat</p>
                      <span className="text-[10px] text-emerald-600 font-semibold">Tersambung ke DB Orin</span>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                      <div className="flex items-center justify-between text-indigo-600 mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider">Delegasi Tugas</span>
                        <Zap className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-xl font-black text-slate-900">2 Otonom</p>
                      <span className="text-[10px] text-indigo-600 font-semibold">1 ke Nara, 1 ke Watson</span>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                      <div className="flex items-center justify-between text-slate-700 mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider">SLA Respon Chat</span>
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-xl font-black text-slate-900">&lt; 2.5 Detik</p>
                      <span className="text-[10px] text-emerald-600 font-semibold">Voice / Text Instant</span>
                    </div>
                  </div>

                  {/* Split Inbox View */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col md:flex-row h-[560px]">
                    {/* Left Chat List Column */}
                    <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col h-full bg-slate-50/50">
                      <div className="p-3.5 border-b border-slate-200 bg-white flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-black text-slate-900">Inbound WhatsApp Stream</h4>
                          <p className="text-[10px] text-slate-400 font-medium">Single Communicator Gateway</p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          Live Inbound
                        </span>
                      </div>

                      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                        {sherlocChats.map((c) => {
                          const isSel = selectedChatId === c.id
                          return (
                            <div
                              key={c.id}
                              onClick={() => setSelectedChatId(c.id)}
                              className={`p-3.5 cursor-pointer transition-all ${
                                isSel ? 'bg-white shadow-2xs border-l-4 border-l-amber-500' : 'hover:bg-slate-100/70'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className="font-black text-xs text-slate-900 truncate">{c.sender}</span>
                                <span className="text-[10px] text-slate-400 font-medium shrink-0">{c.timestamp}</span>
                              </div>
                              <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                                <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded border ${
                                  c.userType === 'Pelanggan Orin' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-sky-50 text-sky-700 border-sky-200'
                                }`}>
                                  {c.userType}
                                </span>
                                <span className="text-[9px] font-mono font-bold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded">
                                  {c.plate}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                                {c.message}
                              </p>
                              <div className="mt-2 flex items-center justify-between">
                                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${c.statusColor}`}>
                                  {c.status}
                                </span>
                                <span className="text-[9px] text-slate-400 font-mono truncate max-w-[120px]">
                                  {c.phone}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Right Conversation & Quick Action Area */}
                    {(() => {
                      const activeChat = sherlocChats.find((c) => c.id === selectedChatId) || sherlocChats[0]
                      if (!activeChat) return <div className="flex-1 p-6 text-slate-400">Pilih pesan di samping.</div>

                      return (
                        <div className="flex-1 flex flex-col h-full bg-slate-50/30">
                          {/* Chat Detail Header */}
                          <div className="p-4 bg-white border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm font-black text-slate-900">{activeChat.sender}</h3>
                                <span className="text-xs font-mono text-slate-500">{activeChat.phone}</span>
                                <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${
                                  activeChat.userType === 'Pelanggan Orin' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-sky-50 text-sky-700 border-sky-200'
                                }`}>
                                  {activeChat.userType}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-3 mt-0.5">
                                <span>Kendaraan: <strong className="text-slate-800">{activeChat.vehicle}</strong> ({activeChat.plate})</span>
                                <span>•</span>
                                <span className="text-rose-600 font-medium">{activeChat.lastPing}</span>
                              </div>
                            </div>

                            {/* Quick Delegation Badges */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleSherlocDelegateToNara(activeChat)}
                                className="py-1.5 px-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] border border-blue-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                                title="Minta Nara cek telemetri & kirim ping unit"
                              >
                                <Radio className="w-3 h-3 text-blue-600" />
                                <span>Delegasi ke Nara</span>
                              </button>
                              <button
                                onClick={() => handleSherlocEscalateToWatson(activeChat)}
                                className="py-1.5 px-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-[11px] border border-purple-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                                title="Eskalasikan isu teknis ECU ke Watson"
                              >
                                <AlertTriangle className="w-3 h-3 text-purple-600" />
                                <span>Eskalasi ke Watson</span>
                              </button>
                            </div>
                          </div>

                          {/* Message Thread */}
                          <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {sherlocChatActionFeedback && (
                              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>{sherlocChatActionFeedback}</span>
                              </div>
                            )}

                            {activeChat.replies?.map((rep, idx) => {
                              const isSherloc = rep.from.includes('Sherloc')
                              const isSystem = rep.from.includes('System')
                              return (
                                <div
                                  key={idx}
                                  className={`flex flex-col ${
                                    isSherloc ? 'items-end' : isSystem ? 'items-center' : 'items-start'
                                  }`}
                                >
                                  {isSystem ? (
                                    <div className="max-w-lg p-2.5 bg-slate-100 rounded-xl border border-slate-200 text-center my-1">
                                      <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">
                                        {rep.from} • {rep.time}
                                      </span>
                                      <p className="text-xs text-slate-700 font-mono leading-relaxed">{rep.text}</p>
                                    </div>
                                  ) : (
                                    <div
                                      className={`max-w-md p-3.5 rounded-2xl shadow-2xs space-y-1 ${
                                        isSherloc
                                          ? 'bg-slate-900 text-white rounded-br-xs'
                                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between gap-4">
                                        <span className={`text-[10px] font-black uppercase tracking-wider ${
                                          isSherloc ? 'text-amber-400' : 'text-slate-500'
                                        }`}>
                                          {rep.from}
                                        </span>
                                        <span className="text-[9px] opacity-70 font-mono">{rep.time}</span>
                                      </div>
                                      <p className="text-xs leading-relaxed">{rep.text}</p>
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>

                          {/* Chat Reply Form */}
                          <div className="p-3.5 bg-white border-t border-slate-200 flex items-center gap-2">
                            <input
                              type="text"
                              value={sherlocReplyInput}
                              onChange={(e) => setSherlocReplyInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSherlocSendReply(activeChat.id)
                              }}
                              placeholder={`Balas ${activeChat.sender} atas nama Sherloc...`}
                              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                            <button
                              onClick={() => handleSherlocSendReply(activeChat.id)}
                              className="py-2 px-4 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-900 font-black text-xs rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Kirim</span>
                            </button>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                </div>
              )}

              {/* Tab: VALIDATION (Orin Customer User DB) */}
              {sherlocTab === 'validation' && (
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
                      <div>
                        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-amber-600" />
                          Database Validasi Pengguna Orin (Telemetri & Kontak)
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          Membedakan secara otomatis Pelanggan Orin Aktif vs Prospek Calon Pelanggan
                        </p>
                      </div>

                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={customerSearchQuery}
                          onChange={(e) => setCustomerSearchQuery(e.target.value)}
                          placeholder="Cari Nama, No HP, Plat..."
                          className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 w-56"
                        />
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                            <th className="py-3 px-4">Nama & Kontak</th>
                            <th className="py-3 px-3">Tipe Akun</th>
                            <th className="py-3 px-4">Plat & Perangkat</th>
                            <th className="py-3 px-4">IMEI Tracker</th>
                            <th className="py-3 px-4">Paket Langganan</th>
                            <th className="py-3 px-4">Status & Masa Berlaku</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                          {ORIN_USER_DATABASE.filter((u) => {
                            const q = customerSearchQuery.toLowerCase()
                            return (
                              !q ||
                              u.name.toLowerCase().includes(q) ||
                              u.phone.includes(q) ||
                              u.plate.toLowerCase().includes(q) ||
                              u.company.toLowerCase().includes(q)
                            )
                          }).map((u, i) => (
                            <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-3 px-4">
                                <div className="font-bold text-slate-900 text-xs">{u.name}</div>
                                <div className="text-[11px] font-mono text-slate-500">{u.phone}</div>
                                <div className="text-[10px] text-slate-400">{u.company}</div>
                              </td>
                              <td className="py-3 px-3 whitespace-nowrap">
                                <span className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                                  u.type.includes('Aktif')
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                }`}>
                                  {u.type}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="font-mono font-bold text-slate-900">{u.plate}</div>
                                <div className="text-[11px] text-slate-500">{u.deviceModel}</div>
                              </td>
                              <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                                {u.imei}
                              </td>
                              <td className="py-3 px-4 text-xs font-medium text-slate-800">
                                {u.package}
                              </td>
                              <td className="py-3 px-4 text-xs font-semibold text-emerald-600">
                                {u.status}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: WEBHOOK SIMULATOR */}
              {sherlocTab === 'webhook_sim' && (
                <div className="space-y-4">
                  <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-amber-600" />
                        Simulator Webhook Inbound WhatsApp (Gateway Integration)
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Kirim payload chat WhatsApp simulasi langsung ke endpoint <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-amber-700">POST /api/webhook/whatsapp</code> untuk menguji parsing pesan oleh Sherloc.
                      </p>
                    </div>

                    <form onSubmit={handleTriggerInboundWebhook} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-1">Nama Pengirim Customer</label>
                          <input
                            type="text"
                            value={simCustomerName}
                            onChange={(e) => setSimCustomerName(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-1">Nomor WhatsApp (+62)</label>
                          <input
                            type="text"
                            value={simCustomerPhone}
                            onChange={(e) => setSimCustomerPhone(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Isi Pesan WhatsApp Inbound</label>
                        <textarea
                          rows={3}
                          value={simCustomerMsg}
                          onChange={(e) => setSimCustomerMsg(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 leading-relaxed"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="submit"
                          disabled={simWebhookSending}
                          className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-black text-xs rounded-xl shadow-2xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          <Play className="w-3.5 h-3.5 text-amber-400" />
                          <span>{simWebhookSending ? 'Memproses Webhook...' : 'Kirim Simulasi Webhook Inbound'}</span>
                        </button>
                        <span className="text-[11px] text-slate-400">Sherloc akan memproses dan membalas otomatis</span>
                      </div>
                    </form>

                    {simWebhookResult && (
                      <div className="p-4 bg-slate-900 rounded-xl text-white space-y-2 text-xs font-mono animate-in fade-in">
                        <div className="flex items-center justify-between text-amber-400 text-[11px] font-bold">
                          <span>Payload Respons Gateway Webhook:</span>
                          <span className="text-emerald-400">HTTP 200 OK</span>
                        </div>
                        <pre className="text-[11px] text-slate-300 overflow-x-auto whitespace-pre-wrap">
                          {JSON.stringify(simWebhookResult, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* WATSON WORKSPACE VIEW (ESCALATION & KNOWLEDGE LOOP)      */}
          {/* ======================================================== */}
          {agentId === 'watson' && (
            <div className="max-w-6xl mx-auto space-y-5 animate-in fade-in duration-200">
              {/* Tab: ESCALATIONS */}
              {watsonTab === 'escalations' && (
                <div className="space-y-5">
                  {/* Watson Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                      <div className="flex items-center justify-between text-indigo-600 mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider">Tiket Eskalasi</span>
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-xl font-black text-slate-900">{watsonTickets.length} Tiket</p>
                      <span className="text-[10px] text-indigo-600 font-semibold">1 Menunggu Management</span>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                      <div className="flex items-center justify-between text-emerald-600 mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider">Terselesaikan (Harvested)</span>
                        <CheckCheck className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-xl font-black text-slate-900">{watsonTickets.filter(t => t.harvested).length} Solusi</p>
                      <span className="text-[10px] text-emerald-600 font-semibold">Masuk ke Vector DB</span>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                      <div className="flex items-center justify-between text-amber-600 mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider">Rata-rata Resolusi</span>
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-xl font-black text-slate-900">8.4 Menit</p>
                      <span className="text-[10px] text-amber-600 font-semibold">Via WA Management Bridge</span>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                      <div className="flex items-center justify-between text-slate-700 mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider">Akurasi Knowledge Loop</span>
                        <Database className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-xl font-black text-slate-900">97.8%</p>
                      <span className="text-[10px] text-emerald-600 font-semibold">Q&A Embedding Terverifikasi</span>
                    </div>
                  </div>

                  {/* Escalation Tickets Grid */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Daftar Tiket Eskalasi Teknis dari Sherloc
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {watsonTickets.map((t) => {
                        const isSel = selectedTicketId === t.id
                        return (
                          <div
                            key={t.id}
                            onClick={() => setSelectedTicketId(t.id)}
                            className={`p-5 bg-white rounded-2xl border transition-all cursor-pointer shadow-2xs space-y-3 ${
                              isSel ? 'border-indigo-500 ring-2 ring-indigo-200/60' : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-xs font-bold text-slate-400">{t.id}</span>
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${t.statusColor}`}>
                                {t.status}
                              </span>
                            </div>

                            <div>
                              <h4 className="text-sm font-black text-slate-900">{t.title}</h4>
                              <p className="text-xs text-slate-500 mt-0.5">
                                Pelanggan: <strong className="text-slate-700">{t.customer}</strong> • {t.vehicle}
                              </p>
                            </div>

                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase block">Catatan Sherloc:</span>
                              <p>{t.sherlocNote}</p>
                            </div>

                            <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs space-y-1">
                              <span className="text-[10px] font-bold text-indigo-700 uppercase block">Solusi Teknis / Balasan:</span>
                              <p className="text-indigo-900 font-medium">{t.solution}</p>
                            </div>

                            <div className="flex items-center justify-between pt-1 text-[11px]">
                              <span className="text-slate-400 font-medium">{t.managementReply}</span>
                              {t.harvested && (
                                <span className="text-emerald-600 font-bold flex items-center gap-1">
                                  <CheckCheck className="w-3.5 h-3.5" />
                                  Tersimpan di Vector DB
                                </span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: GROUP BRIDGE (Management WhatsApp Group) */}
              {watsonTab === 'group_bridge' && (
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white shadow-2xs">
                          <Users className="w-5 h-5 text-indigo-200" />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-white flex items-center gap-2">
                            WhatsApp Group: "Orin Lead Engineers & Management"
                          </h3>
                          <p className="text-[11px] text-indigo-200 font-normal">
                            Watson Bridge • Auto Forwarder & Solution Harvester
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        ● Bridge Online
                      </span>
                    </div>

                    {/* Group Chat Messages Stream */}
                    <div className="p-5 bg-slate-100/60 min-h-[380px] max-h-[460px] overflow-y-auto space-y-3">
                      {/* Watson Forward message */}
                      <div className="flex flex-col items-start">
                        <div className="max-w-xl p-3.5 bg-white rounded-2xl border border-slate-200 rounded-bl-xs shadow-2xs space-y-1">
                          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider block">
                            🤖 Watson (Tech Escalation Bot) • 09:51 WIB
                          </span>
                          <p className="text-xs text-slate-800 leading-relaxed font-sans">
                            🚨 <strong>[ESKALASI TEKNIS MASUK DARI SHERLOC]</strong><br />
                            <strong>ID:</strong> TIK-481<br />
                            <strong>Pelanggan:</strong> Hendra Wijaya (+62 856-1122-3344)<br />
                            <strong>Armada:</strong> Isuzu Giga Wingbox (D 9912 ABE)<br />
                            <strong>Isu:</strong> Lampu indikator modem GPS berkedip merah terus-menerus dan menampilkan kode error E-402 di portal. Reboot kontak 3x tetap gagal sinkron.<br />
                            <em>Mohon petunjuk penanganan dari lead engineer.</em>
                          </p>
                        </div>
                      </div>

                      {/* Lead Engineer Reply */}
                      <div className="flex flex-col items-start">
                        <div className="max-w-xl p-3.5 bg-white rounded-2xl border border-slate-200 rounded-bl-xs shadow-2xs space-y-1">
                          <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider block">
                            👤 Dimas (Lead Hardware & Firmware Eng) • 09:55 WIB
                          </span>
                          <p className="text-xs text-slate-800 leading-relaxed font-sans">
                            Itu kendala buffer handshake modem GSM pasca update firmware semalam. Jangan bongkar unit. Minta customer kirim SMS kode restart manual: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold text-indigo-600">RESTART#402</code> ke nomor SIM di dalam modul. Tunggu 60 detik lampu akan biru normal.
                          </p>
                        </div>
                      </div>

                      {/* Watson Harvester confirmation */}
                      <div className="flex flex-col items-end">
                        <div className="max-w-xl p-3.5 bg-indigo-900 text-white rounded-2xl rounded-br-xs shadow-2xs space-y-1">
                          <span className="text-[10px] font-black text-indigo-300 uppercase tracking-wider block">
                            ✨ Watson Knowledge Harvester • 09:56 WIB
                          </span>
                          <p className="text-xs text-indigo-100 leading-relaxed font-sans">
                            ✅ Jawaban Pak Dimas telah dikonversi ke instruksi customer dan dikirim kembali ke Sherloc. Q&A berhasil di-index ke Vector DB dengan confidence score 98.5%.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Input to simulate Lead Engineer reply */}
                    <div className="p-4 bg-white border-t border-slate-200 space-y-2">
                      {mgmtActionFeedback && (
                        <p className="text-xs font-bold text-emerald-600 animate-in fade-in">
                          ✓ {mgmtActionFeedback}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={mgmtReplyInput}
                          onChange={(e) => setMgmtReplyInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleWatsonSendManagementReply(selectedTicketId)
                          }}
                          placeholder="Ketik instruksi solusi teknis sebagai Lead Engineer..."
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                        />
                        <button
                          onClick={() => handleWatsonSendManagementReply(selectedTicketId)}
                          disabled={mgmtReplySending}
                          className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{mgmtReplySending ? 'Mengirim...' : 'Kirim Balasan WA'}</span>
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Memanggil <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">POST /api/webhook/management-reply</code> untuk memicu Knowledge Loop otomatis.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: KNOWLEDGE HARVESTER (RAG Vector DB) */}
              {watsonTab === 'knowledge_harvester' && (
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
                      <div>
                        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                          <Server className="w-4 h-4 text-indigo-600" />
                          Knowledge Harvester (Vector Database RAG Store)
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          Repositori Q&A otomatis hasil ekstraksi balasan insinyur di grup WhatsApp Management
                        </p>
                      </div>

                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={ragSearchQuery}
                          onChange={(e) => setRagSearchQuery(e.target.value)}
                          placeholder="Cari Solusi / Kode Error..."
                          className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 w-56"
                        />
                      </div>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {harvestedQA.filter((item) => {
                        const q = ragSearchQuery.toLowerCase()
                        return !q || item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
                      }).map((item) => (
                        <div key={item.id} className="p-5 hover:bg-slate-50/50 transition-colors space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-indigo-600">{item.id}</span>
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                                {item.category}
                              </span>
                            </div>
                            <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              Confidence: {item.confidence}
                            </span>
                          </div>

                          <h4 className="text-sm font-black text-slate-900">
                            Q: {item.question}
                          </h4>

                          <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed font-sans">
                            <strong>A:</strong> {item.answer}
                          </p>

                          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                            <span>Sumber: {item.source}</span>
                            <span className="text-emerald-600 font-bold flex items-center gap-1">
                              <Database className="w-3 h-3" />
                              {item.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* 1. NARA WORKSPACE VIEW (OFFLINE UNIT TELEMETRY & CAM ENGINE) */}
          {/* ======================================================== */}
          {agentId === 'nara' && naraTab === 'offline_units' && (
            <div className="max-w-6xl mx-auto space-y-5 animate-in fade-in duration-200">
              {/* Telemetry Header Bar */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
                      ORIN API LIVE TELEMETRY
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      https://admin-api.orin.id/api/devices/offline
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <Radio className="w-5 h-5 text-sky-500 animate-pulse" />
                    Nara Telemetry Engine & Aturan CAM
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Evaluasi otomatis durasi unit offline, filter khusus kamera (&gt; 72 jam), dan pemetaan ke akun pelanggan.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Calendar Mode Switcher */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => {
                        setNaraAuditMode(false)
                        fetchNaraEngineData(false, null)
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        !naraAuditMode
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                      title="Hanya laporkan unit yang baru mati sejak pengecekan terakhir"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>Mode Delta (Hari {naraLiveReport?.calendar_day || new Date().getDate()})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNaraAuditMode(true)
                        fetchNaraEngineData(true, 1)
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        naraAuditMode
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                      title="Audit bulanan seluruh unit offline (Tanggal 1)"
                    >
                      <Calendar className="w-3.5 h-3.5 text-sky-500" />
                      <span>Mode Tanggal 1 (Full Audit)</span>
                    </button>
                  </div>

                  {/* Button to Open Customer WA Group Mapping Modal */}
                  <button
                    type="button"
                    onClick={() => handleOpenGroupModal()}
                    className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Atur / Petakan Nama WhatsApp Group per Akun Pelanggan (1 Akun = 1 Grup)"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Atur Grup WA Akun</span>
                  </button>

                  {/* Refresh Button */}
                  <button
                    type="button"
                    onClick={() => fetchNaraEngineData(naraAuditMode, naraDayOverride)}
                    disabled={naraLoading}
                    className="p-2 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white rounded-xl shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                    title="Tarik telemetri terkini dari API Orin"
                  >
                    <RefreshCw className={`w-4 h-4 ${naraLoading ? 'animate-spin text-sky-400' : 'text-slate-300'}`} />
                  </button>
                </div>
              </div>

              {/* 4 Live Telemetry Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-700 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Total di API Orin</span>
                    <Database className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <p className="text-xl font-black text-slate-900">
                    {naraLoading && !naraLiveReport ? (
                      <span className="inline-block w-12 h-6 bg-slate-100 animate-pulse rounded" />
                    ) : (
                      naraLiveReport?.fetch_statistics?.total_from_api ?? '-'
                    )}
                  </p>
                  <span className="text-[10px] text-slate-500 font-semibold">100 unit/halaman diambil</span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className="flex items-center justify-between text-rose-600 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Offline Terkualifikasi</span>
                    <WifiOff className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xl font-black text-rose-600">
                    {naraLoading && !naraLiveReport ? (
                      <span className="inline-block w-12 h-6 bg-rose-100 animate-pulse rounded" />
                    ) : (
                      `${naraLiveReport?.summary?.total_valid_offline ?? (naraLiveReport ? filteredUnits.length : '-')} Unit`
                    )}
                  </p>
                  <span className="text-[10px] text-rose-500 font-semibold">Lolos kriteria laporan</span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className="flex items-center justify-between text-amber-600 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Aturan CAM (Grace)</span>
                    <Video className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xl font-black text-amber-600">
                    {naraLoading && !naraLiveReport ? (
                      <span className="inline-block w-12 h-6 bg-amber-100 animate-pulse rounded" />
                    ) : (
                      `${naraLiveReport?.fetch_statistics?.cam_stats?.cam_suppressed ?? 0} Unit`
                    )}
                  </p>
                  <span className="text-[10px] text-amber-600 font-semibold">Ditahan (Offline &le; 72 jam)</span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className="flex items-center justify-between text-sky-600 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Grup Customer PRO</span>
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xl font-black text-sky-600">
                    {naraLoading && !naraLiveReport ? (
                      <span className="inline-block w-12 h-6 bg-sky-100 animate-pulse rounded" />
                    ) : (
                      `${naraLiveReport?.customer_reports?.length ?? 0} Grup`
                    )}
                  </p>
                  <span className="text-[10px] text-sky-600 font-semibold">Terpetakan ke Watson</span>
                </div>
              </div>

              {/* OFFLINE UNITS ENTERPRISE DATA TABLE */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                {/* Table Header Controls: Search + CAM Filter Tabs */}
                <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                        <span>Matriks Unit Offline &amp; Evaluasi Aturan Bisnis</span>
                        <span className="text-[10px] font-extrabold px-2 py-0.2 rounded-full bg-slate-200 text-slate-700">
                          {naraAuditMode ? 'MODE FULL AUDIT' : 'MODE DELTA'}
                        </span>
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Menampilkan {filteredUnits.length} unit ({naraTableFilter === 'ALL_QUALIFIED' ? 'Terkualifikasi' : naraTableFilter === 'CAM_GRACE' ? 'Toleransi CAM' : 'Semua Unit'})
                      </p>
                    </div>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Category Filter Pills */}
                    <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setNaraTableFilter('ALL_QUALIFIED')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                          naraTableFilter === 'ALL_QUALIFIED'
                            ? 'bg-white text-slate-900 shadow-2xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Terkualifikasi ({naraLoading && !naraLiveReport ? '...' : (naraLiveReport?.valid_devices?.length ?? 0)})
                      </button>

                      <button
                        type="button"
                        onClick={() => setNaraTableFilter('CAM_GRACE')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          naraTableFilter === 'CAM_GRACE'
                            ? 'bg-white text-amber-700 shadow-2xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <Video className="w-3 h-3 text-amber-500" />
                        Toleransi CAM ({naraLoading && !naraLiveReport ? '...' : (naraLiveReport?.suppressed_cam_devices?.length ?? 0)})
                      </button>

                      <button
                        type="button"
                        onClick={() => setNaraTableFilter('ALL_ORIN')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                          naraTableFilter === 'ALL_ORIN'
                            ? 'bg-white text-slate-900 shadow-2xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Semua ({naraLoading && !naraLiveReport ? '...' : (naraLiveReport ? (naraLiveReport.valid_devices?.length || 0) + (naraLiveReport.suppressed_cam_devices?.length || 0) : 0)})
                      </button>
                    </div>

                    {/* Search Input */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={unitSearch}
                        onChange={(e) => setUnitSearch(e.target.value)}
                        placeholder="Cari Plat, SN, Pelanggan, Tipe..."
                        className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 w-44 sm:w-56"
                      />
                    </div>
                  </div>
                </div>

                {/* The Responsive Data Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                        {/* 1. Nopol / Plat Unit (Sortable) */}
                        <th
                          onClick={() => handleToggleSort('nopol')}
                          className={`py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors select-none ${
                            unitSortField === 'nopol' ? 'text-slate-900 bg-slate-100/70 font-extrabold' : ''
                          }`}
                          title="Klik untuk mengurutkan berdasarkan Nopol / Plat Unit"
                        >
                          <div className="flex items-center gap-1.5">
                            <span>Nopol / Plat Unit</span>
                            {unitSortField === 'nopol' ? (
                              unitSortDirection === 'asc' ? (
                                <ArrowUp className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                              ) : (
                                <ArrowDown className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                              )
                            ) : (
                              <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-60 hover:opacity-100 shrink-0" />
                            )}
                          </div>
                        </th>

                        {/* 2. Tipe Perangkat (Sortable) */}
                        <th
                          onClick={() => handleToggleSort('device_type')}
                          className={`py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors select-none ${
                            unitSortField === 'device_type' ? 'text-slate-900 bg-slate-100/70 font-extrabold' : ''
                          }`}
                          title="Klik untuk mengurutkan berdasarkan Tipe Perangkat (CAM / GPS)"
                        >
                          <div className="flex items-center gap-1.5">
                            <span>Tipe Perangkat</span>
                            {unitSortField === 'device_type' ? (
                              unitSortDirection === 'asc' ? (
                                <ArrowUp className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                              ) : (
                                <ArrowDown className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                              )
                            ) : (
                              <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-60 hover:opacity-100 shrink-0" />
                            )}
                          </div>
                        </th>

                        {/* 3. Akun Pelanggan (Sortable) */}
                        <th
                          onClick={() => handleToggleSort('customer_name')}
                          className={`py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors select-none ${
                            unitSortField === 'customer_name' ? 'text-slate-900 bg-slate-100/70 font-extrabold' : ''
                          }`}
                          title="Klik untuk mengurutkan berdasarkan Akun Pelanggan"
                        >
                          <div className="flex items-center gap-1.5">
                            <span>Akun Pelanggan</span>
                            {unitSortField === 'customer_name' ? (
                              unitSortDirection === 'asc' ? (
                                <ArrowUp className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                              ) : (
                                <ArrowDown className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                              )
                            ) : (
                              <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-60 hover:opacity-100 shrink-0" />
                            )}
                          </div>
                        </th>

                        {/* 4. Durasi Offline (Sortable - KOLOM TERAKHIR) */}
                        <th
                          onClick={() => handleToggleSort('offline_duration')}
                          className={`py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors select-none ${
                            unitSortField === 'offline_duration' ? 'text-slate-900 bg-slate-100/70 font-extrabold' : ''
                          }`}
                          title="Klik untuk mengurutkan berdasarkan Durasi Offline"
                        >
                          <div className="flex items-center gap-1.5">
                            <span>Durasi Offline</span>
                            {unitSortField === 'offline_duration' ? (
                              unitSortDirection === 'asc' ? (
                                <ArrowUp className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                              ) : (
                                <ArrowDown className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                              )
                            ) : (
                              <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-60 hover:opacity-100 shrink-0" />
                            )}
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                      {naraLoading ? (
                        <tr>
                          <td colSpan={4} className="py-16 text-center bg-white">
                            <div className="flex flex-col items-center justify-center gap-3">
                              <RefreshCw className="w-6 h-6 text-sky-500 animate-spin" />
                              <span className="text-xs font-bold text-slate-800">
                                Memuat Data Real dari API Orin Live Telemetry...
                              </span>
                              <span className="text-[11px] text-slate-400">
                                Mengambil data perangkat offline &amp; menerapkan aturan filter CAM (&gt; 72 jam)
                              </span>
                            </div>
                          </td>
                        </tr>
                      ) : filteredUnits.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-12 text-center text-slate-400 font-medium text-xs">
                            Tidak ada unit yang sesuai dengan filter saat ini.
                          </td>
                        </tr>
                      ) : (
                        filteredUnits.map((dev, idx) => {
                          const isCam = dev.is_cam || (dev.device_name && dev.device_name.toLowerCase().includes('cam'))
                          const isSuppressed = dev.filter_status === 'SUPPRESSED_CAM_GRACE'
                          const plate = dev.nopol || dev.device_name || dev.id || `Unit #${idx + 1}`
                          const dname = dev.device_name || dev.hub || '-'
                          const cust = dev.customer_name || 'Pelanggan Umum'
                          const dur = dev.offline_duration_str || dev.offlineSince || 'Tidak diketahui'
                          const waGroup = dev.wa_group_name || ''

                          return (
                            <tr key={dev.id || idx} className={`hover:bg-slate-50/70 transition-colors ${isSuppressed ? 'bg-amber-50/30' : ''}`}>
                              {/* 1. Plat & Nama Unit */}
                              <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                                <div className="flex items-center gap-1.5 font-mono text-sm text-slate-900">
                                  <span>{plate}</span>
                                </div>
                                <div className="text-[11px] text-slate-400 font-sans truncate max-w-[180px]">{dname}</div>
                              </td>

                              {/* 2. Tipe Unit */}
                              <td className="py-3 px-4 whitespace-nowrap">
                                <div className="flex items-center gap-1.5">
                                  {isCam ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 border border-purple-200">
                                      <Video className="w-2.5 h-2.5 text-purple-600" />
                                      CAM
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-700 border border-slate-200">
                                      <Server className="w-2.5 h-2.5 text-slate-500" />
                                      GPS
                                    </span>
                                  )}
                                  <span className="text-xs font-medium text-slate-700">{dev.device_type || 'OBD-II'}</span>
                                </div>
                              </td>

                              {/* 3. Akun Pelanggan + Quick Add / Edit WhatsApp Group Menu */}
                              <td className="py-3 px-4 whitespace-nowrap">
                                <div className="flex items-center justify-between gap-3">
                                  <div>
                                    <div className="font-bold text-slate-900 text-xs">{cust}</div>
                                    <div className="text-[10px] text-slate-400 font-mono">ID: {dev.customer_id || 'PRO'}</div>
                                  </div>

                                  {/* Menu Add / Edit Nama WhatsApp Group di sebelah kanan akun */}
                                  <div>
                                    {waGroup ? (
                                      <button
                                        type="button"
                                        onClick={() => handleOpenGroupModal(dev.customer_id, cust, waGroup, dev.wa_group_id)}
                                        className="group flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/90 rounded-lg text-[11px] font-semibold text-emerald-800 transition-all cursor-pointer shadow-2xs"
                                        title={`Grup WA: ${waGroup} (Klik untuk ubah mapping akun '${cust}')`}
                                      >
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                        <span className="truncate max-w-[130px] font-medium">{waGroup}</span>
                                        <Edit3 className="w-3 h-3 text-emerald-600 opacity-60 group-hover:opacity-100 shrink-0 ml-0.5" />
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => handleOpenGroupModal(dev.customer_id, cust, '', '')}
                                        className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 transition-all cursor-pointer shadow-2xs active:scale-95"
                                        title={`Tambah Nama WhatsApp Group untuk akun '${cust}'`}
                                      >
                                        <Plus className="w-3 h-3 text-emerald-600" />
                                        <span>Add Grup WA</span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* 4. Durasi Offline (KOLOM TERAKHIR) */}
                              <td className="py-3 px-4 whitespace-nowrap">
                                <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  {dur}
                                </span>
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer */}
                <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Aturan Nara: Unit CAM hanya dilaporkan jika durasi offline &gt; 72 jam (3 hari).
                  </span>
                  <span className="font-mono text-[10px]">
                    Status: Sinkron dengan Database Nara Engine (SQLite &amp; JSON Store)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 2. NARA TAB: DRAFT CHAT & SMART GROUP DISPATCHER */}
          {/* ======================================================== */}
          {agentId === 'nara' && naraTab === 'customer_dispatch' && (
            <div className="max-w-6xl mx-auto space-y-5 animate-in fade-in duration-200">
              {/* Header Banner */}
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full border bg-sky-50 text-sky-700 border-sky-200">
                      DRAFT CHAT &bull; SMART GROUP DISPATCHER &bull; WATSON ANTI-BAN ACTIVE
                    </span>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-sky-600" />
                      Draft Chat WhatsApp Pelanggan &amp; Dispatch Grup
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Nara menyusun draf pesan WhatsApp natural bervariasi per akun pelanggan (1 Akun = 1 Grup WA). Human agent dapat langsung <strong>menyalin draf (Copy)</strong> untuk dikirim manual, atau memerintahkan <strong>Watson untuk mendistribusikan secara otomatis</strong> dengan jitter anti-ban 15–45 detik.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
                    {/* Button Atur Grup WA Akun */}
                    <button
                      type="button"
                      onClick={() => handleOpenGroupModal()}
                      className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                      title="Atur WhatsApp Group per Akun Pelanggan (1 Akun = 1 Grup)"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>Atur Grup WA Akun</span>
                    </button>

                    {/* Batch Dispatch Watson */}
                    <button
                      type="button"
                      onClick={handleTriggerNaraDispatch}
                      disabled={naraDispatching}
                      className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-black text-xs rounded-xl shadow-2xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      title="Kirim pesan ke seluruh grup customer PRO via Watson Gateway"
                    >
                      <Play className={`w-3.5 h-3.5 ${naraDispatching ? 'animate-spin' : 'text-emerald-400'}`} />
                      <span>{naraDispatching ? 'Mendispatch ke Grup...' : 'Batch Kirim Semua Grup'}</span>
                    </button>
                  </div>
                </div>

                {/* Notifications & Toast Feedback */}
                {draftChatCopyFeedback && (
                  <div className="p-3 bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in duration-200">
                    <span className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-white" />
                      {draftChatCopyFeedback}
                    </span>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md font-mono">Siap Dipaste</span>
                  </div>
                )}

                {singleDispatchFeedback && (
                  <div className="p-3 bg-sky-50 border border-sky-300 text-sky-900 rounded-xl text-xs font-bold flex items-center justify-between animate-in fade-in duration-200">
                    <span className="flex items-center gap-2">
                      <Send className="w-4 h-4 text-sky-600" />
                      {singleDispatchFeedback}
                    </span>
                    <span className="text-[10px] bg-sky-200 text-sky-800 px-2 py-0.5 rounded font-mono">Watson Dispatch</span>
                  </div>
                )}

                {naraDispatchResult && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-mono font-bold flex items-center justify-between animate-in fade-in">
                    <span className="flex items-center gap-2">
                      <CheckCheck className="w-4 h-4 text-emerald-600" />
                      Laporan batch terkirim ke {naraDispatchResult.total_groups_dispatched} grup customer PRO dengan jitter acak 15–45s (0 Ban Flags)!
                    </span>
                    <span className="text-[10px] text-emerald-600 font-sans">Batch: {naraDispatchResult.batch_id}</span>
                  </div>
                )}
              </div>

              {/* Customer Account Selection Tabs with Group Name Badges */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    Pilih Akun Pelanggan &bull; 1 Akun = 1 Grup WA:
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {(naraLiveReport?.customer_reports || []).length} Akun Pelanggan Terdeteksi
                  </span>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {(naraLiveReport?.customer_reports || []).map((rep) => {
                    const isSelected = String(naraSelectedCustomerTab) === String(rep.customer_id)
                    return (
                      <div
                        key={rep.customer_id}
                        className={`px-3.5 py-2 rounded-xl text-left whitespace-nowrap transition-all cursor-pointer border flex items-center gap-2.5 ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                        onClick={() => setNaraSelectedCustomerTab(rep.customer_id)}
                      >
                        <div>
                          <div className="text-xs font-black truncate max-w-[150px]">{rep.customer_name}</div>
                          <div className={`text-[10px] font-mono truncate max-w-[150px] ${isSelected ? 'text-sky-300' : 'text-slate-500'}`}>
                            {rep.wa_group_name}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${isSelected ? 'bg-sky-400 text-slate-900 font-bold' : 'bg-slate-100 text-slate-600'}`}>
                            {rep.counts.total_offline}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleOpenGroupModal(rep.customer_id, rep.customer_name, rep.wa_group_name, rep.wa_group_id)
                            }}
                            className={`p-1 rounded-md transition-colors ${isSelected ? 'hover:bg-white/20 text-slate-300 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700'}`}
                            title={`Atur nama WhatsApp Group untuk akun '${rep.customer_name}'`}
                          >
                            <Settings className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Detail Selected Customer Report Preview (Draft Chat Studio) */}
              {(() => {
                const currentReport = (naraLiveReport?.customer_reports || []).find(
                  (r) => String(r.customer_id) === String(naraSelectedCustomerTab)
                ) || (naraLiveReport?.customer_reports || [])[0]

                if (!currentReport) {
                  return (
                    <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                        <Users className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-700">Tidak ada laporan customer yang perlu dikirim</h4>
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        Semua unit terpantau stabil atau tidak ada perubahan baru sejak pemeriksaan terakhir (Proteksi Anti-Spam aktif).
                      </p>
                      <button
                        type="button"
                        onClick={() => handleOpenGroupModal()}
                        className="py-2 px-4 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs"
                      >
                        Atur Pemetaan Grup WhatsApp Akun
                      </button>
                    </div>
                  )
                }

                const effectiveMessageText = customDraftTexts[currentReport.customer_id] ?? currentReport.message_text
                const isCustomized = customDraftTexts[currentReport.customer_id] !== undefined && customDraftTexts[currentReport.customer_id] !== currentReport.message_text

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {/* Left 2 Cols: WhatsApp Chat Bubble & Action Controls */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
                      {/* WhatsApp Window Header */}
                      <div className="p-4 bg-emerald-700 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-base shrink-0">
                            💬
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white tracking-tight">{currentReport.wa_group_name}</h4>
                              <button
                                type="button"
                                onClick={() => handleOpenGroupModal(currentReport.customer_id, currentReport.customer_name, currentReport.wa_group_name, currentReport.wa_group_id)}
                                className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-emerald-100 hover:text-white transition-colors cursor-pointer"
                                title="Ubah nama WhatsApp Group untuk akun pelanggan ini"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="text-[11px] text-emerald-200 font-mono">
                              Akun: <span className="font-bold text-white">{currentReport.customer_name}</span> &bull; {currentReport.wa_group_id}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-800 text-emerald-100 border border-emerald-600">
                            {currentReport.report_mode === 'FULL_AUDIT' ? 'Mode Tanggal 1 (Audit Lengkap)' : 'Mode Delta'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleOpenGroupModal(currentReport.customer_id, currentReport.customer_name, currentReport.wa_group_name, currentReport.wa_group_id)}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white text-emerald-900 hover:bg-emerald-50 transition-colors cursor-pointer shadow-2xs"
                          >
                            Ubah Grup WA
                          </button>
                        </div>
                      </div>

                      {/* Chat Canvas Preview */}
                      <div className="p-5 bg-slate-100/90 flex-1 space-y-4">
                        <div className="max-w-2xl bg-white p-4.5 rounded-2xl rounded-tl-xs shadow-xs border border-slate-200/90 space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-[10px] text-slate-400">
                            <span className="font-bold text-emerald-600 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              Draft Pesan WhatsApp &bull; Watson AI Gateway
                            </span>
                            <span>{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</span>
                          </div>

                          {/* Message Content: Static Preview or Editable Textarea */}
                          {isEditingDraft ? (
                            <div className="space-y-2">
                              <textarea
                                value={effectiveMessageText}
                                onChange={(e) => {
                                  const val = e.target.value
                                  setCustomDraftTexts((prev) => ({ ...prev, [currentReport.customer_id]: val }))
                                }}
                                rows={14}
                                className="w-full p-3 bg-emerald-50/20 border-2 border-emerald-400 rounded-xl text-xs font-mono text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
                                placeholder="Edit pesan draf WhatsApp..."
                              />
                              <p className="text-[11px] text-slate-500 flex items-center justify-between">
                                <span>✏️ Mode edit aktif: Perubahan Anda akan disalin atau dikirim ke WhatsApp Group ini.</span>
                                {isCustomized && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setCustomDraftTexts((prev) => {
                                        const next = { ...prev }
                                        delete next[currentReport.customer_id]
                                        return next
                                      })
                                    }}
                                    className="text-rose-600 hover:underline text-[10px] font-bold"
                                  >
                                    Reset ke Teks Asli
                                  </button>
                                )}
                              </p>
                            </div>
                          ) : (
                            <pre className="text-xs text-slate-800 whitespace-pre-wrap font-sans leading-relaxed selection:bg-emerald-100">
                              {effectiveMessageText}
                            </pre>
                          )}
                        </div>

                        {/* --- DRAFT CHAT MAIN ACTION BUTTONS --- */}
                        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-2">
                            {/* 1. BUTTON FOR HUMAN AGENT: COPY DRAFT TO CLIPBOARD */}
                            <button
                              type="button"
                              onClick={() => handleCopyDraftChat(effectiveMessageText, currentReport.wa_group_name)}
                              className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                              title="Salin draft pesan ke clipboard untuk dipaste ke WhatsApp Web / Desktop"
                            >
                              <Copy className="w-4 h-4" />
                              <span>Copy Draft Pesan</span>
                            </button>

                            {/* 2. TOGGLE EDIT DRAFT */}
                            <button
                              type="button"
                              onClick={() => setIsEditingDraft(!isEditingDraft)}
                              className={`py-2.5 px-3.5 rounded-xl font-bold text-xs transition-all cursor-pointer border flex items-center gap-1.5 ${
                                isEditingDraft
                                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                              }`}
                              title="Edit teks pesan secara manual sebelum dikirim atau disalin"
                            >
                              <Edit className="w-3.5 h-3.5 text-slate-600" />
                              <span>{isEditingDraft ? 'Selesai Edit' : 'Edit Draf'}</span>
                            </button>
                          </div>

                          {/* 3. BUTTON FOR WATSON: SEND TO WHATSAPP GROUP */}
                          <button
                            type="button"
                            onClick={() => handleDispatchSingleCustomer(currentReport.customer_id, currentReport.wa_group_name)}
                            disabled={singleCustomerDispatching}
                            className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                            title="Kirim pesan ini langsung ke grup WhatsApp customer melalui bot Watson"
                          >
                            <Send className={`w-3.5 h-3.5 ${singleCustomerDispatching ? 'animate-spin' : 'text-emerald-400'}`} />
                            <span>{singleCustomerDispatching ? 'Watson Mengirim...' : 'Kirim via Watson ke Group WA'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Bottom Footer bar */}
                      <div className="p-3 bg-white border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
                        <span className="text-[11px] font-mono truncate">
                          Hash Idempotency: <code className="bg-slate-100 px-1 py-0.5 rounded">{currentReport.notification_hash}</code>
                        </span>
                        <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          Anti-Spam &amp; Jitter Validated
                        </span>
                      </div>
                    </div>

                    {/* Right 1 Col: Summary & Actions Guide */}
                    <div className="space-y-4">
                      {/* Human Agent & Watson Guide Card */}
                      <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-sky-400 uppercase tracking-wider">
                            PANDUAN OPERASIONAL CS
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white font-mono">
                            2 Metode
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-white">Cara Pengiriman Draft Chat</h4>
                        <div className="space-y-2.5 text-xs text-slate-300">
                          <div className="p-2.5 bg-white/10 rounded-xl space-y-1">
                            <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                              <Copy className="w-3 h-3" />
                              <span>1. Kirim Manual (Human Agent)</span>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                              Klik tombol <strong>"Copy Draft Pesan"</strong> lalu tempelkan (paste) langsung ke WhatsApp Web / Desktop di grup <strong>{currentReport.wa_group_name}</strong>.
                            </p>
                          </div>

                          <div className="p-2.5 bg-white/10 rounded-xl space-y-1">
                            <div className="font-bold text-sky-300 flex items-center gap-1.5">
                              <Send className="w-3 h-3" />
                              <span>2. Otomatis via Watson</span>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                              Klik <strong>"Kirim via Watson ke Group WA"</strong>. Bot Watson mengirim dengan simulasi mengetik 3–5s dan anti-ban jitter acak tanpa risiko blokir nomor.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Customer Account Info & WA Group Card */}
                      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                            Aturan Grup WA Akun
                          </h4>
                          <button
                            type="button"
                            onClick={() => handleOpenGroupModal(currentReport.customer_id, currentReport.customer_name, currentReport.wa_group_name, currentReport.wa_group_id)}
                            className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
                          >
                            Ubah
                          </button>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between py-1 border-b border-slate-100">
                            <span className="text-slate-500">Akun Pelanggan:</span>
                            <span className="font-bold text-slate-900">{currentReport.customer_name}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-100">
                            <span className="text-slate-500">Grup WhatsApp:</span>
                            <span className="font-bold text-emerald-700">{currentReport.wa_group_name}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-100">
                            <span className="text-slate-500">Mode Kalender:</span>
                            <span className="font-bold text-indigo-600">{currentReport.report_mode}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-100">
                            <span className="text-slate-500">Unit Baru Mati:</span>
                            <span className="font-bold text-rose-600">{currentReport.counts.new_offline} unit</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-100">
                            <span className="text-slate-500">Unit Masih Offline:</span>
                            <span className="font-bold text-amber-600">{currentReport.counts.still_offline} unit</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-100">
                            <span className="text-slate-500">Unit Kembali Pulih:</span>
                            <span className="font-bold text-emerald-600">{currentReport.counts.recovered_online} unit</span>
                          </div>
                        </div>

                        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600">
                          <span className="font-bold text-slate-800">1 Akun = 1 Grup:</span> Semua unit kendaraan milik akun <strong>{currentReport.customer_name}</strong> secara otomatis terpetakan ke grup <strong>{currentReport.wa_group_name}</strong>.
                        </div>
                      </div>

                      {/* Anti-Ban Safeguards Card */}
                      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
                        <span className="text-[10px] font-black text-sky-600 uppercase tracking-wider block">
                          WATSON SAFETY PROTOCOL
                        </span>
                        <h4 className="text-xs font-black text-slate-900">Proteksi Anti-Ban Meta</h4>
                        <ul className="text-xs text-slate-600 space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold">&bull;</span>
                            <span><strong>Jitter Dinamis:</strong> Jeda 15–45s acak antar-grup mencegah pola bot kaku.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold">&bull;</span>
                            <span><strong>Typing Simulator:</strong> Paket <code>composing</code> aktif 3–5s sebelum kirim.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold">&bull;</span>
                            <span><strong>Template Rotator:</strong> Diksi sapaan bervariasi sesuai waktu agar hash berbeda.</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}

          {/* 3. NARA TAB: FEEDBACK LOOP (WATSON KE NARA INBOUND) */}
          {/* ======================================================== */}
          {agentId === 'nara' && naraTab === 'feedback_loop' && (
            <div className="max-w-6xl mx-auto space-y-5 animate-in fade-in duration-200">
              {/* Header */}
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
                  FEEDBACK LOOP: WATSON &harr; NARA
                </span>
                <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                  Penanganan Balasan WhatsApp Group Customer
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Ketika member grup WhatsApp customer merespons pesan peringatan unit offline, Watson meneruskannya ke Nara untuk merumuskan instruksi teknis dan memperbarui status sistem.
                </p>
              </div>

              {/* Interactive Simulator */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Left: Inbound Simulator Input */}
                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                  <h3 className="text-sm font-black text-slate-900">
                    Simulasi Pesan Balasan Member Grup WhatsApp
                  </h3>

                  {/* Preset Buttons */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Pilih Skenario Respon:</label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleApplyFeedbackPreset('technician')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          naraFeedbackPreset === 'technician'
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        🔧 Butuh Bantuan Teknisi
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApplyFeedbackPreset('workshop')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          naraFeedbackPreset === 'workshop'
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        🛠️ Unit Masuk Bengkel
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApplyFeedbackPreset('battery')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          naraFeedbackPreset === 'battery'
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        🔋 Saklar Aki Dimatikan
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleNaraFeedbackSubmit} className="space-y-3 pt-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Nama Pengirim (Member Grup):</label>
                      <input
                        type="text"
                        value={naraFeedbackSender}
                        onChange={(e) => setNaraFeedbackSender(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Teks Balasan:</label>
                      <textarea
                        rows={3}
                        value={naraFeedbackMsg}
                        onChange={(e) => setNaraFeedbackMsg(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={naraFeedbackSending}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{naraFeedbackSending ? 'Memproses Respon...' : 'Kirim Inbound Reply ke Watson &rarr; Nara'}</span>
                    </button>
                  </form>
                </div>

                {/* Right: Watson's Technical Reply */}
                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="text-sm font-black text-slate-900">
                        Respons Teknis Watson &amp; Nara
                      </h3>
                      {naraFeedbackResult && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {naraFeedbackResult.intent_category}
                        </span>
                      )}
                    </div>

                    {naraFeedbackResult ? (
                      <div className="space-y-3 animate-in fade-in">
                        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-500">Tiket Terbit:</span>
                            <span className="font-mono font-bold text-indigo-600">{naraFeedbackResult.ticket_id}</span>
                          </div>
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-500">Tindakan State:</span>
                            <span className="font-mono font-bold text-emerald-700">{naraFeedbackResult.state_action}</span>
                          </div>
                        </div>

                        {/* WhatsApp Message Response Bubble */}
                        <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl rounded-tr-xs space-y-2">
                          <span className="text-[10px] font-bold text-emerald-800 block">
                            Pesan Watson Siap Dikirim ke Grup WhatsApp:
                          </span>
                          <pre className="text-xs text-slate-800 whitespace-pre-wrap font-sans leading-relaxed">
                            {naraFeedbackResult.nara_reply}
                          </pre>
                        </div>
                      </div>
                    ) : (
                      <div className="py-12 text-center text-slate-400 text-xs">
                        Silakan kirim pesan uji coba di sebelah kiri untuk melihat bagaimana Watson dan Nara memproses respons customer secara otomatis.
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 text-[11px] text-slate-500">
                    ⚡ <strong>Automasi Cerdas:</strong> Bila customer konfirmasi masuk bengkel, sistem otomatis menjeda notifikasi selama 7 hari tanpa perlu intervensi manual agen.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NARA TAB: SAFE BROADCAST (ANTI-BAN) */}
          {agentId === 'nara' && naraTab === 'safe_broadcast' && (
            <div className="max-w-6xl mx-auto space-y-5 animate-in fade-in duration-200">
              {/* Anti-Ban Banner */}
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full border bg-sky-50 text-sky-700 border-sky-200">
                      SAFETY ENGINE ACTIVE
                    </span>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight mt-1.5 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      Safe Group Broadcast Engine (WhatsApp Anti-Banned)
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Protokol pengiriman peringatan unit offline ke grup teknisi regional tanpa memicu deteksi spam WhatsApp.
                    </p>
                  </div>

                  <button
                    onClick={handleTriggerSafeBroadcast}
                    disabled={isBroadcasting}
                    className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-black text-xs rounded-xl shadow-2xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 self-start sm:self-auto"
                  >
                    <Play className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isBroadcasting ? 'Memproses Antrean...' : 'Jalankan Safe Broadcast'}</span>
                  </button>
                </div>

                {/* Broadcast Progress Feedback */}
                {broadcastProgress && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-mono font-bold flex items-center gap-2 animate-in fade-in">
                    <Activity className="w-4 h-4 text-emerald-600 animate-spin" />
                    <span>{broadcastProgress}</span>
                  </div>
                )}

                {/* 3 Pillars of Anti-Banned */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-amber-500" />
                      Randomized Jitter Timer
                    </span>
                    <p className="text-xs font-bold text-slate-900">Jeda 15 — 45 Detik</p>
                    <span className="text-[11px] text-slate-500 block leading-tight">Memutus pola broadcast robotik teratur yang memicu auto-flagging Meta.</span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-slate-500 flex items-center gap-1.5">
                      <MessageSquare className="w-3 h-3 text-sky-500" />
                      Typing Simulator
                    </span>
                    <p className="text-xs font-bold text-slate-900">Composing State (3-5s)</p>
                    <span className="text-[11px] text-slate-500 block leading-tight">Mengirim paket indikator mengetik natural sebelum pesan terkirim.</span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-slate-500 flex items-center gap-1.5">
                      <Layers className="w-3 h-3 text-purple-500" />
                      Dynamic Template Rotator
                    </span>
                    <p className="text-xs font-bold text-slate-900">3 Variasi Diksi</p>
                    <span className="text-[11px] text-slate-500 block leading-tight">Memastikan hash pesan berbeda untuk setiap grup WhatsApp.</span>
                  </div>
                </div>
              </div>

              {/* Group Queue Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-700" />
                    Antrean Grup WhatsApp Teknisi Regional
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">3 Target Grup</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                        <th className="py-3 px-4">Nama Grup WhatsApp</th>
                        <th className="py-3 px-4">Unit Terdampak</th>
                        <th className="py-3 px-4">Simulasi Delay Jitter</th>
                        <th className="py-3 px-4">Protokol Status</th>
                        <th className="py-3 px-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                      {NARA_SAFE_BROADCAST_QUEUE.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4 font-black text-slate-900 whitespace-nowrap">
                            {item.group}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                            {item.units}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-600">
                            {item.delayJitter}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500">
                            <span className="font-medium text-slate-700">{item.typingStatus}</span>
                            <div className="text-[10px] text-slate-400">{item.template}</div>
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <span className="inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* NARA TAB: TELEMETRY UPTIME */}
          {agentId === 'nara' && naraTab === 'telemetry' && (
            <div className="max-w-6xl mx-auto space-y-5 animate-in fade-in duration-200">
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <Radio className="w-5 h-5 text-emerald-600" />
                    Statistik Telemetri & Jangkauan Jaringan Regional
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Monitoring sinyal GSM, GPS Satelit, dan integritas firmware 1.248 unit kendaraan aktif.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Jaringan 4G / LTE</span>
                    <p className="text-xl font-black text-slate-900">97.4%</p>
                    <span className="text-[11px] text-emerald-600 font-semibold">1.215 Unit High-Speed Dial</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Fallback 2G / GPRS</span>
                    <p className="text-xl font-black text-amber-600">2.6%</p>
                    <span className="text-[11px] text-amber-600 font-semibold">33 Unit di area blank spot</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Rata-rata Latensi Jaringan</span>
                    <p className="text-xl font-black text-indigo-600">38 ms</p>
                    <span className="text-[11px] text-slate-500 font-semibold">Server IoT Orin Cloud Jakarta</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VELOCIA TAB: MARKET INTELLIGENCE FROM SHERLOC CHATS */}
          {agentId === 'velocia' && velociaTab === 'market_intelligence' && (
            <div className="max-w-6xl mx-auto space-y-5 animate-in fade-in duration-200">
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div>
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full border bg-red-50 text-red-700 border-red-200">
                    DOWNSTREAM CHAT MINING
                  </span>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight mt-1.5 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-red-600" />
                    Market Intelligence (Hasil Ekstraksi Log Chat Sherloc)
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Velocia secara otomatis mengaudit ribuan pertanyaan calon pelanggan & pengguna aktif di WhatsApp untuk merumuskan peluang kampanye marketing baru.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {VELOCIA_MARKET_TRENDS.map((trend, i) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-black text-slate-900">{trend.keyword}</h4>
                        <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {trend.growth}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>Frekuensi: <strong className="text-slate-800">{trend.count} kali</strong></span>
                        <span>•</span>
                        <span>Sentimen: <strong className="text-emerald-700">{trend.sentiment}</strong></span>
                      </div>
                      <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100">
                        {trend.note}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between">
                  <div className="text-xs">
                    <span className="font-bold text-amber-400 block mb-0.5">Rekomendasi Strategis Velocia untuk Q4 2026:</span>
                    <p className="text-slate-300">Luncurkan paket promo "Orin Fleet Sensor Pro" dengan diskon 25% untuk pemesanan armada 5 unit ke atas.</p>
                  </div>
                  <button
                    onClick={() => handleDelegatePlan('Promo Bundling Armada & Fuel Sensor Q4')}
                    className="py-2 px-3.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-900 font-black text-xs rounded-xl shadow-2xs transition-all shrink-0 cursor-pointer"
                  >
                    Bahas di Chat Velocia
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 2. VELOCIA WORKSPACE VIEW (MARKETING STRATEGIST MATRIX)  */}
          {/* ======================================================== */}
          {agentId === 'velocia' && VELOCIA_PLANS[velociaTab] && (
            <div className="max-w-6xl mx-auto space-y-5 animate-in fade-in duration-200">
              {/* Plan Switcher Tabs (Horizontal Pills) */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                {Object.values(VELOCIA_PLANS).map((p) => {
                  const isCur = velociaTab === p.id
                  return (
                    <button
                      key={p.id}
                      onClick={() => setVelociaTab(p.id)}
                      className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                        isCur
                          ? 'bg-slate-900 text-white shadow-2xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{p.title}</span>
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                        isCur ? 'bg-white/20 text-white' : p.badgeColor
                      }`}>
                        {p.badge}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Executive Overview Hero Banner */}
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${VELOCIA_PLANS[velociaTab].badgeColor}`}>
                      {VELOCIA_PLANS[velociaTab].badge}
                    </span>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight mt-1.5">
                      {VELOCIA_PLANS[velociaTab].title}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Periode Pelaksanaan: <strong>{VELOCIA_PLANS[velociaTab].period}</strong>
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelegatePlan(VELOCIA_PLANS[velociaTab].title)}
                    className="py-2 px-4 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
                  >
                    <Send className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Diskusikan di Chat Velocia</span>
                  </button>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
                  <strong className="text-slate-900 font-black">Sasaran & Objektif Utama:</strong>{' '}
                  {VELOCIA_PLANS[velociaTab].objective}
                </div>

                {/* Key Metrics Counter Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shrink-0">
                      <DollarSign className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Alokasi Anggaran</span>
                      <p className="text-base font-black text-slate-900">{VELOCIA_PLANS[velociaTab].budget}</p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0 border border-emerald-200">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target KPI & Konversi</span>
                      <p className="text-base font-black text-slate-900">{VELOCIA_PLANS[velociaTab].targetKPI}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* TIMELINE MATRIX & DELIVERABLES TABLE */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-700" />
                    Rincian Tahapan & Deliverables (Timeline Matrix)
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">4 Tahapan Strategis</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                        <th className="py-3 px-4 w-36">Fase / Periode</th>
                        <th className="py-3 px-4 w-60">Fokus & Judul Milestone</th>
                        <th className="py-3 px-4">Rincian Deliverables</th>
                        <th className="py-3 px-4 w-28 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                      {VELOCIA_PLANS[velociaTab].weeklyMilestones.map((ms, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-900 align-top whitespace-nowrap">
                            <div>{ms.week}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{ms.dateRange}</div>
                          </td>
                          <td className="py-3.5 px-4 font-black text-slate-900 align-top">
                            {ms.title}
                          </td>
                          <td className="py-3.5 px-4 align-top">
                            <ul className="space-y-1.5 text-slate-600 text-xs">
                              {ms.items.map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-slate-400 font-bold shrink-0">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td className="py-3.5 px-4 text-right align-top whitespace-nowrap">
                            <span className={`inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                              ms.status === 'Selesai'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : ms.status === 'Berlangsung'
                                ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                                : ms.status === 'Persiapan'
                                ? 'bg-sky-50 text-sky-700 border-sky-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>
                              {ms.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* CHANNEL ALLOCATION MATRIX TABLE */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-slate-700" />
                    Alokasi Saluran Pemasaran (Channel Breakdown)
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">Distribusi Anggaran Multi-Channel</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                        <th className="py-3 px-4">Saluran Pemasaran</th>
                        <th className="py-3 px-4 w-48">Porsi Alokasi (%)</th>
                        <th className="py-3 px-4">Nominal Budget</th>
                        <th className="py-3 px-4">Catatan Strategis</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                      {VELOCIA_PLANS[velociaTab].channels.map((ch, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                            {ch.name}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                                <div
                                  className="h-full bg-slate-900 rounded-full"
                                  style={{ width: `${ch.percentage}%` }}
                                />
                              </div>
                              <span className="font-mono font-bold text-[11px] text-slate-700 w-8 text-right">
                                {ch.share}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                            {ch.budget}
                          </td>
                          <td className="py-3 px-4 text-slate-500 text-xs">
                            {ch.note}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 3. SCOUT WORKSPACE VIEW (RESEARCH & ARTICLE LAB)         */}
          {/* ======================================================== */}
          {agentId === 'scout' && (
            <div className="max-w-6xl mx-auto space-y-5 animate-in fade-in duration-200">
              {/* Tab: RECURRING ISSUES & SOP WRITER */}
              {scoutTab === 'recurring_issues' && (
                <div className="space-y-4">
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                    <div>
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
                        AUTONOMOUS SOP GENERATOR
                      </span>
                      <h2 className="text-xl font-black text-slate-900 tracking-tight mt-1.5 flex items-center gap-2">
                        <Bot className="w-5 h-5 text-emerald-600" />
                        Analisis Isu Berulang & Pembuat Panduan Mandiri (SOP)
                      </h2>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        Scout mengelompokkan keluhan customer berulang dari Sherloc dan secara otomatis menyusun panduan solusi langkah-demi-langkah untuk dimasukkan ke Knowledge Base Sherloc.
                      </p>
                    </div>

                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                      {SCOUT_RECURRING_ISSUES.map((item, idx) => (
                        <div key={idx} className="p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                                Prioritas: {item.priority}
                              </span>
                              <span className="text-[11px] text-slate-400 font-medium">
                                Frekuensi: <strong className="text-slate-700">{item.frequency}</strong>
                              </span>
                            </div>
                            <h4 className="text-sm font-black text-slate-900">{item.issue}</h4>
                            <p className="text-xs text-slate-500">Dampak Beban CS: <strong className="text-rose-600">{item.impact}</strong></p>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                              ✓ {item.sopStatus}
                            </span>
                            <button
                              onClick={() => {
                                copyToClipboard(`Panduan Mandiri: ${item.issue}\n1. Buka aplikasi Orin Mobile\n2. Klik menu Profil > Keamanan\n3. Verifikasi nomor WhatsApp\n4. Buat PIN baru 6 digit`, `sop-${idx}`)
                              }}
                              className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                            >
                              {copiedId === `sop-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedId === `sop-${idx}` ? 'Tersalin' : 'Salin SOP'}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: TRENDS or ALL */}
              {(scoutTab === 'trends' || scoutTab === 'all') && (
                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    Top Radar Tren AI Terpantau Minggu Ini
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-black text-slate-900">Spatial Multi-Agent</p>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">+184% Diskusi</span>
                      </div>
                      <span className="text-[11px] text-slate-600 leading-relaxed block">Lonjakan adopsi arsitektur 3D ruang kerja di kalangan enterprise CTO & tech founders.</span>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-black text-slate-900">Voice-to-Action Protocol</p>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">+122% Adopsi</span>
                      </div>
                      <span className="text-[11px] text-slate-600 leading-relaxed block">Pendelegasian tugas lisan real-time langsung ke pipeline task management kanban tim.</span>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-black text-slate-900">Edge IoT Telemetry Sync</p>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">+95% Penetrasi</span>
                      </div>
                      <span className="text-[11px] text-slate-600 leading-relaxed block">Pengawasan detak unit offline otomatis oleh AI dengan respons penanganan instan.</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: ARTICLES or ALL */}
              {(scoutTab === 'articles' || scoutTab === 'all') && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-700" />
                      Draf Artikel & Blog Siap Rilis (Otomatis dibuat oleh Scout)
                    </h3>
                    <span className="text-[11px] text-slate-400 font-medium">3 Draf Terpublikasikan</span>
                  </div>

                  {SCOUT_ARTICLES.map((art) => (
                    <div key={art.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                            {art.category}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {art.readTime} • SEO Score: <strong className="text-emerald-600">{art.seoScore}</strong>
                          </span>
                        </div>

                        <button
                          onClick={() => copyToClipboard(art.content, art.id)}
                          className="self-start sm:self-auto py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          {copiedId === art.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              Tersalin!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              Salin Naskah Lengkap
                            </>
                          )}
                        </button>
                      </div>

                      <h4 className="text-base font-black text-slate-900">
                        {art.title}
                      </h4>

                      <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 whitespace-pre-line font-serif">
                        {art.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* --- CUSTOMER ACCOUNT WHATSAPP GROUP MAPPING MODAL --- */}
      {showGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 leading-tight">
                    Atur Grup WhatsApp Pelanggan
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    1 Akun Pelanggan = 1 WhatsApp Group
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGroupModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveCustomerGroupMapping}>
              <div className="p-6 space-y-4">
                {/* Pilih Akun Pelanggan Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Pilih Akun Pelanggan
                  </label>
                  <select
                    value={editCustomerId}
                    onChange={(e) => {
                      const val = e.target.value
                      setEditCustomerId(val)
                      const found = availableCustomerAccounts.find((c) => String(c.id) === String(val))
                      if (found) {
                        setEditCustomerName(found.name)
                        setInputGroupName(found.wa_group_name || `ONB ${found.name}`)
                        setInputGroupJid(found.wa_group_id || '')
                      } else if (val === 'CUSTOM') {
                        setEditCustomerName('')
                        setInputGroupName('')
                        setInputGroupJid('')
                      }
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
                  >
                    <option value="">-- Pilih dari Akun Terdaftar --</option>
                    {availableCustomerAccounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} {acc.wa_group_name ? `(${acc.wa_group_name})` : ''}
                      </option>
                    ))}
                    <option value="CUSTOM">+ Masukkan Nama Akun Baru (Kustom)</option>
                  </select>
                </div>

                {/* Nama Akun Pelanggan Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nama Akun Pelanggan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editCustomerName}
                    onChange={(e) => {
                      const val = e.target.value
                      setEditCustomerName(val)
                      if (!inputGroupName || inputGroupName.startsWith('ONB ')) {
                        setInputGroupName(val.trim() ? `ONB ${val.trim()}` : '')
                      }
                    }}
                    placeholder="Contoh: LNJ atau PT RAMA"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                  />
                </div>

                {/* Nama WhatsApp Group Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>Nama WhatsApp Group <span className="text-rose-500">*</span></span>
                    <span className="text-[10px] font-normal text-emerald-600 font-bold">Contoh: ONB LNJ</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={inputGroupName}
                    onChange={(e) => setInputGroupName(e.target.value)}
                    placeholder="Contoh: ONB LNJ"
                    className="w-full px-3.5 py-2.5 bg-white border-2 border-emerald-400 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-2xs placeholder:font-normal placeholder:text-slate-400"
                  />
                </div>

                {/* Clean Info Box */}
                <div className="p-3 bg-emerald-50/70 border border-emerald-200/70 rounded-xl flex items-start gap-2.5 text-xs text-emerald-900">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    <strong>1 Akun = 1 Grup:</strong> Semua unit kendaraan yang berada di bawah akun <strong>{editCustomerName || 'ini'}</strong> secara otomatis menggunakan WhatsApp Group ini pada draf pesan dan pengiriman Watson.
                  </p>
                </div>

                {/* Success Notification */}
                {groupMappingSuccessMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{groupMappingSuccessMsg}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons Footer */}
              <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowGroupModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/70 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingGroupMapping || !inputGroupName.trim()}
                  className="px-5 py-2.5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {savingGroupMapping ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Simpan Grup WA</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
