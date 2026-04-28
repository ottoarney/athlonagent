import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardPageHeader } from '@/components/layout/DashboardPageHeader';
import { PageTransition } from '@/components/layout/PageTransition';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSidebarCampaigns } from '@/hooks/useSidebarCampaigns';
import { formatCurrency } from '@/lib/data';

const DELIVERABLES = [
  { name: 'IG Reel', dueDate: 'May 12, 2026', platform: 'Instagram', status: 'In Progress' },
  { name: 'TikTok Post', dueDate: 'May 16, 2026', platform: 'TikTok', status: 'Pending' },
  { name: 'Story Set', dueDate: 'May 18, 2026', platform: 'Instagram', status: 'Submitted' },
] as const;

const TIMELINE = [
  { label: 'Kickoff', date: 'May 2, 2026' },
  { label: 'Content due date', date: 'May 12, 2026' },
  { label: 'Approval deadline', date: 'May 15, 2026' },
  { label: 'Posting date', date: 'May 20, 2026' },
] as const;

const TASKS = ['Send creative brief', 'Confirm posting schedule', 'Upload proof of post', 'Send invoice'] as const;

export default function CampaignDetail() {
  const { campaignId = '' } = useParams();
  const navigate = useNavigate();
  const { campaigns } = useSidebarCampaigns();

  const campaign = useMemo(() => campaigns.find((item) => item.id === campaignId), [campaignId, campaigns]);

  if (!campaign) {
    return (
      <AppLayout>
        <PageTransition className="flex h-full flex-col justify-center">
          <div className="mx-auto max-w-lg rounded-xl border border-border bg-card p-8 text-center">
            <h1 className="text-2xl font-display font-semibold">Campaign not found</h1>
            <p className="mt-2 text-sm text-muted-foreground">This campaign may have been removed or moved.</p>
            <Button className="mt-6" onClick={() => navigate('/dashboard/campaigns')}>
              Back to Campaigns overview
            </Button>
          </div>
        </PageTransition>
      </AppLayout>
    );
  }

  const status = campaign.archived ? 'Archived' : 'Active';
  const dealValue = campaign.dealValue ?? 0;

  return (
    <AppLayout>
      <PageTransition className="flex h-full flex-col">
        <DashboardPageHeader
          title={campaign.name}
          subtitle="Track deliverables, deadlines, tasks, and deal progress for this campaign."
          actions={
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="rounded-full border-primary/20 bg-primary/10 px-3 py-1 text-primary">
                {status}
              </Badge>
              <Button variant="outline">Edit Campaign</Button>
            </div>
          }
        />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Deal Value" value={formatCurrency(dealValue)} />
          <MetricCard label="Deliverables" value={String(DELIVERABLES.length)} />
          <MetricCard label="Days Remaining" value="22" />
          <MetricCard label="Campaign Status" value={status} accent />
        </section>

        <section className="grid gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2 space-y-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <h2 className="text-base font-semibold">Deliverables Tracker</h2>
              <div className="mt-3 overflow-hidden rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2">Deliverable</th>
                      <th className="px-3 py-2">Due Date</th>
                      <th className="px-3 py-2">Platform</th>
                      <th className="px-3 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DELIVERABLES.map((item) => (
                      <tr key={item.name} className="border-t border-border">
                        <td className="px-3 py-2 font-medium">{item.name}</td>
                        <td className="px-3 py-2 text-muted-foreground">{item.dueDate}</td>
                        <td className="px-3 py-2">{item.platform}</td>
                        <td className="px-3 py-2">
                          <Badge variant="outline" className="text-xs">
                            {item.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <h2 className="text-base font-semibold">Timeline</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {TIMELINE.map((item) => (
                  <li key={item.label} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                    <span className="font-medium">{item.label}</span>
                    <span className="text-muted-foreground">{item.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <h2 className="text-base font-semibold">Campaign Details</h2>
              <dl className="mt-3 space-y-2 text-sm">
                <DetailRow label="Brand" value={campaign.brand ?? campaign.name} />
                <DetailRow label="Athlete" value={campaign.athlete ?? 'Unassigned athlete'} />
                <DetailRow label="Deal value" value={formatCurrency(dealValue)} />
                <DetailRow label="Payment status" value="Pending" />
                <DetailRow label="Contract status" value="Sent" />
              </dl>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <h2 className="text-base font-semibold">Tasks</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {TASKS.map((task) => (
                  <li key={task} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
                    <input type="checkbox" className="h-4 w-4 rounded border-border" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <h2 className="text-base font-semibold">Notes</h2>
              <div className="mt-3 rounded-lg border border-border bg-surface p-3 text-sm text-muted-foreground">
                Brand requested content by Friday.
              </div>
            </div>
          </div>
        </section>
      </PageTransition>
    </AppLayout>
  );
}

function MetricCard({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={accent ? 'mt-2 text-2xl font-semibold text-primary' : 'mt-2 text-2xl font-semibold'}>{value}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-right">{value}</dd>
    </div>
  );
}
