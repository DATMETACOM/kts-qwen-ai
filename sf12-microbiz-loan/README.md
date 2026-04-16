# SF12 - MicroBiz Loan

> AI-powered micro loan PoC for digital economy sellers, freelancers, and gig workers

## Overview

`sf12-microbiz-loan` is a self-contained PoC for underwriting small-ticket working capital loans
between `5M` and `50M VND` using alternative cash-flow data from e-commerce platforms, e-wallets,
and digital payment activity.

The product is designed for customers who sit outside traditional salary-based underwriting models.
Repayment is structured as a percentage of future revenue instead of a fixed monthly installment.

## What Is Included

- Executive landing page for the product thesis
- Seller cash-flow and alternative scoring dashboard
- Revenue-linked repayment simulation
- Portfolio monitoring and early-warning indicators
- Mock integrations for e-commerce and e-wallet data
- Demo cases across online sellers, freelancers, and gig workers

## Quick Start

Serve it locally:

```bash
python -m http.server 4173
```

Then open `http://localhost:4173/sf12-microbiz-loan/`.

## Demo Flow

1. Review the product hypothesis and strategic KPIs in the hero section.
2. Inspect partner channel readiness and data freshness.
3. Select a seller profile to review:
   - alternative score
   - cash-flow quality
   - recommended loan amount
   - dynamic revenue-share repayment
4. Adjust scenario controls to stress seasonality and risk appetite.
5. Review portfolio risk signals and compliance controls.

## Files

- `index.html` - Single-page UI shell
- `styles.css` - Visual system and responsive layout
- `app.js` - Scoring, simulation, and rendering logic
- `data/mockData.js` - Sellers, channels, and policy settings
- `ARCHITECTURE.md` - Solution architecture
- `DEMO.md` - Suggested presentation script

## Next Build Steps

1. Add mock API endpoints for cash-flow ingestion and decision audit logs.
2. Add channel-specific feature engineering and fraud anomaly rules.
3. Add offer acceptance and revenue-deduction collection workflow.
4. Add test coverage for the scorecard and repayment engine.
