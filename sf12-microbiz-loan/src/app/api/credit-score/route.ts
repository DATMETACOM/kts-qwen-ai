import { NextResponse } from "next/server";
import { getCustomer, generateCashflowHistory } from "@/lib/data";
import { creditScoring } from "@/lib/qwen";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerId, requestedAmount } = body;

    if (!customerId) {
      return NextResponse.json(
        { error: "customerId is required", code: "INVALID_REQUEST" },
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

    const cashflowHistory = generateCashflowHistory(customerId, 6);
    const result = await creditScoring(customer, cashflowHistory);

    return NextResponse.json({
      success: true,
      customerId,
      creditScore: result,
      requestedAmount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Credit scoring error:", error);
    return NextResponse.json(
      { error: "Failed to process credit scoring", code: "SCORING_ERROR" },
      { status: 500 }
    );
  }
}