import React, { useState } from 'react'
import {
  X,
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
  Zap,
  Radio,
  WifiOff,
  BellRing,
  ExternalLink,
  Target,
  DollarSign,
  Users,
  Copy,
  Check
} from 'lucide-react'

export default function AgentDashboardModal({
  agent,
  isOpen,
  onClose,
  onDelegateBrief
}) {
  const [copiedId, setCopiedId] = useState(null)

  // Default active tabs per agent
  const [velociaTab, setVelociaTab] = useState('september_plan')
  const [naraTab, setNaraTab] = useState('offline_units')
  const [scoutTab, setScoutTab] = useState('articles')

  // Notification simulation state for Nara
  const [pingedUnits, setPingedUnits] = useState({})
  const [escalatedUnits, setEscalatedUnits] = useState({})

  if (!isOpen || !agent) return null

  const agentColor = agent.color || '#38bdf8'
  const agentId = agent.id.toLowerCase()

  const copyToClipboard = (text, id) => {
    navigator.clipboard?.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // --- VELOCIA MARKETING PLANS DATA ---
  const VELOCIA_PLANS = {
    september_plan: {
      id: 'september_plan',
      title: '30 Day Plan Marketing September',
      badge: 'SEDANG BERJALAN',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      period: '1 September — 30 September 2026',
      budget: 'Rp 145.000.000',
      targetKPI: '2.500 Sign-ups / 180 B2B Enterprise Leads',
      objective: 'Akselerasi akuisisi pengguna awal untuk platform Virtual Office 3D melalui strategi funnel multi-channel dan demo interaktif.',
      weeklyMilestones: [
        {
          week: 'Minggu 1 (1 - 7 Sept)',
          title: 'Brand Awareness & Influencer Teaser Sprint',
          items: [
            'Rilis video teaser berdurasi 45 detik: "Ruang Kerja Masa Depan Telah Tiba" di LinkedIn & X.',
            'Kemitraan dengan 5 tech influencer untuk unboxing demo 3D Virtual Office.',
            'Optimalisasi SEO halaman pendaftaran dan setup Google Ads Search Campaign.'
          ],
          status: 'Selesai'
        },
        {
          week: 'Minggu 2 (8 - 14 Sept)',
          title: 'Peluncuran Interaktif & Webinar Eksklusif',
          items: [
            'Webinar Live Demo: "Mendelegasikan Tugas ke 3 AI Agent Otonom dalam 5 Menit".',
            'Program Referral Karyawan: Dapatkan akses gratis 3 bulan untuk setiap tim yang diajak.',
            'Distribusi siaran pers ke portal berita teknologi terkemuka.'
          ],
          status: 'Selesai'
        },
        {
          week: 'Minggu 3 (15 - 21 Sept)',
          title: 'Retargeting Funnel & Mid-Month Conversion Push',
          items: [
            'Retargeting pengunjung demo yang belum mendaftar dengan studi kasus efisiensi kerja tim.',
            'Email blast seri edukasi: Cara kerja Nara, Velocia, dan Scout dalam menghemat 30 jam kerja/minggu.',
            'A/B testing 3 headline utama landing page untuk meningkatkan conversion rate dari 3.2% ke 4.8%.'
          ],
          status: 'Berlangsung'
        },
        {
          week: 'Minggu 4 (22 - 30 Sept)',
          title: 'Showcase Testimonial & Review Kuartal',
          items: [
            'Publikasi studi kasus keberhasilan klien pilot enterprise sektor fintech.',
            'Evaluasi biaya akuisisi (CAC) per channel dan realokasi sisa anggaran ke channel berkinerja tertinggi.',
            'Finalisasi materi promosi menyambut kuartal IV (Q4).'
          ],
          status: 'Akan Datang'
        }
      ],
      channels: [
        { name: 'LinkedIn Ads & Organic', share: '40%', budget: 'Rp 58.000.000' },
        { name: 'Google Ads & Performance Max', share: '30%', budget: 'Rp 43.500.000' },
        { name: 'Kemitraan & Influencer Tech', share: '20%', budget: 'Rp 29.000.000' },
        { name: 'Email & Retargeting Funnel', share: '10%', budget: 'Rp 14.500.000' }
      ]
    },
    pameran_oktober: {
      id: 'pameran_oktober',
      title: 'Program Pameran Oktober',
      badge: 'TERENCANA / LOGISTIK',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
      period: '12 — 15 Oktober 2026',
      budget: 'Rp 220.000.000',
      targetKPI: '400+ Qualified Enterprise Leads / 25 Closed Pilot Deals',
      objective: 'Menjadi sorotan utama di Tech Expo Indonesia 2026 dengan booth experiential 3D interaktif yang memungkinkan pengunjung berinteraksi langsung dengan AI Agent.',
      weeklyMilestones: [
        {
          week: 'Fase Persiapan (1 - 10 Okt)',
          title: 'Pembangunan Booth & Rigging Hardware Interaktif',
          items: [
            'Pemasangan layar LED cembung 3x2m untuk menampilkan ruang kerja Virtual Office 3D secara 1:1 skala nyata.',
            'Setup 4 unit terminal demo bagi pengunjung untuk mencoba briefing ke Nara, Velocia, dan Scout.',
            'Pencetakan QR badge VIP dan materi brosur eksklusif hard-cover.'
          ],
          status: 'Persiapan'
        },
        {
          week: 'Fase Eksekusi (12 - 15 Okt)',
          title: 'Hari Pameran & Sesi Keynote Panggung Utama',
          items: [
            'Sesi Keynote panggung utama: "Arsitektur Multi-Agent 3D: Memangkas Silo Komunikasi Perusahaan".',
            'Live voice briefing interaktif di booth: Memanggil agen dan melihat respon seketika di monitor 3D.',
            'VIP Networking Dinner bersama 30 CTO & VP of Technology pada malam ke-2.'
          ],
          status: 'Terjadwal'
        },
        {
          week: 'Fase Follow-up (16 - 25 Okt)',
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
        { name: 'Sewa Lahan Booth & Konstruksi', share: '50%', budget: 'Rp 110.000.000' },
        { name: 'Hardware Audio-Visual & LED 3D', share: '25%', budget: 'Rp 55.000.000' },
        { name: 'VIP Dinner & Hospitality', share: '15%', budget: 'Rp 33.000.000' },
        { name: 'Merchandise & Collateral', share: '10%', budget: 'Rp 22.000.000' }
      ]
    },
    collab_oktober: {
      id: 'collab_oktober',
      title: 'Plan Collab Oktober',
      badge: 'NEGOSIASI / MOU',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      period: '1 Oktober — 31 Oktober 2026',
      budget: 'Rp 85.000.000',
      targetKPI: '3 Kemitraan Strategis / 50.000 Cross-Audience Reach',
      objective: 'Membangun aliansi strategis dengan penyedia SaaS enterprise dan produsen hardware spatial untuk co-marketing dan bundling produk.',
      weeklyMilestones: [
        {
          week: 'Kolaborasi 1: Hardware Partner',
          title: 'Bundling Display & Spatial Controller',
          items: [
            'Kerjasama dengan produsen monitor ultra-wide: Demo Virtual Office dipasang pre-installed di display showroom resmi.',
            'Diskon bundling: Pembelian layar workstation mendapatkan lisensi 6 bulan Virtual Office AI.'
          ],
          status: 'MOU Draft'
        },
        {
          week: 'Kolaborasi 2: Enterprise Cloud Provider',
          title: 'Co-Branded Webinar & Marketplace Listing',
          items: [
            'Listing Virtual Office AI di marketplace cloud terkemuka.',
            'Pelaksanaan seri webinar kolaboratif: "Automated CS & Task Management di Era AI Spatial".'
          ],
          status: 'Finalisasi'
        },
        {
          week: 'Kolaborasi 3: Komunitas Developer & Startup Hub',
          title: 'Hackathon & Workshop Spatial Office',
          items: [
            'Sponsor utama workshop virtual office di inkubator startup regional.',
            'Penyediaan API key uji coba bagi 100 startup peserta program inkubasi.'
          ],
          status: 'Konfirmasi'
        }
      ],
      channels: [
        { name: 'Co-Branded Events & Workshop', share: '45%', budget: 'Rp 38.250.000' },
        { name: 'Marketing Collateral Bersama', share: '30%', budget: 'Rp 25.500.000' },
        { name: 'Legal & Integrasi Teknis MOU', share: '25%', budget: 'Rp 21.250.000' }
      ]
    },
    end_year_sale: {
      id: 'end_year_sale',
      title: 'Plan End Year Sale (Q4 Promo)',
      badge: 'PERSIAPAN AKHIR TAHUN',
      badgeColor: 'bg-red-100 text-red-800 border-red-200',
      period: '15 November — 31 Desember 2026',
      budget: 'Rp 190.000.000',
      targetKPI: 'Rp 1.25 Milyar Pendapatan Baru / 350 Langganan Tahunan Baru',
      objective: 'Memanfaatkan momen penutupan anggaran perusahaan akhir tahun dengan penawaran diskon lisensi tahunan bernilai tinggi dan insentif upgrade.',
      weeklyMilestones: [
        {
          week: 'Fase Teaser (15 - 24 Nov)',
          title: 'Kampanye "Early Bird 2027 Workspace"',
          items: [
            'Pemberitahuan awal kepada pengguna gratis dan freemium mengenai penawaran akhir tahun.',
            'Rilis kalkulator ROI online: Hitung berapa banyak biaya operasional yang dihemat dengan beralih ke paket tahunan.'
          ],
          status: 'Draft'
        },
        {
          week: 'Fase Black Friday & Cyber Week (25 Nov - 5 Des)',
          title: 'Flash Sale: Diskon 40% Paket Lisensi Tahunan Enterprise',
          items: [
            'Penawaran terbatas: Diskon 40% untuk komitmen tahunan paket tim 10+ kursi.',
            'Bonus gratis setup kustom 3D avatar & integrasi workflow internal perusahaan.',
            'Kampanye retargeting agresif di seluruh platform digital.'
          ],
          status: 'Draft'
        },
        {
          week: 'Fase Last Call Akhir Tahun (20 - 31 Des)',
          title: 'Hitung Mundur Akhir Tahun: "Gunakan Sisa Budget Q4"',
          items: [
            'Email blast berorientasi CFO/Finance: "Maksimalkan Sisa Alokasi Anggaran 2026 untuk Efisiensi 2027".',
            'Sistem invoice instan dengan tanggal pembukuan 2026 untuk memudahkan administrasi pajak klien.'
          ],
          status: 'Draft'
        }
      ],
      channels: [
        { name: 'Diskon Promosi & Subsider Kupon', share: '40%', budget: 'Rp 76.000.000' },
        { name: 'Kampanye Iklan Paid Retargeting', share: '35%', budget: 'Rp 66.500.000' },
        { name: 'Email Automation & Outbound Sales', share: '25%', budget: 'Rp 47.500.000' }
      ]
    }
  }

  // --- NARA OFFLINE UNIT TELEMETRY DATA ---
  const NARA_OFFLINE_UNITS = [
    {
      id: 'UNIT-JKT-402',
      location: 'Hub Kuningan, Jakarta Selatan',
      offlineSince: '18 menit lalu',
      severity: 'KRITIS',
      technician: 'Rian Pratama',
      techPhone: '+62 812-4455-8901',
      issue: 'Tegangan listrik suplai drop di bawah 180V, baterai UPS cadangan habis.',
      lastPing: '17:24 WIB',
      status: 'Menunggu Teknisi'
    },
    {
      id: 'UNIT-SBY-108',
      location: 'Gudang Logistik Rungkut, Surabaya',
      offlineSince: '42 menit lalu',
      severity: 'TINGGI',
      technician: 'Dimas Santoso',
      techPhone: '+62 813-8899-2311',
      issue: 'Koneksi jaringan 4G timeout berulang kali, potensi modul SIM card bermasalah.',
      lastPing: '17:00 WIB',
      status: 'Eskalasi Terkirim'
    },
    {
      id: 'UNIT-BDG-214',
      location: 'Outlet Dago, Bandung',
      offlineSince: '1 jam 12 menit lalu',
      severity: 'SEDANG',
      technician: 'Asep Supriatna',
      techPhone: '+62 856-7788-1290',
      issue: 'Sensor telemetri terputus setelah reboot otomatis berkala.',
      lastPing: '16:30 WIB',
      status: 'Teknisi di Jalan'
    },
    {
      id: 'UNIT-MDN-089',
      location: 'Pusat Distribusi Belawan, Medan',
      offlineSince: '2 jam 5 menit lalu',
      severity: 'TINGGI',
      technician: 'Budi Siregar',
      techPhone: '+62 821-3322-9900',
      issue: 'Kabel LAN utama terlepas saat pemeliharaan rak server lokal.',
      lastPing: '15:37 WIB',
      status: 'Perbaikan Berjalan'
    }
  ]

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
    setPingedUnits((prev) => ({ ...prev, [unitId]: 'Ping terkirim! (Latency 48ms)' }))
    setTimeout(() => {
      setPingedUnits((prev) => ({ ...prev, [unitId]: null }))
    }, 3500)
  }

  const handleEscalateUnit = (unitId, techName) => {
    setEscalatedUnits((prev) => ({ ...prev, [unitId]: `Notifikasi WA terkirim ke ${techName}!` }))
    setTimeout(() => {
      setEscalatedUnits((prev) => ({ ...prev, [unitId]: null }))
    }, 4000)
  }

  const handleDelegatePlan = (planTitle) => {
    if (onDelegateBrief) {
      onDelegateBrief(agent.id, `Tolong evaluasi dan siapkan eksekusi detail untuk: ${planTitle}`)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl h-[90vh] max-h-[820px] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- Top Modal Header --- */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: agentColor }}
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  {agent.name} Workspace Dashboard
                </h2>
                <span
                  className="text-[10px] font-extrabold px-2 py-0.5 rounded text-white tracking-wider uppercase"
                  style={{ backgroundColor: agentColor }}
                >
                  {agent.role_badge}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Spesifikasi & Rencana Kerja Otonom — {agent.role}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            title="Tutup Dashboard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* --- MAIN DASHBOARD CONTENT (Dynamic per agent) --- */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* ======================================================== */}
          {/* 1. VELOCIA DASHBOARD (MARKETING PLANS & CAMPAIGNS)       */}
          {/* ======================================================== */}
          {agentId === 'velocia' && (
            <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
              {/* Left Plan Navigation Sidebar */}
              <div className="w-full sm:w-72 bg-slate-50/90 border-r border-slate-200/80 p-4 shrink-0 flex flex-col gap-2 overflow-y-auto">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-2 mb-1">
                  Daftar Program & Rencana
                </span>

                {Object.values(VELOCIA_PLANS).map((plan) => {
                  const isActive = velociaTab === plan.id
                  return (
                    <button
                      key={plan.id}
                      onClick={() => setVelociaTab(plan.id)}
                      className={`p-3 rounded-2xl text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                        isActive
                          ? 'bg-white shadow-md border-2 border-red-500 ring-2 ring-red-500/10'
                          : 'bg-white/60 hover:bg-white border border-slate-200/80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-900 line-clamp-1">
                          {plan.title}
                        </span>
                      </div>
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border inline-block w-fit ${plan.badgeColor}`}>
                        {plan.badge}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {plan.period}
                      </span>
                    </button>
                  )
                })}

                <div className="mt-auto pt-4 border-t border-slate-200/60">
                  <div className="p-3 bg-red-50/80 rounded-2xl border border-red-100 text-xs text-red-900 leading-relaxed">
                    <span className="font-bold flex items-center gap-1 text-red-700 mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Strategist Note:
                    </span>
                    Klik tombol di bawah rencana untuk langsung mendelegasikan revisi atau eksekusi ke Velocia.
                  </div>
                </div>
              </div>

              {/* Right Plan Detail Viewer */}
              {VELOCIA_PLANS[velociaTab] && (
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Plan Header Card */}
                  <div className="p-6 bg-gradient-to-r from-red-500/10 via-slate-50 to-white rounded-3xl border border-red-200/60">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div>
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${VELOCIA_PLANS[velociaTab].badgeColor}`}>
                          {VELOCIA_PLANS[velociaTab].badge}
                        </span>
                        <h3 className="text-2xl font-black text-slate-900 mt-2">
                          {VELOCIA_PLANS[velociaTab].title}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          Periode Eksekusi: {VELOCIA_PLANS[velociaTab].period}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDelegatePlan(VELOCIA_PLANS[velociaTab].title)}
                        className="self-start sm:self-auto py-2.5 px-4 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Diskusikan di Chat Velocia
                      </button>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed bg-white/80 p-3.5 rounded-2xl border border-slate-200/80">
                      <strong>Fokus Utama:</strong> {VELOCIA_PLANS[velociaTab].objective}
                    </p>

                    {/* KPI & Budget Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      <div className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold shrink-0">
                          <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-400">Total Anggaran / Budget</span>
                          <p className="text-sm font-black text-slate-900">{VELOCIA_PLANS[velociaTab].budget}</p>
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                          <Target className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-400">Target Kinerja (KPI)</span>
                          <p className="text-sm font-black text-slate-900">{VELOCIA_PLANS[velociaTab].targetKPI}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Weekly Timeline Breakdown */}
                  <div>
                    <h4 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-red-600" />
                      Tahapan & Deliverables Mingguan
                    </h4>

                    <div className="space-y-3">
                      {VELOCIA_PLANS[velociaTab].weeklyMilestones.map((ms, idx) => (
                        <div key={idx} className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-black text-slate-800">
                              {ms.week}: {ms.title}
                            </span>
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                              ms.status === 'Selesai'
                                ? 'bg-emerald-100 text-emerald-700'
                                : ms.status === 'Berlangsung'
                                ? 'bg-amber-100 text-amber-700 animate-pulse'
                                : 'bg-slate-200 text-slate-600'
                            }`}>
                              {ms.status}
                            </span>
                          </div>
                          <ul className="space-y-1.5 text-xs text-slate-600">
                            {ms.items.map((item, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-red-500 font-bold shrink-0">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Channels & Budget Allocation */}
                  <div>
                    <h4 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-red-600" />
                      Alokasi Saluran Pemasaran (Channel Breakdown)
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {VELOCIA_PLANS[velociaTab].channels.map((ch, idx) => (
                        <div key={idx} className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-slate-900">{ch.name}</p>
                            <span className="text-[11px] text-slate-500">{ch.budget}</span>
                          </div>
                          <span className="text-xs font-black text-red-600 bg-red-50 px-2 py-1 rounded-xl">
                            {ch.share}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* 2. NARA DASHBOARD (OFFLINE UNIT CS TELEMETRY)            */}
          {/* ======================================================== */}
          {agentId === 'nara' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Telemetry Overview Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <div className="flex items-center justify-between text-emerald-700 mb-1">
                    <span className="text-[11px] font-bold uppercase">Online Uptime</span>
                    <Radio className="w-4 h-4" />
                  </div>
                  <p className="text-2xl font-black text-emerald-950">99.28%</p>
                  <span className="text-[10px] text-emerald-700">1.239 dari 1.248 Unit</span>
                </div>

                <div className="p-4 bg-red-50 rounded-2xl border border-red-200">
                  <div className="flex items-center justify-between text-red-700 mb-1">
                    <span className="text-[11px] font-bold uppercase">Unit Offline</span>
                    <WifiOff className="w-4 h-4" />
                  </div>
                  <p className="text-2xl font-black text-red-950">9 Unit</p>
                  <span className="text-[10px] text-red-700">Butuh penanganan cepat</span>
                </div>

                <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200">
                  <div className="flex items-center justify-between text-sky-700 mb-1">
                    <span className="text-[11px] font-bold uppercase">Rata-rata Respon</span>
                    <Clock className="w-4 h-4" />
                  </div>
                  <p className="text-2xl font-black text-sky-950">4.2 Menit</p>
                  <span className="text-[10px] text-sky-700">Target SLA &lt; 10 menit</span>
                </div>

                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200">
                  <div className="flex items-center justify-between text-purple-700 mb-1">
                    <span className="text-[11px] font-bold uppercase">Eskalasi Hari Ini</span>
                    <BellRing className="w-4 h-4" />
                  </div>
                  <p className="text-2xl font-black text-purple-950">28 Tiket</p>
                  <span className="text-[10px] text-purple-700">24 Berhasil diselesaikan</span>
                </div>
              </div>

              {/* Offline Unit Action Table */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    Daftar Unit Offline Membutuhkan Eskalasi Teknisi
                  </h4>
                  <span className="text-xs text-slate-500">Auto-refresh setiap 30 detik</span>
                </div>

                <div className="space-y-3">
                  {NARA_OFFLINE_UNITS.map((unit) => (
                    <div
                      key={unit.id}
                      className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900">{unit.id}</span>
                          <span className={`text-[9px] font-extrabold px-2 py-0.2 rounded-full ${
                            unit.severity === 'KRITIS'
                              ? 'bg-red-100 text-red-700'
                              : unit.severity === 'TINGGI'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {unit.severity}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            Offline: {unit.offlineSince}
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-slate-700">{unit.location}</p>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          <strong>Kendala:</strong> {unit.issue}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Teknisi Penanggung Jawab: <strong>{unit.technician}</strong> ({unit.techPhone})
                        </p>

                        {/* Interactive Status Messages */}
                        {pingedUnits[unit.id] && (
                          <p className="text-xs text-emerald-600 font-bold animate-in fade-in">
                            ✓ {pingedUnits[unit.id]}
                          </p>
                        )}
                        {escalatedUnits[unit.id] && (
                          <p className="text-xs text-sky-600 font-bold animate-in fade-in">
                            ✓ {escalatedUnits[unit.id]}
                          </p>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handlePingUnit(unit.id)}
                          className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
                        >
                          Ping Ulang
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEscalateUnit(unit.id, unit.technician)}
                          className="py-1.5 px-3 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Send className="w-3 h-3" />
                          Kirim Pengingat WA
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 3. SCOUT DASHBOARD (RESEARCH & ARTICLE LAB)              */}
          {/* ======================================================== */}
          {agentId === 'scout' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Radar Trend Summary */}
              <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200">
                <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  Top 3 AI Trends Terpantau Minggu Ini
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                  <div className="p-3 bg-white rounded-xl border border-emerald-100">
                    <p className="text-xs font-bold text-slate-900">Spatial Multi-Agent Web</p>
                    <span className="text-[11px] text-slate-500">Lonjakan diskusi +184% di kalangan enterprise CTO.</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-emerald-100">
                    <p className="text-xs font-bold text-slate-900">Voice-to-Action Automation</p>
                    <span className="text-[11px] text-slate-500">Adopsi briefing suara langsung ke task kanban.</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-emerald-100">
                    <p className="text-xs font-bold text-slate-900">Edge Telemetry IoT Sync</p>
                    <span className="text-[11px] text-slate-500">AI pemantau unit offline secara otomatis.</span>
                  </div>
                </div>
              </div>

              {/* Ready to Publish Articles */}
              <div>
                <h4 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  Draf Artikel & Blog Siap Rilis (Dibuat Otomatis oleh Scout)
                </h4>

                <div className="space-y-4">
                  {SCOUT_ARTICLES.map((art) => (
                    <div key={art.id} className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {art.category}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            {art.readTime} • SEO Score: <strong className="text-emerald-600">{art.seoScore}</strong>
                          </span>
                        </div>

                        <button
                          onClick={() => copyToClipboard(art.content, art.id)}
                          className="self-start sm:self-auto py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
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

                      <h3 className="text-base font-extrabold text-slate-900">
                        {art.title}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100 whitespace-pre-line font-serif">
                        {art.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- Bottom Modal Footer --- */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400 font-medium">
            Terhubung langsung dengan backend AI Agent otonom
          </span>
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm"
          >
            Tutup Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
