"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";

const inputClass =
  "w-full h-11 px-4 rounded-xl border border-gray-200 text-sm outline-none bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all font-medium";
const labelClass = "block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // If email confirmation is required, there's no session yet.
    if (!data.session) {
      setNeedsConfirmation(true);
      return;
    }

    router.push("/");
    router.refresh();
  }

  if (needsConfirmation) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-6 w-6 text-green-700" />
          </div>
          <p className="font-bold text-gray-800 text-sm">Check your email</p>
          <p className="text-xs text-gray-400 font-medium">
            We sent a confirmation link to <span className="text-gray-600">{email}</span>. Confirm it, then log in and share the same credentials with your roommate.
          </p>
          <Link
            href="/login"
            className="inline-block w-full h-11 leading-[44px] rounded-xl bg-gradient-to-b from-green-500 to-green-700 text-white font-bold text-sm shadow-md shadow-green-200"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-md shadow-green-200 text-2xl leading-none mb-3">
            💰
          </div>
          <h1 className="text-lg font-bold text-gray-900">Hostel Hisab</h1>
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            Create your shared account
          </p>
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
              autoComplete="new-password"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
            />
          </div>

          <div className="space-y-1">
            <label className={labelClass}>Confirm Password</label>
            <input
              type="password"
              required
              autoComplete="new-password"
              className={inputClass}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            <UserPlus className="h-4 w-4" />
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 font-medium mt-5">
          Already have an account?{" "}
          <Link href="/login" className="text-green-700 font-bold hover:underline">
            Log in
          </Link>
        </p>
        <p className="text-center text-[11px] text-gray-300 font-medium mt-3 px-4">
          Tip: create one account and share this email + password with your roommate so you both see the same expenses.
        </p>
      </div>
    </div>
  );
}
