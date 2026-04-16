# 🏦 Shinhan PoC - Qwen AI Build Day 2026

> **PoC for Shinhan Financial Group - InnoBoost 2026**

---

## 📋 Projects

| Project | Code | Description | Status | Link |
|---------|------|-------------|--------|------|
| **Branch Traffic Prediction** | SB10 | Dự đoán lưu lượng chi nhánh & quản lý hàng đợi | ✅ Ready | [sb10-queue-mind/](./sb10-queue-mind/) |
| **Customer Behavior Prediction** | SF8 | Phân tích hành vi khách hàng mới | ✅ Ready | [sf8-cuca-insider-ai/](./sf8-cuca-insider-ai/) |
| **Earned Wage Access** | SF11 | EWA & salary-linked lending với xác thực payroll real-time | 🚧 Init | [sf11-ewa/](./sf11-ewa/) |
| **MicroBiz Loan** | SF12 | Micro loan cho digital sellers với alternative cash-flow scoring | 🚧 Init | [sf12-microbiz-loan/](./sf12-microbiz-loan/) |

---

## 🚀 Quick Start

```bash
# SB10 - Branch Traffic Prediction
cd sb10-queue-mind
npm install
npm run dev
# Open http://localhost:3000

# SF8 - Customer Behavior Prediction
cd sf8-cuca-insider-ai
npm install
npm run dev
# Open http://localhost:3000

# SF11 - Earned Wage Access
node tools/poc-server.mjs
# Open http://localhost:4173/sf11-ewa/

# SF12 - MicroBiz Loan
node tools/poc-server.mjs
# Open http://localhost:4173/sf12-microbiz-loan/
```

---

## 🏗️ Tech Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **AI:** Qwen-Plus via Alibaba Cloud DashScope API (pending API key)
- **Data:** Mock data for PoC demonstration

---

## 📚 Documentation

### SB10 - Branch Traffic Prediction
- [README](./sb10-queue-mind/README.md) - Overview & Quick Start
- [ARCHITECTURE](./sb10-queue-mind/ARCHITECTURE.md) - System Architecture
- [API](./sb10-queue-mind/API.md) - API Endpoints
- [DEMO](./sb10-queue-mind/DEMO.md) - Demo Script

### SF8 - Customer Behavior Prediction
- [README](./sf8-cuca-insider-ai/README.md) - Overview & Quick Start
- [ARCHITECTURE](./sf8-cuca-insider-ai/ARCHITECTURE.md) - System Architecture
- [API](./sf8-cuca-insider-ai/API.md) - API Endpoints
- [DEMO](./sf8-cuca-insider-ai/DEMO.md) - Demo Script

### SF11 - Earned Wage Access
- [README](./sf11-ewa/README.md) - Overview & Quick Start
- [ARCHITECTURE](./sf11-ewa/ARCHITECTURE.md) - System Architecture
- [API](./sf11-ewa/API.md) - Mock API Design
- [DEMO](./sf11-ewa/DEMO.md) - Demo Script
- [TEST_CASES](./sf11-ewa/TEST_CASES.md) - Test Coverage Checklist

### SF12 - MicroBiz Loan
- [README](./sf12-microbiz-loan/README.md) - Overview & Quick Start
- [ARCHITECTURE](./sf12-microbiz-loan/ARCHITECTURE.md) - System Architecture
- [API](./sf12-microbiz-loan/API.md) - Mock API Design
- [DEMO](./sf12-microbiz-loan/DEMO.md) - Demo Script
- [TEST_CASES](./sf12-microbiz-loan/TEST_CASES.md) - Test Coverage Checklist

---

## 🎯 Features Summary

### SB10 - Branch Traffic Prediction
- 📊 Dashboard với 5 chi nhánh mẫu tại TP.HCM
- ⏰ Best Time to Visit - Khuyến nghị giờ vàng
- 📈 Dự báo lưu lượng theo giờ (8h-17h)
- 🎨 Mức độ đông: 🟢 Thấp / 🟡 TB / 🔴 Cao
- ✅ Check-in simulation

### SF8 - Customer Behavior Prediction
- 👥 Dashboard với 20 khách hàng mẫu
- 📱 Alternative Data: Telco, E-Wallet, E-commerce, Social
- 🤖 AI Recommendation với confidence score
- 🎁 Personalized Offer details
- 📋 7 Shinhan Finance products

---

## 🔐 Qwen API Configuration

Add your Qwen API key to each project's `.env.local`:

```bash
# sb10-queue-mind/.env.local
QWEN_API_KEY=your_qwen_api_key_here

# sf8-cuca-insider-ai/.env.local
QWEN_API_KEY=your_qwen_api_key_here
```

Without the API key, both projects will use mock/rule-based fallbacks.

---

## 📊 Demo Data

### SB10
- 5 branches in HCMC
- 30 days history (~3,600 traffic records)
- Hourly traffic patterns

### SF8
- 20 customers with profiles
- Alternative data per customer (telco, e-wallet, ecommerce, social)
- 7 Shinhan Finance products

### SF11
- 3 mock employer payroll integrations
- 8 employees with payroll snapshots
- EWA cap, consent, freshness, and payroll-loan rules

### SF12
- 4 mock marketplace / wallet / gig-data channels
- 8 seller and freelancer profiles
- Alternative score, revenue-share repayment, and risk-monitoring rules

---

**Built for Qwen AI Build Day 2026 | InnoBoost 2026**
**GitHub:** https://github.com/DATMETACOM/kts-qwen-ai
