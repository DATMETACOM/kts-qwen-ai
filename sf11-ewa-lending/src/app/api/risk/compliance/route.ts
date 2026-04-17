import { NextResponse } from "next/server";
import { runComplianceCheck } from "@/lib/risk-engine";

export async function POST(request: Request) {
  const body = await request.json();
  const {
    employeeId, employeeName, monthlySalary,
    requestedEwaAmount, requestedLoanAmount,
    interestRate, emi, bankAccountName
  } = body;

  const result = runComplianceCheck(
    employeeId || "EMP001",
    employeeName || "Nguyễn Văn Minh",
    monthlySalary || 25000000,
    requestedEwaAmount || 5000000,
    requestedLoanAmount || 50000000,
    interestRate || 18,
    emi || 1750000,
    bankAccountName || "Nguyen Van Minh"
  );

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    compliance: result
  });
}
