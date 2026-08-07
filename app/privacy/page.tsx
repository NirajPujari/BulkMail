import Link from "next/link";
import { ShieldCheck, ArrowLeft, Lock, Database, Mail, EyeOff, Server } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — Dootx",
  description: "Learn how Dootx collects, uses, and protects your personal data and Google OAuth information.",
};

export default function PrivacyPolicyPage() {
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
            <ShieldCheck className="h-5 w-5 text-violet-400" />
            <span>Dootx Privacy Policy</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 space-y-10">
        {/* Banner Section */}
        <div className="space-y-4 text-center border-b border-zinc-850 pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-300 text-xs font-semibold uppercase tracking-wider">
            <Lock className="h-3.5 w-3.5" /> Data Security & Compliance
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto">
            Your privacy and data security are fundamental to our architecture. This policy outlines how Dootx collects, protects, and handles your information and Google account data.
          </p>
          <p className="text-xs text-zinc-500 font-mono">Last Updated: {lastUpdated}</p>
        </div>

        {/* Highlighted Notice: Google User Data */}
        <div className="p-6 rounded-2xl bg-violet-950/20 border border-violet-500/30 text-violet-200 space-y-3">
          <div className="flex items-center gap-2 font-bold text-violet-300 text-base">
            <Mail className="h-5 w-5 text-violet-400 shrink-0" />
            <span>Google API Services User Data Policy Compliance</span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Dootx&apos;s use and transfer of information received from Google APIs to any other app will adhere to the{" "}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 underline hover:text-violet-300 transition-colors"
            >
              Google API Services User Data Policy
            </a>
            , including the <strong>Limited Use</strong> requirements. We do not use Google user data to train AI/ML models or sell data to third parties.
          </p>
        </div>

        {/* Section 1: Information We Collect */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Database className="h-5 w-5 text-violet-400" />
            1. Information We Collect
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-2">
              <h3 className="text-sm font-bold text-white">Account Credentials</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                When you create a Dootx account, we store your display name, email address, and a salted PBKDF2 cryptographic hash of your password. We never store raw passwords.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-2">
              <h3 className="text-sm font-bold text-white">Google OAuth Authorization</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                When you connect your Google Account via OAuth 2.0 (`gmail.send` scope), we receive your Google email address and an OAuth Refresh Token. Access tokens are generated ephemerally on demand.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-2 sm:col-span-2">
              <h3 className="text-sm font-bold text-white">Campaign & Recipient Data</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                To execute email campaigns, Dootx stores campaign subjects, body templates, transmission status logs, and recipient email addresses along with dynamic variable tags (e.g. `name`, `company`).
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: How We Use Your Information */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Server className="h-5 w-5 text-violet-400" />
            2. How We Use Your Information
          </h2>
          <ul className="space-y-2 text-sm text-zinc-300 leading-relaxed list-disc list-inside bg-zinc-900/40 p-5 rounded-xl border border-zinc-850">
            <li><strong>Campaign Transmission</strong>: To send user-authored emails to specified recipient lists directly through your authorized Gmail account using the Google Gmail API v1.</li>
            <li><strong>Quota Telemetry</strong>: To monitor daily email limits (default 500 emails/day) and protect your Gmail account against quota exhaustion.</li>
            <li><strong>Authentication & Security</strong>: To authenticate user sessions via JSON Web Tokens (JWT) and prevent unauthorized access to your account.</li>
            <li><strong>Transmission Auditing</strong>: To record campaign execution logs so you can review dispatch status and delivery results.</li>
          </ul>
        </section>

        {/* Section 3: Token Encryption & Data Security */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Lock className="h-5 w-5 text-violet-400" />
            3. Token Storage & Encryption Standard
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            We treat authorization credentials with enterprise-grade security controls:
          </p>
          <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3 font-mono text-xs text-zinc-300">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <ShieldCheck className="h-4 w-4" /> AES-256-CBC Encryption Architecture
            </div>
            <p className="text-zinc-400 leading-relaxed">
              Google OAuth Refresh Tokens are encrypted before database insertion using AES-256-CBC cipher with unique initialization vectors (IV). Unencrypted refresh tokens are never persisted in plaintext or exposed in API payloads.
            </p>
          </div>
        </section>

        {/* Section 4: Data Sharing & Third-Party Disclosure */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <EyeOff className="h-5 w-5 text-violet-400" />
            4. Data Sharing & Third-Party Restrictions
          </h2>
          <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-850 text-sm text-zinc-300 space-y-2">
            <p><strong>We do NOT sell, rent, trade, or monetize your personal data or Google user data under any circumstances.</strong></p>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Your email templates, recipient lists, and Google tokens are strictly utilized for performing bulk mail dispatch services authorized by you. We do not share Google user data with external advertising networks, data brokers, or artificial intelligence model training pipelines.
            </p>
          </div>
        </section>

        {/* Section 5: User Rights & Account Disconnection */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            5. User Control & Data Retention
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            You retain full ownership and control over your data:
          </p>
          <ul className="space-y-2 text-sm text-zinc-400 list-disc list-inside bg-zinc-900/40 p-5 rounded-xl border border-zinc-850">
            <li><strong>Google Account Disconnect</strong>: You can revoke Dootx&apos;s access to your Google account at any time via the User Settings page (`/settings`) or directly through your <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-violet-400 underline">Google Security Settings</a>.</li>
            <li><strong>Data Erasure</strong>: Disconnecting your Google account immediately deletes your stored encrypted refresh token from our database.</li>
            <li><strong>Account Updates</strong>: You can update your display name and account password at any time from `/settings`.</li>
          </ul>
        </section>

        {/* Section 6: Contact Information */}
        <section className="space-y-4 border-t border-zinc-850 pt-8">
          <h2 className="text-xl font-bold text-white tracking-tight">
            6. Contact Us
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            If you have any questions, concerns, or requests regarding this Privacy Policy or our data security practices, please contact us at:
          </p>
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs font-mono text-violet-300">
            Support Email: support@dootx.com
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8 text-center text-xs text-zinc-500">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Dootx Systems. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-violet-400 font-semibold">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
