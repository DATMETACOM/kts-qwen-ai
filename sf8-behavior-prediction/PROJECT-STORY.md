# SF8 - AI Customer Behavior Prediction

## Inspiration

Shinhan Finance faces a critical challenge: new customers lack transaction history, making it nearly impossible to predict their financial needs. Traditional credit scoring fails when there's no internal data.

We asked: **What if we could understand customer needs from alternative data sources** - telco spending, e-wallet usage, e-commerce behavior, and social interests?

SF8 demonstrates how AI-powered alternative data analysis can transform new customer acquisition from guesswork into data-driven decision support.

## What it does

SF8 is a **decision-support PoC** that:

1. **Analyzes** new customer behavior from 4 alternative data sources (telco, e-wallet, e-commerce, social)
2. **Scores** each customer across 4 dimensions:
   - Partner/Channel Fit (20%)
   - Behavior Signal Strength (30%)
   - Early Reaction Quality (15%)
   - Product Affinity (35%)
3. **Recommends** the best-fit Shinhan Finance product with deterministic scoring
4. **Explains** the reasoning using Qwen AI for natural language generation
5. **Simulates** what-if scenarios across 3 variables (partner engagement, product offer, early reaction)

The app has 4 core views:
- **Dashboard**: Portfolio overview with 20 demo customers, product distribution, and action breakdown (push now / nurture / hold)
- **Customer Detail**: Deep-dive into individual customer with score breakdown, alternative data signals, AI explanation, and inline simulation
- **Simulation Workspace**: What-if analysis across the entire portfolio
- **Export/Pitch**: Generate snapshot reports with personalized outreach notes

## How we built it

**Tech Stack:**
- **Frontend**: React 18 + TypeScript + Vite
- **Routing**: React Router v6
- **AI**: Qwen (DashScope API via Alibaba Cloud Model Studio) for explanation and outreach note generation
- **Scoring**: Deterministic rule-based engine (Qwen explains, never decides)
- **Data**: Generated demo data with full governance markers (provenance, approval status, archetype mapping)

**Architecture:**
- Deterministic scoring engine computes 4 score families (pcf, bss, erq, pa) with weighted average
- Qwen API integration for natural language explanation (fallback to deterministic explanation if API unavailable)
- Simulation engine supports 3 approved variables: partner/channel, product/offer, early reaction
- Governed data pipeline: generated candidates → review → approved → published dataset

**Key Design Decisions:**
- Qwen provides explanation text only, never alters scores or actions
- All scores computed via deterministic rules for transparency and auditability
- Generated demo data clearly labeled with governance disclosures throughout the UI

## Challenges we ran into

1. **Deterministic vs AI Balance**: Ensuring Qwen enhances without overriding decision logic required careful prompt design and output parsing
2. **Scoring Calibration**: Getting score weights right so hero case (high digital engagement) scores appropriately higher than borderline cases
3. **Governance vs Speed**: With 24h deadline, balancing proper data governance with rapid prototyping was challenging
4. **Simulation Logic**: Making what-if changes meaningful without breaking score consistency

## Accomplishments that we're proud of

- ✅ **Working PoC in 24 hours** from planning to runnable demo
- ✅ **Deterministic scoring engine** with 4 score families and calibrated weights
- ✅ **Qwen integration** for AI explanation without decision authority
- ✅ **3-variable simulation** working across all 20 demo customers
- ✅ **4 complete views** with end-to-end demo flow
- ✅ **Governance framework** with data provenance, approval markers, and UI disclosures
- ✅ **Zero TypeScript errors** in production build

## What we learned

- Alternative data can provide strong signals for customer needs even without transaction history
- Deterministic-first AI architecture is critical for financial services trust
- Simulation capability differentiates a static demo from a decision-support tool
- Data governance isn't overhead - it's what makes a PoC credible

## What's next for SF8

**Immediate (InnoBoost POC - 11-12 weeks):**
- Integration with Shinhan Finance data sources
- Validation against real customer outcomes
- Refinement of scoring weights based on actual conversion data
- Production deployment planning

**Long-term:**
- Real-time alternative data pipeline
- ML model training with labeled customer data
- Multi-language support (Vietnamese, Korean, English)
- Integration with Shinhan's existing CRM and underwriting systems

**Track:** Financial Services - Shinhan Future's Lab (InnoBoost 2026)
**Deadline:** April 17, 2026
**InnoBoost Application Deadline:** May 3, 2026

---

*This is a PoC using generated demo data for hackathon purposes. Scores are relative within the demo set and do not represent absolute creditworthiness.*
