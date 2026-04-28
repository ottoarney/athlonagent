import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HeroSection } from '@/components/landing/HeroSection';
import { PricingTierSection } from '@/components/landing/PricingTierSection';
import { SocialProofTestimonials } from '@/components/landing/SocialProofTestimonials';
import { OperationsFeatureSection } from '@/components/landing/OperationsFeatureSection';
import { Logo } from '@/components/brand/Logo';

const faqs = [
  ['Who is Athlon built for?', 'Athlon is built for sports agents, athlete managers, and agencies running high-touch athlete operations.'],
  ['Can agencies manage multiple agents?', 'Yes. Agency workspaces support multiple agents with shared visibility and role-based access controls.'],
  ['Does Athlon track deals, deadlines, and content?', 'Yes. Athlon keeps deals, obligations, deadlines, and content workflows organized in one operational system.'],
  ['How do I get access?', 'Choose a plan, create your account, and our team can help onboard your agency to Athlon quickly.'],
];

export default function Index() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const dashboardRoute = '/dashboard';

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
            <a href="#platform" className="transition-colors hover:text-[#111827]">Platform</a>
            <a href="#social-proof" className="transition-colors hover:text-[#111827]">Social Proof</a>
            <a href="#pricing" className="transition-colors hover:text-[#111827]">Pricing</a>
            <a href="#faq" className="transition-colors hover:text-[#111827]">FAQ</a>
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
            <a href="#platform" className="rounded-md px-2 py-1.5 text-sm text-[#6b7280] transition-colors hover:text-[#111827]" onClick={() => setMobileOpen(false)}>Platform</a>
            <a href="#social-proof" className="rounded-md px-2 py-1.5 text-sm text-[#6b7280] transition-colors hover:text-[#111827]" onClick={() => setMobileOpen(false)}>Social Proof</a>
            <a href="#pricing" className="rounded-md px-2 py-1.5 text-sm text-[#6b7280] transition-colors hover:text-[#111827]" onClick={() => setMobileOpen(false)}>Pricing</a>
            <a href="#faq" className="rounded-md px-2 py-1.5 text-sm text-[#6b7280] transition-colors hover:text-[#111827]" onClick={() => setMobileOpen(false)}>FAQ</a>
            <Button asChild variant="outline"><Link to={dashboardRoute}>Sign In</Link></Button>
            <Button asChild variant="outline"><Link to={dashboardRoute}>Get Started</Link></Button>
          </div>
        )}
      </header>

      <main>
        <HeroSection dashboardRoute={dashboardRoute} />
        <SocialProofTestimonials />
        <OperationsFeatureSection dashboardRoute={dashboardRoute} />
        <PricingTierSection dashboardRoute={dashboardRoute} />

        <section id="faq" className="scroll-mt-24 container px-4 md:px-6 pb-16 md:pb-24">
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
            <Link className="underline" to={dashboardRoute}>Agent signup</Link>
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
