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
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-green-100/80 shadow-sm">
        <div className="flex h-14 items-center px-4 gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-green-700 shadow-md shadow-green-200">
            <span className="text-lg leading-none">💰</span>
            <div className="absolute inset-0 rounded-xl bg-white/10" />
          </div>
          <div>
            <p className="font-bold text-base text-green-800 leading-none tracking-tight">Hostel Hisab</p>
            <p className="text-[10px] text-green-500 mt-0.5 font-medium">Expense Tracker</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] text-green-500 font-medium">Live</span>
          </div>
        </div>
      </header>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-green-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-around h-[62px] max-w-[430px] mx-auto px-1">
          {tabs.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-[10px] font-semibold transition-all duration-200 active:scale-95",
                  isActive ? "text-green-700" : "text-gray-400 hover:text-green-500"
                )}
              >
                {/* Active background pill */}
                {isActive && (
                  <div className="nav-active-pill absolute top-2 left-1/2 -translate-x-1/2 w-12 h-7 rounded-full bg-green-100" />
                )}
                <div className="relative flex items-center justify-center w-12 h-7">
                  <Icon
                    className={cn(
                      "h-[18px] w-[18px] transition-all duration-200",
                      isActive ? "stroke-[2.5px] text-green-600" : "stroke-[1.8px]"
                    )}
                  />
                </div>
                <span className={cn("transition-all duration-200", isActive ? "text-green-700" : "")}>{label}</span>
                {/* Active dot indicator */}
                {isActive && (
                  <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-green-500" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
