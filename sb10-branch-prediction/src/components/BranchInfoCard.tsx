import { Clock, Users, Activity, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Branch } from "@/lib/data";
import type { QueueStatus } from "@/lib/data";

interface BranchInfoCardProps {
  branch: Branch;
  queueStatus?: QueueStatus | null;
}

export function BranchInfoCard({ branch, queueStatus }: BranchInfoCardProps) {
  const liveWaitTime = queueStatus?.averageWaitTime ?? branch.currentWaitTime ?? 0;
  const liveCongestionLevel =
    liveWaitTime > 20 ? "high" : liveWaitTime > 10 ? "medium" : "low";

  const waitColor =
    liveCongestionLevel === "high"
      ? "text-red-600"
      : liveCongestionLevel === "medium"
      ? "text-amber-600"
      : "text-emerald-600";

  const waitBg =
    liveCongestionLevel === "high"
      ? "bg-red-50"
      : liveCongestionLevel === "medium"
      ? "bg-amber-50"
      : "bg-emerald-50";

  return (
    <Card className="mb-5 border-gray-200 shadow-sm">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="text-gray-400 text-[10px] uppercase tracking-wide">Trạng thái</p>
              <Badge variant={branch.status === "open" ? "success" : "destructive"} className="text-[10px]">
                {branch.status === "open" ? "Mở cửa" : "Đóng cửa"}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-gray-400 text-[10px] uppercase tracking-wide">Giờ mở cửa</p>
              <p className="font-semibold text-xs">{branch.openTime} - {branch.closeTime}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
              <Users className="w-4 h-4 text-purple-600" />
            </div>
            <div className="min-w-0">
              <p className="text-gray-400 text-[10px] uppercase tracking-wide">Nhân viên</p>
              <p className="font-semibold text-xs">{branch.staffCount} người</p>
            </div>
          </div>
          <div className={`flex items-center gap-2.5 p-2.5 rounded-lg ${waitBg}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${liveCongestionLevel === "high" ? "bg-red-200" : liveCongestionLevel === "medium" ? "bg-amber-200" : "bg-emerald-200"}`}>
              <Activity className={`w-4 h-4 ${waitColor}`} />
            </div>
            <div className="min-w-0">
              <p className="text-gray-400 text-[10px] uppercase tracking-wide">Thời gian chờ</p>
              <p className={`font-bold text-sm ${waitColor}`}>~{liveWaitTime} phút</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
