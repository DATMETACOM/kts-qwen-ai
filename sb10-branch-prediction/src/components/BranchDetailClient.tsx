"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Brain, RefreshCw, ChevronLeft, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Branch, TrafficRecord, HourlyForecast } from "@/lib/data";
import type { QueueStatus } from "@/lib/data";
import {
  BranchInfoCard,
  BestTimeBadge,
  ForecastChart,
  CheckInButton,
  HistoricalComparison,
  QueueDisplay,
  DatePicker,
  NotificationPanel,
} from "@/components";

interface BranchDetailClientProps {
  branch: Branch;
  initialForecast: HourlyForecast[];
  initialBestTime?: string;
  initialSummary?: string;
  trafficHistory: TrafficRecord[];
  today: string;
  predictionError?: string;
}

export function BranchDetailClient({
  branch,
  initialForecast,
  initialBestTime,
  initialSummary,
  trafficHistory,
  today,
  predictionError,
}: BranchDetailClientProps) {
  const [selectedDate, setSelectedDate] = useState(today);
  const [forecast, setForecast] = useState(initialForecast);
  const [bestTime, setBestTime] = useState(initialBestTime);
  const [summary, setSummary] = useState(initialSummary);
  const [error, setError] = useState(predictionError);
  const [refreshing, setRefreshing] = useState(false);
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);

  const resolveCurrentCheckIns = useCallback(
    (targetDate: string, explicitCheckIns?: number) => {
      if (targetDate !== today) return 0;
      if (typeof explicitCheckIns === "number") return explicitCheckIns;
      return queueStatus?.waiting ?? 0;
    },
    [queueStatus?.waiting, today]
  );

  const refreshPrediction = useCallback(
    async (targetDate: string, explicitCheckIns?: number) => {
      setRefreshing(true);
      try {
        const currentCheckIns = resolveCurrentCheckIns(targetDate, explicitCheckIns);
        const res = await fetch(`/api/predict/${branch.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ targetDate, currentCheckIns }),
        });
        if (res.ok) {
          const data = await res.json();
          setForecast(data.hourly || []);
          setBestTime(data.bestTimeToVisit);
          setSummary(data.summary);
          setError(undefined);
        } else {
          const failure = await res.json().catch(() => ({}));
          setError(failure.error?.message || "Không thể cập nhật dự báo");
        }
      } catch {
        setError("Không thể cập nhật dự báo");
      } finally {
        setRefreshing(false);
      }
    },
    [branch.id, resolveCurrentCheckIns]
  );

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    refreshPrediction(date);
  };

  const handleCheckIn = (positionInQueue?: number) => {
    refreshPrediction(selectedDate, positionInQueue);
  };

  const liveWaitTime = queueStatus?.averageWaitTime ?? branch.currentWaitTime ?? 0;
  const liveCongestionLevel =
    liveWaitTime > 20 ? "high" : liveWaitTime > 10 ? "medium" : "low";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="bg-gradient-to-r from-[#003478] to-[#1a4fa0] text-white shadow-xl">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/"
            className="text-blue-300 hover:text-white mb-2 inline-flex items-center gap-1 text-sm transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Dashboard
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-lg sm:text-xl font-bold">{branch.name}</h1>
              <p className="text-blue-200 text-xs sm:text-sm">{branch.address}</p>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Link href={`/admin/${branch.id}`}>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/10 text-white hover:bg-white/20 border-0 text-xs"
                >
                  <Brain className="w-3.5 h-3.5 mr-1" />
                  <span className="hidden sm:inline">Quản lý</span>
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-300 hover:text-white hover:bg-white/10 text-xs"
                onClick={() => refreshPrediction(selectedDate)}
                disabled={refreshing}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-5 max-w-4xl">
        <BranchInfoCard branch={branch} queueStatus={queueStatus} />

        <div className="mb-5">
          <DatePicker
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
          />
        </div>

        {refreshing && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-xl p-3 mb-4 text-xs flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            Đang cập nhật dự báo...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-5 text-sm">
            <p className="font-semibold text-xs uppercase tracking-wide mb-1">Lỗi dự báo</p>
            <p className="text-xs">{error}</p>
          </div>
        )}

        {summary && (
          <div className="bg-white border border-blue-200 rounded-xl p-4 mb-5 shadow-sm">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-xs text-blue-800 uppercase tracking-wide">Phân tích Qwen AI</p>
                <p className="text-sm text-gray-600 mt-1">{summary}</p>
              </div>
            </div>
          </div>
        )}

        {forecast.length > 0 && (
          <>
            <BestTimeBadge hourlyForecast={forecast} bestTimeLabel={bestTime} />
            <ForecastChart hourlyForecast={forecast} targetDate={selectedDate} />
            <HistoricalComparison
              todayForecast={forecast.map((h) => h.predictedCustomers)}
              lastWeekHistory={trafficHistory}
            />
          </>
        )}

        <QueueDisplay branchId={branch.id} onStatusChange={setQueueStatus} />
        <CheckInButton branchId={branch.id} onCheckIn={handleCheckIn} />

        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-xs">
            <Bot className="w-3.5 h-3.5" />
            <span>Dự báo bởi <strong>Qwen AI</strong> + Alibaba Cloud</span>
          </div>
        </div>
      </main>

      <NotificationPanel
        branchId={branch.id}
        currentWaitTime={liveWaitTime}
        congestionLevel={liveCongestionLevel}
      />
    </div>
  );
}
