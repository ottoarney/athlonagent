import { AppLayout } from '@/components/layout/AppLayout';
import { useDashboardData, type CampaignStage } from '@/context/dashboard-context';
import { formatCurrency, formatDate, formatTime } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Archive, Plus, Star } from 'lucide-react';

const stageLabels: Record<CampaignStage, string> = {
  pitching: 'Pitching',
  active: 'Active',
  'in-review': 'In Review',
  complete: 'Complete',
};

export default function DashboardHome() {
  const {
    filteredAthletes,
    filteredCampaigns,
    filteredTasks,
    kpis,
    openModal,
    toggleTaskComplete,
    updateCampaignStage,
    toggleCampaignArchive,
    toggleCampaignStar,
    upcoming14Days,
    eventsNextWeek,
  } = useDashboardData();

  const stageSpread: CampaignStage[] = ['pitching', 'active', 'in-review', 'complete'];

  const myTasks = filteredTasks.slice().sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  const notifications = [
    '2 deals need follow-up before Friday.',
    '1 payment milestone posted for Nike campaign.',
    'Deliverables due this week: 3.',
  ];

  const sportBreakdown = filteredAthletes.reduce<Record<string, number>>((acc, athlete) => {
    acc[athlete.sport] = (acc[athlete.sport] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <AppLayout showAuthLinks>
      <div className="max-w-[1600px] mx-auto space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-display font-semibold tracking-tight">Mission Control</h1>
            <p className="text-muted-foreground mt-1">Compact command center for roster, campaigns, and tasks.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => openModal('athlete')}>Add athlete</Button>
            <Button onClick={() => openModal('campaign')}>New campaign</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            ['Athletes under management', kpis.athletesUnderManagement],
            ['Active campaign value', kpis.activeCampaignValue],
            ['Athlete earnings YTD', kpis.athleteEarningsYtd],
            ['Pipeline value', kpis.pipelineValue],
          ].map(([label, value]) => (
            <div key={String(label)} className="p-4 rounded-xl border border-border bg-card">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
              <p className="text-2xl font-semibold mt-1">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          <div className="xl:col-span-8 space-y-4">
            <section className="p-4 rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold">Campaign pipeline spread</h2>
                <Button size="sm" variant="outline" onClick={() => openModal('campaign')}>Add campaign</Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                {stageSpread.map((stage) => {
                  const stageCampaigns = filteredCampaigns.filter((campaign) => campaign.stage === stage && !campaign.archived);
                  const stageValue = stageCampaigns.reduce((sum, campaign) => sum + campaign.value, 0);
                  return (
                    <div key={stage} className="rounded-lg border border-border bg-surface px-3 py-2">
                      <p className="text-xs text-muted-foreground">{stageLabels[stage]}</p>
                      <p className="font-semibold">{stageCampaigns.length}</p>
                      <p className="text-xs text-muted-foreground">{formatCurrency(stageValue)}</p>
                    </div>
                  );
                })}
              </div>
              <div className="space-y-2 max-h-[320px] overflow-auto pr-1">
                {filteredCampaigns.filter((campaign) => !campaign.archived).map((campaign) => {
                  const athlete = filteredAthletes.find((entry) => entry.id === campaign.athleteId);
                  return (
                    <div key={campaign.id} className="rounded-lg border border-border p-3 flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{campaign.brand}</p>
                        <p className="text-sm text-muted-foreground">{athlete?.name ?? 'Unknown athlete'} • {formatCurrency(campaign.value)}</p>
                      </div>
                      <Select value={campaign.stage} onValueChange={(value) => updateCampaignStage(campaign.id, value as CampaignStage)}>
                        <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {stageSpread.map((stage) => (<SelectItem key={stage} value={stage}>{stageLabels[stage]}</SelectItem>))}
                        </SelectContent>
                      </Select>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" onClick={() => toggleCampaignStar(campaign.id)} aria-label="Toggle star">
                          <Star className={`h-4 w-4 ${campaign.starred ? 'fill-current text-primary' : 'text-muted-foreground'}`} />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => toggleCampaignArchive(campaign.id)} aria-label="Archive campaign">
                          <Archive className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-border bg-card">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold">My Tasks</h2>
                  <Button size="sm" variant="outline" onClick={() => openModal('task')}>
                    <Plus className="h-3.5 w-3.5 mr-1" />Add task
                  </Button>
                </div>
                <div className="space-y-2 max-h-[240px] overflow-auto pr-1">
                  {myTasks.map((task) => (
                    <div key={task.id} className="flex items-start gap-2 rounded-lg border border-border px-3 py-2">
                      <Checkbox checked={task.status === 'done'} onCheckedChange={() => toggleTaskComplete(task.id)} className="mt-1" />
                      <div className="min-w-0">
                        <p className={`text-sm font-medium ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>{task.title}</p>
                        <p className="text-xs text-muted-foreground">Due {formatDate(task.dueDate)}</p>
                      </div>
                    </div>
                  ))}
                  {myTasks.length === 0 && <p className="text-sm text-muted-foreground">No tasks found.</p>}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border bg-card">
                <h2 className="font-semibold mb-3">Roster breakdown by sport</h2>
                <div className="space-y-2">
                  {Object.entries(sportBreakdown).map(([sport, count]) => (
                    <div key={sport} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                      <span>{sport}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <div className="xl:col-span-4 space-y-4">
            <section className="p-4 rounded-xl border border-border bg-card">
              <h2 className="font-semibold mb-3">Schedule</h2>
              <div className="space-y-2">
                {eventsNextWeek.slice(0, 4).map((event) => (
                  <div key={event.id} className="rounded-lg border border-border px-3 py-2">
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(event.startDate)} • {formatTime(event.startDate)}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="p-4 rounded-xl border border-border bg-card">
              <h2 className="font-semibold mb-3">Next 14 days</h2>
              <div className="space-y-2 max-h-[220px] overflow-auto pr-1">
                {upcoming14Days.map((entry) => (
                  <div key={entry.id} className="rounded-lg border border-border px-3 py-2">
                    <p className="text-sm font-medium">{entry.title}</p>
                    <p className="text-xs text-muted-foreground">{entry.campaignOrAthlete} • {formatDate(entry.dueDate)}</p>
                  </div>
                ))}
                {upcoming14Days.length === 0 && <p className="text-sm text-muted-foreground">No upcoming deliverables.</p>}
              </div>
            </section>

            <section className="p-4 rounded-xl border border-border bg-card">
              <h2 className="font-semibold mb-3">Notifications</h2>
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div key={notification} className="text-sm rounded-lg border border-border px-3 py-2">{notification}</div>
                ))}
              </div>
            </section>

            <section className="p-4 rounded-xl border border-border bg-card">
              <h2 className="font-semibold mb-3">Quick actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => openModal('athlete')}>Add athlete</Button>
                <Button variant="outline" onClick={() => openModal('campaign')}>Add campaign</Button>
                <Button variant="outline" onClick={() => openModal('task')}>Create task</Button>
                <Button variant="outline" onClick={() => openModal('campaign')}>Log deal activity</Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
