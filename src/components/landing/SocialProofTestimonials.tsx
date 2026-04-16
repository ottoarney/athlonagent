import { Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

type Testimonial = {
  name: string;
  role: string;
  quote: string;
  accent: 'accent' | 'warning';
};

const agencyReferences = ['CAA', 'Wasserman / THE·TEAM', 'Excel Sports Management', 'Klutch Sports Group', 'Athletes First'];

const testimonials: Testimonial[] = [
  {
    name: 'A. Rivera',
    role: 'Senior NFL Agent',
    quote: 'Athlon Agent gives our team one place to track athlete priorities without the usual chaos.',
    accent: 'accent',
  },
  {
    name: 'K. Thompson',
    role: 'Director of Athlete Marketing',
    quote: 'The platform feels built around how representation actually works day to day across our roster.',
    accent: 'warning',
  },
  {
    name: 'M. Brooks',
    role: 'NIL Representation Lead',
    quote: 'We miss fewer details because tasks, approvals, and deadlines now live in one operating rhythm.',
    accent: 'accent',
  },
  {
    name: 'D. Carter',
    role: 'Basketball Operations Advisor',
    quote: 'It brings structure to content, schedules, and partnerships in a way generic CRMs do not.',
    accent: 'warning',
  },
  {
    name: 'S. Nguyen',
    role: 'Agency Partnerships Manager',
    quote: 'Communication is cleaner when everyone sees updates in context instead of chasing scattered threads.',
    accent: 'accent',
  },
  {
    name: 'L. Foster',
    role: 'Player Brand Strategist',
    quote: 'Clean, fast, and actually useful when you are juggling multiple clients and sponsor timelines.',
    accent: 'warning',
  },
  {
    name: 'R. Ellis',
    role: 'Athlete Services Coordinator',
    quote: 'As our agency grew, Athlon gave us better visibility across deliverables and less operational drift.',
    accent: 'accent',
  },
  {
    name: 'T. Hall',
    role: 'Representation Operations Lead',
    quote: 'We now run weekly planning from one system and feel in control even during peak campaign weeks.',
    accent: 'warning',
  },
  {
    name: 'C. Bennett',
    role: 'Client Strategy Manager',
    quote: 'Athlon keeps deals, media asks, and scheduling aligned so athlete support stays sharp and proactive.',
    accent: 'accent',
  },
];

const columns = [
  testimonials.filter((_, index) => index % 3 === 0),
  testimonials.filter((_, index) => index % 3 === 1),
  testimonials.filter((_, index) => index % 3 === 2),
];

function getAvatarText(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.replace(/[^A-Za-z]/g, '').charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <article className="rounded-2xl border border-accent/20 bg-primary/95 p-4 text-primary-foreground shadow-[0_8px_24px_hsl(0_0%_0%_/_0.22)] backdrop-blur-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border text-[10px] font-semibold leading-none whitespace-nowrap',
              item.accent === 'accent'
                ? 'border-accent/40 bg-accent/15 text-accent'
                : 'border-warning/40 bg-warning/15 text-warning',
            )}
          >
            {getAvatarText(item.name)}
          </div>
          <div>
            <p className="text-sm font-semibold leading-none">{item.name}</p>
            <p className="mt-1 text-xs text-primary-foreground/65">{item.role}</p>
          </div>
        </div>
        <Quote className="h-4 w-4 text-accent/80" />
      </div>
      <p className="mt-4 text-sm leading-relaxed text-primary-foreground/85">“{item.quote}”</p>
    </article>
  );
}

function TestimonialColumn({
  items,
  reverse,
  className,
}: {
  items: Testimonial[];
  reverse?: boolean;
  className?: string;
}) {
  const repeated = [...items, ...items];

  return (
    <div className={cn('h-[420px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]', className)}>
      <div className={cn('space-y-4 pb-4 animate-athlon-vertical-marquee', reverse && 'animate-athlon-vertical-marquee-reverse')}>
        {repeated.map((item, index) => (
          <TestimonialCard key={`${item.name}-${index}`} item={item} />
        ))}
      </div>
    </div>
  );
}

export function SocialProofTestimonials() {
  return (
    <section className="relative overflow-hidden py-20 md:py-24">
      <div className="container relative px-4 md:px-6">
        <div className="rounded-3xl border border-border/70 bg-gradient-to-b from-surface to-background p-6 md:p-10">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full border border-black/30 bg-accent/10 px-3 py-1 text-xs font-medium tracking-[0.12em] text-[#000000]">
              Trusted by the people moving sports forward
            </span>
            <h2 className="mt-4 text-3xl font-semibold md:text-5xl">Trusted by elite representation teams</h2>
            <p className="mt-4 text-base text-muted-foreground md:text-lg">
              Athlon Agent is designed for modern sports agencies, athlete reps, and high-performance teams that need
              structure, clarity, and execution as operations scale.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-primary/95 p-4 md:p-5">
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
              {agencyReferences.map((agency) => (
                <span
                  key={agency}
                  className="rounded-full border border-primary-foreground/15 bg-primary-foreground/5 px-3 py-1.5 text-xs font-medium text-primary-foreground/85 md:text-sm"
                >
                  {agency}
                </span>
              ))}
            </div>
            <p className="mt-4 text-center text-[11px] text-primary-foreground/45">
              Agency names shown for industry context only. Not endorsements or affiliations.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <TestimonialColumn items={columns[0]} />
            <TestimonialColumn items={columns[1]} reverse className="hidden md:block" />
            <TestimonialColumn items={columns[2]} className="hidden xl:block" />
          </div>
        </div>
      </div>
    </section>
  );
}
