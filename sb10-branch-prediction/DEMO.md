# SB10 Demo Guide

> Hướng dẫn demo SB10 - Branch Traffic Prediction cho Shinhan InnoBoost

---

## 📋 Demo Checklist

- [ ] Laptop đã cài Node.js 18+
- [ ] Code đã clone từ GitHub
- [ ] Dependencies đã install (`npm install`)
- [ ] Server đang chạy (`npm run dev`)
- [ ] Browser mở http://localhost:3000

---

## 🎬 Demo Script (4 phút)

### Opening (30 seconds)

```
"Xin chào ban giám khảo và các anh chị.

Mình là [Tên] từ đội [Tên đội]. Hôm nay mình xin trình bày
SB10 - Hệ thống dự đoán lưu lượng chi nhánh bằng Qwen AI."
```

### Problem Statement (30 seconds)

```
"Vấn đề chúng tôi giải quyết:

Hiện tại, khi khách hàng đến Shinhan Bank, họ không biết trước
thời gian chờ. Điều này dẫn đến:

- Khách hàng phải đợi trung bình 20-30 phút
- Khung giờ 11h-1h luôn quá tải
- Nhân viên không được tối ưu hóa

Chúng tôi có giải pháp:"
```

### Solution Overview (30 seconds)

```
"SB10 - Hệ thống dự đoán lưu lượng chi nhánh bằng Qwen AI:

1. Dự báo theo giờ - Biết trước khi nào đông
2. Best time to visit - Khuyến nghị giờ vàng
3. Real-time queue - Cập nhật khi có check-in mới
4. Staff optimization - Gợi ý nhân sự cho manager"
```

### Live Demo (2 minutes)

```
"Mời các anh chị cùng xem demo."
```

#### Screen 1: Dashboard (30s)
```
"Đây là dashboard với 5 chi nhánh mẫu tại TP.HCM:

- Chúng ta thấy trạng thái real-time: đang mở cửa/đóng cửa
- Thời gian chờ hiện tại: 5-28 phút
- Màu sắc chỉ báo mức độ đông: 🟢 Thấp / 🟡 TB / 🔴 Cao"
```

#### Screen 2: Branch Detail - Quận 1 (30s)
```
"Chọn chi nhánh Quận 1 - đây là chi nhánh đông nhất.

Chúng ta thấy:
- Dự báo theo giờ từ 8h sáng đến 5h chiều
- Khung giờ 11h-13h đang đỏ - rất đông, 35 phút chờ
- Hệ thống khuyến nghị: Đến 9h sáng hoặc 3h chiều"
```

#### Screen 3: Best Time to Visit (30s)
```
"Card màu xanh đây là Best Time to Visit.

Hệ thống phân tích dữ liệu lịch sử và dùng Qwen AI để dự báo.
Khách hàng có thể đến khung giờ này để chờ ít nhất."
```

#### Screen 4: Real-time Update (30s)
```
"Khi có khách check-in mới, dự báo sẽ cập nhật real-time.

Ví dụ: bây giờ có 5 khách check-in bất ngờ
→ Thời gian chờ tăng từ 10 lên 25 phút
→ Hệ thống thông báo ngay cho khách đang chờ"
```

---

## 🤖 Qwen AI Integration

```
"Tất cả dự báo được cung cấp bởi Qwen AI - mô hình ngôn ngữ lớn
của Alibaba Cloud.

Qwen phân tích:
- Lịch sử lưu lượng 30 ngày
- Mẫu hình theo giờ, ngày trong tuần
- Các yếu tố mùa vụ (cuối tháng, lễ tết)

Và trả về dự báo JSON với độ chính xác cao."
```

---

## 📊 Kết quả mong đợi

| Chỉ số | Trước | Sau (dự kiến) |
|--------|-------|----------------|
| Thời gian chờ TB | 20-30 phút | 10-15 phút |
| Satisfication (NPS) | 30 | 60 |
| Tối ưu nhân sự | Thủ công | AI hỗ trợ |

---

## 💬 Q&A Preparation

### Câu hỏi có thể gặp

**Q: Dữ liệu từ đâu có?**
A: Hiện tại dùng mock data với 5 chi nhánh mẫu, 30 ngày lịch sử.
   Khi production sẽ kết nối với hệ thống Core Banking thật.

**Q: Tại sao dùng Qwen?**
A: Qwen có khả năng:
   - Hiểu tiếng Việt tốt
   - Xử lý context dài
   - Deploy được on-premise (điều kiện bắt buộc của ngân hàng)

**Q: Độ chính xác bao nhiêu?**
A: Khi có dữ liệu thật, chúng tôi sẽ:
   - Train lại model với data Shinhan
   - A/B test với các mô hình truyền thống
   - Đo lường MAE, RMSE để optimize

**Q: Scaling thế nào?**
A:
   - On-premise deployment (Shinhan Data Center)
   - Qwen hỗ trợ self-hosted
   - Có thể scale theo số lượng chi nhánh

**Q: Chi phí triển khai?**
A:
   - Qwen open-source: miễn phí bản thân
   - Chi phí chủ yếu: infrastructure + maintain
   - So với chi phí nhân sự → tiết kiệm đáng kể

---

## 🎯 Tips Demo

| Tip | Description |
|-----|-------------|
| **Don't apologize** | Đừng nói "xin lỗi nếu có lỗi" |
| **Show, don't tell** | Demo > Slide |
| **Keep it simple** | 1 use case rõ ràng > nhiều tính năng |
| **Have backup** | Chuẩn bị screenshot/video nếu demo lỗi |
| **Practice** | Tập ít nhất 3 lần trước ngày pitch |

---

## 🔧 Troubleshooting

### Server không chạy
```bash
cd sb10-branch-prediction
npm install
npm run dev
```

### Port 3000 đang dùng
```bash
PORT=3001 npm run dev
```

### Lỗi import
```bash
rm -rf .next node_modules
npm install
```

---

## 📞 Liên hệ

- **GitHub:** https://github.com/DATMETACOM/kts-qwen-ai
- **Email:** noreply@datmetacom.com

---

**Good luck with your demo! 🚀**
