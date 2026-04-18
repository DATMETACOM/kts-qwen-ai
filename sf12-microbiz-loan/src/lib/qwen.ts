// SF12 - Qwen API Client for MicroBiz Scoring

import { MicroBizCustomer, CreditScoreResult } from "@/types";

const QWEN_API_URL = "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/text-generation/generation";
const QWEN_MODEL = "qwen-plus";

export async function creditScoring(
  customer: MicroBizCustomer,
  cashflowHistory?: any[]
): Promise<CreditScoreResult> {
  const apiKey = process.env.QWEN_API_KEY;

  if (!apiKey || apiKey === "your_qwen_api_key_here") {
    return generateFallbackScore(customer);
  }

  try {
    const prompt = buildScoringPrompt(customer, cashflowHistory);

    const response = await fetch(QWEN_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: QWEN_MODEL,
        input: {
          messages: [
            {
              role: "system",
              content: "Bạn là chuyên gia tín dụng cho doanh nghiệp nhỏ và freelancer. Trả lời JSON thuần.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        },
        parameters: {
          result_format: "message",
          max_tokens: 1000,
          temperature: 0.2,
        },
      }),
    });

    if (!response.ok) {
      console.error("Qwen API error:", response.status);
      return generateFallbackScore(customer);
    }

    const data = await response.json();
    const content = data?.output?.choices?.[0]?.message?.content || "";

    if (!content) {
      return generateFallbackScore(customer);
    }

    const parsed = extractJson(content);
    return mapToCreditResult(customer.id, parsed);
  } catch (error) {
    console.error("Credit scoring error:", error);
    return generateFallbackScore(customer);
  }
}

function buildScoringPrompt(customer: MicroBizCustomer, cashflowHistory?: any[]): string {
  return `Phân tích rủi ro tín dụng cho khách hàng:

Loại khách hàng: ${customer.type}
Nền tảng: ${customer.platform}
Doanh thu hàng tháng: ${customer.monthlyRevenue.toLocaleString()} VND
Tháng hoạt động: ${customer.monthsActive}
Tỷ lệ khiếu nại: ${customer.complaintRate}%
Đánh giá: ${customer.rating}/5
Số dư ví điện tử: ${customer.ewalletBalance.toLocaleString()} VND
Giao dịch ví: ${customer.ewalletTransactions}
Giao dịch ngân hàng: ${customer.bankTransactions}
Điểm cashflow: ${customer.cashflowScore}

Trả JSON với các trường: score (0-850), riskLevel (low/medium/high), recommendedAmount, maxTenor, interestRate, reasons (mảng strings)`;
}

function extractJson(content: string): any {
  try {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) return null;
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

function mapToCreditResult(customerId: string, parsed: any): CreditScoreResult {
  return {
    customerId,
    score: Math.min(850, Math.max(0, parsed?.score || 500)),
    riskLevel: parsed?.riskLevel || "medium",
    recommendedAmount: parsed?.recommendedAmount || 10000000,
    maxTenor: parsed?.maxTenor || 6,
    interestRate: parsed?.interestRate || 24,
    reasons: Array.isArray(parsed?.reasons) ? parsed.reasons : ["Dựa trên cashflow cơ bản"],
  };
}

function generateFallbackScore(customer: MicroBizCustomer): CreditScoreResult {
  const baseScore = customer.cashflowScore * 8.5;
  const revenueWeight = Math.min(100, customer.monthlyRevenue / 500000);
  const tenureBonus = Math.min(50, customer.monthsActive * 5);
  const volumeBonus = Math.min(50, (customer.ewalletTransactions + customer.bankTransactions) / 20);

  const score = Math.min(850, Math.round(baseScore + revenueWeight + tenureBonus + volumeBonus));

  let riskLevel: "low" | "medium" | "high" = "medium";
  if (score >= 650) riskLevel = "low";
  else if (score < 450) riskLevel = "high";

  const reasons: string[] = [];
  if (customer.cashflowScore >= 70) reasons.push("Cashflow ổn định");
  if (customer.monthsActive >= 12) reasons.push("Hoạt động trên 12 tháng");
  if (customer.rating >= 4.5) reasons.push("Đánh giá cao");
  if (customer.complaintRate <= 2) reasons.push("Ít khiếu nại");
  if (reasons.length === 0) reasons.push("Đủ điều kiện tín dụng cơ bản");

  const recommendedAmount = Math.min(50000000, Math.max(5000000, Math.round(score / 850 * 50000000)));
  const maxTenor = score >= 650 ? 24 : score >= 500 ? 12 : 6;
  const interestRate = score >= 650 ? 18 : score >= 500 ? 21 : 24;

  return {
    customerId: customer.id,
    score,
    riskLevel,
    recommendedAmount,
    maxTenor,
    interestRate,
    reasons,
  };
}

export function calculateRevenueShare(
  amount: number,
  tenor: number,
  interestRate: number,
  revenueShareCap: number
): { monthlyPayment: number; revenueSharePercent: number; totalPayment: number } {
  const monthlyRate = interestRate / 100 / 12;
  const monthlyPayment =
    (amount * monthlyRate * Math.pow(1 + monthlyRate, tenor)) /
    (Math.pow(1 + monthlyRate, tenor) - 1);

  const totalPayment = monthlyPayment * tenor;
  const revenueSharePercent = Math.min(
    revenueShareCap,
    (monthlyPayment / 5000000) * 100
  );

  return {
    monthlyPayment: Math.round(monthlyPayment),
    revenueSharePercent: Math.round(revenueSharePercent * 10) / 10,
    totalPayment: Math.round(totalPayment),
  };
}