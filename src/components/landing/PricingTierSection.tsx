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
        <article className="rounded-2xl border border-border bg-card p-7 shadow-sm md:p-10">
          <div className="flex items-center gap-2 text-sm font-medium text-[#111827]">
            <Sparkles className="h-4 w-4 text-[#fbe101]" />
            Early access program
          </div>

          <h3 className="mt-4 text-2xl font-semibold md:text-3xl">Free access while we build with early users</h3>
          <p className="mt-3 max-w-4xl text-muted-foreground md:text-base">
            Athlon Agent is in beta, giving agents, agencies, and athlete representation teams early access to a CRM built around deals,
            deadlines, rosters, content, and client operations.
          </p>
          <p className="mt-3 max-w-4xl text-muted-foreground md:text-base">
            We&apos;re also exploring partnerships with Oregon-focused accelerator and NIL groups to test functionality and learn from one of the most
            active NIL ecosystems in college athletics.
          </p>

          <ul className="mt-6 grid gap-3 md:grid-cols-2">
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
            <p className="mt-3 text-sm text-muted-foreground">No payment required during beta.</p>
          </div>
        </article>
      </div>
    </section>
  );
}
