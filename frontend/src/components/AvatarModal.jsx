import React, { useRef, useState } from 'react'
import {
  X,
  Upload,
  RotateCcw,
  Sparkles,
  Check,
  Box,
  Layers,
  CheckCircle2
} from 'lucide-react'

export default function AvatarModal({
  agent,
  isOpen,
  onClose,
  onSelectAvatarType,
  onUpdateAgentModel
}) {
  const fileInputRef = useRef(null)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState(null)

  if (!isOpen || !agent) return null

  const agentColor = agent.color || '#38bdf8'
  const currentType = agent.avatar_type || (agent.custom_model_url ? 'custom' : 'default')

  const handleSelectPreset = async (type) => {
    if (onSelectAvatarType) {
      onSelectAvatarType(agent.id, type)
    }
    setStatusMessage({
      type: 'success',
      text: type === 'boxhead'
        ? 'Karakter BoxHead Chibi berhasil diaktifkan!'
        : 'Karakter Chibi Klasik berhasil diaktifkan!'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div
              className="w-3.5 h-3.5 rounded-full"
              style={{ backgroundColor: agentColor }}
            />
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                Pengaturan Avatar 3D
                <span className="text-xs font-bold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-full">
                  {agent.name}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Pilih opsi bentuk karakter atau unggah model kustom
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
          {/* Preset Character Selection Cards */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 block">
              Pilihan Karakter Bawaan (Built-in)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Option 1: Chibi Klasik */}
              <div
                onClick={() => handleSelectPreset('default')}
                className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  currentType === 'default'
                    ? 'border-emerald-500 bg-emerald-50/60 shadow-md ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    {/* Sphere Preview Graphic */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-slate-300 to-slate-100 border-2 border-white shadow-md flex items-center justify-center">
                      <div
                        className="w-7 h-7 rounded-full shadow-inner"
                        style={{ backgroundColor: agentColor }}
                      />
                    </div>
                    {currentType === 'default' && (
                      <span className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" />
                        Aktif
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 mb-1">
                    Chibi Klasik
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Avatar bola chibi original The Delegation dengan claymorphic finish.
                  </p>
                </div>

                <button
                  type="button"
                  className={`mt-4 py-1.5 px-3 text-xs font-bold rounded-xl transition-all ${
                    currentType === 'default'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {currentType === 'default' ? 'Sedang Dipakai' : 'Gunakan Karakter Ini'}
                </button>
              </div>

              {/* Option 2: BoxHead Chibi */}
              <div
                onClick={() => handleSelectPreset('boxhead')}
                className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  currentType === 'boxhead'
                    ? 'border-sky-500 bg-sky-50/60 shadow-md ring-2 ring-sky-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    {/* BoxHead Preview Graphic */}
                    <div className="w-12 h-12 rounded-2xl bg-[#94beea] border-2 border-white shadow-md flex items-center justify-center">
                      <div className="text-center font-black text-xs text-[#1e293b] select-none tracking-tighter">
                        (• ^ •)
                      </div>
                    </div>
                    {currentType === 'boxhead' ? (
                      <span className="flex items-center gap-1 text-[10px] font-extrabold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" />
                        Aktif
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        Baru
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 mb-1">
                    BoxHead Chibi
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Kepala kotak rounded-cube dengan mata bulat ekspresif & alis tegas.
                  </p>
                </div>

                <button
                  type="button"
                  className={`mt-4 py-1.5 px-3 text-xs font-bold rounded-xl transition-all ${
                    currentType === 'boxhead'
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {currentType === 'boxhead' ? 'Sedang Dipakai' : 'Gunakan Karakter Ini'}
                </button>
              </div>
            </div>
          </div>

          {/* Custom Model (.glb) Upload Section */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Box className="w-4 h-4 text-purple-600" />
                Upload Model 3D Sendiri (.glb)
              </span>
              {agent.custom_model_url && currentType === 'custom' && (
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                  Custom Aktif: {agent.custom_model_name || 'model.glb'}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mb-3">
              Unggah file 3D berformat .glb dari Blender, Sketchfab, atau Mixamo untuk karakter kustom.
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
                className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                {uploadLoading ? 'Memproses...' : 'Upload File .glb'}
              </button>

              <button
                type="button"
                onClick={handleResetDefault}
                disabled={uploadLoading || (currentType === 'default' && !agent.custom_model_url)}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 font-bold text-xs rounded-xl transition-all cursor-pointer ${
                  currentType !== 'default' || agent.custom_model_url
                    ? 'bg-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 border border-slate-300 text-slate-800 active:scale-[0.98]'
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
              className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in ${
                statusMessage.type === 'error'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{statusMessage.text}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-5 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  )
}
