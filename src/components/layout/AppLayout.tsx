import { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { DashboardProvider } from '@/context/dashboard-context';
import { DashboardCreateDialog } from '@/components/dashboard/DashboardCreateDialog';

interface AppLayoutProps {
  children: ReactNode;
  showAuthLinks?: boolean;
}

export function AppLayout({ children, showAuthLinks = false }: AppLayoutProps) {
  return (
    <DashboardProvider>
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AppHeader showAuthLinks={showAuthLinks} />
          <main className="flex-1 overflow-auto bg-surface p-6">
            {children}
          </main>
        </div>
      </div>
      <DashboardCreateDialog />
    </DashboardProvider>
  );
}
