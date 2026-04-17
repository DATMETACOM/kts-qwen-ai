# [SF11] Earned Wage Access & Salary-Linked Lending

> **Shinhan Finance Vietnam x Qwen AI Build Day 2026**

Partner with fintech to verify employee salary real-time from corporate HRM/Payroll systems, enabling paperless salary loan disbursement and Earned Wage Access (EWA) without traditional income documentation.

## Features

### Employee Portal
- **Earned Wage Balance** — Xem số dư lương đã kiếm real-time
- **EWA Withdrawal** — Rút lương trước payday (tối đa 50%, phí 3%)
- **Salary-Linked Loan** — Vay tín chấp paperless, AI credit scoring
- **Loan Tracking** — Theo dõi khoản vay & lịch trả góp

### HR Admin Portal
- **Employee Management** — Quản lý danh sách nhân viên
- **EWA/Loan Portfolio** — Tổng hợp EWA & vay của công ty
- **Deduction Reports** — Báo cáo khấu trừ lương

### Shinhan Admin Portal
- **Portfolio Metrics** — Tổng quan danh mục cho vay
- **NPL Tracking** — Theo dõi NPL (mục tiêu <2%)
- **AI Engine Stats** — Thống kê Qwen AI processing
- **Disbursement Records** — Lịch sử giải ngân

## Shinhan Products

| Product | Details |
|---------|---------|
| Vay tín chấp cá nhân | Lãi suất từ 18%/năm, hạn mức đến 300 triệu, trả góp đến 48 tháng |
| Thẻ tín dụng THE FIRST | Rút tiền 100% hạn mức, miễn lãi 45 ngày, tích điểm 0.5% |

## Tech Stack

- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **AI:** Qwen AI (qwen-plus) via Alibaba Cloud DashScope
- **Data:** Mock data for PoC demonstration

## Quick Start

```bash
cd sf11-ewa-lending
npm install
npm run dev
# Open http://localhost:3000
```

## Demo Flow

1. **Employee** → Xem balance → Request EWA → Confirm withdrawal
2. **Employee** → Apply loan → AI scoring → View offer → Accept
3. **HR Admin** → View employee list → EWA/Loan portfolio
4. **Shinhan Admin** → Portfolio metrics → NPL tracking → AI stats

## Architecture

```
Employee → EWA/Loan Portal → Qwen AI (OCR + Scoring) → Mock HRM/Payroll
                                    ↓
HR Admin → Management Portal    Shinhan Admin → Portfolio Dashboard
```

## Challenge

[SF11] Earned Wage Access & Salary-Linked Lending — From Idea Contest
- Real-time payroll verification, eliminating manual income proof
- Shorter loan TAT & lower acquisition cost
- NPL target <2% via auto-debit from payroll

---

Built for Qwen AI Build Day 2026 | InnoBoost 2026
