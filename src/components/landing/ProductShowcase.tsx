import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const productTabs = [
  {
    id: 'command',
    label: 'Agent command center',
    title: 'Oversee every athlete, obligation, and deal milestone from one control surface.',
    bullets: ['Track multi-athlete workflows', 'Prioritize blocked deliverables', 'Coordinate internal staff tasks'],
    cards: ['12 active athletes', '37 open tasks', '$2.1M in pipeline'],
  },
  {
    id: 'portal',
    label: 'Athlete portal',
    title: 'Give athletes total clarity on due dates, content asks, travel, and brand obligations.',
    bullets: ['What is due now', 'What is next this week', 'Files, plans, and approvals in one feed'],
    cards: ['5 obligations this week', '2 pending approvals', 'All campaign docs synced'],
  },
  {
    id: 'collab',
    label: 'Messaging + canvas',
    title: 'Keep athlete communication in context with shared notes, reminders, and task-linked threads.',
    bullets: ['Message beside operations', 'Pin system updates and notes', 'Share files + deadlines in-thread'],
    cards: ['24 conversation threads', '9 pinned updates', 'Realtime status indicators'],
  },
];

export function ProductShowcase() {
  const [activeTab, setActiveTab] = useState(productTabs[0]);

  return (
    <section id="features" className="container px-4 md:px-6 py-16 md:py-24">
      <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-6 items-start">
        <div className="lg:sticky lg:top-24 space-y-4">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Product tour</p>
          <h2 className="text-3xl md:text-5xl">A full system for athlete operations.</h2>
          <p className="text-muted-foreground">Not just CRM. Not just chat. Athlon combines command workflows, athlete visibility, and context-rich communication.</p>
          <div className="space-y-2">
            {productTabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab)} className={cn('w-full rounded-xl border p-3 text-left transition-all', activeTab.id === tab.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-accent/50')}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div key={activeTab.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-border bg-card p-6 md:p-8">
          <h3 className="text-2xl md:text-3xl max-w-2xl">{activeTab.title}</h3>
          <div className="mt-5 space-y-2 text-sm text-muted-foreground">
            {activeTab.bullets.map((bullet) => <p key={bullet}>• {bullet}</p>)}
          </div>
          <div className="mt-6 grid sm:grid-cols-3 gap-3">
            {activeTab.cards.map((card) => (
              <div key={card} className="rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium">{card}</div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-border bg-background p-4">
            <p className="text-sm font-medium">Live preview module</p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
              <div className="rounded-lg border border-border p-3">Deal #48 • Creative due Friday</div>
              <div className="rounded-lg border border-border p-3">Pinned: Confirm shoot call sheet</div>
              <div className="rounded-lg border border-border p-3">Agent note: athlete availability updated</div>
              <div className="rounded-lg border border-border p-3">Task: Upload signed agreement</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
