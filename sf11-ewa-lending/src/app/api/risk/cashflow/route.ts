import { NextResponse } from "next/server";
import { forecastCashflow } from "@/lib/risk-engine";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const baseMonthlyEwa = parseInt(searchParams.get("baseMonthlyEwa") || "15000000");
  const baseMonthlyLoan = parseInt(searchParams.get("baseMonthlyLoan") || "50000000");

  const forecast = forecastCashflow(baseMonthlyEwa, baseMonthlyLoan);

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    forecast
  });
}
