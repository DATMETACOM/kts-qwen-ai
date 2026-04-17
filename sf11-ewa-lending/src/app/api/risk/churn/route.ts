import { NextResponse } from "next/server";
import { predictChurn } from "@/lib/risk-engine";

export async function POST(request: Request) {
  const body = await request.json();
  const { employeeId, tenureMonths, salaryGrowth, leaveDaysLastQuarter, departmentChurnRate, performanceScore } = body;

  const prediction = predictChurn(
    employeeId || "EMP001",
    tenureMonths || 38,
    salaryGrowth || 0.08,
    leaveDaysLastQuarter || 2,
    departmentChurnRate || 0.1,
    performanceScore || 85
  );

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    churnPrediction: prediction
  });
}
