# USE-CASE-SLICES.md

## Overview

This document defines the two approved use-case slices for SF8 Batch 1, plus the hero case selection. Each slice ties together a partner/channel setup, signal bundle, archetype, product outcome, action outcome, and what-if path.

---

## Slice 1: Strong-Fit Slice

**Name**: "Digital Native - High E-Commerce Activity"

### Partner/Channel Setup

| Element | Value |
|---|---|
| **Data Source** | E-wallet (MoMo, `PC-EWAL`) + E-commerce (Shopee, `PC-ECOM`) |
| **Acquisition Channel** | Digital onboarding via app (`CH-DIG`) |
| **Partnership Model** | Data-sharing (`SM-DATA`) — partner shares transaction and order data with SVFC for joint analysis |

### Signal Bundle

| Signal Group | Key Indicators |
|---|---|
| **Telco** | Monthly spend 300K+, tenure 36+ months, data usage 15+ GB |
| **E-Wallet** | Usage: **high**, monthly transactions **45+**, categories: food, transport, shopping |
| **E-Commerce** | Monthly orders **8+**, AOV 500K+, categories: electronics, books |
| **Social** | Interests: technology, gaming, travel — Activity: **high** |

### Archetype

**AR-01 — Digital Native High-Spender**

- **Behavioral profile**: Age 25-32, high income (15M-22M VND/month), high telco spend (300K-450K), high e-wallet usage (45-60 txn/mo), high ecommerce orders (8-15/mo, AOV 500K-800K), interests in tech/fashion/travel, high social activity.
- **Partner/channel context**: Acquired via e-wallet partner + digital onboarding channel; strong partner affinity.
- **Early reaction posture**: Opens and clicks offers quickly, prefers digital channels, responds to credit card and shopping categories.

### Mapped Customer

| Field | Value |
|---|---|
| **ID** | `c001` |
| **Name** | Nguyen Van An |
| **Age** | 28 |
| **Occupation** | Ky su phan mem (Software Engineer) |
| **Income** | 15,000,000 VND/month |
| **Telco** | 300K/month, 36 months tenure, 15 GB data |
| **E-Wallet** | High usage, 45 txn/mo, categories: food, transport, shopping |
| **E-Commerce** | 8 orders/mo, 500K AOV, categories: electronics, books |
| **Social** | Interests: technology, gaming, travel — Activity: high |

**Why c001 (not c002)**: c001 is the cleanest representative of AR-01 — solid income that meets cc-cashback threshold (8M), clear high digital engagement across all channels, and a straightforward Software Engineer profile that is easy to explain in a demo. c002 (Tran Thi Binh, 22M, Marketing Manager) also fits AR-01 but has higher complexity (more categories, higher spend) that is less ideal for a first demo walkthrough.

### Product Outcome

**cc-cashback** (The tin dung Cashback)

- **Type**: credit_card
- **Min Income**: 8,000,000 VND — c001 qualifies (15M)
- **Target Segment**: shopping, ecommerce, young — matches c001's profile
- **Rationale**: c001's high e-commerce activity (8 orders/mo, electronics + books) and high e-wallet transaction volume (45/mo) directly align with the cashback card's value proposition. Every online purchase earns cashback.

### Action Outcome

**`push now`** — High confidence, immediate contact recommended.

- **Overall score**: > 70 (high digital engagement, stable income, strong alternative data coverage)
- **Product affinity for cc-cashback**: > 70 (income eligible + segment match + behavioral alignment)
- **Rationale**: c001 meets the deterministic rule for `push now`: overall_score >= 75 AND product_affinity[top] >= 70.

### What-If Path

**If we change product to BNPL (`bnpl-shop`) instead:**

- Score **decreases**. c001 has stable income (15M) and qualifies for a credit card, which is a higher-value product with broader utility. BNPL (min income 7M, target: shopping/ecommerce/young) is a lower-tier product that does not capture c001's full financial capacity.
- The cashback card remains the superior recommendation because it offers revolving credit + rewards, whereas BNPL is a point-of-sale installment tool better suited for lower-income, thin-file customers.
- **Demo takeaway**: This what-if demonstrates that the scoring engine correctly prioritizes higher-value products when the customer qualifies, rather than defaulting to the simplest option.

---

## Slice 2: Borderline/Interesting Slice

**Name**: "Freelancer - Gig Economy Worker"

### Partner/Channel Setup

| Element | Value |
|---|---|
| **Data Source** | Telco (Viettel, `PC-TEL`) + Social (TikTok/Facebook, `PC-SOC`) |
| **Acquisition Channel** | POS partner at co-working space (`CH-EMB`) |
| **Partnership Model** | Data-sharing (`SM-DATA`) — telco shares usage/tenure data; social shares interest/activity signals |

### Signal Bundle

| Signal Group | Key Indicators |
|---|---|
| **Telco** | Monthly spend 200K, tenure 12 months, data usage 20 GB |
| **E-Wallet** | Usage: **medium**, monthly transactions **25**, categories: food, transport |
| **E-Commerce** | Monthly orders **5**, AOV 300K, categories: electronics, tools |
| **Social** | Interests: technology, freelancing — Activity: **medium** |

### Archetype

**AR-06 — Freelancer / Gig Worker**

- **Behavioral profile**: Age 25-29, variable income (8M-16M VND/month), low-medium telco spend (200K-250K), high e-wallet usage (25-55 txn/mo), low-medium ecommerce (4-7 orders/mo), interests in technology/sport/music/gaming/content, high social activity.
- **Partner/channel context**: Acquired via e-wallet partner + digital onboarding.
- **Early reaction posture**: Fast response to urgent/fast loan offers, ignores long-term products, prefers mobile-first channels.

### Mapped Customer

| Field | Value |
|---|---|
| **ID** | `c003` |
| **Name** | Le Hoang Cuong |
| **Age** | 25 |
| **Occupation** | Freelancer |
| **Income** | 8,000,000 VND/month |
| **Telco** | 200K/month, 12 months tenure, 20 GB data |
| **E-Wallet** | Medium usage, 25 txn/mo, categories: food, transport |
| **E-Commerce** | 5 orders/mo, 300K AOV, categories: electronics, tools |
| **Social** | Interests: technology, freelancing — Activity: medium |

**Why c003**: c003 is the canonical AR-06 representative. As a 25-year-old Freelancer earning 8M VND, c003 sits at the borderline — income is just enough for basic products (pl-fast min income is 5M), but income stability is uncertain. Telco tenure is only 12 months (lowest in the dataset), indicating less stability. E-wallet activity is medium (not high like some other gig workers), and social activity is medium (not high). This makes c003 the ideal "interesting" case where the scoring engine must weigh competing signals.

### Product Outcome

**pl-fast** (Vay nhanh trong ngay)

- **Type**: personal_loan
- **Min Income**: 5,000,000 VND — c003 qualifies (8M)
- **Target Segment**: freelancer, gig, urgent — exact match for c003's occupation
- **Rationale**: c003's variable freelance income and moderate digital activity make a fast, flexible loan the most appropriate product. pl-fast has the lowest income bar (5M) and targets freelancers specifically. Unlike pl-salary (which requires stable employment), pl-fast is designed for non-traditional income profiles.

### Action Outcome

**`nurture`** — Moderate confidence, needs more data collection.

- **Overall score**: 40-60 range (lower income stability, moderate signals, higher uncertainty)
- **Product affinity for pl-fast**: 50-70 (income eligible + exact segment match, but income stability concern)
- **Rationale**: c003 falls into the `nurture` zone: overall_score in range 50-74 AND product_affinity[top] >= 50. The customer qualifies for pl-fast and matches the target segment, but the low telco tenure (12 months) and moderate signal strength create uncertainty. Additional data collection or a longer observation period would improve confidence.

### What-If Path

**If we assume higher digital engagement (e.g., e-wallet usage changes from "medium" to "high", monthly transactions from 25 to 45+):**

- **Behavior Signal Strength (bss) increases** — higher transaction frequency indicates more active financial behavior.
- **Overall score improves** — the weighted sum shifts upward, potentially crossing the 75 threshold.
- **Action moves toward `push now`** — with stronger bss, the overall score crosses into the `push now` range, and the confidence in pl-fast recommendation increases.
- **Demo takeaway**: This what-if demonstrates the value of alternative data. A freelancer with thin traditional signals (low telco tenure, moderate income) can still score well if alternative data (e-wallet activity, social engagement) paints a richer picture. It also shows why the `nurture` action is appropriate — collecting more digital signals over time can convert borderline cases into strong candidates.

---

## Hero Case Selection

### Selection Rule

Per the hero case rule: **"choose the case with the best score."**

### Selected Hero Case

**Slice 1 — Customer c001 (Nguyen Van An)**

| Criterion | Assessment |
|---|---|
| **Highest digital engagement signals** | c001 scores high across all four signal groups: telco (300K, 36mo, 15GB), e-wallet (high, 45 txn), e-commerce (8 orders, 500K AOV), social (high activity, 3 interest categories) |
| **Clear product-product fit** | cc-cashback is an unambiguous match — c001's income (15M) exceeds the 8M threshold, occupation (Software Engineer) maps to the "it" and "professional" segments, and e-commerce activity (electronics, books) directly supports the cashback value proposition |
| **Strong what-if demonstration potential** | The what-if path (change to BNPL → lower score) is easy to explain and demonstrates the engine's ability to prioritize higher-value products |
| **Easy to explain in demo** | c001 is a 28-year-old Software Engineer — a relatable, straightforward profile. No edge cases or ambiguities. The demo flow: dashboard → c001 profile → cc-cashback recommendation → `push now` action → what-if (BNPL comparison) is clean and linear |

### Hero Case Demo Flow

1. **Dashboard** → show overall score distribution, c001 at the top
2. **Click c001** → open customer profile with alternative data breakdown
3. **View recommendation** → cc-cashback card with `push now` action
4. **Run what-if** → change product to BNPL, observe score decrease
5. **Narrative** → "This is a digital native who shops online frequently. Our engine recommends a cashback credit card because it maximizes value for this customer. If we offered BNPL instead, we'd leave money on the table."
