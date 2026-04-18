# SF12 MicroBiz Loan Mock API

## Purpose

This document defines the mock API shape for moving SF12 from local browser logic to an integration-style PoC.

## Endpoints

### `GET /api/channels`

Returns partner channel inventory and freshness metrics.

### `GET /api/sellers`

Returns seller queue with normalized revenue profile inputs.

### `POST /api/cashflow/ingest`

Triggers ingestion of seller revenue and payout snapshots from marketplace or wallet partners.

Request:

```json
{
  "sellerId": "mb-001",
  "channelIds": ["chn-shopee", "chn-momo"]
}
```

### `POST /api/score`

Runs alternative credit scoring and returns explainable features.

Response fields:

- `altScore`
- `riskBand`
- `freshnessHours`
- `featureDrivers`

### `POST /api/offers`

Returns ticket sizing and revenue-share deduction proposal.

### `POST /api/collections/plan`

Returns projected collection waterfall and payoff horizon.

### `GET /api/monitoring/:sellerId`

Returns anomaly flags, refund spikes, dispute spikes, and tenor drift warnings.

### `GET /api/audit-log/:sellerId`

Returns the scoring, offer, acceptance, and collections decision trail.

## Shared Envelope

```json
{
  "data": {},
  "meta": {
    "generatedAt": "2026-04-17T10:30:00Z",
    "policyVersion": "sf12-v1"
  }
}
```
