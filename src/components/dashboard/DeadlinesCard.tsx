import { AlertCircle, Clock, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { tasks, getAthlete, formatDate, isPastDue } from '@/lib/data';
import { cn } from '@/lib/utils';

const priorityColors: Record<string, string> = {
  urgent: 'bg-destructive/10 text-destructive border-destructive/20',
  high: 'bg-warning/10 text-warning border-warning/20',
  medium: 'bg-info/10 text-info border-info/20',
  low: 'bg-muted text-muted-foreground border-border',
};

export function DeadlinesCard() {
  const upcomingTasks = tasks
    .filter(t => t.status !== 'done')
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
    .slice(0, 5);

  const overdueCount = tasks.filter(t => t.status !== 'done' && isPastDue(t.dueDate)).length;

  return (
    <Card className="card-elevated">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Upcoming Deadlines</CardTitle>
          {overdueCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {overdueCount} overdue
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {upcomingTasks.map((task) => {
          const athlete = getAthlete(task.athleteId);
          const isOverdue = isPastDue(task.dueDate);
          
          return (
            <div
              key={task.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer group",
                isOverdue 
                  ? "bg-destructive/5 hover:bg-destructive/10" 
                  : "bg-surface hover:bg-surface-elevated"
              )}
            >
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                isOverdue ? "bg-destructive/10" : "bg-accent/10"
              )}>
                {isOverdue ? (
                  <AlertCircle className="h-4 w-4 text-destructive" />
                ) : (
                  <Clock className="h-4 w-4 text-accent-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{task.title}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  {athlete && (
                    <span className="text-xs text-muted-foreground">
                      {athlete.name}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className={cn(
                    "text-xs font-medium",
                    isOverdue ? "text-destructive" : "text-muted-foreground"
                  )}>
                    {formatDate(task.dueDate)}
                  </span>
                </div>
              </div>
              <Badge 
                variant="outline" 
                className={cn("text-[10px] capitalize", priorityColors[task.priority])}
              >
                {task.priority}
              </Badge>
              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          );
        })}
        
        {upcomingTasks.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No upcoming deadlines
          </p>
        )}
      </CardContent>
    </Card>
  );
}
