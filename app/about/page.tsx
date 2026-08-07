import Link from "next/link";
import { Mail, ArrowLeft, Cpu, ShieldCheck, Sparkles, User, Code2, Globe } from "lucide-react";

export const metadata = {
  title: "About Dootx — Developed by Niraj Pujari",
  description: "Learn about Dootx, an enterprise bulk email campaign engine powered by Google Gmail API v1, developed by Niraj Pujari.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-violet-500 selection:text-white flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-2.5 font-bold text-white tracking-tight text-lg">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600 text-white">
              <Mail className="h-4 w-4" />
            </div>
            <span>About Dootx</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 space-y-12">
        {/* Banner Section */}
        <div className="space-y-4 text-center border-b border-zinc-850 pb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" /> High-Deliverability Campaign Engine
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
            About Dootx
          </h1>
          <p className="text-zinc-400 text-base max-w-2xl mx-auto leading-relaxed">
            Dootx is a full-stack email campaign management and dispatch platform designed to give founders, sales outreach teams, and creators maximum email deliverability using Google Gmail API v1.
          </p>
        </div>

        {/* Section 1: Developer Information */}
        <section className="p-8 rounded-2xl bg-linear-to-b from-violet-950/30 to-zinc-900/60 border border-violet-500/30 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-violet-500/10 border border-violet-500/20 rounded-xl text-violet-400">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Developed by Niraj Pujari</h2>
              <p className="text-xs text-violet-300 font-mono">Lead Engineer & Architect</p>
            </div>
          </div>

          <p className="text-sm text-zinc-300 leading-relaxed">
            Dootx was created by <strong>Niraj Pujari</strong> to solve the common pitfalls of bulk email dispatch—eliminating deliverability degradation caused by shared third-party SMTP server IPs by pairing user consent with official Google Gmail API v1 OAuth 2.0 authorization.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href="mailto:nirajrokx99@gmail.com"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow-md shadow-violet-600/20"
            >
              <Mail className="h-4 w-4" />
              Contact: nirajrokx99@gmail.com
            </a>
          </div>
        </section>

        {/* Section 2: Core Platform Pillars */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Core Technical Architecture
          </h2>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Gmail API v1 Transmission</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Direct integration with Google Gmail API v1 endpoints (`/gmail/v1/users/me/messages/send`) using base64url-encoded RFC2822 MIME messages for primary inbox delivery.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">AES-256 & Quota Protection</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                OAuth refresh tokens are encrypted using AES-256-CBC. Daily quota protection safeguards your account (default 500 emails/day) with automatic UTC date resets.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Code2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Dynamic Recipient Variables</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Unlimited custom merge variables (`{{name}}`, `{{company}}`, `{{position}}`) with header CSV mapping, interactive data grid editor, and pre-send live preview modal.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Globe className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Next.js 16 & React 19 Stack</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Built with Next.js 16 (App Router), React 19, TypeScript strict mode, Prisma 7 ORM, PostgreSQL database, Tailwind CSS v4, and role-based middleware proxy (`proxy.ts`).
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8 text-center text-xs text-zinc-500">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            &copy; {new Date().getFullYear()} Dootx. Developed by <strong className="text-white">Niraj Pujari</strong>.
          </p>
          <div className="flex items-center gap-4 text-zinc-400">
            <a href="mailto:nirajrokx99@gmail.com" className="text-violet-400 hover:text-violet-300">
              nirajrokx99@gmail.com
            </a>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
