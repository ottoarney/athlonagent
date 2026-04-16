import { AppLayout } from '@/components/layout/AppLayout';
import { Bell, CalendarDays, CheckSquare, Handshake, Megaphone } from 'lucide-react';
import { getStoredRole } from '@/lib/auth-flow';
import { Navigate } from 'react-router-dom';

const scheduleItems = [
  { title: 'Nike creative review', time: 'Today • 3:30 PM' },
  { title: 'Travel prep call', time: 'Tomorrow • 10:00 AM' },
  { title: 'Media training session', time: 'Friday • 1:00 PM' },
];

const assignedTasks = [
  'Upload revised partnership caption',
  'Confirm arrival time for photo shoot',
  'Review and sign appearance release',
];

const dealStatus = [
  { brand: 'Adidas Spring Campaign', status: 'In approval' },
  { brand: 'Local NIL activation', status: 'Deliverables due' },
  { brand: 'Podcast guest appearance', status: 'Scheduling' },
];

const contentRequests = [
  '2 Instagram story frames requested by 6 PM',
  'Training day recap video draft due Friday',
  'Brand Q&A form pending your review',
];

const notifications = [
  'Your agent updated this week’s campaign plan.',
  'New file shared: adidas-shot-list-v2.pdf',
  'Reminder: sponsorship meeting starts in 45 minutes.',
];

export default function AthleteDashboard() {
  if (getStoredRole() === 'agent') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-[1200px] space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.12em] text-muted-foreground">Athlete portal</p>
            <h1 className="mt-2 text-3xl font-semibold">Your schedule and deliverables in one place.</h1>
            <p className="mt-2 text-muted-foreground">Stay aligned with your agent without CRM complexity.</p>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">This week</p>
            <p className="mt-3 text-3xl font-semibold">6</p>
            <p className="mt-1 text-sm text-muted-foreground">Scheduled events</p>
          </article>
          <article className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">Assigned tasks</p>
            <p className="mt-3 text-3xl font-semibold">3</p>
            <p className="mt-1 text-sm text-muted-foreground">Need action this week</p>
          </article>
          <article className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">Brand deals</p>
            <p className="mt-3 text-3xl font-semibold">2</p>
            <p className="mt-1 text-sm text-muted-foreground">In active workflow</p>
          </article>
          <article className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">Updates</p>
            <p className="mt-3 text-3xl font-semibold">4</p>
            <p className="mt-1 text-sm text-muted-foreground">Unread notifications</p>
          </article>
        </section>

        <div className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-border bg-card p-5">
            <h2 className="flex items-center gap-2 text-lg font-semibold"><CalendarDays className="h-4 w-4" /> Schedule</h2>
            <div className="mt-4 space-y-3">
              {scheduleItems.map((item) => (
                <div key={item.title} className="rounded-xl border border-border bg-surface p-3">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.time}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-border bg-card p-5">
            <h2 className="flex items-center gap-2 text-lg font-semibold"><CheckSquare className="h-4 w-4" /> Assigned tasks</h2>
            <ul className="mt-4 space-y-2">
              {assignedTasks.map((task) => (
                <li key={task} className="rounded-xl border border-border bg-surface px-3 py-2 text-sm">{task}</li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-border bg-card p-5">
            <h2 className="flex items-center gap-2 text-lg font-semibold"><Handshake className="h-4 w-4" /> Deal status</h2>
            <div className="mt-4 space-y-2">
              {dealStatus.map((deal) => (
                <div key={deal.brand} className="flex items-center justify-between rounded-xl border border-border bg-surface px-3 py-2 text-sm">
                  <span>{deal.brand}</span>
                  <span className="text-muted-foreground">{deal.status}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-border bg-card p-5">
            <h2 className="flex items-center gap-2 text-lg font-semibold"><Megaphone className="h-4 w-4" /> Content requests</h2>
            <ul className="mt-4 space-y-2">
              {contentRequests.map((request) => (
                <li key={request} className="rounded-xl border border-border bg-surface px-3 py-2 text-sm">{request}</li>
              ))}
            </ul>
          </article>
        </div>

        <article className="rounded-2xl border border-border bg-card p-5">
          <h2 className="flex items-center gap-2 text-lg font-semibold"><Bell className="h-4 w-4" /> Notifications from your team</h2>
          <ul className="mt-4 space-y-2">
            {notifications.map((note) => (
              <li key={note} className="rounded-xl border border-border bg-surface px-3 py-2 text-sm">{note}</li>
            ))}
          </ul>
        </article>
      </div>
    </AppLayout>
  );
}
