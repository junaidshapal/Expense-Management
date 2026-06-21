"use client";

import { useState, useEffect } from "react";
import { Expense, ExpenseCategory, AppSettings } from "@/lib/types";
import { generateId, getTodayString } from "@/lib/utils";
import { CheckCircle2, ChevronDown, Sparkles } from "lucide-react";

const CATEGORIES: { value: ExpenseCategory; emoji: string }[] = [
  { value: "Food", emoji: "🍽️" },
  { value: "Drinks", emoji: "🥤" },
  { value: "Grocery", emoji: "🛒" },
  { value: "Hostel", emoji: "🏠" },
  { value: "Transport", emoji: "🚗" },
  { value: "Other", emoji: "📦" },
];

interface ExpenseFormProps {
  settings: AppSettings;
  editingExpense?: Expense | null;
  onSave: (expense: Expense) => void;
  onCancelEdit?: () => void;
}

const EMPTY_FORM = {
  title: "",
  amount: "",
  paidBy: "" as "personA" | "personB" | "",
  date: getTodayString(),
  category: "" as ExpenseCategory | "",
  notes: "",
};

export default function ExpenseForm({ settings, editingExpense, onSave, onCancelEdit }: ExpenseFormProps) {
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (editingExpense) {
      setForm({
        title: editingExpense.title,
        amount: String(editingExpense.amount),
        paidBy: editingExpense.paidBy,
        date: editingExpense.date,
        category: editingExpense.category,
        notes: editingExpense.notes || "",
      });
    } else {
      setForm({ ...EMPTY_FORM, date: getTodayString() });
    }
    setErrors({});
  }, [editingExpense]);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      e.amount = "Enter a valid amount greater than 0";
    if (!form.paidBy) e.paidBy = "Select who paid";
    if (!form.date) e.date = "Date is required";
    if (!form.category) e.category = "Select a category";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const expense: Expense = {
      id: editingExpense?.id ?? generateId(),
      title: form.title.trim(),
      amount: Number(form.amount),
      paidBy: form.paidBy as "personA" | "personB",
      date: form.date,
      category: form.category as ExpenseCategory,
      notes: form.notes.trim() || undefined,
    };

    onSave(expense);

    if (!editingExpense) {
      setForm({ ...EMPTY_FORM, date: getTodayString() });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
    setErrors({});
  }

  const inputClass = (err?: string) =>
    `w-full h-11 px-4 rounded-xl border text-sm outline-none transition-all bg-white
     ${err
       ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
       : "border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100"
     }`;

  const labelClass = "block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {showSuccess && (
        <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-3.5 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-4.5 w-4.5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-green-800">Expense added!</p>
            <p className="text-xs text-green-600">Ready to add another one</p>
          </div>
          <Sparkles className="h-4 w-4 text-green-400 ml-auto" />
        </div>
      )}

      {editingExpense && (
        <div className="rounded-2xl bg-blue-50 border border-blue-200 p-3.5 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-blue-100 flex items-center justify-center text-sm shrink-0">✏️</div>
          <p className="text-blue-800 text-sm font-semibold">Editing — make your changes and save</p>
        </div>
      )}

      {/* Title */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
        <div>
          <label className={labelClass}>Description</label>
          <input
            className={inputClass(errors.title)}
            placeholder="e.g. Dinner at dhaba"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          {errors.title && <p className="text-xs text-red-500 mt-1 font-medium">{errors.title}</p>}
        </div>

        {/* Amount */}
        <div>
          <label className={labelClass}>Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">Rs.</span>
            <input
              className={`${inputClass(errors.amount)} pl-10`}
              type="number"
              min="0"
              step="any"
              placeholder="0"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            />
          </div>
          {errors.amount && <p className="text-xs text-red-500 mt-1 font-medium">{errors.amount}</p>}
        </div>

        {/* Paid by + Date */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Paid By</label>
            <div className="relative">
              <select
                className={`${inputClass(errors.paidBy)} appearance-none cursor-pointer pr-9`}
                value={form.paidBy}
                onChange={(e) => setForm((f) => ({ ...f, paidBy: e.target.value as "personA" | "personB" }))}
              >
                <option value="">Select...</option>
                <option value="personA">{settings.personAName}</option>
                <option value="personB">{settings.personBName}</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            {errors.paidBy && <p className="text-xs text-red-500 mt-1 font-medium">{errors.paidBy}</p>}
          </div>

          <div>
            <label className={labelClass}>Date</label>
            <input
              className={inputClass(errors.date)}
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
            {errors.date && <p className="text-xs text-red-500 mt-1 font-medium">{errors.date}</p>}
          </div>
        </div>
      </div>

      {/* Category chips */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <label className={labelClass}>Category</label>
        <div className="grid grid-cols-3 gap-2 mt-1">
          {CATEGORIES.map(({ value, emoji }) => (
            <button
              key={value}
              type="button"
              onClick={() => setForm((f) => ({ ...f, category: value }))}
              className={`flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl border text-xs font-semibold transition-all active:scale-95 ${
                form.category === value
                  ? "bg-gradient-to-b from-green-500 to-green-700 border-green-600 text-white shadow-md shadow-green-200"
                  : "bg-white border-gray-150 text-gray-500 hover:border-green-200 hover:bg-green-50"
              }`}
            >
              <span className="text-xl leading-none">{emoji}</span>
              <span className="leading-none">{value}</span>
            </button>
          ))}
        </div>
        {errors.category && <p className="text-xs text-red-500 mt-2 font-medium">{errors.category}</p>}
      </div>

      {/* Notes */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <label className={labelClass}>
          Notes <span className="normal-case font-normal text-gray-400 tracking-normal">(optional)</span>
        </label>
        <textarea
          className={`${inputClass()} h-auto py-3 resize-none`}
          placeholder="Any extra details..."
          rows={2}
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 h-12 rounded-xl bg-gradient-to-b from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 active:scale-[0.98] text-white font-bold text-sm transition-all shadow-md shadow-green-200"
        >
          {editingExpense ? "Save Changes" : "Add Expense"}
        </button>
        {editingExpense && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="h-12 px-5 rounded-xl border border-gray-200 bg-white text-gray-600 font-semibold text-sm hover:bg-gray-50 active:scale-[0.98] transition-all"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
