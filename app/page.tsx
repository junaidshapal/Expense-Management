"use client";

import { useState, useEffect, useCallback } from "react";
import { Expense, AppSettings, ExpenseFilters } from "@/lib/types";
import {
  getExpenses,
  getSettings,
  saveSettings,
  addExpense,
  updateExpense,
  deleteExpense,
} from "@/lib/storage";
import Navbar from "@/components/Navbar";
import SummaryCards from "@/components/SummaryCards";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import Filters from "@/components/Filters";
import SettlementCalculator from "@/components/SettlementCalculator";
import SettingsPanel from "@/components/SettingsPanel";

type Tab = "dashboard" | "add" | "expenses" | "settlement" | "settings";

const PAGE_META: Record<Tab, { title: string; subtitle: string; emoji: string }> = {
  dashboard:  { title: "Dashboard",       subtitle: "All-time summary",              emoji: "📊" },
  add:        { title: "Add Expense",     subtitle: "Record a new shared expense",   emoji: "➕" },
  expenses:   { title: "Expense History", subtitle: "All recorded expenses",         emoji: "🗒️" },
  settlement: { title: "Settlement",      subtitle: "Calculate who owes whom",       emoji: "🤝" },
  settings:   { title: "Settings",        subtitle: "Manage names and data",         emoji: "⚙️" },
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    personAName: "Jamil",
    personBName: "Friend",
  });
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [filters, setFilters] = useState<ExpenseFilters>({
    category: "All",
    paidBy: "All",
  });

  useEffect(() => {
    setExpenses(getExpenses());
    setSettings(getSettings());
  }, []);

  const handleAddExpense = useCallback((expense: Expense) => {
    const updated = addExpense(expense);
    setExpenses(updated);
  }, []);

  const handleUpdateExpense = useCallback((expense: Expense) => {
    const updated = updateExpense(expense);
    setExpenses(updated);
    setEditingExpense(null);
    setActiveTab("expenses");
  }, []);

  const handleDeleteExpense = useCallback((id: string) => {
    const updated = deleteExpense(id);
    setExpenses(updated);
  }, []);

  const handleSaveSettings = useCallback((s: AppSettings) => {
    saveSettings(s);
    setSettings(s);
  }, []);

  const handleDataReset = useCallback(() => {
    setExpenses([]);
  }, []);

  const handleDataImport = useCallback(() => {
    setExpenses(getExpenses());
    setSettings(getSettings());
  }, []);

  const handleEditExpense = useCallback((expense: Expense) => {
    setEditingExpense(expense);
    setActiveTab("add");
  }, []);

  const handleSaveForm = useCallback(
    (expense: Expense) => {
      if (editingExpense) {
        handleUpdateExpense(expense);
      } else {
        handleAddExpense(expense);
      }
    },
    [editingExpense, handleUpdateExpense, handleAddExpense]
  );

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab);
    if (tab !== "add") setEditingExpense(null);
  }, []);

  const meta = editingExpense && activeTab === "add"
    ? { title: "Edit Expense", subtitle: "Update expense details", emoji: "✏️" }
    : PAGE_META[activeTab];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />

      <main className="flex-1 px-4 pt-4 pb-28 w-full">
        {/* Page header */}
        <div className="flex items-center gap-2.5 mb-4 animate-fade-in">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-sm shadow-green-200 text-base leading-none shrink-0">
            {meta.emoji}
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-tight">{meta.title}</h1>
            <p className="text-[11px] text-gray-400 font-medium">{meta.subtitle}</p>
          </div>
        </div>

        {activeTab === "dashboard" && (
          <div key="dashboard" className="animate-fade-in">
            <SummaryCards expenses={expenses} settings={settings} />
          </div>
        )}

        {activeTab === "add" && (
          <div key="add" className="animate-fade-in">
            <ExpenseForm
              settings={settings}
              editingExpense={editingExpense}
              onSave={handleSaveForm}
              onCancelEdit={() => {
                setEditingExpense(null);
                setActiveTab("expenses");
              }}
            />
          </div>
        )}

        {activeTab === "expenses" && (
          <div key="expenses" className="animate-fade-in space-y-3">
            <Filters filters={filters} settings={settings} onChange={setFilters} />
            <ExpenseList
              expenses={expenses}
              settings={settings}
              filters={filters}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
            />
          </div>
        )}

        {activeTab === "settlement" && (
          <div key="settlement" className="animate-fade-in">
            <SettlementCalculator expenses={expenses} settings={settings} />
          </div>
        )}

        {activeTab === "settings" && (
          <div key="settings" className="animate-fade-in">
            <SettingsPanel
              settings={settings}
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
