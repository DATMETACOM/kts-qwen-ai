# SF11 EWA Architecture

## Goal

Enable paperless salary-linked lending and Earned Wage Access by consuming payroll events from employers in near real time.

## PoC Layers

1. Experience Layer
   - Single-page dashboard for business demo and operator review
2. Decision Layer
   - Earned wage calculator
   - Salary-linked loan recommendation engine
   - Policy and eligibility checks
3. Data Layer
   - Mock employers
   - Mock employees
   - Payroll snapshots
   - Risk thresholds

## Core Objects

### Employer

- payroll cycle
- disbursement bank
- integration status
- payroll sync freshness

### Employee

- employment status
- base salary
- pay frequency
- days worked in cycle
- deductions and obligations
- consent state

### Offer Decision

- `ewaAmount`
- `loanAmount`
- `decision`
- `riskBand`
- `reasons`

## Decision Logic

### EWA

- Estimate gross earned salary based on day-in-cycle accrual
- Subtract prior wage access already disbursed
- Apply employer cap percentage
- Apply hard risk and compliance caps

### Salary Loan

- Estimate disposable payroll capacity
- Constrain by debt-service ratio
- Constrain by tenure, payroll freshness, and employer risk
- Recommend tenor and expected installment

## Future Production Components

- Employer connector service for HRM/Payroll providers
- Consent and data-sharing ledger
- Underwriting rules service
- Loan management system integration
- Auto-debit and payroll deduction orchestration
- Compliance logging and anomaly monitoring
