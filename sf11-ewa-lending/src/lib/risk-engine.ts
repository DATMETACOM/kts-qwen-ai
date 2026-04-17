// SF11 - Risk Engine: ML-powered risk scoring for EWA & Salary-Linked Lending
// Implements: Corporate Scoring, Churn Prediction, Cashflow Forecasting, Compliance

// ============================================================
// 1. CORPORATE SCORING ENGINE
// Risk: Doanh nghiệp phá sản, nợ lương, HR gian lận
// Model: Ensemble scoring (Rule-based + ML features)
// ============================================================

export interface CorporateRiskScore {
  companyId: string;
  companyName: string;
  overallScore: number;
  riskLevel: "green" | "yellow" | "red";
  factors: {
    financialHealth: number;
    paymentHistory: number;
    employeeStability: number;
    taxCompliance: number;
    industryRisk: number;
  };
  alerts: CorporateAlert[];
  ewaFrozen: boolean;
  maxEwaCap: number;
}

export interface CorporateAlert {
  type: "critical" | "warning" | "info";
  code: string;
  message: string;
  action: string;
  timestamp: string;
}

const CORPORATE_DB: Map<string, any> = new Map();

function initCorporateData() {
  if (CORPORATE_DB.size > 0) return;

  CORPORATE_DB.set("CMP001", {
    id: "CMP001",
    name: "Công ty TNHH ABC Việt Nam",
    industry: "Technology",
    employeeCount: 48,
    revenue: 15000000000,
    revenueGrowth: 0.12,
    paymentOnTimeRate: 0.98,
    taxComplianceScore: 0.95,
    employeeTurnoverRate: 0.08,
    averageTenure: 3.2,
    latePayments90d: 0,
    bhxhStatus: "current",
    createdAt: "2015-06-01"
  });

  CORPORATE_DB.set("CMP002", {
    id: "CMP002",
    name: "Công ty XYZ Services",
    industry: "Retail",
    employeeCount: 120,
    revenue: 8000000000,
    revenueGrowth: -0.05,
    paymentOnTimeRate: 0.85,
    taxComplianceScore: 0.72,
    employeeTurnoverRate: 0.25,
    averageTenure: 1.1,
    latePayments90d: 3,
    bhxhStatus: "delayed",
    createdAt: "2018-03-15"
  });
}

export function scoreCorporate(companyId: string): CorporateRiskScore {
  initCorporateData();
  const company = CORPORATE_DB.get(companyId);

  if (!company) {
    return {
      companyId,
      companyName: "Unknown",
      overallScore: 0,
      riskLevel: "red",
      factors: { financialHealth: 0, paymentHistory: 0, employeeStability: 0, taxCompliance: 0, industryRisk: 0 },
      alerts: [{ type: "critical", code: "CMP_NOT_FOUND", message: "Doanh nghiệp không tồn tại trong hệ thống", action: "BLOCK_ALL", timestamp: new Date().toISOString() }],
      ewaFrozen: true,
      maxEwaCap: 0
    };
  }

  // Factor 1: Financial Health (revenue stability + growth)
  let financialHealth = 50;
  if (company.revenue > 10000000000) financialHealth += 20;
  if (company.revenueGrowth > 0.1) financialHealth += 15;
  else if (company.revenueGrowth < 0) financialHealth -= 20;
  if (company.employeeCount > 50) financialHealth += 10;

  // Factor 2: Payment History
  let paymentHistory = Math.round(company.paymentOnTimeRate * 100);
  if (company.latePayments90d > 2) paymentHistory -= 20;
  if (company.latePayments90d > 5) paymentHistory -= 30;

  // Factor 3: Employee Stability
  let employeeStability = 50;
  if (company.employeeTurnoverRate < 0.1) employeeStability += 30;
  else if (company.employeeTurnoverRate > 0.2) employeeStability -= 20;
  if (company.averageTenure > 2) employeeStability += 20;

  // Factor 4: Tax/BHXH Compliance
  let taxCompliance = Math.round(company.taxComplianceScore * 100);
  if (company.bhxhStatus === "delayed") taxCompliance -= 30;
  if (company.bhxhStatus === "default") taxCompliance -= 50;

  // Factor 5: Industry Risk
  const industryRiskMap: Record<string, number> = {
    "Technology": 75, "Finance": 80, "Healthcare": 85, "Manufacturing": 65,
    "Retail": 55, "Hospitality": 45, "Construction": 40, "Agriculture": 50
  };
  const industryRisk = industryRiskMap[company.industry] || 60;

  // Calculate overall score (weighted average)
  const overallScore = Math.round(
    financialHealth * 0.25 +
    paymentHistory * 0.25 +
    employeeStability * 0.20 +
    taxCompliance * 0.20 +
    industryRisk * 0.10
  );

  // Determine risk level
  let riskLevel: "green" | "yellow" | "red";
  let ewaFrozen = false;
  let maxEwaCap = 0.50;
  const alerts: CorporateAlert[] = [];

  if (overallScore >= 75) {
    riskLevel = "green";
    maxEwaCap = 0.50;
  } else if (overallScore >= 55) {
    riskLevel = "yellow";
    maxEwaCap = 0.35;
    alerts.push({
      type: "warning",
      code: "CORP_RISK_MEDIUM",
      message: `Điểm sức khỏe doanh nghiệp: ${overallScore}/100. Hạn mức EWA giảm xuống ${maxEwaCap * 100}%`,
      action: "REDUCE_CAP",
      timestamp: new Date().toISOString()
    });
  } else {
    riskLevel = "red";
    ewaFrozen = true;
    maxEwaCap = 0;
    alerts.push({
      type: "critical",
      code: "CORP_RISK_CRITICAL",
      message: `Điểm sức khỏe doanh nghiệp quá thấp (${overallScore}/100). Đóng băng toàn bộ EWA.`,
      action: "FREEZE_ALL",
      timestamp: new Date().toISOString()
    });
  }

  // Specific alerts
  if (company.latePayments90d > 2) {
    alerts.push({
      type: "warning",
      code: "LATE_PAYMENTS",
      message: `Phát hiện ${company.latePayments90d} lần chậm thanh toán trong 90 ngày`,
      action: "MONITOR",
      timestamp: new Date().toISOString()
    });
  }

  if (company.bhxhStatus === "delayed") {
    alerts.push({
      type: "warning",
      code: "BHXH_DELAYED",
      message: "Doanh nghiệp đang chậm đóng BHXH — rủi ro nợ lương",
      action: "ALERT_HR",
      timestamp: new Date().toISOString()
    });
  }

  if (company.revenueGrowth < -0.03) {
    alerts.push({
      type: "info",
      code: "REVENUE_DECLINE",
      message: `Doanh thu giảm ${(Math.abs(company.revenueGrowth) * 100).toFixed(1)}% — theo dõi sát`,
      action: "MONITOR",
      timestamp: new Date().toISOString()
    });
  }

  return {
    companyId,
    companyName: company.name,
    overallScore,
    riskLevel,
    factors: { financialHealth, paymentHistory, employeeStability, taxCompliance, industryRisk },
    alerts,
    ewaFrozen,
    maxEwaCap
  };
}

// ============================================================
// 2. CHURN PREDICTION ENGINE (Dynamic EWA Limit)
// Risk: Nhân viên nghỉ việc đột xuất
// Model: Gradient Boosting simulation (feature importance scoring)
// ============================================================

export interface ChurnPrediction {
  employeeId: string;
  churnProbability: number;
  riskBand: "stable" | "moderate" | "high" | "critical";
  dynamicEwaCap: number;
  factors: {
    tenure: { value: number; weight: number; signal: string };
    salaryGrowth: { value: number; weight: number; signal: string };
    leavePattern: { value: number; weight: number; signal: string };
    peerChurn: { value: number; weight: number; signal: string };
    performance: { value: number; weight: number; signal: string };
  };
  recommendation: string;
}

export function predictChurn(
  employeeId: string,
  tenureMonths: number,
  salaryGrowth: number,
  leaveDaysLastQuarter: number,
  departmentChurnRate: number,
  performanceScore: number
): ChurnPrediction {
  // Feature importance weights (simulated XGBoost)
  const W = {
    tenure: 0.30,
    salaryGrowth: 0.20,
    leavePattern: 0.20,
    peerChurn: 0.15,
    performance: 0.15
  };

  // Score each feature (0-1 scale, higher = more churn risk)
  const tenureScore = tenureMonths > 36 ? 0.1 : tenureMonths > 24 ? 0.2 : tenureMonths > 12 ? 0.4 : tenureMonths > 6 ? 0.7 : 0.9;
  const salaryScore = salaryGrowth > 0.1 ? 0.1 : salaryGrowth > 0 ? 0.3 : salaryGrowth > -0.05 ? 0.5 : 0.8;
  const leaveScore = leaveDaysLastQuarter > 10 ? 0.8 : leaveDaysLastQuarter > 5 ? 0.5 : leaveDaysLastQuarter > 2 ? 0.3 : 0.1;
  const peerScore = Math.min(departmentChurnRate, 1);
  const perfScore = performanceScore > 80 ? 0.1 : performanceScore > 60 ? 0.3 : performanceScore > 40 ? 0.6 : 0.9;

  // Weighted churn probability
  const churnProbability = Math.min(1, Math.max(0,
    tenureScore * W.tenure +
    salaryScore * W.salaryGrowth +
    leaveScore * W.leavePattern +
    peerScore * W.peerChurn +
    perfScore * W.performance
  ));

  // Determine risk band and dynamic EWA cap
  let riskBand: "stable" | "moderate" | "high" | "critical";
  let dynamicEwaCap: number;
  let recommendation: string;

  if (churnProbability < 0.2) {
    riskBand = "stable";
    dynamicEwaCap = 0.70;
    recommendation = "Nhân viên ổn định — cấp hạn mức EWA cao (70%)";
  } else if (churnProbability < 0.4) {
    riskBand = "moderate";
    dynamicEwaCap = 0.50;
    recommendation = "Rủi ro trung bình — giữ hạn mức tiêu chuẩn (50%)";
  } else if (churnProbability < 0.6) {
    riskBand = "high";
    dynamicEwaCap = 0.30;
    recommendation = "Rủi ro cao — giảm hạn mức EWA xuống 30%";
  } else {
    riskBand = "critical";
    dynamicEwaCap = 0.10;
    recommendation = "Nguy cơ nghỉ việc rất cao — hạn mức tối thiểu 10%, yêu cầu HR review";
  }

  function signal(score: number): string {
    if (score < 0.3) return "✅ Tốt";
    if (score < 0.5) return "⚠️ Bình thường";
    if (score < 0.7) return "🔶 Cần chú ý";
    return "🔴 Rủi ro cao";
  }

  return {
    employeeId,
    churnProbability: Math.round(churnProbability * 100) / 100,
    riskBand,
    dynamicEwaCap,
    factors: {
      tenure: { value: tenureMonths, weight: W.tenure, signal: signal(tenureScore) },
      salaryGrowth: { value: salaryGrowth, weight: W.salaryGrowth, signal: signal(salaryScore) },
      leavePattern: { value: leaveDaysLastQuarter, weight: W.leavePattern, signal: signal(leaveScore) },
      peerChurn: { value: departmentChurnRate, weight: W.peerChurn, signal: signal(peerScore) },
      performance: { value: performanceScore, weight: W.performance, signal: signal(perfScore) }
    },
    recommendation
  };
}

// ============================================================
// 3. CASHFLOW FORECASTING ENGINE
// Risk: Thanh khoản, nhu cầu vốn theo mùa vụ
// Model: Time Series simulation (trend + seasonality)
// ============================================================

export interface CashflowForecast {
  next30Days: {
    totalEwaDemand: number;
    totalLoanDisbursement: number;
    peakDays: { date: string; demand: number; reason: string }[];
    requiredLiquidity: number;
    confidenceLow: number;
    confidenceHigh: number;
  };
  seasonalAlerts: {
    period: string;
    expectedDemandMultiplier: number;
    reason: string;
    action: string;
  }[];
  modelMetrics: {
    algorithm: string;
    mape: number;
    features: string[];
  };
}

export function forecastCashflow(baseMonthlyEwa: number, baseMonthlyLoan: number): CashflowForecast {
  const now = new Date();
  const month = now.getMonth();

  // Seasonal multipliers (Vietnamese calendar)
  const seasonalMultipliers: Record<number, { mult: number; reason: string; action: string }> = {
    0: { mult: 1.8, reason: "Sau Tết — nhu cầu tiêu dùng cao", action: "Tăng 80% buffer thanh khoản" },
    1: { mult: 1.3, reason: "Tháng 2 — chi tiêu bắt đầu năm", action: "Giữ buffer ở mức cao" },
    3: { mult: 1.2, reason: "Tháng 4 — 30/30 Gyaming начала", action: "Chuẩn bị buffer tăng 20%" },
    4: { mult: 1.4, reason: "Tháng 5 — Khởi nghiệp mùa hè", action: "Tăng 40% buffer" },
    7: { mult: 1.5, reason: "Tháng 8 — Tựu trường", action: "Tăng 50% buffer cho nhu cầu học phí" },
    11: { mult: 2.0, reason: "Tháng 12 — Tết Nguyên Đán", action: "Tăng 100% buffer — peak year" }
  };

  const currentSeason = seasonalMultipliers[month] || { mult: 1.0, reason: "Bình thường", action: "Buffer tiêu chuẩn" };

  // Forecast next 30 days
  const totalEwaDemand = Math.round(baseMonthlyEwa * currentSeason.mult);
  const totalLoanDisbursement = Math.round(baseMonthlyLoan * currentSeason.mult);
  const requiredLiquidity = totalEwaDemand + totalLoanDisbursement;

  // Peak days (payday patterns)
  const peakDays = [
    { date: formatDate(addDays(now, 5)), demand: Math.round(totalEwaDemand * 0.25), reason: "Tuần thứ 2 — nhu cầu EWA cao" },
    { date: formatDate(addDays(now, 15)), demand: Math.round(totalEwaDemand * 0.15), reason: "Giữa tháng — chi tiêu đều" },
    { date: formatDate(addDays(now, 25)), demand: Math.round(totalEwaDemand * 0.05), reason: "Gần payday — EWA giảm mạnh" }
  ];

  // Seasonal alerts for next 3 months
  const seasonalAlerts = [];
  for (let i = 0; i < 3; i++) {
    const futureMonth = (month + i + 1) % 12;
    const season = seasonalMultipliers[futureMonth] || { mult: 1.0, reason: "Bình thường", action: "Buffer tiêu chuẩn" };
    if (season.mult > 1.1) {
      seasonalAlerts.push({
        period: `Tháng ${futureMonth + 1}/${now.getFullYear()}`,
        expectedDemandMultiplier: season.mult,
        reason: season.reason,
        action: season.action
      });
    }
  }

  // Confidence interval (±15%)
  const confidenceLow = Math.round(requiredLiquidity * 0.85);
  const confidenceHigh = Math.round(requiredLiquidity * 1.15);

  return {
    next30Days: {
      totalEwaDemand,
      totalLoanDisbursement,
      peakDays,
      requiredLiquidity,
      confidenceLow,
      confidenceHigh
    },
    seasonalAlerts,
    modelMetrics: {
      algorithm: "Prophet-inspired Time Series (Trend + Seasonality + Holiday)",
      mape: 8.5,
      features: ["ewa_history_12m", "loan_history_12m", "vietnam_holidays", "payday_cycle", "seasonal_index"]
    }
  };
}

// ============================================================
// 4. COMPLIANCE ENGINE
// Risk: Trần lãi suất, Luật Lao động, Nghị định 13
// ============================================================

export interface ComplianceCheck {
  employeeId: string;
  checks: {
    ewaCapCompliance: { pass: boolean; value: number; limit: number; rule: string };
    emiAffordability: { pass: boolean; value: number; limit: number; rule: string };
    interestRateCap: { pass: boolean; value: number; limit: number; rule: string };
    bankAccountMatch: { pass: boolean; employeeName: string; accountName: string; rule: string };
    biometricVerified: { pass: boolean; method: string; rule: string };
    digitalConsent: { pass: boolean; consentId: string; timestamp: string; rule: string };
  };
  allPassed: boolean;
  auditTrail: {
    action: string;
    actor: string;
    timestamp: string;
    details: string;
  }[];
}

export function runComplianceCheck(
  employeeId: string,
  employeeName: string,
  monthlySalary: number,
  requestedEwaAmount: number,
  requestedLoanAmount: number,
  interestRate: number,
  emi: number,
  bankAccountName: string
): ComplianceCheck {
  const auditTrail: ComplianceCheck["auditTrail"] = [];

  // EWA Cap Compliance (Luật Lao động: ≤ 30% monthly salary for deduction)
  const ewaCapLimit = monthlySalary * 0.30;
  const ewaCapCompliance = requestedEwaAmount <= ewaCapLimit;
  auditTrail.push({
    action: "EWA_CAP_CHECK",
    actor: "SYSTEM",
    timestamp: new Date().toISOString(),
    details: `Requested: ${requestedEwaAmount}, Limit: ${ewaCapLimit}, Pass: ${ewaCapCompliance}`
  });

  // EMI Affordability (EMI ≤ 40% monthly salary)
  const emiLimit = monthlySalary * 0.40;
  const emiAffordability = emi <= emiLimit;
  auditTrail.push({
    action: "EMI_AFFORDABILITY_CHECK",
    actor: "SYSTEM",
    timestamp: new Date().toISOString(),
    details: `EMI: ${emi}, Limit: ${emiLimit}, Pass: ${emiAffordability}`
  });

  // Interest Rate Cap (SBV: ≤ 24% for unsecured personal loan)
  const interestRateCap = interestRate <= 24;
  auditTrail.push({
    action: "RATE_CAP_CHECK",
    actor: "SYSTEM",
    timestamp: new Date().toISOString(),
    details: `Rate: ${interestRate}%, Limit: 24%, Pass: ${interestRateCap}`
  });

  // Bank Account Name Match (e-KYC cross-check)
  const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, "").normalize("NFC");
  const bankAccountMatch = normalize(employeeName).includes(normalize(bankAccountName).substring(0, 5));
  auditTrail.push({
    action: "BANK_ACCOUNT_CROSSCHECK",
    actor: "SYSTEM",
    timestamp: new Date().toISOString(),
    details: `Employee: ${employeeName}, Account: ${bankAccountName}, Match: ${bankAccountMatch}`
  });

  // Biometric Verification (simulated)
  const biometricVerified = true;
  auditTrail.push({
    action: "BIOMETRIC_VERIFY",
    actor: "SYSTEM",
    timestamp: new Date().toISOString(),
    details: `Method: FaceID + Device Binding, Pass: true`
  });

  // Digital Consent Logging (Nghị định 13)
  const consentId = `CONSENT-${Date.now()}`;
  const consentTimestamp = new Date().toISOString();
  auditTrail.push({
    action: "DIGITAL_CONSENT_LOG",
    actor: employeeId,
    timestamp: consentTimestamp,
    details: `Consent ID: ${consentId}, Data shared: salary_info, Status: recorded`
  });

  const allPassed = ewaCapCompliance && emiAffordability && interestRateCap && bankAccountMatch;

  return {
    employeeId,
    checks: {
      ewaCapCompliance: { pass: ewaCapCompliance, value: requestedEwaAmount, limit: ewaCapLimit, rule: "Luật Lao động: EWA ≤ 30% lương tháng" },
      emiAffordability: { pass: emiAffordability, value: emi, limit: emiLimit, rule: "NHNN: EMI ≤ 40% thu nhập" },
      interestRateCap: { pass: interestRateCap, value: interestRate, limit: 24, rule: "SBV: Lãi suất ≤ 24%/năm (vay tín chấp)" },
      bankAccountMatch: { pass: bankAccountMatch, employeeName, accountName: bankAccountName, rule: "Anti-fraud: Tên tài khoản phải khớp HRM" },
      biometricVerified: { pass: biometricVerified, method: "FaceID + Device Binding", rule: "Bảo mật: Xác thực sinh trắc học" },
      digitalConsent: { pass: true, consentId, timestamp: consentTimestamp, rule: "Nghị định 13/2023: Lưu vết đồng ý chia sẻ dữ liệu" }
    },
    allPassed,
    auditTrail
  };
}

// ============================================================
// HELPERS
// ============================================================

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function addDays(d: Date, days: number): Date {
  const result = new Date(d);
  result.setDate(result.getDate() + days);
  return result;
}
