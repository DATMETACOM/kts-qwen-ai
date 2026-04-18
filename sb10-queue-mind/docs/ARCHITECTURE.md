# SB10 Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  Dashboard  │  │ Branch List │  │Branch Detail│            │
│  │   (page.tsx) │  │  (page.tsx) │  │(branches/[id])│            │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘            │
│         │                │                │                     │
└─────────┼────────────────┼────────────────┼─────────────────────┘
          │                │                │
          ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│                          DATA LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Mock Data Generator                    │   │
│  │  - 5 branches (HCMC)                                     │   │
│  │  - 30 days history (~3,600 records)                     │   │
│  │  - Hourly traffic patterns                                │   │
│  └───────────────────────────┬──────────────────────────────┘   │
│                              │                                   │
│  ┌───────────────────────────▼──────────────────────────────┐   │
│  │                   TypeScript Interfaces                   │   │
│  │  - Branch, TrafficRecord, CheckIn, Prediction         │   │
│  └───────────────────────────┬──────────────────────────────┘   │
└──────────────────────────────┼───────────────────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   Qwen API Layer   │ (TBD - Pending Key)
                    │  - Prompt Template │
                    │  - API Call         │
                    │  - Response Parser  │
                    └─────────────────────┘
```

---

## Component Architecture

```
src/
├── app/
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx                # Dashboard (branch list)
│   │   ├── BranchCard          # (inline) Branch info card
│   │   └── BranchGrid          # (inline) Grid layout
│   └── branches/[id]/
│       └── page.tsx            # Branch detail page
│           ├── BranchInfo       # (inline) Branch info header
│           ├── BestTimeBadge    # (inline) Best time recommendation
│           ├── ForecastChart    # (inline) Hourly forecast bar chart
│           └── CheckInButton    # (inline) Check-in simulation
│
└── lib/
    ├── data.ts                 # Mock data & generators
    │   ├── BRANCHES             # 5 branch objects
    │   ├── generateTrafficData() # Generate 30 days history
    │   ├── getBranchTraffic()   # Get branch history
    │   └── SIMULATED_CHECK_INS  # Real-time check-ins
    │
    └── qwen.ts                 # Qwen API client (TBD)
        ├── predictTraffic()     # Main prediction function
        ├── buildPredictionPrompt()
        ├── parsePredictionResponse()
        └── mockPrediction()     # Fallback when API unavailable
```

---

## Data Flow

### Dashboard Flow
```
User → Dashboard (/)
       ↓
   Fetch BRANCHES
       ↓
   Display Branch Cards
```

### Branch Detail Flow
```
User → Click Branch → /branches/[id]
                       ↓
              Fetch branch by ID
                       ↓
              Generate hourly forecast (mock)
                       ↓
              Display: Info + Best Time + Forecast Chart
```

### Prediction Flow (with Qwen API - TBD)
```
User → Select Branch + Date
       ↓
   Fetch traffic history (last 7-30 days)
       ↓
   Call Qwen API with prompt
       ↓
   Parse JSON response
       ↓
   Display hourly forecast
```

---

## State Management

**Current:** No state management (React Server Components)

**Future (Enhancement):**
- React Context for global state
- Zustand/Jotai for client state
- SWR/React Query for API caching

---

## Styling Architecture

```
Tailwind CSS (utility-first)
├── globals.css             # Global styles + CSS variables
├── Tailwind config         # Theme customization
└── Inline utility classes  # Component styling
```

**Color Scheme:**
- Primary: Blue-900 (header)
- Success: Green-500 (low congestion)
- Warning: Yellow-500 (medium congestion)
- Danger: Red-500 (high congestion)

---

## API Routes (Future)

```
/api/
├── predict/
│   └── [branchId]/
│       └── route.ts         # POST: Get prediction for branch
├── checkin/
│   └── route.ts             # POST: Customer check-in
└── branches/
    └── route.ts             # GET: All branches
```

---

## File Naming Conventions

- **Pages:** `page.tsx` (Next.js App Router)
- **Components:** `kebab-case.tsx` (e.g., `forecast-chart.tsx`)
- **Utilities:** `kebab-case.ts` (e.g., `qwen-client.ts`)
- **Types:** `index.ts` (barrel exports)
- **Constants:** `UPPER_CASE.ts` (e.g., `BRANCHES.ts`)

---

## Performance Considerations

| Area | Current | Optimization |
|------|---------|--------------|
| Data Fetching | Static | React Cache / SWR |
| Re-renders | Server Components | Client Components where needed |
| Bundle Size | Minimal | Code splitting by route |
| API Calls | Mock only | Debounce / Rate limiting |

---

## Security Considerations

| Concern | Status | Notes |
|----------|--------|-------|
| API Key | Pending | Store in .env.local (gitignored) |
| Data Validation | Mock only | Add Zod validation for production |
| Authentication | None | Add for production |
| Rate Limiting | None | Add for Qwen API calls |

---

## Deployment

### Development
```bash
npm run dev  # http://localhost:3000
```

### Production
```bash
npm run build
npm start
```

### Vercel (Recommended)
```bash
vercel deploy
```

---

## Monitoring & Logging (Future)

- **Error Tracking:** Sentry
- **Analytics:** Vercel Analytics
- **Logging:** Pino / Winston
- **APM:** New Relic / DataDog
