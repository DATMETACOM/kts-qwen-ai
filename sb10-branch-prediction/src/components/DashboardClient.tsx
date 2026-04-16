"use client";

import { useState, useMemo } from "react";
import { Search, Building2, Filter, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BranchCard } from "@/components/BranchCard";
import { Branch } from "@/lib/data";

type SortKey = "name" | "waitTime" | "staff";
type FilterLevel = "all" | "low" | "medium" | "high";

interface DashboardClientProps {
  branches: Branch[];
}

export function DashboardClient({ branches }: DashboardClientProps) {
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState<FilterLevel>("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");

  const cycleSortKey = () => {
    setSortKey((current) => {
      if (current === "name") return "waitTime";
      if (current === "waitTime") return "staff";
      return "name";
    });
  };

  const sortLabel =
    sortKey === "waitTime" ? "Chờ ↓" : sortKey === "staff" ? "NV ↓" : "Tên A-Z";

  const filtered = useMemo(() => {
    let result = [...branches];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.address.toLowerCase().includes(q) ||
          b.district.toLowerCase().includes(q)
      );
    }

    if (filterLevel !== "all") {
      result = result.filter((b) => b.congestionLevel === filterLevel);
    }

    result.sort((a, b) => {
      if (sortKey === "name") return a.name.localeCompare(b.name);
      if (sortKey === "waitTime") return (b.currentWaitTime || 0) - (a.currentWaitTime || 0);
      return b.staffCount - a.staffCount;
    });

    return result;
  }, [branches, search, filterLevel, sortKey]);

  const counts = useMemo(() => ({
    all: branches.length,
    low: branches.filter((b) => b.congestionLevel === "low").length,
    medium: branches.filter((b) => b.congestionLevel === "medium").length,
    high: branches.filter((b) => b.congestionLevel === "high").length,
  }), [branches]);

  const filterBtnClass = (level: FilterLevel, active: boolean) => {
    if (!active) return "border-gray-200 text-gray-600 hover:bg-gray-50";
    if (level === "low") return "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600";
    if (level === "medium") return "bg-amber-600 hover:bg-amber-700 text-white border-amber-600";
    if (level === "high") return "bg-red-600 hover:bg-red-700 text-white border-red-600";
    return "bg-blue-600 hover:bg-blue-700 text-white border-blue-600";
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 sm:p-4 mb-5">
        <div className="flex flex-col gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Tìm chi nhánh..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            {(["all", "low", "medium", "high"] as const).map((level) => (
              <Button
                key={level}
                size="sm"
                variant="outline"
                onClick={() => setFilterLevel(level)}
                className={`h-8 text-xs rounded-lg shrink-0 ${filterBtnClass(level, filterLevel === level)}`}
              >
                {level === "all" ? "Tất cả" : level === "low" ? "Thấp" : level === "medium" ? "TB" : "Cao"}
                <span className="ml-1 opacity-70">({counts[level]})</span>
              </Button>
            ))}
            <div className="ml-auto shrink-0">
              <Button
                size="sm"
                variant="ghost"
                onClick={cycleSortKey}
                className="h-8 text-xs"
              >
                <ArrowUpDown className="w-3.5 h-3.5 mr-1" />
                {sortLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Building2 className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Không tìm thấy chi nhánh phù hợp</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((branch, i) => (
            <div key={branch.id} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
              <BranchCard branch={branch} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
