# SF12 MicroBiz Loan Test Cases

## Alternative Scoring

1. High-growth, low-volatility sellers should land in the low-risk band.
2. High-refund, high-dispute sellers should move to review or decline.
3. Stale channel freshness should reduce approval confidence.

## Offer and Repayment

1. Recommended loan amount must stay within `5M` to `50M VND`.
2. Lower seasonality assumptions should reduce stressed revenue and can extend projected tenor.
3. Lower revenue-share cap should reduce monthly collection amount.

## Strategy Presets

1. `Growth mode` should relax policy relative to `Conservative mode`.
2. Clicking a preset should update sliders and portfolio results consistently.
3. Reset should return to the balanced baseline.

## Queue and Detail

1. Channel and decision filters should narrow the seller queue correctly.
2. Empty queue states should render safely.
3. Selected seller detail should refresh memo, risk flags, and waterfall plan.

## UI

1. Scenario controls, preset cards, and repayment rows should remain readable on mobile.
2. Waterfall plan should show at least one month and should stop when remaining balance reaches zero.
