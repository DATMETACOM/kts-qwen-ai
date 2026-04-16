import { NextResponse } from "next/server";
import { BRANCHES, getBranchTraffic } from "@/lib/data";
import { formatLocalDate } from "@/lib/date";
import { predictTraffic, optimizeStaff } from "@/lib/qwen";

async function getQueueStatus(branchId: string, request: Request) {
  const queueUrl = new URL(`/api/checkin?branchId=${branchId}`, request.url);
  const response = await fetch(queueUrl);
  if (!response.ok) {
    return { waiting: 0, serving: 0, averageWaitTime: 0, estimatedTimeForNew: 0, checkIns: [], branchId };
  }
  return response.json();
}

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
    const targetDate = body.targetDate || formatLocalDate(new Date());
    const trafficHistory = getBranchTraffic(branch.id, 30);
    const queueStatus = await getQueueStatus(branch.id, request);

    const prediction = await predictTraffic({
      branchId: branch.id,
      branchName: branch.name,
      district: branch.district,
      history: trafficHistory,
      targetDate,
      currentCheckIns: queueStatus.waiting,
    });

    const staffOpt = await optimizeStaff(
      branch.name,
      branch.staffCount,
      prediction.hourly
    );

    return NextResponse.json({ prediction, staffOptimization: staffOpt, queueStatus });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Staff optimization failed";
    return NextResponse.json({ error: { code: "OPTIMIZATION_ERROR", message } }, { status: 500 });
  }
}
