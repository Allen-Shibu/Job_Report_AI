// ─── Types ─────────────────────────────────────────────────────────────────

export interface ScoreMetric {
  label: string
  score: number
  explanation: string
}

export interface ReportData {
  company: string
  overview: string
  scorecard: ScoreMetric[]
  overallScore: number
  applyability: string
  salary: string
  employeeSatisfaction: string
  culture: string
  legitimacy: string
  reputation: string
  financials: string
  redFlags: string[]
  verdict: 'LEGIT' | 'SUSPICIOUS' | 'SCAM'
  rawReport: string
}

export interface SearchStep {
  id: string
  query: string
  status: 'searching' | 'done' | 'error'
  timestamp: number
}

export interface InvestigateState {
  status: 'idle' | 'searching' | 'done' | 'error'
  company: string
  steps: SearchStep[]
  report: ReportData | null
  error: string | null
}

// ─── Parser ─────────────────────────────────────────────────────────────────

/**
 * Extracts the content of a section from the raw LLM report.
 * Handles:
 *  - Any heading level: #, ##, ###
 *  - Blank lines between sections
 *  - CRLF line endings
 *  - Case-insensitive heading names
 */
function extractSection(raw: string, heading: string): string {
  // Normalize line endings
  const text = raw.replace(/\r\n/g, '\n')
  // Match 1–3 hashes, optional spaces, the heading, rest of heading line, then content.
  // Stop at the next line that starts with any # heading, OR end of string.
  // Key: NO multiline flag — $ means end-of-string, not end-of-line.
  const re = new RegExp(
    `#{1,3}\\s*${heading}[^\\n]*\\n([\\s\\S]*?)(?=\\n#|$)`,
    'i'
  )
  const m = text.match(re)
  return m ? m[1].trim() : ''
}

/**
 * Extracts a numeric score by scanning line by line.
 * Finds any line containing the label, then picks the first number on that line.
 * Works for bullet, table, bold, or any other format the LLM uses.
 */
function extractScore(text: string, label: string): { score: number; explanation: string } {
  const lines = text.replace(/\r\n/g, '\n').replace(/Work-Life/gi, 'Work Life').split('\n')

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].toLowerCase().includes(label.toLowerCase())) {
      // First number on this line is the score
      const numMatch = lines[i].match(/(\d{1,3})/)
      if (numMatch) {
        const score = Math.min(100, parseInt(numMatch[1], 10))
        // Explanation = next non-empty line, stripped of leading punctuation
        const next = (lines[i + 1] || '').replace(/^[\s\-*•|]+/, '').trim()
        return { score, explanation: next }
      }
    }
  }

  return { score: 0, explanation: '' }
}

function extractScores(raw: string): { metrics: ScoreMetric[]; overall: number } {
  // Try to extract just the SCORECARD section; fall back to the full raw text
  // so scores are found even if section headings are missing/malformed.
  const section = extractSection(raw, 'SCORECARD') || raw

  const metricDefs = [
    { key: 'Overall Score',               label: 'Overall' },
    { key: 'Applyability Score',          label: 'Applyability' },
    { key: 'Salary Score',                label: 'Salary' },
    { key: 'Employee Satisfaction Score', label: 'Employee Satisfaction' },
    { key: 'Benefits Score',              label: 'Benefits' },
    { key: 'Work Life Balance Score',     label: 'Work Life Balance' },
    { key: 'Career Growth Score',         label: 'Career Growth' },
  ]

  const metrics: ScoreMetric[] = []
  let overall = 50

  for (const def of metricDefs) {
    const { score, explanation } = extractScore(section, def.key)
    if (def.key === 'Overall Score') overall = score
    else metrics.push({ label: def.label, score, explanation })
  }

  return { metrics, overall }
}

function extractRedFlags(raw: string): string[] {
  const section = extractSection(raw, 'RED FLAGS')
  if (!section) return []
  return section
    .split('\n')
    .filter(l => l.trim().match(/^[-*•⚠]\s+/))
    .map(l => l
      .replace(/^[-*•⚠]\s+/, '')   // strip leading bullet/⚠
      .replace(/\*\*([^*]+)\*\*/g, '$1') // strip **bold** markers
      .trim()
    )
    .filter(Boolean)
}

function extractVerdict(raw: string): 'LEGIT' | 'SUSPICIOUS' | 'SCAM' {
  if (/VERDICT:\s*SCAM/i.test(raw)) return 'SCAM'
  if (/VERDICT:\s*SUSPICIOUS/i.test(raw)) return 'SUSPICIOUS'
  return 'LEGIT'
}

export function parseReport(company: string, raw: string): ReportData {
  const { metrics, overall } = extractScores(raw)
  return {
    company,
    overview:             extractSection(raw, 'COMPANY OVERVIEW'),
    scorecard:            metrics,
    overallScore:         overall,
    applyability:         extractSection(raw, 'APPLYABILITY'),
    salary:               extractSection(raw, 'SALARY'),
    employeeSatisfaction: extractSection(raw, 'EMPLOYEE SATISFACTION'),
    culture:              extractSection(raw, 'CULTURE'),
    legitimacy:           extractSection(raw, 'LEGITIMACY'),
    reputation:           extractSection(raw, 'REPUTATION'),
    financials:           extractSection(raw, 'FINANCIALS'),
    redFlags:             extractRedFlags(raw),
    verdict:              extractVerdict(raw),
    rawReport:            raw,
  }
}
