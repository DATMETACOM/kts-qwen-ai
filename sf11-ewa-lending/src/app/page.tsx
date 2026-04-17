"use client";

import { useState, useEffect, useRef } from "react";
import { MOCK_COMPANIES, MOCK_HRM_EMPLOYEES } from "@/types";

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

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
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

// Sample Q&A for Copilot
const SAMPLE_QAS = [
  {
    q: "Kiểm tra nhân viên EMP001 có được vay không?",
    a: "✅ **NGUYỄN VĂN MINH** — Đủ điều kiện vay tín chấp\n\n**Thông tin:**\n- Lương: 25M/tháng\n- Thâm niên: 3 năm 2 tháng\n- Điểm credit: 750/850 (LOW RISK)\n- Đề xuất: Vay được đến **150M VNĐ**\n- Lãi suất: 18%/năm\n\n**Kết luận:** Đủ điều kiện vay. Đề xuất sản phẩm *Vay tín chấp cá nhân*."
  },
  {
    q: "Công ty ABC có đang bị cảnh báo rủi ro gì không?",
    a: "⚠️ **CẢNH BÁO DOANH NGHIỆP**\n\n**Trạng thái:** 🟢 XANH — Điểm sức khỏe: 78/100\n\n**5 yếu tố đánh giá:**\n1. Sức khỏe tài chính: 78/100 ✅\n2. Lịch sử thanh toán: 98/100 ✅\n3. Ổn định nhân sự: 82/100 ✅\n4. Tuân thủ thuế/BHXH: 95/100 ✅\n5. Rủi ro ngành: 75/100 ✅\n\n**Khuyến nghị:** Không có cảnh báo. Công ty ABC đang hoạt động ổn định."
  },
  {
    q: "Dự báo dòng tiền tháng 4/2026?",
    a: "💰 **CASHFLOW FORECAST — Tháng 4/2026**\n\n**Nhu cầu EWA:** 21M VNĐ\n**Giải ngân vay:** 70M VNĐ\n**Tổng thanh khoản cần:** 91M VNĐ\n\n📅 **Ngày cao điểm:**\n- 05/04: 5.25M (đầu tháng)\n- 15/04: 3.15M (giữa tháng)\n\n⚠️ **Cảnh báo mùa vụ:**\n- Tháng 4 có Tết **30/4** → Buffer tăng 20%\n- Khuyến nghị: Giữ **109M VNĐ** trong quỹ dự phòng"
  },
  {
    q: "EMP003 Lê Hoàng Nam có rủi ro nghỉ việc không?",
    a: "👤 **CHURN PREDICTION — LÊ HOÀNG NAM**\n\n**Xác suất nghỉ việc:** 12% (ỔN ĐỊNH)\n\n**Điểm tính toán:**\n- Thâm niên: 3 năm → ✅ Ổn định\n- Tăng lương: 8%/năm → ✅ Tốt\n- Ngày nghỉ QTR: 1 ngày → ✅ Bình thường\n- Peer churn: 12% → ⚠️ Cần theo dõi\n\n**Hạn mức EWA động:** 70% (cho phép rút nhiều)\n\n**Kết luận:** Nhân viên ổn định, tiếp tục cấp EWA cao."
  }
];

// Shared Header Component
function Header({ role, setRole }: { role: string; setRole: (r: string) => void }) {
  return (
    <header className="bg-[#003478] text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#C8A96E] rounded-lg flex items-center justify-center font-bold text-[#003478] text-lg">
            S
          </div>
          <div>
            <h1 className="text-lg font-bold">Shinhan Finance</h1>
            <p className="text-xs text-blue-200">EWA & Salary-Linked Lending</p>
          </div>
        </div>
        <div className="flex gap-2">
          {([
            { key: "employee", label: "Nhân viên" },
            { key: "hr", label: "HR Admin" },
            { key: "admin", label: "Shinhan Admin" }
          ] as const).map((r) => (
            <button
              key={r.key}
              onClick={() => setRole(r.key)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                role === r.key ? "bg-[#C8A96E] text-[#003478]" : "bg-blue-900 text-blue-200 hover:bg-blue-800"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

// Copilot Sidebar Component
function CopilotSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleQuickAsk(qa: { q: string; a: string }) {
    setMessages(prev => [...prev, { role: "user", content: qa.q, timestamp: new Date() }]);
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "assistant", content: qa.a, timestamp: new Date() }]);
      setIsTyping(false);
    }, 1000);
  }

  function handleSend() {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: "user", content: userMsg, timestamp: new Date() }]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = `🤖 **Qwen AI Copilot**

Tôi đã nhận câu hỏi của bạn về: "${userMsg}"

Để kiểm tra chi tiết, vui lòng:
1. Chọn câu hỏi mẫu bên dưới, hoặc
2. Liên hệ team Risk Management để được hỗ trợ thêm.

**Hotline:** 1900-XXXX`;
      setMessages(prev => [...prev, { role: "assistant", content: response, timestamp: new Date() }]);
      setIsTyping(false);
    }, 1500);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col border-l">
      <div className="bg-[#003478] text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#C8A96E] rounded-lg flex items-center justify-center text-[#003478] font-bold">AI</div>
          <div>
            <h3 className="font-bold">🤖 Qwen AI Copilot</h3>
            <p className="text-xs text-blue-200">Risk & Lending Assistant</p>
          </div>
        </div>
        <button onClick={onClose} className="text-white hover:text-gray-200 text-xl">×</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm mb-4">Chào bạn! Tôi là Qwen AI Copilot. Hỏi tôi về:</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] p-3 rounded-lg ${
              msg.role === "user" ? "bg-[#003478] text-white" : "bg-gray-100 text-gray-800"
            }`}>
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              <p className={`text-xs mt-1 ${msg.role === "user" ? "text-blue-200" : "text-gray-400"}`}>
                {msg.timestamp.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-gray-500 text-sm">🤖 Đang xử lý...</p>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {messages.length === 0 && (
        <div className="p-4 border-t">
          <p className="text-xs text-gray-500 mb-2">Câu hỏi mẫu:</p>
          <div className="space-y-2">
            {SAMPLE_QAS.map((qa, i) => (
              <button
                key={i}
                onClick={() => handleQuickAsk(qa)}
                className="w-full text-left text-sm p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
              >
                <span className="text-[#003478]">Q{i + 1}:</span> {qa.q}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Hỏi Qwen AI Copilot..."
            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#003478]"
          />
          <button onClick={handleSend} className="bg-[#003478] text-white px-4 py-2 rounded-lg hover:bg-[#002050]">
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [role, setRole] = useState<string>("employee");
  const [copilotOpen, setCopilotOpen] = useState(false);
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
      <Header role={role} setRole={setRole} />

      <CopilotSidebar isOpen={copilotOpen} onClose={() => setCopilotOpen(false)} />

      <button
        onClick={() => setCopilotOpen(true)}
        className="fixed bottom-6 right-6 bg-[#003478] text-white w-14 h-14 rounded-full shadow-2xl hover:bg-[#002050] transition z-30 flex items-center justify-center text-2xl"
        title="Open Qwen AI Copilot"
      >
        🤖
      </button>

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
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-[#003478]">5</p>
              <p className="text-xs text-gray-500">Công ty</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-[#003478]">170</p>
              <p className="text-xs text-gray-500">Tổng nhân viên</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-green-600">127</p>
              <p className="text-xs text-gray-500">EWA active</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-purple-600">45</p>
              <p className="text-xs text-gray-500">Vay active</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-orange-500">{formatVND(5700000000)}</p>
              <p className="text-xs text-gray-500">Tổng EWA tháng</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow">
          <div className="p-4 border-b">
            <h3 className="font-bold text-[#003478]">📋 Danh sách công ty ({MOCK_COMPANIES.length} công ty)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {MOCK_COMPANIES.map((company) => {
              const employeeCount = MOCK_HRM_EMPLOYEES.filter(e => e.company === company.id).length;
              const totalSalary = MOCK_HRM_EMPLOYEES.filter(e => e.company === company.id).reduce((sum, e) => sum + e.monthlySalary, 0);
              return (
                <div key={company.id} className="border rounded-xl p-4 hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        company.type === "TNHH" ? "bg-blue-100 text-blue-700" :
                        company.type === "TNHH MTV" ? "bg-indigo-100 text-indigo-700" :
                        "bg-purple-100 text-purple-700"
                      }`}>{company.type}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      company.healthScore >= 80 ? "bg-green-100 text-green-700" :
                      company.healthScore >= 60 ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>Health: {company.healthScore}/100</span>
                  </div>
                  <h4 className="font-bold text-[#003478] mb-1">{company.name}</h4>
                  <p className="text-xs text-gray-500 mb-3">{company.city} • {company.industry}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Nhân viên</p>
                      <p className="font-semibold">{employeeCount}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Lương TB</p>
                      <p className="font-semibold">{formatVND(Math.round(totalSalary / employeeCount))}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">EWA Volume</p>
                      <p className="font-semibold text-green-600">{formatVND(company.ewaVolume)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">NPL Rate</p>
                      <p className={`font-semibold ${company.nplRate > 1.5 ? "text-red-600" : "text-green-600"}`}>{company.nplRate}%</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${company.ewaEnabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>EWA</span>
                    <span className={`text-xs px-2 py-1 rounded ${company.loanEnabled ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-500"}`}>Loan</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow">
          <div className="p-4 border-b">
            <h3 className="font-bold text-[#003478]">👥 Danh sách nhân viên (tất cả công ty)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3">Mã NV</th>
                  <th className="text-left p-3">Họ tên</th>
                  <th className="text-left p-3">Công ty</th>
                  <th className="text-left p-3">Phòng ban</th>
                  <th className="text-right p-3">Lương</th>
                  <th className="text-center p-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_HRM_EMPLOYEES.slice(0, 30).map((e) => {
                  const company = MOCK_COMPANIES.find(c => c.id === e.company);
                  return (
                    <tr key={e.employeeId} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-mono text-gray-500">{e.employeeId}</td>
                      <td className="p-3 font-medium">{e.name}</td>
                      <td className="p-3 text-sm">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          company?.type === "TNHH" ? "bg-blue-100 text-blue-700" :
                          company?.type === "TNHH MTV" ? "bg-indigo-100 text-indigo-700" :
                          "bg-purple-100 text-purple-700"
                        }`}>{company?.type}</span>
                      </td>
                      <td className="p-3 text-gray-600">{e.department}</td>
                      <td className="p-3 text-right font-medium">{formatVND(e.monthlySalary)}</td>
                      <td className="p-3 text-center">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          e.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                        }`}>{e.status === "active" ? "Active" : "Inactive"}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="p-3 text-sm text-gray-500">Hiển thị 30/170 nhân viên...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Admin Portal Component
function AdminPortal() {
  const [riskTab, setRiskTab] = useState<"overview" | "corporate" | "churn" | "cashflow" | "compliance">("overview");
  const [selectedCompany, setSelectedCompany] = useState<string>("C001");
  const [corpData, setCorpData] = useState<any>(null);
  const [churnData, setChurnData] = useState<any>(null);
  const [cashflowData, setCashflowData] = useState<any>(null);
  const [complianceData, setComplianceData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function fetchCorporate() {
    setLoading(true);
    try {
      const res = await fetch("/api/risk/corporate?companyId=CMP001");
      const data = await res.json();
      setCorpData(data.corporateRisk);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function fetchChurn() {
    setLoading(true);
    try {
      const res = await fetch("/api/risk/ewa-dynamic-limit?employeeId=EMP001");
      const data = await res.json();
      setChurnData(data.churnPrediction);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function fetchCashflow() {
    setLoading(true);
    try {
      const res = await fetch("/api/risk/cashflow?baseMonthlyEwa=15000000&baseMonthlyLoan=50000000");
      const data = await res.json();
      setCashflowData(data.forecast);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function fetchCompliance() {
    setLoading(true);
    try {
      const res = await fetch("/api/risk/compliance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: "EMP001", employeeName: "Nguyễn Văn Minh", monthlySalary: 25000000,
          requestedEwaAmount: 5000000, requestedLoanAmount: 50000000,
          interestRate: 18, emi: 1750000, bankAccountName: "Nguyen Van Minh"
        })
      });
      const data = await res.json();
      setComplianceData(data.compliance);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      <header className="bg-[#003478] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C8A96E] rounded-lg flex items-center justify-center font-bold text-[#003478] text-lg">S</div>
            <div>
              <h1 className="text-lg font-bold">Shinhan Finance</h1>
              <p className="text-xs text-blue-200">Admin Dashboard — Risk Center</p>
            </div>
          </div>
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="bg-blue-900 text-white px-3 py-1.5 rounded text-sm"
          >
            {MOCK_COMPANIES.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </header>

      <div className="flex gap-1 border-b bg-white px-4 pt-2">
        {[
          { key: "overview" as const, label: "📊 Tổng quan" },
          { key: "corporate" as const, label: "🏢 Corporate Risk" },
          { key: "churn" as const, label: "👤 Churn Prediction" },
          { key: "cashflow" as const, label: "💰 Cashflow AI" },
          { key: "compliance" as const, label: "⚖️ Compliance" }
        ].map((t) => (
          <button key={t.key} onClick={() => setRiskTab(t.key)}
            className={`px-4 py-2 text-sm font-medium rounded-t transition ${riskTab === t.key ? "bg-[#F5F6FA] text-[#003478] border-b-2 border-[#003478]" : "text-gray-500 hover:text-gray-700"}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-4 max-w-7xl mx-auto space-y-4">
        {loading && (
          <div className="flex justify-center py-4"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#003478]" /></div>
        )}

        {riskTab === "overview" && (
          <>
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-bold text-[#003478] mb-4">📊 Portfolio Overview — {MOCK_COMPANIES.length} Doanh nghiệp</h2>
              <div className="grid grid-cols-5 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-[#003478]">5</p>
                  <p className="text-sm text-gray-500">Doanh nghiệp</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-[#003478]">170</p>
                  <p className="text-sm text-gray-500">Nhân viên</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-green-600">{formatVND(10450000000)}</p>
                  <p className="text-sm text-gray-500">Tổng EWA Volume</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-red-600">1.06%</p>
                  <p className="text-sm text-gray-500">NPL Rate (avg)</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-purple-600">127</p>
                  <p className="text-sm text-gray-500">EWA Active</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-bold text-[#003478] mb-4">🏢 Corporate Risk Overview — All Companies</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {MOCK_COMPANIES.map((company) => (
                  <div key={company.id} className={`border-2 rounded-xl p-4 ${company.healthScore >= 80 ? "border-green-200 bg-green-50" : company.healthScore >= 60 ? "border-yellow-200 bg-yellow-50" : "border-red-200 bg-red-50"}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        company.type === "TNHH" ? "bg-blue-100 text-blue-700" :
                        company.type === "TNHH MTV" ? "bg-indigo-100 text-indigo-700" :
                        "bg-purple-100 text-purple-700"
                      }`}>{company.type}</span>
                      <span className={`text-lg font-bold ${company.healthScore >= 80 ? "text-green-600" : company.healthScore >= 60 ? "text-yellow-600" : "text-red-600"}`}>
                        {company.healthScore}
                      </span>
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{company.name.split(" ").slice(0, 4).join(" ")}</h4>
                    <p className="text-xs text-gray-500 mb-3">{company.city}</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Nhân viên:</span>
                        <span className="font-semibold">{company.employeeCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>EWA Volume:</span>
                        <span className="font-semibold text-green-600">{formatVND(company.ewaVolume)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>NPL Rate:</span>
                        <span className={`font-semibold ${company.nplRate > 1.5 ? "text-red-600" : "text-green-600"}`}>{company.nplRate}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="font-bold text-[#003478] mb-4">🤖 Qwen AI + Risk Engine Stats (5 Companies)</h3>
                <div className="space-y-3">
                  <div className="flex justify-between"><span className="text-gray-600">Salary verifications</span><span className="font-bold">170</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Credit scoring calls</span><span className="font-bold">127</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Corporate risk checks</span><span className="font-bold">5</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Churn predictions</span><span className="font-bold">170</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Avg processing time</span><span className="font-bold text-green-600">2.1s</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">NPL target achieved</span><span className="font-bold text-green-600">1.06% &lt; 2%</span></div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="font-bold text-[#003478] mb-4">🛡️ Risk Mitigation Coverage</h3>
                <div className="space-y-2">
                  {[
                    { name: "Corporate Scoring + EWS", status: "active", desc: "5 factors tracked" },
                    { name: "Churn Prediction (ML)", status: "active", desc: "Dynamic EWA cap" },
                    { name: "Cashflow Forecasting", status: "active", desc: "Seasonal alerts" },
                    { name: "Compliance Engine", status: "active", desc: "6 hard rules" },
                    { name: "Circuit Breaker", status: "active", desc: "Auto-fallback" },
                    { name: "Biometric Auth", status: "planned", desc: "Phase 2" }
                  ].map((r) => (
                    <div key={r.name} className="flex justify-between items-center py-1">
                      <div>
                        <p className="text-sm font-medium">{r.name}</p>
                        <p className="text-xs text-gray-400">{r.desc}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${r.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {r.status === "active" ? "✓ Active" : "Phase 2"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-bold text-[#003478] mb-4">💰 Giải ngân gần đây (5 công ty)</h3>
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3">Mã</th>
                    <th className="text-left p-3">Khách hàng</th>
                    <th className="text-left p-3">Công ty</th>
                    <th className="text-left p-3">Loại</th>
                    <th className="text-right p-3">Số tiền</th>
                    <th className="text-center p-3">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: "LN-001", name: "Nguyễn Văn Minh", company: "C001", type: "Vay", amount: 50000000, status: "Active" },
                    { id: "EW-001", name: "Lê Hoàng Nam", company: "C001", type: "EWA", amount: 5000000, status: "Active" },
                    { id: "LN-002", name: "Nguyễn Đình Bảo", company: "C002", type: "Vay", amount: 120000000, status: "Active" },
                    { id: "EW-002", name: "Trần Thu Hà", company: "C002", type: "EWA", amount: 8000000, status: "Active" },
                    { id: "LN-003", name: "Nguyễn Trọng Nghĩa", company: "C003", type: "Vay", amount: 200000000, status: "Active" },
                    { id: "EW-003", name: "Phạm Văn Minh", company: "C003", type: "EWA", amount: 12000000, status: "Active" },
                    { id: "LN-004", name: "Trần Đình Minh", company: "C004", type: "Vay", amount: 300000000, status: "Active" },
                    { id: "EW-004", name: "Hoàng Minh Tuấn", company: "C004", type: "EWA", amount: 20000000, status: "Active" },
                    { id: "LN-005", name: "Nguyễn Trọng Đức", company: "C005", type: "Vay", amount: 250000000, status: "Active" },
                    { id: "EW-005", name: "Trần Hữu Minh", company: "C005", type: "EWA", amount: 15000000, status: "Active" }
                  ].map((tx) => {
                    const company = MOCK_COMPANIES.find(c => c.id === tx.company);
                    return (
                      <tr key={tx.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-mono text-gray-500">{tx.id}</td>
                        <td className="p-3 font-medium">{tx.name}</td>
                        <td className="p-3">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            company?.type === "TNHH" ? "bg-blue-100 text-blue-700" :
                            company?.type === "TNHH MTV" ? "bg-indigo-100 text-indigo-700" :
                            "bg-purple-100 text-purple-700"
                          }`}>{company?.type}</span>
                        </td>
                        <td className="p-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${tx.type === "EWA" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}`}>{tx.type}</span>
                        </td>
                        <td className="p-3 text-right font-bold">{formatVND(tx.amount)}</td>
                        <td className="p-3 text-center">
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">{tx.status}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {riskTab === "corporate" && (
          <div className="space-y-4">
            <button onClick={fetchCorporate} disabled={loading}
              className="bg-[#003478] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#002050] disabled:opacity-50">
              {corpData ? "Refresh Corporate Score" : "Chạy Corporate Scoring"}
            </button>

            {corpData && (
              <>
                <div className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#003478]">{corpData.companyName}</h3>
                      <p className="text-sm text-gray-500">Corporate Risk Assessment</p>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-lg font-bold ${
                      corpData.riskLevel === "green" ? "bg-green-100 text-green-700" :
                      corpData.riskLevel === "yellow" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {corpData.overallScore}/100 — {corpData.riskLevel === "green" ? "AN TOÀN" : corpData.riskLevel === "yellow" ? "CẢNH BÁO" : "NGUY HIỂM"}
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-3">
                    {Object.entries(corpData.factors).map(([key, val]) => (
                      <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">{key === "financialHealth" ? "Sức khỏe TC" : key === "paymentHistory" ? "Thanh toán" : key === "employeeStability" ? "Ổn định NV" : key === "taxCompliance" ? "Thuế/BHXH" : "Ngành"}</p>
                        <p className={`text-xl font-bold ${(val as number) >= 70 ? "text-green-600" : (val as number) >= 50 ? "text-yellow-600" : "text-red-600"}`}>{val as number}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {corpData.ewaFrozen && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="font-bold text-red-700">🚨 EWA FROZEN — Doanh nghiệp bị đóng băng hạn mức</p>
                    <p className="text-sm text-red-600 mt-1">Toàn bộ EWA requests bị chặn do điểm sức khỏe quá thấp.</p>
                  </div>
                )}

                {corpData.alerts && corpData.alerts.length > 0 && (
                  <div className="bg-white rounded-xl shadow p-6">
                    <h4 className="font-bold text-[#003478] mb-3">⚠️ Early Warning Alerts</h4>
                    {corpData.alerts.map((a: any, i: number) => (
                      <div key={i} className={`p-3 rounded-lg mb-2 ${a.type === "critical" ? "bg-red-50 border-l-4 border-red-500" : a.type === "warning" ? "bg-yellow-50 border-l-4 border-yellow-500" : "bg-blue-50 border-l-4 border-blue-500"}`}>
                        <p className="font-medium text-sm">{a.message}</p>
                        <p className="text-xs text-gray-500 mt-1">Action: {a.action} • {a.code}</p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {riskTab === "churn" && (
          <div className="space-y-4">
            <button onClick={fetchChurn} disabled={loading}
              className="bg-[#003478] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#002050] disabled:opacity-50">
              {churnData ? "Refresh Churn Score" : "Chạy Churn Prediction"}
            </button>

            {churnData && (
              <>
                <div className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-[#003478]">Churn Prediction — {churnData.employeeId}</h3>
                    <div className={`px-4 py-2 rounded-full font-bold ${
                      churnData.riskBand === "stable" ? "bg-green-100 text-green-700" :
                      churnData.riskBand === "moderate" ? "bg-yellow-100 text-yellow-700" :
                      churnData.riskBand === "high" ? "bg-orange-100 text-orange-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {Math.round(churnData.churnProbability * 100)}% churn — {churnData.riskBand.toUpperCase()}
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <p className="text-sm font-medium text-blue-700">Dynamic EWA Limit (AI-adjusted)</p>
                    <p className="text-3xl font-bold text-blue-600">{Math.round(churnData.dynamicEwaCap * 100)}%</p>
                    <p className="text-xs text-gray-500 mt-1">{churnData.recommendation}</p>
                  </div>

                  <h4 className="font-medium text-gray-700 mb-2">Feature Importance (XGBoost Simulation)</h4>
                  <div className="space-y-2">
                    {Object.entries(churnData.factors).map(([key, f]: [string, any]) => (
                      <div key={key} className="flex items-center gap-3">
                        <span className="text-sm w-32 text-gray-600">{key === "tenure" ? "Thâm niên" : key === "salaryGrowth" ? "Tăng lương" : key === "leavePattern" ? "Nghỉ phép" : key === "peerChurn" ? "Peer churn" : "Hiệu suất"}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div className="bg-[#003478] rounded-full h-3" style={{ width: `${f.weight * 100}%` }} />
                        </div>
                        <span className="text-xs w-24 text-right">{f.signal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {riskTab === "cashflow" && (
          <div className="space-y-4">
            <button onClick={fetchCashflow} disabled={loading}
              className="bg-[#003478] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#002050] disabled:opacity-50">
              {cashflowData ? "Refresh Forecast" : "Chạy Cashflow Forecast"}
            </button>

            {cashflowData && (
              <>
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-bold text-[#003478] mb-4">AI Cashflow Forecast (30 ngày)</h3>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500">EWA Demand</p>
                      <p className="text-xl font-bold text-blue-600">{formatVND(cashflowData.next30Days.totalEwaDemand)}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500">Loan Disbursement</p>
                      <p className="text-xl font-bold text-purple-600">{formatVND(cashflowData.next30Days.totalLoanDisbursement)}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500">Required Liquidity</p>
                      <p className="text-xl font-bold text-green-600">{formatVND(cashflowData.next30Days.requiredLiquidity)}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-600">Confidence Interval: <strong>{formatVND(cashflowData.next30Days.confidenceLow)}</strong> — <strong>{formatVND(cashflowData.next30Days.confidenceHigh)}</strong></p>
                    <p className="text-xs text-gray-400 mt-1">Algorithm: {cashflowData.modelMetrics.algorithm} • MAPE: {cashflowData.modelMetrics.mape}%</p>
                  </div>

                  <h4 className="font-medium text-gray-700 mb-2">Peak Demand Days</h4>
                  {cashflowData.next30Days.peakDays.map((d: any, i: number) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b last:border-0">
                      <span className="text-sm text-gray-600">{d.date}</span>
                      <span className="text-sm font-medium">{formatVND(d.demand)}</span>
                      <span className="text-xs text-gray-400">{d.reason}</span>
                    </div>
                  ))}
                </div>

                {cashflowData.seasonalAlerts && cashflowData.seasonalAlerts.length > 0 && (
                  <div className="bg-white rounded-xl shadow p-6">
                    <h4 className="font-bold text-[#003478] mb-3">📅 Seasonal Alerts (3 tháng tới)</h4>
                    {cashflowData.seasonalAlerts.map((s: any, i: number) => (
                      <div key={i} className="bg-orange-50 border-l-4 border-orange-400 p-3 rounded-r mb-2">
                        <p className="font-medium text-sm">{s.period} — {s.reason}</p>
                        <p className="text-xs text-gray-500">Demand x{s.expectedDemandMultiplier} • {s.action}</p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {riskTab === "compliance" && (
          <div className="space-y-4">
            <button onClick={fetchCompliance} disabled={loading}
              className="bg-[#003478] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#002050] disabled:opacity-50">
              {complianceData ? "Refresh Compliance" : "Chạy Compliance Check"}
            </button>

            {complianceData && (
              <>
                <div className={`rounded-xl p-4 ${complianceData.allPassed ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                  <p className={`text-lg font-bold ${complianceData.allPassed ? "text-green-700" : "text-red-700"}`}>
                    {complianceData.allPassed ? "✅ TẤT CẢ CHECKS PASSED" : "❌ COMPLIANCE ISSUES DETECTED"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Employee: {complianceData.employeeId}</p>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                  <h4 className="font-bold text-[#003478] mb-4">Compliance Checks</h4>
                  <div className="space-y-3">
                    {Object.entries(complianceData.checks).map(([key, c]: [string, any]) => (
                      <div key={key} className={`p-3 rounded-lg ${c.pass ? "bg-green-50" : "bg-red-50"}`}>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">{key === "ewaCapCompliance" ? "EWA Cap (Luật Lao động)" : key === "emiAffordability" ? "EMI Affordability (NHNN)" : key === "interestRateCap" ? "Lãi suất (SBV)" : key === "bankAccountMatch" ? "Bank Account e-KYC" : key === "biometricVerified" ? "Biometric Auth" : "Digital Consent (NĐ13)"}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${c.pass ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
                            {c.pass ? "PASS ✓" : "FAIL ✗"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{c.rule}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                  <h4 className="font-bold text-[#003478] mb-3">📋 Audit Trail (Digital Consent Logging)</h4>
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-2">Action</th>
                        <th className="text-left p-2">Actor</th>
                        <th className="text-left p-2">Timestamp</th>
                        <th className="text-left p-2">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {complianceData.auditTrail.map((a: any, i: number) => (
                        <tr key={i} className="border-b">
                          <td className="p-2 font-mono text-xs">{a.action}</td>
                          <td className="p-2">{a.actor}</td>
                          <td className="p-2 text-xs text-gray-500">{a.timestamp}</td>
                          <td className="p-2 text-xs">{a.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function calculateEMI(principal: number, annualRate: number, months: number): number {
  const monthlyRate = annualRate / 100 / 12;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  return Math.round(emi);
}
