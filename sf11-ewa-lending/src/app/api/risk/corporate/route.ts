import { NextResponse } from "next/server";
import { scoreCorporate } from "@/lib/risk-engine";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId") || "CMP001";

  const score = scoreCorporate(companyId);

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    corporateRisk: score
  });
}
