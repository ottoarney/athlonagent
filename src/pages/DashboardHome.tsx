import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface TaskItem {
  id: string;
  title: string;
  dueLabel: string;
  status: 'todo' | 'done';
}

interface CampaignItem {
  id: string;
  name: string;
  stage: string;
}

interface PipelineItem {
  id: string;
  label: string;
  count: number;
}

interface SportRosterItem {
  sport: string;
  count: number;
}

interface UpcomingItem {
  id: string;
  title: string;
  dueLabel: string;
  owner: string;
}

const navItems = [
  { label: 'Overview', path: '/dashboard' },
  { label: 'Calendar', path: '/calendar' },
  { label: 'Tasks', path: '/tasks' },
  { label: 'Athletes', path: '/athletes' },
  { label: 'Deals', path: '/deals' },
  { label: 'Content', path: '/content' },
  { label: 'Conversations', path: '/conversations' },
  { label: 'Settings', path: '/settings' },
];

export default function DashboardHome() {
  const [searchQuery, setSearchQuery] = useState('');

  // Safe local state only (no auth, API, async loading, or protected-route behavior).
  const athletes: string[] = [];
  const campaigns: CampaignItem[] = [];
  const tasks: TaskItem[] = [];
  const deals: string[] = [];

  const pipelineStatus: PipelineItem[] = useMemo(
    () => [
      { id: 'pitching', label: 'Pitching', count: campaigns?.filter((campaign) => campaign?.stage === 'Pitching')?.length ?? 0 },
      { id: 'active', label: 'Active', count: campaigns?.filter((campaign) => campaign?.stage === 'Active')?.length ?? 0 },
      { id: 'review', label: 'In Review', count: campaigns?.filter((campaign) => campaign?.stage === 'In Review')?.length ?? 0 },
      { id: 'complete', label: 'Complete', count: campaigns?.filter((campaign) => campaign?.stage === 'Complete')?.length ?? 0 },
    ],
    [campaigns],
  );

  const rosterBySport: SportRosterItem[] = useMemo(() => [], []);
  const upcoming14Days: UpcomingItem[] = useMemo(() => [], []);

  const metricCards = [
    { label: 'Athletes under management', value: athletes?.length ?? 0 },
    { label: 'Active campaigns', value: campaigns?.length ?? 0 },
    { label: 'Open tasks', value: tasks?.filter((task) => task?.status !== 'done')?.length ?? 0 },
    { label: 'Deals in pipeline', value: deals?.length ?? 0 },
  ];

  const filteredCampaigns = (campaigns ?? []).filter((campaign) => {
    if (!searchQuery?.trim()) return true;

    const query = searchQuery.toLowerCase();
    return campaign?.name?.toLowerCase()?.includes(query) || campaign?.stage?.toLowerCase()?.includes(query);
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex lg:w-64 border-r border-border bg-card/40 p-4 flex-col gap-4">
          <Link to="/" className="text-xl font-semibold tracking-tight px-2 py-1">Athlon</Link>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block rounded-md px-3 py-2 text-sm ${item.path === '/dashboard' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <section className="mt-3 border-t border-border pt-3">
            <h2 className="px-2 text-xs uppercase tracking-wide text-muted-foreground">Campaigns</h2>
            <div className="mt-2 space-y-1">
              {(filteredCampaigns ?? []).slice(0, 5).map((campaign) => (
                <div key={campaign?.id ?? campaign?.name} className="rounded-md border border-border px-2 py-1.5 text-xs">
                  {campaign?.name ?? 'Unnamed campaign'}
                </div>
              ))}
              {(filteredCampaigns?.length ?? 0) === 0 && (
                <p className="px-2 text-xs text-muted-foreground">No campaigns yet.</p>
              )}
            </div>
          </section>
        </aside>

        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto max-w-7xl space-y-4">
            <header className="rounded-xl border border-border bg-card p-3 md:p-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search dashboard"
                  className="pl-9"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value ?? '')}
                />
              </div>
            </header>

            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
              {metricCards.map((metric) => (
                <div key={metric.label} className="rounded-xl border border-border bg-card p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{metric.label}</p>
                  <p className="mt-1 text-2xl font-semibold">{metric.value}</p>
                </div>
              ))}
            </section>

            <section className="grid grid-cols-1 xl:grid-cols-12 gap-4">
              <div className="xl:col-span-8 space-y-4">
                <article className="rounded-xl border border-border bg-card p-4">
                  <h2 className="font-semibold">My Tasks</h2>
                  <div className="mt-3 space-y-2">
                    {(tasks ?? []).map((task) => (
                      <div key={task?.id ?? task?.title} className="rounded-lg border border-border px-3 py-2 text-sm">
                        <p className="font-medium">{task?.title ?? 'Untitled task'}</p>
                        <p className="text-xs text-muted-foreground">{task?.dueLabel ?? 'No due date'}</p>
                      </div>
                    ))}
                    {(tasks?.length ?? 0) === 0 && <p className="text-sm text-muted-foreground">No tasks assigned.</p>}
                  </div>
                </article>

                <article className="rounded-xl border border-border bg-card p-4">
                  <h2 className="font-semibold">Pipeline status</h2>
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                    {(pipelineStatus ?? []).map((item) => (
                      <div key={item?.id ?? item?.label} className="rounded-lg border border-border px-3 py-2">
                        <p className="text-xs text-muted-foreground">{item?.label ?? 'Unknown'}</p>
                        <p className="text-lg font-semibold">{item?.count ?? 0}</p>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="rounded-xl border border-border bg-card p-4">
                  <h2 className="font-semibold">Roster by sport</h2>
                  <div className="mt-3 space-y-2">
                    {(rosterBySport ?? []).map((entry) => (
                      <div key={entry?.sport} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                        <span>{entry?.sport ?? 'Unknown sport'}</span>
                        <Badge variant="secondary">{entry?.count ?? 0}</Badge>
                      </div>
                    ))}
                    {(rosterBySport?.length ?? 0) === 0 && <p className="text-sm text-muted-foreground">No roster data.</p>}
                  </div>
                </article>
              </div>

              <div className="xl:col-span-4 space-y-4">
                <article className="rounded-xl border border-border bg-card p-4">
                  <h2 className="font-semibold">Next 14 days</h2>
                  <div className="mt-3 space-y-2">
                    {(upcoming14Days ?? []).map((item) => (
                      <div key={item?.id ?? item?.title} className="rounded-lg border border-border px-3 py-2 text-sm">
                        <p className="font-medium">{item?.title ?? 'Untitled'}</p>
                        <p className="text-xs text-muted-foreground">
                          {(item?.owner ?? 'Unknown')} • {(item?.dueLabel ?? 'No due date')}
                        </p>
                      </div>
                    ))}
                    {(upcoming14Days?.length ?? 0) === 0 && <p className="text-sm text-muted-foreground">No upcoming items.</p>}
                  </div>
                </article>

                <article className="rounded-xl border border-border bg-card p-4">
                  <h2 className="font-semibold">Campaigns</h2>
                  <div className="mt-3 space-y-2">
                    {(filteredCampaigns ?? []).map((campaign) => (
                      <div key={campaign?.id ?? campaign?.name} className="rounded-lg border border-border px-3 py-2 text-sm">
                        <p className="font-medium">{campaign?.name ?? 'Unnamed campaign'}</p>
                        <p className="text-xs text-muted-foreground">{campaign?.stage ?? 'No stage'}</p>
                      </div>
                    ))}
                    {(filteredCampaigns?.length ?? 0) === 0 && <p className="text-sm text-muted-foreground">No campaigns to display.</p>}
                  </div>
                </article>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
