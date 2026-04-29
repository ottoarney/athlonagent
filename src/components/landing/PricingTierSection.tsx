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
      <article className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8 lg:p-10">
        <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:gap-10">
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-4 shadow-inner">
              <div className="mb-3 inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                Product preview
              </div>
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                </div>
                <div className="aspect-[4/3] bg-gradient-to-b from-white to-slate-100 p-4">
                  <div className="grid h-full grid-cols-3 gap-3">
                    <div className="col-span-2 space-y-3 rounded-md border border-slate-200 bg-white p-3">
                      <div className="h-3 w-24 rounded bg-slate-200" />
                      <div className="h-16 rounded bg-slate-100" />
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-8 rounded bg-slate-100" />
                        <div className="h-8 rounded bg-slate-100" />
                      </div>
                    </div>
                    <div className="space-y-3 rounded-md border border-slate-200 bg-white p-3">
                      <div className="h-3 w-full rounded bg-slate-200" />
                      <div className="h-3 w-2/3 rounded bg-slate-200" />
                      <div className="h-14 rounded bg-slate-100" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#0c5dff]">FREE BETA</p>

              <h3 className="mt-4 text-2xl font-semibold md:text-3xl">Ready to get started?</h3>
              <p className="mt-2 text-muted-foreground">No commitment. No payment required.</p>

              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-lg font-semibold text-foreground">Free during beta</p>
                <p className="mt-1 text-muted-foreground">
                  Get early access while Athlon Agent tests core CRM workflows with agents, athlete reps, and NIL-focused teams.
                </p>
              </div>

              <ul className="mt-6 grid gap-3 sm:grid-cols-1">
                {betaHighlights.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm md:text-base">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0c5dff]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Button asChild className="rounded-full bg-[#01FB64] text-black hover:bg-[#01FB64] active:bg-[#01FB64] focus-visible:bg-[#01FB64] focus-visible:ring-[#01FB64]">
                  <Link to={dashboardRoute}>Start Free Beta</Link>
                </Button>
                <p className="mt-3 text-sm text-muted-foreground">
                  Currently testing workflows with early Oregon NIL-focused users and sports representation teams.
                </p>
              </div>
            </div>
        </div>
      </article>
    </section>
  );
}
