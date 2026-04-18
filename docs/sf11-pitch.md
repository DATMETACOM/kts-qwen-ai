# SF11 - Earned Wage Access & Salary-Linked Lending

## Pitch Summary

### Problem
Employees need access to earned wages before payday:
- 3-7 day loan approval TAT
- Manual payslip verification required
- High acquisition costs

### Solution
Real-time EWA with payroll integration:
- Instant salary verification from HRM
- EWA withdrawal up to 50% of earned salary
- Salary-linked loans with auto-debit
- AI credit scoring with explainability

### Technology
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI:** Qwen-Plus via Alibaba Cloud DashScope

### Key Metrics
| Metric | Before | After |
|--------|--------|-------|
| Loan TAT | 3-7 days | < 5 minutes |
| NPL | 5-10% | < 2% |
| Acquisition cost | High | -40% |

### Demo
- 3-portal system (Employee, HR Admin, Shinhan Admin)
- Real-time EWA calculation
- AI credit scoring demo

### API Endpoints
- `/api/verify-salary` - Salary verification
- `/api/credit-score` - AI credit scoring
- `/api/loan` - Loan application
- `/api/ewa` - EWA withdrawal
- `/api/company` - Company data
- `/api/risk/*` - Risk assessments (cashflow, churn, compliance)

### Files
- `/docs/sf11-pitch.md` - This file
- `/sf11-ewa-lending/` - Project code
- `/sf11-ewa-lending/docs/` - Full documentation