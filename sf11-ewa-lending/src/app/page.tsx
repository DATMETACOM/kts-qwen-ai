"use client";

import { useState } from "react";

const MOCK_EMPLOYEE = {
  id: "EMP001",
  name: "Nguyễn Văn Minh",
  company: "Công ty TNHH ABC Việt Nam",
  monthlySalary: 25000000,
  earnedToDate: 18750000,
  payPeriodStart: "2026-04-01",
  payPeriodEnd: "2026-04-30",
  currentDay: 22,
  ewaLimit: 9375000,
  ewaUsed: 2000000,
  ewaAvailable: 7375000,
};

const MOCK_LOAN_PRODUCTS = [
  {
    id: "LOAN-001",
    name: "Vay Tín Chấp Cá Nhân",
    maxAmount: 300000000,
    minRate: 18,
    maxTenor: 48,
    description: "Lãi suất thấp từ 18%/năm, hạn mức đến 300 triệu",
  },
];

const MOCK_TRANSACTIONS = [
  { id: 1, type: "EWA", amount: 2000000, date: "2026-04-15", status: "Disbursed", fee: 60000 },
  { id: 2, type: "EWA", amount: 1500000, date: "2026-04-10", status: "Repaid", fee: 45000 },
  { id: 3, type: "Loan", amount: 50000000, date: "2026-03-01", status: "Active", emi: 1750000 },
];

type Tab = "overview" | "ewa" | "loan" | "history";
type Role = "employee" | "hr" | "admin";

function formatVND(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

function ShinhanHeader({ role, setRole }: { role: Role; setRole: (r: Role) => void }) {
  return (
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
          {(["employee", "hr", "admin"] as Role[]).map((r) => (
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
  );
}

function EmployeePortal() {
  const [tab, setTab] = useState<Tab>("overview");
  const [ewaAmount, setEwaAmount] = useState("");
  const [showEwaConfirm, setShowEwaConfirm] = useState(false);
  const [showLoanApply, setShowLoanApply] = useState(false);
  const emp = MOCK_EMPLOYEE;
  const progressPct = Math.round((emp.currentDay / 30) * 100);

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Tổng quan" },
    { key: "ewa", label: "Rút lương trước" },
    { key: "loan", label: "Vay lương" },
    { key: "history", label: "Lịch sử" },
  ];

  return (
    <div>
      <div className="flex gap-1 border-b bg-white px-4 pt-2">
        {tabs.map((t) => (
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

      <div className="p-4 max-w-7xl mx-auto">
        {tab === "overview" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-500 text-sm">Xin chào,</p>
                  <h2 className="text-xl font-bold text-[#003478]">{emp.name}</h2>
                  <p className="text-gray-400 text-sm">{emp.company} • Mã NV: {emp.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-sm">Lương tháng</p>
                  <p className="text-2xl font-bold text-[#003478]">{formatVND(emp.monthlySalary)}</p>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Tiến độ kỳ lương (T4/2026)</span>
                  <span className="font-bold text-[#003478]">{progressPct}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-3">
                  <div className="bg-[#003478] rounded-full h-3 transition-all" style={{ width: `${progressPct}%` }} />
                </div>
                <p className="text-xs text-gray-500 mt-1">Ngày {emp.currentDay}/30 • Đã kiếm {formatVND(emp.earnedToDate)}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow p-4 text-center">
                <p className="text-gray-500 text-sm mb-1">EWA còn lại</p>
                <p className="text-xl font-bold text-green-600">{formatVND(emp.ewaAvailable)}</p>
                <p className="text-xs text-gray-400 mt-1">Giới hạn: {formatVND(emp.ewaLimit)}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-4 text-center">
                <p className="text-gray-500 text-sm mb-1">Đã rút EWA</p>
                <p className="text-xl font-bold text-orange-500">{formatVND(emp.ewaUsed)}</p>
                <p className="text-xs text-gray-400 mt-1">Tháng này</p>
              </div>
              <div className="bg-white rounded-xl shadow p-4 text-center">
                <p className="text-gray-500 text-sm mb-1">Khoản vay</p>
                <p className="text-xl font-bold text-[#003478]">{formatVND(50000000)}</p>
                <p className="text-xs text-gray-400 mt-1">Còn {formatVND(42500000)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setTab("ewa")} className="bg-[#003478] text-white rounded-xl p-4 text-left hover:bg-[#002050] transition">
                <p className="font-bold text-lg">Rút lương trước (EWA)</p>
                <p className="text-blue-200 text-sm mt-1">Tiếp cận lương đã kiếm • Tự động trừ vào payday</p>
              </button>
              <button onClick={() => setTab("loan")} className="bg-[#C8A96E] text-[#003478] rounded-xl p-4 text-left hover:bg-[#b8964e] transition">
                <p className="font-bold text-lg">Vay tín chấp lương</p>
                <p className="text-[#003478]/70 text-sm mt-1">Paperless • AI scoring • Lãi suất từ 18%/năm</p>
              </button>
            </div>
          </div>
        )}

        {tab === "ewa" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-bold text-[#003478] mb-4">Rút lương đã kiếm (EWA)</h3>
              <div className="bg-green-50 rounded-lg p-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Số dư EWA khả dụng</span>
                  <span className="text-2xl font-bold text-green-600">{formatVND(emp.ewaAvailable)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Tối đa 50% lương đã kiếm • Phí 3%/giao dịch</p>
              </div>
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
                    <button key={amt} onClick={() => setEwaAmount(String(amt))} className="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200">
                      {formatVND(amt)}
                    </button>
                  ))}
                </div>
              </div>
              {ewaAmount && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Số tiền rút</span>
                    <span>{formatVND(Number(ewaAmount))}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Phí (3%)</span>
                    <span className="text-orange-500">{formatVND(Math.round(Number(ewaAmount) * 0.03))}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-bold">
                    <span>Thực nhận</span>
                    <span className="text-green-600">{formatVND(Number(ewaAmount) - Math.round(Number(ewaAmount) * 0.03))}</span>
                  </div>
                </div>
              )}
              <button
                onClick={() => setShowEwaConfirm(true)}
                disabled={!ewaAmount || Number(ewaAmount) > emp.ewaAvailable || Number(ewaAmount) <= 0}
                className="w-full bg-[#003478] text-white py-3 rounded-lg font-bold hover:bg-[#002050] disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Xác nhận rút lương
              </button>
            </div>

            {showEwaConfirm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-3xl">✅</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#003478]">Xác nhận rút lương</h3>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between"><span className="text-gray-500">Số tiền:</span><span className="font-bold">{formatVND(Number(ewaAmount))}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Phí:</span><span>{formatVND(Math.round(Number(ewaAmount) * 0.03))}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Thực nhận:</span><span className="font-bold text-green-600">{formatVND(Number(ewaAmount) - Math.round(Number(ewaAmount) * 0.03))}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Tự động trừ:</span><span>Ngày payday 30/04/2026</span></div>
                  </div>
                  <p className="text-xs text-gray-400 mb-4">Số tiền sẽ được giải ngân ngay lập tức và tự động trừ vào kỳ lương tiếp theo.</p>
                  <div className="flex gap-3">
                    <button onClick={() => setShowEwaConfirm(false)} className="flex-1 py-2 border rounded-lg hover:bg-gray-50">Hủy</button>
                    <button onClick={() => { setShowEwaConfirm(false); setEwaAmount(""); }} className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold">Xác nhận</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "loan" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-bold text-[#003478] mb-4">Vay tín chấp liên kết lương</h3>
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[#003478] rounded-lg flex items-center justify-center text-white font-bold">AI</div>
                  <div>
                    <p className="font-bold text-[#003478]">Qwen AI Credit Scoring</p>
                    <p className="text-sm text-gray-500">Xác minh lương real-time • Không cần giấy tờ</p>
                  </div>
                </div>
                <div className="bg-white rounded p-3 mt-2">
                  <p className="text-sm text-gray-500 mb-1">Kết quả AI scoring:</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-green-600">750</span>
                    <span className="text-green-600 font-medium">/ 850</span>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Xếp hạng: Tốt</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 space-y-1">
                    <p>✓ Thu nhập ổn định: {formatVND(emp.monthlySalary)}/tháng</p>
                    <p>✓ Thâm niên công tác: 3 năm 2 tháng</p>
                    <p>✓ Lịch sử EWA tốt: 5/5 giao dịch đúng hạn</p>
                    <p>✓ Auto-debit từ payroll: Đã kích hoạt</p>
                  </div>
                </div>
              </div>

              {MOCK_LOAN_PRODUCTS.map((p) => (
                <div key={p.id} className="border rounded-xl p-4 mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-[#003478]">{p.name}</h4>
                    <span className="bg-[#C8A96E] text-[#003478] text-xs px-2 py-1 rounded-full font-bold">Đề xuất</span>
                  </div>
                  <p className="text-gray-500 text-sm mb-3">{p.description}</p>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-gray-50 rounded p-2">
                      <p className="text-xs text-gray-500">Hạn mức</p>
                      <p className="font-bold text-sm">{formatVND(p.maxAmount)}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <p className="text-xs text-gray-500">Lãi suất</p>
                      <p className="font-bold text-sm">từ {p.minRate}%/năm</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <p className="text-xs text-gray-500">Thời hạn</p>
                      <p className="font-bold text-sm">đến {p.maxTenor} tháng</p>
                    </div>
                  </div>
                </div>
              ))}

              {!showLoanApply ? (
                <button onClick={() => setShowLoanApply(true)} className="w-full bg-[#C8A96E] text-[#003478] py-3 rounded-lg font-bold hover:bg-[#b8964e] transition">
                  Nộp hồ sơ vay (Paperless)
                </button>
              ) : (
                <div className="border rounded-xl p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Số tiền muốn vay</label>
                    <input type="text" defaultValue="50,000,000" className="w-full border rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Thời hạn</label>
                    <select className="w-full border rounded-lg px-3 py-2">
                      <option>12 tháng</option>
                      <option>24 tháng</option>
                      <option selected>36 tháng</option>
                      <option>48 tháng</option>
                    </select>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-green-700 mb-1">Ước tính trả góp hàng tháng</p>
                    <p className="text-2xl font-bold text-green-600">{formatVND(1750000)}</p>
                    <p className="text-xs text-gray-500 mt-1">Tự động trừ từ lương (Auto-debit)</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setShowLoanApply(false)} className="flex-1 py-2 border rounded-lg hover:bg-gray-50">Hủy</button>
                    <button className="flex-1 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700">Gửi hồ sơ</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "history" && (
          <div className="bg-white rounded-xl shadow">
            <div className="p-4 border-b">
              <h3 className="font-bold text-[#003478]">Lịch sử giao dịch</h3>
            </div>
            {MOCK_TRANSACTIONS.map((tx) => (
              <div key={tx.id} className="p-4 border-b last:border-b-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === "EWA" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}`}>
                    {tx.type === "EWA" ? "💰" : "🏦"}
                  </div>
                  <div>
                    <p className="font-medium">{tx.type === "EWA" ? "Rút lương (EWA)" : "Vay tín chấp"}</p>
                    <p className="text-xs text-gray-500">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${tx.type === "EWA" ? "text-orange-500" : "text-[#003478]"}`}>{formatVND(tx.amount)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    tx.status === "Disbursed" ? "bg-blue-100 text-blue-600" :
                    tx.status === "Repaid" ? "bg-green-100 text-green-600" :
                    "bg-orange-100 text-orange-600"
                  }`}>
                    {tx.status === "Disbursed" ? "Đã giải ngân" : tx.status === "Repaid" ? "Đã trả" : "Đang trả"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function HRPortal() {
  const employees = [
    { id: "EMP001", name: "Nguyễn Văn Minh", salary: 25000000, ewaUsed: 2000000, loanActive: true },
    { id: "EMP002", name: "Trần Thị Lan", salary: 18000000, ewaUsed: 0, loanActive: false },
    { id: "EMP003", name: "Lê Hoàng Nam", salary: 35000000, ewaUsed: 5000000, loanActive: true },
    { id: "EMP004", name: "Phạm Minh Tú", salary: 22000000, ewaUsed: 1500000, loanActive: false },
    { id: "EMP005", name: "Võ Thanh Hoa", salary: 28000000, ewaUsed: 3000000, loanActive: true },
  ];

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-4">
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-bold text-[#003478] mb-4">HR Admin — Công ty TNHH ABC Việt Nam</h2>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-[#003478]">48</p>
            <p className="text-xs text-gray-500">Tổng nhân viên</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-green-600">12</p>
            <p className="text-xs text-gray-500">EWA active</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-purple-600">8</p>
            <p className="text-xs text-gray-500">Vay active</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-orange-500">{formatVND(11500000)}</p>
            <p className="text-xs text-gray-500">Tổng EWA tháng</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-bold text-[#003478]">Danh sách nhân viên</h3>
          <input placeholder="Tìm kiếm..." className="border rounded-lg px-3 py-1.5 text-sm" />
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
            {employees.map((e) => (
              <tr key={e.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-mono text-gray-500">{e.id}</td>
                <td className="p-3 font-medium">{e.name}</td>
                <td className="p-3 text-right">{formatVND(e.salary)}</td>
                <td className="p-3 text-right">{e.ewaUsed > 0 ? formatVND(e.ewaUsed) : "—"}</td>
                <td className="p-3 text-center">{e.loanActive ? <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">Active</span> : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminPortal() {
  return (
    <div className="p-4 max-w-7xl mx-auto space-y-4">
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-bold text-[#003478] mb-4">Shinhan Finance — Portfolio Dashboard</h2>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-[#003478]">15</p>
            <p className="text-sm text-gray-500">Doanh nghiệp đối tác</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-green-600">1.2B</p>
            <p className="text-sm text-gray-500">Tổng dư nợ (VND)</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-red-600">1.4%</p>
            <p className="text-sm text-gray-500">NPL Rate</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-purple-600">847</p>
            <p className="text-sm text-gray-500">Khoản vay active</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-[#003478] mb-4">NPL Tracking (Mục tiêu &lt;2%)</h3>
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
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Vay tín chấp truyền thống</span>
                <span className="text-red-500 font-bold">5.2%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-400 rounded-full h-2" style={{ width: "100%" }} />
              </div>
            </div>
          </div>
          <div className="mt-4 bg-green-50 rounded-lg p-3">
            <p className="text-sm text-green-700"><strong>1.4% NPL</strong> — Đạt mục tiêu &lt;2% nhờ auto-debit từ payroll</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-[#003478] mb-4">Qwen AI Engine Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Payslips processed</span>
              <span className="font-bold">2,847</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avg extraction accuracy</span>
              <span className="font-bold text-green-600">98.2%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Credit decisions (AI)</span>
              <span className="font-bold">1,423</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avg processing time</span>
              <span className="font-bold">3.2s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Vietnamese OCR accuracy</span>
              <span className="font-bold text-green-600">96.7%</span>
            </div>
          </div>
          <div className="mt-4 bg-blue-50 rounded-lg p-3">
            <p className="text-sm text-blue-700">Qwen AI loại bỏ <strong>100%</strong> giấy tờ chứng minh thu nhập thủ công</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="font-bold text-[#003478] mb-4">Giải ngân gần đây</h3>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Mã khoản</th>
              <th className="text-left p-3">Khách hàng</th>
              <th className="text-left p-3">Loại</th>
              <th className="text-right p-3">Số tiền</th>
              <th className="text-center p-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: "LN-2026-001", name: "Nguyễn V. Minh", type: "Salary Loan", amount: 50000000, status: "Active" },
              { id: "LN-2026-002", name: "Lê H. Nam", type: "Salary Loan", amount: 120000000, status: "Active" },
              { id: "EW-2026-015", name: "Phạm M. Tú", type: "EWA", amount: 1500000, status: "Repaid" },
              { id: "LN-2026-003", name: "Võ T. Hoa", type: "Salary Loan", amount: 80000000, status: "Active" },
              { id: "EW-2026-016", name: "Trần T. Lan", type: "EWA", amount: 3000000, status: "Disbursed" },
            ].map((tx) => (
              <tr key={tx.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-mono text-gray-500">{tx.id}</td>
                <td className="p-3 font-medium">{tx.name}</td>
                <td className="p-3"><span className={`text-xs px-2 py-0.5 rounded-full ${tx.type === "EWA" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}`}>{tx.type}</span></td>
                <td className="p-3 text-right font-bold">{formatVND(tx.amount)}</td>
                <td className="p-3 text-center"><span className={`text-xs px-2 py-0.5 rounded-full ${
                  tx.status === "Active" ? "bg-green-100 text-green-600" :
                  tx.status === "Repaid" ? "bg-gray-100 text-gray-600" :
                  "bg-blue-100 text-blue-600"
                }`}>{tx.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Home() {
  const [role, setRole] = useState<Role>("employee");

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      <ShinhanHeader role={role} setRole={setRole} />
      {role === "employee" && <EmployeePortal />}
      {role === "hr" && <HRPortal />}
      {role === "admin" && <AdminPortal />}

      <footer className="text-center py-4 text-xs text-gray-400">
        <p>[SF11] Earned Wage Access & Salary-Linked Lending • Shinhan Finance x Qwen AI</p>
        <p>Built for Qwen AI Build Day 2026 • Powered by Qwen AI + Alibaba Cloud</p>
      </footer>
    </div>
  );
}
