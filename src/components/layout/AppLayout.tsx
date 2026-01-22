import { ReactNode, useState } from 'react';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { Athlete } from '@/lib/data';

interface AppLayoutProps {
  children: ReactNode;
  showAuthLinks?: boolean;
}

export function AppLayout({ children, showAuthLinks = false }: AppLayoutProps) {
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader 
          selectedAthlete={selectedAthlete} 
          onAthleteChange={setSelectedAthlete}
          showAuthLinks={showAuthLinks}
        />
        <main className="flex-1 overflow-auto bg-surface p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
