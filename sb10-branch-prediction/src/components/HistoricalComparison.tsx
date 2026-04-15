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
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          So sánh: Hôm nay vs Tuần trước
        </CardTitle>
      </CardHeader>
      <CardContent>

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
      </CardContent>
    </Card>
  );
}
