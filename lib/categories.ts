import { ExpenseCategory } from "./types";
import {
  UtensilsCrossed,
  CupSoda,
  ShoppingCart,
  Home,
  Car,
  Package,
  type LucideIcon,
} from "lucide-react";

export const CATEGORIES: ExpenseCategory[] = ["Food", "Drinks", "Grocery", "Hostel", "Transport", "Other"];

export const CATEGORY_ICONS: Record<ExpenseCategory, LucideIcon> = {
  Food: UtensilsCrossed,
  Drinks: CupSoda,
  Grocery: ShoppingCart,
  Hostel: Home,
  Transport: Car,
  Other: Package,
};

export const CATEGORY_COLORS: Record<ExpenseCategory, { bg: string; text: string; border: string }> = {
  Food:      { bg: "bg-orange-50",  text: "text-orange-700", border: "border-orange-200" },
  Drinks:    { bg: "bg-sky-50",     text: "text-sky-700",    border: "border-sky-200" },
  Grocery:   { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  Hostel:    { bg: "bg-violet-50",  text: "text-violet-700", border: "border-violet-200" },
  Transport: { bg: "bg-amber-50",   text: "text-amber-700",  border: "border-amber-200" },
  Other:     { bg: "bg-gray-50",    text: "text-gray-600",   border: "border-gray-200" },
};
