import { useState, type FormEvent } from 'react'
import { ArrowRight } from 'lucide-react'

interface SearchBarProps {
  onSubmit: (company: string) => void
  loading?: boolean
}

export default function SearchBar({ onSubmit, loading = false }: SearchBarProps) {
  const [value, setValue] = useState('')

  const handle = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed && !loading) onSubmit(trimmed)
  }

  return (
    <form onSubmit={handle} style={{ width: '100%', maxWidth: 480 }}>
      <div style={{ position: 'relative' }}>
        <input
          id="company-search-input"
          className="input-field"
          style={{ paddingLeft: 20, paddingRight: 56 }}
          placeholder="Company name…"
          value={value}
          onChange={e => setValue(e.target.value)}
          disabled={loading}
          autoFocus
          autoComplete="off"
        />

        {/* Arrow button — small, inset right side */}
        <button
          id="investigate-btn"
          type="submit"
          disabled={!value.trim() || loading}
          aria-label="Investigate"
          style={{
            position: 'absolute', right: 8, top: '50%',
            transform: 'translateY(-50%)',
            width: 36, height: 36,
            borderRadius: '50%',
            border: 'none',
            background: value.trim() && !loading
              ? 'var(--clr-cream)'
              : 'var(--clr-surface-hi)',
            color: value.trim() && !loading
              ? 'var(--clr-cream-text)'
              : 'var(--clr-dim)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: value.trim() && !loading ? 'pointer' : 'not-allowed',
            transition: 'background 0.18s, color 0.18s, transform 0.18s',
            flexShrink: 0,
          }}
          onMouseEnter={e => {
            if (value.trim() && !loading)
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-50%) scale(1.08)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-50%) scale(1)'
          }}
        >
          {loading
            ? <span className="spinner" style={{ width: 14, height: 14 }} />
            : <ArrowRight size={16} />
          }
        </button>
      </div>
    </form>
  )
}
