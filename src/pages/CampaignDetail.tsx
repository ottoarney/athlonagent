import { Check, Plus, Trash2 } from 'lucide-react';
import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardPageHeader } from '@/components/layout/DashboardPageHeader';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { type SidebarCampaign, useSidebarCampaigns } from '@/hooks/useSidebarCampaigns';
import { supabase } from '@/integrations/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase-env';
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

const CAMPAIGN_DETAIL_STORAGE_KEY = 'athlon.campaign.detail.v1';

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

const readStoredCampaignDetails = (): Record<string, CampaignWorkspaceState> => {
  if (typeof window === 'undefined') return {};
  const raw = window.localStorage.getItem(CAMPAIGN_DETAIL_STORAGE_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const getStoredWorkspace = (campaign: SidebarCampaign): CampaignWorkspaceState => {
  const stored = readStoredCampaignDetails()[campaign.id];
  return stored ?? seedWorkspace(campaign);
};

const persistStoredWorkspace = (campaignId: string, value: CampaignWorkspaceState) => {
  if (typeof window === 'undefined') return;
  const current = readStoredCampaignDetails();
  current[campaignId] = value;
  window.localStorage.setItem(CAMPAIGN_DETAIL_STORAGE_KEY, JSON.stringify(current));
};

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

  const [savedState, setSavedState] = useState<CampaignWorkspaceState>(() => getStoredWorkspace(campaign));
  const [draft, setDraft] = useState<CampaignWorkspaceState>(() => getStoredWorkspace(campaign));
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [error, setError] = useState('');
  const hasChanges = JSON.stringify(savedState) !== JSON.stringify(draft);
  useEffect(() => {
    const nextState = getStoredWorkspace(campaign);
    setSavedState(nextState);
    setDraft(nextState);
    setIsEditing(false);
    setError('');
    setSavedFlash(false);
  }, [campaign]);


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

  const saveChanges = async () => {
    if (saving || !hasChanges) return;
    const nextSaved = { ...draft, deliverables: [...draft.deliverables], timeline: [...draft.timeline], tasks: [...draft.tasks] };
    try {
      setSaving(true);
      setError('');
      if (isSupabaseConfigured && supabase) {
        const { error: supabaseError } = await (supabase as any).from('campaign_details').upsert({
          campaign_id: campaign.id,
          payload: nextSaved,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'campaign_id' });

        if (supabaseError) {
          throw new Error(supabaseError.message || 'Supabase save failed');
        }
      }

      persistStoredWorkspace(campaign.id, nextSaved);
      setSavedState(nextSaved);
      setDraft(nextSaved);
      setCampaigns((current) =>
        current.map((item) =>
          item.id === campaign.id
            ? { ...item, name: draft.name, brand: draft.brand, athlete: draft.athlete, dealValue: dealValueNumber, archived: draft.campaignStatus === 'Archived' }
            : item,
        ),
      );
      setSavedFlash(true);
      setIsEditing(false);
      window.setTimeout(() => setSavedFlash(false), 1600);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save campaign changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const toggleTaskInViewMode = (taskId: string, completed: boolean) => {
    const nextTasks = draft.tasks.map((task) => (task.id === taskId ? { ...task, completed } : task));
    const nextState = { ...draft, tasks: nextTasks };
    setDraft(nextState);
    setSavedState(nextState);
    persistStoredWorkspace(campaign.id, nextState);
    void (async () => {
      if (!isSupabaseConfigured || !supabase) return;
      const { error: supabaseError } = await (supabase as any).from('campaign_details').upsert(
        {
          campaign_id: campaign.id,
          payload: nextState,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'campaign_id' },
      );
      if (supabaseError) {
        setError(supabaseError.message || 'Unable to sync task updates.');
      }
    })();
  };

  return (
    <AppLayout>
      <PageTransition className="flex h-full flex-col">
        <DashboardPageHeader
          title={draft.name}
          subtitle="Track deliverables, deadlines, tasks, and deal progress for this campaign."
          actions={
            <div className="flex items-center gap-2">
              {isEditing && (
                <Button className="border border-border bg-surface text-foreground hover:bg-surface/80" onClick={() => { setDraft(savedState); setIsEditing(false); setError(''); }} disabled={saving}>
                  Cancel
                </Button>
              )}
              <Button
                onClick={() => {
                  if (!isEditing) {
                    setIsEditing(true);
                    return;
                  }
                  if (!hasChanges) {
                    setIsEditing(false);
                    return;
                  }
                  void saveChanges();
                }}
                disabled={saving}
                className={isEditing ? 'bg-[#fbe101] text-black hover:bg-[#fbe101]/90' : 'bg-[#01fb64] text-black hover:bg-[#01fb64]/90'}
              >
                {isEditing ? (saving ? 'Saving…' : 'Save Changes') : 'Edit Campaign'}
              </Button>
            </div>
          }
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
                {isEditing && (
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
                )}
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
                        <td className="px-3 py-2 font-medium">{isEditing ? <input value={item.name} onChange={(e) => setDraft((c) => ({ ...c, deliverables: c.deliverables.map((d) => (d.id === item.id ? { ...d, name: e.target.value } : d)) }))} className="w-full rounded border border-border px-2 py-1" /> : item.name}</td>
                        <td className="px-3 py-2 text-muted-foreground">{isEditing ? <input type="date" value={toDateInput(item.dueDate)} onChange={(e) => setDraft((c) => ({ ...c, deliverables: c.deliverables.map((d) => (d.id === item.id ? { ...d, dueDate: e.target.value } : d)) }))} className="rounded border border-border px-2 py-1" /> : item.dueDate}</td>
                        <td className="px-3 py-2">
                          {isEditing ? (
                            <>
                              <select value={item.platform} onChange={(e) => setDraft((c) => ({ ...c, deliverables: c.deliverables.map((d) => (d.id === item.id ? { ...d, platform: e.target.value } : d)) }))} className="rounded border border-border px-2 py-1">
                                {PLATFORMS.map((platform) => <option key={platform} value={platform}>{platform}</option>)}
                              </select>
                              {item.platform === 'Other' && <input value={item.customPlatform ?? ''} onChange={(e) => setDraft((c) => ({ ...c, deliverables: c.deliverables.map((d) => (d.id === item.id ? { ...d, customPlatform: e.target.value } : d)) }))} placeholder="Custom platform" className="ml-2 rounded border border-border px-2 py-1" />}
                            </>
                          ) : (item.platform === 'Other' ? item.customPlatform || 'Other' : item.platform)}
                        </td>
                        <td className="px-3 py-2">
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <select value={item.status} onChange={(e) => setDraft((c) => ({ ...c, deliverables: c.deliverables.map((d) => (d.id === item.id ? { ...d, status: e.target.value as DeliverableStatus } : d)) }))} className="rounded border border-border px-2 py-1 text-xs">
                                {['Pending', 'In Progress', 'Submitted', 'Approved', 'Posted', 'Completed'].map((status) => <option key={status} value={status}>{status}</option>)}
                              </select>
                              <button onClick={() => setDraft((c) => ({ ...c, deliverables: c.deliverables.filter((d) => d.id !== item.id) }))} className="rounded p-1 text-muted-foreground hover:text-destructive" aria-label="Delete deliverable"><Trash2 className="h-4 w-4" /></button>
                            </div>
                          ) : (
                            <span className={`inline-flex rounded-full px-2 py-1 text-xs ${getDetailBadgeClasses(item.status)}`}>{item.status}</span>
                          )}
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
                {isEditing && <Button variant="outline" size="sm" onClick={() => setDraft((c) => ({ ...c, timeline: [...c.timeline, { id: `t${Date.now()}`, title: 'New item', date: '' }] }))}>
                  <Plus className="mr-1 h-4 w-4" />
                  Add timeline item
                </Button>}
              </div>
              <ul className="mt-3 space-y-2 text-sm">
                {draft.timeline.map((item) => (
                  <li key={item.id} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
                    {isEditing ? <>
                      <input value={item.title} onChange={(e) => setDraft((c) => ({ ...c, timeline: c.timeline.map((t) => (t.id === item.id ? { ...t, title: e.target.value } : t)) }))} className="flex-1 rounded border border-border px-2 py-1 font-medium" />
                      <input type="date" value={toDateInput(item.date)} onChange={(e) => setDraft((c) => ({ ...c, timeline: c.timeline.map((t) => (t.id === item.id ? { ...t, date: e.target.value } : t)) }))} className="rounded border border-border px-2 py-1 text-muted-foreground" />
                      <button onClick={() => setDraft((c) => ({ ...c, timeline: c.timeline.filter((t) => t.id !== item.id) }))} className="rounded p-1 text-muted-foreground hover:text-destructive" aria-label="Delete timeline item"><Trash2 className="h-4 w-4" /></button>
                    </> : <><span className="flex-1 font-medium">{item.title}</span><span className="text-muted-foreground">{item.date}</span></>}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <h2 className="text-base font-semibold">Campaign Details</h2>
              <div className="mt-3 space-y-2 text-sm">
                <Field label="Campaign name">{isEditing ? <input value={draft.name} onChange={(e) => setDraft((c) => ({ ...c, name: e.target.value }))} className="w-full rounded border border-border px-2 py-1 text-right font-medium" /> : <ReadValue value={draft.name} />}</Field>
                <Field label="Brand">{isEditing ? <input value={draft.brand} onChange={(e) => setDraft((c) => ({ ...c, brand: e.target.value }))} className="w-full rounded border border-border px-2 py-1 text-right font-medium" /> : <ReadValue value={draft.brand} />}</Field>
                <Field label="Athlete">{isEditing ? <input value={draft.athlete} onChange={(e) => setDraft((c) => ({ ...c, athlete: e.target.value }))} className="w-full rounded border border-border px-2 py-1 text-right font-medium" /> : <ReadValue value={draft.athlete} />}</Field>
                <Field label="Deal value">{isEditing ? <input value={draft.dealValue} onChange={(e) => setDraft((c) => ({ ...c, dealValue: e.target.value.replace(/[^\d.]/g, '') }))} className="w-full rounded border border-border px-2 py-1 text-right font-medium" /> : <ReadValue value={formatCurrency(dealValueNumber)} />}</Field>
                <Field label="Campaign status">{isEditing ? <select value={draft.campaignStatus} onChange={(e) => setDraft((c) => ({ ...c, campaignStatus: e.target.value as CampaignStatus }))} className="w-full rounded border border-border px-2 py-1 text-right font-medium"><option>Active</option><option>Paused</option><option>Completed</option><option>Archived</option></select> : <StatusBadge value={draft.campaignStatus} />}</Field>
                <Field label="Payment status">{isEditing ? <select value={draft.paymentStatus} onChange={(e) => setDraft((c) => ({ ...c, paymentStatus: e.target.value as PaymentStatus }))} className="w-full rounded border border-border px-2 py-1 text-right font-medium"><option>Pending</option><option>Partial</option><option>Paid</option></select> : <StatusBadge value={draft.paymentStatus} />}</Field>
                <Field label="Contract status">{isEditing ? <select value={draft.contractStatus} onChange={(e) => setDraft((c) => ({ ...c, contractStatus: e.target.value as ContractStatus }))} className="w-full rounded border border-border px-2 py-1 text-right font-medium"><option>Draft</option><option>Sent</option><option>Signed</option></select> : <StatusBadge value={draft.contractStatus} />}</Field>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-semibold">Tasks</h2>
                {isEditing && <Button variant="outline" size="sm" onClick={() => setDraft((c) => ({ ...c, tasks: [...c.tasks, { id: `k${Date.now()}`, name: 'New task', completed: false }] }))}>
                  <Plus className="mr-1 h-4 w-4" />
                  Add task
                </Button>}
              </div>
              <ul className="mt-3 space-y-2 text-sm">
                {draft.tasks.map((task) => (
                  <li key={task.id} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={(e) => {
                        if (isEditing) {
                          setDraft((c) => ({ ...c, tasks: c.tasks.map((t) => (t.id === task.id ? { ...t, completed: e.target.checked } : t)) }));
                          return;
                        }
                        toggleTaskInViewMode(task.id, e.target.checked);
                      }}
                      className="h-4 w-4 rounded border-border"
                    />
                    {isEditing ? <input value={task.name} onChange={(e) => setDraft((c) => ({ ...c, tasks: c.tasks.map((t) => (t.id === task.id ? { ...t, name: e.target.value } : t)) }))} className={`flex-1 rounded border border-border px-2 py-1 ${task.completed ? 'line-through text-muted-foreground' : ''}`} /> : <span className={`flex-1 ${task.completed ? 'line-through text-muted-foreground' : ''}`}>{task.name}</span>}
                    {isEditing && <button onClick={() => setDraft((c) => ({ ...c, tasks: c.tasks.filter((t) => t.id !== task.id) }))} className="rounded p-1 text-muted-foreground hover:text-destructive" aria-label="Delete task"><Trash2 className="h-4 w-4" /></button>}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <h2 className="text-base font-semibold">Notes</h2>
              {isEditing ? (
                <textarea value={draft.notes} onChange={(e) => setDraft((c) => ({ ...c, notes: e.target.value }))} className="mt-3 min-h-28 w-full rounded-lg border border-border bg-surface p-3 text-sm" />
              ) : (
                <div className="mt-3 min-h-28 rounded-lg border border-border bg-surface p-3 text-sm text-muted-foreground">{draft.notes}</div>
              )}
            </div>
          </div>
        </section>
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

function ReadValue({ value }: { value: string }) {
  return <p className="text-right font-medium">{value || '—'}</p>;
}


function getDetailBadgeClasses(value: string) {
  if (value === 'Active') return 'bg-[#01fb64]/20 text-[#111111]';
  if (value === 'Pending' || value === 'Partial') return 'bg-[#fbe101]/20 text-black';
  if (value === 'In Progress') return 'bg-[#0c5dff]/20 text-[#0c5dff]';
  if (value === 'Submitted' || value === 'Approved' || value === 'Completed' || value === 'Posted' || value === 'Paid' || value === 'Signed') return 'bg-[#01fb64]/20 text-[#14532d]';
  return 'bg-surface text-foreground';
}

function StatusBadge({ value }: { value: string }) {
  return <span className={`ml-auto inline-flex rounded-full px-2 py-1 text-xs font-medium ${getDetailBadgeClasses(value)}`}>{value || '—'}</span>;
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
