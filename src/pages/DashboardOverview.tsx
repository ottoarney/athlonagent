import { AppLayout } from '@/components/layout/AppLayout';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { TodayAgenda } from '@/components/dashboard/TodayAgenda';
import { DeadlinesCard } from '@/components/dashboard/DeadlinesCard';
import { DealsPipeline } from '@/components/dashboard/DealsPipeline';
import { NotificationsPanel } from '@/components/dashboard/NotificationsPanel';
import { DashboardPageHeader } from '@/components/layout/DashboardPageHeader';
import { PageTransition } from '@/components/layout/PageTransition';

export default function DashboardOverview() {
  return (
    <AppLayout>
      <PageTransition>
        <DashboardPageHeader
          title="Overview"
          subtitle="Monitor athlete operations, campaigns, deliverables, and next actions."
        />

        <StatsOverview />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <div className="space-y-4 xl:col-span-8">
            <TodayAgenda />
            <DealsPipeline />
          </div>
          <div className="space-y-4 xl:col-span-4">
            <DeadlinesCard />
            <NotificationsPanel />
          </div>
        </div>
      </PageTransition>
    </AppLayout>
  );
}
