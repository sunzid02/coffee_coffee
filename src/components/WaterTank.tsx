import { TANK_MAX } from '../types.ts'

interface Props {
  tankPercent: number   // 0-1
}

export default function WaterTank({ tankPercent }: Props) {
  const MAX_H = 110
  const fillH = tankPercent * MAX_H
  const fillY = 30 + MAX_H - fillH   // bottom-aligned

  return (
    <svg viewBox="0 0 100 170" width="80" height="136" style={{ display: 'block', margin: '0 auto' }}>
      <defs>
        <linearGradient id="wtBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#d6e8f0" />
          <stop offset="50%"  stopColor="#eaf5f9" />
          <stop offset="100%" stopColor="#c5dfe8" />
        </linearGradient>
        <linearGradient id="wtWater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#5dade2" />
          <stop offset="100%" stopColor="#2e86c1" />
        </linearGradient>
        <clipPath id="wtClip">
          <rect x="12" y="30" width="76" height={MAX_H} rx="4" />
        </clipPath>
      </defs>

      {/* cap */}
      <rect x="20" y="18" width="60" height="16" rx="6" fill="#b0c4d0" stroke="#8fa8b8" strokeWidth="1" />
      <rect x="30" y="20" width="40" height="4"  rx="2" fill="#95b0c0" />

      {/* body */}
      <rect x="10" y="28" width="80" height={MAX_H + 8} rx="8"
            fill="url(#wtBody)" stroke="#9bb8c8" strokeWidth="1.5" />

      {/* water */}
      <g clipPath="url(#wtClip)">
        <rect x="12" y={fillY} width="76" height={fillH} fill="url(#wtWater)"
              style={{ transition: 'y 0.3s ease, height 0.3s ease' }} />
        {tankPercent > 0.04 && (
          <ellipse cx="50" cy={fillY + 2} rx="34" ry="3" fill="rgba(255,255,255,.2)" />
        )}
      </g>

      {/* level marks */}
      {([0.25, 0.5, 0.75] as const).map(pct => {
        const ly = 30 + MAX_H - pct * MAX_H
        return (
          <g key={pct}>
            <line x1="10" y1={ly} x2="22" y2={ly} stroke="#8fa8b8" strokeWidth="0.8" />
            <text x="24" y={ly + 2.5} fontSize="6" fill="#7a9aaa" fontFamily="monospace">
              {Math.round(pct * TANK_MAX)}
            </text>
          </g>
        )
      })}

      {/* base */}
      <rect x="14" y={30 + MAX_H + 4} width="72" height="6" rx="3" fill="#9bb8c8" />

      {/* label */}
      <text x="50" y={30 + MAX_H + 22} textAnchor="middle"
            fontSize="7.5" fill="#6a8898" fontFamily="monospace" fontWeight="500">WATER</text>
    </svg>
  )
}
