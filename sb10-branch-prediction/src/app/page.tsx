import { Building2, Bot, Clock, TrendingUp, Users } from "lucide-react";
import { BRANCHES } from "@/lib/data";
import { DashboardClient } from "@/components/DashboardClient";

export default function HomePage() {
  const totalWaiting = BRANCHES.reduce((sum, b) => sum + (b.currentWaitTime || 0), 0);
  const avgWait = Math.round(totalWaiting / BRANCHES.length);
  const openBranches = BRANCHES.filter((b) => b.status === "open").length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="bg-gradient-to-r from-[#003478] to-[#1a4fa0] text-white shadow-xl">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight">
                    Shinhan Branch Traffic
                  </h1>
                  <p className="text-blue-200 text-xs">
                    Dự đoán lưu lượng & Quản lý hàng đợi thông minh
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2 backdrop-blur-sm">
              <Bot className="w-5 h-5 text-blue-200" />
              <div className="text-right">
                <p className="text-[10px] text-blue-300 uppercase tracking-wider">Powered by</p>
                <p className="text-sm font-semibold">Qwen AI</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 animate-fade-in">
          <div className="bg-white rounded-xl border p-3 sm:p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-gray-500 hidden sm:inline">Chi nhánh mở cửa</span>
              <span className="text-xs text-gray-500 sm:hidden">CN mở</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">
              {openBranches}/{BRANCHES.length}
            </p>
          </div>
          <div className="bg-white rounded-xl border p-3 sm:p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="text-xs text-gray-500 hidden sm:inline">Chờ trung bình</span>
              <span className="text-xs text-gray-500 sm:hidden">Chờ TB</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">~{avgWait}p</p>
          </div>
          <div className="bg-white rounded-xl border p-3 sm:p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-gray-500 hidden sm:inline">Dự báo hôm nay</span>
              <span className="text-xs text-gray-500 sm:hidden">Dự báo</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-emerald-600">Live</p>
          </div>
        </div>

        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-400" />
            Chi nhánh ({BRANCHES.length})
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">
            Chọn chi nhánh để xem dự báo lưu lượng và thời gian chờ
          </p>
        </div>

        <DashboardClient branches={BRANCHES} />
      </main>

      <footer className="bg-gray-900 text-gray-500 py-5 mt-16">
        <div className="container mx-auto px-4 text-center text-xs space-y-1">
          <p className="text-gray-400 font-medium">
            SB10 - Branch Traffic Prediction & Smart Queue
          </p>
          <p>PoC for Qwen AI Build Day 2026 & Shinhan InnoBoost</p>
        </div>
      </footer>
    </div>
  );
}
