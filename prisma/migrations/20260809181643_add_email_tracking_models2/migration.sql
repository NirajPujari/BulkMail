/*
  Warnings:

  - You are about to drop the column `bouncedCount` on the `campaigns` table. All the data in the column will be lost.
  - You are about to drop the `email_opens` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `link_clicks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "email_opens" DROP CONSTRAINT "email_opens_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "link_clicks" DROP CONSTRAINT "link_clicks_campaignId_fkey";

-- AlterTable
ALTER TABLE "campaigns" DROP COLUMN "bouncedCount",
ADD COLUMN     "bounceCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "relaunchedFromId" TEXT;

-- DropTable
DROP TABLE "email_opens";

-- DropTable
DROP TABLE "link_clicks";

-- CreateTable
CREATE TABLE "campaign_recipients" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "variables" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "sentAt" TIMESTAMP(3),
    "errorMessage" TEXT,

    CONSTRAINT "campaign_recipients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_events" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "recipientEmail" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "targetUrl" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaign_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "campaign_recipients_campaignId_idx" ON "campaign_recipients"("campaignId");

-- CreateIndex
CREATE INDEX "campaign_recipients_campaignId_email_idx" ON "campaign_recipients"("campaignId", "email");

-- CreateIndex
CREATE INDEX "campaign_events_campaignId_idx" ON "campaign_events"("campaignId");

-- CreateIndex
CREATE INDEX "campaign_events_campaignId_type_idx" ON "campaign_events"("campaignId", "type");

-- CreateIndex
CREATE INDEX "campaign_events_campaignId_recipientEmail_idx" ON "campaign_events"("campaignId", "recipientEmail");

-- CreateIndex
CREATE INDEX "campaign_events_campaignId_type_recipientEmail_idx" ON "campaign_events"("campaignId", "type", "recipientEmail");

-- CreateIndex
CREATE INDEX "campaign_events_createdAt_idx" ON "campaign_events"("createdAt");

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_relaunchedFromId_fkey" FOREIGN KEY ("relaunchedFromId") REFERENCES "campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_recipients" ADD CONSTRAINT "campaign_recipients_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_events" ADD CONSTRAINT "campaign_events_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;
