// SF8 - Qwen API Client for Customer Behavior Prediction

import { QwenBehaviorRequest, ShinhanProduct } from "../types";

const QWEN_API_URL = "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/text-generation/generation";

export interface BehaviorPredictionResponse {
  recommendedProduct: ShinhanProduct;
  confidence: number;
  reason: string;
  nextAction: string;
  offerDetails: {
    limit?: string;
    rate?: string;
    promo?: string;
    timeline?: string;
  };
}

/**
 * Call Qwen API to predict customer behavior and recommend product
 */
export async function predictBehavior(
  request: QwenBehaviorRequest
): Promise<BehaviorPredictionResponse> {
  const apiKey = process.env.QWEN_API_KEY || "";

  if (!apiKey) {
    return mockBehaviorPrediction(request);
  }

  try {
    const response = await fetch(QWEN_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "qwen-plus",
        input: {
          messages: [
            {
              role: "system",
              content: "You are a banking product recommendation expert. Analyze customer behavior and suggest the most suitable Shinhan Finance product."
            },
            {
              role: "user",
              content: buildBehaviorPrompt(request)
            }
          ]
        },
        parameters: {
          result_format: "message",
          max_tokens: 1500
        }
      })
    });

    if (!response.ok) {
      console.error("Qwen API error:", response.status);
      return mockBehaviorPrediction(request);
    }

    const data = await response.json();
    const content = data.output?.choices?.[0]?.message?.content || "";

    return parseBehaviorResponse(content, request.availableProducts);
  } catch (error) {
    console.error("Qwen API call failed:", error);
    return mockBehaviorPrediction(request);
  }
}

/**
 * Build behavior analysis prompt for Qwen
 */
function buildBehaviorPrompt(request: QwenBehaviorRequest): string {
  const { customer, alternativeData, availableProducts } = request;
  const { telco, eWallet, ecommerce, social } = alternativeData;

  let prompt = `Analyze customer and recommend the best Shinhan Finance product.\n\n`;

  prompt += `Customer Profile:\n`;
  prompt += `- Name: ${customer.name}\n`;
  prompt += `- Age: ${customer.age}\n`;
  prompt += `- Income: ${(customer.income / 1000000).toFixed(1)}M VND/month\n`;
  prompt += `- Occupation: ${customer.occupation}\n\n`;

  prompt += `Alternative Data Analysis:\n`;
  prompt += `1. Telco Spending: ${(telco.monthlySpend / 1000000).toFixed(1)}M VND, ${telco.tenure} months tenure, ${telco.dataUsage}GB/month\n`;
  prompt += `2. E-Wallet: ${eWallet.usage} usage, ${eWallet.monthlyTransactions} transactions/month\n`;
  prompt += `   Categories: ${eWallet.categories.join(", ")}\n`;
  prompt += `3. E-commerce: ${ecommerce.monthlyOrders} orders/month, avg ${(ecommerce.avgOrderValue / 1000000).toFixed(1)}M VND/order\n`;
  prompt += `   Categories: ${ecommerce.categories.join(", ")}\n`;
  prompt += `4. Social Interests: ${social.interests.join(", ")}, Activity: ${social.activity}\n\n`;

  prompt += `Available Products:\n`;
  availableProducts.forEach((p) => {
    prompt += `- ${p.name} (${p.type}): min ${(p.minIncome / 1000000).toFixed(1)}M income\n`;
  });

  prompt += `\nRecommendation Rules:\n`;
  prompt += `- High e-commerce/eshopping → Credit Card with cashback\n`;
  prompt += `- High food/transport → Personal Loan for stability\n`;
  prompt += `- Business/entrepreneur interests → SME Loan\n`;
  prompt += `- Health/family interests → Insurance\n`;
  prompt += `- Young + high shopping → BNPL\n`;
  prompt += `- High income + stable → Premium products\n\n`;

  prompt += `Return JSON format:\n`;
  prompt += `{\n`;
  prompt += `  "productId": "cc-platinum",\n`;
  prompt += `  "confidence": 0.85,\n`;
  prompt += `  "reason": "Customer shows high e-commerce activity and tech interests...",\n`;
  prompt += `  "nextAction": "Contact customer with platinum card offer",\n`;
  prompt += `  "offerDetails": {\n`;
  prompt += `    "limit": "50M VND",\n`;
  prompt += `    "promo": "0% fee for 3 months + 500K cashback"\n`;
  prompt += `  }\n`;
  prompt += `}`;

  return prompt;
}

/**
 * Parse Qwen behavior response
 */
function parseBehaviorResponse(
  content: string,
  availableProducts: ShinhanProduct[]
): BehaviorPredictionResponse {
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      const product = availableProducts.find((p) => p.id === parsed.productId) || availableProducts[0];

      return {
        recommendedProduct: product,
        confidence: parsed.confidence || 0.7,
        reason: parsed.reason || "Based on behavior analysis",
        nextAction: parsed.nextAction || "Contact customer",
        offerDetails: parsed.offerDetails || {}
      };
    }
  } catch (error) {
    console.error("Failed to parse Qwen response:", error);
  }

  // Fallback
  return mockBehaviorPrediction({ customer: { id: "", name: "", age: 30, income: 15000000, occupation: "" }, alternativeData: null as any, availableProducts });
}

/**
 * Mock behavior prediction for demo/fallback
 */
function mockBehaviorPrediction(request: QwenBehaviorRequest): BehaviorPredictionResponse {
  const { customer, alternativeData, availableProducts } = request;

  if (!alternativeData) {
    return {
      recommendedProduct: availableProducts[0],
      confidence: 0.5,
      reason: "Insufficient data for detailed analysis",
      nextAction: "Collect more customer information",
      offerDetails: {}
    };
  }

  const { eWallet, ecommerce, social } = alternativeData;

  // Simple rule-based matching
  let selectedProduct = availableProducts[0];
  let reason = "";
  let offerDetails = {};

  // High e-commerce → Cashback card
  if (ecommerce.monthlyOrders >= 8) {
    selectedProduct = availableProducts.find((p) => p.id === "cc-cashback") || availableProducts[0];
    reason = `Khách hàng có ${ecommerce.monthlyOrders} đơn hàng/tháng với giá trị trung bình ${(ecommerce.avgOrderValue / 1000000).toFixed(1)}M VNĐ. Nên giới thiệu thẻ Cashback để tối ưu ưu đãi.`;
    offerDetails = {
      limit: "30M VND",
      promo: "5% cashback cho shopping online, 2% cho thực phẩm"
    };
  }
  // High tech/electronics + young → Platinum card
  else if (social.interests.includes("technology") && customer.age < 35) {
    selectedProduct = availableProducts.find((p) => p.id === "cc-platinum") || availableProducts[0];
    reason = `Khách hàng trẻ (${customer.age} tuổi), quan tâm công nghệ, chi tiêu e-wallet ${eWallet.usage}. Thẻ Platinum phù hợp với lối sống số.`;
    offerDetails = {
      limit: "50M VND",
      promo: "0% phí rút tiền 12 tháng, 500K điểm thưởng"
    };
  }
  // Business interests → SME Loan
  else if (social.interests.includes("business") || customer.income >= 20000000) {
    selectedProduct = availableProducts.find((p) => p.id === "sme-micro") || availableProducts[0];
    reason = `Thu nhập ${(customer.income / 1000000).toFixed(1)}M VNĐ/tháng với quan tâm kinh doanh. Gói vay SME Micro phù hợp cho nhu cầu mở rộng.`;
    offerDetails = {
      limit: "300M VND",
      rate: "12%/năm",
      timeline: "Duyệt trong 24h"
    };
  }
  // Health/family → Insurance
  else if (social.interests.includes("health") || social.interests.includes("family")) {
    selectedProduct = availableProducts.find((p) => p.id === "ins-health") || availableProducts[0];
    reason = `Quan tâm sức khỏe và gia đình. Gói bảo hiểm sức khỏe phù hợp với nhu cầu bảo vệ.`;
    offerDetails = {
      promo: "Miễn phí khám 3 bệnh viện đối tác đầu tiên"
    };
  }
  // High e-wallet usage → BNPL
  else if (eWallet.usage === "high" && eWallet.monthlyTransactions >= 40) {
    selectedProduct = availableProducts.find((p) => p.id === "bnpl-shop") || availableProducts[0];
    reason = `Sử dụng e-wallet tích cực (${eWallet.monthlyTransactions} giao dịch/tháng). BNPL giúp tối ưu dòng tiền khi mua sắm.`;
    offerDetails = {
      limit: "20M VND",
      promo: "0% lãi suất 3 tháng đầu"
    };
  }
  // Default: Salary loan
  else {
    selectedProduct = availableProducts.find((p) => p.id === "pl-salary") || availableProducts[0];
    reason = `Thu nhập ổn định ${(customer.income / 1000000).toFixed(1)}M VNĐ/tháng. Vay thỏa thuận lương phù hợp cho nhu cầu tài chính linh hoạt.`;
    offerDetails = {
      limit: `${(customer.income * 6).toLocaleString()} VND`,
      rate: "13%/năm",
      timeline: "Duyệt trong 4h"
    };
  }

  // Calculate confidence based on data completeness
  let confidence = 0.6;
  if (ecommerce.monthlyOrders > 0) confidence += 0.1;
  if (eWallet.monthlyTransactions > 30) confidence += 0.1;
  if (social.interests.length > 2) confidence += 0.1;
  if (customer.income > selectedProduct.minIncome * 1.5) confidence += 0.1;

  return {
    recommendedProduct: selectedProduct,
    confidence: Math.min(confidence, 0.95),
    reason,
    nextAction: `Liên hệ khách hàng để giới thiệu ${selectedProduct.name}`,
    offerDetails
  };
}

/**
 * Get confidence label
 */
export function getConfidenceLabel(confidence: number): string {
  if (confidence >= 0.8) return "Cao";
  if (confidence >= 0.6) return "Trung bình";
  return "Thấp";
}

/**
 * Get confidence color
 */
export function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.8) return "#22c55e"; // green
  if (confidence >= 0.6) return "#eab308"; // yellow
  return "#ef4444"; // red
}
