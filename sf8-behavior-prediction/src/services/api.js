const API_BASE = import.meta.env.VITE_API_BASE || "";

async function request(path, options = {}, config = {}) {
  const startedAt = typeof performance !== "undefined" ? performance.now() : Date.now();
  const response = await fetch(`${API_BASE}${path}`, options);
  const endedAt = typeof performance !== "undefined" ? performance.now() : Date.now();
  const latencyMs = Math.max(0, Math.round(endedAt - startedAt));
  if (!response.ok) {
    let detail = `HTTP ${response.status}`;
    let errorPayload = null;
    try {
      const payload = await response.json();
      errorPayload = payload;
      if (payload?.detail) detail = payload.detail;
    } catch {
      // Keep status detail only.
    }
    const error = new Error(detail);
    error.status = response.status;
    error.path = path;
    error.latencyMs = latencyMs;
    if (errorPayload?._meta) error.meta = errorPayload._meta;
    throw error;
  }

  const data = await response.json();
  if (config.withMeta) {
    return {
      data,
      meta: {
        status: response.status,
        latencyMs,
        path,
      },
    };
  }
  return data;
}

export function fetchCustomers(config = {}) {
  return request("/api/customers", undefined, config);
}

export function fetchAnalysis(customerId, config = {}) {
  return request(`/api/analyze/${customerId}`, undefined, config);
}

export function sendCopilotMessage(customerId, message, history, config = {}) {
  const payload = {
    message,
    history,
  };
  if (config.analysis && typeof config.analysis === "object") {
    payload.analysis = config.analysis;
  }
  const { analysis, ...requestConfig } = config;

  return request(`/api/copilot/${customerId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }, requestConfig);
}
