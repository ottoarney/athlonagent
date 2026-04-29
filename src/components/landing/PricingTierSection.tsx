import { CheckCircle2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const betaHighlights = [
  'Athlete and client tracking',
  'Deal pipeline management',
  'Tasks, deadlines, and schedules',
  'Built with early NIL and sports representation feedback',
];

interface PricingTierSectionProps {
  dashboardRoute: string;
}

export function PricingTierSection({ dashboardRoute }: PricingTierSectionProps) {
  return (
    <section id="pricing" className="scroll-mt-24 py-20 md:py-24">
      <div className="container px-4 md:px-6">
        <article className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8 lg:p-10">
          <div className="grid items-start gap-6 md:gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-gradient-to-b from-surface to-white p-4 md:p-5">
              <div className="inline-flex items-center rounded-full border border-border/70 bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                Product preview
              </div>
              <div className="mt-3 overflow-hidden rounded-xl border border-border bg-background">
                <div className="border-b border-border bg-surface px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-border" />
                    <span className="h-2 w-2 rounded-full bg-border" />
                    <span className="h-2 w-2 rounded-full bg-border" />
                  </div>
                </div>
                <div className="grid h-[240px] gap-3 p-4 sm:h-[280px]">
                  <div className="h-14 rounded-lg border border-border bg-surface" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-24 rounded-lg border border-border bg-surface" />
                    <div className="h-24 rounded-lg border border-border bg-surface" />
                  </div>
                  <div className="h-20 rounded-lg border border-border bg-surface" />
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0c5dff]">Free Beta</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">Ready to get started?</h2>
              <p className="mt-1 text-sm text-muted-foreground">No commitment. No payment required.</p>

              <div className="mt-5 inline-block max-w-[42rem] rounded-xl border border-border bg-surface px-4 py-3 align-top">
                <p className="text-sm font-medium text-foreground">Free during beta</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Get early access while Athlon Agent tests core CRM workflows with agents, athlete reps, and NIL-focused teams.
                </p>
              </div>

              <ul className="mt-5 space-y-2.5">
                {betaHighlights.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0c5dff]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <Button asChild className="w-full rounded-full bg-[#01FB64] text-black hover:bg-[#01FB64] active:bg-[#01FB64] focus-visible:bg-[#01FB64] focus-visible:ring-[#01FB64] sm:w-auto">
                  <Link to={dashboardRoute}>Start Free Beta</Link>
                </Button>
                <p className="mt-3 text-xs text-muted-foreground">
                  Currently testing workflows with early Oregon NIL-focused users and sports representation teams.
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
