interface EmptyStateProps {
  title: string
  body: string
  sub: string
  onDismiss: () => void
}

// ── Broke little guy SVG ──────────────────────────────────────────
function BrokeGuy() {
  return (
    <svg
      width="110" height="110" viewBox="0 0 110 110"
      fill="none" xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Head */}
      <circle cx="55" cy="48" r="30" fill="#2A2520" stroke="#C8793F" strokeWidth="2"/>

      {/* Eyes — wide shocked */}
      <ellipse cx="44" cy="44" rx="5" ry="6" fill="#F0EDE8"/>
      <ellipse cx="66" cy="44" rx="5" ry="6" fill="#F0EDE8"/>
      <circle cx="44" cy="45" r="2.5" fill="#1A1916"/>
      <circle cx="66" cy="45" r="2.5" fill="#1A1916"/>
      {/* Shine dots */}
      <circle cx="45.5" cy="43.5" r="1" fill="#fff"/>
      <circle cx="67.5" cy="43.5" r="1" fill="#fff"/>

      {/* Eyebrows — raised in shock */}
      <path d="M39 36 Q44 32 49 36" stroke="#C8793F" strokeWidth="2" strokeLinecap="round"/>
      <path d="M61 36 Q66 32 71 36" stroke="#C8793F" strokeWidth="2" strokeLinecap="round"/>

      {/* Mouth — open O in shock */}
      <ellipse cx="55" cy="59" rx="6" ry="5" fill="#1A1916" stroke="#8A8680" strokeWidth="1"/>

      {/* Sweat drop */}
      <path d="M77 34 Q79 30 81 34 Q81 38 79 38 Q77 38 77 34Z" fill="#4A9EE8" opacity="0.7"/>

      {/* Body */}
      <rect x="38" y="78" width="34" height="20" rx="6" fill="#2A2520" stroke="#C8793F" strokeWidth="1.5"/>

      {/* Coin flying away */}
      <ellipse cx="90" cy="25" rx="9" ry="9" fill="#C8793F" opacity="0.9"/>
      <text x="90" y="29" textAnchor="middle" fontSize="9" fill="#1A1916" fontWeight="bold" fontFamily="Inter, sans-serif">$</text>

      {/* Motion lines from coin */}
      <path d="M80 22 L72 18" stroke="#C8793F" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <path d="M80 26 L71 25" stroke="#C8793F" strokeWidth="1.5" strokeLinecap="round" opacity="0.35"/>
      <path d="M81 30 L73 32" stroke="#C8793F" strokeWidth="1.5" strokeLinecap="round" opacity="0.2"/>

      {/* Arms up in despair */}
      <path d="M38 86 Q28 75 24 66" stroke="#C8793F" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M72 86 Q82 75 86 66" stroke="#C8793F" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
}

export default function EmptyState({ title, body, sub, onDismiss }: EmptyStateProps) {
  return (
    <div
      className="anim-fade-up"
      style={{
        marginTop: 32,
        padding: '32px 28px',
        background: 'var(--clr-surface)',
        border: '1px solid var(--clr-border)',
        borderRadius: 'var(--radius-lg)',
        textAlign: 'center',
        maxWidth: 480,
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <BrokeGuy />
      </div>

      <p style={{
        fontFamily: 'var(--font-cursive)',
        fontStyle: 'italic',
        fontSize: '1.8rem',
        fontWeight: 500,
        color: 'var(--clr-amber)',
        lineHeight: 1.1,
        marginBottom: 10,
      }}>
        {title}
      </p>

      <p style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '0.92rem',
        color: 'var(--clr-text)',
        lineHeight: 1.6,
        marginBottom: 8,
      }}>
        {body}
      </p>

      <p style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '0.78rem',
        color: 'var(--clr-muted)',
        marginBottom: 24,
        fontStyle: 'italic',
      }}>
        {sub}
      </p>

      <button
        onClick={onDismiss}
        className="btn btn-ghost"
        style={{ fontSize: '0.82rem', padding: '7px 20px' }}
      >
        ok ok, let me try again
      </button>
    </div>
  )
}
