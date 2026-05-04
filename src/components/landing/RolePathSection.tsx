import { motion } from 'framer-motion';
import { ArrowUpRight, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { rolePaths } from './types';

interface RolePathSectionProps {
  onSelectSignup: () => void;
  onSelectLogin: () => void;
  onSeePlatform: () => void;
  onJoinNow: () => void;
}

export function RolePathSection({ onSelectSignup, onSelectLogin, onSeePlatform, onJoinNow }: RolePathSectionProps) {
  return (
    <section id="pathways" className="container px-4 md:px-6 py-14 md:py-20">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Agency onboarding</p>
          <h2 className="text-3xl md:text-5xl mt-3">Tailored for agent and agency teams from day one.</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-full" onClick={onSeePlatform}>See Platform</Button>
          <Button className="rounded-full" onClick={onJoinNow}>Join Now</Button>
        </div>
      </div>

      <div className="mt-8 grid gap-4">
        {rolePaths.map((path) => (
          <motion.div
            key={path.role}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group rounded-3xl border border-border bg-card p-6 hover:border-accent/60 transition-all"
          >
            <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">{path.role}</p>
            <h3 className="text-2xl mt-2">{path.title}</h3>
            <p className="mt-3 text-muted-foreground">{path.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button className="rounded-full" onClick={onSelectSignup}>
                Get started <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
              <Button variant="outline" className="rounded-full" onClick={onSelectLogin}>
                <LogIn className="h-4 w-4 mr-1" /> Sign in
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
