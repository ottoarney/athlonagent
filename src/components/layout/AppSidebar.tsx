import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  Users,
  DollarSign,
  FileText,
  FolderOpen,
  Settings,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Star,
  Archive,
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Logo } from '@/components/brand/Logo';
import { useDashboardData } from '@/context/dashboard-context';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
  { icon: Calendar, label: 'Calendar', path: '/calendar' },
  { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
  { icon: Users, label: 'Athletes', path: '/athletes' },
  { icon: DollarSign, label: 'Deals', path: '/deals' },
  { icon: FileText, label: 'Content Plan', path: '/content' },
  { icon: FolderOpen, label: 'Files', path: '/files' },
  { icon: MessageSquare, label: 'Conversations', path: '/conversations' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { filteredCampaigns, toggleCampaignArchive, toggleCampaignStar } = useDashboardData();

  const starred = filteredCampaigns.filter((campaign) => campaign.starred && !campaign.archived);
  const activeCampaigns = filteredCampaigns.filter((campaign) => !campaign.archived);
  const archived = filteredCampaigns.filter((campaign) => campaign.archived);

  return (
    <aside className={cn('h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300', collapsed ? 'w-20' : 'w-60')}>
      <div className={cn('h-16 flex items-center border-b border-sidebar-border px-4', collapsed ? 'justify-center' : 'justify-between')}>
        <NavLink
          to="/"
          aria-label="Athlon home"
          className={cn(
            'inline-flex items-center rounded-md transition duration-300 hover:opacity-85',
            collapsed ? 'max-w-[3.1rem] overflow-hidden' : 'max-w-[9.5rem]',
          )}
        >
          <Logo size={collapsed ? 'sm' : 'md'} />
        </NavLink>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1 overflow-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                collapsed && 'justify-center px-2',
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}

        {!collapsed && (
          <div className="pt-3 mt-3 border-t border-sidebar-border space-y-3 px-1">
            {[
              { icon: Star, label: 'Starred campaigns', items: starred },
              { icon: FolderOpen, label: 'Campaigns', items: activeCampaigns },
              { icon: Archive, label: 'Archived', items: archived },
            ].map((group) => (
              <div key={group.label}>
                <div className="flex items-center gap-2 px-2 mb-1.5 text-[11px] uppercase tracking-wide text-muted-foreground/80">
                  <group.icon className="h-3.5 w-3.5" />
                  <span>{group.label}</span>
                  <span className="ml-auto">{group.items.length}</span>
                </div>
                <div className="space-y-1">
                  {group.items.slice(0, 5).map((campaign) => (
                    <div key={campaign.id} className="group/item flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-sidebar-accent">
                      <NavLink to="/dashboard" className="min-w-0 flex-1 truncate">
                        {campaign.brand}
                      </NavLink>
                      <button
                        type="button"
                        className="opacity-70 transition hover:opacity-100"
                        onClick={() => toggleCampaignStar(campaign.id)}
                        aria-label={campaign.starred ? 'Unstar campaign' : 'Star campaign'}
                      >
                        <Star className={cn('h-3.5 w-3.5', campaign.starred && 'fill-current text-primary')} />
                      </button>
                      <button
                        type="button"
                        className="opacity-70 transition hover:opacity-100"
                        onClick={() => toggleCampaignArchive(campaign.id)}
                        aria-label={campaign.archived ? 'Restore campaign' : 'Archive campaign'}
                      >
                        <Archive className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  {group.items.length === 0 && <p className="px-2 text-xs text-muted-foreground/70">No campaigns</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </nav>

      <div className="p-2 border-t border-sidebar-border">
        <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className={cn('w-full text-muted-foreground hover:text-foreground', collapsed ? 'justify-center' : 'justify-start')}>
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
