"use client";

import { useRouter } from "next/navigation";
import { Home, PlusCircle, List, Calculator, Settings, LogOut, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

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
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      {/* Top header */}
      <header className="sticky top-0 z-40 w-full bg-green-600">
        <div className="flex h-14 items-center px-4 gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-white/15 shrink-0">
            <Wallet className="h-4 w-4 text-white" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-white leading-tight truncate">Hostel Hisab</p>
            <p className="text-[11px] text-green-100 leading-tight">Expense Tracker</p>
          </div>
          <button
            onClick={handleLogout}
            className="ml-auto flex items-center justify-center w-8 h-8 rounded-md text-green-100 hover:text-white hover:bg-white/15 transition-colors shrink-0"
            title="Log out"
          >
            <LogOut className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </header>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-gray-200">
        <div className="flex items-center justify-around h-[58px] max-w-[430px] mx-auto px-1">
          {tabs.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-[10px] font-medium transition-colors",
                  isActive ? "text-green-700" : "text-gray-400 hover:text-gray-600"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-11 h-6 rounded-md",
                    isActive && "nav-active-pill bg-green-600"
                  )}
                >
                  <Icon
                    className={cn("h-[18px] w-[18px]", isActive ? "text-white" : "")}
                    strokeWidth={isActive ? 2.25 : 1.75}
                  />
                </div>
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
