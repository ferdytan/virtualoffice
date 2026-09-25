import React, { useState, useMemo } from 'react'
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
  ExternalLink
} from 'lucide-react'
import AgentCloseUpAvatar from './AgentCloseUpAvatar'

export default function AgentWorkspaceView({
  agent,
  agents = [],
  onSelectAgent,
  onBackToOffice,
  onOpenCall,
  onOpenAvatarModal,
  onSendBrief
}) {
  const [copiedId, setCopiedId] = useState(null)
  const [briefInput, setBriefInput] = useState('')
  const [briefFeedback, setBriefFeedback] = useState(null)

  // Default active tabs per agent
  const [velociaTab, setVelociaTab] = useState('september_plan')
  const [naraTab, setNaraTab] = useState('offline_units')
  const [scoutTab, setScoutTab] = useState('articles')

  // Search & filter state for Nara's data table
  const [unitSearch, setUnitSearch] = useState('')
  const [severityFilter, setSeverityFilter] = useState('ALL') // ALL, KRITIS, TINGGI, SEDANG

  // Notification simulation state for Nara's actions
  const [pingedUnits, setPingedUnits] = useState({})
  const [escalatedUnits, setEscalatedUnits] = useState({})

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

  // --- NARA OFFLINE UNIT TELEMETRY DATA (9 UNITS) ---
  const NARA_OFFLINE_UNITS = [
    {
      id: 'UNIT-JKT-402',
      region: 'Jakarta Selatan',
      hub: 'Hub Kuningan Tower A',
      offlineSince: '18 mnt lalu (17:24 WIB)',
      severity: 'KRITIS',
      technician: 'Rian Pratama',
      techPhone: '+62 812-4455-8901',
      issue: 'Tegangan listrik suplai drop <180V, baterai cadangan UPS menipis.',
      status: 'Menunggu Teknisi'
    },
    {
      id: 'UNIT-SBY-108',
      region: 'Surabaya Timur',
      hub: 'Gudang Logistik Rungkut 2',
      offlineSince: '42 mnt lalu (17:00 WIB)',
      severity: 'TINGGI',
      technician: 'Dimas Santoso',
      techPhone: '+62 813-8899-2311',
      issue: 'Koneksi seluler 4G timeout berulang kali, modul SIM card lock.',
      status: 'Eskalasi Terkirim'
    },
    {
      id: 'UNIT-BDG-214',
      region: 'Bandung Utara',
      hub: 'Outlet Dago Junction',
      offlineSince: '1j 12m lalu (16:30 WIB)',
      severity: 'SEDANG',
      technician: 'Asep Supriatna',
      techPhone: '+62 856-7788-1290',
      issue: 'Sensor telemetri terputus pasca reboot otomatis berkala.',
      status: 'Teknisi di Jalan'
    },
    {
      id: 'UNIT-MDN-089',
      region: 'Medan',
      hub: 'Pusat Distribusi Belawan',
      offlineSince: '2j 05m lalu (15:37 WIB)',
      severity: 'TINGGI',
      technician: 'Budi Siregar',
      techPhone: '+62 821-3322-9900',
      issue: 'Kabel LAN uplink terlepas saat pemeliharaan rak server.',
      status: 'Perbaikan Berjalan'
    },
    {
      id: 'UNIT-SMG-055',
      region: 'Semarang',
      hub: 'Hub Simpang Lima Sentral',
      offlineSince: '35 mnt lalu (17:07 WIB)',
      severity: 'KRITIS',
      technician: 'Tri Wibowo',
      techPhone: '+62 817-4433-2110',
      issue: 'Overheating thermal shutdown pada prosesor gateway edge (89°C).',
      status: 'Menunggu Teknisi'
    },
    {
      id: 'UNIT-MKS-071',
      region: 'Makassar',
      hub: 'Terminal Kargo Hasanuddin',
      offlineSince: '58 mnt lalu (16:44 WIB)',
      severity: 'TINGGI',
      technician: 'Fajar Hamzah',
      techPhone: '+62 811-9988-7711',
      issue: 'Gangguan routing fiber ISP lokal di area perkantoran pelabuhan.',
      status: 'Tiket ISP Dibuat'
    },
    {
      id: 'UNIT-DPS-112',
      region: 'Bali - Denpasar',
      hub: 'Hub Kuta Square',
      offlineSince: '2j 30m lalu (15:12 WIB)',
      severity: 'SEDANG',
      technician: 'Wayan Suartana',
      techPhone: '+62 819-2233-4455',
      issue: 'Konfigurasi VLAN berubah pasca update firmware router switch.',
      status: 'Analisis Jarak Jauh'
    },
    {
      id: 'UNIT-PLB-034',
      region: 'Palembang',
      hub: 'Depot Jakabaring',
      offlineSince: '22 mnt lalu (17:20 WIB)',
      severity: 'KRITIS',
      technician: 'M. Rizky',
      techPhone: '+62 812-7711-2233',
      issue: 'Unit tidak merespon paket heartbeat (Dead Host detection).',
      status: 'Investigasi Mandiri'
    },
    {
      id: 'UNIT-YOG-028',
      region: 'Yogyakarta',
      hub: 'Hub Malioboro Sentra',
      offlineSince: '14 mnt lalu (17:28 WIB)',
      severity: 'KRITIS',
      technician: 'Agus Purnomo',
      techPhone: '+62 878-3344-5566',
      issue: 'Port serial pembaca sensor mati mendadak (Hardware fault).',
      status: 'Menunggu Teknisi'
    }
  ]

  // Filtered units for Nara
  const filteredUnits = useMemo(() => {
    return NARA_OFFLINE_UNITS.filter((unit) => {
      const matchSeverity =
        severityFilter === 'ALL' || unit.severity.toUpperCase() === severityFilter
      const query = unitSearch.toLowerCase().trim()
      const matchQuery =
        !query ||
        unit.id.toLowerCase().includes(query) ||
        unit.region.toLowerCase().includes(query) ||
        unit.hub.toLowerCase().includes(query) ||
        unit.technician.toLowerCase().includes(query) ||
        unit.issue.toLowerCase().includes(query)
      return matchSeverity && matchQuery
    })
  }, [severityFilter, unitSearch])

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
            onClick={onOpenAvatarModal}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer border border-slate-200/60"
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
        <aside className="w-72 lg:w-80 shrink-0 bg-white border-r border-slate-200/90 flex flex-col p-4 overflow-y-auto space-y-4">
          {/* Agent Profile Hero */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-3 mb-2.5">
              <AgentCloseUpAvatar agent={agent} size={48} showStatus={true} />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-slate-900 truncate">{agent.name}</h3>
                  <span
                    className="text-[9px] font-extrabold px-1.5 py-0.2 rounded text-white tracking-wider uppercase shadow-2xs"
                    style={{ backgroundColor: agentColor }}
                  >
                    {agent.role_badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium truncate">{agent.role}</p>
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

            {/* VELOCIA MENU TABS */}
            {agentId === 'velocia' && (
              <div className="space-y-1.5">
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
                    <AlertTriangle className={`w-3.5 h-3.5 ${naraTab === 'offline_units' ? 'text-amber-400' : 'text-red-500'}`} />
                    Unit Offline & Eskalasi (9)
                  </span>
                  {naraTab === 'offline_units' && <ChevronRight className="w-3.5 h-3.5 text-white shrink-0" />}
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
        </aside>

        {/* ======================================================== */}
        {/* RIGHT MAIN WORKSPACE (80% WIDTH)                         */}
        {/* ======================================================== */}
        <main className="flex-1 bg-slate-50/70 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* ======================================================== */}
          {/* 1. NARA WORKSPACE VIEW (OFFLINE UNIT TELEMETRY & TABLE)  */}
          {/* ======================================================== */}
          {agentId === 'nara' && (
            <div className="max-w-6xl mx-auto space-y-5 animate-in fade-in duration-200">
              {/* Telemetry Overview Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className="flex items-center justify-between text-emerald-600 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Online Uptime</span>
                    <Radio className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xl font-black text-slate-900">99.28%</p>
                  <span className="text-[10px] text-emerald-600 font-semibold">1.239 dari 1.248 Unit Aktif</span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className="flex items-center justify-between text-rose-600 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Unit Offline</span>
                    <WifiOff className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xl font-black text-rose-600">9 Unit</p>
                  <span className="text-[10px] text-rose-500 font-semibold">Perlu intervensi teknisi</span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className="flex items-center justify-between text-sky-600 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Rata-rata Respon</span>
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xl font-black text-slate-900">4.2 Menit</p>
                  <span className="text-[10px] text-sky-600 font-semibold">SLA Target &lt; 10 menit</span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-700 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Eskalasi Hari Ini</span>
                    <BellRing className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xl font-black text-slate-900">28 Tiket</p>
                  <span className="text-[10px] text-emerald-600 font-semibold">24 Tiket terselesaikan</span>
                </div>
              </div>

              {/* OFFLINE UNITS ENTERPRISE DATA TABLE */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                {/* Table Header Controls: Search + Severity Filter */}
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        Matriks Unit Offline & Status Eskalasi Teknisi
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Menampilkan {filteredUnits.length} dari {NARA_OFFLINE_UNITS.length} unit yang membutuhkan tindakan cepat
                      </p>
                    </div>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Severity Pills */}
                    <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                      {['ALL', 'KRITIS', 'TINGGI', 'SEDANG'].map((sev) => {
                        const isSel = severityFilter === sev
                        return (
                          <button
                            key={sev}
                            type="button"
                            onClick={() => setSeverityFilter(sev)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                              isSel
                                ? 'bg-white text-slate-900 shadow-2xs'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            {sev === 'ALL' ? 'Semua' : sev}
                          </button>
                        )
                      })}
                    </div>

                    {/* Search Input */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={unitSearch}
                        onChange={(e) => setUnitSearch(e.target.value)}
                        placeholder="Cari ID, Hub, Teknisi..."
                        className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 w-48 sm:w-56"
                      />
                    </div>
                  </div>
                </div>

                {/* The Responsive Data Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                        <th className="py-3 px-4">Unit ID</th>
                        <th className="py-3 px-3">Urgensi</th>
                        <th className="py-3 px-4">Lokasi & Hub</th>
                        <th className="py-3 px-3">Waktu Offline</th>
                        <th className="py-3 px-4 min-w-[220px]">Indikasi Kendala</th>
                        <th className="py-3 px-4">Teknisi Penanggung Jawab</th>
                        <th className="py-3 px-4 text-right">Aksi Cepat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                      {filteredUnits.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-400 font-medium text-xs">
                            Tidak ada unit yang sesuai dengan kriteria filter.
                          </td>
                        </tr>
                      ) : (
                        filteredUnits.map((unit) => {
                          const isPinged = pingedUnits[unit.id]
                          const isEscalated = escalatedUnits[unit.id]

                          return (
                            <tr key={unit.id} className="hover:bg-slate-50/70 transition-colors">
                              {/* Unit ID */}
                              <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                                <div className="flex items-center gap-1.5">
                                  <Server className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{unit.id}</span>
                                </div>
                              </td>

                              {/* Urgensi */}
                              <td className="py-3 px-3 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                                    unit.severity === 'KRITIS'
                                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                                      : unit.severity === 'TINGGI'
                                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                                      : 'bg-slate-100 text-slate-700 border-slate-200'
                                  }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      unit.severity === 'KRITIS'
                                        ? 'bg-rose-500 animate-ping'
                                        : unit.severity === 'TINGGI'
                                        ? 'bg-amber-500'
                                        : 'bg-slate-400'
                                    }`}
                                  />
                                  {unit.severity}
                                </span>
                              </td>

                              {/* Lokasi & Hub */}
                              <td className="py-3 px-4 whitespace-nowrap">
                                <div className="font-bold text-slate-900 text-xs flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span>{unit.hub}</span>
                                </div>
                                <div className="text-[11px] text-slate-400">{unit.region}</div>
                              </td>

                              {/* Waktu Offline */}
                              <td className="py-3 px-3 whitespace-nowrap">
                                <span className="font-medium text-slate-600 text-[11px] flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                                  {unit.offlineSince}
                                </span>
                              </td>

                              {/* Indikasi Kendala */}
                              <td className="py-3 px-4">
                                <p className="text-slate-600 text-xs leading-relaxed max-w-xs">
                                  {unit.issue}
                                </p>
                              </td>

                              {/* Teknisi PJ */}
                              <td className="py-3 px-4 whitespace-nowrap">
                                <div className="font-bold text-slate-900 text-xs">{unit.technician}</div>
                                <div className="text-[11px] font-mono text-slate-500">{unit.techPhone}</div>
                              </td>

                              {/* Aksi Cepat */}
                              <td className="py-3 px-4 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* Ping Button */}
                                  <button
                                    type="button"
                                    onClick={() => handlePingUnit(unit.id)}
                                    className={`py-1.5 px-2.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                                      isPinged
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-2xs'
                                    }`}
                                    title="Kirim Ping detak jantung ke unit"
                                  >
                                    {isPinged ? isPinged : 'Ping'}
                                  </button>

                                  {/* Escalation WA Button */}
                                  <button
                                    type="button"
                                    onClick={() => handleEscalateUnit(unit.id, unit.technician)}
                                    className={`py-1.5 px-3 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs ${
                                      isEscalated
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                                    }`}
                                    title={`Kirim notifikasi otomatis ke WhatsApp ${unit.technician}`}
                                  >
                                    <MessageSquare className="w-3 h-3 text-emerald-400" />
                                    <span>{isEscalated ? isEscalated : 'Kirim WA'}</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer Summary */}
                <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Sistem pemantauan heartbeat aktif (Polling setiap 30 detik)
                  </span>
                  <span>Data sinkron dengan Pusat Pemantauan IoT Regional</span>
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
              {/* Radar Trend Summary */}
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

              {/* Ready to Publish Articles */}
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
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
