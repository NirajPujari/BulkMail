import { Dispatch, SetStateAction } from "react";

export interface Campaign {
  id: string;
  subject: string;
  body: string;
  recipients: string;
  status: string;
  sentCount: number;
  bounceCount?: number;
  totalCount: number;
  logs?: string;
  relaunchedFromId?: string | null;
  createdAt: string;
  openRate?: number;
}

export interface RecipientVariableItem {
  email: string;
  variables: Record<string, string>;
}

export interface RecipientDataEditorProps {
  variables: string[];
  setVariables: React.Dispatch<React.SetStateAction<string[]>>;
  recipientItems: RecipientVariableItem[];
  setRecipientItems: React.Dispatch<React.SetStateAction<RecipientVariableItem[]>>;
  syncToTextInput: (items: RecipientVariableItem[]) => void;
}

export interface RecipientPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: string;
  body: string;
  recipients: RecipientVariableItem[];
  senderEmail: string;
}

export interface CampaignComposerProps {
  subject: string;
  setSubject: Dispatch<SetStateAction<string>>;
  body: string;
  setBody: Dispatch<SetStateAction<string>>;
  recipientInput: string;
  setRecipientInput: Dispatch<SetStateAction<string>>;
  variables: string[];
  setVariables: Dispatch<SetStateAction<string[]>>;
  recipientItems: RecipientVariableItem[];
  setRecipientItems: Dispatch<SetStateAction<RecipientVariableItem[]>>;
  googleConnected: boolean;
  googleEmail: string | null;
  remainingQuota?: number;
  dailyQuotaLimit?: number;
  selectedCampaignId: string | null;
  handleClearSelection: () => void;
  handleSaveCampaign: () => Promise<void>;
  handleLaunchCampaign: () => Promise<void>;
  isSaving: boolean;
}

export interface CampaignHistoryProps {
  campaigns: Campaign[];
  loading: boolean;
  selectedCampaignId: string | null;
  handleSelectCampaign: (campaign: Campaign) => void;
  handleDeleteCampaign: (id: string) => Promise<void>;
}

export interface CampaignSimulatorProps {
  setIsSimulating: (value: boolean) => void;
  simulationProgress: number;
  simulationLogs: string[];
  simulationStats: {
    sent: number;
    failed: number;
    total: number;
  };
}

export interface PersonalizationValidationResult {
  usedTags: string[];
  undefinedTags: string[];
  missingValueRecipients: Array<{ email: string; missingTags: string[] }>;
  isValid: boolean;
}

export interface CampaignRecipientActivity {
  email: string;
  variables: Record<string, string>;
  status: string;
  sentAt: string | null;
  errorMessage: string | null;
  openCount: number;
  lastActivity: string | null;
}

export interface CampaignEventData {
  id: string;
  campaignId: string;
  recipientEmail: string;
  type: "open" | "bounce";
  ip?: string | null;
  userAgent?: string | null;
  createdAt: string;
}

export interface CampaignAnalyticsMetrics {
  totalCount: number;
  sentCount: number;
  bounceCount: number;
  totalOpens: number;
  uniqueOpens: number;
  openRate: number;
  bounceRate: number;
}

export interface CampaignAnalyticsData {
  campaign: {
    id: string;
    subject: string;
    body: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    logs?: string;
    relaunchedFrom?: { id: string; subject: string; createdAt: string } | null;
    relaunches?: Array<{ id: string; subject: string; createdAt: string; status: string }>;
  };
  metrics: CampaignAnalyticsMetrics;
  recipients: CampaignRecipientActivity[];
  timeline: Array<{ time: string; opens: number }>;
  recentEvents: CampaignEventData[];
}
