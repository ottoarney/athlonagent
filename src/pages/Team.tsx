import { AppLayout } from '@/components/layout/AppLayout';

export default function Team() {
  return (
    <AppLayout>
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight">Team Directory</h1>
          <p className="text-muted-foreground mt-1">View and manage your internal team members.</p>
        </div>
      </div>
    </AppLayout>
  );
}
