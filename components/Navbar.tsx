"use client";

import { Home, PlusCircle, List, Calculator, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "dashboard" | "add" | "expenses" | "settlement" | "settings";

interface NavbarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Home", icon: Home },
  { id: "add", label: "Add", icon: PlusCircle },
  { id: "expenses", label: "History", icon: List },
  { id: "settlement", label: "Hisab", icon: Calculator },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  return (
    <>
      {/* Top header */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-green-100 shadow-sm">
        <div className="flex h-14 items-center px-4 gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-green-600 shadow-sm">
            <span className="text-lg leading-none">💰</span>
          </div>
          <div>
            <p className="font-bold text-base text-green-800 leading-none">Hostel Hisab</p>
            <p className="text-[10px] text-green-500 mt-0.5">Expense Tracker</p>
          </div>
        </div>
      </header>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-green-100 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-around h-[60px] max-w-[430px] mx-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-[11px] font-medium transition-all",
                activeTab === id
                  ? "text-green-700"
                  : "text-gray-400 hover:text-green-500"
              )}
            >
              <div className={cn(
                "flex items-center justify-center w-10 h-7 rounded-lg transition-all",
                activeTab === id ? "bg-green-100" : ""
              )}>
                <Icon className={cn(
                  "h-[18px] w-[18px] transition-all",
                  activeTab === id ? "stroke-[2.5px]" : "stroke-[1.8px]"
                )} />
              </div>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
