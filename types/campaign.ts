export interface Campaign {
  id: string;
  subject: string;
  body: string;
  recipients: string;
  status: string;
  sentCount: number;
  totalCount: number;
  logs?: string;
  createdAt: string;
}

export interface CampaignComposerProps {
  subject: string;
  setSubject: (value: string) => void;
  body: string;
  setBody: (value: string) => void;
  recipientInput: string;
  setRecipientInput: (value: string) => void;
  senderEmail: string;
  setSenderEmail: (value: string) => void;
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
