"use client";

import Link from "next/link";
import { useAuth } from "@/context/Auth";
import { Button } from "@/components/ui/button";
import {
  Mail,
  ShieldCheck,
  BarChart3,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Cpu,
} from "lucide-react";

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-violet-500 selection:text-white flex flex-col justify-between">
      {/* Top Navbar */}
      <nav className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] group-hover:bg-violet-500 transition-colors">
              <Mail className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Bulkmail
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {loading ? (
              <div className="h-9 w-24 bg-zinc-900 rounded-md animate-pulse" />
            ) : user ? (
              <Link href="/dashboard">
                <Button className="bg-violet-600 hover:bg-violet-500 text-white font-semibold cursor-pointer shadow-lg shadow-violet-600/25">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="text-zinc-300 hover:text-white hover:bg-zinc-900 cursor-pointer"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-violet-600 hover:bg-violet-500 text-white font-semibold cursor-pointer shadow-lg shadow-violet-600/25">
                    Get Started Free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Hero Section */}
      <main className="flex-1">
        <section className="relative pt-20 pb-16 px-6 max-w-7xl mx-auto text-center">
          {/* Background Ambient Glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />

          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-sm text-violet-400 font-medium mb-8">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Google Gmail API Engine v2.0</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            Deliver Bulk Email Campaigns at Scale with{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 via-purple-300 to-indigo-400">
              Zero Bottlenecks
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            High-performance bulk email dispatch platform powered by Google Gmail
            API v1 with OAuth 2.0 user account authorization, real-time streaming telemetry,
            and non-blocking background queueing.
          </p>

          {/* Action CTA Group */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={user ? "/dashboard" : "/signup"}>
              <Button
                size="lg"
                className="w-full sm:w-auto px-8 py-6 text-base bg-violet-600 hover:bg-violet-500 text-white font-bold cursor-pointer shadow-xl shadow-violet-600/30"
              >
                {user ? "Launch Dashboard" : "Start Sending Free"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto px-8 py-6 text-base border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 cursor-pointer"
              >
                Existing Account
              </Button>
            </Link>
          </div>

          {/* Quick Metrics Cards */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
            <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 backdrop-blur-sm">
              <div className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-4">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Google OAuth 2.0 & Gmail API
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Secure user account authorization via OAuth 2.0 with AES-256
                encrypted refresh token storage and direct Gmail API v1 dispatch.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 backdrop-blur-sm">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Live Progress Telemetry
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Monitor email delivery execution line-by-line with 1.5-second
                live status polling and real-time execution logs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 backdrop-blur-sm">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Role-Based Security
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Hardened JWT middleware proxy protects API routes and enforces
                granular user & administrator privileges.
              </p>
            </div>
          </div>
        </section>

        {/* Feature Check List Section */}
        <section className="py-16 bg-zinc-900/40 border-t border-zinc-900">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight mb-4">
                Everything You Need for Enterprise Email Dispatch
              </h2>
              <p className="text-zinc-400 text-base leading-relaxed mb-6">
                BulkMail provides complete management of drafts, recipient
                lists, transmission logs, and system metrics out of the box.
              </p>

              <div className="space-y-3">
                {[
                  "Google Gmail API v1 & OAuth 2.0 integration",
                  "Non-blocking background sending queue",
                  "Prisma 7 PostgreSQL database integration",
                  "AES-256 encrypted OAuth token storage",
                  "Admin control center & telemetry dashboard",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-violet-400 shrink-0" />
                    <span className="text-zinc-200 text-sm font-medium">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Preview Box */}
            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-sm text-zinc-500 font-mono">
                  bulkmail-dispatcher.log
                </span>
              </div>

              <div className="font-mono text-sm space-y-2 text-zinc-400">
                <p className="text-violet-400">
                  [System] Initializing campaign: &quot;Product Update
                  Announcement&quot;
                </p>
                <p className="text-zinc-400">
                  [OAuth] Refreshing Google OAuth access token... Authorized.
                </p>
                <p className="text-zinc-400">
                  [Sending] Encoding RFC2822 MIME message & dispatching via Gmail API...
                </p>
                <p className="text-emerald-400">
                  [Success] Delivered to user@example.com (Gmail Msg ID:
                  18f912a4b8c9d0e1)
                </p>
                <p className="text-zinc-400">
                  [Sending] Dispatching next item to team@example.com...
                </p>
                <p className="text-emerald-400">
                  [Success] Delivered to team@example.com (Gmail Msg ID:
                  18f912a4b8c9d0e2)
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8 text-center text-sm text-zinc-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} BulkMail Systems. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-zinc-400">
            <Link
              href="/dashboard"
              className="hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="hover:text-white transition-colors">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
