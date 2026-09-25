import React, { useState } from 'react'
import {
  ArrowLeft,
  Palette,
  Bot,
  Coffee,
  Check,
  RotateCcw,
  Sliders,
  Settings,
  Bell,
  Cpu,
  Volume2,
  Shield,
  Layers,
  Sparkles,
  Server,
  Radio,
  Clock,
  UserCheck
} from 'lucide-react'

export default function SettingsPageView({
  scenerySettings,
  onUpdateScenerySettings,
  agents = [],
  onUpdateAgentColor,
  onSelectAvatarType,
  onBackToOffice
}) {
  const [activeTab, setActiveTab] = useState('scenery') // 'scenery' | 'agents' | 'telemetry' | 'system'
  const [selectedAgentId, setSelectedAgentId] = useState(agents[0]?.id || 'nara')

  // Notification / audio dummy preferences
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [pingInterval, setPingInterval] = useState('30s')
  const [waAutoEscalate, setWaAutoEscalate] = useState(true)

  const isColorful = scenerySettings.theme === 'colorful'

  const handleToggleScenery = (key) => {
    onUpdateScenerySettings({
      ...scenerySettings,
      [key]: !scenerySettings[key]
    })
  }

  const handleSelectTheme = (theme) => {
    onUpdateScenerySettings({
      ...scenerySettings,
      theme
    })
  }

  const handleResetScenery = () => {
    onUpdateScenerySettings({
      theme: 'colorful',
      showNPC: true,
      showCoffeeCorner: true
    })
  }

  const currentAgent = agents.find((a) => a.id === selectedAgentId) || agents[0]

  const PRESET_COLORS = [
    { name: 'Sky Blue', hex: '#38bdf8' },
    { name: 'Emerald', hex: '#10b981' },
    { name: 'Violet', hex: '#8b5cf6' },
    { name: 'Coral Red', hex: '#ef4444' },
    { name: 'Amber Gold', hex: '#f59e0b' },
    { name: 'Cyan Neon', hex: '#06b6d4' },
    { name: 'Dark Slate', hex: '#1e293b' },
    { name: 'Magenta Pink', hex: '#ec4899' }
  ]

  return (
    <div className="h-screen w-full flex flex-col bg-slate-100 overflow-hidden select-none animate-in fade-in duration-150">
      {/* --- TOP SETTINGS NAVIGATION BAR --- */}
      <header className="h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          {/* Back to 3D Office Button */}
          <button
            onClick={onBackToOffice}
            className="flex items-center gap-1.5 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
            title="Kembali ke Ruang Kantor 3D"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
            <span>Kembali ke Ruang Kantor 3D</span>
          </button>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* Breadcrumb Title */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Virtual Office</span>
            <span>/</span>
            <span className="text-slate-900 font-extrabold flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-slate-700" />
              Pusat Pengaturan Sistem & Workspace
            </span>
          </div>
        </div>

        {/* Right Status Badge */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Pengaturan tersimpan otomatis</span>
        </div>
      </header>

      {/* --- SETTINGS BODY: LEFT SIDEBAR TABS / RIGHT CONTENT --- */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Category Navigation */}
        <aside className="w-64 lg:w-72 shrink-0 bg-white border-r border-slate-200 p-4.5 flex flex-col space-y-1.5 overflow-y-auto">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 block mb-1">
            Kategori Pengaturan
          </span>

          {/* Tab 1: Suasana & Visual 3D */}
          <button
            onClick={() => setActiveTab('scenery')}
            className={`w-full p-3 rounded-2xl text-left transition-all cursor-pointer flex items-center gap-3 ${
              activeTab === 'scenery'
                ? 'bg-slate-900 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:bg-slate-50 font-medium'
            }`}
          >
            <Palette className={`w-4 h-4 ${activeTab === 'scenery' ? 'text-amber-400' : 'text-slate-400'}`} />
            <div className="text-xs">
              <div className="font-bold">Suasana & Tema Ruang 3D</div>
              <div className={`text-[10px] ${activeTab === 'scenery' ? 'text-slate-300' : 'text-slate-400'}`}>
                Warna kantor, NPC, & mesin kopi
              </div>
            </div>
          </button>

          {/* Tab 2: Karakter & Avatar AI */}
          <button
            onClick={() => setActiveTab('agents')}
            className={`w-full p-3 rounded-2xl text-left transition-all cursor-pointer flex items-center gap-3 ${
              activeTab === 'agents'
                ? 'bg-slate-900 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:bg-slate-50 font-medium'
            }`}
          >
            <UserCheck className={`w-4 h-4 ${activeTab === 'agents' ? 'text-sky-400' : 'text-slate-400'}`} />
            <div className="text-xs">
              <div className="font-bold">Profil & Karakter AI</div>
              <div className={`text-[10px] ${activeTab === 'agents' ? 'text-slate-300' : 'text-slate-400'}`}>
                Warna tema & bentuk 3D agent
              </div>
            </div>
          </button>

          {/* Tab 3: Telemetri & Notifikasi */}
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`w-full p-3 rounded-2xl text-left transition-all cursor-pointer flex items-center gap-3 ${
              activeTab === 'telemetry'
                ? 'bg-slate-900 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:bg-slate-50 font-medium'
            }`}
          >
            <Radio className={`w-4 h-4 ${activeTab === 'telemetry' ? 'text-emerald-400' : 'text-slate-400'}`} />
            <div className="text-xs">
              <div className="font-bold">Telemetri & Notifikasi</div>
              <div className={`text-[10px] ${activeTab === 'telemetry' ? 'text-slate-300' : 'text-slate-400'}`}>
                Interval ping & eskalasi WA
              </div>
            </div>
          </button>

          {/* Tab 4: Sistem & Audio */}
          <button
            onClick={() => setActiveTab('system')}
            className={`w-full p-3 rounded-2xl text-left transition-all cursor-pointer flex items-center gap-3 ${
              activeTab === 'system'
                ? 'bg-slate-900 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:bg-slate-50 font-medium'
            }`}
          >
            <Cpu className={`w-4 h-4 ${activeTab === 'system' ? 'text-purple-400' : 'text-slate-400'}`} />
            <div className="text-xs">
              <div className="font-bold">Sistem & Audio</div>
              <div className={`text-[10px] ${activeTab === 'system' ? 'text-slate-300' : 'text-slate-400'}`}>
                Efek suara & integrasi API
              </div>
            </div>
          </button>
        </aside>

        {/* Right Main Content Panel */}
        <main className="flex-1 bg-slate-50/70 p-6 sm:p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* ======================================================== */}
            {/* TAB 1: SUASANA & TEMA RUANG 3D                           */}
            {/* ======================================================== */}
            {activeTab === 'scenery' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                  <div>
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Palette className="w-5 h-5 text-slate-700" />
                      Pilihan Tema Suasana Ruang Kerja 3D
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Pilih gaya estetika perabotan dan pencahayaan yang diterapkan pada ruang kantor virtual Anda.
                    </p>
                  </div>

                  {/* Theme Option Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {/* Option A: Ruang Berwarna (Vibrant Modern) */}
                    <div
                      onClick={() => handleSelectTheme('colorful')}
                      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        isColorful
                          ? 'border-slate-900 bg-amber-50/30 shadow-md ring-2 ring-slate-900/10'
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-2xl">🎨</span>
                          {isColorful && (
                            <span className="flex items-center gap-1 text-[10px] font-extrabold text-slate-900 bg-slate-200/80 px-2.5 py-0.5 rounded-full">
                              <Check className="w-3 h-3 text-slate-900" />
                              Sedang Digunakan
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-black text-slate-900 mb-1">
                          Ruang Berwarna (Vibrant Modern)
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Aksen kayu hangat (*warm oak & walnut*), bantalan kursi desainer warna-warni (*coral, mint, sky blue*), sofa cozy, dan tanaman hijau cerah.
                        </p>
                      </div>

                      <div className="mt-4 flex items-center gap-1.5 pt-2 border-t border-slate-100">
                        <span className="w-3.5 h-3.5 rounded-full bg-[#d4bf9c]" title="Scandinavian Oak" />
                        <span className="w-3.5 h-3.5 rounded-full bg-[#f87171]" title="Coral Cushion" />
                        <span className="w-3.5 h-3.5 rounded-full bg-[#34d399]" title="Mint Cushion" />
                        <span className="w-3.5 h-3.5 rounded-full bg-[#60a5fa]" title="Sky Cushion" />
                        <span className="w-3.5 h-3.5 rounded-full bg-[#d97706]" title="Warm Amber Sofa" />
                      </div>
                    </div>

                    {/* Option B: Minimalis Putih (Clean Scandinavian) */}
                    <div
                      onClick={() => handleSelectTheme('minimalist')}
                      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        !isColorful
                          ? 'border-slate-900 bg-slate-50 shadow-md ring-2 ring-slate-900/10'
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-2xl">⚪</span>
                          {!isColorful && (
                            <span className="flex items-center gap-1 text-[10px] font-extrabold text-slate-900 bg-slate-200/80 px-2.5 py-0.5 rounded-full">
                              <Check className="w-3 h-3 text-slate-900" />
                              Sedang Digunakan
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-black text-slate-900 mb-1">
                          Minimalis Putih (Clean Scandinavian)
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Tampilan monokrom serba putih dan abu-abu slate bersih seperti setup bawaan orisinil The Delegation.
                        </p>
                      </div>

                      <div className="mt-4 flex items-center gap-1.5 pt-2 border-t border-slate-100">
                        <span className="w-3.5 h-3.5 rounded-full bg-[#f8fafc] border border-slate-300" />
                        <span className="w-3.5 h-3.5 rounded-full bg-[#e2e8f0]" />
                        <span className="w-3.5 h-3.5 rounded-full bg-[#94a3b8]" />
                        <span className="w-3.5 h-3.5 rounded-full bg-[#475569]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Decorative & Interactive Elements */}
                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Elemen Interaktif & Aksesoris Tambahan
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Aktifkan atau nonaktifkan elemen hidup di dalam ruang kantor 3D.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    {/* Toggle: NPC Cleaning Robot */}
                    <div
                      onClick={() => handleToggleScenery('showNPC')}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100/70 transition-colors"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="p-2.5 rounded-xl bg-sky-100 text-sky-700">
                          <Bot className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-900">
                            NPC Cleaning Robot & Office Boy (CleanBot-01)
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Robot otonom berpatroli mengitari koridor kantor, mengepel lantai, dan membawa cangkir kopi tim.
                          </p>
                        </div>
                      </div>

                      <div
                        className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 shrink-0 ${
                          scenerySettings.showNPC ? 'bg-slate-900' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                            scenerySettings.showNPC ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Toggle: Coffee Machine */}
                    <div
                      onClick={() => handleToggleScenery('showCoffeeCorner')}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100/70 transition-colors"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="p-2.5 rounded-xl bg-orange-100 text-orange-700">
                          <Coffee className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-900">
                            Mesin Kopi Espresso & Lounge Bar
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Mesin espresso 3D di meja pantry dengan uap panas naik dan cangkir keramik interaktif.
                          </p>
                        </div>
                      </div>

                      <div
                        className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 shrink-0 ${
                          scenerySettings.showCoffeeCorner ? 'bg-slate-900' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                            scenerySettings.showCoffeeCorner ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleResetScenery}
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Kembalikan ke Default Ruang Berwarna</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 2: PROFIL & KARAKTER AI AGENT                        */}
            {/* ======================================================== */}
            {activeTab === 'agents' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-5">
                  <div>
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-slate-700" />
                      Kustomisasi Identitas & Bentuk 3D AI Agent
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Pilih agen untuk mengatur warna tema primer dan model karakter bawaan.
                    </p>
                  </div>

                  {/* Agent Selector Pills */}
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                    {agents.map((ag) => {
                      const isSel = ag.id === selectedAgentId
                      return (
                        <button
                          key={ag.id}
                          onClick={() => setSelectedAgentId(ag.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                            isSel
                              ? 'bg-slate-900 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ag.color }} />
                          {ag.name}
                        </button>
                      )
                    })}
                  </div>

                  {/* Current Agent Config Card */}
                  {currentAgent && (
                    <div className="space-y-5">
                      {/* Color Palette Picker */}
                      <div>
                        <label className="text-xs font-black uppercase tracking-wider text-slate-800 mb-2.5 block">
                          Warna Identitas Utama ({currentAgent.name})
                        </label>
                        <div className="flex flex-wrap items-center gap-3">
                          {PRESET_COLORS.map((col) => {
                            const isCur = currentAgent.color?.toLowerCase() === col.hex.toLowerCase()
                            return (
                              <button
                                key={col.hex}
                                type="button"
                                onClick={() => onUpdateAgentColor?.(currentAgent.id, col.hex)}
                                className={`relative w-9 h-9 rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center ${
                                  isCur ? 'ring-2 ring-slate-900 ring-offset-2 scale-110 shadow-sm' : 'hover:scale-105'
                                }`}
                                style={{ backgroundColor: col.hex }}
                                title={col.name}
                              >
                                {isCur && <Check className="w-4 h-4 text-white drop-shadow" />}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Character Preset Switcher */}
                      <div>
                        <label className="text-xs font-black uppercase tracking-wider text-slate-800 mb-2.5 block">
                          Bentuk Karakter 3D
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {/* Chibi Klasik */}
                          <div
                            onClick={() => onSelectAvatarType?.(currentAgent.id, 'default')}
                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                              currentAgent.avatar_type === 'default'
                                ? 'border-slate-900 bg-slate-50'
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <h4 className="text-xs font-black text-slate-900 mb-0.5">Chibi Klasik</h4>
                            <p className="text-[11px] text-slate-500">Avatar bulat orisinil The Delegation.</p>
                          </div>

                          {/* BoxHead Chibi */}
                          <div
                            onClick={() => onSelectAvatarType?.(currentAgent.id, 'boxhead')}
                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                              currentAgent.avatar_type === 'boxhead'
                                ? 'border-slate-900 bg-slate-50'
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <h4 className="text-xs font-black text-slate-900 mb-0.5">BoxHead Chibi</h4>
                            <p className="text-[11px] text-slate-500">Kepala kotak kubus dengan penutup leher mulus.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 3: TELEMETRI & NOTIFIKASI                            */}
            {/* ======================================================== */}
            {activeTab === 'telemetry' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-5">
                  <div>
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Radio className="w-5 h-5 text-slate-700" />
                      Konfigurasi Telemetri Unit & Eskalasi Otomatis
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Atur frekuensi pemantauan detak unit IoT regional dan saluran peringatan teknisi.
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    {/* Ping Interval Selector */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-slate-900">Frekuensi Heartbeat Audit</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Interval otomatis Nara memeriksa status online 1.248 unit regional.</p>
                      </div>

                      <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
                        {['15s', '30s', '60s', '5m'].map((intvl) => (
                          <button
                            key={intvl}
                            onClick={() => setPingInterval(intvl)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                              pingInterval === intvl ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {intvl}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Auto Escalation Toggle */}
                    <div
                      onClick={() => setWaAutoEscalate(!waAutoEscalate)}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100/70 transition-colors"
                    >
                      <div>
                        <h4 className="text-xs font-black text-slate-900">Eskalasi Otomatis WhatsApp ke Teknisi PJ</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Kirim pesan WhatsApp otomatis ketika unit mengalami downtime lebih dari 15 menit.</p>
                      </div>

                      <div
                        className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 shrink-0 ${
                          waAutoEscalate ? 'bg-slate-900' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                            waAutoEscalate ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 4: SISTEM & AUDIO                                    */}
            {/* ======================================================== */}
            {activeTab === 'system' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-5">
                  <div>
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-slate-700" />
                      Preferensi Sistem, Audio, & Integrasi API
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Pengaturan audio interaktif dan status arsitektur multi-agent CrewAI.
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    {/* Audio Toggle */}
                    <div
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100/70 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                          <Volume2 className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-900">Efek Suara Interaktif Ruang Kantor</h4>
                          <p className="text-xs text-slate-500 mt-0.5">Suara atmosfer kerja 3D, seduh mesin kopi, dan klik perabotan.</p>
                        </div>
                      </div>

                      <div
                        className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 shrink-0 ${
                          soundEnabled ? 'bg-slate-900' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                            soundEnabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Server Info Card */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-slate-200 text-slate-800">
                          <Server className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-900">Backend Multi-Agent API</h4>
                          <p className="text-xs text-slate-500 mt-0.5">FastAPI Server v1.0.0 • CrewAI Engine Integration</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                        Online (Port 8000)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
