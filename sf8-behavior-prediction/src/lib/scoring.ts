import { AlternativeData, Customer, Product, ScoringResult, SimulationResult, ActionType } from '../types'

export type { ScoringResult, SimulationResult }

interface ScoreOverrides {
  pcf?: number
  bss?: number
  erq?: number
  pa?: number
}

interface Breakdown {
  pcf: number
  bss: number
  erq: number
  pa: number
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function getAction(overallScore: number, productAffinity: number): ActionType {
  if (overallScore >= 75 && productAffinity >= 70) return 'push now'
  if (overallScore >= 50 && productAffinity >= 50) return 'nurture'
  return 'hold'
}

function toConfidence(overallScore: number, factors: { positive: string[]; negative: string[] }): number {
  const signalBalance = clamp((factors.positive.length - factors.negative.length + 5) / 10, 0, 1)
  const scoreStrength = clamp(overallScore / 100, 0, 1)
  return Number(((signalBalance * 0.4) + (scoreStrength * 0.6)).toFixed(2))
}

export function scoreAllCustomers(
  customers: Customer[],
  altData: Record<string, AlternativeData>,
  products: Product[]
): ScoringResult[] {
  return customers.map((customer) => scoreCustomer(customer, altData[customer.id], products))
}

export function scoreCustomer(
  customer: Customer,
  altData: AlternativeData,
  products: Product[],
  overrides?: ScoreOverrides
): ScoringResult {
  const computedBreakdown: Breakdown = {
    pcf: calculatePartnershipScore(customer, altData),
    bss: calculateBehavioralScore(altData),
    erq: calculateReactionScore(customer, altData),
    pa: calculateProductAffinitySignal(customer, altData)
  }

  const breakdown: Breakdown = {
    pcf: clamp(Math.round(overrides?.pcf ?? computedBreakdown.pcf), 0, 100),
    bss: clamp(Math.round(overrides?.bss ?? computedBreakdown.bss), 0, 100),
    erq: clamp(Math.round(overrides?.erq ?? computedBreakdown.erq), 0, 100),
    pa: clamp(Math.round(overrides?.pa ?? computedBreakdown.pa), 0, 100)
  }

  // Weighted score defined in SF8 scoring spec.
  const overallScore = Math.round(
    (breakdown.pcf * 0.20) +
      (breakdown.bss * 0.30) +
      (breakdown.erq * 0.15) +
      (breakdown.pa * 0.35)
  )

  const productAffinity = calculateProductAffinity(customer, altData, products)
  const recommendedProduct = getTopProduct(productAffinity)
  const factors = generateFactors(customer, altData)
  const action = getAction(overallScore, productAffinity[recommendedProduct] ?? breakdown.pa)
  const confidence = toConfidence(overallScore, factors)

  return {
    customerId: customer.id,
    overallScore,
    recommendedProduct,
    productAffinity,
    scores: {
      behavioral: breakdown.bss,
      financial: breakdown.erq,
      digital: breakdown.pa,
      partnership: breakdown.pcf
    },
    factors,
    breakdown,
    action,
    confidence
  }
}

function calculatePartnershipScore(customer: Customer, altData: AlternativeData): number {
  let score = 45

  if (altData.eWallet.usage === 'high') score += 18
  else if (altData.eWallet.usage === 'medium') score += 10

  if (altData.telco.tenure >= 6) score += 15
  else if (altData.telco.tenure >= 3) score += 8

  if (customer.income >= 20000000) score += 10

  return clamp(score, 0, 100)
}

function calculateBehavioralScore(altData: AlternativeData): number {
  let score = 40

  if (altData.eWallet.monthlyTransactions >= 50) score += 20
  else if (altData.eWallet.monthlyTransactions >= 25) score += 12
  else if (altData.eWallet.monthlyTransactions >= 10) score += 6

  if (altData.ecommerce.monthlyOrders >= 12) score += 16
  else if (altData.ecommerce.monthlyOrders >= 6) score += 10
  else if (altData.ecommerce.monthlyOrders >= 3) score += 5

  if (altData.social.activity === 'high') score += 14
  else if (altData.social.activity === 'medium') score += 8

  return clamp(score, 0, 100)
}

function calculateReactionScore(customer: Customer, altData: AlternativeData): number {
  let score = 35

  if (customer.income >= 30000000) score += 30
  else if (customer.income >= 18000000) score += 20
  else if (customer.income >= 10000000) score += 12

  if (altData.eWallet.avgTransactionValue >= 300000) score += 16
  else if (altData.eWallet.avgTransactionValue >= 180000) score += 10

  if (altData.ecommerce.totalMonthlySpend >= 8000000) score += 14
  else if (altData.ecommerce.totalMonthlySpend >= 3000000) score += 8

  return clamp(score, 0, 100)
}

function calculateProductAffinitySignal(customer: Customer, altData: AlternativeData): number {
  let score = 38

  if (customer.occupation.toLowerCase().includes('business')) score += 12
  if (customer.occupation.toLowerCase().includes('office') || customer.occupation.toLowerCase().includes('it')) score += 10

  const interests = altData.social.interests.map((item) => item.toLowerCase())
  if (interests.some((item) => ['shopping', 'fashion', 'technology', 'finance'].includes(item))) score += 16

  if (altData.ecommerce.monthlyOrders >= 8) score += 14
  else if (altData.ecommerce.monthlyOrders >= 4) score += 8

  if (altData.telco.dataUsage >= 20) score += 10
  else if (altData.telco.dataUsage >= 10) score += 5

  return clamp(score, 0, 100)
}

function calculateProductAffinity(
  customer: Customer,
  altData: AlternativeData,
  products: Product[]
): Record<string, number> {
  const eligibleProducts = products.filter((product) => customer.income >= product.minIncome)
  const affinity: Record<string, number> = {}

  for (const product of eligibleProducts) {
    let score = 35

    if (product.targetSegment.some((segment) => customer.occupation.toLowerCase().includes(segment))) {
      score += 20
    }

    if (product.targetSegment.includes('shopping') && altData.ecommerce.monthlyOrders >= 6) score += 18
    if (product.targetSegment.includes('business') && customer.occupation.toLowerCase().includes('business')) score += 22
    if (product.targetSegment.includes('young') && customer.age <= 30) score += 12

    if (altData.eWallet.usage === 'high') score += 12
    if (altData.social.activity === 'high') score += 8

    affinity[product.id] = clamp(Math.round(score), 0, 100)
  }

  return affinity
}

function getTopProduct(productAffinity: Record<string, number>): string {
  const top = Object.entries(productAffinity).sort((a, b) => b[1] - a[1])[0]
  return top?.[0] ?? 'cc-cashback'
}

function generateFactors(customer: Customer, altData: AlternativeData): ScoringResult['factors'] {
  const positive: string[] = []
  const negative: string[] = []

  if (altData.eWallet.usage === 'high') positive.push('High e-wallet activity')
  if (altData.ecommerce.monthlyOrders >= 8) positive.push('Strong e-commerce purchase behavior')
  if (altData.telco.tenure >= 3) positive.push('Stable telco tenure')
  if (customer.income >= 18000000) positive.push('Healthy income profile')
  if (altData.social.activity === 'high') positive.push('High digital engagement')

  if (altData.eWallet.usage === 'low') negative.push('Low e-wallet engagement')
  if (altData.ecommerce.monthlyOrders < 3) negative.push('Low commerce activity')
  if (altData.telco.tenure < 1) negative.push('Short telco history')
  if (customer.income < 10000000) negative.push('Lower income segment')

  return { positive, negative }
}

export function getScoreStats(scores: ScoringResult[]) {
  const avgScore = scores.reduce((sum, item) => sum + item.overallScore, 0) / scores.length
  const maxScore = Math.max(...scores.map((item) => item.overallScore))
  const minScore = Math.min(...scores.map((item) => item.overallScore))

  const pushNow = scores.filter((item) => item.action === 'push now').length
  const nurture = scores.filter((item) => item.action === 'nurture').length
  const hold = scores.filter((item) => item.action === 'hold').length

  return {
    avgScore: Math.round(avgScore),
    maxScore,
    minScore,
    total: scores.length,
    totalCustomers: scores.length,
    pushNow,
    nurture,
    hold
  }
}

function normalizeSimulationBoost(variable: string, newValue: string): Partial<ScoreOverrides> {
  if (variable === 'partner_channel') {
    if (newValue === 'high_engagement' || newValue === 'momo') return { pcf: 90 }
    if (newValue === 'low_engagement') return { pcf: 45 }
    return { pcf: 75 }
  }

  if (variable === 'product_offer') {
    if (newValue === 'premium_offer') return { pa: 88, erq: 75 }
    return { pa: 65 }
  }

  if (variable === 'early_reaction') {
    if (newValue === 'high_response') return { erq: 85 }
    if (newValue === 'low_response') return { erq: 45 }
    return { erq: 60 }
  }

  return {}
}

export function simulateWhatIf(
  customer: Customer,
  altData: AlternativeData,
  products: Product[],
  simulation: { variable: string; newValue: string }
): SimulationResult {
  const baseResult = scoreCustomer(customer, altData, products)
  const overrides = normalizeSimulationBoost(simulation.variable, simulation.newValue)
  const simulatedResult = scoreCustomer(customer, altData, products, overrides)

  const delta = simulatedResult.overallScore - baseResult.overallScore

  return {
    customerId: customer.id,
    variable: simulation.variable,
    newValue: simulation.newValue,
    newScore: simulatedResult.overallScore,
    newProduct: simulatedResult.recommendedProduct,
    change: delta,
    baseScore: baseResult.overallScore,
    overallScore: simulatedResult.overallScore,
    delta,
    changedVariable: simulation.variable,
    action: simulatedResult.action
  }
}

export function generateExplanation(
  customer: Customer,
  score: ScoringResult,
  product: Product
): string {
  const strengths = score.factors.positive.slice(0, 3).join(', ') || 'Tin hieu tich cuc o muc co ban'
  const weaknesses = score.factors.negative.slice(0, 2).join(', ') || 'Chua ghi nhan canh bao lon'

  return [
    `Ho so ${customer.name} dat diem Lead Score ${score.overallScore}/100.`,
    `Tin hieu tich cuc: ${strengths}.`,
    `Can theo doi them: ${weaknesses}.`,
    `San pham de xuat (NBO): ${product.name}.`,
    score.action === 'push now'
      ? 'Khuyen nghi xu ly: uu tien tiep can trong 24 gio toi.'
      : score.action === 'nurture'
        ? 'Khuyen nghi xu ly: cham soc dinh ky voi thong diep ca nhan hoa.'
        : 'Khuyen nghi xu ly: tam ngung tiep can, bo sung tin hieu de tham dinh.'
  ].join(' ')
}
