// SF8 - Customer Behavior Prediction Types

export interface Customer {
  id: string;
  name: string;
  age: number;
  income: number;
  occupation: string;
}

export interface AlternativeData {
  telco: {
    monthlySpend: number;
    tenure: number;
    dataUsage: number; // GB/month
  };
  eWallet: {
    usage: "low" | "medium" | "high";
    monthlyTransactions: number;
    categories: string[];
  };
  ecommerce: {
    monthlyOrders: number;
    avgOrderValue: number;
    categories: string[];
  };
  social: {
    interests: string[];
    activity: "low" | "medium" | "high";
  };
}

export interface ShinhanProduct {
  id: string;
  name: string;
  type: "credit_card" | "personal_loan" | "sme_loan" | "insurance" | "bnpl";
  minIncome: number;
  targetSegment: string[];
}

export interface BehaviorPrediction {
  customerId: string;
  recommendedProduct: ShinhanProduct;
  confidence: number; // 0-1
  reason: string;
  nextAction: string;
  offerDetails: {
    limit?: string;
    rate?: string;
    promo?: string;
    timeline?: string;
  };
}

export interface QwenBehaviorRequest {
  customer: Customer;
  alternativeData: AlternativeData;
  availableProducts: ShinhanProduct[];
}
