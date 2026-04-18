# 🏦 Cuca-Insider-AI - AI-powered Sales Closing Assistant

Cuca-Insider-AI is a hackathon PoC for **[SF8] Shinhan Future's Lab**.
The product helps telesales teams analyze thin-file new customers from alternative data and generate a tactical **Next Best Offer (NBO)** script with Qwen.

## 🧠 Architecture Overview

The backend follows a strict 4-layer pipeline:

1. **Native Calculation**
   - Load customer deterministic stats and behavioral tags from `customers_data.json`.
2. **PII Masking**
   - Remove `full_name` and `phone` before sending payload to Qwen.
3. **Qwen AI Inference**
   - Qwen returns strict JSON fields:
     `recommended_product`, `behavioral_rationale`, `statistical_evidence`, `sales_pitch_script`, `risk_warning_and_upsell`.
4. **UI Rendering (Unmasking)**
   - Backend merges AI output with original customer name and serves the tactical drawer UI.

This architecture keeps customer privacy boundaries explicit while still enabling AI-powered sales recommendations.

## ✅ Prerequisites

- Node.js 18+
- Python 3.10+

## ⚙️ Setup Instructions

### 1) Backend (FastAPI)

```bash
cd backend
python -m pip install -r requirements.txt
copy .env.example .env
```

Update `.env`:

```env
QWEN_API_KEY=your_real_qwen_api_key
BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
QWEN_MODEL=qwen-plus
```

Generate mock dataset (JSON + CSV):

```bash
python generate_mock_data.py
```

Run API server:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2) Frontend (React + Vite + Tailwind)

```bash
cd ..
npm install
npm run dev
```

Open: `http://localhost:5173`

> Vite proxy is configured, so frontend calls `http://127.0.0.1:8000/api` automatically in local development.

## 🧪 How To Test (Demo Guide)

1. Use the provided `backend/SF8_Customers_Mock.csv` as the official mock input file for judges.
2. Start backend and frontend.
3. Open Dashboard and review:
   - KPI cards
   - Hero customer
   - Pipeline table with clear **Alternative Data** tags.
4. Click **"Phân tích AI"** on any customer row.
5. Verify tactical drawer:
   - Script Box (`sales_pitch_script`) + copy button
   - Insight lists (`behavioral_rationale`, `statistical_evidence`)
   - Risk badges (`risk_warning_and_upsell`)
   - Copilot chatbox with quick prompts.

## 📁 Key Files

- `backend/generate_mock_data.py`
- `backend/customers_data.json`
- `backend/SF8_Customers_Mock.csv`
- `backend/Product_Catalog.json`
- `backend/main.py`
- `src/components/Dashboard.jsx`

## ⚠️ Disclaimer

AI is used as a tactical analysis assistant. Final lending/approval decisions must remain under authorized Shinhan officers.
