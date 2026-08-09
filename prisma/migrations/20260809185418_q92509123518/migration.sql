/*
  Warnings:

  - You are about to drop the column `errorMessage` on the `campaign_recipients` table. All the data in the column will be lost.
  - You are about to drop the column `sentAt` on the `campaign_recipients` table. All the data in the column will be lost.
  - The `variables` column on the `campaign_recipients` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `bounceCount` on the `campaigns` table. All the data in the column will be lost.
  - You are about to drop the column `relaunchedFromId` on the `campaigns` table. All the data in the column will be lost.
  - You are about to drop the `campaign_events` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[campaignId,email]` on the table `campaign_recipients` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "campaign_events" DROP CONSTRAINT "campaign_events_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "campaigns" DROP CONSTRAINT "campaigns_relaunchedFromId_fkey";

-- AlterTable
ALTER TABLE "campaign_recipients" DROP COLUMN "errorMessage",
DROP COLUMN "sentAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "openCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "opened" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "openedAt" TIMESTAMP(3),
DROP COLUMN "variables",
ADD COLUMN     "variables" JSONB,
ALTER COLUMN "status" SET DEFAULT 'sent';

-- AlterTable
ALTER TABLE "campaigns" DROP COLUMN "bounceCount",
DROP COLUMN "relaunchedFromId";

-- DropTable
DROP TABLE "campaign_events";

-- CreateTable
CREATE TABLE "campaign_open_events" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "campaign_open_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "campaign_open_events_campaignId_idx" ON "campaign_open_events"("campaignId");

-- CreateIndex
CREATE INDEX "campaign_open_events_campaignId_recipientId_idx" ON "campaign_open_events"("campaignId", "recipientId");

-- CreateIndex
CREATE INDEX "campaign_open_events_openedAt_idx" ON "campaign_open_events"("openedAt");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_recipients_campaignId_email_key" ON "campaign_recipients"("campaignId", "email");

-- AddForeignKey
ALTER TABLE "campaign_open_events" ADD CONSTRAINT "campaign_open_events_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_open_events" ADD CONSTRAINT "campaign_open_events_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "campaign_recipients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
