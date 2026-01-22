import { Clock, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { events, getAthlete, formatTime, isToday } from '@/lib/data';
import { cn } from '@/lib/utils';

const eventTypeColors: Record<string, string> = {
  training: 'bg-info/10 text-info border-info/20',
  game: 'bg-accent/10 text-accent-foreground border-accent/20',
  travel: 'bg-warning/10 text-warning border-warning/20',
  content: 'bg-purple-100 text-purple-700 border-purple-200',
  deal: 'bg-accent/10 text-accent-foreground border-accent/20',
  admin: 'bg-muted text-muted-foreground border-border',
};

export function TodayAgenda() {
  const todayEvents = events.filter(e => isToday(e.startDate));

  return (
    <Card className="card-elevated">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          Today's Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {todayEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No events scheduled for today
          </p>
        ) : (
          todayEvents.map((event) => {
            const athlete = getAthlete(event.athleteIds[0]);
            return (
              <div 
                key={event.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-surface hover:bg-surface-elevated transition-colors cursor-pointer"
              >
                <div className="flex-shrink-0 w-14 text-center">
                  <span className="text-sm font-medium">{formatTime(event.startDate)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      "text-[10px] font-medium px-2 py-0.5 rounded-full border uppercase tracking-wide",
                      eventTypeColors[event.type]
                    )}>
                      {event.type}
                    </span>
                    {athlete && (
                      <span className="text-xs text-muted-foreground">
                        {athlete.name}
                      </span>
                    )}
                  </div>
                  <h4 className="font-medium text-sm truncate">{event.title}</h4>
                  {event.location && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        
        {/* Upcoming indicator */}
        {todayEvents.length > 0 && (
          <div className="pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">
              {events.filter(e => !isToday(e.startDate)).length} more events this week
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
