"use client";

import { useState, useEffect } from "react";

// Types
interface Employee {
  id: string;
  name: string;
  company: string;
  position: string;
  monthlySalary: number;
  tenure: string;
}

interface CreditScore {
  score: number;
  riskLevel: string;
  reasons: string[];
  eligibleAmount: number;
  interestRate: number;
  maxTenor: number;
  recommendedProducts: any[];
}

interface EWABalance {
  earnedBalance: number;
  availableToWithdraw: number;
  maxWithdrawal: number;
  currentDay: number;
  totalDaysInMonth: number;
}

// Mock current user (Employee view)
const CURRENT_EMPLOYEE_ID = "EMP001";

function formatVND(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

function getRiskColor(riskLevel: string) {
  if (riskLevel === "low") return "text-green-600 bg-green-100";
  if (riskLevel === "medium") return "text-yellow-600 bg-yellow-100";
  return "text-red-600 bg-red-100";
}

function getRiskLabel(riskLevel: string) {
  if (riskLevel === "low") return "Thấp";
  if (riskLevel === "medium") return "Trung bình";
  return "Cao";
}

export default function Home() {
  const [role, setRole] = useState<"employee" | "hr" | "admin">("employee");
  const [tab, setTab] = useState<"overview" | "ewa" | "loan" | "history">("overview");

  // Employee data
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  // EWA state
  const [ewaBalance, setEWABalance] = useState<EWABalance | null>(null);
  const [ewaAmount, setEwaAmount] = useState("");
  const [ewaLoading, setEWALoading] = useState(false);
  const [ewaResult, setEWAResult] = useState<any>(null);

  // Loan state
  const [creditScore, setCreditScore] = useState<CreditScore | null>(null);
  const [loanAmount, setLoanAmount] = useState("");
  const [loanTenor, setLoanTenor] = useState(36);
  const [loanLoading, setLoanLoading] = useState(false);
  const [loanResult, setLoanResult] = useState<any>(null);

  // Fetch employee data on mount
  useEffect(() => {
    fetchEmployeeData();
  }, []);

  async function fetchEmployeeData() {
    try {
      setLoading(true);

      // Call salary verification API
      const res = await fetch(`/api/verify-salary?employeeId=${CURRENT_EMPLOYEE_ID}`);
      const data = await res.json();

      if (data.verified) {
        setEmployee(data.employee);

        // Calculate EWA balance
        const now = new Date();
        const currentDay = now.getDate();
        const totalDaysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const earnedBalance = (data.employee.monthlySalary * currentDay) / totalDaysInMonth;
        const maxWithdrawal = earnedBalance * 0.5;

        setEWABalance({
          earnedBalance,
          availableToWithdraw: maxWithdrawal,
          maxWithdrawal,
          currentDay,
          totalDaysInMonth
        });
      }
    } catch (error) {
      console.error("Failed to fetch employee data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleEWASubmit() {
    const amount = parseInt(ewaAmount);
    if (!amount || amount <= 0) return;

    setEWALoading(true);
    try {
      const res = await fetch("/api/ewa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: CURRENT_EMPLOYEE_ID,
          amount
        })
      });
      const data = await res.json();
      setEWAResult(data);

      if (data.success) {
        // Refresh EWA balance
        await fetchEmployeeData();
      }
    } catch (error) {
      console.error("EWA request failed:", error);
    } finally {
      setEWALoading(false);
    }
  }

  async function handleCreditScoreCheck() {
    const amount = loanAmount ? parseInt(loanAmount) : undefined;

    setLoanLoading(true);
    try {
      const res = await fetch("/api/credit-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: CURRENT_EMPLOYEE_ID,
          requestedAmount: amount
        })
      });
      const data = await res.json();

      if (data.success) {
        setCreditScore(data.creditScore);
        setLoanAmount(String(data.creditScore.eligibleAmount));
      }
    } catch (error) {
      console.error("Credit scoring failed:", error);
    } finally {
      setLoanLoading(false);
    }
  }

  async function handleLoanSubmit() {
    if (!creditScore) return;

    const amount = parseInt(loanAmount);
    if (!amount || amount <= 0) return;

    setLoanLoading(true);
    try {
      const res = await fetch("/api/loan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: CURRENT_EMPLOYEE_ID,
          amount,
          tenor: loanTenor,
          productId: "pl-personal",
          creditScoreResult: creditScore
        })
      });
      const data = await res.json();
      setLoanResult(data);
    } catch (error) {
      console.error("Loan submission failed:", error);
    } finally {
      setLoanLoading(false);
    }
  }

  // Render based on role
  if (role === "hr") return <HRPortal />;
  if (role === "admin") return <AdminPortal />;

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      {/* Header */}
      <header className="bg-[#003478] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C8A96E] rounded-lg flex items-center justify-center font-bold text-[#003478] text-lg">
              S
            </div>
            <div>
              <h1 className="text-lg font-bold">Shinhan Finance</h1>
              <p className="text-xs text-blue-200">Earned Wage Access & Salary-Linked Lending</p>
            </div>
          </div>
          <div className="flex gap-2">
            {(["employee", "hr", "admin"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                  role === r ? "bg-[#C8A96E] text-[#003478]" : "bg-blue-900 text-blue-200 hover:bg-blue-800"
                }`}
              >
                {r === "employee" ? "Nhân viên" : r === "hr" ? "HR Admin" : "Shinhan Admin"}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 border-b bg-white px-4 pt-2">
        {[
          { key: "overview" as const, label: "Tổng quan" },
          { key: "ewa" as const, label: "Rút lương trước" },
          { key: "loan" as const, label: "Vay tín chấp" },
          { key: "history" as const, label: "Lịch sử" }
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium rounded-t transition ${
              tab === t.key ? "bg-[#F5F6FA] text-[#003478] border-b-2 border-[#003478]" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003478]"></div>
          </div>
        ) : !employee ? (
          <div className="text-center py-20 text-gray-500">Không tìm thấy thông tin nhân viên</div>
        ) : (
          <>
            {/* Overview Tab */}
            {tab === "overview" && (
              <div className="space-y-4">
                {/* Employee Info */}
                <div className="bg-white rounded-xl shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-gray-500 text-sm">Xin chào,</p>
                      <h2 className="text-xl font-bold text-[#003478]">{employee.name}</h2>
                      <p className="text-gray-400 text-sm">{employee.company} • {employee.position}</p>
                      <p className="text-gray-400 text-sm">Mã NV: {employee.id} • {employee.tenure}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500 text-sm">Lương tháng</p>
                      <p className="text-2xl font-bold text-[#003478]">{formatVND(employee.monthlySalary)}</p>
                    </div>
                  </div>

                  {/* Pay Period Progress */}
                  {ewaBalance && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Tiến độ kỳ lương (T4/2026)</span>
                        <span className="font-bold text-[#003478]">
                          {Math.round((ewaBalance.currentDay / ewaBalance.totalDaysInMonth) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-3">
                        <div
                          className="bg-[#003478] rounded-full h-3 transition-all"
                          style={{ width: `${(ewaBalance.currentDay / ewaBalance.totalDaysInMonth) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Ngày {ewaBalance.currentDay}/{ewaBalance.totalDaysInMonth} • Đã kiếm {formatVND(ewaBalance.earnedBalance)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl shadow p-4 text-center">
                    <p className="text-gray-500 text-sm mb-1">EWA khả dụng</p>
                    <p className="text-xl font-bold text-green-600">
                      {ewaBalance ? formatVND(ewaBalance.availableToWithdraw) : "—"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Tối đa 50% lương</p>
                  </div>
                  <div className="bg-white rounded-xl shadow p-4 text-center">
                    <p className="text-gray-500 text-sm mb-1">Hạn mức vay</p>
                    <p className="text-xl font-bold text-[#003478]">150M</p>
                    <p className="text-xs text-gray-400 mt-1">Lãi suất từ 18%/năm</p>
                  </div>
                  <div className="bg-white rounded-xl shadow p-4 text-center">
                    <p className="text-gray-500 text-sm mb-1">Điểm tín dụng</p>
                    <p className="text-xl font-bold text-purple-600">750</p>
                    <p className="text-xs text-gray-400 mt-1">Xếp hạng: Tốt</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setTab("ewa")}
                    className="bg-[#003478] text-white rounded-xl p-4 text-left hover:bg-[#002050] transition"
                  >
                    <p className="font-bold text-lg">💰 Rút lương trước (EWA)</p>
                    <p className="text-blue-200 text-sm mt-1">Tiếp cận lương đã kiếm ngay hôm nay</p>
                  </button>
                  <button
                    onClick={() => { setTab("loan"); handleCreditScoreCheck(); }}
                    className="bg-[#C8A96E] text-[#003478] rounded-xl p-4 text-left hover:bg-[#b8964e] transition"
                  >
                    <p className="font-bold text-lg">🏦 Vay tín chấp lương</p>
                    <p className="text-[#003478]/70 text-sm mt-1">Paperless • AI scoring • Lãi suất 18%/năm</p>
                  </button>
                </div>

                {/* Shinhan Products */}
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="font-bold text-[#003478] mb-4">Sản phẩm Shinhan Finance</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4">
                      <p className="font-bold text-sm mb-2">Vay tín chấp cá nhân</p>
                      <p className="text-xs text-gray-500 mb-2">Lãi suất từ 18%/năm</p>
                      <p className="text-xs text-gray-500">Hạn mức đến 300 triệu</p>
                      <p className="text-xs text-gray-500">Trả góp đến 48 tháng</p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <p className="font-bold text-sm mb-2">Thẻ THE FIRST</p>
                      <p className="text-xs text-gray-500 mb-2">Rút tiền 100% hạn mức</p>
                      <p className="text-xs text-gray-500">Miễn lãi 45 ngày</p>
                      <p className="text-xs text-gray-500">Tích lũy 0.5% điểm thưởng</p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <p className="font-bold text-sm mb-2">EWA - Rút lương trước</p>
                      <p className="text-xs text-gray-500 mb-2">Rút đến 50% lương đã kiếm</p>
                      <p className="text-xs text-gray-500">Phí chỉ 3%</p>
                      <p className="text-xs text-gray-500">Tự động trừ vào payday</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* EWA Tab */}
            {tab === "ewa" && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-bold text-[#003478] mb-4">💰 Rút lương đã kiếm (EWA)</h3>

                  {ewaBalance && (
                    <div className="bg-green-50 rounded-lg p-4 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Số dư EWA khả dụng</span>
                        <span className="text-2xl font-bold text-green-600">
                          {formatVND(ewaBalance.availableToWithdraw)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Tối đa 50% lương đã kiếm • Phí 3% • Tự động trừ vào payday
                      </p>
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Số tiền muốn rút</label>
                    <input
                      type="text"
                      value={ewaAmount}
                      onChange={(e) => setEwaAmount(e.target.value.replace(/\D/g, ""))}
                      placeholder="Nhập số tiền (VND)"
                      className="w-full border rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-[#003478] focus:border-[#003478]"
                    />
                    <div className="flex gap-2 mt-2">
                      {[1000000, 2000000, 5000000].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => setEwaAmount(String(amt))}
                          className="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200"
                        >
                          {formatVND(amt)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {ewaAmount && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Số tiền rút</span>
                        <span>{formatVND(parseInt(ewaAmount))}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Phí (3%)</span>
                        <span className="text-orange-500">{formatVND(Math.round(parseInt(ewaAmount) * 0.03))}</span>
                      </div>
                      <hr />
                      <div className="flex justify-between font-bold">
                        <span>Thực nhận</span>
                        <span className="text-green-600">
                          {formatVND(parseInt(ewaAmount) - Math.round(parseInt(ewaAmount) * 0.03))}
                        </span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleEWASubmit}
                    disabled={!ewaAmount || ewaLoading}
                    className="w-full bg-[#003478] text-white py-3 rounded-lg font-bold hover:bg-[#002050] disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {ewaLoading ? "Đang xử lý..." : "Xác nhận rút lương"}
                  </button>

                  {ewaResult && (
                    <div className={`mt-4 p-4 rounded-lg ${ewaResult.success ? "bg-green-100" : "bg-red-100"}`}>
                      <p className={`font-medium ${ewaResult.success ? "text-green-700" : "text-red-700"}`}>
                        {ewaResult.message || ewaResult.ewa?.message}
                      </p>
                      {ewaResult.success && ewaResult.ewa && (
                        <div className="mt-2 text-sm text-green-600">
                          <p>Số tiền: {formatVND(ewaResult.ewa.disbursedAmount)}</p>
                          <p>Phí: {formatVND(ewaResult.ewa.fee)}</p>
                          <p>Thực nhận: {formatVND(ewaResult.ewa.netAmount)}</p>
                          <p>Tự động trừ: {ewaResult.ewa.autoDebitDate}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Loan Tab */}
            {tab === "loan" && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-bold text-[#003478] mb-4">🏦 Vay tín chấp liên kết lương</h3>

                  {/* AI Credit Scoring */}
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-[#003478] rounded-lg flex items-center justify-center text-white font-bold">
                        AI
                      </div>
                      <div>
                        <p className="font-bold text-[#003478]">🤖 Qwen AI Credit Scoring</p>
                        <p className="text-sm text-gray-500">Phân tích hồ sơ với Qwen AI</p>
                      </div>
                    </div>

                    <button
                      onClick={handleCreditScoreCheck}
                      disabled={loanLoading}
                      className="w-full bg-[#003478] text-white py-2 rounded-lg font-medium hover:bg-[#002050] disabled:opacity-50"
                    >
                      {loanLoading ? "Đang phân tích..." : "Kiểm tra điểm tín dụng với Qwen AI"}
                    </button>

                    {creditScore && (
                      <div className="bg-white rounded p-4 mt-3">
                        <div className="flex items-center gap-4 mb-3">
                          <span className="text-3xl font-bold text-green-600">{creditScore.score}</span>
                          <span className="text-gray-500">/ 850</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(creditScore.riskLevel)}`}>
                            Rủi ro {getRiskLabel(creditScore.riskLevel)}
                          </span>
                        </div>
                        <div className="text-sm space-y-1">
                          {creditScore.reasons.map((reason, i) => (
                            <p key={i}>✓ {reason}</p>
                          ))}
                        </div>
                        <div className="mt-3 p-3 bg-green-50 rounded text-sm">
                          <p className="text-green-700">
                            <strong>Auto-debit benefit:</strong> Giảm 60% NPL → Đủ điều kiện vay ưu đãi
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Loan Application */}
                  {creditScore && (
                    <div className="border rounded-xl p-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Số tiền muốn vay</label>
                        <input
                          type="text"
                          value={loanAmount}
                          onChange={(e) => setLoanAmount(e.target.value.replace(/\D/g, ""))}
                          className="w-full border rounded-lg px-3 py-2"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Hạn mức tối đa: {formatVND(creditScore.eligibleAmount)}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Thời hạn vay</label>
                        <select
                          value={loanTenor}
                          onChange={(e) => setLoanTenor(parseInt(e.target.value))}
                          className="w-full border rounded-lg px-3 py-2"
                        >
                          <option value={12}>12 tháng</option>
                          <option value={24}>24 tháng</option>
                          <option value={36}>36 tháng</option>
                          <option value={48}>48 tháng</option>
                        </select>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-blue-700">Ước tính trả góp</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {formatVND(calculateEMI(parseInt(loanAmount) || creditScore.eligibleAmount, creditScore.interestRate, loanTenor))}
                        </p>
                        <p className="text-xs text-gray-500">
                          Lãi suất {creditScore.interestRate}%/năm • Tự động trừ từ lương
                        </p>
                      </div>

                      <button
                        onClick={handleLoanSubmit}
                        disabled={loanLoading || !loanAmount}
                        className="w-full bg-[#C8A96E] text-[#003478] py-3 rounded-lg font-bold hover:bg-[#b8964e] disabled:opacity-50"
                      >
                        {loanLoading ? "Đang xử lý..." : "Nộp hồ sơ vay"}
                      </button>

                      {loanResult && (
                        <div className={`p-4 rounded-lg ${loanResult.success ? "bg-green-100" : "bg-red-100"}`}>
                          <p className={`font-medium ${loanResult.success ? "text-green-700" : "text-red-700"}`}>
                            {loanResult.success ? loanResult.application.message : "Đã có lỗi xảy ra"}
                          </p>
                          {loanResult.success && loanResult.application && (
                            <div className="mt-2 text-sm text-green-600">
                              <p>Mã khoản vay: {loanResult.application.id}</p>
                              <p>Số tiền: {formatVND(loanResult.application.amount)}</p>
                              <p>Kỳ hạn: {loanResult.application.tenor} tháng</p>
                              <p>Trả góp: {formatVND(loanResult.application.emi)}/tháng</p>
                              <p>Ngày giải ngân: {loanResult.application.disbursementDate}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* History Tab */}
            {tab === "history" && (
              <div className="bg-white rounded-xl shadow">
                <div className="p-4 border-b">
                  <h3 className="font-bold text-[#003478]">Lịch sử giao dịch</h3>
                </div>
                <div className="p-4 text-center text-gray-500">
                  Chưa có giao dịch nào
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-gray-400 mt-8">
        <p>[SF11] Earned Wage Access & Salary-Linked Lending • Shinhan Finance x Qwen AI</p>
        <p>Powered by Qwen AI + Alibaba Cloud</p>
      </footer>
    </div>
  );
}

// HR Portal Component
function HRPortal() {
  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      <header className="bg-[#003478] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C8A96E] rounded-lg flex items-center justify-center font-bold text-[#003478] text-lg">
              S
            </div>
            <div>
              <h1 className="text-lg font-bold">Shinhan Finance</h1>
              <p className="text-xs text-blue-200">HR Admin Portal</p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 max-w-7xl mx-auto space-y-4">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold text-[#003478] mb-4">HR Admin — Quản lý EWA & Khoản vay</h2>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-[#003478]">5</p>
              <p className="text-xs text-gray-500">Tổng nhân viên</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-green-600">3</p>
              <p className="text-xs text-gray-500">EWA active</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-purple-600">2</p>
              <p className="text-xs text-gray-500">Vay active</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-orange-500">{formatVND(8500000)}</p>
              <p className="text-xs text-gray-500">Tổng EWA tháng</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow">
          <div className="p-4 border-b">
            <h3 className="font-bold text-[#003478]">Danh sách nhân viên</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Mã NV</th>
                <th className="text-left p-3">Họ tên</th>
                <th className="text-right p-3">Lương</th>
                <th className="text-right p-3">EWA đã dùng</th>
                <th className="text-center p-3">Vay</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: "EMP001", name: "Nguyễn Văn Minh", salary: 25000000, ewa: 2000000, loan: true },
                { id: "EMP002", name: "Trần Thị Lan", salary: 18000000, ewa: 0, loan: false },
                { id: "EMP003", name: "Lê Hoàng Nam", salary: 35000000, ewa: 5000000, loan: true },
                { id: "EMP004", name: "Phạm Minh Tú", salary: 22000000, ewa: 1500000, loan: false },
                { id: "EMP005", name: "Võ Thanh Hoa", salary: 28000000, ewa: 3000000, loan: true }
              ].map((e) => (
                <tr key={e.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-mono text-gray-500">{e.id}</td>
                  <td className="p-3 font-medium">{e.name}</td>
                  <td className="p-3 text-right">{formatVND(e.salary)}</td>
                  <td className="p-3 text-right">{e.ewa > 0 ? formatVND(e.ewa) : "—"}</td>
                  <td className="p-3 text-center">
                    {e.loan ? <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">Active</span> : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Admin Portal Component
function AdminPortal() {
  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      <header className="bg-[#003478] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C8A96E] rounded-lg flex items-center justify-center font-bold text-[#003478] text-lg">
              S
            </div>
            <div>
              <h1 className="text-lg font-bold">Shinhan Finance</h1>
              <p className="text-xs text-blue-200">Admin Portfolio Dashboard</p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 max-w-7xl mx-auto space-y-4">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold text-[#003478] mb-4">Portfolio Overview</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-[#003478]">1</p>
              <p className="text-sm text-gray-500">Doanh nghiệp</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-green-600">150M</p>
              <p className="text-sm text-gray-500">Tổng dư nợ</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-red-600">1.4%</p>
              <p className="text-sm text-gray-500">NPL Rate</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-purple-600">5</p>
              <p className="text-sm text-gray-500">Khoản vay active</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-[#003478] mb-4">🤖 Qwen AI Engine Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Salary verifications</span>
                <span className="font-bold">147</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Credit scoring calls</span>
                <span className="font-bold">89</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg processing time</span>
                <span className="font-bold text-green-600">2.8s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">NPL target achieved</span>
                <span className="font-bold text-green-600">1.4% &lt; 2%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-[#003478] mb-4">NPL Tracking</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>EWA Auto-deduct</span>
                  <span className="text-green-600 font-bold">0.8%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 rounded-full h-2" style={{ width: "40%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Salary-Linked Loan</span>
                  <span className="text-green-600 font-bold">1.6%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 rounded-full h-2" style={{ width: "80%" }} />
                </div>
              </div>
              <div className="mt-4 bg-green-50 rounded-lg p-3">
                <p className="text-sm text-green-700">
                  <strong>✓ Mục tiêu NPL &lt;2% đạt được</strong> nhờ auto-debit từ payroll
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-[#003478] mb-4">Giải ngân gần đây</h3>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Mã</th>
                <th className="text-left p-3">Khách hàng</th>
                <th className="text-left p-3">Loại</th>
                <th className="text-right p-3">Số tiền</th>
                <th className="text-center p-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: "LN-001", name: "Nguyễn Văn Minh", type: "Salary Loan", amount: 50000000, status: "Active" },
                { id: "EW-001", name: "Lê Hoàng Nam", type: "EWA", amount: 5000000, status: "Active" },
                { id: "LN-002", name: "Võ Thanh Hoa", type: "Salary Loan", amount: 80000000, status: "Active" }
              ].map((tx) => (
                <tr key={tx.id} className="border-b">
                  <td className="p-3 font-mono text-gray-500">{tx.id}</td>
                  <td className="p-3">{tx.name}</td>
                  <td className="p-3"><span className={`text-xs px-2 py-0.5 rounded-full ${tx.type === "EWA" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}`}>{tx.type}</span></td>
                  <td className="p-3 text-right font-bold">{formatVND(tx.amount)}</td>
                  <td className="p-3 text-center"><span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">{tx.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function calculateEMI(principal: number, annualRate: number, months: number): number {
  const monthlyRate = annualRate / 100 / 12;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  return Math.round(emi);
}
