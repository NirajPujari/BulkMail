"use client";

import { Zap, ShieldCheck, FileSpreadsheet, Eye, Send } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: ShieldCheck,
      title: "Connect Your Google Account",
      description:
        "Authorize Dootx with 1 click via secure Google OAuth 2.0. Emails are dispatched directly through your verified Gmail identity for 100% inbox placement.",
      badge: "OAuth 2.0 Integration",
    },
    {
      number: "02",
      icon: FileSpreadsheet,
      title: "Import Recipients & Personalization Tags",
      description:
        "Upload a CSV or add contacts to the interactive grid. Define custom variables like {{name}}, {{company}}, or {{position}} that header columns map to.",
      badge: "Dynamic Merge Tags",
    },
    {
      number: "03",
      icon: Eye,
      title: "Draft Template & Preview Rendered Output",
      description:
        "Write your outreach template using insert chips. Open the Live Preview Inspector to verify exact personalized email body text for any recipient.",
      badge: "Live Recipient Inspector",
    },
    {
      number: "04",
      icon: Send,
      title: "Launch & Stream Execution Logs",
      description:
        "Launch your campaign into a non-blocking background queue. Monitor real-time progress logs, daily quota limits (500/day), and delivery status counters.",
      badge: "Gmail API Dispatcher",
    },
  ];

  return (
    <section className="space-y-12">
      {/* Section Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-300 text-xs font-semibold uppercase tracking-wider">
          <Zap className="h-3.5 w-3.5 text-violet-400" /> Simple 4-Step Process
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          How Dootx Powers Your Outreach Campaign
        </h2>
        <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
          From spreadsheet import to personalized inbox delivery in minutes.
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4 hover:border-violet-500/40 transition-all duration-300 relative group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-extrabold font-mono text-zinc-700 group-hover:text-violet-400 transition-colors">
                    {step.number}
                  </span>
                  <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-violet-400 font-semibold uppercase tracking-wider bg-violet-950/60 px-2 py-0.5 rounded border border-violet-500/20 w-fit block">
                    {step.badge}
                  </span>
                  <h3 className="text-lg font-bold text-white leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
