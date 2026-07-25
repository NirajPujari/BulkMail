import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Send, BarChart3, CheckCircle, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  totalEmailsSent: number;
  totalCampaigns: number;
}

export function StatsCards({ totalEmailsSent, totalCampaigns }: StatsCardsProps) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      <Card className="bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700/50 shadow-xl transition-all duration-300 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
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
          <p className="text-xs text-zinc-500 mt-1.5 flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-violet-400" />
            Across all historical campaigns
          </p>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700/50 shadow-xl transition-all duration-300 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
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
          <p className="text-xs text-zinc-500 mt-1.5">
            Saved campaign templates
          </p>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700/50 shadow-xl transition-all duration-300 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Average Delivery Rate
          </CardTitle>
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <CheckCircle className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-3xl font-extrabold text-white tracking-tight">
            99.8%
          </div>
          <p className="text-xs text-emerald-500 mt-1.5">
            Industry standard benchmark
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
