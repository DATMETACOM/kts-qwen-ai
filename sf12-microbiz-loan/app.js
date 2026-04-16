import { channels, rules, sellers } from "./data/mockData.js";

const state = {
  selectedSellerId: sellers[0]?.id ?? null,
  filters: {
    channelId: "all",
    decision: "all",
  },
  policy: {
    riskTolerance: 0,
    seasonalityShockPercent: 0,
    revenueShareCapPercent: 15,
  },
};

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Math.max(value, 0));
}

function formatPercent(value) {
  return `${Math.round(value * 100)}%`;
}

function getChannel(id) {
  return channels.find((channel) => channel.id === id);
}

function getSeasonalityFactor() {
  return 1 - state.policy.seasonalityShockPercent / 100;
}

function calculateDecision(seller) {
  const primaryChannel = getChannel(seller.primaryChannelId);
  const walletChannel = getChannel(seller.walletChannelId);
  const freshnessHours = Math.max(primaryChannel.freshnessHours, walletChannel.freshnessHours);
  const seasonalityFactor = getSeasonalityFactor();
  const stressedRevenue = seller.monthlyRevenue * seasonalityFactor;

  const score =
    100 -
    seller.volatility * 80 -
    seller.refundRate * 180 -
    seller.disputeRate * 220 +
    Math.max(seller.revenueGrowth, -0.2) * 60 +
    Math.min(seller.accountAgeMonths, 24) +
    seller.platformDiversity * 6 +
    seller.verifiedChannels * 8 -
    state.policy.riskTolerance;

  const altScore = Math.max(28, Math.min(92, Math.round(score)));
  const riskBand = altScore >= 78 ? "low" : altScore >= 62 ? "medium" : "high";

  const freshnessPenalty = freshnessHours > 24 ? 0.82 : 1;
  const volatilityPenalty = seller.volatility > 0.35 ? 0.72 : seller.volatility > 0.25 ? 0.86 : 1;
  const rawLoan = stressedRevenue * 0.45 * freshnessPenalty * volatilityPenalty;
  const recommendedLoan = Math.max(5000000, Math.min(50000000, Math.round(rawLoan / 1000000) * 1000000));

  const baseRevenueShare =
    riskBand === "low" ? 0.1 : riskBand === "medium" ? 0.125 : 0.15;
  const appliedRevenueShare = Math.min(baseRevenueShare, state.policy.revenueShareCapPercent / 100);
  const monthlyRepayment = stressedRevenue * appliedRevenueShare;
  const projectedTenor = Math.max(3, Math.ceil(recommendedLoan / Math.max(monthlyRepayment, 1)));

  let decision = "Decline";
  if (altScore >= 78 && freshnessHours <= 24) {
    decision = "Approve";
  } else if (altScore >= 62 && freshnessHours <= 36) {
    decision = "Review";
  }

  const flags = [];
  if (seller.volatility > 0.3) flags.push("High revenue volatility");
  if (seller.refundRate > 0.06) flags.push("Refund ratio above policy comfort");
  if (seller.disputeRate > 0.03) flags.push("Dispute rate spike");
  if (freshnessHours > 24) flags.push("Channel freshness outside live SLA");
  if (seller.revenueGrowth < 0) flags.push("Recent revenue contraction");

  const reasons = [
    `Alternative score is ${altScore}/100 based on revenue quality, growth, disputes, and data freshness.`,
    `Stressed revenue run rate is ${formatCurrency(stressedRevenue)} after seasonality adjustment.`,
    `Recommended revenue-share deduction is ${formatPercent(appliedRevenueShare)}.`,
    `Projected payoff horizon is ${projectedTenor} month(s).`,
  ];

  return {
    primaryChannel,
    walletChannel,
    altScore,
    riskBand,
    freshnessHours,
    stressedRevenue,
    recommendedLoan,
    appliedRevenueShare,
    monthlyRepayment,
    projectedTenor,
    decision,
    flags,
    reasons,
  };
}

function getPortfolioSummary() {
  const decisions = sellers.map(calculateDecision);
  const approved = decisions.filter((item) => item.decision === "Approve");
  const review = decisions.filter((item) => item.decision === "Review");
  const avgScore = decisions.reduce((sum, item) => sum + item.altScore, 0) / decisions.length;

  return {
    approvalRate: approved.length / sellers.length,
    reviewRate: review.length / sellers.length,
    avgScore,
    totalExposure: approved.reduce((sum, item) => sum + item.recommendedLoan, 0),
    avgRevenueShare:
      approved.reduce((sum, item) => sum + item.appliedRevenueShare, 0) / Math.max(approved.length, 1),
  };
}

function getFilteredSellers() {
  const filtered = sellers.filter((seller) => {
    const result = calculateDecision(seller);
    const matchesChannel =
      state.filters.channelId === "all" ||
      seller.primaryChannelId === state.filters.channelId ||
      seller.walletChannelId === state.filters.channelId;
    const matchesDecision =
      state.filters.decision === "all" || result.decision === state.filters.decision;

    return matchesChannel && matchesDecision;
  });

  if (!filtered.some((seller) => seller.id === state.selectedSellerId)) {
    state.selectedSellerId = filtered[0]?.id ?? sellers[0]?.id ?? null;
  }

  return filtered;
}

function renderHeroStats() {
  const summary = getPortfolioSummary();
  const items = [
    { label: "Approval rate", value: formatPercent(summary.approvalRate) },
    { label: "Cases in review", value: formatPercent(summary.reviewRate) },
    { label: "Average alt score", value: `${Math.round(summary.avgScore)}` },
    { label: "Booked exposure", value: formatCurrency(summary.totalExposure) },
  ];

  document.getElementById("hero-stats").innerHTML = items
    .map(
      (item) => `
        <article class="hero-stat">
          <span class="hero-stat-label">${item.label}</span>
          <strong class="hero-stat-value">${item.value}</strong>
        </article>
      `,
    )
    .join("");
}

function renderChannels() {
  document.getElementById("channel-list").innerHTML = channels
    .map(
      (channel) => `
        <article class="channel-card">
          <header>
            <div>
              <h3 class="channel-name">${channel.name}</h3>
              <p>${channel.type}</p>
            </div>
            <span class="status-pill status-${channel.status}">${channel.status}</span>
          </header>
          <ul class="channel-meta">
            <li>Sellers covered: ${channel.sellers}</li>
            <li>Data freshness: ${channel.freshnessHours} hours</li>
            <li>Coverage: ${formatPercent(channel.coverage)}</li>
          </ul>
        </article>
      `,
    )
    .join("");
}

function renderPortfolioMetrics() {
  const summary = getPortfolioSummary();
  const metrics = [
    { label: "Average revenue share", value: formatPercent(summary.avgRevenueShare || 0) },
    { label: "Live exposure", value: formatCurrency(summary.totalExposure) },
    { label: "Policy revenue-share cap", value: `${state.policy.revenueShareCapPercent}%` },
    { label: "Target NPL band", value: "< 5%" },
  ];

  document.getElementById("portfolio-metrics").innerHTML = metrics
    .map(
      (metric) => `
        <article class="metric-card">
          <span class="metric-label">${metric.label}</span>
          <strong class="metric-value">${metric.value}</strong>
        </article>
      `,
    )
    .join("");
}

function renderScenarioControls() {
  document.getElementById("scenario-controls").innerHTML = `
    <article class="control-card">
      <label for="risk-slider">Risk tightening</label>
      <input id="risk-slider" type="range" min="0" max="20" step="2" value="${state.policy.riskTolerance}" />
      <span class="control-value">-${state.policy.riskTolerance} score points</span>
    </article>
    <article class="control-card">
      <label for="seasonality-slider">Seasonality shock</label>
      <input id="seasonality-slider" type="range" min="0" max="40" step="5" value="${state.policy.seasonalityShockPercent}" />
      <span class="control-value">-${state.policy.seasonalityShockPercent}% revenue</span>
    </article>
    <article class="control-card">
      <label for="share-slider">Revenue-share cap</label>
      <input id="share-slider" type="range" min="8" max="20" step="1" value="${state.policy.revenueShareCapPercent}" />
      <span class="control-value">${state.policy.revenueShareCapPercent}% of revenue</span>
    </article>
    <article class="control-card control-actions">
      <button id="reset-policy" class="control-button" type="button">Reset baseline scenario</button>
    </article>
  `;

  document.getElementById("risk-slider").addEventListener("input", (event) => {
    state.policy.riskTolerance = Number(event.target.value);
    rerender();
  });

  document.getElementById("seasonality-slider").addEventListener("input", (event) => {
    state.policy.seasonalityShockPercent = Number(event.target.value);
    rerender();
  });

  document.getElementById("share-slider").addEventListener("input", (event) => {
    state.policy.revenueShareCapPercent = Number(event.target.value);
    rerender();
  });

  document.getElementById("reset-policy").addEventListener("click", () => {
    state.policy = {
      riskTolerance: 0,
      seasonalityShockPercent: 0,
      revenueShareCapPercent: 15,
    };
    rerender();
  });
}

function renderRules() {
  document.getElementById("rule-list").innerHTML = rules
    .map(
      (rule) => `
        <article class="rule-card">
          <span class="panel-label">${rule.impact}</span>
          <h3>${rule.title}</h3>
          <p>${rule.description}</p>
        </article>
      `,
    )
    .join("");
}

function renderQueueFilters() {
  document.getElementById("queue-filters").innerHTML = `
    <div class="filter-control">
      <label for="channel-filter">Channel</label>
      <select id="channel-filter">
        <option value="all">All channels</option>
        ${channels
          .map(
            (channel) => `
              <option value="${channel.id}" ${state.filters.channelId === channel.id ? "selected" : ""}>
                ${channel.name}
              </option>
            `,
          )
          .join("")}
      </select>
    </div>
    <div class="filter-control">
      <label for="decision-filter">Decision</label>
      <select id="decision-filter">
        <option value="all">All decisions</option>
        <option value="Approve" ${state.filters.decision === "Approve" ? "selected" : ""}>Approve</option>
        <option value="Review" ${state.filters.decision === "Review" ? "selected" : ""}>Review</option>
        <option value="Decline" ${state.filters.decision === "Decline" ? "selected" : ""}>Decline</option>
      </select>
    </div>
  `;

  document.getElementById("channel-filter").addEventListener("change", (event) => {
    state.filters.channelId = event.target.value;
    rerender();
  });

  document.getElementById("decision-filter").addEventListener("change", (event) => {
    state.filters.decision = event.target.value;
    rerender();
  });
}

function renderSellers() {
  const visibleSellers = getFilteredSellers();

  if (visibleSellers.length === 0) {
    document.getElementById("seller-list").innerHTML = `
      <article class="seller-card">
        <header>
          <div>
            <h3 class="seller-title">No sellers match the current filters</h3>
            <p>Broaden channel or decision filters to restore the queue.</p>
          </div>
        </header>
      </article>
    `;
    return;
  }

  document.getElementById("seller-list").innerHTML = visibleSellers
    .map((seller) => {
      const result = calculateDecision(seller);
      const isActive = seller.id === state.selectedSellerId;
      return `
        <article class="seller-card ${isActive ? "is-active" : ""}" data-seller-id="${seller.id}">
          <header>
            <div>
              <h3 class="seller-title">${seller.name}</h3>
              <p>${seller.segment}</p>
            </div>
            <span class="badge risk-${result.riskBand}">${result.riskBand} risk</span>
          </header>
          <div class="status-row">
            <span class="chip">${result.decision}</span>
            <span class="chip">${formatCurrency(result.recommendedLoan)}</span>
          </div>
          <ul class="seller-meta">
            <li>Primary channel: ${result.primaryChannel.name}</li>
            <li>Monthly revenue: ${formatCurrency(seller.monthlyRevenue)}</li>
            <li>Alt score: ${result.altScore}</li>
          </ul>
        </article>
      `;
    })
    .join("");

  document.querySelectorAll("[data-seller-id]").forEach((node) => {
    node.addEventListener("click", () => {
      state.selectedSellerId = node.getAttribute("data-seller-id");
      renderSellers();
      renderSellerDetail();
    });
  });
}

function renderSellerDetail() {
  const visibleSellers = getFilteredSellers();
  const seller = visibleSellers.find((item) => item.id === state.selectedSellerId) ?? visibleSellers[0];

  if (!seller) {
    document.getElementById("seller-detail").innerHTML = `
      <div class="detail-main">
        <span class="panel-label">Decision Layer</span>
        <h3>No seller selected</h3>
        <p>Current filters removed all queue cases. Reset or broaden the filters to continue.</p>
      </div>
    `;
    return;
  }

  const result = calculateDecision(seller);
  const decisionMemo = [
    `${seller.name} is currently mapped to ${result.decision.toLowerCase()}.`,
    `Alternative score ${result.altScore} is driven by ${seller.segment.toLowerCase()} cash-flow quality and channel behavior.`,
    `Projected revenue-share repayment collects ${formatCurrency(result.monthlyRepayment)} per month under the current revenue run rate.`,
  ].join(" ");

  document.getElementById("seller-detail").innerHTML = `
    <div class="detail-main">
      <div class="detail-top">
        <div>
          <span class="panel-label">Selected seller</span>
          <h3>${seller.name}</h3>
          <p>${seller.segment}</p>
        </div>
        <span class="badge risk-${result.riskBand}">${result.decision}</span>
      </div>

      <div class="mini-grid">
        <article class="mini-card">
          <span class="mini-label">Alternative score</span>
          <strong>${result.altScore}</strong>
        </article>
        <article class="mini-card">
          <span class="mini-label">Recommended loan</span>
          <strong>${formatCurrency(result.recommendedLoan)}</strong>
        </article>
        <article class="mini-card">
          <span class="mini-label">Revenue-share deduction</span>
          <strong>${formatPercent(result.appliedRevenueShare)}</strong>
        </article>
        <article class="mini-card">
          <span class="mini-label">Projected tenor</span>
          <strong>${result.projectedTenor} mo</strong>
        </article>
      </div>

      <div class="detail-grid">
        <section class="detail-section">
          <h4>Operator memo</h4>
          <div class="memo-box">${decisionMemo}</div>
        </section>
        <section class="detail-section">
          <h4>Decision rationale</h4>
          <ul class="detail-list">
            ${result.reasons.map((reason) => `<li>${reason}</li>`).join("")}
          </ul>
        </section>
        <section class="detail-section">
          <h4>Monitoring flags</h4>
          <ul class="detail-list">
            ${
              result.flags.length > 0
                ? result.flags.map((flag) => `<li>${flag}</li>`).join("")
                : "<li>No critical warning flags under current scenario.</li>"
            }
          </ul>
        </section>
        <section class="detail-section">
          <h4>Case data</h4>
          <ul class="detail-list">
            <li>Primary channel freshness: ${result.primaryChannel.freshnessHours} hours</li>
            <li>Wallet channel freshness: ${result.walletChannel.freshnessHours} hours</li>
            <li>Refund ratio: ${formatPercent(seller.refundRate)}</li>
            <li>Dispute ratio: ${formatPercent(seller.disputeRate)}</li>
            <li>Queue view: ${visibleSellers.length} seller(s) after filters</li>
          </ul>
        </section>
      </div>
    </div>
  `;
}

function renderSignals() {
  const approvedCount = sellers.filter((seller) => calculateDecision(seller).decision === "Approve").length;
  const highRiskCount = sellers.filter((seller) => calculateDecision(seller).riskBand === "high").length;
  const staleChannels = channels.filter((channel) => channel.freshnessHours > 24).length;
  const seasonalShock = state.policy.seasonalityShockPercent;

  const signals = [
    {
      title: "Portfolio concentration",
      description: `${approvedCount} sellers are currently bookable; monitor dependence on top marketplace channels before scaling.`,
      bullets: ["Track exposure by platform", "Set partner concentration caps"],
    },
    {
      title: "High-risk seller watchlist",
      description: `${highRiskCount} sellers currently sit in the high-risk band and require either decline or tighter ticket sizing.`,
      bullets: ["Review refund spikes", "Review volatility patterns"],
    },
    {
      title: "Data freshness watch",
      description: `${staleChannels} channel(s) are outside the preferred freshness SLA for instant approval.`,
      bullets: ["Trigger manual review", "Escalate partner data sync"],
    },
    {
      title: "Seasonality stress",
      description: seasonalShock > 0
        ? `Current scenario applies a ${seasonalShock}% revenue shock. Watch projected tenor drift and collections pressure.`
        : "Baseline scenario assumes stable recent revenue run rate.",
      bullets: ["Stress quarterly dips", "Monitor payoff horizon drift"],
    },
  ];

  document.getElementById("signal-list").innerHTML = signals
    .map(
      (signal) => `
        <article class="signal-card">
          <span class="panel-label">Monitoring</span>
          <h3>${signal.title}</h3>
          <p>${signal.description}</p>
          <ul>
            ${signal.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}
          </ul>
        </article>
      `,
    )
    .join("");
}

function rerender() {
  renderHeroStats();
  renderChannels();
  renderPortfolioMetrics();
  renderScenarioControls();
  renderRules();
  renderQueueFilters();
  renderSellers();
  renderSellerDetail();
  renderSignals();
}

rerender();
