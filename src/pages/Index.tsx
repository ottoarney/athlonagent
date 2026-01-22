import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { TodayAgenda } from '@/components/dashboard/TodayAgenda';
import { DeadlinesCard } from '@/components/dashboard/DeadlinesCard';
import { NotificationsPanel } from '@/components/dashboard/NotificationsPanel';
import { DealsPipeline } from '@/components/dashboard/DealsPipeline';
import { ContentPreview } from '@/components/dashboard/ContentPreview';

const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: 'easeOut' }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Index = () => {
  return (
    <AppLayout showAuthLinks>
      <motion.div 
        className="max-w-[1600px] mx-auto space-y-6"
        initial="initial"
        animate="animate"
        variants={stagger}
      >
        {/* Header */}
        <motion.div variants={fadeIn} className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-display font-semibold tracking-tight">
              Good morning, <span className="italic">Jordan</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your athletes today.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div variants={fadeIn}>
          <StatsOverview />
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Today + Deadlines */}
          <motion.div variants={fadeIn} className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TodayAgenda />
              <DeadlinesCard />
            </div>
            <DealsPipeline />
            <ContentPreview />
          </motion.div>

          {/* Right Column - Notifications */}
          <motion.div variants={fadeIn} className="space-y-6">
            <NotificationsPanel />
            
            {/* Quick Actions Card */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <h3 className="font-semibold text-sm mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  'Add new athlete',
                  'Schedule meeting',
                  'Create task',
                  'Log deal activity'
                ].map((action) => (
                  <button
                    key={action}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-surface hover:text-foreground transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default Index;
