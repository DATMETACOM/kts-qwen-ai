#!/bin/bash

echo "=== Adding SB10 Documentation ==="

cd "$(dirname "$0")"

# Add all files
git add .

# Commit
git commit -m "docs: Add comprehensive documentation for SB10

- README.md: Complete overview, features, quick start, data structure
- ARCHITECTURE.md: System architecture, component structure, data flow
- API.md: API endpoints, request/response formats, Qwen integration
- DEMO.md: Demo script, Q&A preparation, troubleshooting

📚 Docs ready for review"

echo "✅ Docs committed! Push with:"
echo "   git push"
