import { CheckCircle2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const betaHighlights = [
  'Free beta access',
  'Manage athletes, clients, deals, and deadlines',
  'Test CRM workflows with real representation use cases',
  'Help shape future agency and NIL tools',
  'Built for sports agents, agencies, and athlete ops teams',
];

interface PricingTierSectionProps {
  dashboardRoute: string;
}

export function PricingTierSection({ dashboardRoute }: PricingTierSectionProps) {
  return (
    <section id="pricing" className="scroll-mt-24 container px-4 md:px-6 pb-16 md:pb-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.12em] text-[#0c5dff]">Free Beta</p>
        <h2 className="mt-3 text-3xl md:text-5xl">Start building your athlete operations system for free</h2>
        <p className="mt-4 text-muted-foreground md:text-lg">
          Athlon Agent is currently in beta as we test core CRM functionality with real sports representation workflows.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-5xl">
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
              <div className="flex items-center gap-2 text-sm font-medium text-[#111827]">
                <Sparkles className="h-4 w-4 text-[#fbe101]" />
                FREE BETA
              </div>

              <h3 className="mt-4 text-2xl font-semibold md:text-3xl">Ready to get started?</h3>
              <p className="mt-2 text-muted-foreground">No commitment. No payment required.</p>

              <div className="mt-4 inline-flex w-fit items-center rounded-lg border border-[#cce1ff] bg-[#f4f8ff] px-3 py-1.5 text-sm font-medium text-[#0c5dff]">
                Free during beta
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
                  Oregon NIL-focused testing is part of our beta roadmap as we learn from one of college athletics&apos; most active ecosystems.
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
