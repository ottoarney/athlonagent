import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, MapPin } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { events, getAthlete, formatTime, EventType } from '@/lib/data';
import { cn } from '@/lib/utils';

const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

const eventTypeColors: Record<EventType, string> = {
  training: 'bg-info/20 border-info/30 text-info',
  game: 'bg-accent/20 border-accent/30 text-accent-foreground',
  travel: 'bg-warning/20 border-warning/30 text-warning',
  content: 'bg-purple-100 border-purple-200 text-purple-700',
  deal: 'bg-accent/20 border-accent/30 text-accent-foreground',
  admin: 'bg-muted border-border text-muted-foreground',
};

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'agenda'>('week');

  const today = new Date();
  
  // Generate week days
  const getWeekDays = (date: Date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());
    
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      return day;
    });
  };

  const weekDays = getWeekDays(currentDate);
  const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7 AM to 8 PM

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const getEventsForDay = (date: Date) => {
    return events.filter(e => {
      const eventDate = new Date(e.startDate);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  return (
    <AppLayout>
      <motion.div 
        className="h-full flex flex-col"
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <motion.div variants={fadeIn} className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-display font-semibold tracking-tight">Calendar</h1>
              <p className="text-muted-foreground mt-1">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-1 ml-4">
              <Button variant="outline" size="icon" onClick={() => navigateWeek('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={() => navigateWeek('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-border rounded-lg p-1">
              {['month', 'week', 'agenda'].map((v) => (
                <Button
                  key={v}
                  variant={view === v ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setView(v as typeof view)}
                  className="capitalize"
                >
                  {v}
                </Button>
              ))}
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Event
            </Button>
          </div>
        </motion.div>

        {/* Week View */}
        {view === 'week' && (
          <motion.div variants={fadeIn} className="flex-1 overflow-hidden rounded-xl border border-border bg-card">
            {/* Days Header */}
            <div className="grid grid-cols-8 border-b border-border">
              <div className="p-3 text-center text-xs text-muted-foreground">
                {/* Time column header */}
              </div>
              {weekDays.map((day) => (
                <div 
                  key={day.toISOString()}
                  className={cn(
                    "p-3 text-center border-l border-border",
                    isToday(day) && "bg-accent/5"
                  )}
                >
                  <p className="text-xs text-muted-foreground uppercase">
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  </p>
                  <p className={cn(
                    "text-lg font-semibold mt-1",
                    isToday(day) && "text-accent"
                  )}>
                    {day.getDate()}
                  </p>
                </div>
              ))}
            </div>

            {/* Time Grid */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-8">
                {/* Time labels */}
                <div className="divide-y divide-border">
                  {hours.map((hour) => (
                    <div key={hour} className="h-16 p-2 text-right">
                      <span className="text-xs text-muted-foreground">
                        {hour > 12 ? hour - 12 : hour} {hour >= 12 ? 'PM' : 'AM'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Day columns */}
                {weekDays.map((day) => {
                  const dayEvents = getEventsForDay(day);
                  
                  return (
                    <div 
                      key={day.toISOString()}
                      className={cn(
                        "border-l border-border divide-y divide-border relative",
                        isToday(day) && "bg-accent/5"
                      )}
                    >
                      {hours.map((hour) => (
                        <div key={hour} className="h-16" />
                      ))}
                      
                      {/* Events */}
                      {dayEvents.map((event) => {
                        const athlete = getAthlete(event.athleteIds[0]);
                        const startHour = new Date(event.startDate).getHours();
                        const top = (startHour - 7) * 64; // 64px per hour slot
                        
                        return (
                          <div
                            key={event.id}
                            className={cn(
                              "absolute left-1 right-1 p-2 rounded-md border text-xs cursor-pointer",
                              "hover:shadow-sm transition-shadow",
                              eventTypeColors[event.type]
                            )}
                            style={{ top: `${top}px`, minHeight: '56px' }}
                          >
                            <p className="font-semibold truncate">{event.title}</p>
                            <p className="text-[10px] opacity-70 mt-0.5">
                              {formatTime(event.startDate)}
                              {athlete && ` • ${athlete.name.split(' ')[0]}`}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Agenda View */}
        {view === 'agenda' && (
          <motion.div variants={fadeIn} className="flex-1 space-y-4 overflow-y-auto">
            {weekDays.map((day) => {
              const dayEvents = getEventsForDay(day);
              if (dayEvents.length === 0) return null;
              
              return (
                <div key={day.toISOString()}>
                  <h3 className={cn(
                    "text-sm font-semibold mb-2 sticky top-0 bg-surface py-2",
                    isToday(day) && "text-accent"
                  )}>
                    {day.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                    {isToday(day) && <span className="ml-2 text-xs font-normal">(Today)</span>}
                  </h3>
                  <div className="space-y-2">
                    {dayEvents.map((event) => {
                      const athlete = getAthlete(event.athleteIds[0]);
                      
                      return (
                        <div
                          key={event.id}
                          className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border hover:border-border-strong transition-colors cursor-pointer"
                        >
                          <div className="w-20 text-center">
                            <span className="text-sm font-medium">{formatTime(event.startDate)}</span>
                          </div>
                          <div className={cn(
                            "w-1 h-12 rounded-full",
                            eventTypeColors[event.type].replace('bg-', 'bg-').replace('/20', '')
                          )} />
                          <div className="flex-1">
                            <h4 className="font-semibold">{event.title}</h4>
                            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                              {athlete && <span>{athlete.name}</span>}
                              {event.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {event.location}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className={cn(
                            "text-xs font-medium px-2 py-1 rounded-full border",
                            eventTypeColors[event.type]
                          )}>
                            {event.type}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Month View Placeholder */}
        {view === 'month' && (
          <motion.div 
            variants={fadeIn} 
            className="flex-1 flex items-center justify-center text-muted-foreground"
          >
            Month view coming soon...
          </motion.div>
        )}
      </motion.div>
    </AppLayout>
  );
}
