import test from "node:test";
import assert from "node:assert/strict";

import { buildQueueStatus, createCheckIn, getTodayKey } from "../lib/queue.ts";
import type { CheckIn } from "../types/index.ts";

test("getTodayKey is deterministic for the same branch and date", () => {
  const date = new Date("2026-04-15T08:30:00.000Z");
  assert.equal(getTodayKey("bn-001", date), getTodayKey("bn-001", date));
});

test("getTodayKey uses local date parts for queue partitioning", () => {
  const date = new Date(2026, 3, 16, 0, 30, 0);
  assert.equal(getTodayKey("bn-001", date), "bn-001-2026-04-16");
});

test("createCheckIn derives queue position and sanitizes defaults", () => {
  const existingCheckIns: CheckIn[] = [
    {
      checkInId: "ci-1",
      branchId: "bn-001",
      customerName: "A",
      serviceType: "Gửi tiền",
      checkInTime: "2026-04-15T08:00:00.000Z",
      positionInQueue: 1,
      estimatedWaitTime: 5,
      status: "waiting",
    },
  ];

  const checkIn = createCheckIn({
    branchId: "bn-001",
    branchStaffCount: 8,
    existingCheckIns,
    customerName: "   ",
    serviceType: "",
    now: new Date("2026-04-15T08:01:00.000Z"),
    randomToken: "fixedtoken",
  });

  assert.equal(checkIn.positionInQueue, 2);
  assert.equal(checkIn.customerName, "Khách vãng lai");
  assert.equal(checkIn.serviceType, "Khác");
  assert.match(checkIn.checkInId, /fixedtoken/);
});

test("buildQueueStatus summarizes waiting, serving and average wait correctly", () => {
  const queue: CheckIn[] = [
    {
      checkInId: "ci-1",
      branchId: "bn-001",
      customerName: "A",
      serviceType: "Gửi tiền",
      checkInTime: "2026-04-15T08:00:00.000Z",
      positionInQueue: 1,
      estimatedWaitTime: 6,
      status: "waiting",
    },
    {
      checkInId: "ci-2",
      branchId: "bn-001",
      customerName: "B",
      serviceType: "Thẻ",
      checkInTime: "2026-04-15T08:05:00.000Z",
      positionInQueue: 2,
      estimatedWaitTime: 12,
      status: "serving",
    },
  ];

  const status = buildQueueStatus("bn-001", queue);

  assert.equal(status.waiting, 1);
  assert.equal(status.serving, 1);
  assert.equal(status.averageWaitTime, 9);
  assert.equal(status.estimatedTimeForNew, 11);
  assert.equal(status.checkIns.length, 2);
});
