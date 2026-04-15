"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Brain,
  Users,
  TrendingUp,
  Clock,
  Loader2,
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-slate-900 text-white py-4 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href={`/branches/${branch.id}`} className="text-slate-400 hover:text-white mb-1 inline-block text-sm">
                ← Chi tiết chi nhánh
              </Link>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <Brain className="w-6 h-6 text-purple-400" />
                Quản lý: {branch.name}
              </h1>
              <p className="text-slate-400 text-sm">{branch.address}</p>
            </div>
            <Badge variant="secondary" className="text-sm">
              <Users className="w-3.5 h-3.5 mr-1" />
              {branch.staffCount} nhân viên hiện tại
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              Tối ưu nhân sự bằng Qwen AI
            </CardTitle>
            <CardDescription>
              AI phân tích dự báo lưu lượng ngày mai và đề xuất phân bổ nhân sự tối ưu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={fetchOptimization} disabled={loading} size="lg">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang phân tích...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Phân tích & Đề xuất
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
            <p className="font-semibold">Lỗi</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {data && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-blue-700">{data.queueStatus.waiting}</p>
                  <p className="text-sm text-gray-600">Khách đang chờ hiện tại</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-orange-700">{data.queueStatus.averageWaitTime}p</p>
                  <p className="text-sm text-gray-600">Thời gian chờ TB hiện tại</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-700">{data.queueStatus.estimatedTimeForNew}p</p>
                  <p className="text-sm text-gray-600">Ước tính cho khách mới</p>
                </CardContent>
              </Card>
            </div>

            {data.prediction.summary && (
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Phân tích dự báo</p>
                      <p className="text-sm text-gray-600 mt-1">{data.prediction.summary}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {data.staffOptimization && (
              <>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Users className="w-5 h-5 text-green-600" />
                      Đề xuất phân bổ nhân sự
                    </CardTitle>
                    <CardDescription>{data.staffOptimization.summary}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="p-4 bg-blue-50 rounded-lg text-center">
                        <p className="text-3xl font-bold text-blue-700">{branch.staffCount}</p>
                        <p className="text-sm text-gray-600">Nhân viên hiện tại</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg text-center">
                        <p className="text-3xl font-bold text-green-700">
                          +{data.staffOptimization.totalAdditionalStaff}
                        </p>
                        <p className="text-sm text-gray-600">Nhân viên bổ sung đề xuất</p>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-3 text-gray-500 font-medium">Giờ</th>
                            <th className="text-center py-2 px-3 text-gray-500 font-medium">Hiện tại</th>
                            <th className="text-center py-2 px-3 text-gray-500 font-medium">Đề xuất</th>
                            <th className="text-center py-2 px-3 text-gray-500 font-medium">Thay đổi</th>
                            <th className="text-left py-2 px-3 text-gray-500 font-medium">Lý do</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.staffOptimization.hourlyRecommendations.map((rec) => {
                            const diff = rec.recommendedStaff - rec.currentStaff;
                            return (
                              <tr key={rec.hour} className="border-b hover:bg-gray-50">
                                <td className="py-2 px-3 font-medium">
                                  <Clock className="w-3.5 h-3.5 inline mr-1" />
                                  {rec.hour}:00 - {rec.hour + 1}:00
                                </td>
                                <td className="py-2 px-3 text-center">{rec.currentStaff}</td>
                                <td className="py-2 px-3 text-center font-semibold">{rec.recommendedStaff}</td>
                                <td className="py-2 px-3 text-center">
                                  {diff > 0 ? (
                                    <Badge variant="warning">+{diff}</Badge>
                                  ) : diff < 0 ? (
                                    <Badge variant="success">{diff}</Badge>
                                  ) : (
                                    <Badge variant="secondary">0</Badge>
                                  )}
                                </td>
                                <td className="py-2 px-3 text-gray-600">{rec.reason}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
