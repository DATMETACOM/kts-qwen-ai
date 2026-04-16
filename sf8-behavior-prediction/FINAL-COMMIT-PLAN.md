# KẾ HOẠCH COMMIT - SF8 BEHAVIOR PREDICTION
# Monorepo Safe - Không ảnh hưởng SB10

> **Ngày**: April 14, 2026
> **Repo**: kts-qwen-ai (https://github.com/DATMETACOM/kts-qwen-ai.git)
> **Branch**: develop (tạo mới từ master)
> **Scope**: CHỈ sf8-behavior-prediction/

---

## ✅ BƯỚC 0: Kiểm Tra Trước

```bash
cd D:\CODE\qwen-ai-build-day-wiki\kts-qwen-ai

# Verify đang ở đúng repo
git remote -v
# Expected: https://github.com/DATMETACOM/kts-qwen-ai.git

# Verify branch hiện tại
git branch
# Expected: * master

# Verify không ảnh hưởng SB10
git status | findstr "sb10"
# Expected: (không có output - SB10 không bị modify)
```

---

## 📋 BƯỚC 1: Tạo .gitignore (An toàn cho monorepo)

**File**: `.gitignore` (MỚI - root level)

```gitignore
# SF8 - AI Customer Behavior Prediction
sf8-behavior-prediction/node_modules/
sf8-behavior-prediction/dist/
sf8-behavior-prediction/*.tsbuildinfo
sf8-behavior-prediction/.env

# SB10 - Branch Traffic Prediction  
sb10-branch-prediction/node_modules/
sb10-branch-prediction/.next/
sb10-branch-prediction/.env
```

**Commit**:
```bash
git add .gitignore
git commit -m "chore: add monorepo-safe .gitignore (sf8 + sb10)"
```

---

## 📋 BƯỚC 2: Tạo branch develop

```bash
git checkout -b develop
```

---

## 📋 BƯỚC 3: Commit 1 - Documentation (18 files)

**Scope**: `sf8-behavior-prediction/*.md`

**Files**:
```
sf8-behavior-prediction/README.md                    (SỬA)
sf8-behavior-prediction/AGENT-GUARDRAILS.md          (MỚI)
sf8-behavior-prediction/COMMIT-PLAN.md               (MỚI)
sf8-behavior-prediction/DATA-CATALOG-CANDIDATES.md   (MỚI)
sf8-behavior-prediction/DATA-CATALOG.md              (MỚI)
sf8-behavior-prediction/DATA-GOVERNANCE.md           (MỚI)
sf8-behavior-prediction/DATASET-PIPELINE.md          (MỚI)
sf8-behavior-prediction/JUDGE-QA-GUIDE.md            (MỚI)
sf8-behavior-prediction/ONE-PAGER.md                 (MỚI)
sf8-behavior-prediction/PROJECT-STORY.md             (MỚI)
sf8-behavior-prediction/QUICK-REFERENCE.md           (MỚI)
sf8-behavior-prediction/SCORING-SPEC.md              (MỚI)
sf8-behavior-prediction/SCREENSHOT-GUIDE.md          (MỚI)
sf8-behavior-prediction/SF8-CONTEXT.md               (MỚI)
sf8-behavior-prediction/SUBMISSION-CHECKLIST.md      (MỚI)
sf8-behavior-prediction/SUBMISSION-SPEC.md           (MỚI)
sf8-behavior-prediction/USE-CASE-SLICES.md           (MỚI)
sf8-behavior-prediction/USER-GUIDE-AND-TESTING.md    (MỚI)
sf8-behavior-prediction/VIDEO-SCRIPT.md              (MỚI)
```

**Command**:
```bash
git add sf8-behavior-prediction/*.md
git commit -m "docs(sf8): add comprehensive documentation for PoC

- User guide with testing instructions (USER-GUIDE-AND-TESTING.md)
- Judge Q&A preparation with 20 questions (JUDGE-QA-GUIDE.md)
- Quick reference card for demos (QUICK-REFERENCE.md)
- Scoring specification (SCORING-SPEC.md)
- Data governance and pipeline docs
- Submission assets (ONE-PAGER, VIDEO-SCRIPT, etc.)
- Enhanced README with architecture and demo flow

Track: Financial Services - Shinhan InnoBoost 2026"
```

---

## 📋 BƯỚC 4: Commit 2 - Core Scoring Engine (3 files)

**Scope**: `sf8-behavior-prediction/lib/` + `types/`

**Files**:
```
sf8-behavior-prediction/lib/scoring.ts               (MỚI)
sf8-behavior-prediction/lib/data.ts                  (MỚI)
sf8-behavior-prediction/lib/qwen.ts                  (SỬA)
sf8-behavior-prediction/types/index.ts               (MỚI - nếu có thay đổi)
```

**Command**:
```bash
git add sf8-behavior-prediction/lib/
git add sf8-behavior-prediction/types/
git commit -m "feat(sf8): add deterministic scoring engine with alternative data

- Scoring engine: PCF, BSS, ERQ, PA score families (0-100)
- Demo data: 20 customers with telco, e-wallet, ecommerce, social
- Product catalog: 7 Shinhan Finance products
- Qwen integration for AI explanation (optional fallback)
- Action thresholds: push now, nurture, hold
- What-if simulation support (3 variables)

Formula: Overall = PCF×0.20 + BSS×0.30 + ERQ×0.15 + PA×0.35"
```

---

## 📋 BƯỚC 5: Commit 3 - Frontend App (8 files)

**Scope**: `sf8-behavior-prediction/src/` + config

**Files**:
```
sf8-behavior-prediction/index.html                   (MỚI)
sf8-behavior-prediction/vite.config.ts               (MỚI)
sf8-behavior-prediction/src/App.tsx                  (MỚI)
sf8-behavior-prediction/src/main.tsx                 (MỚI)
sf8-behavior-prediction/src/index.css                (MỚI)
sf8-behavior-prediction/src/dataProvider.ts          (MỚI)
sf8-behavior-prediction/src/views/Dashboard.tsx      (MỚI)
sf8-behavior-prediction/src/views/CustomerDetail.tsx (MỚI)
sf8-behavior-prediction/src/views/Simulation.tsx     (MỚI)
sf8-behavior-prediction/src/views/ExportPitch.tsx    (MỚI)
```

**Command**:
```bash
git add sf8-behavior-prediction/index.html
git add sf8-behavior-prediction/vite.config.ts
git add sf8-behavior-prediction/src/
git commit -m "feat(sf8): add React app with 4 views for behavior prediction

- Dashboard: Portfolio overview with 20 customers
- Customer Detail: Deep-dive with score breakdown + AI explanation
- Simulation: What-if workspace (partner, product, early reaction)
- Export Pitch: Report generation with Vietnamese outreach note
- Vite + React 18 + TypeScript + React Router v6
- Custom CSS styling (no framework)

Tech: React 18, TypeScript, Vite, React Router v6"
```

---

## 📋 BƯỚC 6: Commit 4 - Tests & Config (6 files)

**Scope**: `sf8-behavior-prediction/tests/` + config files

**Files**:
```
sf8-behavior-prediction/tests/scoring.test.ts        (MỚI)
sf8-behavior-prediction/tests/data.test.ts           (MỚI)
sf8-behavior-prediction/tests/setup.ts               (MỚI)
sf8-behavior-prediction/vitest.config.ts             (MỚI)
sf8-behavior-prediction/package.json                 (MỚI)
sf8-behavior-prediction/package-lock.json            (MỚI)
sf8-behavior-prediction/tsconfig.json                (MỚI)
```

**Command**:
```bash
git add sf8-behavior-prediction/tests/
git add sf8-behavior-prediction/vitest.config.ts
git add sf8-behavior-prediction/package.json
git add sf8-behavior-prediction/package-lock.json
git add sf8-behavior-prediction/tsconfig.json
git commit -m "test(sf8): add automated test suite (45+ test cases)

Scoring engine tests (20+ cases):
- Score computation validation (0-100 range, weighted sum)
- Product recommendation logic (highest affinity, income-eligible)
- Action threshold assignment (push now/nurture/hold)
- What-if simulation correctness (immutability, delta calculation)
- Hero case validation (c001 has highest score)

Data integrity tests (25+ cases):
- 20 customers with unique IDs, valid ages, incomes
- 4 alternative data sources (telco, e-wallet, ecommerce, social)
- 7 Shinhan Finance products with valid types
- Data relationships and governance markers
- Archetype validation (AR-01 Digital Native, AR-06 Freelancer)

Config: Vitest + TypeScript + package.json with test scripts"
```

---

## 📋 BƯỚC 7: Push lên GitHub

```bash
git push -u origin develop
```

**Expected output**:
```
Enumerating objects: XX, done.
Counting objects: 100% (XX/XX), done.
Delta compression using up to X threads
Compressing objects: 100% (XX/XX), done.
Writing objects: 100% (XX/XX), XX.XX KiB | XX.XX MiB/s, done.
Total XX (delta XX), reused 0 (delta 0)
remote: Resolving deltas: 100% (XX/XX)
remote:
remote: To create a merge request for develop, visit:
remote:   https://github.com/DATMETACOM/kts-qwen-ai/-/merge_requests/new?merge_request%5Bsource_branch%5D=develop
remote:
To https://github.com/DATMETACOM/kts-qwen-ai.git
 * [new branch]      develop -> develop
branch 'develop' set up to track 'origin/develop'.
```

---

## 📋 BƯỚC 8: Verify

```bash
# Check commits
git log --oneline -5

# Verify SB10 không bị ảnh hưởng
git diff HEAD -- sb10-branch-prediction/
# Expected: (no output)

# Check status
git status
# Expected: On branch develop, nothing to commit

# Check online
echo "Visit: https://github.com/DATMETACOM/kts-qwen-ai/tree/develop/sf8-behavior-prediction"
```

---

## ⚠️ SAFETY CHECKS

### KHÔNG commit những files này:
- ❌ `sf8-behavior-prediction/node_modules/` (~50MB)
- ❌ `sf8-behavior-prediction/dist/` (build output)
- ❌ `sf8-behavior-prediction/*.tsbuildinfo` (cache)
- ❌ `sf8-behavior-prediction/plan/` (planning notes - không cần thiết)
- ❌ Bất kỳ files nào trong `sb10-branch-prediction/`

### Chỉ commit:
- ✅ Documentation (.md files)
- ✅ Source code (.ts, .tsx files)
- ✅ Config files (package.json, tsconfig.json, vite.config.ts)
- ✅ Test files (tests/*.ts)
- ✅ .gitignore (root level)

---

## 🎯 TỔNG KẾT

| Step | Action | Files | Commit Message Prefix |
|------|--------|-------|----------------------|
| 0 | Kiểm tra | - | - |
| 1 | Add .gitignore | 1 | `chore:` |
| 2 | Tạo branch | - | - |
| 3 | Documentation | 18 | `docs(sf8):` |
| 4 | Core Engine | 3-4 | `feat(sf8):` |
| 5 | Frontend App | 8 | `feat(sf8):` |
| 6 | Tests | 6 | `test(sf8):` |
| 7 | Push | - | - |
| 8 | Verify | - | - |

**Tổng commits**: 5 commits (1 chore + 4 sf8)
**Tổng files**: ~37 files
**Branch**: develop
**Remote**: origin (GitHub)

---

**CHỜ DUYỆT TRƯỚC KHI TRIỂN KHAI!**

Reply "OK" hoặc "GO" để bắt đầu.
