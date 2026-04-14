import { NextResponse } from "next/server";
import { BRANCHES, getBranchTraffic } from "@/lib/data";
import { predictTraffic, optimizeStaff } from "@/lib/qwen";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const branch = BRANCHES.find((b) => b.id === params.id);
  if (!branch) {
    return NextResponse.json({ error: { code: "BRANCH_NOT_FOUND", message: "Branch not found" } }, { status: 404 });
  }

  try {
    const body = await request.json();
    const targetDate = body.targetDate || new Date().toISOString().split("T")[0];
    const trafficHistory = getBranchTraffic(branch.id, 30);

    const prediction = await predictTraffic({
      branchId: branch.id,
      branchName: branch.name,
      district: branch.district,
      history: trafficHistory,
      targetDate,
      currentCheckIns: 0,
    });

    const staffOpt = await optimizeStaff(
      branch.name,
      branch.staffCount,
      prediction.hourly
    );

    return NextResponse.json({ prediction, staffOptimization: staffOpt });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Staff optimization failed";
    return NextResponse.json({ error: { code: "OPTIMIZATION_ERROR", message } }, { status: 500 });
  }
}
