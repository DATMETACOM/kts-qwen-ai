import type { CheckIn, QueueStatus } from "../types/index.ts";
import { formatLocalDate } from "./date.ts";

export function getTodayKey(branchId: string, date = new Date()) {
  return `${branchId}-${formatLocalDate(date)}`;
}

export function buildQueueStatus(branchId: string, queue: CheckIn[]): QueueStatus {
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

export function createCheckIn(params: {
  branchId: string;
  branchStaffCount: number;
  existingCheckIns: CheckIn[];
  customerName?: string;
  serviceType?: string;
  now?: Date;
  randomToken?: string;
}): CheckIn {
  const {
    branchId,
    branchStaffCount,
    existingCheckIns,
    customerName,
    serviceType,
    now = new Date(),
    randomToken = Math.random().toString(36).slice(2, 11),
  } = params;

  const positionInQueue = existingCheckIns.length + 1;
  const baseWaitTime = 5;
  const staffCapacity = Math.max(1, branchStaffCount * 2);
  const estimatedWaitTime = Math.max(
    baseWaitTime,
    Math.ceil(positionInQueue * (60 / staffCapacity))
  );

  return {
    checkInId: `ci-${now.getTime()}-${randomToken}`,
    branchId,
    customerName:
      typeof customerName === "string" && customerName.trim()
        ? customerName.trim()
        : "Khách vãng lai",
    serviceType:
      typeof serviceType === "string" && serviceType.trim() ? serviceType.trim() : "Khác",
    checkInTime: now.toISOString(),
    positionInQueue,
    estimatedWaitTime,
    status: "waiting",
  };
}
