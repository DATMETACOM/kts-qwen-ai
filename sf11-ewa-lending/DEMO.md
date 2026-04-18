# [SF11] Demo Script - Qwen AI Build Day 2026

## Demo Overview

**Thời gian:** 3 phút
**Track:** Financial Services (Shinhan Future's Lab)
**Product:** EWA & Salary-Linked Lending Platform

---

## Pre-Demo Checklist

- [ ] Mở trình duyệt tại: https://sf11-ewa-lending.vercel.app
- [ ] Mở DevTools (F12) để show API calls
- [ ] Chuẩn bị giải thích về data flow
- [ ] Sẵn sàng show code Qwen integration

---

## Demo Flow (3 phút)

### Phút 1: Problem + Solution Overview (30 giây)

**Mở đầu:**
> "Xin chào! Em là [tên], đến từ team DAT Meta.
>
> Hôm nay em sẽ demo giải pháp **EWA & Salary-Linked Lending** — giúp nhân viên tiếp cận lương đã kiếm trước payday và vay tín chấp paperless với AI."

**Chuyển sang màn hình chính:**
> "Đây là hệ thống của chúng em. Các bạn thấy có 3 portal: Nhân viên, HR Admin, và Shinhan Admin."

---

### Phút 1-2: Employee Portal - EWA Demo (45 giây)

**Tab "Tổng quan":**
> "Đây là portal của nhân viên. Em thấy thông tin của anh Nguyễn Văn Minh — lương 25 triệu/tháng, thâm niên 3 năm 2 tháng.
>
> Hệ thống tự động tính **số dư EWA khả dụng** dựa trên tiến độ kỳ lương — hiện tại ngày 22/30, anh ấy đã kiếm được 18.75 triệu, có thể rút tối đa 9.3 triệu."

**Tab "Rút lương trước":**
> "Em click vào tab EWA. Anh ấy muốn rút 5 triệu. Hệ thống tự động tính phí 3% = 150,000 VND. Thực nhận: 4,850,000 VND."

**Click "Xác nhận rút lương":**
> "Em confirm. **API gọi đến backend**, xác minh eligibility, và giải ngân ngay lập tức.
>
> Các bạn thấy trong DevTools có API call đến `/api/ewa` — đây là real-time processing."

---

### Phút 2: AI Credit Scoring Demo (45 giây)

**Tab "Vay tín chấp":**
> "Ngoài EWA, nhân viên còn có thể vay tín chấp paperless. Điểm khác biệt là chúng em **tích hợp Qwen AI** để scoring."

**Click "Kiểm tra điểm tín dụng với Qwen AI":**
> "Em click vào đây. Backend gọi **Qwen AI API** để phân tích hồ sơ."

**Hiển thị kết quả:**
> "Qwen AI trả về điểm số **750/850** — xếp hạng rủi ro **THẤP**.
>
> AI đưa ra các lý do:
> - Thu nhập ổn định: 25M VND/tháng
> - Thâm niên tốt: 3 năm 2 tháng
> - Auto-debit từ payroll: Giảm 60% NPL risk"

**Nhập số tiền vay:**
> "Dựa trên credit score, hệ thống recommend hạn mức 150 triệu. Em chọn vay 50 triệu, 36 tháng.
>
> EMI ước tính: **1,750,000 VND/tháng** — chỉ chiếm 7% thu nhập, hoàn toàn trong khả năng."

**Submit:**
> "Em submit. Hệ thống **tự động duyệt** và giải ngân. Không cần giấy tờ, không cần chờ 3-7 ngày."

---

### Phút 2-3: Admin Dashboards (30 giây)

**Chuyển sang HR Admin:**
> "Đây là HR Admin portal — giúp HR quản lý EWA và khoản vay của nhân viên trong công ty.
>
> HR có thể xem tổng quan: 5 nhân viên, 3 EWA active, 2 khoản vay."

**Chuyển sang Shinhan Admin:**
> "Đây là Shinhan Admin portal — dashboard cho Shinhan Finance theo dõi portfolio.
>
> Quan trọng nhất: **NPL Rate hiện tại 1.4%** — thấp hơn mục tiêu 2% của challenge.
>
> Đây là kết quả của auto-debit từ payroll — hệ thống tự động trừ tiền vào payday, giảm đáng kể rủi ro không trả nợ."

---

### Phần kết (30 giây)

> "Tóm lại, giải pháp của chúng em giải quyết 3 pain points:
>
> 1. **Xác minh thu nhập real-time** — không cần payslip giấy
> 2. **Giảm TAT từ 3-7 ngày xuống còn vài phút** — nhờ AI
> 3. **NPL <2%** — nhờ auto-debit từ payroll
>
> Tech stack: **Next.js + Qwen AI (Alibaba Cloud)** — đúng yêu cầu của hackathon.
>
> Cảm ơn các anh chị! Em sẵn sàng trả lời câu hỏi."

---

## Q&A Preparation

### Câu hỏi thường gặp:

**Q: Tại sao NPL thấp?**
A: Auto-debit từ payroll — tiền được trừ tự động vào payday, không cần nhắc nhở.

**Q: AI scoring hoạt động thế nào?**
A: Qwen AI phân tích salary data + tenure + employment history → đưa ra credit score + risk assessment.

**Q: HRM integration thực tế?**
A: Hiện tại là mock API, nhưng architecture sẵn sàng kết nối HRM thật (SAP, Oracle, etc.).

**Q: Security?**
A: Auto-debit yêu cầu employee consent, data encrypted, AI không store PII.

---

## Demo Stats (for slides)

| Metric | Traditional | Our Solution |
|--------|-------------|--------------|
| Loan TAT | 3-7 days | < 5 minutes |
| Income verification | Manual payslip | Real-time HRM |
| NPL rate | 5-10% | < 2% |
| Paperwork | Required | Zero |

---

**Demo URL:** https://sf11-ewa-lending.vercel.app
**GitHub:** https://github.com/DATMETACOM/kts-qwen-ai/tree/sf11-ewa-lending
