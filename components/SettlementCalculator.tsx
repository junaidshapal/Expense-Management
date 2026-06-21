"use client";

import { useState } from "react";
import { Expense, AppSettings, SummaryData } from "@/lib/types";
import { calculateSettlement } from "@/lib/calculations";
import { formatCurrency, getLast15DaysRange, getTodayString } from "@/lib/utils";
import { Calculator, Clock, CheckCircle2, AlertCircle, CalendarDays } from "lucide-react";

interface SettlementCalculatorProps {
  expenses: Expense[];
  settings: AppSettings;
}

const inputClass = "w-full h-11 px-4 rounded-xl border border-gray-200 text-sm outline-none bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all";

export default function SettlementCalculator({ expenses, settings }: SettlementCalculatorProps) {
  const today = getTodayString();
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [result, setResult] = useState<SummaryData | null>(null);
  const [calcRange, setCalcRange] = useState<{ start: string; end: string } | null>(null);

  function handleCalculate() {
    setResult(calculateSettlement(expenses, startDate, endDate, settings));
    setCalcRange({ start: startDate, end: endDate });
  }

  function handleLast15Days() {
    const { startDate: s, endDate: e } = getLast15DaysRange();
    setStartDate(s); setEndDate(e);
    setResult(calculateSettlement(expenses, s, e, settings));
    setCalcRange({ start: s, end: e });
  }

  const fmtRange = (s: string) =>
    new Date(s + "T00:00:00").toLocaleDateString("en-PK", { day: "numeric", month: "short" });

  const expenseCount = calcRange
    ? expenses.filter(e => e.date >= calcRange.start && e.date <= calcRange.end).length
    : 0;

  return (
    <div className="space-y-4">
      {/* Date range picker */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shadow-sm">
            <Calculator className="h-4.5 w-4.5 text-green-700" />
          </div>
          <div>
            <p className="font-bold text-gray-800 text-sm">Select Date Range</p>
            <p className="text-[10px] text-gray-400 font-medium">Pick dates to calculate hisab</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
              <CalendarDays className="h-3 w-3" /> From
            </p>
            <input type="date" className={inputClass} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
              <CalendarDays className="h-3 w-3" /> To
            </p>
            <input type="date" className={inputClass} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCalculate}
            className="flex-1 h-12 rounded-xl bg-gradient-to-b from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 active:scale-[0.98] text-white font-bold text-sm transition-all shadow-md shadow-green-200"
          >
            Calculate Hisab
          </button>
          <button
            onClick={handleLast15Days}
            className="h-12 px-4 rounded-xl border border-green-200 bg-green-50 text-green-700 font-semibold text-sm hover:bg-green-100 active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <Clock className="h-4 w-4" />
            15 Days
          </button>
        </div>
      </div>

      {/* Results */}
      {result && calcRange && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 px-4 py-3.5">
            <p className="font-bold text-green-800 text-sm">
              {fmtRange(calcRange.start)} — {fmtRange(calcRange.end)}
              {new Date(calcRange.end + "T00:00:00").getFullYear() !== new Date().getFullYear()
                ? `, ${new Date(calcRange.end + "T00:00:00").getFullYear()}`
                : ""}
            </p>
            <p className="text-xs text-green-600 mt-0.5 font-medium">
              {result.total === 0 ? "No expenses in this period" : `${expenseCount} expense${expenseCount !== 1 ? "s" : ""} found`}
            </p>
          </div>

          <div className="p-4 space-y-3">
            {/* Breakdown rows */}
            <div className="space-y-2.5">
              {[
                { label: "Total Expenses", value: result.total, bold: true },
                { label: "Each Person's Share", value: result.sharePerPerson, bold: false },
              ].map(({ label, value, bold }) => (
                <div key={label} className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className={`text-sm ${bold ? "font-extrabold text-gray-900" : "font-semibold text-gray-700"}`}>
                    {formatCurrency(value)}
                  </p>
                </div>
              ))}

              <div className="h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />

              {[
                { name: settings.personAName, value: result.personAPaid, initial: settings.personAName.charAt(0), color: "from-green-500 to-green-700", shadow: "shadow-green-200" },
                { name: settings.personBName, value: result.personBPaid, initial: settings.personBName.charAt(0), color: "from-emerald-400 to-teal-500", shadow: "shadow-emerald-200" },
              ].map(({ name, value, initial, color, shadow }) => (
                <div key={name} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-[10px] font-bold shadow-sm ${shadow}`}>
                      {initial}
                    </div>
                    <p className="text-sm text-gray-600 font-medium">{name} paid</p>
                  </div>
                  <p className="text-sm font-bold text-gray-800">{formatCurrency(value)}</p>
                </div>
              ))}

              <div className="h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />

              {[
                { label: `${settings.personAName} balance`, value: result.personABalance },
                { label: `${settings.personBName} balance`, value: result.personBBalance },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center">
                  <p className="text-xs text-gray-400 font-medium">{label}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    value >= 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                  }`}>
                    {value >= 0 ? "+" : ""}{formatCurrency(value)}
                  </span>
                </div>
              ))}
            </div>

            {/* Final verdict */}
            {result.isSettled ? (
              <div className="relative overflow-hidden flex items-center gap-3 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 p-4 mt-2 shadow-md shadow-green-200">
                <div className="absolute inset-0 shimmer pointer-events-none" />
                <CheckCircle2 className="h-7 w-7 text-white shrink-0 relative" />
                <div className="relative">
                  <p className="font-bold text-white text-base">All Settled!</p>
                  <p className="text-green-100 text-xs mt-0.5">No outstanding balance for this period.</p>
                </div>
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 p-4 mt-2 text-white shadow-md shadow-orange-200">
                <div className="absolute inset-0 shimmer pointer-events-none" />
                <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10" />
                <div className="relative">
                  <p className="text-xs font-semibold text-white/80 uppercase tracking-wider mb-1">To Pay</p>
                  <p className="text-3xl font-extrabold tracking-tight">{formatCurrency(result.amountOwed)}</p>
                  <p className="text-sm font-medium text-white/85 mt-1">
                    <span className="font-bold text-white">
                      {result.debtor === "personA" ? settings.personAName : settings.personBName}
                    </span>
                    {" "}owes{" "}
                    <span className="font-bold text-white">
                      {result.creditor === "personA" ? settings.personAName : settings.personBName}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
