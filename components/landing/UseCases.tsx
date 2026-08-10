"use client";

import { GraduationCap, Briefcase, Users, Rocket } from "lucide-react";

export function UseCases() {
  const useCases = [
    {
      icon: GraduationCap,
      color: "violet",
      badge: "For Students",
      title: "Land Internships & Summer Co-Ops",
      description:
        "Cold email tech leads, startup founders, and engineering managers directly. Bypassing public job boards helps you secure interviews before positions are filled.",
      exampleTag: "Summer Engineering Internship",
    },
    {
      icon: Briefcase,
      color: "indigo",
      badge: "For Job Seekers",
      title: "Contact Hiring Managers Directly",
      description:
        "Don't let your application sit in a 500-resume ATS queue. Send personalized emails to heads of engineering, product, or design at your dream companies.",
      exampleTag: "Full-Time Role Outreach",
    },
    {
      icon: Users,
      color: "emerald",
      badge: "For Networking",
      title: "Request Alumni Referrals & Advice",
      description:
        "Reach out to university alumni working at top companies. Ask for advice, portfolio feedback, or referral recommendations with tailored merge tags.",
      exampleTag: "Alumni Coffee Chat",
    },
    {
      icon: Rocket,
      color: "amber",
      badge: "For Creators & Builders",
      title: "Projects & Research Collaboration",
      description:
        "Cold email university professors, research lab directors, or open-source project leads to collaborate on cutting-edge research or side projects.",
      exampleTag: "Research Project Query",
    },
  ];

  return (
    <section className="space-y-12">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-300 text-xs font-semibold uppercase tracking-wider">
          <GraduationCap className="h-3.5 w-3.5 text-violet-400" /> Target Use
          Cases
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Designed for Students & Job Seekers
        </h2>
        <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
          Create opportunities by reaching the exact people who have the power
          to hire you.
        </p>
      </div>

      {/* Use Cases Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {useCases.map((uc, idx) => {
          const Icon = uc.icon;
          return (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4 hover:border-violet-500/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-violet-950/80 border border-violet-500/30 text-violet-300 text-xs font-mono font-semibold">
                    {uc.badge}
                  </span>
                  <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white leading-snug">
                  {uc.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {uc.description}
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-850 flex items-center justify-between text-xs font-mono text-zinc-500">
                <span>Example Campaign:</span>
                <span className="text-violet-400 font-semibold">
                  {uc.exampleTag}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
