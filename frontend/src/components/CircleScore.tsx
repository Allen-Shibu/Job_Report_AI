import { useEffect, useState } from 'react'

interface CircleScoreProps {
  score: number
  size?: number
}

function scoreColor(s: number) {
  if (s >= 70) return '#4CAF7D'
  if (s >= 40) return '#E8934A'
  return '#E05252'
}

export default function CircleScore({ score, size = 180 }: CircleScoreProps) {
  const [animated, setAnimated] = useState(0)
  const radius = (size - 20) / 2
  const circ = 2 * Math.PI * radius
  const clamped = Math.min(100, Math.max(0, score))
  const color = scoreColor(clamped)
  const offset = circ - (animated / 100) * circ

  useEffect(() => {
    const t = setTimeout(() => setAnimated(clamped), 80)
    return () => clearTimeout(t)
  }, [clamped])

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke="var(--clr-surface-hi)"
          strokeWidth={10}
        />
        {/* Fill */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(.22,1,.36,1)' }}
        />
      </svg>

      {/* Center label */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 0,
      }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 400,
          fontSize: size * 0.28,
          color: 'var(--clr-text)',
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}>
          {clamped}
        </span>
        <span style={{
          fontFamily: 'var(--font-ui)',
          fontSize: size * 0.09,
          color: 'var(--clr-dim)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginTop: 4,
        }}>
          / 100
        </span>
      </div>
    </div>
  )
}
