import { NextResponse } from "next/server";
import { getCustomer, generateCashflowHistory, calculatePortfolioMetrics } from "@/lib/data";
import { creditScoring } from "@/lib/qwen";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const customerId = searchParams.get("customerId");

  if (customerId) {
    const customer = getCustomer(customerId);
    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(customer);
  }

  return NextResponse.json({ error: "customerId required" }, { status: 400 });
}