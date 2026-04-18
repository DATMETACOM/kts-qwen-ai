import { NextResponse } from "next/server";
import { creditScoring } from "@/lib/qwen";
import { MOCK_HRM_EMPLOYEES, SHINHAN_PRODUCTS } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { employeeId, requestedAmount } = body;

    if (!employeeId) {
      return NextResponse.json(
        { error: "employeeId is required", code: "INVALID_REQUEST" },
        { status: 400 }
      );
    }

    // Get employee data from mock HRM
    const employee = MOCK_HRM_EMPLOYEES.find((e) => e.employeeId === employeeId);

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found", code: "EMPLOYEE_NOT_FOUND" },
        { status: 404 }
      );
    }

    // Build salary data for AI
    const salaryData = {
      employeeName: employee.name,
      employeeId: employee.employeeId,
      companyName: employee.company,
      monthlySalary: employee.monthlySalary,
      tenure: calculateTenure(employee.hireDate),
      position: employee.position
    };

    // Call Qwen AI for credit scoring
    const creditResult = await creditScoring(employeeId, salaryData, requestedAmount);

    // Map to Shinhan products
    const recommendedProducts = SHINHAN_PRODUCTS.filter((p) =>
      creditResult.recommendedProducts.some(
        (rp) =>
          p.name.includes(rp) ||
          (p.type === "loan" && rp.includes("Vay")) ||
          (p.type === "credit_card" && rp.includes("Thẻ")) ||
          (p.type === "ewa" && rp.includes("EWA"))
      )
    );

    // If no products matched, add default products based on eligibility
    if (recommendedProducts.length === 0) {
      if (creditResult.score >= 600) {
        recommendedProducts.push(SHINHAN_PRODUCTS[0]); // Personal loan
      }
      if (creditResult.score >= 500) {
        recommendedProducts.push(SHINHAN_PRODUCTS[1]); // Credit card
      }
    }

    // Calculate EMI
    const emi = calculateEMI(requestedAmount || creditResult.eligibleAmount, creditResult.interestRate, creditResult.maxTenor);

    return NextResponse.json({
      success: true,
      employeeId,
      creditScore: creditResult,
      recommendedProducts: recommendedProducts.map((p) => ({
        id: p.id,
        name: p.name,
        type: p.type,
        description: p.description,
        eligibleAmount: creditResult.eligibleAmount,
        interestRate: creditResult.interestRate,
        maxTenor: creditResult.maxTenor,
        estimatedEMI: emi
      })),
      aiAnalysis: {
        score: creditResult.score,
        riskLevel: creditResult.riskLevel,
        riskFactors: creditResult.reasons,
        autoDebitBenefit: "Auto-debit reduces NPL risk by 60%",
        eligibilityNote: `Đủ điều kiện vay với lãi suất ${creditResult.interestRate}%/năm`
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Credit scoring error:", error);
    return NextResponse.json(
      { error: "Failed to process credit scoring", code: "SCORING_ERROR" },
      { status: 500 }
    );
  }
}

function calculateTenure(hireDate: string): string {
  const hire = new Date(hireDate);
  const now = new Date();
  const years = Math.floor((now.getTime() - hire.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  const months = Math.floor(
    ((now.getTime() - hire.getTime()) % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000)
  );

  if (years > 0) {
    return `${years} năm ${months} tháng`;
  }
  return `${months} tháng`;
}

function calculateEMI(principal: number, annualRate: number, months: number): number {
  const monthlyRate = annualRate / 100 / 12;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  return Math.round(emi);
}
