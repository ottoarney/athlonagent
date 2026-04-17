import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthMode, UserRole } from '@/lib/auth-flow';

const pricingTiers = [
  {
    name: 'Solo',
    price: 'Free',
    frequency: '',
    description: 'Run one athlete the right way.',
    features: [
      '1 athlete profile',
      'Basic task and calendar system',
      'Simple deal tracker (limited deals)',
      'Limited storage',
      'Basic athlete dashboard',
    ],
    cta: 'Start free',
    mode: 'signup' as AuthMode,
    role: 'agent' as UserRole,
    highlighted: false,
  },
  {
    name: 'Roster',
    price: '$59/month',
    frequency: 'or $590/year',
    description: 'Outmanage the competition.',
    features: [
      'Everything in Solo',
      'Manage 5–50 athletes',
      'Unlimited deals',
      'Content planning system',
      'Contract and file storage',
      'Full athlete dashboards',
      'Notifications and reminders',
      'Basic analytics',
    ],
    cta: 'Choose Roster',
    mode: 'signup' as AuthMode,
    role: 'agent' as UserRole,
    highlighted: true,
  },
  {
    name: 'Command',
    price: '$399/month',
    frequency: '',
    description: 'Operate like a top agency.',
    features: [
      'Everything in Roster',
      'Unlimited athletes',
      'Multi-agent team access',
      'Role permissions',
      'Shared agency dashboard',
      'Advanced analytics',
      'NIL valuation tool',
      'Priority support',
      'Onboarding assistance',
    ],
    cta: 'Get Command',
    mode: 'login' as AuthMode,
    role: 'agent' as UserRole,
    highlighted: false,
  },
];

interface PricingTierSectionProps {
  onTierCta: (mode: AuthMode, role: UserRole) => void;
}

export function PricingTierSection({ onTierCta }: PricingTierSectionProps) {
  return (
    <section id="pricing" className="container px-4 md:px-6 pb-16 md:pb-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">Pricing</p>
        <h2 className="mt-3 text-3xl md:text-5xl">Pick the plan that fits your roster</h2>
        <p className="mt-4 text-muted-foreground md:text-lg">
          Transparent per-seat pricing for agencies of every size, with enterprise options when you need more control.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-5">
        {pricingTiers.map((tier) => (
          <article
            key={tier.name}
            className={`rounded-2xl border p-6 shadow-sm ${
              tier.highlighted ? 'border-primary bg-surface/80 ring-1 ring-primary/20' : 'border-border bg-card'
            }`}
          >
            <h3 className="text-xl font-semibold">{tier.name}</h3>
            <p className="mt-3 text-3xl font-bold">
              {tier.price}
              {tier.frequency && <span className="ml-1 text-base font-medium text-muted-foreground">{tier.frequency}</span>}
            </p>
            <p className="mt-3 min-h-12 text-sm text-muted-foreground">{tier.description}</p>

            <ul className="mt-5 space-y-2 text-sm">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              variant={tier.highlighted ? 'default' : 'outline'}
              className="mt-6 w-full rounded-full"
              onClick={() => onTierCta(tier.mode, tier.role)}
            >
              {tier.cta}
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
}
