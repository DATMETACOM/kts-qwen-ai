"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Bell, X, AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface Notification {
  id: string;
  type: "warning" | "success" | "info";
  title: string;
  message: string;
  timestamp: Date;
}

interface NotificationPanelProps {
  branchId: string;
  currentWaitTime?: number;
  congestionLevel?: "low" | "medium" | "high";
}

export function NotificationPanel({
  branchId,
  currentWaitTime = 0,
  congestionLevel = "low",
}: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const lastSignatureRef = useRef<string>("");

  const addNotification = useCallback(
    (type: Notification["type"], title: string, message: string) => {
      const notif: Notification = {
        id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type,
        title,
        message,
        timestamp: new Date(),
      };
      setNotifications((prev) => [notif, ...prev].slice(0, 10));
    },
    []
  );

  useEffect(() => {
    const signature = `${branchId}:${congestionLevel}:${currentWaitTime}`;
    if (lastSignatureRef.current === signature) return;

    if (congestionLevel === "high") {
      addNotification(
        "warning",
        "Chi nhánh đang đông",
        `Thời gian chờ hiện tại: ~${currentWaitTime} phút. Nên đến vào khung giờ khác.`
      );
    } else if (congestionLevel === "low") {
      addNotification(
        "success",
        "Thời điểm lý tưởng",
        "Chi nhánh đang ít khách, thời gian chờ ngắn. Đây là lúc đến tốt nhất!"
      );
    }
    lastSignatureRef.current = signature;
  }, [branchId, congestionLevel, currentWaitTime, addNotification]);

  const dismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const iconMap = {
    warning: <AlertTriangle className="w-4 h-4 text-amber-500" />,
    success: <CheckCircle className="w-4 h-4 text-emerald-500" />,
    info: <Clock className="w-4 h-4 text-blue-500" />,
  };

  const bgMap = {
    warning: "bg-amber-50 border-amber-200",
    success: "bg-emerald-50 border-emerald-200",
    info: "bg-blue-50 border-blue-200",
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
      >
        <Bell className="w-4 h-4 text-gray-600" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-16 right-4 z-50 w-80 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-xl animate-fade-in">
          <div className="sticky top-0 bg-white border-b border-gray-100 p-3 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Thông báo
            </h3>
            <button
              onClick={() => setNotifications([])}
              className="text-[10px] text-gray-400 hover:text-gray-600"
            >
              Xoá tất cả
            </button>
          </div>
          {notifications.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-8">Không có thông báo</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 border-l-2 ${bgMap[n.type]}`}
                >
                  <div className="flex items-start gap-2">
                    {iconMap[n.type]}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800">{n.title}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{n.message}</p>
                      <p className="text-[10px] text-gray-300 mt-1">
                        {n.timestamp.toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => dismiss(n.id)}
                      className="text-gray-300 hover:text-gray-500 shrink-0"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
