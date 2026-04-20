import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onPrimaryCta: () => void;
  onSecondaryCta: () => void;
}

export function HeroSection({ onPrimaryCta, onSecondaryCta }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden border-b border-[#f3f4f6] bg-[#ffffff]">
      <div className="container relative px-4 py-[120px] md:px-6">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <p className="inline-flex items-center rounded-full border border-[#e5e7eb] bg-[#ffffff] px-4 py-1.5 text-sm text-[#374151] shadow-sm">
            <span className="mr-2 text-sm leading-none" aria-hidden="true">🏆</span>
            Athlon Agent • AI-powered sports operations platform
          </p>

          <h1 className="mx-auto mt-7 max-w-3xl text-balance text-[clamp(2rem,6vw,4.3rem)] font-bold leading-[1.05] tracking-tight text-[#0f0f0f]">
            Outmanage the competition with the CRM built for <span className="text-[#16a34a]">sports agents</span>.
          </h1>

          <p className="mx-auto mt-6 max-w-[540px] text-lg leading-[1.7] text-[#6b7280] md:text-xl">
            Manage athletes, deals, deadlines, content, and communication in one place — with a streamlined athlete view that keeps everyone aligned.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              className="h-12 rounded-[9999px] bg-[#01FB64] px-7 text-black transition-all duration-200 ease-in-out hover:scale-[1.02] hover:bg-[#01FB64] active:bg-[#01FB64] focus-visible:bg-[#01FB64] focus-visible:ring-[#01FB64]"
              onClick={onPrimaryCta}
            >
              Get Started
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-12 rounded-[9999px] px-7 transition-all duration-200 ease-in-out hover:scale-[1.02]"
              onClick={onSecondaryCta}
            >
              Sign In
            </Button>
          </div>

          <p className="mt-4 inline-flex items-center gap-2 text-[0.85rem] text-[#6b7280]">
            <CheckCircle2 className="h-4 w-4 text-[#166534]" />
            <span>No credit card needed</span>
            <span aria-hidden="true" className="text-[#9ca3af]">•</span>
            <span>Built for agents, athletes, and team ops</span>
          </p>
        </div>

        <div className="relative mx-auto mt-14 max-w-[900px] lg:mt-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="mx-2 overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.04)] [transform:perspective(1200px)_rotateX(4deg)]"
          >
            <div className="flex min-h-[420px] items-center justify-center bg-[#f3f4f6] px-6 py-12 text-lg font-medium text-[#9ca3af]">
              Product Screenshot
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
