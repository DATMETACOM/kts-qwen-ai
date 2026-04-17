// SF11 - Qwen AI Client for EWA & Salary-Linked Lending
// Based on SF8 pattern but adapted for credit scoring and salary verification

import { ShinhanProduct } from "../types";

const QWEN_API_URL = "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/text-generation/generation";

export interface SalaryData {
  employeeName: string;
  employeeId: string;
  companyName: string;
  monthlySalary: number;
  tenure: string;
  position: string;
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

/**
 * Verify salary from HRM data and generate AI credit score
 */
export async function creditScoring(
  employeeId: string,
  salaryData: SalaryData,
  requestedAmount?: number
): Promise<CreditScoreResult> {
  const apiKey = process.env.QWEN_API_KEY || "";

  if (!apiKey) {
    return mockCreditScoring(salaryData, requestedAmount);
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
              content: `You are a senior credit analyst at Shinhan Finance Vietnam. Analyze salary data to generate credit scores.
Rules:
- Monthly salary determines base eligibility
- Tenure > 12 months = stable income bonus
- Auto-debit from payroll reduces risk significantly (target NPL <2%)
- Max loan amount = 12x monthly salary for salary-linked products
- Interest rate: 18-24% based on score
- Only recommend products the customer can afford (EMI < 40% of salary)`
            },
            {
              role: "user",
              content: buildCreditScoringPrompt(salaryData, requestedAmount)
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
      return mockCreditScoring(salaryData, requestedAmount);
    }

    const data = await response.json();
    const content = data.output?.choices?.[0]?.message?.content || "";

    return parseCreditResponse(content, salaryData);
  } catch (error) {
    console.error("Qwen API call failed:", error);
    return mockCreditScoring(salaryData, requestedAmount);
  }
}

/**
 * Build credit scoring prompt for Qwen
 */
function buildCreditScoringPrompt(salaryData: SalaryData, requestedAmount?: number): string {
  const { employeeName, companyName, monthlySalary, tenure, position } = salaryData;

  let prompt = `Analyze this employee for credit scoring:\n\n`;
  prompt += `Employee: ${employeeName}\n`;
  prompt += `Company: ${companyName}\n`;
  prompt += `Position: ${position}\n`;
  prompt += `Monthly Salary: ${(monthlySalary / 1000000).toFixed(1)}M VND\n`;
  prompt += `Tenure: ${tenure}\n`;

  if (requestedAmount) {
    prompt += `\nRequested Loan: ${(requestedAmount / 1000000).toFixed(1)}M VND\n`;
  }

  prompt += `\nShinhan Finance Products:\n`;
  prompt += `1. Vay tín chấp cá nhân: up to 300M, 18%/year, 48 months max\n`;
  prompt += `2. Thẻ tín dụng THE FIRST: up to 100M, 0% fee first year\n`;
  prompt += `3. EWA (Earned Wage Access): up to 50% of earned salary, 3% fee\n`;

  prompt += `\nReturn JSON format:\n`;
  prompt += `{\n`;
  prompt += `  "score": 750,\n`;
  prompt += `  "riskLevel": "low",\n`;
  prompt += `  "reasons": ["Stable income", "Good tenure", "Auto-debit reduces risk"],\n`;
  prompt += `  "eligibleAmount": 150000000,\n`;
  prompt += `  "interestRate": 18,\n`;
  prompt += `  "maxTenor": 36,\n`;
  prompt += `  "recommendedProducts": ["Vay tín chấp cá nhân", "Thẻ THE FIRST"]\n`;
  prompt += `}`;

  return prompt;
}

/**
 * Parse Qwen credit scoring response
 */
function parseCreditResponse(content: string, salaryData: SalaryData): CreditScoreResult {
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);

      const score = parsed.score || 700;
      const riskLevel = parsed.riskLevel || (score >= 700 ? "low" : score >= 500 ? "medium" : "high");
      const reasons = parsed.reasons || ["Based on salary data"];
      const recommendedProducts = parsed.recommendedProducts || [];
      const eligibleAmount = parsed.eligibleAmount || salaryData.monthlySalary * 6;
      const interestRate = parsed.interestRate || 18;
      const maxTenor = parsed.maxTenor || 36;

      return {
        score,
        riskLevel,
        reasons,
        recommendedProducts,
        eligibleAmount,
        interestRate,
        maxTenor,
        autoDebitApproved: true
      };
    }
  } catch (error) {
    console.error("Failed to parse Qwen response:", error);
  }

  return mockCreditScoring(salaryData, undefined);
}

/**
 * Mock credit scoring for demo/fallback
 */
function mockCreditScoring(salaryData: SalaryData, requestedAmount?: number): CreditScoreResult {
  const { monthlySalary, tenure } = salaryData;

  // Calculate base score from salary
  let score = 500;
  if (monthlySalary >= 30000000) score += 200;
  else if (monthlySalary >= 20000000) score += 150;
  else if (monthlySalary >= 15000000) score += 100;

  // Tenure bonus
  if (tenure.includes("3 năm") || tenure.includes("5 năm")) score += 100;
  else if (tenure.includes("2 năm")) score += 50;

  // Determine risk level
  let riskLevel: "low" | "medium" | "high" = "medium";
  if (score >= 700) riskLevel = "low";
  else if (score < 500) riskLevel = "high";

  // Calculate eligibility
  const eligibleAmount = Math.min(monthlySalary * 12, 300000000);
  const interestRate = riskLevel === "low" ? 18 : riskLevel === "medium" ? 21 : 24;
  const maxTenor = riskLevel === "low" ? 48 : riskLevel === "medium" ? 36 : 24;

  // Build reasons
  const reasons: string[] = [];
  reasons.push(`Thu nhập ổn định: ${(monthlySalary / 1000000).toFixed(1)}M VND/tháng`);
  reasons.push(`Thâm niên: ${tenure}`);
  reasons.push(`Auto-debit từ payroll: Giảm 60% rủi ro NPL`);

  // Recommended products
  const recommendedProducts: string[] = ["Vay tín chấp cá nhân"];
  if (monthlySalary >= 15000000) recommendedProducts.push("Thẻ tín dụng THE FIRST");
  if (score >= 600) recommendedProducts.push("EWA - Rút lương trước");

  return {
    score: Math.min(score, 850),
    riskLevel,
    reasons,
    recommendedProducts,
    eligibleAmount,
    interestRate,
    maxTenor,
    autoDebitApproved: true
  };
}

/**
 * Check EWA eligibility
 */
export async function checkEWAEligibility(
  employeeId: string,
  salaryData: SalaryData,
  currentDay: number,
  totalDaysInMonth: number,
  requestedAmount?: number
): Promise<EWAEligibility> {
  const earnedBalance = (salaryData.monthlySalary * currentDay) / totalDaysInMonth;
  const maxWithdrawal = earnedBalance * 0.5; // 50% cap
  const fee = 0.03; // 3% fee

  const amount = requestedAmount || 0;

  if (amount > maxWithdrawal) {
    return {
      eligible: false,
      earnedBalance,
      availableToWithdraw: maxWithdrawal,
      maxWithdrawal,
      fee: maxWithdrawal * fee,
      reason: `Số tiền vượt quá giới hạn EWA (tối đa 50% lương đã kiếm)`
    };
  }

  return {
    eligible: true,
    earnedBalance,
    availableToWithdraw: amount > 0 ? amount : maxWithdrawal,
    maxWithdrawal,
    fee: amount * fee
  };
}

/**
 * Get risk level color
 */
export function getRiskColor(riskLevel: string): string {
  if (riskLevel === "low") return "#22c55e";
  if (riskLevel === "medium") return "#eab308";
  return "#ef4444";
}

/**
 * Get risk level label (Vietnamese)
 */
export function getRiskLabel(riskLevel: string): string {
  if (riskLevel === "low") return "Thấp";
  if (riskLevel === "medium") return "Trung bình";
  return "Cao";
}
