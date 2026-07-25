"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/Auth";
import { fetchRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Campaign } from "@/types/campaign";
import { StatsCards } from "./components/StatsCards";
import { CampaignComposer } from "./components/CampaignComposer";
import { CampaignHistory } from "./components/CampaignHistory";
import { CampaignSimulator } from "./components/CampaignSimulator";

export default function Dashboard() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [recipientInput, setRecipientInput] = useState("");
  const [senderEmail, setSenderEmail] = useState("");

  // Selected campaign state for editing drafts/campaigns in-place
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
    null,
  );

  // Active background campaign state
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(null);

  // Simulation/Overlay states
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [simulationStats, setSimulationStats] = useState({
    sent: 0,
    failed: 0,
    total: 0,
  });

  // Saving state
  const [isSaving, setIsSaving] = useState(false);

  // Fetch campaigns
  const fetchCampaigns = async () => {
    try {
      const res = await fetchRequest("campaigns");
      if (!res.ok) throw new Error("Failed to fetch campaigns");
      const data = await res.json();
      setCampaigns(data);

      // Check if there is an active running campaign
      const active = data.find((c: Campaign) => c.status === "sending");
      if (active) {
        setActiveCampaignId(active.id);
        setIsSimulating(true);
      }
    } catch (error) {
      console.error(error);
      toast.error("Could not load recent campaigns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setSenderEmail(user.email);
      fetchCampaigns();
    }
  }, [user]);

  // Polling for active campaign progress
  useEffect(() => {
    if (!activeCampaignId) return;

    const pollInterval = setInterval(async () => {
      try {
        const res = await fetchRequest(`campaigns?id=${activeCampaignId}`);
        if (!res.ok) throw new Error("Failed to fetch status");
        const data = await res.json();

        const logLines = data.logs ? data.logs.split("\n") : [];
        const failedCount = logLines.filter((line: string) => line.startsWith("[Failed]")).length;
        const processed = data.sentCount + failedCount;
        const progress = data.totalCount > 0 ? Math.round((processed / data.totalCount) * 100) : 0;

        setSimulationProgress(Math.min(progress, 100));
        setSimulationStats({
          sent: data.sentCount,
          failed: failedCount,
          total: data.totalCount,
        });
        setSimulationLogs(logLines);

        if (data.status === "completed" || data.status === "failed") {
          clearInterval(pollInterval);
          setActiveCampaignId(null);
          toast.success(`Campaign "${data.subject}" execution finished: ${data.status}`);
          fetchCampaigns();
        }
      } catch (error) {
        console.error("Status polling error:", error);
      }
    }, 1500);

    return () => clearInterval(pollInterval);
  }, [activeCampaignId]);

  // Aggregate stats
  const totalEmailsSent = campaigns.reduce((acc, c) => acc + c.sentCount, 0);
  const totalCampaigns = campaigns.length;

  const handleClearSelection = () => {
    setSelectedCampaignId(null);
    setSubject("");
    setBody("");
    setRecipientInput("");
  };

  const handleLaunchCampaign = async () => {
    if (activeCampaignId) {
      toast.error("A campaign is already running. Please wait for it to complete.");
      return;
    }

    if (!subject.trim() || !body.trim() || !recipientInput.trim()) {
      toast.error("Please fill in all campaign fields to launch");
      return;
    }

    // Parse recipients
    const emails = recipientInput
      .split(/[\n,;]+/)
      .map((email) => email.trim())
      .filter((email) => email.length > 0 && email.includes("@"));

    if (emails.length === 0) {
      toast.error("Please enter at least one valid recipient email address");
      return;
    }

    // Reset overlay state
    setSimulationProgress(0);
    setSimulationLogs(["[System] Queuing campaign..."]);
    setSimulationStats({ sent: 0, failed: 0, total: emails.length });
    setIsSimulating(true);

    try {
      const res = await fetchRequest("campaigns/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedCampaignId,
          subject,
          body,
          recipients: recipientInput,
          senderEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to launch campaign");
      }

      toast.success("Campaign launched in background!");
      setActiveCampaignId(data.campaignId);
      handleClearSelection();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Could not launch campaign.");
      setIsSimulating(false);
    }
  };

  const handleSaveCampaign = async () => {
    if (activeCampaignId) {
      toast.error("A campaign is already running. Please wait for it to complete.");
      return;
    }

    if (!subject.trim() || !body.trim() || !recipientInput.trim()) {
      toast.error("Please fill in all campaign fields to save");
      return;
    }

    // Parse recipients
    const emails = recipientInput
      .split(/[\n,;]+/)
      .map((email) => email.trim())
      .filter((email) => email.length > 0 && email.includes("@"));

    if (emails.length === 0) {
      toast.error("Please enter at least one valid recipient email address");
      return;
    }

    setIsSaving(true);
    try {
      const isUpdate = !!selectedCampaignId;
      const res = await fetchRequest("campaigns", {
        method: isUpdate ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(isUpdate && { id: selectedCampaignId }),
          subject,
          body,
          recipients: emails.join(", "),
          status: "draft",
          sentCount: 0,
          totalCount: emails.length,
        }),
      });

      if (!res.ok) throw new Error();

      toast.success(
        isUpdate ? "Campaign draft updated successfully!" : "Campaign draft saved successfully!",
      );

      // Reset form & selection
      handleClearSelection();

      // Refresh campaigns list
      await fetchCampaigns();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save campaign draft.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectCampaign = (campaign: Campaign) => {
    // If this campaign is currently sending, load it into the progress modal!
    if (campaign.status === "sending") {
      setActiveCampaignId(campaign.id);
      setIsSimulating(true);
      return;
    }

    setSelectedCampaignId(campaign.id);
    setSubject(campaign.subject);
    setBody(campaign.body);
    // Split comma separated emails and join with newlines for editing
    setRecipientInput(campaign.recipients.split(", ").join("\n"));
    toast.success(`Loaded campaign: "${campaign.subject}" into composer.`);
  };

  const handleDeleteCampaign = async (id: string) => {
    if (activeCampaignId === id) {
      toast.error("Cannot delete a campaign while it is actively sending.");
      return;
    }

    if (!confirm("Are you sure you want to delete this campaign?")) {
      return;
    }

    try {
      const res = await fetchRequest(`campaigns?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete campaign");

      toast.success("Campaign deleted successfully.");

      // Reset selected states if deleted campaign was active
      if (selectedCampaignId === id) {
        handleClearSelection();
      }

      await fetchCampaigns();
    } catch (error) {
      console.error(error);
      toast.error("Could not delete campaign.");
    }
  };

  return (
    <div className="space-y-8 pb-12 relative">
      {/* Decorative background glows */}
      <div className="absolute -top-25 left-1/3 w-75 h-75 rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-50 right-10 w-62.5 h-62.5 rounded-full bg-blue-600/5 blur-[100px] pointer-events-none" />

      {/* Welcome & Stats Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            Welcome back,{" "}
            <span className="bg-linear-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              {user?.name || "User"}
            </span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Monitor email volume, dispatch bulk campaigns, and inspect routing
            diagnostics.
          </p>
        </div>
        <Button
          onClick={fetchCampaigns}
          variant="outline"
          size="sm"
          className="gap-2 border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white cursor-pointer transition-all duration-300"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Stats
        </Button>
      </div>

      {/* Grid Stats Component */}
      <StatsCards
        totalEmailsSent={totalEmailsSent}
        totalCampaigns={totalCampaigns}
      />

      {activeCampaignId && (
        <div className="bg-violet-900/15 border border-violet-850 p-4 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-violet-300 text-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            <span>A campaign is actively dispatching in the background.</span>
          </div>
          <Button
            size="sm"
            onClick={() => setIsSimulating(true)}
            className="bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-lg"
          >
            Open Progress Console
          </Button>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Bulk Mail Composer Component */}
        <div className="lg:col-span-2 space-y-6">
          <CampaignComposer
            subject={subject}
            setSubject={setSubject}
            body={body}
            setBody={setBody}
            recipientInput={recipientInput}
            setRecipientInput={setRecipientInput}
            senderEmail={senderEmail}
            setSenderEmail={setSenderEmail}
            selectedCampaignId={selectedCampaignId}
            handleClearSelection={handleClearSelection}
            handleSaveCampaign={handleSaveCampaign}
            handleLaunchCampaign={handleLaunchCampaign}
            isSaving={isSaving || activeCampaignId !== null}
          />
        </div>

        {/* Campaign History Log Component */}
        <div className="lg:col-span-1">
          <CampaignHistory
            campaigns={campaigns}
            loading={loading}
            selectedCampaignId={selectedCampaignId}
            handleSelectCampaign={handleSelectCampaign}
            handleDeleteCampaign={handleDeleteCampaign}
          />
        </div>
      </div>

      {/* Interactive Campaign Progress Simulator Overlay */}
      {isSimulating && (
        <CampaignSimulator
          setIsSimulating={setIsSimulating}
          simulationProgress={simulationProgress}
          simulationLogs={simulationLogs}
          simulationStats={simulationStats}
        />
      )}
    </div>
  );
}
