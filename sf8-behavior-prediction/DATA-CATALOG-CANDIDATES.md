# DATA-CATALOG-CANDIDATES.md

## Overview

This is the master candidate registry for all taxonomy and content candidates in SF8.

Each domain section uses the standardized table schema below. Candidates flow through the status lifecycle:

`draft` → `pending review` → `approved` → `published` → `rejected`

**Batch 1 Completion Condition:** Batch 1 is complete only when:
- Taxonomy candidates are approved
- 2 use-case slices are approved
- Hero case is selected

---

## Standardized Table Schema

| Column | Description |
|---|---|
| `candidate_id` | Unique identifier for the candidate |
| `name` | Display name (dual naming where applicable) |
| `domain` | Domain this candidate belongs to |
| `status` | Current status: draft / pending review / approved / published / rejected |
| `source_link` | URL or file reference for the source of this candidate |
| `extraction_note` | How this candidate was derived or extracted |
| `reason_for_inclusion` | Why this candidate is relevant to SF8 |
| `confidence_fit_note` | Assessment of how well this candidate fits the SF8 context |
| `reviewer_decision_note` | Decision rationale from reviewer |

---

## 1. Partners / Channels

Three taxonomy layers:
1. **Data-source partners** — anchored to SF8 source families: telco, social, e-wallet, e-commerce
2. **Acquisition/distribution channels** — consumer finance / embedded finance channels
3. **Shared-data partnership models** — data-sharing vs. distribution-only models

### 1.1 Data-Source Partners

| candidate_id | name | domain | status | source_link | extraction_note | reason_for_inclusion | confidence_fit_note | reviewer_decision_note |
|---|---|---|---|---|---|---|---|---|
| PC-TEL | Telco Data Partner | data-source-partner | pending review | SF8 brief §4 | Anchored to telco source family from SF8 brief | Core SF8 source — telco signals for spending, tenure, data usage | High — directly specified in brief | Pending |
| PC-ECOM | E-Commerce Data Partner | data-source-partner | pending review | SF8 brief §4 | Anchored to e-commerce source family from SF8 brief | Core SF8 source — purchase frequency, AOV, category data | High — directly specified in brief | Pending |
| PC-EWAL | E-Wallet Data Partner | data-source-partner | pending review | SF8 brief §4; [Mordor Intelligence](https://www.mordorintelligence.com/industry-reports/vietnam-mobile-payments-market) | Anchored to e-wallet source family; Vietnam mobile payments market valued at USD 46.56B in 2025 | Core SF8 source — transaction frequency, balance patterns | High — directly specified in brief + market validation | Pending |
| PC-SOC | Social Data Partner | data-source-partner | pending review | SF8 brief §4 | Anchored to social source family from SF8 brief | Core SF8 source — interests, activity level for behavioral profiling | High — directly specified in brief | Pending |

### 1.2 Acquisition/Distribution Channels

| candidate_id | name | domain | status | source_link | extraction_note | reason_for_inclusion | confidence_fit_note | reviewer_decision_note |
|---|---|---|---|---|---|---|---|---|
| CH-EMB | Embedded Finance Channel | acquisition-channel | pending review | [Shinhan Finance](https://shinhanfinance.com.vn/en) | Consumer-facing embedded finance touchpoint at partner sites | Easy to explain in demo; aligned with SVFC distribution logic; common in Vietnam market | Medium-high — standard embedded finance pattern | Pending |
| CH-DIG | Digital Onboarding Channel | acquisition-channel | pending review | [Shinhan Finance](https://shinhanfinance.com.vn/en) | Digital-first customer onboarding flow | Directly maps to "new customer" scenario in SF8 brief | High — matches PoC scope perfectly | Pending |
| CH-REF | Referral / Affiliate Channel | acquisition-channel | pending review | Spec §1 | Referral program or affiliate partner distribution | Common in Vietnam consumer finance; good for simulation variety | Medium — useful for what-if scenarios | Pending |

### 1.3 Shared-Data Partnership Models

| candidate_id | name | domain | status | source_link | extraction_note | reason_for_inclusion | confidence_fit_note | reviewer_decision_note |
|---|---|---|---|---|---|---|---|---|
| SM-DATA | Data-Sharing Partnership Model | partnership-model | pending review | Spec §1 | Partner shares data with SVFC for joint analysis | Distinguishes data-sharing from distribution-only; required by taxonomy spec | High — required by spec | Pending |
| SM-DIST | Distribution-Only Partnership Model | partnership-model | pending review | Spec §1 | Partner distributes SVFC offers without data sharing | Distinguishes distribution-only from data-sharing; required by taxonomy spec | High — required by spec | Pending |
| SM-FULL | Full Partnership Model (Data + Distribution) | partnership-model | pending review | Spec §1 inference | Partner shares data AND distributes offers — highest integration | Covers the combined case; realistic for strategic partners | Medium-high — logical extension of two base models | Pending |

---

## 2. Signal Taxonomy

Four signal groups:
1. **External behavioral signals** — activity patterns from telco, social, e-commerce
2. **External profile/context signals** — demographic, device, location context
3. **Partner/channel-derived signals** — signals inferred from partner/channel interaction
4. **Early reaction signals** — response to SVFC offers (open, click, ignore, response speed, offer category preference, channel preference)

### 2.1 External Behavioral Signals

| candidate_id | name | domain | status | source_link | extraction_note | reason_for_inclusion | confidence_fit_note | reviewer_decision_note |
|---|---|---|---|---|---|---|---|---|
| SIG-BEH-TEL | Telco Activity Pattern | external-behavioral | pending review | `lib/data.ts` (telco fields) | Grouped from telco fields: monthlySpend, tenure, dataUsage. **Scoring intent:** behavioral engagement score — higher spend + tenure = more stable customer | Core SF8 signal — indicates spending capacity and loyalty | High — directly from data structure | Pending |
| SIG-BEH-EWAL | E-Wallet Transaction Signal | external-behavioral | pending review | `lib/data.ts` (eWallet fields) | Grouped from eWallet fields: usage level, monthlyTransactions, categories. **Scoring intent:** financial activity score — high transaction frequency = active financial behavior | Core financial signal — direct indicator of digital finance readiness | High — directly from data structure | Pending |
| SIG-BEH-ECOM | E-Commerce Purchase Pattern | external-behavioral | pending review | `lib/data.ts` (ecommerce fields) | Grouped from ecommerce fields: monthlyOrders, avgOrderValue, categories. **Scoring intent:** purchase readiness score — high orders + AOV = higher creditworthiness | Direct purchase intent signal — maps to product affinity | High — directly from data structure | Pending |
| SIG-BEH-SOC | Social Engagement Signal | external-behavioral | pending review | `lib/data.ts` (social fields) | Grouped from social fields: interests array, activity level. **Scoring intent:** digital engagement score — more interests + higher activity = more reachable customer | Proxy for engagement and receptiveness to digital offers | Medium — behavioral proxy, not direct financial signal | Pending |

### 2.2 External Profile/Context Signals

| candidate_id | name | domain | status | source_link | extraction_note | reason_for_inclusion | confidence_fit_note | reviewer_decision_note |
|---|---|---|---|---|---|---|---|---|
| SIG-PROF-AGE | Age Demographic | external-profile | pending review | `lib/data.ts` (Customer.age) | From Customer.age field. **Scoring intent:** age-segment fit — maps to product eligibility and risk profile | Demographic baseline for product targeting | High — foundational signal | Pending |
| SIG-PROF-INCOME | Income Bracket | external-profile | pending review | `lib/data.ts` (Customer.income) | From Customer.income field. **Scoring intent:** income-tier score — directly maps to product minIncome eligibility | Critical for product eligibility filtering | High — direct eligibility gate | Pending |
| SIG-PROF-OCC | Occupation Type | external-profile | pending review | `lib/data.ts` (Customer.occupation) | From Customer.occupation field. **Scoring intent:** occupation-stability score — salaried vs freelancer vs business owner | Determines product segment fit (e.g., sme_loan for business owners) | High — direct segment mapper | Pending |
| SIG-PROF-DEVICE | Device / Tech Context | external-profile | pending review | Inferred from telco dataUsage | Derived from dataUsage as proxy for smartphone/digital capability. **Scoring intent:** tech-readiness score | Supportive signal for channel preference | Medium — inferred proxy | Pending |

### 2.3 Partner/Channel-Derived Signals

| candidate_id | name | domain | status | source_link | extraction_note | reason_for_inclusion | confidence_fit_note | reviewer_decision_note |
|---|---|---|---|---|---|---|---|---|
| SIG-CH-AFFIN | Partner Channel Affinity | partner-derived | pending review | Spec §17, taxonomy | Interaction frequency and quality with specific partner/channel. **Scoring intent:** partner/channel fit score — which channel is most effective for this customer | Directly supports partner fit scoring in dashboard and simulation | High — required for partner/channel decision layer | Pending |
| SIG-CH-QUAL | Channel Quality Score | partner-derived | pending review | Spec §17, taxonomy | Historical conversion rate and customer quality from this channel. **Scoring intent:** channel quality score — adjusts acquisition score based on channel reliability | Supports what-if simulation on channel changes | Medium-high — useful for simulation | Pending |

### 2.4 Early Reaction Signals

| candidate_id | name | domain | status | source_link | extraction_note | reason_for_inclusion | confidence_fit_note | reviewer_decision_note |
|---|---|---|---|---|---|---|---|---|
| SIG-REA-OPEN | Offer Open Signal | early-reaction | pending review | Spec §18 | Binary: did customer open the offer? **Scoring intent:** interest confirmation — baseline engagement indicator | First indicator of interest; foundational early reaction | High — baseline signal | Pending |
| SIG-REA-CLICK | Offer Click Signal | early-reaction | pending review | Spec §18 | Binary: did customer click through the offer? **Scoring intent:** active engagement — stronger than open | Confirms active interest beyond passive viewing | High — confirms intent | Pending |
| SIG-REA-IGNORE | Offer Ignore Signal | early-reaction | pending review | Spec §18 | Binary: customer did not engage with offer. **Scoring intent:** disinterest flag — negative signal for hold/nurture logic | Needed for hold/nurture action mapping | High — required for negative case | Pending |
| SIG-REA-SPEED | Response Speed | early-reaction | pending review | Spec §18 | Time between offer delivery and response. **Scoring intent:** urgency score — faster response = higher readiness | Time-based signal for urgency assessment | Medium — supports action timing | Pending |
| SIG-REA-CAT | Offer Category Preference | early-reaction | pending review | Spec §18 | Which offer category the customer engaged with. **Scoring intent:** product affinity — maps to next best product recommendation | Directly maps to product recommendation engine | High — drives product suggestion | Pending |
| SIG-REA-CHAN | Channel Preference | early-reaction | pending review | Spec §18 | Which channel the customer responded through. **Scoring intent:** channel optimization — which channel to use for next offer | Supports simulation variable for channel | Medium — simulation support | Pending |

---

## 3. Product Groups

4 groups total. Dual naming: internal business-generic name + near-market display label.

| candidate_id | internal_name | display_name | domain | status | source_link | extraction_note | reason_for_inclusion | confidence_fit_note | reviewer_decision_note |
|---|---|---|---|---|---|---|---|---|---|
| PG-CC | credit_card | Thẻ tín dụng | product-group | pending review | `lib/data.ts` (type: "credit_card") | From existing ShinhanProduct.type field. Packages: cc-platinum, cc-cashback | High-frequency engagement product; entry point for new customers | High — directly from data structure | Pending |
| PG-PL | personal_loan | Vay cá nhân | product-group | pending review | `lib/data.ts` (type: "personal_loan") | From existing ShinhanProduct.type field. Packages: pl-salary, pl-fast | Core revenue product for new customer acquisition | High — directly from data structure | Pending |
| PG-SME | sme_loan | Vay SME | product-group | pending review | `lib/data.ts` (type: "sme_loan") | From existing ShinhanProduct.type field. Packages: sme-micro | Business segment — aligned with entrepreneur archetype | Medium — single package in Batch 1 | Pending |
| PG-INS | insurance | Bảo hiểm | product-group | pending review | `lib/data.ts` (type: "insurance") | From existing ShinhanProduct.type field. Packages: ins-health | Cross-sell opportunity; family-oriented archetype fit | Medium — secondary product in Batch 1 | Pending |
| PG-BNPL | bnpl | Mua trước trả sau | product-group | pending review | `lib/data.ts` (type: "bnpl") | From existing ShinhanProduct.type field. Packages: bnpl-shop | Growing segment in Vietnam; young shopper archetype fit | Medium — emerging product | Pending |

---

## 4. Product Packages

Each group has 2-4 package candidates. Dual naming: internal canonical name + public/market-like display label.

| candidate_id | internal_name | display_name | group_id | target_segment | min_income | eligibility_rules | status | source_link | extraction_note | reason_for_inclusion | confidence_fit_note | reviewer_decision_note |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| PP-CC-PLAT | cc-platinum | Thẻ tín dụng Platinum | PG-CC | office, it, professional, young_professional | 10,000,000 | income >= 10M + occupation in [office, it, professional] | pending review | `lib/data.ts` | From existing ShinhanProduct entry | Premium credit card for stable-income professionals | High — from data structure | Pending |
| PP-CC-CASH | cc-cashback | Thẻ tín dụng Cashback | PG-CC | shopping, ecommerce, young | 8,000,000 | income >= 8M + ecommerce activity present | pending review | `lib/data.ts` | From existing ShinhanProduct entry | Cashback card for active shoppers | High — from data structure | Pending |
| PP-PL-SAL | pl-salary | Vay thỏa thuận lương | PG-PL | salaried, office, stable_income | 8,000,000 | income >= 8M + occupation indicates stable employment | pending review | `lib/data.ts` | From existing ShinhanProduct entry | Salary-backed personal loan for stable earners | High — from data structure | Pending |
| PP-PL-FAST | pl-fast | Vay nhanh trong ngày | PG-PL | freelancer, gig, urgent | 5,000,000 | income >= 5M (lower bar for fast approval) | pending review | `lib/data.ts` | From existing ShinhanProduct entry | Same-day approval loan for urgent needs | High — from data structure | Pending |
| PP-SME-MIC | sme-micro | Vay SME Micro | PG-SME | business, entrepreneur, sme | 15,000,000 | income >= 15M + occupation indicates business ownership | pending review | `lib/data.ts` | From existing ShinhanProduct entry | Micro loan for small business owners | Medium — single package, may expand | Pending |
| PP-INS-HLT | ins-health | Bảo hiểm sức khỏe | PG-INS | family, health_conscious, mid_age | 10,000,000 | income >= 10M + age >= 30 or family interest signals | pending review | `lib/data.ts` | From existing ShinhanProduct entry | Health insurance for family-oriented customers | Medium — single package, may expand | Pending |
| PP-BNPL-SHP | bnpl-shop | Mua trước trả sau Shopping | PG-BNPL | shopping, ecommerce, young | 7,000,000 | income >= 7M + high ecommerce/fashion interest | pending review | `lib/data.ts` | From existing ShinhanProduct entry | BNPL for young shoppers with e-commerce activity | Medium — single package, may expand | Pending |

---

## 5. Archetypes

6 candidates in Batch 1. Based on: behavioral patterns, partner/channel context, early reaction posture.

| candidate_id | name | domain | status | source_link | extraction_note | reason_for_inclusion | confidence_fit_note | reviewer_decision_note |
|---|---|---|---|---|---|---|---|---|
| AR-01 | Digital Native High-Spender | archetype | pending review | Mapped from c001, c002 in `lib/data.ts` | **Behavioral profile:** Age 25-32, high income (15M-22M), high telco spend (300K-450K), high e-wallet usage (45-60 txn/mo), high ecommerce orders (8-15/mo, AOV 500K-800K), interests in tech/fashion/travel, high social activity. **Partner/channel context:** Acquired via e-wallet partner + digital onboarding channel; strong partner affinity. **Early reaction posture:** Opens and clicks offers quickly, prefers digital channels, responds to credit card and shopping categories. **Expected product tendency:** credit_card (cc-cashback, cc-platinum). **Expected action tendency:** push now | Represents ideal new customer — high signals across all dimensions, fast reaction | High — strong-fit slice candidate; maps to hero case | Pending |
| AR-02 | Traditional Salaried | archetype | pending review | Mapped from c006, c008, c010 in `lib/data.ts` | **Behavioral profile:** Age 27-38, moderate income (10M-28M), moderate telco spend (200K-350K), low-medium e-wallet usage (15-30 txn/mo), low-medium ecommerce (4-8 orders/mo), interests in books/home/cooking, low social activity. **Partner/channel context:** Acquired via telco partner data, embedded finance channel. **Early reaction posture:** Opens offers but slow to click, prefers savings and personal loan products. **Expected product tendency:** personal_loan (pl-salary). **Expected action tendency:** nurture | Represents moderate-signal customer — good for nurture logic demonstration | High — borderline/interesting slice candidate | Pending |
| AR-03 | Entrepreneur | archetype | pending review | Mapped from c004, c007, c013 in `lib/data.ts` | **Behavioral profile:** Age 33-41, high income (25M-45M), high telco spend (500K-600K), high e-wallet usage (50-80 txn/mo), medium-high ecommerce (5-20 orders/mo, high AOV 1.5M-2M), interests in business/investment/golf, low-medium social activity. **Partner/channel context:** Acquired via e-commerce partner + full partnership model. **Early reaction posture:** Selective engagement — responds to SME and business-related offers, ignores consumer products. **Expected product tendency:** sme_loan (sme-micro). **Expected action tendency:** push now | Represents high-income business customer — clear SME loan case | High — strong-fit for SME track | Pending |
| AR-04 | Young Shopper | archetype | pending review | Mapped from c012, c017 in `lib/data.ts` | **Behavioral profile:** Age 24, low income (7M-9.5M), low telco spend (150K-300K), high e-wallet usage (40-45 txn/mo), moderate ecommerce (6-9 orders/mo), interests in fashion/beauty/kpop/design, high social activity. **Partner/channel context:** Acquired via e-wallet partner + digital onboarding. **Early reaction posture:** Opens and clicks shopping and BNPL offers immediately, ignores loan products. **Expected product tendency:** bnpl (bnpl-shop). **Expected action tendency:** push now | Represents young, low-income but high-engagement customer — BNPL fit | High — demonstrates alternative data value for thin-file customers | Pending |
| AR-05 | Family-Oriented | archetype | pending review | Mapped from c014, c016, c011 in `lib/data.ts` | **Behavioral profile:** Age 30-34, moderate income (18M-27M), moderate telco spend (320K-400K), low-medium e-wallet usage (20-30 txn/mo), low ecommerce (3-5 orders/mo), interests in health/family/children/education, low social activity. **Partner/channel context:** Acquired via telco partner + embedded finance channel. **Early reaction posture:** Opens offers slowly, responds to health and family-related products, ignores entertainment offers. **Expected product tendency:** insurance (ins-health). **Expected action tendency:** nurture | Represents family-focused customer — insurance cross-sell candidate | Medium-high — good for nurture + insurance track | Pending |
| AR-06 | Freelancer / Gig Worker | archetype | pending review | Mapped from c003, c009, c019 in `lib/data.ts` | **Behavioral profile:** Age 25-29, variable income (8M-16M), low-medium telco spend (200K-250K), high e-wallet usage (25-55 txn/mo), low-medium ecommerce (4-7 orders/mo), interests in technology/sport/music/gaming/content, high social activity. **Partner/channel context:** Acquired via e-wallet partner + digital onboarding. **Early reaction posture:** Fast response to urgent/fast loan offers, ignores long-term products, prefers mobile-first channels. **Expected product tendency:** personal_loan (pl-fast). **Expected action tendency:** hold (if income unstable) or push now (if e-wallet activity high) | Represents gig economy worker — tests fast loan + hold logic | High — demonstrates alternative data value for non-traditional income | Pending |

---

## Next Steps

1. Review all candidates in this document
2. Mark `status` to `approved` for candidates accepted into Batch 1
3. Select 2 use-case slices from approved candidates (1 strong-fit, 1 borderline)
4. Select hero case (best score from approved candidates)
5. Batch 1 complete when all above are approved
