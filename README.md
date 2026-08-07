# 📧 BulkMail — Enterprise Email Dispatch & Campaign Manager

**BulkMail** is a full-stack bulk email management and dispatch web application built with **Next.js 16 (App Router)** and **React 19**. It enables users to compose personalized email campaigns, manage recipient lists with custom dynamic merge variables, track real-time dispatch progress, protect daily Gmail quota limits, and execute high-volume email delivery via **Google Gmail API v1** using OAuth 2.0 user account authorization.

---

## ✨ Features Implemented

### 🌐 Google Gmail API v1 & OAuth 2.0 Integration
- Secure user account authorization via Google OAuth 2.0 (`gmail.send` scope).
- **AES-256-CBC Encryption**: Refresh tokens are stored encrypted using `JWT_SECRET`.
- On-demand access token retrieval with automatic token refresh and single retry handling.

### 🛡️ Gmail Daily Quota Protection
- **Daily Limit Tracking**: Monitors user daily email volume (default limit 500 emails/day).
- **Automated UTC Resets**: Automatically resets daily usage counts at 00:00 UTC.
- **Pre-flight & In-flight Enforcement**: Rejects campaigns exceeding remaining quota and halts background dispatches cleanly if quota is exhausted mid-campaign.
- **Telemetry Visuals**: Interactive progress bar and live telemetry widgets on the dashboard.

### 🏷️ Dynamic Recipient Variables & Merge Tags
- **Unlimited Custom Variables**: Support for `{{name}}`, `{{company}}`, `{{position}}`, `{{website}}`, and arbitrary custom fields without database schema alterations.
- **CSV / Spreadsheet Auto-Import**: Header row columns map directly to variable names.
- **Interactive Data Grid Editor**: Table UI to add, rename, and delete variable columns and edit recipient values inline.
- **Merge Tag Insertion Chips**: Quick-insert buttons for `{{tags}}` in Subject Line and Body fields.
- **Template Tag Validation**: Detects undefined merge tags or empty recipient variable values before sending.
- **Live Recipient Email Preview**: Modal inspector to preview the exact rendered email for any selected recipient.

### ⚙️ User Settings Center (`/settings`)
- View profile information (display name, email address, role, remaining daily quota).
- Update display name.
- Change account password (with PBKDF2 salted hash verification).
- Inspect Google Gmail API authorization state, reconnect accounts, or disconnect Google OAuth tokens.

### 🔒 Security & Middleware Authorization
- Custom JWT-based authentication (`jsonwebtoken`) with salted PBKDF2 password hashing.
- Hardened role-based middleware proxy (`proxy.ts`) enforcing granular `everyone`, `user`, and `admin` permissions across all API routes.
- Admin Control Center (`/admin`) for system user auditing and platform metrics.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ installed.
- PostgreSQL database (local or cloud-hosted via Supabase/Neon/Prisma Postgres).
- Google Cloud Console Project with **Gmail API** enabled and OAuth 2.0 Web Client credentials.

### 2. Environment Variables Setup
Create a `.env` file in the root directory:

```env
DIRECT_URL="postgresql://user:password@localhost:5432/?schema=public"
JWT_SECRET="your_secure_random_jwt_and_encryption_secret"
GOOGLE_CLIENT_ID="your_google_oauth_client_id"
GOOGLE_CLIENT_SECRET="your_google_oauth_client_secret"
APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Installation & Database Sync

```bash
# Install dependencies
npm install

# Run database migrations and generate Prisma Client
npm run db
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16.2 (App Router) + React 19.2
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4, Base UI, Shadcn UI primitives, Sonner toasts, Lucide React icons
- **Database & ORM**: PostgreSQL, Prisma 7.9 ORM (`@prisma/client`, `@prisma/adapter-pg`)
- **Authentication & Security**: Custom JWT auth, PBKDF2 password hashing, AES-256-CBC token encryption, Next.js Middleware proxy
- **Email Service**: Google Gmail API v1 (`https://gmail.googleapis.com/gmail/v1/users/me/messages/send`)

---

## 📋 Roadmap & Upcoming TODO List

### 🛠️ Phase 1 (Upcoming Enhancements)

#### 1. CSV / Excel Recipient Import Upgrade
Upgrade the `CampaignComposer` recipient importer:
- [ ] Drag & drop file upload zone.
- [ ] Direct CSV and Excel (`.xlsx`, `.xls`) file parsing.
- [ ] Automatic email validation and duplicate removal.
- [ ] Auto-populate recipient list with fallback manual text input.

#### 2. Saved Contact Lists & Groups
Extend database schema with `ContactGroup` and `Contact` models:
- [ ] Create `ContactGroup` and `Contact` Prisma data models.
- [ ] Build CRUD API endpoints for managing contact groups.
- [ ] Build Contact Management UI (import contacts, edit lists, delete contact lists).
- [ ] Allow selecting saved contact lists directly within the Campaign Composer.

#### 3. Rich HTML Email Editor
Replace plain body text area with an advanced editor:
- [ ] WYSIWYG rich text editor integration.
- [ ] Rich formatting toolbar (bold, italics, headings, lists, links).
- [ ] Real-time HTML visual preview tab.
- [ ] Automatic plain text fallback generation.

#### 4. Extended Merge Tags Engine
- [ ] Support standard `{{name}}`, `{{email}}`, and dynamic custom tags across all email templates.
- [ ] Complete pre-send validation and preview rendering.

---

### 🔮 Phase 2 (Advanced Platform Features)

#### 1. Scheduled Campaigns
- [ ] Pick future send date & time for campaigns.
- [ ] Database support for scheduled dispatch queues.
- [ ] Background cron worker/scheduler engine.
- [ ] Scheduled campaigns dashboard view.
- [ ] Real-time campaign status transitions.

#### 2. Campaign Controls
- [ ] **Pause Campaign**: Pause active sending background queues.
- [ ] **Resume Campaign**: Safely resume paused campaign dispatches.
- [ ] **Cancel Campaign**: Instantly cancel active dispatches without data loss.
- [ ] Duplicate sending prevention and real-time status sync.

#### 3. Email Analytics & Telemetry
- [ ] Email open tracking via tracking pixel.
- [ ] Link click tracking and URL redirect wrappers.
- [ ] Engagement metrics (Open rate, Click-through rate, Bounce rate).
- [ ] Analytics dashboard & campaign performance summary charts.

#### 4. Dynamic Notification System
Replace static header notification bell with live alerts:
- [ ] `Notification` database model and API endpoints.
- [ ] Header notification dropdown menu with read/unread state.
- [ ] Automated campaign completion notifications.
- [ ] Campaign failure & daily quota alert notifications.
- [ ] Scheduled campaign trigger notifications.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
