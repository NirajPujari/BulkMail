"use client";

import Link from "next/link";
import { ShieldCheck, ExternalLink, Mail, UserCheck } from "lucide-react";

export function GoogleCompliance() {
  return (
    <section className="py-10 max-w-5xl mx-auto px-6 space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="h-4 w-4 text-emerald-400" /> Google OAuth
          Transparency & Compliance
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Enterprise Security & Data Transparency
        </h2>
        <p className="text-zinc-400 text-sm max-w-2xl mx-auto">
          Dootx is built with strict privacy controls. Your Google data is
          encrypted, never shared, and never used to train AI models.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-violet-950/20 border border-violet-500/30 text-violet-200 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-violet-500/20 pb-3">
          <span className="font-bold text-white text-sm sm:text-base">
            Google API Limited Use Disclosure
          </span>
          <Link
            href="/privacy"
            className="text-xs text-violet-300 hover:text-white underline flex items-center gap-1 font-mono"
          >
            View Privacy Policy <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
          Dootx&apos;s use and transfer of information received from Google APIs
          to any other app will adhere to the{" "}
          <a
            href="https://developers.google.com/terms/api-services-user-data-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-400 underline hover:text-violet-300 font-semibold"
          >
            Google API Services User Data Policy
          </a>
          , including the <strong>Limited Use</strong> requirements. We do NOT
          sell, rent, or share user data.
        </p>
      </div>

      {/* Scope Breakdown */}
      <div className="grid gap-4 sm:grid-cols-2 text-xs">
        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <div className="flex items-center gap-2 font-mono text-violet-400 font-bold">
            <Mail className="h-4 w-4" />{" "}
            https://www.googleapis.com/auth/gmail.send
          </div>
          <h4 className="text-sm font-bold text-white">
            Gmail Send Authorization
          </h4>
          <p className="text-zinc-400 leading-relaxed">
            Used exclusively to transmit user-authored email templates to your
            specified campaign recipients via Google Gmail API v1.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <div className="flex items-center gap-2 font-mono text-blue-400 font-bold">
            <UserCheck className="h-4 w-4" /> openid, email, profile
          </div>
          <h4 className="text-sm font-bold text-white">
            Identity Verification
          </h4>
          <p className="text-zinc-400 leading-relaxed">
            Used to authenticate login sessions and display your connected
            Google email address in the dashboard composer.
          </p>
        </div>
      </div>
    </section>
  );
}
