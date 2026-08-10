"use client";

import { AlertCircle, XCircle, CheckCircle2 } from "lucide-react";

export function ProblemSection() {
  return (
    <section className="space-y-12">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold uppercase tracking-wider">
          <AlertCircle className="h-3.5 w-3.5" /> The Cold Truth About Job
          Hunting
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Traditional Job Portals Are a Black Hole for Resumes
        </h2>
        <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
          When you submit a resume to a public job posting, you compete with
          500+ applicants in automated ATS filters. Cold emailing the actual
          decision-maker opens doors before jobs are even posted.
        </p>
      </div>

      {/* Comparison Grid: Traditional Job Search vs Direct Outreach via Dootx */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Left Card: The Old Way (Frustrating) */}
        <div className="p-8 rounded-2xl bg-zinc-950/80 border border-rose-500/20 space-y-6 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-zinc-850 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <XCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  The Traditional Job Portal Way
                </h3>
                <p className="text-xs text-zinc-500">
                  Applying on LinkedIn, Indeed & Job Boards
                </p>
              </div>
            </div>
          </div>

          <ul className="space-y-4 text-sm text-zinc-400">
            <li className="flex items-start gap-3">
              <span className="h-2 w-2 rounded-full bg-rose-500 mt-2 shrink-0" />
              <span>
                <strong>Buried under 500+ applicants:</strong> Your resume sits
                in automated applicant tracking systems (ATS) without ever being
                seen by a human.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="h-2 w-2 rounded-full bg-rose-500 mt-2 shrink-0" />
              <span>
                <strong>No direct line to decision-makers:</strong> You never
                get to talk directly to founders, engineering leads, or
                recruiters who actually hire.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="h-2 w-2 rounded-full bg-rose-500 mt-2 shrink-0" />
              <span>
                <strong>Exhausting manual copy-pasting:</strong> Trying to
                manually send cold emails one-by-one takes 10+ hours a week for
                a handful of contacts.
              </span>
            </li>
          </ul>
        </div>

        {/* Right Card: The Dootx Way (High Impact) */}
        <div className="p-8 rounded-2xl bg-gradient-to-b from-violet-950/40 to-zinc-950 border border-violet-500/40 space-y-6 relative overflow-hidden shadow-xl shadow-violet-600/5">
          <div className="flex items-center justify-between border-b border-violet-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-violet-600 text-white font-bold shadow-md shadow-violet-600/30">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  The Dootx Direct Outreach Way
                </h3>
                <p className="text-xs text-violet-300 font-mono">
                  Personalized Cold Outreach at Scale
                </p>
              </div>
            </div>
          </div>

          <ul className="space-y-4 text-sm text-zinc-300">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-violet-400 shrink-0 mt-0.5" />
              <span>
                <strong>Direct inbox delivery:</strong> Your email lands
                directly in the primary Gmail inbox of hiring managers,
                founders, and recruiters.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-violet-400 shrink-0 mt-0.5" />
              <span>
                <strong>Hyper-personalized templates:</strong> Dynamic variables
                (
                <code className="text-violet-300 font-mono text-xs bg-violet-950/80 px-1 py-0.5 rounded">{`{{name}}`}</code>
                ,{" "}
                <code className="text-violet-300 font-mono text-xs bg-violet-950/80 px-1 py-0.5 rounded">{`{{company}}`}</code>
                ) make every email feel tailored 1-on-1.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-violet-400 shrink-0 mt-0.5" />
              <span>
                <strong>Scale outreach in seconds:</strong> Launch targeted
                campaigns to 50+ companies in minutes instead of days using your
                own Gmail identity.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
