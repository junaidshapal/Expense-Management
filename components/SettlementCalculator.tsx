"use client";

import { useState } from "react";
import { Expense, AppSettings, SummaryData } from "@/lib/types";
import { calculateSettlement, filterExpenses } from "@/lib/calculations";
import { formatCurrency, getLast15DaysRange, getTodayString, cn } from "@/lib/utils";
import { Calculator, Clock, CheckCircle2, CalendarDays, HandCoins } from "lucide-react";

interface SettlementCalculatorProps {
  expenses: Expense[];
  settings: AppSettings;
  onSettleUp: (expenseIds: string[]) => Promise<void>;
}

const inputClass =
  "w-full h-10 px-3.5 rounded-md border border-gray-200 text-sm outline-none bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/15 transition-colors";

export default function SettlementCalculator({ expenses, settings, onSettleUp }: SettlementCalculatorProps) {
  const today = getTodayString();
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [result, setResult] = useState<SummaryData | null>(null);
  const [calcRange, setCalcRange] = useState<{ start: string; end: string } | null>(null);
  const [confirmingSettle, setConfirmingSettle] = useState(false);
  const [settling, setSettling] = useState(false);
  const [justSettled, setJustSettled] = useState(false);

  function runCalculation(s: string, e: string) {
    setResult(calculateSettlement(expenses, s, e, settings));
    setCalcRange({ start: s, end: e });
    setConfirmingSettle(false);
    setJustSettled(false);
  }

  function handleCalculate() {
    runCalculation(startDate, endDate);
  }

  function handleLast15Days() {
    const { startDate: s, endDate: e } = getLast15DaysRange();
    setStartDate(s); setEndDate(e);
    runCalculation(s, e);
  }

  const rangeExpenses = calcRange
    ? filterExpenses(expenses, { startDate: calcRange.start, endDate: calcRange.end })
    : [];
  const unsettledInRange = rangeExpenses.filter((e) => !e.settled);
  const allInRangeSettled = rangeExpenses.length > 0 && unsettledInRange.length === 0;

  async function handleSettleUp() {
    if (!calcRange || unsettledInRange.length === 0) return;
    setSettling(true);
    await onSettleUp(unsettledInRange.map((e) => e.id));
    setSettling(false);
    setConfirmingSettle(false);
    setJustSettled(true);
  }

  const fmtRange = (s: string) => {
    const date = new Date(s + "T00:00:00");
    const includeYear = date.getFullYear() !== new Date().getFullYear();
    return date.toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
      ...(includeYear && { year: "numeric" }),
    });
  };

  return (
    <div className="space-y-3">
      {/* Date range picker */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-green-600 flex items-center justify-center shrink-0">
            <Calculator className="h-4 w-4 text-white" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 text-sm">Select date range</p>
            <p className="text-xs text-gray-400">Pick dates to calculate hisab</p>
          </div>
        </div>

        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1">
              <CalendarDays className="h-3 w-3" strokeWidth={2} /> From
            </p>
            <input type="date" className={inputClass} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1">
              <CalendarDays className="h-3 w-3" strokeWidth={2} /> To
            </p>
            <input type="date" className={inputClass} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>

        <div className="flex gap-2.5">
          <button
            onClick={handleCalculate}
            className="flex-1 h-10 rounded-md bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-medium text-sm transition-colors"
          >
            Calculate hisab
          </button>
          <button
            onClick={handleLast15Days}
            className="h-10 px-3.5 rounded-md border border-gray-200 bg-white text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Clock className="h-4 w-4" strokeWidth={2} />
            15 days
          </button>
        </div>
      </div>

      {/* Results */}
      {result && calcRange && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
            <p className="font-medium text-gray-900 text-sm">
              {fmtRange(calcRange.start)} — {fmtRange(calcRange.end)}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {rangeExpenses.length === 0
                ? "No expenses in this period"
                : `${rangeExpenses.length} expense${rangeExpenses.length !== 1 ? "s" : ""} found`}
            </p>
          </div>

          <div className="p-4 space-y-3">
            {/* Breakdown rows */}
            <div className="space-y-2.5">
              {[
                { label: "Total expenses", value: result.total, bold: true },
                { label: "Each person's share", value: result.sharePerPerson, bold: false },
              ].map(({ label, value, bold }) => (
                <div key={label} className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className={cn("text-sm", bold ? "font-semibold text-gray-900" : "font-medium text-gray-700")}>
                    {formatCurrency(value)}
                  </p>
                </div>
              ))}

              <div className="h-px bg-gray-100" />

              {[
                { name: settings.personAName, value: result.personAPaid, initial: settings.personAName.charAt(0), accent: "bg-green-600" },
                { name: settings.personBName, value: result.personBPaid, initial: settings.personBName.charAt(0), accent: "bg-teal-600" },
              ].map(({ name, value, initial, accent }) => (
                <div key={name} className="flex justify-between items-center">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-semibold shrink-0", accent)}>
                      {initial}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{name} paid</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 shrink-0">{formatCurrency(value)}</p>
                </div>
              ))}

              <div className="h-px bg-gray-100" />

              {[
                { label: `${settings.personAName} balance`, value: result.personABalance },
                { label: `${settings.personBName} balance`, value: result.personBBalance },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center">
                  <p className="text-xs text-gray-400">{label}</p>
                  <span
                    className={cn(
                      "text-xs font-medium px-2 py-0.5 rounded-full",
                      value >= 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                    )}
                  >
                    {value >= 0 ? "+" : ""}{formatCurrency(value)}
                  </span>
                </div>
              ))}
            </div>

            {/* Final verdict */}
            {result.isSettled ? (
              <div className="flex items-center gap-3 rounded-lg bg-green-50 border border-green-200 p-3.5 mt-2">
                <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" strokeWidth={2} />
                <div>
                  <p className="font-semibold text-green-900 text-sm">All settled</p>
                  <p className="text-green-700/80 text-xs mt-0.5">No outstanding balance for this period.</p>
                </div>
              </div>
            ) : (
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 mt-2">
                <p className="text-[11px] font-medium text-amber-700 uppercase tracking-wide mb-1">To pay</p>
                <p className="text-2xl font-semibold text-amber-900 tracking-tight">{formatCurrency(result.amountOwed)}</p>
                <p className="text-sm text-amber-800/90 mt-1">
                  <span className="font-semibold">
                    {result.debtor === "personA" ? settings.personAName : settings.personBName}
                  </span>
                  {" "}owes{" "}
                  <span className="font-semibold">
                    {result.creditor === "personA" ? settings.personAName : settings.personBName}
                  </span>
                </p>
              </div>
            )}

            {/* Settle up */}
            {rangeExpenses.length === 0 ? null : allInRangeSettled ? (
              <div className="flex items-center gap-2.5 rounded-lg bg-violet-50 border border-violet-200 p-3.5 mt-2">
                <CheckCircle2 className="h-4.5 w-4.5 text-violet-600 shrink-0" strokeWidth={2} />
                <p className="text-xs font-medium text-violet-700">
                  All {rangeExpenses.length} expense{rangeExpenses.length !== 1 ? "s" : ""} in this period are already settled.
                </p>
              </div>
            ) : justSettled ? (
              <div className="flex items-center gap-2.5 rounded-lg bg-violet-50 border border-violet-200 p-3.5 mt-2">
                <CheckCircle2 className="h-4.5 w-4.5 text-violet-600 shrink-0" strokeWidth={2} />
                <p className="text-xs font-medium text-violet-700">Marked as settled — moved to the Settled view in History.</p>
              </div>
            ) : confirmingSettle ? (
              <div className="rounded-lg bg-violet-50 border border-violet-200 p-4 mt-2 space-y-3">
                <div>
                  <p className="text-sm font-semibold text-violet-900">
                    Settle {unsettledInRange.length} expense{unsettledInRange.length !== 1 ? "s" : ""} in this period?
                  </p>
                  <p className="text-xs text-violet-700/80 mt-0.5">
                    Only these {fmtRange(calcRange.start)}–{fmtRange(calcRange.end)} expenses will be marked settled — they leave the dashboard balance and move to the Settled view in History.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSettleUp}
                    disabled={settling}
                    className="flex-1 h-9 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors disabled:opacity-60"
                  >
                    {settling ? "Settling..." : "Yes, settle up"}
                  </button>
                  <button
                    onClick={() => setConfirmingSettle(false)}
                    className="flex-1 h-9 rounded-md border border-gray-200 bg-white text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmingSettle(true)}
                className="w-full h-10 rounded-md border border-violet-200 bg-violet-50 text-violet-700 font-medium text-sm hover:bg-violet-100 transition-colors flex items-center justify-center gap-2 mt-2"
              >
                <HandCoins className="h-4 w-4" strokeWidth={2} />
                Settle up this period
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
