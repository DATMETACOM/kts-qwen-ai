# 🏦 Shinhan PoC - Qwen AI Build Day 2026

> **PoC for Shinhan Financial Group - InnoBoost 2026**

---

## 📋 Projects

| Project | Code | Description | Status | Link |
|---------|------|-------------|--------|------|
| **Queue Mind** | SF10 | Dự đoán lưu lượng chi nhánh & quản lý hàng đợi | ✅ Ready | [sf10-queue-mind/](./sf10-queue-mind/) |
| **Customer Behavior Prediction** | SF8 | Phân tích hành vi khách hàng mới | ✅ Ready | [sf8-behavior-prediction/](./sf8-behavior-prediction/) |

---

## 🚀 Quick Start

```bash
# SF10 - Queue Mind
cd sf10-queue-mind
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

### SF10 - Queue Mind
- [README](./sf10-queue-mind/README.md) - Overview & Quick Start
- [ARCHITECTURE](./sf10-queue-mind/ARCHITECTURE.md) - System Architecture
- [API](./sf10-queue-mind/API.md) - API Endpoints
- [DEMO](./sf10-queue-mind/DEMO.md) - Demo Script

### SF8 - Customer Behavior Prediction
- [README](./sf8-behavior-prediction/README.md) - Overview & Quick Start
- [ARCHITECTURE](./sf8-behavior-prediction/ARCHITECTURE.md) - System Architecture
- [API](./sf8-behavior-prediction/API.md) - API Endpoints
- [DEMO](./sf8-behavior-prediction/DEMO.md) - Demo Script

---

## 🎯 Features Summary

### SF10 - Queue Mind
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
# sf10-queue-mind/.env.local
QWEN_API_KEY=your_qwen_api_key_here

# sf8-behavior-prediction/.env.local
QWEN_API_KEY=your_qwen_api_key_here
```

Without the API key, both projects will use mock/rule-based fallbacks.

---

## 📊 Demo Data

### SF10
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
