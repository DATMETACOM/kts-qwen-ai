import Link from "next/link";
import { Clock, Users, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Branch } from "@/lib/data";

interface BranchCardProps {
  branch: Branch;
}

export function BranchCard({ branch }: BranchCardProps) {
  const congestionVariant =
    branch.congestionLevel === "high"
      ? "destructive"
      : branch.congestionLevel === "medium"
      ? "warning"
      : "success";

  return (
    <Link href={`/branches/${branch.id}`}>
      <Card className="hover:shadow-lg transition-all hover:border-blue-300 cursor-pointer h-full">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{branch.name}</h3>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{branch.address}</span>
              </p>
            </div>
            <Badge variant={branch.status === "open" ? "success" : "secondary"}>
              {branch.status === "open" ? "Mở cửa" : "Đóng cửa"}
            </Badge>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Giờ mở cửa
              </span>
              <span className="font-medium">
                {branch.openTime} - {branch.closeTime}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Nhân viên
              </span>
              <span className="font-medium">{branch.staffCount} người</span>
            </div>
            {branch.currentWaitTime !== undefined && (
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-gray-500">Thời gian chờ</span>
                <Badge variant={congestionVariant}>
                  ~{branch.currentWaitTime} phút
                </Badge>
              </div>
            )}
          </div>

          <div className="mt-4 text-center">
            <span className="text-blue-600 text-sm font-medium">
              Xem dự báo →
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
