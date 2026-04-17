import { NextResponse } from "next/server";
import { predictChurn } from "@/lib/risk-engine";
import { MOCK_HRM_EMPLOYEES } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const employeeId = searchParams.get("employeeId") || "EMP001";

  const employee = MOCK_HRM_EMPLOYEES.find((e) => e.employeeId === employeeId);
  if (!employee) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }

  const tenureMonths = Math.round(
    (Date.now() - new Date(employee.hireDate).getTime()) / (30.44 * 24 * 60 * 60 * 1000)
  );

  // Simulate feature values based on employee data
  const salaryGrowth = tenureMonths > 24 ? 0.12 : 0.05;
  const leaveDays = tenureMonths > 24 ? 1 : 3;
  const deptChurn = 0.12;
  const perfScore = employee.monthlySalary >= 25000000 ? 85 : 72;

  const prediction = predictChurn(employeeId, tenureMonths, salaryGrowth, leaveDays, deptChurn, perfScore);

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    employeeId,
    employeeName: employee.name,
    churnPrediction: prediction
  });
}
