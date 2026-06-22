import type { ReportData } from '../types'

interface VerdictStampProps {
  verdict: ReportData['verdict']
}

const cfg = {
  LEGIT:      { color: '#4CAF7D', bg: 'rgba(76,175,125,0.1)',  border: 'rgba(76,175,125,0.4)',  label: 'Legitimate' },
  SUSPICIOUS: { color: '#E8934A', bg: 'rgba(232,147,74,0.1)', border: 'rgba(232,147,74,0.4)', label: 'Suspicious' },
  SCAM:       { color: '#E05252', bg: 'rgba(224,82,82,0.1)',  border: 'rgba(224,82,82,0.4)',  label: 'Scam' },
}

export default function VerdictStamp({ verdict }: VerdictStampProps) {
  const c = cfg[verdict]
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '28px 0 8px' }}>
      <div
        className="anim-stamp"
        style={{
          display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          padding: '16px 34px',
          border: `2px solid ${c.border}`,
          borderRadius: 12,
          background: c.bg,
          transform: 'rotate(-3deg)',
          boxShadow: `0 0 32px ${c.color}22`,
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Scan-line texture */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, ${c.color}06 3px, ${c.color}06 4px)`,
        }} />
        <span style={{
          fontFamily: 'var(--font-ui)', fontWeight: 600,
          fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase',
          color: c.color, opacity: 0.6,
        }}>
          Our Verdict
        </span>
        <span style={{
          fontFamily: 'var(--font-cursive)', fontStyle: 'italic',
          fontSize: '2.2rem', fontWeight: 500, color: c.color, lineHeight: 1,
        }}>
          {c.label}
        </span>

      </div>
    </div>
  )
}
