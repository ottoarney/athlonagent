import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HeroSection } from '@/components/landing/HeroSection';
import { RolePathSection } from '@/components/landing/RolePathSection';
import { TrustMarquee } from '@/components/landing/TrustMarquee';
import { ProductShowcase } from '@/components/landing/ProductShowcase';
import { AgentAthleteToggle } from '@/components/landing/AgentAthleteToggle';
import { ChatFeaturePreview } from '@/components/landing/ChatFeaturePreview';
import { setStoredRole } from '@/lib/auth-flow';

const faqs = [
  ['Is Athlon built only for agents?', 'No — Athlon includes a dedicated athlete portal with role-based visibility and communication.'],
  ['Does Athlon support Google sign-in?', 'Yes. Agent and athlete onboarding now support Google OAuth plus email/password fallback.'],
  ['Can teams use Athlon for operations?', 'Yes. Team staff and ops workflows are supported through the same command + canvas model and can scale to role permissions.'],
  ['How does collaboration work?', 'Conversations, pinned updates, reminders, files, and task context live in one workspace thread instead of scattered apps.'],
];

function routeWithRole(path: string, navigate: ReturnType<typeof useNavigate>) {
  const role = path.includes('athlete') ? 'athlete' : 'agent';
  setStoredRole(role);
  navigate(path);
}

export default function Index() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="container px-4 md:px-6 h-20 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 font-semibold text-lg">
            <span className="h-8 w-8 rounded-xl bg-primary text-primary-foreground inline-flex items-center justify-center font-bold">A</span>
            <span className="font-display text-2xl">Athlon</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-sm text-muted-foreground">
            {['#pathways', '#features'].map((item) => (
              <a key={item} href={item} className="hover:text-foreground transition-colors">{item === '#pathways' ? 'Pathways' : 'Product'}</a>
            ))}
            <a href="/demo" className="hover:text-foreground">Demo</a>
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate('/login/agent')}>Sign In</Button>
            <Button className="rounded-full" onClick={() => navigate('/signup/agent')}>Get Started</Button>
          </div>

          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen((v) => !v)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-border px-4 py-4 grid gap-2 bg-background">
            <Button variant="outline" onClick={() => routeWithRole('/signup/agent', navigate)}>Agent signup</Button>
            <Button variant="outline" onClick={() => routeWithRole('/signup/athlete', navigate)}>Athlete signup</Button>
            <Button variant="outline" onClick={() => routeWithRole('/login/agent', navigate)}>Sign in</Button>
            <Button variant="outline" onClick={() => navigate('/demo')}>Request demo</Button>
            <Button variant="outline" onClick={() => navigate('/waitlist')}>Join waitlist</Button>
          </div>
        )}
      </header>

      <main>
        <HeroSection onPrimaryCta={() => document.getElementById('pathways')?.scrollIntoView({ behavior: 'smooth' })} onSecondaryCta={() => navigate('/demo')} />
        <RolePathSection onSelectSignup={(path) => routeWithRole(path, navigate)} onSelectLogin={(path) => routeWithRole(path, navigate)} />
        <TrustMarquee />
        <ProductShowcase />
        <ChatFeaturePreview />
        <AgentAthleteToggle />

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
          <p className="text-muted-foreground">Athlon • premium sports-agent and athlete operations platform.</p>
          <div className="flex flex-wrap gap-3">
            <Link to="/signup/agent" className="underline">Agent signup</Link>
            <Link to="/signup/athlete" className="underline">Athlete signup</Link>
            <Link to="/login/agent" className="underline">Sign in</Link>
            <Link to="/demo" className="underline">Request demo</Link>
            <Link to="/waitlist" className="underline">Join waitlist</Link>
          </div>
        </div>
      </footer>

      <button className="fixed bottom-5 right-5 rounded-full border border-border bg-card p-2" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <ChevronDown className="h-4 w-4 rotate-180" />
      </button>
    </div>
  );
}
