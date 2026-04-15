# DATA-GOVERNANCE.md

## Data Classes

| Class | Description | Owner | Gate |
|---|---|---|---|
| **Reference Data** | Public benchmarks, market documentation, product catalogs, taxonomy reference sources | Builder / Researcher | Self-declared — must include source_link and extraction_note in DATA-CATALOG-CANDIDATES.md |
| **Generated Candidate Data** | Synthetic/demo records created to populate the PoC, aligned to approved taxonomy | Builder | Dataset Approval Gate — must pass review before becoming approved dataset |
| **Approved Dataset** | Generated candidate data that has been reviewed and approved with full provenance | Builder + Reviewer (same person in single-threaded mode, but review step is mandatory) | Dataset Approval Gate |
| **Published App Dataset** | Approved dataset that has been published into the app consumption layer (Supabase or versioned publish path) | Builder | Publish Gate — must not publish without approval |

---

## Data Lifecycle

```
Reference Data
    │
    │ [Builder creates/collects from public sources]
    │ [Gate: Self-declared with source_link + extraction_note]
    ▼
Generated Candidate Data
    │
    │ [Builder generates demo records mapped to approved taxonomy]
    │ [Gate: Dataset Approval — review provenance, distinguishability, no FE mock fixture pattern]
    ▼
Approved Dataset
    │
    │ [Builder publishes to app consumption layer]
    │ [Gate: Publish Rule — must be approved first]
    ▼
Published App Dataset
    │
    └─► Consumed by FE in demo/submission mode
```

**Who acts at each step:**
1. Reference Data → Builder collects and documents
2. Generated Candidate Data → Builder generates; Reviewer (formal step) reviews
3. Approved Dataset → Builder publishes after approval confirmation
4. Published App Dataset → App consumes; no further modifications without re-approval

---

## Approval Policy

| Rule | Requirement |
|---|---|
| No record can be approved without full provenance | source_type, source_name, approval_status, approved_by, approved_at, notes must all be populated |
| No record can be published without approval | Only records with `approval_status = "approved"` may enter the published app dataset |
| Generated data must be reviewed before use | Review step is mandatory even in single-threaded mode — builder must formally mark review complete |
| Generated data must be clearly distinguishable | Per-record metadata badge in UI; dataset/view-level disclosure; export/pitch disclosure |
| Generated data must not appear as hard-coded FE mock fixtures | All demo data must flow through the approved dataset pipeline, not embedded in FE component code |

---

## Record Metadata Contract

Every record in the system must carry the following metadata, grouped into three categories:

### Provenance Fields

| Field | Type | Description |
|---|---|---|
| `source_type` | enum: `"reference"` \| `"generated"` | Origin category of the record |
| `source_name` | string | Name of the source (e.g., file, dataset, reference URL) |
| `approval_status` | enum: `"draft"` \| `"pending_review"` \| `"approved"` \| `"published"` \| `"rejected"` | Current approval state |

### Approval Fields

| Field | Type | Description |
|---|---|---|
| `approved_by` | string | Who approved the record (name or role) |
| `approved_at` | ISO 8601 timestamp | When the record was approved |
| `notes` | string | Review notes, caveats, or context |

### Scenario Fields

| Field | Type | Description |
|---|---|---|
| `scenario_id` | string | ID of the scenario/use-case slice this record belongs to |
| `persona_id` | string | ID of the archetype/persona this record represents |

---

## UI Disclosure Rule

Disclosure must exist at three levels:

| Level | Mechanism | Requirement |
|---|---|---|
| **Record-level badge** | Visual badge on each customer/detail card | Show `source_type` (reference vs. generated) and `approval_status` |
| **Dataset/view-level note** | Banner or footnote on dashboard and list views | "This demo uses generated data aligned to approved taxonomy. Not real customer data." |
| **Export/pitch disclosure** | Footer or watermark on exported views and pitch materials | "PoC demo — generated data for illustration. Not production data." |

---

## Publish Rule

| Rule | Description |
|---|---|
| Only approved records may be published | `approval_status` must be `"approved"` before publish |
| Publish creates Published App Dataset | Published dataset is versioned and immutable without re-approval |
| FE in demo/submission mode must consume only published dataset | See FE Consumption Modes below |
| Re-publish requires re-approval | Any changes to published data must go through the Dataset Approval Gate again |

---

## Prohibited Patterns

| Pattern | Status | Reason |
|---|---|---|---|---|
| Hard-coding mock data in FE components | Prohibited | Violates data governance; indistinguishable from product data |
| Using unapproved generated data in demo/submission | Prohibited | No data may appear in final demo without approval |
| Claiming generated data as real customer data | Prohibited | Overclaim — violates submission integrity |
| FE directly calling Qwen for scoring or action decisions | Prohibited | Qwen has no decision authority; scoring is server-authoritative |
| Real customer data in PoC | Prohibited | Out of scope; regulatory and privacy risk |

---

## Auditability Requirements

| Requirement | Description |
|---|---|
| Full provenance traceability | Every published record must be traceable back to its reference or generation source |
| Approval log | All approval_status transitions must be logged with approved_by and approved_at |
| Version control | DATA-CATALOG-CANDIDATES.md and all data source files must be version-controlled in Git |
| Reproducibility | Given the same approved dataset and scoring spec, outputs must be reproducible |

---

## FE Consumption Rule

The frontend must consume data according to the mode rules below. The app must enforce which data source is used based on the current mode.

---

## FE Consumption Modes

| Mode | Allowed Data Source | When Used |
|---|---|---|---|---|
| **Dev** | Approved local dataset source (versioned files) | Local development and testing |
| **Review** | Approved local dataset OR staging published dataset | Code review, internal walkthroughs, pre-submission checks |
| **Demo / Submission** | Published app dataset ONLY | Judge demo, pitch, submission video, live demo link |

**Enforcement:** The app configuration must have a mode flag that restricts data source selection. In demo/submission mode, only the published app dataset is accessible.
