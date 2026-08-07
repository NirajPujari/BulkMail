import Link from "next/link";
import { FileText, ArrowLeft, ShieldAlert, CheckCircle2, AlertTriangle, Scale } from "lucide-react";

export const metadata = {
  title: "Terms of Service — Dootx",
  description: "Read the Terms and Conditions governing your use of the Dootx bulk email dispatch platform.",
};

export default function TermsOfServicePage() {
  const lastUpdated = "August 8, 2026";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-violet-500 selection:text-white flex flex-col justify-between">
      {/* Header / Nav */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-2 font-bold text-white tracking-tight text-lg">
            <FileText className="h-5 w-5 text-violet-400" />
            <span>Dootx Terms of Service</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 space-y-10">
        {/* Banner Section */}
        <div className="space-y-4 text-center border-b border-zinc-850 pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-300 text-xs font-semibold uppercase tracking-wider">
            <Scale className="h-3.5 w-3.5" /> Legal Agreement
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
            Terms of Service
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto">
            Please read these Terms and Conditions carefully before using Dootx. By accessing or using our platform, you agree to be bound by these terms.
          </p>
          <p className="text-xs text-zinc-500 font-mono">Last Updated: {lastUpdated}</p>
        </div>

        {/* Section 1: Acceptance of Terms */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            1. Acceptance of Terms
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            By registering an account, connecting a Google identity, or creating and launching email campaigns through <strong>Dootx</strong> (&quot;the Service&quot;), you agree to comply with and be bound by these Terms of Service (&quot;Terms&quot;) and our <Link href="/privacy" className="text-violet-400 underline">Privacy Policy</Link>. If you do not agree to these Terms, you may not use the Service.
          </p>
        </section>

        {/* Section 2: Description of Service */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            2. Description of Service
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Dootx is a web-based bulk email management and transmission platform. It provides tools to compose email templates, manage recipient lists with dynamic merge variables (such as `{{name}}` or `{{company}}`), monitor dispatch logs, and send authorized emails using your Google Gmail account via the Google Gmail API v1 under OAuth 2.0 user consent.
          </p>
        </section>

        {/* Section 3: User Registration & Account Security */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            3. Account Registration & Responsibilities
          </h2>
          <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-850 text-sm text-zinc-300 space-y-2">
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
            <ul className="list-disc list-inside space-y-1 text-xs text-zinc-400 pt-2">
              <li>You must provide accurate display name and email information during registration.</li>
              <li>You agree to notify us immediately of any unauthorized access or security breach.</li>
              <li>Accounts are strictly non-transferable without prior consent.</li>
            </ul>
          </div>
        </section>

        {/* Section 4: Acceptable Use & Anti-Spam Policy */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-violet-400" />
            4. Acceptable Use & Anti-Spam Policy
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Dootx strictly enforces anti-spam regulations. You agree to use the Service in full compliance with all applicable laws, including the CAN-SPAM Act, GDPR, and Google Gmail Terms of Service.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Authorized Mailings
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                You must only dispatch emails to recipients who have explicitly opted in, consented to receive communications, or with whom you have a legitimate professional relationship.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <AlertTriangle className="h-4 w-4 text-rose-400" /> Prohibited Content & Abuse
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                You may NOT use Dootx to send unsolicited commercial emails (spam), phishing attempts, malware, deceptive headers, fraudulent offers, or illegal material. Violation results in immediate account termination.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Gmail API Quotas & Transmission Rate Limits */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            5. Gmail API Daily Quota & Rate Limits
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Email transmission through Dootx is governed by Google Gmail API quotas and Dootx daily user quota protections (default limit of 500 emails/day, resetting automatically at 00:00 UTC).
          </p>
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400 space-y-1 font-mono">
            <p>• Dootx automatically rejects campaigns that exceed remaining daily quotas.</p>
            <p>• Background dispatchers insert safety delays between emails to prevent account flagging.</p>
            <p>• We are not liable for dispatches halted due to Google API rate limits or quota exhaustion.</p>
          </div>
        </section>

        {/* Section 6: Intellectual Property */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            6. Intellectual Property & Content Ownership
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            You retain full ownership and copyright of all email subject lines, body templates, images, and recipient data uploaded to Dootx. Dootx retains all rights, title, and interest in and to the platform software, source code, UI design, logos, and trademarks.
          </p>
        </section>

        {/* Section 7: Limitation of Liability */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            7. Disclaimer of Warranties & Limitation of Liability
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. Dootx makes no warranties regarding uninterrupted service, delivery inbox placement rates, or third-party email filter decisions. In no event shall Dootx be liable for indirect, incidental, or consequential damages arising out of your use of the Service.
          </p>
        </section>

        {/* Section 8: Termination */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            8. Termination of Service
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            We reserve the right to suspend or terminate your access to Dootx at our sole discretion, without prior notice, if you violate these Terms, engage in abusive mailing practices, or fail to comply with Google OAuth policies.
          </p>
        </section>

        {/* Section 9: Governing Law & Contact */}
        <section className="space-y-4 border-t border-zinc-850 pt-8">
          <h2 className="text-xl font-bold text-white tracking-tight">
            9. Contact Information
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            For any legal inquiries, compliance questions, or terms clarification, please contact our team at:
          </p>
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs font-mono text-violet-300">
            Legal & Support Email: legal@dootx.com
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8 text-center text-xs text-zinc-500">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Dootx Systems. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-violet-400 font-semibold">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
