import { findCustomer, loadProductCatalog } from "../_shared/data.js";
import { analyzeWithQwen } from "../_shared/qwen.js";

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

function baseScope(productCatalog) {
  const rows = extractProductRows(productCatalog);
  return {
    boundary: "read_only",
    pii_handling: "masked_payload_only",
    products_allowed: rows.map((item) => item.product_name || item.name).filter(Boolean),
    required_fields: [
      "recommended_product",
      "behavioral_rationale",
      "statistical_evidence",
      "sales_pitch_script",
      "risk_warning_and_upsell",
    ],
  };
}

export default async function handler(req, res) {
  const requestStartedAt = Date.now();
  const traceId = buildTraceId("analyze");

  if (req.method !== "GET") {
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

  const catalogLoadStartedAt = Date.now();
  const productCatalog = loadProductCatalog();
  const catalogLoadMs = getDuration(catalogLoadStartedAt);

  const maskedPayload = {
    behavioral_tags: customer.behavioral_tags,
    deterministic_stats: customer.deterministic_stats,
  };

  const analyzeStartedAt = Date.now();

  try {
    const analysis = await analyzeWithQwen(maskedPayload, productCatalog);
    const analyzeMs = getDuration(analyzeStartedAt);
    const totalMs = getDuration(requestStartedAt);

    return res.status(200).json({
      customer_id: customer.customer_id,
      full_name: customer.pii_data.full_name,
      job_title: customer.pii_data.job_title,
      deterministic_stats: customer.deterministic_stats,
      recommended_product: analysis.recommended_product,
      behavioral_rationale: analysis.behavioral_rationale,
      statistical_evidence: analysis.statistical_evidence,
      sales_pitch_script: analysis.sales_pitch_script,
      risk_warning_and_upsell: analysis.risk_warning_and_upsell,
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
          { id: "L3_QWEN_ANALYZE", status: "ok", latency_ms: analyzeMs },
        ],
      },
    });
  } catch (error) {
    const analyzeMs = getDuration(analyzeStartedAt);
    const totalMs = getDuration(requestStartedAt);

    return res.status(502).json({
      detail: `Qwen analyze failed: ${error.message}`,
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
          { id: "L3_QWEN_ANALYZE", status: "failed", latency_ms: analyzeMs },
        ],
      },
    });
  }
}
