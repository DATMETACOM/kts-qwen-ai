# SB10 - Branch Traffic Prediction & Smart Queue Management

> **Qwen AI Build Day 2026 - Shinhan Bank InnoBoost PoC**

---

## 📋 Overview

**Use Case:** SB10 - AI-Powered Branch Traffic Prediction & Smart Queue Management

**Problem:** Khách hàng đến chi nhánh không biết trước thời gian chờ, dẫn đến:
- Đợi lâu (trung bình 20-30 phút)
- Khung giờ đông đúc (11am-1pm)
- Không tối ưu nhân sự

**Solution:** Hệ thống dự đoán lưu lượng chi nhánh bằng Qwen AI

---

## 🎯 Features

| Feature | Description |
|---------|-------------|
| **Dashboard** | Hiển thị 5 chi nhánh với trạng thái real-time |
| **Hourly Forecast** | Dự báo khách hàng và thời gian chờ theo giờ |
| **Best Time to Visit** | Khuyến nghị giờ vàng đến chi nhánh |
| **Congestion Levels** | Màu sắc: 🟢 Thấp / 🟡 Trung bình / 🔴 Cao |
| **Branch Detail** | Chi tiết từng chi nhánh với đồ thị forecast |

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
sb10-branch-prediction/
├── src/
│   ├── app/
│   │   ├── globals.css          # Global styles
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Dashboard (branch list)
│   │   └── branches/[id]/
│   │       └── page.tsx          # Branch detail + forecast
│   └── lib/
│       ├── data.ts               # Mock data generator
│       └── qwen.ts               # Qwen API client (TBD)
├── types/
│   └── index.ts                  # TypeScript interfaces
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
  hour: number;                    // 8-17
  predictedCustomers: number;
  predictedWaitTime: number;       // minutes
  congestionLevel: "low" | "medium" | "high";
}
```

### Traffic Record
```typescript
interface TrafficRecord {
  id: string;
  branchId: string;
  date: string;                    // YYYY-MM-DD
  hour: number;                    // 0-23
  dayOfWeek: number;               // 0-6
  customerCount: number;
  avgWaitTime: number;             // minutes
  serviceTypes: string[];
  staffOnDuty: number;
}
```

---

## 🤖 Qwen API Integration (Pending)

### Environment Setup
```env
# .env.local
QWEN_API_KEY=your-api-key-here
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
  branchName: "Chi nhánh Quận Tân Bình",
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
1. Chi nhánh Quận Tân Bình
2. Chi nhánh Quận 1
3. Chi nhánh Quận 3
4. Chi nhánh Bình Thạnh
5. Chi nhánh Gò Vấp

**30 days history** (~3,600 records)

---

## 🎨 Demo Flow

### Scenario 1: Customer Finds Best Time
1. Mở dashboard → Chọn "Chi nhánh Quận Tân Bình"
2. Xem forecast → 11am đỏ (cao), 9am xanh (thấp)
3. Hệ thống khuyến nghị: "Đến 9am hoặc 3pm"

### Scenario 2: Real-time Update
1. 5 khách check-in bất ngờ
2. Prediction cập nhật: 10 phút → 25 phút
3. Thông báo cho khách đang chờ

### Scenario 3: Manager Optimization
1. Manager xem forecast ngày mai
2. Hệ thống khuyến nghị: "Thêm 2 nhân viên 11am-1pm"
3. Điều chỉnh roster → Giảm wait time 40%

---

## 🔧 Configuration

### Environment Variables
```env
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
- [ ] Qwen API integration (Pending key)

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
