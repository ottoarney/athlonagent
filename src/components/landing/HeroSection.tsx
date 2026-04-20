import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onPrimaryCta: () => void;
  onSecondaryCta: () => void;
}

export function HeroSection({ onPrimaryCta, onSecondaryCta }: HeroSectionProps) {
  return (
    <section className="border-b border-[#f3f4f6] bg-white">
      <div className="container px-4 py-16 md:px-6 md:py-24 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center">
            <p className="inline-flex w-fit items-center rounded-full border border-[#e5e7eb] bg-white px-4 py-1.5 text-sm text-[#374151] shadow-sm">
              <span className="mr-2 leading-none" aria-hidden="true">🏆</span>
              Athlon Agent · AI-powered sports operations platform
            </p>

            <h1 className="mt-7 max-w-[18ch] text-[clamp(2rem,5vw,4rem)] font-sans font-extrabold leading-[1.05] tracking-tight text-[#0f0f0f]">
              Outmanage the competition with the CRM built for <span className="text-[#01FB64]">sports agents.</span>
            </h1>

            <p className="mt-6 max-w-[60ch] text-base leading-relaxed text-[#6b7280] md:text-lg">
              Manage athletes, deals, deadlines, content, and communication in one place — with a streamlined athlete view that keeps everyone aligned.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                className="h-12 rounded-full bg-[#01FB64] px-7 text-black hover:bg-[#01FB64] active:bg-[#01FB64] focus-visible:bg-[#01FB64] focus-visible:ring-[#01FB64]"
                onClick={onPrimaryCta}
              >
                Get Started
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-12 rounded-full border-[#d1d5db] bg-transparent px-7 text-[#111827] hover:bg-[#f9fafb]"
                onClick={onSecondaryCta}
              >
                Sign In
              </Button>
            </div>

            <p className="mt-4 text-sm text-[#6b7280]">
              ⊙ No credit card needed · Built for agents, athletes, and team ops
            </p>
          </div>

          <div className="flex items-center justify-center">
            <div className="flex min-h-[260px] w-full max-w-[620px] items-center justify-center rounded-3xl bg-[#F3F4F6] px-6 py-16 shadow-[0_10px_30px_rgba(0,0,0,0.08)] md:min-h-[360px] lg:min-h-[420px]">
              <span className="text-lg font-medium text-[#9ca3af]">Product Screenshot</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
