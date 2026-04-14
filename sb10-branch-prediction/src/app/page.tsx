import { Building2, Bot } from "lucide-react";
import { BRANCHES } from "@/lib/data";
import { DashboardClient } from "@/components/DashboardClient";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Building2 className="w-7 h-7" />
                Shinhan Branch Traffic Prediction
              </h1>
              <p className="text-blue-200 text-sm mt-1">
                Dự đoán lưu lượng chi nhánh & Quản lý hàng đợi thông minh
              </p>
            </div>
            <div className="text-right text-sm">
              <p className="text-blue-200">Powered by</p>
              <p className="font-semibold flex items-center gap-1 justify-end">
                <Bot className="w-4 h-4" />
                Qwen AI
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">
            Danh sách chi nhánh ({BRANCHES.length} chi nhánh)
          </h2>
          <p className="text-gray-600 text-sm">
            Chọn chi nhánh để xem dự báo lưu lượng và thời gian chờ ước tính
          </p>
        </div>

        <DashboardClient branches={BRANCHES} />
      </main>

      <footer className="bg-gray-800 text-gray-400 py-4 mt-12">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>PoC for Shinhan InnoBoost 2026 | Built with Qwen AI</p>
        </div>
      </footer>
    </div>
  );
}
