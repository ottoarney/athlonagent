import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  FileText,
  Handshake,
  Menu,
  Sparkles,
  Target,
  Users,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { AuthMode, getAuthRoute, setStoredRole, UserRole } from '@/lib/auth-flow';

const navItems = [
  { label: 'Features', href: '#features' },
  { label: 'For Agents', href: '#for-agents' },
  { label: 'For Athletes', href: '#for-athletes' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

const previewModules = [
  {
    id: 'pipeline',
    label: 'Deal Pipeline',
    title: 'Pipeline built for NIL and brand partnerships',
    description: 'Track stage, value, deliverables, and owner for every deal without losing context.',
    stats: ['28 active negotiations', '$1.9M pipeline value', '94% on-time deliverables'],
  },
  {
    id: 'calendar',
    label: 'Calendar + Tasks',
    title: 'One shared timeline for athletes, agents, and partners',
    description: 'Unify travel, shoots, campaign drops, and contract deadlines in a single command center.',
    stats: ['41 upcoming obligations', '12 travel windows', 'Zero missed deadlines this month'],
  },
  {
    id: 'content',
    label: 'Content Ops',
    title: 'Plan content and brand deliverables like a media team',
    description: 'Organize briefs, approvals, posting schedules, and payment milestones in one board.',
    stats: ['63 planned posts', '17 approvals pending', 'Avg. 2.4x faster review cycles'],
  },
];

const faqs = [
  {
    q: 'Who is Athlon built for?',
    a: 'Athlon is built for sports agents, agencies, athlete marketers, and athletes who need a modern operating system for deals, schedules, and communications.',
  },
  {
    q: 'Is Athlon only for agents?',
    a: 'No. Agencies get deep operational controls while athletes get a focused portal to track obligations, files, and upcoming commitments.',
  },
  {
    q: 'Can athletes log in too?',
    a: 'Yes. Athletes can sign in to their dedicated portal with role-aware permissions and visibility into their own responsibilities.',
  },
  {
    q: 'What can I manage inside Athlon?',
    a: 'Athlete profiles, deal pipelines, tasks, shared calendars, content plans, files, reminders, notifications, and collaboration across your team.',
  },
  {
    q: 'Is Athlon for agencies or solo reps?',
    a: 'Both. Solo reps can run lean workflows while agencies can coordinate across multiple athletes and internal team members.',
  },
  {
    q: 'Can I organize content and brand deals here?',
    a: 'Absolutely. Athlon combines deal stages, deliverables, posting schedules, approvals, and status tracking in one workflow.',
  },
  {
    q: 'How do I get access?',
    a: 'Click Request Access or Get Started. You can choose Agent or Athlete and continue through the role-specific onboarding flow.',
  },
];

function BrandLogo() {
  return (
    <Link to="/" className="inline-flex items-center gap-2 font-semibold text-lg">
      <span className="h-8 w-8 rounded-xl bg-primary text-primary-foreground inline-flex items-center justify-center font-bold">A</span>
      <span className="font-display text-2xl leading-none">Athlon</span>
    </Link>
  );
}

function resolveRolePath(mode: AuthMode, role: UserRole, navigate: (path: string) => void) {
  setStoredRole(role);
  navigate(getAuthRoute(mode, role));
}

const Index = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleTab, setRoleTab] = useState<UserRole>('agent');
  const [previewTab, setPreviewTab] = useState(previewModules[0].id);

  const activePreview = useMemo(
    () => previewModules.find((module) => module.id === previewTab) ?? previewModules[0],
    [previewTab],
  );

  return (
    <div className="min-h-screen bg-background text-foreground scroll-smooth">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="container px-4 md:px-6 h-20 flex items-center justify-between gap-6">
          <BrandLogo />

          <nav className="hidden lg:flex items-center gap-7 text-sm text-muted-foreground">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="transition-colors hover:text-foreground">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/auth?mode=login')}>
              Sign In
            </Button>
            <Button className="rounded-full px-5" onClick={() => navigate('/auth?mode=signup')}>
              Get Started
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Toggle navigation"
            onClick={() => setMobileMenuOpen((value) => !value)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background px-4 py-4 space-y-4">
            <div className="grid gap-3 text-sm">
              {navItems.map((item) => (
                <a key={item.label} href={item.href} onClick={() => setMobileMenuOpen(false)} className="text-muted-foreground hover:text-foreground">
                  {item.label}
                </a>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => navigate('/auth?mode=login')}>
                Sign In
              </Button>
              <Button onClick={() => navigate('/auth?mode=signup')}>Get Started</Button>
            </div>
          </div>
        )}
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/25 blur-3xl" />
            <div className="absolute top-20 right-0 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
          </div>

          <div className="container relative px-4 md:px-6 py-16 md:py-24">
            <Badge className="rounded-full border-accent/30 bg-accent/15 text-foreground px-4 py-1">
              <Sparkles className="h-3.5 w-3.5 mr-1" /> Built for modern sports management
            </Badge>

            <div className="mt-8 grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-display leading-[0.95]">
                  The command center for athlete operations.
                </h1>
                <p className="mt-6 text-lg text-muted-foreground max-w-xl">
                  Athlon helps agents and athletes run deals, deadlines, content, schedules, and communication in one premium workspace.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button size="lg" className="rounded-full px-6" onClick={() => navigate('/auth?mode=signup')}>
                    Get Started <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-full px-6" onClick={() => navigate('/auth?mode=login')}>
                    Sign In
                  </Button>
                </div>

                <div className="mt-8 rounded-2xl border border-border bg-card p-4 md:p-5">
                  <p className="text-sm font-medium mb-3">Choose your portal</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <button
                      className="rounded-xl border border-border bg-surface p-4 text-left transition-all hover:border-accent/50 hover:shadow-md"
                      onClick={() => resolveRolePath('signup', 'agent', navigate)}
                    >
                      <p className="font-semibold">I'm an Agent</p>
                      <p className="text-sm text-muted-foreground mt-1">Run deals, deadlines, and athlete operations.</p>
                    </button>
                    <button
                      className="rounded-xl border border-border bg-surface p-4 text-left transition-all hover:border-accent/50 hover:shadow-md"
                      onClick={() => resolveRolePath('signup', 'athlete', navigate)}
                    >
                      <p className="font-semibold">I'm an Athlete</p>
                      <p className="text-sm text-muted-foreground mt-1">Track your obligations, files, and schedules.</p>
                    </button>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-3xl border border-border bg-card p-5 shadow-xl"
              >
                <div className="rounded-2xl border border-border bg-surface p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">Athlon Workspace</p>
                    <Badge className="rounded-full bg-accent/20 text-foreground">Live</Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    {['NIL Deals', 'Deadlines', 'Content Plan', 'Athlete Files'].map((item, index) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 + 0.1 }}
                        className="rounded-xl bg-background border border-border p-3"
                      >
                        <p className="font-medium">{item}</p>
                        <p className="text-muted-foreground text-xs mt-1">Always in sync</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-surface/70">
          <div className="container px-4 md:px-6 py-8">
            <p className="text-sm uppercase tracking-[0.12em] text-muted-foreground">Trusted by modern sports teams, athlete reps, and agencies</p>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3">
              {['Northstar Agency', 'Velocity Sports', 'Summit Collective', 'Prime Athlete Group', 'NextPlay Media'].map((name) => (
                <div key={name} className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-center font-medium">
                  {name}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="container px-4 md:px-6 py-16 md:py-24 space-y-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl">Everything your sports operation needs, without the chaos.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              ['Athlete management dashboard', Users],
              ['Deal tracking + pipeline', Handshake],
              ['Tasks and reminders', CheckCircle2],
              ['Shared calendars', Calendar],
              ['Content planning', Target],
              ['Documents and files', FileText],
            ].map(([title, Icon]) => (
              <div key={title as string} className="group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-accent/50">
                <div className="h-10 w-10 rounded-xl bg-accent/15 text-foreground inline-flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{title as string}</h3>
                <p className="text-sm text-muted-foreground mt-2">Designed for high-tempo teams balancing schedules, brand commitments, and athlete priorities.</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container px-4 md:px-6 pb-16 md:pb-24 grid lg:grid-cols-[1fr_1.25fr] gap-6" id="for-agents">
          <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
            <div className="inline-flex rounded-full bg-surface p-1">
              {(['agent', 'athlete'] as UserRole[]).map((role) => (
                <button
                  key={role}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    roleTab === role ? 'bg-primary text-primary-foreground' : 'text-muted-foreground',
                  )}
                  onClick={() => setRoleTab(role)}
                >
                  {role === 'agent' ? 'For Agents / Agencies' : 'For Athletes'}
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              {(roleTab === 'agent'
                ? [
                    'Track athletes and live obligations',
                    'Manage deadlines, deal stages, and deliverables',
                    'Centralize communication across staff + athletes',
                    'Get a complete operational snapshot each day',
                  ]
                : [
                    'See your upcoming obligations and campaigns',
                    'View deal status and required deliverables',
                    'Stay on top of content tasks and due dates',
                    'Access schedules, files, and expectations instantly',
                  ]
              ).map((point) => (
                <div key={point} className="flex gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-accent mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <Button className="mt-6 rounded-full" onClick={() => resolveRolePath('signup', roleTab, navigate)}>
              Continue as {roleTab === 'agent' ? 'Agent' : 'Athlete'}
            </Button>
          </div>

          <div className="rounded-3xl border border-border bg-surface p-6 md:p-8" id="for-athletes">
            <h3 className="text-2xl">Interactive preview</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {previewModules.map((module) => (
                <button
                  key={module.id}
                  className={cn(
                    'rounded-full border px-4 py-2 text-sm transition-colors',
                    previewTab === module.id
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background text-muted-foreground hover:text-foreground',
                  )}
                  onClick={() => setPreviewTab(module.id)}
                >
                  {module.label}
                </button>
              ))}
            </div>

            <motion.div
              key={activePreview.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-5 rounded-2xl border border-border bg-background p-5"
            >
              <h4 className="font-semibold text-lg">{activePreview.title}</h4>
              <p className="text-muted-foreground mt-2">{activePreview.description}</p>
              <div className="mt-4 grid sm:grid-cols-3 gap-3">
                {activePreview.stats.map((stat) => (
                  <div key={stat} className="rounded-xl border border-border bg-surface px-3 py-2 text-sm font-medium">
                    {stat}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="bg-surface py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl md:text-5xl max-w-2xl">How Athlon works</h2>
            <div className="mt-8 grid md:grid-cols-4 gap-4">
              {[
                ['1', 'Add your roster', 'Create athlete profiles and set role-based access.'],
                ['2', 'Map operations', 'Set up deals, tasks, schedules, and campaign deliverables.'],
                ['3', 'Share visibility', 'Athletes see exactly what they owe and when it is due.'],
                ['4', 'Execute faster', 'Keep everyone aligned and move from chaos to clarity.'],
              ].map(([index, title, description]) => (
                <div key={title} className="rounded-2xl border border-border bg-background p-5">
                  <p className="text-accent font-semibold">Step {index}</p>
                  <h3 className="font-semibold mt-2">{title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container px-4 md:px-6 py-16 md:py-24">
          <h2 className="text-3xl md:text-5xl">Use cases from the field</h2>
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              ['Sports Agent', '“Athlon replaced four separate tools and gave our athletes instant clarity on their obligations.”'],
              ['Athlete Marketing Lead', '“Our brand campaign execution got dramatically cleaner once deal milestones and content tasks lived together.”'],
              ['Professional Athlete', '“I know exactly what is due each week without chasing texts or emails.”'],
            ].map(([role, quote]) => (
              <div key={role} className="rounded-2xl border border-border bg-card p-6">
                <p className="text-sm font-medium text-accent">{role}</p>
                <p className="mt-3 text-muted-foreground">{quote}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className="container px-4 md:px-6 pb-16 md:pb-24">
          <div className="rounded-3xl border border-border bg-primary text-primary-foreground p-8 md:p-12 text-center">
            <p className="text-sm uppercase tracking-[0.12em] text-primary-foreground/75">Request access</p>
            <h2 className="text-3xl md:text-5xl mt-4">Ready to run your athlete operation with confidence?</h2>
            <p className="mt-4 max-w-2xl mx-auto text-primary-foreground/75">
              Join the next wave of agencies and athletes building a modern operating system for sports business.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button size="lg" variant="secondary" className="rounded-full" onClick={() => navigate('/auth?mode=signup')}>
                Request Access
              </Button>
              <Button size="lg" variant="outline" className="rounded-full border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10" onClick={() => navigate('/auth?mode=login')}>
                Sign In
              </Button>
            </div>
          </div>
        </section>

        <section id="faq" className="container px-4 md:px-6 pb-16 md:pb-24">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-5xl">Frequently asked questions</h2>
            <Accordion type="single" collapsible className="mt-8 border rounded-2xl px-5 bg-card">
              {faqs.map((item) => (
                <AccordionItem key={item.q} value={item.q}>
                  <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-surface">
        <div className="container px-4 md:px-6 py-10 grid md:grid-cols-4 gap-8">
          <div>
            <BrandLogo />
            <p className="text-sm text-muted-foreground mt-3">Premium athlete management software for modern sports organizations.</p>
          </div>
          <div>
            <p className="font-semibold mb-3">Product</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <a href="#features" className="block hover:text-foreground">Features</a>
              <a href="#pricing" className="block hover:text-foreground">Pricing</a>
              <Link to="/dashboard" className="block hover:text-foreground">Dashboard Demo</Link>
            </div>
          </div>
          <div>
            <p className="font-semibold mb-3">Roles</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <button className="block hover:text-foreground" onClick={() => resolveRolePath('signup', 'agent', navigate)}>For Agents</button>
              <button className="block hover:text-foreground" onClick={() => resolveRolePath('signup', 'athlete', navigate)}>For Athletes</button>
            </div>
          </div>
          <div>
            <p className="font-semibold mb-3">Legal</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <a href="#" className="block hover:text-foreground">Privacy</a>
              <a href="#" className="block hover:text-foreground">Terms</a>
              <a href="#" className="block hover:text-foreground">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      <button
        className="fixed bottom-5 right-5 rounded-full border border-border bg-card p-2 text-muted-foreground hover:text-foreground"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        <ChevronDown className="h-4 w-4 rotate-180" />
      </button>
    </div>
  );
};

export default Index;
