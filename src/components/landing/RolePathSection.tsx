import { motion } from 'framer-motion';
import { ArrowUpRight, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { rolePaths } from './types';

interface RolePathSectionProps {
  onSelectSignup: (path: string) => void;
  onSelectLogin: (path: string) => void;
}

export function RolePathSection({ onSelectSignup, onSelectLogin }: RolePathSectionProps) {
  return (
    <section id="pathways" className="container px-4 md:px-6 py-14 md:py-20">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Choose your path</p>
          <h2 className="text-3xl md:text-5xl mt-3">Tailored access from the first click.</h2>
        </div>
        <div className="text-sm text-muted-foreground">Also available: <a className="underline" href="/demo">Request demo</a> • <a className="underline" href="/waitlist">Join waitlist</a></div>
      </div>

      <div className="mt-8 grid lg:grid-cols-2 gap-4">
        {rolePaths.map((path, index) => (
          <motion.div
            key={path.role}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            className="group rounded-3xl border border-border bg-card p-6 hover:border-accent/60 transition-all"
          >
            <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">{path.role}</p>
            <h3 className="text-2xl mt-2">{path.title}</h3>
            <p className="mt-3 text-muted-foreground">{path.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button className="rounded-full" onClick={() => onSelectSignup(path.signupPath)}>
                Get started <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
              <Button variant="outline" className="rounded-full" onClick={() => onSelectLogin(path.loginPath)}>
                <LogIn className="h-4 w-4 mr-1" /> Sign in
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
