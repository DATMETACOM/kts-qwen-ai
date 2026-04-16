import { employers, employees, rules } from "./data/mockData.js";

const state = {
  selectedEmployeeId: employees[0]?.id ?? null,
  filters: {
    employerId: "all",
    decision: "all",
  },
  policy: {
    ewaCapMultiplier: 100,
    maxFreshnessHours: 48,
    dsrCapPercent: 35,
  },
};

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value) {
  return `${Math.round(value * 100)}%`;
}

function getEmployer(id) {
  return employers.find((employer) => employer.id === id);
}

function getPolicy() {
  return {
    ewaCapMultiplier: state.policy.ewaCapMultiplier / 100,
    maxFreshnessHours: state.policy.maxFreshnessHours,
    dsrCapRatio: state.policy.dsrCapPercent / 100,
  };
}

function calculateDecision(employee) {
  const policy = getPolicy();
  const employer = getEmployer(employee.employerId);
  const earnedGross = (employee.monthlySalary / employee.cycleDays) * employee.daysWorked;
  const appliedEwaCap = employer.defaultEwaCap * policy.ewaCapMultiplier;
  const rawEwa = Math.max(earnedGross * appliedEwaCap - employee.priorEwaAmount, 0);
  const payrollFresh = employer.syncHoursAgo <= policy.maxFreshnessHours;
  const eligibleForEwa =
    employee.consent &&
    employee.bankVerified &&
    payrollFresh &&
    employee.attendanceScore >= 80 &&
    employee.tenureMonths >= 3;

  const ewaAmount = eligibleForEwa ? Math.round(rawEwa / 10000) * 10000 : 0;
  const riskScore =
    (employer.status === "paused" ? 30 : employer.status === "pilot" ? 12 : 0) +
    (employee.externalDebtRatio > 0.25 ? 25 : employee.externalDebtRatio > 0.18 ? 12 : 0) +
    (employee.attendanceScore < 85 ? 18 : 0) +
    (employee.tenureMonths < 6 ? 20 : 0) +
    (!employee.consent ? 35 : 0) +
    (!employee.bankVerified ? 15 : 0) +
    (!payrollFresh ? 20 : 0);

  const riskBand = riskScore >= 50 ? "high" : riskScore >= 25 ? "medium" : "low";
  const maxInstallment = employee.netSalary * policy.dsrCapRatio - employee.netSalary * employee.externalDebtRatio;
  const loanAmount = Math.max(Math.round(maxInstallment * 6 * 0.9 / 10000) * 10000, 0);

  let decision = "Decline";
  if (ewaAmount > 0) {
    decision = "Approve EWA";
  } else if (loanAmount > 0 && employee.consent && employee.tenureMonths >= 6 && payrollFresh) {
    decision = "Offer Salary Loan";
  }

  const reasons = [
    payrollFresh ? "Payroll feed is fresh enough for digital verification." : "Payroll feed is stale and requires fallback review.",
    employee.consent ? "Employee consent is active." : "Employee consent is missing.",
    employee.bankVerified ? "Salary destination account is verified." : "Salary destination account is not verified.",
    `Attendance score is ${employee.attendanceScore}/100.`,
    `External debt-service ratio is ${formatPercent(employee.externalDebtRatio)}.`,
  ];

  return {
    employer,
    earnedGross,
    appliedEwaCap,
    ewaAmount,
    loanAmount,
    maxInstallment: Math.max(maxInstallment, 0),
    payrollFresh,
    decision,
    riskBand,
    reasons,
  };
}

function getPortfolioSummary() {
  const decisions = employees.map(calculateDecision);
  const approvedEwa = decisions.filter((item) => item.decision === "Approve EWA");
  const salaryLoans = decisions.filter((item) => item.decision === "Offer Salary Loan");
  const liveEmployers = employers.filter((employer) => employer.status === "live").length;
  const avgFreshness =
    employers.reduce((sum, employer) => sum + employer.syncHoursAgo, 0) / Math.max(employers.length, 1);

  return {
    liveEmployers,
    approvalRate: (approvedEwa.length + salaryLoans.length) / employees.length,
    totalEwaExposure: approvedEwa.reduce((sum, item) => sum + item.ewaAmount, 0),
    totalLoanExposure: salaryLoans.reduce((sum, item) => sum + item.loanAmount, 0),
    avgFreshness,
  };
}

function getFilteredEmployees() {
  const filtered = employees.filter((employee) => {
    const result = calculateDecision(employee);
    const matchesEmployer =
      state.filters.employerId === "all" || employee.employerId === state.filters.employerId;
    const matchesDecision =
      state.filters.decision === "all" || result.decision === state.filters.decision;

    return matchesEmployer && matchesDecision;
  });

  if (!filtered.some((employee) => employee.id === state.selectedEmployeeId)) {
    state.selectedEmployeeId = filtered[0]?.id ?? employees[0]?.id ?? null;
  }

  return filtered;
}

function getWorkflowForEmployee(employee, result) {
  const steps = [
    {
      title: "Consent captured",
      detail: employee.consent ? "Employee data-sharing consent is active." : "Consent is missing.",
      state: employee.consent ? "done" : "blocked",
    },
    {
      title: "Payroll verified",
      detail: result.payrollFresh
        ? `Payroll feed from ${result.employer.payrollProvider} is within freshness policy.`
        : "Payroll data is stale and cannot support instant processing.",
      state: result.payrollFresh ? "done" : "blocked",
    },
    {
      title: "Offer approved",
      detail:
        result.decision === "Decline"
          ? "No offer can be approved under current policy."
          : `${result.decision} is available for this employee.`,
      state: result.decision === "Decline" ? "blocked" : "done",
    },
    {
      title: "Disbursement ready",
      detail:
        result.decision === "Approve EWA"
          ? `Instant wage access can disburse ${formatCurrency(result.ewaAmount)}.`
          : result.decision === "Offer Salary Loan"
            ? `Salary-linked loan can disburse ${formatCurrency(result.loanAmount)} after acceptance.`
            : "Disbursement remains blocked.",
      state: result.decision === "Decline" ? "blocked" : "current",
    },
    {
      title: "Payroll auto-debit scheduled",
      detail:
        result.decision === "Decline"
          ? "No deduction setup created."
          : "Repayment deduction will be attached to the next payroll cycle.",
      state: result.decision === "Decline" ? "blocked" : "pending",
    },
  ];

  return steps;
}

function getAuditEntries(employee, result) {
  return [
    {
      label: "Data intake",
      title: "Employee and payroll snapshot loaded",
      detail: `${employee.name} was scored against ${result.employer.name} with ${employee.tenureMonths} months tenure and ${employee.attendanceScore}/100 attendance.`,
    },
    {
      label: "Policy gate",
      title: "Consent and freshness checks applied",
      detail: `Consent is ${employee.consent ? "active" : "missing"} and payroll freshness status is ${result.payrollFresh ? "pass" : "fail"}.`,
    },
    {
      label: "Offer sizing",
      title: "Exposure limits recalculated",
      detail:
        result.decision === "Approve EWA"
          ? `EWA cap and prior usage produced an eligible amount of ${formatCurrency(result.ewaAmount)}.`
          : `Debt-service capacity produced a salary-linked loan capacity of ${formatCurrency(result.loanAmount)}.`,
    },
    {
      label: "Collections",
      title: "Payroll deduction memo prepared",
      detail:
        result.decision === "Decline"
          ? "No collection setup is permitted because the case remains blocked."
          : `Repayment will rely on payroll deduction with a max cycle capacity of ${formatCurrency(result.maxInstallment)}.`,
    },
  ];
}

function renderHeroStats() {
  const summary = getPortfolioSummary();
  const items = [
    { label: "Active integrations", value: `${summary.liveEmployers}/${employers.length}` },
    { label: "Decision coverage", value: formatPercent(summary.approvalRate) },
    { label: "EWA exposure", value: formatCurrency(summary.totalEwaExposure) },
    { label: "Policy DSR cap", value: `${state.policy.dsrCapPercent}%` },
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

function renderEmployers() {
  document.getElementById("employer-list").innerHTML = employers
    .map(
      (employer) => `
        <article class="employer-card">
          <header>
            <div>
              <h3 class="employer-name">${employer.name}</h3>
              <p>${employer.payrollProvider}</p>
            </div>
            <span class="status-pill status-${employer.status}">${employer.status}</span>
          </header>
          <ul class="employer-meta">
            <li>Payroll cycle: ${employer.payCycle}</li>
            <li>Employees covered: ${employer.employees}</li>
            <li>Feed freshness: ${employer.syncHoursAgo} hours ago</li>
            <li>EWA cap: ${formatPercent(employer.defaultEwaCap * getPolicy().ewaCapMultiplier)}</li>
          </ul>
        </article>
      `,
    )
    .join("");
}

function renderPortfolioMetrics() {
  const summary = getPortfolioSummary();
  const metrics = [
    { label: "Average payroll freshness", value: `${Math.round(summary.avgFreshness)}h` },
    { label: "Projected EWA utilization", value: formatCurrency(summary.totalEwaExposure) },
    { label: "Projected loan book", value: formatCurrency(summary.totalLoanExposure) },
    { label: "Target NPL band", value: "< 2%" },
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

function renderEmployees() {
  const visibleEmployees = getFilteredEmployees();

  if (visibleEmployees.length === 0) {
    document.getElementById("employee-list").innerHTML = `
      <article class="employee-card">
        <header>
          <div>
            <h3 class="employee-title">No employees match the current filters</h3>
            <p>Broaden employer or decision filters to resume review.</p>
          </div>
        </header>
      </article>
    `;
    return;
  }

  document.getElementById("employee-list").innerHTML = visibleEmployees
    .map((employee) => {
      const result = calculateDecision(employee);
      const isActive = employee.id === state.selectedEmployeeId;
      return `
        <article class="employee-card ${isActive ? "is-active" : ""}" data-employee-id="${employee.id}">
          <header>
            <div>
              <h3 class="employee-title">${employee.name}</h3>
              <p>${employee.role}</p>
            </div>
            <span class="badge risk-${result.riskBand}">${result.riskBand} risk</span>
          </header>
          <div class="status-row">
            <span class="chip">${result.decision}</span>
            <span class="chip">${formatCurrency(employee.netSalary)} net</span>
          </div>
          <ul class="employee-meta">
            <li>Employer: ${result.employer.name}</li>
            <li>Tenure: ${employee.tenureMonths} months</li>
            <li>Attendance: ${employee.attendanceScore}/100</li>
          </ul>
        </article>
      `;
    })
    .join("");

  document.querySelectorAll("[data-employee-id]").forEach((node) => {
    node.addEventListener("click", () => {
      state.selectedEmployeeId = node.getAttribute("data-employee-id");
      renderEmployees();
      renderEmployeeDetail();
    });
  });
}

function renderQueueFilters() {
  document.getElementById("queue-filters").innerHTML = `
    <div class="filter-control">
      <label for="employer-filter">Employer</label>
      <select id="employer-filter">
        <option value="all">All employers</option>
        ${employers
          .map(
            (employer) => `
              <option value="${employer.id}" ${state.filters.employerId === employer.id ? "selected" : ""}>
                ${employer.name}
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
        <option value="Approve EWA" ${state.filters.decision === "Approve EWA" ? "selected" : ""}>Approve EWA</option>
        <option value="Offer Salary Loan" ${state.filters.decision === "Offer Salary Loan" ? "selected" : ""}>Offer Salary Loan</option>
        <option value="Decline" ${state.filters.decision === "Decline" ? "selected" : ""}>Decline</option>
      </select>
    </div>
  `;

  document.getElementById("employer-filter").addEventListener("change", (event) => {
    state.filters.employerId = event.target.value;
    rerender();
  });

  document.getElementById("decision-filter").addEventListener("change", (event) => {
    state.filters.decision = event.target.value;
    rerender();
  });
}

function renderEmployeeDetail() {
  const visibleEmployees = getFilteredEmployees();
  const employee = visibleEmployees.find((item) => item.id === state.selectedEmployeeId) ?? visibleEmployees[0];

  if (!employee) {
    document.getElementById("employee-detail").innerHTML = `
      <div class="detail-main">
        <span class="panel-label">Decision Layer</span>
        <h3>No employee selected</h3>
        <p>Current filters removed all queue candidates. Reset or broaden the queue filters to continue.</p>
      </div>
    `;
    return;
  }

  const result = calculateDecision(employee);
  const decisionMemo = [
    `${employee.name} is currently mapped to ${result.decision.toLowerCase()}.`,
    `Payroll data from ${result.employer.payrollProvider} is ${result.payrollFresh ? "within" : "outside"} the policy freshness window.`,
    `Current disposable payroll capacity supports up to ${formatCurrency(result.maxInstallment)} per cycle.`,
  ].join(" ");

  document.getElementById("employee-detail").innerHTML = `
    <div class="detail-main">
      <div class="detail-top">
        <div>
          <span class="panel-label">Selected employee</span>
          <h3>${employee.name}</h3>
          <p>${employee.role} at ${result.employer.name}</p>
        </div>
        <span class="badge risk-${result.riskBand}">${result.decision}</span>
      </div>

      <div class="mini-grid">
        <article class="mini-card">
          <span class="mini-label">Earned salary verified</span>
          <strong>${formatCurrency(result.earnedGross)}</strong>
        </article>
        <article class="mini-card">
          <span class="mini-label">Eligible EWA amount</span>
          <strong>${formatCurrency(result.ewaAmount)}</strong>
        </article>
        <article class="mini-card">
          <span class="mini-label">Salary-loan offer</span>
          <strong>${formatCurrency(result.loanAmount)}</strong>
        </article>
        <article class="mini-card">
          <span class="mini-label">Max payroll installment</span>
          <strong>${formatCurrency(result.maxInstallment)}</strong>
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
          <h4>Policy checks</h4>
          <ul class="detail-list">
            <li>Consent: ${employee.consent ? "Active" : "Missing"}</li>
            <li>Bank account match: ${employee.bankVerified ? "Verified" : "Unverified"}</li>
            <li>Payroll freshness: ${result.payrollFresh ? "Pass" : "Fail"}</li>
            <li>Applied EWA cap: ${formatPercent(result.appliedEwaCap)}</li>
            <li>Prior EWA used this cycle: ${formatCurrency(employee.priorEwaAmount)}</li>
            <li>Queue view: ${visibleEmployees.length} employee(s) after filters</li>
          </ul>
        </section>
      </div>
    </div>
  `;
}

function renderWorkflowBoard() {
  const employee = employees.find((item) => item.id === state.selectedEmployeeId) ?? employees[0];
  const result = calculateDecision(employee);
  const steps = getWorkflowForEmployee(employee, result);

  document.getElementById("workflow-board").innerHTML = steps
    .map(
      (step) => `
        <article class="workflow-step is-${step.state}">
          <h3>${step.title}</h3>
          <p>${step.detail}</p>
        </article>
      `,
    )
    .join("");
}

function renderAuditLog() {
  const employee = employees.find((item) => item.id === state.selectedEmployeeId) ?? employees[0];
  const result = calculateDecision(employee);
  const entries = getAuditEntries(employee, result);

  document.getElementById("audit-log").innerHTML = entries
    .map(
      (entry) => `
        <article class="audit-item">
          <span class="audit-meta">${entry.label}</span>
          <h3>${entry.title}</h3>
          <p>${entry.detail}</p>
        </article>
      `,
    )
    .join("");
}

function renderScenarioControls() {
  document.getElementById("scenario-controls").innerHTML = `
    <article class="control-card">
      <label for="ewa-cap-slider">Employer EWA cap multiplier</label>
      <input id="ewa-cap-slider" type="range" min="70" max="120" step="5" value="${state.policy.ewaCapMultiplier}" />
      <span class="control-value">${state.policy.ewaCapMultiplier}% of base cap</span>
    </article>
    <article class="control-card">
      <label for="freshness-slider">Allowed payroll freshness</label>
      <input id="freshness-slider" type="range" min="12" max="72" step="6" value="${state.policy.maxFreshnessHours}" />
      <span class="control-value">${state.policy.maxFreshnessHours} hours</span>
    </article>
    <article class="control-card">
      <label for="dsr-slider">Max debt-service ratio</label>
      <input id="dsr-slider" type="range" min="25" max="45" step="1" value="${state.policy.dsrCapPercent}" />
      <span class="control-value">${state.policy.dsrCapPercent}% of net salary</span>
    </article>
    <article class="control-card control-actions">
      <button id="reset-policy" class="control-button" type="button">Reset baseline policy</button>
    </article>
  `;

  document.getElementById("ewa-cap-slider").addEventListener("input", (event) => {
    state.policy.ewaCapMultiplier = Number(event.target.value);
    rerender();
  });

  document.getElementById("freshness-slider").addEventListener("input", (event) => {
    state.policy.maxFreshnessHours = Number(event.target.value);
    rerender();
  });

  document.getElementById("dsr-slider").addEventListener("input", (event) => {
    state.policy.dsrCapPercent = Number(event.target.value);
    rerender();
  });

  document.getElementById("reset-policy").addEventListener("click", () => {
    state.policy = {
      ewaCapMultiplier: 100,
      maxFreshnessHours: 48,
      dsrCapPercent: 35,
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

function rerender() {
  renderHeroStats();
  renderEmployers();
  renderPortfolioMetrics();
  renderScenarioControls();
  renderQueueFilters();
  renderEmployees();
  renderEmployeeDetail();
  renderRules();
  renderWorkflowBoard();
  renderAuditLog();
}

rerender();
