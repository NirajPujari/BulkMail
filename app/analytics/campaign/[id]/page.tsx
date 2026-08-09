"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchRequest } from "@/lib/api";
import { CampaignAnalyticsData } from "@/types/campaign";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  RefreshCw,
  Rocket,
  Send,
  Eye,
  AlertTriangle,
  Search,
  Calendar,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

export default function CampaignAnalyticsDashboard({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: campaignId } = use(params);
  const router = useRouter();

  const [data, setData] = useState<CampaignAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRelaunching, setIsRelaunching] = useState(false);

  // Recipient table filter & search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"recipients" | "events" | "logs">(
    "recipients"
  );

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchRequest(`campaigns/${campaignId}/analytics`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to load campaign analytics");
      }
      const analyticsData = await res.json();
      setData(analyticsData);
    } catch (err) {
      console.error(err);
      setError("Could not load campaign telemetry data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (campaignId) {
      fetchAnalytics();
    }
  }, [campaignId]);

  const handleRelaunch = async () => {
    if (
      !confirm(
        "Relaunch this campaign as a new execution draft? Historical analytics for this send will remain 100% untouched."
      )
    ) {
      return;
    }

    try {
      setIsRelaunching(true);
      const res = await fetchRequest(`campaigns/${campaignId}/relaunch`, {
        method: "POST",
      });
      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.message || "Failed to relaunch campaign");
      }

      toast.success("New campaign execution created from original draft!");
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Relaunch failed");
    } finally {
      setIsRelaunching(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
        <span className="text-sm font-medium">
          Loading Campaign Telemetry & Analytics...
        </span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-zinc-950 px-6 py-12 flex flex-col items-center justify-center text-center">
        <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 mb-4">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Campaign Not Found
        </h2>
        <p className="text-sm text-zinc-400 max-w-md mb-6">
          {error || "Could not retrieve metrics for this campaign."}
        </p>
        <Link href="/dashboard">
          <Button
            variant="outline"
            className="border-zinc-800 text-white gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const { campaign, metrics, recipients, recentEvents } = data;

  // Filtered recipients
  const filteredRecipients = recipients.filter((r) => {
    const matchesSearch =
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      Object.values(r.variables).some((v) =>
        v.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (statusFilter === "opened") return matchesSearch && r.openCount > 0;
    if (statusFilter === "bounced")
      return matchesSearch && r.status === "bounced";
    if (statusFilter === "sent") return matchesSearch && r.status === "sent";
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 max-w-7xl mx-auto space-y-8">
      {/* Top Header Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-850 pb-6">
        <div className="space-y-2">
          <Link
            href="/analytics"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Analytics Overview
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {campaign.subject}
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                campaign.status === "completed"
                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                  : campaign.status === "sending"
                    ? "bg-violet-500/10 border border-violet-500/30 text-violet-400 animate-pulse"
                    : campaign.status === "failed"
                      ? "bg-red-500/10 border border-red-500/30 text-red-400"
                      : "bg-zinc-800 text-zinc-300"
              }`}
            >
              {campaign.status}
            </span>

            {campaign.relaunchedFrom && (
              <span className="px-2.5 py-0.5 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300 text-xs font-mono">
                Relaunched from: {campaign.relaunchedFrom.subject}
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-zinc-500" />
            Created {new Date(campaign.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={fetchAnalytics}
            size="sm"
            className="border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white h-9 gap-1.5 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh Telemetry
          </Button>

          <Button
            type="button"
            onClick={handleRelaunch}
            disabled={isRelaunching}
            size="sm"
            className="bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold h-9 gap-2 shadow-lg shadow-violet-600/25 cursor-pointer"
          >
            {isRelaunching ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Relaunching...
              </>
            ) : (
              <>
                <Rocket className="h-4 w-4" /> Relaunch Campaign
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* KPI 1: Sent & Total */}
        <Card className="bg-zinc-900/50 border-zinc-800/80 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Delivered Emails
            </CardTitle>
            <Send className="h-4 w-4 text-violet-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {metrics.sentCount}{" "}
              <span className="text-xs text-zinc-500 font-normal">
                / {metrics.totalCount}
              </span>
            </div>
            <div className="mt-2 text-[11px] text-zinc-400 flex items-center justify-between">
              <span>Delivery Rate</span>
              <span className="font-mono text-emerald-400 font-bold">
                {metrics.totalCount > 0
                  ? Math.round((metrics.sentCount / metrics.totalCount) * 100)
                  : 0}
                %
              </span>
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: Bounced & Failed */}
        <Card className="bg-zinc-900/50 border-zinc-800/80 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Bounced / Failed
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {metrics.bounceCount}
            </div>
            <div className="mt-2 text-[11px] text-zinc-400 flex items-center justify-between">
              <span>Bounce Rate</span>
              <span className="font-mono text-rose-400 font-bold">
                {metrics.bounceRate}%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: Opens & Unique Opens */}
        <Card className="bg-zinc-900/50 border-zinc-800/80 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Opens (Unique)
            </CardTitle>
            <Eye className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {metrics.uniqueOpens}{" "}
              <span className="text-xs text-zinc-500 font-normal">
                ({metrics.totalOpens} total)
              </span>
            </div>
            <div className="mt-2 text-[11px] text-zinc-400 flex items-center justify-between">
              <span>Open Rate</span>
              <span className="font-mono text-emerald-400 font-bold">
                {metrics.openRate}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visual Funnel Progress Bar */}
      <Card className="bg-zinc-900/40 border-zinc-800/80 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-white text-sm">
            <TrendingUp className="h-4 w-4 text-violet-400" />
            <span>Campaign Open Rate Funnel</span>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            {metrics.uniqueOpens} unique opens
          </span>
        </div>

        <div className="space-y-2">
          {/* Progress Bar Stack */}
          <div className="h-3 w-full bg-zinc-950 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${Math.min(100, metrics.openRate)}%` }}
              title={`Open Rate: ${metrics.openRate}%`}
            />
            <div
              className="bg-rose-500 h-full transition-all duration-500"
              style={{ width: `${Math.min(100, metrics.bounceRate)}%` }}
              title={`Bounce Rate: ${metrics.bounceRate}%`}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>
                Unique Open Rate:{" "}
                <strong className="text-white">{metrics.openRate}%</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500 inline-block" />
              <span>
                Bounce Rate:{" "}
                <strong className="text-white">{metrics.bounceRate}%</strong>
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Recipient & Event Telemetry Section */}
      <Card className="bg-zinc-900/30 border-zinc-800/80">
        <CardHeader className="border-b border-zinc-850 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Tab Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("recipients")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "recipients"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                Recipient Activity ({recipients.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("events")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "events"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                Live Open Stream ({recentEvents.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("logs")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "logs"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                System Logs
              </button>
            </div>

            {/* Recipient Filters */}
            {activeTab === "recipients" && (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search recipient email..."
                    className="h-8 bg-zinc-950 border-zinc-800 pl-8 text-xs text-white w-48"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-8 bg-zinc-950 border border-zinc-800 rounded-md text-xs text-zinc-300 px-2.5 focus:outline-none focus:ring-1 focus:ring-violet-500 cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="opened">Opened Only</option>
                  <option value="sent">Sent</option>
                  <option value="bounced">Bounced / Failed</option>
                </select>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          {/* TAB 1: Recipient Activity Table */}
          {activeTab === "recipients" && (
            <div className="overflow-x-auto rounded-lg border border-zinc-850">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider font-semibold border-b border-zinc-850">
                  <tr>
                    <th className="px-4 py-3">Recipient Email</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Opens</th>
                    <th className="px-4 py-3">Last Engagement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850 bg-zinc-900/20">
                  {filteredRecipients.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-8 text-center text-zinc-500 italic"
                      >
                        No recipient activity records match filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredRecipients.map((r, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-zinc-900/60 transition-colors"
                      >
                        <td className="px-4 py-3 font-mono font-medium text-white">
                          {r.email}
                          {Object.keys(r.variables).length > 0 && (
                            <div className="text-[10px] text-zinc-500 font-sans mt-0.5">
                              {Object.entries(r.variables)
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(" • ")}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              r.status === "sent"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : r.status === "bounced" ||
                                    r.status === "failed"
                                  ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                  : "bg-zinc-800 text-zinc-400"
                            }`}
                          >
                            {r.status}
                          </span>
                          {r.errorMessage && (
                            <div
                              className="text-[10px] text-rose-400 mt-1 truncate max-w-xs"
                              title={r.errorMessage}
                            >
                              {r.errorMessage}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {r.openCount > 0 ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold font-mono">
                              {r.openCount} open(s)
                            </span>
                          ) : (
                            <span className="text-zinc-600">0</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-zinc-400 font-mono text-[11px]">
                          {r.lastActivity ? (
                            new Date(r.lastActivity).toLocaleString()
                          ) : (
                            <span className="text-zinc-600 italic">
                              No activity yet
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: Live Open Event Stream */}
          {activeTab === "events" && (
            <div className="space-y-3">
              {recentEvents.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 italic border border-zinc-850 rounded-lg">
                  No open or bounce events recorded yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {recentEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-3 rounded-lg border border-zinc-850 bg-zinc-950 flex items-center justify-between text-xs font-mono"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`p-1.5 rounded-md ${
                            ev.type === "open"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-rose-500/10 text-rose-400"
                          }`}
                        >
                          {ev.type === "open" && <Eye className="h-4 w-4" />}
                          {ev.type === "bounce" && (
                            <AlertTriangle className="h-4 w-4" />
                          )}
                        </span>
                        <div>
                          <div className="text-white font-bold">
                            [{ev.type.toUpperCase()}] {ev.recipientEmail}
                          </div>
                        </div>
                      </div>

                      <div className="text-right text-zinc-500 text-[11px]">
                        <div>{new Date(ev.createdAt).toLocaleString()}</div>
                        {ev.ip && (
                          <div className="text-zinc-600">IP: {ev.ip}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: System Transmission Logs */}
          {activeTab === "logs" && (
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-850 font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
              {campaign.logs || "No transmission logs recorded."}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
