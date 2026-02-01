import { MachineState } from '../types.ts'

interface Props {
  state: MachineState
  tankPercent: number   // 0-1
}

export default function TassimoMachine({ state, tankPercent }: Props) {
  // ── LED colour per state ───────────────────────────
  const ledColor =
    state === 'HEATING'           ? '#f39c12' :
    state === 'EXTRACTING'        ? '#27ae60' :
    state === 'PAUSED_LOW_WATER'  ? '#e67e22' :
    state === 'FINISHED'          ? '#27ae60' : '#556'

  const ledPulse = state === 'HEATING' || state === 'EXTRACTING'
  const dripping = state === 'EXTRACTING'

  // ── water window fill (max 60 px tall) ─────────────
  const winH = 60
  const fillH = tankPercent * winH
  const fillY = 148 - fillH   // bottom-aligned inside window

  return (
    <svg viewBox="0 0 220 260" width="220" height="260"
         style={{ display: 'block', margin: '0 auto', filter: 'drop-shadow(0 6px 14px rgba(0,0,0,.22))' }}>
      <defs>
        <linearGradient id="tBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#2c2c2c" />
          <stop offset="40%"  stopColor="#1a1a1a" />
          <stop offset="100%" stopColor="#111" />
        </linearGradient>
        <linearGradient id="tWater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#5dade2" />
          <stop offset="100%" stopColor="#2e86c1" />
        </linearGradient>
        <clipPath id="tWinClip">
          <rect x="18" y="88" width="38" height="60" rx="4" />
        </clipPath>
      </defs>

      {/* base */}
      <rect x="10" y="235" width="200" height="18" rx="6" fill="#222" />
      <rect x="14" y="232" width="192" height="8"  rx="4" fill="#333" />

      {/* main body */}
      <rect x="25" y="70" width="170" height="168" rx="12" fill="url(#tBody)" />

      {/* top lid */}
      <rect x="30" y="60" width="160" height="24" rx="10" fill="#222" />
      <rect x="34" y="78" width="152" height="3"  rx="1.5" fill="#333" />

      {/* ── water-level window ── */}
      <rect x="16" y="86" width="42" height="66" rx="6" fill="#0a3d5c" stroke="#333" strokeWidth="2" />
      <g clipPath="url(#tWinClip)">
        <rect x="18" y={fillY} width="38" height={fillH} fill="url(#tWater)"
              style={{ transition: 'y 0.3s ease, height 0.3s ease' }} />
        {tankPercent > 0.02 && (
          <ellipse cx="37" cy={fillY + 1} rx="16" ry="2.5" fill="rgba(255,255,255,.18)" />
        )}
      </g>
      <text x="37" y="164" textAnchor="middle" fontSize="7" fill="#aaa" fontFamily="monospace">TANK</text>

      {/* ── T-disc chamber ── */}
      <rect x="72" y="68" width="76" height="30" rx="8" fill="#1c1c1c" stroke="#444" strokeWidth="1" />
      <rect x="84" y="76" width="52" height="14" rx="4" fill="#2a2a2a" stroke="#555" strokeWidth="0.8" />
      <circle cx="110" cy="83" r="4" fill={state === 'IDLE' ? '#444' : '#8B4513'} />

      {/* ── status LED + glow ── */}
      <circle cx="168" cy="100" r="8" fill={ledColor} opacity="0.2"
              style={{ filter: 'blur(4px)' }} />
      <circle cx="168" cy="100" r="5" fill={ledColor} opacity={ledPulse ? undefined : 0.8}>
        {ledPulse && <animate attributeName="opacity" values="0.4;1;0.4" dur="1.2s" repeatCount="indefinite" />}
      </circle>

      {/* ── brand ── */}
      <text x="110" y="130" textAnchor="middle" fontSize="13" fontWeight="bold"
            fill="#c0392b" fontFamily="'Arial Black', sans-serif" letterSpacing="3">TASSIMO</text>
      <text x="110" y="142" textAnchor="middle" fontSize="6.5"
            fill="#666"    fontFamily="sans-serif"              letterSpacing="1.5">BY JACOBS</text>

      {/* ── brew spout ── */}
      <rect x="96"  y="195" width="28" height="16" rx="4" fill="#222" />
      <rect x="104" y="208" width="12" height="12" rx="3" fill="#1a1a1a" stroke="#444" strokeWidth="1" />

      {/* drip */}
      {dripping && (
        <>
          <line x1="110" y1="220" x2="110" y2="232"
                stroke="#6f4e37" strokeWidth="1.5" strokeLinecap="round">
            <animate attributeName="y2" values="220;236;220" dur="0.6s" repeatCount="indefinite" />
          </line>
          <circle cx="110" cy="234" r="1.8" fill="#6f4e37">
            <animate attributeName="opacity" values="0;1;0" dur="0.6s" repeatCount="indefinite" />
          </circle>
        </>
      )}

      {/* side grip */}
      {[155, 160, 165].map(y => (
        <rect key={y} x="192" y={y} width="6" height="3" rx="1" fill="#2a2a2a" />
      ))}
    </svg>
  )
}
