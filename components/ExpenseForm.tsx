"use client";

import { useState, useEffect } from "react";
import { Expense, ExpenseCategory, AppSettings } from "@/lib/types";
import { generateId, getTodayString } from "@/lib/utils";
import { CheckCircle2, ChevronDown } from "lucide-react";

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

  const labelClass = "block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {showSuccess && (
        <div className="flex items-center gap-3 rounded-xl bg-green-50 border border-green-200 p-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
          <span className="text-sm font-medium text-green-800">Expense added successfully!</span>
        </div>
      )}

      {editingExpense && (
        <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 text-blue-800 text-sm font-medium">
          ✏️ Editing — make your changes and save
        </div>
      )}

      {/* Title */}
      <div>
        <label className={labelClass}>Description</label>
        <input
          className={inputClass(errors.title)}
          placeholder="e.g. Dinner at dhaba"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        />
        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
      </div>

      {/* Amount */}
      <div>
        <label className={labelClass}>Amount</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">Rs.</span>
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
        {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
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
          {errors.paidBy && <p className="text-xs text-red-500 mt-1">{errors.paidBy}</p>}
        </div>

        <div>
          <label className={labelClass}>Date</label>
          <input
            className={inputClass(errors.date)}
            type="date"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
          />
          {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
        </div>
      </div>

      {/* Category chips */}
      <div>
        <label className={labelClass}>Category</label>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map(({ value, emoji }) => (
            <button
              key={value}
              type="button"
              onClick={() => setForm((f) => ({ ...f, category: value }))}
              className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border text-xs font-medium transition-all ${
                form.category === value
                  ? "bg-green-600 border-green-600 text-white shadow-sm"
                  : "bg-white border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50"
              }`}
            >
              <span className="text-lg">{emoji}</span>
              <span>{value}</span>
            </button>
          ))}
        </div>
        {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
      </div>

      {/* Notes */}
      <div>
        <label className={labelClass}>Notes <span className="normal-case font-normal text-gray-400">(optional)</span></label>
        <textarea
          className={`${inputClass()} h-auto py-3 resize-none`}
          placeholder="Any extra details..."
          rows={2}
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 h-12 rounded-xl bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold text-sm transition-colors shadow-sm"
        >
          {editingExpense ? "Save Changes" : "Add Expense"}
        </button>
        {editingExpense && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="h-12 px-5 rounded-xl border border-gray-200 bg-white text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
