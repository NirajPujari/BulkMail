"use client";

import { useState } from "react";
import { Table, Eye, Terminal, Sparkles } from "lucide-react";

export function ProductShowcase() {
  const [activeTab, setActiveTab] = useState<"grid" | "preview" | "logs">(
    "grid",
  );

  return (
    <section className="space-y-12">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-300 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5 text-violet-400" /> Real Application
          UI
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Built for Speed, Personalization, and Control
        </h2>
        <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
          Take a look inside Dootx. Inspect our spreadsheet editor, live email
          inspector, and real-time execution logs.
        </p>
      </div>

      {/* Showcase Container */}
      <div className="max-w-5xl mx-auto bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden space-y-0">
        {/* Tab Selector Navigation Bar */}
        <div className="flex items-center justify-between border-b border-zinc-850 px-4 py-3 bg-zinc-900/70 overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("grid")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "grid"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
              }`}
            >
              <Table className="h-4 w-4" />
              Recipient Data Grid
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "preview"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
              }`}
            >
              <Eye className="h-4 w-4" />
              Live Email Inspector
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("logs")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "logs"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
              }`}
            >
              <Terminal className="h-4 w-4" />
              Gmail Dispatch Telemetry
            </button>
          </div>

          <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
            Interactive Product Preview
          </span>
        </div>

        {/* Tab Content Display */}
        <div className="p-6">
          {activeTab === "grid" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Recipient Variables & Spreadsheet Data Grid
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Manage contacts, CSV imports, and custom merge columns
                  </p>
                </div>
                <div className="px-3 py-1 bg-violet-600/10 border border-violet-500/20 text-violet-300 rounded text-xs font-mono">
                  CSV Auto-Mapped
                </div>
              </div>

              <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/60 font-mono text-xs">
                <table className="w-full text-left">
                  <thead className="bg-zinc-900 text-zinc-400 uppercase tracking-wider font-semibold border-b border-zinc-850">
                    <tr>
                      <th className="p-3">Email Address</th>
                      <th className="p-3">name</th>
                      <th className="p-3">company</th>
                      <th className="p-3">position</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-850 text-zinc-200">
                    <tr className="hover:bg-zinc-900/40">
                      <td className="p-3 font-semibold text-violet-400">
                        sarah@stripe.com
                      </td>
                      <td className="p-3">Sarah</td>
                      <td className="p-3">Stripe</td>
                      <td className="p-3">Engineering Lead</td>
                    </tr>
                    <tr className="hover:bg-zinc-900/40">
                      <td className="p-3 font-semibold text-violet-400">
                        karri@linear.app
                      </td>
                      <td className="p-3">Karri</td>
                      <td className="p-3">Linear</td>
                      <td className="p-3">CEO & Co-Founder</td>
                    </tr>
                    <tr className="hover:bg-zinc-900/40">
                      <td className="p-3 font-semibold text-violet-400">
                        alex@vercel.com
                      </td>
                      <td className="p-3">Alex</td>
                      <td className="p-3">Vercel</td>
                      <td className="p-3">Recruiting Lead</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "preview" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Live Recipient Email Inspector
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Inspect how merge tags substitute personalized values for
                    individual recipients
                  </p>
                </div>
                <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded text-xs font-mono">
                  Recipient: Sarah Chen (Stripe)
                </div>
              </div>

              <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950 space-y-4 text-xs font-mono">
                <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
                  <span className="text-zinc-500">Subject:</span>
                  <span className="text-white font-bold">
                    Software Engineering Internship Query — Sarah @ Stripe
                  </span>
                </div>
                <div className="space-y-2 text-zinc-300 font-sans text-sm leading-relaxed p-3 bg-zinc-900/50 rounded-lg border border-zinc-850">
                  <p>Hi Sarah,</p>
                  <p>
                    I noticed your work leading engineering teams at Stripe. As
                    a computer science student passionate about API performance,
                    I built a high-throughput microservice and would love to
                    explore internship opportunities on your team.
                  </p>
                  <p>
                    Best regards,
                    <br />
                    <span className="text-violet-400 font-semibold">
                      Your Name
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "logs" && (
            <div className="space-y-3 animate-in fade-in duration-300 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
                <span className="text-violet-400 font-bold">
                  dootx-gmail-dispatcher.log
                </span>
                <span className="text-emerald-400 text-[11px]">
                  Daily Quota: 142 / 500 Used
                </span>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-850 space-y-2 text-zinc-400">
                <p className="text-violet-400">
                  [System] Initialized Gmail API personalized dispatch engine.
                </p>
                <p className="text-zinc-400">
                  [OAuth] Authenticating connected Gmail sender identity:
                  &lt;your-email@gmail.com&gt;... Authorized.
                </p>
                <p className="text-zinc-300">
                  [Sending] Personalizing & dispatching via Gmail API to
                  sarah@stripe.com...
                </p>
                <p className="text-emerald-400">
                  [Success] Delivered personalized email to sarah@stripe.com
                  (Msg ID: 18f912a4b8c9d0e1)
                </p>
                <p className="text-zinc-300">
                  [Sending] Personalizing & dispatching via Gmail API to
                  karri@linear.app...
                </p>
                <p className="text-emerald-400">
                  [Success] Delivered personalized email to karri@linear.app
                  (Msg ID: 18f912a4b8c9d0e2)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
