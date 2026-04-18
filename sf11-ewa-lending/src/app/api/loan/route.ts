import { NextResponse } from "next/server";

// In-memory storage for demo (would be database in production)
const loanApplications: Map<string, any> = new Map();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const employeeId = searchParams.get("employeeId");

  try {
    const applications = [];

    for (const [id, app] of loanApplications.entries()) {
      if (!employeeId || app.employeeId === employeeId) {
        applications.push(app);
      }
    }

    return NextResponse.json({
      applications,
      total: applications.length
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { employeeId, amount, tenor, productId, creditScoreResult } = body;

    if (!employeeId || !amount || !tenor) {
      return NextResponse.json(
        { error: "Missing required fields", code: "INVALID_REQUEST" },
        { status: 400 }
      );
    }

    // Generate loan ID
    const loanId = `LN-${Date.now()}`;

    // Calculate EMI
    const monthlyRate = (creditScoreResult?.interestRate || 18) / 100 / 12;
    const emi = Math.round(
      (amount * monthlyRate * Math.pow(1 + monthlyRate, tenor)) / (Math.pow(1 + monthlyRate, tenor) - 1)
    );

    // Create loan application
    const application = {
      id: loanId,
      employeeId,
      amount,
      tenor,
      productId,
      creditScore: creditScoreResult?.score || 700,
      riskLevel: creditScoreResult?.riskLevel || "low",
      interestRate: creditScoreResult?.interestRate || 18,
      emi,
      totalPayment: emi * tenor,
      status: "approved",
      autoDebitEnabled: true,
      autoDebitDay: 30,
      disbursementDate: new Date().toISOString(),
      firstPaymentDate: getNextMonthDate(30),
      createdAt: new Date().toISOString(),
      disbursementMethod: "Bank transfer",
      disbursementAccount: "****7890"
    };

    // Store application
    loanApplications.set(loanId, application);

    return NextResponse.json({
      success: true,
      application: {
        id: application.id,
        status: application.status,
        amount: application.amount,
        tenor: application.tenor,
        emi: application.emi,
        interestRate: application.interestRate,
        autoDebitEnabled: application.autoDebitEnabled,
        disbursementDate: application.disbursementDate,
        message: "Đơn vay đã được phê duyệt tự động!"
      }
    });
  } catch (error) {
    console.error("Loan application error:", error);
    return NextResponse.json(
      { error: "Failed to process loan application", code: "APPLICATION_ERROR" },
      { status: 500 }
    );
  }
}

function getNextMonthDate(day: number): string {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  date.setDate(Math.min(day, new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()));
  return date.toISOString().split("T")[0];
}
