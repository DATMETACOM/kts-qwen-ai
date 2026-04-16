import { AlternativeData, Customer, QwenEnhancement, ScoringResult } from '../types'

interface QwenEnhancementRequest {
  customer: Customer
  altData: AlternativeData
  baseScore: number
  recommendedProduct: string
}

interface QwenEnhancementResponse {
  adjustment: number
  reasoning: string
  source: 'qwen' | 'fallback'
  model?: string
}

function normalizeConfidence(score: number): number {
  if (score > 1) return score / 100
  return score
}

export function getConfidenceLabel(score: number): string {
  const normalized = normalizeConfidence(score)
  if (normalized >= 0.8) return 'Tin nhiem cao'
  if (normalized >= 0.6) return 'Tin nhiem trung binh'
  if (normalized >= 0.4) return 'Tin nhiem thap'
  return 'Can tham dinh bo sung'
}

export function getConfidenceColor(score: number): string {
  const normalized = normalizeConfidence(score)
  if (normalized >= 0.8) return '#16a34a'
  if (normalized >= 0.6) return '#ca8a04'
  if (normalized >= 0.4) return '#ea580c'
  return '#dc2626'
}

function clampAdjustment(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.max(-10, Math.min(10, Math.round(value)))
}

function fallbackReasoning(customerName: string): string {
  return `Qwen enhancement unavailable. Using deterministic baseline for ${customerName}.`
}

export async function getQwenEnhancement(
  request: QwenEnhancementRequest
): Promise<QwenEnhancement> {
  try {
    const response = await fetch('/api/qwen-enhance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      return {
        adjustment: 0,
        reasoning: fallbackReasoning(request.customer.name),
        source: 'fallback'
      }
    }

    const payload = (await response.json()) as Partial<QwenEnhancementResponse>

    return {
      adjustment: clampAdjustment(payload.adjustment ?? 0),
      reasoning: payload.reasoning || fallbackReasoning(request.customer.name),
      source: payload.source === 'qwen' ? 'qwen' : 'fallback',
      model: payload.model
    }
  } catch {
    return {
      adjustment: 0,
      reasoning: fallbackReasoning(request.customer.name),
      source: 'fallback'
    }
  }
}

export function applyEnhancement(base: ScoringResult, enhancement: QwenEnhancement): ScoringResult {
  const adjustedScore = Math.max(0, Math.min(100, base.overallScore + enhancement.adjustment))
  const pa = base.breakdown.pa

  let action: ScoringResult['action'] = 'hold'
  if (adjustedScore >= 75 && pa >= 70) action = 'push now'
  else if (adjustedScore >= 50 && pa >= 50) action = 'nurture'

  return {
    ...base,
    overallScore: adjustedScore,
    action
  }
}
