const PRODUCT_NAMES = [
  "Vay tín chấp cá nhân",
  "Thẻ tín dụng THE FIRST",
  "Vay mua ô tô",
];

function getEnv() {
  const apiKey = (process.env.QWEN_API_KEY || "").trim();
  if (!apiKey) {
    throw new Error("Missing QWEN_API_KEY in Vercel environment");
  }

  return {
    apiKey,
    baseUrl: (process.env.BASE_URL || "https://dashscope-intl.aliyuncs.com/compatible-mode/v1").trim(),
    model: (process.env.QWEN_MODEL || "qwen3.6-plus").trim(),
  };
}

function extractJson(rawContent) {
  const text = String(rawContent || "").trim();
  if (!text) throw new Error("Empty response from Qwen");

  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object") return parsed;
  } catch {
    // fall through
  }

  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Qwen did not return valid JSON");
  return JSON.parse(match[0]);
}

function normalizeList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\n|;|•/g)
      .map((item) => item.trim().replace(/^[-•]\s*/, ""))
      .filter(Boolean);
  }

  return [];
}

async function qwenChat(messages, { jsonMode = false, temperature = 0.2 } = {}) {
  const { apiKey, baseUrl, model } = getEnv();
  const payload = {
    model,
    messages,
    temperature,
  };

  if (jsonMode) payload.response_format = { type: "json_object" };

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Qwen API ${response.status}: ${errorText.slice(0, 300)}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || "";
}

export async function analyzeWithQwen(maskedPayload, productCatalog) {
  const systemPrompt = [
    "Bạn là 'Trợ lý tác chiến chốt sale Shinhan'.",
    `Chỉ dùng đúng 3 sản phẩm: ${PRODUCT_NAMES.join(", ")}.`,
    "BẮT BUỘC trả JSON thuần với đúng các trường:",
    "recommended_product, behavioral_rationale, statistical_evidence, sales_pitch_script, risk_warning_and_upsell.",
    "Không markdown, không thêm trường khác.",
    `Product catalog tham chiếu: ${JSON.stringify(productCatalog, null, 2)}`,
  ].join("\n");

  const raw = await qwenChat(
    [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Phân tích khách hàng từ payload đã ẩn PII:\n${JSON.stringify(maskedPayload, null, 2)}`,
      },
    ],
    { jsonMode: true }
  );

  const parsed = extractJson(raw);
  const recommended = String(parsed.recommended_product || "").trim();

  if (!PRODUCT_NAMES.includes(recommended)) {
    throw new Error(`Qwen returned invalid product: ${recommended || "EMPTY"}`);
  }

  const script = String(parsed.sales_pitch_script || "").trim();
  if (!script) throw new Error("Qwen missing sales_pitch_script");

  return {
    recommended_product: recommended,
    behavioral_rationale: normalizeList(parsed.behavioral_rationale),
    statistical_evidence: normalizeList(parsed.statistical_evidence),
    sales_pitch_script: script,
    risk_warning_and_upsell: normalizeList(parsed.risk_warning_and_upsell),
  };
}

export async function copilotWithQwen({ customer, analysis, message, history }) {
  const systemPrompt = [
    "Bạn là AI Copilot cho đội telesales Shinhan.",
    "Văn phong chuyên nghiệp ngân hàng quốc tế, ngắn gọn, thực chiến.",
    "Không bịa thông tin, không vượt ngoài danh mục sản phẩm được phép.",
  ].join("\n");

  const normalizedHistory = (history || [])
    .filter((item) => item && typeof item === "object")
    .slice(-8)
    .map((item) => ({
      role: item.role === "assistant" ? "assistant" : "user",
      content: String(item.content || ""),
    }));

  const contextPayload = {
    customer_id: customer.customer_id,
    full_name: customer.pii_data.full_name,
    job_title: customer.pii_data.job_title,
    deterministic_stats: customer.deterministic_stats,
    analysis_layer3: analysis,
  };

  const userPrompt = `Hãy phân tích và trả lời câu hỏi: ${JSON.stringify(
    String(message || "")
  )} với bối cảnh là:\n${JSON.stringify(contextPayload, null, 2)}`;

  const raw = await qwenChat(
    [
      { role: "system", content: systemPrompt },
      ...normalizedHistory,
      {
        role: "user",
        content: userPrompt,
      },
    ],
    { jsonMode: false, temperature: 0.35 }
  );

  return String(raw || "").trim();
}
