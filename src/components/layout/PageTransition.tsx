import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
};

export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={pageTransition}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn('mx-auto w-full max-w-[1600px] space-y-6', className)}
    >
      {children}
    </motion.div>
  );
}
