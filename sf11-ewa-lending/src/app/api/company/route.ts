import { NextResponse } from "next/server";
import { MOCK_COMPANIES, MOCK_HRM_EMPLOYEES } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId");
  const type = searchParams.get("type");

  if (type === "companies") {
    return NextResponse.json({
      success: true,
      companies: MOCK_COMPANIES,
      totalEmployees: MOCK_HRM_EMPLOYEES.length,
      totalEwaActive: Math.floor(MOCK_HRM_EMPLOYEES.length * 0.75),
      totalLoanActive: Math.floor(MOCK_HRM_EMPLOYEES.length * 0.26),
      totalEwaVolume: MOCK_COMPANIES.reduce((sum, c) => sum + c.ewaVolume, 0)
    });
  }

  if (companyId) {
    const company = MOCK_COMPANIES.find(c => c.id === companyId);
    if (!company) {
      return NextResponse.json({ success: false, error: "Company not found" }, { status: 404 });
    }
    const employees = MOCK_HRM_EMPLOYEES.filter(e => e.company === companyId);
    const avgSalary = employees.reduce((sum, e) => sum + e.monthlySalary, 0) / employees.length;

    return NextResponse.json({
      success: true,
      company,
      employees,
      stats: {
        totalEmployees: employees.length,
        avgSalary,
        ewaEnabled: employees.filter(e => e.status === "active").length,
        loanEnabled: Math.floor(employees.filter(e => e.status === "active").length * 0.3),
        monthlyPayroll: employees.reduce((sum, e) => sum + e.monthlySalary, 0)
      }
    });
  }

  return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { action, companyId, employeeId } = body;

  if (action === "enable-ewa") {
    return NextResponse.json({
      success: true,
      message: `EWA enabled for company ${companyId}`,
      timestamp: new Date().toISOString()
    });
  }

  if (action === "enable-loan") {
    return NextResponse.json({
      success: true,
      message: `Loan enabled for company ${companyId}`,
      timestamp: new Date().toISOString()
    });
  }

  if (action === "suspend-company") {
    return NextResponse.json({
      success: true,
      message: `Company ${companyId} suspended`,
      timestamp: new Date().toISOString()
    });
  }

  return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
}
