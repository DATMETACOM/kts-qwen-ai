"use client";

import { useState, useEffect } from "react";

interface QueueStatus {
  branchId: string;
  waitingCount: number;
  servingCount: number;
  avgWaitTime: number;
  checkIns: {
    id: string;
    positionInQueue: number;
    estimatedWaitTime: number;
    customerName: string;
    serviceType: string;
    status: string;
  }[];
}

interface QueueDisplayProps {
  branchId: string;
}

export function QueueDisplay({ branchId }: QueueDisplayProps) {
  const [queue, setQueue] = useState<QueueStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchQueue = async () => {
    try {
      const res = await fetch(`/api/checkin?branchId=${branchId}`);
      if (res.ok) {
        const data = await res.json();
        setQueue(data);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 15000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 Hàng đợi hiện tại</h2>
        <p className="text-gray-500 text-sm">Đang tải...</p>
      </div>
    );
  }

  const waitingCount = queue?.waitingCount || 0;
  const servingCount = queue?.servingCount || 0;
  const checkIns = queue?.checkIns || [];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 Hàng đợi hiện tại</h2>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{waitingCount}</p>
          <p className="text-xs text-gray-600">Đang chờ</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">{servingCount}</p>
          <p className="text-xs text-gray-600">Đang phục vụ</p>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <p className="text-2xl font-bold text-orange-600">{queue?.avgWaitTime || 0}p</p>
          <p className="text-xs text-gray-600">TB chờ</p>
        </div>
      </div>

      {checkIns.length > 0 ? (
        <div className="space-y-2">
          {checkIns.slice(0, 8).map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                  #{c.positionInQueue}
                </span>
                <span className="text-gray-700">{c.customerName}</span>
                <span className="text-gray-400 text-xs">{c.serviceType}</span>
              </div>
              <div className="flex items-center gap-2">
                {c.status === "serving" ? (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                    Đang phục vụ
                  </span>
                ) : (
                  <span className="text-xs text-gray-500">~{c.estimatedWaitTime} phút</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm text-center py-4">Chưa có khách hàng nào trong hàng đợi</p>
      )}

      <p className="text-xs text-gray-400 mt-3 text-right">Tự động cập nhật mỗi 15 giây</p>
    </div>
  );
}
