#!/usr/bin/env node

const BASE_URL = (process.env.SMOKE_BASE_URL || "https://sf8-cuca-insider-ai.vercel.app").replace(/\/$/, "");
const DEFAULT_CUSTOMER_ID = process.env.SMOKE_CUSTOMER_ID || "CUS001";
const COPILOT_PROMPT =
  process.env.SMOKE_PROMPT ||
  "Provide a concise 3-step outreach strategy with quantified evidence and compliance note.";

const ALLOWED_PRODUCTS = new Set(
  ["Vay tin chap ca nhan", "The tin dung THE FIRST", "Vay mua o to"].map((item) =>
    normalizeText(item)
  )
);

function nowIso() {
  return new Date().toISOString();
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function assertOrThrow(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function formatMs(ms) {
  if (!Number.isFinite(ms)) return "n/a";
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

async function timedJson(path, init) {
  const started = Date.now();
  const response = await fetch(`${BASE_URL}${path}`, init);
  const latencyMs = Date.now() - started;

  const text = await response.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }

  return {
    ok: response.ok,
    status: response.status,
    latencyMs,
    json,
    text,
  };
}

function getLayerSummary(meta) {
  const layers = Array.isArray(meta?.layers) ? meta.layers : [];
  return layers.map((layer) => ({
    id: layer.id || "n/a",
    status: layer.status || "n/a",
    latency_ms: Number.isFinite(layer.latency_ms) ? layer.latency_ms : null,
  }));
}

(async () => {
  const suiteStartedAt = Date.now();
  const report = {
    started_at: nowIso(),
    base_url: BASE_URL,
    checks: [],
  };

  try {
    const customersRes = await timedJson("/api/customers");
    assertOrThrow(customersRes.ok, `customers endpoint failed: HTTP ${customersRes.status}`);
    assertOrThrow(Array.isArray(customersRes.json), "customers payload is not an array");
    assertOrThrow(customersRes.json.length > 0, "customers payload is empty");

    const customerIdSet = new Set(customersRes.json.map((item) => String(item.customer_id || "").trim()));
    const chosenCustomerId = customerIdSet.has(DEFAULT_CUSTOMER_ID)
      ? DEFAULT_CUSTOMER_ID
      : String(customersRes.json[0].customer_id || "").trim();

    report.checks.push({
      id: "L1_CUSTOMERS",
      status: "ok",
      latency_ms: customersRes.latencyMs,
      detail: `Fetched ${customersRes.json.length} customers`,
    });

    const analyzeRes = await timedJson(`/api/analyze/${chosenCustomerId}`);
    assertOrThrow(analyzeRes.ok, `analyze endpoint failed: HTTP ${analyzeRes.status} ${analyzeRes.text}`);
    assertOrThrow(analyzeRes.json && typeof analyzeRes.json === "object", "analyze payload is not an object");

    const recommendedProduct = String(analyzeRes.json.recommended_product || "").trim();
    const normalizedProduct = normalizeText(recommendedProduct);
    assertOrThrow(ALLOWED_PRODUCTS.has(normalizedProduct), `out-of-scope product returned: ${recommendedProduct}`);

    const rationale = Array.isArray(analyzeRes.json.behavioral_rationale)
      ? analyzeRes.json.behavioral_rationale
      : [];
    const evidence = Array.isArray(analyzeRes.json.statistical_evidence)
      ? analyzeRes.json.statistical_evidence
      : [];
    const script = String(analyzeRes.json.sales_pitch_script || "").trim();

    assertOrThrow(rationale.length > 0, "behavioral_rationale is empty");
    assertOrThrow(evidence.length > 0, "statistical_evidence is empty");
    assertOrThrow(script.length >= 80, "sales_pitch_script is too short");

    report.checks.push({
      id: "L2_ANALYZE",
      status: "ok",
      latency_ms: analyzeRes.latencyMs,
      detail: `Recommended product: ${recommendedProduct}`,
      trace_id: analyzeRes.json?._meta?.trace_id || "n/a",
      model: analyzeRes.json?._meta?.model || "n/a",
      scope: analyzeRes.json?._meta?.scope || null,
      layers: getLayerSummary(analyzeRes.json?._meta),
    });

    const analysisBundle = {
      recommended_product: analyzeRes.json.recommended_product,
      behavioral_rationale: analyzeRes.json.behavioral_rationale,
      statistical_evidence: analyzeRes.json.statistical_evidence,
      sales_pitch_script: analyzeRes.json.sales_pitch_script,
      risk_warning_and_upsell: analyzeRes.json.risk_warning_and_upsell,
    };

    const copilotRes = await timedJson(`/api/copilot/${chosenCustomerId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: COPILOT_PROMPT,
        history: [],
        analysis: analysisBundle,
      }),
    });

    assertOrThrow(copilotRes.ok, `copilot endpoint failed: HTTP ${copilotRes.status} ${copilotRes.text}`);
    assertOrThrow(copilotRes.json && typeof copilotRes.json === "object", "copilot payload is not an object");

    const reply = String(copilotRes.json.reply || "").trim();
    assertOrThrow(reply.length >= 60, "copilot reply is too short or empty");

    report.checks.push({
      id: "L3_COPILOT",
      status: "ok",
      latency_ms: copilotRes.latencyMs,
      detail: `Reply length: ${reply.length} chars`,
      trace_id: copilotRes.json?._meta?.trace_id || "n/a",
      model: copilotRes.json?._meta?.model || "n/a",
      scope: copilotRes.json?._meta?.scope || null,
      layers: getLayerSummary(copilotRes.json?._meta),
    });

    report.customer_id = chosenCustomerId;
    report.completed_at = nowIso();
    report.total_latency_ms = Date.now() - suiteStartedAt;
    report.status = "pass";

    console.log("QWEN FLOW SMOKE TEST: PASS");
    console.log(`Base URL: ${BASE_URL}`);
    console.log(`Customer ID: ${chosenCustomerId}`);
    for (const item of report.checks) {
      console.log(`- ${item.id}: ${item.status.toUpperCase()} (${formatMs(item.latency_ms)})`);
      console.log(`  ${item.detail}`);
      if (item.trace_id) {
        console.log(`  trace: ${item.trace_id}`);
      }
    }
    console.log(`Total E2E: ${formatMs(report.total_latency_ms)}`);
    console.log("--- JSON REPORT ---");
    console.log(JSON.stringify(report, null, 2));
  } catch (error) {
    report.completed_at = nowIso();
    report.total_latency_ms = Date.now() - suiteStartedAt;
    report.status = "fail";
    report.error = String(error.message || error);

    console.error("QWEN FLOW SMOKE TEST: FAIL");
    console.error(`Base URL: ${BASE_URL}`);
    console.error(`Reason: ${report.error}`);
    console.error(`Elapsed: ${formatMs(report.total_latency_ms)}`);
    console.error("--- JSON REPORT ---");
    console.error(JSON.stringify(report, null, 2));
    process.exit(1);
  }
})();
