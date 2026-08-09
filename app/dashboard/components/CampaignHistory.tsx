import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { History, Loader2, Mail, Trash2, Check, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CampaignHistoryProps } from "@/types/campaign";

export function CampaignHistory({
  campaigns,
  loading,
  selectedCampaignId,
  handleSelectCampaign,
  handleDeleteCampaign,
}: CampaignHistoryProps) {
  return (
    <Card className="h-full bg-zinc-900/30 backdrop-blur-md border-zinc-800/80 shadow-2xl hover:border-zinc-800 transition-all duration-300 flex flex-col">
      <CardHeader className="pb-3 border-b border-zinc-850">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-zinc-800 text-zinc-400 rounded-lg">
              <History className="h-5 w-5" />
            </div>
            <CardTitle className="text-lg font-bold text-white">
              Campaign History
            </CardTitle>
          </div>
        </div>
        <CardDescription className="text-zinc-500 text-xs">
          Recent email dispatches. Select a campaign to edit or view full
          analytics telemetry.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 flex-1 flex flex-col justify-start">
        {loading ? (
          <div className="flex h-48 items-center justify-center flex-1">
            <Loader2 className="h-8 w-8 text-violet-500 animate-spin" />
          </div>
        ) : campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-8 h-48 text-zinc-500 border border-dashed rounded-lg border-zinc-800/80 flex-1">
            <Mail className="h-8 w-8 mb-2.5 stroke-1 text-zinc-600" />
            <p className="text-sm font-medium">No campaigns sent yet.</p>
            <p className="text-xs text-zinc-500 mt-1">
              Draft your first campaign on the left.
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-125 overflow-y-auto pr-1 flex-1">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                onClick={() => handleSelectCampaign(campaign)}
                className={cn(
                  "p-4 border rounded-xl relative group cursor-pointer transition-all duration-300 space-y-2.5",
                  selectedCampaignId === campaign.id
                    ? "border-violet-500 bg-violet-600/10 shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                    : "border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900/40 hover:border-zinc-700/60 hover:scale-[1.01] active:scale-[0.99]",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <h4
                    className={cn(
                      "font-bold text-sm line-clamp-1 transition-colors",
                      selectedCampaignId === campaign.id
                        ? "text-violet-300"
                        : "text-zinc-200 group-hover:text-violet-400",
                    )}
                  >
                    {campaign.subject}
                  </h4>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {campaign.status === "draft" ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-700">
                        Draft
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <Check className="h-2.5 w-2.5" />
                        {campaign.status}
                      </span>
                    )}

                    <Link
                      href={`/analytics/campaign/${campaign.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 rounded-md bg-violet-600/10 border border-violet-500/20 text-violet-400 hover:bg-violet-600/20 transition-colors"
                      title="View Telemetry Analytics"
                    >
                      <BarChart3 className="h-3.5 w-3.5" />
                    </Link>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCampaign(campaign.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 hover:text-rose-500 text-zinc-500 p-1 rounded-md hover:bg-zinc-800 transition-all duration-200 cursor-pointer"
                      title="Delete Campaign"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {campaign.body}
                </p>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-2 border-t border-zinc-800/80">
                  <span className="font-semibold text-zinc-400">
                    {campaign.status === "draft"
                      ? `${campaign.totalCount} recipients`
                      : `${campaign.sentCount} of ${campaign.totalCount} sent`}
                  </span>
                  <span>
                    {new Date(campaign.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
