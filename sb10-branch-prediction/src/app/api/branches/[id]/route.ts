import { NextResponse } from "next/server";
import { BRANCHES, getBranchTraffic } from "@/lib/data";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const branch = BRANCHES.find((b) => b.id === params.id);

  if (!branch) {
    return NextResponse.json(
      { error: { code: "BRANCH_NOT_FOUND", message: `Branch with ID '${params.id}' not found` } },
      { status: 404 }
    );
  }

  const trafficHistory = getBranchTraffic(branch.id, 30);

  return NextResponse.json({
    branch,
    trafficHistory,
  });
}
