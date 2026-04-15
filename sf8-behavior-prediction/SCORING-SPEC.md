# SCORING-SPEC.md

## Score Families

The scoring model consists of **five score families**. All scores are deterministic-first (rule-based), with Qwen used only for explanation generation. Every score is on a 0-100 scale.

| # | Score Family | Abbreviation | Description | Range | Primary Inputs |
|---|---|---|---|---|---|
| 1 | **Partner/Channel Fit** | `pcf` | How well the customer matches the partner/channel characteristics and acquisition context | 0-100 | Digital engagement level, channel activity patterns |
| 2 | **Behavior Signal Strength** | `bss` | Strength of behavioral signals from alternative data sources | 0-100 | Telco spending consistency, e-wallet transaction frequency, ecommerce order volume, social activity level |
| 3 | **Early Reaction Quality** | `erq` | Customer's responsiveness to offers and engagement patterns | 0-100 | Engagement patterns, response speed (simulated), category alignment |
| 4 | **Product Affinity** | `pa` | Match between customer profile and specific product package | 0-100 per product | Income eligibility, occupation fit, interest alignment, spending patterns |
| 5 | **Action Recommendation** | `ar` | Recommended next action (derived from other scores) | `push now` / `nurture` / `hold` | Overall score, pcf, pa, erq |

---

## Input Dimensions

### Customer Profile

| Field | Type | Description |
|---|---|---|
| `age` | number | Customer age |
| `income` | number (VND/month) | Monthly income |
| `occupation` | string | Job title / occupation category |

### Alternative Data

| Source | Fields | Description |
|---|---|---|
| **Telco** | `monthlySpend` (VND), `tenure` (months), `dataUsage` (GB) | Spending consistency, loyalty, digital engagement |
| **E-Wallet** | `usage` (low/medium/high), `monthlyTransactions` (count), `categories` (string[]) | Transaction frequency, category diversity |
| **E-Commerce** | `monthlyOrders` (count), `avgOrderValue` (VND), `categories` (string[]) | Order volume, spending capacity, interest signals |
| **Social** | `interests` (string[]), `activity` (low/medium/high) | Interest alignment, engagement level |

### Available Products

| Field | Type | Description |
|---|---|---|
| `id` | string | Product package ID |
| `name` | string | Display name (dual naming: Vietnamese + English) |
| `type` | enum | `credit_card`, `personal_loan`, `sme_loan`, `insurance`, `bnpl` |
| `minIncome` | number (VND) | Minimum income requirement |
| `targetSegment` | string[] | Target customer segments |

### Partner/Channel Context

| Field | Type | Description |
|---|---|---|
| `data_source` | string | Partner providing the alternative data |
| `acquisition_channel` | string | Channel through which customer was acquired |

---

## Decision Rule (Deterministic-First)

All scores are computed via a **rule-based engine**. Qwen is used ONLY for explanation text generation -- never for scoring, action, or product recommendation.

### Overall Score Computation

```
overall_score = round(
  pcf * w1 +
  bss * w2 +
  erq * w3
)

where w1 + w2 + w3 = 1.0
```

Weights are documented in the implementation code. The conceptual structure is binding -- any implementation must follow this weighted-sum approach.

### Product Affinity Computation

For each product package:
```
pa[package] = score based on:
  - income_eligibility: 1 if income >= minIncome, 0 otherwise (gate)
  - occupation_fit: match between customer occupation and product targetSegment
  - interest_alignment: match between customer interests/spending categories and product type
  - spending_pattern: consistency with expected customer profile for product

next_best_product = package with highest pa score among income-eligible products
```

### Action Derivation

Action is derived deterministically from overall score, product affinity, and other sub-scores. See Action Mapping below.

**Qwen has NO role in any scoring, product, or action decision.**

---

## Action Mapping

The recommended action depends on **four inputs**:

| Input | Role in Decision |
|---|---|
| **Overall Score** | Primary threshold -- high scores favor `push now`, low scores favor `hold` |
| **Partner/Channel Fit (pcf)** | Modifies action -- high fit on low overall score may shift from `hold` to `nurture` |
| **Product Affinity (pa)** | Confirms product match -- strong affinity to at least one product is required for `push now` |
| **Early Reaction Quality (erq)** | Urgency modifier -- fast, positive reactions favor `push now`; slow/ignored reactions favor `hold` |

### Deterministic Action Rules

| Condition | Action |
|---|---|
| `overall_score >= 75` AND `product_affinity[top] >= 70` | **`push now`** |
| `overall_score` in range 50-74 AND `product_affinity[top] >= 50` | **`nurture`** |
| `overall_score < 50` OR `product_affinity[top] < 50` | **`hold`** |

These thresholds are the binding specification. Implementation must follow this structure.

---

## Simulation Variables

Simulation is **limited to exactly three variables**. No other variables may be adjusted in the what-if simulation.

| # | Variable | Description | Effect |
|---|---|---|---|
| 1 | **Partner/Channel** | Change the assumed data source or acquisition channel | Changes pcf score, which may change overall score, product affinity, and action |
| 2 | **Product/Offer** | Change the recommended product or offer terms | Changes pa computation, which may change next best product and action |
| 3 | **Early Reaction Signal** | Change the assumed customer responsiveness (e.g., from "ignored" to "clicked") | Changes erq score, which may change overall score and action |

**Explicitly NOT simulatable**: Behavior signal inputs (telco spend, e-wallet transactions, etc.), product group definitions, partner taxonomy, archetype assignment, scoring weights, customer profile data (age, income, occupation).

---

## Qwen Role

| Allowed | Not Allowed |
|---|---|
| Generate human-readable explanation of why a score was computed | Compute or modify scores |
| Generate personalized outreach/offer note for the recommended action | Decide the recommended action |
| Summarize what-if simulation results in natural language | Change simulation logic or outcomes |
| Provide narrative context for the customer profile | Make any decision that affects canonical outputs |

**Qwen is server-side only. Qwen never receives decision authority over scores, actions, product recommendations, or simulation outcomes.**

---

## Output Contract

The scoring system must produce the following outputs for each customer:

### Primary Business Outputs

| Field | Type | Description |
|---|---|---|
| `overallScore` | number (0-100) | Partnership/acquisition score |
| `recommendedProduct` | string (package_id) | Next best product recommendation |
| `action` | enum: `"push now"` \| `"nurture"` \| `"hold"` | Recommended next action |
| `confidence` | number (0-1) | Confidence level in the recommendation |

### Explanation / Support Fields

| Field | Type | Description |
|---|---|---|
| `scoreBreakdown.pcf` | number (0-100) | Partner/channel fit sub-score |
| `scoreBreakdown.bss` | number (0-100) | Behavior signal strength sub-score |
| `scoreBreakdown.erq` | number (0-100) | Early reaction quality sub-score |
| `scoreBreakdown.pa` | number (0-100) | Product affinity for recommended product |
| `reasonText` | string | Qwen-generated explanation of the score and recommendation |
| `nextAction` | string | Qwen-generated recommended next step with context |

### Simulation Delta Fields

| Field | Type | Description |
|---|---|---|
| `baseScore` | number (0-100) | Score before simulation change |
| `simulatedScore` | number (0-100) | Score after simulation change |
| `delta` | number | `simulatedScore - baseScore` |
| `changedVariable` | enum: `"partner_channel"` \| `"product_offer"` \| `"early_reaction"` | Which simulation variable was adjusted |

---

## Validation / Sanity Checks

### Archetype-Based Sanity

| Archetype | Customer ID | Expected Score Range | Rationale |
|---|---|---|---|
| **AR-01 Digital Native** (strong-fit) | c001 (Nguyen Van An) | > 70 | High digital engagement, stable income, strong alternative data coverage |
| **AR-06 Freelancer** (borderline) | c003 (Le Hoang Cuong) | 40-60 | Lower income stability, moderate signals, higher uncertainty |

### Internal Logic Consistency

| Check | Rule |
|---|---|
| Score range validity | All scores must be within 0-100 |
| Weight normalization | w1 + w2 + w3 = 1.0 for overall score |
| Product affinity completeness | Every income-eligible product must have an affinity score |
| next_best_product matches highest pa | The recommended product must be the one with the highest affinity score among income-eligible products |
| action matches score thresholds | Action must be consistent with the action mapping rules above |
| action is one of three allowed values | Only `push now`, `nurture`, `hold` are valid |

### Hero Case Validation

| Check | Rule |
|---|---|
| Hero case has highest score | The selected hero case must have the highest overall score among all demo candidates |
| Hero case is reachable quickly | Demo flow must reach hero case within 2 clicks from dashboard |

### Base vs. What-If Consistency

| Check | Rule |
|---|---|
| Simulation delta uses same scoring model | What-if results must use the identical deterministic logic as the base case |
| Only the specified simulation variable changes | All other inputs remain constant during simulation |
| All delta fields are non-null | `baseScore`, `simulatedScore`, `delta`, `changedVariable` must all be populated |

---

## Known Limitations

| Limitation | Description | Impact |
|---|---|---|
| **Demo data only** | Scoring runs on generated demo data, not trained on real customers | Scores are relative within the demo set, not absolute creditworthiness indicators |
| **Not ML-trained** | Scores are computed using rule-based weights and thresholds, not trained ML models | Illustrative approach, not predictive of real-world outcomes |
| **Alternative data coverage varies** | Not all customers have equally rich alternative data profiles | Score comparability assumes similar data quality across the demo set |
| **Fixed simulation variables** | Only 3 variables can be adjusted in what-if analysis | Real-world scenarios may involve more complex changes |
| **No temporal dynamics** | Scoring is a point-in-time computation | Does not model how customer behavior evolves over time |
| **Thresholds are PoC values** | Exact threshold values may shift during implementation | The conceptual structure is binding; specific numbers may be tuned |
