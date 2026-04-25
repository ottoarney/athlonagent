import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { TodayAgenda } from '@/components/dashboard/TodayAgenda';
import { DeadlinesCard } from '@/components/dashboard/DeadlinesCard';
import { DealsPipeline } from '@/components/dashboard/DealsPipeline';
import { NotificationsPanel } from '@/components/dashboard/NotificationsPanel';

const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

export default function DashboardOverview() {
  return (
    <AppLayout>
      <motion.div className="max-w-[1600px] mx-auto space-y-6" initial="initial" animate="animate">
        <motion.div variants={fadeIn}>
          <h1 className="text-2xl font-display font-semibold tracking-tight">Overview</h1>
          <p className="text-muted-foreground mt-1">
            Monitor athlete operations, campaigns, deliverables, and next actions.
          </p>
        </motion.div>

        <motion.div variants={fadeIn}>
          <StatsOverview />
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          <motion.div variants={fadeIn} className="xl:col-span-8 space-y-4">
            <TodayAgenda />
            <DealsPipeline />
          </motion.div>
          <motion.div variants={fadeIn} className="xl:col-span-4 space-y-4">
            <DeadlinesCard />
            <NotificationsPanel />
          </motion.div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
