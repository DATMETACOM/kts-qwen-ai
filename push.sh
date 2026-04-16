#!/bin/bash

echo "=== SB10: Commit & Push to GitHub ==="
echo ""

cd "$(dirname "$0")"

# Show current branch
echo "📍 Current directory: $(pwd)"
echo ""

# Check git status
echo "📋 Git status:"
git status --short
echo ""

# Add all changes
echo "➕ Adding all changes..."
git add .
echo ""

# Commit
echo "✅ Committing..."
git commit -m "docs: Add comprehensive documentation for SB10

📚 Documentation:
- README.md: Complete overview, features, quick start, data structure
- ARCHITECTURE.md: System architecture, component structure, data flow
- API.md: API endpoints, request/response formats, Qwen integration
- DEMO.md: Demo script, Q&A preparation, troubleshooting

🎯 Features:
- Next.js 14 + TypeScript + Tailwind CSS
- Dashboard with 5 branches display
- Branch detail page with hourly forecast
- Congestion level visualization (low/medium/high)
- Best time to visit recommendation

📊 Demo Data:
- 5 branches in HCMC
- 30 days history (~3,600 records)
- Hourly traffic patterns

🤖 Tech: Qwen AI for prediction (pending API key)"
echo ""

# Check if commit succeeded
if [ $? -eq 0 ]; then
    echo "✅ Commit successful!"
    echo ""
    echo "🚀 Pushing to GitHub..."
    git push

    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Successfully pushed to GitHub!"
        echo "🔗 https://github.com/DATMETACOM/kts-qwen-ai"
    else
        echo ""
        echo "❌ Push failed. Try: git push"
    fi
else
    echo "ℹ️  Nothing to commit or commit failed"
    echo "   Try: git status"
fi
