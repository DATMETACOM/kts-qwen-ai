# 🏦 Shinhan Financial Group - Qwen AI Build Day 2026

> **Enterprise Hackathon Projects for Financial Services Track**
> **Built with Qwen + Alibaba Cloud**
> **Track:** Financial Services by Shinhan Future's Lab
> **Prize:** USD 1,000 + Priority for VND 200M PoC Funding

---

## 📅 Event Timeline (Completed)

| Date | Event | Status |
|------|-------|--------|
| 10 April 2026 | Kickoff Webinar | ✅ Completed |
| 11–18 April 2026 | Build Period (Extended) | ✅ Completed |
| 18 April 2026 | **Submission Deadline** | ✅ Completed |
| 21 April 2026 | **Live Shortlist & Pitching** - Riverside Palace, HCMC | 📍 Upcoming |
| 22 April 2026 | Final Showcase at Alibaba Cloud SME AI Growth Day | 📍 Upcoming |

> ⚠️ **Submissions are CLOSED.** Shortlisted teams will be announced live on 21 April 2026.

---

## 🏆 Prizes

### Financial Services Track (Shinhan Future's Lab)
| Prize | Reward |
|-------|--------|
| **Track Winner** | USD 1,000 |
| **PoC Funding Priority** | Up to VND 200,000,000 through Shinhan InnoBoost 2026 |
| **Qwen Cloud Credit** | USD 1,000 worth |

---

## ⚖️ Judging Criteria

| Criterion | Description |
|------------|-------------|
| **Problem Relevance** | Does the solution address a real and meaningful problem? |
| **Solution Quality** | Is the product practical, usable, and well-designed? |
| **Use of AI (Qwen)** | Is AI meaningfully integrated into the solution? |
| **Use of Qwen/Alibaba Cloud** | Does the team effectively use the supported technologies? |
| **Execution** | Is there a working prototype or convincing demo? |
| **Pitch Clarity** | Can the team clearly explain the product and value? |

---

## 🎯 About This Repository

This repository contains 4 production-ready PoC projects built for the **Qwen AI Build Day 2026** enterprise hackathon, submitted under the **Financial Services Track** by Shinhan Future's Lab.

Each project addresses a specific problem in Vietnam's financial services market and demonstrates practical AI-powered solutions using Qwen AI.

---

## 📋 Projects

| Project | Code | Description | Status | Tech Stack |
|---------|------|-------------|--------|-------------|
| **Branch Traffic Prediction** | SB10 | AI-powered branch queue management & customer flow prediction | ✅ Ready | Next.js 14 + Qwen |
| **Customer Behavior Prediction** | SF8 | Alternative data scoring for thin-file customers | ✅ Ready | React/Vite + Qwen |
| **EWA & Salary-Linked Lending** | SF11 | Earned Wage Access & paperless loans | ✅ Ready | Next.js 14 + Qwen |
| **MicroBiz Loan** | SF12 | AI-powered micro loans for digital sellers | ✅ Ready | Next.js 14 + Qwen | [sf12-microbiz-loan/](./sf12-microbiz-loan/) |

---

## 🔗 Submit Your Project

Submit all 4 projects on Devpost before the deadline:

**Event:** [Qwen AI Build Day 2026](https://qwen-ai-build-day.devpost.com)
**Track:** Financial Services (Shinhan Future's Lab)
**Deadline:** 17 April 2026, end of day ICT

---

## 🏦 Financial Services Track - Use Cases

These projects solve real problems in Vietnam's financial services market:

### SB10 - Branch Traffic Prediction
**Problem:** Customers don't know wait times in advance, leading to:
- Long wait times (20-30 minutes average)
- Peak hour congestion (11am-1pm)
- Poor staff allocation

**Solution:** AI-powered traffic prediction with best time to visit recommendations

### SF8 - Customer Behavior Prediction  
**Problem:** Thin-file customers (no credit history) are difficult to assess
- Manual income verification takes days
- High NPL from poor targeting

**Solution:** Alternative data scoring (telco, e-wallet, e-commerce) with Qwen AI recommendations

### SF11 - EWA & Salary-Linked Lending
**Problem:** Employees need access to earned wages before payday
- 3-7 day loan approval TAT
- Manual payslip verification
- High acquisition costs

**Solution:** Instant EWA + salary-linked loans with real-time HRM integration and AI credit scoring

### SF12 - MicroBiz Loan
**Problem:** Digital economy workers (freelancers, gig workers) can't access traditional loans
- No salary slips
- Irregular income patterns
- New market segment

**Solution:** AI-powered micro loans based on cashflow data from e-commerce platforms

---

## 🚀 Quick Start

```bash
# Install all dependencies
npm run install:all

# Run any project
npm run dev:sb10    # Branch Traffic (http://localhost:3000)
npm run dev:sf8     # Customer Behavior (http://localhost:5173)
npm run dev:sf11    # EWA Lending (http://localhost:3000)
npm run dev:sf12    # MicroBiz Loan (http://localhost:3000)
```

---

## 🔧 Tech Stack

- **Frontend Frameworks:** Next.js 14 (App Router), React + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI:** Qwen-Plus via Alibaba Cloud DashScope API
- **Data:** Mock data for PoC demonstration (production-ready data pipelines)

---

## 📚 Documentation

### Project-Level Documentation
Each project contains its own comprehensive documentation:

- **README.md** - Overview, features, and quick start
- **ARCHITECTURE.md** - System design and architecture
- **API.md** - API endpoint documentation  
- **DEMO.md** - Demo script for judges
- **PITCH.md** - Pitch deck outline (where applicable)

### Individual Project Links:
- [SB10 Documentation](./sb10-queue-mind/)
- [SF8 Documentation](./sf8-cuca-insider-ai/)
- [SF11 Documentation](./sf11-ewa-lending/)
- [SF12 Documentation](./sf12-microbiz-loan/)

---

## 🤖 Qwen AI Integration

All projects integrate with Qwen AI for intelligent decision-making. Add your API key:

```bash
# Each project has .env.local - add your Qwen API key
QWEN_API_KEY=your_qwen_api_key_here
```

**Without API key:** Projects use deterministic fallback logic for demonstration.

---

## 📊 Demo Data Summary

| Project | Sample Data |
|---------|------------|
| SB10 | 5 branches, 30 days traffic history |
| SF8 | 20 customers with alternative data |
| SF11 | 170 employees across 5 companies |
| SF12 | 10 microbiz customers, 5 platforms |

---

## 🔗 Resources

### Official Hackathon Resources
- **Event Page:** [Qwen AI Build Day 2026](https://qwen-ai-build-day.devpost.com)
- **Alibaba Cloud/Qwen Docs:** [Google Docs](https://docs.google.com)
- **Shinhan Future's Lab:** [Track Use Cases](https://innoboost.shinhan.com)
- **Kickoff Recording:** Passcode: @O#$HxM6

### 📣 Next Steps
1. **Assume you're shortlisted** - Tight 4-minute pitch + working demo ready
2. **Live Event Day:** 21 April 2026 at Riverside Palace, Ho Chi Minh City
3. **Shortlist announced live** - No advance notification
4. **Final Showcase:** 22 April 2026 at Alibaba Cloud SME AI Growth Day Vietnam

### Learning Resources
- **Qwen AI Learning:** [View Here](https://qwen.readthedocs.io/)
- **Model Studio API:** [AI & ML Hands-on](https://dashscope-intl.aliyuncs.com)

---

## 🎯 Key Features by Project

### SB10 - Branch Traffic Prediction
- 📊 Real-time branch dashboard with 5 locations
- ⏰ Best Time to Visit recommendations
- 📈 Hourly traffic forecast (8am-5pm)
- 🎨 Congestion levels: 🟢 Low / 🟡 Medium / 🔴 High
- ✅ Queue management simulation

### SF8 - Customer Behavior Prediction
- 👥 Customer pipeline with 20 profiles
- 📱 Alternative data scoring (telco, e-wallet, ecommerce, social)
- 🤖 AI-powered product recommendations
- 🎯 Confidence scores and behavioral insights
- 📋 7 Shinhan Finance products

### SF11 - EWA & Salary-Linked Lending
- 💰 Earned Wage Balance calculation
- 🏦 3-portal system (Employee, HR Admin, Shinhan Admin)
- 🤖 AI credit scoring with explainability
- 💳 Instant EWA withdrawal (up to 50%)
- 📊 Portfolio analytics

### SF12 - MicroBiz Loan
- 🏪 Seller/Platform/Admin portals
- 📊 E-commerce and e-wallet integration
- 🤖 AI cashflow-based scoring
- 💰 Revenue-linked repayment
- 📈 Portfolio risk monitoring

---

## 👥 Team

**Built for Qwen AI Build Day 2026**
**Track:** Financial Services (Shinhan Future's Lab)
**Organization:** Shinhan Financial Group Vietnam
**Event:** Riverside Palace, Ho Chi Minh City, 21 April 2026

---

## 📄 License

PoC for Internal Use - Shinhan InnoBoost 2026

---

**GitHub:** https://github.com/DATMETACOM/kts-qwen-ai
**Event:** Qwen AI Build Day 2026