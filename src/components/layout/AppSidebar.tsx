import { ReactNode, useMemo, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Star,
  Archive,
  LayoutDashboard,
  Users,
  Briefcase,
  Megaphone,
  Target,
  FolderOpen,
} from 'lucide-react';

import { Logo } from '@/components/brand/Logo';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { createCampaignId, SidebarCampaign, useSidebarCampaigns } from '@/hooks/useSidebarCampaigns';

const primaryNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', count: null },
  { icon: Users, label: 'Athletes', path: '/dashboard/athletes', count: 8 },
  { icon: Briefcase, label: 'Clients', path: '/dashboard/clients', count: 7 },
  { icon: Users, label: 'Team', path: '/dashboard/team', count: 12 },
  { icon: Megaphone, label: 'Content Planner', path: '/dashboard/content', count: 6 },
  { icon: Target, label: 'Campaigns', path: '/dashboard/campaigns', count: 6 },
] as const;

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { campaigns, setCampaigns } = useSidebarCampaigns();
  const [sections, setSections] = useState({
    starred: true,
    campaigns: true,
    archived: true,
  });
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCampaignForm, setNewCampaignForm] = useState({
    name: '',
    brand: '',
    athlete: '',
    dealValue: '',
  });

  const starredCampaigns = useMemo(() => campaigns.filter((item) => item.starred && !item.archived), [campaigns]);
  const activeCampaigns = useMemo(() => campaigns.filter((item) => !item.archived), [campaigns]);
  const archivedCampaigns = useMemo(() => campaigns.filter((item) => item.archived), [campaigns]);

  const toggleSection = (key: 'starred' | 'campaigns' | 'archived') => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleStar = (campaignId: string) => {
    setCampaigns((prev) => prev.map((item) => (item.id === campaignId ? { ...item, starred: !item.starred } : item)));
  };

  const toggleArchive = (campaignId: string) => {
    setCampaigns((prev) =>
      prev.map((item) =>
        item.id === campaignId
          ? {
              ...item,
              archived: !item.archived,
              starred: item.archived ? item.starred : false,
            }
          : item,
      ),
    );
  };

  const openCreateModal = () => {
    setNewCampaignForm({ name: '', brand: '', athlete: '', dealValue: '' });
    setIsAddOpen(true);
  };

  const handleCreateCampaign = () => {
    const trimmedName = newCampaignForm.name.trim();
    if (!trimmedName) return;

    const campaign: SidebarCampaign = {
      id: createCampaignId(trimmedName),
      name: trimmedName,
      icon: '🗂️',
      starred: false,
      archived: false,
      brand: newCampaignForm.brand.trim() || trimmedName,
      athlete: newCampaignForm.athlete.trim() || 'Unassigned athlete',
      dealValue: Number(newCampaignForm.dealValue) || 0,
    };

    setCampaigns((prev) => [campaign, ...prev]);
    setSections((prev) => ({ ...prev, campaigns: true }));
    setIsAddOpen(false);
    navigate(`/dashboard/campaigns/${campaign.id}`);
  };

  const isPrimaryItemActive = (path: string) =>
    location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path));

  return (
    <aside className="h-screen w-80 border-r border-sidebar-border bg-sidebar text-sidebar-foreground flex flex-col">
      <div className="border-b border-sidebar-border px-4 py-4">
        <NavLink to="/" aria-label="Athlon home" className="flex items-center rounded-lg p-2 hover:bg-sidebar-accent/60 transition-colors">
          <Logo size="md" priority />
        </NavLink>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        <div className="space-y-1">
          {primaryNavItems.map((item) => {
            const isActive = isPrimaryItemActive(item.path);

            return (
              <NavLink
                key={`${item.label}-${item.path}`}
                to={item.path}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                  isActive
                    ? 'bg-primary text-blue-strong-foreground'
                    : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                )}
              >
                <item.icon className="h-4.5 w-4.5 shrink-0" />
                <span className="truncate">{item.label}</span>
                {item.count !== null && (
                  <span
                    className={cn(
                      'ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold',
                      isActive ? 'bg-primary-foreground/20 text-blue-strong-foreground' : 'bg-primary/15 text-blue-strong',
                    )}
                  >
                    {item.count}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        <div className="space-y-4 border-t border-sidebar-border pt-4">
          <CampaignSection
            title="Starred"
            count={starredCampaigns.length}
            isOpen={sections.starred}
            onToggle={() => toggleSection('starred')}
            campaigns={starredCampaigns}
            emptyMessage="No starred campaigns"
            renderActions={(campaign) => (
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  toggleStar(campaign.id);
                }}
                aria-label={`Toggle ${campaign.name} starred`}
                className="rounded p-1 text-warning hover:bg-sidebar-accent"
              >
                <Star className="h-3.5 w-3.5 fill-current" />
              </button>
            )}
          />

          <CampaignSection
            title="Campaigns"
            count={activeCampaigns.length}
            isOpen={sections.campaigns}
            onToggle={() => toggleSection('campaigns')}
            campaigns={activeCampaigns}
            emptyMessage="No active campaigns"
            headerAction={
              <button
                type="button"
                aria-label="Add campaign"
                onClick={(event) => {
                  event.stopPropagation();
                  openCreateModal();
                }}
                className="rounded p-1 text-blue-strong hover:bg-sidebar-accent"
              >
                <Plus className="h-4 w-4" />
              </button>
            }
            renderActions={(campaign) => (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    toggleStar(campaign.id);
                  }}
                  aria-label={`Toggle ${campaign.name} starred`}
                  className={cn('rounded p-1 hover:bg-sidebar-accent', campaign.starred ? 'text-yellow-strong' : 'text-muted-foreground')}
                >
                  <Star className={cn('h-3.5 w-3.5', campaign.starred && 'fill-current')} />
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    toggleArchive(campaign.id);
                  }}
                  aria-label={`Archive ${campaign.name}`}
                  className="rounded p-1 text-muted-foreground hover:bg-sidebar-accent"
                >
                  <Archive className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          />

          <CampaignSection
            title="Archived"
            count={archivedCampaigns.length}
            isOpen={sections.archived}
            onToggle={() => toggleSection('archived')}
            campaigns={archivedCampaigns}
            emptyMessage="No archived campaigns"
            renderActions={(campaign) => (
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  toggleArchive(campaign.id);
                }}
                aria-label={`Restore ${campaign.name}`}
                className="rounded p-1 text-muted-foreground hover:bg-sidebar-accent"
              >
                <FolderOpen className="h-3.5 w-3.5" />
              </button>
            )}
          />
        </div>
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <Button className="w-full justify-center" onClick={openCreateModal}>
          <Plus className="h-4 w-4 mr-2" />
          New campaign
        </Button>
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New campaign</DialogTitle>
            <DialogDescription>Create a campaign and add it directly to your active list.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Campaign Name</Label>
              <Input
                id="campaign-name"
                value={newCampaignForm.name}
                onChange={(event) => setNewCampaignForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Enter campaign name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="campaign-brand">Brand (optional)</Label>
              <Input
                id="campaign-brand"
                value={newCampaignForm.brand}
                onChange={(event) => setNewCampaignForm((prev) => ({ ...prev, brand: event.target.value }))}
                placeholder="Nike"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="campaign-athlete">Athlete (optional)</Label>
              <Input
                id="campaign-athlete"
                value={newCampaignForm.athlete}
                onChange={(event) => setNewCampaignForm((prev) => ({ ...prev, athlete: event.target.value }))}
                placeholder="Jordan Lee"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="campaign-value">Deal Value (optional)</Label>
              <Input
                id="campaign-value"
                type="number"
                min={0}
                value={newCampaignForm.dealValue}
                onChange={(event) => setNewCampaignForm((prev) => ({ ...prev, dealValue: event.target.value }))}
                placeholder="25000"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleCreateCampaign} disabled={!newCampaignForm.name.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}

interface CampaignSectionProps {
  title: string;
  count: number;
  isOpen: boolean;
  onToggle: () => void;
  campaigns: SidebarCampaign[];
  emptyMessage: string;
  headerAction?: ReactNode;
  renderActions: (campaign: SidebarCampaign) => ReactNode;
}

function CampaignSection({
  title,
  count,
  isOpen,
  onToggle,
  campaigns,
  emptyMessage,
  headerAction,
  renderActions,
}: CampaignSectionProps) {
  return (
    <section>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-xs uppercase tracking-wide text-muted-foreground hover:bg-sidebar-accent/60"
      >
        {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        <span>{title}</span>
        <span className="ml-auto rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] text-blue-strong">{count}</span>
        {headerAction}
      </button>

      {isOpen && (
        <div className="mt-1 space-y-1 px-1">
          {campaigns.length === 0 ? (
            <p className="px-2 py-1 text-xs text-muted-foreground/80">{emptyMessage}</p>
          ) : (
            campaigns.map((campaign) => (
              <NavLink
                key={campaign.id}
                to={`/dashboard/campaigns/${campaign.id}`}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors',
                    isActive ? 'bg-primary/15 text-foreground' : 'hover:bg-sidebar-accent text-muted-foreground hover:text-sidebar-foreground',
                  )
                }
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-primary/15 text-[11px]">
                  {campaign.icon}
                </span>
                <span className="min-w-0 flex-1 truncate" title={campaign.name}>
                  {campaign.name}
                </span>
                <div className="opacity-75 group-hover:opacity-100">{renderActions(campaign)}</div>
              </NavLink>
            ))
          )}
        </div>
      )}
    </section>
  );
}
