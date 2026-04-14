import { notFound } from "next/navigation";
import Link from "next/link";
import { BRANCHES, getBranchTraffic } from "@/lib/data";
import { predictTraffic } from "@/lib/qwen";
import { BranchInfoCard, BestTimeBadge, ForecastChart, CheckInButton } from "@/components";

interface PageProps {
  params: { id: string };
}

export default async function BranchDetailPage({ params }: PageProps) {
  const branch = BRANCHES.find((b) => b.id === params.id);

  if (!branch) {
    notFound();
  }

  const trafficHistory = getBranchTraffic(branch.id, 7);
  const today = new Date().toISOString().split("T")[0];

  let prediction;
  let error: string | null = null;

  try {
    prediction = await predictTraffic({
      branchId: branch.id,
      branchName: branch.name,
      district: branch.district,
      history: trafficHistory,
      targetDate: today,
      currentCheckIns: 0,
    });
  } catch (err) {
    error = err instanceof Error ? err.message : "Prediction failed";
    console.error("Prediction error:", error);
  }

  const hourlyForecast = prediction?.hourly || [];

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

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
            <p className="font-semibold">Lỗi dự báo Qwen AI</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {prediction && (
          <>
            {prediction.summary && (
              <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-xl p-4 mb-6">
                <p className="font-semibold">Phân tích Qwen AI</p>
                <p className="text-sm mt-1">{prediction.summary}</p>
              </div>
            )}

            <BestTimeBadge hourlyForecast={hourlyForecast} bestTimeLabel={prediction.bestTimeToVisit} />
            <ForecastChart hourlyForecast={hourlyForecast} targetDate={today} />
          </>
        )}

        <CheckInButton branchId={branch.id} />

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
