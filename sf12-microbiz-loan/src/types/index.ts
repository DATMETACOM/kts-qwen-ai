// SF12 - MicroBiz Loan TypeScript Types

export interface MicroBizCustomer {
  id: string;
  name: string;
  type: "online_seller" | "freelancer" | "gig_worker";
  platform: string;
  monthlyRevenue: number;
  monthsActive: number;
  complaintRate: number;
  rating: number;
  ewalletBalance: number;
  ewalletTransactions: number;
  bankTransactions: number;
  cashflowScore: number;
}

export interface CashflowData {
  customerId: string;
  period: string; // YYYY-MM
  platformRevenue: number;
  ewalletInflow: number;
  ewalletOutflow: number;
  bankInflow: number;
  bankOutflow: number;
  avgDailyBalance: number;
  volatility: number;
}

export interface CreditScoreResult {
  customerId: string;
  score: number;
  riskLevel: "low" | "medium" | "high";
  recommendedAmount: number;
  maxTenor: number;
  interestRate: number;
  reasons: string[];
}

export interface LoanApplication {
  id: string;
  customerId: string;
  amount: number;
  tenor: number;
  purpose: string;
  status: "pending" | "approved" | "disbursed" | "active" | "closed" | "defaulted";
  revenueSharePercent: number;
  monthlyPayment: number;
  createdAt: string;
}

export interface MicroLoanProduct {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  minTenor: number;
  maxTenor: number;
  interestRate: number;
  revenueShareCap: number;
  minCashflowScore: number;
}

export const MICRO_LOAN_PRODUCTS: MicroLoanProduct[] = [
  {
    id: "ml-starter",
    name: "Micro Starter",
    minAmount: 5000000,
    maxAmount: 10000000,
    minTenor: 3,
    maxTenor: 6,
    interestRate: 24,
    revenueShareCap: 15,
    minCashflowScore: 40,
  },
  {
    id: "ml-growth",
    name: "Micro Growth",
    minAmount: 10000000,
    maxAmount: 25000000,
    minTenor: 6,
    maxTenor: 12,
    interestRate: 21,
    revenueShareCap: 12,
    minCashflowScore: 55,
  },
  {
    id: "ml-scale",
    name: "Micro Scale",
    minAmount: 25000000,
    maxAmount: 50000000,
    minTenor: 12,
    maxTenor: 24,
    interestRate: 18,
    revenueShareCap: 10,
    minCashflowScore: 70,
  },
];

export interface Platform {
  id: string;
  name: string;
  type: "ecommerce" | "delivery" | "food_delivery";
  apiStatus: "live" | "pilot" | "offline";
  dataFreshness: number; // hours ago
}

export const PLATFORMS: Platform[] = [
  { id: "shopee", name: "Shopee", type: "ecommerce", apiStatus: "live", dataFreshness: 2 },
  { id: "lazada", name: "Lazada", type: "ecommerce", apiStatus: "live", dataFreshness: 4 },
  { id: "tiki", name: "Tiki", type: "ecommerce", apiStatus: "pilot", dataFreshness: 24 },
  { id: "grab", name: "Grab", type: "delivery", apiStatus: "live", dataFreshness: 1 },
  { id: "baemin", name: "Baemin", type: "food_delivery", apiStatus: "pilot", dataFreshness: 12 },
];

export interface PortfolioMetrics {
  totalDisbursed: number;
  activeLoans: number;
  avgCashflowScore: number;
  nplRate: number;
  collectionRate: number;
  monthlyGrowth?: number;
}