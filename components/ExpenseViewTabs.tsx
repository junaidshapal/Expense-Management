"use client";

import { SettledStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Wallet, CheckCircle2, Layers } from "lucide-react";

interface ExpenseViewTabsProps {
  value: SettledStatus;
  counts: Record<SettledStatus, number>;
  onChange: (value: SettledStatus) => void;
}

const VIEWS: { id: SettledStatus; label: string; icon: React.ElementType }[] = [
  { id: "Unsettled", label: "Active", icon: Wallet },
  { id: "Settled", label: "Settled", icon: CheckCircle2 },
  { id: "All", label: "All", icon: Layers },
];

export default function ExpenseViewTabs({ value, counts, onChange }: ExpenseViewTabsProps) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100 border border-gray-200">
      {VIEWS.map(({ id, label, icon: Icon }) => {
        const isActive = value === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            aria-pressed={isActive}
            className={cn(
              "flex-1 min-w-0 flex items-center justify-center gap-1.5 h-8 rounded-md text-xs font-medium transition-colors",
              isActive
                ? "bg-white text-green-700 shadow-sm border border-gray-200"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            <Icon
              className={cn("h-3.5 w-3.5 shrink-0 hidden min-[380px]:block", isActive && "text-green-600")}
              strokeWidth={2}
            />
            <span className="truncate">{label}</span>
            <span
              className={cn(
                "text-[10px] font-semibold px-1.5 rounded-full leading-[16px] shrink-0",
                isActive ? "bg-green-50 text-green-700" : "bg-gray-200/70 text-gray-500"
              )}
            >
              {counts[id]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
