import { CopilotContext, CopilotEvidence, CopilotIntent, CopilotResponse, CopilotRiskFlag } from '../types'

function clampConfidence(value: unknown): number {
  const num = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(num)) return 0.4
  return Math.max(0, Math.min(1, Number(num.toFixed(2))))
}

function normalizeIntent(value: unknown): CopilotIntent {
  const intent = String(value || '')
  if (
    intent === 'customer_summary' ||
    intent === 'explain_score' ||
    intent === 'portfolio_stats' ||
    intent === 'next_action_reason' ||
    intent === 'unsupported'
  ) {
    return intent
  }
  return 'unsupported'
}

function normalizeRisk(value: unknown): CopilotRiskFlag {
  return value === 'ok' ? 'ok' : 'needs_human_review'
}

function normalizeEvidence(value: unknown): CopilotEvidence[] {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => {
      const label = String((item as CopilotEvidence)?.label || '').trim()
      const data = String((item as CopilotEvidence)?.value || '').trim()
      const source = String((item as CopilotEvidence)?.source || '').trim()
      if (!label || !data || !source) return null
      return { label, value: data, source }
    })
    .filter((item): item is CopilotEvidence => Boolean(item))
}

function fallbackResponse(question: string): CopilotResponse {
  return {
    intent: 'unsupported',
    answer: question.trim()
      ? 'He thong AI tam thoi gap loi. Vui long doi chieu du lieu goc tren man hinh Quan tri van hanh.'
      : 'Vui long nhap cau hoi ve ho so khach hang hoac thong ke danh muc.',
    evidence: [
      {
        label: 'Che do an toan',
        value: 'Fallback khong thay doi du lieu',
        source: 'client.fallback'
      }
    ],
    confidence: 0.35,
    riskFlag: 'needs_human_review',
    source: 'fallback'
  }
}

function normalizeResponse(payload: unknown, question: string): CopilotResponse {
  const data = (payload || {}) as Partial<CopilotResponse>
  const answer = String(data.answer || '').trim()
  const evidence = normalizeEvidence(data.evidence)

  if (!answer) {
    return fallbackResponse(question)
  }

  return {
    intent: normalizeIntent(data.intent),
    answer,
    evidence,
    confidence: clampConfidence(data.confidence),
    riskFlag: normalizeRisk(data.riskFlag),
    source: data.source === 'qwen' ? 'qwen' : 'fallback'
  }
}

export async function askCopilot(question: string, context: CopilotContext): Promise<CopilotResponse> {
  const cleaned = question.trim()
  if (!cleaned) return fallbackResponse(cleaned)

  try {
    const response = await fetch('/api/copilot-query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: cleaned, context })
    })

    if (!response.ok) {
      return fallbackResponse(cleaned)
    }

    const payload = await response.json()
    return normalizeResponse(payload, cleaned)
  } catch {
    return fallbackResponse(cleaned)
  }
}
