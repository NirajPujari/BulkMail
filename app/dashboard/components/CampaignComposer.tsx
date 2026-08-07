"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sparkles,
  Loader2,
  CheckCircle,
  Send,
  AlertTriangle,
  CheckCircle2,
  Tag,
  Eye,
  Table as TableIcon,
  FileText,
} from "lucide-react";
import { CampaignComposerProps, RecipientVariableItem } from "@/types/campaign";
import { RecipientDataEditor } from "./RecipientDataEditor";
import { RecipientPreviewModal } from "./RecipientPreviewModal";
import { validateCampaignPersonalization } from "@/lib/email/template";
import { toast } from "sonner";

export function CampaignComposer({
  subject,
  setSubject,
  body,
  setBody,
  recipientInput,
  setRecipientInput,
  variables,
  setVariables,
  recipientItems,
  setRecipientItems,
  googleConnected,
  googleEmail,
  remainingQuota = 500,
  dailyQuotaLimit = 500,
  selectedCampaignId,
  handleClearSelection,
  handleSaveCampaign,
  handleLaunchCampaign,
  isSaving,
}: CampaignComposerProps) {
  const [recipientTab, setRecipientTab] = useState<"editor" | "text">("editor");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleConnectGoogle = () => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      alert("Authentication token not found. Please log in again.");
      return;
    }
    window.location.href = `/api/oauth/google/login?token=${encodeURIComponent(token)}`;
  };

  // Keep recipient text area and structured items synced
  const syncToTextInput = (items: RecipientVariableItem[]) => {
    const emailsStr = items.map((i) => i.email).join("\n");
    setRecipientInput(emailsStr);
  };

  // Insert merge tag into targeted field (subject or body)
  const insertMergeTag = (field: "subject" | "body", tagName: string) => {
    const tagText = `{{${tagName}}}`;
    if (field === "subject") {
      setSubject((prev) => `${prev} ${tagText}`.trim());
      toast.success(`Inserted {{${tagName}}} into subject line`);
    } else {
      setBody((prev) => `${prev} ${tagText}`);
      toast.success(`Inserted {{${tagName}}} into email body`);
    }
  };

  // Recipient count evaluation
  const effectiveRecipientCount =
    recipientItems.length > 0
      ? recipientItems.length
      : recipientInput
          .split(/[\n,;]+/)
          .map((e) => e.trim())
          .filter((e) => e.length > 0 && e.includes("@")).length;

  const isQuotaExceeded = effectiveRecipientCount > remainingQuota;

  // Personalization tag validation
  const validation = validateCampaignPersonalization(
    subject,
    body,
    variables,
    recipientItems
  );

  return (
    <>
      <Card className="bg-zinc-900/30 backdrop-blur-md border-zinc-800/80 shadow-2xl hover:border-zinc-800 transition-all duration-300">
        <CardHeader className="space-y-3 border-b border-zinc-850 pb-5">
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
                className="border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white cursor-pointer transition-colors duration-300 text-sm px-2.5 py-1"
              >
                Create New
              </Button>
            )}
          </div>

          {/* Google OAuth Connection Status Banner */}
          <div className="pt-1 space-y-2">
            {googleConnected && googleEmail ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>
                    Connected as{" "}
                    <strong className="text-white font-semibold">
                      {googleEmail}
                    </strong>{" "}
                    (Gmail API) •{" "}
                    <span className="font-mono text-emerald-300">
                      {remainingQuota} / {dailyQuotaLimit} remaining today
                    </span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleConnectGoogle}
                  className="text-zinc-400 hover:text-white underline cursor-pointer text-sm self-start sm:self-auto"
                >
                  Reconnect
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 text-sm">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
                  <span>
                    <strong className="font-semibold text-white">
                      Google Account Not Connected.
                    </strong>{" "}
                    Connect a Gmail account to enable bulk dispatch.
                  </span>
                </div>
                <Button
                  type="button"
                  onClick={handleConnectGoogle}
                  size="sm"
                  className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-3 py-1.5 h-8 text-sm cursor-pointer shadow-md shadow-amber-500/20 shrink-0 self-start sm:self-auto"
                >
                  Connect Google Account
                </Button>
              </div>
            )}

            {/* Quota Exceeded Warning Banner */}
            {isQuotaExceeded && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm font-medium">
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
                <span>
                  <strong>Quota Warning:</strong> Selected recipient count (
                  {effectiveRecipientCount}) exceeds your remaining daily quota (
                  {remainingQuota}). Reduce recipients or wait for daily reset.
                </span>
              </div>
            )}

            {/* Personalization Tag Validation Warnings */}
            {validation.undefinedTags.length > 0 && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-medium">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
                <span>
                  <strong>Undefined Merge Tags Used:</strong> The following tags are used in your email template but not defined in your recipient variables:{" "}
                  <span className="font-mono text-amber-200 font-bold">
                    {validation.undefinedTags.map((t) => `{{${t}}}`).join(", ")}
                  </span>
                </span>
              </div>
            )}

            {validation.missingValueRecipients.length > 0 && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-medium">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
                <span>
                  <strong>Missing Recipient Values:</strong> {validation.missingValueRecipients.length} recipient(s) have missing or empty values for merge tags used in your template.
                </span>
              </div>
            )}
          </div>

          <CardDescription className="text-zinc-400 text-sm">
            {selectedCampaignId ? (
              <span className="text-violet-400 font-semibold">
                Editing existing campaign. Any edits will update the current record on save/launch.
              </span>
            ) : (
              "Draft an email template with dynamic merge variables (e.g. {{name}}, {{company}}), manage recipients, and preview personalized output."
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-5">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {/* Subject Line & Insert Chips */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Subject Line
                </label>
                {variables.length > 0 && (
                  <div className="flex items-center gap-1 overflow-x-auto max-w-md">
                    <span className="text-[10px] text-zinc-500 font-medium shrink-0">Insert Tag:</span>
                    {variables.map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => insertMergeTag("subject", v)}
                        className="px-2 py-0.5 rounded-md bg-violet-600/10 border border-violet-500/20 text-violet-300 hover:bg-violet-600/20 text-[10px] font-mono transition-colors shrink-0 cursor-pointer"
                      >
                        + {`{{${v}}}`}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Hello {{name}}, welcome to {{company}}!"
                className="bg-zinc-950/60 border-zinc-800 text-zinc-100 focus-visible:ring-1 focus-visible:ring-violet-500/50 h-10 transition-colors"
                required
              />
            </div>

            {/* Recipient Input Mode Tab Switcher */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRecipientTab("editor")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      recipientTab === "editor"
                        ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                    }`}
                  >
                    <TableIcon className="h-3.5 w-3.5" />
                    Recipient Data Grid & CSV Editor ({recipientItems.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setRecipientTab("text")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      recipientTab === "text"
                        ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                    }`}
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Quick Text Input
                  </button>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPreviewOpen(true)}
                  className="border-violet-500/30 bg-violet-950/30 text-violet-300 hover:bg-violet-900/50 hover:text-white cursor-pointer text-xs h-8 gap-1.5"
                >
                  <Eye className="h-3.5 w-3.5 text-violet-400" />
                  Preview Rendered Email
                </Button>
              </div>

              {/* Recipient Input Content based on Active Tab */}
              {recipientTab === "editor" ? (
                <RecipientDataEditor
                  variables={variables}
                  setVariables={setVariables}
                  recipientItems={recipientItems}
                  setRecipientItems={setRecipientItems}
                  syncToTextInput={syncToTextInput}
                />
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold tracking-wider text-zinc-400">
                      Raw Recipient Email List
                    </label>
                    <span className="text-[10px] text-zinc-500 font-medium">
                      One per line, comma, or semicolon separated
                    </span>
                  </div>
                  <textarea
                    value={recipientInput}
                    onChange={(e) => setRecipientInput(e.target.value)}
                    placeholder="john@example.com&#10;sarah@example.com, michael@example.com"
                    rows={5}
                    className={`w-full min-h-28 rounded-md border bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 focus:outline-none transition-colors duration-200 ${
                      isQuotaExceeded
                        ? "border-red-500/60 focus:ring-red-500/30"
                        : "border-zinc-800 focus:ring-violet-500/30"
                    }`}
                  />
                </div>
              )}
            </div>

            {/* Email Body Content & Tag Chips */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Email Content (Body)
                </label>

                {variables.length > 0 && (
                  <div className="flex items-center gap-1 overflow-x-auto max-w-md">
                    <span className="text-[10px] text-zinc-500 font-medium shrink-0">Insert Tag:</span>
                    {variables.map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => insertMergeTag("body", v)}
                        className="px-2 py-0.5 rounded-md bg-violet-600/10 border border-violet-500/20 text-violet-300 hover:bg-violet-600/20 text-[10px] font-mono transition-colors shrink-0 cursor-pointer"
                      >
                        + {`{{${v}}}`}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Hello {{name}},&#10;&#10;I saw that you work at {{company}} as a {{position}}. We would love to connect!&#10;&#10;Best regards,"
                rows={9}
                className="w-full min-h-48 rounded-md border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-violet-500/30 transition-colors duration-200 font-sans leading-relaxed"
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 mt-2">
              <Button
                type="button"
                onClick={handleSaveCampaign}
                disabled={isSaving}
                className="h-11 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-semibold transition-all duration-300 rounded-lg cursor-pointer flex items-center justify-center gap-2 border border-zinc-850"
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
                disabled={!googleConnected || isQuotaExceeded}
                title={
                  !googleConnected
                    ? "Connect a Google account to enable sending"
                    : isQuotaExceeded
                    ? "Recipient count exceeds remaining daily quota"
                    : undefined
                }
                className="gap-2 h-11 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold transition-all duration-300 shadow-[0_0_15px_rgba(139,92,246,0.25)] hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] rounded-lg border-none flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Send className="h-4 w-4" />
                {selectedCampaignId ? "Launch Update" : "Launch Campaign"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Recipient Live Email Preview Modal */}
      <RecipientPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        subject={subject}
        body={body}
        recipients={
          recipientItems.length > 0
            ? recipientItems
            : recipientInput
                .split(/[\n,;]+/)
                .map((e) => e.trim())
                .filter((e) => e.length > 0 && e.includes("@"))
                .map((e) => ({ email: e, variables: {} }))
        }
        senderEmail={googleEmail || "sender@domain.com"}
      />
    </>
  );
}
