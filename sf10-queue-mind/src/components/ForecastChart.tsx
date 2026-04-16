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
  Cell,
} from "recharts";
import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HourlyForecast } from "@/lib/data";

interface ForecastChartProps {
  hourlyForecast: HourlyForecast[];
  targetDate: string;
}

const CONGESTION_COLORS = {
  low: "#22c55e",
  medium: "#eab308",
  high: "#ef4444",
};

const CONGESTION_LABELS = {
  low: "Thấp",
  medium: "TB",
  high: "Cao",
};

interface TooltipPayloadItem {
  payload: HourlyForecast;
  value: number;
  dataKey: string;
  color: string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs">
      <p className="font-semibold text-gray-900 mb-1.5">{label}:00 - {Number(label) + 1}:00</p>
      <div className="space-y-1">
        <p className="text-blue-600">
          Số khách: <strong>{data.predictedCustomers}</strong>
        </p>
        <p className="text-orange-600">
          Thời gian chờ: <strong>{data.predictedWaitTime} phút</strong>
        </p>
        <p>
          Mức đông:{" "}
          <span
            style={{ color: CONGESTION_COLORS[data.congestionLevel] }}
            className="font-bold"
          >
            {CONGESTION_LABELS[data.congestionLevel]}
          </span>
        </p>
      </div>
    </div>
  );
}

export function ForecastChart({ hourlyForecast, targetDate }: ForecastChartProps) {
  const chartData = hourlyForecast.map((h) => ({
    hour: `${h.hour}h`,
    customers: h.predictedCustomers,
    waitTime: h.predictedWaitTime,
    congestionLevel: h.congestionLevel,
    fill: CONGESTION_COLORS[h.congestionLevel],
  }));

  const maxCustomers = Math.max(...hourlyForecast.map((h) => h.predictedCustomers), 1);

  return (
    <Card className="mb-5 border-gray-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <BarChart3 className="w-4 h-4 text-gray-500" />
          Dự báo lưu lượng ({targetDate})
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={{ stroke: "#e5e7eb" }}
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                domain={[0, Math.ceil(maxCustomers * 1.2)]}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value: string) =>
                  value === "customers" ? "Số khách" : "Thời gian chờ (phút)"
                }
                wrapperStyle={{ fontSize: 11 }}
              />
              <Bar yAxisId="left" dataKey="customers" radius={[4, 4, 0, 0]} name="customers">
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} fillOpacity={0.85} />
                ))}
              </Bar>
              <Bar
                yAxisId="right"
                dataKey="waitTime"
                fill="#6366f1"
                radius={[4, 4, 0, 0]}
                fillOpacity={0.4}
                name="waitTime"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-gray-100">
          {[
            { color: "bg-emerald-500", label: "Thấp (<10 phút)" },
            { color: "bg-amber-500", label: "TB (10-20 phút)" },
            { color: "bg-red-500", label: "Cao (>20 phút)" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded ${color}`} />
              <span className="text-[11px] text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
