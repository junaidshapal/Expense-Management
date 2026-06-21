"use client";

import { Expense, AppSettings } from "@/lib/types";
import { calculateSummary } from "@/lib/calculations";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, ArrowRightLeft, CheckCircle2, AlertCircle, Wallet, Receipt } from "lucide-react";

interface SummaryCardsProps {
  expenses: Expense[];
  settings: AppSettings;
}

export default function SummaryCards({ expenses, settings }: SummaryCardsProps) {
  const summary = calculateSummary(expenses, settings);

  return (
    <div className="space-y-3">
      {/* Hero settlement banner */}
      <div className={`relative overflow-hidden rounded-2xl p-5 shadow-lg ${
        summary.isSettled
          ? "bg-gradient-to-br from-green-500 via-green-600 to-emerald-700"
          : "bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600"
      } text-white`}>
        {/* Shimmer overlay */}
        <div className="absolute inset-0 shimmer pointer-events-none" />
        {/* Decorative circles */}
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 -right-2 w-20 h-20 rounded-full bg-white/8" />

        <div className="relative flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm shrink-0">
            {summary.isSettled
              ? <CheckCircle2 className="h-6 w-6 text-white" />
              : <AlertCircle className="h-6 w-6 text-white" />
            }
          </div>
          <div>
            {summary.isSettled ? (
              <>
                <p className="font-bold text-xl leading-tight">All Settled!</p>
                <p className="text-white/75 text-sm mt-0.5">No outstanding balance</p>
              </>
            ) : (
              <>
                <p className="text-white/80 text-xs font-medium uppercase tracking-wide mb-0.5">Amount Owed</p>
                <p className="font-bold text-3xl leading-tight tracking-tight">{formatCurrency(summary.amountOwed)}</p>
                <p className="text-white/80 text-sm mt-0.5">
                  <span className="font-semibold text-white">
                    {summary.debtor === "personA" ? settings.personAName : settings.personBName}
                  </span>
                  {" "}owes{" "}
                  <span className="font-semibold text-white">
                    {summary.creditor === "personA" ? settings.personAName : settings.personBName}
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        {/* Total expenses */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shadow-sm">
                <TrendingUp className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">Total Expenses</p>
                <p className="text-2xl font-extrabold text-gray-900 tracking-tight">{formatCurrency(summary.total)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 font-medium">Each share</p>
              <p className="text-base font-bold text-green-700">{formatCurrency(summary.sharePerPerson)}</p>
              <div className="flex items-center gap-1 justify-end mt-1">
                <Receipt className="h-3 w-3 text-gray-300" />
                <p className="text-[10px] text-gray-400">{expenses.length} expense{expenses.length !== 1 ? "s" : ""}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Person A card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-green-200">
              {settings.personAName.charAt(0).toUpperCase()}
            </div>
            <p className="text-sm font-semibold text-gray-700 truncate">{settings.personAName}</p>
          </div>
          <p className="text-xl font-extrabold text-gray-900 tracking-tight">{formatCurrency(summary.personAPaid)}</p>
          <div className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
            summary.personABalance >= 0
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-600"
          }`}>
            {summary.personABalance >= 0
              ? `+${formatCurrency(summary.personABalance)}`
              : `-${formatCurrency(Math.abs(summary.personABalance))}`
            }
          </div>
        </div>

        {/* Person B card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-emerald-200">
              {settings.personBName.charAt(0).toUpperCase()}
            </div>
            <p className="text-sm font-semibold text-gray-700 truncate">{settings.personBName}</p>
          </div>
          <p className="text-xl font-extrabold text-gray-900 tracking-tight">{formatCurrency(summary.personBPaid)}</p>
          <div className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
            summary.personBBalance >= 0
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-600"
          }`}>
            {summary.personBBalance >= 0
              ? `+${formatCurrency(summary.personBBalance)}`
              : `-${formatCurrency(Math.abs(summary.personBBalance))}`
            }
          </div>
        </div>
      </div>

      {/* Split visual */}
      {summary.total > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <ArrowRightLeft className="h-4 w-4 text-green-600" />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payment Split</p>
          </div>
          <div className="flex rounded-full overflow-hidden h-3.5 bg-gray-100 shadow-inner">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 transition-all duration-700 ease-out"
              style={{ width: `${(summary.personAPaid / summary.total) * 100}%` }}
            />
            <div
              className="bg-gradient-to-r from-emerald-300 to-teal-400 transition-all duration-700 ease-out"
              style={{ width: `${(summary.personBPaid / summary.total) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="text-xs text-gray-500">{settings.personAName}</span>
              <span className="text-xs font-bold text-gray-700">({Math.round((summary.personAPaid / summary.total) * 100)}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-gray-700">({Math.round((summary.personBPaid / summary.total) * 100)}%)</span>
              <span className="text-xs text-gray-500">{settings.personBName}</span>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>
          </div>
        </div>
      )}

      {expenses.length === 0 && (
        <div className="text-center py-14">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Wallet className="h-10 w-10 text-green-300" />
          </div>
          <p className="font-bold text-gray-700 text-base">No expenses yet</p>
          <p className="text-sm text-gray-400 mt-1">Tap <span className="text-green-600 font-semibold">Add</span> to record your first expense</p>
        </div>
      )}
    </div>
  );
}
