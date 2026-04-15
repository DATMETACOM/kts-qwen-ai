# SF8 - AI Customer Behavior Prediction
**One-Pager for Shinhan Finance InnoBoost 2026**

---

## Problem
New customers have no transaction history at Shinhan, making product recommendation nearly impossible. Traditional credit scoring fails without internal data.

## Solution
SF8 analyzes alternative data from 4 sources to predict customer needs:
- **Telco**: Spending patterns, tenure, data usage
- **E-Wallet**: Transaction frequency, categories, usage level
- **E-Commerce**: Order volume, average value, shopping categories
- **Social**: Interests, activity level

## How It Works

### 1. Deterministic Scoring (0-100)
| Score Family | Weight | What It Measures |
|--------------|--------|------------------|
| Partner/Channel Fit | 20% | Digital engagement level |
| Behavior Signal Strength | 30% | Alternative data quality |
| Early Reaction Quality | 15% | Offer responsiveness |
| Product Affinity | 35% | Customer-product fit |

### 2. Action Recommendation
- **Push Now** (score ≥75 + affinity ≥70): Immediate contact
- **Nurture** (score 50-74 + affinity ≥50): Build relationship
- **Hold** (score <50 OR affinity <50): Wait for more data

### 3. AI Explanation
Qwen generates natural language explanation of why this product fits this customer

### 4. What-If Simulation
Change 3 variables to see impact:
- Partner/Channel Engagement (High/Low)
- Product Offer Terms (Premium)
- Early Reaction Signal (High/Low Response)

## Demo Flow (3 Minutes)
1. **Dashboard** (30s): Show 20 customers, product distribution, action breakdown
2. **Hero Case** (60s): Click highest-scoring customer → see score breakdown + AI explanation
3. **Simulation** (60s): Run what-if analysis → show score delta
4. **Export/Pitch** (30s): Generate personalized outreach note

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **AI**: Qwen (DashScope API) for explanation/outreach
- **Scoring**: Deterministic rule-based engine
- **Data**: Generated demo data with governance markers

## Key Metrics (Demo Data)
- 20 sample customers analyzed
- 7 Shinhan Finance products in catalog
- 4 score families computed per customer
- 3 simulation variables supported
- 4 core views in working demo

## Team
- 1 Primary Builder (Full-stack + AI + Product)

## Next Steps (InnoBoost POC)
1. Integration with Shinhan data sources
2. Validation against real customer outcomes
3. Refinement of scoring weights
4. Production deployment planning

---

**Track**: Financial Services - Shinhan Future's Lab
**Contact**: [Team Contact Info]
**GitHub**: [Repo Link]
**Live Demo**: [Demo Link]

*PoC using generated demo data. Scores relative within demo set.*
