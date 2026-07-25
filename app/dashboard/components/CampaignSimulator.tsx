import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Terminal as TerminalIcon } from "lucide-react";
import { CampaignSimulatorProps } from "@/types/campaign";

export function CampaignSimulator({
  setIsSimulating,
  simulationProgress,
  simulationLogs,
  simulationStats,
}: CampaignSimulatorProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-md p-4 animate-fade-in">
      <Card className="w-full max-w-lg bg-zinc-900 border border-zinc-800 shadow-2xl relative overflow-hidden rounded-2xl">
        {/* Top decorative glow */}
        <div className="absolute top-0 left-0 w-full h-0.75 bg-linear-to-r from-violet-500 via-fuchsia-500 to-blue-500" />

        <CardHeader className="pb-3 border-b border-zinc-800">
          <CardTitle className="text-lg font-bold flex items-center gap-2.5 text-white">
            <Loader2 className="h-5 w-5 text-violet-500 animate-spin" />
            Active Campaign Dispatcher
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Transmitting SMTP message relays to recipient queue. Do not close this
            window.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-zinc-400">Transmitting payload...</span>
              <span className="text-violet-400 font-bold">
                {simulationProgress}%
              </span>
            </div>
            <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-850">
              <div
                className="h-full bg-linear-to-r from-violet-600 via-fuchsia-650 to-indigo-600 rounded-full transition-all duration-205"
                style={{ width: `${simulationProgress}%` }}
              />
            </div>
          </div>

          {/* Stats readout */}
          <div className="grid grid-cols-3 gap-3 text-center bg-zinc-950/80 p-4 rounded-xl border border-zinc-850">
            <div className="space-y-0.5">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Dispatched
              </div>
              <div className="text-lg font-extrabold text-white">
                {simulationStats.sent}
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Bounced
              </div>
              <div className="text-lg font-extrabold text-rose-500">
                {simulationStats.failed}
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Queue Total
              </div>
              <div className="text-lg font-extrabold text-white">
                {simulationStats.total}
              </div>
            </div>
          </div>

          {/* Console log readout */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <TerminalIcon className="h-3 w-3 text-emerald-500" />
              Transport Telemetry Log
            </label>
            <div className="h-48 bg-black text-emerald-400 font-mono text-[11px] p-4 rounded-xl overflow-y-auto space-y-1.5 border border-emerald-950/30 shadow-inner">
              {simulationLogs.map((log, index) => (
                <div key={index} className="line-clamp-2 leading-relaxed">
                  {log}
                </div>
              ))}
              {simulationProgress < 100 && (
                <div className="flex items-center gap-2 text-zinc-500 animate-pulse mt-2 font-sans text-xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                  </span>
                  Listening for server response...
                </div>
              )}
            </div>
          </div>

          {/* Footer controls */}
          <div className="flex justify-end pt-2 border-t border-zinc-800/80">
            <Button
              onClick={() => setIsSimulating(false)}
              disabled={simulationProgress < 100}
              className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold cursor-pointer rounded-lg border-none"
            >
              {simulationProgress < 100 ? "Sending..." : "Dismiss Console"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
