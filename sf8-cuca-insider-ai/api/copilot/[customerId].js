import { findCustomer, loadProductCatalog } from "../_shared/data.js";
import { analyzeWithQwen, copilotWithQwen } from "../_shared/qwen.js";

function nowIso() {
  return new Date().toISOString();
}

function buildTraceId(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function getDuration(startedAt) {
  return Math.max(0, Date.now() - startedAt);
}

function extractProductRows(productCatalog) {
  if (Array.isArray(productCatalog)) return productCatalog;
  if (Array.isArray(productCatalog?.products)) return productCatalog.products;
  return [];
}

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

function normalizeStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item || "").trim()).filter(Boolean);
}

function normalizeClientAnalysis(value) {
  if (!value || typeof value !== "object") return null;

  const recommendedProduct = String(value.recommended_product || "").trim();
  const salesPitchScript = String(value.sales_pitch_script || "").trim();

  if (!recommendedProduct || !salesPitchScript) return null;

  return {
    recommended_product: recommendedProduct,
    behavioral_rationale: normalizeStringArray(value.behavioral_rationale),
    statistical_evidence: normalizeStringArray(value.statistical_evidence),
    sales_pitch_script: salesPitchScript,
    risk_warning_and_upsell: normalizeStringArray(value.risk_warning_and_upsell),
  };
}

function baseScope(productCatalog) {
  const rows = extractProductRows(productCatalog);
  return {
    boundary: "read_only",
    pii_handling: "masked_payload_for_qwen_analyze",
    interaction_mode: "advisor_copilot",
    products_allowed: rows.map((item) => item.product_name || item.name).filter(Boolean),
    required_fields: ["reply"],
  };
}

export default async function handler(req, res) {
  const requestStartedAt = Date.now();
  const traceId = buildTraceId("copilot");

  if (req.method !== "POST") {
    return res.status(405).json({
      detail: "Method not allowed",
      _meta: {
        trace_id: traceId,
        latency_ms: getDuration(requestStartedAt),
        layers: [{ id: "L0_METHOD", status: "failed", latency_ms: getDuration(requestStartedAt) }],
      },
    });
  }

  const customerId = String(req.query.customerId || "").trim();
  if (!customerId) {
    return res.status(400).json({
      detail: "Missing customerId",
      _meta: {
        trace_id: traceId,
        latency_ms: getDuration(requestStartedAt),
        layers: [{ id: "L0_INPUT", status: "failed", latency_ms: getDuration(requestStartedAt) }],
      },
    });
  }

  const customerLookupStartedAt = Date.now();
  const customer = findCustomer(customerId);
  const customerLookupMs = getDuration(customerLookupStartedAt);
  if (!customer) {
    return res.status(404).json({
      detail: `Customer ${customerId} not found`,
      _meta: {
        trace_id: traceId,
        latency_ms: getDuration(requestStartedAt),
        layers: [{ id: "L1_CUSTOMER_LOOKUP", status: "failed", latency_ms: customerLookupMs }],
      },
    });
  }

  const body = parseBody(req);
  const message = String(body.message || "").trim();
  if (!message) {
    return res.status(400).json({
      detail: "Missing message",
      _meta: {
        trace_id: traceId,
        latency_ms: getDuration(requestStartedAt),
        layers: [
          { id: "L1_CUSTOMER_LOOKUP", status: "ok", latency_ms: customerLookupMs },
          { id: "L2_MESSAGE_VALIDATION", status: "failed", latency_ms: getDuration(requestStartedAt) },
        ],
      },
    });
  }

  const history = Array.isArray(body.history) ? body.history : [];

  const catalogLoadStartedAt = Date.now();
  const productCatalog = loadProductCatalog();
  const catalogLoadMs = getDuration(catalogLoadStartedAt);

  const maskedPayload = {
    behavioral_tags: customer.behavioral_tags,
    deterministic_stats: customer.deterministic_stats,
  };

  const providedAnalysis = normalizeClientAnalysis(body.analysis);
  let analysis = providedAnalysis;
  let analyzeMs = 0;
  let analyzeStatus = providedAnalysis ? "reused_from_client" : "ok";

  if (!analysis) {
    const analyzeStartedAt = Date.now();
    try {
      analysis = await analyzeWithQwen(maskedPayload, productCatalog);
      analyzeMs = getDuration(analyzeStartedAt);
    } catch (error) {
      const totalMs = getDuration(requestStartedAt);
      analyzeMs = getDuration(analyzeStartedAt);
      analyzeStatus = "failed";

      return res.status(502).json({
        detail: `Qwen copilot failed: ${error.message}`,
        _meta: {
          trace_id: traceId,
          response_at: nowIso(),
          model: (process.env.QWEN_MODEL || "qwen3.6-plus").trim(),
          region_endpoint: (process.env.BASE_URL || "https://dashscope-intl.aliyuncs.com/compatible-mode/v1").trim(),
          latency_ms: totalMs,
          scope: baseScope(productCatalog),
          layers: [
            { id: "L1_CUSTOMER_LOOKUP", status: "ok", latency_ms: customerLookupMs },
            { id: "L2_PRODUCT_SCOPE", status: "ok", latency_ms: catalogLoadMs },
            { id: "L3_QWEN_ANALYZE", status: analyzeStatus, latency_ms: analyzeMs },
          ],
        },
      });
    }
  }

  const copilotStartedAt = Date.now();
  try {
    const reply = await copilotWithQwen({
      customer,
      analysis,
      message,
      history,
    });

    const copilotMs = getDuration(copilotStartedAt);
    const totalMs = getDuration(requestStartedAt);

    return res.status(200).json({
      reply,
      _meta: {
        trace_id: traceId,
        response_at: nowIso(),
        model: (process.env.QWEN_MODEL || "qwen3.6-plus").trim(),
        region_endpoint: (process.env.BASE_URL || "https://dashscope-intl.aliyuncs.com/compatible-mode/v1").trim(),
        latency_ms: totalMs,
        scope: baseScope(productCatalog),
        layers: [
          { id: "L1_CUSTOMER_LOOKUP", status: "ok", latency_ms: customerLookupMs },
          { id: "L2_PRODUCT_SCOPE", status: "ok", latency_ms: catalogLoadMs },
          { id: "L3_QWEN_ANALYZE", status: analyzeStatus, latency_ms: analyzeMs },
          { id: "L4_QWEN_COPILOT", status: "ok", latency_ms: copilotMs },
        ],
      },
    });
  } catch (error) {
    const copilotMs = getDuration(copilotStartedAt);
    const totalMs = getDuration(requestStartedAt);

    return res.status(502).json({
      detail: `Qwen copilot failed: ${error.message}`,
      _meta: {
        trace_id: traceId,
        response_at: nowIso(),
        model: (process.env.QWEN_MODEL || "qwen3.6-plus").trim(),
        region_endpoint: (process.env.BASE_URL || "https://dashscope-intl.aliyuncs.com/compatible-mode/v1").trim(),
        latency_ms: totalMs,
        scope: baseScope(productCatalog),
        layers: [
          { id: "L1_CUSTOMER_LOOKUP", status: "ok", latency_ms: customerLookupMs },
          { id: "L2_PRODUCT_SCOPE", status: "ok", latency_ms: catalogLoadMs },
          { id: "L3_QWEN_ANALYZE", status: analyzeStatus, latency_ms: analyzeMs },
          { id: "L4_QWEN_COPILOT", status: "failed", latency_ms: copilotMs },
        ],
      },
    });
  }
}
