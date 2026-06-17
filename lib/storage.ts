import { Expense, AppSettings } from "./types";

const EXPENSES_KEY = "hostel_hisab_expenses";
const SETTINGS_KEY = "hostel_hisab_settings";

const DEFAULT_SETTINGS: AppSettings = {
  personAName: "Jamil",
  personBName: "Friend",
};

export function getExpenses(): Expense[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(EXPENSES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Expense[];
  } catch {
    return [];
  }
}

export function saveExpenses(expenses: Expense[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
}

export function addExpense(expense: Expense): Expense[] {
  const expenses = getExpenses();
  const updated = [expense, ...expenses];
  saveExpenses(updated);
  return updated;
}

export function updateExpense(updated: Expense): Expense[] {
  const expenses = getExpenses();
  const list = expenses.map((e) => (e.id === updated.id ? updated : e));
  saveExpenses(list);
  return list;
}

export function deleteExpense(id: string): Expense[] {
  const expenses = getExpenses();
  const list = expenses.filter((e) => e.id !== id);
  saveExpenses(list);
  return list;
}

export function getSettings(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<AppSettings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function resetAllData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(EXPENSES_KEY);
}

export function exportData(): string {
  const expenses = getExpenses();
  const settings = getSettings();
  return JSON.stringify({ expenses, settings }, null, 2);
}

export function importData(jsonStr: string): { expenses: Expense[]; settings: AppSettings } {
  const data = JSON.parse(jsonStr) as { expenses: Expense[]; settings: AppSettings };
  if (!Array.isArray(data.expenses)) throw new Error("Invalid data format");
  saveExpenses(data.expenses);
  if (data.settings) saveSettings(data.settings);
  return data;
}
