import { useState } from 'react';
import { cn } from '@/lib/utils';

const data = {
  agent: {
    title: 'Agent view: operational command at scale',
    points: ['Oversee multiple athletes and staff tasks', 'Track deal stages + contract deliverables', 'Keep ownership clear across calendars and files'],
    statA: '18 athlete roster',
    statB: '9 deals in negotiation',
  },
  athlete: {
    title: 'Athlete view: clarity without overwhelm',
    points: ['See what is due now and what is upcoming', 'Message your rep with full campaign context', 'Access files, obligations, and plans in one feed'],
    statA: '3 tasks due this week',
    statB: '2 campaign obligations tomorrow',
  },
};

export function AgentAthleteToggle() {
  const [view, setView] = useState<'agent' | 'athlete'>('agent');
  const active = data[view];

  return (
    <section className="container px-4 md:px-6 py-16 md:py-24">
      <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-3xl md:text-5xl">Two experiences. One unified platform.</h2>
          <div className="inline-flex rounded-full bg-surface p-1">
            {(['agent', 'athlete'] as const).map((item) => (
              <button key={item} onClick={() => setView(item)} className={cn('rounded-full px-4 py-2 text-sm transition-colors capitalize', view === item ? 'bg-primary text-primary-foreground' : 'text-muted-foreground')}>
                {item} view
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid lg:grid-cols-[1.05fr_0.95fr] gap-6">
          <div>
            <h3 className="text-2xl">{active.title}</h3>
            <div className="mt-4 space-y-2 text-muted-foreground">
              {active.points.map((point) => <p key={point}>• {point}</p>)}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-4">
            <p className="text-sm font-medium">Preview • {view === 'agent' ? 'Agency Console' : 'Athlete Portal'}</p>
            <div className="mt-3 grid gap-3">
              <div className="rounded-lg border border-border bg-background p-3 text-sm">{active.statA}</div>
              <div className="rounded-lg border border-border bg-background p-3 text-sm">{active.statB}</div>
              <div className="rounded-lg border border-border bg-background p-3 text-sm">Canvas thread with due dates and notes</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
