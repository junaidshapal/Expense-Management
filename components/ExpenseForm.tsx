"use client";

import { useState } from "react";
import { Expense, ExpenseCategory, AppSettings } from "@/lib/types";
import { generateId, getTodayString, cn } from "@/lib/utils";
import { CATEGORIES, CATEGORY_ICONS } from "@/lib/categories";
import { CheckCircle2, ChevronDown } from "lucide-react";

interface ExpenseFormProps {
  settings: AppSettings;
  onSave: (expense: Expense) => void;
}

const EMPTY_FORM = {
  title: "",
  amount: "",
  paidBy: "" as "personA" | "personB" | "",
  date: getTodayString(),
  category: "" as ExpenseCategory | "",
  notes: "",
};

export default function ExpenseForm({ settings, onSave }: ExpenseFormProps) {
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

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
      id: generateId(),
      title: form.title.trim(),
      amount: Number(form.amount),
      paidBy: form.paidBy as "personA" | "personB",
      date: form.date,
      category: form.category as ExpenseCategory,
      notes: form.notes.trim() || undefined,
      settled: false,
    };

    onSave(expense);

    setForm({ ...EMPTY_FORM, date: getTodayString() });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setErrors({});
  }

  const inputClass = (err?: string) =>
    cn(
      "w-full h-10 px-3.5 rounded-md border text-sm outline-none transition-colors bg-white",
      err
        ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/15"
        : "border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/15"
    );

  const labelClass = "block text-xs font-medium text-gray-500 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {showSuccess && (
        <div className="flex items-center gap-3 rounded-lg bg-green-50 border border-green-200 p-3">
          <CheckCircle2 className="h-4.5 w-4.5 text-green-600 shrink-0" strokeWidth={2} />
          <div>
            <p className="text-sm font-medium text-green-900">Expense added</p>
            <p className="text-xs text-green-700/80">Ready to add another one</p>
          </div>
        </div>
      )}

      {/* Title */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        <div>
          <label className={labelClass}>Description</label>
          <input
            className={inputClass(errors.title)}
            placeholder="e.g. Dinner at dhaba"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
        </div>

        {/* Amount */}
        <div>
          <label className={labelClass}>Amount</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">Rs.</span>
            <input
              className={cn(inputClass(errors.amount), "pl-9")}
              type="number"
              min="0"
              step="any"
              placeholder="0"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            />
          </div>
          {errors.amount && <p className="text-xs text-red-600 mt-1">{errors.amount}</p>}
        </div>

        {/* Paid by + Date */}
        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3">
          <div className="min-w-0">
            <label className={labelClass}>Paid by</label>
            <div className="relative">
              <select
                className={cn(inputClass(errors.paidBy), "appearance-none cursor-pointer pr-9")}
                value={form.paidBy}
                onChange={(e) => setForm((f) => ({ ...f, paidBy: e.target.value as "personA" | "personB" }))}
              >
                <option value="">Select...</option>
                <option value="personA">{settings.personAName}</option>
                <option value="personB">{settings.personBName}</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" strokeWidth={2} />
            </div>
            {errors.paidBy && <p className="text-xs text-red-600 mt-1">{errors.paidBy}</p>}
          </div>

          <div className="min-w-0">
            <label className={labelClass}>Date</label>
            <input
              className={inputClass(errors.date)}
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
            {errors.date && <p className="text-xs text-red-600 mt-1">{errors.date}</p>}
          </div>
        </div>
      </div>

      {/* Category chips */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <label className={labelClass}>Category</label>
        <div className="grid grid-cols-3 gap-2 mt-1">
          {CATEGORIES.map((value) => {
            const Icon = CATEGORY_ICONS[value];
            const isSelected = form.category === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setForm((f) => ({ ...f, category: value }))}
                className={cn(
                  "flex flex-col items-center gap-1.5 py-3 px-1 rounded-md border text-xs font-medium transition-colors",
                  isSelected
                    ? "bg-green-600 border-green-600 text-white"
                    : "bg-white border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50/50"
                )}
              >
                <Icon className="h-4.5 w-4.5" strokeWidth={2} />
                <span className="leading-none">{value}</span>
              </button>
            );
          })}
        </div>
        {errors.category && <p className="text-xs text-red-600 mt-2">{errors.category}</p>}
      </div>

      {/* Notes */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <label className={labelClass}>
          Notes <span className="normal-case font-normal text-gray-400">(optional)</span>
        </label>
        <textarea
          className={cn(inputClass(), "h-auto py-2.5 resize-none")}
          placeholder="Any extra details..."
          rows={2}
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full h-10 rounded-md bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-medium text-sm transition-colors"
      >
        Add expense
      </button>
    </form>
  );
}
