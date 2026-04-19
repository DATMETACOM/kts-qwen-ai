# Judges Guide - Qwen AI API Configuration

## API Key

```
sk-f341e18f42d94668b81e24ffd916b4bf
```

## Projects Using Qwen AI

All 4 projects integrate Qwen AI (Alibaba Cloud) for various features:

### SB10 - Branch Traffic Prediction
- Traffic forecasting with historical data analysis
- Staff optimization recommendations
- File: `sb10-queue-mind/src/lib/qwen.ts`

### SF8 - Customer Behavior Prediction  
- Customer behavior analysis and churn prediction
- Next-best-action recommendations
- File: `sf8-cuca-insider-ai/src/lib/qwen.ts`

### SF11 - EWA & Salary-Linked Lending
- Corporate risk assessment
- Dynamic credit limit calculation
- Employee churn prediction
- File: `sf11-ewa-lending/src/lib/qwen.ts`

### SF12 - MicroBiz Loan
- Credit scoring for micro-businesses
- Cash flow analysis
- Loan recommendation
- File: `sf12-microbiz-loan/src/lib/qwen.ts`

## Environment Setup

Each project requires `.env.local` file in its root directory:

```bash
QWEN_API_KEY=sk-f341e18f42d94668b81e24ffd916b4bf
```

## Running the Projects

```bash
# SB10
cd sb10-queue-mind && npm run dev

# SF8
cd sf8-cuca-insider-ai && npm run dev

# SF11
cd sf11-ewa-lending && npm run dev

# SF12
cd sf12-microbiz-loan && npm run dev
```

## Qwen Model

All projects use `qwen-plus` model via Alibaba Cloud DashScope API.