"use client";

import { useState } from "react";
import { Expense, AppSettings, ExpenseFilters } from "@/lib/types";
import { filterExpenses } from "@/lib/calculations";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Food:      { bg: "bg-orange-100", text: "text-orange-700" },
  Drinks:    { bg: "bg-blue-100",   text: "text-blue-700" },
  Grocery:   { bg: "bg-green-100",  text: "text-green-700" },
  Hostel:    { bg: "bg-purple-100", text: "text-purple-700" },
  Transport: { bg: "bg-yellow-100", text: "text-yellow-700" },
  Other:     { bg: "bg-gray-100",   text: "text-gray-600" },
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
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
          <span className="text-3xl">🔍</span>
        </div>
        <p className="font-semibold text-gray-700">No expenses found</p>
        <p className="text-sm text-gray-400 mt-1">
          {expenses.length === 0 ? "Add your first expense to get started" : "Try adjusting your filters"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-400 font-medium">
        {sorted.length} expense{sorted.length !== 1 ? "s" : ""}
        {expenses.length !== sorted.length && ` (filtered from ${expenses.length})`}
      </p>

      {sorted.map((expense) => {
        const color = CATEGORY_COLORS[expense.category];
        const isConfirming = confirmId === expense.id;

        return (
          <div key={expense.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {isConfirming ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
                <p className="text-sm font-semibold text-red-800 mb-1">Delete this expense?</p>
                <p className="text-xs text-red-600 mb-3">
                  &ldquo;{expense.title}&rdquo; — {formatCurrency(expense.amount)}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => { onDelete(expense.id); setConfirmId(null); }}
                    className="flex-1 h-9 rounded-lg bg-red-600 text-white text-xs font-semibold"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setConfirmId(null)}
                    className="flex-1 h-9 rounded-lg border border-gray-200 bg-white text-gray-600 text-xs font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3.5">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${color.bg} flex items-center justify-center shrink-0 text-lg`}>
                    {CATEGORY_ICONS[expense.category]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-gray-900 truncate">{expense.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{formatDate(expense.date)}</p>
                      </div>
                      <p className="font-bold text-sm text-gray-900 shrink-0">{formatCurrency(expense.amount)}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${color.bg} ${color.text}`}>
                          {expense.category}
                        </span>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">
                          {expense.paidBy === "personA" ? settings.personAName : settings.personBName}
                        </span>
                      </div>

                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={() => onEdit(expense)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setConfirmId(expense.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {expense.notes && (
                      <p className="text-xs text-gray-400 italic mt-2 border-t border-gray-50 pt-2">
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
