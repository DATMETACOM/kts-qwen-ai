# SF8-CONTEXT.md

## Phase Boundary

**Scope**: PoC for new customer behavior prediction using alternative data (telco, e-wallet, ecommerce, social).

**Timeline**: Hackathon build period April 11-17, 2026.

**Target**: Shinhan Finance InnoBoost 2026.

**Delivery Target**: Submission-ready prototype + pitch-ready offline demo.

**Team Shape**: 1 primary builder (single-threaded, agile, deliverable + risk driven).

---

## Primary Views

### 1. Dashboard

- **Objective**: Show portfolio overview at a glance.
- **Canonical Outputs**:
  - Partner/channel summary
  - Lead list (top 20 customers)
  - Product mix distribution
  - Action distribution (push/nurture/hold)
- **Decision Role**: Starting point of demo. Shows the scale of the opportunity and the variety of customer profiles in the portfolio.

### 2. Customer Detail

- **Objective**: Deep-dive into an individual customer's AI-powered profile.
- **Canonical Outputs**:
  - Alternative data signals (telco, e-wallet, ecommerce, social)
  - Behavior score (0-100) with sub-score breakdown
  - Product recommendation (next best product)
  - AI explanation (why this product, why this score)
  - Action recommendation (push now / nurture / hold)
- **Decision Role**: Shows AI-powered insight -- the core value demonstration of SF8.

### 3. Simulation Workspace

- **Objective**: What-if analysis for decision-makers.
- **Canonical Outputs**:
  - Base score vs. simulated score
  - Score delta (positive/negative change)
  - Action delta (did the recommendation change?)
- **Decision Role**: Demonstrates system flexibility and sensitivity to different assumptions.

### 4. Export/Pitch View

- **Objective**: Snapshot for presentation and submission.
- **Canonical Outputs**:
  - Customer summary card
  - Recommendation card
  - AI outreach note
  - Governance disclosure footer
- **Decision Role**: Exportable artifact for pitch, judge review, and offline presentation.

---

## Canonical Outputs

| Output | Description |
|---|---|
| **Partnership/Acquisition Score** | 0-100 score indicating customer acquisition potential |
| **Next Best Product** | Recommended Shinhan Finance product for the customer |
| **Recommended Action** | `push now` / `nurture` / `hold` |
| **AI Explanation Note** | Qwen-generated explanation of why this score/product/action |
| **AI Outreach Message** | Qwen-generated personalized offer message for the customer |
| **What-If Simulation Delta** | Base score vs. simulated score with delta and changed variable |

---

## Out of Scope

- Underwriting workflow
- CRM automation
- Production integration
- Real-time partner integration
- Training ML models from real customer data

---

## Implementation Decisions

| Decision | Choice | Rationale |
|---|---|---|
| **Product Flow** | Hybrid (Level 1: partner/channel decision, Level 2: new customer decision) | Matches SF8 brief; shows both partnership context and individual decision |
| **Qwen Role** | Explanation and outreach ONLY. NOT score or action. | Keeps scoring deterministic and auditable; Qwen adds interpretability, not decision authority |
| **Data** | Generated demo data with governance markers | No real customer data in PoC; all data must flow through approved dataset pipeline |
| **Stack** | React + TypeScript + Vite (frontend), Supabase/Render (planned infra) | Standard modern web stack; Supabase for published dataset layer |

---

## Canonical References

- `01-DECISIONS-SUMMARY.md` -- All product decisions and constraints
- `02-CONTROL-FILES-SPEC.md` -- Control file specifications
- `DATA-GOVERNANCE.md` -- Data lifecycle, approval policy, FE consumption modes
- `DATA-CATALOG-CANDIDATES.md` -- Candidate registry for all taxonomy domains
- `SCORING-SPEC.md` -- Deterministic scoring model specification
- `lib/data.ts` -- Generated demo data (customers, alternative data, products)

---

## Codebase Starting Point

- Frontend scaffold: Vite + React + TypeScript
- Data layer: `lib/data.ts` (demo data), planned Supabase for published dataset
- Types: `types/` directory for Customer, AlternativeData, ShinhanProduct interfaces
- Control files: Root-level `.md` files for governance

---

## Decision Dependencies

| # | Dependency | Depends On | Blocking? |
|---|---|---|---|
| 1 | Dataset creation | Taxonomy approval | [BLOCKING] |
| 2 | Scoring engine | Dataset approval | [BLOCKING] |
| 3 | UI views (4 views) | Scoring engine | [BLOCKING] |
| 4 | Simulation engine | Scoring engine | [BLOCKING] |
| 5 | Demo flow | UI views + Simulation | [BLOCKING] |
| 6 | Submission assets | Demo flow | |
| 7 | Final submission | Submission assets | [BLOCKING] |

**Critical path**: Taxonomy → Dataset → Scoring → UI + Simulation → Demo → Submission

---

## Deferred Ideas

| Idea | Reason for Deferral | Future Consideration |
|---|---|---|
| Real-time data pipeline | Out of PoC scope; requires production integration | Post-hackathon, Phase 2 |
| ML model training | Requires real customer data and training infrastructure | After PoC validation |
| Multi-language support | Vietnamese/English toggle adds complexity | If InnoBoost requires bilingual demo |
| Production Supabase integration | PoC uses generated data; production infra deferred | After PoC approval |
| Partner API integration | Requires real partner agreements and APIs | After InnoBoost selection |
