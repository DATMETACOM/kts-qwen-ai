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

// Company Types
export type CompanyType = "TNHH" | "TNHH MTV" | "Cổ phần" | "Nhà nước";

// Mock Companies Data
export interface CompanyData {
  id: string;
  name: string;
  type: CompanyType;
  taxCode: string;
  employeeCount: number;
  industry: string;
  city: string;
  ewaEnabled: boolean;
  loanEnabled: boolean;
  registeredDate: string;
  healthScore: number;
  ewaVolume: number;
  loanVolume: number;
  nplRate: number;
  avgSalary: number;
}

export const MOCK_COMPANIES: CompanyData[] = [
  {
    id: "C001",
    name: "Công ty TNHH Sản xuất Thương mại Minh Phát",
    type: "TNHH",
    taxCode: "0101234567",
    employeeCount: 15,
    industry: "Sản xuất - Thương mại",
    city: "Hồ Chí Minh",
    ewaEnabled: true,
    loanEnabled: true,
    registeredDate: "2018-03-15",
    healthScore: 82,
    ewaVolume: 450000000,
    loanVolume: 850000000,
    nplRate: 0.8,
    avgSalary: 12000000
  },
  {
    id: "C002",
    name: "Công ty TNHH Một thành viên Logistics Vạn Xuân",
    type: "TNHH MTV",
    taxCode: "0102345678",
    employeeCount: 28,
    industry: "Vận tải - Logistics",
    city: "Hà Nội",
    ewaEnabled: true,
    loanEnabled: true,
    registeredDate: "2016-07-22",
    healthScore: 75,
    ewaVolume: 680000000,
    loanVolume: 1200000000,
    nplRate: 1.2,
    avgSalary: 15000000
  },
  {
    id: "C003",
    name: "Công ty Cổ phần Xây dựng và Phát triển Hạ tầng Đại Nam",
    type: "Cổ phần",
    taxCode: "0103456789",
    employeeCount: 42,
    industry: "Xây dựng - Hạ tầng",
    city: "Đà Nẵng",
    ewaEnabled: true,
    loanEnabled: true,
    registeredDate: "2014-11-08",
    healthScore: 68,
    ewaVolume: 920000000,
    loanVolume: 2100000000,
    nplRate: 1.8,
    avgSalary: 18000000
  },
  {
    id: "C004",
    name: "Công ty Cổ phần Công nghệ Thông tin Việt Số",
    type: "Cổ phần",
    taxCode: "0104567890",
    employeeCount: 35,
    industry: "CNTT - Phần mềm",
    city: "Hồ Chí Minh",
    ewaEnabled: true,
    loanEnabled: true,
    registeredDate: "2019-05-30",
    healthScore: 91,
    ewaVolume: 1200000000,
    loanVolume: 2800000000,
    nplRate: 0.3,
    avgSalary: 25000000
  },
  {
    id: "C005",
    name: "Tổng Công ty Cổ phần Dịch vụ Tổng hợp Quốc gia",
    type: "Cổ phần",
    taxCode: "0105678901",
    employeeCount: 50,
    industry: "Dịch vụ - Tổng hợp",
    city: "Hà Nội",
    ewaEnabled: true,
    loanEnabled: true,
    registeredDate: "2012-02-14",
    healthScore: 78,
    ewaVolume: 1500000000,
    loanVolume: 3500000000,
    nplRate: 1.1,
    avgSalary: 22000000
  }
];

// Mock HRM Data - Updated with company assignments
export const MOCK_HRM_EMPLOYEES: HRMEmployee[] = [
  // Công ty C001 - Minh Phát (15 nhân viên)
  { employeeId: "EMP001", name: "Nguyễn Văn Minh", company: "C001", department: "Kỹ thuật", position: "Senior Developer", monthlySalary: 25000000, bankAccount: "1001234567890", hireDate: "2023-01-15", status: "active" },
  { employeeId: "EMP002", name: "Trần Thị Lan", company: "C001", department: "Kinh doanh", position: "Sales Manager", monthlySalary: 18000000, bankAccount: "1001234567891", hireDate: "2022-06-01", status: "active" },
  { employeeId: "EMP003", name: "Lê Hoàng Nam", company: "C001", department: "Tài chính", position: "Finance Director", monthlySalary: 35000000, bankAccount: "1001234567892", hireDate: "2021-03-10", status: "active" },
  { employeeId: "EMP004", name: "Phạm Minh Tú", company: "C001", department: "Marketing", position: "Marketing Lead", monthlySalary: 22000000, bankAccount: "1001234567893", hireDate: "2023-09-01", status: "active" },
  { employeeId: "EMP005", name: "Võ Thanh Hoa", company: "C001", department: "HR", position: "HR Manager", monthlySalary: 28000000, bankAccount: "1001234567894", hireDate: "2022-01-20", status: "active" },
  { employeeId: "EMP006", name: "Đặng Quốc Trung", company: "C001", department: "Kỹ thuật", position: "Junior Developer", monthlySalary: 12000000, bankAccount: "1001234567895", hireDate: "2024-03-01", status: "active" },
  { employeeId: "EMP007", name: "Bùi Thị Hương", company: "C001", department: "Kế toán", position: "Accountant", monthlySalary: 15000000, bankAccount: "1001234567896", hireDate: "2023-06-15", status: "active" },
  { employeeId: "EMP008", name: "Hoàng Văn Đức", company: "C001", department: "Kinh doanh", position: "Sales Executive", monthlySalary: 10000000, bankAccount: "1001234567897", hireDate: "2024-01-10", status: "active" },
  { employeeId: "EMP009", name: "Ngô Thị Mai", company: "C001", department: "Hành chính", position: "Admin Staff", monthlySalary: 9000000, bankAccount: "1001234567898", hireDate: "2023-08-20", status: "active" },
  { employeeId: "EMP010", name: "Trịnh Văn Hùng", company: "C001", department: "Kỹ thuật", position: "DevOps Engineer", monthlySalary: 20000000, bankAccount: "1001234567899", hireDate: "2022-11-01", status: "active" },
  { employeeId: "EMP011", name: "Lý Thị Thu", company: "C001", department: "Kinh doanh", position: "Sales Associate", monthlySalary: 8500000, bankAccount: "1001234567900", hireDate: "2024-02-15", status: "active" },
  { employeeId: "EMP012", name: "Vũ Minh Tuấn", company: "C001", department: "Kỹ thuật", position: "QA Engineer", monthlySalary: 14000000, bankAccount: "1001234567901", hireDate: "2023-04-01", status: "active" },
  { employeeId: "EMP013", name: "Phan Thị Lan", company: "C001", department: "Marketing", position: "Content Writer", monthlySalary: 11000000, bankAccount: "1001234567902", hireDate: "2023-10-01", status: "active" },
  { employeeId: "EMP014", name: "Đỗ Văn Thành", company: "C001", department: "Kho vận", position: "Warehouse Manager", monthlySalary: 13000000, bankAccount: "1001234567903", hireDate: "2022-08-01", status: "active" },
  { employeeId: "EMP015", name: "Trương Thị Yến", company: "C001", department: "Kế toán", position: "Senior Accountant", monthlySalary: 18000000, bankAccount: "1001234567904", hireDate: "2021-05-01", status: "active" },

  // Công ty C002 - Vạn Xuân Logistics (28 nhân viên)
  { employeeId: "EMP016", name: "Nguyễn Đình Bảo", company: "C002", department: "Điều hành", position: "Operations Director", monthlySalary: 40000000, bankAccount: "1002234567890", hireDate: "2020-02-01", status: "active" },
  { employeeId: "EMP017", name: "Trần Thu Hà", company: "C002", department: "Quản lý", position: "Branch Manager", monthlySalary: 30000000, bankAccount: "1002234567891", hireDate: "2021-04-15", status: "active" },
  { employeeId: "EMP018", name: "Lê Minh Khoa", company: "C002", department: "Vận tải", position: "Fleet Manager", monthlySalary: 22000000, bankAccount: "1002234567892", hireDate: "2022-01-10", status: "active" },
  { employeeId: "EMP019", name: "Phạm Thị Ngọc", company: "C002", department: "Kế toán", position: "Chief Accountant", monthlySalary: 25000000, bankAccount: "1002234567893", hireDate: "2021-07-01", status: "active" },
  { employeeId: "EMP020", name: "Hoàng Văn Sơn", company: "C002", department: "Vận tải", position: "Driver Lead", monthlySalary: 12000000, bankAccount: "1002234567894", hireDate: "2023-03-01", status: "active" },
  { employeeId: "EMP021", name: "Đặng Thị Thu", company: "C002", department: "Hành chính", position: "Admin Manager", monthlySalary: 16000000, bankAccount: "1002234567895", hireDate: "2022-05-01", status: "active" },
  { employeeId: "EMP022", name: "Ngô Quang Hùng", company: "C002", department: "Vận tải", position: "Driver", monthlySalary: 10000000, bankAccount: "1002234567896", hireDate: "2023-08-01", status: "active" },
  { employeeId: "EMP023", name: "Bùi Văn Minh", company: "C002", department: "Vận tải", position: "Driver", monthlySalary: 9500000, bankAccount: "1002234567897", hireDate: "2024-01-01", status: "active" },
  { employeeId: "EMP024", name: "Trịnh Thị Hồng", company: "C002", department: "Kinh doanh", position: "Sales Coordinator", monthlySalary: 14000000, bankAccount: "1002234567898", hireDate: "2022-09-01", status: "active" },
  { employeeId: "EMP025", name: "Vũ Thị Mai", company: "C002", department: "Kho vận", position: "Warehouse Supervisor", monthlySalary: 11000000, bankAccount: "1002234567899", hireDate: "2023-02-01", status: "active" },
  { employeeId: "EMP026", name: "Đỗ Quang Vinh", company: "C002", department: "Vận tải", position: "Driver", monthlySalary: 9800000, bankAccount: "1002234567900", hireDate: "2023-06-01", status: "active" },
  { employeeId: "EMP027", name: "Lý Văn Tuấn", company: "C002", department: "Kỹ thuật", position: "IT Support", monthlySalary: 15000000, bankAccount: "1002234567901", hireDate: "2022-11-01", status: "active" },
  { employeeId: "EMP028", name: "Phan Minh Đức", company: "C002", department: "Vận tải", position: "Dispatcher", monthlySalary: 11000000, bankAccount: "1002234567902", hireDate: "2023-04-01", status: "active" },
  { employeeId: "EMP029", name: "Trần Văn Phong", company: "C002", department: "Vận tải", position: "Driver", monthlySalary: 10500000, bankAccount: "1002234567903", hireDate: "2023-09-01", status: "active" },
  { employeeId: "EMP030", name: "Lê Thị Hương", company: "C002", department: "Kinh doanh", position: "Sales Executive", monthlySalary: 13000000, bankAccount: "1002234567904", hireDate: "2022-07-01", status: "active" },
  { employeeId: "EMP031", name: "Nguyễn Văn Hùng", company: "C002", department: "Kho vận", position: "Warehouse Staff", monthlySalary: 8000000, bankAccount: "1002234567905", hireDate: "2024-02-01", status: "active" },
  { employeeId: "EMP032", name: "Hoàng Thị Lan", company: "C002", department: "Hành chính", position: "Receptionist", monthlySalary: 7500000, bankAccount: "1002234567906", hireDate: "2023-11-01", status: "active" },
  { employeeId: "EMP033", name: "Đặng Văn Minh", company: "C002", department: "Vận tải", position: "Driver", monthlySalary: 9200000, bankAccount: "1002234567907", hireDate: "2024-01-15", status: "active" },
  { employeeId: "EMP034", name: "Ngô Quốc Trung", company: "C002", department: "Vận tải", position: "Driver", monthlySalary: 10000000, bankAccount: "1002234567908", hireDate: "2023-05-01", status: "active" },
  { employeeId: "EMP035", name: "Bùi Thị Yến", company: "C002", department: "Kế toán", position: "Junior Accountant", monthlySalary: 10000000, bankAccount: "1002234567909", hireDate: "2023-07-01", status: "active" },
  { employeeId: "EMP036", name: "Trịnh Văn Đạt", company: "C002", department: "Vận tải", position: "Driver", monthlySalary: 9500000, bankAccount: "1002234567910", hireDate: "2023-10-01", status: "active" },
  { employeeId: "EMP037", name: "Vũ Minh Quang", company: "C002", department: "Kỹ thuật", position: "Mechanic", monthlySalary: 11000000, bankAccount: "1002234567911", hireDate: "2022-12-01", status: "active" },
  { employeeId: "EMP038", name: "Đỗ Thị Hoa", company: "C002", department: "Kinh doanh", position: "Customer Service", monthlySalary: 9000000, bankAccount: "1002234567912", hireDate: "2023-12-01", status: "active" },
  { employeeId: "EMP039", name: "Lý Văn Hùng", company: "C002", department: "Vận tải", position: "Driver", monthlySalary: 9800000, bankAccount: "1002234567913", hireDate: "2023-03-01", status: "active" },
  { employeeId: "EMP040", name: "Phan Văn Tuấn", company: "C002", department: "Vận tải", position: "Driver", monthlySalary: 10200000, bankAccount: "1002234567914", hireDate: "2023-01-01", status: "active" },
  { employeeId: "EMP041", name: "Trần Minh Tuấn", company: "C002", department: "Kho vận", position: "Warehouse Staff", monthlySalary: 8500000, bankAccount: "1002234567915", hireDate: "2024-01-20", status: "active" },
  { employeeId: "EMP042", name: "Lê Văn Đức", company: "C002", department: "Vận tải", position: "Driver", monthlySalary: 10500000, bankAccount: "1002234567916", hireDate: "2023-04-01", status: "active" },
  { employeeId: "EMP043", name: "Nguyễn Thị Thu", company: "C002", department: "Hành chính", position: "HR Staff", monthlySalary: 10000000, bankAccount: "1002234567917", hireDate: "2023-02-15", status: "active" },

  // Công ty C003 - Đại Nam (42 nhân viên)
  { employeeId: "EMP044", name: "Nguyễn Trọng Nghĩa", company: "C003", department: "Ban Giám đốc", position: "CEO", monthlySalary: 80000000, bankAccount: "100334567890", hireDate: "2014-11-08", status: "active" },
  { employeeId: "EMP045", name: "Trần Hữu Phúc", company: "C003", department: "Ban Giám đốc", position: "CFO", monthlySalary: 55000000, bankAccount: "100334567891", hireDate: "2015-01-01", status: "active" },
  { employeeId: "EMP046", name: "Lê Đình Tuấn", company: "C003", department: "Kỹ thuật", position: "Technical Director", monthlySalary: 45000000, bankAccount: "100334567892", hireDate: "2016-03-01", status: "active" },
  { employeeId: "EMP047", name: "Phạm Văn Minh", company: "C003", department: "Kinh doanh", position: "Sales Director", monthlySalary: 40000000, bankAccount: "100334567893", hireDate: "2017-02-01", status: "active" },
  { employeeId: "EMP048", name: "Hoàng Thị Hương", company: "C003", department: "HR", position: "HR Director", monthlySalary: 35000000, bankAccount: "100334567894", hireDate: "2016-08-01", status: "active" },
  { employeeId: "EMP049", name: "Đặng Văn Hùng", company: "C003", department: "Kỹ thuật", position: "Site Manager", monthlySalary: 30000000, bankAccount: "100334567895", hireDate: "2017-05-01", status: "active" },
  { employeeId: "EMP050", name: "Ngô Thị Thu", company: "C003", department: "Kế toán", position: "Chief Accountant", monthlySalary: 28000000, bankAccount: "100334567896", hireDate: "2017-06-01", status: "active" },
  { employeeId: "EMP051", name: "Bùi Minh Đức", company: "C003", department: "Kỹ thuật", position: "Project Manager", monthlySalary: 26000000, bankAccount: "100334567897", hireDate: "2018-03-01", status: "active" },
  { employeeId: "EMP052", name: "Trịnh Văn Tuấn", company: "C003", department: "Kỹ thuật", position: "Site Manager", monthlySalary: 25000000, bankAccount: "100334567898", hireDate: "2018-06-01", status: "active" },
  { employeeId: "EMP053", name: "Vũ Thị Lan", company: "C003", department: "Kinh doanh", position: "Sales Manager", monthlySalary: 22000000, bankAccount: "100334567899", hireDate: "2019-01-01", status: "active" },
  { employeeId: "EMP054", name: "Đỗ Quang Huy", company: "C003", department: "Kỹ thuật", position: "Civil Engineer", monthlySalary: 20000000, bankAccount: "100334567900", hireDate: "2019-04-01", status: "active" },
  { employeeId: "EMP055", name: "Lý Văn Đức", company: "C003", department: "Kỹ thuật", position: "Site Supervisor", monthlySalary: 18000000, bankAccount: "100334567901", hireDate: "2019-07-01", status: "active" },
  { employeeId: "EMP056", name: "Phan Minh Tuấn", company: "C003", department: "Kỹ thuật", position: "Civil Engineer", monthlySalary: 19000000, bankAccount: "100334567902", hireDate: "2019-09-01", status: "active" },
  { employeeId: "EMP057", name: "Trần Văn Phong", company: "C003", department: "Kỹ thuật", position: "Quantity Surveyor", monthlySalary: 17000000, bankAccount: "100334567903", hireDate: "2020-01-01", status: "active" },
  { employeeId: "EMP058", name: "Lê Quang Vinh", company: "C003", department: "Kỹ thuật", position: "Safety Officer", monthlySalary: 15000000, bankAccount: "100334567904", hireDate: "2020-03-01", status: "active" },
  { employeeId: "EMP059", name: "Nguyễn Văn Hùng", company: "C003", department: "Kỹ thuật", position: "Site Supervisor", monthlySalary: 16000000, bankAccount: "100334567905", hireDate: "2020-05-01", status: "active" },
  { employeeId: "EMP060", name: "Hoàng Văn Minh", company: "C003", department: "Kỹ thuật", position: "Electric Engineer", monthlySalary: 18000000, bankAccount: "100334567906", hireDate: "2020-07-01", status: "active" },
  { employeeId: "EMP061", name: "Đặng Thị Mai", company: "C003", department: "Kế toán", position: "Senior Accountant", monthlySalary: 20000000, bankAccount: "100334567907", hireDate: "2020-09-01", status: "active" },
  { employeeId: "EMP062", name: "Ngô Quốc Trung", company: "C003", department: "Kỹ thuật", position: "Mechanical Engineer", monthlySalary: 17000000, bankAccount: "100334567908", hireDate: "2021-01-01", status: "active" },
  { employeeId: "EMP063", name: "Bùi Thị Hương", company: "C003", department: "HR", position: "HR Manager", monthlySalary: 18000000, bankAccount: "100334567909", hireDate: "2021-03-01", status: "active" },
  { employeeId: "EMP064", name: "Trịnh Minh Tuấn", company: "C003", department: "Kinh doanh", position: "Sales Engineer", monthlySalary: 15000000, bankAccount: "100334567910", hireDate: "2021-05-01", status: "active" },
  { employeeId: "EMP065", name: "Vũ Văn Đức", company: "C003", department: "Kỹ thuật", position: "Site Engineer", monthlySalary: 14000000, bankAccount: "100334567911", hireDate: "2021-07-01", status: "active" },
  { employeeId: "EMP066", name: "Đỗ Văn Hùng", company: "C003", department: "Kỹ thuật", position: "Architect", monthlySalary: 20000000, bankAccount: "100334567912", hireDate: "2021-09-01", status: "active" },
  { employeeId: "EMP067", name: "Lý Thị Lan", company: "C003", department: "Kinh doanh", position: "Sales Executive", monthlySalary: 12000000, bankAccount: "100334567913", hireDate: "2022-01-01", status: "active" },
  { employeeId: "EMP068", name: "Phan Văn Tuấn", company: "C003", department: "Kỹ thuật", position: "Site Engineer", monthlySalary: 13000000, bankAccount: "100334567914", hireDate: "2022-03-01", status: "active" },
  { employeeId: "EMP069", name: "Trần Văn Minh", company: "C003", department: "Kỹ thuật", position: "CAD Designer", monthlySalary: 12000000, bankAccount: "100334567915", hireDate: "2022-05-01", status: "active" },
  { employeeId: "EMP070", name: "Lê Văn Phong", company: "C003", department: "Kỹ thuật", position: "Site Supervisor", monthlySalary: 15000000, bankAccount: "100334567916", hireDate: "2022-07-01", status: "active" },
  { employeeId: "EMP071", name: "Nguyễn Thị Thu", company: "C003", department: "Hành chính", position: "Admin Staff", monthlySalary: 9000000, bankAccount: "100334567917", hireDate: "2022-09-01", status: "active" },
  { employeeId: "EMP072", name: "Hoàng Quang Huy", company: "C003", department: "Kỹ thuật", position: "Site Engineer", monthlySalary: 12500000, bankAccount: "100334567918", hireDate: "2022-11-01", status: "active" },
  { employeeId: "EMP073", name: "Đặng Văn Đức", company: "C003", department: "Kỹ thuật", position: "Site Supervisor", monthlySalary: 14500000, bankAccount: "100334567919", hireDate: "2023-01-01", status: "active" },
  { employeeId: "EMP074", name: "Ngô Minh Tuấn", company: "C003", department: "Kỹ thuật", position: "Civil Engineer", monthlySalary: 15500000, bankAccount: "100334567920", hireDate: "2023-03-01", status: "active" },
  { employeeId: "EMP075", name: "Bùi Văn Hùng", company: "C003", department: "Kỹ thuật", position: "Safety Officer", monthlySalary: 13000000, bankAccount: "100334567921", hireDate: "2023-05-01", status: "active" },
  { employeeId: "EMP076", name: "Trịnh Thị Mai", company: "C003", department: "Kế toán", position: "Junior Accountant", monthlySalary: 10000000, bankAccount: "100334567922", hireDate: "2023-07-01", status: "active" },
  { employeeId: "EMP077", name: "Vũ Quang Vinh", company: "C003", department: "Kỹ thuật", position: "Project Coordinator", monthlySalary: 14000000, bankAccount: "100334567923", hireDate: "2023-09-01", status: "active" },
  { employeeId: "EMP078", name: "Đỗ Văn Tuấn", company: "C003", department: "Kỹ thuật", position: "Site Engineer", monthlySalary: 12000000, bankAccount: "100334567924", hireDate: "2024-01-01", status: "active" },
  { employeeId: "EMP079", name: "Lý Văn Đức", company: "C003", department: "Kỹ thuật", position: "Junior Engineer", monthlySalary: 10000000, bankAccount: "100334567925", hireDate: "2024-02-01", status: "active" },
  { employeeId: "EMP080", name: "Phan Thị Hương", company: "C003", department: "HR", position: "HR Staff", monthlySalary: 9000000, bankAccount: "100334567926", hireDate: "2024-03-01", status: "active" },
  { employeeId: "EMP081", name: "Trần Văn Hùng", company: "C003", department: "Kỹ thuật", position: "Site Supervisor", monthlySalary: 13500000, bankAccount: "100334567927", hireDate: "2024-04-01", status: "active" },
  { employeeId: "EMP082", name: "Lê Minh Đức", company: "C003", department: "Kỹ thuật", position: "Junior Engineer", monthlySalary: 9500000, bankAccount: "100334567928", hireDate: "2024-05-01", status: "active" },
  { employeeId: "EMP083", name: "Nguyễn Văn Tuấn", company: "C003", department: "Hành chính", position: "Office Manager", monthlySalary: 12000000, bankAccount: "100334567929", hireDate: "2023-11-01", status: "active" },
  { employeeId: "EMP084", name: "Hoàng Văn Đức", company: "C003", department: "Kỹ thuật", position: "Safety Officer", monthlySalary: 11000000, bankAccount: "100334567930", hireDate: "2024-01-15", status: "active" },
  { employeeId: "EMP085", name: "Đặng Thị Lan", company: "C003", department: "Kế toán", position: "Accountant", monthlySalary: 11000000, bankAccount: "100334567931", hireDate: "2023-10-01", status: "active" },

  // Công ty C004 - Việt Số (35 nhân viên)
  { employeeId: "EMP086", name: "Trần Đình Minh", company: "C004", department: "Ban Giám đốc", position: "CEO", monthlySalary: 120000000, bankAccount: "100445678901", hireDate: "2019-05-30", status: "active" },
  { employeeId: "EMP087", name: "Nguyễn Thu Hà", company: "C004", department: "Ban Giám đốc", position: "CTO", monthlySalary: 90000000, bankAccount: "100445678902", hireDate: "2019-06-01", status: "active" },
  { employeeId: "EMP088", name: "Lê Hoàng Sơn", company: "C004", department: "Ban Giám đốc", position: "CPO", monthlySalary: 85000000, bankAccount: "100445678903", hireDate: "2019-07-01", status: "active" },
  { employeeId: "EMP089", name: "Phạm Quốc Cường", company: "C004", department: "Engineering", position: "Engineering Director", monthlySalary: 70000000, bankAccount: "100445678904", hireDate: "2020-01-01", status: "active" },
  { employeeId: "EMP090", name: "Hoàng Minh Tuấn", company: "C004", department: "Product", position: "Product Director", monthlySalary: 65000000, bankAccount: "100445678905", hireDate: "2020-02-01", status: "active" },
  { employeeId: "EMP091", name: "Đặng Thị Lan Anh", company: "C004", department: "HR", position: "HR Manager", monthlySalary: 40000000, bankAccount: "100445678906", hireDate: "2020-04-01", status: "active" },
  { employeeId: "EMP092", name: "Ngô Văn Hùng", company: "C004", department: "Engineering", position: "Tech Lead", monthlySalary: 50000000, bankAccount: "100445678907", hireDate: "2020-06-01", status: "active" },
  { employeeId: "EMP093", name: "Bùi Thị Mai", company: "C004", department: "Engineering", position: "Tech Lead", monthlySalary: 48000000, bankAccount: "100445678908", hireDate: "2020-07-01", status: "active" },
  { employeeId: "EMP094", name: "Trịnh Văn Đức", company: "C004", department: "Engineering", position: "Senior Developer", monthlySalary: 40000000, bankAccount: "100445678909", hireDate: "2020-09-01", status: "active" },
  { employeeId: "EMP095", name: "Vũ Hoàng Nam", company: "C004", department: "Product", position: "Product Manager", monthlySalary: 45000000, bankAccount: "100445678910", hireDate: "2020-10-01", status: "active" },
  { employeeId: "EMP096", name: "Đỗ Minh Tuấn", company: "C004", department: "Engineering", position: "Senior Developer", monthlySalary: 38000000, bankAccount: "100445678911", hireDate: "2021-01-01", status: "active" },
  { employeeId: "EMP097", name: "Lý Thị Thu", company: "C004", department: "Engineering", position: "Senior Developer", monthlySalary: 36000000, bankAccount: "100445678912", hireDate: "2021-02-01", status: "active" },
  { employeeId: "EMP098", name: "Phan Văn Sơn", company: "C004", department: "Engineering", position: "Full-stack Developer", monthlySalary: 30000000, bankAccount: "100445678913", hireDate: "2021-04-01", status: "active" },
  { employeeId: "EMP099", name: "Trần Văn Phong", company: "C004", department: "Engineering", position: "Full-stack Developer", monthlySalary: 28000000, bankAccount: "100445678914", hireDate: "2021-05-01", status: "active" },
  { employeeId: "EMP100", name: "Lê Quang Huy", company: "C004", department: "Engineering", position: "Frontend Developer", monthlySalary: 25000000, bankAccount: "100445678915", hireDate: "2021-07-01", status: "active" },
  { employeeId: "EMP101", name: "Nguyễn Hữu Trung", company: "C004", department: "Engineering", position: "Backend Developer", monthlySalary: 28000000, bankAccount: "100445678916", hireDate: "2021-08-01", status: "active" },
  { employeeId: "EMP102", name: "Hoàng Đình Minh", company: "C004", department: "Engineering", position: "DevOps Engineer", monthlySalary: 35000000, bankAccount: "100445678917", hireDate: "2021-09-01", status: "active" },
  { employeeId: "EMP103", name: "Đặng Văn Tuấn", company: "C004", department: "QA", position: "QA Lead", monthlySalary: 32000000, bankAccount: "100445678918", hireDate: "2021-10-01", status: "active" },
  { employeeId: "EMP104", name: "Ngô Minh Đức", company: "C004", department: "Engineering", position: "Frontend Developer", monthlySalary: 24000000, bankAccount: "100445678919", hireDate: "2022-01-01", status: "active" },
  { employeeId: "EMP105", name: "Bùi Văn Hùng", company: "C004", department: "Engineering", position: "Backend Developer", monthlySalary: 26000000, bankAccount: "100445678920", hireDate: "2022-02-01", status: "active" },
  { employeeId: "EMP106", name: "Trịnh Thị Lan", company: "C004", department: "Product", position: "UX Designer", monthlySalary: 28000000, bankAccount: "100445678921", hireDate: "2022-04-01", status: "active" },
  { employeeId: "EMP107", name: "Vũ Quốc Trung", company: "C004", department: "Engineering", position: "Junior Developer", monthlySalary: 18000000, bankAccount: "100445678922", hireDate: "2022-06-01", status: "active" },
  { employeeId: "EMP108", name: "Đỗ Hoàng Nam", company: "C004", department: "QA", position: "QA Engineer", monthlySalary: 20000000, bankAccount: "100445678923", hireDate: "2022-08-01", status: "active" },
  { employeeId: "EMP109", name: "Lý Văn Minh", company: "C004", department: "Engineering", position: "Junior Developer", monthlySalary: 16000000, bankAccount: "100445678924", hireDate: "2022-10-01", status: "active" },
  { employeeId: "EMP110", name: "Phan Thị Mai", company: "C004", department: "Product", position: "UI Designer", monthlySalary: 22000000, bankAccount: "100445678925", hireDate: "2023-01-01", status: "active" },
  { employeeId: "EMP111", name: "Trần Minh Tuấn", company: "C004", department: "Engineering", position: "Junior Developer", monthlySalary: 15000000, bankAccount: "100445678926", hireDate: "2023-03-01", status: "active" },
  { employeeId: "EMP112", name: "Lê Văn Đức", company: "C004", department: "Engineering", position: "Junior Developer", monthlySalary: 14500000, bankAccount: "100445678927", hireDate: "2023-05-01", status: "active" },
  { employeeId: "EMP113", name: "Nguyễn Thị Thu", company: "C004", department: "HR", position: "HR Staff", monthlySalary: 15000000, bankAccount: "100445678928", hireDate: "2023-07-01", status: "active" },
  { employeeId: "EMP114", name: "Hoàng Văn Phong", company: "C004", department: "Engineering", position: "Junior Developer", monthlySalary: 14000000, bankAccount: "100445678929", hireDate: "2023-09-01", status: "active" },
  { employeeId: "EMP115", name: "Đặng Quang Vinh", company: "C004", department: "Engineering", position: "Junior Developer", monthlySalary: 13500000, bankAccount: "100445678930", hireDate: "2023-11-01", status: "active" },
  { employeeId: "EMP116", name: "Ngô Văn Tuấn", company: "C004", department: "QA", position: "QA Engineer", monthlySalary: 18000000, bankAccount: "100445678931", hireDate: "2024-01-01", status: "active" },
  { employeeId: "EMP117", name: "Bùi Minh Hùng", company: "C004", department: "Engineering", position: "Intern Developer", monthlySalary: 8000000, bankAccount: "100445678932", hireDate: "2024-02-01", status: "active" },
  { employeeId: "EMP118", name: "Trịnh Văn Sơn", company: "C004", department: "Engineering", position: "Intern Developer", monthlySalary: 7500000, bankAccount: "100445678933", hireDate: "2024-03-01", status: "active" },
  { employeeId: "EMP119", name: "Vũ Thị Hương", company: "C004", department: "Kế toán", position: "Accountant", monthlySalary: 18000000, bankAccount: "100445678934", hireDate: "2022-05-01", status: "active" },
  { employeeId: "EMP120", name: "Đỗ Văn Hùng", company: "C004", department: "Engineering", position: "Junior Developer", monthlySalary: 13000000, bankAccount: "100445678935", hireDate: "2024-04-01", status: "active" },

  // Công ty C005 - Dịch vụ Tổng hợp Quốc gia (50 nhân viên)
  { employeeId: "EMP121", name: "Nguyễn Trọng Đức", company: "C005", department: "Ban Giám đốc", position: "CEO", monthlySalary: 100000000, bankAccount: "100556789012", hireDate: "2012-02-14", status: "active" },
  { employeeId: "EMP122", name: "Trần Hữu Minh", company: "C005", department: "Ban Giám đốc", position: "CFO", monthlySalary: 75000000, bankAccount: "100556789013", hireDate: "2013-01-01", status: "active" },
  { employeeId: "EMP123", name: "Lê Đình Sơn", company: "C005", department: "Ban Giám đốc", position: "COO", monthlySalary: 70000000, bankAccount: "100556789014", hireDate: "2014-03-01", status: "active" },
  { employeeId: "EMP124", name: "Phạm Văn Hùng", company: "C005", department: "Kinh doanh", position: "Sales Director", monthlySalary: 50000000, bankAccount: "100556789015", hireDate: "2015-06-01", status: "active" },
  { employeeId: "EMP125", name: "Hoàng Thị Lan", company: "C005", department: "HR", position: "HR Director", monthlySalary: 45000000, bankAccount: "100556789016", hireDate: "2015-09-01", status: "active" },
  { employeeId: "EMP126", name: "Đặng Quốc Trung", company: "C005", department: "Vận hành", position: "Operations Director", monthlySalary: 55000000, bankAccount: "100556789017", hireDate: "2016-01-01", status: "active" },
  { employeeId: "EMP127", name: "Ngô Minh Tuấn", company: "C005", department: "Tài chính", position: "Finance Manager", monthlySalary: 40000000, bankAccount: "100556789018", hireDate: "2016-05-01", status: "active" },
  { employeeId: "EMP128", name: "Bùi Văn Đức", company: "C005", department: "Kinh doanh", position: "Sales Manager", monthlySalary: 35000000, bankAccount: "100556789019", hireDate: "2017-02-01", status: "active" },
  { employeeId: "EMP129", name: "Trịnh Thị Thu", company: "C005", department: "Kế toán", position: "Chief Accountant", monthlySalary: 38000000, bankAccount: "100556789020", hireDate: "2017-06-01", status: "active" },
  { employeeId: "EMP130", name: "Vũ Hoàng Nam", company: "C005", department: "Vận hành", position: "Operations Manager", monthlySalary: 32000000, bankAccount: "100556789021", hireDate: "2018-01-01", status: "active" },
  { employeeId: "EMP131", name: "Đỗ Văn Phong", company: "C005", department: "Kinh doanh", position: "Sales Manager", monthlySalary: 30000000, bankAccount: "100556789022", hireDate: "2018-04-01", status: "active" },
  { employeeId: "EMP132", name: "Lý Thị Mai", company: "C005", department: "HR", position: "HR Manager", monthlySalary: 28000000, bankAccount: "100556789023", hireDate: "2018-07-01", status: "active" },
  { employeeId: "EMP133", name: "Phan Văn Tuấn", company: "C005", department: "Kỹ thuật", position: "IT Manager", monthlySalary: 35000000, bankAccount: "100556789024", hireDate: "2019-01-01", status: "active" },
  { employeeId: "EMP134", name: "Trần Văn Hùng", company: "C005", department: "Kinh doanh", position: "Sales Team Lead", monthlySalary: 25000000, bankAccount: "100556789025", hireDate: "2019-04-01", status: "active" },
  { employeeId: "EMP135", name: "Lê Quang Vinh", company: "C005", department: "Vận hành", position: "Supervisor", monthlySalary: 22000000, bankAccount: "100556789026", hireDate: "2019-07-01", status: "active" },
  { employeeId: "EMP136", name: "Nguyễn Hữu Đức", company: "C005", department: "Kinh doanh", position: "Sales Executive", monthlySalary: 18000000, bankAccount: "100556789027", hireDate: "2020-01-01", status: "active" },
  { employeeId: "EMP137", name: "Hoàng Văn Minh", company: "C005", department: "Kỹ thuật", position: "IT Support", monthlySalary: 20000000, bankAccount: "100556789028", hireDate: "2020-03-01", status: "active" },
  { employeeId: "EMP138", name: "Đặng Thị Hương", company: "C005", department: "Kế toán", position: "Senior Accountant", monthlySalary: 22000000, bankAccount: "100556789029", hireDate: "2020-05-01", status: "active" },
  { employeeId: "EMP139", name: "Ngô Văn Sơn", company: "C005", department: "Vận hành", position: "Supervisor", monthlySalary: 20000000, bankAccount: "100556789030", hireDate: "2020-08-01", status: "active" },
  { employeeId: "EMP140", name: "Bùi Minh Tuấn", company: "C005", department: "Kinh doanh", position: "Sales Executive", monthlySalary: 17000000, bankAccount: "100556789031", hireDate: "2020-10-01", status: "active" },
  { employeeId: "EMP141", name: "Trịnh Văn Đức", company: "C005", department: "Vận hành", position: "Team Lead", monthlySalary: 18000000, bankAccount: "100556789032", hireDate: "2021-01-01", status: "active" },
  { employeeId: "EMP142", name: "Vũ Thị Lan", company: "C005", department: "HR", position: "HR Staff", monthlySalary: 15000000, bankAccount: "100556789033", hireDate: "2021-03-01", status: "active" },
  { employeeId: "EMP143", name: "Đỗ Quốc Hùng", company: "C005", department: "Kinh doanh", position: "Sales Executive", monthlySalary: 16000000, bankAccount: "100556789034", hireDate: "2021-05-01", status: "active" },
  { employeeId: "EMP144", name: "Lý Văn Hùng", company: "C005", department: "Kỹ thuật", position: "IT Staff", monthlySalary: 17000000, bankAccount: "100556789035", hireDate: "2021-07-01", status: "active" },
  { employeeId: "EMP145", name: "Phan Hoàng Nam", company: "C005", department: "Vận hành", position: "Staff", monthlySalary: 14000000, bankAccount: "100556789036", hireDate: "2021-09-01", status: "active" },
  { employeeId: "EMP146", name: "Trần Văn Phong", company: "C005", department: "Kinh doanh", position: "Sales Executive", monthlySalary: 15500000, bankAccount: "100556789037", hireDate: "2021-11-01", status: "active" },
  { employeeId: "EMP147", name: "Lê Đình Minh", company: "C005", department: "Kế toán", position: "Junior Accountant", monthlySalary: 12000000, bankAccount: "100556789038", hireDate: "2022-01-01", status: "active" },
  { employeeId: "EMP148", name: "Nguyễn Văn Tuấn", company: "C005", department: "Vận hành", position: "Staff", monthlySalary: 13000000, bankAccount: "100556789039", hireDate: "2022-03-01", status: "active" },
  { employeeId: "EMP149", name: "Hoàng Quang Huy", company: "C005", department: "Kinh doanh", position: "Sales Executive", monthlySalary: 14500000, bankAccount: "100556789040", hireDate: "2022-05-01", status: "active" },
  { employeeId: "EMP150", name: "Đặng Văn Đức", company: "C005", department: "Vận hành", position: "Staff", monthlySalary: 12500000, bankAccount: "100556789041", hireDate: "2022-07-01", status: "active" },
  { employeeId: "EMP151", name: "Ngô Minh Đức", company: "C005", department: "Kỹ thuật", position: "IT Staff", monthlySalary: 15000000, bankAccount: "100556789042", hireDate: "2022-09-01", status: "active" },
  { employeeId: "EMP152", name: "Bùi Thị Thu", company: "C005", department: "Kế toán", position: "Junior Accountant", monthlySalary: 11000000, bankAccount: "100556789043", hireDate: "2022-11-01", status: "active" },
  { employeeId: "EMP153", name: "Trịnh Văn Hùng", company: "C005", department: "Kinh doanh", position: "Sales Executive", monthlySalary: 14000000, bankAccount: "100556789044", hireDate: "2023-01-01", status: "active" },
  { employeeId: "EMP154", name: "Vũ Hoàng Sơn", company: "C005", department: "Vận hành", position: "Staff", monthlySalary: 12000000, bankAccount: "100556789045", hireDate: "2023-03-01", status: "active" },
  { employeeId: "EMP155", name: "Đỗ Văn Minh", company: "C005", department: "HR", position: "HR Staff", monthlySalary: 13000000, bankAccount: "100556789046", hireDate: "2023-05-01", status: "active" },
  { employeeId: "EMP156", name: "Lý Thị Mai", company: "C005", department: "Kinh doanh", position: "Sales Executive", monthlySalary: 13500000, bankAccount: "100556789047", hireDate: "2023-07-01", status: "active" },
  { employeeId: "EMP157", name: "Phan Văn Tuấn", company: "C005", department: "Vận hành", position: "Staff", monthlySalary: 11500000, bankAccount: "100556789048", hireDate: "2023-09-01", status: "active" },
  { employeeId: "EMP158", name: "Trần Hữu Đức", company: "C005", department: "Kỹ thuật", position: "Junior IT", monthlySalary: 10000000, bankAccount: "100556789049", hireDate: "2024-01-01", status: "active" },
  { employeeId: "EMP159", name: "Lê Văn Phong", company: "C005", department: "Kinh doanh", position: "Intern", monthlySalary: 7000000, bankAccount: "100556789050", hireDate: "2024-02-01", status: "active" },
  { employeeId: "EMP160", name: "Nguyễn Thị Lan", company: "C005", department: "Hành chính", position: "Office Manager", monthlySalary: 15000000, bankAccount: "100556789051", hireDate: "2023-11-01", status: "active" },
  { employeeId: "EMP161", name: "Hoàng Văn Hùng", company: "C005", department: "Vận hành", position: "Staff", monthlySalary: 11000000, bankAccount: "100556789052", hireDate: "2024-03-01", status: "active" },
  { employeeId: "EMP162", name: "Đặng Quang Vinh", company: "C005", department: "Kinh doanh", position: "Intern", monthlySalary: 6500000, bankAccount: "100556789053", hireDate: "2024-04-01", status: "active" },
  { employeeId: "EMP163", name: "Ngô Văn Đức", company: "C005", department: "Kế toán", position: "Intern", monthlySalary: 6000000, bankAccount: "100556789054", hireDate: "2024-05-01", status: "active" },
  { employeeId: "EMP164", name: "Bùi Minh Tuấn", company: "C005", department: "Vận hành", position: "Staff", monthlySalary: 10800000, bankAccount: "100556789055", hireDate: "2024-01-15", status: "active" },
  { employeeId: "EMP165", name: "Trịnh Thị Hương", company: "C005", department: "HR", position: "Intern", monthlySalary: 5800000, bankAccount: "100556789056", hireDate: "2024-05-15", status: "active" },
  { employeeId: "EMP166", name: "Vũ Văn Sơn", company: "C005", department: "Kinh doanh", position: "Sales Executive", monthlySalary: 13000000, bankAccount: "100556789057", hireDate: "2023-10-01", status: "active" },
  { employeeId: "EMP167", name: "Đỗ Thị Lan", company: "C005", department: "Hành chính", position: "Admin Staff", monthlySalary: 9000000, bankAccount: "100556789058", hireDate: "2023-08-01", status: "active" },
  { employeeId: "EMP168", name: "Lý Văn Đức", company: "C005", department: "Vận hành", position: "Staff", monthlySalary: 10500000, bankAccount: "100556789059", hireDate: "2024-02-15", status: "active" },
  { employeeId: "EMP169", name: "Phan Thị Thu", company: "C005", department: "Kỹ thuật", position: "Junior IT", monthlySalary: 9500000, bankAccount: "100556789060", hireDate: "2024-03-15", status: "active" },
  { employeeId: "EMP170", name: "Trần Văn Minh", company: "C005", department: "Kinh doanh", position: "Sales Executive", monthlySalary: 12500000, bankAccount: "100556789061", hireDate: "2024-01-01", status: "active" }
];
