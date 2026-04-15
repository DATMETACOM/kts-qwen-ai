// SF8 - Deterministic Scoring Engine
// Per SCORING-SPEC.md: Qwen explains, never decides. All scores are deterministic.

import { Customer, AlternativeData, ShinhanProduct } from "../types";

export interface ScoreBreakdown {
  pcf: number;  // Partner/Channel Fit (0-100)
  bss: number;  // Behavior Signal Strength (0-100)
  erq: number;  // Early Reaction Quality (0-100)
  pa: number;   // Product Affinity (0-100)
}

export interface ScoringResult {
  customerId: string;
  overallScore: number;     // 0-100
  breakdown: ScoreBreakdown;
  recommendedProduct: string;  // product ID
  action: "push now" | "nurture" | "hold";
  confidence: number;       // 0-1
}

export interface SimulationInput {
  variable: "partner_channel" | "product_offer" | "early_reaction";
  newValue: string;
}

export interface SimulationResult extends ScoringResult {
  baseScore: number;
  delta: number;
  changedVariable: string;
}

/**
 * Score Partner/Channel Fit (pcf) - 0-100
 * How well customer matches partner channel characteristics
 */
function scorePartnerChannelFit(_customer: Customer, altData: AlternativeData): number {
  let score = 40; // Base score

  // Digital engagement (+0-30)
  const digitalSignals = [
    altData.eWallet.monthlyTransactions,
    altData.ecommerce.monthlyOrders,
  ];
  const avgDigital = digitalSignals.reduce((a, b) => a + b, 0) / digitalSignals.length;
  if (avgDigital >= 40) score += 30;
  else if (avgDigital >= 25) score += 20;
  else if (avgDigital >= 15) score += 10;

  // Channel activity patterns (+0-20)
  if (altData.eWallet.usage === "high") score += 15;
  else if (altData.eWallet.usage === "medium") score += 10;

  if (altData.social.activity === "high") score += 5;
  else if (altData.social.activity === "medium") score += 3;

  // Telco consistency (+0-10)
  if (altData.telco.tenure >= 36) score += 5;
  if (altData.telco.dataUsage >= 15) score += 5;

  return Math.min(Math.max(score, 0), 100);
}

/**
 * Score Behavior Signal Strength (bss) - 0-100
 * Strength of behavioral signals from alternative data
 */
function scoreBehaviorSignal(altData: AlternativeData): number {
  let score = 30; // Base score

  // Telco spending consistency (+0-20)
  if (altData.telco.monthlySpend >= 400000) score += 20;
  else if (altData.telco.monthlySpend >= 250000) score += 15;
  else if (altData.telco.monthlySpend >= 150000) score += 10;

  // E-wallet transaction frequency (+0-20)
  if (altData.eWallet.monthlyTransactions >= 50) score += 20;
  else if (altData.eWallet.monthlyTransactions >= 30) score += 15;
  else if (altData.eWallet.monthlyTransactions >= 15) score += 10;

  // Ecommerce order volume (+0-15)
  if (altData.ecommerce.monthlyOrders >= 15) score += 15;
  else if (altData.ecommerce.monthlyOrders >= 8) score += 10;
  else if (altData.ecommerce.monthlyOrders >= 4) score += 5;

  // Social activity level (+0-15)
  if (altData.social.activity === "high" && altData.social.interests.length >= 3) score += 15;
  else if (altData.social.activity === "medium" && altData.social.interests.length >= 2) score += 10;
  else if (altData.social.interests.length >= 1) score += 5;

  // Data usage (+0-10)
  if (altData.telco.dataUsage >= 20) score += 10;
  else if (altData.telco.dataUsage >= 10) score += 5;

  return Math.min(Math.max(score, 0), 100);
}

/**
 * Score Early Reaction Quality (erq) - 0-100
 * Customer's simulated responsiveness to offers
 */
function scoreEarlyReaction(altData: AlternativeData): number {
  let score = 40; // Base score

  // Engagement patterns (proxy from digital activity)
  if (altData.eWallet.usage === "high") score += 20;
  else if (altData.eWallet.usage === "medium") score += 10;

  // Response speed (simulated from activity level)
  if (altData.social.activity === "high") score += 20;
  else if (altData.social.activity === "medium") score += 10;

  // Category alignment (diverse categories = more responsive)
  const totalCategories = new Set([
    ...altData.eWallet.categories,
    ...altData.ecommerce.categories,
    ...altData.social.interests
  ]).size;

  if (totalCategories >= 8) score += 20;
  else if (totalCategories >= 5) score += 15;
  else if (totalCategories >= 3) score += 10;

  return Math.min(Math.max(score, 0), 100);
}

/**
 * Score Product Affinity (pa) - 0-100
 * Match between customer profile and specific product
 */
function scoreProductAffinity(
  customer: Customer,
  altData: AlternativeData,
  product: ShinhanProduct
): number {
  let score = 30; // Base score

  // Income eligibility (gate)
  if (customer.income < product.minIncome) return 0; // Not eligible

  // Income headroom (+0-20)
  const incomeRatio = customer.income / product.minIncome;
  if (incomeRatio >= 2) score += 20;
  else if (incomeRatio >= 1.5) score += 15;
  else if (incomeRatio >= 1.2) score += 10;

  // Occupation/segment fit (+0-25)
  const occupationLower = customer.occupation.toLowerCase();
  const hasSegmentMatch = product.targetSegment.some(seg => {
    const segLower = seg.toLowerCase();
    return occupationLower.includes(segLower) ||
           segLower.includes(occupationLower) ||
           // Interest-based matching
           altData.social.interests.some(i => i.toLowerCase().includes(segLower)) ||
           altData.eWallet.categories.some(c => c.toLowerCase().includes(segLower)) ||
           altData.ecommerce.categories.some(c => c.toLowerCase().includes(segLower));
  });

  if (hasSegmentMatch) score += 25;

  // Behavioral alignment (+0-25)
  switch (product.type) {
    case "credit_card":
      if (altData.ecommerce.monthlyOrders >= 8) score += 15;
      if (altData.eWallet.monthlyTransactions >= 30) score += 10;
      break;
    case "personal_loan":
      if (customer.income >= 8000000) score += 10;
      if (altData.telco.tenure >= 24) score += 15;
      break;
    case "sme_loan":
      if (altData.social.interests.includes("business")) score += 15;
      if (customer.income >= 20000000) score += 10;
      break;
    case "insurance":
      if (altData.social.interests.some(i => ["health", "family", "children"].includes(i))) score += 25;
      if (customer.age >= 30) score += 5;
      break;
    case "bnpl":
      if (altData.ecommerce.monthlyOrders >= 6) score += 15;
      if (customer.age < 30) score += 10;
      break;
  }

  return Math.min(Math.max(score, 0), 100);
}

/**
 * Determine action based on scores
 */
function determineAction(overallScore: number, productAffinity: number): "push now" | "nurture" | "hold" {
  if (overallScore >= 75 && productAffinity >= 70) return "push now";
  if (overallScore >= 50 && productAffinity >= 50) return "nurture";
  return "hold";
}

/**
 * Find best product for customer
 */
function findBestProduct(
  customer: Customer,
  altData: AlternativeData,
  products: ShinhanProduct[]
): { product: ShinhanProduct; affinity: number } {
  let bestProduct = products[0];
  let bestAffinity = 0;

  for (const product of products) {
    const affinity = scoreProductAffinity(customer, altData, product);
    if (affinity > bestAffinity) {
      bestAffinity = affinity;
      bestProduct = product;
    }
  }

  return { product: bestProduct, affinity: bestAffinity };
}

/**
 * Main scoring function
 */
export function scoreCustomer(
  customer: Customer,
  altData: AlternativeData,
  products: ShinhanProduct[]
): ScoringResult {
  // Compute score families
  const pcf = scorePartnerChannelFit(customer, altData);
  const bss = scoreBehaviorSignal(altData);
  const erq = scoreEarlyReaction(altData);

  // Find best product and its affinity
  const { product: bestProduct, affinity: pa } = findBestProduct(customer, altData, products);

  // Overall score = weighted average
  const overallScore = Math.round(
    pcf * 0.20 +  // Partner/Channel Fit: 20%
    bss * 0.30 +  // Behavior Signal Strength: 30%
    erq * 0.15 +  // Early Reaction Quality: 15%
    pa * 0.35     // Product Affinity: 35%
  );

  // Determine action
  const action = determineAction(overallScore, pa);

  // Confidence based on data completeness
  let confidence = 0.5;
  if (altData.eWallet.monthlyTransactions > 0) confidence += 0.1;
  if (altData.ecommerce.monthlyOrders > 0) confidence += 0.1;
  if (altData.social.interests.length > 2) confidence += 0.1;
  if (altData.telco.tenure > 12) confidence += 0.1;
  if (altData.telco.dataUsage > 5) confidence += 0.05;
  confidence = Math.min(confidence, 0.95);

  return {
    customerId: customer.id,
    overallScore,
    breakdown: { pcf, bss, erq, pa },
    recommendedProduct: bestProduct.id,
    action,
    confidence
  };
}

/**
 * Run simulation - change one variable and see the delta
 */
export function simulateWhatIf(
  customer: Customer,
  altData: AlternativeData,
  products: ShinhanProduct[],
  simulation: SimulationInput
): SimulationResult {
  // Get base score
  const baseResult = scoreCustomer(customer, altData, products);

  // Create modified alternative data based on simulation
  let modifiedAltData: AlternativeData = JSON.parse(JSON.stringify(altData));

  switch (simulation.variable) {
    case "partner_channel":
      // Simulate different partner/channel engagement
      if (simulation.newValue === "high_engagement") {
        modifiedAltData.eWallet.monthlyTransactions = Math.round(altData.eWallet.monthlyTransactions * 1.5);
        modifiedAltData.social.activity = "high";
      } else if (simulation.newValue === "low_engagement") {
        modifiedAltData.eWallet.monthlyTransactions = Math.round(altData.eWallet.monthlyTransactions * 0.5);
        modifiedAltData.social.activity = "low";
      }
      break;

    case "product_offer":
      // Simulate different product terms (doesn't affect score directly, just recommendation)
      // For demo purposes, we simulate by changing income perception
      if (simulation.newValue === "premium_offer") {
        // Customer appears more premium
        modifiedAltData.ecommerce.avgOrderValue = Math.round(altData.ecommerce.avgOrderValue * 1.3);
      }
      break;

    case "early_reaction":
      // Simulate different responsiveness
      if (simulation.newValue === "high_response") {
        modifiedAltData.eWallet.usage = "high";
        modifiedAltData.social.activity = "high";
      } else if (simulation.newValue === "low_response") {
        modifiedAltData.eWallet.usage = "low";
        modifiedAltData.social.activity = "low";
      }
      break;
  }

  // Score with modified data
  const simulatedResult = scoreCustomer(customer, modifiedAltData, products);

  return {
    ...simulatedResult,
    baseScore: baseResult.overallScore,
    delta: simulatedResult.overallScore - baseResult.overallScore,
    changedVariable: simulation.variable
  };
}

/**
 * Generate explanation text for scoring result
 */
export function generateExplanation(
  customer: Customer,
  altData: AlternativeData,
  _result: ScoringResult,
  product: ShinhanProduct
): string {
  const reasons: string[] = [];

  // Behavior-based explanations
  if (altData.ecommerce.monthlyOrders >= 8) {
    reasons.push(`Khách hàng có ${altData.ecommerce.monthlyOrders} đơn hàng/tháng`);
  }
  if (altData.eWallet.monthlyTransactions >= 40) {
    reasons.push(`Sử dụng ví điện tử tích cực (${altData.eWallet.monthlyTransactions} giao dịch/tháng)`);
  }
  if (altData.social.interests.length >= 3) {
    reasons.push(`Đa dạng sở thích: ${altData.social.interests.slice(0, 3).join(", ")}`);
  }
  if (altData.telco.tenure >= 36) {
    reasons.push(`Thuê bao ổn định ${altData.telco.tenure} tháng`);
  }

  // Product-specific explanations
  switch (product.type) {
    case "credit_card":
      reasons.push(`Phù hợp với thói quen mua sắm trực tuyến`);
      break;
    case "personal_loan":
      reasons.push(`Thu nhập ổn định ${(customer.income / 1000000).toFixed(1)}M VNĐ/tháng`);
      break;
    case "sme_loan":
      reasons.push(`Có quan tâm đến lĩnh vực kinh doanh`);
      break;
    case "insurance":
      reasons.push(`Quan tâm đến sức khỏe và gia đình`);
      break;
    case "bnpl":
      reasons.push(`Thói quen mua sắm trực tuyến phù hợp BNPL`);
      break;
  }

  return reasons.join(". ") + ".";
}

/**
 * Get all customer scores for dashboard
 */
export function scoreAllCustomers(
  customers: Customer[],
  altDataMap: Record<string, AlternativeData>,
  products: ShinhanProduct[]
): ScoringResult[] {
  return customers
    .filter(c => altDataMap[c.id])
    .map(customer => scoreCustomer(customer, altDataMap[customer.id], products));
}

/**
 * Get score statistics
 */
export function getScoreStats(results: ScoringResult[]) {
  const scores = results.map(r => r.overallScore);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const max = Math.max(...scores);
  const min = Math.min(...scores);
  const pushNow = results.filter(r => r.action === "push now").length;
  const nurture = results.filter(r => r.action === "nurture").length;
  const hold = results.filter(r => r.action === "hold").length;

  return { avg: Math.round(avg), max, min, pushNow, nurture, hold, total: results.length };
}
