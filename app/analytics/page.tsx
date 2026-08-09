"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchRequest } from "@/lib/api";
import { useAuth } from "@/context/Auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Loader2,
  Mail,
  Clock,
  ArrowRight,
  TrendingUp,
  Eye,
  Send,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

interface CampaignExecutionItem {
  id: string;
  subject: string;
  status: string;
  sentCount: number;
  totalCount: number;
  openedCount: number;
  openRate: number;
  launchedAt: string;
}

export default function AnalyticsListPage() {
  const { user } = useAuth();
  const [executions, setExecutions] = useState<CampaignExecutionItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExecutions = async () => {
    try {
      const res = await fetchRequest("analytics");
      if (!res.ok) {
        throw new Error("Failed to load campaign analytics history");
      }
      const data = await res.json();
      setExecutions(data);
    } catch (error) {
      console.error(error);
      toast.error("Could not fetch campaign analytics history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userId) {
      fetchExecutions();
    }
  }, [user?.userId]);

  // Aggregate Stats
  const totalLaunches = executions.length;
  const totalSent = executions.reduce((acc, e) => acc + e.sentCount, 0);
  const totalOpened = executions.reduce((acc, e) => acc + e.openedCount, 0);
  const overallOpenRate =
    totalSent > 0 ? Math.round((totalOpened / totalSent) * 1000) / 10 : 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 max-w-7xl mx-auto space-y-8">
      {/* Top Title & Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-850 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-violet-600/10 text-violet-400 rounded-lg">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Campaign Launch Analytics
            </h1>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Historical launch history & recipient open tracking across every
            campaign execution.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchExecutions}
          className="border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white cursor-pointer h-9 gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      {/* Aggregate Overview Cards */}
      <div className="grid gap-5 md:grid-cols-4">
        <Card className="bg-zinc-900/40 border-zinc-800">
          <CardContent className="pt-5 space-y-1">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold uppercase tracking-wider">
              <span>Total Launches</span>
              <Clock className="h-4 w-4 text-violet-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">
              {totalLaunches}
            </div>
            <p className="text-[11px] text-zinc-500">Unique execution runs</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/40 border-zinc-800">
          <CardContent className="pt-5 space-y-1">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold uppercase tracking-wider">
              <span>Emails Sent</span>
              <Send className="h-4 w-4 text-blue-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">
              {totalSent}
            </div>
            <p className="text-[11px] text-zinc-500">
              Dispatched via Gmail API
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/40 border-zinc-800">
          <CardContent className="pt-5 space-y-1">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold uppercase tracking-wider">
              <span>Unique Opens</span>
              <Eye className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">
              {totalOpened}
            </div>
            <p className="text-[11px] text-zinc-500">Verified pixel triggers</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/40 border-zinc-800">
          <CardContent className="pt-5 space-y-1">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold uppercase tracking-wider">
              <span>Overall Open Rate</span>
              <TrendingUp className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">
              {overallOpenRate}%
            </div>
            <p className="text-[11px] text-zinc-500">Average open percentage</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Campaign Execution List Table */}
      <Card className="bg-zinc-900/30 border-zinc-800/80 backdrop-blur-md shadow-2xl">
        <CardHeader className="border-b border-zinc-850 pb-4">
          <CardTitle className="text-lg font-bold text-white">
            Campaign Launch History ({executions.length})
          </CardTitle>
          <CardDescription className="text-zinc-400 text-xs">
            Every launch creates an independent execution record. Click any
            entry to inspect detailed recipient activity.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-zinc-400 gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
              <span className="text-sm">
                Loading campaign launch analytics...
              </span>
            </div>
          ) : executions.length === 0 ? (
            <div className="text-center py-16 text-zinc-500 space-y-3">
              <Mail className="h-10 w-10 mx-auto text-zinc-700" />
              <p className="text-sm font-medium">
                No campaign executions found.
              </p>
              <p className="text-xs text-zinc-600 max-w-sm mx-auto">
                Launch your first campaign from the dashboard to begin tracking
                recipient opens in real-time.
              </p>
              <Link href="/dashboard" className="inline-block pt-2">
                <Button
                  size="sm"
                  className="bg-violet-600 hover:bg-violet-500 text-white font-semibold"
                >
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-zinc-900/90 text-zinc-400 uppercase tracking-wider font-semibold border-b border-zinc-850">
                  <tr>
                    <th className="px-4 py-3">Campaign Subject</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Sent</th>
                    <th className="px-4 py-3 text-right">Opened</th>
                    <th className="px-4 py-3 text-right">Open Rate</th>
                    <th className="px-4 py-3">Launched At</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850">
                  {executions.map((exec) => (
                    <tr
                      key={exec.id}
                      className="hover:bg-zinc-900/60 transition-colors group cursor-pointer"
                    >
                      <td className="px-4 py-3.5 font-semibold text-white">
                        <Link
                          href={`/analytics/campaign/${exec.id}`}
                          className="hover:text-violet-400 transition-colors"
                        >
                          {exec.subject}
                        </Link>
                        <div className="text-[10px] font-mono text-zinc-500">
                          ID: {exec.id}
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            exec.status === "completed"
                              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                              : exec.status === "sending"
                                ? "bg-violet-500/10 border border-violet-500/30 text-violet-400 animate-pulse"
                                : exec.status === "failed"
                                  ? "bg-red-500/10 border border-red-500/30 text-red-400"
                                  : "bg-zinc-800 text-zinc-400"
                          }`}
                        >
                          {exec.status}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-right font-mono font-medium text-white">
                        {exec.sentCount} / {exec.totalCount}
                      </td>

                      <td className="px-4 py-3.5 text-right font-mono font-bold text-emerald-400">
                        {exec.openedCount}
                      </td>

                      <td className="px-4 py-3.5 text-right font-mono font-bold text-violet-300">
                        {exec.openRate}%
                      </td>

                      <td className="px-4 py-3.5 text-zinc-400 font-mono text-[11px]">
                        {new Date(exec.launchedAt).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <Link href={`/analytics/campaign/${exec.id}`}>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs text-zinc-400 hover:text-white hover:bg-violet-600/20 gap-1 cursor-pointer"
                          >
                            View Analytics
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
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
