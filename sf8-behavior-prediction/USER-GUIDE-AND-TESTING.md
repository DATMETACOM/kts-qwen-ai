# SF8 - User Guide & Testing Documentation

> **Shinhan Finance InnoBoost 2026 | Qwen AI Build Day**
> 
> **Version**: 1.0.0 (PoC Stage)
> 
> **Last Updated**: April 14, 2026

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [User Guide](#user-guide)
3. [Automated Testing](#automated-testing)
4. [Manual Testing Guide](#manual-testing-guide)
5. [Judge Q&A Preparation](#judge-qa-preparation)

---

## Quick Start

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- Modern web browser (Chrome, Firefox, Edge)

### Installation

```bash
# Navigate to project directory
cd sf8-behavior-prediction

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at: `http://localhost:5173`

### First-Time Demo (3 Minutes)

1. **Land on Dashboard** → See 20 customers with scores and actions
2. **Click Hero Case** (Nguyễn Văn An) → View detailed score breakdown
3. **Run Simulation** → Change a variable and see score delta
4. **Export Report** → Generate personalized outreach note

---

## User Guide

### 1. Dashboard View

**URL**: `/` (default landing page)

**Purpose**: Portfolio overview of all 20 demo customers

#### Key Sections

| Section | Description |
|---------|-------------|
| **Stat Cards** | 4 metrics: Total customers, Push Now count, Nurture count, Hold count |
| **Hero Case Highlight** | Highest-scoring customer with quick view |
| **Product Distribution** | Bar chart showing recommended product breakdown |
| **Customer Lead List** | Table with customer name, score, recommended product, action |

#### How to Use

- **Scroll** through the customer list to see all 20 profiles
- **Sort** by clicking column headers (Name, Score, Product, Action)
- **Click any customer** to view their detailed profile
- **Hero Case** is always highlighted at the top for quick access

#### What You'll See

```
┌─────────────────────────────────────────────┐
│  📊 Total: 20  │  🟢 Push: 8  │  🟡 Nurture: 7  │  🔴 Hold: 5  │
├─────────────────────────────────────────────┤
│  🏆 HERO CASE: Nguyễn Văn An - 82/100       │
│  Recommended: Cashback Credit Card          │
│  Action: Push Now                           │
├─────────────────────────────────────────────┤
│  Product Distribution:                      │
│  ████████ Credit Card (8)                   │
│  █████ Personal Loan (5)                    │
│  ███ BNPL (4)                               │
│  ██ Insurance (2)                           │
│  █ SME Loan (1)                             │
├─────────────────────────────────────────────┤
│  Customer List:                             │
│  │ Name           │ Score │ Product   │ Action   │
│  │ Nguyễn Văn An  │  82   │ CC Cashback│ Push    │
│  │ Trần Thị Bình  │  78   │ Personal L │ Push    │
│  │ ...            │  ...  │ ...       │ ...     │
└─────────────────────────────────────────────┘
```

---

### 2. Customer Detail View

**URL**: `/customer/:id` (click any customer from dashboard)

**Purpose**: Deep-dive into a single customer's profile, scores, and AI explanation

#### Key Sections

| Section | Description |
|---------|-------------|
| **Overall Score** | Large score display (0-100) with color coding |
| **Score Breakdown** | 4 bars showing pcf, bss, erq, pa sub-scores |
| **Alternative Data Signals** | Telco, E-Wallet, E-Commerce, Social data summary |
| **AI Explanation** | Qwen-generated reasoning (if Qwen API available) |
| **What-If Simulation** | Inline simulation panel (see Simulation section) |
| **Recommended Action** | Push Now / Nurture / Hold badge |
| **Next Best Product** | Product recommendation with affinity score |

#### How to Use

1. **Review Overall Score** → Understand the customer's total rating
2. **Examine Score Breakdown** → Identify which dimensions are strong/weak
3. **Check Alternative Data** → See raw signals from 4 sources
4. **Read AI Explanation** → Understand the "why" behind the recommendation
5. **Run Simulation** → Test what-if scenarios (see below)
6. **Navigate to Export** → Generate report for this customer

#### Understanding Scores

| Score Family | Abbreviation | What It Measures |
|--------------|--------------|------------------|
| Partner/Channel Fit | PCF | Digital engagement level (0-100) |
| Behavior Signal Strength | BSS | Alternative data quality (0-100) |
| Early Reaction Quality | ERQ | Offer responsiveness (0-100) |
| Product Affinity | PA | Customer-product fit (0-100) |

**Overall Score Formula**:
```
Overall = PCF × 0.20 + BSS × 0.30 + ERQ × 0.15 + PA × 0.35
```

#### Action Thresholds

| Overall Score | Product Affinity | Action |
|---------------|------------------|--------|
| ≥ 75 | ≥ 70 | **Push Now** (immediate contact) |
| 50-74 | ≥ 50 | **Nurture** (build relationship) |
| < 50 OR | < 50 | **Hold** (wait for more data) |

---

### 3. Simulation Workspace

**Purpose**: Test what-if scenarios to understand score sensitivity

#### Available Variables (Exactly 3)

| Variable | Options | What Changes |
|----------|---------|--------------|
| **Partner/Channel Engagement** | Low / High | Modifies PCF score |
| **Product Offer Terms** | Standard / Premium | Modifies PA score |
| **Early Reaction Signal** | Ignored / Clicked / High Response | Modifies ERQ score |

#### How to Use

1. **Select Customer** → Choose from dropdown or use current customer
2. **Choose Variable** → Pick one of the 3 simulation variables
3. **Set New Value** → Change from current value to new value
4. **Run Simulation** → Click "Run" button
5. **View Results** → See before/after score delta

#### Simulation Output

```
┌──────────────────────────────────────┐
│  Simulation Results                  │
├──────────────────────────────────────┤
│  Base Score:      72                 │
│  Simulated Score: 85                 │
│  Delta:          +13 ⬆              │
│                                      │
│  Action Change:                      │
│  Before: Nurture                     │
│  After:  Push Now ✅                 │
└──────────────────────────────────────┘
```

#### What You CANNOT Simulate

❌ Customer profile data (age, income, occupation)
❌ Alternative data inputs (telco spend, e-wallet transactions)
❌ Scoring weights (w1, w2, w3)
❌ Product catalog definitions

**Why?** Simulation is designed to test acquisition strategy levers, not change customer identity.

---

### 4. Export/Pitch View

**Purpose**: Generate printable customer insight report

#### Report Contents

| Section | Content |
|---------|---------|
| Customer Profile | Name, age, income, occupation |
| Score Summary | Overall score + 4 sub-scores |
| Recommended Product | Product name + affinity score |
| Action | Push Now / Nurture / Hold |
| AI Explanation | Qwen-generated reasoning (if available) |
| Outreach Note | Personalized Vietnamese message template |
| Data Disclosure | "Generated demo data for PoC" badge |

#### How to Use

1. **Navigate to Export Tab** → From customer detail or main menu
2. **Review Report** → Check all sections are populated
3. **Print/Save as PDF** → Use browser print function (Ctrl+P)
4. **Use for Pitch** → Present to stakeholders

---

### 5. Qwen AI Integration (Optional)

**Purpose**: Generate natural language explanations and outreach notes

#### When Qwen is Used

✅ Explain why a customer received their score
✅ Explain why a product is recommended
✅ Generate personalized outreach message (Vietnamese)
✅ Summarize simulation results

#### When Qwen is NOT Used

❌ Compute scores (deterministic engine does this)
❌ Decide actions (rule-based thresholds)
❌ Recommend products (affinity calculation)

#### Setup (Optional)

```bash
# Set Qwen API key in .env file
echo "DASHSCOPE_API_KEY=your-key-here" > .env

# Restart dev server
npm run dev
```

**Without Qwen**: App falls back to deterministic explanation templates.

---

### 6. Data Governance

**Important**: This PoC uses **generated demo data**, not real customer data.

#### Data Provenance

| Aspect | Details |
|--------|---------|
| Customer Profiles | Generated with Vietnamese names and realistic profiles |
| Alternative Data | Simulated telco, e-wallet, ecommerce, social signals |
| Products | 7 Shinhan Finance products from public documentation |
| Scores | Computed deterministically from demo data |

#### Disclosure Requirements

All UI includes "Generated demo data" badges to clarify PoC nature.

---

### 7. Troubleshooting

| Issue | Solution |
|-------|----------|
| App won't start | Run `npm install` first |
| Blank page | Check browser console for errors |
| No AI explanation | Qwen API key not set (optional feature) |
| Scores not showing | Check TypeScript compilation (`npm run build`) |
| Port 5173 in use | Change port in `vite.config.ts` |

---

## Automated Testing

### Test Architecture

```
sf8-behavior-prediction/
├── lib/
│   ├── scoring.ts       ← Core scoring engine (testable)
│   ├── data.ts          ← Demo data (testable)
│   └── qwen.ts          ← AI integration (mockable)
└── tests/               ← Create this directory
    ├── scoring.test.ts
    ├── data.test.ts
    └── qwen.test.ts
```

### Test Setup

```bash
# Install testing dependencies
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom

# Add to package.json scripts
# "test": "vitest"
```

### Critical Test Cases

#### 1. Scoring Engine Tests (Deterministic)

```typescript
// Test: Overall score computation
describe('scoreCustomer', () => {
  it('should return score between 0-100', () => {
    const result = scoreCustomer(customer, altData, products);
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
  });

  it('should compute weighted sum correctly', () => {
    // PCF × 0.20 + BSS × 0.30 + ERQ × 0.15 + PA × 0.35
    const result = scoreCustomer(customer, altData, products);
    const expected = 
      result.breakdown.pcf * 0.20 +
      result.breakdown.bss * 0.30 +
      result.breakdown.erq * 0.15 +
      result.breakdown.pa * 0.35;
    expect(result.overallScore).toBeCloseTo(expected, 0);
  });

  it('should recommend highest affinity product', () => {
    const result = scoreCustomer(customer, altData, products);
    const maxAffinity = Math.max(...Object.values(result.productAffinity));
    expect(result.recommendedProduct).toBe(
      Object.entries(result.productAffinity)
        .find(([_, score]) => score === maxAffinity)?.[0]
    );
  });

  it('should assign correct action based on thresholds', () => {
    // Test push now case
    const highScoreCustomer = { /* mock data with score ≥75, pa ≥70 */ };
    const result = scoreCustomer(highScoreCustomer, altData, products);
    expect(result.action).toBe('push now');

    // Test nurture case
    const midScoreCustomer = { /* mock data with score 50-74, pa ≥50 */ };
    const result = scoreCustomer(midScoreCustomer, altData, products);
    expect(result.action).toBe('nurture');

    // Test hold case
    const lowScoreCustomer = { /* mock data with score <50 or pa <50 */ };
    const result = scoreCustomer(lowScoreCustomer, altData, products);
    expect(result.action).toBe('hold');
  });
});
```

#### 2. Data Integrity Tests

```typescript
describe('demo data', () => {
  it('should have 20 customers', () => {
    expect(customers.length).toBe(20);
  });

  it('should have unique IDs for all customers', () => {
    const ids = customers.map(c => c.id);
    expect(new Set(ids).size).toBe(20);
  });

  it('should have valid income for all customers', () => {
    customers.forEach(c => {
      expect(c.income).toBeGreaterThan(0);
    });
  });

  it('should have alternative data for all customers', () => {
    customers.forEach(c => {
      expect(altData[c.id]).toBeDefined();
      expect(altData[c.id].telco).toBeDefined();
      expect(altData[c.id].ewallet).toBeDefined();
      expect(altData[c.id].ecommerce).toBeDefined();
      expect(altData[c.id].social).toBeDefined();
    });
  });

  it('should have 7 products in catalog', () => {
    expect(products.length).toBe(7);
  });

  it('should have valid product types', () => {
    const validTypes = ['credit_card', 'personal_loan', 'sme_loan', 'insurance', 'bnpl'];
    products.forEach(p => {
      expect(validTypes).toContain(p.type);
    });
  });
});
```

#### 3. Simulation Tests

```typescript
describe('what-if simulation', () => {
  it('should change score when partner engagement changes', () => {
    const baseResult = scoreCustomer(customer, altData, products);
    const simulatedAltData = { ...altData, pcf: simulateHighPcf(altData) };
    const simResult = scoreCustomer(customer, simulatedAltData, products);
    
    expect(simResult.overallScore).not.toBe(baseResult.overallScore);
    expect(simResult.overallScore).toBeGreaterThan(baseResult.overallScore);
  });

  it('should not change customer profile data', () => {
    const baseProfile = { ...customer };
    scoreCustomer(customer, altData, products, { 
      simulation: { variable: 'partner_channel', value: 'high' } 
    });
    expect(customer).toEqual(baseProfile); // Immutable
  });

  it('should only allow 3 simulation variables', () => {
    const validVars = ['partner_channel', 'product_offer', 'early_reaction'];
    // Test that invalid variables are rejected
  });
});
```

#### 4. Hero Case Validation Tests

```typescript
describe('hero case', () => {
  it('should have highest score among all customers', () => {
    const allScores = customers.map(c => scoreCustomer(c, altData[c.id], products));
    const maxScore = Math.max(...allScores.map(s => s.overallScore));
    const heroCase = allScores.find(s => s.overallScore === maxScore);
    
    expect(heroCase.customerId).toBe('c001'); // Nguyễn Văn An
  });

  it('should have score > 70 (strong-fit archetype)', () => {
    const heroResult = scoreCustomer(heroCustomer, altData['c001'], products);
    expect(heroResult.overallScore).toBeGreaterThan(70);
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- scoring.test.ts

# Watch mode (for development)
npm test -- --watch
```

---

## Manual Testing Guide

### Pre-Test Checklist

- [ ] `npm install` completed successfully
- [ ] `npm run dev` started without errors
- [ ] App accessible at `http://localhost:5173`
- [ ] Browser console has no critical errors

### Test Workflow (15 Minutes)

#### Test 1: Dashboard Load (2 minutes)

**Steps**:
1. Open `http://localhost:5173`
2. Verify page loads within 3 seconds
3. Check 4 stat cards are visible
4. Verify hero case is highlighted
5. Confirm customer list shows 20 entries

**Expected**:
- ✅ All stat cards present (Total: 20, Push/Nurture/Hold counts)
- ✅ Hero case shows Nguyễn Văn An with highest score
- ✅ Product distribution chart visible
- ✅ Customer table has 20 rows with name, score, product, action

**Pass/Fail**: ___

---

#### Test 2: Customer Detail Navigation (3 minutes)

**Steps**:
1. Click on Nguyễn Văn An (hero case) from dashboard
2. Wait for customer detail page to load
3. Verify all sections are populated
4. Check score breakdown bars are visible
5. Verify alternative data signals are displayed
6. Check AI explanation section (may show fallback if no Qwen API)

**Expected**:
- ✅ Overall score displayed prominently (should be > 70)
- ✅ 4 sub-score bars visible (PCF, BSS, ERQ, PA)
- ✅ Telco data: monthly spend, tenure, data usage
- ✅ E-wallet data: usage level, monthly transactions, categories
- ✅ E-commerce data: monthly orders, avg order value, categories
- ✅ Social data: interests, activity level
- ✅ AI explanation present (or fallback template)
- ✅ Recommended product displayed
- ✅ Action badge visible (Push Now / Nurture / Hold)

**Pass/Fail**: ___

---

#### Test 3: What-If Simulation (4 minutes)

**Test 3A: Partner/Channel Engagement**

**Steps**:
1. From customer detail, scroll to simulation panel
2. Select variable: "Partner/Channel Engagement"
3. Change value to "High Engagement"
4. Click "Run Simulation"
5. Record base score, simulated score, delta

**Expected**:
- ✅ Simulation panel loads
- ✅ Variable selector shows 3 options
- ✅ After running, base score and simulated score both visible
- ✅ Delta is calculated correctly (simulated - base)
- ✅ Action change is displayed (if applicable)

**Pass/Fail**: ___

**Test 3B: Product Offer Terms**

**Steps**:
1. Reset simulation
2. Select variable: "Product Offer Terms"
3. Change to "Premium"
4. Run simulation
5. Observe score change

**Expected**:
- ✅ Score increases (premium offer should improve affinity)
- ✅ Recommended product may change if affinity shifts

**Pass/Fail**: ___

**Test 3C: Early Reaction Signal**

**Steps**:
1. Reset simulation
2. Select variable: "Early Reaction Signal"
3. Change to "High Response"
4. Run simulation
5. Observe score change

**Expected**:
- ✅ Score increases (high response improves ERQ)
- ✅ Delta is smaller than partner/channel simulation (ERQ has lower weight)

**Pass/Fail**: ___

---

#### Test 4: Export Report (2 minutes)

**Steps**:
1. Navigate to Export/Pitch tab
2. Verify report sections are populated
3. Check outreach note is present (Vietnamese text)
4. Use browser Print (Ctrl+P) to preview PDF
5. Verify "Generated demo data" disclosure is visible

**Expected**:
- ✅ Customer profile summary present
- ✅ Score breakdown included
- ✅ Product recommendation visible
- ✅ AI explanation included (or fallback)
- ✅ Outreach note in Vietnamese
- ✅ Data disclosure badge visible
- ✅ Print preview shows complete report

**Pass/Fail**: ___

---

#### Test 5: Multiple Customer Flow (2 minutes)

**Steps**:
1. Navigate back to dashboard
2. Click on a different customer (e.g., Lê Hoàng Cường - c003)
3. Verify customer detail loads with correct data
4. Check score is in expected range (40-60 for borderline archetype)
5. Run a quick simulation
6. Navigate back to dashboard

**Expected**:
- ✅ Correct customer data displayed
- ✅ Score matches expected archetype range
- ✅ Simulation works for any customer
- ✅ Navigation back to dashboard works
- ✅ No stale data from previous customer

**Pass/Fail**: ___

---

#### Test 6: Edge Cases (2 minutes)

**Steps**:
1. Try to access non-existent customer: `/customer/c999`
2. Check error handling
3. Refresh browser page
4. Verify app state is preserved
5. Resize browser window (mobile view)
6. Check responsive design

**Expected**:
- ✅ 404 or graceful error for non-existent customer
- ✅ Page refresh doesn't lose data (deterministic recomputation)
- ✅ App remains functional on smaller screens
- ✅ No critical console errors

**Pass/Fail**: ___

---

### Test Results Summary

| Test | Description | Status | Notes |
|------|-------------|--------|-------|
| 1 | Dashboard Load | [ ] Pass / [ ] Fail | |
| 2A | Customer Detail - Hero Case | [ ] Pass / [ ] Fail | |
| 2B | Customer Detail - Borderline Case | [ ] Pass / [ ] Fail | |
| 3A | Simulation - Partner/Channel | [ ] Pass / [ ] Fail | |
| 3B | Simulation - Product Offer | [ ] Pass / [ ] Fail | |
| 3C | Simulation - Early Reaction | [ ] Pass / [ ] Fail | |
| 4 | Export Report | [ ] Pass / [ ] Fail | |
| 5 | Multiple Customer Flow | [ ] Pass / [ ] Fail | |
| 6 | Edge Cases | [ ] Pass / [ ] Fail | |

**Overall Result**: ___ / 9 tests passed

---

## Judge Q&A Preparation

### Category 1: Problem & Solution

#### Q1: Why alternative data? Why not traditional credit scoring?

**Answer**:
Traditional credit scoring requires internal transaction history at Shinhan. New customers have **zero internal data** - no accounts, no transactions, no behavior patterns. Alternative data fills this gap:
- **Telco**: Shows financial stability (consistent monthly spend)
- **E-Wallet**: Shows transaction behavior (frequency, categories)
- **E-Commerce**: Shows spending capacity and interests
- **Social**: Shows lifestyle and engagement

**Key point**: We're not replacing credit scoring - we're enabling **first-time** customer assessment when no internal data exists.

---

#### Q2: How is this different from what banks already do?

**Answer**:
Most banks use alternative data informally (manual review). SF8 provides:
1. **Structured scoring**: Deterministic, auditable formula (not gut feeling)
2. **Transparency**: Every score has breakdown (PCF, BSS, ERQ, PA)
3. **AI explanation**: Natural language reasoning (not black box)
4. **Simulation**: Test acquisition strategies before executing
5. **Governance**: Generated data with provenance markers (not real PII)

**Competitive advantage**: Deterministic-first + AI explanation = transparent AND explainable.

---

#### Q3: What if the customer doesn't consent to alternative data usage?

**Answer**:
This is a valid concern. In production:
- **Explicit consent** required before accessing alternative data
- **Opt-in model**: Customer chooses to share telco, e-wallet, etc. data
- **Value exchange**: Customer gets better product recommendations
- **Regulatory compliance**: Vietnam data protection laws apply

**PoC note**: Our demo uses generated data to illustrate the approach. Real deployment requires consent framework.

---

### Category 2: Technical Approach

#### Q4: Why deterministic scoring instead of ML?

**Answer**:
Three reasons:

1. **Transparency**: Every score is computed via formula anyone can audit. ML models are black boxes.
2. **Regulatory compliance**: Financial decisions require explainability. Deterministic logic provides clear reasoning.
3. **PoC stage**: We're demonstrating the approach first. ML training requires real customer data and validation.

**Qwen's role**: Explain the "why" behind deterministic scores, not replace the scoring engine.

**Future**: ML model can replace deterministic weights once validated with real data.

---

#### Q5: How accurate are the predictions?

**Answer**:
**Honest answer**: We cannot claim predictive accuracy for this PoC because:
- Demo uses **generated data**, not real customer data
- Scores are **relative within demo set**, not absolute indicators
- No ML training has occurred (rule-based weights only)

**What we can say**: The scoring structure follows documented weights and thresholds. Once Shinhan provides real customer data and outcomes, we can:
- Train ML model to optimize weights
- Validate against actual product adoption
- Measure precision, recall, AUC metrics

**Next step**: InnoBoost POC contract (200M VND) would fund validation with real data.

---

#### Q6: How does Qwen work in the system?

**Answer**:
Qwen is used for **explanation only**:

```
Customer Data + Alternative Data
         ↓
  Deterministic Scoring Engine (our code)
         ↓
  Score: 82/100, Action: Push Now, Product: Credit Card
         ↓
  Qwen API (DashScope)
         ↓
  "This customer shows high e-commerce activity and consistent 
   telco spending, making them a strong fit for Cashback Credit Card..."
```

**Qwen does NOT**:
- Compute scores (deterministic engine does)
- Decide actions (threshold rules do)
- Recommend products (affinity calculation does)

**Why this matters**: Financial decisions cannot be AI black boxes. Deterministic scoring provides audit trail.

---

#### Q7: What if Qwen API is unavailable?

**Answer**:
App falls back to **deterministic explanation templates**:

```typescript
// Without Qwen:
const explanation = `Customer shows strong signals in:
  - Telco: ${telco.monthlySpend.toLocaleString()} VND/month
  - E-wallet: ${ewallet.usage} usage level
  Recommended: ${product.name}`;
```

**Core functionality** (scoring, action, product recommendation) works without Qwen. Only the natural language explanation is affected.

---

### Category 3: Business Impact

#### Q8: What's the ROI for Shinhan?

**Answer**:
Three measurable benefits:

1. **New customer acquisition**: Convert customers who currently can't be assessed
   - Assume 10,000 new customers/year
   - Current: ~30% can be assessed (existing data)
   - With SF8: ~60% can be assessed (alternative data)
   - **Impact**: +3,000 assessable customers/year

2. **Faster time-to-offer**: Reduce assessment time from weeks to minutes
   - Current: Manual review takes 2-4 weeks
   - With SF8: Instant scoring from alternative data
   - **Impact**: 95% faster assessment

3. **Better product matching**: Increase product adoption rate
   - Current: Generic offers (low conversion)
   - With SF8: Personalized based on alternative data signals
   - **Impact**: Higher conversion rate (to be validated with real data)

**PoC limitation**: These are projections. Actual ROI requires validation with Shinhan's real customer data.

---

#### Q9: How does this integrate with Shinhan's existing systems?

**Answer**:
**Current PoC**: Standalone app, no integration.

**InnoBoost POC plan**:
1. **Partner API integration**: Connect to telco/e-wallet/ecommerce providers
2. **Shinhan core banking**: Read customer profile (with consent)
3. **Product catalog**: Sync with Shinhan's live product offerings
4. **CRM system**: Push recommended actions to relationship managers

**Architecture**:
```
[Partner APIs] → [SF8 Scoring Engine] → [Shinhan CRM]
                      ↓
                [Qwen Explanation]
                      ↓
                [RM Dashboard / Customer App]
```

**Timeline**: 3-6 months for production integration (if InnoBoost POC succeeds).

---

#### Q10: What are the risks?

**Answer**:
Five key risks and mitigations:

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Data quality** | Alternative data may be incomplete/noisy | Signal strength scoring (BSS) measures data quality |
| **Regulatory** | Data privacy laws may restrict usage | Explicit consent framework, governance markers |
| **Model accuracy** | Scores may not predict real behavior | Validate with real customer outcomes in InnoBoost POC |
| **Customer adoption** | Customers may not consent to data sharing | Value exchange (better recommendations), transparency |
| **Partner dependency** | Relies on external data providers | Multiple partner integrations, fallback to partial data |

---

### Category 4: Demo-Specific Questions

#### Q11: Why does Nguyễn Văn An have the highest score?

**Answer**:
He matches the **AR-01 Digital Native** archetype:

- **Age 28, Software Engineer, 25M VND/month**: Young professional with stable income
- **Telco**: 500K VND/month, 24 months tenure, 8GB data → Shows financial consistency
- **E-Wallet**: High usage, 50 transactions/month, diverse categories → Active digital payments
- **E-Commerce**: 10 orders/month, 500K VND avg → Strong online shopping behavior
- **Social**: Technology, finance interests, high activity → Engaged digital user

**Score breakdown** (example):
- PCF: 85 (high digital engagement)
- BSS: 80 (strong alternative data signals)
- ERQ: 75 (responsive to offers)
- PA: 90 (excellent fit for Cashback Credit Card)
- **Overall**: 82/100 → Push Now ✅

---

#### Q12: What happens if I simulate "High Engagement" for a low-scoring customer?

**Answer**:
Let's say customer c003 (Lê Hoàng Cường, Freelancer) has base score 52:

- **Base**: PCF=45, BSS=50, ERQ=55, PA=60 → Overall 52 (Nurture)
- **Simulate High Engagement**: PCF increases to 70
- **New**: PCF=70, BSS=50, ERQ=55, PA=60 → Overall 62 (Still Nurture)

**Delta**: +10 points, but action doesn't change (still needs PA ≥70 for Push Now).

**Lesson**: Partner engagement alone may not be enough. May need to improve product offer or wait for better early reaction.

---

#### Q13: Can this system be used for existing customers with transaction history?

**Answer**:
**Current design**: No - SF8 is specifically for **new customers without internal data**.

**Future extension**: Yes - could combine alternative data with internal transaction history:
- New customers: 100% alternative data
- 6-month customers: 50% alternative + 50% internal
- 12+ month customers: 100% internal (traditional scoring)

**Transition strategy**: Alternative data weight decreases as internal history grows.

---

### Category 5: Competition & Differentiation

#### Q14: What if another team built something similar?

**Answer**:
SF8's unique aspects:

1. **Deterministic-first**: Transparent scoring anyone can audit (not AI black box)
2. **4-source alternative data**: Telco + E-Wallet + E-Commerce + Social (most use 1-2)
3. **What-if simulation**: Test acquisition strategies (rarely seen in PoCs)
4. **Governance-aware**: Generated data with provenance markers (shows production readiness thinking)
5. **Qwen for explanation**: AI enhances understanding without replacing logic

**Competitor check**: Other teams may focus on ML accuracy, but SF8 focuses on **transparency + explainability + strategy simulation**.

---

#### Q15: Why should Shinhan choose SF8 over building in-house?

**Answer**:
Three reasons:

1. **Speed to market**: SF8 PoC is ready now. In-house build would take 6-12 months.
2. **Proven approach**: Deterministic scoring + AI explanation is battle-tested pattern.
3. **InnoBoost support**: 200M VND POC contract funds validation with real data.

**Build vs. Buy**: Shinhan can customize SF8 post-InnoBoost. Starting from scratch delays market entry.

---

### Category 6: Next Steps

#### Q16: What's needed to make this production-ready?

**Answer**:
Six milestones:

| # | Milestone | Timeline | Dependency |
|---|-----------|----------|------------|
| 1 | Real customer data access | Month 1 | Shinhan approval |
| 2 | Partner API integration | Month 1-2 | Telco/e-wallet contracts |
| 3 | ML model training | Month 2-3 | Real data + outcomes |
| 4 | Validation study | Month 3-4 | Historical customer data |
| 5 | CRM integration | Month 4-5 | Shinhan IT approval |
| 6 | Pilot launch | Month 5-6 | Regulatory clearance |

**Budget**: 200M VND (InnoBoost POC contract) covers milestones 1-4.

---

#### Q17: What metrics would you track in production?

**Answer**:
Five KPIs:

1. **Assessment coverage**: % of new customers that can be scored (target: 60%+)
2. **Product adoption rate**: % of "Push Now" customers who accept recommended product (target: TBD with real data)
3. **Time-to-offer**: Minutes from customer consent to product recommendation (target: <5 min)
4. **Score accuracy**: Correlation between scores and actual product adoption (target: 0.7+ AUC)
5. **Customer satisfaction**: NPS score for customers who received AI-recommended products (target: 50+)

---

#### Q18: How do you plan to scale beyond Vietnam?

**Answer**:
SF8 is designed for **multi-market deployment**:

1. **Partner taxonomy**: Abstracted (not hardcoded to Vietnamese providers)
2. **Product catalog**: Configurable per market
3. **Scoring weights**: Can be recalibrated per market
4. **Language**: Qwen supports multi-language explanation (currently Vietnamese, extensible to English, Thai, etc.)

**Expansion path**: Vietnam (Shinhan) → Southeast Asia → Global

---

### Category 7: Ethics & Governance

#### Q19: Could this system discriminate against certain customer groups?

**Answer**:
**Risk**: Yes, if alternative data sources are biased (e.g., lower telco spending in rural areas).

**Mitigation**:
1. **Fairness auditing**: Track score distribution across demographics
2. **Alternative data weighting**: Don't over-index on any single source
3. **Human oversight**: SF8 is decision-support, not decision-maker
4. **Appeals process**: Customers can request manual review

**PoC limitation**: Demo data doesn't reflect real demographic patterns. Fairness audit required before production.

---

#### Q20: How is customer data protected?

**Answer**:
Four layers:

1. **Consent**: Explicit opt-in before accessing alternative data
2. **Minimization**: Only collect data needed for scoring
3. **Transparency**: Customers can see their scores and reasoning
4. **Retention**: Data deleted after scoring unless customer opts in for ongoing monitoring

**PoC note**: Demo data is generated, not real PII. Production requires full data protection framework.

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| **Alternative Data** | Non-traditional data sources (telco, e-wallet, ecommerce, social) |
| **PCF** | Partner/Channel Fit score (0-100) |
| **BSS** | Behavior Signal Strength (0-100) |
| **ERQ** | Early Reaction Quality (0-100) |
| **PA** | Product Affinity (0-100 per product) |
| **Push Now** | Action: Immediate contact recommended (score ≥75, PA ≥70) |
| **Nurture** | Action: Build relationship (score 50-74, PA ≥50) |
| **Hold** | Action: Wait for more data (score <50 or PA <50) |
| **Hero Case** | Highest-scoring customer in demo set |
| **Deterministic** | Rule-based computation (not ML/AI) |
| **Qwen** | Alibaba's LLM used for explanation generation |

---

## Appendix B: Quick Reference Commands

```bash
# Start app
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests (when set up)
npm test

# Check TypeScript errors
npx tsc --noEmit

# Check code quality (if linter configured)
npm run lint
```

---

**Document Version**: 1.0.0
**Last Updated**: April 14, 2026
**Maintained By**: SF8 Team

*This guide is for PoC demonstration purposes. Production deployment requires additional validation and compliance checks.*
