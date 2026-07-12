"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { LogIn, AlertCircle, Wallet } from "lucide-react";

const inputClass =
  "w-full h-10 px-3.5 rounded-md border border-gray-200 text-sm outline-none bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/15 transition-colors";
const labelClass = "block text-xs font-medium text-gray-500 mb-1.5";

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
          <div className="w-11 h-11 rounded-lg bg-green-600 flex items-center justify-center mb-3">
            <Wallet className="h-5 w-5 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-lg font-semibold text-gray-900">Hostel Hisab</h1>
          <p className="text-xs text-gray-400 mt-0.5">Log in to your shared account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
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
            <p className="text-xs text-red-600 flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={2} /> {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-md bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <LogIn className="h-4 w-4" strokeWidth={2} />
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-5">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-green-700 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
