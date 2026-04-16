#!/bin/bash

echo "=== Fix: Remove secret from git history ==="

cd "$(dirname "$0")"

# Remove file with secret
rm -f setup-git.sh commit.sh

# Remove from git cache
git rm --cached setup-git.sh commit.sh 2>/dev/null || true

# Amend the commit to remove secret
git commit --amend -m "feat: Add SB10 Branch Traffic Prediction PoC

- Next.js 14 + TypeScript + Tailwind CSS
- Dashboard with 5 branches display
- Branch detail page with hourly forecast
- Mock data generator (5 branches, 30 days history)
- Congestion level visualization (low/medium/high)
- Best time to visit recommendation

Demo: http://localhost:3000"

echo "✅ Secret removed! Now push:"
echo "   git push -f origin master"
