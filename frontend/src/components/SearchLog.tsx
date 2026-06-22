import { useEffect, useRef } from 'react'
import type { SearchStep } from '../types'

interface SearchLogProps {
  steps: SearchStep[]
  isSearching: boolean
}

export default function SearchLog({ steps, isSearching }: SearchLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [steps])

  if (steps.length === 0 && !isSearching) return null

  return (
    <div className="card anim-fade-up" style={{ marginTop: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span style={{
          fontFamily: 'var(--font-cursive)', fontStyle: 'italic',
          fontSize: '0.9rem', color: 'var(--clr-amber)',
        }}>
          agent trace
        </span>
        {isSearching && <span className="spinner" />}
        {!isSearching && steps.length > 0 && (
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
            color: 'var(--clr-legit)',
          }}>
            ✓ {steps.length} searches complete
          </span>
        )}
      </div>

      {/* Log */}
      <div style={{
        background: 'var(--clr-bg)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--clr-border)',
        padding: '12px 16px',
        maxHeight: 200,
        overflowY: 'auto',
        display: 'flex', flexDirection: 'column', gap: 7,
      }}>
        {steps.map((step, i) => (
          <div
            key={step.id}
            className="anim-slide-left"
            style={{ animationDelay: `${i * 25}ms`, display: 'flex', gap: 10 }}
          >
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
              color: 'var(--clr-amber)', flexShrink: 0, marginTop: 1,
            }}>
              ✓
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.76rem',
              color: 'var(--clr-muted)', lineHeight: 1.55,
            }}>
              {step.query}
            </span>
          </div>
        ))}
        {isSearching && (
          <div style={{ display: 'flex', gap: 10 }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
              color: 'var(--clr-dim)', animation: 'pulse 1.2s ease-in-out infinite',
            }}>◌</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: 'var(--clr-dim)' }}>
              searching…
            </span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
