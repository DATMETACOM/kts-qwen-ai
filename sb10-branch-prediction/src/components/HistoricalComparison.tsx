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
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrafficRecord } from "@/lib/data";

interface HistoricalComparisonProps {
  todayForecast: number[];
  lastWeekHistory: TrafficRecord[];
}

export function HistoricalComparison({ todayForecast, lastWeekHistory }: HistoricalComparisonProps) {
  const historyByHour = new Map<number, { totalCustomers: number; samples: number }>();

  lastWeekHistory.forEach((record) => {
    const current = historyByHour.get(record.hour) || { totalCustomers: 0, samples: 0 };
    historyByHour.set(record.hour, {
      totalCustomers: current.totalCustomers + record.customerCount,
      samples: current.samples + 1,
    });
  });

  const chartData = todayForecast.map((customers, i) => {
    const hour = i + 8;
    const historical = historyByHour.get(hour);
    const avgLastWeek = historical
      ? Math.round(historical.totalCustomers / historical.samples)
      : customers;

    return {
      hour: `${hour}h`,
      homNay: customers,
      tuanTruoc: avgLastWeek,
    };
  });

  return (
    <Card className="mb-5 border-gray-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-gray-500" />
          Hôm nay vs Tuần trước
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={{ stroke: "#e5e7eb" }} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid #e5e7eb" }}
                formatter={(value, name) => [
                  `${value} khách`,
                  name === "homNay" ? "Hôm nay" : "Tuần trước",
                ]}
              />
              <Legend
                formatter={(value: string) =>
                  value === "homNay" ? "Hôm nay (dự báo)" : "Tuần trước (TB)"
                }
                wrapperStyle={{ fontSize: 11 }}
              />
              <Bar dataKey="homNay" fill="#3b82f6" radius={[3, 3, 0, 0]} />
              <Bar dataKey="tuanTruoc" fill="#93c5fd" radius={[3, 3, 0, 0]} fillOpacity={0.5} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
