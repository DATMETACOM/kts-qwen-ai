// SF8 - Data Provider (governed data access layer)
import { CUSTOMERS, ALTERNATIVE_DATA, PRODUCTS, getEligibleProducts } from '../lib/data'
import { Customer, AlternativeData } from '../types'
import { 
  scoreAllCustomers, 
  getScoreStats, 
  simulateWhatIf,
  generateExplanation,
  ScoringResult, 
  SimulationResult 
} from '../lib/scoring'

// Published app dataset (Layer 4 per DATASET-PIPELINE.md)
export interface PublishedCustomer extends Customer {
  alternativeData: AlternativeData
  scoring: ScoringResult
  explanation: string
}

// Compute scores for all customers
function computePublishedData(): PublishedCustomer[] {
  const scoringResults = scoreAllCustomers(CUSTOMERS, ALTERNATIVE_DATA, PRODUCTS)
  
  return CUSTOMERS.map(customer => {
    const altData = ALTERNATIVE_DATA[customer.id]
    const score = scoringResults.find(r => r.customerId === customer.id)!
    const product = PRODUCTS.find(p => p.id === score.recommendedProduct)!
    const explanation = generateExplanation(customer, altData, score, product)
    
    return {
      ...customer,
      alternativeData: altData,
      scoring: score,
      explanation
    }
  })
}

// Cached published dataset
let publishedData: PublishedCustomer[] | null = null

function getPublishedData(): PublishedCustomer[] {
  if (!publishedData) {
    publishedData = computePublishedData()
  }
  return publishedData
}

// Get all published customers
export function getAllCustomers(): PublishedCustomer[] {
  return getPublishedData()
}

// Get customer by ID
export function getCustomerById(id: string): PublishedCustomer | undefined {
  return getPublishedData().find(c => c.id === id)
}

// Get dashboard stats
export function getDashboardStats() {
  const customers = getPublishedData()
  const results = customers.map(c => c.scoring)
  const stats = getScoreStats(results)
  
  // Product distribution
  const productCount: Record<string, number> = {}
  results.forEach(r => {
    productCount[r.recommendedProduct] = (productCount[r.recommendedProduct] || 0) + 1
  })
  
  const productDistribution = PRODUCTS.map(p => ({
    product: p,
    count: productCount[p.id] || 0
  }))
  
  return {
    stats,
    productDistribution,
    customers: customers.slice(0, 10) // Top 10 for list view
  }
}

// Run simulation for a customer
export function runSimulation(
  customerId: string, 
  variable: "partner_channel" | "product_offer" | "early_reaction",
  newValue: string
): SimulationResult | undefined {
  const customer = CUSTOMERS.find(c => c.id === customerId)
  const altData = ALTERNATIVE_DATA[customerId]
  
  if (!customer || !altData) return undefined
  
  return simulateWhatIf(customer, altData, PRODUCTS, { variable, newValue })
}

// Get hero case (highest scoring customer)
export function getHeroCase(): PublishedCustomer {
  const customers = getPublishedData()
  return customers.reduce((best, c) => 
    c.scoring.overallScore > best.scoring.overallScore ? c : best
  )
}

// Export data for pitch view
export function getExportData(customerId: string) {
  const customer = getCustomerById(customerId)
  if (!customer) return null
  
  const product = PRODUCTS.find(p => p.id === customer.scoring.recommendedProduct)!
  
  return {
    customer,
    product,
    score: customer.scoring,
    explanation: customer.explanation,
    eligibleProducts: getEligibleProducts(customer.income)
  }
}
