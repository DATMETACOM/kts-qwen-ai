"use client";

import { useState } from "react";

interface CheckInButtonProps {
  branchId: string;
  onCheckIn?: () => void;
}

export function CheckInButton({ branchId, onCheckIn }: CheckInButtonProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckIn = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchId,
          customerName: `Khách ${Math.floor(Math.random() * 900 + 100)}`,
          serviceType: "Khác",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          `✅ Check-in thành công! Số thứ tự: ${data.positionInQueue}, Thời gian chờ: ~${data.estimatedWaitTime} phút`
        );
        onCheckIn?.();
      } else {
        setMessage(`❌ Lỗi: ${data.error?.message || "Không thể check-in"}`);
      }
    } catch {
      setMessage("❌ Lỗi kết nối");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">📝 Check-in mô phỏng</h2>
      <p className="text-gray-600 text-sm mb-4">
        Thêm khách check-in để xem hàng đợi và dự báo cập nhật theo thời gian thực
      </p>
      <button
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleCheckIn}
        disabled={isLoading}
      >
        {isLoading ? "Đang xử lý..." : "+ Check-in mới"}
      </button>
      {message && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
          {message}
        </div>
      )}
    </div>
  );
}
