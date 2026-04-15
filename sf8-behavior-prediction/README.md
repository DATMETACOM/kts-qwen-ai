# SF8 - AI Customer Behavior Prediction

> **PoC for Shinhan Finance InnoBoost 2026 | Qwen AI Build Day - Financial Services Track**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Track](https://img.shields.io/badge/track-financial%20services-blue)]()
[![Demo](https://img.shields.io/badge/demo-ready-green)]()

---

## 🎯 Problem

New customers have no transaction history at Shinhan Finance, making product recommendation impossible with traditional scoring.

**Challenge**: How to understand customer needs without internal data?

---

## 💡 Solution

SF8 analyzes **alternative data** from 4 sources to predict financial product needs:

| Data Source | Signals | Example Fields |
|-------------|---------|----------------|
| **Telco** | Spending, tenure, usage | Monthly spend, data GB, months active |
| **E-Wallet** | Transaction frequency | Usage level, monthly transactions, categories |
| **E-Commerce** | Shopping patterns | Orders/month, avg order value, categories |
| **Social** | Interests, engagement | Interest topics, activity level |

### How It Works

1. **Deterministic Scoring** (0-100 score)
   - Partner/Channel Fit (20%)
   - Behavior Signal Strength (30%)
   - Early Reaction Quality (15%)
   - Product Affinity (35%)

2. **Action Recommendation**
   - `push now` (score ≥75 + affinity ≥70)
   - `nurture` (score 50-74 + affinity ≥50)
   - `hold` (score <50 OR affinity <50)

3. **AI Explanation** - Qwen generates natural language reasoning
4. **What-If Simulation** - Test impact of changing engagement, offers, or signals

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Demo Flow (3 minutes)
1. **Dashboard** → Portfolio overview with 20 customers
2. **Hero Case** → Click highest-scoring customer for deep-dive
3. **Simulation** → Run what-if analysis to see score delta
4. **Export/Pitch** → Generate insight report with outreach note

---

## 🏗️ Architecture

```
SF8 App
├── Deterministic Scoring Engine (lib/scoring.ts)
│   ├── Partner/Channel Fit (pcf)
│   ├── Behavior Signal Strength (bss)
│   ├── Early Reaction Quality (erq)
│   └── Product Affinity (pa)
│
├── Qwen AI Integration (lib/qwen.ts)
│   ├── Explanation generation (explain, don't decide)
│   └── Outreach note generation
│
├── Data Layer (lib/data.ts + src/dataProvider.ts)
│   ├── 20 demo customers with alternative data
│   ├── 7 Shinhan Finance products
│   └── Governed data pipeline (generated → approved → published)
│
└── 4 Core Views (src/views/)
    ├── Dashboard - Portfolio overview
    ├── CustomerDetail - Deep-dive + inline simulation
    ├── Simulation - Workspace for what-if analysis
    └── ExportPitch - Report generation
```

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Routing**: React Router v6
- **AI**: Qwen (DashScope API via Alibaba Cloud)
- **Styling**: Custom CSS (no framework)

---

## 📊 Demo Data

- **20 sample customers** with Vietnamese names and profiles
- **7 Shinhan Finance products**: Credit cards, personal loans, SME loans, insurance, BNPL
- **Alternative data** for each customer across 4 sources
- **6 archetypes** mapped to behavioral patterns

---

## 🤖 Qwen Integration

Qwen is used for **explanation only** - it never decides scores or actions.

```typescript
// Deterministic scoring (Qwen-independent)
const score = scoreCustomer(customer, altData, products);

// Qwen explains the reasoning
const explanation = await qwen.generateExplanation(score, customer, altData);
```

**Why deterministic-first?** Financial services require transparent, auditable decisions. Qwen enhances understanding but doesn't override logic.

---

## 🎨 App Views

### Dashboard
- 4 stat cards (Total, Push Now, Nurture, Hold)
- Hero case highlight
- Product distribution
- Customer lead list with scores and actions

### Customer Detail
- Overall score with breakdown
- Alternative data signals
- AI explanation
- Inline what-if simulation

### Simulation Workspace
- Change variables: partner/channel, product/offer, early reaction
- Run simulation on single customer or entire portfolio
- See before/after score delta

### Export/Pitch
- Complete customer insight report
- Personalized outreach note (Vietnamese)
- Print/save as PDF

---

## 📋 Submission Assets

- ✅ Project story: `PROJECT-STORY.md`
- ✅ One-pager: `ONE-PAGER.md`
- ✅ Video script: `VIDEO-SCRIPT.md`
- ✅ Screenshot guide: `SCREENSHOT-GUIDE.md`
- ✅ Repo: This repository
- ✅ Live demo: Run `npm run dev`

---

## 🏆 Track

**Financial Services - Shinhan Future's Lab (InnoBoost 2026)**

- **Hackathon Deadline**: April 17, 2026
- **InnoBoost Application**: May 3, 2026
- **POC Contract**: Up to 200M VND for successful outcomes

---

## 📝 Governance

This PoC follows strict data governance:
- All customer data is **generated** (not real PII)
- Each record has **provenance metadata** (source_type, approval_status)
- UI includes **disclosure badges** ("Generated demo data")
- Scores are **relative within demo set** (not absolute creditworthiness)

See `DATA-GOVERNANCE.md` and `DATASET-PIPELINE.md` for details.

---

## 🚧 Limitations

- Demo uses generated data, not real customer data
- Scores validated only within demo set
- Not production-ready (POC stage)
- Qwen API optional (falls back to deterministic explanation)

---

**Built in 24 hours for Qwen AI Build Day 2026**
