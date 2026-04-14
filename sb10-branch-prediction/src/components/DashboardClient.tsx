"use client";

import { useState, useMemo } from "react";
import { Search, Building2, Filter, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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

  return (
    <>
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm chi nhánh theo tên, địa chỉ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <Button
                size="sm"
                variant={filterLevel === "all" ? "default" : "outline"}
                onClick={() => setFilterLevel("all")}
              >
                Tất cả ({counts.all})
              </Button>
              <Button
                size="sm"
                variant={filterLevel === "low" ? "default" : "outline"}
                onClick={() => setFilterLevel("low")}
                className={filterLevel === "low" ? "bg-green-600 hover:bg-green-700" : ""}
              >
                Thấp ({counts.low})
              </Button>
              <Button
                size="sm"
                variant={filterLevel === "medium" ? "default" : "outline"}
                onClick={() => setFilterLevel("medium")}
                className={filterLevel === "medium" ? "bg-yellow-600 hover:bg-yellow-700" : ""}
              >
                TB ({counts.medium})
              </Button>
              <Button
                size="sm"
                variant={filterLevel === "high" ? "default" : "outline"}
                onClick={() => setFilterLevel("high")}
                className={filterLevel === "high" ? "bg-red-600 hover:bg-red-700" : ""}
              >
                Cao ({counts.high})
              </Button>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSortKey(sortKey === "waitTime" ? "name" : "waitTime")}
            >
              <ArrowUpDown className="w-4 h-4 mr-1" />
              {sortKey === "waitTime" ? "Chờ ↓" : sortKey === "staff" ? "NV ↓" : "Tên A-Z"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Không tìm thấy chi nhánh phù hợp</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((branch) => (
            <BranchCard key={branch.id} branch={branch} />
          ))}
        </div>
      )}
    </>
  );
}
