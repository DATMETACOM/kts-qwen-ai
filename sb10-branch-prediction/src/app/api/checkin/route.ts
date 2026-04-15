import { NextResponse } from "next/server";
import { BRANCHES } from "@/lib/data";
import type { CheckIn } from "../../../../types/index";
import { buildQueueStatus, createCheckIn, getTodayKey } from "@/lib/queue";

// Simulated check-in storage (in-memory, resets on restart)
const checkIns: Map<string, CheckIn[]> = new Map();

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
    const checkIn = createCheckIn({
      branchId,
      branchStaffCount: branch.staffCount,
      existingCheckIns,
      customerName,
      serviceType,
      now,
      randomToken: Math.random().toString(36).slice(2, 11),
    });

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
