"use client";

import { useState } from "react";
import { UserPlus, CheckCircle, XCircle } from "lucide-react";
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
          `STT: #${data.positionInQueue} | Chờ: ~${data.estimatedWaitTime} phút`
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

  const isSuccess = message.startsWith("STT");
  const isError = message.startsWith("Lỗi");

  return (
    <Card className="mb-5 border-gray-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <UserPlus className="w-4 h-4 text-gray-500" />
          Check-in mô phỏng
        </CardTitle>
        <CardDescription className="text-xs">
          Thêm khách để xem hàng đợi cập nhật
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleCheckIn}
          disabled={isLoading}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
        >
          <UserPlus className="w-3.5 h-3.5 mr-1.5" />
          {isLoading ? "Đang xử lý..." : "Check-in mới"}
        </Button>
        {message && (
          <div className={`mt-3 p-2.5 rounded-lg text-xs flex items-center gap-2 ${
            isSuccess
              ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}>
            {isSuccess ? (
              <CheckCircle className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <XCircle className="w-3.5 h-3.5 shrink-0" />
            )}
            {message}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
