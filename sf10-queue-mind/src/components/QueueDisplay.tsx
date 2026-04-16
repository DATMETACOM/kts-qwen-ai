"use client";

import { useState, useEffect } from "react";
import { ListOrdered, Loader2, Users, Clock, Hourglass } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { QueueStatus } from "@/lib/data";

interface QueueDisplayProps {
  branchId: string;
  onStatusChange?: (queue: QueueStatus) => void;
}

export function QueueDisplay({ branchId, onStatusChange }: QueueDisplayProps) {
  const [queue, setQueue] = useState<QueueStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchQueue = async () => {
    try {
      const res = await fetch(`/api/checkin?branchId=${branchId}`);
      if (res.ok) {
        const data = await res.json();
        setQueue(data);
        onStatusChange?.(data);
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
  }, [branchId, onStatusChange]);

  if (loading) {
    return (
      <Card className="mb-5 border-gray-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <ListOrdered className="w-4 h-4 text-gray-500" />
            Hàng đợi hiện tại
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Đang tải...
          </div>
        </CardContent>
      </Card>
    );
  }

  const checkIns = queue?.checkIns || [];

  return (
    <Card className="mb-5 border-gray-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <ListOrdered className="w-4 h-4 text-gray-500" />
          Hàng đợi hiện tại
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
          <div className="text-center p-2.5 bg-blue-50 rounded-lg">
            <Users className="w-4 h-4 text-blue-400 mx-auto mb-1" />
            <p className="text-lg sm:text-xl font-bold text-blue-600">{queue?.waiting || 0}</p>
            <p className="text-[10px] text-gray-500">Đang chờ</p>
          </div>
          <div className="text-center p-2.5 bg-emerald-50 rounded-lg">
            <Clock className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <p className="text-lg sm:text-xl font-bold text-emerald-600">{queue?.serving || 0}</p>
            <p className="text-[10px] text-gray-500">Phục vụ</p>
          </div>
          <div className="text-center p-2.5 bg-amber-50 rounded-lg">
            <Hourglass className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <p className="text-lg sm:text-xl font-bold text-amber-600">{queue?.averageWaitTime || 0}p</p>
            <p className="text-[10px] text-gray-500">TB chờ</p>
          </div>
        </div>

        {checkIns.length > 0 ? (
          <div className="space-y-1.5">
            {checkIns.slice(0, 6).map((c) => (
              <div
                key={c.checkInId}
                className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg text-xs"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-[10px] h-5">
                    #{c.positionInQueue}
                  </Badge>
                  <span className="text-gray-700 font-medium">{c.customerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  {c.status === "serving" ? (
                    <Badge variant="success" className="text-[10px]">Đang phục vụ</Badge>
                  ) : (
                    <span className="text-gray-400 text-[11px]">~{c.estimatedWaitTime}p</span>
                  )}
                </div>
              </div>
            ))}
            {checkIns.length > 6 && (
              <p className="text-[11px] text-gray-400 text-center">
                +{checkIns.length - 6} khách khác
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-300 text-xs text-center py-6">Chưa có khách trong hàng đợi</p>
        )}

        <p className="text-[10px] text-gray-300 mt-3 text-right">
          Khách mới ước tính: ~{queue?.estimatedTimeForNew || 0} phút &middot; Cập nhật mỗi 15s
        </p>
      </CardContent>
    </Card>
  );
}
