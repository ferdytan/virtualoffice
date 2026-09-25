import React, { useRef, useState } from 'react'
import {
  ArrowLeft,
  Upload,
  RotateCcw,
  Sparkles,
  Check,
  Box,
  Palette,
  CheckCircle2,
  AlertCircle,
  Activity,
  X
} from 'lucide-react'
import AgentCloseUpAvatar from './AgentCloseUpAvatar'

const PRESET_COLORS = [
  { name: 'Sky Blue', hex: '#38bdf8' },
  { name: 'Emerald Green', hex: '#10b981' },
  { name: 'Solid Red', hex: '#ef4444' },
  { name: 'Violet Purple', hex: '#8b5cf6' },
  { name: 'Amber Gold', hex: '#f59e0b' },
  { name: 'Cyan Neon', hex: '#06b6d4' },
  { name: 'Dark Slate', hex: '#1e293b' },
  { name: 'Magenta Pink', hex: '#ec4899' },
  { name: 'Lime Green', hex: '#84cc16' },
  { name: 'Royal Indigo', hex: '#4f46e5' }
]

export default function AgentAvatarSettingsView({
  agent,
  onSelectAvatarType,
  onUpdateAgentModel,
  onUpdateAgentColor,
  onUpdateAgentStatus,
  onBack,
  onClose
}) {
  const fileInputRef = useRef(null)
  const colorInputRef = useRef(null)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState(null)

  if (!agent) return null

  const rawStatus = (agent.status || (agent.id === 'nara' ? 'working' : 'available')).toLowerCase()
  const currentStatus = rawStatus === 'working' || rawStatus === 'sibuk' ? 'working' : rawStatus === 'not_available' || rawStatus === 'offline' ? 'not_available' : 'available'

  const handleStatusChange = (newStatus) => {
    if (onUpdateAgentStatus) {
      onUpdateAgentStatus(agent.id, newStatus)
    }
    const label = newStatus === 'working' ? 'Working' : newStatus === 'not_available' ? 'Not Available' : 'Available'
    setStatusMessage({
      type: 'success',
      text: `Status ${agent.name} diubah ke ${label}!`
    })
    setTimeout(() => setStatusMessage(null), 3000)
  }

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
    <div className="flex-1 flex flex-col h-full overflow-hidden animate-in fade-in duration-150">
      {/* Header with Back button */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 py-1.5 px-3 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition-all cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
          <span>Kembali ke Detail</span>
        </button>

        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-extrabold px-2 py-0.5 rounded text-white tracking-wide"
            style={{ backgroundColor: agentColor }}
          >
            {agent.name}
          </span>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              title="Tutup Panel"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Settings Content */}
      <div className="p-4 sm:p-5 space-y-4 flex-1 overflow-y-auto">
        {/* Agent Portrait Mini Card */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3">
          <AgentCloseUpAvatar agent={agent} size={50} showStatus={true} />
          <div className="min-w-0">
            <h3 className="text-sm font-black text-slate-900 truncate">
              Pengaturan Avatar 3D
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Kustomisasi tampilan & warna untuk <strong>{agent.name}</strong>
            </p>
          </div>
        </div>

        {/* SECTION 1: CUSTOM AGENT COLOR PALETTE */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-slate-700" />
              Pilihan Warna AI Agent
            </label>
            <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {agentColor.toUpperCase()}
            </span>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Warna otomatis teraplikasikan ke karakter 3D (kepala & badan), lingkaran lantai, dan avatar portrait.
          </p>

          {/* Preset Swatches + Custom Picker */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Preset Warna Bawaan:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {PRESET_COLORS.map((col) => {
                const isSelected = agentColor.toLowerCase() === col.hex.toLowerCase()
                return (
                  <button
                    key={col.hex}
                    type="button"
                    onClick={() => handleColorChange(col.hex)}
                    className={`relative rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0 border ${
                      isSelected
                        ? 'ring-2 ring-slate-900 ring-offset-2 scale-110 shadow-sm border-transparent'
                        : 'border-slate-200 hover:scale-105 hover:shadow-xs'
                    }`}
                    style={{ backgroundColor: col.hex, width: '34px', height: '34px' }}
                    title={`${col.name} (${col.hex})`}
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
                  className="h-[34px] px-3 rounded-xl border border-dashed border-slate-300 hover:border-slate-500 bg-white text-[11px] font-bold text-slate-700 flex items-center gap-1.5 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer shrink-0"
                  title="Pilih Warna Hex Bebas"
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                    style={{ backgroundColor: agentColor }}
                  />
                  <span>Warna Bebas</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION: AGENT AVAILABILITY STATUS */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-slate-700" />
              Status Ketersediaan Agent
            </label>
            <span
              className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase ${
                currentStatus === 'working'
                  ? 'bg-amber-100 text-amber-800'
                  : currentStatus === 'not_available'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {currentStatus === 'working' ? 'Working' : currentStatus === 'not_available' ? 'Not Available' : 'Available'}
            </span>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Status ini ditampilkan di sebelah kanan nama agent pada badge 3D dan kartu profil.
          </p>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'available', label: 'Available', dotColor: 'bg-emerald-500' },
              { id: 'working', label: 'Working', dotColor: 'bg-amber-500' },
              { id: 'not_available', label: 'Not Available', dotColor: 'bg-rose-500' }
            ].map((st) => {
              const isCurrent = currentStatus === st.id
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => handleStatusChange(st.id)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                    isCurrent
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${st.dotColor} ${st.id === 'working' ? 'animate-ping' : ''}`} />
                  <span className="truncate">{st.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* SECTION 2: BUILT-IN CHARACTER PRESETS */}
        <div className="space-y-2.5">
          <label className="text-xs font-black uppercase tracking-wider text-slate-800 block">
            Pilihan Bentuk Karakter Bawaan
          </label>

          <div className="space-y-2.5">
            {/* Option 1: Chibi Klasik */}
            <div
              onClick={() => handleSelectPreset('default')}
              className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                currentType === 'default'
                  ? 'border-slate-900 bg-slate-50/90 shadow-2xs ring-1 ring-slate-900/10'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-200 to-white border border-slate-200 flex items-center justify-center shrink-0">
                  <div className="w-5 h-5 rounded-full" style={{ backgroundColor: agentColor }} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">Chibi Klasik</h4>
                  <p className="text-[10px] text-slate-500 leading-tight">Avatar bola original The Delegation.</p>
                </div>
              </div>

              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg ${
                currentType === 'default'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {currentType === 'default' ? 'Aktif' : 'Gunakan'}
              </span>
            </div>

            {/* Option 2: BoxHead Chibi */}
            <div
              onClick={() => handleSelectPreset('boxhead')}
              className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                currentType === 'boxhead'
                  ? 'border-slate-900 bg-slate-50/90 shadow-2xs ring-1 ring-slate-900/10'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl border border-white shadow-2xs flex items-center justify-center shrink-0 text-white font-bold text-[10px]"
                  style={{ backgroundColor: agentColor }}
                >
                  (• ^ •)
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-black text-slate-900">BoxHead Chibi</h4>
                    <span className="text-[8px] font-extrabold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">Baru</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">Kepala kubus berpenutup leher mulus.</p>
                </div>
              </div>

              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg ${
                currentType === 'boxhead'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {currentType === 'boxhead' ? 'Aktif' : 'Gunakan'}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 3: CUSTOM 3D MODEL (.GLB) UPLOAD */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5 text-slate-700" />
              Upload Model 3D Sendiri (.glb)
            </span>
            {agent.custom_model_url && currentType === 'custom' && (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                Custom Aktif
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Unggah file 3D berformat .glb dari Blender atau Sketchfab untuk menggantikan model karakter.
          </p>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleModelUpload}
            accept=".glb,.gltf"
            className="hidden"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadLoading}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5" />
              {uploadLoading ? 'Memproses...' : 'Upload File .glb'}
            </button>

            <button
              type="button"
              onClick={handleResetDefault}
              disabled={uploadLoading || (currentType === 'default' && !agent.custom_model_url)}
              className={`flex items-center justify-center gap-1 py-2 px-3 font-bold text-xs rounded-xl transition-all cursor-pointer ${
                currentType !== 'default' || agent.custom_model_url
                  ? 'bg-white hover:bg-red-50 hover:text-red-600 border border-slate-300 text-slate-700 shadow-2xs'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              }`}
              title="Reset kembali ke Chibi Klasik"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>

        {/* Status Message Toast */}
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

      {/* Prominent Bottom Action: Save & Return to Agent Detail */}
      <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between shrink-0">
        <span className="text-[11px] text-slate-400 font-medium">
          Tersimpan otomatis
        </span>
        <button
          type="button"
          onClick={onBack}
          className="py-2 px-5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm"
        >
          Simpan & Kembali ke Detail
        </button>
      </div>
    </div>
  )
}
