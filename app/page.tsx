"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Expense, AppSettings, ExpenseFilters, SettledStatus } from "@/lib/types";
import {
  getExpenses,
  getSettings,
  saveSettings,
  addExpense,
  markExpensesSettled,
} from "@/lib/storage";
import { getUnsettledExpenses } from "@/lib/calculations";
import Navbar from "@/components/Navbar";
import SummaryCards from "@/components/SummaryCards";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import ExpenseViewTabs from "@/components/ExpenseViewTabs";
import Filters from "@/components/Filters";
import SettlementCalculator from "@/components/SettlementCalculator";
import SettingsPanel from "@/components/SettingsPanel";
import { LayoutDashboard, PlusCircle, List, Calculator, Settings, type LucideIcon } from "lucide-react";

type Tab = "dashboard" | "add" | "expenses" | "settlement" | "settings";

const PAGE_META: Record<Tab, { title: string; subtitle: string; icon: LucideIcon }> = {
  dashboard:  { title: "Dashboard",       subtitle: "Overview of shared expenses",   icon: LayoutDashboard },
  add:        { title: "Add expense",     subtitle: "Record a new shared expense",   icon: PlusCircle },
  expenses:   { title: "Expense history", subtitle: "All recorded expenses",         icon: List },
  settlement: { title: "Settlement",      subtitle: "Calculate who owes whom",       icon: Calculator },
  settings:   { title: "Settings",        subtitle: "Manage names and data",         icon: Settings },
};

// History has three views; settled expenses leave the default view once a hisab is settled.
const EXPENSE_VIEW_SUBTITLE: Record<SettledStatus, string> = {
  Unsettled: "Expenses not settled yet",
  Settled:   "Expenses cleared in a past hisab",
  All:       "All recorded expenses",
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    personAName: "Jamil",
    personBName: "Friend",
  });
  const [filters, setFilters] = useState<ExpenseFilters>({
    category: "All",
    paidBy: "All",
    settledStatus: "Unsettled",
  });

  const refresh = useCallback(async () => {
    const [expensesData, settingsData] = await Promise.all([getExpenses(), getSettings()]);
    setExpenses(expensesData);
    setSettings(settingsData);
  }, []);

  const unsettledExpenses = useMemo(() => getUnsettledExpenses(expenses), [expenses]);

  const viewCounts = useMemo<Record<SettledStatus, number>>(
    () => ({
      Unsettled: unsettledExpenses.length,
      Settled: expenses.length - unsettledExpenses.length,
      All: expenses.length,
    }),
    [expenses, unsettledExpenses]
  );

  const handleSettleUp = useCallback(async (expenseIds: string[]) => {
    await markExpensesSettled(expenseIds);
    const updated = await getExpenses();
    setExpenses(updated);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleAddExpense = useCallback(async (expense: Expense) => {
    await addExpense(expense);
    const updated = await getExpenses();
    setExpenses(updated);
  }, []);

  const handleSaveSettings = useCallback(async (s: AppSettings) => {
    await saveSettings(s);
    setSettings(s);
  }, []);

  const handleDataReset = useCallback(() => {
    setExpenses([]);
  }, []);

  const handleDataImport = useCallback(() => {
    refresh();
  }, [refresh]);

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab);
  }, []);

  const handleViewChange = useCallback((settledStatus: SettledStatus) => {
    setFilters((prev) => ({ ...prev, settledStatus }));
  }, []);

  const meta = PAGE_META[activeTab];
  const MetaIcon = meta.icon;
  const expenseView = filters.settledStatus || "All";
  const subtitle = activeTab === "expenses" ? EXPENSE_VIEW_SUBTITLE[expenseView] : meta.subtitle;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />

      <main className="flex-1 px-4 pt-4 pb-24 w-full">
        {/* Page header */}
        <div className="flex items-center gap-2.5 mb-4 animate-fade-in">
          <div className="w-8 h-8 rounded-md bg-green-600 flex items-center justify-center shrink-0">
            <MetaIcon className="h-4 w-4 text-white" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <h1 className="text-[15px] font-semibold text-gray-900 leading-tight truncate">{meta.title}</h1>
            <p className="text-xs text-gray-400 leading-tight">{subtitle}</p>
          </div>
        </div>

        {activeTab === "dashboard" && (
          <div key="dashboard" className="animate-fade-in">
            <SummaryCards expenses={unsettledExpenses} settings={settings} />
          </div>
        )}

        {activeTab === "add" && (
          <div key="add" className="animate-fade-in">
            <ExpenseForm settings={settings} onSave={handleAddExpense} />
          </div>
        )}

        {activeTab === "expenses" && (
          <div key="expenses" className="animate-fade-in space-y-3">
            <ExpenseViewTabs value={expenseView} counts={viewCounts} onChange={handleViewChange} />
            <Filters filters={filters} settings={settings} onChange={setFilters} />
            <ExpenseList expenses={expenses} settings={settings} filters={filters} />
          </div>
        )}

        {activeTab === "settlement" && (
          <div key="settlement" className="animate-fade-in">
            <SettlementCalculator
              expenses={expenses}
              settings={settings}
              onSettleUp={handleSettleUp}
            />
          </div>
        )}

        {activeTab === "settings" && (
          <div key="settings" className="animate-fade-in">
            <SettingsPanel
              settings={settings}
              expenseCount={expenses.length}
              onSettingsChange={handleSaveSettings}
              onDataReset={handleDataReset}
              onDataImport={handleDataImport}
            />
          </div>
        )}
      </main>
    </div>
  );
}
