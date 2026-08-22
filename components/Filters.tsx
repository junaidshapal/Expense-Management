"use client";

import { ExpenseFilters, ExpenseCategory, AppSettings } from "@/lib/types";
import { CATEGORIES } from "@/lib/categories";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FiltersProps {
  filters: ExpenseFilters;
  settings: AppSettings;
  onChange: (filters: ExpenseFilters) => void;
}

const fieldClass =
  "w-full h-9 min-w-0 px-2.5 rounded-md border border-gray-200 text-xs outline-none bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/15 transition-colors text-gray-700";
const fieldLabelClass = "block text-[11px] font-medium text-gray-500 mb-1";

export default function Filters({ filters, settings, onChange }: FiltersProps) {
  const hasFilters =
    filters.startDate ||
    filters.endDate ||
    (filters.category && filters.category !== "All") ||
    (filters.paidBy && filters.paidBy !== "All");

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3.5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-3.5 w-3.5 text-gray-400" strokeWidth={2} />
          <p className="text-sm font-medium text-gray-900">Filters</p>
        </div>
        {hasFilters && (
          <button
            onClick={() => onChange({ category: "All", paidBy: "All", settledStatus: filters.settledStatus })}
            className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-red-600 transition-colors px-1.5 py-1 rounded-md hover:bg-red-50"
          >
            <X className="h-3 w-3" strokeWidth={2} />
            Clear
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-2.5">
        <div className="min-w-0">
          <p className={fieldLabelClass}>From</p>
          <input
            type="date"
            className={fieldClass}
            value={filters.startDate || ""}
            onChange={(e) => onChange({ ...filters, startDate: e.target.value || undefined })}
          />
        </div>
        <div className="min-w-0">
          <p className={fieldLabelClass}>To</p>
          <input
            type="date"
            className={fieldClass}
            value={filters.endDate || ""}
            onChange={(e) => onChange({ ...filters, endDate: e.target.value || undefined })}
          />
        </div>

        <div className="min-w-0">
          <p className={fieldLabelClass}>Category</p>
          <select
            className={cn(fieldClass, "cursor-pointer")}
            value={filters.category || "All"}
            onChange={(e) => onChange({ ...filters, category: e.target.value as ExpenseCategory | "All" })}
          >
            <option value="All">All</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="min-w-0">
          <p className={fieldLabelClass}>Paid By</p>
          <select
            className={cn(fieldClass, "cursor-pointer")}
            value={filters.paidBy || "All"}
            onChange={(e) => onChange({ ...filters, paidBy: e.target.value as "personA" | "personB" | "All" })}
          >
            <option value="All">All</option>
            <option value="personA">{settings.personAName}</option>
            <option value="personB">{settings.personBName}</option>
          </select>
        </div>
      </div>

      {hasFilters && (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {filters.category && filters.category !== "All" && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
              {filters.category}
            </span>
          )}
          {filters.paidBy && filters.paidBy !== "All" && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
              {filters.paidBy === "personA" ? settings.personAName : settings.personBName}
            </span>
          )}
          {filters.startDate && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
              From {filters.startDate}
            </span>
          )}
          {filters.endDate && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
              To {filters.endDate}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
