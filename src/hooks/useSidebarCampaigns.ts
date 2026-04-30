import type React from 'react';
import { useEffect, useState } from 'react';

let campaignStore: SidebarCampaign[] | null = null;
const listeners = new Set<(campaigns: SidebarCampaign[]) => void>();

export interface SidebarCampaign {
  id: string;
  name: string;
  icon: string;
  starred: boolean;
  archived: boolean;
  brand?: string;
  athlete?: string;
  dealValue?: number;
}

const STORAGE_KEY = 'athlon.sidebar.campaigns.v1';

export const seedCampaigns: SidebarCampaign[] = [
  { id: 'nike-swoosh-drop', name: 'Nike Swoosh Drop', icon: '👟', starred: true, archived: false, brand: 'Nike', athlete: 'Jordan Lee', dealValue: 25000 },
  { id: 'dutch-bros-study-break', name: 'Dutch Bros Study Break', icon: '☕', starred: false, archived: false, brand: 'Dutch Bros', athlete: 'Avery Ross', dealValue: 14000 },
  {
    id: 'moda-health-mental-performance',
    name: 'Moda Health Mental Performance',
    icon: '🧠',
    starred: true,
    archived: false,
    brand: 'Moda Health',
    athlete: 'Taylor Kim',
    dealValue: 18000,
  },
  { id: 'columbia-pnw-trails', name: 'Columbia PNW Trails', icon: '🥾', starred: false, archived: false, brand: 'Columbia', athlete: 'Jordan Lee', dealValue: 21000 },
  { id: 'ruffles-ridges-game-day', name: 'Ruffles Ridges Game Day', icon: '🥔', starred: false, archived: false, brand: 'Ruffles', athlete: 'Avery Ross', dealValue: 16000 },
  { id: 'leatherman-multi-tool', name: 'Leatherman Multi-Tool', icon: '🛠️', starred: false, archived: true, brand: 'Leatherman', athlete: 'Casey Dunn', dealValue: 12000 },
];

const readStoredCampaigns = (): SidebarCampaign[] => {
  if (typeof window === 'undefined') return seedCampaigns;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return seedCampaigns;

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return seedCampaigns;
    return parsed;
  } catch {
    return seedCampaigns;
  }
};

export const createCampaignId = (name: string) => {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);

  return `${slug || 'campaign'}-${Date.now()}`;
};

const getCampaignStore = () => {
  if (!campaignStore) campaignStore = readStoredCampaigns();
  return campaignStore;
};

const updateCampaignStore = (nextCampaigns: SidebarCampaign[]) => {
  campaignStore = nextCampaigns;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextCampaigns));
  listeners.forEach((listener) => listener(nextCampaigns));
};

export function useSidebarCampaigns() {
  const [campaigns, setCampaignsState] = useState<SidebarCampaign[]>(getCampaignStore);

  useEffect(() => {
    const sync = (nextCampaigns: SidebarCampaign[]) => setCampaignsState(nextCampaigns);
    listeners.add(sync);
    return () => listeners.delete(sync);
  }, []);

  const setCampaigns: React.Dispatch<React.SetStateAction<SidebarCampaign[]>> = (value) => {
    const nextCampaigns = typeof value === 'function' ? value(getCampaignStore()) : value;
    updateCampaignStore(nextCampaigns);
  };

  return { campaigns, setCampaigns };
}
