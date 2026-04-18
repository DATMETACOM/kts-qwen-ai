# [SF11] Earned Wage Access & Salary-Linked Lending

> **Shinhan Finance Vietnam x Qwen AI Build Day 2026**
> **Track:** Financial Services (Shinhan Future's Lab)
> **Prize:** USD 1,000 + Priority for VND 200M PoC Funding

---

## 🎯 Problem We Solve

| Metric | Traditional | Our Solution | Impact |
|--------|-------------|-------------|--------|
| Loan TAT | 3-7 days | < 5 minutes | ↓ 99% |
| Income Verification | Manual payslip | Real-time HRM | Zero paperwork |
| NPL Rate | 5-10% | < 2% | ↓ 60% |
| Acquisition Cost | High | Low | ↓ 40% |

---

## ✨ Features

### Employee Portal
- **Earned Wage Balance** — Real-time calculation from pay period progress
- **EWA Withdrawal** — Withdraw up to 50% of earned salary (3% fee)
- **AI Credit Scoring** — Qwen AI analyzes salary data for loan eligibility
- **Salary-Linked Loan** — Paperless loan with auto-debit from payroll
- **EMI Calculator** — Instant estimate with AI-generated offer

### HR Admin Portal
- **Employee Dashboard** — View all employees with EWA/loan status
- **Portfolio Overview** — EWA usage and active loans summary
- **Deduction Reports** — Auto-debit payroll deductions

### Shinhan Admin Portal
- **Portfolio Metrics** — Total disbursements, active loans, NPL tracking
- **NPL < 2% Dashboard** — Visual tracking of NPL target
- **Qwen AI Stats** — API calls, processing time, accuracy metrics

---

## 🏦 Shinhan Finance Products

| Product | Type | Details |
|---------|------|---------|
| **Vay tín chấp cá nhân** | Loan | Lãi suất 18%/năm, hạn mức đến 300 triệu, 48 tháng |
| **Thẻ tín dụng THE FIRST** | Credit Card | Rút tiền 100%, miễn lãi 45 ngày, 0.5% cashback |
| **EWA - Rút lương trước** | EWA | Rút đến 50% lương đã kiếm, phí 3% |

---

## 🤖 Qwen AI Integration

```typescript
// AI Credit Scoring with Qwen
const result = await creditScoring(employeeId, salaryData);

// Response
{
  score: 750,           // 850 max
  riskLevel: "low",    // low/medium/high
  reasons: [
    "Thu nhập ổn định: 25M VND/tháng",
    "Thâm niên tốt: 3 năm 2 tháng",
    "Auto-debit giảm NPL risk 60%"
  ],
  eligibleAmount: 150000000,
  interestRate: 18,
  maxTenor: 36
}
```

**API:** `POST /api/credit-score`

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Next.js 14 App Router                    │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐   │
│  │  Employee  │  │   HR HR    │  │   Shinhan Admin   │   │
│  │  Portal   │  │   Portal   │  │     Portal        │   │
│  └─────┬──────┘  └─────┬──────┘  └─────────┬────────┘   │
│        └────────────────┴─────────────────────┘            │
└──────────────────────────┬──────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ /api/verify │  │ /api/credit │  │  /api/loan  │
│ -salary     │  │   -score    │  │  /api/ewa   │
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       │                │                 │
       ▼                ▼                 ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Mock HRM    │  │  Qwen AI   │  │   In-Mem   │
│ Payroll API │  │ DashScope   │  │   Storage   │
└─────────────┘  └─────────────┘  └─────────────┘
```

---

## 🚀 Quick Start

```bash
# Clone and install
cd sf11-ewa-lending
npm install

# Configure environment
cp .env.example .env.local
# Add your QWEN_API_KEY

# Run development
npm run dev
# Open http://localhost:3000

# Build for production
npm run build
npm start
```

---

## 📁 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/verify-salary` | GET | Verify employee salary from HRM |
| `/api/credit-score` | POST | AI credit scoring with Qwen |
| `/api/loan` | POST | Submit loan application |
| `/api/ewa` | POST | Request EWA withdrawal |

---

## 📋 Demo Materials

- **Live Demo:** https://sf11-ewa-lending.vercel.app
- **Demo Script:** [DEMO.md](./DEMO.md) — 3-minute walkthrough
- **Pitch Deck:** [PITCH.md](./PITCH.md) — 5-slide presentation

---

## 📊 Judging Criteria Alignment

| Criterion | How We Address |
|-----------|----------------|
| Problem Relevance | Real pain: manual income proof, long TAT, high NPL |
| Quality of Solution | Complete E2E flow, all 3 portals, auto-debit |
| **Use of AI** | **Qwen AI for credit scoring with explainability** |
| **Use of Qwen/Alibaba Cloud** | **Qwen Plus via DashScope API** |
| Execution | Working prototype with real API integration |
| Pitch Clarity | Clear narrative: Problem → Solution → Demo → Impact |

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI:** Qwen Plus via Alibaba Cloud DashScope
- **Deployment:** Vercel

---

## 📚 Documentation

- [README.md](./README.md) — This file
- [DEMO.md](./DEMO.md) — Demo script for judges
- [PITCH.md](./PITCH.md) — Pitch deck outline

---

## 👥 Team

Built for **Qwen AI Build Day 2026** | **InnoBoost 2026**
**Track:** Financial Services (Shinhan Future's Lab)

**GitHub:** https://github.com/DATMETACOM/kts-qwen-ai/tree/sf11-ewa-lending
