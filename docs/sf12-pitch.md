# SF12 - MicroBiz Loan for Digital Economy Sellers

## Pitch Summary

### Problem
Digital economy workers (freelancers, gig workers, online sellers) can't access traditional loans:
- No salary slips
- Irregular income patterns
- New market segment outside traditional credit

### Solution
AI-powered micro loans based on cashflow data:
- Alternative credit scoring from e-commerce & e-wallet
- Revenue-linked repayment (% of future revenue)
- 5-50M VND loan amounts
- Digital seller onboarding

### Technology
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI:** Qwen-Plus via Alibaba Cloud DashScope

### Key Metrics
| Metric | Before | After |
|--------|--------|-------|
| Loan TAT | 3-7 days | < 5 minutes |
| NPL | 8-12% | < 5% |
| Target customers | Salaried only | Gig economy |

### Demo
- 3-portal system (Seller, Platform, Admin)
- Cashflow dashboard
- AI credit scoring
- Revenue-linked repayment calculator

### API Endpoints
- `/api/customers` - MicroBiz customer list
- `/api/credit-score` - AI credit scoring
- `/api/loan` - Loan application
- `/api/dashboard` - Portfolio metrics

### Files
- `/docs/sf12-pitch.md` - This file
- `/sf12-microbiz-loan/` - Project code
- `/sf12-microbiz-loan/docs/` - Full documentation