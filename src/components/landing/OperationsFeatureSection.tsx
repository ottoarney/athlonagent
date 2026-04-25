import { ArrowRight, CalendarClock, ClipboardCheck, Handshake, PlaySquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import Plan from '@/components/ui/agent-plan';
import { Button } from '@/components/ui/button';

interface OperationsFeatureSectionProps {
  dashboardRoute: string;
}

const featurePills = [
  {
    title: 'Athlete obligations',
    detail: 'See critical deadlines, approvals, and deliverables in one place.',
    icon: ClipboardCheck,
  },
  {
    title: 'Deal flow control',
    detail: 'Move deals from outreach to signed terms with full visibility.',
    icon: Handshake,
  },
  {
    title: 'Calendar + task sync',
    detail: 'Keep travel, media, and execution work aligned by athlete.',
    icon: CalendarClock,
  },
  {
    title: 'Content tracking',
    detail: 'Track planned, approved, and pending content at a glance.',
    icon: PlaySquare,
  },
];

export function OperationsFeatureSection({ dashboardRoute }: OperationsFeatureSectionProps) {
  return (
    <section className="py-20 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="rounded-3xl border border-border/70 bg-gradient-to-b from-white to-surface p-6 md:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)] lg:gap-10">
            <div>
              <span className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium tracking-[0.12em] text-[#0f0f0f]">
                Built for elite sports representation teams
              </span>
              <h2 className="mt-4 text-3xl font-semibold leading-tight md:text-5xl">
                Run athlete operations with <span className="text-[#01FB64]">precision</span>
              </h2>
              <p className="mt-4 max-w-[52ch] text-base text-muted-foreground md:text-lg">
                Athlon Agent unifies athlete obligations, deal flow, calendar execution, and content ops for modern
                sports agencies.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {featurePills.map(({ title, detail, icon: Icon }) => (
                  <article key={title} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-[#0f0f0f]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold md:text-base">{title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground/90">{detail}</p>
                  </article>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  className="h-11 rounded-full bg-[#01FB64] px-6 text-black hover:bg-[#01FB64] active:bg-[#01FB64] focus-visible:bg-[#01FB64] focus-visible:ring-[#01FB64]"
                >
                  <Link to={dashboardRoute}>
                    See Athlon in action
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <p className="text-sm text-muted-foreground">Purpose-built for agents, agencies, and athlete ops teams.</p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-2 shadow-sm lg:self-center lg:min-h-[540px]">
              <Plan />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
