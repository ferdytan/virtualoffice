import React, { useRef, useState } from 'react'
import {
  X,
  Upload,
  RotateCcw,
  Sparkles,
  Check,
  Box,
  Palette,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

// Curated modern color swatches
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

export default function AvatarModal({
  agent,
  isOpen,
  onClose,
  onSelectAvatarType,
  onUpdateAgentModel,
  onUpdateAgentColor
}) {
  const fileInputRef = useRef(null)
  const colorInputRef = useRef(null)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState(null)

  if (!isOpen || !agent) return null

  const agentColor = agent.color || '#38bdf8'
  const currentType = agent.avatar_type || (agent.custom_model_url ? 'custom' : 'default')

  const handleSelectPreset = (type) => {
    if (onSelectAvatarType) {
      onSelectAvatarType(agent.id, type)
    }
    setStatusMessage({
      type: 'success',
      text: type === 'boxhead'
        ? 'Karakter BoxHead Chibi aktif!'
        : 'Karakter Chibi Klasik aktif!'
    })
    setTimeout(() => setStatusMessage(null), 3000)
  }

  const handleColorChange = (hex) => {
    if (!hex) return
    if (onUpdateAgentColor) {
      onUpdateAgentColor(agent.id, hex)
    }
    setStatusMessage({
      type: 'success',
      text: `Warna tema ${agent.name} diubah ke ${hex.toUpperCase()}!`
    })
    setTimeout(() => setStatusMessage(null), 3000)
  }

  const handleModelUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const filename = file.name.toLowerCase()
    if (!filename.endsWith('.glb') && !filename.endsWith('.gltf')) {
      setStatusMessage({ type: 'error', text: 'Format tidak didukung. Harap pilih file .glb atau .gltf' })
      setTimeout(() => setStatusMessage(null), 3500)
      return
    }

    setUploadLoading(true)
    setStatusMessage({ type: 'info', text: 'Menerapkan model 3D...' })

    // Instant local preview
    const localBlobUrl = URL.createObjectURL(file)
    if (onUpdateAgentModel) {
      onUpdateAgentModel(agent.id, localBlobUrl, file.name)
    }

    // Persist to backend
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch(`/api/agents/${agent.id}/model`, {
        method: 'POST',
        body: formData
      })
      if (res.ok) {
        const data = await res.json()
        if (onUpdateAgentModel) {
          onUpdateAgentModel(agent.id, data.custom_model_url, data.custom_model_name)
        }
        setStatusMessage({ type: 'success', text: `Model ${file.name} berhasil diterapkan!` })
      } else {
        setStatusMessage({ type: 'success', text: `Model ${file.name} aktif di sesi ini.` })
      }
    } catch (err) {
      setStatusMessage({ type: 'success', text: `Model ${file.name} aktif di sesi ini.` })
    } finally {
      setUploadLoading(false)
      setTimeout(() => setStatusMessage(null), 4000)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleResetDefault = async () => {
    setUploadLoading(true)
    try {
      await fetch(`/api/agents/${agent.id}/model`, { method: 'DELETE' })
    } catch (e) {
      // ignore
    }
    if (onUpdateAgentModel) {
      onUpdateAgentModel(agent.id, null, null)
    }
    if (onSelectAvatarType) {
      onSelectAvatarType(agent.id, 'default')
    }
    setUploadLoading(false)
    setStatusMessage({ type: 'success', text: 'Avatar dikembalikan ke Chibi Klasik default!' })
    setTimeout(() => setStatusMessage(null), 3000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Balanced Top Header with Generous Breathing Room */}
        <div className="px-7 sm:px-8 py-5.5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3.5">
            <div
              className="w-4.5 h-4.5 rounded-full shadow-xs shrink-0 transition-colors duration-200"
              style={{ backgroundColor: agentColor }}
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Pengaturan Avatar & Karakter
                </h3>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/80">
                  {agent.name}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Kustomisasi warna tema, pilihan bentuk 3D, atau unggah model file .glb
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body with Balanced Symmetrical Padding */}
        <div className="p-7 sm:p-8 space-y-6 max-h-[72vh] overflow-y-auto">
          {/* SECTION 1: CUSTOM AGENT COLOR PALETTE */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Palette className="w-4 h-4 text-slate-700" />
                Pilihan Warna Tema AI Agent
              </label>
              <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-50 px-2.5 py-0.5 rounded-lg border border-slate-200">
                {agentColor.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Warna identitas diaplikasikan ke karakter 3D (kepala & badan), lingkaran lantai, avatar portrait, dan badge.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {PRESET_COLORS.map((col) => {
                const isSelected = agentColor.toLowerCase() === col.hex.toLowerCase()
                return (
                  <button
                    key={col.hex}
                    type="button"
                    onClick={() => handleColorChange(col.hex)}
                    className={`relative w-8.5 h-8.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center ${
                      isSelected
                        ? 'ring-2 ring-slate-900 ring-offset-2 scale-110 shadow-sm'
                        : 'hover:scale-105 hover:shadow-md'
                    }`}
                    style={{ backgroundColor: col.hex }}
                    title={col.name}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white drop-shadow" />}
                  </button>
                )
              })}

              {/* Custom Color Input Picker */}
              <div className="relative">
                <input
                  type="color"
                  ref={colorInputRef}
                  value={agentColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="sr-only"
                />
                <button
                  type="button"
                  onClick={() => colorInputRef.current?.click()}
                  className="h-8.5 px-3 rounded-xl border border-dashed border-slate-300 hover:border-slate-500 bg-white text-xs font-bold text-slate-700 flex items-center gap-2 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
                  title="Pilih Warna Hex Bebas"
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-2xs"
                    style={{ backgroundColor: agentColor }}
                  />
                  <span>Warna Bebas</span>
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 2: BUILT-IN CHARACTER PRESETS */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-slate-800 mb-3 block">
              Pilihan Bentuk Karakter Bawaan
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: Chibi Klasik */}
              <div
                onClick={() => handleSelectPreset('default')}
                className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  currentType === 'default'
                    ? 'border-slate-900 bg-slate-50/80 shadow-md ring-2 ring-slate-900/10'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    {/* Sphere Preview Graphic */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-slate-200 to-white border-2 border-white shadow-md flex items-center justify-center">
                      <div
                        className="w-7 h-7 rounded-full shadow-inner transition-colors duration-200"
                        style={{ backgroundColor: agentColor }}
                      />
                    </div>
                    {currentType === 'default' && (
                      <span className="flex items-center gap-1 text-[10px] font-extrabold text-slate-900 bg-slate-200/80 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3 text-slate-900" />
                        Aktif
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-black text-slate-900 mb-1">
                    Chibi Klasik
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Bentuk bola chibi original The Delegation dengan claymorphic finish mengkilap.
                  </p>
                </div>

                <button
                  type="button"
                  className={`mt-4 py-2 px-3 text-xs font-bold rounded-xl transition-all ${
                    currentType === 'default'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {currentType === 'default' ? 'Sedang Dipakai' : 'Gunakan Karakter Ini'}
                </button>
              </div>

              {/* Option 2: BoxHead Chibi */}
              <div
                onClick={() => handleSelectPreset('boxhead')}
                className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  currentType === 'boxhead'
                    ? 'border-slate-900 bg-slate-50/80 shadow-md ring-2 ring-slate-900/10'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    {/* BoxHead Preview Graphic */}
                    <div
                      className="w-12 h-12 rounded-2xl border-2 border-white shadow-md flex items-center justify-center transition-colors duration-200"
                      style={{ backgroundColor: agentColor }}
                    >
                      <div className="text-center font-black text-xs text-white drop-shadow select-none tracking-tighter">
                        (• ^ •)
                      </div>
                    </div>
                    {currentType === 'boxhead' ? (
                      <span className="flex items-center gap-1 text-[10px] font-extrabold text-slate-900 bg-slate-200/80 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3 text-slate-900" />
                        Aktif
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        Baru
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-black text-slate-900 mb-1">
                    BoxHead Chibi
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Kepala kubus berpenutup leher mulus, mata bulat ekspresif, warna kepala & badan serasi.
                  </p>
                </div>

                <button
                  type="button"
                  className={`mt-4 py-2 px-3 text-xs font-bold rounded-xl transition-all ${
                    currentType === 'boxhead'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {currentType === 'boxhead' ? 'Sedang Dipakai' : 'Gunakan Karakter Ini'}
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 3: CUSTOM 3D MODEL (.GLB) UPLOAD */}
          <div className="p-5 bg-slate-50/70 rounded-2xl border border-slate-200/90">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <Box className="w-4 h-4 text-slate-700" />
                Upload Model 3D Kustom Sendiri (.glb)
              </span>
              {agent.custom_model_url && currentType === 'custom' && (
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-900 text-white shadow-2xs">
                  Model Aktif: {agent.custom_model_name || 'model.glb'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Unggah file 3D berformat .glb dari Blender, Sketchfab, atau Mixamo untuk menggantikan karakter agent.
            </p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleModelUpload}
              accept=".glb,.gltf"
              className="hidden"
            />
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadLoading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                {uploadLoading ? 'Memproses...' : 'Upload File .glb'}
              </button>

              <button
                type="button"
                onClick={handleResetDefault}
                disabled={uploadLoading || (currentType === 'default' && !agent.custom_model_url)}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3.5 font-bold text-xs rounded-xl transition-all cursor-pointer ${
                  currentType !== 'default' || agent.custom_model_url
                    ? 'bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 border border-slate-300 text-slate-700 active:scale-[0.98] shadow-2xs'
                    : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                }`}
                title="Reset kembali ke Chibi Klasik"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Default
              </button>
            </div>
          </div>

          {/* Feedback status message */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in ${
                statusMessage.type === 'error'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              {statusMessage.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}
        </div>

        {/* Balanced Bottom Footer */}
        <div className="px-7 sm:px-8 py-4.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400 font-medium">
            Perubahan otomatis tersimpan ke sistem
          </span>
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-6 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  )
}
