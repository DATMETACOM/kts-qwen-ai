import test from "node:test";
import assert from "node:assert/strict";

import { generateHourlyForecast, generateTrafficData } from "../lib/data.ts";

test("generateHourlyForecast is deterministic for the same branch and date", () => {
  const first = generateHourlyForecast("bn-001", "2026-04-15");
  const second = generateHourlyForecast("bn-001", "2026-04-15");

  assert.deepEqual(second, first);
});

test("generateHourlyForecast changes when branch/date inputs change", () => {
  const branchA = generateHourlyForecast("bn-001", "2026-04-15");
  const branchB = generateHourlyForecast("bn-002", "2026-04-15");
  const otherDate = generateHourlyForecast("bn-001", "2026-04-25");

  assert.notDeepEqual(branchB, branchA);
  assert.notDeepEqual(otherDate, branchA);
});

test("generateTrafficData is deterministic across invocations", () => {
  const first = generateTrafficData();
  const second = generateTrafficData();

  assert.equal(first.length, second.length);
  assert.deepEqual(second.slice(0, 20), first.slice(0, 20));
  assert.deepEqual(second.at(-1), first.at(-1));
});
