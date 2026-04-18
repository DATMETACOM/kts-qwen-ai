# SF8 - AI-based Customer Behavior Prediction

## Pitch Summary

### Problem
Thin-file customers (no credit history) are difficult to assess:
- Manual income verification takes days
- High NPL from poor targeting
- Can't serve new customer segments

### Solution
Alternative data scoring using Qwen AI:
- Data sources: telco, e-wallet, e-commerce, social
- Personalized offer recommendations
- 4-layer privacy pipeline (mask → Qwen → unmask → UI)
- Confidence scoring with behavioral insights

### Technology
- **Frontend:** React + Vite
- **Backend:** Node.js API + Python FastAPI
- **Language:** TypeScript
- **AI:** Qwen-Plus via Alibaba Cloud DashScope

### Key Metrics
| Metric | Before | After |
|--------|--------|-------|
| Processing time | Days | Minutes |
| NPL | 5-10% | < 3% |
| New customers | Limited | +40% |

### Demo
- Customer pipeline with 20 profiles
- Alternative data visualization
- AI-generated sales scripts

### API Endpoints
- `/api/customers` - Customer list
- `/api/qwen-enhance` - AI enhancement
- `/api/analyze` - Behavioral analysis
- `/api/copilot` - AI copilot

### Tests
- 14 tests passing (scoring, copilot, data)

### Files
- `/docs/sf8-pitch.md` - This file
- `/sf8-cuca-insider-ai/` - Project code
- `/sf8-cuca-insider-ai/docs/` - Full documentation