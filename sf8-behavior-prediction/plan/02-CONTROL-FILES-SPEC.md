# SF8 Control Files Spec

## Overview

The project uses 6 control files as the mandatory governance layer before execution.

## 1. SF8-CONTEXT.md

### Purpose

Capture product boundary, core views, canonical outputs, dependencies, and phase-specific decisions.

### Required sections

- Phase Boundary
- Primary Views
- Canonical Output
- Out of Scope
- Implementation Decisions
- Canonical References
- Codebase Starting Point
- Decision Dependencies
- Deferred Ideas

### Section rules

- `Primary Views` must include:
  - view name
  - view objective
  - canonical outputs shown
  - decision role in demo flow
- `Decision Dependencies` must:
  - show dependencies between taxonomy approval, dataset approval, scoring, UI, simulation, and submission
  - mark blocking dependencies explicitly

## 2. DATA-GOVERNANCE.md

### Purpose

Define data classes, approval rules, provenance requirements, FE data modes, and auditability requirements.

### Required sections

- Data Classes
- Data Lifecycle
- Approval Policy
- Record Metadata Contract
- UI Disclosure Rule
- Publish Rule
- Prohibited Patterns
- Auditability Requirements
- FE Consumption Rule
- FE Consumption Modes

### Section rules

- `Data Classes` must define:
  - reference data
  - generated candidate data
  - approved dataset
  - published app dataset
- `Data Lifecycle` must show:
  - the path from one class to the next
  - who acts at each step
  - which gate applies at each step
- `Record Metadata Contract` must group fields into:
  - provenance fields
  - approval fields
  - scenario fields
- `UI Disclosure Rule` must cover:
  - record-level badge
  - dataset/view-level note
  - export/pitch disclosure
- `FE Consumption Modes` must define:
  - dev
  - review
  - demo/submission

## 3. DATA-CATALOG-CANDIDATES.md

### Purpose

Provide the candidate registry and review structure for all taxonomy and content candidates.

### Document shape

- one master file
- one subsection per domain
- standardized table schema per domain

### Domain sections

- partners/channels
- signal taxonomy
- product groups
- product packages
- scenario/persona archetypes

### Required columns

- candidate_id
- name
- domain
- status
- source_link
- extraction_note
- reason_for_inclusion
- confidence_fit_note
- reviewer_decision_note

### Status flow

- draft
- pending review
- approved
- published
- rejected

### Batch rules

- early review by domain
- later review by use-case slice
- Batch 1 completion requires:
  - approved taxonomy candidates
  - 2 approved use-case slices
  - selected hero case

## 4. SCORING-SPEC.md

### Purpose

Lock the deterministic scoring model, action mapping, simulation variables, and output contract.

### Required sections

- Score Families
- Input Dimensions
- Decision Rule
- Action Mapping
- Simulation Variables
- Qwen Role
- Output Contract
- Validation / Sanity Checks
- Known Limitations

### Section rules

- `Score Families` must include:
  - partner/channel fit
  - behavior signal strength
  - early reaction quality
  - product affinity
  - action recommendation
- `Decision Rule` must enforce deterministic-first behavior
- `Action Mapping` must depend on:
  - overall score
  - partner/channel fit
  - product affinity
  - early reaction quality
- `Simulation Variables` must be limited to:
  - partner/channel
  - product/offer
  - early reaction signal
- `Output Contract` must include:
  - primary business outputs
  - explanation/support fields
  - simulation delta/comparison fields
- `Validation / Sanity Checks` must cover:
  - internal logic consistency
  - score/product/action consistency
  - base vs what-if consistency

## 5. SUBMISSION-SPEC.md

### Purpose

Define what the final submission can claim, what assets are required, and how each field must be filled.

### Required sections

- Submission Objective
- Field-by-field Requirements
- Mandatory Assets
- Story Writing Rule
- Demo Video Rule
- Judge File Rule
- Claim Boundaries
- Asset Readiness Checklist
- Fallback Strategy if Deploy Not Ready

### Section rules

- `Field-by-field Requirements` must list:
  - each field
  - its purpose
  - claim boundaries
  - allowed source artifact
- `Mandatory Assets` must reflect:
  - screenshots
  - video demo
  - repo link
  - live link if ready
  - PDF one-pager
  - supplemental judge pack if practical
- `Story Writing Rule` must enforce:
  - only built facts
  - explicit separation of reference/generated/simulated
  - PoC limitations
- `Demo Video Rule` must enforce:
  - flow
  - hero case
  - what-if
  - light disclosure
- `Asset Readiness Checklist` must include:
  - readiness status
  - acceptance criteria

## 6. AGENT-GUARDRAILS.md

### Purpose

Constrain execution behavior for AI agents and human-assisted execution.

### Required sections

- Non-Negotiables
- Approval Gates
- Agent Behavior on Unapproved Content
- Context Refresh Rule
- Definition of Ready
- Escalation Rule
- Stop Conditions
- Allowed Proposal Scope

### Section rules

- `Non-Negotiables` must include:
  - no unapproved final business content
  - no unapproved data usage
  - no FE mock fixtures
  - no LLM decision authority
  - no overclaim
- `Approval Gates` must explicitly list:
  - taxonomy
  - dataset
  - scoring spec
  - UI logic
  - simulation logic
  - submission
- `Agent Behavior on Unapproved Content` must define:
  - stop on unapproved core path
  - allow labeled pending proposals only for candidate/reference side material
- `Context Refresh Rule` must require reading all 6 control files before major work
- `Escalation Rule` must trigger on:
  - missing approval
  - evidence gaps
  - control file conflicts
  - overclaim risk
  - hard-to-explain score/simulation outcomes
- `Stop Conditions` must include:
  - missing approval
  - evidence gaps
  - control file conflicts
  - phase boundary drift
  - generic AI-demo drift
