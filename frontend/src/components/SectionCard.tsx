import { useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

interface SectionCardProps {
  label: string
  title: string
  icon?: ReactNode
  children: ReactNode
  defaultOpen?: boolean
  accentColor?: string
}

export default function SectionCard({
  label, title, icon, children, defaultOpen = false,
  accentColor = 'var(--clr-amber)',
}: SectionCardProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div
      className="card"
      style={{ padding: 0, overflow: 'hidden' }}
    >
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', padding: '16px 22px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
        }}
        aria-expanded={open}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {icon && <span style={{ color: accentColor, display: 'flex', opacity: 0.75 }}>{icon}</span>}
          <div>
            <div style={{
              fontFamily: 'var(--font-cursive)', fontStyle: 'italic',
              fontSize: '0.82rem', color: 'var(--clr-muted)', marginBottom: 2,
            }}>
              {label}
            </div>
            <div style={{
              fontFamily: 'var(--font-ui)', fontWeight: 500,
              fontSize: '0.92rem', color: 'var(--clr-text)',
            }}>
              {title}
            </div>
          </div>
        </div>
        <ChevronDown
          size={16}
          style={{
            color: 'var(--clr-dim)', flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.22s ease',
          }}
        />
      </button>

      {open && (
        <div style={{
          padding: '0 22px 20px',
          borderTop: '1px solid var(--clr-border)',
          animation: 'fadeSlideUp 0.22s ease both',
        }}>
          <div style={{ height: 16 }} />
          {children}
        </div>
      )}
    </div>
  )
}
