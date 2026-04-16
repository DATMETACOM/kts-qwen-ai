"use client";

import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DatePickerProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  const diff = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diff === 0) return "Hôm nay";
  if (diff === 1) return "Ngày mai";
  if (diff === -1) return "Hôm qua";

  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const dayLabel = days[date.getDay()];
  return `${dayLabel}, ${date.getDate()}/${date.getMonth() + 1}`;
}

export function DatePicker({ selectedDate, onDateChange }: DatePickerProps) {
  const shift = (offset: number) => {
    const current = new Date(selectedDate + "T00:00:00");
    current.setDate(current.getDate() + offset);
    const newDate = current.toISOString().split("T")[0];
    onDateChange(newDate);
  };

  return (
    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-2 shadow-sm">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => shift(-1)}
        className="h-8 w-8 p-0"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <div className="flex items-center gap-2 flex-1 justify-center">
        <Calendar className="w-3.5 h-3.5 text-gray-400" />
        <button
          onClick={() => {
            const input = document.createElement("input");
            input.type = "date";
            input.value = selectedDate;
            input.style.position = "absolute";
            input.style.opacity = "0";
            document.body.appendChild(input);
            input.addEventListener("change", () => {
              if (input.value) onDateChange(input.value);
              input.remove();
            });
            input.addEventListener("blur", () => input.remove());
            if (input.showPicker) { input.showPicker(); } else { input.click(); }
          }}
          className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
        >
          {formatDateLabel(selectedDate)}
        </button>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => shift(1)}
        className="h-8 w-8 p-0"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
