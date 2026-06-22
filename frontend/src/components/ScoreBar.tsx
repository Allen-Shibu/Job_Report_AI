interface ScoreBarProps {
  label: string
  score: number
  explanation?: string
  large?: boolean
}

function cls(score: number) {
  if (score >= 70) return 'score-high'
  if (score >= 40) return 'score-mid'
  return 'score-low'
}
function color(score: number) {
  if (score >= 70) return '#4CAF7D'
  if (score >= 40) return '#E8934A'
  return '#E05252'
}

export default function ScoreBar({ label, score, explanation, large = false }: ScoreBarProps) {
  const clamped = Math.min(100, Math.max(0, score))
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{
          fontFamily: 'var(--font-ui)', fontWeight: 500,
          fontSize: large ? '0.85rem' : '0.76rem',
          color: 'var(--clr-muted)',
        }}>
          {label}
        </span>
        <span style={{
          fontFamily: 'var(--font-ui)', fontWeight: 700,
          fontSize: large ? '1.1rem' : '0.9rem',
          color: color(clamped),
        }}>
          {clamped}
          <span style={{ fontSize: '0.65rem', fontWeight: 400, color: 'var(--clr-dim)' }}>/100</span>
        </span>
      </div>
      <div className="score-bar-track" style={{ height: large ? 8 : 6 }}>
        <div className={`score-bar-fill ${cls(clamped)}`} style={{ width: `${clamped}%` }} />
      </div>
      {explanation && (
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '0.8rem',
          color: 'var(--clr-dim)', lineHeight: 1.55, margin: 0,
        }}>
          {explanation}
        </p>
      )}
    </div>
  )
}
