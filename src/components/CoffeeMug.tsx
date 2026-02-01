interface Props {
  fillPercent: number   // 0-100
  finished: boolean
}

export default function CoffeeMug({ fillPercent, finished }: Props) {
  // mug geometry
  const MX = 28, MY = 42, MW = 104, MH = 110
  const PAD = 8
  const innerMaxH = MH - PAD - 16          // usable interior height
  const fillH    = (fillPercent / 100) * innerMaxH
  const fillY    = MY + MH - 16 - fillH    // bottom-up

  return (
    <svg viewBox="0 0 160 160" width="140" height="140" style={{ display: 'block', margin: '0 auto' }}>
      <defs>
        <linearGradient id="mugBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#e8e0d5" />
          <stop offset="50%"  stopColor="#f5f0eb" />
          <stop offset="100%" stopColor="#d4ccc0" />
        </linearGradient>
        <linearGradient id="coffeeGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={finished ? '#4a2610' : '#6f4e37'} />
          <stop offset="100%" stopColor={finished ? '#3e1f0e' : '#5c3317'} />
        </linearGradient>
        <clipPath id="mugClip">
          <rect x={MX + PAD} y={MY + PAD} width={MW - PAD * 2} height={innerMaxH} />
        </clipPath>
      </defs>

      {/* shadow */}
      <ellipse cx="80" cy="152" rx="48" ry="5" fill="rgba(0,0,0,.1)" />

      {/* body */}
      <rect x={MX} y={MY} width={MW} height={MH} rx="10"
            fill="url(#mugBody)" stroke="#c9c0b5" strokeWidth="1.5" />

      {/* coffee fill */}
      <g clipPath="url(#mugClip)">
        <rect x={MX + PAD} y={fillY} width={MW - PAD * 2} height={fillH}
              fill="url(#coffeeGrad)"
              style={{ transition: 'y 0.25s linear, height 0.25s linear' }} />
        {fillPercent > 2 && (
          <ellipse cx={MX + MW / 2} cy={fillY + 2}
                   rx={MW / 2 - PAD - 2} ry="3"
                   fill="rgba(255,255,255,.12)" />
        )}
      </g>

      {/* rim */}
      <rect x={MX} y={MY} width={MW} height="14" rx="10"
            fill="#eae3da" stroke="#c9c0b5" strokeWidth="1" />
      <rect x={MX + 4} y={MY + 4} width={MW - 8} height="4" rx="2" fill="#ddd5c8" />

      {/* handle */}
      <path d={`M ${MX+MW} ${MY+28} Q ${MX+MW+30} ${MY+28} ${MX+MW+28} ${MY+68} Q ${MX+MW+26} ${MY+88} ${MX+MW} ${MY+88}`}
            fill="none" stroke="#d4ccc0" strokeWidth="11" strokeLinecap="round" />
      <path d={`M ${MX+MW} ${MY+28} Q ${MX+MW+30} ${MY+28} ${MX+MW+28} ${MY+68} Q ${MX+MW+26} ${MY+88} ${MX+MW} ${MY+88}`}
            fill="none" stroke="url(#mugBody)" strokeWidth="7" strokeLinecap="round" />

      {/* steam when finished */}
      {finished && (
        <g opacity="0.5">
          {[68, 80, 72].map((x, i) => (
            <path key={i}
                  d={`M ${x} ${MY-4} Q ${x+4} ${MY-14} ${x} ${MY-24} Q ${x-4} ${MY-34} ${x} ${MY-44}`}
                  fill="none" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round">
              <animate attributeName="opacity" values="0;0.6;0"
                       dur={`${1.2 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.4}s`} />
              <animate attributeName="d"
                       values={`M ${x} ${MY-4} Q ${x+4} ${MY-14} ${x} ${MY-24} Q ${x-4} ${MY-34} ${x} ${MY-44};M ${x} ${MY-10} Q ${x+4} ${MY-20} ${x} ${MY-30} Q ${x-4} ${MY-40} ${x} ${MY-50};M ${x} ${MY-4} Q ${x+4} ${MY-14} ${x} ${MY-24} Q ${x-4} ${MY-34} ${x} ${MY-44}`}
                       dur={`${1.2 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.4}s`} />
            </path>
          ))}
        </g>
      )}
    </svg>
  )
}
