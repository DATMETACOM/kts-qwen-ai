# SF8 Decisions Summary

## 1. Delivery target

- Goal: `submission-ready prototype + pitch-ready offline demo`
- Team shape: `1 primary builder`
- Capability assumption: the builder can cover:
  - app/UI
  - AI/scoring
  - product/story/pitch
- Work style: `single-threaded`, `agile`, `deliverable + risk driven`

## 2. Product positioning

- `SF8` is a `decision-support PoC + simulation PoC`
- It must stay aligned with the SF8 brief:
  - new customers
  - telco, social, e-wallet, e-commerce signals
  - early reactions to SVFC offers
  - partnership scoring and shared-data context

## 3. Out of scope

- underwriting workflow
- CRM automation
- production integration
- real-time partner integration
- training ML models from real customer data

## 4. Product structure

- Product flow: `Hybrid`
  - level 1: partner/channel decision
  - level 2: new customer decision
- Canonical outputs:
  - partnership/acquisition score
  - next best product
  - recommended action
  - AI explanation / outreach note
  - what-if simulation result

## 5. Action model

- Allowed actions:
  - `push now`
  - `nurture`
  - `hold`
- Action mapping must depend on:
  - overall score
  - partner/channel fit
  - product affinity
  - early reaction quality

## 6. Qwen role

- Qwen is used for:
  - explanation
  - outreach / offer note generation
- Qwen is not allowed to decide:
  - score
  - action

## 7. Simulation rules

- Simulation is mandatory
- Simulation must support all three variables:
  - partner/channel
  - product/offer
  - early reaction signal

## 8. UX and demo flow

- Demo flow starts from dashboard
- Hero case must be reachable quickly
- Dashboard must contain:
  - partner/channel summary
  - lead list
  - product mix
  - action distribution
- Customer detail layout:
  - signals + score side by side
  - then product
  - then action
  - then what-if
- Simulation must exist as:
  - inline panel in customer detail
  - expanded simulation workspace
- Export/pitch support must exist as:
  - in-app export/pitch view
  - export or snapshot capability

## 9. Hero case

- Hero case selection rule:
  - `pick the case with the best score`

## 10. Data policy

- Allowed data categories:
  - reference data
  - generated demo data
- Generated data must:
  - be reviewed before use
  - be clearly distinguishable
  - not appear as hard-coded FE mock data

## 11. Data governance markers

- Distinguish data using both:
  - file/source structure
  - per-record metadata
- Per-record metadata minimum:
  - source_type
  - source_name
  - approval_status
  - approved_by
  - approved_at
  - notes
  - scenario_id / persona_id

## 12. UI disclosure

- UI disclosure must exist at:
  - record level
  - dataset/view level
  - export/pitch output level

## 13. Data lifecycle

- Official data classes:
  - reference data
  - generated candidate data
  - approved dataset
  - published app dataset
- Rules:
  - no record can be approved without full provenance
  - no record can be published without approval

## 14. FE data modes

- `dev mode`
  - FE can use approved local dataset source
- `review mode`
  - FE can use approved local or staging published dataset
- `demo/submission mode`
  - FE must use published app dataset only

## 15. Infra

- Intended stack:
  - Supabase
  - Render
  - Vercel
- Approved dataset layer:
  - hybrid
  - versioned file source for review
  - publish into Supabase
  - app consumes published app dataset
- Scoring/simulation:
  - server-authoritative
- Qwen:
  - server-side only in practice
  - never from FE

## 16. Product and package scope

- Product groups: `4 groups`
- Dashboard uses group level
- Detail and what-if use package level
- Product group naming: `dual naming`
- Product package naming: `dual naming`
- Package depth:
  - minimum 2 per group
  - maximum 4 per group
- Final names are still subject to approval

## 17. Partner/channel taxonomy

- Three taxonomy layers:
  - data-source partners
  - acquisition/distribution channels
  - shared-data partnership models

## 18. Signal taxonomy

- Signal groups:
  - external behavioral signals
  - external profile/context signals
  - partner/channel-derived signals
  - early reaction signals
- Each signal candidate must include scoring intent

## 19. Archetypes

- Batch 1 archetype count: `6`
- Archetypes are based on:
  - behavioral patterns
  - partner/channel context
  - early reaction posture
- Each archetype must include:
  - name
  - behavioral profile
  - partner/channel context
  - early reaction posture
  - expected product tendency
  - expected action tendency

## 20. Batch 1 completion condition

- Batch 1 is complete only when:
  - taxonomy candidates are approved
  - 2 use-case slices are approved
  - hero case is selected

## 21. Submission rules

- Submission must optimize for:
  - brief alignment
  - business value clarity
  - fast judge comprehension
  - offline pitch readiness
- Mandatory asset direction:
  - screenshots
  - video demo
  - repo link
  - live link if ready
  - PDF one-pager
  - supplemental judge pack if it does not slow core submission
- Story rules:
  - only claim what is actually built
  - distinguish reference, generated, simulated
  - state PoC limitations clearly
- Demo video must include:
  - product flow
  - hero case
  - what-if
  - light governance disclosure

## 22. Agent non-negotiables

- no unapproved product/package creation
- no unapproved data use
- no FE mock fixtures as product data
- no unapproved final taxonomy decisions
- no LLM authority over score/action
- no KPI overclaim
- no submission/story overstatement

## 23. Approval gates

- taxonomy
- dataset
- scoring spec
- UI logic
- simulation logic
- submission

## 24. AI execution readiness

- AI execution is considered ready only when:
  - 6 control files are approved
  - first taxonomy/dataset batch is approved
  - approval gates are sequenced clearly
