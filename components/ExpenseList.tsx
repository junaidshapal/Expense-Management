"use client";

import { useState } from "react";
import { Expense, AppSettings, ExpenseFilters } from "@/lib/types";
import { filterExpenses } from "@/lib/calculations";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Food:      { bg: "bg-orange-50",  text: "text-orange-700", border: "border-orange-100" },
  Drinks:    { bg: "bg-blue-50",    text: "text-blue-700",   border: "border-blue-100" },
  Grocery:   { bg: "bg-green-50",   text: "text-green-700",  border: "border-green-100" },
  Hostel:    { bg: "bg-purple-50",  text: "text-purple-700", border: "border-purple-100" },
  Transport: { bg: "bg-yellow-50",  text: "text-yellow-700", border: "border-yellow-100" },
  Other:     { bg: "bg-gray-50",    text: "text-gray-600",   border: "border-gray-100" },
};

const CATEGORY_ICONS: Record<string, string> = {
  Food: "🍽️", Drinks: "🥤", Grocery: "🛒", Hostel: "🏠", Transport: "🚗", Other: "📦",
};

interface ExpenseListProps {
  expenses: Expense[];
  settings: AppSettings;
  filters: ExpenseFilters;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export default function ExpenseList({ expenses, settings, filters, onEdit, onDelete }: ExpenseListProps) {
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const filtered = filterExpenses(expenses, filters);
  const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date));

  if (sorted.length === 0) {
    return (
      <div className="text-center py-14">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center mx-auto mb-3 shadow-inner">
          <span className="text-3xl">🔍</span>
        </div>
        <p className="font-bold text-gray-700">No expenses found</p>
        <p className="text-sm text-gray-400 mt-1">
          {expenses.length === 0 ? "Add your first expense to get started" : "Try adjusting your filters"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
        {sorted.length} expense{sorted.length !== 1 ? "s" : ""}
        {expenses.length !== sorted.length && ` · filtered from ${expenses.length}`}
      </p>

      {sorted.map((expense) => {
        const color = CATEGORY_COLORS[expense.category];
        const isConfirming = confirmId === expense.id;

        return (
          <div key={expense.id} className="bg-white rounded-2xl border border-gray-100/80 shadow-sm overflow-hidden transition-all duration-150 hover:shadow-md hover:border-green-100">
            {isConfirming ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
                <p className="text-sm font-bold text-red-800 mb-0.5">Delete this expense?</p>
                <p className="text-xs text-red-500 mb-3">
                  &ldquo;{expense.title}&rdquo; &mdash; {formatCurrency(expense.amount)}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => { onDelete(expense.id); setConfirmId(null); }}
                    className="flex-1 h-9 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold transition-all"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setConfirmId(null)}
                    className="flex-1 h-9 rounded-xl border border-gray-200 bg-white text-gray-600 text-xs font-semibold hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3.5">
                <div className="flex items-start gap-3">
                  {/* Category icon */}
                  <div className={`w-10 h-10 rounded-xl ${color.bg} border ${color.border} flex items-center justify-center shrink-0 text-lg`}>
                    {CATEGORY_ICONS[expense.category]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-gray-900 truncate leading-tight">{expense.title}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5 font-medium">{formatDate(expense.date)}</p>
                      </div>
                      <p className="font-extrabold text-sm text-gray-900 shrink-0 tracking-tight">{formatCurrency(expense.amount)}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${color.bg} ${color.border} ${color.text}`}>
                          {expense.category}
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">
                          {expense.paidBy === "personA" ? settings.personAName : settings.personBName}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onEdit(expense)}
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-50 active:scale-90 transition-all"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setConfirmId(expense.id)}
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 active:scale-90 transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {expense.notes && (
                      <p className="text-[11px] text-gray-400 italic mt-2 pt-2 border-t border-gray-50 leading-relaxed">
                        {expense.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
