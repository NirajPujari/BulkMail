import Link from "next/link";
import { Mail, ArrowLeft, Send, MessageSquare, ShieldCheck, Sparkles, User } from "lucide-react";

export const metadata = {
  title: "Contact — Dootx (Developed by Niraj Pujari)",
  description: "Get in touch with Niraj Pujari for technical support, feedback, or inquiries regarding Dootx.",
};

export default function ContactPage() {
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
            <Mail className="h-5 w-5 text-violet-400" />
            <span>Contact Developer</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 space-y-10">
        {/* Header Banner */}
        <div className="space-y-4 text-center border-b border-zinc-850 pb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-300 text-xs font-semibold uppercase tracking-wider">
            <MessageSquare className="h-3.5 w-3.5" /> Direct Developer Communication
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
            Get in Touch
          </h1>
          <p className="text-zinc-400 text-base max-w-xl mx-auto leading-relaxed">
            Have questions, feedback, technical inquiries, or feature suggestions for Dootx? Reach out directly to developer <strong>Niraj Pujari</strong>.
          </p>
        </div>

        {/* Developer Contact Card */}
        <div className="p-8 rounded-2xl bg-zinc-900/70 border border-zinc-800 shadow-2xl space-y-6 max-w-2xl mx-auto text-center">
          <div className="h-16 w-16 rounded-full bg-violet-600/10 border border-violet-500/30 flex items-center justify-center text-violet-400 mx-auto">
            <User className="h-8 w-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white">Niraj Pujari</h2>
            <p className="text-xs text-zinc-400 font-mono">Lead Full-Stack Developer of Dootx</p>
          </div>

          <p className="text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
            Feel free to send an email regarding technical support, Google OAuth integration guidance, or general inquiries.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:nirajrokx99@gmail.com"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm transition-all shadow-lg shadow-violet-600/30 cursor-pointer"
            >
              <Mail className="h-4 w-4" />
              <span>Email: nirajrokx99@gmail.com</span>
            </a>
          </div>
        </div>

        {/* Inquiry Topics */}
        <div className="grid gap-6 sm:grid-cols-3 max-w-3xl mx-auto pt-6">
          <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-850 space-y-2 text-center">
            <div className="p-2 bg-violet-500/10 rounded-lg text-violet-400 w-fit mx-auto">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Technical Support</h3>
            <p className="text-xs text-zinc-400">Assistance with Google OAuth credentials, database setups, and campaign dispatches.</p>
          </div>

          <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-850 space-y-2 text-center">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 w-fit mx-auto">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Feature Requests</h3>
            <p className="text-xs text-zinc-400">Share your roadmap suggestions and custom variable requirements.</p>
          </div>

          <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-850 space-y-2 text-center">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 w-fit mx-auto">
              <Send className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white">General Inquiries</h3>
            <p className="text-xs text-zinc-400">Partnership opportunities, architecture questions, and project feedback.</p>
          </div>
        </div>
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
            <Link href="/about" className="hover:text-white transition-colors">
              About
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
