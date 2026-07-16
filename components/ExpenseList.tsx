"use client";

import { Expense, AppSettings, ExpenseFilters } from "@/lib/types";
import { filterExpenses } from "@/lib/calculations";
import { formatCurrency, formatDateWithWeekday } from "@/lib/utils";
import { CATEGORY_ICONS, CATEGORY_COLORS } from "@/lib/categories";
import { SearchX } from "lucide-react";

interface ExpenseListProps {
  expenses: Expense[];
  settings: AppSettings;
  filters: ExpenseFilters;
}

export default function ExpenseList({ expenses, settings, filters }: ExpenseListProps) {
  const filtered = filterExpenses(expenses, filters);
  const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date));

  if (sorted.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
          <SearchX className="h-5 w-5 text-green-700" strokeWidth={1.75} />
        </div>
        <p className="font-medium text-gray-700 text-sm">No expenses found</p>
        <p className="text-xs text-gray-400 mt-1">
          {expenses.length === 0 ? "Add your first expense to get started" : "Try adjusting your filters"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide px-0.5">
        {sorted.length} expense{sorted.length !== 1 ? "s" : ""}
        {expenses.length !== sorted.length && ` · filtered from ${expenses.length}`}
      </p>

      {sorted.map((expense) => {
        const color = CATEGORY_COLORS[expense.category];
        const CategoryIcon = CATEGORY_ICONS[expense.category];
        const isSettled = expense.settled;

        return (
          <div key={expense.id} className="bg-white rounded-lg border border-gray-200 p-3.5 transition-colors hover:border-green-300">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-md bg-green-600 flex items-center justify-center shrink-0">
                <CategoryIcon className="h-4 w-4 text-white" strokeWidth={2} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate leading-tight">{expense.title}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{formatDateWithWeekday(expense.date)}</p>
                  </div>
                  <p className="font-semibold text-sm text-gray-900 shrink-0 tracking-tight">{formatCurrency(expense.amount)}</p>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap mt-2">
                  <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded border ${color.bg} ${color.border} ${color.text}`}>
                    {expense.category}
                  </span>
                  <span className="text-[11px] font-medium px-1.5 py-0.5 rounded border border-gray-200 bg-gray-50 text-gray-600">
                    {expense.paidBy === "personA" ? settings.personAName : settings.personBName}
                  </span>
                  {isSettled && (
                    <span className="text-[11px] font-medium px-1.5 py-0.5 rounded border border-violet-200 bg-violet-50 text-violet-700">
                      Settled
                    </span>
                  )}
                </div>

                {expense.notes && (
                  <p className="text-[11px] text-gray-400 mt-2 pt-2 border-t border-gray-100 leading-relaxed">
                    {expense.notes}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
