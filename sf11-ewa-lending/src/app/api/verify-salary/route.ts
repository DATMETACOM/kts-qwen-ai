import { NextResponse } from "next/server";
import { MOCK_HRM_EMPLOYEES } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const employeeId = searchParams.get("employeeId");

  try {
    // Simulate HRM/Payroll API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (employeeId) {
      const employee = MOCK_HRM_EMPLOYEES.find((e) => e.employeeId === employeeId);

      if (!employee) {
        return NextResponse.json(
          { error: "Employee not found", code: "EMPLOYEE_NOT_FOUND" },
          { status: 404 }
        );
      }

      // Return salary verification data
      return NextResponse.json({
        verified: true,
        source: "Mock HRM/Payroll System",
        verificationDate: new Date().toISOString(),
        employee: {
          id: employee.employeeId,
          name: employee.name,
          company: employee.company,
          position: employee.position,
          monthlySalary: employee.monthlySalary,
          tenure: calculateTenure(employee.hireDate),
          hireDate: employee.hireDate,
          status: employee.status
        },
        payroll: {
          currentPeriod: "2026-04",
          grossSalary: employee.monthlySalary,
          netSalary: Math.round(employee.monthlySalary * 0.85),
          paidStatus: "pending",
          paydayDate: "2026-04-30"
        }
      });
    }

    // Return all employees (for HR Admin)
    return NextResponse.json({
      employees: MOCK_HRM_EMPLOYEES.map((e) => ({
        id: e.employeeId,
        name: e.name,
        company: e.company,
        department: e.department,
        monthlySalary: e.monthlySalary,
        status: e.status
      })),
      total: MOCK_HRM_EMPLOYEES.length
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to verify salary", code: "VERIFICATION_ERROR" },
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
