"use client";

import { useState } from "react";
import { useRouter } from "@/lib/next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Sign in failed.");
        setLoading(false);
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Could not reach the server. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-forest-950 px-5">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(184,149,82,0.18),transparent_55%)]" />
      <div className="relative w-full max-w-md">
        <a href="/" className="mb-8 block text-center font-display text-xl font-extrabold tracking-[0.18em] text-ivory">
          WILLOW GARTH
        </a>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-card backdrop-blur-sm">
          <p className="mb-1 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-gold">
            Admin Access
          </p>
          <h1 className="mb-6 font-serif text-2xl text-ivory">Sign in to the dashboard</h1>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-ivory/60">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-ivory outline-none transition focus:border-gold"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-ivory/60">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-ivory outline-none transition focus:border-gold"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-2.5 text-xs text-red-200">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gold px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-forest-950 transition hover:bg-gold-light disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-xs text-ivory/40">
          Authorized personnel only. Create accounts in Supabase → Authentication → Users.
        </p>
      </div>
    </div>
  );
}
