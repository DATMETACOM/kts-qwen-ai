// SB10 - Mock Data Generator

import type { Branch, TrafficRecord, HourlyForecast } from "../types/index.ts";
import { formatLocalDate, parseDateOnly } from "./date.ts";

// 5 Branches in HCMC
export const BRANCHES: Branch[] = [
  {
    id: "bn-001",
    name: "Chi nhánh Quận Tân Bình",
    address: "135 Nguyễn Thái Học, P.4, Q.Tân Bình",
    district: "TanBinh",
    openTime: "08:00",
    closeTime: "17:00",
    staffCount: 8,
    services: ["Tiền gửi", "Tín dụng", "Thẻ", "Chuyển tiền"],
    status: "open",
    currentWaitTime: 12,
    congestionLevel: "low"
  },
  {
    id: "bn-002",
    name: "Chi nhánh Quận 1",
    address: "45 Lê Lợi, P.Bến Nghé, Q.1",
    district: "Quan1",
    openTime: "08:00",
    closeTime: "17:30",
    staffCount: 12,
    services: ["Tiền gửi", "Tín dụng", "Thẻ", "Chuyển tiền", "Ngoại hối"],
    status: "open",
    currentWaitTime: 28,
    congestionLevel: "high"
  },
  {
    id: "bn-003",
    name: "Chi nhánh Quận 3",
    address: "56 Nguyễn Đình Chiểu, P.6, Q.3",
    district: "Quan3",
    openTime: "08:00",
    closeTime: "17:00",
    staffCount: 6,
    services: ["Tiền gửi", "Tín dụng", "Thẻ"],
    status: "open",
    currentWaitTime: 8,
    congestionLevel: "low"
  },
  {
    id: "bn-004",
    name: "Chi nhánh Bình Thạnh",
    address: "78 Đinh Tiên Hoàng, P.1, Q.Bình Thạnh",
    district: "BinhThanh",
    openTime: "07:30",
    closeTime: "16:30",
    staffCount: 7,
    services: ["Tiền gửi", "Tín dụng", "Chuyển tiền"],
    status: "open",
    currentWaitTime: 18,
    congestionLevel: "medium"
  },
  {
    id: "bn-005",
    name: "Chi nhánh Gò Vấp",
    address: "234 Phan Văn Trị, P.7, Q.Gò Vấp",
    district: "GoVap",
    openTime: "08:00",
    closeTime: "17:00",
    staffCount: 5,
    services: ["Tiền gửi", "Tín dụng", "Thẻ"],
    status: "open",
    currentWaitTime: 5,
    congestionLevel: "low"
  }
];

function createSeed(...parts: Array<string | number>): number {
  return parts
    .join("|")
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Generate 30 days of traffic data for each branch
export function generateTrafficData(): TrafficRecord[] {
  const records: TrafficRecord[] = [];
  const today = new Date();

  for (const branch of BRANCHES) {
    for (let day = 30; day >= 0; day--) {
      const date = new Date(today);
      date.setDate(date.getDate() - day);
      const dateStr = formatLocalDate(date);
      const dayOfWeek = date.getDay();

      // Lunch rush pattern (11-13h) and end of month
      const isEndOfMonth = date.getDate() >= 25;
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      for (let hour = 8; hour < 17; hour++) {
        let baseCustomers = isWeekend ? 3 : 5;

        // Lunch rush
        if (hour >= 11 && hour <= 13) {
          baseCustomers += isWeekend ? 5 : 15;
        }

        // End of month spike
        if (isEndOfMonth) {
          baseCustomers += 8;
        }

        const rand = seededRandom(createSeed(branch.id, dateStr, hour));
        const customers = baseCustomers + Math.floor(rand() * 5);
        const waitTime = Math.max(2, Math.floor(customers * 1.5));
        const serviceCount = Math.min(
          branch.services.length,
          Math.max(1, Math.floor(rand() * branch.services.length) + 1)
        );

        records.push({
          id: `tr-${branch.id}-${dateStr}-${hour}`,
          branchId: branch.id,
          date: dateStr,
          hour,
          dayOfWeek,
          customerCount: customers,
          avgWaitTime: waitTime,
          serviceTypes: branch.services.slice(0, serviceCount),
          staffOnDuty: branch.staffCount
        });
      }
    }
  }

  return records;
}

// Pre-generated data for PoC
export const TRAFFIC_DATA = generateTrafficData();

// Get traffic history for a branch
export function getBranchTraffic(branchId: string, days = 7): TrafficRecord[] {
  return TRAFFIC_DATA.filter(
    (r) => r.branchId === branchId && new Date(r.date) >= new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  );
}

// Get today's traffic so far
export function getTodayTraffic(branchId: string): TrafficRecord[] {
  const today = formatLocalDate(new Date());
  return TRAFFIC_DATA.filter((r) => r.branchId === branchId && r.date === today);
}

// Simulate real-time check-ins
export const SIMULATED_CHECK_INS = [
  { branchId: "bn-001", count: 2 },
  { branchId: "bn-002", count: 5 },
  { branchId: "bn-003", count: 1 },
  { branchId: "bn-004", count: 3 },
  { branchId: "bn-005", count: 0 }
];

export function generateHourlyForecast(branchId?: string, targetDate?: string): HourlyForecast[] {
  const today = targetDate || formatLocalDate(new Date());
  const seedBase = branchId ? createSeed(branchId, today) : 42;
  const rand = seededRandom(seedBase);
  const dateObj = parseDateOnly(today);
  const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
  const isEndOfMonth = dateObj.getDate() >= 25;

  const forecast: HourlyForecast[] = [];
  for (let hour = 8; hour < 17; hour++) {
    let customers = isWeekend ? 3 : 5;

    if (hour >= 11 && hour <= 13) {
      customers += isWeekend ? 8 : 20;
    }

    if (isEndOfMonth) {
      customers += 5;
    }

    if (hour >= 14 && hour <= 15) {
      customers = Math.max(5, customers - 8);
    }

    customers += Math.floor(rand() * 5);
    const waitTime = Math.max(5, Math.floor(customers * 1.3));

    forecast.push({
      hour,
      predictedCustomers: customers,
      predictedWaitTime: waitTime,
      congestionLevel: waitTime > 20 ? "high" : waitTime > 10 ? "medium" : "low",
    });
  }
  return forecast;
}

// Re-export types for convenience
export type { HourlyForecast, Prediction, Branch, TrafficRecord, CheckIn, QwenPredictionRequest, QueueStatus } from "../types/index.ts";
