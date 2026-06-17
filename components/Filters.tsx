"use client";

import { ExpenseFilters, ExpenseCategory, AppSettings } from "@/lib/types";
import { SlidersHorizontal, X } from "lucide-react";

const CATEGORIES: (ExpenseCategory | "All")[] = ["All", "Food", "Drinks", "Grocery", "Hostel", "Transport", "Other"];

interface FiltersProps {
  filters: ExpenseFilters;
  settings: AppSettings;
  onChange: (filters: ExpenseFilters) => void;
}

const inputClass = "w-full h-10 px-3 rounded-xl border border-gray-200 text-xs outline-none bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all";

export default function Filters({ filters, settings, onChange }: FiltersProps) {
  const hasFilters =
    filters.startDate ||
    filters.endDate ||
    (filters.category && filters.category !== "All") ||
    (filters.paidBy && filters.paidBy !== "All");

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-green-600" />
          <p className="text-sm font-semibold text-gray-700">Filters</p>
        </div>
        {hasFilters && (
          <button
            onClick={() => onChange({ category: "All", paidBy: "All" })}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            <X className="h-3 w-3" />
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">From</p>
          <input
            type="date"
            className={inputClass}
            value={filters.startDate || ""}
            onChange={(e) => onChange({ ...filters, startDate: e.target.value || undefined })}
          />
        </div>
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">To</p>
          <input
            type="date"
            className={inputClass}
            value={filters.endDate || ""}
            onChange={(e) => onChange({ ...filters, endDate: e.target.value || undefined })}
          />
        </div>

        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Category</p>
          <select
            className={`${inputClass} cursor-pointer`}
            value={filters.category || "All"}
            onChange={(e) => onChange({ ...filters, category: e.target.value as ExpenseCategory | "All" })}
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Paid By</p>
          <select
            className={`${inputClass} cursor-pointer`}
            value={filters.paidBy || "All"}
            onChange={(e) => onChange({ ...filters, paidBy: e.target.value as "personA" | "personB" | "All" })}
          >
            <option value="All">All</option>
            <option value="personA">{settings.personAName}</option>
            <option value="personB">{settings.personBName}</option>
          </select>
        </div>
      </div>
    </div>
  );
}
