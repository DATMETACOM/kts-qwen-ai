# SF12 MicroBiz Loan Architecture

## Goal

Provide credit access to digital sellers, freelancers, and gig workers by underwriting against
verified revenue behavior instead of salary slips or heavy dependence on CIC history.

## PoC Layers

1. Experience Layer
   - Portfolio dashboard for product, risk, and sales teams
2. Decision Layer
   - Alternative scorecard
   - Offer sizing engine
   - Revenue-share repayment engine
3. Data Layer
   - Mock e-commerce data
   - Mock e-wallet flow
   - Seller profile and fraud signals

## Core Objects

### Seller

- segment
- platform mix
- average monthly revenue
- volatility
- refund ratio
- payout freshness

### Decision

- `altScore`
- `recommendedLoan`
- `revenueSharePercent`
- `decision`
- `riskBand`
- `monitoringFlags`

## Decision Logic

### Alternative Scoring

- Blend revenue consistency, platform diversification, wallet settlement health,
  chargeback/refund levels, and account tenure
- Penalize cash-flow volatility, payout gaps, and customer dispute spikes

### Offer Sizing

- Base amount from average monthly gross merchandise value
- Cap by volatility and data freshness
- Enforce min and max ticket sizes of `5M` to `50M VND`

### Repayment

- Use a dynamic deduction rate as a percentage of future revenue
- Estimate payoff horizon under current revenue run rate
- Flag cases where seasonality would push payoff beyond policy tolerance

## Future Production Components

- Merchant connector service for marketplaces and e-wallets
- Feature store for revenue and transaction behavior
- Scoring and policy service
- Loan origination workflow
- Revenue-sharing collection and reconciliation engine
- Compliance and suspicious-pattern monitoring
