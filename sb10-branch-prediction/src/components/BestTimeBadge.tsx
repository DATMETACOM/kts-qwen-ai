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
    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-md p-6 mb-6 border border-green-400">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Giờ vàng để đến
          </h2>
          <p className="text-green-100">
            Khung giờ thấp nhất:{" "}
            <span className="font-bold text-white text-xl">
              {displayLabel}
            </span>
          </p>
          <p className="text-green-100 text-sm mt-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Thời gian chờ ước tính: ~{bestHour.predictedWaitTime} phút
          </p>
        </div>
        <Sparkles className="w-10 h-10 text-green-200 opacity-50" />
      </div>
    </div>
  );
}
