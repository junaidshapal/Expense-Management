"use client";

import { ExpenseFilters, ExpenseCategory, AppSettings } from "@/lib/types";
import { SlidersHorizontal, X } from "lucide-react";

const CATEGORIES: (ExpenseCategory | "All")[] = ["All", "Food", "Drinks", "Grocery", "Hostel", "Transport", "Other"];

interface FiltersProps {
  filters: ExpenseFilters;
  settings: AppSettings;
  onChange: (filters: ExpenseFilters) => void;
}

const inputClass = "w-full h-10 px-3 rounded-xl border border-gray-200 text-xs outline-none bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all font-medium text-gray-700";

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
          <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">
            <SlidersHorizontal className="h-3.5 w-3.5 text-green-600" />
          </div>
          <p className="text-sm font-bold text-gray-700">Filters</p>
        </div>
        {hasFilters && (
          <button
            onClick={() => onChange({ category: "All", paidBy: "All" })}
            className="flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-red-500 active:scale-95 transition-all px-2 py-1 rounded-lg hover:bg-red-50"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">From</p>
          <input
            type="date"
            className={inputClass}
            value={filters.startDate || ""}
            onChange={(e) => onChange({ ...filters, startDate: e.target.value || undefined })}
          />
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">To</p>
          <input
            type="date"
            className={inputClass}
            value={filters.endDate || ""}
            onChange={(e) => onChange({ ...filters, endDate: e.target.value || undefined })}
          />
        </div>

        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Category</p>
          <select
            className={`${inputClass} cursor-pointer`}
            value={filters.category || "All"}
            onChange={(e) => onChange({ ...filters, category: e.target.value as ExpenseCategory | "All" })}
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Paid By</p>
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

      {/* Active filter pills */}
      {hasFilters && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {filters.category && filters.category !== "All" && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">
              {filters.category}
            </span>
          )}
          {filters.paidBy && filters.paidBy !== "All" && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
              {filters.paidBy === "personA" ? settings.personAName : settings.personBName}
            </span>
          )}
          {filters.startDate && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
              From: {filters.startDate}
            </span>
          )}
          {filters.endDate && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
              To: {filters.endDate}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
