import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "127.0.0.1";

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, "utf8");
  const env = {};

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    value = value.replace(/^['"]|['"]$/g, "");
    env[key] = value;
  }

  return env;
}

function loadQwenEnv() {
  const candidates = [
    path.join(rootDir, "sf8-cuca-insider-ai", ".env.local"),
    path.join(rootDir, "sb10-queue-mind", ".env.local"),
  ];

  const merged = {};
  for (const file of candidates) {
    Object.assign(merged, parseEnvFile(file));
  }

  return {
    apiKey: (process.env.QWEN_API_KEY || process.env.DASHSCOPE_API_KEY || merged.QWEN_API_KEY || merged.DASHSCOPE_API_KEY || "").trim(),
    baseUrl: (process.env.BASE_URL || merged.BASE_URL || "https://dashscope-intl.aliyuncs.com/compatible-mode/v1").trim().replace(/\/$/, ""),
    model: (process.env.QWEN_MODEL || merged.QWEN_MODEL || "qwen-plus").trim(),
  };
}

const qwenEnv = loadQwenEnv();

function sendJson(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
  });
  res.end(JSON.stringify(data));
}

function sendText(res, status, text, contentType = "text/plain; charset=utf-8") {
  res.writeHead(status, { "Content-Type": contentType });
  res.end(text);
}

function fallbackSf11(employeeId) {
  return {
    source: "fallback",
    operator_summary: `Case ${employeeId} can still be reviewed locally with deterministic payroll policy checks.`,
    recommended_action: "Use the workflow board to confirm consent, payroll freshness, and deduction setup before disbursement.",
    risk_note: "AI insight is unavailable, so rely on local policy controls only.",
  };
}

function fallbackSf12(sellerId) {
  return {
    source: "fallback",
    operator_summary: `Seller ${sellerId} can still be reviewed using local alternative score and repayment simulation.`,
    recommended_action: "Check volatility, refund ratio, and the revenue-share waterfall before approving exposure.",
    risk_note: "AI insight is unavailable, so rely on deterministic scorecard outputs.",
  };
}

async function qwenChat(messages, { jsonMode = true, temperature = 0.25 } = {}) {
  if (!qwenEnv.apiKey) {
    throw new Error("Missing QWEN_API_KEY");
  }

  const response = await fetch(`${qwenEnv.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${qwenEnv.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: qwenEnv.model,
      messages,
      temperature,
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Qwen API ${response.status}: ${errorText.slice(0, 300)}`);
  }

  const data = await response.json();
  return String(data?.choices?.[0]?.message?.content || "").trim();
}

function extractJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Qwen did not return valid JSON");
    return JSON.parse(match[0]);
  }
}

async function getSf11Insight(params) {
  const { employeeId = "unknown", employerName = "", decision = "", riskBand = "", notes = "" } = params;
  const prompt = [
    "You are a bank risk and operations analyst for payroll-linked lending.",
    "Return strict JSON with keys: operator_summary, recommended_action, risk_note.",
    "Use VND when referencing currency amounts.",
    "Keep each field concise, practical, and under 35 words.",
  ].join("\n");

  const user = {
    employeeId,
    employerName,
    decision,
    riskBand,
    notes,
  };

  const raw = await qwenChat(
    [
      { role: "system", content: prompt },
      { role: "user", content: JSON.stringify(user, null, 2) },
    ],
    { jsonMode: true, temperature: 0.2 },
  );

  return { source: "qwen", ...extractJson(raw) };
}

async function getSf12Insight(params) {
  const { sellerId = "unknown", segment = "", decision = "", riskBand = "", notes = "" } = params;
  const prompt = [
    "You are a bank analyst for digital merchant lending and revenue-share collections.",
    "Return strict JSON with keys: operator_summary, recommended_action, risk_note.",
    "Use VND when referencing currency amounts.",
    "Keep each field concise, practical, and under 35 words.",
  ].join("\n");

  const user = {
    sellerId,
    segment,
    decision,
    riskBand,
    notes,
  };

  const raw = await qwenChat(
    [
      { role: "system", content: prompt },
      { role: "user", content: JSON.stringify(user, null, 2) },
    ],
    { jsonMode: true, temperature: 0.2 },
  );

  return { source: "qwen", ...extractJson(raw) };
}

function getContentType(filePath) {
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  if (filePath.endsWith(".js") || filePath.endsWith(".mjs")) return "text/javascript; charset=utf-8";
  if (filePath.endsWith(".json")) return "application/json; charset=utf-8";
  if (filePath.endsWith(".md")) return "text/markdown; charset=utf-8";
  return "application/octet-stream";
}

function safeResolve(urlPath) {
  const requested = urlPath === "/" ? "/README.md" : urlPath;
  const normalized = path.normalize(decodeURIComponent(requested)).replace(/^(\.\.[/\\])+/, "");
  const resolved = path.join(rootDir, normalized);
  if (!resolved.startsWith(rootDir)) return null;
  return resolved;
}

const server = http.createServer(async (req, res) => {
  if (!req.url) {
    sendJson(res, 400, { error: "Missing URL" });
    return;
  }

  const url = new URL(req.url, `http://localhost:${port}`);

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/health") {
    sendJson(res, 200, {
      ok: true,
      qwenConfigured: Boolean(qwenEnv.apiKey),
      model: qwenEnv.model,
    });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/sf11/insight") {
    try {
      const result = qwenEnv.apiKey ? await getSf11Insight(Object.fromEntries(url.searchParams)) : fallbackSf11(url.searchParams.get("employeeId"));
      sendJson(res, 200, result);
    } catch (error) {
      sendJson(res, 200, fallbackSf11(url.searchParams.get("employeeId")));
    }
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/sf12/insight") {
    try {
      const result = qwenEnv.apiKey ? await getSf12Insight(Object.fromEntries(url.searchParams)) : fallbackSf12(url.searchParams.get("sellerId"));
      sendJson(res, 200, result);
    } catch (error) {
      sendJson(res, 200, fallbackSf12(url.searchParams.get("sellerId")));
    }
    return;
  }

  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  const resolved = safeResolve(url.pathname);
  if (!resolved || !fs.existsSync(resolved) || fs.statSync(resolved).isDirectory()) {
    sendText(res, 404, "Not found");
    return;
  }

  sendText(res, 200, fs.readFileSync(resolved), getContentType(resolved));
});

server.listen(port, host, () => {
  console.log(`PoC server running at http://${host}:${port}`);
  console.log(`Qwen configured: ${qwenEnv.apiKey ? "yes" : "no"} | model=${qwenEnv.model}`);
});
