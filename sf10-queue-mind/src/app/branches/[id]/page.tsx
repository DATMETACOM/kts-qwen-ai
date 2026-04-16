import { notFound } from "next/navigation";
import { BRANCHES, getBranchTraffic, HourlyForecast } from "@/lib/data";
import { predictTraffic } from "@/lib/qwen";
import { BranchDetailClient } from "@/components";

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

  let initialForecast: HourlyForecast[] = [];
  let initialBestTime: string | undefined;
  let initialSummary: string | undefined;
  let predictionError: string | undefined;

  try {
    const prediction = await predictTraffic({
      branchId: branch.id,
      branchName: branch.name,
      district: branch.district,
      history: trafficHistory,
      targetDate: today,
      currentCheckIns: 0,
    });
    initialForecast = prediction.hourly;
    initialBestTime = prediction.bestTimeToVisit;
    initialSummary = prediction.summary;
  } catch (err) {
    predictionError = err instanceof Error ? err.message : "Prediction failed";
    console.error("Prediction error:", predictionError);
  }

  return (
    <BranchDetailClient
      branch={branch}
      initialForecast={initialForecast}
      initialBestTime={initialBestTime}
      initialSummary={initialSummary}
      trafficHistory={trafficHistory}
      today={today}
      predictionError={predictionError}
    />
  );
}
