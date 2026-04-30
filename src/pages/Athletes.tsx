import { Plus, Search, Filter } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { athletes, getDealsByAthlete, getTasksByAthlete, formatCurrency } from '@/lib/data';
import { cn } from '@/lib/utils';
import { DashboardPageHeader } from '@/components/layout/DashboardPageHeader';
import { PageTransition } from '@/components/layout/PageTransition';

const statusColors = {
  active: 'bg-green-soft text-green-strong border-green-soft',
  prospect: 'bg-yellow-soft text-yellow-strong border-yellow-soft border-warning/20',
  inactive: 'bg-muted text-muted-foreground border-border',
};

export default function Athletes() {
  return (
    <AppLayout>
      <PageTransition>
        <DashboardPageHeader
          title="Athletes"
          subtitle="Manage rosters, priorities, tasks, and athlete profiles."
          actions={
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Athlete
            </Button>
          }
        />

        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search athletes..." className="pl-10" />
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Athletes Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {athletes.map((athlete) => {
            const athleteDeals = getDealsByAthlete(athlete.id);
            const athleteTasks = getTasksByAthlete(athlete.id);
            const totalDealValue = athleteDeals.reduce((sum, d) => sum + d.value, 0);
            const pendingTasks = athleteTasks.filter(t => t.status !== 'done').length;

            return (
              <div
                key={athlete.id}
                className="group cursor-pointer rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-border-strong hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="h-14 w-14 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-semibold">{athlete.initials}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{athlete.name}</h3>
                      <Badge 
                        variant="outline" 
                        className={cn("text-[10px] capitalize", statusColors[athlete.status])}
                      >
                        {athlete.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {athlete.position} • {athlete.team}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {athlete.sport} • {athlete.classYear}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Deal Value</p>
                    <p className="font-semibold text-sm">{formatCurrency(totalDealValue)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Active Deals</p>
                    <p className="font-semibold text-sm">{athleteDeals.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Open Tasks</p>
                    <p className="font-semibold text-sm">{pendingTasks}</p>
                  </div>
                </div>

                {/* Notes preview */}
                {athlete.agentNotes && (
                  <p className="mt-3 text-xs text-muted-foreground line-clamp-2">
                    {athlete.agentNotes}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </PageTransition>
    </AppLayout>
  );
}
