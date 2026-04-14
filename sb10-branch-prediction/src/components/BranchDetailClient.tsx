"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Branch, TrafficRecord, HourlyForecast } from "@/lib/data";
import { BranchInfoCard, BestTimeBadge, ForecastChart, CheckInButton, HistoricalComparison, QueueDisplay } from "@/components";

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
  const [forecast, setForecast] = useState(initialForecast);
  const [bestTime, setBestTime] = useState(initialBestTime);
  const [summary, setSummary] = useState(initialSummary);
  const [error, setError] = useState(predictionError);
  const [refreshing, setRefreshing] = useState(false);

  const refreshPrediction = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch(`/api/predict/${branch.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetDate: today, currentCheckIns: 0 }),
      });
      if (res.ok) {
        const data = await res.json();
        setForecast(data.hourly || []);
        setBestTime(data.bestTimeToVisit);
        setSummary(data.summary);
        setError(undefined);
      }
    } catch {
      // keep current data
    } finally {
      setRefreshing(false);
    }
  }, [branch.id, today]);

  const handleCheckIn = () => {
    refreshPrediction();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white py-4 shadow-lg">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-blue-200 hover:text-white mb-2 inline-block">
            ← Quay lại Dashboard
          </Link>
          <h1 className="text-xl font-bold">{branch.name}</h1>
          <p className="text-blue-200 text-sm">{branch.address}</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <BranchInfoCard branch={branch} />

        {refreshing && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl p-3 mb-4 text-sm">
            🔄 Đang cập nhật dự báo sau check-in...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
            <p className="font-semibold">Lỗi dự báo Qwen AI</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {summary && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-xl p-4 mb-6">
            <p className="font-semibold">🤖 Phân tích Qwen AI</p>
            <p className="text-sm mt-1">{summary}</p>
          </div>
        )}

        {forecast.length > 0 && (
          <>
            <BestTimeBadge hourlyForecast={forecast} bestTimeLabel={bestTime} />
            <ForecastChart hourlyForecast={forecast} targetDate={today} />
            <HistoricalComparison
              todayForecast={forecast.map((h) => h.predictedCustomers)}
              lastWeekHistory={trafficHistory}
            />
          </>
        )}

        <QueueDisplay branchId={branch.id} />
        <CheckInButton branchId={branch.id} onCheckIn={handleCheckIn} />

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm">
            <span className="text-lg">🤖</span>
            <span>Dự báo được cung cấp bởi <strong>Qwen AI</strong></span>
          </div>
        </div>
      </main>
    </div>
  );
}
