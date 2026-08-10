"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/context/Auth";

export function FinalCTA() {
  const { user } = useAuth();

  return (
    <section className="py-10 max-w-5xl mx-auto px-6 text-center select-none">
      <div className="p-10 sm:p-14 rounded-3xl bg-linear-to-b from-violet-950/40 via-zinc-950 to-zinc-950 border border-violet-500/30 space-y-6 relative overflow-hidden shadow-2xl shadow-violet-600/10">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-violet-600/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-300 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" /> Start Your Outreach Today
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-2xl mx-auto">
          Your Next Opportunity Starts with One Campaign
        </h2>

        <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Stop waiting for job postings to get flooded. Connect your Google
          account in 1 click and start reaching founders, engineering leads, and
          recruiters directly.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href={user ? "/dashboard" : "/signup"}>
            <Button
              size="lg"
              className="w-full sm:w-auto px-8 py-6 text-base bg-violet-600 hover:bg-violet-500 text-white font-bold cursor-pointer shadow-xl shadow-violet-600/30"
            >
              {user ? "Go to Dashboard" : "Start Your First Campaign Free"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        <div className="pt-6 border-t border-zinc-850/80 flex items-center justify-center gap-6 text-xs text-zinc-500">
          <span>✓ 100% Free to Get Started</span>
          <span>•</span>
          <span>✓ Gmail OAuth 2.0 Security</span>
          <span>•</span>
          <span>✓ 500 Daily Emails Quota</span>
        </div>
      </div>
    </section>
  );
}
