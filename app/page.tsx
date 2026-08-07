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
  Users,
  Target,
  Zap,
  CheckCircle2,
  FileSpreadsheet,
  Rocket,
  Briefcase,
  Megaphone,
  UserCheck,
  Tag,
  Lock,
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
              Dootx
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
                    className="text-zinc-300 hover:text-white hover:bg-zinc-900 cursor-pointer text-sm"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-violet-600 hover:bg-violet-500 text-white font-semibold cursor-pointer shadow-lg shadow-violet-600/25 text-sm">
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
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />

          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-sm text-violet-400 font-medium mb-8">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Google Gmail API Engine v2.0</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            Personalized Bulk Email Campaigns Powered by{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 via-purple-300 to-indigo-400">
              Google Gmail API
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            Dootx is an enterprise-grade campaign dispatch platform that connects directly to your verified Google account to deliver personalized, high-inbox-rate emails to your target audience.
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
        </section>

        {/* SECTION 1: WHAT DOOTX IS */}
        <section className="py-16 bg-zinc-900/30 border-y border-zinc-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-300 text-xs font-semibold uppercase tracking-wider">
                <Target className="h-3.5 w-3.5" /> What Is Dootx?
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Authentic Gmail Dispatch Engine Built for High Deliverability
              </h2>
              <p className="text-zinc-400 text-base leading-relaxed">
                Unlike traditional SMTP platforms that route messages through shared, low-reputation IP addresses, <strong>Dootx</strong> connects to your own Google account via OAuth 2.0. Every campaign is dispatched directly through Google Gmail API v1—giving your emails authentic sender signatures that bypass spam filters and land directly in the primary inbox.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                  <Cpu className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Direct Gmail API v1</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Sends RFC2822 MIME-encoded messages straight through official Google API endpoints using your authorized identity.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Lock className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white">AES-256 Token Encryption</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Google Refresh Tokens are encrypted with AES-256-CBC using secret keys. Access tokens are ephemerally generated on demand.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Quota Protection Shield</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Monitors daily email limits (500 emails/day) with automatic UTC date resets to protect your Google account reputation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: WHAT DOOTX DOES */}
        <section className="py-20 max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-300 text-xs font-semibold uppercase tracking-wider">
              <Zap className="h-3.5 w-3.5" /> What Dootx Does
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Powerful Features from Draft to Inbox
            </h2>
            <p className="text-zinc-400 text-base leading-relaxed">
              Everything you need to turn subscriber contact spreadsheets into personalized, high-converting bulk email broadcasts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="p-7 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4 hover:border-violet-500/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-500/10 border border-violet-500/20 rounded-lg text-violet-400">
                  <Tag className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-white">Dynamic Merge Tags & Personalization</h3>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Define dynamic tags such as <code className="text-violet-300 bg-violet-950/60 px-1.5 py-0.5 rounded text-xs font-mono">{`{{name}}`}</code>, <code className="text-violet-300 bg-violet-950/60 px-1.5 py-0.5 rounded text-xs font-mono">{`{{company}}`}</code>, and <code className="text-violet-300 bg-violet-950/60 px-1.5 py-0.5 rounded text-xs font-mono">{`{{position}}`}</code>. Dootx automatically substitutes values per recipient before dispatching.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-7 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4 hover:border-violet-500/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400">
                  <FileSpreadsheet className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-white">Spreadsheet Data Grid & CSV Importer</h3>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Upload CSV files or manage recipient rows directly inside an interactive data grid. Column headers auto-map to custom merge variables instantly.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-7 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4 hover:border-violet-500/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
                  <UserCheck className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-white">Live Email Preview Modal</h3>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Select any recipient from your list and preview exact rendered subject lines and email body text before launching your campaign.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-7 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4 hover:border-violet-500/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-white">Real-Time Telemetry & Progress Logs</h3>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Watch execution status live with 1.5-second polling, line-by-line transmission log streams, and delivery status counters.
              </p>
            </div>
          </div>

          {/* Code/Terminal Visual Preview Box */}
          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl space-y-4 max-w-4xl mx-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-sm text-zinc-500 font-mono">
                dootx-personalized-dispatcher.log
              </span>
            </div>

            <div className="font-mono text-sm space-y-2 text-zinc-400">
              <p className="text-violet-400">
                [System] Initialized Gmail API personalized dispatch engine.
              </p>
              <p className="text-zinc-400">
                [OAuth] Authenticating connected sender identity: &lt;user@domain.com&gt;... Success.
              </p>
              <p className="text-zinc-300">
                [Sending] Personalizing & dispatching via Gmail API to john@company.com...
              </p>
              <p className="text-emerald-400">
                [Success] Delivered personalized email to john@company.com (Msg ID: 18f912a4b8c9d0e1)
              </p>
              <p className="text-zinc-300">
                [Sending] Personalizing & dispatching next item to alice@startup.io...
              </p>
              <p className="text-emerald-400">
                [Success] Delivered personalized email to alice@startup.io (Msg ID: 18f912a4b8c9d0e2)
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: WHO DOOTX IS FOR */}
        <section className="py-20 bg-zinc-900/40 border-t border-zinc-900">
          <div className="max-w-7xl mx-auto px-6 space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-300 text-xs font-semibold uppercase tracking-wider">
                <Users className="h-3.5 w-3.5" /> Who Dootx Is For
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Built for Teams & Professionals Who Value Deliverability
              </h2>
              <p className="text-zinc-400 text-base leading-relaxed">
                Whether pitching investors, connecting with sales prospects, or updating subscribers, Dootx empowers high-impact communicators.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Audience 1 */}
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                  <Rocket className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Founders & Builders</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Pitch investors, announce product launches, and onboard early beta users directly from your primary Gmail address.
                </p>
              </div>

              {/* Audience 2 */}
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Briefcase className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Sales & Outreach Teams</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Send tailored cold emails with custom variables (<code className="text-indigo-300 font-mono">{`{{company}}`}</code>, <code className="text-indigo-300 font-mono">{`{{position}}`}</code>) with high response rates.
                </p>
              </div>

              {/* Audience 3 */}
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Megaphone className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Marketers & Creators</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Distribute newsletter updates, course announcements, and community blasts effortlessly without complex server configs.
                </p>
              </div>

              {/* Audience 4 */}
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Agencies & Consultants</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Execute client email outreach campaigns safely using authenticated Google user accounts and daily quota tracking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION */}
        <section className="py-20 max-w-5xl mx-auto px-6 text-center">
          <div className="p-10 rounded-3xl bg-linear-to-b from-violet-950/40 to-zinc-950 border border-violet-500/30 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Upgrade Your Email Campaign Outreach?
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
              Sign up for Dootx today, connect your Google account in 1 click, and start dispatching personalized bulk campaigns.
            </p>
            <div className="pt-2 flex justify-center">
              <Link href={user ? "/dashboard" : "/signup"}>
                <Button
                  size="lg"
                  className="px-8 py-6 text-base bg-violet-600 hover:bg-violet-500 text-white font-bold cursor-pointer shadow-xl shadow-violet-600/30"
                >
                  {user ? "Go to Dashboard" : "Create Free Account"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8 text-center text-sm text-zinc-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <p>© {new Date().getFullYear()} Dootx Systems. All rights reserved.</p>
            <span className="hidden sm:inline text-zinc-800">•</span>
            <p className="text-zinc-400">
              Developed by <strong className="text-white font-semibold">Niraj Pujari</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-zinc-400">
            <a
              href="mailto:nirajrokx99@gmail.com"
              className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
            >
              nirajrokx99@gmail.com
            </a>
            <Link href="/about" className="hover:text-white transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
