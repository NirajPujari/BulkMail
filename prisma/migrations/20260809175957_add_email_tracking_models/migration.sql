-- AlterTable
ALTER TABLE "campaigns" ADD COLUMN     "bouncedCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "email_opens" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "recipientEmail" TEXT NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_opens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "link_clicks" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "recipientEmail" TEXT NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "clickedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "link_clicks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "email_opens" ADD CONSTRAINT "email_opens_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "link_clicks" ADD CONSTRAINT "link_clicks_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;
