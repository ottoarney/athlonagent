import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HeroSection } from '@/components/landing/HeroSection';
import { PricingTierSection } from '@/components/landing/PricingTierSection';
import { SocialProofTestimonials } from '@/components/landing/SocialProofTestimonials';
import { OperationsFeatureSection } from '@/components/landing/OperationsFeatureSection';
import { AuthMode, getAuthRoute, setStoredRole } from '@/lib/auth-flow';
import { Logo } from '@/components/brand/Logo';

const faqs = [
  ['Is Athlon Agent only for sports agents?', 'Athlon Agent is purpose-built for sports agents, agencies, and athlete managers who need one operating system for execution.'],
  ['What can I manage inside Athlon Agent?', 'You can manage athletes, tasks, schedules, deals, files, contracts, and day-to-day operations in one place.'],
  ['Is there a free plan?', 'Yes. The Solo plan is free for users managing one athlete. It is a simple way to start before moving up to a larger roster.'],
  ['What is included in the Roster plan?', 'The Roster plan is built for agents managing multiple athletes. It includes deal tracking, task management, calendar tools, file storage, and workflow support for growing operations.'],
  ['Do you offer a plan for agencies?', 'Yes. The Command plan is built for agencies and larger teams with multi-user access, role permissions, and shared dashboards.'],
  ['Does Athlon Agent support Google sign in?', 'Yes. Google sign in is supported to make onboarding faster and simpler for agencies and their teams.'],
  ['Who is Athlon Agent best for?', 'Athlon Agent is best for sports agents, athlete managers, and agencies that need a cleaner way to run operations.'],
  ['Why use Athlon Agent instead of spreadsheets?', 'Spreadsheets can track information but they do not run operations well. Athlon Agent gives your team structure, accountability, and visibility.'],
  ['Is Athlon Agent built for NIL workflows?', 'Yes. The platform supports modern athlete operations including NIL deal flow, content planning, and team coordination.'],
  ['Can teams or interns be added to the account?', 'Yes on higher tier plans. Agency users can add team members and assign access based on role.'],
];

export default function Index() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const dashboardRoute = '/dashboard';

  const beginAuth = (mode: AuthMode) => {
    setStoredRole('agent');
    navigate(getAuthRoute(mode));
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
            <Button asChild variant="outline" className="rounded-full"><Link to={dashboardRoute}>Sign In</Link></Button>
            <Button asChild className="rounded-full bg-[#01FB64] text-black hover:bg-[#01FB64] active:bg-[#01FB64] focus-visible:bg-[#01FB64] focus-visible:ring-[#01FB64]"><Link to={dashboardRoute}>Get Started</Link></Button>
          </div>

          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen((v) => !v)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-border px-4 py-4 grid gap-2 bg-background">
            <Button asChild variant="outline"><Link to={dashboardRoute}>Sign In</Link></Button>
            <Button asChild variant="outline"><Link to={dashboardRoute}>Get Started</Link></Button>
          </div>
        )}
      </header>

      <main>
        <HeroSection dashboardRoute={dashboardRoute} />
        <SocialProofTestimonials />
        <OperationsFeatureSection onPrimaryCta={beginAuth} />
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
            <p className="text-muted-foreground">Premium sports-agent operations platform.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="underline" onClick={() => beginAuth('signup')}>Agent signup</button>
            <Link className="underline" to={dashboardRoute}>Sign in</Link>
            <Link className="underline" to={dashboardRoute}>Start free</Link>
          </div>
        </div>
      </footer>

      <button className="fixed bottom-5 right-5 rounded-full border border-border bg-card p-2" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <ChevronDown className="h-4 w-4 rotate-180" />
      </button>
    </div>
  );
}
