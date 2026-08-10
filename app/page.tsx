"use client";

import Link from "next/link";
import { useAuth } from "@/context/Auth";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  Lock,
  Info,
  MessageSquare,
  FileText,
} from "lucide-react";

import { Hero3DVisual } from "@/components/landing/Hero3DVisual";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ProductShowcase } from "@/components/landing/ProductShowcase";
import { UseCases } from "@/components/landing/UseCases";
import { WhyColdEmail } from "@/components/landing/WhyColdEmail";
import { GoogleCompliance } from "@/components/landing/GoogleCompliance";
import { FinalCTA } from "@/components/landing/FinalCTA";

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="space-y-20">
      <section className="relative isolate overflow-hidden px-6 pt-32 pb-28 sm:pt-40 sm:pb-36">
        {/* Ambient background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-20 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]" />
          <div className="absolute left-[15%] top-[35%] h-64 w-64 rounded-full bg-indigo-500/5 blur-[100px]" />
          <div className="absolute right-[10%] top-[25%] h-72 w-72 rounded-full bg-purple-500/5 blur-[100px]" />

          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-6xl text-center">
          {/* Badge */}
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-xs font-medium text-violet-300 sm:text-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-400" />
            </span>
            Built for students & ambitious job seekers
          </div>

          {/* Headline */}
          <h1 className="mx-auto max-w-5xl text-5xl font-extrabold leading-[1.05] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
            Your next opportunity
            <br />
            <span className="bg-gradient-to-r from-violet-300 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              starts with an email.
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
            Reach founders, recruiters, and hiring managers directly. Build
            personalized cold-email campaigns and contact the right people
            without sending every email manually.
          </p>

          {/* CTA */}
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={user ? "/dashboard" : "/signup"}>
              <Button
                size="lg"
                className="w-full cursor-pointer bg-violet-600 px-8 py-6 text-base font-semibold text-white shadow-xl shadow-violet-600/20 transition-all hover:bg-violet-500 hover:shadow-violet-500/30 sm:w-auto"
              >
                {user ? "Launch Dashboard" : "Start Outreach Free"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <Link href="/privacy">
              <Button
                size="lg"
                variant="ghost"
                className="w-full cursor-pointer px-6 py-6 text-sm text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 sm:w-auto"
              >
                <Lock className="mr-2 h-4 w-4 text-zinc-500" />
                Your data stays yours
              </Button>
            </Link>
          </div>

          {/* Trust / product context */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-zinc-600 sm:text-sm">
            <span>Personalized outreach</span>
            <span className="hidden h-1 w-1 rounded-full bg-zinc-700 sm:block" />
            <span>Send from your Gmail</span>
            <span className="hidden h-1 w-1 rounded-full bg-zinc-700 sm:block" />
            <span>Built for opportunity seekers</span>
          </div>
        </div>
      </section>
      <Hero3DVisual />
      <ProblemSection />
      <HowItWorks />
      <ProductShowcase />
      <UseCases />
      <WhyColdEmail />
      <GoogleCompliance />
      <section className="py-10 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Explore Dootx Platform Pages
          </h2>
          <p className="text-zinc-400 text-sm">
            All informational and legal pages are publicly accessible without
            requiring an account or login.
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
      </section>
      <FinalCTA />
    </main>
  );
}
