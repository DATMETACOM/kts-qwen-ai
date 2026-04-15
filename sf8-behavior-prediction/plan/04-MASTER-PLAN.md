# SF8 Master Plan

## Operating principles

- No FE hard-coded fake fixtures for product data
- Core path stops on unapproved content
- Candidate/reference support material may be proposed only when clearly marked pending approval
- Every session must end with a checkable output
- No session advances until its gate is satisfied
- Spec-only output does not count as complete when the session objective requires a concrete repo artifact

## Completion policy

- A session is `not complete` if it only produces:
  - plans
  - specs
  - templates
  - placeholders
  while its objective requires executable or reviewable artifacts
- A session is `complete` only when its promised concrete artifact exists in the repo or in the governed execution path
- If a session requires approval, it is only `ready` after:
  - the concrete artifact exists
  - the approval gate passes
- If a session produces only preparatory documents, its outputs must explicitly unlock the next execution step

## Concrete artifact rule by session

- Session 1:
  requires the 6 control files to be created as real files, not only specified
- Session 2:
  requires a real candidate catalog framework file, not only a description of one
- Session 3:
  requires candidate entries populated in the catalog, not only candidate rules
- Session 4:
  requires 2 assembled slices and a selected hero case recorded in repo artifacts
- Session 5:
  requires concrete dataset schemas and publish-flow artifacts, not only a conceptual pipeline
- Session 6:
  requires a deterministic scoring implementation, not only scoring rules
- Session 7:
  requires a simulation implementation, not only simulation intent
- Session 8:
  requires runtime integration code, not only runtime architecture
- Session 9:
  requires the 4 core views implemented, not only view definitions
- Session 10:
  requires Qwen integration for explanation/outreach in product flow, not only prompts on paper
- Session 11:
  requires actual submission assets, not only an asset checklist
- Session 12:
  requires a real dry-run result and final readiness verdict, not only readiness criteria

## Session order

### Session 1: Lock the 6 control files

- Objective:
  turn approved decisions into source-of-truth planning files
- Why:
  later sessions will drift without them
- Main output:
  6 control files v1

### Session 2: Build the candidate catalog review framework

- Objective:
  set up the candidate registry and review structure
- Why:
  Batch 1 needs a controlled review frame before any real candidate content is collected
- Main output:
  candidate catalog framework

### Session 3: Gather Batch 1 candidate taxonomy

- Objective:
  collect candidate taxonomy across all 5 domains from public/reference sources
- Why:
  credibility and governance start here
- Main output:
  review-ready candidate registry

### Session 4: Assemble and approve 2 use-case slices

- Objective:
  build the first 2 controlled demo slices and select the hero case
- Why:
  scoring, simulation, and demo narrative all depend on these slices
- Main output:
  2 approved slices and 1 selected hero case

### Session 5: Design the approved dataset pipeline

- Objective:
  define the 4-layer data pipeline from candidate source to published app dataset
- Why:
  prevents governance drift and FE mock shortcuts
- Main output:
  dataset pipeline contract and schemas

### Session 6: Build deterministic-first scoring

- Objective:
  create the core scoring engine
- Why:
  this is the product core
- Main output:
  scoring engine v1 and sanity checks

### Session 7: Build the simulation engine

- Objective:
  support the required what-if variables
- Why:
  simulation is mandatory and differentiates the PoC
- Main output:
  simulation engine v1 and hero-case what-if path

### Session 8: Build app runtime skeleton

- Objective:
  connect runtime to governed data, scoring, and simulation
- Why:
  this converts logic into a usable product runtime
- Main output:
  runtime shell and integrations

### Session 9: Complete the 4 core views

- Objective:
  build:
  - dashboard
  - customer detail
  - simulation workspace
  - export/pitch view
- Why:
  this creates the end-to-end demoable product
- Main output:
  full product flow v1

### Session 10: Add Qwen explanation and outreach

- Objective:
  add the approved AI layer
- Why:
  satisfy meaningful Qwen use without giving up decision authority
- Main output:
  AI explanation and outreach note v1

### Session 11: Assemble the submission asset pack

- Objective:
  produce the actual submission package
- Why:
  the prototype alone is not enough to submit
- Main output:
  screenshots, video, draft submission, PDF one-pager

### Session 12: Final dry run and readiness review

- Objective:
  confirm final:
  - submission-ready
  - pitch-ready
- Why:
  eliminate mismatch between product, claims, and assets
- Main output:
  final readiness verdict and fallback checklist

## Absolute execution priority

1. control files
2. taxonomy and candidate approval
3. slices and hero case
4. dataset pipeline
5. deterministic scoring
6. simulation
7. runtime
8. 4 core views
9. AI explanation
10. submission assets
11. dry run

## Do not insert these prematurely

- new capabilities outside the brief
- production integration
- real ML training
- extra dashboards outside the 4 locked views
- UI polish before data/logic is stable
