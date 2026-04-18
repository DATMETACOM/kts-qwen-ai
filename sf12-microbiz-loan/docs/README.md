# [SF12] MicroBiz Loan - AI-Powered Micro Loans for Digital Economy

> **Shinhan Finance Vietnam x Qwen AI Build Day 2026**
> **Track:** Financial Services (Shinhan Future's Lab)

---

## 🎯 Problem We Solve

| Metric | Traditional | Our Solution | Impact |
|--------|-------------|--------------|--------|
| Loan TAT | 3-7 days | < 5 minutes | ↓ 99% |
| Cashflow Verification | Manual bank statements | Real-time platform data | Zero paperwork |
| NPL Rate | 8-12% | < 3% | ↓ 70% |
| Target Customers | Salaried workers | Digital sellers, freelancers, gig workers | New market |

---

## ✨ Features

### Seller Portal (Digital Sellers)
- **Cashflow Dashboard** — View revenue from Shopee, Lazada, Grab
- **Micro Loan Application** — Get approved in minutes
- **Revenue-Based Repayment** — Pay as % of future revenue
- **Credit Score** — AI-powered scoring with Qwen

### Platform Portal (E-commerce & E-wallet Integration)
- **Platform Status** — Real-time data freshness from each platform
- **Data Connections** — Shopee, Lazada, TikTok, Grab, MoMo, ZaloPay
- **Cashflow Analysis** — Track multiple income streams

### Admin Portfolio
- **Portfolio Metrics** — Total disbursed, active loans, NPL rate
- **Collection Tracking** — Monitor repayment rates
- **Risk Dashboard** — NPL < 3% target monitoring
- **Qwen AI Stats** — Credit scoring metrics

---

## 🤖 Qwen AI Integration

```typescript
// AI Credit Scoring with Qwen
const result = await creditScoring(customer, cashflowHistory);

// Response
{
  customerId: "mb-001",
  score: 720,           // 850 max
  riskLevel: "low",     // low/medium/high
  recommendedAmount: 25000000,
  interestRate: 18,    // annual
  maxTenor: 24         // months
  reasons: [
    "Cashflow ổn định",
    "Hoạt động trên 12 tháng",
    "Đánh giá cao"
  ]
}
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│              Next.js 14 App Router               │
│  ┌──────────┐  ┌──────────┐  ┌────────────────┐ │
│  │  Seller  │  │ Platform │  │     Admin     │ │
│  │  Portal  │  │  Portal  │  │    Portal      │ │
│  └────┬─────┘  └──────────┘  └───────┬────────┘ │
└──────────────┬───────────────────────┬───────────┘
               │                       │
       ┌───────┴───────┐      ┌────────┴────────┐
       │/api/credit  │      │  /api/dashboard│
       │/api/loan   │      │  /api/customers│
       └──────┬──────┘      └───────┬────────┘
              │                  │
              ▼                  ▼
┌─────────────────────────┐  ┌─────────────────┐
│   Qwen AI DashScope    │  │   Mock Data     │
│   Credit Scoring      │  │   APIs          │
└─────────────────────────┘  └─────────────────┘
```

---

## 🚀 Quick Start

```bash
# Install dependencies
cd sf12-microbiz-loan
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
| `/api/customers` | GET | List all microbiz customers |
| `/api/credit-score` | POST | AI credit scoring with Qwen |
| `/api/loan` | POST | Submit loan application |
| `/api/dashboard` | GET | Portfolio & platform data |

---

## 📋 Demo Materials

- **Live Demo:** https://sf12-microbiz-loan.vercel.app
- **Demo Script:** [DEMO.md](./DEMO.md)

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
- [ARCHITECTURE.md](./ARCHITECTURE.md) — System design
- [API.md](./API.md) — API documentation
- [DEMO.md](./DEMO.md) — Demo walkthrough

---

## 👥 Team

Built for **Qwen AI Build Day 2026** | **InnoBoost 2026**
**Track:** Financial Services (Shinhan Future's Lab)

**GitHub:** https://github.com/DATMETACOM/kts-qwen-ai/tree/sf12-microbiz-loan