# Execution Completion Rules

## Purpose

This file closes the gap between planning and execution.

The key rule is:

- a session is **not complete** if it only produces a spec, template, checklist, or narrative placeholder when the session objective requires a real execution artifact

## Global rule

For every session:

1. The required artifact must exist in the repo or governed runtime path
2. The artifact must satisfy the session gate
3. If approval is required, the artifact must also be approved before the session is considered fully ready

## What never counts as completion by itself

- only writing a spec for a file that should already exist
- only describing a dataset pipeline without actual schemas
- only describing scoring logic without implementation
- only defining views without implemented screens
- only listing assets without generating them

## Session-by-session completion rules

### Session 1

Complete only when:

- the 6 control files exist as real files
- they are populated with approved content

Not complete if:

- only the control-file specs exist

### Session 2

Complete only when:

- the candidate catalog framework exists as a real registry file structure

Not complete if:

- only the candidate catalog spec exists

### Session 3

Complete only when:

- candidate entries are populated into the registry
- each candidate has evidence fields

Not complete if:

- only candidate rules exist

### Session 4

Complete only when:

- 2 use-case slices are assembled and recorded
- hero case is selected and recorded

Not complete if:

- slices are only described abstractly

### Session 5

Complete only when:

- dataset schemas exist
- publish-flow artifacts are defined concretely

Not complete if:

- only a narrative of the pipeline exists

### Session 6

Complete only when:

- deterministic scoring code exists
- sanity checks are run against approved slices/hero case

Not complete if:

- only scoring rules or pseudocode exist

### Session 7

Complete only when:

- simulation code exists
- all 3 approved what-if variables are supported

Not complete if:

- only simulation ideas or scenarios exist

### Session 8

Complete only when:

- runtime shell exists
- governed data access works
- scoring/simulation integration works

Not complete if:

- only runtime architecture is documented

### Session 9

Complete only when:

- all 4 core views are implemented
- hero-case path is navigable

Not complete if:

- only wireframes or view descriptions exist

### Session 10

Complete only when:

- Qwen explanation is integrated into the product path
- outreach note is integrated into the product path

Not complete if:

- only prompts or output examples exist

### Session 11

Complete only when:

- required submission assets are generated
- draft submission copy exists
- PDF one-pager exists

Not complete if:

- only an asset checklist exists

### Session 12

Complete only when:

- a real dry run has been performed
- a final readiness verdict is written

Not complete if:

- only readiness criteria exist

## Enforcement rule for AI execution

If a session is missing its concrete artifact, downstream sessions must treat it as:

- `not ready`

and must not silently reinterpret planning artifacts as executed outputs.
