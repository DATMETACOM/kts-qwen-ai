# SF11 - EWA

> Earned Wage Access & Salary-Linked Lending PoC for Shinhan Financial Group Idea Contest

## Overview

`sf11-ewa` is a self-contained frontend prototype for a paperless salary-linked lending flow.
The concept verifies salary streams from employer payroll data, estimates available earned wages in real time,
and recommends either instant EWA disbursement or payroll-linked installment loans.

This PoC is aimed at internal product, risk, IT, legal/compliance, and sales stakeholders.

## What Is Included

- Executive landing page with problem, solution, and KPI narrative
- Employer/payroll integration monitor
- Employee eligibility and underwriting dashboard
- Real-time EWA limit and salary-loan recommendation engine
- Mock risk controls and portfolio summary
- Demo data for 3 employers and 8 employees

## Quick Start

Open the app directly in a browser:

```bash
open index.html
```

Or serve it locally:

```bash
python -m http.server 4173
```

Then open `http://localhost:4173/sf11-ewa/`.

## Demo Flow

1. Review the value proposition and operating model in the hero section.
2. Inspect employer integration readiness and payroll freshness.
3. Click employee cards to review:
   - payroll verification health
   - earned wage calculation
   - recommended offer
   - risk and compliance gates
4. Review portfolio KPIs and lender control rules.

## Files

- `index.html` - Main single-page app shell
- `styles.css` - Visual system and responsive layout
- `app.js` - Rendering and interaction logic
- `data/mockData.js` - Employers, employees, payroll, and rules
- `ARCHITECTURE.md` - PoC system design
- `DEMO.md` - Suggested presentation script

## Next Build Steps

1. Replace mock data with actual HRM/payroll API connectors.
2. Add consent capture and audit log persistence.
3. Add legal policy rule packs by employer type and jurisdiction.
4. Add disbursement and payroll auto-debit workflow APIs.
