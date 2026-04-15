"use client";

import { useState, useEffect } from "react";
import { ListOrdered, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface QueueStatus {
  branchId: string;
  waiting: number;
  serving: number;
  averageWaitTime: number;
  estimatedTimeForNew: number;
  checkIns: {
    checkInId: string;
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
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListOrdered className="w-5 h-5" />
            Hàng đợi hiện tại
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Đang tải...
          </div>
        </CardContent>
      </Card>
    );
  }

  const checkIns = queue?.checkIns || [];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListOrdered className="w-5 h-5" />
          Hàng đợi hiện tại
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{queue?.waiting || 0}</p>
            <p className="text-xs text-gray-600">Đang chờ</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{queue?.serving || 0}</p>
            <p className="text-xs text-gray-600">Đang phục vụ</p>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">{queue?.averageWaitTime || 0}p</p>
            <p className="text-xs text-gray-600">TB chờ</p>
          </div>
        </div>

        {checkIns.length > 0 ? (
          <div className="space-y-2">
            {checkIns.slice(0, 8).map((c) => (
              <div
                key={c.checkInId}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="font-mono">#{c.positionInQueue}</Badge>
                  <span className="text-gray-700">{c.customerName}</span>
                  <span className="text-gray-400 text-xs">{c.serviceType}</span>
                </div>
                <div className="flex items-center gap-2">
                  {c.status === "serving" ? (
                    <Badge variant="success">Đang phục vụ</Badge>
                  ) : (
                    <span className="text-xs text-gray-500">~{c.estimatedWaitTime} phút</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm text-center py-4">Chưa có khách hàng nào trong hàng đợi</p>
        )}

        <p className="text-xs text-gray-400 mt-3 text-right">
          Ước tính khách mới: ~{queue?.estimatedTimeForNew || 0} phút. Tự động cập nhật mỗi 15 giây
        </p>
      </CardContent>
    </Card>
  );
}
