import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onPrimaryCta: () => void;
  onSecondaryCta: () => void;
}

const exploreTiles = [
  'Deal Pipeline',
  'Brand Campaigns',
  'Athlete CRM',
  'Contract Hub',
  'Travel Ops',
  'AI Assistant',
  'AI Agents',
  'Workflow Builder',
  'Automations',
];

const boardRows = [
  ['Nike Renewal', 'In Review', 'Apr 18', 'High'],
  ['Off-season Media', 'Ready', 'Apr 21', 'Medium'],
  ['Draft Weekend', 'Blocked', 'Apr 23', 'High'],
  ['Charity Event', 'Ready', 'Apr 29', 'Low'],
  ['Adidas Shoot', 'In Review', 'May 02', 'Medium'],
];

export function HeroSection({ onPrimaryCta, onSecondaryCta }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-surface/30">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.4)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.4)_1px,transparent_1px)] bg-[size:96px_96px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,hsl(var(--accent)/0.22),transparent_40%)]" />

      <div className="container relative px-4 md:px-6 py-16 md:py-24 lg:py-28">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <p className="inline-flex items-center rounded-full border border-border bg-background/80 px-4 py-1.5 text-sm text-muted-foreground shadow-sm">
            <Sparkles className="mr-2 h-3.5 w-3.5 text-accent" />
            Athlon Agent • AI-powered sports operations platform
          </p>

          <h1 className="mx-auto mt-7 max-w-3xl text-balance text-[clamp(2rem,6vw,4.3rem)] font-bold leading-[1.05] tracking-tight text-foreground">
            Outmanage the competition with the CRM built for sports agents.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Manage athletes, deals, deadlines, content, and communication in one place — with a streamlined athlete view that keeps everyone aligned.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button className="h-12 rounded-full px-7" onClick={onPrimaryCta}>
              Get Started
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <Button variant="outline" className="h-12 rounded-full px-7" onClick={onSecondaryCta}>
              Sign In
            </Button>
          </div>

          <p className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-accent" />
            No credit card needed • Built for agents, athletes, and team ops
          </p>
        </div>

        <div className="relative mx-auto mt-14 max-w-6xl lg:mt-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="mx-2 rounded-3xl border border-border bg-background/95 p-5 shadow-xl backdrop-blur"
          >
            <div className="rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-5 py-3 text-sm">
                <p className="font-semibold">Athlon Agent Workspace</p>
                <span className="rounded-full bg-accent/20 px-2 py-1 text-xs">Live sync</span>
              </div>

              <div className="overflow-x-auto px-5 pb-5 pt-4">
                <div className="min-w-[620px]">
                  <div className="grid grid-cols-[2fr_1fr_1fr_1fr] rounded-lg bg-surface px-4 py-2 text-xs uppercase tracking-[0.08em] text-muted-foreground">
                    <span>Campaign</span>
                    <span>Status</span>
                    <span>Deadline</span>
                    <span>Priority</span>
                  </div>
                  <div className="mt-2 space-y-2">
                    {boardRows.map((row) => (
                      <div key={row[0]} className="grid grid-cols-[2fr_1fr_1fr_1fr] rounded-lg border border-border px-4 py-2.5 text-sm">
                        <span className="font-medium">{row[0]}</span>
                        <span className="text-muted-foreground">{row[1]}</span>
                        <span>{row[2]}</span>
                        <span>{row[3]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mx-auto mt-5 w-full max-w-sm rounded-3xl border border-border bg-card/95 p-4 shadow-lg lg:absolute lg:-right-2 lg:top-12 lg:mt-0"
          >
            <p className="text-center text-base font-medium">What would you like to launch?</p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {exploreTiles.map((tile) => (
                <div key={tile} className="rounded-xl border border-border bg-background p-2 text-center text-xs font-medium">
                  {tile}
                </div>
              ))}
            </div>
            <Button className="mt-4 w-full rounded-full" onClick={onPrimaryCta}>
              Start with Athlon
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
