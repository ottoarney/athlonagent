import { motion } from 'framer-motion';
import { Plus, Instagram, Youtube, ArrowRight } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { contentItems, getAthlete, formatDate, ContentStatus } from '@/lib/data';
import { cn } from '@/lib/utils';

const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

const stages: { key: ContentStatus; label: string }[] = [
  { key: 'idea', label: 'Idea' },
  { key: 'script', label: 'Script' },
  { key: 'shoot', label: 'Shoot' },
  { key: 'edit', label: 'Edit' },
  { key: 'schedule', label: 'Schedule' },
  { key: 'posted', label: 'Posted' },
];

const statusColors: Record<ContentStatus, { bg: string; text: string }> = {
  idea: { bg: 'bg-muted', text: 'text-muted-foreground' },
  script: { bg: 'bg-purple-50', text: 'text-purple-700' },
  shoot: { bg: 'bg-warning/10', text: 'text-warning' },
  edit: { bg: 'bg-info/10', text: 'text-info' },
  schedule: { bg: 'bg-accent/10', text: 'text-accent-foreground' },
  posted: { bg: 'bg-success/10', text: 'text-success' },
};

const platformIcons: Record<string, React.ElementType> = {
  Instagram: Instagram,
  TikTok: () => (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
    </svg>
  ),
  YouTube: Youtube,
};

export default function Content() {
  return (
    <AppLayout>
      <motion.div 
        className="h-full flex flex-col"
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <motion.div variants={fadeIn} className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display font-semibold tracking-tight">Content Plan</h1>
            <p className="text-muted-foreground mt-1">
              Manage content pipeline and posting schedule
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Content
          </Button>
        </motion.div>

        {/* Pipeline Stages Header */}
        <motion.div variants={fadeIn} className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
          {stages.map((stage, index) => {
            const stageItems = contentItems.filter(c => c.status === stage.key);
            
            return (
              <div key={stage.key} className="flex items-center">
                <div className={cn(
                  "px-4 py-2 rounded-lg whitespace-nowrap",
                  statusColors[stage.key].bg
                )}>
                  <span className={cn("text-sm font-medium", statusColors[stage.key].text)}>
                    {stage.label}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({stageItems.length})
                  </span>
                </div>
                {index < stages.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground mx-2 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </motion.div>

        {/* Kanban Board */}
        <motion.div variants={fadeIn} className="flex-1 overflow-x-auto">
          <div className="flex gap-4 h-full min-w-max pb-4">
            {stages.map((stage) => {
              const stageItems = contentItems.filter(c => c.status === stage.key);
              
              return (
                <div 
                  key={stage.key}
                  className="w-72 flex flex-col bg-surface rounded-xl border border-border"
                >
                  {/* Column Header */}
                  <div className={cn(
                    "px-4 py-3 border-b border-border flex items-center justify-between rounded-t-xl",
                    statusColors[stage.key].bg
                  )}>
                    <div className="flex items-center gap-2">
                      <h3 className={cn("font-semibold text-sm", statusColors[stage.key].text)}>
                        {stage.label}
                      </h3>
                      <span className="text-xs text-muted-foreground bg-background/50 px-2 py-0.5 rounded-full">
                        {stageItems.length}
                      </span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  {/* Content Items */}
                  <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                    {stageItems.map((item) => {
                      const athlete = getAthlete(item.athleteId);
                      const PlatformIcon = platformIcons[item.platform] || Instagram;
                      
                      return (
                        <div
                          key={item.id}
                          className="p-4 rounded-lg bg-card border border-border hover:border-border-strong hover:shadow-sm transition-all duration-200 cursor-pointer"
                        >
                          {/* Platform & Hook */}
                          <div className="flex items-start gap-3 mb-3">
                            <div className="h-9 w-9 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0">
                              <PlatformIcon className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm">{item.hook}</h4>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {item.platform}
                              </p>
                            </div>
                          </div>

                          {/* Athlete */}
                          {athlete && (
                            <div className="flex items-center gap-2 mb-3">
                              <div className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center">
                                <span className="text-[10px] font-medium">{athlete.initials}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">{athlete.name}</span>
                            </div>
                          )}

                          {/* Due Date */}
                          <div className="flex items-center justify-between pt-3 border-t border-border">
                            <span className="text-xs text-muted-foreground">
                              Due {formatDate(item.dueDate)}
                            </span>
                            <Badge 
                              variant="outline"
                              className={cn(
                                "text-[10px]",
                                statusColors[item.status].bg,
                                statusColors[item.status].text
                              )}
                            >
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}

                    {stageItems.length === 0 && (
                      <div className="text-center py-8 text-sm text-muted-foreground">
                        No content here
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
