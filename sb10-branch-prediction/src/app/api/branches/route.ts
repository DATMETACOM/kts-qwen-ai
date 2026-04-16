import { NextResponse } from "next/server";
import { BRANCHES } from "@/lib/data";

export async function GET() {
  return NextResponse.json({
    branches: BRANCHES,
  });
}
