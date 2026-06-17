import { Expense, AppSettings, ExpenseFilters, SummaryData } from "./types";

export function filterExpenses(expenses: Expense[], filters: ExpenseFilters): Expense[] {
  return expenses.filter((expense) => {
    if (filters.startDate && expense.date < filters.startDate) return false;
    if (filters.endDate && expense.date > filters.endDate) return false;
    if (filters.category && filters.category !== "All" && expense.category !== filters.category) return false;
    if (filters.paidBy && filters.paidBy !== "All" && expense.paidBy !== filters.paidBy) return false;
    return true;
  });
}

export function calculateSummary(expenses: Expense[], _settings: AppSettings): SummaryData {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const personAPaid = expenses.filter((e) => e.paidBy === "personA").reduce((sum, e) => sum + e.amount, 0);
  const personBPaid = expenses.filter((e) => e.paidBy === "personB").reduce((sum, e) => sum + e.amount, 0);
  const sharePerPerson = total / 2;

  const personABalance = personAPaid - sharePerPerson;
  const personBBalance = personBPaid - sharePerPerson;

  let debtor: "personA" | "personB" | null = null;
  let creditor: "personA" | "personB" | null = null;
  let amountOwed = 0;

  if (personABalance < 0) {
    debtor = "personA";
    creditor = "personB";
    amountOwed = Math.abs(personABalance);
  } else if (personBBalance < 0) {
    debtor = "personB";
    creditor = "personA";
    amountOwed = Math.abs(personBBalance);
  }

  return {
    total,
    personAPaid,
    personBPaid,
    sharePerPerson,
    personABalance,
    personBBalance,
    debtor,
    creditor,
    amountOwed,
    isSettled: amountOwed < 0.01,
  };
}

export function calculateSettlement(
  expenses: Expense[],
  startDate: string,
  endDate: string,
  settings: AppSettings
): SummaryData {
  const filtered = filterExpenses(expenses, { startDate, endDate });
  return calculateSummary(filtered, settings);
}
