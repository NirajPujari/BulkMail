"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchRequest } from "@/lib/api";
import { Campaign } from "@/types/campaign";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart3,
  Send,
  AlertTriangle,
  ArrowRight,
  Loader2,
  Layers,
} from "lucide-react";

export default function OverallAnalyticsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCampaigns() {
      try {
        setLoading(true);
        const res = await fetchRequest("campaigns");
        if (res.ok) {
          const data = await res.json();
          setCampaigns(data);
        }
      } catch (err) {
        console.error("Failed to load campaigns for analytics overview:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCampaigns();
  }, []);

  const totalSent = campaigns.reduce((acc, c) => acc + (c.sentCount || 0), 0);
  const totalBounced = campaigns.reduce(
    (acc, c) => acc + (c.bounceCount || 0),
    0,
  );
  const totalRecipients = campaigns.reduce(
    (acc, c) => acc + (c.totalCount || 0),
    0,
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-850 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-300 text-xs font-semibold uppercase tracking-wider">
            <BarChart3 className="h-3.5 w-3.5" /> Performance & Telemetry
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            Campaign Analytics Overview
          </h1>
          <p className="text-zinc-400 text-sm">
            Aggregate performance metrics across all executed email dispatches.
          </p>
        </div>

        <Link href="/dashboard">
          <Button className="bg-violet-600 hover:bg-violet-500 text-white font-bold h-9 gap-2 shadow-lg shadow-violet-600/25">
            Launch New Campaign
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Global Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-zinc-900/40 border-zinc-800 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Total Emails Sent
            </CardTitle>
            <Send className="h-4 w-4 text-violet-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-white tracking-tight">
              {totalSent}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Across {campaigns.length} campaigns
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/40 border-zinc-800 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Total Recipients Targeted
            </CardTitle>
            <Layers className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-white tracking-tight">
              {totalRecipients}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Unique contact list records
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/40 border-zinc-800 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Bounced / Failed
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-white tracking-tight">
              {totalBounced}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Bounce rate:{" "}
              <strong className="text-rose-400">
                {totalRecipients > 0
                  ? Math.round((totalBounced / totalRecipients) * 100)
                  : 0}
                %
              </strong>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Campaign List */}
      <Card className="bg-zinc-900/30 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-white">
            Select a Campaign for Detailed Telemetry
          </CardTitle>
          <CardDescription className="text-zinc-400 text-xs">
            Click any campaign below to inspect unique opens, link clicks,
            recipient engagement tables, and event logs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-32 items-center justify-center text-zinc-500 gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-violet-500" />
              <span className="text-xs">Loading campaign dispatches...</span>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center p-8 border border-dashed border-zinc-800 rounded-xl text-zinc-500">
              No campaign data found. Create and dispatch your first campaign
              from the Dashboard.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campaigns.map((c) => (
                <Link key={c.id} href={`/analytics/campaign/${c.id}`}>
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-violet-500/50 transition-all cursor-pointer group space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-white group-hover:text-violet-300 transition-colors line-clamp-1">
                        {c.subject}
                      </h4>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          c.status === "completed"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-zinc-800 text-zinc-300"
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-850">
                      <span className="font-mono">
                        {c.sentCount} of {c.totalCount} sent
                      </span>
                      <span className="text-violet-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        View Telemetry <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
