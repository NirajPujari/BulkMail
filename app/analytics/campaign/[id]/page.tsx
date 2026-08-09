"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchRequest } from "@/lib/api";
import { useAuth } from "@/context/Auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  BarChart3,
  Loader2,
  Mail,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
  Send,
  EyeOff,
  Search,
  Filter,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

interface RecipientActivity {
  email: string;
  opened: boolean;
  openedAt: string | null;
  openCount: number;
  status: string;
}

interface CampaignAnalyticsData {
  id: string;
  subject: string;
  body: string;
  status: string;
  launchedAt: string;
  totalCount: number;
  sentCount: number;
  openedCount: number;
  notOpenedCount: number;
  openRate: number;
  logs: string;
  recipients: RecipientActivity[];
}

export default function CampaignAnalyticsDetailPage() {
  const params = useParams();
  const executionId = params?.id as string;
  const { user } = useAuth();

  const [data, setData] = useState<CampaignAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "opened" | "not_opened">("all");

  const fetchAnalyticsDetail = async () => {
    if (!executionId) return;
    try {
      const res = await fetchRequest(`analytics?id=${encodeURIComponent(executionId)}`);
      if (!res.ok) {
        throw new Error("Failed to load campaign execution analytics");
      }
      const analyticsData = await res.json();
      setData(analyticsData);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Could not load campaign analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userId && executionId) {
      fetchAnalyticsDetail();
    }
  }, [user?.userId, executionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400 gap-3 p-6">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
        <span className="text-sm font-medium">Loading campaign execution analytics...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 space-y-4">
        <AlertTriangle className="h-10 w-10 text-amber-500" />
        <h2 className="text-xl font-bold">Campaign Execution Not Found</h2>
        <p className="text-sm text-zinc-400">
          The requested campaign execution ID does not exist or access is forbidden.
        </p>
        <Link href="/analytics">
          <Button variant="outline" className="border-zinc-800 text-zinc-300">
            Back to Analytics List
          </Button>
        </Link>
      </div>
    );
  }

  // Filter recipient list
  const filteredRecipients = data.recipients.filter((r) => {
    const matchesSearch = r.email.toLowerCase().includes(searchQuery.toLowerCase().trim());
    if (statusFilter === "opened") return matchesSearch && r.opened;
    if (statusFilter === "not_opened") return matchesSearch && !r.opened;
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 max-w-7xl mx-auto space-y-8">
      {/* Navigation & Header */}
      <div className="space-y-4 border-b border-zinc-850 pb-6">
        <div className="flex items-center justify-between">
          <Link
            href="/analytics"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to All Campaign Analytics
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchAnalyticsDetail}
            className="border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white cursor-pointer h-8 text-xs gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {data.subject}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  data.status === "completed"
                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                    : data.status === "sending"
                    ? "bg-violet-500/10 border border-violet-500/30 text-violet-400 animate-pulse"
                    : data.status === "failed"
                    ? "bg-red-500/10 border border-red-500/30 text-red-400"
                    : "bg-zinc-800 text-zinc-400"
                }`}
              >
                {data.status}
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-1">
              Execution ID: <span className="text-violet-300 font-bold">{data.id}</span> • Launched:{" "}
              {new Date(data.launchedAt).toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid gap-5 md:grid-cols-5">
        <Card className="bg-zinc-900/40 border-zinc-800">
          <CardContent className="pt-4 space-y-1">
            <div className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
              Recipients
            </div>
            <div className="text-2xl font-extrabold text-white">{data.totalCount}</div>
            <p className="text-[10px] text-zinc-500">Target audience</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/40 border-zinc-800">
          <CardContent className="pt-4 space-y-1">
            <div className="text-xs text-zinc-400 font-semibold uppercase tracking-wider flex items-center justify-between">
              <span>Successfully Sent</span>
              <Send className="h-3.5 w-3.5 text-blue-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">{data.sentCount}</div>
            <p className="text-[10px] text-zinc-500">Delivered via Gmail API</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/40 border-zinc-800 border-l-2 border-l-emerald-500">
          <CardContent className="pt-4 space-y-1">
            <div className="text-xs text-zinc-400 font-semibold uppercase tracking-wider flex items-center justify-between">
              <span>Opened</span>
              <Eye className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-400">{data.openedCount}</div>
            <p className="text-[10px] text-zinc-500">Unique recipient opens</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/40 border-zinc-800">
          <CardContent className="pt-4 space-y-1">
            <div className="text-xs text-zinc-400 font-semibold uppercase tracking-wider flex items-center justify-between">
              <span>Not Opened</span>
              <EyeOff className="h-3.5 w-3.5 text-zinc-500" />
            </div>
            <div className="text-2xl font-extrabold text-zinc-400">{data.notOpenedCount}</div>
            <p className="text-[10px] text-zinc-500">No open events recorded</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/40 border-zinc-800 border-l-2 border-l-violet-500">
          <CardContent className="pt-4 space-y-1">
            <div className="text-xs text-zinc-400 font-semibold uppercase tracking-wider flex items-center justify-between">
              <span>Open Rate</span>
              <BarChart3 className="h-3.5 w-3.5 text-violet-400" />
            </div>
            <div className="text-2xl font-extrabold text-violet-300">{data.openRate}%</div>
            <p className="text-[10px] text-zinc-500">Opened / Sent ratio</p>
          </CardContent>
        </Card>
      </div>

      {/* Recipient Activity Table */}
      <Card className="bg-zinc-900/30 border-zinc-800/80 backdrop-blur-md shadow-2xl">
        <CardHeader className="space-y-4 border-b border-zinc-850 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold text-white">
                Recipient Activity ({filteredRecipients.length})
              </CardTitle>
              <CardDescription className="text-zinc-400 text-xs">
                Inspect open status and timestamp for each recipient in this execution.
              </CardDescription>
            </div>

            {/* Filter Controls */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <Input
                  type="text"
                  placeholder="Filter by email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 text-xs bg-zinc-950/60 border-zinc-800 text-white w-48 focus-visible:ring-1 focus-visible:ring-violet-500/50"
                />
              </div>

              <div className="flex items-center gap-1 bg-zinc-950/80 p-1 rounded-lg border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setStatusFilter("all")}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    statusFilter === "all"
                      ? "bg-violet-600 text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  All ({data.recipients.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("opened")}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    statusFilter === "opened"
                      ? "bg-emerald-600 text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Opened ({data.openedCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("not_opened")}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    statusFilter === "not_opened"
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Not Opened ({data.notOpenedCount})
                </button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredRecipients.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-xs">
              No recipient records match the selected search/filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-zinc-900/90 text-zinc-400 uppercase tracking-wider font-semibold border-b border-zinc-850">
                  <tr>
                    <th className="px-4 py-3">Recipient Email</th>
                    <th className="px-4 py-3">Open Status</th>
                    <th className="px-4 py-3">First Opened Timestamp</th>
                    <th className="px-4 py-3 text-right">Total Open Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850">
                  {filteredRecipients.map((rcp, idx) => (
                    <tr key={idx} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="px-4 py-3 font-mono font-medium text-white">
                        {rcp.email}
                      </td>

                      <td className="px-4 py-3">
                        {rcp.opened ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 uppercase tracking-wider">
                            <CheckCircle2 className="h-3 w-3" /> Opened
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-850 border border-zinc-800 text-zinc-400 uppercase tracking-wider">
                            Not Opened
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 font-mono text-[11px] text-zinc-400">
                        {rcp.openedAt ? (
                          new Date(rcp.openedAt).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })
                        ) : (
                          <span className="text-zinc-600">—</span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-right font-mono font-bold text-white">
                        {rcp.openCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
