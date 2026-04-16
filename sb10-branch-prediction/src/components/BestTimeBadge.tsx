import { Sparkles, Clock } from "lucide-react";
import { HourlyForecast } from "@/lib/data";

interface BestTimeBadgeProps {
  hourlyForecast: HourlyForecast[];
  bestTimeLabel?: string;
}

export function BestTimeBadge({ hourlyForecast, bestTimeLabel }: BestTimeBadgeProps) {
  const filtered = hourlyForecast.filter((h) => h.hour >= 9 && h.hour <= 16);
  if (filtered.length === 0) return null;
  const bestHour = filtered.reduce((best, h) =>
    h.predictedWaitTime < best.predictedWaitTime ? h : best
  );

  const displayLabel = bestTimeLabel || `${bestHour.hour}:00 - ${bestHour.hour + 1}:00`;

  return (
    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl shadow-md p-4 sm:p-5 mb-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
      <div className="absolute bottom-0 right-12 w-20 h-20 bg-white/5 rounded-full translate-y-6" />
      <div className="relative flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold mb-1.5 flex items-center gap-2 opacity-90">
            <Sparkles className="w-4 h-4" />
            Giờ vàng để đến chi nhánh
          </h2>
          <p className="text-xl sm:text-2xl font-bold">
            {displayLabel}
          </p>
          <p className="text-emerald-100 text-xs mt-1.5 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Thời gian chờ ước tính: ~{bestHour.predictedWaitTime} phút
          </p>
        </div>
        <Sparkles className="w-10 h-10 text-white/20" />
      </div>
    </div>
  );
}
