// Campaign metadata storage using localStorage
// Since smart contracts don't store title/description, we use browser storage

export interface CampaignMetadata {
  address: string;
  title: string;
  description: string;
  createdAt: number;
  createdBy: string;
}

const STORAGE_KEY = 'fundchain_campaigns';

// Get all campaign metadata
export const getAllCampaignMetadata = (): Record<string, CampaignMetadata> => {
  if (typeof window === 'undefined') return {};

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error reading campaign metadata:', error);
    return {};
  }
};

// Save campaign metadata
export const saveCampaignMetadata = (metadata: CampaignMetadata): void => {
  if (typeof window === 'undefined') return;

  try {
    const all = getAllCampaignMetadata();
    all[metadata.address.toLowerCase()] = metadata;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (error) {
    console.error('Error saving campaign metadata:', error);
  }
};

// Get campaign metadata by address
export const getCampaignMetadata = (address: string): CampaignMetadata | null => {
  const all = getAllCampaignMetadata();
  return all[address.toLowerCase()] || null;
};

// Delete campaign metadata
export const deleteCampaignMetadata = (address: string): void => {
  if (typeof window === 'undefined') return;

  try {
    const all = getAllCampaignMetadata();
    delete all[address.toLowerCase()];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (error) {
    console.error('Error deleting campaign metadata:', error);
  }
};

// Update campaign metadata
export const updateCampaignMetadata = (address: string, updates: Partial<CampaignMetadata>): void => {
  const existing = getCampaignMetadata(address);
  if (existing) {
    saveCampaignMetadata({ ...existing, ...updates });
  }
};
