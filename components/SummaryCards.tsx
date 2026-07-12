"use client";

import { Expense, AppSettings } from "@/lib/types";
import { calculateSummary } from "@/lib/calculations";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, ArrowRightLeft, CheckCircle2, AlertCircle, Wallet, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

interface SummaryCardsProps {
  expenses: Expense[];
  settings: AppSettings;
}

export default function SummaryCards({ expenses, settings }: SummaryCardsProps) {
  const summary = calculateSummary(expenses, settings);

  return (
    <div className="space-y-3">
      {/* Hero settlement banner */}
      <div
        className={cn(
          "rounded-lg border p-4",
          summary.isSettled ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-md shrink-0",
              summary.isSettled ? "bg-green-600" : "bg-amber-500"
            )}
          >
            {summary.isSettled ? (
              <CheckCircle2 className="h-5 w-5 text-white" strokeWidth={2} />
            ) : (
              <AlertCircle className="h-5 w-5 text-white" strokeWidth={2} />
            )}
          </div>
          <div className="min-w-0">
            {summary.isSettled ? (
              <>
                <p className="font-semibold text-base text-green-900 leading-tight">All settled</p>
                <p className="text-green-700/80 text-xs mt-0.5">No outstanding balance</p>
              </>
            ) : (
              <>
                <p className="text-amber-700 text-[11px] font-medium uppercase tracking-wide">Amount owed</p>
                <p className="font-semibold text-2xl text-amber-900 leading-tight tracking-tight">
                  {formatCurrency(summary.amountOwed)}
                </p>
                <p className="text-amber-700/90 text-xs mt-0.5">
                  <span className="font-semibold">
                    {summary.debtor === "personA" ? settings.personAName : settings.personBName}
                  </span>
                  {" "}owes{" "}
                  <span className="font-semibold">
                    {summary.creditor === "personA" ? settings.personAName : settings.personBName}
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Total expenses */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-md bg-green-600 flex items-center justify-center shrink-0">
              <TrendingUp className="h-4.5 w-4.5 text-white" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">Total expenses</p>
              <p className="text-xl font-semibold text-gray-900 tracking-tight">{formatCurrency(summary.total)}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[11px] text-gray-400">Each share</p>
            <p className="text-sm font-semibold text-gray-700">{formatCurrency(summary.sharePerPerson)}</p>
            <div className="flex items-center gap-1 justify-end mt-0.5">
              <Receipt className="h-3 w-3 text-gray-300" strokeWidth={2} />
              <p className="text-[11px] text-gray-400">{expenses.length} expense{expenses.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Per-person cards */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { name: settings.personAName, paid: summary.personAPaid, balance: summary.personABalance, accent: "bg-green-600" },
          { name: settings.personBName, paid: summary.personBPaid, balance: summary.personBBalance, accent: "bg-teal-600" },
        ].map(({ name, paid, balance, accent }) => (
          <div key={name} className="bg-white rounded-lg border border-gray-200 p-3.5 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-semibold shrink-0", accent)}>
                {name.charAt(0).toUpperCase()}
              </div>
              <p className="text-sm font-medium text-gray-700 truncate">{name}</p>
            </div>
            <p className="text-lg font-semibold text-gray-900 tracking-tight">{formatCurrency(paid)}</p>
            <div
              className={cn(
                "inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium",
                balance >= 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
              )}
            >
              {balance >= 0 ? `+${formatCurrency(balance)}` : `-${formatCurrency(Math.abs(balance))}`}
            </div>
          </div>
        ))}
      </div>

      {/* Split visual */}
      {summary.total > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <ArrowRightLeft className="h-3.5 w-3.5 text-gray-400" strokeWidth={2} />
            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Payment split</p>
          </div>
          <div className="flex rounded-full overflow-hidden h-2 bg-gray-100">
            <div
              className="bg-green-600 transition-all duration-500 ease-out"
              style={{ width: `${(summary.personAPaid / summary.total) * 100}%` }}
            />
            <div
              className="bg-teal-500 transition-all duration-500 ease-out"
              style={{ width: `${(summary.personBPaid / summary.total) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2.5">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-600 shrink-0" />
              <span className="text-xs text-gray-500 truncate">{settings.personAName}</span>
              <span className="text-xs font-semibold text-gray-700 shrink-0">
                ({Math.round((summary.personAPaid / summary.total) * 100)}%)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-gray-700 shrink-0">
                ({Math.round((summary.personBPaid / summary.total) * 100)}%)
              </span>
              <span className="text-xs text-gray-500 truncate">{settings.personBName}</span>
              <div className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
            </div>
          </div>
        </div>
      )}

      {expenses.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
            <Wallet className="h-6 w-6 text-green-700" strokeWidth={1.75} />
          </div>
          <p className="font-medium text-gray-700 text-sm">No expenses yet</p>
          <p className="text-xs text-gray-400 mt-1">Tap <span className="text-green-700 font-medium">Add</span> to record your first expense</p>
        </div>
      )}
    </div>
  );
}
