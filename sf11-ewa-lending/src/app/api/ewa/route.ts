import { NextResponse } from "next/server";
import { checkEWAEligibility } from "@/lib/qwen";
import { MOCK_HRM_EMPLOYEES } from "@/types";

// In-memory storage for demo
const ewaRequests: Map<string, any> = new Map();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const employeeId = searchParams.get("employeeId");

  try {
    const requests = [];

    for (const [id, req] of ewaRequests.entries()) {
      if (!employeeId || req.employeeId === employeeId) {
        requests.push(req);
      }
    }

    return NextResponse.json({
      requests,
      total: requests.length
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch EWA requests" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { employeeId, amount } = body;

    if (!employeeId || !amount) {
      return NextResponse.json(
        { error: "Missing required fields", code: "INVALID_REQUEST" },
        { status: 400 }
      );
    }

    // Get employee data
    const employee = MOCK_HRM_EMPLOYEES.find((e) => e.employeeId === employeeId);

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found", code: "EMPLOYEE_NOT_FOUND" },
        { status: 404 }
      );
    }

    // Calculate pay period progress
    const now = new Date();
    const currentDay = now.getDate();
    const totalDaysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    // Build salary data
    const salaryData = {
      employeeName: employee.name,
      employeeId: employee.employeeId,
      companyName: employee.company,
      monthlySalary: employee.monthlySalary,
      tenure: calculateTenure(employee.hireDate),
      position: employee.position
    };

    // Check EWA eligibility
    const eligibility = await checkEWAEligibility(
      employeeId,
      salaryData,
      currentDay,
      totalDaysInMonth,
      amount
    );

    if (!eligibility.eligible) {
      return NextResponse.json({
        success: false,
        eligibility,
        message: eligibility.reason || "Không đủ điều kiện EWA"
      });
    }

    // Generate EWA request ID
    const ewaId = `EW-${Date.now()}`;
    const fee = eligibility.availableToWithdraw * 0.03;
    const netAmount = eligibility.availableToWithdraw - fee;

    // Create EWA request
    const ewaRequest = {
      id: ewaId,
      employeeId,
      employeeName: employee.name,
      company: employee.company,
      monthlySalary: employee.monthlySalary,
      earnedBalance: eligibility.earnedBalance,
      requestedAmount: amount,
      disbursedAmount: eligibility.availableToWithdraw,
      fee,
      netAmount,
      currentDay,
      totalDaysInMonth,
      status: "disbursed",
      autoDebitDate: getNextPayday(),
      autoDebitAmount: eligibility.availableToWithdraw,
      createdAt: new Date().toISOString(),
      disbursementTime: new Date().toISOString()
    };

    // Store request
    ewaRequests.set(ewaId, ewaRequest);

    return NextResponse.json({
      success: true,
      ewa: {
        id: ewaRequest.id,
        disbursedAmount: ewaRequest.disbursedAmount,
        fee: ewaRequest.fee,
        netAmount: ewaRequest.netAmount,
        status: ewaRequest.status,
        autoDebitDate: ewaRequest.autoDebitDate,
        autoDebitAmount: ewaRequest.autoDebitAmount,
        earnedBalance: ewaRequest.earnedBalance,
        message: `Đã giải ngân thành công ${formatVND(netAmount)} vào tài khoản!`
      }
    });
  } catch (error) {
    console.error("EWA request error:", error);
    return NextResponse.json(
      { error: "Failed to process EWA request", code: "EWA_ERROR" },
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

function getNextPayday(): string {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${lastDay}`;
}

function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}
