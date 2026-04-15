import { NextResponse } from "next/server";
import { BRANCHES } from "@/lib/data";
import type { CheckIn, QueueStatus } from "../../../../types/index";

// Simulated check-in storage (in-memory, resets on restart)
const checkIns: Map<string, CheckIn[]> = new Map();

function getTodayKey(branchId: string, date = new Date()) {
  return `${branchId}-${date.toISOString().split("T")[0]}`;
}

function buildQueueStatus(branchId: string, queue: CheckIn[]): QueueStatus {
  const waiting = queue.filter((item) => item.status === "waiting").length;
  const serving = queue.filter((item) => item.status === "serving").length;
  const averageWaitTime =
    queue.length > 0
      ? Math.ceil(queue.reduce((sum, item) => sum + item.estimatedWaitTime, 0) / queue.length)
      : 0;

  return {
    branchId,
    waiting,
    serving,
    averageWaitTime,
    estimatedTimeForNew: Math.ceil(averageWaitTime * (1 + waiting * 0.2)),
    checkIns: queue,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { branchId, customerName, serviceType } = body;

    if (!branchId || typeof branchId !== "string") {
      return NextResponse.json(
        { error: { code: "INVALID_REQUEST", message: "branchId is required" } },
        { status: 400 }
      );
    }

    // Validate branch exists
    const branch = BRANCHES.find((b) => b.id === branchId);
    if (!branch) {
      return NextResponse.json(
        { error: { code: "BRANCH_NOT_FOUND", message: `Branch with ID '${branchId}' not found` } },
        { status: 404 }
      );
    }

    // Create check-in record
    const checkInId = `ci-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();

    // Get existing check-ins for today
    const todayKey = getTodayKey(branchId, now);
    const existingCheckIns = checkIns.get(todayKey) || [];
    const positionInQueue = existingCheckIns.length + 1;

    // Estimate wait time based on branch staff and current queue
    const baseWaitTime = 5; // 5 minutes base
    const staffCapacity = branch.staffCount * 2; // Each staff can handle 2 customers/hour
    const estimatedWaitTime = Math.max(baseWaitTime, Math.ceil(positionInQueue * (60 / staffCapacity)));

    const checkIn: CheckIn = {
      checkInId,
      branchId,
      customerName:
        typeof customerName === "string" && customerName.trim()
          ? customerName.trim()
          : "Khách vãng lai",
      serviceType:
        typeof serviceType === "string" && serviceType.trim()
          ? serviceType.trim()
          : "Khác",
      checkInTime: now.toISOString(),
      positionInQueue,
      estimatedWaitTime,
      status: "waiting",
    };

    // Store check-in
    checkIns.set(todayKey, [...existingCheckIns, checkIn]);

    return NextResponse.json(checkIn);
  } catch (error) {
    return NextResponse.json(
      { error: { code: "CHECKIN_ERROR", message: "Failed to process check-in" } },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve current queue
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const branchId = searchParams.get("branchId");

  if (!branchId) {
    return NextResponse.json(
      { error: { code: "INVALID_REQUEST", message: "branchId query parameter is required" } },
      { status: 400 }
    );
  }

  const branch = BRANCHES.find((b) => b.id === branchId);
  if (!branch) {
    return NextResponse.json(
      { error: { code: "BRANCH_NOT_FOUND", message: `Branch with ID '${branchId}' not found` } },
      { status: 404 }
    );
  }

  const todayKey = getTodayKey(branchId);
  const todayCheckIns = checkIns.get(todayKey) || [];
  return NextResponse.json(buildQueueStatus(branchId, todayCheckIns));
}
