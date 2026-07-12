import { createClient } from "@/lib/supabase/client";
import { Expense, AppSettings } from "./types";

const DEFAULT_SETTINGS: AppSettings = {
  personAName: "Jamil",
  personBName: "Friend",
};

type ExpenseRow = {
  id: string;
  title: string;
  amount: number;
  paid_by: "personA" | "personB";
  date: string;
  category: Expense["category"];
  notes: string | null;
};

function fromRow(row: ExpenseRow): Expense {
  return {
    id: row.id,
    title: row.title,
    amount: Number(row.amount),
    paidBy: row.paid_by,
    date: row.date,
    category: row.category,
    notes: row.notes ?? undefined,
  };
}

export async function getExpenses(): Promise<Expense[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as ExpenseRow[]).map(fromRow);
}

export async function addExpense(expense: Expense): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("expenses").insert({
    title: expense.title,
    amount: expense.amount,
    paid_by: expense.paidBy,
    date: expense.date,
    category: expense.category,
    notes: expense.notes ?? null,
  });
  if (error) throw error;
}

export async function updateExpense(updated: Expense): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("expenses")
    .update({
      title: updated.title,
      amount: updated.amount,
      paid_by: updated.paidBy,
      date: updated.date,
      category: updated.category,
      notes: updated.notes ?? null,
    })
    .eq("id", updated.id);
  if (error) throw error;
}

export async function deleteExpense(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("expenses").delete().eq("id", id);
  if (error) throw error;
}

export async function getSettings(): Promise<AppSettings> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("settings")
    .select("person_a_name, person_b_name")
    .single();

  if (error || !data) return DEFAULT_SETTINGS;
  return { personAName: data.person_a_name, personBName: data.person_b_name };
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("settings")
    .update({ person_a_name: settings.personAName, person_b_name: settings.personBName })
    .eq("id", true);
  if (error) throw error;
}

export async function resetAllData(): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("expenses").delete().neq("id", "");
  if (error) throw error;
}

export async function exportData(): Promise<string> {
  const expenses = await getExpenses();
  const settings = await getSettings();
  return JSON.stringify({ expenses, settings }, null, 2);
}

export async function importData(jsonStr: string): Promise<{ expenses: Expense[]; settings: AppSettings }> {
  const data = JSON.parse(jsonStr) as { expenses: Expense[]; settings: AppSettings };
  if (!Array.isArray(data.expenses)) throw new Error("Invalid data format");

  const supabase = createClient();
  const rows = data.expenses.map((e) => ({
    id: e.id,
    title: e.title,
    amount: e.amount,
    paid_by: e.paidBy,
    date: e.date,
    category: e.category,
    notes: e.notes ?? null,
  }));
  const { error } = await supabase.from("expenses").upsert(rows, { onConflict: "id" });
  if (error) throw error;

  if (data.settings) await saveSettings(data.settings);
  return data;
}
