// SF12 - Mock Data Generators

import { MicroBizCustomer, CashflowData, PLATFORMS, Platform } from "@/types";

const CUSTOMER_NAMES = [
  "Nguyễn Thị Hương", // Online seller
  "Trần Văn Minh", // Freelancer
  "Lê Thị Mai", // Gig worker
  "Phạm Đức Anh", // Online seller
  "Hoàng Ngọc Lan", // Freelancer
  "Đặng Minh Tuấn", // Gig worker
  "Bùi Thị Hồng Nhung", // Online seller
  "Vũ Thanh Sơn", // Freelancer
  "Ngô Quốc Trung", // Gig worker
  "Trịnh Thị Lan Chi", // Online seller
];

const PLATFORM_NAMES = ["Shopee", "Lazada", "Grab", "Baemin", "TikTok Shop"];

const CUSTOMER_TYPES: Array<"online_seller" | "freelancer" | "gig_worker"> = [
  "online_seller",
  "freelancer",
  "gig_worker",
];

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

export function generateCustomers(count: number = 10): MicroBizCustomer[] {
  const customers: MicroBizCustomer[] = [];

  for (let i = 0; i < count; i++) {
    const type = CUSTOMER_TYPES[i % 3];
    const platform = PLATFORM_NAMES[randomBetween(0, PLATFORM_NAMES.length - 1)];
    const monthsActive = randomBetween(3, 36);
    const monthlyRevenue = randomBetween(5000000, 80000000);

    customers.push({
      id: `mb-${String(i + 1).padStart(3, "0")}`,
      name: CUSTOMER_NAMES[i % CUSTOMER_NAMES.length],
      type,
      platform,
      monthlyRevenue,
      monthsActive,
      complaintRate: randomFloat(0, 5),
      rating: randomFloat(3.5, 5),
      ewalletBalance: randomBetween(500000, 10000000),
      ewalletTransactions: randomBetween(10, 200),
      bankTransactions: randomBetween(5, 100),
      cashflowScore: randomBetween(30, 95),
    });
  }

  return customers;
}

export function generateCashflowHistory(
  customerId: string,
  months: number = 6
): CashflowData[] {
  const history: CashflowData[] = [];
  const baseRevenue = randomBetween(5000000, 30000000);

  for (let i = 0; i < months; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    history.push({
      customerId,
      period,
      platformRevenue: baseRevenue + randomBetween(-2000000, 2000000),
      ewalletInflow: randomBetween(3000000, 15000000),
      ewalletOutflow: randomBetween(2000000, 10000000),
      bankInflow: randomBetween(2000000, 20000000),
      bankOutflow: randomBetween(1000000, 15000000),
      avgDailyBalance: randomBetween(1000000, 20000000),
      volatility: randomFloat(10, 40),
    });
  }

  return history.reverse();
}

export const MOCK_CUSTOMERS = generateCustomers(10);

export function getCustomer(customerId: string): MicroBizCustomer | undefined {
  return MOCK_CUSTOMERS.find((c) => c.id === customerId);
}

export function getPlatforms(): Platform[] {
  return PLATFORMS;
}

export interface PortfolioSnapshot {
  date: string;
  totalDisbursed: number;
  activeLoans: number;
  avgCashflowScore: number;
  nplRate: number;
}

export function generatePortfolioHistory(months: number = 12): PortfolioSnapshot[] {
  const history: PortfolioSnapshot[] = [];
  let totalDisbursed = 500000000;
  let activeLoans = 50;

  for (let i = 0; i < months; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    totalDisbursed += randomBetween(50000000, 150000000);
    activeLoans += randomBetween(-5, 15);

    history.push({
      date: monthDate,
      totalDisbursed,
      activeLoans: Math.max(10, activeLoans),
      avgCashflowScore: randomBetween(55, 75),
      nplRate: randomFloat(1, 4),
    });
  }

  return history.reverse();
}

export function calculatePortfolioMetrics(): {
  totalDisbursed: number;
  activeLoans: number;
  avgCashflowScore: number;
  nplRate: number;
  monthlyGrowth: number;
  collectionRate: number;
} {
  return {
    totalDisbursed: 1250000000,
    activeLoans: 127,
    avgCashflowScore: 68.5,
    nplRate: 2.3,
    monthlyGrowth: 12.5,
    collectionRate: 94.2,
  };
}