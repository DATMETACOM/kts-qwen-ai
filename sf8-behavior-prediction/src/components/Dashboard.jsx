import { useEffect, useMemo, useRef, useState } from "react";
import { SendHorizontal, X } from "lucide-react";
import { fetchAnalysis, fetchCustomers, sendCopilotMessage } from "../services/api.js";

const QUICK_PROMPTS = [
  "Khách hàng phản biện về lãi suất, hãy gợi ý cách xử lý phù hợp.",
  "Tóm tắt 3 tín hiệu tin cậy mạnh nhất để thuyết phục khách hàng.",
  "Soạn kịch bản chốt cuộc gọi dưới 80 từ.",
];

const RISK_STYLES = {
  Low: { width: "35%", color: "bg-emerald-500", label: "Low" },
  Medium: { width: "65%", color: "bg-amber-500", label: "Medium" },
  High: { width: "90%", color: "bg-rose-500", label: "High" },
};

const SOURCE_BADGE = {
  e_wallet: "bg-sky-50 text-sky-700 border-sky-200",
  social_media: "bg-violet-50 text-violet-700 border-violet-200",
  telco: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

function flattenTags(behavioralTags) {
  const rows = [];
  for (const source of ["e_wallet", "social_media", "telco"]) {
    for (const tag of behavioralTags[source] || []) {
      rows.push({ source, tag });
    }
  }
  return rows;
}

function toTrustScore(customer) {
  const base = customer.risk_score === "Low" ? 72 : customer.risk_score === "Medium" ? 58 : 43;
  return Math.min(100, base + customer.lookalike_rate);
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function buildKpiCards(customers) {
  if (!customers.length) {
    return [
      { label: "Total Qualified Customers", value: 0 },
      { label: "Priority Outreach", value: 0 },
      { label: "Standard Nurture", value: 0 },
      { label: "Average Trust Score", value: 0 },
    ];
  }

  const priorityCount = customers.filter((item) => item.risk_score === "Low").length;
  const nurtureCount = customers.length - priorityCount;
  const avgTrust = Math.round(
    customers.reduce((sum, item) => sum + toTrustScore(item), 0) / customers.length
  );

  return [
    { label: "Total Qualified Customers", value: customers.length },
    { label: "Priority Outreach", value: priorityCount },
    { label: "Standard Nurture", value: nurtureCount },
    { label: "Average Trust Score", value: avgTrust },
  ];
}

function trimText(value, maxLength = 220) {
  const text = String(value || "").trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shouldRetryCopilot(error) {
  const message = String(error?.message || "").toLowerCase();
  return (
    message.includes("http 502") ||
    message.includes("failed to fetch") ||
    message.includes("network") ||
    message.includes("timeout") ||
    message.includes("qwen") ||
    message.includes("503") ||
    message.includes("504")
  );
}

function buildAnalysisMessages(analysis) {
  const rationaleLines = safeArray(analysis.behavioral_rationale).slice(0, 3);
  const evidenceLines = safeArray(analysis.statistical_evidence).slice(0, 3);
  const riskLines = safeArray(analysis.risk_warning_and_upsell).slice(0, 2);

  return [
    {
      role: "assistant",
      kind: "analysis",
      content: [
        "Gói phân tích đã sẵn sàng.",
        `Sản phẩm đề xuất: ${analysis.recommended_product || "N/A"}`,
        `Kịch bản tư vấn: ${trimText(analysis.sales_pitch_script, 320)}`,
      ].join("\n"),
    },
    {
      role: "assistant",
      kind: "analysis",
      content:
        "Luận điểm hành vi:\n" +
        (rationaleLines.length
          ? rationaleLines.map((item) => `- ${item}`).join("\n")
          : "- Chưa có luận điểm hành vi."),
    },
    {
      role: "assistant",
      kind: "analysis",
      content:
        "Dẫn chứng định lượng:\n" +
        (evidenceLines.length
          ? evidenceLines.map((item) => `- ${item}`).join("\n")
          : "- Chưa có dẫn chứng định lượng."),
    },
    {
      role: "assistant",
      kind: "analysis",
      content:
        "Lưu ý rủi ro và Upsell:\n" +
        (riskLines.length
          ? riskLines.map((item) => `- ${item}`).join("\n")
          : "- Chưa có ghi chú rủi ro."),
    },
  ];
}

export default function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);

  const [analysisByCustomer, setAnalysisByCustomer] = useState({});
  const [analysisFingerprintByCustomer, setAnalysisFingerprintByCustomer] = useState({});
  const [analysisLoadingByCustomer, setAnalysisLoadingByCustomer] = useState({});

  const [chatByCustomer, setChatByCustomer] = useState({});
  const [chatLoadingByCustomer, setChatLoadingByCustomer] = useState({});
  const [chatProgressByCustomer, setChatProgressByCustomer] = useState({});
  const [chatInput, setChatInput] = useState("");

  const chatViewportRef = useRef(null);
  const chatInputRef = useRef(null);
  const chatProgressTimersRef = useRef({});

  useEffect(() => {
    let mounted = true;

    fetchCustomers()
      .then((rows) => {
        if (!mounted) return;
        setCustomers(rows);
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message);
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const heroCustomer = useMemo(() => {
    if (!customers.length) return null;
    return customers.reduce((best, current) =>
      toTrustScore(current) > toTrustScore(best) ? current : best
    );
  }, [customers]);

  useEffect(() => {
    if (!customers.length || selectedCustomerId || !heroCustomer) return;
    setSelectedCustomerId(heroCustomer.customer_id);
    ensureConversation(heroCustomer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customers, heroCustomer, selectedCustomerId]);

  useEffect(() => {
    if (!isWorkspaceOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isWorkspaceOpen]);

  useEffect(() => {
    return () => {
      const timers = Object.values(chatProgressTimersRef.current);
      for (const timer of timers) clearInterval(timer);
      chatProgressTimersRef.current = {};
    };
  }, []);

  const kpiCards = useMemo(() => buildKpiCards(customers), [customers]);

  const selectedCustomer = useMemo(
    () => customers.find((item) => item.customer_id === selectedCustomerId) || null,
    [customers, selectedCustomerId]
  );

  const currentChat = selectedCustomer ? chatByCustomer[selectedCustomer.customer_id] || [] : [];
  const currentAnalysis = selectedCustomer
    ? analysisByCustomer[selectedCustomer.customer_id] || null
    : null;
  const isAnalysisLoading = selectedCustomer
    ? Boolean(analysisLoadingByCustomer[selectedCustomer.customer_id])
    : false;
  const isChatLoading = selectedCustomer
    ? Boolean(chatLoadingByCustomer[selectedCustomer.customer_id])
    : false;
  const chatProgressPercent = selectedCustomer
    ? Number(chatProgressByCustomer[selectedCustomer.customer_id] || 0)
    : 0;

  useEffect(() => {
    if (!isWorkspaceOpen) return;
    const viewport = chatViewportRef.current;
    if (!viewport) return;
    viewport.scrollTop = viewport.scrollHeight;
  }, [currentChat.length, selectedCustomerId, isAnalysisLoading, isChatLoading, isWorkspaceOpen]);

  useEffect(() => {
    if (!isWorkspaceOpen || !selectedCustomer) return;
    chatInputRef.current?.focus();
  }, [isWorkspaceOpen, selectedCustomer]);

  function ensureConversation(customer) {
    setChatByCustomer((prev) => {
      if (prev[customer.customer_id]) return prev;
      return {
        ...prev,
        [customer.customer_id]: [
          {
            role: "assistant",
            kind: "welcome",
            content:
              "Không gian tư vấn đã sẵn sàng. Nhấn 'Tải ngữ cảnh phân tích' để đưa script và insight trực tiếp vào khung chat.",
          },
        ],
      };
    });
  }

  function closeWorkspace() {
    setIsWorkspaceOpen(false);
  }

  function clearChatProgressTimer(customerId) {
    const timer = chatProgressTimersRef.current[customerId];
    if (timer) {
      clearInterval(timer);
      delete chatProgressTimersRef.current[customerId];
    }
  }

  function startChatProgress(customerId) {
    clearChatProgressTimer(customerId);
    const startedAt = Date.now();

    setChatProgressByCustomer((prev) => ({
      ...prev,
      [customerId]: 4,
    }));

    chatProgressTimersRef.current[customerId] = setInterval(() => {
      const elapsedMs = Date.now() - startedAt;
      const nextPercent = Math.min(92, 4 + Math.round((elapsedMs / 55000) * 88));
      setChatProgressByCustomer((prev) => ({
        ...prev,
        [customerId]: nextPercent,
      }));
    }, 500);
  }

  function finishChatProgress(customerId, success) {
    clearChatProgressTimer(customerId);
    if (!success) {
      setChatProgressByCustomer((prev) => ({
        ...prev,
        [customerId]: 0,
      }));
      return;
    }

    setChatProgressByCustomer((prev) => ({
      ...prev,
      [customerId]: 100,
    }));

    setTimeout(() => {
      setChatProgressByCustomer((prev) => ({
        ...prev,
        [customerId]: 0,
      }));
    }, 650);
  }

  async function activateCustomer(customer) {
    setSelectedCustomerId(customer.customer_id);
    setIsWorkspaceOpen(true);
    setChatInput("");
    ensureConversation(customer);

    if (!analysisByCustomer[customer.customer_id] && !analysisLoadingByCustomer[customer.customer_id]) {
      await loadAnalysis(customer.customer_id);
    }
  }

  async function loadAnalysis(customerId, { force = false } = {}) {
    if (!force && analysisByCustomer[customerId]) return analysisByCustomer[customerId];

    setAnalysisLoadingByCustomer((prev) => ({
      ...prev,
      [customerId]: true,
    }));

    try {
      const { data } = await fetchAnalysis(customerId, { withMeta: true });
      setAnalysisByCustomer((prev) => ({
        ...prev,
        [customerId]: data,
      }));

      const nextFingerprint = `${data.recommended_product || ""}|${data.sales_pitch_script || ""}`;
      const prevFingerprint = analysisFingerprintByCustomer[customerId];

      if (nextFingerprint !== prevFingerprint) {
        const analysisMessages = buildAnalysisMessages(data);
        setChatByCustomer((prev) => ({
          ...prev,
          [customerId]: [...(prev[customerId] || []), ...analysisMessages],
        }));

        setAnalysisFingerprintByCustomer((prev) => ({
          ...prev,
          [customerId]: nextFingerprint,
        }));
      }
      return data;
    } catch (err) {
      setChatByCustomer((prev) => ({
        ...prev,
        [customerId]: [
          ...(prev[customerId] || []),
          {
            role: "assistant",
            kind: "error",
            content: `Yêu cầu phân tích thất bại: ${err.message}`,
          },
        ],
      }));
      return null;
    } finally {
      setAnalysisLoadingByCustomer((prev) => ({
        ...prev,
        [customerId]: false,
      }));
    }
  }

  async function handleSendMessage(overrideText) {
    if (!selectedCustomer) return;

    const message = String(overrideText || chatInput || "").trim();
    if (!message || isChatLoading) return;

    const customerId = selectedCustomer.customer_id;
    const baseHistory = chatByCustomer[customerId] || [];
    const nextHistory = [...baseHistory, { role: "user", content: message }];

    setChatByCustomer((prev) => ({
      ...prev,
      [customerId]: nextHistory,
    }));
    setChatInput("");

    setChatLoadingByCustomer((prev) => ({
      ...prev,
      [customerId]: true,
    }));
    startChatProgress(customerId);

    let isSuccessful = false;
    try {
      let analysisContext = analysisByCustomer[customerId] || null;
      if (!analysisContext) {
        setChatByCustomer((prev) => ({
          ...prev,
          [customerId]: [
            ...(prev[customerId] || []),
            {
              role: "assistant",
              kind: "analysis",
              content:
                "Đang tải ngữ cảnh phân tích cho khách hàng này trước khi gửi truy vấn tới Copilot...",
            },
          ],
        }));

        analysisContext = await loadAnalysis(customerId, { force: true });
      }

      if (!analysisContext) {
        throw new Error("Không thể tải ngữ cảnh phân tích cho khách hàng.");
      }

      let payload = null;
      let lastError = null;

      for (let attempt = 1; attempt <= 2; attempt += 1) {
        try {
          const response = await sendCopilotMessage(customerId, message, nextHistory.slice(-8), {
            withMeta: true,
            analysis: analysisContext,
          });
          payload = response?.data || null;
          lastError = null;
          break;
        } catch (err) {
          lastError = err;
          if (attempt < 2 && shouldRetryCopilot(err)) {
            await sleep(900);
            continue;
          }
          break;
        }
      }

      if (lastError) throw lastError;

      const reply = String(payload?.reply || "").trim();
      if (!reply) throw new Error("Copilot chưa trả nội dung phản hồi.");

      setChatByCustomer((prev) => ({
        ...prev,
        [customerId]: [...(prev[customerId] || []), { role: "assistant", content: reply }],
      }));
      isSuccessful = true;
    } catch (err) {
      setChatByCustomer((prev) => ({
        ...prev,
        [customerId]: [
          ...(prev[customerId] || []),
          {
            role: "assistant",
            kind: "error",
            content: `Yêu cầu Copilot thất bại: ${err.message}`,
          },
        ],
      }));
    } finally {
      setChatLoadingByCustomer((prev) => ({
        ...prev,
        [customerId]: false,
      }));
      finishChatProgress(customerId, isSuccessful);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <header className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-700">Cuca-Insider-AI</p>
          <h1 className="mt-2 text-2xl font-bold md:text-3xl">
            One-Page Advisory Workspace for Next Best Offer
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Analytics context, script guidance, and Copilot conversation run in a single page flow for frontline execution.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpiCards.map((item) => (
            <article key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-3xl font-bold text-slate-900">{item.value}</p>
              <p className="mt-2 text-sm text-slate-500">{item.label}</p>
            </article>
          ))}
        </div>

        <section className="mt-5 rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Priority Profile</p>
          {heroCustomer ? (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{heroCustomer.full_name}</h2>
                <p className="text-sm text-slate-500">{heroCustomer.job_title}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-emerald-600">{toTrustScore(heroCustomer)}/100</p>
                <p className="text-xs text-slate-500">Trust Score</p>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500">Loading priority profile...</p>
          )}
        </section>

        <section className="mt-5">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Target Customer Pipeline</h2>
              <span className="text-xs font-medium text-slate-500">ALTERNATIVE DATA INTELLIGENCE</span>
            </div>

            {loading ? <p className="text-sm text-slate-500">Loading customer pipeline...</p> : null}
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}

            {!loading && !error ? (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-slate-500">
                      <th className="pb-3 pr-3">Customer</th>
                      <th className="pb-3 pr-3">Behavior Signals</th>
                      <th className="pb-3 pr-3">Risk Level</th>
                      <th className="pb-3 pr-3">NBO Recommendation</th>
                      <th className="pb-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => {
                      const riskStyle = RISK_STYLES[customer.risk_score] || RISK_STYLES.Medium;
                      const isSelected = customer.customer_id === selectedCustomerId;

                      return (
                        <tr
                          key={customer.customer_id}
                          className={`border-b border-gray-200 align-top ${isSelected ? "bg-sky-50/60" : ""}`}
                        >
                          <td className="py-4 pr-3">
                            <p className="font-medium text-slate-900">{customer.full_name}</p>
                            <p className="text-xs text-slate-500">{customer.job_title}</p>
                          </td>
                          <td className="py-4 pr-3">
                            <div className="flex flex-wrap gap-2">
                              {flattenTags(customer.behavioral_tags).map((item, idx) => (
                                <span
                                  key={`${customer.customer_id}-${idx}`}
                                  className={`rounded-full border px-2.5 py-1 text-xs ${SOURCE_BADGE[item.source]}`}
                                >
                                  {item.tag}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-4 pr-3">
                            <div className="mb-1 h-2.5 w-28 rounded-full bg-slate-100">
                              <div
                                className={`h-2.5 rounded-full ${riskStyle.color}`}
                                style={{ width: riskStyle.width }}
                              />
                            </div>
                            <span className="text-xs font-semibold text-slate-600">{riskStyle.label}</span>
                          </td>
                          <td className="py-4 pr-3 font-medium">{customer.recommended_nbo}</td>
                          <td className="py-4">
                            <button
                              type="button"
                              onClick={() => activateCustomer(customer)}
                              className="rounded-lg bg-sky-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-sky-700"
                            >
                              Open Workspace
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : null}
          </article>
        </section>
      </section>

      {isWorkspaceOpen ? (
        <div className="fixed inset-0 z-50 p-3 sm:p-5">
          <button
            type="button"
            onClick={closeWorkspace}
            className="absolute inset-0 bg-slate-900/45"
            aria-label="Close workspace"
          />
          <section className="relative mx-auto flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <header className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h3 className="text-lg font-semibold">Advisory Workspace</h3>
                {selectedCustomer ? (
                  <p className="mt-1 text-xs text-slate-500">
                    {selectedCustomer.full_name} | {selectedCustomer.customer_id} | {selectedCustomer.job_title}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-slate-500">No customer selected.</p>
                )}
              </div>
              <button
                type="button"
                onClick={closeWorkspace}
                className="rounded-md border border-slate-300 p-2 text-slate-600 hover:bg-slate-50"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </header>

            {!selectedCustomer ? (
              <div className="flex flex-1 items-center justify-center px-6 text-center text-sm text-slate-500">
                Select a customer from the pipeline to start advisory interaction.
              </div>
            ) : (
              <>
                <div className="border-b border-slate-200 px-5 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => loadAnalysis(selectedCustomer.customer_id, { force: true })}
                      disabled={isAnalysisLoading}
                      className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                    >
                      {isAnalysisLoading ? "Đang tải ngữ cảnh..." : "Tải ngữ cảnh phân tích"}
                    </button>
                    <span className="text-xs text-slate-500">
                      {currentAnalysis ? "Đã có ngữ cảnh" : "Chưa tải ngữ cảnh"}
                    </span>
                  </div>
                </div>

                <div ref={chatViewportRef} className="flex-1 space-y-2 overflow-y-auto bg-slate-50 px-4 py-4">
                  {currentChat.map((item, idx) => (
                    <div
                      key={`chat-${idx}`}
                      className={`max-w-[92%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm ${
                        item.role === "user"
                          ? "ml-auto bg-sky-600 text-white"
                          : item.kind === "error"
                            ? "mr-auto bg-rose-50 text-rose-700"
                            : item.kind === "analysis"
                              ? "mr-auto border border-indigo-200 bg-indigo-50 text-indigo-900"
                              : "mr-auto bg-white text-slate-800"
                      }`}
                    >
                      {item.content}
                    </div>
                  ))}

                  {isAnalysisLoading ? (
                    <div className="mr-auto max-w-[92%] rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm text-indigo-900">
                      Đang xây dựng ngữ cảnh phân tích cho khách hàng...
                    </div>
                  ) : null}

                  {isChatLoading ? (
                    <div className="mr-auto max-w-[92%] rounded-lg bg-white px-3 py-2 text-sm text-slate-500">
                      <p>Copilot đang soạn phản hồi... khoảng {chatProgressPercent}%</p>
                      <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200">
                        <div
                          className="h-1.5 rounded-full bg-sky-600 transition-all"
                          style={{ width: `${chatProgressPercent}%` }}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="border-t border-slate-200 px-4 py-3">
                  <div className="mb-2 flex flex-wrap gap-2">
                    {QUICK_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => handleSendMessage(prompt)}
                        disabled={isChatLoading}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 hover:bg-slate-100 disabled:opacity-60"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-end gap-2">
                    <textarea
                      ref={chatInputRef}
                      value={chatInput}
                      onChange={(event) => setChatInput(event.target.value)}
                      placeholder="Nhập câu hỏi xử lý phản biện, dẫn chứng thuyết phục hoặc kịch bản chốt cuộc gọi..."
                      rows={2}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-sky-300 transition focus:ring"
                    />
                    <button
                      type="button"
                      onClick={() => handleSendMessage()}
                      disabled={isChatLoading || !chatInput.trim()}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-60"
                    >
                      <SendHorizontal size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      ) : null}
    </main>
  );
}
