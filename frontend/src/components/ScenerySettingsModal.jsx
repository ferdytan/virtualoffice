import React from 'react'
import {
  X,
  Palette,
  Bot,
  Coffee,
  Check,
  Sparkles,
  Sliders,
  RotateCcw
} from 'lucide-react'

export default function ScenerySettingsModal({
  isOpen,
  onClose,
  scenerySettings,
  onUpdateScenerySettings
}) {
  if (!isOpen) return null

  const isColorful = scenerySettings.theme === 'colorful'

  const handleToggle = (key) => {
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

  const handleReset = () => {
    onUpdateScenerySettings({
      theme: 'colorful',
      showNPC: true,
      showCoffeeCorner: true
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-900 text-white shadow-xs">
              <Sliders className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Pengaturan Visual Ruang Kantor (3D Scenery)
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Pilih gaya suasana warna ruang kerja, pencahayaan lampu, & elemen dekoratif
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* SECTION 1: THEME SELECTOR */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-slate-800 mb-2.5 block flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-slate-700" />
              Pilihan Suasana Workspace (Scenery Mode)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option A: Ruang Berwarna (Vibrant Modern) */}
              <div
                onClick={() => handleSelectTheme('colorful')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isColorful
                    ? 'border-slate-900 bg-amber-50/30 shadow-md ring-2 ring-slate-900/10'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">🎨</span>
                    {isColorful && (
                      <span className="flex items-center gap-1 text-[10px] font-extrabold text-slate-900 bg-slate-200/80 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3 text-slate-900" />
                        Aktif
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-black text-slate-900 mb-1">
                    Ruang Berwarna (Vibrant)
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Aksen kayu hangat, bantalan kursi warna-warni, tanaman hijau cerah, dan sofa cozy bernuansa modern.
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-1">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#dfcaa0]" title="Kayu Oak" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#f87171]" title="Coral" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#34d399]" title="Mint" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#60a5fa]" title="Sky" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#f59e0b]" title="Amber" />
                </div>
              </div>

              {/* Option B: Minimalis Putih (Clean Scandinavian) */}
              <div
                onClick={() => handleSelectTheme('minimalist')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  !isColorful
                    ? 'border-slate-900 bg-slate-50 shadow-md ring-2 ring-slate-900/10'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">⚪</span>
                    {!isColorful && (
                      <span className="flex items-center gap-1 text-[10px] font-extrabold text-slate-900 bg-slate-200/80 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3 text-slate-900" />
                        Aktif
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-black text-slate-900 mb-1">
                    Minimalis Putih (Clean White)
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Tampilan monokrom Scandinavian serba putih dan slate bersih seperti setup default orisinil.
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-1">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#f8fafc] border border-slate-300" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#e2e8f0]" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#94a3b8]" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#475569]" />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: INTERACTIVE 3D FEATURE TOGGLES */}
          <div className="space-y-2.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-800 block">
              Elemen Interaktif & Aksesoris Tambahan
            </label>

            {/* Toggle 1: NPC Cleaning & Delivery Robot */}
            <div
              onClick={() => handleToggle('showNPC')}
              className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90 flex items-center justify-between cursor-pointer hover:bg-slate-100/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">
                    NPC Cleaning Robot & Office Boy (CleanBot-01)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Robot pintar berputar patroli keliling kantor, mengepel lantai & mengantar kopi
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <div
                className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 cursor-pointer ${
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

            {/* Toggle 3: Coffee Machine Espresso Bar */}
            <div
              onClick={() => handleToggle('showCoffeeCorner')}
              className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90 flex items-center justify-between cursor-pointer hover:bg-slate-100/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-orange-100 text-orange-700">
                  <Coffee className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">
                    Mesin Kopi Espresso & Lounge Bar
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Mesin espresso 3D lengkap dengan uap panas naik, cangkir keramik, & sirup
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <div
                className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 cursor-pointer ${
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
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Bawaan</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="py-2 px-5 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm"
          >
            Terapkan & Selesai
          </button>
        </div>
      </div>
    </div>
  )
}
