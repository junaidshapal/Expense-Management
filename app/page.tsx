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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Main content with top padding for header and bottom padding for nav */}
      <main className="flex-1 px-4 pt-4 pb-24 w-full">
        {activeTab === "dashboard" && (
          <div className="space-y-1">
            <h1 className="text-lg font-semibold">Dashboard</h1>
            <p className="text-sm text-muted-foreground mb-4">All-time summary</p>
            <SummaryCards expenses={expenses} settings={settings} />
          </div>
        )}

        {activeTab === "add" && (
          <div className="space-y-1">
            <h1 className="text-lg font-semibold">
              {editingExpense ? "Edit Expense" : "Add Expense"}
            </h1>
            <p className="text-sm text-muted-foreground mb-4">
              {editingExpense ? "Update expense details" : "Record a new shared expense"}
            </p>
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
          <div className="space-y-1">
            <h1 className="text-lg font-semibold">Expense History</h1>
            <p className="text-sm text-muted-foreground mb-4">All recorded expenses</p>
            <Filters filters={filters} settings={settings} onChange={setFilters} />
            <div className="mt-3">
              <ExpenseList
                expenses={expenses}
                settings={settings}
                filters={filters}
                onEdit={handleEditExpense}
                onDelete={handleDeleteExpense}
              />
            </div>
          </div>
        )}

        {activeTab === "settlement" && (
          <div className="space-y-1">
            <h1 className="text-lg font-semibold">Settlement</h1>
            <p className="text-sm text-muted-foreground mb-4">Calculate who owes whom</p>
            <SettlementCalculator expenses={expenses} settings={settings} />
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-1">
            <h1 className="text-lg font-semibold">Settings</h1>
            <p className="text-sm text-muted-foreground mb-4">Manage names and data</p>
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
