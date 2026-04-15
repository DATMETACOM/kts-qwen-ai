# SF8 - Chuẩn Bị Hỏi Đáp Cho Ban Giám Khảo
# Judge Q&A Preparation Guide

> **Shinhan Finance InnoBoost 2026 | Qwen AI Build Day**
> 
> **Ngày cập nhật**: April 14, 2026

---

## Mục Lục

1. [Câu Hỏi Về Giải Pháp](#1-problem--solution)
2. [Câu Hỏi Về Kỹ Thuật](#2-technical-approach)
3. [Câu Hỏi Về Tác Động Kinh Doanh](#3-business-impact)
4. [Câu Hỏi Về Demo](#4-demo-specific)
5. [Câu Hỏi Về Đạo Đức & Quản Trị](#5-ethics--governance)
6. [Câu Hỏi Cạnh Tranh](#6-competition)

---

## 1. Problem & Solution

### ❓ Q1: Tại sao dùng alternative data? Sao không dùng credit scoring truyền thống?

**Trả lời**:

Credit scoring truyền thống yêu cầu **lịch sử giao dịch nội bộ** tại Shinhan. Khách hàng mới có **zero internal data** - không tài khoản, không giao dịch, không hành vi.

Alternative data lấp khoảng trống này:
- **Telco**: Cho thấy ổn định tài chính (chi tiêu hàng tháng đều đặn)
- **E-Wallet**: Cho thấy hành vi giao dịch (tần suất, danh mục)
- **E-Commerce**: Cho thấy khả năng chi tiêu và sở thích
- **Social**: Cho thấy lối sống và mức độ tương tác

**Điểm quan trọng**: Chúng ta không thay thế credit scoring - mà cho phép **đánh giá lần đầu** khi chưa có dữ liệu nội bộ.

---

### ❓ Q2: Cái này khác gì với những gì ngân hàng đã làm?

**Trả lời**:

Hầu hết ngân hàng dùng alternative data **một cách không chính thức** (đánh giá thủ công). SF8 cung cấp:

1. **Scoring có cấu trúc**: Công thức deterministic, kiểm toán được (không phải cảm tính)
2. **Minh bạch**: Mỗi score có breakdown (PCF, BSS, ERQ, PA)
3. **AI giải thích**: Reasoning bằng ngôn ngữ tự nhiên (không phải black box)
4. **Simulation**: Test chiến lược acquisition trước khi thực hiện
5. **Governance**: Generated data với provenance markers (không phải PII thật)

**Lợi thế cạnh tranh**: Deterministic-first + AI explanation = trong suốt VÀ giải thích được.

---

### ❓ Q3: Nếu khách hàng không đồng ý cho dùng alternative data thì sao?

**Trả lời**:

Đây là mối quan tâm chính đáng. Trong production:
- **Explicit consent** required trước khi truy cập alternative data
- **Opt-in model**: Khách hàng chọn chia sẻ telco, e-wallet, v.v.
- **Value exchange**: Khách hàng nhận được đề xuất sản phẩm tốt hơn
- **Tuân thủ quy định**: Luật bảo vệ dữ liệu Việt Nam áp dụng

**Lưu ý PoC**: Demo của chúng ta dùng generated data để minh họa cách tiếp cận. Deployment thực tế cần consent framework.

---

## 2. Technical Approach

### ❓ Q4: Tại sao dùng deterministic scoring thay vì ML?

**Trả lời**:

Ba lý do:

1. **Minh bạch**: Mỗi score được tính bằng công thức ai cũng kiểm toán được. ML models là black boxes.
2. **Tuân thủ quy định**: Quyết định tài chính cần giải thích được. Deterministic logic cho lý do rõ ràng.
3. **Giai đoạn PoC**: Chúng ta đang demo cách tiếp cận trước. ML training cần data khách hàng thật và validation.

**Vai trò của Qwen**: Giải thích "tại sao" đằng sau deterministic scores, không thay thế scoring engine.

**Tương lai**: ML model có thể thay thế deterministic weights sau khi được validate với data thật.

---

### ❓ Q5: Độ chính xác của predictions ra sao?

**Trả lời**:

**Trả lời trung thực**: Chúng ta không thể claim predictive accuracy cho PoC này vì:
- Demo dùng **generated data**, không phải data khách hàng thật
- Scores chỉ có ý nghĩa **tương đối trong demo set**, không phải chỉ số tuyệt đối
- Chưa có ML training (chỉ dùng rule-based weights)

**Điều chúng ta NÓI được**: Cấu trúc scoring tuân theo weights và thresholds đã tài liệu hóa. Khi Shinhan cung cấp data khách hàng thật và outcomes, chúng ta có thể:
- Train ML model để optimize weights
- Validate dựa trên actual product adoption
- Đo precision, recall, AUC metrics

**Bước tiếp theo**: Hợp đồng InnoBoost POC (200M VND) sẽ fund validation với data thật.

---

### ❓ Q6: Qwen hoạt động như thế nào trong hệ thống?

**Trả lời**:

Qwen chỉ dùng cho **explanation**:

```
Customer Data + Alternative Data
         ↓
  Deterministic Scoring Engine (code của chúng ta)
         ↓
  Score: 82/100, Action: Push Now, Product: Credit Card
         ↓
  Qwen API (DashScope)
         ↓
  "Khách hàng này cho thấy hoạt động e-commerce cao và 
   chi tiêu telco ổn định, phù hợp với thẻ Cashback..."
```

**Qwen KHÔNG làm**:
- Tính scores (deterministic engine làm)
- Quyết định actions (threshold rules làm)
- Recommend products (affinity calculation làm)

**Tại sao quan trọng**: Quyết định tài chính không thể là AI black boxes. Deterministic scoring cung cấp audit trail.

---

### ❓ Q7: Nếu Qwen API không khả dụng thì sao?

**Trả lời**:

App fallback sang **deterministic explanation templates**:

```typescript
// Không có Qwen:
const explanation = `Khách hàng cho thấy tín hiệu mạnh trong:
  - Telco: ${telco.monthlySpend.toLocaleString()} VND/tháng
  - E-wallet: mức sử dụng ${ewallet.usage}
  Đề xuất: ${product.name}`;
```

**Chức năng cốt lõi** (scoring, action, product recommendation) hoạt động không cần Qwen. Chỉ natural language explanation bị ảnh hưởng.

---

## 3. Business Impact

### ❓ Q8: ROI cho Shinhan là bao nhiêu?

**Trả lời**:

Ba lợi ích đo lường được:

1. **Acquisition khách hàng mới**: Convert khách hàng mà hiện tại không thể đánh giá
   - Giả sử 10,000 khách hàng mới/năm
   - Hiện tại: ~30% có thể đánh giá (data hiện có)
   - Với SF8: ~60% có thể đánh giá (alternative data)
   - **Tác động**: +3,000 khách hàng có thể đánh giá/năm

2. **Thời gian đưa đề xuất nhanh hơn**: Giảm từ vài tuần xuống vài phút
   - Hiện tại: Manual review mất 2-4 tuần
   - Với SF8: Scoring tức thì từ alternative data
   - **Tác động**: Đánh giá nhanh hơn 95%

3. **Product matching tốt hơn**: Tăng tỷ lệ adopt sản phẩm
   - Hiện tại: Đề xuất chung chung (conversion thấp)
   - Với SF8: Cá nhân hóa dựa trên tín hiệu alternative data
   - **Tác động**: Conversion rate cao hơn (cần validate với data thật)

**Giới hạn PoC**: Đây là projections. ROI thực tế cần validate với data khách hàng thật của Shinhan.

---

### ❓ Q9: Tích hợp với hệ thống hiện tại của Shinhan như thế nào?

**Trả lời**:

**PoC hiện tại**: Standalone app, chưa tích hợp.

**Kế hoạch InnoBoost POC**:
1. **Partner API integration**: Kết nối nhà cung cấp telco/e-wallet/ecommerce
2. **Shinhan core banking**: Đọc profile khách hàng (với consent)
3. **Product catalog**: Đồng bộ với sản phẩm Shinhan đang cung cấp
4. **CRM system**: Push recommended actions cho relationship managers

**Architecture**:
```
[Partner APIs] → [SF8 Scoring Engine] → [Shinhan CRM]
                      ↓
                [Qwen Explanation]
                      ↓
                [RM Dashboard / Customer App]
```

**Timeline**: 3-6 tháng cho production integration (nếu InnoBoost POC thành công).

---

### ❓ Q10: Rủi ro là gì?

**Trả lời**:

Năm rủi ro chính và cách giảm thiểu:

| Rủi ro | Tác động | Giảm thiểu |
|--------|----------|------------|
| **Chất lượng data** | Alternative data có thể không đầy đủ/ồn ào | Behavior Signal Strength (BSS) đo chất lượng data |
| **Quy định** | Luật bảo mật dữ liệu có thể hạn chế sử dụng | Framework explicit consent, governance markers |
| **Độ chính xác model** | Scores có thể không dự đoán hành vi thật | Validate với outcomes khách hàng thật trong InnoBoost POC |
| **Adoption khách hàng** | Khách hàng có thể không đồng ý chia sẻ data | Value exchange (đề xuất tốt hơn), minh bạch |
| **Phụ thuộc partner** | Dựa vào nhà cung cấp data bên ngoài | Tích hợp nhiều partners, fallback dùng partial data |

---

## 4. Demo Specific

### ❓ Q11: Tại sao Nguyễn Văn An có score cao nhất?

**Trả lời**:

Anh ấy khớp với archetype **AR-01 Digital Native**:

- **28 tuổi, Kỹ sư phần mềm, 25 triệu VND/tháng**: Chuyên gia trẻ với thu nhập ổn định
- **Telco**: 500K/tháng, 24 tháng, 8GB data → Cho thấy ổn định tài chính
- **E-Wallet**: High usage, 50 giao dịch/tháng, đa dạng danh mục → Thanh toán số aktif
- **E-Commerce**: 10 đơn/tháng, 500K trung bình → Hành vi mua sắm online mạnh
- **Social**: Công nghệ, tài chính quan tâm, high activity → Người dùng số năng động

**Score breakdown** (ví dụ):
- PCF: 85 (digital engagement cao)
- BSS: 80 (tín hiệu alternative data mạnh)
- ERQ: 75 (responsive với đề xuất)
- PA: 90 (phù hợp xuất sắc với thẻ Cashback)
- **Tổng**: 82/100 → Push Now ✅

---

### ❓ Q12: Chuyện gì xảy ra nếu simulate "High Engagement" cho khách hàng score thấp?

**Trả lời**:

Giả sử khách hàng c003 (Lê Hoàng Cường, Freelancer) có base score 52:

- **Base**: PCF=45, BSS=50, ERQ=55, PA=60 → Tổng 52 (Nurture)
- **Simulate High Engagement**: PCF tăng lên 70
- **Mới**: PCF=70, BSS=50, ERQ=55, PA=60 → Tổng 62 (Vẫn là Nurture)

**Delta**: +10 điểm, nhưng action không đổi (vẫn cần PA ≥70 mới được Push Now).

**Bài học**: Partner engagement một mình có thể không đủ. Có thể cần cải thiện product offer hoặc chờ early reaction tốt hơn.

---

### ❓ Q13: Hệ thống này có thể dùng cho khách hàng hiện tại đã có lịch sử giao dịch không?

**Trả lời**:

**Thiết kế hiện tại**: Không - SF8 dành riêng cho **khách hàng mới chưa có internal data**.

**Mở rộng tương lai**: Có - có thể kết hợp alternative data với lịch sử giao dịch nội bộ:
- Khách mới: 100% alternative data
- Khách 6 tháng: 50% alternative + 50% internal
- Khách 12+ tháng: 100% internal (traditional scoring)

**Chiến lược chuyển tiếp**: Weight của alternative data giảm dần khi có lịch sử nội bộ.

---

## 5. Ethics & Governance

### ❓ Q14: Hệ thống này có thể phân biệt đối xử với một số nhóm khách hàng không?

**Trả lời**:

**Rủi ro**: Có, nếu alternative data sources bị bias (ví dụ: chi tiêu telco thấp hơn ở vùng nông thôn).

**Giảm thiểu**:
1. **Fairness auditing**: Theo dõi score distribution theo demographics
2. **Alternative data weighting**: Không over-index vào bất kỳ source nào
3. **Human oversight**: SF8 là decision-support, không phải decision-maker
4. **Appeals process**: Khách hàng có thể yêu cầu manual review

**Giới hạn PoC**: Demo data không phản ánh demographic patterns thật. Cần fairness audit trước production.

---

### ❓ Q15: Data khách hàng được bảo vệ như thế nào?

**Trả lời**:

Bốn lớp bảo vệ:

1. **Consent**: Explicit opt-in trước khi truy cập alternative data
2. **Minimization**: Chỉ thu thập data cần thiết cho scoring
3. **Transparency**: Khách hàng có thể xem scores và lý do
4. **Retention**: Data xóa sau scoring trừ khi khách hàng opt-in cho ongoing monitoring

**Lưu ý PoC**: Demo data là generated, không phải PII thật. Production cần full data protection framework.

---

## 6. Competition

### ❓ Q16: Nếu nhóm khác xây cái tương tự thì sao?

**Trả lời**:

Điểm độc đáo của SF8:

1. **Deterministic-first**: Scoring minh bạch ai cũng kiểm toán được (không phải AI black box)
2. **4-source alternative data**: Telco + E-Wallet + E-Commerce + Social (hầu hết chỉ dùng 1-2)
3. **What-if simulation**: Test acquisition strategies (hiếm thấy trong PoCs)
4. **Governance-aware**: Generated data với provenance markers (cho thấy tư duy production readiness)
5. **Qwen for explanation**: AI tăng cường hiểu biết mà không thay thế logic

**Đối thủ**: Các nhóm khác có thể tập trung vào ML accuracy, nhưng SF8 tập trung vào **transparency + explainability + strategy simulation**.

---

### ❓ Q17: Tại sao Shinhan nên chọn SF8 thay vì tự build?

**Trả lời**:

Ba lý do:

1. **Speed to market**: SF8 PoC đã sẵn sàng. Tự build sẽ mất 6-12 tháng.
2. **Proven approach**: Deterministic scoring + AI explanation là pattern đã được chứng minh.
3. **InnoBoost support**: Hợp đồng POC 200M VND fund validation với data thật.

**Build vs. Buy**: Shinhan có thể customize SF8 sau InnoBoost. Bắt đầu từ con số không làm chậm thời gian ra thị trường.

---

## 7. Next Steps

### ❓ Q18: Cần gì để production-ready?

**Trả lời**:

Sáu milestones:

| # | Milestone | Timeline | Dependency |
|---|-----------|----------|------------|
| 1 | Truy cập data khách hàng thật | Tháng 1 | Shinhan approval |
| 2 | Partner API integration | Tháng 1-2 | Hợp đồng telco/e-wallet |
| 3 | ML model training | Tháng 2-3 | Data thật + outcomes |
| 4 | Validation study | Tháng 3-4 | Historical customer data |
| 5 | CRM integration | Tháng 4-5 | Shinhan IT approval |
| 6 | Pilot launch | Tháng 5-6 | Regulatory clearance |

**Ngân sách**: 200M VND (hợp đồng InnoBoost POC) chi trả cho milestones 1-4.

---

### ❓ Q19: Metrics nào sẽ track trong production?

**Trả lời**:

Năm KPIs:

1. **Assessment coverage**: % khách hàng mới có thể score (target: 60%+)
2. **Product adoption rate**: % khách hàng "Push Now" accept đề xuất (target: TBD với data thật)
3. **Time-to-offer**: Phút từ consent đến recommendation (target: <5 phút)
4. **Score accuracy**: Tương quan giữa scores và actual adoption (target: 0.7+ AUC)
5. **Customer satisfaction**: NPS score cho khách hàng nhận AI-recommended products (target: 50+)

---

### ❓ Q20: Kế hoạch scale ra ngoài Việt Nam như thế nào?

**Trả lời**:

SF8 được thiết kế cho **triển khai đa thị trường**:

1. **Partner taxonomy**: Abstracted (không hardcoded cho nhà cung cấp Việt Nam)
2. **Product catalog**: Configurable per market
3. **Scoring weights**: Có thể recalibrate per market
4. **Language**: Qwen hỗ trợ multi-language (hiện tại tiếng Việt, mở rộng được sang tiếng Anh, Thái, v.v.)

**Lộ trình mở rộng**: Việt Nam (Shinhan) → Đông Nam Á → Toàn cầu

---

## Mẹo Trình Bày Cho Ban Giám Khảo

### ✅ NÊN LÀM

1. **Nhấn mạnh transparency**: "Mọi score đều kiểm toán được, không phải AI black box"
2. **Dùng hero case**: Demo Nguyễn Văn An - score cao nhất, giải thích rõ ràng
3. **Show simulation**: Thay đổi 1 biến, cho thấy score delta
4. **Nói về governance**: Generated data, không phải PII thật
5. **Be honest about limitations**: "PoC chưa validate với data thật, nhưng cấu trúc đã sẵn sàng"

### ❌ KHÔNG NÊN LÀM

1. **Claim accuracy**: Không nói "90% chính xác" khi chưa validate
2. **Nói production-ready**: Đây là PoC, chưa phải production
3. **Ignore ethics**: Phải đề cập consent và fairness
4. **Over-promise**: Không nói "sẽ thay thế credit scoring" mà nói "bổ sung cho new customers"
5. **Forget disclosure**: Luôn nói "Generated demo data for PoC"

---

## Kịch Bản Demo 3 Phút (Tóm Tắt)

### [0:00-0:30] Dashboard

**Nói**: 
"Chào mừng đến SF8 - AI Customer Behavior Prediction cho Shinhan Finance.

Dashboard này cho thấy 20 khách hàng mới được phân tích từ alternative data: telco, e-wallet, e-commerce, và social.

Bạn có thể thấy:
- 4 stat cards: tổng khách hàng, và breakdown theo action
- Hero case highlight - khách hàng score cao nhất
- Product distribution cho thấy Shinhan products nào được đề xuất"

---

### [0:30-1:30] Hero Case

**Nói**:
"Đây là Nguyễn Văn An, 28 tuổi, kỹ sư phần mềm.

SF8 cho anh ấy score 82/100 dựa trên 4 dimensions:
- Partner/Channel Fit: 85 - digital engagement cao
- Behavior Signal: 80 - e-wallet và ecommerce hoạt động mạnh
- Early Reaction: 75 - responsive với đề xuất
- Product Affinity: 90 - phù hợp xuất sắc với thẻ Cashback

AI giải thích: [đọc explanation]

Dựa trên hoạt động e-commerce cao và mua sắm online, SF8 đề xuất thẻ Cashback Credit Card với action 'push now'."

---

### [1:30-2:30] Simulation

**Nói**:
"Bây giờ chúng ta chạy what-if simulation. Nếu khách hàng này có engagement cao hơn?

Base score: 82. Sau khi simulate high engagement: 88. Delta: +6.

Điều này cho thấy SF8 giúp Shinhan hiểu đòn bẩy nào để cải thiện acquisition.

Chúng ta có thể simulate 3 biến:
1. Partner/channel engagement
2. Product offer terms
3. Early reaction signals"

---

### [2:30-3:00] Export + Kết

**Nói**:
"Cuối cùng, Export view tạo insight report hoàn chỉnh với:
- Customer profile summary
- AI recommendation với score breakdown
- Personalized outreach note bằng tiếng Việt
- Alternative data signal summary

**Điểm quan trọng**: SF8 là decision-support tool. Qwen giải thích lý do, nhưng mọi scores và actions được tính deterministically cho transparency và auditability.

Xin cảm ơn. SF8 - biến alternative data thành customer insight cho Shinhan Finance."

---

## Tài Liệu Tham Khảo

- [USER-GUIDE-AND-TESTING.md](./USER-GUIDE-AND-TESTING.md) - Hướng dẫn sử dụng và test
- [README.md](./README.md) - Tổng quan dự án
- [SCORING-SPEC.md](./SCORING-SPEC.md) - Chi tiết scoring engine
- [SUBMISSION-SPEC.md](./SUBMISSION-SPEC.md) - Yêu cầu submit
- [ONE-PAGER.md](./ONE-PAGER.md) - Tóm tắt 1 trang

---

**Cập nhật lần cuối**: April 14, 2026
**Phiên bản**: 1.0.0

*Tài liệu này dành cho mục đích hỏi đáp PoC. Deployment production cần thêm validation và compliance checks.*
