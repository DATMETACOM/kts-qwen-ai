// SF11 - TypeScript Types for EWA & Salary-Linked Lending

export interface Employee {
  id: string;
  name: string;
  company: string;
  monthlySalary: number;
  position: string;
  tenure: string;
  startDate: string;
}

export interface SalaryData {
  employeeName: string;
  employeeId: string;
  companyName: string;
  monthlySalary: number;
  tenure: string;
  position: string;
}

export interface EWARequest {
  employeeId: string;
  amount: number;
  fee: number;
  netAmount: number;
  autoDebitDate: string;
  status: "pending" | "approved" | "disbursed" | "repaid";
}

export interface LoanApplication {
  id: string;
  employeeId: string;
  amount: number;
  tenor: number;
  purpose: string;
  creditScore: number;
  riskLevel: string;
  interestRate: number;
  emi: number;
  status: "pending" | "approved" | "disbursed" | "active" | "closed";
  autoDebitEnabled: boolean;
  createdAt: string;
}

export interface CreditScoreResult {
  score: number;
  riskLevel: "low" | "medium" | "high";
  reasons: string[];
  recommendedProducts: string[];
  eligibleAmount: number;
  interestRate: number;
  maxTenor: number;
  autoDebitApproved: boolean;
}

export interface EWAEligibility {
  eligible: boolean;
  earnedBalance: number;
  availableToWithdraw: number;
  maxWithdrawal: number;
  fee: number;
  reason?: string;
}

export interface ShinhanProduct {
  id: string;
  name: string;
  type: "loan" | "credit_card" | "ewa";
  minIncome: number;
  maxAmount: number;
  minRate?: number;
  maxRate?: number;
  maxTenor?: number;
  description: string;
}

export interface Company {
  id: string;
  name: string;
  employeeCount: number;
  ewaEnabled: boolean;
  loanEnabled: boolean;
}

export interface HRMEmployee {
  employeeId: string;
  name: string;
  company: string;
  department: string;
  position: string;
  monthlySalary: number;
  bankAccount: string;
  hireDate: string;
  status: "active" | "inactive";
}

export interface PayrollData {
  employeeId: string;
  payPeriod: string;
  grossSalary: number;
  deductions: number;
  netSalary: number;
  paidDate: string;
  status: "pending" | "paid";
}

// Product Catalog
export const SHINHAN_PRODUCTS: ShinhanProduct[] = [
  {
    id: "pl-personal",
    name: "Vay tín chấp cá nhân",
    type: "loan",
    minIncome: 10000000,
    maxAmount: 300000000,
    minRate: 18,
    maxRate: 24,
    maxTenor: 48,
    description: "Lãi suất thấp từ 18%/năm, hạn mức đến 300 triệu, thủ tục 100% online"
  },
  {
    id: "cc-thefirst",
    name: "Thẻ tín dụng THE FIRST",
    type: "credit_card",
    minIncome: 15000000,
    maxAmount: 100000000,
    description: "Rút tiền mặt 100% hạn mức, miễn lãi 45 ngày, trả góp 0%"
  },
  {
    id: "ewa-access",
    name: "EWA - Rút lương trước",
    type: "ewa",
    minIncome: 5000000,
    maxAmount: 0, // Dynamic based on earned salary
    description: "Rút lương đã kiếm trước payday, tối đa 50%, phí 3%"
  }
];

// Role types
export type UserRole = "employee" | "hr_admin" | "shinhan_admin";

// Mock HRM Data
export const MOCK_HRM_EMPLOYEES: HRMEmployee[] = [
  {
    employeeId: "EMP001",
    name: "Nguyễn Văn Minh",
    company: "Công ty TNHH ABC Việt Nam",
    department: "Kỹ thuật",
    position: "Senior Developer",
    monthlySalary: 25000000,
    bankAccount: "1234567890",
    hireDate: "2023-01-15",
    status: "active"
  },
  {
    employeeId: "EMP002",
    name: "Trần Thị Lan",
    company: "Công ty TNHH ABC Việt Nam",
    department: "Kinh doanh",
    position: "Sales Manager",
    monthlySalary: 18000000,
    bankAccount: "2345678901",
    hireDate: "2022-06-01",
    status: "active"
  },
  {
    employeeId: "EMP003",
    name: "Lê Hoàng Nam",
    company: "Công ty TNHH ABC Việt Nam",
    department: "Tài chính",
    position: "Finance Director",
    monthlySalary: 35000000,
    bankAccount: "3456789012",
    hireDate: "2021-03-10",
    status: "active"
  },
  {
    employeeId: "EMP004",
    name: "Phạm Minh Tú",
    company: "Công ty TNHH ABC Việt Nam",
    department: "Marketing",
    position: "Marketing Lead",
    monthlySalary: 22000000,
    bankAccount: "4567890123",
    hireDate: "2023-09-01",
    status: "active"
  },
  {
    employeeId: "EMP005",
    name: "Võ Thanh Hoa",
    company: "Công ty TNHH ABC Việt Nam",
    department: "HR",
    position: "HR Manager",
    monthlySalary: 28000000,
    bankAccount: "5678901234",
    hireDate: "2022-01-20",
    status: "active"
  }
];
