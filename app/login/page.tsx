"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { LogIn, AlertCircle } from "lucide-react";

const inputClass =
  "w-full h-11 px-4 rounded-xl border border-gray-200 text-sm outline-none bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all font-medium";
const labelClass = "block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-md shadow-green-200 text-2xl leading-none mb-3">
            💰
          </div>
          <h1 className="text-lg font-bold text-gray-900">Hostel Hisab</h1>
          <p className="text-xs text-gray-400 font-medium mt-0.5">Log in to your shared account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="space-y-1">
            <label className={labelClass}>Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1">
            <label className={labelClass}>Password</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 font-medium flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-gradient-to-b from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 active:scale-[0.98] text-white font-bold text-sm transition-all shadow-md shadow-green-200 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <LogIn className="h-4 w-4" />
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 font-medium mt-5">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-green-700 font-bold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
