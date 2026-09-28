import React from 'react'
import { Plus, Minus } from 'lucide-react'

/**
 * Authentic Google Maps Compass Needle Icon (SVG)
 * Matches the Google Maps UI:
 * - Circular dark disc
 * - North pointer: Red triangular needle with bevel highlight
 * - South pointer: White/silver triangular needle
 * - Side orbital curved navigation arrows
 */
export function GoogleMapsCompassIcon({ className = 'w-5 h-5', is3D = false }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer circular dark background */}
      <circle cx="16" cy="16" r="15" fill="#202124" />
      <circle cx="16" cy="16" r="14.5" stroke="#3c4043" strokeWidth="1" />

      {/* Curved rotation orbital arrows (left & right) */}
      <path
        d="M 6.5 12.5 A 10.5 10.5 0 0 1 11.5 6.8"
        stroke="#9aa0a6"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <polygon points="5.8,13 8.8,11.8 7.2,15" fill="#9aa0a6" />

      <path
        d="M 25.5 19.5 A 10.5 10.5 0 0 1 20.5 25.2"
        stroke="#9aa0a6"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <polygon points="26.2,19 23.2,20.2 24.8,17" fill="#9aa0a6" />

      {/* Needle Group (with perspective transform when in 3D mode) */}
      <g transform={is3D ? 'matrix(1 0 0 0.84 0 2.5)' : undefined}>
        {/* North Needle - Vivid Red with bevel shadow */}
        <polygon points="16,5.2 19.8,16 16,14.4" fill="#ea4335" />
        <polygon points="16,5.2 12.2,16 16,14.4" fill="#c5221f" />

        {/* South Needle - Crisp White / Silver with shadow */}
        <polygon points="16,26.8 19.8,16 16,17.6" fill="#ffffff" />
        <polygon points="16,26.8 12.2,16 16,17.6" fill="#dadce0" />

        {/* Center pivot pin */}
        <circle cx="16" cy="16" r="1.6" fill="#202124" />
      </g>
    </svg>
  )
}

/**
 * Google Maps Floating Map Controls (Right Side of Canvas)
 * Matches Image 2:
 * 1. Compass button (resets orientation to North)
 * 2. 3D / 2D toggle button
 * 3. Zoom In (+) & Zoom Out (-) stack
 */
export function GoogleMapsFloatingWidget({
  cameraViewMode = 'isometric',
  onToggleViewMode,
  onResetCamera,
  onZoomIn,
  onZoomOut
}) {
  const isTopDown = cameraViewMode === 'top_down'

  return (
    <div className="fixed right-5 bottom-24 z-20 flex flex-col items-center gap-2 select-none pointer-events-auto">
      {/* 1. Compass Button (Google Maps Style) */}
      <button
        type="button"
        onClick={onResetCamera}
        className="w-10 h-10 rounded-full bg-[#202124]/95 hover:bg-[#303134] active:scale-95 text-white shadow-xl border border-white/10 flex items-center justify-center transition-all cursor-pointer group"
        title="Hadap Utara / Reset Orientasi Kamera (North Up)"
      >
        <GoogleMapsCompassIcon className="w-8 h-8 group-hover:scale-105 transition-transform" is3D={!isTopDown} />
      </button>

      {/* 2. 3D / 2D Toggle Button (Google Maps Style) */}
      <button
        type="button"
        onClick={onToggleViewMode}
        className="w-10 h-9 rounded-xl bg-[#202124]/95 hover:bg-[#303134] active:scale-95 text-white shadow-xl border border-white/10 flex items-center justify-center transition-all cursor-pointer font-black text-xs tracking-wider"
        title={isTopDown ? 'Beralih ke Perspektif 3D (Isometrik)' : 'Beralih ke Tampilan 2D (Tampak Atas)'}
      >
        <span className={isTopDown ? 'text-sky-400 font-extrabold' : 'text-white font-extrabold'}>
          {isTopDown ? '3D' : '2D'}
        </span>
      </button>

      {/* 3. Zoom Controls (+ / -) */}
      <div className="flex flex-col bg-[#202124]/95 rounded-xl shadow-xl border border-white/10 overflow-hidden divide-y divide-white/10">
        <button
          type="button"
          onClick={onZoomIn}
          className="w-10 h-9 hover:bg-[#303134] active:bg-[#3c4043] text-white flex items-center justify-center transition-colors cursor-pointer"
          title="Zoom In (Perbesar)"
        >
          <Plus className="w-4 h-4 text-slate-200" />
        </button>
        <button
          type="button"
          onClick={onZoomOut}
          className="w-10 h-9 hover:bg-[#303134] active:bg-[#3c4043] text-white flex items-center justify-center transition-colors cursor-pointer"
          title="Zoom Out (Perkecil)"
        >
          <Minus className="w-4 h-4 text-slate-200" />
        </button>
      </div>
    </div>
  )
}
