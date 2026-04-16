// SF8 - Type Definitions

export interface Customer {
  id: string
  name: string
  age: number
  income: number
  occupation: string
  email: string
  phone: string
  address: string
  city: string
}

export interface AlternativeData {
  telco: {
    monthlySpend: number
    tenure: number
    dataUsage: number
  }
  eWallet: {
    usage: string
    monthlyTransactions: number
    avgTransactionValue: number
    categories: string[]
  }
  ecommerce: {
    monthlyOrders: number
    avgOrderValue: number
    totalMonthlySpend: number
    categories: string[]
  }
  social: {
    activity: string
    postFrequency: number
    interests: string[]
  }
}

export interface ProductTerms {
  limitHint?: string
  tenorHint?: string
  aprHint?: string
  feeHint?: string
}

export interface Product {
  id: string
  type: string
  name: string
  description: string
  minIncome: number
  targetSegment: string[]
  productCode?: string
  keyTerms?: ProductTerms
  operationalNotes?: string[]
}

export type ActionType = 'push now' | 'nurture' | 'hold'

export interface QwenEnhancement {
  adjustment: number
  reasoning: string
  source: 'qwen' | 'fallback'
  model?: string
}

export interface ScoringResult {
  customerId: string
  overallScore: number
  recommendedProduct: string
  productAffinity?: Record<string, number>
  scores: {
    behavioral: number
    financial: number
    digital: number
    partnership: number
  }
  factors: {
    positive: string[]
    negative: string[]
  }
  breakdown: {
    pcf: number  // Partner/Channel Fit
    bss: number  // Behavioral Score
    erq: number  // External/Relationship Quality
    pa: number   // Product Affinity
  }
  action: ActionType
  confidence: number // 0..1
}

export interface SimulationResult {
  customerId: string
  variable: string
  newValue: string
  newScore: number
  newProduct: string
  change: number
  baseScore: number
  overallScore: number
  delta: number
  changedVariable: string
  action: ActionType
}

export type CopilotIntent =
  | 'customer_summary'
  | 'explain_score'
  | 'portfolio_stats'
  | 'next_action_reason'
  | 'unsupported'

export type CopilotRiskFlag = 'ok' | 'needs_human_review'

export interface CopilotEvidence {
  label: string
  value: string
  source: string
}

export interface CopilotCustomerSnapshot {
  id: string
  name: string
  age: number
  income: number
  occupation: string
  overallScore: number
  action: ActionType
  confidence: number
  recommendedProduct: string
  positiveFactors: string[]
  negativeFactors: string[]
}

export interface CopilotContext {
  generatedAt: string
  stats: {
    total: number
    avgScore: number
    maxScore: number
    minScore: number
    pushNow: number
    nurture: number
    hold: number
  }
  customers: CopilotCustomerSnapshot[]
  selectedCustomerId?: string
  productCatalog: Array<{
    id: string
    productCode: string
    name: string
    minIncome: number
    description: string
    keyTerms?: ProductTerms
  }>
}

export interface CopilotResponse {
  intent: CopilotIntent
  answer: string
  evidence: CopilotEvidence[]
  confidence: number
  riskFlag: CopilotRiskFlag
  source: 'qwen' | 'fallback'
}
