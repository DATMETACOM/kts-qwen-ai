import { employers, employees, rules } from "./data/mockData.js";

const state = {
  selectedEmployeeId: employees[0]?.id ?? null,
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

function calculateDecision(employee) {
  const employer = getEmployer(employee.employerId);
  const earnedGross = (employee.monthlySalary / employee.cycleDays) * employee.daysWorked;
  const rawEwa = Math.max(earnedGross * employer.defaultEwaCap - employee.priorEwaAmount, 0);
  const payrollFresh = employer.syncHoursAgo <= 48;
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
  const maxInstallment = employee.netSalary * 0.35 - employee.netSalary * employee.externalDebtRatio;
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

function renderHeroStats() {
  const summary = getPortfolioSummary();
  const items = [
    { label: "Active integrations", value: `${summary.liveEmployers}/${employers.length}` },
    { label: "Decision coverage", value: formatPercent(summary.approvalRate) },
    { label: "EWA exposure", value: formatCurrency(summary.totalEwaExposure) },
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
            <li>EWA cap: ${formatPercent(employer.defaultEwaCap)}</li>
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
  document.getElementById("employee-list").innerHTML = employees
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

function renderEmployeeDetail() {
  const employee = employees.find((item) => item.id === state.selectedEmployeeId) ?? employees[0];
  const result = calculateDecision(employee);

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
            <li>Prior EWA used this cycle: ${formatCurrency(employee.priorEwaAmount)}</li>
          </ul>
        </section>
      </div>
    </div>
  `;
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

function init() {
  renderHeroStats();
  renderEmployers();
  renderPortfolioMetrics();
  renderEmployees();
  renderEmployeeDetail();
  renderRules();
}

init();
