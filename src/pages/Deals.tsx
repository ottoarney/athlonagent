import { motion } from 'framer-motion';
import { Plus, ArrowRight, DollarSign } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { deals, getAthlete, formatCurrency, formatDate, DealStage } from '@/lib/data';
import { cn } from '@/lib/utils';

const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

const stages: { key: DealStage; label: string }[] = [
  { key: 'lead', label: 'Lead' },
  { key: 'negotiation', label: 'Negotiation' },
  { key: 'contracted', label: 'Contracted' },
  { key: 'deliverables', label: 'Deliverables' },
  { key: 'paid', label: 'Paid' },
];

const stageColors: Record<DealStage, string> = {
  lead: 'bg-muted border-border',
  negotiation: 'bg-warning/10 border-warning/20',
  contracted: 'bg-info/10 border-info/20',
  deliverables: 'bg-accent/10 border-accent/20',
  paid: 'bg-success/10 border-success/20',
};

const stageTextColors: Record<DealStage, string> = {
  lead: 'text-muted-foreground',
  negotiation: 'text-warning',
  contracted: 'text-info',
  deliverables: 'text-accent-foreground',
  paid: 'text-success',
};

export default function Deals() {
  const totalPipelineValue = deals.reduce((sum, d) => sum + d.value, 0);
  const activeDealsValue = deals
    .filter(d => d.stage !== 'paid')
    .reduce((sum, d) => sum + d.value, 0);

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
            <h1 className="text-2xl font-display font-semibold tracking-tight">Deals & NIL</h1>
            <p className="text-muted-foreground mt-1">
              Track brand partnerships and NIL opportunities
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Deal
          </Button>
        </motion.div>

        {/* Summary Stats */}
        <motion.div variants={fadeIn} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-xl border border-border bg-card">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Pipeline</p>
            <p className="text-2xl font-bold mt-1">{formatCurrency(totalPipelineValue)}</p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-primary text-primary-foreground">
            <p className="text-xs uppercase tracking-wide opacity-70">Active Value</p>
            <p className="text-2xl font-bold mt-1">{formatCurrency(activeDealsValue)}</p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Active Deals</p>
            <p className="text-2xl font-bold mt-1">{deals.filter(d => d.stage !== 'paid').length}</p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Closing Soon</p>
            <p className="text-2xl font-bold mt-1">2</p>
          </div>
        </motion.div>

        {/* Pipeline Stages Header */}
        <motion.div variants={fadeIn} className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
          {stages.map((stage, index) => {
            const stageDeals = deals.filter(d => d.stage === stage.key);
            const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
            
            return (
              <div key={stage.key} className="flex items-center">
                <div className={cn(
                  "px-4 py-2 rounded-lg border whitespace-nowrap",
                  stageColors[stage.key]
                )}>
                  <span className={cn("text-sm font-medium", stageTextColors[stage.key])}>
                    {stage.label}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {stageDeals.length} • {formatCurrency(stageValue)}
                  </span>
                </div>
                {index < stages.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground mx-2 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </motion.div>

        {/* Kanban-style Pipeline */}
        <motion.div variants={fadeIn} className="flex-1 overflow-x-auto">
          <div className="flex gap-4 h-full min-w-max pb-4">
            {stages.map((stage) => {
              const stageDeals = deals.filter(d => d.stage === stage.key);
              
              return (
                <div 
                  key={stage.key}
                  className="w-80 flex flex-col bg-surface rounded-xl border border-border"
                >
                  {/* Column Header */}
                  <div className={cn(
                    "px-4 py-3 border-b border-border flex items-center justify-between rounded-t-xl",
                    stageColors[stage.key]
                  )}>
                    <div className="flex items-center gap-2">
                      <h3 className={cn("font-semibold text-sm", stageTextColors[stage.key])}>
                        {stage.label}
                      </h3>
                      <span className="text-xs text-muted-foreground bg-background/50 px-2 py-0.5 rounded-full">
                        {stageDeals.length}
                      </span>
                    </div>
                  </div>

                  {/* Deals */}
                  <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                    {stageDeals.map((deal) => {
                      const athlete = getAthlete(deal.athleteId);
                      const pendingDeliverables = deal.deliverables.filter(d => !d.completed);
                      const nextDeliverable = pendingDeliverables[0];
                      
                      return (
                        <div
                          key={deal.id}
                          className="p-4 rounded-lg bg-card border border-border hover:border-border-strong hover:shadow-sm transition-all duration-200 cursor-pointer"
                        >
                          {/* Brand header */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-primary">
                                {deal.brand.slice(0, 2).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm">{deal.brand}</h4>
                              <p className="text-xs text-muted-foreground">{athlete?.name}</p>
                            </div>
                          </div>

                          {/* Value */}
                          <div className="flex items-center gap-2 mb-3">
                            <DollarSign className="h-4 w-4 text-accent" />
                            <span className="font-bold">{formatCurrency(deal.value)}</span>
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-[10px] ml-auto",
                                deal.paymentStatus === 'complete' 
                                  ? 'bg-success/10 text-success'
                                  : deal.paymentStatus === 'partial'
                                  ? 'bg-warning/10 text-warning'
                                  : 'bg-muted text-muted-foreground'
                              )}
                            >
                              {deal.paymentStatus}
                            </Badge>
                          </div>

                          {/* Deliverables */}
                          {pendingDeliverables.length > 0 && (
                            <div className="pt-3 border-t border-border">
                              <p className="text-xs text-muted-foreground mb-1">
                                Next deliverable:
                              </p>
                              <p className="text-sm font-medium">{nextDeliverable?.title}</p>
                              <p className="text-xs text-muted-foreground">
                                Due {formatDate(nextDeliverable?.dueDate)}
                              </p>
                            </div>
                          )}

                          {/* Next action */}
                          {deal.nextAction && (
                            <div className="mt-3 pt-3 border-t border-border">
                              <p className="text-xs text-accent font-medium">
                                → {deal.nextAction}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {stageDeals.length === 0 && (
                      <div className="text-center py-8 text-sm text-muted-foreground">
                        No deals in this stage
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
