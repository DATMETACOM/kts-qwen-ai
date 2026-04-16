"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Brain,
  Users,
  TrendingUp,
  Clock,
  Loader2,
  Bot,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Branch, HourlyForecast } from "@/lib/data";
import type { QueueStatus } from "@/lib/data";

interface StaffRec {
  hour: number;
  recommendedStaff: number;
  currentStaff: number;
  reason: string;
}

interface AdminData {
  prediction: { hourly: HourlyForecast[]; summary: string };
  staffOptimization: {
    hourlyRecommendations: StaffRec[];
    totalAdditionalStaff: number;
    summary: string;
  };
  queueStatus: QueueStatus;
}

interface AdminClientProps {
  branch: Branch;
}

export function AdminClient({ branch }: AdminClientProps) {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOptimization = async () => {
    setLoading(true);
    setError(null);
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const targetDate = tomorrow.toISOString().split("T")[0];

      const res = await fetch(`/api/staff-opt/${branch.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetDate }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error?.message || "Failed");
      }

      const result = await res.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-xl">
        <div className="container mx-auto px-4 py-4">
          <Link
            href={`/branches/${branch.id}`}
            className="text-slate-400 hover:text-white mb-1.5 inline-flex items-center gap-1 text-sm transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Chi nhánh
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                {branch.name}
              </h1>
              <p className="text-slate-400 text-xs mt-0.5">Tối ưu nhân sự bằng AI</p>
            </div>
            <Badge variant="secondary" className="text-xs shrink-0">
              <Users className="w-3 h-3 mr-1" />
              {branch.staffCount} NV
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-5 max-w-4xl">
        <Card className="mb-5 border-gray-200 shadow-sm">
          <CardContent className="p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                  <Brain className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Tối ưu nhân sự</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    AI phân tích dự báo ngày mai & đề xuất phân bổ nhân sự
                  </p>
                </div>
              </div>
              <Button onClick={fetchOptimization} disabled={loading} className="bg-purple-600 hover:bg-purple-700 shrink-0">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                    Đang phân tích...
                  </>
                ) : (
                  <>
                    <Bot className="w-4 h-4 mr-1.5" />
                    Phân tích
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-5 text-sm">
            <p className="font-semibold text-xs uppercase tracking-wide mb-1">Lỗi</p>
            <p className="text-xs">{error}</p>
          </div>
        )}

        {data && (
          <>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5">
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-3 text-center">
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">{data.queueStatus.waiting}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Đang chờ</p>
                </CardContent>
              </Card>
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-3 text-center">
                  <p className="text-xl sm:text-2xl font-bold text-amber-600">{data.queueStatus.averageWaitTime}p</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Chờ TB</p>
                </CardContent>
              </Card>
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-3 text-center">
                  <p className="text-xl sm:text-2xl font-bold text-emerald-600">{data.queueStatus.estimatedTimeForNew}p</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Cho khách mới</p>
                </CardContent>
              </Card>
            </div>

            {data.prediction.summary && (
              <Card className="mb-5 border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-gray-800">Phân tích dự báo</p>
                      <p className="text-xs text-gray-600 mt-1">{data.prediction.summary}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {data.staffOptimization && (
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-emerald-600" />
                    Đề xuất phân bổ nhân sự
                  </CardTitle>
                  <CardDescription className="text-xs">{data.staffOptimization.summary}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 bg-blue-50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-blue-700">{branch.staffCount}</p>
                      <p className="text-[10px] text-gray-500">Hiện tại</p>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-emerald-700">
                        +{data.staffOptimization.totalAdditionalStaff}
                      </p>
                      <p className="text-[10px] text-gray-500">Bổ sung đề xuất</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left py-2 px-2 text-gray-400 font-medium">Giờ</th>
                          <th className="text-center py-2 px-2 text-gray-400 font-medium">Hiện tại</th>
                          <th className="text-center py-2 px-2 text-gray-400 font-medium">Đề xuất</th>
                          <th className="text-center py-2 px-2 text-gray-400 font-medium">Thay đổi</th>
                          <th className="text-left py-2 px-2 text-gray-400 font-medium hidden sm:table-cell">Lý do</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.staffOptimization.hourlyRecommendations.map((rec) => {
                          const diff = rec.recommendedStaff - rec.currentStaff;
                          return (
                            <tr key={rec.hour} className="border-b border-gray-50 hover:bg-gray-50/50">
                              <td className="py-2 px-2 font-medium whitespace-nowrap">
                                <Clock className="w-3 h-3 inline mr-1 text-gray-400" />
                                {rec.hour}:00
                              </td>
                              <td className="py-2 px-2 text-center">{rec.currentStaff}</td>
                              <td className="py-2 px-2 text-center font-semibold">{rec.recommendedStaff}</td>
                              <td className="py-2 px-2 text-center">
                                {diff > 0 ? (
                                  <Badge className="text-[10px] bg-amber-100 text-amber-700 border-amber-200">+{diff}</Badge>
                                ) : diff < 0 ? (
                                  <Badge className="text-[10px] bg-emerald-100 text-emerald-700 border-emerald-200">{diff}</Badge>
                                ) : (
                                  <Badge variant="secondary" className="text-[10px]">0</Badge>
                                )}
                              </td>
                              <td className="py-2 px-2 text-gray-500 hidden sm:table-cell">{rec.reason}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
}
