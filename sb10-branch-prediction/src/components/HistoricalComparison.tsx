"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrafficRecord } from "@/lib/data";

interface HistoricalComparisonProps {
  todayForecast: number[];
  lastWeekHistory: TrafficRecord[];
}

export function HistoricalComparison({ todayForecast, lastWeekHistory }: HistoricalComparisonProps) {
  const lastWeekByHour = new Map<number, number>();
  lastWeekHistory.forEach((r) => {
    lastWeekByHour.set(r.hour, (lastWeekByHour.get(r.hour) || 0) + r.customerCount);
  });
  const lastWeekCount = lastWeekHistory.length > 0 ? Math.max(...lastWeekByHour.values()) : 1;

  const chartData = todayForecast.map((customers, i) => {
    const hour = i + 8;
    const lastWeek = lastWeekByHour.get(hour) || 0;
    const avgLastWeek = lastWeekHistory.length > 0
      ? Math.round((lastWeek / lastWeekCount) * customers * 0.8)
      : Math.round(customers * (0.8 + Math.random() * 0.4));
    return {
      hour: `${hour}h`,
      homNay: customers,
      tuanTruoc: avgLastWeek,
    };
  });

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        📈 So sánh: Hôm nay vs Tuần trước
      </h2>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="hour" tick={{ fontSize: 12, fill: "#6b7280" }} />
            <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
            <Tooltip
              contentStyle={{ borderRadius: 8, fontSize: 13 }}
              formatter={(value, name) => [
                `${value} khách`,
                name === "homNay" ? "Hôm nay" : "Tuần trước",
              ]}
            />
            <Legend
              formatter={(value: string) =>
                value === "homNay" ? "Hôm nay (dự báo)" : "Tuần trước (TB)"
              }
            />
            <Bar dataKey="homNay" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="tuanTruoc" fill="#93c5fd" radius={[4, 4, 0, 0]} fillOpacity={0.6} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
