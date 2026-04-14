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
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-900 mb-2">{label}:00 - {Number(label) + 1}:00</p>
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
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Dự báo lưu lượng ({targetDate})
        </CardTitle>
      </CardHeader>
      <CardContent>

      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="hour"
              tick={{ fontSize: 12, fill: "#6b7280" }}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              label={{
                value: "Số khách",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 12, fill: "#6b7280" },
              }}
              domain={[0, Math.ceil(maxCustomers * 1.2)]}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              label={{
                value: "Phút chờ",
                angle: 90,
                position: "insideRight",
                style: { fontSize: 12, fill: "#6b7280" },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value: string) =>
                value === "customers" ? "Số khách" : "Thời gian chờ (phút)"
              }
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
              fillOpacity={0.5}
              name="waitTime"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-6 mt-4 pt-4 border-t">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500"></div>
          <span className="text-sm text-gray-600">Thấp (&lt;10 phút)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-500"></div>
          <span className="text-sm text-gray-600">Trung bình (10-20 phút)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500"></div>
          <span className="text-sm text-gray-600">Cao (&gt;20 phút)</span>
        </div>
      </div>
      </CardContent>
    </Card>
  );
}
