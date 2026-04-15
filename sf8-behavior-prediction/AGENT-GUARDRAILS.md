# AGENT-GUARDRAILS.md

## Non-Negotiables

The following rules are **absolute**. No exceptions. Violating any of these is a stop condition.

| # | Rule | Rationale |
|---|---|---|
| 1 | **No unapproved final business content** (partner names, product packages, final taxonomy) without marking as `pending approval` | All business content must go through the DATA-CATALOG-CANDIDATES.md review process |
| 2 | **No unapproved data usage** -- only use data from DATA-CATALOG-CANDIDATES.md or lib/data.ts | All data must flow through the approved dataset pipeline per DATA-GOVERNANCE.md |
| 3 | **No FE mock fixtures as product data** -- FE must consume from governed data source | Demo data must not be hard-coded in frontend components |
| 4 | **No LLM decision authority over score or action** -- Qwen explains, never decides | Scores and actions are deterministic; Qwen generates explanation text only |
| 5 | **No KPI overclaim or submission overstatement** -- only claim what is built | Submission must be honest, accurate, and verifiable |
| 6 | **No unapproved final taxonomy decisions** | Taxonomy must be reviewed and approved in DATA-CATALOG-CANDIDATES.md before use |
| 7 | **No phase boundary drift** | Do not expand scope beyond what is defined in SF8-CONTEXT.md Phase Boundary and Out of Scope sections |

---

## Approval Gates

Work proceeds through the following gates. Each gate must be explicitly passed before downstream work begins.

| # | Gate | What It Approves | Depends On | Downstream Impact |
|---|---|---|---|---|
| 1 | **Taxonomy Gate** | Partner/channel taxonomy, signal taxonomy, product groups/packages, archetypes (in DATA-CATALOG-CANDIDATES.md) | None (starting gate) | Blocks dataset creation and scoring spec |
| 2 | **Dataset Gate** | Generated demo records mapped to approved taxonomy, with full provenance metadata | Taxonomy Gate | Blocks UI logic and scoring validation |
| 3 | **Scoring Spec Gate** | Deterministic scoring model, action mapping, simulation variables, output contract (SCORING-SPEC.md) | Taxonomy Gate | Blocks simulation logic and UI scoring display |
| 4 | **UI Logic Gate** | Frontend rendering of 4 core views (Dashboard, Customer Detail, Simulation Workspace, Export/Pitch) | Dataset Gate + Scoring Spec Gate | Blocks simulation logic testing |
| 5 | **Simulation Logic Gate** | What-if simulation engine supporting exactly 3 approved variables | Scoring Spec Gate + UI Logic Gate | Blocks submission demo readiness |
| 6 | **Submission Gate** | All submission assets, narrative content, and claim boundaries (SUBMISSION-SPEC.md) | All above gates + mandatory assets ready | Blocks final submission |

**Gate sequence:** Taxonomy → Dataset + Scoring Spec → UI Logic → Simulation Logic → Submission

---

## Agent Behavior on Unapproved Content

### STOP on Unapproved Core Path Items

If the agent encounters a situation where:
- A core path component (final partner names, product packages, production claims, scoring outcomes, submission content) lacks the required approval,
- The agent must **STOP** and flag the missing approval as an escalation.

The agent must **NOT** proceed with unapproved content on any core path.

### ALLOW Labeled Pending Proposals for Candidate/Reference Side Material

The agent **MAY** create and work with pending proposals under these conditions:

- The proposal is clearly labeled as `pending review` or `draft` (status in DATA-CATALOG-CANDIDATES.md).
- The proposal is in the candidate/reference side material, not the core execution path.
- The proposal does not appear in any user-facing output, demo, or submission asset.

### Always Mark as "pending approval" When Uncertain

When in doubt about whether content requires approval:
- Label it as `pending approval`
- Do not use it in user-facing output
- Flag it for human review

---

## Context Refresh Rule

**Before any major work session**, the agent MUST read all 6 control files:

1. `SF8-CONTEXT.md`
2. `DATA-GOVERNANCE.md`
3. `DATA-CATALOG-CANDIDATES.md`
4. `SCORING-SPEC.md`
5. `SUBMISSION-SPEC.md`
6. `AGENT-GUARDRAILS.md`

This ensures the agent operates with the latest governance constraints, approved content, and decision boundaries.

**Minor edits** (typo fixes, formatting, single-line changes) do not require a full context refresh but must still comply with all guardrails.

---

## Escalation Rule

The agent MUST escalate (flag to the user/human operator) when any of the following conditions occur:

| Escalation Trigger | Required Action |
|---|---|
| **Missing approval for required gate** | Flag the missing approval, identify which gate, and request human decision before proceeding |
| **Evidence gaps** (no source_link for candidate) | Flag what is missing, which file/domain is affected, and where it is needed |
| **Control file conflicts** (contradiction between files) | Flag the specific conflict, identify the conflicting files, and recommend resolution |
| **Overclaim risk** (claiming production readiness) | Flag the specific claim, explain why it is an overclaim, and suggest correction |
| **Hard-to-explain score/simulation outcomes** | Flag the outcome, identify the unclear rule, and recommend rule clarification |

Escalation must include:
- What triggered the escalation
- Which control file(s) are involved
- What the agent recommends or what decision is needed

---

## Stop Conditions

The agent MUST STOP all work immediately when any of the following conditions is detected:

| Stop Condition | Description |
|---|---|
| **Missing required approval** | Core path component (taxonomy, data, scoring, UI logic, simulation, submission content) lacks required approval from the relevant gate |
| **Evidence gaps in candidate data** | Required data, spec, or reference is unavailable and cannot be procedurally generated. Candidate entry has no source_link or extraction_note. |
| **Control file conflicts detected** | Contradictory instructions across control files that cannot be resolved locally. Escalate and wait for resolution. |
| **Phase boundary drift** | Work is expanding into areas declared Out of Scope in SF8-CONTEXT.md (underwriting workflow, CRM automation, production integration, real-time partner integration, ML model training). |
| **Generic AI-demo drift** | Output is becoming a generic AI demo rather than the specific SF8 decision-support PoC (e.g., adding chatbot features, general Q&A, or non-SF8 capabilities). |

When a stop condition is triggered:
1. Stop all work immediately.
2. Report which stop condition was triggered.
3. Provide context on why it was triggered.
4. Recommend what needs to happen to resolve it.
5. Do NOT proceed until the human operator clears the stop condition.

---

## Allowed Proposal Scope

The agent is **allowed** to create proposals in the following scope:

| Area | What Is Allowed | Condition |
|---|---|---|
| **Signal candidates** | Propose additional signal candidates with full evidence | Must include source_link, extraction_note, and confidence_fit_note |
| **Product packages** | Propose additional product packages if aligned with spec | Must be labeled as `draft` or `pending review` in DATA-CATALOG-CANDIDATES.md |
| **UI/UX improvements** | Suggest UI/UX improvements within the 4-view structure | Must not use unapproved data or render unapproved content |
| **Scoring weight suggestions** | Recommendations for weight values | Must be labeled as proposals, not decisions. Must not alter the deterministic-first rule |

### NOT Allowed

| Area | What Is NOT Allowed |
|---|---|
| **New capability areas** | Do NOT propose new capability areas outside the brief (e.g., chatbot, general Q&A, underwriting, CRM) |
| **New simulation variables** | Do NOT propose additional simulation variables beyond the approved 3 |
| **New action types** | Do NOT propose actions beyond `push now`, `nurture`, `hold` |
| **LLM decision authority** | Do NOT propose giving Qwen authority over scores, actions, or product recommendations |

All proposals must:
- Be clearly labeled with their status (`draft` or `pending review`)
- Not appear in any user-facing output until approved
- Be subject to the relevant approval gate before becoming active
