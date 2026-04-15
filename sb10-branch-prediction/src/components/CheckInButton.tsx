"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CheckInButtonProps {
  branchId: string;
  onCheckIn?: (positionInQueue?: number) => void;
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
          `Check-in thành công! Số thứ tự: ${data.positionInQueue}, Thời gian chờ: ~${data.estimatedWaitTime} phút`
        );
        onCheckIn?.(data.positionInQueue);
      } else {
        setMessage(`Lỗi: ${data.error?.message || "Không thể check-in"}`);
      }
    } catch {
      setMessage("Lỗi kết nối");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Check-in mô phỏng
        </CardTitle>
        <CardDescription>
          Thêm khách check-in để xem hàng đợi và dự báo cập nhật theo thời gian thực
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleCheckIn} disabled={isLoading}>
          <UserPlus className="w-4 h-4 mr-2" />
          {isLoading ? "Đang xử lý..." : "Check-in mới"}
        </Button>
        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${
            message.startsWith("Check-in")
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}>
            {message.startsWith("Check-in") ? "✅" : "❌"} {message}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
