# SUBMISSION-SPEC.md

## Submission Objective

Present **SF8 - AI Customer Behavior Prediction** as a decision-support PoC that demonstrates how alternative data + AI can improve new customer acquisition for Shinhan Finance.

### Focus Areas

1. **Problem Relevance**: New customers lack transaction history, making traditional assessment difficult. Alternative data (telco, e-wallet, ecommerce, social) provides early behavioral signals.
2. **Solution Quality**: Deterministic scoring engine + Qwen-powered explanation. Transparent, auditable, and explainable.
3. **Meaningful AI Use**: Qwen for explanation (why this product, why this score) and outreach (personalized offer message). Qwen does NOT decide scores or actions.
4. **Working Demo**: 4 views (Dashboard, Customer Detail, Simulation Workspace, Export/Pitch View) with a clearly defined hero case.

---

## Field-by-Field Requirements

### Project Name

- **Value**: "SF8 - AI Customer Behavior Prediction" (pending final approval)
- **Purpose**: Identifies the project on DevPost
- **Claim Boundary**: Name must align with SF8 brief. Final approval required before submission.

### Elevator Pitch

- **Value**: "PoC giúp Shinhan Finance dự đoán nhu cầu khách hàng mới từ dữ liệu alternative (telco, e-wallet, ecommerce, social) và đề xuất sản phẩm phù hợp với giải thích AI."
- **Purpose**: Quick summary for judges browsing submissions
- **Claim Boundary**: Accurately describes what is built. No future capabilities implied.

### Project Story Sections

| Section | Content |
|---|---|
| **Inspiration** | Problem of new customer acquisition at Shinhan Finance. Lack of transaction history makes traditional assessment difficult. Alternative data provides an untapped signal source. |
| **What it does** | 4-view demo: Dashboard (portfolio overview), Customer Detail (AI-powered insight), Simulation Workspace (what-if analysis), Export/Pitch View (exportable artifact). Hero case demonstrates end-to-end flow. |
| **How we built it** | React + TypeScript + Vite frontend. Deterministic scoring engine. Qwen (DashScope API via Alibaba Cloud Model Studio) for explanation and outreach generation. Generated demo data with governance markers. |
| **Challenges we ran into** | Data governance (ensuring generated data is clearly distinguished from real data), deterministic vs. AI balance (Qwen explains but never decides), building working PoC within hackathon timeline. |
| **Accomplishments that we're proud of** | Working PoC with 4 views, deterministic scoring with Qwen explanation, what-if simulation, hero case demo -- all built within 24 hours. |
| **What we learned** | Alternative data integration patterns, governance-aware development, balancing deterministic transparency with AI-powered explanation. |
| **What's next for SF8** | Production pipeline with Supabase, ML model training with real customer data, real-time partner API integration, multi-language support, InnoBoost integration with Shinhan Finance systems. |

### Built With

- React
- TypeScript
- Vite
- Qwen (DashScope API)
- Alibaba Cloud Model Studio
- Supabase (planned)
- Render (planned)

**Rule**: Only technologies actually used in the built demo are listed. Qwen/Alibaba Cloud usage is explicitly stated.

### Try It Out

| Link | Status |
|---|---|
| **Repository** | GitHub repo link (must be public at submission time) |
| **Live Demo** | Deployed demo URL (if available; otherwise fallback to recorded video) |

### Project Media

| Asset | Requirement |
|---|---|
| **Screenshots** | 4-6 minimum: (1) Dashboard overview, (2) Customer detail with hero case, (3) AI recommendation + explanation, (4) What-if simulation before/after, (5) Export/pitch view, (6) Action distribution view |
| **Video Demo** | 3-minute walkthrough showing: Dashboard → Hero case customer detail → AI recommendation + explanation → What-if simulation → Export/pitch view. Include "Generated demo data for PoC" disclosure. |

### Additional Info

**Value**: "This is a PoC using generated demo data. Scoring is deterministic with Qwen for explanation only. Scores are relative within the demo set and do not represent absolute creditworthiness or predictive accuracy."

**Purpose**: Context for judges to understand the PoC nature and limitations.

---

## Mandatory Assets

| # | Asset | Status | Acceptance Criteria |
|---|---|---|---|
| 1 | **Screenshots** (4 minimum) | [ ] Not captured | Clear, legible, show product flow |
| 2 | **Video demo** (3 min) | [ ] Not recorded | Shows dashboard → hero case → AI recommendation → what-if → export |
| 3 | **Repo link** (GitHub) | [ ] Not public | Repository is accessible, includes README with setup instructions |
| 4 | **PDF one-pager** | [ ] Not created | Product overview + demo flow + next steps |
| 5 | **Submission text** | [ ] Not drafted | All DevPost fields filled per field-by-field requirements above |
| 6 | **Track selected** | [ ] Not confirmed | Financial Services - Shinhan (Shinhan Future's Lab) |

---

## Story Writing Rule

### Only Claim What Is Built

| Can Claim | Cannot Claim |
|---|---|
| "Deterministic scoring engine using alternative data" | "Production-ready scoring system" |
| "Qwen-powered explanation of customer scores" | "AI decides customer eligibility" |
| "Working prototype with 4 views" | "Enterprise-scale deployment" |
| "What-if simulation with 3 variables" | "Comprehensive scenario planning" |
| "Generated demo data with governance markers" | "Real customer data analysis" |

### Explicit Separation

| Data Type | How to Describe |
|---|---|
| **Reference data** | "Public benchmarks and market documentation used to inform demo data generation" |
| **Generated data** | "Demo customers generated to illustrate the scoring approach. Not real customer data." |
| **Simulated outcomes** | "What-if scenarios demonstrating system flexibility. Not predictive of real outcomes." |

### PoC Limitations Statement

The submission must include this statement (or equivalent):

> "Demo uses generated data, not real customer data. Scores are relative within the demo set and do not represent absolute creditworthiness or predictive accuracy. This is a PoC to demonstrate an approach to alternative data scoring, not a production system."

---

## Demo Video Rule

### Required Flow (3 minutes)

1. **Dashboard Overview** (30s): Show portfolio view, lead list, product mix, action distribution.
2. **Hero Case Customer Detail** (60s): Click to highest-scoring customer. Show signals + score side by side. Show AI recommendation and explanation.
3. **AI Recommendation + Explanation** (30s): Highlight Qwen-generated explanation of why this product and score.
4. **What-If Simulation** (45s): Change one of the 3 simulation variables. Show score delta and action change.
5. **Export/Pitch View** (15s): Show exportable summary card with governance disclosure.

### Disclosure Requirement

Include on-screen text or verbal statement: **"Generated demo data for PoC."**

---

## Judge File Rule

If supplementary files are submitted for judges:

- Must be a **single PDF bundle** (max 35 MB per DevPost rules)
- Must include: one-pager, key screenshots, setup instructions
- Must NOT include: any content not directly related to the built demo

---

## Claim Boundaries

### CAN Claim

- Demonstrates approach to alternative data scoring
- Qwen-powered explanation of scores and recommendations
- Working prototype with simulation
- Deterministic, transparent scoring logic
- Governance-aware data handling

### CANNOT Claim

- Production-ready system
- Validated accuracy against real customer data
- Integrates with Shinhan Finance systems
- Uses real customer data
- Predictive ML model with accuracy metrics
- Replaces human decision-making

---

## Asset Readiness Checklist

| # | Item | Status | Owner | Due |
|---|---|---|---|---|
| 1 | Screenshots captured (4-6) | [ ] Pending | Builder | Before submission |
| 2 | Video recorded (3 min) | [ ] Pending | Builder | Before submission |
| 3 | Repo made public | [ ] Pending | Builder | Before submission |
| 4 | One-pager PDF created | [ ] Pending | Builder | Before submission |
| 5 | Submission text drafted | [ ] Pending | Builder | Before submission |
| 6 | Track selected (Financial Services - Shinhan) | [ ] Pending | Builder | Before submission |

---

## Fallback Strategy if Deploy Not Ready

If the live demo is not deployed by submission time:

1. **Submit with repo link** -- GitHub repository with full source code
2. **Include recorded video** -- 3-minute walkthrough showing all required flow steps
3. **Include local demo instructions** -- README with `npm install`, `npm run dev`, and step-by-step demo flow guide
4. **Note in submission**: "Live demo deployment in progress. Please use the recorded video or follow the README setup instructions for local demo."
