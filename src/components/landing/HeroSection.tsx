import { motion } from 'framer-motion';
import { ArrowRight, BellRing, CalendarClock, Handshake, MessageSquare, Milestone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeroSectionProps {
  onPrimaryCta: () => void;
  onSecondaryCta: () => void;
}

const floatingCards = [
  { icon: Handshake, title: 'Jordan Brand Renewal', meta: '$280k • In review', x: '-12%', y: '10%' },
  { icon: CalendarClock, title: 'Media Day Deadline', meta: 'Due in 18h', x: '58%', y: '-6%' },
  { icon: MessageSquare, title: 'Canvas Thread', meta: '4 new updates', x: '64%', y: '60%' },
  { icon: BellRing, title: 'Obligations Alert', meta: '2 approvals blocked', x: '-4%', y: '70%' },
];

export function HeroSection({ onPrimaryCta, onSecondaryCta }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.35)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.35)_1px,transparent_1px)] bg-[size:72px_72px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--accent)/0.18),transparent_38%),radial-gradient(circle_at_88%_20%,hsl(var(--accent)/0.12),transparent_35%)]" />

      <div className="container relative px-4 md:px-6 py-16 md:py-24 lg:py-28">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
          <div>
            <Badge className="rounded-full border-accent/35 bg-accent/15 text-foreground"><Milestone className="h-3.5 w-3.5 mr-1" /> Athlete Operations System</Badge>
            <h1 className="mt-6 text-5xl md:text-7xl lg:text-8xl leading-[0.9] max-w-3xl">
              The premium control layer for modern sports representation.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Run deals, communication, deliverables, and athlete visibility in one shared operating system built for high-performance teams.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button className="rounded-full px-6 h-12" onClick={onPrimaryCta}>Choose your path <ArrowRight className="h-4 w-4 ml-1" /></Button>
              <Button variant="outline" className="rounded-full px-6 h-12" onClick={onSecondaryCta}>Request demo</Button>
              <Button variant="ghost" className="rounded-full px-6 h-12" onClick={() => window.location.assign('/waitlist')}>Join waitlist</Button>
            </div>
          </div>

          <div className="relative min-h-[420px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative z-20 rounded-3xl border border-border bg-card p-5 shadow-xl"
            >
              <div className="rounded-2xl border border-border bg-surface p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">Athlon Command Canvas</p>
                  <Badge className="bg-accent/25 text-foreground rounded-full">Live</Badge>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  {['Deal Pipeline', 'Roster Health', 'Campaign Calendar', 'Collaboration Notes'].map((item) => (
                    <div key={item} className="rounded-xl border border-border bg-background p-3">
                      <p className="font-medium">{item}</p>
                      <p className="text-xs text-muted-foreground mt-1">Syncing in real time</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {floatingCards.map((item, index) => (
              <motion.div
                key={item.title}
                className="absolute z-10 w-56 rounded-xl border border-border bg-background/95 p-3 shadow-lg"
                style={{ left: item.x, top: item.y }}
                animate={{ y: [0, index % 2 === 0 ? -8 : 10, 0] }}
                transition={{ duration: 6 + index, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="flex items-center gap-2 text-sm font-medium"><item.icon className="h-4 w-4 text-accent" /> {item.title}</div>
                <p className="text-xs text-muted-foreground mt-1">{item.meta}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
