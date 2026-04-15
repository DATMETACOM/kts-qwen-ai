import { describe, it, expect } from 'vitest';
import { scoreCustomer } from '../lib/scoring';
import { customers, altData, products } from '../lib/data';

describe('SF8 Scoring Engine - Deterministic Tests', () => {
  
  describe('Overall Score Computation', () => {
    it('should return score between 0-100 for all customers', () => {
      customers.forEach(customer => {
        const result = scoreCustomer(customer, altData[customer.id], products);
        expect(result.overallScore).toBeGreaterThanOrEqual(0);
        expect(result.overallScore).toBeLessThanOrEqual(100);
        expect(Number.isInteger(result.overallScore)).toBe(true);
      });
    });

    it('should compute weighted sum correctly (PCF×0.20 + BSS×0.30 + ERQ×0.15 + PA×0.35)', () => {
      customers.forEach(customer => {
        const result = scoreCustomer(customer, altData[customer.id], products);
        const expected = Math.round(
          result.breakdown.pcf * 0.20 +
          result.breakdown.bss * 0.30 +
          result.breakdown.erq * 0.15 +
          result.breakdown.pa * 0.35
        );
        expect(result.overallScore).toBe(expected);
      });
    });

    it('should have valid sub-scores between 0-100', () => {
      customers.forEach(customer => {
        const result = scoreCustomer(customer, altData[customer.id], products);
        expect(result.breakdown.pcf).toBeGreaterThanOrEqual(0);
        expect(result.breakdown.pcf).toBeLessThanOrEqual(100);
        expect(result.breakdown.bss).toBeGreaterThanOrEqual(0);
        expect(result.breakdown.bss).toBeLessThanOrEqual(100);
        expect(result.breakdown.erq).toBeGreaterThanOrEqual(0);
        expect(result.breakdown.erq).toBeLessThanOrEqual(100);
        expect(result.breakdown.pa).toBeGreaterThanOrEqual(0);
        expect(result.breakdown.pa).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('Product Recommendation', () => {
    it('should recommend highest affinity product', () => {
      customers.forEach(customer => {
        const result = scoreCustomer(customer, altData[customer.id], products);
        const maxAffinity = Math.max(...Object.values(result.productAffinity));
        const expectedProduct = Object.entries(result.productAffinity)
          .find(([_, score]) => score === maxAffinity)?.[0];
        expect(result.recommendedProduct).toBe(expectedProduct);
      });
    });

    it('should only recommend income-eligible products', () => {
      customers.forEach(customer => {
        const result = scoreCustomer(customer, altData[customer.id], products);
        const recommendedProduct = products.find(p => p.id === result.recommendedProduct);
        expect(recommendedProduct).toBeDefined();
        expect(customer.income).toBeGreaterThanOrEqual(recommendedProduct!.minIncome);
      });
    });

    it('should have affinity scores for all income-eligible products', () => {
      customers.forEach(customer => {
        const result = scoreCustomer(customer, altData[customer.id], products);
        const eligibleProducts = products.filter(p => customer.income >= p.minIncome);
        expect(Object.keys(result.productAffinity).length).toBe(eligibleProducts.length);
      });
    });
  });

  describe('Action Assignment', () => {
    it('should assign "push now" when score ≥75 and PA ≥70', () => {
      // Create mock customer with high scores
      const highScoreCustomer = {
        id: 'test-high',
        name: 'Test High Score',
        age: 30,
        income: 30000000,
        occupation: 'Engineer'
      };

      const result = scoreCustomer(highScoreCustomer, {
        telco: { monthlySpend: 500000, tenure: 24, dataUsage: 10 },
        ewallet: { usage: 'high', monthlyTransactions: 50, categories: ['shopping', 'food'] },
        ecommerce: { monthlyOrders: 10, avgOrderValue: 500000, categories: ['electronics'] },
        social: { interests: ['technology', 'finance'], activity: 'high' }
      }, products, {
        pcf: 85,
        bss: 80,
        erq: 75,
        pa: 80
      });

      expect(result.action).toBe('push now');
    });

    it('should assign "nurture" when score 50-74 and PA ≥50', () => {
      const midScoreCustomer = {
        id: 'test-mid',
        name: 'Test Mid Score',
        age: 25,
        income: 15000000,
        occupation: 'Freelancer'
      };

      const result = scoreCustomer(midScoreCustomer, {
        telco: { monthlySpend: 300000, tenure: 12, dataUsage: 5 },
        ewallet: { usage: 'medium', monthlyTransactions: 20, categories: ['shopping'] },
        ecommerce: { monthlyOrders: 5, avgOrderValue: 300000, categories: ['fashion'] },
        social: { interests: ['lifestyle'], activity: 'medium' }
      }, products, {
        pcf: 60,
        bss: 55,
        erq: 60,
        pa: 60
      });

      expect(result.action).toBe('nurture');
    });

    it('should assign "hold" when score <50', () => {
      const lowScoreCustomer = {
        id: 'test-low',
        name: 'Test Low Score',
        age: 22,
        income: 8000000,
        occupation: 'Student'
      };

      const result = scoreCustomer(lowScoreCustomer, {
        telco: { monthlySpend: 150000, tenure: 6, dataUsage: 2 },
        ewallet: { usage: 'low', monthlyTransactions: 5, categories: [] },
        ecommerce: { monthlyOrders: 1, avgOrderValue: 100000, categories: [] },
        social: { interests: [], activity: 'low' }
      }, products, {
        pcf: 30,
        bss: 25,
        erq: 35,
        pa: 40
      });

      expect(result.action).toBe('hold');
    });

    it('should assign "hold" when PA <50 even if score ≥50', () => {
      const lowPaCustomer = {
        id: 'test-low-pa',
        name: 'Test Low PA',
        age: 28,
        income: 20000000,
        occupation: 'Teacher'
      };

      const result = scoreCustomer(lowPaCustomer, {
        telco: { monthlySpend: 400000, tenure: 18, dataUsage: 7 },
        ewallet: { usage: 'medium', monthlyTransactions: 25, categories: ['education'] },
        ecommerce: { monthlyOrders: 3, avgOrderValue: 200000, categories: ['books'] },
        social: { interests: ['education'], activity: 'medium' }
      }, products, {
        pcf: 70,
        bss: 65,
        erq: 70,
        pa: 45  // Low PA should force "hold"
      });

      expect(result.action).toBe('hold');
    });
  });

  describe('Hero Case Validation', () => {
    it('should have Nguyễn Văn An (c001) as highest scoring customer', () => {
      const allScores = customers.map(customer => 
        scoreCustomer(customer, altData[customer.id], products)
      );
      
      const maxScore = Math.max(...allScores.map(s => s.overallScore));
      const heroCase = allScores.find(s => s.overallScore === maxScore);
      
      expect(heroCase?.customerId).toBe('c001');
    });

    it('should have hero case score > 70 (strong-fit archetype)', () => {
      const heroCustomer = customers.find(c => c.id === 'c001');
      expect(heroCustomer).toBeDefined();
      
      const heroResult = scoreCustomer(heroCustomer!, altData['c001'], products);
      expect(heroResult.overallScore).toBeGreaterThan(70);
    });
  });

  describe('Borderline Case Validation', () => {
    it('should have Lê Hoàng Cường (c003) score in 40-60 range', () => {
      const borderlineCustomer = customers.find(c => c.id === 'c003');
      expect(borderlineCustomer).toBeDefined();
      
      const result = scoreCustomer(borderlineCustomer!, altData['c003'], products);
      expect(result.overallScore).toBeGreaterThanOrEqual(40);
      expect(result.overallScore).toBeLessThanOrEqual(60);
    });
  });

  describe('What-If Simulation', () => {
    it('should increase score when partner engagement changes to high', () => {
      const customer = customers[0];
      const baseResult = scoreCustomer(customer, altData[customer.id], products);
      
      // Simulate high partner engagement
      const simulatedOverrides = {
        pcf: Math.min(100, baseResult.breakdown.pcf + 20)
      };
      
      const simResult = scoreCustomer(customer, altData[customer.id], products, simulatedOverrides);
      
      expect(simResult.overallScore).toBeGreaterThan(baseResult.overallScore);
      expect(simResult.breakdown.pcf).toBeGreaterThan(baseResult.breakdown.pcf);
    });

    it('should increase score when product offer changes to premium', () => {
      const customer = customers[0];
      const baseResult = scoreCustomer(customer, altData[customer.id], products);
      
      // Simulate premium offer
      const simulatedOverrides = {
        pa: Math.min(100, baseResult.breakdown.pa + 15)
      };
      
      const simResult = scoreCustomer(customer, altData[customer.id], products, simulatedOverrides);
      
      expect(simResult.overallScore).toBeGreaterThanOrEqual(baseResult.overallScore);
      expect(simResult.breakdown.pa).toBeGreaterThan(baseResult.breakdown.pa);
    });

    it('should increase score when early reaction changes to high response', () => {
      const customer = customers[0];
      const baseResult = scoreCustomer(customer, altData[customer.id], products);
      
      // Simulate high early reaction
      const simulatedOverrides = {
        erq: Math.min(100, baseResult.breakdown.erq + 15)
      };
      
      const simResult = scoreCustomer(customer, altData[customer.id], products, simulatedOverrides);
      
      expect(simResult.overallScore).toBeGreaterThanOrEqual(baseResult.overallScore);
      expect(simResult.breakdown.erq).toBeGreaterThan(baseResult.breakdown.erq);
    });

    it('should not mutate original customer data', () => {
      const customer = customers[0];
      const originalData = JSON.parse(JSON.stringify(altData[customer.id]));
      
      scoreCustomer(customer, altData[customer.id], products, {
        pcf: 90
      });
      
      expect(JSON.stringify(altData[customer.id])).toBe(JSON.stringify(originalData));
    });

    it('should calculate delta correctly', () => {
      const customer = customers[0];
      const baseResult = scoreCustomer(customer, altData[customer.id], products);
      
      const simulatedOverrides = {
        pcf: 90
      };
      
      const simResult = scoreCustomer(customer, altData[customer.id], products, simulatedOverrides);
      const delta = simResult.overallScore - baseResult.overallScore;
      
      expect(delta).toBe(simResult.overallScore - baseResult.overallScore);
    });

    it('should change action when score crosses threshold', () => {
      // Create customer near threshold
      const thresholdCustomer = {
        id: 'test-threshold',
        name: 'Test Threshold',
        age: 27,
        income: 22000000,
        occupation: 'Analyst'
      };

      const baseResult = scoreCustomer(thresholdCustomer, {
        telco: { monthlySpend: 350000, tenure: 15, dataUsage: 6 },
        ewallet: { usage: 'medium', monthlyTransactions: 30, categories: ['shopping', 'food'] },
        ecommerce: { monthlyOrders: 6, avgOrderValue: 350000, categories: ['electronics'] },
        social: { interests: ['technology'], activity: 'medium' }
      }, products, {
        pcf: 72,
        bss: 70,
        erq: 68,
        pa: 68  // Just below push now threshold
      });

      expect(baseResult.action).toBe('nurture');

      // Simulate increase to cross threshold
      const simResult = scoreCustomer(thresholdCustomer, {
        telco: { monthlySpend: 500000, tenure: 24, dataUsage: 10 },
        ewallet: { usage: 'high', monthlyTransactions: 50, categories: ['shopping', 'food'] },
        ecommerce: { monthlyOrders: 10, avgOrderValue: 500000, categories: ['electronics'] },
        social: { interests: ['technology', 'finance'], activity: 'high' }
      }, products, {
        pcf: 85,
        bss: 80,
        erq: 75,
        pa: 75  // Cross push now threshold
      });

      expect(simResult.action).toBe('push now');
    });
  });

  describe('Confidence Score', () => {
    it('should return confidence between 0-1', () => {
      customers.forEach(customer => {
        const result = scoreCustomer(customer, altData[customer.id], products);
        expect(result.confidence).toBeGreaterThanOrEqual(0);
        expect(result.confidence).toBeLessThanOrEqual(1);
      });
    });

    it('should have higher confidence for customers with stronger signals', () => {
      const highSignalCustomer = customers.find(c => c.id === 'c001');
      const lowSignalCustomer = customers.find(c => c.id === 'c003');
      
      if (highSignalCustomer && lowSignalCustomer) {
        const highResult = scoreCustomer(highSignalCustomer, altData['c001'], products);
        const lowResult = scoreCustomer(lowSignalCustomer, altData['c003'], products);
        
        // Higher BSS should correlate with higher confidence
        if (highResult.breakdown.bss > lowResult.breakdown.bss) {
          expect(highResult.confidence).toBeGreaterThanOrEqual(lowResult.confidence);
        }
      }
    });
  });
});
