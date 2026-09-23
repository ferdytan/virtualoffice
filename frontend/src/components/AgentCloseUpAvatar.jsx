import React from 'react'

/**
 * AgentCloseUpAvatar Component
 * Authentic close-up vector portrait styled after The Delegation avatar design,
 * with prominent large framing, cute expressive eyes, accessories, and glowing aura.
 */
export default function AgentCloseUpAvatar({
  agent,
  size = 56,
  showStatus = true,
  onClick
}) {
  const color = agent?.color || '#ef4444'
  const agentId = agent?.id?.toLowerCase() || 'velocia'

  return (
    <div
      onClick={onClick}
      className={`relative group shrink-0 select-none ${
        onClick ? 'cursor-pointer hover:scale-105 active:scale-95 transition-transform' : ''
      }`}
      style={{ width: size, height: size }}
      title={`${agent?.name || 'Agent'} - Klik untuk ganti agen`}
    >
      {/* Outer Glow Halo */}
      <div
        className="absolute -inset-1 rounded-2xl opacity-25 group-hover:opacity-50 blur-sm transition-opacity"
        style={{ backgroundColor: color }}
      />

      {/* Main Avatar Container */}
      <div
        className="relative w-full h-full rounded-2xl overflow-hidden shadow-md border-2 border-white/90 flex items-center justify-center bg-gradient-to-b from-slate-100 to-slate-200"
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1"
        >
          {/* Head & Body Silhouette */}
          <path
            d="M13.413 42.836C14.7834 41.4602 17.3208 40.1197 18.4421 39.7145C14.8072 38.8639 11.8674 37.1984 9.71449 34.8929C9.61358 35.1631 9.29098 35.39 8.80456 35.0549C8.16714 34.6159 5.64255 31.4751 5.27253 30.4281C4.97652 29.5906 5.75532 28.7845 6.1814 28.5031C5.73637 26.9009 5.50803 25.1711 5.50803 23.3359C5.50803 13.2265 13.7932 5.03125 24.3453 5.03125C34.8975 5.03125 42.7117 13.2265 42.7117 23.3359C42.7117 25.1711 42.4845 26.9009 42.0439 28.5031C42.4669 28.779 43.4468 29.6357 43.1529 30.4567C42.7856 31.483 40.279 34.5619 39.6461 34.9923C39.1632 35.3207 38.7771 35.0317 38.6769 34.7668C36.5532 37.1377 33.6393 38.8485 30.0505 39.7145C31.4969 40.1873 32.8575 41.3501 33.9322 42.3632C34.4757 42.8756 35.4908 44.0744 36.2869 45.0312H11.4284C11.8432 44.6035 12.4375 43.8154 13.413 42.836Z"
            fill={color}
          />

          {/* Chin / Neck subtle shadow */}
          <path
            d="M13.203 42.9595C14.5811 41.661 17.0838 40.4615 18.2115 40.079C21.8385 41.0193 27.9515 40.6965 30.1871 40.0312C31.6418 40.4775 32.7581 41.557 33.839 42.5132C34.3856 42.9968 35.4064 44.1282 36.207 45.0312H11.207C11.6243 44.6275 12.2219 43.8838 13.203 42.9595Z"
            fill="black"
            fillOpacity="0.12"
          />

          {/* Large Expressive Eyes (Outer dark socket) */}
          <circle cx="17.14" cy="28.51" r="4.2" fill="#1e293b" />
          <circle cx="32.92" cy="28.51" r="4.2" fill="#1e293b" />

          {/* White Eye Highlights (Upper Right Specular Dots) */}
          <circle cx="18.5" cy="27.0" r="1.5" fill="white" />
          <circle cx="34.2" cy="27.0" r="1.5" fill="white" />

          {/* Cute Smile Mouth */}
          <path
            d="M20.5 34.5C22.2 36.3 27.8 36.3 29.5 34.5"
            stroke="#1e293b"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Blushing Cheeks */}
          <circle cx="12.5" cy="32.5" r="2.2" fill="white" fillOpacity="0.35" />
          <circle cx="37.5" cy="32.5" r="2.2" fill="white" fillOpacity="0.35" />

          {/* Head Accessory: Cap for Scout, Headphones for Velocia & Nara */}
          {agentId === 'scout' ? (
            /* Green Cap / Visor */
            <g>
              <path
                d="M13 10C16 6 22 5 25 5C31 5 36 7 38 11C41 12 43 17 41 21C38 23 30 18 25 18C20 18 12 23 9 21C7 17 9 12 13 10Z"
                fill="#15803d"
              />
              <path
                d="M9 21C16 17 34 17 41 21C38 23 30 20 25 20C20 20 12 23 9 21Z"
                fill="#166534"
              />
            </g>
          ) : (
            /* High-tech Headset / Headphones */
            <g>
              {/* Left Earcup */}
              <rect x="2.5" y="24" width="4.5" height="9" rx="2.2" fill="#0f172a" />
              {/* Right Earcup */}
              <rect x="41" y="24" width="4.5" height="9" rx="2.2" fill="#0f172a" />
              {/* Headband Arch */}
              <path
                d="M5 25C5 12 14 3 24 3C34 3 43 12 43 25"
                stroke="#0f172a"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              {/* Small Mic Boom */}
              <path
                d="M5 30C5 36 12 39 16 39"
                stroke="#0f172a"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <circle cx="16" cy="39" r="1.5" fill={color} />
            </g>
          )}
        </svg>
      </div>

      {/* Online Status Dot */}
      {showStatus && (
        <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white shadow-xs"></span>
        </span>
      )}
    </div>
  )
}
