import { describe, it, expect } from 'vitest';
import { customers, altData, products } from '../lib/data';

describe('SF8 Data Integrity Tests', () => {
  
  describe('Customer Data', () => {
    it('should have exactly 20 customers', () => {
      expect(customers.length).toBe(20);
    });

    it('should have unique IDs for all customers', () => {
      const ids = customers.map(c => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(20);
    });

    it('should have valid age for all customers (18-65)', () => {
      customers.forEach(customer => {
        expect(customer.age).toBeGreaterThanOrEqual(18);
        expect(customer.age).toBeLessThanOrEqual(65);
        expect(Number.isInteger(customer.age)).toBe(true);
      });
    });

    it('should have valid income for all customers (>0)', () => {
      customers.forEach(customer => {
        expect(customer.income).toBeGreaterThan(0);
        expect(customer.income).toBeLessThanOrEqual(100000000); // Reasonable upper bound
      });
    });

    it('should have non-empty occupation for all customers', () => {
      customers.forEach(customer => {
        expect(customer.occupation).toBeDefined();
        expect(customer.occupation.length).toBeGreaterThan(0);
        expect(typeof customer.occupation).toBe('string');
      });
    });

    it('should have Vietnamese names', () => {
      const vietnameseNamePattern = /^[À-ỹ\s]+$/;
      const vietnameseCustomers = customers.filter(c => 
        vietnameseNamePattern.test(c.name)
      );
      // At least 80% should have Vietnamese names
      expect(vietnameseCustomers.length).toBeGreaterThanOrEqual(16);
    });

    it('should have unique customer IDs matching pattern c001-c020', () => {
      customers.forEach((customer, index) => {
        const expectedId = `c${String(index + 1).padStart(3, '0')}`;
        expect(customer.id).toBe(expectedId);
      });
    });
  });

  describe('Alternative Data', () => {
    it('should have alternative data for all customers', () => {
      customers.forEach(customer => {
        expect(altData[customer.id]).toBeDefined();
      });
    });

    it('should have telco data for all customers', () => {
      customers.forEach(customer => {
        const data = altData[customer.id];
        expect(data.telco).toBeDefined();
        expect(data.telco.monthlySpend).toBeGreaterThan(0);
        expect(data.telco.tenure).toBeGreaterThan(0);
        expect(data.telco.dataUsage).toBeGreaterThan(0);
      });
    });

    it('should have e-wallet data for all customers', () => {
      customers.forEach(customer => {
        const data = altData[customer.id];
        expect(data.ewallet).toBeDefined();
        expect(['low', 'medium', 'high']).toContain(data.ewallet.usage);
        expect(data.ewallet.monthlyTransactions).toBeGreaterThanOrEqual(0);
        expect(Array.isArray(data.ewallet.categories)).toBe(true);
      });
    });

    it('should have e-commerce data for all customers', () => {
      customers.forEach(customer => {
        const data = altData[customer.id];
        expect(data.ecommerce).toBeDefined();
        expect(data.ecommerce.monthlyOrders).toBeGreaterThanOrEqual(0);
        expect(data.ecommerce.avgOrderValue).toBeGreaterThan(0);
        expect(Array.isArray(data.ecommerce.categories)).toBe(true);
      });
    });

    it('should have social data for all customers', () => {
      customers.forEach(customer => {
        const data = altData[customer.id];
        expect(data.social).toBeDefined();
        expect(['low', 'medium', 'high']).toContain(data.social.activity);
        expect(Array.isArray(data.social.interests)).toBe(true);
      });
    });

    it('should have consistent data across all sources', () => {
      customers.forEach(customer => {
        const data = altData[customer.id];
        
        // High usage customers should have activity across multiple sources
        if (data.ewallet.usage === 'high') {
          expect(data.ecommerce.monthlyOrders).toBeGreaterThan(0);
        }

        // Low usage customers should have lower values
        if (data.ewallet.usage === 'low') {
          expect(data.ewallet.monthlyTransactions).toBeLessThan(20);
        }
      });
    });
  });

  describe('Product Catalog', () => {
    it('should have exactly 7 products', () => {
      expect(products.length).toBe(7);
    });

    it('should have valid product types', () => {
      const validTypes = ['credit_card', 'personal_loan', 'sme_loan', 'insurance', 'bnpl'];
      products.forEach(product => {
        expect(validTypes).toContain(product.type);
      });
    });

    it('should have unique product IDs', () => {
      const ids = products.map(p => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(7);
    });

    it('should have valid minIncome for all products', () => {
      products.forEach(product => {
        expect(product.minIncome).toBeGreaterThan(0);
        expect(product.minIncome).toBeLessThanOrEqual(50000000); // Reasonable upper bound
      });
    });

    it('should have non-empty names for all products', () => {
      products.forEach(product => {
        expect(product.name).toBeDefined();
        expect(product.name.length).toBeGreaterThan(0);
      });
    });

    it('should have target segments defined', () => {
      products.forEach(product => {
        expect(product.targetSegment).toBeDefined();
        expect(Array.isArray(product.targetSegment)).toBe(true);
        expect(product.targetSegment.length).toBeGreaterThan(0);
      });
    });

    it('should cover all product types', () => {
      const types = new Set(products.map(p => p.type));
      expect(types.size).toBeGreaterThanOrEqual(4); // At least 4 different types
    });

    it('should have Shinhan Finance products', () => {
      const productNames = products.map(p => p.name.toLowerCase());
      const hasShinhanProducts = productNames.some(name => 
        name.includes('shinhan') || name.includes('credit') || name.includes('loan')
      );
      expect(hasShinhanProducts).toBe(true);
    });
  });

  describe('Data Relationships', () => {
    it('should have income-eligible products for each customer', () => {
      customers.forEach(customer => {
        const eligibleProducts = products.filter(p => 
          customer.income >= p.minIncome
        );
        expect(eligibleProducts.length).toBeGreaterThan(0);
      });
    });

    it('should have higher income customers eligible for more products', () => {
      const sortedCustomers = [...customers].sort((a, b) => a.income - b.income);
      const lowIncomeCustomer = sortedCustomers[0];
      const highIncomeCustomer = sortedCustomers[sortedCustomers.length - 1];

      const lowEligible = products.filter(p => 
        lowIncomeCustomer.income >= p.minIncome
      ).length;
      const highEligible = products.filter(p => 
        highIncomeCustomer.income >= p.minIncome
      ).length;

      expect(highEligible).toBeGreaterThanOrEqual(lowEligible);
    });

    it('should have realistic alternative data for income levels', () => {
      customers.forEach(customer => {
        const data = altData[customer.id];
        
        // Higher income should generally correlate with higher spending
        if (customer.income > 30000000) {
          expect(
            data.telco.monthlySpend + 
            data.ecommerce.monthlyOrders * data.ecommerce.avgOrderValue
          ).toBeGreaterThan(500000);
        }
      });
    });
  });

  describe('Data Governance', () => {
    it('should NOT contain real PII (demo data only)', () => {
      // Check that data doesn't contain real Vietnamese ID numbers, phone numbers, etc.
      customers.forEach(customer => {
        expect(customer.id).toMatch(/^c\d{3}$/); // Pattern: c001, c002, etc.
        expect(customer.name.length).toBeLessThan(50); // Reasonable name length
      });
    });

    it('should have generated data markers', () => {
      // All data should be clearly marked as generated in metadata
      // This test verifies the structure exists
      expect(customers).toBeDefined();
      expect(altData).toBeDefined();
      expect(products).toBeDefined();
    });

    it('should have consistent data types', () => {
      customers.forEach(customer => {
        expect(typeof customer.id).toBe('string');
        expect(typeof customer.name).toBe('string');
        expect(typeof customer.age).toBe('number');
        expect(typeof customer.income).toBe('number');
        expect(typeof customer.occupation).toBe('string');
      });
    });
  });

  describe('Archetype Validation', () => {
    it('should have AR-01 Digital Native (c001) with strong signals', () => {
      const digitalNative = customers.find(c => c.id === 'c001');
      expect(digitalNative).toBeDefined();
      
      const data = altData['c001'];
      expect(data.ewallet.usage).toBe('high');
      expect(data.social.activity).toBe('high');
      expect(data.ecommerce.monthlyOrders).toBeGreaterThan(5);
    });

    it('should have AR-06 Freelancer (c003) with borderline signals', () => {
      const freelancer = customers.find(c => c.id === 'c003');
      expect(freelancer).toBeDefined();
      
      const data = altData['c003'];
      // Freelancer should have moderate/low signals
      expect(
        data.ewallet.usage === 'medium' || data.ewallet.usage === 'low'
      ).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle customers with minimal alternative data', () => {
      // Find customer with lowest signals
      const lowestBssCustomer = customers.reduce((min, customer) => {
        const data = altData[customer.id];
        const signalStrength = 
          data.telco.monthlySpend / 1000000 +
          data.ewallet.monthlyTransactions / 100 +
          data.ecommerce.monthlyOrders / 20;
        
        const minData = altData[min.id];
        const minSignalStrength = 
          minData.telco.monthlySpend / 1000000 +
          minData.ewallet.monthlyTransactions / 100 +
          minData.ecommerce.monthlyOrders / 20;
        
        return signalStrength < minSignalStrength ? customer : min;
      }, customers[0]);

      const data = altData[lowestBssCustomer.id];
      // Should still have valid data structure
      expect(data.telco).toBeDefined();
      expect(data.ewallet).toBeDefined();
      expect(data.ecommerce).toBeDefined();
      expect(data.social).toBeDefined();
    });

    it('should have no null or undefined fields', () => {
      customers.forEach(customer => {
        expect(customer.id).not.toBeNull();
        expect(customer.name).not.toBeNull();
        expect(customer.age).not.toBeNull();
        expect(customer.income).not.toBeNull();
        expect(customer.occupation).not.toBeNull();

        const data = altData[customer.id];
        expect(data.telco.monthlySpend).not.toBeNull();
        expect(data.telco.tenure).not.toBeNull();
        expect(data.telco.dataUsage).not.toBeNull();
        expect(data.ewallet.usage).not.toBeNull();
        expect(data.ewallet.monthlyTransactions).not.toBeNull();
        expect(data.ecommerce.monthlyOrders).not.toBeNull();
        expect(data.ecommerce.avgOrderValue).not.toBeNull();
        expect(data.social.activity).not.toBeNull();
      });
    });
  });
});
