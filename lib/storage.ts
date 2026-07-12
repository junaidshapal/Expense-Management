import { createClient } from "@/lib/supabase/client";
import { Expense, AppSettings } from "./types";

const DEFAULT_SETTINGS: AppSettings = {
  personAName: "Person A",
  personBName: "Person B",
};

async function getUserId(): Promise<string> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error("Not authenticated");
  return data.user.id;
}

type ExpenseRow = {
  id: string;
  title: string;
  amount: number;
  paid_by: "personA" | "personB";
  date: string;
  category: Expense["category"];
  notes: string | null;
  created_at: string;
  settled: boolean;
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
    createdAt: row.created_at,
    settled: row.settled,
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
  const userId = await getUserId();
  const { error } = await supabase.from("expenses").insert({
    user_id: userId,
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
      settled: updated.settled,
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
  const userId = await getUserId();
  const { data, error } = await supabase
    .from("settings")
    .select("person_a_name, person_b_name")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  if (data) return { personAName: data.person_a_name, personBName: data.person_b_name };

  const { error: insertError } = await supabase.from("settings").insert({
    user_id: userId,
    person_a_name: DEFAULT_SETTINGS.personAName,
    person_b_name: DEFAULT_SETTINGS.personBName,
  });
  if (insertError) throw insertError;
  return DEFAULT_SETTINGS;
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  const supabase = createClient();
  const userId = await getUserId();
  const { error } = await supabase
    .from("settings")
    .update({ person_a_name: settings.personAName, person_b_name: settings.personBName })
    .eq("user_id", userId);
  if (error) throw error;
}

export async function resetAllData(): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("expenses").delete().not("id", "is", null);
  if (error) throw error;
}

export async function markExpensesSettled(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  const supabase = createClient();
  const { error } = await supabase.from("expenses").update({ settled: true }).in("id", ids);
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
  const userId = await getUserId();
  const rows = data.expenses.map((e) => ({
    id: e.id,
    user_id: userId,
    title: e.title,
    amount: e.amount,
    paid_by: e.paidBy,
    date: e.date,
    category: e.category,
    notes: e.notes ?? null,
    settled: e.settled ?? false,
  }));
  const { error } = await supabase.from("expenses").upsert(rows, { onConflict: "id" });
  if (error) throw error;

  if (data.settings) await saveSettings(data.settings);
  return data;
}
