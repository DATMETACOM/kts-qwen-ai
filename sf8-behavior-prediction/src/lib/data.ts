// SF8 - Demo Data (20 customers)

import { AlternativeData, Customer, Product } from '../types'

interface ProfileSeed {
  id: string
  name: string
  age: number
  income: number
  occupation: string
}

interface RawAlternativeData {
  telco: {
    monthlySpend: number
    tenure: number
    dataUsage: number
  }
  eWallet: {
    usage: 'low' | 'medium' | 'high'
    monthlyTransactions: number
    categories: string[]
  }
  ecommerce: {
    monthlyOrders: number
    avgOrderValue: number
    categories: string[]
  }
  social: {
    interests: string[]
    activity: 'low' | 'medium' | 'high'
    postFrequency: number
  }
}

const PROFILE_SEEDS: ProfileSeed[] = [
  { id: 'c001', name: 'Nguyen Van An', age: 28, income: 15000000, occupation: 'Software Engineer' },
  { id: 'c002', name: 'Tran Thi Binh', age: 32, income: 22000000, occupation: 'Marketing Manager' },
  { id: 'c003', name: 'Le Hoang Cuong', age: 25, income: 8000000, occupation: 'Freelancer' },
  { id: 'c004', name: 'Pham Minh Dung', age: 35, income: 35000000, occupation: 'Director' },
  { id: 'c005', name: 'Hoang Van Em', age: 29, income: 12000000, occupation: 'Sales Executive' },
  { id: 'c006', name: 'Do Thi Loan', age: 27, income: 10000000, occupation: 'Office Staff' },
  { id: 'c007', name: 'Vu Quoc Huy', age: 41, income: 45000000, occupation: 'Business Owner' },
  { id: 'c008', name: 'Bui Thi Huong', age: 30, income: 18000000, occupation: 'Teacher' },
  { id: 'c009', name: 'Dinh Van Kien', age: 26, income: 9500000, occupation: 'Delivery Rider' },
  { id: 'c010', name: 'Ngo Thi Lan', age: 38, income: 28000000, occupation: 'Accountant' },
  { id: 'c011', name: 'Duong Van Manh', age: 33, income: 25000000, occupation: 'Doctor' },
  { id: 'c012', name: 'Vo Thi Nga', age: 24, income: 7000000, occupation: 'Student' },
  { id: 'c013', name: 'Ly Van Phong', age: 36, income: 32000000, occupation: 'Lawyer' },
  { id: 'c014', name: 'Hoang Thi Quynh', age: 31, income: 20000000, occupation: 'HR Specialist' },
  { id: 'c015', name: 'Truong Van Sang', age: 28, income: 13000000, occupation: 'IT Support' },
  { id: 'c016', name: 'Le Thi Thao', age: 34, income: 27000000, occupation: 'Pharmacist' },
  { id: 'c017', name: 'Nguyen Van Tu', age: 29, income: 16000000, occupation: 'Graphic Designer' },
  { id: 'c018', name: 'Pham Thi Uyen', age: 40, income: 40000000, occupation: 'CEO' },
  { id: 'c019', name: 'Vo Van Vinh', age: 27, income: 11000000, occupation: 'Content Creator' },
  { id: 'c020', name: 'Le Thi Xuan', age: 37, income: 30000000, occupation: 'Banker' }
]

const RAW_ALT_DATA: Record<string, RawAlternativeData> = {
  c001: {
    telco: { monthlySpend: 300000, tenure: 36, dataUsage: 15 },
    eWallet: { usage: 'high', monthlyTransactions: 45, categories: ['food', 'transport', 'shopping'] },
    ecommerce: { monthlyOrders: 8, avgOrderValue: 500000, categories: ['electronics', 'books'] },
    social: { interests: ['technology', 'gaming', 'travel'], activity: 'high', postFrequency: 15 }
  },
  c002: {
    telco: { monthlySpend: 450000, tenure: 48, dataUsage: 25 },
    eWallet: { usage: 'high', monthlyTransactions: 60, categories: ['food', 'travel', 'shopping', 'beauty'] },
    ecommerce: { monthlyOrders: 15, avgOrderValue: 800000, categories: ['fashion', 'cosmetics', 'home'] },
    social: { interests: ['fashion', 'travel', 'food'], activity: 'high', postFrequency: 18 }
  },
  c003: {
    telco: { monthlySpend: 200000, tenure: 12, dataUsage: 20 },
    eWallet: { usage: 'medium', monthlyTransactions: 25, categories: ['food', 'transport'] },
    ecommerce: { monthlyOrders: 5, avgOrderValue: 300000, categories: ['electronics', 'tools'] },
    social: { interests: ['technology', 'freelancing'], activity: 'medium', postFrequency: 9 }
  },
  c004: {
    telco: { monthlySpend: 600000, tenure: 72, dataUsage: 30 },
    eWallet: { usage: 'high', monthlyTransactions: 80, categories: ['business', 'travel', 'luxury'] },
    ecommerce: { monthlyOrders: 20, avgOrderValue: 2000000, categories: ['luxury', 'electronics', 'travel'] },
    social: { interests: ['business', 'golf', 'luxury'], activity: 'low', postFrequency: 4 }
  },
  c005: {
    telco: { monthlySpend: 250000, tenure: 24, dataUsage: 10 },
    eWallet: { usage: 'medium', monthlyTransactions: 30, categories: ['food', 'transport'] },
    ecommerce: { monthlyOrders: 6, avgOrderValue: 400000, categories: ['fashion', 'sport'] },
    social: { interests: ['sport', 'football'], activity: 'medium', postFrequency: 8 }
  },
  c006: {
    telco: { monthlySpend: 200000, tenure: 36, dataUsage: 8 },
    eWallet: { usage: 'low', monthlyTransactions: 15, categories: ['food', 'transport'] },
    ecommerce: { monthlyOrders: 4, avgOrderValue: 350000, categories: ['books', 'home'] },
    social: { interests: ['books', 'movies'], activity: 'low', postFrequency: 5 }
  },
  c007: {
    telco: { monthlySpend: 500000, tenure: 60, dataUsage: 20 },
    eWallet: { usage: 'high', monthlyTransactions: 50, categories: ['business', 'transport'] },
    ecommerce: { monthlyOrders: 10, avgOrderValue: 1500000, categories: ['electronics', 'office'] },
    social: { interests: ['business', 'investment'], activity: 'medium', postFrequency: 7 }
  },
  c008: {
    telco: { monthlySpend: 300000, tenure: 48, dataUsage: 12 },
    eWallet: { usage: 'medium', monthlyTransactions: 35, categories: ['food', 'education', 'books'] },
    ecommerce: { monthlyOrders: 7, avgOrderValue: 450000, categories: ['books', 'education', 'home'] },
    social: { interests: ['education', 'books', 'children'], activity: 'medium', postFrequency: 9 }
  },
  c009: {
    telco: { monthlySpend: 200000, tenure: 18, dataUsage: 15 },
    eWallet: { usage: 'high', monthlyTransactions: 55, categories: ['food', 'transport', 'shopping'] },
    ecommerce: { monthlyOrders: 4, avgOrderValue: 250000, categories: ['fashion', 'sport'] },
    social: { interests: ['sport', 'music', 'games'], activity: 'high', postFrequency: 17 }
  },
  c010: {
    telco: { monthlySpend: 350000, tenure: 60, dataUsage: 10 },
    eWallet: { usage: 'medium', monthlyTransactions: 30, categories: ['food', 'shopping'] },
    ecommerce: { monthlyOrders: 8, avgOrderValue: 600000, categories: ['home', 'fashion'] },
    social: { interests: ['cooking', 'home'], activity: 'low', postFrequency: 4 }
  },
  c011: {
    telco: { monthlySpend: 400000, tenure: 48, dataUsage: 8 },
    eWallet: { usage: 'low', monthlyTransactions: 20, categories: ['food', 'health'] },
    ecommerce: { monthlyOrders: 3, avgOrderValue: 800000, categories: ['health', 'books'] },
    social: { interests: ['health', 'medicine'], activity: 'low', postFrequency: 3 }
  },
  c012: {
    telco: { monthlySpend: 150000, tenure: 12, dataUsage: 25 },
    eWallet: { usage: 'high', monthlyTransactions: 40, categories: ['food', 'transport', 'fashion'] },
    ecommerce: { monthlyOrders: 6, avgOrderValue: 300000, categories: ['fashion', 'beauty'] },
    social: { interests: ['fashion', 'beauty', 'music'], activity: 'high', postFrequency: 21 }
  },
  c013: {
    telco: { monthlySpend: 500000, tenure: 72, dataUsage: 15 },
    eWallet: { usage: 'medium', monthlyTransactions: 35, categories: ['business', 'food', 'transport'] },
    ecommerce: { monthlyOrders: 5, avgOrderValue: 2500000, categories: ['electronics', 'luxury'] },
    social: { interests: ['law', 'business', 'golf'], activity: 'low', postFrequency: 4 }
  },
  c014: {
    telco: { monthlySpend: 350000, tenure: 60, dataUsage: 12 },
    eWallet: { usage: 'medium', monthlyTransactions: 40, categories: ['food', 'shopping', 'travel'] },
    ecommerce: { monthlyOrders: 10, avgOrderValue: 700000, categories: ['fashion', 'home', 'beauty'] },
    social: { interests: ['hr', 'psychology', 'self-help'], activity: 'medium', postFrequency: 8 }
  },
  c015: {
    telco: { monthlySpend: 280000, tenure: 36, dataUsage: 20 },
    eWallet: { usage: 'high', monthlyTransactions: 50, categories: ['food', 'tech', 'gaming'] },
    ecommerce: { monthlyOrders: 6, avgOrderValue: 550000, categories: ['electronics', 'gaming'] },
    social: { interests: ['technology', 'gaming', 'anime'], activity: 'high', postFrequency: 19 }
  },
  c016: {
    telco: { monthlySpend: 320000, tenure: 48, dataUsage: 8 },
    eWallet: { usage: 'medium', monthlyTransactions: 30, categories: ['food', 'health', 'family'] },
    ecommerce: { monthlyOrders: 5, avgOrderValue: 500000, categories: ['health', 'family'] },
    social: { interests: ['health', 'family'], activity: 'low', postFrequency: 5 }
  },
  c017: {
    telco: { monthlySpend: 300000, tenure: 36, dataUsage: 18 },
    eWallet: { usage: 'high', monthlyTransactions: 45, categories: ['food', 'tech', 'art'] },
    ecommerce: { monthlyOrders: 9, avgOrderValue: 650000, categories: ['electronics', 'art', 'design'] },
    social: { interests: ['design', 'art', 'photography'], activity: 'high', postFrequency: 16 }
  },
  c018: {
    telco: { monthlySpend: 700000, tenure: 96, dataUsage: 25 },
    eWallet: { usage: 'high', monthlyTransactions: 100, categories: ['business', 'travel', 'luxury'] },
    ecommerce: { monthlyOrders: 25, avgOrderValue: 3000000, categories: ['luxury', 'travel', 'business'] },
    social: { interests: ['business', 'luxury', 'travel'], activity: 'medium', postFrequency: 9 }
  },
  c019: {
    telco: { monthlySpend: 250000, tenure: 24, dataUsage: 22 },
    eWallet: { usage: 'high', monthlyTransactions: 55, categories: ['food', 'entertainment', 'tech'] },
    ecommerce: { monthlyOrders: 7, avgOrderValue: 450000, categories: ['electronics', 'camera'] },
    social: { interests: ['content', 'video', 'tech'], activity: 'high', postFrequency: 20 }
  },
  c020: {
    telco: { monthlySpend: 400000, tenure: 84, dataUsage: 10 },
    eWallet: { usage: 'medium', monthlyTransactions: 35, categories: ['business', 'food', 'transport'] },
    ecommerce: { monthlyOrders: 8, avgOrderValue: 900000, categories: ['business', 'finance'] },
    social: { interests: ['finance', 'investment', 'business'], activity: 'low', postFrequency: 4 }
  }
}

function estimateAvgTransactionValue(usage: 'low' | 'medium' | 'high', tx: number): number {
  if (usage === 'high' && tx >= 70) return 320000
  if (usage === 'high') return 220000
  if (usage === 'medium') return 160000
  return 110000
}

function toEmail(id: string): string {
  return `${id}@demo.local`
}

function toPhone(index: number): string {
  const serial = (10000000 + index).toString()
  return `09${serial}`
}

export const CUSTOMERS: Customer[] = PROFILE_SEEDS.map((seed, index) => ({
  ...seed,
  email: toEmail(seed.id),
  phone: toPhone(index),
  address: `${100 + index} Demo Street, District ${(index % 12) + 1}`,
  city: 'HCM'
}))

export const ALTERNATIVE_DATA: Record<string, AlternativeData> = Object.fromEntries(
  Object.entries(RAW_ALT_DATA).map(([id, raw]) => {
    const eWallet = {
      ...raw.eWallet,
      avgTransactionValue: estimateAvgTransactionValue(raw.eWallet.usage, raw.eWallet.monthlyTransactions)
    }

    const ecommerce = {
      ...raw.ecommerce,
      totalMonthlySpend: raw.ecommerce.monthlyOrders * raw.ecommerce.avgOrderValue
    }

    return [
      id,
      {
        telco: raw.telco,
        eWallet,
        ecommerce,
        social: raw.social
      } satisfies AlternativeData
    ]
  })
) as Record<string, AlternativeData>

export const PRODUCTS: Product[] = [
  {
    id: 'cc-platinum',
    type: 'credit_card',
    productCode: 'SF-CC-PLAT',
    name: 'Shinhan FlexCard Platinum (PoC)',
    description: 'The tin dung uu tien cho khach hang thu nhap on dinh',
    minIncome: 10000000,
    targetSegment: ['office', 'it', 'professional', 'young'],
    keyTerms: {
      limitHint: 'Han muc de xuat: 30M-120M VND',
      feeHint: 'Mien phi nam dau neu dat dieu kien chi tieu'
    },
    operationalNotes: [
      'Uu tien lead co thu nhap on dinh va hanh vi chi tieu so cao',
      'Can doi chieu dieu kien KYC truoc khi goi'
    ]
  },
  {
    id: 'cc-cashback',
    type: 'credit_card',
    productCode: 'SF-CC-CASH',
    name: 'Shinhan Daily Cashback Card (PoC)',
    description: 'The hoan tien cho hanh vi mua sam thuong xuyen',
    minIncome: 8000000,
    targetSegment: ['shopping', 'ecommerce', 'young'],
    keyTerms: {
      limitHint: 'Han muc de xuat: 20M-80M VND',
      feeHint: 'Hoan tien theo danh muc chi tieu'
    },
    operationalNotes: [
      'Phu hop lead co tan suat ecommerce va e-wallet cao',
      'Nho xac nhan nhu cau chi tieu nhom ban le'
    ]
  },
  {
    id: 'pl-salary',
    type: 'personal_loan',
    productCode: 'SF-PL-SAL',
    name: 'Shinhan Salary Plus Loan (PoC)',
    description: 'Vay tin chap theo thu nhap luong',
    minIncome: 8000000,
    targetSegment: ['office', 'salaried', 'stable'],
    keyTerms: {
      limitHint: 'So tien vay de xuat: 20M-300M VND',
      tenorHint: 'Ky han de xuat: 6-48 thang'
    },
    operationalNotes: [
      'Uu tien lead co lich su thu nhap deu va tenure telco cao',
      'Tu van tong nghia vu tra no truoc khi de xuat'
    ]
  },
  {
    id: 'pl-fast',
    type: 'personal_loan',
    productCode: 'SF-PL-FAST',
    name: 'Shinhan Quick Cash Loan (PoC)',
    description: 'Goi vay giai ngan nhanh cho nhu cau ngan han',
    minIncome: 5000000,
    targetSegment: ['freelancer', 'urgent', 'gig'],
    keyTerms: {
      limitHint: 'So tien vay de xuat: 10M-120M VND',
      tenorHint: 'Ky han de xuat: 6-24 thang'
    },
    operationalNotes: [
      'Chi tu van khi lead co dau hieu phan hoi som tich cuc',
      'Nhan vien can nhac ro dieu kien phi/phi phat neu tra cham'
    ]
  },
  {
    id: 'sme-micro',
    type: 'sme_loan',
    productCode: 'SF-SME-MICRO',
    name: 'Shinhan SME Starter Loan (PoC)',
    description: 'Tai tro von luu dong cho ho kinh doanh',
    minIncome: 15000000,
    targetSegment: ['business', 'entrepreneur', 'sme'],
    keyTerms: {
      limitHint: 'So tien vay de xuat: 100M-500M VND',
      tenorHint: 'Ky han de xuat: 12-60 thang'
    },
    operationalNotes: [
      'Uu tien lead co occupation lien quan kinh doanh',
      'Can tham dinh bo sung ho so muc dich su dung von'
    ]
  },
  {
    id: 'ins-health',
    type: 'insurance',
    productCode: 'SF-INS-CARE',
    name: 'Shinhan Care Insurance (PoC)',
    description: 'Goi bao hiem suc khoe cho khach hang va gia dinh',
    minIncome: 10000000,
    targetSegment: ['family', 'health', 'mid_age'],
    keyTerms: {
      feeHint: 'Muc phi phu thuoc do tuoi va quyen loi dang ky'
    },
    operationalNotes: [
      'Phu hop lead quan tam health/family tu social signal',
      'Tu van theo nhu cau bao ve tai chinh dai han'
    ]
  },
  {
    id: 'bnpl-shop',
    type: 'bnpl',
    productCode: 'SF-BNPL-SHOP',
    name: 'Shinhan ShopNow PayLater (PoC)',
    description: 'Mua truoc tra sau cho khach hang mua sam thuong xuyen',
    minIncome: 7000000,
    targetSegment: ['shopping', 'ecommerce', 'young'],
    keyTerms: {
      limitHint: 'Han muc de xuat: 5M-30M VND',
      feeHint: 'Co the mien lai neu thanh toan dung han'
    },
    operationalNotes: [
      'Uu tien lead co tan suat mua sam online deu',
      'Can canh bao ro lich thanh toan de tranh qua han'
    ]
  }
]

export function getEligibleProducts(income: number): Product[] {
  return PRODUCTS.filter((product) => income >= product.minIncome)
}
