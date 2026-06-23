import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import SearchLog from '../components/SearchLog'
import { investigate } from '../api/client'
import type { SearchStep, ReportData } from '../types'

function isGeneralQueryName(input: string): boolean {
  const normalized = input.trim().toLowerCase();

  if (normalized.length <= 1) return true;
  if (/^[0-9+\-*/\s=()]+$/.test(normalized)) return true;

  const greetings = [
    'hello', 'hi', 'hey', 'greetings', 'yo', 'sup', 'howdy',
    'good morning', 'good afternoon', 'good evening',
    'help', 'test', 'demo', 'none', 'nothing', 'null', 'undefined',
    'boi', 'emotee'
  ];
  if (greetings.includes(normalized)) return true;

  if (normalized.startsWith('what ') || normalized.startsWith('how ') || normalized.startsWith('who ') || normalized.startsWith('why ') || normalized.startsWith('where ') || normalized.endsWith('?')) {
    return true;
  }

  return false;
}

export default function HomePage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'idle' | 'searching' | 'error' | 'not_company'>('idle')
  const [steps, setSteps] = useState<SearchStep[]>([])
  const [error, setError] = useState<string | null>(null)
  const [brokenQuery, setBrokenQuery] = useState<string>('')

  const handleSubmit = async (company: string) => {
    setStatus('searching')
    setSteps([])
    setError(null)

    // Intercept obvious general queries locally to save API key tokens
    if (isGeneralQueryName(company)) {
      setBrokenQuery(company)
      setStatus('not_company')
      return
    }

    await investigate(company, {
      onSearchStep: (step) => setSteps(prev => [...prev, step]),
      onDone: (report: ReportData) => {
        if (report.overallScore === 0) {
          setBrokenQuery(company)
          setStatus('not_company')
        } else {
          navigate('/report', { state: { report } })
        }
      },
      onError: (msg) => { setStatus('error'); setError(msg) },
      onNotCompany: (query) => { setBrokenQuery(query); setStatus('not_company') },
    })
  }

  const resetToIdle = () => {
    setStatus('idle')
    setSteps([])
    setError(null)
    setBrokenQuery('')
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {status === 'not_company' ? (
        <section
          id="not-company-state"
          className="anim-fade-up"
          style={{
            textAlign: 'center',
            maxWidth: 620,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
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

          {brokenQuery && (
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: 'var(--clr-dim)',
              marginTop: -8,
              marginBottom: 32,
            }}>
              Unresolved query: &ldquo;<span style={{ color: '#9C7FC0' }}>{brokenQuery}</span>&rdquo;
            </p>
          )}

          <button
            id="try-again-btn"
            onClick={resetToIdle}
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.85rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              padding: '12px 28px',
              borderRadius: 50,
              border: '1px solid var(--clr-amber)',
              background: 'transparent',
              color: 'var(--clr-amber)',
              cursor: 'pointer',
              transition: 'background 0.18s, color 0.18s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.background = 'var(--clr-amber)'
              el.style.color = '#0f0d08'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.background = 'transparent'
              el.style.color = 'var(--clr-amber)'
            }}
          >
            Try a real company →
          </button>
        </section>
      ) : (
        <>
          {/* ── Hero text ── */}
          <section
            className="anim-fade-up"
            style={{ textAlign: 'center', maxWidth: 620, width: '100%' }}
          >
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              fontSize: 'clamp(3.2rem, 8vw, 5.2rem)',
              color: 'var(--clr-text)',
              lineHeight: 1.08,
              marginBottom: 0,
              letterSpacing: '-0.02em',
            }}>
              Drop a name,
            </h1>

            <p style={{
              fontFamily: 'var(--font-cursive)',
              fontStyle: 'italic',
              fontWeight: 500,
              fontSize: 'clamp(3.2rem, 8vw, 5.2rem)',
              color: 'var(--clr-amber)',
              lineHeight: 1.08,
              marginBottom: 32,
              letterSpacing: '-0.02em',
            }}>
              we'll do the rest.
            </p>

            <p style={{
              fontFamily: 'var(--font-ui)',
              fontWeight: 300,
              fontSize: '0.96rem',
              color: 'var(--clr-muted)',
              lineHeight: 1.7,
              marginBottom: 40,
              maxWidth: 420,
              margin: '0 auto 40px',
            }}>
              Enter a company name and the agent will search the web,
              analyse reputation, verify legitimacy, and return a clear verdict.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <SearchBar onSubmit={handleSubmit} loading={status === 'searching'} />
            </div>
          </section>

          {/* ── Below-fold states ── */}
          <div style={{ width: '100%', maxWidth: 620, marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Live search log */}
            <div style={{ width: '100%' }}>
              <SearchLog steps={steps} isSearching={status === 'searching'} />
            </div>

            {/* API error */}
            {status === 'error' && error && (
              <div
                className="card anim-fade-up"
                style={{ marginTop: 20, borderLeft: '3px solid var(--clr-amber)', width: '100%' }}
              >
                <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '0.85rem', color: 'var(--clr-amber)' }}>
                  Service Temporarily Unavailable
                </p>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: 'var(--clr-muted)', marginTop: 7, lineHeight: 1.7 }}>
                  We're currently experiencing higher than usual demand on our investigation pipeline. Please wait a moment and try your search again — your query has not been lost.
                </p>
                <button
                  id="retry-btn"
                  onClick={resetToIdle}
                  style={{
                    marginTop: 16,
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    padding: '8px 20px',
                    borderRadius: 50,
                    border: '1px solid var(--clr-amber)',
                    background: 'transparent',
                    color: 'var(--clr-amber)',
                    cursor: 'pointer',
                    transition: 'background 0.18s, color 0.18s',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLButtonElement
                    el.style.background = 'var(--clr-amber)'
                    el.style.color = '#0f0d08'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLButtonElement
                    el.style.background = 'transparent'
                    el.style.color = 'var(--clr-amber)'
                  }}
                >
                  Try again →
                </button>
              </div>
            )}
          </div>

          {/* ── Capability tags — idle only ── */}
          {status === 'idle' && (
            <div
              className="anim-fade-up"
              style={{ marginTop: 52, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 620, width: '100%' }}
            >
              {['Reputation Analysis', 'Legitimacy Check', 'Financial Overview', 'Employee Reviews', 'Red Flag Detection'].map(f => (
                <span key={f} style={{
                  fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 500,
                  color: 'var(--clr-dim)', border: '1px solid var(--clr-border)',
                  borderRadius: 50, padding: '5px 13px', letterSpacing: '0.01em',
                }}>
                  {f}
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
