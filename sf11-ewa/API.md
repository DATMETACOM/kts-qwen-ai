# SF11 EWA Mock API

## Purpose

This document defines the next mock API layer to move the current UI from local in-browser logic
to an API-backed PoC flow.

## Endpoints

### `GET /api/employers`

Returns employer integration inventory.

Response fields:

- `id`
- `name`
- `payrollProvider`
- `status`
- `syncHoursAgo`
- `defaultEwaCap`

### `GET /api/employees`

Returns employee queue with basic profile and current policy-agnostic payroll state.

Response fields:

- `id`
- `employerId`
- `name`
- `role`
- `monthlySalary`
- `netSalary`
- `tenureMonths`
- `consent`
- `bankVerified`

### `POST /api/verify-payroll`

Checks payroll freshness, salary snapshot, and account match.

Request:

```json
{
  "employeeId": "ewa-001"
}
```

Response:

```json
{
  "verified": true,
  "freshnessHours": 2,
  "payrollCycle": "Monthly",
  "matchedBankAccount": true
}
```

### `POST /api/ewa/decision`

Runs policy rules and returns EWA eligibility.

### `POST /api/salary-loan/decision`

Runs salary-linked loan sizing when EWA is not the final path.

### `POST /api/disbursements`

Creates a mock disbursement record.

### `POST /api/payroll-deductions`

Creates a mock payroll auto-debit or deduction schedule.

### `GET /api/audit-log/:employeeId`

Returns a chronological list of data pulls, policy checks, decisions, and repayment setup events.

## Suggested Response Pattern

Use a shared envelope:

```json
{
  "data": {},
  "meta": {
    "generatedAt": "2026-04-17T10:30:00Z",
    "policyVersion": "sf11-v1"
  }
}
```
