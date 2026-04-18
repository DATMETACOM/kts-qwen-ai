"use client";

import { useState, useEffect } from "react";
import { MOCK_CUSTOMERS, calculatePortfolioMetrics } from "@/lib/data";
import { creditScoring } from "@/lib/qwen";
import type { MicroBizCustomer, PortfolioMetrics } from "@/types";
import { DollarSign, TrendingUp, Users, AlertTriangle, CheckCircle, Clock, Wallet, BarChart3 } from "lucide-react";

function calculateCreditScore(monthlyRevenue: number, monthsActive: number, cashflowScore: number): number {
  const baseScore = cashflowScore * 8.5;
  const revenueWeight = Math.min(100, monthlyRevenue / 500000);
  const tenureBonus = Math.min(50, monthsActive * 5);
  return Math.min(850, Math.round(baseScore + revenueWeight + tenureBonus));
}

function getRiskLevel(score: number): "low" | "medium" | "high" {
  if (score >= 650) return "low";
  if (score >= 450) return "medium";
  return "high";
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"seller" | "platform" | "admin">("seller");
  const [customers, setCustomers] = useState<MicroBizCustomer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<MicroBizCustomer | null>(null);
  const [creditResult, setCreditResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [portfolio, setPortfolio] = useState<PortfolioMetrics | null>(null);

  useEffect(() => {
    setCustomers(MOCK_CUSTOMERS);
    setPortfolio(calculatePortfolioMetrics());
  }, []);

  const handleAnalyze = async (customer: MicroBizCustomer) => {
    setLoading(true);
    setSelectedCustomer(customer);

    try {
      const result = await creditScoring(customer);
      setCreditResult(result);
    } catch (error) {
      console.error("Credit scoring error:", error);
      const score = calculateCreditScore(customer.monthlyRevenue, customer.monthsActive, customer.cashflowScore);
      setCreditResult({
        customerId: customer.id,
        score,
        riskLevel: getRiskLevel(score),
        recommendedAmount: Math.min(50000000, Math.max(5000000, Math.round(score / 850 * 50000000))),
        maxTenor: score >= 650 ? 24 : score >= 500 ? 12 : 6,
        interestRate: score >= 650 ? 18 : score >= 500 ? 21 : 24,
        reasons: ["Dựa trên cashflow cơ bản"],
      });
    }

    setLoading(false);
  };

  const renderSellerPortal = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Seller Portal</h2>
        <p className="opacity-90">Quản lý khoản vay và theo dõi cashflow</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Wallet className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Số dư ví</p>
              <p className="font-bold">{formatCurrency(portfolio?.avgCashflowScore || 0)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Doanh thu tháng</p>
              <p className="font-bold">{formatCurrency(15000000)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Điểm cashflow</p>
              <p className="font-bold">{portfolio?.avgCashflowScore || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-semibold">Danh sách khách hàng</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 text-sm font-medium">Tên</th>
                <th className="text-left p-3 text-sm font-medium">Loại</th>
                <th className="text-left p-3 text-sm font-medium">Nền tảng</th>
                <th className="text-right p-3 text-sm font-medium">Doanh thu</th>
                <th className="text-right p-3 text-sm font-medium">Cashflow</th>
                <th className="text-center p-3 text-sm font-medium">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{customer.name}</td>
                  <td className="p-3 capitalize">{customer.type.replace("_", " ")}</td>
                  <td className="p-3">{customer.platform}</td>
                  <td className="p-3 text-right">{formatCurrency(customer.monthlyRevenue)}</td>
                  <td className="p-3 text-right">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      customer.cashflowScore >= 70 ? "bg-green-100 text-green-700" :
                      customer.cashflowScore >= 50 ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {customer.cashflowScore}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleAnalyze(customer)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Phân tích
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCustomer && creditResult && (
        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="font-semibold text-lg mb-4">Kết quả phân tích: {selectedCustomer.name}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Điểm tín dụng</p>
              <p className="text-3xl font-bold text-blue-600">{creditResult.score}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Mức rủi ro</p>
              <p className={`text-3xl font-bold ${
                creditResult.riskLevel === "low" ? "text-green-600" :
                creditResult.riskLevel === "medium" ? "text-yellow-600" :
                "text-red-600"
              }`}>
                {creditResult.riskLevel === "low" ? "Thấp" : creditResult.riskLevel === "medium" ? "Trung bình" : "Cao"}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Hạn mức vay</p>
              <p className="text-xl font-bold">{formatCurrency(creditResult.recommendedAmount)}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Lãi suất</p>
              <p className="text-xl font-bold">{creditResult.interestRate}%/năm</p>
            </div>
          </div>
          <div>
            <p className="font-medium mb-2">Lý do:</p>
            <ul className="space-y-1">
              {creditResult.reasons?.map((reason: string, i: number) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );

  const renderPlatformPortal = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Platform Portal</h2>
        <p className="opacity-90">Theo dõi tích hợp e-commerce và e-wallet</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="font-semibold mb-4">E-Commerce Platforms</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium">Shopee</p>
                <p className="text-sm text-green-600">Live • 2h ago</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium">Lazada</p>
                <p className="text-sm text-green-600">Live • 4h ago</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium">TikTok Shop</p>
                <p className="text-sm text-yellow-600">Pilot • 12h ago</p>
              </div>
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="font-semibold mb-4">E-Wallets</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium">MoMo</p>
                <p className="text-sm text-green-600">Live • 1h ago</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium">ZaloPay</p>
                <p className="text-sm text-green-600">Live • 1h ago</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdminPortal = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Admin Portfolio</h2>
        <p className="opacity-90">Quản lý rủi ro và theo dõi portfolio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow border p-4">
          <p className="text-sm text-gray-500">Tổng giải ngân</p>
          <p className="text-2xl font-bold">{formatCurrency(portfolio?.totalDisbursed || 0)}</p>
        </div>
        <div className="bg-white rounded-lg shadow border p-4">
          <p className="text-sm text-gray-500">Khoản vay active</p>
          <p className="text-2xl font-bold">{portfolio?.activeLoans || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow border p-4">
          <p className="text-sm text-gray-500">NPL Rate</p>
          <p className="text-2xl font-bold text-red-600">{portfolio?.nplRate || 0}%</p>
        </div>
        <div className="bg-white rounded-lg shadow border p-4">
          <p className="text-sm text-gray-500">Collection Rate</p>
          <p className="text-2xl font-bold text-green-600">{portfolio?.collectionRate || 0}%</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border p-6">
        <h3 className="font-semibold mb-4">Portfolio Health</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Tăng trưởng tháng</span>
            <span className="font-medium text-green-600">+{portfolio?.monthlyGrowth || 0}%</span>
          </div>
          <div className="flex justify-between">
            <span>Điểm cashflow TB</span>
            <span className="font-medium">{portfolio?.avgCashflowScore || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Rủi ro NPL</span>
            <span className={`font-medium ${(portfolio?.nplRate || 0) > 3 ? "text-red-600" : "text-green-600"}`}>
              {(portfolio?.nplRate || 0) > 3 ? " Cao" : " Thấp"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">SF12 - MicroBiz Loan</h1>
          <p className="text-gray-600">AI-powered micro loans for digital economy</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("seller")}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === "seller"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Seller Portal
          </button>
          <button
            onClick={() => setActiveTab("platform")}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === "platform"
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Platform
          </button>
          <button
            onClick={() => setActiveTab("admin")}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === "admin"
                ? "bg-orange-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Admin
          </button>
        </div>

        {activeTab === "seller" && renderSellerPortal()}
        {activeTab === "platform" && renderPlatformPortal()}
        {activeTab === "admin" && renderAdminPortal()}
      </div>
    </main>
  );
}