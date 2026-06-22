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

function extractSection(raw: string, heading: string): string {
  const re = new RegExp(`##\\s*${heading}[^\n]*\n([\\s\\S]*?)(?=\n##|$)`, 'i')
  const m = raw.match(re)
  return m ? m[1].trim() : ''
}

function extractRedFlags(raw: string): string[] {
  const section = extractSection(raw, 'RED FLAGS')
  if (!section) return []
  return section
    .split('\n')
    .filter(l => l.trim().match(/^[-*•]\s+/))
    .map(l => l.replace(/^[-*•]\s+/, '').trim())
    .filter(Boolean)
}

function extractVerdict(raw: string): 'LEGIT' | 'SUSPICIOUS' | 'SCAM' {
  if (/VERDICT:\s*SCAM/i.test(raw)) return 'SCAM'
  if (/VERDICT:\s*SUSPICIOUS/i.test(raw)) return 'SUSPICIOUS'
  return 'LEGIT'
}

function extractScores(raw: string): { metrics: ScoreMetric[]; overall: number } {
  const section = extractSection(raw, 'SCORECARD')
  const metrics: ScoreMetric[] = []
  let overall = 50

  const metricDefs = [
    { key: 'Overall Score',              label: 'Overall' },
    { key: 'Applyability Score',         label: 'Applyability' },
    { key: 'Salary Score',               label: 'Salary' },
    { key: 'Employee Satisfaction Score',label: 'Employee Satisfaction' },
    { key: 'Benefits Score',             label: 'Benefits' },
    { key: 'Work-Life Balance Score',    label: 'Work-Life Balance' },
    { key: 'Career Growth Score',        label: 'Career Growth' },
  ]

  for (const def of metricDefs) {
    const re = new RegExp(`${def.key}[^\\d]*(\\d+)`, 'i')
    const m = section.match(re)
    const score = m ? parseInt(m[1], 10) : 0
    // grab explanation: the line after the score line
    const lineRe = new RegExp(`${def.key}[^\n]*\n([^\n]+)`, 'i')
    const lm = section.match(lineRe)
    const explanation = lm ? lm[1].replace(/^[-*•]\s*/, '').trim() : ''
    if (def.key === 'Overall Score') overall = score
    else metrics.push({ label: def.label, score, explanation })
  }
  return { metrics, overall }
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
