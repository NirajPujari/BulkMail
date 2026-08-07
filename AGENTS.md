<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# 🤖 Agent Guide for Dootx

Welcome to **Dootx**! This document provides AI agents and developer assistants with a comprehensive overview of the repository's architecture, technology stack, directory structure, development workflows, and key conventions.

---

## 🚀 Project Overview

**Dootx** is a full-stack bulk email management and dispatch web application built with **Next.js 16 (App Router)** and **React 19**. It enables users to compose email campaigns, manage recipient lists, track real-time dispatch progress, and execute high-volume email delivery via **Google Gmail API v1** using OAuth 2.0 user account authorization.

---

## 🛠️ Technology Stack & Core Dependencies

- **Framework**: [Next.js 16.2.11](file:///n:/Own_projects/Uncompleted/bulkmail/package.json) (App Router) + React 19.2.4
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`), `@base-ui/react`, Shadcn UI primitives, `tw-animate-css`, Sonner (toast notifications), Lucide React (icons)
- **Database & ORM**: PostgreSQL database with Prisma 7.9.0 ORM (`@prisma/client`, `@prisma/adapter-pg`, [prisma.config.ts](file:///n:/Own_projects/Uncompleted/bulkmail/prisma.config.ts))
- **Authentication**: Custom JWT-based auth (`jsonwebtoken`), password hashing via Node `crypto` (PBKDF2 with salt), role-based middleware proxy ([proxy.ts](file:///n:/Own_projects/Uncompleted/bulkmail/proxy.ts))
- **Email Service**: Google Gmail API v1 OAuth 2.0 (`https://gmail.googleapis.com/gmail/v1/users/me/messages/send`) with AES-256 encrypted refresh tokens ([google.ts](file:///n:/Own_projects/Uncompleted/bulkmail/lib/email/google.ts))
- **Automation Scripts**: Custom PowerShell scripts ([git.ps1](file:///n:/Own_projects/Uncompleted/bulkmail/scripts/git.ps1), [prisma.ps1](file:///n:/Own_projects/Uncompleted/bulkmail/scripts/prisma.ps1)) integrated via `package.json`

---

## 📁 Repository Structure

```text
dootx/
├── app/                      # Next.js 16 App Router pages and API routes
│   ├── (auth)/               # Authentication routes (login, signup, forgot-password, reset-password)
│   ├── admin/                # Admin Control Center dashboard UI
│   ├── api/                  # API endpoints
│   │   ├── admin/            # Admin endpoints (/users, /stats)
│   │   ├── campaigns/        # GET, POST, PUT, DELETE campaigns & /send background dispatcher
│   │   ├── forgot/           # Password reset endpoint
│   │   ├── logout/           # User session termination endpoint
│   │   ├── me/               # Authenticated profile endpoint (includes Google OAuth state)
│   │   ├── oauth/google/     # Google OAuth login & callback endpoints
│   │   ├── reset-password/   # Password reset token verification & update endpoint
│   │   └── signup/           # User registration endpoint
│   ├── dashboard/            # Core application dashboard & components
│   │   └── components/       # Dashboard widgets (Composer, History, Simulator, Stats)
│   ├── oauth/google/         # OAuth redirect pages (success, error)
│   ├── globals.css           # Global CSS & Tailwind configuration
│   ├── layout.tsx            # Root layout wrapped with AuthProvider & Toaster
│   └── page.tsx              # Public landing page
├── components/               # Shared React components
│   ├── layout/               # Layout elements (Header, Footer, AppLayout)
│   └── ui/                   # Reusable UI primitives (button, card, input, etc.)
├── context/                  # React Context providers (Auth.tsx)
├── lib/                      # Business logic, utilities, & service initializations
│   ├── email/                # Gmail API sender, provider dispatcher, transactional service
│   ├── api.ts                # Client-side API fetch wrapper with Bearer headers
│   ├── crypto.ts             # Password hashing (PBKDF2) & token encryption (AES-256-CBC)
│   ├── db.ts                 # Prisma Client setup using @prisma/adapter-pg
│   ├── jwt.ts                # JWT signing & verification utilities
│   └── utils.ts              # Classname merge helpers (clsx + tailwind-merge)
├── prisma/                   # Prisma ORM schema & migrations
│   ├── schema.prisma         # Data models: User, Campaign
│   └── migrations/           # Database migration SQL files
├── proxy.ts                  # Custom middleware proxy for API auth & role validation
├── scripts/                  # Custom PowerShell workflow scripts
│   ├── git.ps1               # Automated Git commit & push helper with diff generation
│   └── prisma.ps1            # Automated Prisma migration & client generation helper
├── types/                    # TypeScript type definitions (user.ts, campaign.ts, auth.ts)
├── prisma.config.ts          # Prisma 7 configuration file
├── package.json              # Dependencies and script definitions
└── AGENTS.md                 # Developer & AI Agent instructions
```

---

## ⚙️ Development & Command Reference

| Command | Action |
| :--- | :--- |
| `npm run dev` | Launches the Next.js local development server (`http://localhost:3000`) |
| `npm run build` | Builds the production web application |
| `npm run start` | Serves the production build locally |
| `npm run lint` | Executes ESLint static analysis |
| `npm run db` | Executes `scripts/prisma.ps1` (validates schema, runs `prisma migrate dev`, generates client) |
| `npm run git` | Executes `scripts/git.ps1` (runs DB script, stages files, prompts for diff message, commits & pushes) |

---

## 🔑 Key Architecture & AI Developer Rules

### 1. Google OAuth 2.0 & Gmail API Setup
- **Google Cloud Console Setup**:
  1. Create a Project in Google Cloud Console.
  2. Enable the **Gmail API** (`gmail.googleapis.com`).
  3. Configure the OAuth Consent Screen (add scopes: `openid`, `email`, `profile`, `https://www.googleapis.com/auth/gmail.send`).
  4. Create OAuth 2.0 Web Application Credentials.
  5. Set Authorized Redirect URI: `http://localhost:3000/api/oauth/google/callback` (for dev) or `https://<domain>/api/oauth/google/callback` (for production).
- **Required Environment Variables**:
  - `GOOGLE_CLIENT_ID`: Google OAuth 2.0 Client ID.
  - `GOOGLE_CLIENT_SECRET`: Google OAuth 2.0 Client Secret.
  - `JWT_SECRET`: Used for JWT verification AND AES-256-CBC token encryption.
  - `NEXT_PUBLIC_APP_URL` / `APP_URL`: Base application URL.

### 2. Security & Token Storage Policy
- Refresh tokens are encrypted before storage using AES-256-CBC (`encryptToken` in [crypto.ts](file:///n:/Own_projects/Uncompleted/bulkmail/lib/crypto.ts)) powered strictly by `JWT_SECRET`.
- Access tokens are **never** stored permanently in the database. They are generated on demand via `getGoogleAccessToken(userId)` using the decrypted refresh token.
- If a 401 Unauthorized occurs during dispatch, the engine retries token refresh once before failing.

### 3. Non-Blocking Async Email Dispatch & Polling
- Sending campaigns (`POST /api/campaigns/send`) verifies `googleConnected === true`, queues the campaign (`status: "sending"`), and initiates background task `sendCampaignBackground`.
- `sendCampaignBackground` builds RFC2822 MIME messages, base64url encodes them, posts to Gmail API `POST /gmail/v1/users/me/messages/send`, and logs status to `Campaign.logs`.
- The dashboard frontend polls campaign status every 1.5 seconds (`fetchRequest("campaigns?id=...")`) while `status === "sending"`.

### 4. AI Agent Formatting Rules
- Always use clickable GitHub-style markdown file links with absolute `file:///` URLs (e.g. `[proxy.ts](file:///n:/Own_projects/Uncompleted/bulkmail/proxy.ts)`) when referencing files.
- Never guess file structures or export names without inspecting the source file first.
