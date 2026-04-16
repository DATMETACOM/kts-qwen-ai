import type { QwenPredictionRequest, HourlyForecast } from "../types/index.ts";
import { generateHourlyForecast } from "./data.ts";

const QWEN_API_URL = "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/text-generation/generation";

export interface QwenPredictionResponse {
  hourly: HourlyForecast[];
  bestTimeToVisit: string;
  summary: string;
}

export async function predictTraffic(
  request: QwenPredictionRequest
): Promise<QwenPredictionResponse> {
  const apiKey = process.env.QWEN_API_KEY || "";

  if (!apiKey) {
    return buildFallbackPrediction(request, "QWEN_API_KEY chưa cấu hình");
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
              content: `Bạn là chuyên gia phân tích lưu lượng chi nhánh ngân hàng Shinhan tại TP.HCM. Bạn dự đoán số lượng khách hàng và thời gian chờ cho từng khung giờ trong ngày.

QUY TẮC:
- Luôn trả về JSON hợp lệ, không markdown, không giải thích ngoài JSON.
- Giá trị predictedCustomers là số nguyên dương.
- Giá trị predictedWaitTime là số phút chờ trung bình (số nguyên dương).
- congestionLevel: "low" nếu chờ <10p, "medium" nếu 10-20p, "high" nếu >20p.
- bestTimeToVisit: khung giờ tốt nhất bằng tiếng Việt (VD: "9:00 - 10:00").
- summary: phân tích ngắn bằng tiếng Việt (1-2 câu).`
            },
            {
              role: "user",
              content: buildPredictionPrompt(request)
            }
          ]
        },
        parameters: {
          result_format: "message",
          max_tokens: 2000,
          temperature: 0.3
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

function buildPredictionPrompt(request: QwenPredictionRequest): string {
  const { branchName, district, history, targetDate, currentCheckIns = 0 } = request;

  const targetDateObj = new Date(targetDate + "T00:00:00");
  const dayOfWeek = targetDateObj.getDay();
  const dayNames = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const isEndOfMonth = targetDateObj.getDate() >= 25;
  const isPayDay = [5, 10, 15, 20, 25].includes(targetDateObj.getDate());

  const recentHistory = history.slice(-72);
  const avgByHour: Record<number, { customers: number; waitTime: number; samples: number }> = {};
  for (let h = 8; h < 17; h++) {
    const hourData = recentHistory.filter((r) => r.hour === h);
    avgByHour[h] = {
      customers: Math.round(hourData.reduce((s, r) => s + r.customerCount, 0) / (hourData.length || 1)),
      waitTime: Math.round(hourData.reduce((s, r) => s + r.avgWaitTime, 0) / (hourData.length || 1)),
      samples: hourData.length
    };
  }

  const sameDayHistory = history.filter((r) => r.dayOfWeek === dayOfWeek);
  const sameDayAvg: Record<number, { customers: number; waitTime: number }> = {};
  for (let h = 8; h < 17; h++) {
    const hourData = sameDayHistory.filter((r) => r.hour === h);
    sameDayAvg[h] = {
      customers: Math.round(hourData.reduce((s, r) => s + r.customerCount, 0) / (hourData.length || 1)),
      waitTime: Math.round(hourData.reduce((s, r) => s + r.avgWaitTime, 0) / (hourData.length || 1)),
    };
  }

  let prompt = `DỮ LIỆU ĐẦU VÀO:\n`;
  prompt += `- Chi nhánh: ${branchName}, khu vực ${district}, TP.HCM\n`;
  prompt += `- Ngày dự báo: ${targetDate} (${dayNames[dayOfWeek]})\n`;
  prompt += `- Đặc biệt: ${isWeekend ? "Cuối tuần (giảm 30-50% khách)" : "Ngày làm việc"}${isEndOfMonth ? ", Cuối tháng (tăng 15-20%)" : ""}${isPayDay ? ", Ngày lương (tăng 10-15%)" : ""}\n`;
  prompt += `- Khách đang check-in: ${currentCheckIns}\n\n`;

  prompt += `TRUNG BÌNH GẦN ĐÂY (3 ngày):\n`;
  for (let h = 8; h < 17; h++) {
    const d = avgByHour[h];
    prompt += `  ${h}:00 → ${d.customers} khách, ~${d.waitTime} phút chờ (${d.samples} mẫu)\n`;
  }

  prompt += `\nTRUNG BÌNH CÙNG THỨ (${dayNames[dayOfWeek]}):\n`;
  for (let h = 8; h < 17; h++) {
    const d = sameDayAvg[h];
    prompt += `  ${h}:00 → ${d.customers} khách, ~${d.waitTime} phút chờ\n`;
  }

  prompt += `\nMẪU HÌNH ĐẶC BIỆT:\n`;
  prompt += `- Giờ cao điểm trưa: 11:00-13:00 (tăng 2-3 lần)\n`;
  prompt += `- Đầu giờ sáng: 8:00-9:00 (ít khách)\n`;
  prompt += `- Chiều: 14:00-16:00 (trung bình)\n`;

  prompt += `\nYÊU CẦU: Dự đoán cho ${targetDate}, khung 8:00-16:00. Trả JSON:\n`;
  prompt += `{"hourly":[{"hour":8,"predictedCustomers":5,"predictedWaitTime":8,"congestionLevel":"low"},...],"bestTimeToVisit":"9:00 - 10:00","summary":"..."}`;

  return prompt;
}

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

    parsed.hourly = parsed.hourly.map((h: Record<string, unknown>) => ({
      hour: Number(h.hour),
      predictedCustomers: Math.max(1, Math.round(Number(h.predictedCustomers || 5))),
      predictedWaitTime: Math.max(1, Math.round(Number(h.predictedWaitTime || 5))),
      congestionLevel: (["low", "medium", "high"].includes(h.congestionLevel as string)
        ? h.congestionLevel
        : Number(h.predictedWaitTime || 5) > 20 ? "high" : Number(h.predictedWaitTime || 5) > 10 ? "medium" : "low") as "low" | "medium" | "high",
    }));

    if (!parsed.summary) {
      parsed.summary = "Dự báo dựa trên phân tích mẫu hình lịch sử và dữ liệu thời gian thực.";
    }
    if (!parsed.bestTimeToVisit) {
      const lowHours = parsed.hourly.filter(
        (h: HourlyForecast) => h.congestionLevel === "low" && h.hour >= 9 && h.hour <= 16
      );
      if (lowHours.length > 0) {
        parsed.bestTimeToVisit = `${lowHours[0].hour}:00 - ${lowHours[0].hour + 1}:00`;
      }
    }

    return parsed as QwenPredictionResponse;
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
  const targetDateObj = new Date(request.targetDate + "T00:00:00");
  const dayOfWeek = targetDateObj.getDay();
  const dayNames = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

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

  const peakHours = hourly.filter((h) => h.congestionLevel === "high");
  const peakDesc = peakHours.length > 0
    ? `Khung giờ cao điểm: ${peakHours.map((h) => `${h.hour}:00`).join(", ")}.`
    : "Không có khung giờ quá tải.";

  return {
    hourly,
    bestTimeToVisit: `${bestHour.hour}:00 - ${bestHour.hour + 1}:00`,
    summary: `Dự báo ${dayNames[dayOfWeek]} ${request.targetDate} cho ${request.branchName}. ${peakDesc} Giờ vàng: ${bestHour.hour}:00 - ${bestHour.hour + 1}:00 (chờ ~${bestHour.predictedWaitTime} phút). [Dùng dữ liệu mẫu - ${reason}]`,
  };
}

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
    return buildFallbackStaffOptimization(branchName, currentStaff, forecast, "QWEN_API_KEY chưa cấu hình");
  }

  const forecastSummary = forecast.map(
    (h) => `${h.hour}:00 - ${h.predictedCustomers} khách, ${h.predictedWaitTime} phút chờ (${h.congestionLevel})`
  ).join("\n");

  const peakHours = forecast.filter((h) => h.congestionLevel === "high").map((h) => `${h.hour}:00`).join(", ");

  const prompt = `Bạn là chuyên gia tối ưu nhân sự ngân hàng Shinhan tại TP.HCM.

Chi nhánh: ${branchName}
Nhân viên hiện tại: ${currentStaff} người
Mỗi nhân viên phục vụ ~2 khách/giờ. Mục tiêu: chờ < 15 phút.

Dự báo lưu lượng ngày mai:
${forecastSummary}

Giờ cao điểm: ${peakHours || "Không có"}

Phân tích và đề xuất phân bổ nhân sự cho từng khung giờ 8:00-16:00.

Trả về JSON hợp lệ:
{
  "hourlyRecommendations": [
    {"hour": 8, "recommendedStaff": 3, "currentStaff": ${currentStaff}, "reason": "Lý do ngắn bằng tiếng Việt"},
    {"hour": 9, "recommendedStaff": 4, "currentStaff": ${currentStaff}, "reason": "..."},
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
              content: "Bạn là chuyên gia tối ưu nhân sự ngân hàng. Chỉ trả về JSON hợp lệ, không markdown, không giải thích ngoài JSON."
            },
            { role: "user", content: prompt }
          ]
        },
        parameters: { result_format: "message", max_tokens: 2000, temperature: 0.2 }
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
    summary: `Đề xuất bổ sung ${totalAdditionalStaff} nhân viên cho ${branchName} trong khung giờ cao điểm. [Dùng dữ liệu mẫu - ${reason}]`,
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

export function getCongestionColor(level: "low" | "medium" | "high"): string {
  const colors = {
    low: "#22c55e",
    medium: "#eab308",
    high: "#ef4444"
  };
  return colors[level];
}
