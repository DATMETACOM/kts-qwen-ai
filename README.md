# 🏦 Shinhan PoC - Qwen AI Build Day 2026

> **PoC for Shinhan Financial Group - InnoBoost 2026**

---

## 📋 Projects

| Project | Code | Description | Status | Link |
|---------|------|-------------|--------|------|
| **Branch Traffic Prediction** | SB10 | Dự đoán lưu lượng chi nhánh & quản lý hàng đợi | ✅ Ready | [sb10-branch-prediction/](./sb10-branch-prediction/) |
| **Customer Behavior Prediction** | SF8 | Phân tích hành vi khách hàng mới | ✅ Ready | [sf8-behavior-prediction/](./sf8-behavior-prediction/) |

---

## 🚀 Quick Start

```bash
# SB10 - Branch Traffic Prediction
cd sb10-branch-prediction
npm install
npm run dev
# Open http://localhost:3000

# SF8 - Customer Behavior Prediction
cd sf8-behavior-prediction
npm install
npm run dev
# Open http://localhost:3000
```

---

## 🏗️ Tech Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **AI:** Qwen-Plus via Alibaba Cloud DashScope API (pending API key)
- **Data:** Mock data for PoC demonstration

---

## 📚 Documentation

### SB10 - Branch Traffic Prediction
- [README](./sb10-branch-prediction/README.md) - Overview & Quick Start
- [ARCHITECTURE](./sb10-branch-prediction/ARCHITECTURE.md) - System Architecture
- [API](./sb10-branch-prediction/API.md) - API Endpoints
- [DEMO](./sb10-branch-prediction/DEMO.md) - Demo Script

### SF8 - Customer Behavior Prediction
- [README](./sf8-behavior-prediction/README.md) - Overview & Quick Start
- [ARCHITECTURE](./sf8-behavior-prediction/ARCHITECTURE.md) - System Architecture
- [API](./sf8-behavior-prediction/API.md) - API Endpoints
- [DEMO](./sf8-behavior-prediction/DEMO.md) - Demo Script

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
# sb10-branch-prediction/.env.local
QWEN_API_KEY=your_qwen_api_key_here

# sf8-behavior-prediction/.env.local
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

---

**Built for Qwen AI Build Day 2026 | InnoBoost 2026**
**GitHub:** https://github.com/DATMETACOM/kts-qwen-ai
