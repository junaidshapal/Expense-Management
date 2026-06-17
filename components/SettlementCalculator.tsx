"use client";

import { useState } from "react";
import { Expense, AppSettings, SummaryData } from "@/lib/types";
import { calculateSettlement } from "@/lib/calculations";
import { formatCurrency, getLast15DaysRange, getTodayString } from "@/lib/utils";
import { Calculator, Clock, CheckCircle2, AlertCircle } from "lucide-react";

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

  return (
    <div className="space-y-4">
      {/* Date range picker */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center">
            <Calculator className="h-4 w-4 text-green-700" />
          </div>
          <p className="font-semibold text-gray-800">Select Date Range</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">From Date</p>
            <input type="date" className={inputClass} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">To Date</p>
            <input type="date" className={inputClass} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCalculate}
            className="flex-1 h-12 rounded-xl bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold text-sm transition-colors shadow-sm"
          >
            Calculate Hisab
          </button>
          <button
            onClick={handleLast15Days}
            className="h-12 px-4 rounded-xl border border-green-200 bg-green-50 text-green-700 font-medium text-sm hover:bg-green-100 transition-colors flex items-center gap-2"
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
          <div className="bg-green-50 border-b border-green-100 px-4 py-3">
            <p className="font-semibold text-green-800 text-sm">
              {fmtRange(calcRange.start)} — {fmtRange(calcRange.end)}{new Date(calcRange.end + "T00:00:00").getFullYear() !== new Date().getFullYear() ? `, ${new Date(calcRange.end + "T00:00:00").getFullYear()}` : ""}
            </p>
            <p className="text-xs text-green-600 mt-0.5">
              {result.total === 0 ? "No expenses in this period" : `${expenses.filter(e => e.date >= calcRange.start && e.date <= calcRange.end).length} expenses`}
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
                  <p className={`text-sm ${bold ? "font-bold text-gray-900" : "font-semibold text-gray-700"}`}>
                    {formatCurrency(value)}
                  </p>
                </div>
              ))}

              <div className="h-px bg-gray-100" />

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center text-white text-[10px] font-bold">
                    {settings.personAName.charAt(0)}
                  </div>
                  <p className="text-sm text-gray-500">{settings.personAName} paid</p>
                </div>
                <p className="text-sm font-semibold text-gray-700">{formatCurrency(result.personAPaid)}</p>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center text-white text-[10px] font-bold">
                    {settings.personBName.charAt(0)}
                  </div>
                  <p className="text-sm text-gray-500">{settings.personBName} paid</p>
                </div>
                <p className="text-sm font-semibold text-gray-700">{formatCurrency(result.personBPaid)}</p>
              </div>

              <div className="h-px bg-gray-100" />

              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-400">{settings.personAName} balance</p>
                <p className={`text-xs font-semibold ${result.personABalance >= 0 ? "text-green-600" : "text-red-500"}`}>
                  {result.personABalance >= 0 ? "+" : ""}{formatCurrency(result.personABalance)}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-400">{settings.personBName} balance</p>
                <p className={`text-xs font-semibold ${result.personBBalance >= 0 ? "text-green-600" : "text-red-500"}`}>
                  {result.personBBalance >= 0 ? "+" : ""}{formatCurrency(result.personBBalance)}
                </p>
              </div>
            </div>

            {/* Final verdict */}
            {result.isSettled ? (
              <div className="flex items-center gap-3 rounded-xl bg-green-600 p-4 mt-2">
                <CheckCircle2 className="h-7 w-7 text-white shrink-0" />
                <div>
                  <p className="font-bold text-white">All Settled! ✅</p>
                  <p className="text-green-100 text-sm">No outstanding balance.</p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 p-4 mt-2 text-white">
                <p className="text-sm font-medium text-white/80">
                  {result.debtor === "personA" ? settings.personAName : settings.personBName}
                  {" "}owes{" "}
                  {result.creditor === "personA" ? settings.personAName : settings.personBName}
                </p>
                <p className="text-3xl font-bold mt-0.5">{formatCurrency(result.amountOwed)}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
