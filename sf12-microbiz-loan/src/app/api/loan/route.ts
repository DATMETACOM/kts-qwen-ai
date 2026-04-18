import { NextResponse } from "next/server";
import { getCustomer, generateCashflowHistory } from "@/lib/data";
import { calculateRevenueShare } from "@/lib/qwen";
import { MICRO_LOAN_PRODUCTS } from "@/types";
function generateId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

const loans: Map<string, any> = new Map();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerId, amount, tenor, productId } = body;

    if (!customerId || !amount || !tenor) {
      return NextResponse.json(
        { error: "customerId, amount, tenor required", code: "INVALID_REQUEST" },
        { status: 400 }
      );
    }

    const customer = getCustomer(customerId);
    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found", code: "CUSTOMER_NOT_FOUND" },
        { status: 404 }
      );
    }

    const product = MICRO_LOAN_PRODUCTS.find((p) => p.id === productId);
    if (!product) {
      return NextResponse.json(
        { error: "Product not found", code: "PRODUCT_NOT_FOUND" },
        { status: 404 }
      );
    }

    if (amount < product.minAmount || amount > product.maxAmount) {
      return NextResponse.json(
        {
          error: `Amount must be between ${product.minAmount} and ${product.maxAmount}`,
          code: "INVALID_AMOUNT",
        },
        { status: 400 }
      );
    }

    const { monthlyPayment, revenueSharePercent, totalPayment } = calculateRevenueShare(
      amount,
      tenor,
      product.interestRate,
      product.revenueShareCap
    );

    const loan = {
      id: generateId("LN"),
      customerId,
      customerName: customer.name,
      amount,
      tenor,
      interestRate: product.interestRate,
      monthlyPayment,
      revenueSharePercent,
      totalPayment,
      status: "approved",
      purpose: "working_capital",
      createdAt: new Date().toISOString(),
    };

    loans.set(loan.id, loan);

    return NextResponse.json({
      success: true,
      loan,
      message: `Micro loan approved: ${product.name}`,
    });
  } catch (error) {
    console.error("Loan application error:", error);
    return NextResponse.json(
      { error: "Failed to process loan application", code: "LOAN_ERROR" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const customerId = searchParams.get("customerId");

  if (customerId) {
    const customerLoans = Array.from(loans.values()).filter(
      (l) => l.customerId === customerId
    );
    return NextResponse.json(customerLoans);
  }

  return NextResponse.json(Array.from(loans.values()));
}