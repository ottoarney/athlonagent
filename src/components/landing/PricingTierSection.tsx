import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const pricingTiers = [
  {
    name: 'Agent',
    description: 'For individual agents managing their own roster.',
    limits: ['Up to 10 athletes'],
    features: [
      'Manage up to 10 athletes',
      'Task and calendar system',
      'Deal and contract tracking',
      'Content planning tools',
      'Basic performance analytics',
    ],
    cta: 'Start as Agent',
    highlighted: false,
  },
  {
    name: 'Agency',
    description: 'For agents working within a shared agency.',
    limits: ['Up to 10 agents per agency', 'Each agent can manage up to 10 athletes'],
    features: [
      'Up to 10 agents per agency',
      'Each agent manages up to 10 athletes',
      'Shared agency dashboard',
      'Role-based permissions',
      'Advanced analytics across roster',
    ],
    cta: 'Join an Agency',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    description: 'For large agencies or organizations.',
    limits: ['Unlimited agents and athletes', 'Demo call required before access'],
    features: [
      'Unlimited agents and athletes',
      'Custom workflows and integrations',
      'Dedicated support and onboarding',
      'NIL valuation and advanced insights',
      'API and data export access',
    ],
    cta: 'Request Demo',
    highlighted: false,
  },
];

interface PricingTierSectionProps {
  dashboardRoute: string;
}

export function PricingTierSection({ dashboardRoute }: PricingTierSectionProps) {
  return (
    <section id="pricing" className="container px-4 md:px-6 pb-16 md:pb-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">Pricing</p>
        <h2 className="mt-3 text-3xl md:text-5xl">Pick the plan that fits your roster</h2>
        <p className="mt-4 text-muted-foreground md:text-lg">Simple plans for agents, agencies, and large organizations.</p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-5">
        {pricingTiers.map((tier) => (
          <article
            key={tier.name}
            className={`flex h-full flex-col rounded-2xl border p-6 shadow-sm ${
              tier.highlighted ? 'border-primary bg-surface/80 ring-1 ring-primary/20' : 'border-border bg-card'
            }`}
          >
            <h3 className="text-xl font-semibold">{tier.name}</h3>
            <p className="mt-3 min-h-12 text-sm text-muted-foreground">{tier.description}</p>

            <div className="mt-3 min-h-14 space-y-1">
              {tier.limits.map((limit) => (
                <p key={limit} className="text-sm font-medium text-foreground/90">
                  {limit}
                </p>
              ))}
            </div>

            <ul className="mt-5 flex-1 space-y-2 text-sm">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              asChild
              variant={tier.highlighted ? 'default' : 'outline'}
              className="mt-6 w-full rounded-full"
            >
              <Link to={dashboardRoute}>{tier.cta}</Link>
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
}
