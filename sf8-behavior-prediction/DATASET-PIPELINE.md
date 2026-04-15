# DATASET-PIPELINE.md

## Overview

This document defines the 4-layer data pipeline for SF8. Data flows from static reference catalogs through generated candidate data, approval, and finally to published app datasets consumed by the frontend.

```
Layer 1: Reference Data (static catalogs)
    ↓
Layer 2: Generated Candidate Data (demo customers + governance markers)
    ↓  [Review → Approve]
Layer 3: Approved Dataset (sanity-checked, provenance-complete)
    ↓  [Version → Publish]
Layer 4: Published App Dataset (frontend-consumable, versioned)
```

---

## Layer 1: Reference Data

**Purpose**: Static reference data that defines the product catalog, partner taxonomy, and other lookup tables. This data is hand-curated and does not change per demo run.

### Product Catalog

```typescript
interface ProductCatalog {
  id: string;          // e.g., "cc-cashback"
  group: string;       // "credit_card" | "personal_loan" | "sme_loan" | "insurance" | "bnpl"
  displayName: string; // Vietnamese display name
  minIncome: number;   // VND/month
  targetSegment: string[];
  eligibilityRules: string[];
}
```

#### Catalog Instances (from `lib/data.ts` PRODUCTS)

| id | group | displayName | minIncome (VND) | targetSegment | eligibilityRules |
|---|---|---|---|---|---|
| `cc-platinum` | credit_card | Thẻ tín dụng Platinum | 10,000,000 | office, it, professional, young_professional | income >= 10M AND occupation in [office, it, professional] |
| `cc-cashback` | credit_card | Thẻ tín dụng Cashback | 8,000,000 | shopping, ecommerce, young | income >= 8M AND ecommerce activity present |
| `pl-salary` | personal_loan | Vay thỏa thuận lương | 8,000,000 | salaried, office, stable_income | income >= 8M AND occupation indicates stable employment |
| `pl-fast` | personal_loan | Vay nhanh trong ngày | 5,000,000 | freelancer, gig, urgent | income >= 5M |
| `sme-micro` | sme_loan | Vay SME Micro | 15,000,000 | business, entrepreneur, sme | income >= 15M AND occupation indicates business ownership |
| `ins-health` | insurance | Bảo hiểm sức khỏe | 10,000,000 | family, health_conscious, mid_age | income >= 10M AND (age >= 30 OR family interest signals) |
| `bnpl-shop` | bnpl | Mua trước trả sau Shopping | 7,000,000 | shopping, ecommerce, young | income >= 7M AND (ecommerce activity OR fashion/beauty interests) |

### Partner Catalog

```typescript
interface PartnerCatalog {
  id: string;          // e.g., "PC-EWAL"
  name: string;        // "E-wallet Platform"
  domain: "data_source" | "acquisition_channel" | "partnership_model";
  type: string;        // specific type within domain
  description: string;
}
```

#### Catalog Instances (from `DATA-CATALOG-CANDIDATES.md`)

**Data Source Partners**

| id | name | type | description |
|---|---|---|---|
| `PC-TEL` | Telco Data Partner | telco | Telco signals for spending, tenure, data usage — anchored to SF8 source family |
| `PC-ECOM` | E-Commerce Data Partner | ecommerce | Purchase frequency, AOV, category data — anchored to SF8 source family |
| `PC-EWAL` | E-Wallet Data Partner | e_wallet | Transaction frequency, balance patterns — anchored to SF8 source family (e.g., MoMo) |
| `PC-SOC` | Social Data Partner | social | Interests, activity level for behavioral profiling — anchored to SF8 source family |

**Acquisition/Distribution Channels**

| id | name | type | description |
|---|---|---|---|
| `CH-EMB` | Embedded Finance Channel | embedded | Consumer-facing embedded finance touchpoint at partner sites |
| `CH-DIG` | Digital Onboarding Channel | digital | Digital-first customer onboarding flow — maps to "new customer" scenario |
| `CH-REF` | Referral / Affiliate Channel | referral | Referral program or affiliate partner distribution |

**Shared-Data Partnership Models**

| id | name | type | description |
|---|---|---|---|
| `SM-DATA` | Data-Sharing Partnership Model | data_sharing | Partner shares data with SVFC for joint analysis |
| `SM-DIST` | Distribution-Only Partnership Model | distribution_only | Partner distributes SVFC offers without data sharing |
| `SM-FULL` | Full Partnership Model | data_and_distribution | Partner shares data AND distributes offers — highest integration |

---

## Layer 2: Generated Candidate Data

**Purpose**: Demo customer data with governance markers. All 20 customers from `lib/data.ts` are instantiated here with `source_type: "generated"` and full provenance metadata.

### Schema

```typescript
interface CandidateCustomer {
  // Core profile
  id: string;
  name: string;
  age: number;
  income: number;
  occupation: string;

  // Alternative data
  telco: {
    monthlySpend: number;      // VND/month
    tenure: number;            // months
    dataUsage: number;         // GB
  };
  eWallet: {
    usage: "low" | "medium" | "high";
    monthlyTransactions: number;
    categories: string[];
  };
  ecommerce: {
    monthlyOrders: number;
    avgOrderValue: number;     // VND
    categories: string[];
  };
  social: {
    interests: string[];
    activity: "low" | "medium" | "high";
  };

  // Governance metadata
  source_type: "generated";
  source_name: string;         // e.g., "demo_catalog_v1"
  approval_status: "approved" | "pending" | "rejected";
  approved_by: string;         // reviewer ID or "system"
  approved_at: string;         // ISO date
  scenario_id: string;         // e.g., "AR-01"
  persona_id: string;          // archetype reference
  notes: string;
}
```

### Generated Candidate Registry (All 20 Customers)

Derived from `lib/data.ts` CUSTOMERS + ALTERNATIVE_DATA. All entries have `source_type: "generated"`, `source_name: "demo_catalog_v1"`, and default `approval_status: "pending"` until review.

| id | name | age | income (VND) | occupation | telco (spend/tenure/usage) | eWallet (usage/txn/cats) | ecommerce (orders/AOV/cats) | social (interests/activity) | scenario_id | persona_id |
|---|---|---|---|---|---|---|---|---|---|---|
| c001 | Nguyen Van An | 28 | 15,000,000 | Ky su phan mem | 300K / 36mo / 15GB | high / 45 / food,transport,shopping | 8 / 500K / electronics,books | technology,gaming,travel / high | AR-01 | digital_native_high_spender |
| c002 | Tran Thi Binh | 32 | 22,000,000 | Marketing Manager | 450K / 48mo / 25GB | high / 60 / food,travel,shopping,beauty | 15 / 800K / fashion,cosmetics,home | fashion,travel,food / high | AR-01 | digital_native_high_spender |
| c003 | Le Hoang Cuong | 25 | 8,000,000 | Freelancer | 200K / 12mo / 20GB | medium / 25 / food,transport | 5 / 300K / electronics,tools | technology,freelancing / medium | AR-06 | freelancer_gig_worker |
| c004 | Pham Minh Dung | 35 | 35,000,000 | Giam doc | 600K / 72mo / 30GB | high / 80 / all | 20 / 2M / luxury,electronics,travel | business,golf,luxury / low | AR-03 | entrepreneur |
| c005 | Hoang Van Em | 29 | 12,000,000 | Sale | 250K / 24mo / 10GB | medium / 30 / food,transport | 6 / 400K / fashion,sport | sport,football / medium | AR-02 | traditional_salaried |
| c006 | Do Thi Loan | 27 | 10,000,000 | Nhan vien van phong | 200K / 36mo / 8GB | low / 15 / food,transport | 4 / 350K / books,home | books,movies / low | AR-02 | traditional_salaried |
| c007 | Vu Quoc Huy | 41 | 45,000,000 | Kinh doanh tu do | 500K / 60mo / 20GB | high / 50 / business,transport | 10 / 1.5M / electronics,office | business,investment / medium | AR-03 | entrepreneur |
| c008 | Bui Thi Huong | 30 | 18,000,000 | Giao vien | 300K / 48mo / 12GB | medium / 35 / food,education,books | 7 / 450K / books,education,home | education,books,children / medium | AR-02 | traditional_salaried |
| c009 | Dinh Van Kien | 26 | 9,500,000 | Giao hang | 200K / 18mo / 15GB | high / 55 / food,transport,shopping | 4 / 250K / fashion,sport | sport,music,games / high | AR-06 | freelancer_gig_worker |
| c010 | Ngo Thi Lan | 38 | 28,000,000 | Ke toan | 350K / 60mo / 10GB | medium / 30 / food,shopping | 8 / 600K / home,fashion | cooking,home / low | AR-02 | traditional_salaried |
| c011 | Duong Van Manh | 33 | 25,000,000 | Bac si | 400K / 48mo / 8GB | low / 20 / food,health | 3 / 800K / health,books | health,medicine / low | AR-05 | family_oriented |
| c012 | Vo Thi Nga | 24 | 7,000,000 | Sinh vien | 150K / 12mo / 25GB | high / 40 / food,transport,fashion | 6 / 300K / fashion,beauty | fashion,beauty,kpop / high | AR-04 | young_shopper |
| c013 | Ly Van Phong | 36 | 32,000,000 | Luat su | 500K / 72mo / 15GB | medium / 35 / business,food,transport | 5 / 2.5M / electronics,luxury | law,business,golf / low | AR-03 | entrepreneur |
| c014 | Hoang Thi Quynh | 31 | 20,000,000 | HR | 350K / 60mo / 12GB | medium / 40 / food,shopping,travel | 10 / 700K / fashion,home,beauty | hr,psychology,self_help / medium | AR-05 | family_oriented |
| c015 | Truong Van Sang | 28 | 13,000,000 | IT Support | 280K / 36mo / 20GB | high / 50 / food,tech,gaming | 6 / 550K / electronics,gaming | technology,gaming,anime / high | AR-01 | digital_native_high_spender |
| c016 | Le Thi Thao | 34 | 27,000,000 | Pharmacist | 320K / 48mo / 8GB | medium / 30 / food,health,family | 5 / 500K / health,family | health,family / low | AR-05 | family_oriented |
| c017 | Nguyen Van Tu | 29 | 16,000,000 | Graphic Designer | 300K / 36mo / 18GB | high / 45 / food,tech,art | 9 / 650K / electronics,art,design | design,art,photography / high | AR-04 | young_shopper |
| c018 | Pham Thi Uyen | 40 | 40,000,000 | CEO | 700K / 96mo / 25GB | high / 100 / all | 25 / 3M / luxury,travel,business | business,luxury,travel / medium | AR-03 | entrepreneur |
| c019 | Vo Van Vinh | 27 | 11,000,000 | Content Creator | 250K / 24mo / 22GB | high / 55 / food,entertainment,tech | 7 / 450K / electronics,camera | content,video,tech / high | AR-06 | freelancer_gig_worker |
| c020 | Le Thi Xuan | 37 | 30,000,000 | Banker | 400K / 84mo / 10GB | medium / 35 / business,food,transport | 8 / 900K / business,finance | finance,investment,business / low | AR-02 | traditional_salaried |

### Governance Notes Per Customer

Each candidate includes governance metadata populated at generation time:

```
source_type: "generated"
source_name: "demo_catalog_v1"
approval_status: "pending"  // changes to "approved" or "rejected" after review
approved_by: ""             // populated by reviewer
approved_at: ""             // ISO date, populated on approval
notes: "Generated demo data for SF8 PoC. All customer profiles are fictional."
```

---

## Layer 3: Approved Dataset

**Purpose**: Reviewed and approved candidate data ready for app consumption. Only candidates that pass approval rules move from Layer 2 to Layer 3.

### Approval Rules

A candidate customer is **approved** only when ALL of the following conditions are met:

| Rule | Check | Failure Action |
|---|---|---|
| **Complete provenance** | `source_type`, `source_name`, `approval_status`, `approved_by`, `approved_at` are all non-empty | Reject — missing metadata |
| **Income > 0** | `income` is a positive number | Reject — invalid income |
| **Age > 18** | `age` is greater than 18 | Reject — underage |
| **At least 1 signal per group** | telco has data, eWallet has data, ecommerce has data, social has data | Reject — incomplete profile |
| **Linked to archetype** | `scenario_id` maps to a known archetype (AR-01 through AR-06) | Reject — unlinked |
| **No real PII** | All data is generated/fictional, no real personal information | Reject — PII contamination |

### Sanity Check Results (Batch 1)

All 20 customers pass sanity checks:

| Customer | Income > 0 | Age > 18 | All signals present | Archetype linked | PII clean | Status |
|---|---|---|---|---|---|---|
| c001-c020 | Pass | Pass | Pass | Pass | Pass | Approved |

### Published App Dataset Schema

```typescript
interface PublishedCustomer extends CandidateCustomer {
  // Additional computed fields (from scoring engine)
  overallScore: number;        // 0-100, from scoring engine
  recommendedProduct: string;  // product ID (e.g., "cc-cashback")
  action: "push now" | "nurture" | "hold";
  confidence: number;          // 0-1

  // Score breakdown (for dashboard display)
  scoreBreakdown: {
    pcf: number;   // Partner/Channel Fit, 0-100
    bss: number;   // Behavior Signal Strength, 0-100
    erq: number;   // Early Reaction Quality, 0-100
    pa: number;    // Product Affinity for recommended product, 0-100
  };

  // What-if simulation fields (populated when simulation runs)
  simulation?: {
    baseScore: number;
    simulatedScore: number;
    delta: number;
    changedVariable: "partner_channel" | "product_offer" | "early_reaction";
  };
}
```

---

## Layer 4: Published App Dataset

**Purpose**: Final data consumed by the frontend. The published dataset is versioned and the app always consumes the published version — never raw candidates.

### Publish Flow

```
1. Generated candidates (Layer 2)
      ↓  [Review by human reviewer]
2. Approved dataset (Layer 3) — passes all approval rules and sanity checks
      ↓  [Version tag applied: v1, v2, etc.]
3. Published app dataset (Layer 4) — immutable snapshot for FE consumption
```

### Versioning

| Version | Status | Description |
|---|---|---|
| `v1` | **Active (Batch 1)** | Initial published dataset with all 20 approved customers. Contains Slice 1 hero case (c001) and Slice 2 borderline case (c003). |
| `v2` | Planned | Future iteration with refined candidates, additional archetypes, or adjusted scoring outputs. |

### FE Consumption Modes

| Mode | Dataset Version | Use Case |
|---|---|---|
| **Dev mode** | `published/v1` | Local development with approved dataset. Developer iterates on UI/scoring logic against stable data. |
| **Review mode** | `published/v1` or `staging/vX` | Internal review — stakeholders verify scoring outputs, product recommendations, and action mappings before demo. |
| **Demo/Submission mode** | `published/v1` (final approved) | Public demo or hackathon submission. Frozen dataset that matches the approved use-case slices and hero case. |

### Dataset Access Contract

```
// Frontend always reads from published endpoint, never raw
GET /api/datasets/published/v1/customers      → list all published customers
GET /api/datasets/published/v1/customers/:id  → get single customer with scores
GET /api/datasets/published/v1/products       → product catalog reference
GET /api/datasets/published/v1/partners       → partner catalog reference
```

### UI Disclosure Rules

To maintain transparency that all data is generated for PoC purposes, the following disclosures are displayed at different levels:

| Level | Disclosure Text | Placement |
|---|---|---|
| **Record level** | Badge: "Generated demo data" | On each customer card/profile header |
| **Dataset/view level** | Note: "This demo uses generated customer data for PoC purposes." | Top of dashboard or data table view |
| **Export/pitch** | Disclaimer: "Scores are relative within demo set, not absolute creditworthiness." | On exported reports, pitch decks, or submission materials |

### Example: c001 Published Record (Slice 1 Hero)

```json
{
  "id": "c001",
  "name": "Nguyen Van An",
  "age": 28,
  "income": 15000000,
  "occupation": "Ky su phan mem",
  "telco": { "monthlySpend": 300000, "tenure": 36, "dataUsage": 15 },
  "eWallet": { "usage": "high", "monthlyTransactions": 45, "categories": ["food", "transport", "shopping"] },
  "ecommerce": { "monthlyOrders": 8, "avgOrderValue": 500000, "categories": ["electronics", "books"] },
  "social": { "interests": ["technology", "gaming", "travel"], "activity": "high" },
  "source_type": "generated",
  "source_name": "demo_catalog_v1",
  "approval_status": "approved",
  "approved_by": "sf8-review-team",
  "approved_at": "2026-04-14T00:00:00Z",
  "scenario_id": "AR-01",
  "persona_id": "digital_native_high_spender",
  "notes": "Generated demo data for SF8 PoC. All customer profiles are fictional.",
  "overallScore": 78,
  "recommendedProduct": "cc-cashback",
  "action": "push now",
  "confidence": 0.85,
  "scoreBreakdown": {
    "pcf": 82,
    "bss": 80,
    "erq": 75,
    "pa": 85
  }
}
```

### Example: c003 Published Record (Slice 2 Borderline)

```json
{
  "id": "c003",
  "name": "Le Hoang Cuong",
  "age": 25,
  "income": 8000000,
  "occupation": "Freelancer",
  "telco": { "monthlySpend": 200000, "tenure": 12, "dataUsage": 20 },
  "eWallet": { "usage": "medium", "monthlyTransactions": 25, "categories": ["food", "transport"] },
  "ecommerce": { "monthlyOrders": 5, "avgOrderValue": 300000, "categories": ["electronics", "tools"] },
  "social": { "interests": ["technology", "freelancing"], "activity": "medium" },
  "source_type": "generated",
  "source_name": "demo_catalog_v1",
  "approval_status": "approved",
  "approved_by": "sf8-review-team",
  "approved_at": "2026-04-14T00:00:00Z",
  "scenario_id": "AR-06",
  "persona_id": "freelancer_gig_worker",
  "notes": "Generated demo data for SF8 PoC. All customer profiles are fictional.",
  "overallScore": 55,
  "recommendedProduct": "pl-fast",
  "action": "nurture",
  "confidence": 0.60,
  "scoreBreakdown": {
    "pcf": 50,
    "bss": 48,
    "erq": 55,
    "pa": 65
  }
}
```
