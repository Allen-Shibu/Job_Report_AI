import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ReportView from '../components/ReportView'
import type { ReportData } from '../types'
import { demoReport } from '../demoData'

export default function ReportPage() {
  const location = useLocation()
  const navigate = useNavigate()

  // Use real report from navigation state, fall back to demo
  const report: ReportData = location.state?.report ?? demoReport

  // Detect general query or invalid input response from LLM
  const isGeneralQuery =
    report.rawReport?.includes('Please enter a company name to research.') ||
    (!report.overview && report.scorecard.length === 0)

  if (isGeneralQuery) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
      }}>
        <main style={{ maxWidth: 620, width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            fontSize: 'clamp(2.5rem, 6vw, 3.8rem)',
            color: 'var(--clr-text)',
            lineHeight: 1.1,
            marginBottom: 8,
            letterSpacing: '-0.02em',
          }}>
            Uncharted Query
          </h1>

          <p style={{
            fontFamily: 'var(--font-cursive)',
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: 'clamp(1.4rem, 4vw, 2rem)',
            color: 'var(--clr-amber)',
            lineHeight: 1.2,
            marginBottom: 24,
          }}>
            This input does not resolve to a verified business entity.
          </p>

          <p style={{
            fontFamily: 'var(--font-ui)',
            fontWeight: 300,
            fontSize: '0.96rem',
            color: 'var(--clr-muted)',
            lineHeight: 1.7,
            marginBottom: 32,
            maxWidth: 460,
          }}>
            Our analysis model is tailored exclusively for corporate entities. To run an audit, please verify the name or check that the organization has public records or registration history.
          </p>

          {/* Action button */}
          <button
            id="back-btn-empty"
            onClick={() => navigate('/')}
            className="btn btn-primary"
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.85rem',
              padding: '12px 28px',
              fontWeight: 600,
            }}
          >
            Research a real company
          </button>
        </main>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <main style={{ maxWidth: 820, margin: '0 auto', padding: '40px 24px 100px', width: '100%' }}>

        {/* Back link */}
        <button
          id="back-btn"
          onClick={() => navigate('/')}
          className="btn btn-ghost"
          style={{ fontSize: '0.8rem', padding: '7px 16px', marginBottom: 32 }}
        >
          <ArrowLeft size={13} /> New search
        </button>

        {/* Demo watermark if showing prototype */}
        {!location.state?.report && (
          <div style={{
            marginBottom: 20,
            padding: '10px 16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--clr-border)',
            background: 'var(--clr-surface)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
              color: 'var(--clr-amber)', letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              Demo
            </span>
            <span style={{
              fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--clr-dim)',
            }}>
              This is a prototype using sample data. Run a real search from the homepage.
            </span>
          </div>
        )}

        <ReportView report={report} />
      </main>
    </div>
  )
}
