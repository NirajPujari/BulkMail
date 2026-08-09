-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "googleConnected" BOOLEAN NOT NULL DEFAULT false,
    "googleEmail" TEXT,
    "googleRefreshToken" TEXT,
    "googleTokenExpiry" TIMESTAMP(3),
    "dailyQuotaLimit" INTEGER NOT NULL DEFAULT 500,
    "emailsSentToday" INTEGER NOT NULL DEFAULT 0,
    "lastQuotaReset" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "recipients" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "sentCount" INTEGER NOT NULL DEFAULT 0,
    "totalCount" INTEGER NOT NULL DEFAULT 0,
    "logs" TEXT NOT NULL DEFAULT '',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_executions" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "recipients" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'sending',
    "sentCount" INTEGER NOT NULL DEFAULT 0,
    "totalCount" INTEGER NOT NULL DEFAULT 0,
    "logs" TEXT NOT NULL DEFAULT '',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaign_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_recipients" (
    "id" TEXT NOT NULL,
    "executionId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'sent',
    "variables" JSONB,
    "opened" BOOLEAN NOT NULL DEFAULT false,
    "openedAt" TIMESTAMP(3),
    "openCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaign_recipients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_open_events" (
    "id" TEXT NOT NULL,
    "executionId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "campaign_open_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "campaign_executions_campaignId_idx" ON "campaign_executions"("campaignId");

-- CreateIndex
CREATE INDEX "campaign_executions_userId_idx" ON "campaign_executions"("userId");

-- CreateIndex
CREATE INDEX "campaign_recipients_executionId_idx" ON "campaign_recipients"("executionId");

-- CreateIndex
CREATE INDEX "campaign_recipients_executionId_email_idx" ON "campaign_recipients"("executionId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_recipients_executionId_email_key" ON "campaign_recipients"("executionId", "email");

-- CreateIndex
CREATE INDEX "campaign_open_events_executionId_idx" ON "campaign_open_events"("executionId");

-- CreateIndex
CREATE INDEX "campaign_open_events_executionId_recipientId_idx" ON "campaign_open_events"("executionId", "recipientId");

-- CreateIndex
CREATE INDEX "campaign_open_events_openedAt_idx" ON "campaign_open_events"("openedAt");

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_executions" ADD CONSTRAINT "campaign_executions_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_recipients" ADD CONSTRAINT "campaign_recipients_executionId_fkey" FOREIGN KEY ("executionId") REFERENCES "campaign_executions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_open_events" ADD CONSTRAINT "campaign_open_events_executionId_fkey" FOREIGN KEY ("executionId") REFERENCES "campaign_executions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_open_events" ADD CONSTRAINT "campaign_open_events_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "campaign_recipients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
