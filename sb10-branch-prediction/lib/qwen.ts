// SB10 - Qwen API Client

import { QwenPredictionRequest, HourlyForecast } from "../types";
import { generateHourlyForecast } from "./data";

// Qwen API endpoint for DashScope INTL
const QWEN_API_URL = "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/text-generation/generation";

export interface QwenPredictionResponse {
  hourly: HourlyForecast[];
  bestTimeToVisit: string;
  summary: string;
}

/**
 * Call Qwen API to predict branch traffic
 */
export async function predictTraffic(
  request: QwenPredictionRequest
): Promise<QwenPredictionResponse> {
  const apiKey = process.env.QWEN_API_KEY || "";

  if (!apiKey) {
    return buildFallbackPrediction(request, "QWEN_API_KEY is not configured");
  }

  try {
    const response = await fetch(QWEN_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "qwen-plus",
        input: {
          messages: [
            {
              role: "system",
              content: "You are a bank branch traffic analyst. Predict customer traffic and wait times based on historical data. You MUST respond with valid JSON only, no markdown, no explanation outside JSON."
            },
            {
              role: "user",
              content: buildPredictionPrompt(request)
            }
          ]
        },
        parameters: {
          result_format: "message",
          max_tokens: 2000
        }
      })
    });

    if (!response.ok) {
      const errBody = await response.text().catch(() => "");
      throw new Error(`Qwen API error ${response.status}: ${errBody}`);
    }

    const data = await response.json();
    const content = data.output?.choices?.[0]?.message?.content || "";

    if (!content) {
      throw new Error("Qwen API returned empty response");
    }

    return parsePredictionResponse(content);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Qwen prediction failed";
    return buildFallbackPrediction(request, message);
  }
}

/**
 * Build prediction prompt for Qwen
 */
function buildPredictionPrompt(request: QwenPredictionRequest): string {
  const { branchName, district, history, targetDate, currentCheckIns = 0 } = request;

  // Calculate recent averages
  const recentHistory = history.slice(-48); // Last 2 days
  const avgByHour = new Array(9).fill(0).map((_, i) => {
    const hourData = recentHistory.filter((h) => h.hour === i + 8);
    return {
      hour: i + 8,
      avgCustomers: hourData.reduce((sum, h) => sum + h.customerCount, 0) / (hourData.length || 1),
      avgWaitTime: hourData.reduce((sum, h) => sum + h.avgWaitTime, 0) / (hourData.length || 1)
    };
  });

  let prompt = `Analyze traffic for ${branchName} branch in ${district} district.\n\n`;
  prompt += `Target date: ${targetDate}\n`;
  prompt += `Current check-ins today: ${currentCheckIns}\n\n`;

  prompt += `Recent hourly averages (last 2 days):\n`;
  avgByHour.forEach((h) => {
    prompt += `  ${h.hour}:00 - ${h.avgCustomers.toFixed(1)} customers, ${h.avgWaitTime.toFixed(1)}min wait\n`;
  });

  prompt += `\nTraffic patterns:\n`;
  prompt += `- Lunch rush: 11:00-13:00 typically 2-3x busier\n`;
  prompt += `- End of month: 25th-30th typically higher\n`;
  prompt += `- Weekends: 30-50% less traffic\n\n`;

  prompt += `Predict for ${targetDate} (hours 8:00-16:00):\n`;
  prompt += `Return JSON format:\n`;
  prompt += `{\n`;
  prompt += `  "hourly": [\n`;
  prompt += `    {"hour": 8, "predictedCustomers": 5, "predictedWaitTime": 8, "congestionLevel": "low"},\n`;
  prompt += `    ...\n`;
  prompt += `  ],\n`;
  prompt += `  "bestTimeToVisit": "9:00 AM or 3:00 PM",\n`;
  prompt += `  "summary": "Brief analysis of the day"\n`;
  prompt += `}\n\n`;

  prompt += `Congestion levels: low (<10min wait), medium (10-20min), high (>20min)`;

  return prompt;
}

/**
 * Parse Qwen JSON response
 */
function parsePredictionResponse(content: string): QwenPredictionResponse {
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`Failed to extract JSON from Qwen response: ${content.substring(0, 200)}`);
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    if (!parsed.hourly || !Array.isArray(parsed.hourly) || parsed.hourly.length === 0) {
      throw new Error("Qwen response missing hourly array");
    }
    return parsed;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON from Qwen: ${jsonMatch[0].substring(0, 300)}`);
    }
    throw error;
  }
}

function buildFallbackPrediction(
  request: QwenPredictionRequest,
  reason: string
): QwenPredictionResponse {
  const hourly: HourlyForecast[] = generateHourlyForecast(request.branchId, request.targetDate)
    .map((item) => ({
      ...item,
      predictedCustomers: item.predictedCustomers + Math.min(request.currentCheckIns || 0, 6),
      predictedWaitTime: item.predictedWaitTime + Math.min((request.currentCheckIns || 0) * 2, 12),
    }))
    .map((item) => ({
      ...item,
      congestionLevel: (
        item.predictedWaitTime > 20 ? "high" : item.predictedWaitTime > 10 ? "medium" : "low"
      ) as HourlyForecast["congestionLevel"],
    }));

  const bestHour = hourly
    .filter((slot) => slot.hour >= 9 && slot.hour <= 16)
    .reduce((best, slot) => (slot.predictedWaitTime < best.predictedWaitTime ? slot : best), hourly[0]);

  return {
    hourly,
    bestTimeToVisit: `${bestHour.hour}:00 - ${bestHour.hour + 1}:00`,
    summary: `Fallback deterministic forecast đang được dùng do Qwen chưa phản hồi ổn định: ${reason}.`,
  };
}

/**
 * Get traffic description in Vietnamese
 */
export interface StaffOptimization {
  hourlyRecommendations: {
    hour: number;
    recommendedStaff: number;
    currentStaff: number;
    reason: string;
  }[];
  totalAdditionalStaff: number;
  summary: string;
}

export async function optimizeStaff(
  branchName: string,
  currentStaff: number,
  forecast: HourlyForecast[]
): Promise<StaffOptimization> {
  const apiKey = process.env.QWEN_API_KEY || "";
  if (!apiKey) {
    return buildFallbackStaffOptimization(branchName, currentStaff, forecast, "QWEN_API_KEY is not configured");
  }

  const forecastSummary = forecast.map(
    (h) => `${h.hour}:00 - ${h.predictedCustomers} khách, ${h.predictedWaitTime} phút chờ (${h.congestionLevel})`
  ).join("\n");

  const prompt = `Bạn là chuyên gia tối ưu nhân sự ngân hàng.

Chi nhánh: ${branchName}
Số nhân viên hiện tại: ${currentStaff}
Mỗi nhân viên phục vụ ~2 khách/giờ.

Dự báo lưu lượng ngày mai:
${forecastSummary}

Mục tiêu: thời gian chờ < 15 phút.

Trả về JSON:
{
  "hourlyRecommendations": [
    {"hour": 8, "recommendedStaff": 3, "currentStaff": ${currentStaff}, "reason": "..."},
    ...
  ],
  "totalAdditionalStaff": 2,
  "summary": "Tóm tắt ngắn bằng tiếng Việt"
}`;

  try {
    const response = await fetch(QWEN_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "qwen-plus",
        input: {
          messages: [
            {
              role: "system",
              content: "You are a bank staff optimization expert. Respond with valid JSON only."
            },
            { role: "user", content: prompt }
          ]
        },
        parameters: { result_format: "message", max_tokens: 2000 }
      })
    });

    if (!response.ok) {
      throw new Error(`Qwen API error ${response.status}`);
    }

    const data = await response.json();
    const content = data.output?.choices?.[0]?.message?.content || "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse staff optimization response");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Staff optimization failed";
    return buildFallbackStaffOptimization(branchName, currentStaff, forecast, message);
  }
}

function buildFallbackStaffOptimization(
  branchName: string,
  currentStaff: number,
  forecast: HourlyForecast[],
  reason: string
): StaffOptimization {
  const hourlyRecommendations = forecast.map((slot) => {
    const demandStaff = Math.max(currentStaff, Math.ceil(slot.predictedCustomers / 8));
    return {
      hour: slot.hour,
      currentStaff,
      recommendedStaff: demandStaff,
      reason:
        slot.congestionLevel === "high"
          ? "Khung giờ cao điểm, cần tăng thêm nhân sự để giữ thời gian chờ dưới ngưỡng."
          : slot.congestionLevel === "medium"
          ? "Lưu lượng trung bình, nên duy trì hoặc tăng nhẹ nhân sự."
          : "Lưu lượng thấp, giữ mức nhân sự hiện tại là đủ.",
    };
  });

  const totalAdditionalStaff = Math.max(
    0,
    Math.max(...hourlyRecommendations.map((slot) => slot.recommendedStaff - currentStaff))
  );

  return {
    hourlyRecommendations,
    totalAdditionalStaff,
    summary: `Fallback staff optimization cho ${branchName} được dùng do Qwen chưa khả dụng: ${reason}.`,
  };
}

export function getCongestionLabel(level: "low" | "medium" | "high"): string {
  const labels = {
    low: "Thấp - Đến ngay",
    medium: "Trung bình",
    high: "Cao - Nên tránh"
  };
  return labels[level];
}

/**
 * Get congestion color for UI
 */
export function getCongestionColor(level: "low" | "medium" | "high"): string {
  const colors = {
    low: "#22c55e", // green
    medium: "#eab308", // yellow
    high: "#ef4444" // red
  };
  return colors[level];
}
