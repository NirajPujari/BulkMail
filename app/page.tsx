"use client";

import Link from "next/link";
import { useAuth } from "@/context/Auth";
import { Button } from "@/components/ui/button";
import {
  Mail,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Cpu,
  Users,
  Target,
  Zap,
  Rocket,
  Briefcase,
  Megaphone,
  UserCheck,
  Lock,
  FileText,
  MessageSquare,
  Info,
  ExternalLink,
} from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-violet-500 selection:text-white flex flex-col justify-between">
      <main className="flex-1">
        <section className="relative pt-10 pb-20 px-6 max-w-7xl mx-auto text-center">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />

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
            Dootx is an enterprise email dispatch platform developed by{" "}
            <strong>Niraj Pujari</strong>. It connects directly to your verified
            Google account via OAuth 2.0 to deliver personalized,
            high-inbox-rate emails to your target audience.
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

            <Link href="/privacy">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto px-8 py-6 text-base border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 cursor-pointer"
              >
                <Lock className="mr-2 h-4 w-4 text-violet-400" />
                Read Privacy Policy
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
                Unlike traditional bulk mailing tools that route messages
                through shared third-party SMTP servers with low IP reputation,{" "}
                <strong>Dootx</strong> links directly to your authorized Google
                account. Every campaign is generated as an RFC2822 MIME message
                and sent via official Google Gmail API v1 endpoints
                (`https://gmail.googleapis.com/gmail/v1/users/me/messages/send`)—ensuring
                your emails land straight in primary inboxes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                  <Cpu className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Direct Gmail API v1
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Sends base64url RFC2822 MIME messages directly using official
                  Google API endpoints under explicit user consent.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Lock className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  AES-256 Token Encryption
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Google OAuth Refresh Tokens are stored encrypted with
                  AES-256-CBC. Access tokens are ephemerally generated on demand
                  and never saved permanently.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Quota Protection Shield
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Monitors daily email limits (500 emails/day) with automatic
                  UTC date resets to protect your Google account reputation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: WHAT DOOTX DOES (FULL APP FUNCTIONALITY STEP-BY-STEP) */}
        <section className="py-20 max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-300 text-xs font-semibold uppercase tracking-wider">
              <Zap className="h-3.5 w-3.5" /> App Functionality Walkthrough
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              How Dootx Works (Step-by-Step)
            </h2>
            <p className="text-zinc-400 text-base leading-relaxed">
              Dootx provides an intuitive 4-step workflow to turn contact lists
              into personalized, high-converting email broadcasts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Step 1 */}
            <div className="p-7 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4 hover:border-violet-500/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-violet-500/10 border border-violet-500/20 rounded-xl text-violet-400 font-extrabold font-mono text-sm">
                  01
                </div>
                <h3 className="text-xl font-bold text-white">
                  Connect Google OAuth 2.0 Account
                </h3>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Connect your Gmail account in 1 click via secure Google OAuth
                2.0. Dootx requests explicit user consent for the{" "}
                <code className="text-violet-300 font-mono text-xs bg-violet-950/60 px-1 py-0.5 rounded">
                  gmail.send
                </code>{" "}
                scope to transmit campaigns from your domain.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-7 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4 hover:border-violet-500/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 font-extrabold font-mono text-sm">
                  02
                </div>
                <h3 className="text-xl font-bold text-white">
                  Recipient Grid & Dynamic Variables
                </h3>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Upload CSV spreadsheets or manage recipient data inside an
                interactive grid. Add unlimited custom variables such as{" "}
                <code className="text-blue-300 font-mono text-xs bg-blue-950/60 px-1 py-0.5 rounded">{`{{name}}`}</code>
                ,{" "}
                <code className="text-blue-300 font-mono text-xs bg-blue-950/60 px-1 py-0.5 rounded">{`{{company}}`}</code>
                , or{" "}
                <code className="text-blue-300 font-mono text-xs bg-blue-950/60 px-1 py-0.5 rounded">{`{{position}}`}</code>
                .
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-7 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4 hover:border-violet-500/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 font-extrabold font-mono text-sm">
                  03
                </div>
                <h3 className="text-xl font-bold text-white">
                  Composer & Live Recipient Preview
                </h3>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Compose templates with clickable tag insertion chips. Open the
                Live Preview modal to inspect rendered subject lines and email
                body text for any individual recipient prior to dispatching.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-7 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4 hover:border-violet-500/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 font-extrabold font-mono text-sm">
                  04
                </div>
                <h3 className="text-xl font-bold text-white">
                  Gmail API Dispatch & Live Telemetry
                </h3>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Launch your campaign into a non-blocking background queue.
                Monitor real-time status line-by-line, daily quota usage, and
                individual message delivery IDs.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: GOOGLE OAUTH DATA & SCOPE TRANSPARENCY (CRITICAL FOR OAUTH VERIFICATION) */}
        <section className="py-16 bg-zinc-900/40 border-y border-zinc-900">
          <div className="max-w-5xl mx-auto px-6 space-y-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> Google
                OAuth Transparency & Compliance
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Why Dootx Requests Google Account Data
              </h2>
              <p className="text-zinc-400 text-sm max-w-2xl mx-auto">
                We believe in 100% transparency regarding why our application
                requests Google OAuth access and how user data is handled.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-violet-950/20 border border-violet-500/30 text-violet-200 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-violet-500/20 pb-3">
                <span className="font-bold text-white text-base">
                  Google API Limited Use Disclosure
                </span>
                <Link
                  href="/privacy"
                  className="text-xs text-violet-300 hover:text-white underline flex items-center gap-1 font-mono"
                >
                  View Full Privacy Policy <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Dootx&apos;s use and transfer of information received from
                Google APIs to any other app will adhere to the{" "}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-400 underline hover:text-violet-300 font-semibold"
                >
                  Google API Services User Data Policy
                </a>
                , including the <strong>Limited Use</strong> requirements. We do
                NOT sell, rent, or share user data, nor do we use Google user
                data to train AI/ML models.
              </p>
            </div>

            {/* Scope Breakdown Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-violet-400">
                  <Mail className="h-4 w-4" />{" "}
                  https://www.googleapis.com/auth/gmail.send
                </div>
                <h4 className="text-sm font-bold text-white">
                  Gmail Send Authorization
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Used exclusively to transmit user-composed email templates to
                  your specified campaign recipients via Google Gmail API v1 on
                  your behalf.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-blue-400">
                  <UserCheck className="h-4 w-4" /> openid, email, profile
                </div>
                <h4 className="text-sm font-bold text-white">
                  Identity & Profile Verification
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Used to authenticate user login sessions and display your
                  connected Google email address (`googleEmail`) in the
                  dashboard composer.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: WHO DOOTX IS FOR */}
        <section className="py-20 max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-300 text-xs font-semibold uppercase tracking-wider">
              <Users className="h-3.5 w-3.5" /> Who Dootx Is For
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Built for Teams & Professionals Who Value Deliverability
            </h2>
            <p className="text-zinc-400 text-base leading-relaxed">
              Whether pitching investors, connecting with sales prospects, or
              updating subscribers, Dootx empowers high-impact communicators.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <Rocket className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Founders & Builders
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Pitch investors, announce product updates, and onboard early
                beta users directly from your verified domain address.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Briefcase className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Sales & Outreach Teams
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Send tailored cold emails with custom variables (
                <code className="text-indigo-300 font-mono">{`{{company}}`}</code>
                ,{" "}
                <code className="text-indigo-300 font-mono">{`{{position}}`}</code>
                ) with high response rates.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Megaphone className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Marketers & Creators
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Distribute newsletters, course announcements, and community
                updates effortlessly without complex server configs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Agencies & Consultants
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Execute client email outreach campaigns safely using
                authenticated Google accounts and daily quota tracking.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 5: PUBLIC DIRECT ACCESS NAVIGATION GRID (NO LOGIN REQUIRED) */}
        <section className="py-16 bg-zinc-900/30 border-t border-zinc-900">
          <div className="max-w-7xl mx-auto px-6 space-y-10">
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Explore All Dootx Platform & Compliance Pages
              </h2>
              <p className="text-zinc-400 text-sm">
                All informational and legal pages are publicly accessible
                without requiring an account or login.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <Link
                href="/about"
                className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-violet-500/50 transition-all text-center group"
              >
                <Info className="h-6 w-6 text-violet-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-white block">
                  About Dootx
                </span>
                <span className="text-[11px] text-zinc-500">
                  Developer & Tech Stack
                </span>
              </Link>

              <Link
                href="/contact"
                className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-violet-500/50 transition-all text-center group"
              >
                <MessageSquare className="h-6 w-6 text-violet-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-white block">
                  Contact Support
                </span>
                <span className="text-[11px] text-zinc-500">
                  nirajrokx99@gmail.com
                </span>
              </Link>

              <Link
                href="/privacy"
                className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-violet-500/50 transition-all text-center group"
              >
                <Lock className="h-6 w-6 text-emerald-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-white block">
                  Privacy Policy
                </span>
                <span className="text-[11px] text-zinc-500">
                  Google OAuth & Limited Use
                </span>
              </Link>

              <Link
                href="/terms"
                className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-violet-500/50 transition-all text-center group"
              >
                <FileText className="h-6 w-6 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-white block">
                  Terms of Service
                </span>
                <span className="text-[11px] text-zinc-500">
                  Usage & Anti-Spam Rules
                </span>
              </Link>
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
              Sign up for Dootx today, connect your Google account in 1 click,
              and start dispatching personalized bulk campaigns.
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
    </div>
  );
}
