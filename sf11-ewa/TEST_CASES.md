# SF11 EWA Test Cases

## Decision Engine

1. Approve EWA when consent, bank verification, payroll freshness, attendance, and tenure all pass.
2. Decline EWA when consent is missing.
3. Fall back to salary-linked loan when EWA is zero but debt-service capacity remains positive.
4. Decline all offers when payroll freshness exceeds policy.

## Policy Simulation

1. Lower `maxFreshnessHours` and verify that stale payroll cases move from approve/review to blocked.
2. Lower `dsrCapPercent` and verify salary-linked loan capacity shrinks.
3. Increase `ewaCapMultiplier` and verify EWA exposure rises without breaking caps.

## Workflow and Audit

1. For an approved EWA case, workflow should show consent, payroll verified, offer approved, and disbursement ready.
2. For a declined case, workflow should mark blocking stages clearly.
3. Audit log should explain intake, policy gate, offer sizing, and collections memo.

## UI

1. Employee filters should narrow the queue by employer and decision.
2. Empty filter results should show fallback guidance instead of broken detail state.
3. Mobile layout should collapse grids into single-column cards without clipped content.
