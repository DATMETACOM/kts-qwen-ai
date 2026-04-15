# SF8 Quick Reference Card
# Thẻ Tham Khảo Nhanh

> **For Judges & Demo Presenters**

---

## 🚀 Quick Start (30 seconds)

```bash
cd sf8-behavior-prediction
npm install
npm run dev
```

**Open**: http://localhost:5173

---

## 📊 Demo Flow (3 Minutes)

| Time | Action | What to Say |
|------|--------|-------------|
| 0:00-0:30 | Dashboard | "20 customers analyzed from 4 alternative data sources" |
| 0:30-1:30 | Click Hero Case (Nguyễn Văn An) | "Score 82/100, 4 dimensions, AI explains why" |
| 1:30-2:30 | Run Simulation | "Change partner engagement → see +6 delta" |
| 2:30-3:00 | Export View | "Complete report with Vietnamese outreach note" |

---

## 🎯 Key Metrics to Highlight

- **20** demo customers analyzed
- **7** Shinhan Finance products in catalog
- **4** alternative data sources (telco, e-wallet, ecommerce, social)
- **4** score families (PCF, BSS, ERQ, PA)
- **3** simulation variables (partner, product, early reaction)
- **3** actions (Push Now, Nurture, Hold)

---

## 💡 Key Differentiators

1. ✅ **Deterministic-first** (transparent, auditable)
2. ✅ **AI for explanation** (Qwen explains, doesn't decide)
3. ✅ **What-if simulation** (test acquisition strategies)
4. ✅ **Governance-aware** (generated data, provenance markers)
5. ✅ **4-source alternative data** (most use 1-2)

---

## 🗣️ Common Judge Questions (Quick Answers)

### Q: How accurate is this?
**A**: "PoC with generated data - cannot claim accuracy yet. Structure is ready, weights need validation with real data (InnoBoost POC: 200M VND)."

### Q: Why not ML?
**A**: "Deterministic = transparent & auditable. ML can replace weights after validation. Financial decisions can't be black boxes."

### Q: What if no Qwen API?
**A**: "App falls back to deterministic templates. Core scoring works without AI."

### Q: How is this different from what banks already do?
**A**: "Structured scoring + AI explanation + simulation + governance. Not manual gut feeling."

### Q: What about data privacy?
**A**: "Explicit consent required in production. PoC uses generated data. Compliance framework needed."

---

## 🎨 Score Breakdown Formula

```
Overall = PCF × 0.20 + BSS × 0.30 + ERQ × 0.15 + PA × 0.35

Where:
- PCF (Partner/Channel Fit): Digital engagement (0-100)
- BSS (Behavior Signal Strength): Alternative data quality (0-100)
- ERQ (Early Reaction Quality): Offer responsiveness (0-100)
- PA (Product Affinity): Customer-product fit (0-100)
```

---

## 🎬 Action Thresholds

| Overall Score | Product Affinity | Action |
|---------------|------------------|--------|
| ≥ 75 | ≥ 70 | 🟢 **Push Now** |
| 50-74 | ≥ 50 | 🟡 **Nurture** |
| < 50 OR | < 50 | 🔴 **Hold** |

---

## 🏆 Hero Case: Nguyễn Văn An (c001)

- **Age**: 28
- **Occupation**: Software Engineer
- **Income**: 25M VND/month
- **Score**: ~82/100 (highest in demo set)
- **Product**: Cashback Credit Card
- **Action**: Push Now ✅
- **Archetype**: AR-01 Digital Native

---

## ⚠️ Important Disclaimers

- ✅ "Generated demo data for PoC purposes"
- ✅ "Scores are relative within demo set"
- ✅ "Deterministic scoring with Qwen for explanation only"
- ✅ "Not production-ready - requires validation with real data"

---

## 📁 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Project overview & setup |
| `USER-GUIDE-AND-TESTING.md` | Complete user guide + test plans |
| `JUDGE-QA-GUIDE.md` | 20 Q&A in Vietnamese + English |
| `SCORING-SPEC.md` | Technical scoring details |
| `ONE-PAGER.md` | One-page summary |
| `VIDEO-SCRIPT.md` | 3-minute demo script |

---

## 🧪 Running Tests

```bash
# Install test dependencies (first time only)
npm install

# Run all tests
npm test

# Run tests once
npm run test:run

# Run with coverage
npm run test:coverage
```

**Test Coverage**:
- ✅ Scoring engine (deterministic computation)
- ✅ Data integrity (20 customers, 7 products)
- ✅ Simulation (3 variables, immutability)
- ✅ Hero case validation (c001 has highest score)
- ✅ Action thresholds (push now, nurture, hold)

---

## 🎤 Elevator Pitch (Vietnamese)

"SF8 giúp Shinhan Finance dự đoán nhu cầu khách hàng mới từ alternative data (telco, e-wallet, ecommerce, social) với giải thích AI. Khi khách hàng mới chưa có lịch sử giao dịch, SF8 cho phép đánh giá lần đầu từ 4 nguồn data thay thế, đề xuất sản phẩm phù hợp, và giải thích tại sao - tất cả trong vòng vài phút."

## 🎤 Elevator Pitch (English)

"SF8 helps Shinhan Finance predict new customer needs from alternative data (telco, e-wallet, ecommerce, social) with AI explanation. When new customers have no transaction history, SF8 enables first-time assessment from 4 alternative data sources, recommends suitable products, and explains why - all within minutes."

---

**Print this card and keep it handy during your demo!**

Last Updated: April 14, 2026 | Version 1.0.0
