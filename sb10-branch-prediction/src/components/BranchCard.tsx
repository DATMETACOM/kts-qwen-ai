import Link from "next/link";
import { Clock, Users, MapPin, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Branch } from "@/lib/data";

interface BranchCardProps {
  branch: Branch;
}

export function BranchCard({ branch }: BranchCardProps) {
  const congestionColor =
    branch.congestionLevel === "high"
      ? "text-red-600 bg-red-50"
      : branch.congestionLevel === "medium"
      ? "text-amber-600 bg-amber-50"
      : "text-emerald-600 bg-emerald-50";

  const congestionDot =
    branch.congestionLevel === "high"
      ? "bg-red-500"
      : branch.congestionLevel === "medium"
      ? "bg-amber-500"
      : "bg-emerald-500";

  const congestionLabel =
    branch.congestionLevel === "high"
      ? "Cao"
      : branch.congestionLevel === "medium"
      ? "TB"
      : "Thấp";

  return (
    <Link href={`/branches/${branch.id}`} className="block group">
      <Card className="hover:shadow-lg hover:border-blue-200 transition-all duration-200 cursor-pointer h-full border-gray-200">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate group-hover:text-blue-700 transition-colors">
                {branch.name}
              </h3>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{branch.address}</span>
              </p>
            </div>
            <Badge
              variant={branch.status === "open" ? "success" : "secondary"}
              className="text-[10px] shrink-0 ml-2"
            >
              {branch.status === "open" ? "Mở cửa" : "Đóng cửa"}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs mb-3">
            <div className="flex items-center gap-1 text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{branch.openTime}-{branch.closeTime}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <Users className="w-3 h-3" />
              <span>{branch.staffCount} NV</span>
            </div>
            {branch.currentWaitTime !== undefined && (
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${congestionColor}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${congestionDot}`} />
                {congestionLabel} ~{branch.currentWaitTime}p
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex flex-wrap gap-1">
              {branch.services.slice(0, 3).map((s) => (
                <span key={s} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                  {s}
                </span>
              ))}
              {branch.services.length > 3 && (
                <span className="text-[10px] text-gray-400">+{branch.services.length - 3}</span>
              )}
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
