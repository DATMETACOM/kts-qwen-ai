# Execution Boards 01-06

> Completion rule: a board is not complete at spec-only state when its objective requires a concrete artifact. See `08-EXECUTION-COMPLETION-RULES.md`.

## EB-01

- Objective: turn approved decisions into 6 control files
- Why now: all later sessions depend on them
- Inputs:
  - approved decisions summary
  - approved control-file structures
- Tasks:
  1. create the 6 control files
  2. fill them using only approved content
  3. cross-check for conflicts
  4. mark unresolved future business content as pending approval
- Checks:
  - all 6 files exist with correct sections
  - no unapproved business content appears as final
  - no conflict across files
  - pending approval markers are used correctly
- Gate:
  - Blocking: all 6 files complete
  - Blocking: no speculative business content
  - Blocking: files are usable as execution source of truth
- Outputs:
  - 6 control files v1
- Fallback:
  - defer unresolved content with pending approval
  - stop on control-file conflicts
- Not allowed:
  - invent final partner/product/package names
  - overclaim production/business state
- Approval needed:
  - no new approval needed unless new business content appears
- Hand-off:
  - control files ready
  - readiness: `ready`

## EB-02

- Objective: build the candidate catalog framework
- Why now: Batch 1 needs structure before any candidate content is gathered
- Inputs:
  - `DATA-CATALOG-CANDIDATES.md`
  - `DATA-GOVERNANCE.md`
  - `AGENT-GUARDRAILS.md`
- Tasks:
  1. create domain sections
  2. add standard table schema
  3. add status flow
  4. add review format
  5. add Batch 1 completion rules
- Checks:
  - all 5 domains exist
  - schema columns match approved rules
  - status flow matches governance
  - framework contains no real candidate business content
- Gate:
  - Blocking: all domain sections exist
  - Blocking: schema and status flow are correct
- Outputs:
  - review-ready catalog framework
- Fallback:
  - keep examples abstract only
- Not allowed:
  - no real candidate entries yet
- Approval needed:
  - no new approval needed unless framework rules change
- Hand-off:
  - candidate registry scaffold ready
  - readiness: `ready`

## EB-03

- Objective: gather Batch 1 candidate taxonomy across all 5 domains
- Why now: real execution starts with reviewable candidate content grounded in reference evidence
- Inputs:
  - control files
  - catalog framework
- Tasks:
  1. gather data-source partner candidates
  2. gather acquisition/distribution channel candidates
  3. gather shared-data model candidates
  4. gather signal taxonomy candidates
  5. gather product group candidates
  6. gather product package candidates
  7. gather archetype candidates
  8. fill registry with pending review status
  9. prepare review table with recommended approve/hold/reject
- Checks:
  - each candidate has full evidence
  - each candidate is pending review, not final
  - all domains are covered
  - package/product naming remains traceable
  - archetypes include expected product/action tendency
- Gate:
  - Blocking: all 5 domains have candidates
  - Blocking: every candidate has provenance/evidence
  - Blocking: no candidate presented as final truth
- Outputs:
  - Batch 1 candidate registry
  - review-ready candidate tables
- Fallback:
  - use equivalent public benchmark when needed
  - mark refinement pending instead of inventing
- Not allowed:
  - no unreferenced candidate invention
- Approval needed:
  - requires batch approval from the user
- Hand-off:
  - approved candidate batch needed
  - readiness: `partial` until approval is complete

## EB-04

- Objective: assemble 2 approved use-case slices and select the hero case
- Why now: scoring and demo flow need concrete slices, not abstract taxonomy
- Inputs:
  - approved candidate batch
  - slice rules
  - hero-case rule
- Tasks:
  1. build strong-fit slice
  2. build borderline/interesting slice
  3. ensure each slice includes all required components
  4. compare slice outcomes
  5. select hero case by best score
- Checks:
  - both slices have 6 required components
  - both slices align with SF8 brief
  - slices serve different roles
  - hero case follows the best-score rule
- Gate:
  - Blocking: 2 valid slices exist
  - Blocking: hero case selected by score rule
- Outputs:
  - 2 approved slices
  - 1 hero case
- Fallback:
  - use supporting case for secondary simulation path
  - do not change hero-case rule
- Not allowed:
  - no new slice invention outside approved registry
- Approval needed:
  - user approval required for slices and hero case
- Hand-off:
  - slices and hero case locked
  - readiness: `ready`

## EB-05

- Objective: design the 4-layer approved dataset pipeline
- Why now: this prevents governance violations before app/runtime work begins
- Inputs:
  - governance spec
  - approved slices
  - hero case
- Tasks:
  1. define schema for each data class
  2. map slices into approved dataset shape
  3. add metadata contract
  4. define publish flow
  5. define FE mode source rules
- Checks:
  - 4 data classes are distinct
  - metadata is complete
  - published data preserves disclosure-safe provenance
  - FE mode rules are implementable
- Gate:
  - Blocking: full pipeline is defined
  - Blocking: FE mode rules are correct
- Outputs:
  - pipeline contract
  - approved dataset schema
  - published dataset schema
- Fallback:
  - lock schema before live publish
- Not allowed:
  - no FE fixture shortcuts
- Approval needed:
  - user approval needed if business-specific dataset content changes
- Hand-off:
  - dataset pipeline ready for scoring
  - readiness: `ready`

## EB-06

- Objective: build deterministic-first scoring
- Why now: this is the product core and must exist before simulation or UI
- Inputs:
  - scoring spec
  - approved dataset
  - approved slices
  - hero case
- Tasks:
  1. define input dimensions
  2. implement all score families
  3. implement overall score
  4. implement action mapping
  5. define output contract
  6. run sanity checks on slices and hero case
- Checks:
  - engine works without Qwen
  - all score families are implemented
  - action mapping uses all required dimensions
  - strong-fit and borderline cases differ meaningfully
  - hero case has the best score
- Gate:
  - Blocking: deterministic engine complete
  - Blocking: 3 business outputs available
  - Blocking: slices and hero case behave as expected
- Outputs:
  - scoring engine v1
  - output contract v1
- Fallback:
  - simplify rules without dropping score families
- Not allowed:
  - no LLM authority over score/action
- Approval needed:
  - user approval only if scoring interpretation must change
- Hand-off:
  - scoring engine ready for simulation
  - readiness: `ready`
