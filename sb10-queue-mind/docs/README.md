# SB10 - Branch Traffic Prediction & Smart Queue Management

> **Qwen AI Build Day 2026 - Shinhan Bank InnoBoost PoC**

---

## 📋 Overview

**Use Case:** SB10 - AI-Powered Branch Traffic Prediction & Smart Queue Management

**Problem:** Customers don't know wait times in advance, leading to:
- Long wait times (average 20-30 minutes)
- Peak hour congestion (11am-1pm)
- Poor staff allocation

**Solution:** AI-powered branch traffic prediction system using Qwen AI

---

## 🎯 Features

| Feature | Description |
|---------|-------------|
| **Dashboard** | Display 5 branches with real-time status |
| **Hourly Forecast** | Predict customer count and wait time by hour |
| **Best Time to Visit** | Recommend optimal visit times |
| **Congestion Levels** | Color-coded: 🟢 Low / 🟡 Medium / 🔴 High |
| **Branch Detail** | Individual branch view with forecast charts |

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development
npm run dev

# Open browser
open http://localhost:3000
```

---

## 📁 Project Structure

```
sb10-queue-mind/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── branches/[id]/
│   │       └── page.tsx
│   ├── components/
│   └── lib/
├── lib/
│   ├── data.ts
│   ├── qwen.ts
│   ├── queue.ts
│   └── date.ts
├── types/
│   └── index.ts
├── tests/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.mjs
```

---

## 🗄️ Data Structure

### Branch
```typescript
interface Branch {
  id: string;
  name: string;
  address: string;
  district: string;
  openTime: string;
  closeTime: string;
  staffCount: number;
  services: string[];
  status: "open" | "closed";
  currentWaitTime?: number;
  congestionLevel?: "low" | "medium" | "high";
}
```

### Hourly Forecast
```typescript
interface HourlyForecast {
  hour: number; // 8-17
  predictedCustomers: number;
  predictedWaitTime: number; // minutes
  congestionLevel: "low" | "medium" | "high";
}
```

### Traffic Record
```typescript
interface TrafficRecord {
  id: string;
  branchId: string;
  date: string; // YYYY-MM-DD
  hour: number; // 0-23
  dayOfWeek: number; // 0-6
  customerCount: number;
  avgWaitTime: number; // minutes
  serviceTypes: string[];
  staffOnDuty: number;
}
```

---

## 🤖 Qwen API Integration

### Environment Setup
```bash
# .env.local
QWEN_API_KEY=your-qwen-api-key-here
```

### Prompt Template
```
You are a bank branch traffic analyst. Analyze this data:

Branch: {branch_name}
Location: {district}
History: {historical_data}
Target date: {target_date}

Predict for {target_date} (hours 8:00-16:00):
- Hourly customer count
- Average wait time per hour
- Congestion level (low/medium/high)

Return JSON format only.
```

### API Call
```typescript
import { predictTraffic } from '@/lib/qwen';

const prediction = await predictTraffic({
  branchId: "bn-001",
  branchName: "Tan Binh Branch",
  district: "TanBinh",
  history: trafficData,
  targetDate: "2026-04-14"
});

// Response
{
  hourly: [
    { hour: 9, customers: 5, waitTime: 8, level: "low" },
    { hour: 11, customers: 25, waitTime: 35, level: "high" },
    ...
  ],
  bestTimeToVisit: "9:00 AM or 3:00 PM"
}
```

---

## 📊 Mock Data

**5 Branches in HCMC:**
1. Tan Binh Branch
2. District 1 Branch
3. District 3 Branch
4. Binh Thanh Branch
5. Go Vap Branch

**30 days history** (~3,600 records)

---

## 🎨 Demo Flow

### Scenario 1: Customer Finds Best Time
1. Open dashboard → Select "Tan Binh Branch"
2. View forecast → 11am RED (high), 9am GREEN (low)
3. System recommends: "Visit at 9am or 3pm"

### Scenario 2: Real-time Update
1. 5 customers check-in unexpectedly
2. Prediction updates: 10 minutes → 25 minutes
3. Notification sent to waiting customers

### Scenario 3: Manager Optimization
1. Manager views next-day forecast
2. System recommends: "Add 2 staff during 11am-1pm"
3. Adjust roster → Reduce wait time by 40%

---

## 🔧 Configuration

### Environment Variables
```bash
# Alibaba Cloud Qwen API
QWEN_API_KEY=your-api-key-here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Qwen Models
- **qwen-plus** - Balanced performance (recommended)
- **qwen-max** - Highest accuracy (slower)
- **qwen-turbo** - Fastest (lower accuracy)

---

## 📈 Expected Outcomes

| Metric | Before | After (Expected) |
|--------|--------|-------------------|
| Avg wait time | 20-30 min | 10-15 min |
| Peak hour utilization | 80% | 60% |
| Customer satisfaction | NPS 30 | NPS 60 |
| Staff efficiency | Manual | AI-optimized |

---

## 🚦 Roadmap

### Phase 1: PoC (Current) ✅
- [x] Mock data generator
- [x] Dashboard UI
- [x] Forecast visualization
- [ ] Qwen API integration (Pending API key)

### Phase 2: Enhancement
- [ ] Real-time check-in system
- [ ] WebSocket updates
- [ ] Admin/Manager view
- [ ] Notification system

### Phase 3: Production
- [ ] Real database (PostgreSQL)
- [ ] Authentication
- [ ] API rate limiting
- [ ] Monitoring & logging

---

## 🔗 Links

- **GitHub:** https://github.com/DATMETACOM/kts-qwen-ai
- **InnoBoost:** https://innoboost.shinhan.com
- **Devpost:** https://qwen-ai-build-day.devpost.com
- **Qwen Docs:** https://qwen.readthedocs.io/

---

## 👥 Team

- **Track:** Financial Services (Shinhan Bank)
- **Use Case:** SB10 - Branch Traffic Prediction
- **Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Qwen AI

---

## 📝 License

PoC for Shinhan InnoBoost 2026 - Internal use only

---

**Built with ❤️ for Qwen AI Build Day 2026**