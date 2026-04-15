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

  const waitVariant =
    liveCongestionLevel === "high"
      ? "destructive"
      : liveCongestionLevel === "medium"
      ? "warning"
      : "success";

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
            <div>
              <p className="text-gray-500 text-xs">Trạng thái</p>
              <p className="font-semibold">
                <Badge variant={branch.status === "open" ? "success" : "destructive"}>
                  {branch.status === "open" ? "Mở cửa" : "Đóng cửa"}
                </Badge>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Clock className="w-5 h-5 text-blue-500 shrink-0" />
            <div>
              <p className="text-gray-500 text-xs">Giờ mở cửa</p>
              <p className="font-semibold text-sm">
                {branch.openTime} - {branch.closeTime}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Users className="w-5 h-5 text-purple-500 shrink-0" />
            <div>
              <p className="text-gray-500 text-xs">Nhân viên</p>
              <p className="font-semibold">{branch.staffCount} người</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Activity className="w-5 h-5 text-orange-500 shrink-0" />
            <div>
              <p className="text-gray-500 text-xs">Thời gian chờ</p>
              <p className="font-semibold">
                <Badge variant={waitVariant}>~{liveWaitTime} phút</Badge>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
