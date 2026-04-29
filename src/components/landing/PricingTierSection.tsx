import { CheckCircle2 } from 'lucide-react';
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
    <section id="pricing" className="scroll-mt-24 container px-4 md:px-6 pb-16 md:pb-24">
      <div className="mx-auto max-w-2xl">
        <article className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0c5dff]">Free Beta</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">Ready to get started?</h2>
          <p className="mt-1 text-sm text-muted-foreground">No commitment. No payment required.</p>

          <div className="mt-5 rounded-xl border border-border bg-surface px-4 py-3">
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
        </article>
      </div>
    </section>
  );
}
