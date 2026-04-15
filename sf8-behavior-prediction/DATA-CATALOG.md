# SF8 - Data Catalog: Candidate Registry

> **Status**: Working document for Batch 1 candidate population
> **Purpose**: Master catalog of all partner/channel, signal, product, and archetype candidates for the SF8 Customer Behavior Prediction PoC
> **Track**: Financial Services — Shinhan Finance (SVFC), InnoBoost 2026

---

## Table of Contents

1. [Partner / Channel Taxonomy](#1-partner--channel-taxonomy)
2. [Signal Taxonomy](#2-signal-taxonomy)
3. [Product Groups](#3-product-groups)
4. [Product Packages](#4-product-packages)
5. [Archetypes](#5-archetypes)
6. [Use-Case Slices (placeholder)](#6-use-case-slices-placeholder)
7. [Hero Case (placeholder)](#7-hero-case-placeholder)

---

## 1. Partner / Channel Taxonomy

Three taxonomy layers per spec:
- **Data-source partners** — anchored to the 4 SF8 source families
- **Acquisition/distribution channels** — embedded finance context
- **Shared-data partnership models** — data-sharing vs. distribution-only

### 1A. Data-Source Partners

These are the 4 SF8 source families. Each candidate represents a real Vietnamese market entity that could serve as a data-source partner for alternative data signals.

| candidate_id | name | domain | status | source_link | extraction_note | reason_for_inclusion | confidence_fit_note |
|---|---|---|---|---|---|---|---|
| DSP-01 | **Viettel** (Telco) | data-source-partner / telco | pending review | https://viettel.com.vn | Largest mobile operator in Vietnam (~65M subscribers). Public reference for telco data patterns. | Anchor telco partner — highest market share, best proxy for broad signal coverage. | High — Viettel is the dominant telco in Vietnam, making it the most realistic data-source partner for telco signals (spend, tenure, data usage). |
| DSP-02 | **Vinaphone** (Telco) | data-source-partner / telco | pending review | https://vinaphone.com.vn | Second-largest telco, strong in urban and enterprise segments. | Complementary telco source — covers enterprise/urban segment where Viettel may have less penetration. | Medium-high — solid secondary telco partner; useful for segment diversity. |
| DSP-03 | **Mobifone** (Telco) | data-source-partner / telco | pending review | https://mobifone.vn | Third major telco, strong youth and prepaid segments. | Covers youth/prepaid segment — important for BNPL and digital card targeting. | Medium — smaller but relevant for young customer archetypes. |
| DSP-04 | **MoMo** (E-Wallet) | data-source-partner / e-wallet | pending review | https://momo.vn | Leading e-wallet in Vietnam, 30M+ users, partnership with Shinhan Financial Services (SVFC) announced in 2023. | Primary e-wallet partner — largest user base, existing SVFC partnership reference. | High — MoMo already has a real partnership with Shinhan Finance, making this the most grounded candidate. |
| DSP-05 | **ZaloPay** (E-Wallet) | data-source-partner / e-wallet | pending review | https://zalopay.vn | Second-largest e-wallet, integrated with Zalo ecosystem. | Complementary e-wallet — strong social-commerce linkage via Zalo. | High — Zalo ecosystem integration provides unique social+payment signal overlap. |
| DSP-06 | **VNPay** (E-Wallet) | data-source-partner / e-wallet | pending review | https://vnpay.vn | Major QR payment and e-wallet provider, backed by BIDV. | Bank-backed e-wallet — useful for traditional finance segment signals. | Medium — more QR-payment focused than full e-wallet; still valuable. |
| DSP-07 | **Shopee** (E-Commerce) | data-source-partner / e-commerce | pending review | https://shopee.vn | Largest e-commerce platform in Vietnam by GMV. | Primary e-commerce partner — highest transaction volume, richest purchase behavior signals. | High — Shopee dominates VN e-commerce; purchase patterns directly map to product affinity. |
| DSP-08 | **Lazada** (E-Commerce) | data-source-partner / e-commerce | pending review | https://lazada.vn | Second-largest e-commerce platform, Alibaba-backed. | Complementary e-commerce source — different merchant base, useful for segment diversity. | Medium — smaller than Shopee but still significant. |
| DSP-09 | **Tiki** (E-Commerce) | data-source-partner / e-commerce | pending review | https://tiki.vn | Vietnamese-origin e-commerce platform, strong in electronics/books. | Local platform — useful for domestic-product preference signals. | Medium — smaller GMV but culturally relevant segment. |
| DSP-10 | **Facebook / Meta** (Social) | data-source-partner / social | pending review | https://facebook.com | Dominant social platform in Vietnam (~70M users). | Primary social partner — largest social data source for interest/activity signals. | High — Facebook is the most widely used social platform in Vietnam. |
| DSP-11 | **Zalo** (Social) | data-source-partner / social | pending review | https://zalo.me | Most popular Vietnamese messaging app, 75M+ users. | Local social/messaging — provides unique Vietnamese-language social signals. | High — Zalo is the primary messaging app in Vietnam; strong signal value. |
| DSP-12 | **TikTok** (Social) | data-source-partner / social | pending review | https://tiktok.com | Fastest-growing social platform among Vietnamese youth. | Youth-focused social signals — important for BNPL and digital card archetypes. | Medium-high — growing rapidly among target segments. |

### 1B. Acquisition / Distribution Channels

Channels through which Shinhan Finance acquires or distributes products to new customers, in an embedded finance context.

| candidate_id | name | domain | status | source_link | extraction_note | reason_for_inclusion | confidence_fit_note |
|---|---|---|---|---|---|---|---|
| CH-01 | **POS Partner Network** (Point-of-Sale) | acquisition-channel | pending review | — | Embedded finance touchpoint at merchant POS (e.g., installment offers at checkout). | Direct consumer finance distribution channel — easy to explain in demo. | High — POS is a classic embedded finance channel for consumer loans and BNPL. |
| CH-02 | **Digital Onboarding** (App/Web) | acquisition-channel | pending review | — | Fully digital customer onboarding flow via Shinhan Finance app or web portal. | Maps directly to "new customer" scenario in SF8 brief. | High — core channel for digital-first customer acquisition. |
| CH-03 | **Referral Program** (Partner Referral) | acquisition-channel | pending review | — | Customers referred by existing data-source partners (e.g., MoMo referral to Shinhan Finance). | Leverages partner trust for acquisition — good for partnership scoring. | Medium-high — realistic embedded finance pattern. |
| CH-04 | **Agent Network** (Field Agents) | acquisition-channel | pending review | — | Traditional field agent distribution for customer onboarding and product sales. | Provides contrast to digital channels — useful for simulation comparison. | Medium — less digital-signal-rich but still part of SVFC distribution. |

### 1C. Shared-Data Partnership Models

| candidate_id | name | domain | status | source_link | extraction_note | reason_for_inclusion | confidence_fit_note |
|---|---|---|---|---|---|---|---|
| PM-01 | **Data-Sharing Only** | partnership-model | pending review | — | Partner shares alternative data signals with Shinhan Finance; no product distribution through partner. | Distinguishes pure data-sharing from distribution — required by taxonomy spec. | High — required taxonomy layer. |
| PM-02 | **Distribution-Only** | partnership-model | pending review | — | Partner distributes Shinhan Finance products to its user base; no data sharing. | Distinguishes distribution from data-sharing — required by taxonomy spec. | High — required taxonomy layer. |
| PM-03 | **Full Partnership** (Data + Distribution) | partnership-model | pending review | — | Partner both shares data AND distributes Shinhan Finance products. | Most valuable partnership model — highest signal + distribution synergy. | High — best-fit model for SF8 hero case. |

---

## 2. Signal Taxonomy

Four signal groups per spec. Each signal candidate includes feature-level grouping, example fields, and scoring intent.

### 2A. External Behavioral Signals

Signals derived from actual customer activity across telco, e-wallet, e-commerce, and social platforms.

| candidate_id | signal_group | feature_group | example_fields | status | scoring_intent | source_link | extraction_note | reason_for_inclusion | confidence_fit_note |
|---|---|---|---|---|---|---|---|---|---|
| SIG-01 | External behavioral | Telco spending pattern | `monthlySpend`, `avgTopUp`, `roamingSpend` | pending review | Higher spend → higher income proxy → product eligibility (credit card, personal loan). Contributes to behavioral engagement score. | data.ts (ALTERNATIVE_DATA.telco.monthlySpend) | Derived from telco spending fields in existing data model. | Core behavioral signal — telco spend is a direct income proxy. | High — already in data model. |
| SIG-02 | External behavioral | Telco tenure & stability | `tenure`, `contractType`, `numberPorting` | pending review | Longer tenure → stability indicator → lower risk proxy. Contributes to customer reliability score. | data.ts (ALTERNATIVE_DATA.telco.tenure) | Derived from telco tenure field. | Stability signal — important for loan product eligibility. | High — already in data model. |
| SIG-03 | External behavioral | Data usage intensity | `dataUsage`, `peakHourRatio`, `internationalData` | pending review | Higher data usage → digital engagement → higher response probability. Contributes to digital readiness score. | data.ts (ALTERNATIVE_DATA.telco.dataUsage) | Derived from telco data usage field. | Digital engagement proxy — correlates with early reaction likelihood. | High — already in data model. |
| SIG-04 | External behavioral | E-wallet transaction frequency | `usage`, `monthlyTransactions`, `avgTransactionValue` | pending review | Higher transaction frequency → financial activity → higher product readiness. Contributes to financial activity score. | data.ts (ALTERNATIVE_DATA.eWallet) | Derived from e-wallet usage, monthlyTransactions fields. | Core financial signal — transaction behavior directly maps to financial product readiness. | High — already in data model. |
| SIG-05 | External behavioral | E-wallet category diversity | `categories[]`, `categoryCount`, `dominantCategory` | pending review | More categories → broader financial behavior → higher cross-sell potential. Contributes to product affinity breadth score. | data.ts (ALTRANATIVE_DATA.eWallet.categories) | Derived from e-wallet category array. | Category diversity indicates customer lifestyle breadth — useful for product matching. | High — already in data model. |
| SIG-06 | External behavioral | E-commerce order frequency | `monthlyOrders`, `orderFrequency`, `repeatPurchaseRate` | pending review | Higher order frequency → purchase readiness → BNPL/credit card affinity. Contributes to purchase propensity score. | data.ts (ALTERNATIVE_DATA.ecommerce.monthlyOrders) | Derived from e-commerce order frequency field. | Purchase behavior directly maps to BNPL and credit card product affinity. | High — already in data model. |
| SIG-07 | External behavioral | E-commerce spend level | `avgOrderValue`, `totalMonthlySpend`, `maxSingleOrder` | pending review | Higher spend → higher income capacity → premium product eligibility. Contributes to spending capacity score. | data.ts (ALTERNATIVE_DATA.ecommerce.avgOrderValue) | Derived from e-commerce avgOrderValue field. | Spend level is an income proxy — critical for product tier matching. | High — already in data model. |
| SIG-08 | External behavioral | E-commerce category preference | `categories[]`, `categoryCount`, `dominantCategory` | pending review | Category preferences → product affinity (e.g., electronics → credit card; fashion → BNPL). Contributes to product affinity score. | data.ts (ALTERNATIVE_DATA.ecommerce.categories) | Derived from e-commerce category array. | Category preference directly maps to product group recommendations. | High — already in data model. |
| SIG-09 | External behavioral | Social activity level | `activity`, `postFrequency`, `engagementRate` | pending review | Higher social activity → digital engagement → higher response probability. Contributes to digital engagement score. | data.ts (ALTERNATIVE_DATA.social.activity) | Derived from social activity field. | Social activity is a proxy for digital engagement and communication receptiveness. | High — already in data model. |
| SIG-10 | External behavioral | Social interest profile | `interests[]`, `interestCount`, `interestCategories` | pending review | Interest categories → product affinity (e.g., business → SME loan; health → insurance). Contributes to lifestyle-product match score. | data.ts (ALTERNATIVE_DATA.social.interests) | Derived from social interests array. | Interest signals directly inform product recommendation logic. | High — already in data model. |

### 2B. External Profile / Context Signals

Demographic and contextual signals that provide background for customer profiling.

| candidate_id | signal_group | feature_group | example_fields | status | scoring_intent | source_link | extraction_note | reason_for_inclusion | confidence_fit_note |
|---|---|---|---|---|---|---|---|---|---|
| SIG-11 | External profile/context | Age bracket | `age`, `ageBracket` (young: <25, mid: 25-40, senior: >40) | pending review | Age bracket → product eligibility and archetype mapping (e.g., young → BNPL, mid-age → insurance). Contributes to demographic fit score. | data.ts (Customer.age) | Derived from customer age field, mapped to brackets. | Age is a primary demographic signal for product targeting. | High — already in data model. |
| SIG-12 | External profile/context | Income bracket | `income`, `incomeBracket` (low: <10M, mid: 10-25M, high: 25-40M, premium: >40M) | pending review | Income bracket → product eligibility filter (minIncome threshold). Contributes to financial capacity score. | data.ts (Customer.income) | Derived from customer income field, mapped to brackets. | Income is the primary eligibility gate for all products. | High — already in data model. |
| SIG-13 | External profile/context | Occupation type | `occupation`, `occupationType` (office, freelancer, business, student, etc.) | pending review | Occupation type → product affinity (e.g., office → salary loan; business → SME loan). Contributes to professional fit score. | data.ts (Customer.occupation) | Derived from customer occupation field, mapped to types. | Occupation directly informs product eligibility and archetype mapping. | High — already in data model. |
| SIG-14 | External profile/context | Location / region | `region` (urban, suburban, rural), `city` | pending review | Urban location → higher digital product readiness; rural → lower digital engagement. Contributes to geographic readiness score. | Reference: Vietnam General Statistics Office | Assumed field for future data model extension. | Geographic context affects product relevance and channel effectiveness. | Medium — not yet in data model but planned. |

### 2C. Partner / Channel-Derived Signals

Signals inferred from the partner/channel context and the quality of the partnership relationship.

| candidate_id | signal_group | feature_group | example_fields | status | scoring_intent | source_link | extraction_note | reason_for_inclusion | confidence_fit_note |
|---|---|---|---|---|---|---|---|---|---|
| SIG-15 | Partner/channel-derived | Partner engagement level | `partnerEngagementScore`, `dataSharingDuration`, `dataQualityRating` | pending review | Higher partner engagement → better data quality → higher confidence in scoring. Contributes to partner fit score. | SF8 brief (partnership context) | Derived from partnership model assumptions. | Partner engagement affects the reliability of all alternative data signals. | High — required by spec. |
| SIG-16 | Partner/channel-derived | Channel quality score | `channelQualityScore`, `conversionHistory`, `channelTrustLevel` | pending review | Higher channel quality → higher conversion probability → action recommendation. Contributes to channel fit score. | SF8 brief (embedded finance context) | Derived from channel quality assumptions. | Channel quality directly affects simulation outcomes and action recommendations. | High — required by spec. |
| SIG-17 | Partner/channel-derived | Partnership model fit | `partnershipModel` (data-sharing, distribution-only, full), `modelFitScore` | pending review | Full partnership → highest score potential; data-sharing → moderate; distribution-only → lower. Contributes to partnership score. | SF8 brief (partnership models) | Derived from partnership model taxonomy. | Partnership model is a key simulation variable in the what-if engine. | High — required by spec. |

### 2D. Early Reaction Signals

Signals based on customer response to Shinhan Finance offers — critical for action recommendation (push now, nurture, hold).

| candidate_id | signal_group | feature_group | example_fields | status | scoring_intent | source_link | extraction_note | reason_for_inclusion | confidence_fit_note |
|---|---|---|---|---|---|---|---|---|---|
| SIG-18 | Early reaction | Offer open rate | `openRate`, `totalOffersSent`, `totalOffersOpened` | pending review | Higher open rate → higher interest confirmation. Contributes to interest score. | SF8 brief (early reactions) | Derived from early reaction scope in spec. | Open rate is the first indicator of customer interest. | High — required by spec. |
| SIG-19 | Early reaction | Offer click rate | `clickRate`, `totalClicks`, `clickThroughRate` | pending review | Higher click rate → active engagement → push now candidate. Contributes to engagement score. | SF8 brief (early reactions) | Derived from early reaction scope in spec. | Click rate confirms active interest beyond passive opening. | High — required by spec. |
| SIG-20 | Early reaction | Response speed | `avgResponseTime`, `responseSpeedBucket` (instant: <1h, fast: <24h, slow: >24h) | pending review | Faster response → higher urgency → push now. Contributes to urgency score. | SF8 brief (early reactions: response speed) | Derived from response speed scope in spec. | Response speed determines action timing recommendation. | High — required by spec. |
| SIG-21 | Early reaction | Offer category preference | `preferredOfferCategory`, `categoryClickMap` | pending review | Category preference → product affinity confirmation. Contributes to product affinity score. | SF8 brief (early reactions: offer category preference) | Derived from offer category preference scope in spec. | Directly maps to product recommendation logic. | High — required by spec. |
| SIG-22 | Early reaction | Channel preference | `preferredChannel`, `channelResponseMap` | pending review | Channel preference → channel optimization for simulation. Contributes to channel fit score. | SF8 brief (early reactions: channel preference) | Derived from channel preference scope in spec. | Supports simulation variable for channel optimization. | High — required by spec. |
| SIG-23 | Early reaction | Ignore rate | `ignoreRate`, `totalIgnored`, `ignorePattern` | pending review | Higher ignore rate → lower interest → hold or nurture candidate. Contributes to disinterest flag. | SF8 brief (early reactions: ignore) | Derived from ignore scope in spec. | Negative signal needed for hold/nurture logic. | High — required by spec. |

---

## 3. Product Groups

4 product groups + BNPL (5 total, as specified in the task). Dual naming: internal canonical name + market-like display label.

| candidate_id | internal_name | display_name | status | source_link | extraction_note | reason_for_inclusion | confidence_fit_note |
|---|---|---|---|---|---|---|---|
| PG-01 | credit_card | Thẻ tín dụng | pending review | data.ts (PRODUCTS where type = "credit_card") | Mapped from existing product data model. Shinhan Finance offers credit cards as a core product. | Core consumer finance product — high-frequency engagement driver, directly supported in data.ts. | High — matches existing data model. |
| PG-02 | personal_loan | Vay cá nhân | pending review | data.ts (PRODUCTS where type = "personal_loan") | Mapped from existing product data model. Shinhan Finance offers personal loans (salary-based and fast). | Core revenue product — directly addresses "new customer" lending need. | High — matches existing data model. |
| PG-03 | sme_loan | Vay SME | pending review | data.ts (PRODUCTS where type = "sme_loan") | Mapped from existing product data model. Shinhan Finance offers SME micro-loans. | Important for business-owner archetypes — SME is a growing segment for SVFC. | High — matches existing data model. |
| PG-04 | insurance | Bảo hiểm | pending review | data.ts (PRODUCTS where type = "insurance") | Mapped from existing product data model. Shinhan Finance offers health insurance. | Cross-sell product — growing segment, relevant for family-oriented archetypes. | High — matches existing data model. |
| PG-05 | bnpl | Mua trước trả sau | pending review | data.ts (PRODUCTS where type = "bnpl") | Mapped from existing product data model. BNPL is an emerging consumer finance product. | High-growth product — directly maps to young shopper archetype and e-commerce signals. | High — matches existing data model. |

---

## 4. Product Packages

Each product group has 1-2 packages (min 2 total per group is satisfied across groups). Dual naming: internal canonical name + public/market-like display label.

| candidate_id | internal_name | display_name | product_group_id | target_segment | min_income (VND) | eligibility_rules | status | source_link | extraction_note | reason_for_inclusion | confidence_fit_note |
|---|---|---|---|---|---|---|---|---|---|---|---|
| PP-01 | cc-platinum | Thẻ tín dụng Platinum | PG-01 (credit_card) | office, it, professional, young_professional | 10,000,000 | income >= 10M AND (occupation = office OR it OR professional) | pending review | data.ts (PRODUCTS id: "cc-platinum") | Directly mapped from existing product data model. | Premium credit card for salaried professionals — core product. | High — exact match from data.ts. |
| PP-02 | cc-cashback | Thẻ tín dụng Cashback | PG-01 (credit_card) | shopping, ecommerce, young | 8,000,000 | income >= 8M AND (ecommerce_activity = medium OR high) | pending review | data.ts (PRODUCTS id: "cc-cashback") | Directly mapped from existing product data model. | Cashback card for shopping-focused customers — high e-commerce signal affinity. | High — exact match from data.ts. |
| PP-03 | pl-salary | Vay thỏa thuận lương | PG-02 (personal_loan) | salaried, office, stable_income | 8,000,000 | income >= 8M AND occupation = office/stable | pending review | data.ts (PRODUCTS id: "pl-salary") | Directly mapped from existing product data model. | Salary-based personal loan for stable-income customers — core loan product. | High — exact match from data.ts. |
| PP-04 | pl-fast | Vay nhanh trong ngày | PG-02 (personal_loan) | freelancer, gig, urgent | 5,000,000 | income >= 5M (no occupation restriction) | pending review | data.ts (PRODUCTS id: "pl-fast") | Directly mapped from existing product data model. | Fast-approval loan for gig/freelancer customers — urgent-need segment. | High — exact match from data.ts. |
| PP-05 | sme-micro | Vay SME Micro | PG-03 (sme_loan) | business, entrepreneur, sme | 15,000,000 | income >= 15M AND (occupation = business OR entrepreneur) | pending review | data.ts (PRODUCTS id: "sme-micro") | Directly mapped from existing product data model. | Micro-loan for SME owners — business segment product. | High — exact match from data.ts. |
| PP-06 | ins-health | Bảo hiểm sức khỏe | PG-04 (insurance) | family, health_conscious, mid_age | 10,000,000 | income >= 10M AND (age >= 28 OR interests contains health/family) | pending review | data.ts (PRODUCTS id: "ins-health") | Directly mapped from existing product data model. | Health insurance for family-oriented customers — cross-sell product. | High — exact match from data.ts. |
| PP-07 | bnpl-shop | Mua trước trả sau Shopping | PG-05 (bnpl) | shopping, ecommerce, young | 7,000,000 | income >= 7M AND (ecommerce_orders >= 4 OR eWallet_usage = high) | pending review | data.ts (PRODUCTS id: "bnpl-shop") | Directly mapped from existing product data model. | BNPL for young shoppers — e-commerce signal affinity. | High — exact match from data.ts. |

---

## 5. Archetypes

6 archetype candidates based on behavioral patterns, partner/channel context, and early reaction posture. Each includes all required fields.

### AR-01: Digital Native High-Spender

| Field | Value |
|---|---|
| **candidate_id** | AR-01 |
| **name** | Digital Native High-Spender |
| **behavioral profile** | Age 25-32, high income (15M-35M VND/month), tech worker or young professional. High e-wallet usage (40+ transactions/month), high e-commerce orders (8-20/month, high AOV), high social activity. Interests: technology, gaming, travel, fashion. Telco: high data usage (15-25 GB), high monthly spend (300K-600K VND). |
| **partner/channel context** | Acquired via **digital onboarding** (CH-02) + **MoMo e-wallet partner** (DSP-04) + **Shopee e-commerce** (DSP-07). Partnership model: **Full Partnership** (PM-03). High partner engagement, high channel quality. |
| **early reaction posture** | Opens offers within 1 hour (instant response), clicks through 60-80% of offers, prefers digital channels (app/web), strong preference for credit card and BNPL offers. Ignore rate: low (10-20%). |
| **expected product tendency** | Primary: **Credit Card** (cc-platinum). Secondary: **BNPL** (bnpl-shop). |
| **expected action tendency** | **push now** — high score, high engagement, fast response. |
| **status** | pending review |
| **source_link** | Derived from data.ts customers c001 (Nguyễn Văn An), c002 (Trần Thị Bình), c004 (Phạm Minh Dung) |
| **extraction_note** | Composite of high-signal customers in existing data model: high telco spend, high e-wallet transactions, high e-commerce activity, tech/business interests. |
| **reason_for_inclusion** | Represents the ideal new customer — highest signal quality, fastest reaction, clearest product affinity. Strong candidate for hero case. |
| **confidence_fit_note** | High — directly maps to existing high-signal customers in data.ts. Best-fit slice candidate. |

### AR-02: Traditional Salaried

| Field | Value |
|---|---|
| **candidate_id** | AR-02 |
| **name** | Traditional Salaried |
| **behavioral profile** | Age 30-40, moderate income (12M-28M VND/month), office worker, teacher, accountant, HR. Moderate e-wallet usage (20-40 transactions/month), moderate e-commerce (4-10 orders/month, moderate AOV). Low-moderate social activity. Interests: education, books, home, cooking, family. Telco: moderate data usage (8-12 GB), moderate spend (200K-400K VND). |
| **partner/channel context** | Acquired via **telco partner** (DSP-01 Viettel or DSP-02 Vinaphone) + **embedded finance channel** (CH-01). Partnership model: **Data-Sharing Only** (PM-01). Moderate partner engagement, moderate channel quality. |
| **early reaction posture** | Opens offers within 24 hours (fast response), clicks 30-50% of offers, prefers email/SMS channels, moderate preference for personal loan and savings offers. Ignore rate: moderate (30-40%). |
| **expected product tendency** | Primary: **Personal Loan** (pl-salary). Secondary: **Credit Card** (cc-cashback). |
| **expected action tendency** | **nurture** — moderate score, steady engagement, needs time to convert. |
| **status** | pending review |
| **source_link** | Derived from data.ts customers c006 (Đỗ Thị Loan), c008 (Bùi Thị Hương), c010 (Ngô Thị Lan), c014 (Hoàng Thị Quỳnh) |
| **extraction_note** | Composite of moderate-signal customers in existing data model: stable income, moderate digital activity, traditional occupation types. |
| **reason_for_inclusion** | Represents the moderate-signal customer — good for nurture logic demonstration. Borderline/interesting slice candidate. |
| **confidence_fit_note** | High — directly maps to existing moderate-signal customers in data.ts. Good borderline slice. |

### AR-03: Entrepreneur

| Field | Value |
|---|---|
| **candidate_id** | AR-03 |
| **name** | Entrepreneur |
| **behavioral profile** | Age 35-45, high income (30M-50M VND/month), business owner, CEO, director. High e-wallet usage (50-100+ transactions/month, business categories), high e-commerce (10-25 orders/month, very high AOV). Low-moderate social activity. Interests: business, investment, golf, luxury. Telco: high data usage (15-30 GB), very high spend (500K-800K VND), long tenure. |
| **partner/channel context** | Acquired via **full partnership** with **e-commerce partner** (DSP-07 Shopee or DSP-08 Lazada) + **POS partner network** (CH-01). Partnership model: **Full Partnership** (PM-03). High partner engagement, high channel quality. |
| **early reaction posture** | Opens offers within 1-2 hours, clicks 40-60% of offers, prefers direct channels (phone, email), strong preference for SME loan and premium credit card offers. Ignore rate: low-moderate (20-30%). |
| **expected product tendency** | Primary: **SME Loan** (sme-micro). Secondary: **Credit Card** (cc-platinum). |
| **expected action tendency** | **push now** — high income, clear business need, strong engagement. |
| **status** | pending review |
| **source_link** | Derived from data.ts customers c004 (Phạm Minh Dung), c007 (Vũ Quốc Huy), c013 (Lý Văn Phong), c018 (Phạm Thị Uyên) |
| **extraction_note** | Composite of business-owner and high-income customers in existing data model: high income, business interests, high transaction volume. |
| **reason_for_inclusion** | Represents the high-income business segment — important for SME loan track and premium product positioning. |
| **confidence_fit_note** | High — maps to existing high-income customers. Strong fit for SME product track. |

### AR-04: Young Shopper

| Field | Value |
|---|---|
| **candidate_id** | AR-04 |
| **name** | Young Shopper |
| **behavioral profile** | Age 18-26, low-moderate income (5M-12M VND/month), student, fresh grad, content creator. High e-wallet usage (30-55 transactions/month, fashion/beauty/food categories), moderate e-commerce (4-8 orders/month, low-moderate AOV). High social activity. Interests: fashion, beauty, K-pop, entertainment, gaming. Telco: moderate-high data usage (15-25 GB), low-moderate spend (150K-300K VND). |
| **partner/channel context** | Acquired via **MoMo e-wallet partner** (DSP-04) + **TikTok social** (DSP-12) + **digital onboarding** (CH-02). Partnership model: **Full Partnership** (PM-03). Moderate partner engagement, moderate channel quality. |
| **early reaction posture** | Opens offers within 1-4 hours, clicks 40-60% of offers (especially BNPL and shopping-related), prefers social/app channels, strong preference for BNPL offers. Ignore rate: moderate (25-35%). |
| **expected product tendency** | Primary: **BNPL** (bnpl-shop). Secondary: **Credit Card** (cc-cashback). |
| **expected action tendency** | **push now** — high e-commerce activity, clear BNPL affinity, fast response on preferred offers. |
| **status** | pending review |
| **source_link** | Derived from data.ts customers c003 (Lê Hoàng Cường), c012 (Võ Thị Nga), c019 (Võ Văn Vinh) |
| **extraction_note** | Composite of young, high-social, fashion/beauty-interested customers in existing data model: high e-wallet usage, moderate income, young age. |
| **reason_for_inclusion** | Represents the young, e-commerce-active segment — ideal for BNPL product demonstration and social signal validation. |
| **confidence_fit_note** | High — maps to existing young customers in data.ts. Strong fit for BNPL track. |

### AR-05: Family-Oriented

| Field | Value |
|---|---|
| **candidate_id** | AR-05 |
| **name** | Family-Oriented |
| **behavioral profile** | Age 30-42, moderate income (15M-30M VND/month), teacher, pharmacist, banker, healthcare worker. Moderate e-wallet usage (20-35 transactions/month, family/health/food categories), moderate e-commerce (4-8 orders/month, moderate AOV). Low social activity. Interests: health, family, education, children, cooking. Telco: moderate data usage (8-15 GB), moderate spend (250K-45