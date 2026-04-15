import test from "node:test";
import assert from "node:assert/strict";

import { getBranchTraffic } from "../lib/data.ts";
import { optimizeStaff, predictTraffic } from "../lib/qwen.ts";

const request = {
  branchId: "bn-001",
  branchName: "Chi nhánh Quận Tân Bình",
  district: "TanBinh",
  history: getBranchTraffic("bn-001", 7),
  targetDate: "2026-04-15",
  currentCheckIns: 3,
};

test("predictTraffic falls back deterministically when QWEN_API_KEY is missing", async () => {
  const originalKey = process.env.QWEN_API_KEY;
  delete process.env.QWEN_API_KEY;

  try {
    const first = await predictTraffic(request);
    const second = await predictTraffic(request);

    assert.deepEqual(second, first);
    assert.match(first.summary, /Fallback deterministic forecast/);
    assert.equal(first.hourly.length, 9);
  } finally {
    if (originalKey) process.env.QWEN_API_KEY = originalKey;
  }
});

test("predictTraffic falls back when Qwen returns malformed payload", async () => {
  const originalKey = process.env.QWEN_API_KEY;
  const originalFetch = globalThis.fetch;

  process.env.QWEN_API_KEY = "test-key";
  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({
        output: {
          choices: [{ message: { content: "not-json-response" } }],
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  try {
    const prediction = await predictTraffic(request);

    assert.match(prediction.summary, /Fallback deterministic forecast/);
    assert.equal(prediction.hourly.length, 9);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey) process.env.QWEN_API_KEY = originalKey;
    else delete process.env.QWEN_API_KEY;
  }
});

test("optimizeStaff falls back when QWEN_API_KEY is missing", async () => {
  const originalKey = process.env.QWEN_API_KEY;
  delete process.env.QWEN_API_KEY;

  try {
    const prediction = await predictTraffic(request);
    const result = await optimizeStaff("Chi nhánh Quận Tân Bình", 8, prediction.hourly);

    assert.match(result.summary, /Fallback staff optimization/);
    assert.equal(result.hourlyRecommendations.length, prediction.hourly.length);
    assert.ok(result.totalAdditionalStaff >= 0);
  } finally {
    if (originalKey) process.env.QWEN_API_KEY = originalKey;
  }
});
