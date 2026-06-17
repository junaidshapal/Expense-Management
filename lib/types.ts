export type Person = {
  id: "personA" | "personB";
  name: string;
};

export type ExpenseCategory =
  | "Food"
  | "Drinks"
  | "Grocery"
  | "Hostel"
  | "Transport"
  | "Other";

export type Expense = {
  id: string;
  title: string;
  amount: number;
  paidBy: "personA" | "personB";
  date: string;
  category: ExpenseCategory;
  notes?: string;
};

export type AppSettings = {
  personAName: string;
  personBName: string;
};

export type ExpenseFilters = {
  startDate?: string;
  endDate?: string;
  category?: ExpenseCategory | "All";
  paidBy?: "personA" | "personB" | "All";
};

export type SummaryData = {
  total: number;
  personAPaid: number;
  personBPaid: number;
  sharePerPerson: number;
  personABalance: number;
  personBBalance: number;
  debtor: "personA" | "personB" | null;
  creditor: "personA" | "personB" | null;
  amountOwed: number;
  isSettled: boolean;
};
