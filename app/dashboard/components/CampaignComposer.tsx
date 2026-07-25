import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles, Loader2, CheckCircle, Send } from "lucide-react";
import { CampaignComposerProps } from "@/types/campaign";

export function CampaignComposer({
  subject,
  setSubject,
  body,
  setBody,
  recipientInput,
  setRecipientInput,
  senderEmail,
  setSenderEmail,
  selectedCampaignId,
  handleClearSelection,
  handleSaveCampaign,
  handleLaunchCampaign,
  isSaving,
}: CampaignComposerProps) {
  return (
    <Card className="bg-zinc-900/30 backdrop-blur-md border-zinc-800/80 shadow-2xl hover:border-zinc-800 transition-all duration-300">
      <CardHeader className="space-y-1.5 border-b border-zinc-850 pb-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-violet-600/10 text-violet-400 rounded-lg">
              <Sparkles className="h-5 w-5" />
            </div>
            <CardTitle className="text-lg font-bold text-white">
              Bulk Campaign Composer
            </CardTitle>
          </div>
          {selectedCampaignId && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClearSelection}
              className="border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white cursor-pointer transition-colors duration-300 text-xs px-2.5 py-1"
            >
              Create New
            </Button>
          )}
        </div>
        <CardDescription className="text-zinc-400">
          {selectedCampaignId ? (
            <span className="text-violet-400 font-semibold">
              Editing existing campaign. Any edits will update the current
              record on save/launch.
            </span>
          ) : (
            "Draft an email, specify sender credentials, and enter recipient lists."
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Sender Email
              </label>
              <Input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="sender@yourdomain.com"
                className="bg-zinc-950/60 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500/50 focus-visible:border-violet-500/50 h-10 transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Subject Line
              </label>
              <Input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Monthly Newsletter - July 2026"
                className="bg-zinc-950/60 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500/50 focus-visible:border-violet-500/50 h-10 transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold tracking-wider text-zinc-400">
                Recipient List
              </label>
              <span className="text-[10px] text-zinc-500 font-medium">
                One per line, comma, or semicolon separated
              </span>
            </div>
            <textarea
              value={recipientInput}
              onChange={(e) => setRecipientInput(e.target.value)}
              placeholder="john@example.com&#10;sarah@example.com, michael@example.com"
              rows={4}
              className="w-full flex min-h-24 rounded-md border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:outline-none focus:border-violet-500/55 focus:ring-1 focus:ring-violet-500/30 transition-colors duration-200"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Email Content (Body)
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your email template message here..."
              rows={8}
              className="w-full flex min-h-44 rounded-md border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:outline-none focus:border-violet-500/55 focus:ring-1 focus:ring-violet-500/30 transition-colors duration-200"
              required
            />
          </div>

          {/* Form Action Buttons */}
          <div className="grid grid-cols-2 gap-4 mt-2">
            <Button
              type="button"
              onClick={handleSaveCampaign}
              disabled={isSaving}
              className="h-11 bg-zinc-800 hover:bg-zinc-700 text-zinc-350 hover:text-white font-semibold transition-all duration-300 rounded-lg cursor-pointer flex items-center justify-center gap-2 border border-zinc-850"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  {selectedCampaignId ? "Update Draft" : "Save Draft"}
                </>
              )}
            </Button>

            <Button
              type="button"
              onClick={handleLaunchCampaign}
              className="gap-2 h-11 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold transition-all duration-300 shadow-[0_0_15px_rgba(139,92,246,0.25)] hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] cursor-pointer rounded-lg border-none flex items-center justify-center"
            >
              <Send className="h-4 w-4" />
              {selectedCampaignId ? "Launch Update" : "Launch Campaign"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
