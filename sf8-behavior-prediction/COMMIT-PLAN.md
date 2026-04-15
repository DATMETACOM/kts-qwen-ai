# Kế Hoạch Commit - SF8 Behavior Prediction PoC

> **Ngày**: April 14, 2026
> **Branch**: master (sf8-behavior-prediction subfolder)

---

## 📋 Tổng Quan

### Repository
- **Remote**: `https://gitlab.com/datmar.coach/luma-hackathon.wiki.git`
- **Branch hiện tại**: `master`
- **Vị trí**: `kts-qwen-ai/sf8-behavior-prediction/`

### Thay Đổi Cần Commit

| Loại | Số lượng | Mô tả |
|------|----------|-------|
| **Files mới** | 21 | Documentation, source code, tests, config |
| **Files sửa** | 2 | README.md, lib/qwen.ts |
| **Thư mục mới** | 5 | dist/, node_modules/, plan/, src/, tests/ |

---

## 📁 Cấu Trúc Files Sẽ Commit

```
kts-qwen-ai/sf8-behavior-prediction/
│
├── 📄 Documentation (15 files)
│   ├── README.md                    (SỬA - Enhanced with full project details)
│   ├── AGENT-GUARDRAILS.md          (MỚI)
│   ├── DATA-CATALOG-CANDIDATES.md   (MỚI)
│   ├── DATA-CATALOG.md              (MỚI)
│   ├── DATA-GOVERNANCE.md           (MỚI)
│   ├── DATASET-PIPELINE.md          (MỚI)
│   ├── JUDGE-QA-GUIDE.md            (MỚI - 20 Q&A cho ban giám khảo)
│   ├── ONE-PAGER.md                 (MỚI)
│   ├── PROJECT-STORY.md             (MỚI)
│   ├── QUICK-REFERENCE.md           (MỚI - Thẻ tham khảo nhanh)
│   ├── SCORING-SPEC.md              (MỚI - Chi tiết scoring engine)
│   ├── SCREENSHOT-GUIDE.md          (MỚI)
│   ├── SF8-CONTEXT.md               (MỚI)
│   ├── SUBMISSION-CHECKLIST.md      (MỚI)
│   ├── SUBMISSION-SPEC.md           (MỚI)
│   ├── USE-CASE-SLICES.md           (MỚI)
│   ├── USER-GUIDE-AND-TESTING.md    (MỚI - User guide + test plans)
│   └── VIDEO-SCRIPT.md              (MỚI)
│
├── 💻 Source Code (7 files)
│   ├── lib/
│   │   ├── data.ts                  (MỚI - Demo data: 20 customers, 7 products)
│   │   ├── qwen.ts                  (SỬA - Removed unused types/fields)
│   │   └── scoring.ts               (MỚI - Deterministic scoring engine)
│   ├── src/
│   │   ├── views/                   (MỚI - 4 React views)
│   │   ├── App.tsx                  (MỚI)
│   │   ├── dataProvider.ts          (MỚI)
│   │   ├── index.css                (MỚI)
│   │   └── main.tsx                 (MỚI)
│   ├── index.html                   (MỚI)
│   └── vite.config.ts               (MỚI)
│
├── 🧪 Testing (4 files)
│   ├── tests/
│   │   ├── scoring.test.ts          (MỚI - 20+ test cases)
│   │   ├── data.test.ts             (MỚI - 25+ test cases)
│   │   └── setup.ts                 (MỚI - Test configuration)
│   └── vitest.config.ts             (MỚI)
│
├── ⚙️ Configuration (4 files)
│   ├── package.json                 (MỚI - Added test scripts)
│   ├── package-lock.json            (MỚI)
│   ├── tsconfig.json                (MỚI)
│   └── tsconfig.tsbuildinfo         (MỚI)
│
└── 🚫 KHÔNG COMMIT (gitignore)
    ├── node_modules/                (Dependencies - regenerate with npm install)
    ├── dist/                        (Build output)
    └── .env                         (API keys - nếu có)
```

---

## 🎯 Commit Strategy

### Commit 1: Documentation & Project Structure
**Message**: `docs(sf8): add comprehensive documentation and project structure`

**Files**:
- All .md documentation files
- README.md (enhanced)
- Submission assets (ONE-PAGER, VIDEO-SCRIPT, etc.)

**Lý do**: Documentation-first approach, clear project purpose

---

### Commit 2: Core Scoring Engine & Data Layer
**Message**: `feat(sf8): add deterministic scoring engine with alternative data`

**Files**:
- lib/scoring.ts
- lib/data.ts
- lib/qwen.ts (với sửa đổi)
- types/ (nếu có)

**Lý do**: Core logic của PoC - scoring từ alternative data

---

### Commit 3: Frontend Application (React Views)
**Message**: `feat(sf8): add 4-view React app with dashboard, detail, simulation, export`

**Files**:
- src/** (tất cả React components)
- index.html
- vite.config.ts
- src/dataProvider.ts
- src/index.css

**Lý do**: Working demo interface

---

### Commit 4: Testing Infrastructure
**Message**: `test(sf8): add automated test suite for scoring engine and data integrity`

**Files**:
- tests/** (tất cả test files)
- vitest.config.ts
- package.json (với test scripts)
- tests/setup.ts

**Lý do**: Test coverage cho PoC validation

---

## ⚠️ Files KHÔNG Commit (Add to .gitignore)

| File/Thư mục | Lý do |
|--------------|-------|
| `node_modules/` | Dependencies - regenerate với `npm install` |
| `dist/` | Build output - recreate với `npm run build` |
| `.env` | API keys (nếu có) - sensitive data |
| `*.tsbuildinfo` | TypeScript cache - auto-generated |
| `.local-ocr/` | Local OCR data (nếu có) |

---

## ✅ Kiểm Tra Trước Khi Commit

### Checklist
- [ ] Đã review tất cả files mới
- [ ] Không có sensitive data (API keys, passwords)
- [ ] node_modules/ đã add vào .gitignore
- [ ] dist/ đã add vào .gitignore
- [ ] Test files hoạt động (chạy `npm run test:run` sau)
- [ ] README.md đã cập nhật đúng
- [ ] Commit message rõ ràng, theo convention

### Commands Sẽ Chạy
```bash
# 1. Review files
git status
git diff HEAD

# 2. Add files (theo plan)
git add <files-theo-commit-plan>

# 3. Commit (4 commits riêng biệt)
git commit -m "message"

# 4. Push lên GitLab
git push origin master
```

---

## 🚀 Sau Khi Commit

### Sẽ Làm Gì
1. **Verify trên GitLab**: Check repository online
2. **Chạy tests**: `npm run test:run` (sau khi clone lại)
3. **Verify README**: Setup instructions hoạt động
4. **Update TODO**: Mark completed

### Fallback Plan
Nếu có vấn đề:
- `git log` để xem commits
- `git revert <commit-hash>` nếu cần rollback
- Hoặc `git push --force` (cẩn thận!)

---

## 📝 Đề Xuất Commit Message (Final)

Nếu bạn muốn commit **TẤT CẢ** trong 1 commit (nhanh hơn):

```
feat(sf8): complete PoC with scoring engine, React app, tests, and documentation

- Add deterministic scoring engine (PCF, BSS, ERQ, PA scores)
- Add 20 demo customers with alternative data (telco, e-wallet, ecommerce, social)
- Add 4-view React app: Dashboard, Customer Detail, Simulation, Export
- Add what-if simulation with 3 variables
- Add Qwen integration for AI explanation (optional)
- Add automated test suite (45+ test cases)
- Add comprehensive documentation (user guide, judge Q&A, scoring spec)
- Add 7 Shinhan Finance products in catalog
- Add data governance markers and provenance metadata

Track: Financial Services - Shinhan Future's Lab (InnoBoost 2026)
```

---

**Chờ duyệt trước khi triển khai!**
