import { parseReport, type ReportData, type SearchStep } from '../types'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export interface InvestigateCallbacks {
  onSearchStep: (step: SearchStep) => void
  onDone: (report: ReportData) => void
  onError: (msg: string) => void
  onNotCompany?: (query: string) => void
}

export async function investigate(
  company: string,
  callbacks: InvestigateCallbacks,
): Promise<void> {
  let res: Response

  try {
    res = await fetch(`${API_BASE}/investigate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ company }),
    })
  } catch {
    callbacks.onError(
      `Cannot reach the backend at ${API_BASE}. Make sure it is running with: go run . --server`
    )
    return
  }

  if (!res.ok) {
    const text = await res.text().catch(() => `HTTP ${res.status}`)
    callbacks.onError(text || `HTTP ${res.status}`)
    return
  }

  if (!res.body) {
    callbacks.onError('No response body received from the server.')
    return
  }

  // ── Read NDJSON stream line by line ───────────────────────────
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''       // keep incomplete last line

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) continue

      let evt: { type: string; query?: string; content?: string; message?: string }
      try {
        evt = JSON.parse(trimmed)
      } catch {
        continue // skip malformed lines
      }

      if (evt.type === 'search' && evt.query) {
        callbacks.onSearchStep({
          id: crypto.randomUUID(),
          query: evt.query,
          status: 'done',
          timestamp: Date.now(),
        })
      } else if (evt.type === 'report' && evt.content) {
        const lowerContent = evt.content.toLowerCase();
        if (lowerContent.includes("please enter a company name to research")) {
          callbacks.onNotCompany?.(company)
          return
        }
        callbacks.onDone(parseReport(company, evt.content))
      } else if (evt.type === 'not_company') {
        callbacks.onNotCompany?.(evt.query ?? company)
        return
      } else if (evt.type === 'error' && evt.message) {
        callbacks.onError(evt.message)
        return
      }
    }
  }

  // Handle any remaining buffered data after stream ends
  if (buffer.trim()) {
    try {
      const evt = JSON.parse(buffer.trim())
      if (evt.type === 'report' && evt.content) {
        const lowerContent = evt.content.toLowerCase();
        if (lowerContent.includes("please enter a company name to research")) {
          callbacks.onNotCompany?.(company)
        } else {
          callbacks.onDone(parseReport(company, evt.content))
        }
      }
    } catch { /* ignore */ }
  }
}
