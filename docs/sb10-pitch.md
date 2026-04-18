# SB10 - Branch Traffic Prediction & Smart Queue Management

## Pitch Summary

### Problem
Customers don't know wait times in advance, leading to:
- Long wait times (average 20-30 minutes)
- Peak hour congestion (11am-1pm)
- Poor staff allocation

### Solution
AI-powered branch traffic prediction using Qwen AI:
- Hourly forecast (8am-5pm)
- Best Time to Visit recommendations
- Real-time queue management
- Staff optimization

### Technology
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI:** Qwen-Plus via Alibaba Cloud DashScope

### Key Metrics
| Metric | Before | After |
|--------|--------|-------|
| Avg wait time | 20-30 min | 10-15 min |
| Peak utilization | 80% | 60% |
| NPS | 30 | 60 |

### Demo
- Working dashboard with 5 branches
- Real-time forecast visualization
- Check-in simulation

### API Endpoints
- `/api/branches` - List all branches
- `/api/branches/[id]` - Branch detail
- `/api/predict/[id]` - Traffic prediction
- `/api/staff-opt/[id]` - Staff optimization
- `/api/checkin` - Queue check-in

### Tests
- 11 tests passing (data, queue, qwen)

### Files
- `/docs/sb10-pitch.md` - This file
- `/sb10-queue-mind/` - Project code
- `/sb10-queue-mind/docs/` - Full documentation