import {
  Building, DollarSign, Users, TrendingUp,
  Shield, Star, AlertTriangle, Globe, Briefcase,
} from 'lucide-react'
import type { ReportData } from '../types'
import CircleScore from './CircleScore'
import SectionCard from './SectionCard'
import VerdictStamp from './VerdictStamp'

interface ReportViewProps { report: ReportData }

/* ── Inline score bar for categories ──────────────────────────── */
function CategoryBar({ label, score }: { label: string; score: number }) {
  const clamped = Math.min(100, Math.max(0, score))
  const color = clamped >= 70 ? '#4CAF7D' : clamped >= 40 ? '#E8934A' : '#E05252'
  const cls   = clamped >= 70 ? 'score-high' : clamped >= 40 ? 'score-mid' : 'score-low'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{
          fontFamily: 'var(--font-ui)', fontSize: '0.74rem', fontWeight: 500,
          color: 'var(--clr-muted)', letterSpacing: '0.01em',
        }}>
          {label}
        </span>
        <span style={{
          fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, color,
        }}>
          {clamped}
        </span>
      </div>
      <div className="score-bar-track">
        <div className={`score-bar-fill ${cls}`} style={{ width: `${clamped}%` }} />
      </div>
    </div>
  )
}

/* ── Prose text ───────────────────────────────────────────────── */
function Prose({ text }: { text: string }) {
  if (!text) return (
    <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: '0.88rem', color: 'var(--clr-dim)' }}>
      No information available.
    </p>
  )

  // Render **bold** markdown inline
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return (
    <p style={{
      fontFamily: 'var(--font-body)', fontSize: '0.94rem',
      color: 'var(--clr-muted)', lineHeight: 1.88, whiteSpace: 'pre-line',
    }}>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**')
          ? <strong key={i} style={{ color: 'var(--clr-text)', fontWeight: 500 }}>{p.slice(2, -2)}</strong>
          : p
      )}
    </p>
  )
}

/* ── Main component ───────────────────────────────────────────── */
export default function ReportView({ report }: ReportViewProps) {
  return (
    <div className="anim-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Company name ── */}
      <div style={{ textAlign: 'center', paddingTop: 8, paddingBottom: 4 }}>
        <p style={{
          fontFamily: 'var(--font-cursive)', fontStyle: 'italic',
          fontSize: '0.88rem', color: 'var(--clr-muted)', marginBottom: 8,
        }}>
          Investigation Report
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 400,
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          color: 'var(--clr-text)', lineHeight: 1.1, letterSpacing: '-0.02em',
        }}>
          {report.company}
        </h1>
      </div>

      {/* ── Score + Verdict row ── */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      }}>
        <CircleScore score={report.overallScore} size={200} />
        <p style={{
          fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 500,
          color: 'var(--clr-muted)', textTransform: 'uppercase', letterSpacing: '0.1em',
        }}>
          Overall Score
        </p>
        <VerdictStamp verdict={report.verdict} />
      </div>

      {/* ── Category scores grid ── */}
      <div className="card">
        <p style={{
          fontFamily: 'var(--font-cursive)', fontStyle: 'italic',
          fontSize: '0.82rem', color: 'var(--clr-muted)', marginBottom: 18,
        }}>
          category breakdown
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '18px 28px',
        }}>
          {report.scorecard.map(m => (
            <CategoryBar key={m.label} label={m.label} score={m.score} />
          ))}
        </div>
      </div>

      {/* ── Red Flags ── */}
      {report.redFlags.length > 0 && (
        <SectionCard
          label="risk factors"
          title={`Red Flags (${report.redFlags.length})`}
          icon={<AlertTriangle size={16} />}
          defaultOpen
          accentColor="var(--clr-scam)"
        >
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, listStyle: 'none' }}>
            {report.redFlags.map((f, i) => (
              <li key={i} style={{ display: 'flex', gap: 10 }}>
                <span style={{ color: 'var(--clr-scam)', flexShrink: 0, marginTop: 2, fontSize: '0.8rem' }}>⚠</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', color: 'var(--clr-muted)', lineHeight: 1.65 }}>
                  {f}
                </span>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {/* ── Detail sections ── */}
      <SectionCard label="overview"          title="Company Overview"        icon={<Building size={16} />}   defaultOpen accentColor="var(--clr-amber)"><Prose text={report.overview} /></SectionCard>
      <SectionCard label="opportunity"       title="Applyability"            icon={<Briefcase size={16} />}  accentColor="#9C7FC0"><Prose text={report.applyability} /></SectionCard>
      <SectionCard label="compensation"      title="Salary & Benefits"       icon={<DollarSign size={16} />} accentColor="var(--clr-legit)"><Prose text={report.salary} /></SectionCard>
      <SectionCard label="people"            title="Employee Satisfaction"   icon={<Users size={16} />}      accentColor="#4A9EE8"><Prose text={report.employeeSatisfaction} /></SectionCard>
      <SectionCard label="environment"       title="Culture & Growth"        icon={<TrendingUp size={16} />} accentColor="#4ABFA8"><Prose text={report.culture} /></SectionCard>
      <SectionCard label="verification"      title="Legitimacy"              icon={<Shield size={16} />}     accentColor="var(--clr-suspicious)"><Prose text={report.legitimacy} /></SectionCard>
      <SectionCard label="public perception" title="Reputation"              icon={<Star size={16} />}       accentColor="#E06080"><Prose text={report.reputation} /></SectionCard>
      <SectionCard label="business health"   title="Financials"              icon={<Globe size={16} />}      accentColor="#4A9EE8"><Prose text={report.financials} /></SectionCard>

      {/* ── Raw report ── */}
      {report.rawReport && (
        <details style={{ marginTop: 4 }}>
          <summary style={{
            cursor: 'pointer', fontFamily: 'var(--font-ui)',
            fontSize: '0.76rem', color: 'var(--clr-dim)',
            userSelect: 'none', padding: '8px 0', listStyle: 'none',
          }}>
            ↓ View raw report
          </summary>
          <pre style={{
            marginTop: 10, padding: '16px 18px',
            background: 'var(--clr-surface)', borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-mono)', fontSize: '0.74rem',
            color: 'var(--clr-muted)', whiteSpace: 'pre-wrap',
            lineHeight: 1.65, border: '1px solid var(--clr-border)', overflowX: 'auto',
          }}>
            {report.rawReport}
          </pre>
        </details>
      )}
    </div>
  )
}
