import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { athletes as seedAthletes, deals as seedDeals, tasks as seedTasks, events, formatCurrency } from '@/lib/data';
import type { Athlete, Task } from '@/lib/data';

export type CampaignStage = 'pitching' | 'active' | 'in-review' | 'complete';

export interface Campaign {
  id: string;
  brand: string;
  athleteId: string;
  value: number;
  stage: CampaignStage;
  starred: boolean;
  archived: boolean;
  deliverables: { id: string; title: string; dueDate: Date; completed: boolean }[];
}

type ModalType = 'athlete' | 'campaign' | 'task' | null;

interface DashboardContextValue {
  athletes: Athlete[];
  tasks: Task[];
  campaigns: Campaign[];
  filteredAthletes: Athlete[];
  filteredTasks: Task[];
  filteredCampaigns: Campaign[];
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  activeModal: ModalType;
  openModal: (type: Exclude<ModalType, null>) => void;
  closeModal: () => void;
  addAthlete: (payload: { name: string; sport: string; team: string; position: string; classYear: string; location: string }) => void;
  addCampaign: (payload: { brand: string; athleteId: string; value: number; stage: CampaignStage }) => void;
  addTask: (payload: { title: string; athleteId: string; dueDate: string; priority: Task['priority'] }) => void;
  toggleTaskComplete: (taskId: string) => void;
  updateCampaignStage: (campaignId: string, stage: CampaignStage) => void;
  toggleCampaignStar: (campaignId: string) => void;
  toggleCampaignArchive: (campaignId: string) => void;
  kpis: {
    athletesUnderManagement: number;
    activeCampaignValue: string;
    athleteEarningsYtd: string;
    pipelineValue: string;
  };
  upcoming14Days: { id: string; title: string; dueDate: Date; type: 'task' | 'deliverable'; campaignOrAthlete: string }[];
  eventsNextWeek: typeof events;
}

const mapStage = (stage: string): CampaignStage => {
  if (stage === 'lead' || stage === 'negotiation') return 'pitching';
  if (stage === 'contracted') return 'active';
  if (stage === 'deliverables') return 'in-review';
  return 'complete';
};

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [athletes, setAthletes] = useState<Athlete[]>(seedAthletes);
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [campaigns, setCampaigns] = useState<Campaign[]>(
    seedDeals.map((deal) => ({
      id: deal.id,
      brand: deal.brand,
      athleteId: deal.athleteId,
      value: deal.value,
      stage: mapStage(deal.stage),
      starred: false,
      archived: false,
      deliverables: deal.deliverables,
    })),
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const closeModal = () => setActiveModal(null);
  const openModal = (type: Exclude<ModalType, null>) => setActiveModal(type);

  const addAthlete: DashboardContextValue['addAthlete'] = (payload) => {
    const initials = payload.name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const athlete: Athlete = {
      id: `ath-${Date.now()}`,
      ...payload,
      initials,
      status: 'active',
    };

    setAthletes((prev) => [athlete, ...prev]);
  };

  const addCampaign: DashboardContextValue['addCampaign'] = (payload) => {
    const campaign: Campaign = {
      id: `camp-${Date.now()}`,
      ...payload,
      starred: false,
      archived: false,
      deliverables: [],
    };
    setCampaigns((prev) => [campaign, ...prev]);
  };

  const addTask: DashboardContextValue['addTask'] = (payload) => {
    const task: Task = {
      id: `task-${Date.now()}`,
      title: payload.title,
      athleteId: payload.athleteId,
      description: '',
      dueDate: new Date(payload.dueDate),
      priority: payload.priority,
      status: 'todo',
      tags: ['dashboard'],
      owner: 'agent',
    };

    setTasks((prev) => [task, ...prev]);
  };

  const toggleTaskComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status: task.status === 'done' ? 'todo' : 'done' } : task)),
    );
  };

  const updateCampaignStage = (campaignId: string, stage: CampaignStage) => {
    setCampaigns((prev) => prev.map((campaign) => (campaign.id === campaignId ? { ...campaign, stage } : campaign)));
  };

  const toggleCampaignStar = (campaignId: string) => {
    setCampaigns((prev) => prev.map((campaign) => (campaign.id === campaignId ? { ...campaign, starred: !campaign.starred } : campaign)));
  };

  const toggleCampaignArchive = (campaignId: string) => {
    setCampaigns((prev) =>
      prev.map((campaign) =>
        campaign.id === campaignId ? { ...campaign, archived: !campaign.archived, starred: campaign.archived ? campaign.starred : false } : campaign,
      ),
    );
  };

  const query = searchQuery.trim().toLowerCase();

  const filteredAthletes = athletes.filter((athlete) => {
    if (!query) return true;
    return [athlete.name, athlete.sport, athlete.team, athlete.position].join(' ').toLowerCase().includes(query);
  });

  const filteredTasks = tasks.filter((task) => {
    if (!query) return true;
    const athlete = athletes.find((entry) => entry.id === task.athleteId);
    return [task.title, task.description ?? '', athlete?.name ?? ''].join(' ').toLowerCase().includes(query);
  });

  const filteredCampaigns = campaigns.filter((campaign) => {
    if (!query) return true;
    const athlete = athletes.find((entry) => entry.id === campaign.athleteId);
    return [campaign.brand, athlete?.name ?? '', campaign.stage].join(' ').toLowerCase().includes(query);
  });

  const now = new Date();
  const in14Days = new Date();
  in14Days.setDate(now.getDate() + 14);

  const upcoming14Days = [
    ...filteredTasks.map((task) => {
      const athlete = athletes.find((item) => item.id === task.athleteId);
      return { id: task.id, title: task.title, dueDate: task.dueDate, type: 'task' as const, campaignOrAthlete: athlete?.name ?? 'Unknown athlete' };
    }),
    ...filteredCampaigns.flatMap((campaign) =>
      campaign.deliverables.map((deliverable) => ({
        id: `${campaign.id}-${deliverable.id}`,
        title: deliverable.title,
        dueDate: deliverable.dueDate,
        type: 'deliverable' as const,
        campaignOrAthlete: campaign.brand,
      })),
    ),
  ]
    .filter((entry) => entry.dueDate >= now && entry.dueDate <= in14Days)
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

  const pipelineValue = filteredCampaigns.filter((campaign) => !campaign.archived).reduce((sum, campaign) => sum + campaign.value, 0);
  const activeCampaignValue = filteredCampaigns
    .filter((campaign) => campaign.stage === 'active' || campaign.stage === 'in-review')
    .reduce((sum, campaign) => sum + campaign.value, 0);

  const kpis = {
    athletesUnderManagement: filteredAthletes.length,
    activeCampaignValue: formatCurrency(activeCampaignValue),
    athleteEarningsYtd: formatCurrency(activeCampaignValue * 0.68),
    pipelineValue: formatCurrency(pipelineValue),
  };

  const value = useMemo(
    () => ({
      athletes,
      tasks,
      campaigns,
      filteredAthletes,
      filteredTasks,
      filteredCampaigns,
      searchQuery,
      setSearchQuery,
      activeModal,
      openModal,
      closeModal,
      addAthlete,
      addCampaign,
      addTask,
      toggleTaskComplete,
      updateCampaignStage,
      toggleCampaignStar,
      toggleCampaignArchive,
      kpis,
      upcoming14Days,
      eventsNextWeek: events,
    }),
    [
      athletes,
      tasks,
      campaigns,
      filteredAthletes,
      filteredTasks,
      filteredCampaigns,
      searchQuery,
      activeModal,
      kpis,
      upcoming14Days,
    ],
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboardData() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboardData must be used within DashboardProvider');
  }

  return context;
}
