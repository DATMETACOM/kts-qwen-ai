import { describe, expect, it } from 'vitest'
import { ALTERNATIVE_DATA, CUSTOMERS, PRODUCTS } from '../src/lib/data'
import { getScoreStats, scoreAllCustomers, scoreCustomer, simulateWhatIf } from '../src/lib/scoring'

describe('SF8 scoring engine', () => {
  it('returns valid score envelope for every customer', () => {
    for (const customer of CUSTOMERS) {
      const score = scoreCustomer(customer, ALTERNATIVE_DATA[customer.id], PRODUCTS)
      expect(score.overallScore).toBeGreaterThanOrEqual(0)
      expect(score.overallScore).toBeLessThanOrEqual(100)
      expect(score.confidence).toBeGreaterThanOrEqual(0)
      expect(score.confidence).toBeLessThanOrEqual(1)
      expect(['push now', 'nurture', 'hold']).toContain(score.action)
    }
  })

  it('keeps weighted formula consistent', () => {
    for (const customer of CUSTOMERS) {
      const score = scoreCustomer(customer, ALTERNATIVE_DATA[customer.id], PRODUCTS)
      const expected = Math.round(
        (score.breakdown.pcf * 0.2) +
          (score.breakdown.bss * 0.3) +
          (score.breakdown.erq * 0.15) +
          (score.breakdown.pa * 0.35)
      )
      expect(score.overallScore).toBe(expected)
    }
  })

  it('supports manual simulation overrides', () => {
    const customer = CUSTOMERS[0]
    const base = scoreCustomer(customer, ALTERNATIVE_DATA[customer.id], PRODUCTS)
    const boosted = scoreCustomer(customer, ALTERNATIVE_DATA[customer.id], PRODUCTS, { pcf: 95, pa: 90 })

    expect(boosted.overallScore).toBeGreaterThanOrEqual(base.overallScore)
  })

  it('produces portfolio stats with matching totals', () => {
    const scores = scoreAllCustomers(CUSTOMERS, ALTERNATIVE_DATA, PRODUCTS)
    const stats = getScoreStats(scores)

    expect(stats.total).toBe(scores.length)
    expect(stats.pushNow + stats.nurture + stats.hold).toBe(scores.length)
  })

  it('returns simulation delta correctly', () => {
    const customer = CUSTOMERS[0]
    const simulation = simulateWhatIf(customer, ALTERNATIVE_DATA[customer.id], PRODUCTS, {
      variable: 'partner_channel',
      newValue: 'high_engagement'
    })

    expect(simulation.overallScore - simulation.baseScore).toBe(simulation.delta)
  })
})
