import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCardsProps } from "@/types/ui";
import { Send, BarChart3, TrendingUp, ShieldAlert, Zap } from "lucide-react";

export function StatsCards({
  totalEmailsSent,
  totalCampaigns,
  emailsSentToday = 0,
  dailyQuotaLimit = 500,
  remainingQuota = 500,
}: StatsCardsProps) {
  const usedPercentage = Math.min(
    100,
    Math.round((emailsSentToday / dailyQuotaLimit) * 100),
  );

  return (
    <div className="grid gap-5 md:grid-cols-3">
      <Card className="bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700/50 shadow-xl transition-all duration-300 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Total Emails Sent
          </CardTitle>
          <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
            <Send className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {totalEmailsSent.toLocaleString()}
          </div>
          <p className="text-sm text-zinc-500 mt-1.5 flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-violet-400" />
            Across all historical campaigns
          </p>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700/50 shadow-xl transition-all duration-300 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Total Campaigns
          </CardTitle>
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
            <BarChart3 className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {totalCampaigns}
          </div>
          <p className="text-sm text-zinc-500 mt-1.5">
            Saved campaign templates
          </p>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700/50 shadow-xl transition-all duration-300 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Gmail Daily Quota
          </CardTitle>
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <Zap className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="pt-2 space-y-2">
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-white tracking-tight">
              {remainingQuota}
              <span className="text-sm font-normal text-zinc-400 ml-1.5">
                left today
              </span>
            </div>
            <span className="text-xs font-mono font-medium text-emerald-400">
              {emailsSentToday} / {dailyQuotaLimit} sent
            </span>
          </div>
          {/* Visual Progress Bar */}
          <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                usedPercentage > 90
                  ? "bg-red-500"
                  : usedPercentage > 75
                    ? "bg-amber-500"
                    : "bg-emerald-500"
              }`}
              style={{ width: `${usedPercentage}%` }}
            />
          </div>
          <p className="text-xs text-zinc-500 flex items-center gap-1">
            <ShieldAlert className="h-3.5 w-3.5 text-emerald-400" />
            Resets automatically every day at 00:00 UTC
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
