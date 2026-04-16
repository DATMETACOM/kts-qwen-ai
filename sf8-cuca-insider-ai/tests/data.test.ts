import { describe, expect, it } from 'vitest'
import { ALTERNATIVE_DATA, CUSTOMERS, PRODUCTS, getEligibleProducts } from '../src/lib/data'
import { getDashboardStats } from '../src/dataProvider'

describe('SF8 data integrity', () => {
  it('has 20 demo customers', () => {
    expect(CUSTOMERS.length).toBe(20)
  })

  it('keeps customer IDs unique', () => {
    const ids = CUSTOMERS.map((item) => item.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has alternative data for every customer', () => {
    for (const customer of CUSTOMERS) {
      const data = ALTERNATIVE_DATA[customer.id]
      expect(data).toBeDefined()
      expect(data.telco.monthlySpend).toBeGreaterThan(0)
      expect(data.eWallet.monthlyTransactions).toBeGreaterThanOrEqual(0)
      expect(data.ecommerce.monthlyOrders).toBeGreaterThanOrEqual(0)
    }
  })

  it('contains expected product catalog', () => {
    expect(PRODUCTS.length).toBe(7)
    const ids = PRODUCTS.map((item) => item.id)
    expect(ids).toContain('cc-platinum')
    expect(ids).toContain('pl-fast')
  })

  it('returns at least one eligible product per customer', () => {
    for (const customer of CUSTOMERS) {
      const eligible = getEligibleProducts(customer.income)
      expect(eligible.length).toBeGreaterThan(0)
    }
  })

  it('dashboard returns full customer list', () => {
    const { stats, customers } = getDashboardStats()
    expect(customers.length).toBe(CUSTOMERS.length)
    expect(customers.length).toBe(stats.total)
  })
})