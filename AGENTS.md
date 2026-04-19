# AGENTS.md

This file contains configuration and context for AI assistants working on this codebase.

## Environment Variables

Create `.env.local` in each project directory with:

```
QWEN_API_KEY=sk-f341e18f42d94668b81e24ffd916b4bf
```

## Project Structure

```
/kts-qwen-ai/
├── sb10-queue-mind/       # Branch Traffic Prediction (Next.js 14)
├── sf8-cuca-insider-ai/ # Customer Behavior Prediction (React + Vite)
├── sf11-ewa-lending/   # EWA & Salary-Linked Lending (Next.js 14)
└── sf12-microbiz-loan/ # MicroBiz Loan (Next.js 14)
```

## Key Commands

```bash
# Install dependencies
cd <project-dir> && npm install

# Run development server
cd <project-dir> && npm run dev

# Run tests
cd <project-dir> && npm test
```

## Qwen AI API

- Endpoint: `https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/text-generation/generation`
- Model: `qwen-plus`
- Used in: All 4 projects for prediction/analysis features