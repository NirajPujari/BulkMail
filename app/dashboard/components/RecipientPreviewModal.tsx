"use client";

import { useState } from "react";
import { RecipientPreviewModalProps } from "@/types/campaign";
import { renderTemplate } from "@/lib/email/template";
import { Button } from "@/components/ui/button";
import { X, Eye, Mail, User, CheckCircle2, FileText } from "lucide-react";

export function RecipientPreviewModal({
  isOpen,
  onClose,
  subject,
  body,
  recipients,
  senderEmail,
}: RecipientPreviewModalProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!isOpen) return null;

  const currentRecipient = recipients[selectedIndex] || {
    email: "preview@example.com",
    variables: {},
  };

  const renderedSubject = renderTemplate(
    subject,
    currentRecipient.variables,
    "[Empty]",
  );
  const renderedBody = renderTemplate(
    body,
    currentRecipient.variables,
    "[Empty]",
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4 bg-zinc-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-violet-600/10 text-violet-400 border border-violet-500/20">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Live Recipient Email Preview
              </h3>
              <p className="text-xs text-zinc-400">
                Inspect how dynamic merge tags render for individual campaign
                recipients.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Recipient Selector Toolbar */}
        <div className="px-6 py-3 bg-zinc-950/80 border-b border-zinc-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-zinc-300">
            <User className="h-4 w-4 text-violet-400" />
            <span className="font-semibold">Preview As:</span>
          </div>

          {recipients.length > 0 ? (
            <select
              value={selectedIndex}
              onChange={(e) => setSelectedIndex(Number(e.target.value))}
              className="bg-zinc-900 border border-zinc-700 text-sm text-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-violet-500 cursor-pointer min-w-[280px]"
            >
              {recipients.map((rcp, idx) => (
                <option key={idx} value={idx}>
                  {rcp.email}{" "}
                  {rcp.variables.name ? `(${rcp.variables.name})` : ""}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-xs text-zinc-500 font-mono">
              No recipients added
            </span>
          )}
        </div>

        {/* Rendered Email Card Container */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Email Envelope Meta Details */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-zinc-400 border-b border-zinc-850 pb-2">
              <span className="text-zinc-500">From:</span>
              <span className="text-zinc-200">
                {senderEmail || "your-google-account@gmail.com"}
              </span>
            </div>
            <div className="flex items-center justify-between text-zinc-400 border-b border-zinc-850 pb-2">
              <span className="text-zinc-500">To:</span>
              <span className="text-violet-400 font-bold">
                {currentRecipient.email}
              </span>
            </div>

            {/* Recipient Variables Badge Summary */}
            {Object.keys(currentRecipient.variables).length > 0 && (
              <div className="pt-1 flex flex-wrap items-center gap-1.5">
                <span className="text-zinc-500 text-[11px] font-sans">
                  Active Variables:
                </span>
                {Object.entries(currentRecipient.variables).map(([k, v]) => (
                  <span
                    key={k}
                    className="px-2 py-0.5 rounded-md bg-violet-600/10 border border-violet-500/20 text-violet-300 text-[11px]"
                  >
                    <strong className="text-violet-400">{k}:</strong>{" "}
                    {v || "(empty)"}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Rendered Subject Box */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
              <Mail className="h-3.5 w-3.5 text-violet-400" />
              Rendered Subject
            </label>
            <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-950 text-sm font-semibold text-white">
              {renderedSubject || (
                <span className="text-zinc-600 italic">
                  No subject specified
                </span>
              )}
            </div>
          </div>

          {/* Rendered Body Box */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
              <FileText className="h-3.5 w-3.5 text-violet-400" />
              Rendered Body Content
            </label>
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 text-sm text-zinc-200 whitespace-pre-wrap min-h-[160px] leading-relaxed font-sans">
              {renderedBody || (
                <span className="text-zinc-600 italic">
                  No body text content
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-zinc-800 px-6 py-3.5 bg-zinc-950/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium">
            <CheckCircle2 className="h-4 w-4" />
            <span>Ready for personalized Gmail API dispatch</span>
          </div>

          <Button
            type="button"
            onClick={onClose}
            className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs h-9 px-4 cursor-pointer"
          >
            Close Preview
          </Button>
        </div>
      </div>
    </div>
  );
}
