import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HeroSection } from '@/components/landing/HeroSection';
import { RolePathSection } from '@/components/landing/RolePathSection';
import { TrustMarquee } from '@/components/landing/TrustMarquee';
import { AgentAthleteToggle } from '@/components/landing/AgentAthleteToggle';
import { PricingTierSection } from '@/components/landing/PricingTierSection';
import { SocialProofTestimonials } from '@/components/landing/SocialProofTestimonials';
import { AuthMode, getAuthRoute, getRoleSelectRoute, setStoredRole, UserRole } from '@/lib/auth-flow';
import { Logo } from '@/components/brand/Logo';

const faqs = [
  ['Is Athlon Agent only for sports agents?', 'Athlon Agent is built first for sports agents, agencies, and athlete managers. It can also support athletes on their side of the platform with a simpler dashboard for visibility, tasks, and communication.'],
  ['What can I manage inside Athlon Agent?', 'You can manage athletes, tasks, schedules, deals, files, contracts, and day to day operations in one place. The goal is to replace scattered spreadsheets, notes, and disconnected tools.'],
  ['Is there a free plan?', 'Yes. The Solo plan is free for users managing one athlete. It is a simple way to start using the platform before moving up to a larger roster.'],
  ['What is included in the Roster plan?', 'The Roster plan is built for agents managing multiple athletes. It includes deal tracking, task management, calendar tools, file storage, athlete dashboards, and workflow support for growing operations.'],
  ['Do you offer a plan for agencies?', 'Yes. The Command plan is built for agencies and larger teams. It includes multi-user access, role permissions, shared dashboards, and stronger operational visibility across a full roster.'],
  ['Can athletes log in too?', 'Yes. Athletes can log in to view what is relevant to them. This can include schedules, tasks, updates, and selected deal information depending on account structure.'],
  ['How does collaboration work?', 'Athlon Agent is designed for shared visibility across agents, teams, and athletes. Different users can access the right information based on their role and level of access.'],
  ['Does Athlon Agent support Google sign in?', 'Yes. Google sign in is supported to make onboarding faster and simpler. The login flow should route each user to the dashboard that matches their role.'],
  ['Who is Athlon Agent best for?', 'Athlon Agent is best for sports agents, athlete managers, and agencies that need a cleaner way to manage operations. It is especially useful for groups handling multiple athletes, brand deals, scheduling, and internal coordination.'],
  ['Why use Athlon Agent instead of spreadsheets?', 'Spreadsheets can track information but they do not run operations well. Athlon Agent gives you structure, visibility, and a system built around athlete management.'],
  ['Is Athlon Agent built for NIL workflows?', 'Yes. The platform is meant to support modern athlete operations including NIL related organization, deal flow, content planning, and communication.'],
  ['Can teams or interns be added to the account?', 'Yes on higher tier plans. Agency users can add team members and assign access based on role so operations stay organized without giving everyone the same permissions.'],
];

export default function Index() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const beginAuth = (mode: AuthMode, role?: UserRole) => {
    if (role) {
      setStoredRole(role);
      navigate(getAuthRoute(mode, role));
      return;
    }

    navigate(getRoleSelectRoute(mode));
  };

  const routeWithRole = (path: string) => {
    const role = path.includes('athlete') ? 'athlete' : 'agent';
    const mode = path.includes('/login') ? 'login' : 'signup';
    beginAuth(mode, role);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-[#f3f4f6] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)] backdrop-blur-xl">
        <div className="container px-4 md:px-6 h-20 flex items-center justify-between">
          <Link
            to="/"
            aria-label="Athlon home"
            className="inline-flex items-center rounded-lg px-1 py-1 -ml-1 transition duration-300 hover:opacity-85 hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Logo size="md" priority />
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-sm text-[#6b7280]">
            <a href="#pathways" className="transition-colors hover:text-[#111827]">Pathways</a>
            <button className="transition-colors hover:text-[#111827]" onClick={() => beginAuth('signup')}>See Platform</button>
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <Button variant="outline" className="rounded-full border-[#d1d5db] text-[#374151]" onClick={() => beginAuth('login')}>Sign In</Button>
            <Button className="rounded-full bg-[#16a34a] text-white hover:bg-[#16a34a]/95" onClick={() => beginAuth('signup')}>Get Started</Button>
          </div>

          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen((v) => !v)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-border px-4 py-4 grid gap-2 bg-background">
            <Button variant="outline" onClick={() => beginAuth('signup', 'agent')}>Agent / Agency</Button>
            <Button variant="outline" onClick={() => beginAuth('signup', 'athlete')}>Athlete</Button>
            <Button variant="outline" onClick={() => beginAuth('login')}>Sign In</Button>
            <Button variant="outline" onClick={() => beginAuth('signup')}>Get Started</Button>
          </div>
        )}
      </header>

      <main>
        <HeroSection onPrimaryCta={() => beginAuth('signup')} onSecondaryCta={() => beginAuth('login')} />
        <div className="border-t border-[#f3f4f6] bg-[#f9fafb]">
          <div className="container flex items-center justify-center gap-3 px-4 py-3 text-center md:px-6">
            <span aria-hidden="true" className="text-sm">🏈</span>
            <p className="text-[0.75rem] uppercase tracking-[0.1em] text-[#9ca3af]">
              Trusted by agents representing NFL · NBA · NIL athletes
            </p>
            <span aria-hidden="true" className="text-sm">🏀</span>
          </div>
        </div>
        <RolePathSection
          onSelectSignup={routeWithRole}
          onSelectLogin={routeWithRole}
          onSeePlatform={() => beginAuth('signup')}
          onJoinNow={() => beginAuth('signup')}
        />
        <TrustMarquee />
        <AgentAthleteToggle />
        <SocialProofTestimonials />
        <PricingTierSection onTierCta={beginAuth} />

        <section id="faq" className="container px-4 md:px-6 pb-16 md:pb-24">
          <h2 className="text-3xl md:text-5xl">Frequently asked questions</h2>
          <Accordion type="single" collapsible className="mt-8 border rounded-2xl px-5 bg-card">
            {faqs.map(([q, a]) => (
              <AccordionItem key={q} value={q}>
                <AccordionTrigger className="text-left">{q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </main>

      <footer className="border-t border-border bg-surface">
        <div className="container px-4 md:px-6 py-8 flex flex-wrap items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-3">
            <Link to="/" aria-label="Athlon home" className="inline-flex items-center rounded-lg px-1 py-1 -ml-1 transition duration-300 hover:opacity-85">
              <Logo size="sm" />
            </Link>
            <p className="text-muted-foreground">Premium sports-agent and athlete operations platform.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="underline" onClick={() => beginAuth('signup', 'agent')}>Agent signup</button>
            <button className="underline" onClick={() => beginAuth('signup', 'athlete')}>Athlete signup</button>
            <button className="underline" onClick={() => beginAuth('login')}>Sign in</button>
            <button className="underline" onClick={() => beginAuth('signup')}>Start free</button>
          </div>
        </div>
      </footer>

      <button className="fixed bottom-5 right-5 rounded-full border border-border bg-card p-2" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <ChevronDown className="h-4 w-4 rotate-180" />
      </button>
    </div>
  );
}
