/*
  Warnings:

  - You are about to drop the `campaign_executions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `campaign_open_events` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `campaign_recipients` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "campaign_executions" DROP CONSTRAINT "campaign_executions_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "campaign_open_events" DROP CONSTRAINT "campaign_open_events_executionId_fkey";

-- DropForeignKey
ALTER TABLE "campaign_open_events" DROP CONSTRAINT "campaign_open_events_recipientId_fkey";

-- DropForeignKey
ALTER TABLE "campaign_recipients" DROP CONSTRAINT "campaign_recipients_executionId_fkey";

-- DropTable
DROP TABLE "campaign_executions";

-- DropTable
DROP TABLE "campaign_open_events";

-- DropTable
DROP TABLE "campaign_recipients";
