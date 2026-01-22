import { Users, DollarSign, CheckSquare, TrendingUp } from 'lucide-react';
import { athletes, deals, tasks, formatCurrency } from '@/lib/data';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string;
  subtext?: string;
  icon: React.ElementType;
  accent?: boolean;
}

function StatCard({ label, value, subtext, icon: Icon, accent }: StatCardProps) {
  return (
    <div className={cn(
      "p-5 rounded-xl border transition-all duration-200",
      accent 
        ? "bg-primary text-primary-foreground border-primary" 
        : "bg-card border-border hover:border-border-strong"
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className={cn(
            "text-xs font-medium uppercase tracking-wide",
            accent ? "text-primary-foreground/70" : "text-muted-foreground"
          )}>
            {label}
          </p>
          <p className="text-2xl font-bold mt-1 tracking-tight">{value}</p>
          {subtext && (
            <p className={cn(
              "text-xs mt-1",
              accent ? "text-primary-foreground/70" : "text-muted-foreground"
            )}>
              {subtext}
            </p>
          )}
        </div>
        <div className={cn(
          "h-10 w-10 rounded-lg flex items-center justify-center",
          accent ? "bg-primary-foreground/10" : "bg-accent/10"
        )}>
          <Icon className={cn(
            "h-5 w-5",
            accent ? "text-primary-foreground" : "text-accent-foreground"
          )} />
        </div>
      </div>
    </div>
  );
}

export function StatsOverview() {
  const activeAthletes = athletes.filter(a => a.status === 'active').length;
  const totalDealValue = deals.reduce((sum, d) => sum + d.value, 0);
  const pendingTasks = tasks.filter(t => t.status !== 'done').length;
  const activeDeals = deals.filter(d => d.stage !== 'paid').length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Active Athletes"
        value={activeAthletes.toString()}
        subtext="2 prospects pending"
        icon={Users}
      />
      <StatCard
        label="Pipeline Value"
        value={formatCurrency(totalDealValue)}
        subtext="+$50k this month"
        icon={DollarSign}
        accent
      />
      <StatCard
        label="Open Tasks"
        value={pendingTasks.toString()}
        subtext="3 due this week"
        icon={CheckSquare}
      />
      <StatCard
        label="Active Deals"
        value={activeDeals.toString()}
        subtext="1 closing soon"
        icon={TrendingUp}
      />
    </div>
  );
}
