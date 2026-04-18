# SB10 API Documentation

## Overview

SB10 exposes REST APIs for branch traffic prediction. Currently using mock data until Qwen API key is available.

---

## Base URL

```
Development: http://localhost:3000
Production:  TBD
```

---

## Endpoints

### 1. Get All Branches

Get list of all branches with current status.

**Request**
```http
GET /api/branches
```

**Response**
```json
{
  "branches": [
    {
      "id": "bn-001",
      "name": "Chi nhánh Quận Tân Bình",
      "address": "135 Nguyễn Thái Học, P.4, Q.Tân Bình",
      "district": "TanBinh",
      "openTime": "08:00",
      "closeTime": "17:00",
      "staffCount": 8,
      "services": ["Tiền gửi", "Tín dụng", "Thẻ", "Chuyển tiền"],
      "status": "open",
      "currentWaitTime": 12,
      "congestionLevel": "low"
    }
  ]
}
```

---

### 2. Get Branch Detail

Get detailed information about a specific branch.

**Request**
```http
GET /api/branches/{branchId}
```

**Parameters**
| Parameter | Type | Description |
|-----------|------|-------------|
| branchId | string | Branch ID (e.g., "bn-001") |

**Response**
```json
{
  "branch": {
    "id": "bn-001",
    "name": "Chi nhánh Quận Tân Bình",
    ...
  },
  "trafficHistory": [
    {
      "date": "2026-04-01",
      "hour": 9,
      "customerCount": 8,
      "avgWaitTime": 10
    }
  ]
}
```

---

### 3. Get Traffic Prediction (Qwen API)

Get hourly traffic prediction for a branch.

**Request**
```http
POST /api/predict/{branchId}
```

**Request Body**
```json
{
  "targetDate": "2026-04-14",
  "currentCheckIns": 0
}
```

**Response**
```json
{
  "branchId": "bn-001",
  "date": "2026-04-14",
  "hourly": [
    {
      "hour": 8,
      "predictedCustomers": 5,
      "predictedWaitTime": 8,
      "congestionLevel": "low"
    },
    {
      "hour": 11,
      "predictedCustomers": 25,
      "predictedWaitTime": 35,
      "congestionLevel": "high"
    }
  ],
  "bestTimeToVisit": "9:00 AM or 3:00 PM",
  "summary": "Weekday traffic - Peak expected at 11:00-13:00"
}
```

---

### 4. Customer Check-In (Future)

Register a customer check-in at a branch.

**Request**
```http
POST /api/checkin
```

**Request Body**
```json
{
  "branchId": "bn-001",
  "customerName": "Nguyễn Văn An",
  "serviceType": "Tiền gửi"
}
```

**Response**
```json
{
  "checkInId": "ci-123456",
  "estimatedWaitTime": 12,
  "positionInQueue": 3,
  "status": "waiting"
}
```

---

### 5. Get Real-time Queue (Future)

Get current queue status for a branch.

**Request**
```http
GET /api/queue/{branchId}
```

**Response**
```json
{
  "branchId": "bn-001",
  "waiting": 5,
  "serving": 1,
  "averageWaitTime": 15,
  "estimatedTimeForNew": 18
}
```

---

## Error Responses

All endpoints may return these error codes:

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request |
| 404 | Not Found |
| 500 | Internal Server Error |

**Error Response Format**
```json
{
  "error": {
    "code": "BRANCH_NOT_FOUND",
    "message": "Branch with ID 'bn-999' not found"
  }
}
```

---

## Rate Limiting (Future)

| Endpoint | Limit |
|----------|-------|
| GET /branches | 100 req/min |
| POST /predict | 20 req/min |
| POST /checkin | 10 req/min |

---

## Qwen API Integration

### Alibaba Cloud DashScope

**Endpoint:** `https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/text-generation/generation`

**Headers:**
```http
Authorization: Bearer {QWEN_API_KEY}
Content-Type: application/json
```

**Request Body:**
```json
{
  "model": "qwen-plus",
  "input": {
    "messages": [
      {
        "role": "system",
        "content": "You are a bank branch traffic analyst..."
      },
      {
        "role": "user",
        "content": "{prediction_prompt}"
      }
    ]
  },
  "parameters": {
    "result_format": "message",
    "max_tokens": 2000
  }
}
```

**Models:**
- `qwen-plus` - Balanced (recommended)
- `qwen-max` - Highest accuracy
- `qwen-turbo` - Fastest

---

## Webhooks (Future)

| Event | Description |
|-------|-------------|
| `checkin.created` | New customer check-in |
| `prediction.updated` | Prediction updated due to check-in |
| `queue.threshold` | Queue exceeds threshold |

---

## Testing

### Mock Data
All endpoints return mock data by default. No API key required for development.

### Example cURL

```bash
# Get all branches
curl http://localhost:3000/api/branches

# Get prediction
curl -X POST http://localhost:3000/api/predict/bn-001 \
  -H "Content-Type: application/json" \
  -d '{"targetDate":"2026-04-14"}'
```

---

## SDK Usage

### JavaScript/TypeScript
```typescript
import { predictTraffic } from '@/lib/qwen';

const prediction = await predictTraffic({
  branchId: "bn-001",
  branchName: "Chi nhánh Quận Tân Bình",
  district: "TanBinh",
  history: trafficData,
  targetDate: "2026-04-14"
});

console.log(prediction.bestTimeToVisit);
```

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 0.1.0 | 2026-04-13 | Initial PoC with mock data |
