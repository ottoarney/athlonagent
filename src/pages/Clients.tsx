import { ReactNode, useMemo, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type ClientTier = 'Flagship' | 'Regional' | 'Mid-market' | 'National' | 'Niche';
type ClientStatus = 'active' | 'pitching' | 'dormant';

interface Client {
  id: string;
  name: string;
  category: string;
  location: string;
  tier: ClientTier;
  status: ClientStatus;
  campaigns: number;
  activeCampaigns: number;
  ltv: string;
  contacts: string[];
}

interface ClientFormState {
  name: string;
  category: string;
  location: string;
  tier: ClientTier;
  status: ClientStatus;
  campaigns: string;
  activeCampaigns: string;
  ltv: string;
  contacts: string;
}

const tierFilters: Array<'All tiers' | ClientTier> = ['All tiers', 'Flagship', 'Regional', 'Mid-market', 'National', 'Niche'];
const statusFilters: Array<'All' | 'Active' | 'Pitching' | 'Dormant'> = ['All', 'Active', 'Pitching', 'Dormant'];

const initialClients: Client[] = [
  {
    id: 'nike',
    name: 'Nike',
    category: 'Athletic apparel',
    location: 'Beaverton, OR',
    tier: 'Flagship',
    status: 'active',
    campaigns: 1,
    activeCampaigns: 1,
    ltv: '$985k',
    contacts: ['Sloane', 'Harper', 'Liang'],
  },
  {
    id: 'dutch-bros',
    name: 'Dutch Bros',
    category: 'Coffee & beverage',
    location: 'Grants Pass, OR',
    tier: 'Regional',
    status: 'active',
    campaigns: 1,
    activeCampaigns: 1,
    ltv: '$168k',
    contacts: ['Rafael', 'Marco', 'Delaney'],
  },
  {
    id: 'moda-health',
    name: 'Moda Health',
    category: 'Healthcare',
    location: 'Portland, OR',
    tier: 'Mid-market',
    status: 'active',
    campaigns: 1,
    activeCampaigns: 1,
    ltv: '$142k',
    contacts: ['Sloane', 'Yuki', 'Tanaka'],
  },
  {
    id: 'columbia-sportswear',
    name: 'Columbia Sportswear',
    category: 'Outdoor apparel',
    location: 'Portland, OR',
    tier: 'Mid-market',
    status: 'pitching',
    campaigns: 1,
    activeCampaigns: 1,
    ltv: '$0',
    contacts: ['Jack', 'Reese', 'Abernathy'],
  },
  {
    id: 'ruffles',
    name: 'Ruffles',
    category: 'CPG / snacks',
    location: 'Plano, TX',
    tier: 'National',
    status: 'pitching',
    campaigns: 1,
    activeCampaigns: 1,
    ltv: '$0',
    contacts: ['Rafael', 'Jordan', 'Blake'],
  },
  {
    id: 'tillamook',
    name: 'Tillamook',
    category: 'Food & dairy',
    location: 'Tillamook, OR',
    tier: 'Regional',
    status: 'dormant',
    campaigns: 1,
    activeCampaigns: 0,
    ltv: '$38k',
    contacts: ['Rafael', 'Sage', 'Holloway'],
  },
  {
    id: 'leatherman',
    name: 'Leatherman',
    category: 'Outdoor tools',
    location: 'Portland, OR',
    tier: 'Niche',
    status: 'active',
    campaigns: 1,
    activeCampaigns: 1,
    ltv: '$24k',
    contacts: ['Jack', 'Quinn', 'Vasquez'],
  },
];

const defaultForm: ClientFormState = {
  name: '',
  category: '',
  location: '',
  tier: 'Regional',
  status: 'active',
  campaigns: '1',
  activeCampaigns: '1',
  ltv: '$0',
  contacts: '',
};

const statusBadgeClass: Record<ClientStatus, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pitching: 'bg-amber-50 text-amber-700 border-amber-200',
  dormant: 'bg-slate-100 text-slate-600 border-slate-200',
};

function getInitials(name: string) {
  return name
    .split(' ')
    .map((segment) => segment[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [selectedTier, setSelectedTier] = useState<'All tiers' | ClientTier>('All tiers');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Active' | 'Pitching' | 'Dormant'>('All');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState<ClientFormState>(defaultForm);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const visibleClients = useMemo(() => {
    return clients.filter((client) => {
      const tierMatch = selectedTier === 'All tiers' ? true : client.tier === selectedTier;
      const statusMatch = selectedStatus === 'All' ? true : client.status === selectedStatus.toLowerCase();
      return tierMatch && statusMatch;
    });
  }, [clients, selectedTier, selectedStatus]);

  const addClient = () => {
    if (!form.name.trim()) {
      return;
    }

    const newClient: Client = {
      id: `${form.name.trim().toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      name: form.name.trim(),
      category: form.category.trim() || 'Uncategorized',
      location: form.location.trim() || 'Unknown',
      tier: form.tier,
      status: form.status,
      campaigns: Number(form.campaigns) || 0,
      activeCampaigns: Number(form.activeCampaigns) || 0,
      ltv: form.ltv.trim() || '$0',
      contacts: form.contacts
        .split(',')
        .map((name) => name.trim())
        .filter(Boolean),
    };

    setClients((prev) => [newClient, ...prev]);
    setForm(defaultForm);
    setIsAddOpen(false);
  };

  return (
    <AppLayout>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Clients</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">Brand directory</h1>
            <p className="mt-1 text-sm text-muted-foreground">7 clients · 4 active · 2 pitching · $1.4M lifetime</p>
          </div>
          <Button onClick={() => setIsAddOpen(true)}>+ Add client</Button>
        </header>

        <section className="space-y-4 rounded-xl border border-border bg-card p-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tier</p>
            <div className="flex flex-wrap gap-2">
              {tierFilters.map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setSelectedTier(tier)}
                  className={cn(
                    'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                    selectedTier === tier
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background text-foreground hover:bg-muted',
                  )}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</p>
            <div className="flex flex-wrap gap-2">
              {statusFilters.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setSelectedStatus(status)}
                  className={cn(
                    'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                    selectedStatus === status
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background text-foreground hover:bg-muted',
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visibleClients.map((client) => (
            <button
              key={client.id}
              type="button"
              onClick={() => setSelectedClient(client)}
              className="flex w-full flex-col rounded-xl border border-border bg-card p-4 text-left transition hover:border-primary/35 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-muted text-sm font-semibold text-foreground">
                    {getInitials(client.name)}
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-foreground">{client.name}</h2>
                    <p className="text-xs text-muted-foreground">{client.category}</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-border bg-background text-foreground">
                  {client.tier}
                </Badge>
              </div>

              <div className="mt-3">
                <Badge variant="outline" className={cn('capitalize', statusBadgeClass[client.status])}>
                  {client.status}
                </Badge>
                <p className="mt-2 text-xs text-muted-foreground">{client.location}</p>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg border border-border bg-background p-2">
                <Stat label="Campaigns" value={String(client.campaigns)} />
                <Stat label="Active" value={String(client.activeCampaigns)} />
                <Stat label="LTV" value={client.ltv} />
              </div>

              <p className="mt-4 text-xs text-muted-foreground">Contacts: {client.contacts.join(', ') || 'None'}</p>
            </button>
          ))}
        </section>
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Add client</DialogTitle>
            <DialogDescription>Create a new client in your local directory.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Client name">
              <Input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
            </Field>
            <Field label="Category">
              <Input value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))} />
            </Field>
            <Field label="Location">
              <Input value={form.location} onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))} />
            </Field>
            <Field label="Tier">
              <select
                value={form.tier}
                onChange={(e) => setForm((prev) => ({ ...prev, tier: e.target.value as ClientTier }))}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {tierFilters
                  .filter((item): item is ClientTier => item !== 'All tiers')
                  .map((tier) => (
                    <option key={tier} value={tier}>
                      {tier}
                    </option>
                  ))}
              </select>
            </Field>
            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as ClientStatus }))}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="active">Active</option>
                <option value="pitching">Pitching</option>
                <option value="dormant">Dormant</option>
              </select>
            </Field>
            <Field label="Campaigns">
              <Input type="number" min={0} value={form.campaigns} onChange={(e) => setForm((prev) => ({ ...prev, campaigns: e.target.value }))} />
            </Field>
            <Field label="Active campaigns">
              <Input
                type="number"
                min={0}
                value={form.activeCampaigns}
                onChange={(e) => setForm((prev) => ({ ...prev, activeCampaigns: e.target.value }))}
              />
            </Field>
            <Field label="LTV">
              <Input value={form.ltv} onChange={(e) => setForm((prev) => ({ ...prev, ltv: e.target.value }))} />
            </Field>
            <Field label="Contacts (comma-separated)" className="sm:col-span-2">
              <Input value={form.contacts} onChange={(e) => setForm((prev) => ({ ...prev, contacts: e.target.value }))} />
            </Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Close
            </Button>
            <Button onClick={addClient} disabled={!form.name.trim()}>
              Save client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(selectedClient)} onOpenChange={(open) => !open && setSelectedClient(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedClient?.name}</DialogTitle>
            <DialogDescription>Client profile details.</DialogDescription>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <Detail label="Category" value={selectedClient.category} />
                <Detail label="Location" value={selectedClient.location} />
                <Detail label="Tier" value={selectedClient.tier} />
                <Detail label="Status" value={selectedClient.status} className="capitalize" />
                <Detail label="Campaigns" value={String(selectedClient.campaigns)} />
                <Detail label="Active campaigns" value={String(selectedClient.activeCampaigns)} />
                <Detail label="LTV" value={selectedClient.ltv} />
              </div>
              <div className="rounded-lg border border-border bg-muted/20 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Contacts</p>
                <p className="mt-1 text-foreground">{selectedClient.contacts.join(', ') || 'None'}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedClient(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn('space-y-1.5 text-sm', className)}>
      <span className="font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}

function Detail({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={cn('mt-1 text-foreground', className)}>{value}</p>
    </div>
  );
}
