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
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Logo } from '@/components/brand/Logo';
import { getStoredRole } from '@/lib/auth-flow';

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

const athleteNavItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/athlete-dashboard' },
  { icon: Calendar, label: 'Schedule', path: '/calendar' },
  { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
  { icon: DollarSign, label: 'Deal Status', path: '/deals' },
  { icon: FileText, label: 'Content Requests', path: '/content' },
  { icon: MessageSquare, label: 'Updates', path: '/conversations' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const storedRole = getStoredRole();
  const isAthleteView = location.pathname.startsWith('/athlete-dashboard') || storedRole === 'athlete';
  const visibleNavItems = isAthleteView ? athleteNavItems : navItems;

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

      <nav className="flex-1 py-4 px-2 space-y-1">
        {visibleNavItems.map((item) => {
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
