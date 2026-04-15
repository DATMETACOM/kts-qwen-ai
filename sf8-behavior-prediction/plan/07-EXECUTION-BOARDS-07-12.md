# Execution Boards 07-12

> Completion rule: a board is not complete at spec-only state when its objective requires a concrete artifact. See `08-EXECUTION-COMPLETION-RULES.md`.

## EB-07

- Objective: build the mandatory simulation engine
- Why now: simulation depends on stable base scoring and is required by the product direction
- Inputs:
  - scoring engine
  - scoring output contract
  - hero case
- Tasks:
  1. define what-if input model
  2. implement simulation for:
     - partner/channel
     - product/offer
     - early reaction
  3. build delta payload
  4. test hero-case and supporting paths
- Checks:
  - only 3 approved variables are simulated
  - base and what-if share the same decision logic
  - hero case has a strong what-if path
  - payload is UI-ready
- Gate:
  - Blocking: all 3 variables supported
  - Blocking: hero-case what-if path is strong enough
- Outputs:
  - simulation engine v1
  - comparison payload
- Fallback:
  - build variable support incrementally but finish all 3 before completion
- Not allowed:
  - no simulation-only logic path
- Approval needed:
  - user approval only if hero-case rule or simulation scope must change
- Hand-off:
  - runtime can now integrate scoring and simulation
  - readiness: `ready`

## EB-08

- Objective: build the governed runtime skeleton
- Why now: the app should only be connected after data and logic are stable
- Inputs:
  - data pipeline contract
  - scoring engine
  - simulation engine
  - infra assumptions
- Tasks:
  1. build app shell
  2. implement mode-aware data access
  3. connect runtime to scoring
  4. connect runtime to simulation
  5. keep FE free of hard-coded fake fixtures
- Checks:
  - runtime works in governed data modes
  - FE does not compute score/action
  - both scoring and simulation are callable
- Gate:
  - Blocking: app shell runs
  - Blocking: governed data loading works
  - Blocking: server-authoritative scoring/simulation works
- Outputs:
  - runtime skeleton v1
- Fallback:
  - use approved local source in dev mode
- Not allowed:
  - no FE direct scoring
- Approval needed:
  - user approval only if mode policy must change
- Hand-off:
  - runtime ready for 4 views
  - readiness: `ready`

## EB-09

- Objective: build the 4 core views and end-to-end demo flow
- Why now: this is the productization step that turns the system into a demoable application
- Inputs:
  - runtime skeleton
  - approved slices
  - hero case
  - scoring and simulation outputs
- Tasks:
  1. build dashboard
  2. build customer detail
  3. build simulation workspace
  4. build export/pitch view
  5. add governance disclosures
  6. optimize hero-case path
- Checks:
  - dashboard contains all 4 mandatory business blocks
  - hero case is reachable quickly
  - detail view follows approved layout logic
  - simulation exists inline and expanded
  - export/pitch view is asset-friendly
- Gate:
  - Blocking: all 4 views exist
  - Blocking: hero-case flow works
  - Blocking: simulation is usable in both forms
- Outputs:
  - 4 core views v1
  - end-to-end demo flow v1
- Fallback:
  - simplify layout, not scope
- Not allowed:
  - no additional capability expansion
- Approval needed:
  - user approval only if the 4-view structure must change
- Hand-off:
  - AI layer can now be added
  - readiness: `ready`

## EB-10

- Objective: add AI explanation and outreach note
- Why now: the app now has the right places to surface Qwen outputs
- Inputs:
  - detail view
  - export/pitch view
  - scoring outputs
- Tasks:
  1. design structured AI prompt input
  2. design AI output shape
  3. add AI explanation
  4. add AI outreach note
  5. add fallback explanation path
- Checks:
  - AI does not alter score/action
  - explanation matches deterministic logic
  - fallback path works
- Gate:
  - Blocking: AI output works in both required views
  - Blocking: AI has no decision authority
- Outputs:
  - AI explanation v1
  - AI outreach note v1
- Fallback:
  - deterministic explanation fallback
- Not allowed:
  - no AI-led decision changes
- Approval needed:
  - user approval only if tone or role shifts materially
- Hand-off:
  - asset pack can now be produced
  - readiness: `ready`

## EB-11

- Objective: produce the submission asset pack
- Why now: the product is now mature enough to capture into assets without overclaiming
- Inputs:
  - 4 core views
  - hero case
  - what-if path
  - AI explanation
  - submission spec
- Tasks:
  1. define screenshot set
  2. record demo video
  3. draft submission fields
  4. write story within claim boundaries
  5. build PDF one-pager
  6. build supplemental pack only if practical
- Checks:
  - all mandatory assets are present
  - story reflects only built reality
  - video includes flow, hero case, what-if, disclosure
  - one-pager stands alone
- Gate:
  - Blocking: video complete
  - Blocking: submission draft complete
  - Blocking: PDF one-pager complete
  - Blocking: claim boundaries respected
- Outputs:
  - full asset pack
- Fallback:
  - repo + video + PDF when live link is not ready
- Not allowed:
  - no asset created from the wrong data mode
- Approval needed:
  - user approval required for final submission copy and one-pager
- Hand-off:
  - asset pack ready for final dry run
  - readiness: `ready`

## EB-12

- Objective: run final dry run and lock submission-ready / pitch-ready state
- Why now: this is the final consistency checkpoint before submission and offline pitch
- Inputs:
  - full product
  - submission draft
  - asset pack
  - one-pager
  - control files
- Tasks:
  1. dry-run the full demo flow
  2. cross-check product and submission copy
  3. cross-check governance disclosures
  4. check links and offline fallback
  5. confirm demo/submission data mode
  6. produce final readiness verdict
- Checks:
  - product, story, and assets tell the same story
  - hero case and what-if path are consistent everywhere
  - no governance contradictions
  - no overclaim
  - offline fallback is workable
- Gate:
  - Blocking: full dry run passes
  - Blocking: submission copy matches reality
  - Blocking: links or fallbacks are ready
  - Blocking: demo/submission mode uses the correct data source
- Outputs:
  - final readiness verdict
  - fallback checklist
  - submission-final or blocked state
- Fallback:
  - recorded video and export view as backup if live demo fails
  - deterministic fallback if Qwen fails
- Not allowed:
  - no final submission while the dry run is still failing
- Approval needed:
  - user approval required before final submit
- Hand-off:
  - no next session
  - terminal state:
    - submission-ready
    - pitch-ready
    - or blocked with reasons
