"use client";

import { CheckCircle2, TrendingUp } from "lucide-react";

export function WhyColdEmail() {
  const points = [
    {
      title: "Direct Line to Decision-Makers",
      description:
        "Skip the HR filter gatekeepers and ATS black holes. Reach founders, CTOs, and recruiters directly in their main Gmail inboxes.",
    },
    {
      title: "Demonstrates Initiative & Drive",
      description:
        "Proactively reaching out demonstrates the exact motivation and self-starter mindset hiring managers want to see in candidates.",
    },
    {
      title: "Scale Outreach Without Losing Quality",
      description:
        "Dynamic merge variables replace {{name}}, {{company}}, and {{position}} so every single email feels 100% individual and thoughtful.",
    },
    {
      title: "Authentic Gmail API Sender Reputation",
      description:
        "Transmitted via official Google OAuth 2.0 user credentials (Gmail API v1). Your emails pass SPF/DKIM authentication natively.",
    },
  ];

  return (
    <section className="space-y-12">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-300 text-xs font-semibold uppercase tracking-wider">
          <TrendingUp className="h-3.5 w-3.5 text-violet-400" /> Why Cold Email
          Works
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Stop Waiting for Opportunities. Create Them.
        </h2>
        <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
          Cold emailing is not about spamming thousands of random addresses.
          It&apos;s about targeted, highly relevant outreach to the exact people
          who can give you an opportunity.
        </p>
      </div>

      {/* Points Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {points.map((pt, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-violet-400 shrink-0" />
              <h3 className="text-base font-bold text-white">{pt.title}</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed pl-8">
              {pt.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
