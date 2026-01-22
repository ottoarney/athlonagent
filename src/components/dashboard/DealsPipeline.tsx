import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { deals, getAthlete, formatCurrency, DealStage } from '@/lib/data';
import { cn } from '@/lib/utils';

const stages: { key: DealStage; label: string }[] = [
  { key: 'lead', label: 'Lead' },
  { key: 'negotiation', label: 'Negotiation' },
  { key: 'contracted', label: 'Contracted' },
  { key: 'deliverables', label: 'Deliverables' },
  { key: 'paid', label: 'Paid' },
];

const stageColors: Record<DealStage, string> = {
  lead: 'bg-muted text-muted-foreground',
  negotiation: 'bg-warning/10 text-warning',
  contracted: 'bg-info/10 text-info',
  deliverables: 'bg-accent/10 text-accent-foreground',
  paid: 'bg-success/10 text-success',
};

export function DealsPipeline() {
  return (
    <Card className="card-elevated">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Deal Pipeline</CardTitle>
          <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
            View all <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Pipeline stages header */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {stages.map((stage, index) => {
            const count = deals.filter(d => d.stage === stage.key).length;
            return (
              <div key={stage.key} className="flex items-center">
                <div className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap",
                  stageColors[stage.key]
                )}>
                  {stage.label} ({count})
                </div>
                {index < stages.length - 1 && (
                  <ArrowRight className="h-3 w-3 text-muted-foreground mx-1 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Deal cards */}
        <div className="space-y-3">
          {deals.slice(0, 3).map((deal) => {
            const athlete = getAthlete(deal.athleteId);
            const pendingDeliverables = deal.deliverables.filter(d => !d.completed).length;
            
            return (
              <div
                key={deal.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-surface hover:bg-surface-elevated transition-colors cursor-pointer group"
              >
                {/* Brand logo placeholder */}
                <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">
                    {deal.brand.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="font-semibold text-sm">{deal.brand}</h4>
                    <Badge 
                      variant="outline" 
                      className={cn("text-[10px] capitalize", stageColors[deal.stage])}
                    >
                      {deal.stage}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {athlete?.name}
                    {pendingDeliverables > 0 && (
                      <span className="ml-2 text-warning">
                        • {pendingDeliverables} deliverable{pendingDeliverables > 1 ? 's' : ''} pending
                      </span>
                    )}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-sm">{formatCurrency(deal.value)}</p>
                  {deal.nextAction && (
                    <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                      {deal.nextAction}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
