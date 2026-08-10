"use client";

import { useState } from "react";
import { CheckCircle2, Send, User, Building2, Zap } from "lucide-react";

export function Hero3DVisual() {
  const [activeCard, setActiveCard] = useState<number>(0);

  const targets = [
    {
      id: 1,
      role: "Engineering Director",
      company: "Stripe",
      name: "Sarah Chen",
      email: "sarah@stripe.com",
      status: "Delivered",
      time: "2m ago",
      snippet:
        "Hi {{name}}, I built a high-throughput API project and would love to discuss internship opportunities on your team...",
      tag: "Internship Outreach",
    },
    {
      id: 2,
      role: "Co-Founder & CEO",
      company: "Linear",
      name: "Karri Saarinen",
      email: "karri@linear.app",
      status: "Delivered",
      time: "Just now",
      snippet:
        "Hey {{name}}, as a computer science senior passionate about UI tools, I'm reaching out regarding open engineering roles at {{company}}...",
      tag: "Full-Time Role",
    },
    {
      id: 3,
      role: "Staff Recruiter",
      company: "Vercel",
      name: "Alex Rivera",
      email: "alex@vercel.com",
      status: "Queued",
      time: "Sending...",
      snippet:
        "Hello {{name}}, saw your post regarding Next.js engineers. I attached my portfolio showcasing full-stack App Router apps...",
      tag: "Referral Request",
    },
  ];

  return (
    <section>
      <div className="relative w-full max-w-5xl mx-auto select-none">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-95 bg-linear-to-r from-violet-600/20 via-indigo-600/15 to-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

        {/* 3D Perspective Canvas */}
        <div className="relative perspective-normal w-full py-4">
          <div className="relative w-full rounded-2xl bg-zinc-950/80 border border-zinc-800/80 p-4 sm:p-6 shadow-2xl backdrop-blur-xl transition-all duration-500 transform-3d transform-[rotateX(6deg)_rotateY(-3deg)] hover:transform-[rotateX(0deg)_rotateY(0deg)] group">
            {/* Canvas Window Header Bar */}
            <div className="flex items-center justify-between border-b border-zinc-850 pb-3 mb-5">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-zinc-400 font-medium hidden sm:inline">
                  dootx-outreach-engine.app
                </span>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-[11px] font-mono">
                <Zap className="h-3 w-3 text-violet-400" />
                <span>Gmail API Connected (500 Daily Quota)</span>
              </div>
            </div>

            {/* Grid Layout: Left Sender Node vs Right Floating 3D Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left Node: User Outreach Controller */}
              <div className="lg:col-span-5 space-y-4 transform-[translateZ(30px)]">
                <div className="p-4 rounded-xl bg-zinc-900/90 border border-violet-500/30 shadow-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-lg bg-violet-600 flex items-center justify-center text-white font-bold shadow-md shadow-violet-600/30">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white leading-tight">
                          Your Campaign
                        </h4>
                        <p className="text-[11px] font-mono text-zinc-400">
                          Target: Tech Founders & Leads
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-semibold border border-emerald-500/20">
                      Active Queue
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px] text-zinc-400">
                      <span>Personalized Merge Tags</span>
                      <span className="text-violet-400 font-mono">
                        3 Tags Active
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-violet-950/80 border border-violet-500/30 text-violet-300 font-mono text-[10px]">
                        + {`{{name}}`}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-violet-950/80 border border-violet-500/30 text-violet-300 font-mono text-[10px]">
                        + {`{{company}}`}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-violet-950/80 border border-violet-500/30 text-violet-300 font-mono text-[10px]">
                        + {`{{position}}`}
                      </span>
                    </div>
                  </div>

                  {/* Mini Stats Bar */}
                  <div className="pt-2 border-t border-zinc-800 grid grid-cols-2 gap-2 text-center text-[11px]">
                    <div className="p-1.5 rounded bg-zinc-950/60 border border-zinc-850">
                      <div className="text-zinc-400 font-mono">
                        Outreach Sent
                      </div>
                      <div className="text-white font-bold font-mono">
                        142 Emails
                      </div>
                    </div>
                    <div className="p-1.5 rounded bg-zinc-950/60 border border-zinc-850">
                      <div className="text-zinc-400 font-mono">
                        Inbox Placement
                      </div>
                      <div className="text-emerald-400 font-bold font-mono">
                        100% Direct
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connecting Laser Graphic (Mobile/Tablet text) */}
                <div className="flex items-center gap-2 text-[11px] text-zinc-400 justify-center font-mono">
                  <Send className="h-3.5 w-3.5 text-violet-400 animate-pulse" />
                  <span>
                    Streaming personalized emails to targeted recipients...
                  </span>
                </div>
              </div>

              {/* Right Node: Floating 3D Target Cards */}
              <div className="lg:col-span-7 space-y-3 relative [transform:translateZ(50px)]">
                {targets.map((target, idx) => (
                  <div
                    key={target.id}
                    onMouseEnter={() => setActiveCard(idx)}
                    className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                      activeCard === idx
                        ? "bg-zinc-900/90 border-violet-500/50 shadow-xl shadow-violet-600/10 [transform:translateZ(20px)_scale(1.02)]"
                        : "bg-zinc-900/50 border-zinc-800/80 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 font-bold text-xs">
                          {target.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-xs font-bold text-white">
                              {target.name}
                            </h5>
                            <span className="text-[10px] text-zinc-400">•</span>
                            <span className="text-[11px] font-medium text-violet-400">
                              {target.role}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                            <Building2 className="h-3 w-3 text-zinc-500" />
                            <span>{target.company}</span>
                            <span className="font-mono text-[10px] text-zinc-500">
                              ({target.email})
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-medium border border-emerald-500/20">
                          <CheckCircle2 className="h-3 w-3" />
                          {target.status}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {target.time}
                        </span>
                      </div>
                    </div>

                    {/* Rendered Template Snippet */}
                    <div className="mt-2.5 pt-2 border-t border-zinc-850/80 text-[11px] text-zinc-300 font-sans leading-relaxed">
                      <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider mr-2">
                        Rendered Email:
                      </span>
                      {target.snippet
                        .replace("{{name}}", target.name.split(" ")[0])
                        .replace("{{company}}", target.company)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
