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
  setSubject: (value: string) => void;
  body: string;
  setBody: (value: string) => void;
  recipientInput: string;
  setRecipientInput: (value: string) => void;
  variables: string[];
  setVariables: React.Dispatch<React.SetStateAction<string[]>>;
  recipientItems: RecipientVariableItem[];
  setRecipientItems: React.Dispatch<React.SetStateAction<RecipientVariableItem[]>>;
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
