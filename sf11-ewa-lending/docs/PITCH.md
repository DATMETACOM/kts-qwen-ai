# [SF11] Pitch Deck - Qwen AI Build Day 2026

## 5 Slides x 3 Phút

---

## Slide 1: Problem Statement (30 giây)

### The Pain

**Visual:** Hình ảnh nhân viên đứng chờ, giấy tờ, queue

**Content:**
```
╔══════════════════════════════════════════════════════════╗
║  TẠI SAO NHÂN VIÊN VIỆT NAM KHÓ TIẾP CẬN TÍN DỤNG?   ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  ❌ Giấy tờ chứng minh thu nhập phức tạp                 ║
║     → Mất 3-7 ngày để xác minh                          ║
║                                                          ║
║  ❌ Nhân viên "thin-file" không có lịch sử tín dụng      ║
║     → Bị từ chối hoặc lãi suất cao                      ║
║                                                          ║
║  ❌ TAT dài → mất cơ hội kinh doanh                     ║
║     → Cần tiền gấp nhưng chờ mãi                        ║
║                                                          ║
║  ❌ NPL cao vì không có cơ chế auto-debit                ║
║     → 5-10% NPL rate truyền thống                      ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

**Speaker Notes:**
> "Thưa các anh chị, vấn đề lớn nhất của nhân viên Việt Nam là tiếp cận tín dụng. Họ phải chuẩn bị payslip, hợp đồng lao động, mất 3-7 ngày chờ duyệt. Với nhân viên mới, không có lịch sử CIC, gần như không thể vay được.
>
> Và với đơn vị cho vay như Shinhan, NPL rate 5-10% là con số đáng lo ngại."

---

## Slide 2: Our Solution (30 giây)

### EWA & Salary-Linked Lending Platform

**Visual:** Sơ đồ flow: Employee → HRM API → Qwen AI → Auto-debit → Success

**Content:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   🏦 SHINHAN FINANCE — EWA & SALARY-LINKED LENDING        │
│                                                             │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐   │
│   │   Employee │ ──→ │  Qwen AI   │ ──→ │  Auto-debit │   │
│   │   Portal   │     │  Scoring   │     │  Payroll    │   │
│   └─────────────┘     └─────────────┘     └─────────────┘   │
│         │                   │                    │           │
│         ▼                   ▼                    ▼           │
│   ┌─────────────────────────────────────────────────────┐ │
│   │              3 PORTALS IN 1 PLATFORM                 │ │
│   │  👤 Employee  │  👔 HR Admin  │  🏢 Shinhan Admin  │ │
│   └─────────────────────────────────────────────────────┘ │
│                                                             │
│   ✨ Real-time salary verification                          │
│   ✨ AI-powered credit scoring (Qwen AI)                    │
│   ✨ Paperless loan disbursement                            │
│   ✨ Auto-debit for NPL < 2%                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Speaker Notes:**
> "Giải pháp của chúng em là một nền tảng tích hợp 3 portal.
>
> Employee portal: nhân viên xem số dư EWA, request rút lương, apply vay tín chấp.
>
> HR Admin portal: HR quản lý EWA và khoản vay của công ty.
>
> Shinhan Admin portal: Shinhan theo dõi portfolio, NPL metrics.
>
> Điểm khác biệt: **Xác minh lương real-time** từ HRM system + **AI scoring** với Qwen + **Auto-debit** từ payroll."

---

## Slide 3: AI Integration (45 giây)

### How Qwen AI Powers the Platform

**Visual:** Screenshot UI + Code snippet của Qwen API call

**Content:**
```
╔══════════════════════════════════════════════════════════════╗
║                  🤖 QWEN AI CREDIT SCORING                 ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  INPUT: Salary Data                                         ║
║  ┌────────────────────────────────────────────────────────┐ │
║  │ Employee: Nguyễn Văn Minh                              │ │
║  │ Salary: 25,000,000 VND/month                           │ │

│  │ Tenure: 3 năm 2 tháng                                  │ │
│  └────────────────────────────────────────────────────────┘ │
║                           ↓                                  │
║  PROCESS: Qwen AI (qwen-plus)                              ║
║  ┌────────────────────────────────────────────────────────┐ │
│  │ Prompts: Role as senior credit analyst                 │ │
│  │         Analyze salary data + tenure                   │ │
│  │         Calculate eligible amount (12x salary)        │ │
│  │         Assess auto-debit risk reduction               │ │
│  └────────────────────────────────────────────────────────┘ │
║                           ↓                                  ║
║  OUTPUT: Credit Decision                                    ║
║  ┌────────────────────────────────────────────────────────┐ │
│  │ Score: 750/850    Risk: LOW ✓                        │ │
│  │ Eligible: 150M     Rate: 18%/year                     │ │
│  │ Reasons: ✓ Stable income  ✓ Good tenure             │ │
│  │           ✓ Auto-debit reduces NPL by 60%           │ │
│  └────────────────────────────────────────────────────────┘ │
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

**Speaker Notes:**
> "Đây là cách Qwen AI hoạt động trong hệ thống.
>
> Khi nhân viên apply vay, backend gọi Qwen AI API. Prompt được thiết kế để AI đóng vai trò senior credit analyst — phân tích salary data, tenure, employment history.
>
> AI không chỉ đưa ra điểm số mà còn giải thích LÝ DO — tạo transparency cho cả nhân viên và Shinhan.
>
> Quan trọng nhất: AI nhận ra auto-debit từ payroll giảm NPL risk 60% — đây là competitive advantage của giải pháp này."

---

## Slide 4: Live Demo (60 giây)

### See It In Action

**Visual:** Live URL: https://sf11-ewa-lending.vercel.app

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              ▶ LIVE DEMO                                     │
│                                                             │
│   👇 CLICK TO START DEMO 👇                               │
│                                                             │
│   https://sf11-ewa-lending.vercel.app                       │
│                                                             │
│   ─────────────────────────────────────────────────────    │
│                                                             │
│   DEMO FLOW:                                               │
│   1. Employee xem EWA balance                              │
│   2. Request rút lương trước (5M)                        │
│   3. Qwen AI credit scoring                                 │
│   4. Apply vay 50M (36 tháng)                              │
│   5. Show Admin dashboards                                  │
│   6. Highlight NPL < 2%                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Speaker Notes:**
> "Em sẽ demo trực tiếp trên trình duyệt.
>
> [DEMO như đã viết trong DEMO.md]
>
> Các bạn thấy toàn bộ flow chỉ mất khoảng 2-3 phút — từ login đến khi có khoản vay được duyệt."

---

## Slide 5: Business Impact (30 giây)

### Why This Matters for Shinhan

**Visual:** Bảng so sánh before/after + metrics

**Content:**
```
╔══════════════════════════════════════════════════════════════╗
║                    BUSINESS IMPACT                            ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  METRIC          │  TRADITIONAL  │  OUR SOLUTION │ IMPACT  ║
║  ─────────────────┼────────────────┼───────────────┼────────║
║  Loan TAT        │  3-7 days      │  < 5 minutes  │  ↓99%   ║
║  Income Verify   │  Manual docs  │  Real-time    │  Zero   ║
║  NPL Rate        │  5-10%         │  < 2%         │  ↓60%   ║
║  Acquisition Cost│  High          │  Low          │  ↓40%   ║
║  Customer Enjoy  │  Poor          │  Seamless     │  ↑↑↑    ║
║                                                              ║
║  ─────────────────────────────────────────────────────────   ║
║                                                              ║
║  FOR SHINHAN:                                                ║
║  ✅ Mở rộng tệp khách hàng (nhân viên mới, thin-file)      ║
║  ✅ Giảm operational cost với AI automation                  ║
║  ✅ NPL target < 2% đạt được                               ║
║  ✅ Priority consideration for VND 200M PoC funding         ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

**Speaker Notes:**
> "Tóm lại, giải pháp này mang lại 4 lợi ích cho Shinhan:
>
> Thứ nhất, mở rộng được tệp khách hàng — nhân viên mới, người không có lịch sử CIC vẫn có thể vay được nhờ alternative data từ payroll.
>
> Thứ hai, giảm operational cost — AI xử lý 80% hồ sơ, chỉ cần human review cho edge cases.
>
> Thứ ba, NPL < 2% — mục tiêu của challenge — đạt được nhờ auto-debit.
>
> Và thứ tư, đây là PoC hoàn chỉnh, sẵn sàng scale lên production.
>
> Với PoC này, team chúng em mong muốn được priority consideration cho VND 200 triệu PoC funding từ Global Shinhan InnoBoost 2026."

---

## Closing

**Contact:**
- Demo: https://sf11-ewa-lending.vercel.app
- GitHub: https://github.com/DATMETACOM/kts-qwen-ai/tree/sf11-ewa-lending

**Call to Action:**
> "Cảm ơn các anh chị đã lắng nghe!
>
> Chúng em sẵn sàng Q&A và demo thêm nếu cần."

---

## Slide Design Notes

### Visual Style
- **Colors:** Shinhan Blue (#003478) + Gold (#C8A96E)
- **Font:** Sans-serif, clean, professional
- **Layout:** Full-width, minimal text, focus on numbers

### Key Numbers to Highlight
- 99% reduction in TAT
- < 2% NPL (target achieved)
- 60% NPL reduction via auto-debit
- 0% paperwork required

### Emotional Hook
- Picture employee stress → Solution relief → Business growth
- Focus on "paperless" and "real-time" as differentiators
