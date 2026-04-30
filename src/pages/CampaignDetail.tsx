import { Check, Plus, Trash2 } from 'lucide-react';
import { type ReactNode, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardPageHeader } from '@/components/layout/DashboardPageHeader';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { type SidebarCampaign, useSidebarCampaigns } from '@/hooks/useSidebarCampaigns';
import { formatCurrency } from '@/lib/data';

type DeliverableStatus = 'Pending' | 'In Progress' | 'Submitted' | 'Approved' | 'Posted' | 'Completed';
type PaymentStatus = 'Pending' | 'Partial' | 'Paid';
type ContractStatus = 'Draft' | 'Sent' | 'Signed';
type CampaignStatus = 'Active' | 'Paused' | 'Completed' | 'Archived';

type Deliverable = { id: string; name: string; dueDate: string; platform: string; status: DeliverableStatus; customPlatform?: string };
type TimelineItem = { id: string; title: string; date: string };
type TaskItem = { id: string; name: string; completed: boolean };

interface CampaignWorkspaceState {
  name: string;
  brand: string;
  athlete: string;
  dealValue: string;
  campaignStatus: CampaignStatus;
  paymentStatus: PaymentStatus;
  contractStatus: ContractStatus;
  notes: string;
  deliverables: Deliverable[];
  timeline: TimelineItem[];
  tasks: TaskItem[];
}

const PLATFORMS = ['Instagram', 'TikTok', 'YouTube', 'YouTube Shorts', 'X / Twitter', 'LinkedIn', 'Snapchat', 'Facebook', 'Twitch', 'Podcast', 'Website / Blog', 'In-person appearance', 'Other'] as const;

const toDateInput = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toISOString().slice(0, 10);
};

const seedWorkspace = (campaign: SidebarCampaign): CampaignWorkspaceState => ({
  name: campaign.name,
  brand: campaign.brand ?? campaign.name,
  athlete: campaign.athlete ?? '',
  dealValue: String(campaign.dealValue ?? 0),
  campaignStatus: campaign.archived ? 'Archived' : 'Active',
  paymentStatus: 'Pending',
  contractStatus: 'Sent',
  notes: 'Brand requested content by Friday.',
  deliverables: [
    { id: 'd1', name: 'IG Reel', dueDate: '2026-05-12', platform: 'Instagram', status: 'In Progress' },
    { id: 'd2', name: 'TikTok Post', dueDate: '2026-05-16', platform: 'TikTok', status: 'Pending' },
    { id: 'd3', name: 'Story Set', dueDate: '2026-05-18', platform: 'Instagram', status: 'Submitted' },
  ],
  timeline: [
    { id: 't1', title: 'Kickoff', date: '2026-05-02' },
    { id: 't2', title: 'Content due date', date: '2026-05-12' },
    { id: 't3', title: 'Approval deadline', date: '2026-05-15' },
    { id: 't4', title: 'Posting date', date: '2026-05-20' },
  ],
  tasks: [
    { id: 'k1', name: 'Send creative brief', completed: false },
    { id: 'k2', name: 'Confirm posting schedule', completed: false },
    { id: 'k3', name: 'Upload proof of post', completed: false },
    { id: 'k4', name: 'Send invoice', completed: false },
  ],
});

export default function CampaignDetail() {
  const { campaignId = '' } = useParams();
  const navigate = useNavigate();
  const { campaigns, setCampaigns } = useSidebarCampaigns();

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

  const [savedState, setSavedState] = useState<CampaignWorkspaceState>(() => seedWorkspace(campaign));
  const [draft, setDraft] = useState<CampaignWorkspaceState>(() => seedWorkspace(campaign));
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [error, setError] = useState('');
  const hasChanges = JSON.stringify(savedState) !== JSON.stringify(draft);

  const nearestDueDate = useMemo(() => {
    const now = new Date();
    const upcoming = draft.deliverables
      .map((d) => new Date(d.dueDate))
      .filter((d) => !Number.isNaN(d.getTime()) && d >= now)
      .sort((a, b) => a.getTime() - b.getTime());
    return upcoming[0] ?? null;
  }, [draft.deliverables]);
  const daysRemaining = nearestDueDate ? Math.ceil((nearestDueDate.getTime() - Date.now()) / 86400000) : 0;
  const dealValueNumber = Number(draft.dealValue.replace(/[^\d.-]/g, '')) || 0;

  const saveChanges = () => {
    if (saving || !hasChanges) return;
    try {
      setSaving(true);
      setError('');
      setSavedState(draft);
      setCampaigns((current) =>
        current.map((item) =>
          item.id === campaign.id
            ? { ...item, name: draft.name, brand: draft.brand, athlete: draft.athlete, dealValue: dealValueNumber, archived: draft.campaignStatus === 'Archived' }
            : item,
        ),
      );
      setSavedFlash(true);
      window.setTimeout(() => setSavedFlash(false), 1600);
    } catch {
      setError('Unable to save campaign changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <PageTransition className="flex h-full flex-col">
        <DashboardPageHeader
          title={draft.name}
          subtitle="Track deliverables, deadlines, tasks, and deal progress for this campaign."
        />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Deal Value" value={formatCurrency(dealValueNumber)} />
          <MetricCard label="Deliverables" value={String(draft.deliverables.length)} />
          <MetricCard label="Days Remaining" value={String(daysRemaining)} />
          <MetricCard label="Campaign Status" value={draft.campaignStatus} accent />
        </section>

        <section className="grid gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2 space-y-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-semibold">Deliverables Tracker</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      deliverables: [...current.deliverables, { id: `d${Date.now()}`, name: 'New deliverable', dueDate: '', platform: 'Instagram', status: 'Pending' }],
                    }))
                  }
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add deliverable
                </Button>
              </div>
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
                    {draft.deliverables.map((item) => (
                      <tr key={item.id} className="border-t border-border">
                        <td className="px-3 py-2 font-medium"><input value={item.name} onChange={(e) => setDraft((c) => ({ ...c, deliverables: c.deliverables.map((d) => (d.id === item.id ? { ...d, name: e.target.value } : d)) }))} className="w-full rounded border border-border px-2 py-1" /></td>
                        <td className="px-3 py-2 text-muted-foreground"><input type="date" value={toDateInput(item.dueDate)} onChange={(e) => setDraft((c) => ({ ...c, deliverables: c.deliverables.map((d) => (d.id === item.id ? { ...d, dueDate: e.target.value } : d)) }))} className="rounded border border-border px-2 py-1" /></td>
                        <td className="px-3 py-2">
                          <select value={item.platform} onChange={(e) => setDraft((c) => ({ ...c, deliverables: c.deliverables.map((d) => (d.id === item.id ? { ...d, platform: e.target.value } : d)) }))} className="rounded border border-border px-2 py-1">
                            {PLATFORMS.map((platform) => <option key={platform} value={platform}>{platform}</option>)}
                          </select>
                          {item.platform === 'Other' && <input value={item.customPlatform ?? ''} onChange={(e) => setDraft((c) => ({ ...c, deliverables: c.deliverables.map((d) => (d.id === item.id ? { ...d, customPlatform: e.target.value } : d)) }))} placeholder="Custom platform" className="ml-2 rounded border border-border px-2 py-1" />}
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <select value={item.status} onChange={(e) => setDraft((c) => ({ ...c, deliverables: c.deliverables.map((d) => (d.id === item.id ? { ...d, status: e.target.value as DeliverableStatus } : d)) }))} className="rounded border border-border px-2 py-1 text-xs">
                              {['Pending', 'In Progress', 'Submitted', 'Approved', 'Posted', 'Completed'].map((status) => <option key={status} value={status}>{status}</option>)}
                            </select>
                            <button onClick={() => setDraft((c) => ({ ...c, deliverables: c.deliverables.filter((d) => d.id !== item.id) }))} className="rounded p-1 text-muted-foreground hover:text-destructive" aria-label="Delete deliverable"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-semibold">Timeline</h2>
                <Button variant="outline" size="sm" onClick={() => setDraft((c) => ({ ...c, timeline: [...c.timeline, { id: `t${Date.now()}`, title: 'New item', date: '' }] }))}>
                  <Plus className="mr-1 h-4 w-4" />
                  Add timeline item
                </Button>
              </div>
              <ul className="mt-3 space-y-2 text-sm">
                {draft.timeline.map((item) => (
                  <li key={item.id} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
                    <input value={item.title} onChange={(e) => setDraft((c) => ({ ...c, timeline: c.timeline.map((t) => (t.id === item.id ? { ...t, title: e.target.value } : t)) }))} className="flex-1 rounded border border-border px-2 py-1 font-medium" />
                    <input type="date" value={toDateInput(item.date)} onChange={(e) => setDraft((c) => ({ ...c, timeline: c.timeline.map((t) => (t.id === item.id ? { ...t, date: e.target.value } : t)) }))} className="rounded border border-border px-2 py-1 text-muted-foreground" />
                    <button onClick={() => setDraft((c) => ({ ...c, timeline: c.timeline.filter((t) => t.id !== item.id) }))} className="rounded p-1 text-muted-foreground hover:text-destructive" aria-label="Delete timeline item"><Trash2 className="h-4 w-4" /></button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <h2 className="text-base font-semibold">Campaign Details</h2>
              <div className="mt-3 space-y-2 text-sm">
                <Field label="Campaign name"><input value={draft.name} onChange={(e) => setDraft((c) => ({ ...c, name: e.target.value }))} className="w-full rounded border border-border px-2 py-1 text-right font-medium" /></Field>
                <Field label="Brand"><input value={draft.brand} onChange={(e) => setDraft((c) => ({ ...c, brand: e.target.value }))} className="w-full rounded border border-border px-2 py-1 text-right font-medium" /></Field>
                <Field label="Athlete"><input value={draft.athlete} onChange={(e) => setDraft((c) => ({ ...c, athlete: e.target.value }))} className="w-full rounded border border-border px-2 py-1 text-right font-medium" /></Field>
                <Field label="Deal value"><input value={draft.dealValue} onChange={(e) => setDraft((c) => ({ ...c, dealValue: e.target.value.replace(/[^\d.]/g, '') }))} className="w-full rounded border border-border px-2 py-1 text-right font-medium" /></Field>
                <Field label="Campaign status"><select value={draft.campaignStatus} onChange={(e) => setDraft((c) => ({ ...c, campaignStatus: e.target.value as CampaignStatus }))} className="w-full rounded border border-border px-2 py-1 text-right font-medium"><option>Active</option><option>Paused</option><option>Completed</option><option>Archived</option></select></Field>
                <Field label="Payment status"><select value={draft.paymentStatus} onChange={(e) => setDraft((c) => ({ ...c, paymentStatus: e.target.value as PaymentStatus }))} className="w-full rounded border border-border px-2 py-1 text-right font-medium"><option>Pending</option><option>Partial</option><option>Paid</option></select></Field>
                <Field label="Contract status"><select value={draft.contractStatus} onChange={(e) => setDraft((c) => ({ ...c, contractStatus: e.target.value as ContractStatus }))} className="w-full rounded border border-border px-2 py-1 text-right font-medium"><option>Draft</option><option>Sent</option><option>Signed</option></select></Field>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-semibold">Tasks</h2>
                <Button variant="outline" size="sm" onClick={() => setDraft((c) => ({ ...c, tasks: [...c.tasks, { id: `k${Date.now()}`, name: 'New task', completed: false }] }))}>
                  <Plus className="mr-1 h-4 w-4" />
                  Add task
                </Button>
              </div>
              <ul className="mt-3 space-y-2 text-sm">
                {draft.tasks.map((task) => (
                  <li key={task.id} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
                    <input type="checkbox" checked={task.completed} onChange={(e) => setDraft((c) => ({ ...c, tasks: c.tasks.map((t) => (t.id === task.id ? { ...t, completed: e.target.checked } : t)) }))} className="h-4 w-4 rounded border-border" />
                    <input value={task.name} onChange={(e) => setDraft((c) => ({ ...c, tasks: c.tasks.map((t) => (t.id === task.id ? { ...t, name: e.target.value } : t)) }))} className={`flex-1 rounded border border-border px-2 py-1 ${task.completed ? 'line-through text-muted-foreground' : ''}`} />
                    <button onClick={() => setDraft((c) => ({ ...c, tasks: c.tasks.filter((t) => t.id !== task.id) }))} className="rounded p-1 text-muted-foreground hover:text-destructive" aria-label="Delete task"><Trash2 className="h-4 w-4" /></button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <h2 className="text-base font-semibold">Notes</h2>
              <textarea value={draft.notes} onChange={(e) => setDraft((c) => ({ ...c, notes: e.target.value }))} onBlur={saveChanges} className="mt-3 min-h-28 w-full rounded-lg border border-border bg-surface p-3 text-sm" />
            </div>
          </div>
        </section>
        {hasChanges && (
          <div className="sticky bottom-4 mt-4 flex items-center justify-end gap-2 rounded-xl border border-border bg-card/95 p-3 shadow-sm backdrop-blur">
            <Button variant="outline" onClick={() => setDraft(savedState)} disabled={saving}>Cancel</Button>
            <Button onClick={saveChanges} disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</Button>
          </div>
        )}
        {savedFlash && (
          <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs text-foreground">
            <Check className="h-3.5 w-3.5" />
            Saved
          </div>
        )}
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
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

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2">
      <p className="text-muted-foreground">{label}</p>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
