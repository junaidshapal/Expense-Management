"use client";

import { Expense, AppSettings } from "@/lib/types";
import { calculateSummary } from "@/lib/calculations";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, Users, ArrowRightLeft, CheckCircle2, AlertCircle, Wallet } from "lucide-react";

interface SummaryCardsProps {
  expenses: Expense[];
  settings: AppSettings;
}

export default function SummaryCards({ expenses, settings }: SummaryCardsProps) {
  const summary = calculateSummary(expenses, settings);

  return (
    <div className="space-y-4">
      {/* Hero settlement banner */}
      <div className={`rounded-2xl p-5 ${
        summary.isSettled
          ? "bg-gradient-to-br from-green-500 to-green-600"
          : "bg-gradient-to-br from-amber-500 to-orange-500"
      } text-white shadow-lg`}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-full bg-white/20">
            {summary.isSettled
              ? <CheckCircle2 className="h-6 w-6 text-white" />
              : <AlertCircle className="h-6 w-6 text-white" />
            }
          </div>
          <div>
            {summary.isSettled ? (
              <>
                <p className="font-bold text-lg leading-tight">All Settled! ✅</p>
                <p className="text-white/80 text-sm">No outstanding balance</p>
              </>
            ) : (
              <>
                <p className="text-white/80 text-sm font-medium">
                  {summary.debtor === "personA" ? settings.personAName : settings.personBName}
                  {" "}owes{" "}
                  {summary.creditor === "personA" ? settings.personAName : settings.personBName}
                </p>
                <p className="font-bold text-2xl leading-tight">{formatCurrency(summary.amountOwed)}</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Total expenses */}
      <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-700" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.total)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Each share</p>
            <p className="text-sm font-semibold text-green-700">{formatCurrency(summary.sharePerPerson)}</p>
          </div>
        </div>
      </div>

      {/* Person cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold">
              {settings.personAName.charAt(0).toUpperCase()}
            </div>
            <p className="text-sm font-semibold text-gray-700 truncate">{settings.personAName}</p>
          </div>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(summary.personAPaid)}</p>
          <p className={`text-xs mt-1 font-medium ${
            summary.personABalance >= 0 ? "text-green-600" : "text-red-500"
          }`}>
            {summary.personABalance >= 0
              ? `+${formatCurrency(summary.personABalance)} ahead`
              : `${formatCurrency(Math.abs(summary.personABalance))} short`
            }
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center text-white text-xs font-bold">
              {settings.personBName.charAt(0).toUpperCase()}
            </div>
            <p className="text-sm font-semibold text-gray-700 truncate">{settings.personBName}</p>
          </div>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(summary.personBPaid)}</p>
          <p className={`text-xs mt-1 font-medium ${
            summary.personBBalance >= 0 ? "text-green-600" : "text-red-500"
          }`}>
            {summary.personBBalance >= 0
              ? `+${formatCurrency(summary.personBBalance)} ahead`
              : `${formatCurrency(Math.abs(summary.personBBalance))} short`
            }
          </p>
        </div>
      </div>

      {/* Split visual */}
      {summary.total > 0 && (
        <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <ArrowRightLeft className="h-4 w-4 text-green-600" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Payment Split</p>
          </div>
          <div className="flex rounded-full overflow-hidden h-3 bg-gray-100">
            <div
              className="bg-green-500 transition-all"
              style={{ width: `${(summary.personAPaid / summary.total) * 100}%` }}
            />
            <div
              className="bg-green-300 transition-all"
              style={{ width: `${(summary.personBPaid / summary.total) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>{settings.personAName} ({Math.round((summary.personAPaid / summary.total) * 100)}%)</span>
            <span>{settings.personBName} ({Math.round((summary.personBPaid / summary.total) * 100)}%)</span>
          </div>
        </div>
      )}

      {expenses.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <Wallet className="h-10 w-10 text-green-300" />
          </div>
          <p className="font-semibold text-gray-700">No expenses yet</p>
          <p className="text-sm text-gray-400 mt-1">Tap <span className="text-green-600 font-medium">Add</span> to record your first expense</p>
        </div>
      )}
    </div>
  );
}
