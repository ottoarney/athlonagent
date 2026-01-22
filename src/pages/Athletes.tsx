import { motion } from 'framer-motion';
import { Plus, Search, Filter } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { athletes, getDealsByAthlete, getTasksByAthlete, formatCurrency } from '@/lib/data';
import { cn } from '@/lib/utils';

const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.05
    }
  }
};

const statusColors = {
  active: 'bg-accent/10 text-accent-foreground border-accent/20',
  prospect: 'bg-warning/10 text-warning border-warning/20',
  inactive: 'bg-muted text-muted-foreground border-border',
};

export default function Athletes() {
  return (
    <AppLayout>
      <motion.div 
        className="max-w-[1600px] mx-auto space-y-6"
        initial="initial"
        animate="animate"
        variants={stagger}
      >
        {/* Header */}
        <motion.div variants={fadeIn} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-semibold tracking-tight">Athletes</h1>
            <p className="text-muted-foreground mt-1">
              Manage your athlete roster and profiles
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Athlete
          </Button>
        </motion.div>

        {/* Filters */}
        <motion.div variants={fadeIn} className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search athletes..." className="pl-10" />
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </motion.div>

        {/* Athletes Grid */}
        <motion.div 
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {athletes.map((athlete) => {
            const athleteDeals = getDealsByAthlete(athlete.id);
            const athleteTasks = getTasksByAthlete(athlete.id);
            const totalDealValue = athleteDeals.reduce((sum, d) => sum + d.value, 0);
            const pendingTasks = athleteTasks.filter(t => t.status !== 'done').length;

            return (
              <motion.div
                key={athlete.id}
                variants={fadeIn}
                className="group p-5 rounded-xl border border-border bg-card hover:border-border-strong hover:shadow-md transition-all duration-200 cursor-pointer"
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
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
