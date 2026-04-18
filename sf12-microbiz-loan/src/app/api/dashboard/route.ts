import { NextResponse } from "next/server";
import { getPlatforms, calculatePortfolioMetrics, generatePortfolioHistory } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (type === "platforms") {
    return NextResponse.json(getPlatforms());
  }

  if (type === "portfolio") {
    return NextResponse.json(calculatePortfolioMetrics());
  }

  if (type === "history") {
    return NextResponse.json(generatePortfolioHistory(12));
  }

  return NextResponse.json({ error: "type required (platforms|portfolio|history)" }, { status: 400 });
}