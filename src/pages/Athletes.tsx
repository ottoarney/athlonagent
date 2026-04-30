import { useMemo, useState } from 'react';
import { Filter, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { athletes as seedAthletes, deals as seedDeals, tasks as seedTasks, formatCurrency, type Athlete } from '@/lib/data';
import { cn } from '@/lib/utils';
import { DashboardPageHeader } from '@/components/layout/DashboardPageHeader';
import { PageTransition } from '@/components/layout/PageTransition';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const statusColors = {
  active: 'bg-[#01FB64]/20 text-black border-[#01FB64]/40',
  prospect: 'bg-[#FBE101]/30 text-black border-[#FBE101]/60',
  inactive: 'bg-muted text-muted-foreground border-border',
};

type AthleteWorkspaceItem = Athlete & {
  dealValue: number;
  activeDeals: number;
  openTasks: number;
};

type AthleteFormData = {
  name: string;
  sport: string;
  team: string;
  position: string;
  classYear: string;
  status: Athlete['status'];
  dealValue: number;
  activeDeals: number;
  openTasks: number;
  notes: string;
  avatar?: string;
};

const createInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const seedWorkspace = (): AthleteWorkspaceItem[] =>
  seedAthletes.map((athlete) => {
    const relatedDeals = seedDeals.filter((deal) => deal.athleteId === athlete.id);
    const relatedTasks = seedTasks.filter((task) => task.athleteId === athlete.id && task.status !== 'done');
    return {
      ...athlete,
      dealValue: relatedDeals.reduce((sum, deal) => sum + deal.value, 0),
      activeDeals: relatedDeals.length,
      openTasks: relatedTasks.length,
    };
  });

const defaultForm: AthleteFormData = {
  name: '',
  sport: '',
  team: '',
  position: '',
  classYear: '',
  status: 'active',
  dealValue: 0,
  activeDeals: 0,
  openTasks: 0,
  notes: '',
};

export default function Athletes() {
  const [items, setItems] = useState<AthleteWorkspaceItem[]>(seedWorkspace);
  const [search, setSearch] = useState('');
  const [sportFilter, setSportFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | Athlete['status']>('all');
  const [dealFilter, setDealFilter] = useState<'all' | 'under-50k' | '50k-150k' | '150k-plus'>('all');
  const [taskFilter, setTaskFilter] = useState<'all' | 'none' | '1-3' | '4-plus'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AthleteFormData>(defaultForm);
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((athlete) => {
      const matchesSearch = !q || [athlete.name, athlete.sport, athlete.team, athlete.position].join(' ').toLowerCase().includes(q);
      const matchesSport = sportFilter === 'all' || athlete.sport === sportFilter;
      const matchesStatus = statusFilter === 'all' || athlete.status === statusFilter;
      const matchesDeal =
        dealFilter === 'all' ||
        (dealFilter === 'under-50k' && athlete.dealValue < 50000) ||
        (dealFilter === '50k-150k' && athlete.dealValue >= 50000 && athlete.dealValue < 150000) ||
        (dealFilter === '150k-plus' && athlete.dealValue >= 150000);
      const matchesTasks =
        taskFilter === 'all' ||
        (taskFilter === 'none' && athlete.openTasks === 0) ||
        (taskFilter === '1-3' && athlete.openTasks >= 1 && athlete.openTasks <= 3) ||
        (taskFilter === '4-plus' && athlete.openTasks >= 4);

      return matchesSearch && matchesSport && matchesStatus && matchesDeal && matchesTasks;
    });
  }, [items, search, sportFilter, statusFilter, dealFilter, taskFilter]);

  const sportOptions = useMemo(() => [...new Set(items.map((athlete) => athlete.sport))], [items]);

  const resetModal = () => {
    setForm(defaultForm);
    setImagePreview(undefined);
    setEditingId(null);
    setIsSaving(false);
  };

  const onOpenAdd = () => {
    resetModal();
    setIsModalOpen(true);
  };

  const onEdit = (athlete: AthleteWorkspaceItem) => {
    setEditingId(athlete.id);
    setForm({
      name: athlete.name,
      sport: athlete.sport,
      team: athlete.team,
      position: athlete.position,
      classYear: athlete.classYear,
      status: athlete.status,
      dealValue: athlete.dealValue,
      activeDeals: athlete.activeDeals,
      openTasks: athlete.openTasks,
      notes: athlete.agentNotes ?? '',
      avatar: athlete.avatar,
    });
    setImagePreview(athlete.avatar);
    setIsModalOpen(true);
  };

  const onDelete = (athleteId: string) => {
    setItems((prev) => prev.filter((athlete) => athlete.id !== athleteId));
  };

  const onImageUpload = (file?: File) => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    setForm((prev) => ({ ...prev, avatar: objectUrl }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving || !form.name.trim()) return;

    setIsSaving(true);

    const athletePayload: AthleteWorkspaceItem = {
      id: editingId ?? `ath-${Date.now()}`,
      name: form.name.trim(),
      sport: form.sport.trim(),
      team: form.team.trim(),
      position: form.position.trim(),
      classYear: form.classYear.trim(),
      location: '',
      initials: createInitials(form.name),
      status: form.status,
      agentNotes: form.notes.trim(),
      avatar: imagePreview,
      dealValue: form.dealValue,
      activeDeals: form.activeDeals,
      openTasks: form.openTasks,
    };

    setItems((prev) => {
      if (editingId) {
        return prev.map((item) => (item.id === editingId ? athletePayload : item));
      }
      return [athletePayload, ...prev];
    });

    setIsModalOpen(false);
    resetModal();
  };

  return (
    <AppLayout>
      <PageTransition>
        <DashboardPageHeader
          title="Athletes"
          subtitle="Manage rosters, priorities, tasks, and athlete profiles."
          actions={
            <Dialog open={isModalOpen} onOpenChange={(open) => (!open ? (setIsModalOpen(false), resetModal()) : setIsModalOpen(true))}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-[#01FB64] text-black hover:bg-[#01FB64]/90" onClick={onOpenAdd}>
                  <Plus className="h-4 w-4" />
                  Add Athlete
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingId ? 'Edit Athlete' : 'Add Athlete'}</DialogTitle>
                </DialogHeader>
                <form className="grid gap-4" onSubmit={onSubmit}>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {[
                      ['Full Name', 'name'],
                      ['Sport', 'sport'],
                      ['School/Team', 'team'],
                      ['Position', 'position'],
                      ['Class/Year', 'classYear'],
                    ].map(([label, key]) => (
                      <div key={key} className="space-y-2">
                        <Label>{label}</Label>
                        <Input value={form[key as keyof AthleteFormData] as string} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))} />
                      </div>
                    ))}

                    <div className="space-y-2">
                      <Label>Status/Priority</Label>
                      <Select value={form.status} onValueChange={(value: Athlete['status']) => setForm((prev) => ({ ...prev, status: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="prospect">Prospect</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {[['Deal Value', 'dealValue'], ['Active Deals', 'activeDeals'], ['Open Tasks', 'openTasks']].map(([label, key]) => (
                      <div key={key} className="space-y-2">
                        <Label>{label}</Label>
                        <Input
                          type="number"
                          min="0"
                          value={form[key as keyof AthleteFormData] as number}
                          onChange={(e) => setForm((p) => ({ ...p, [key]: Number(e.target.value) }))}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
                  </div>

                  <div className="space-y-2">
                    <Label>Profile Image</Label>
                    <Input type="file" accept="image/*" onChange={(e) => onImageUpload(e.target.files?.[0])} />
                    {imagePreview && <img src={imagePreview} alt="Preview" className="h-20 w-20 rounded-full object-cover border" />}
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => (setIsModalOpen(false), resetModal())}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSaving} className="bg-[#01FB64] text-black hover:bg-[#01FB64]/90">
                      {isSaving ? 'Saving...' : 'Save Athlete'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          }
        />

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto_auto_auto_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0C5DFF]" />
              <Input placeholder="Search by name, sport, school, team..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={sportFilter} onValueChange={setSportFilter}>
              <SelectTrigger className="w-full lg:w-40"><SelectValue placeholder="Sport" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sports</SelectItem>
                {sportOptions.map((sport) => <SelectItem key={sport} value={sport}>{sport}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}>
              <SelectTrigger className="w-full lg:w-36"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="prospect">Prospect</SelectItem><SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dealFilter} onValueChange={(value) => setDealFilter(value as typeof dealFilter)}>
              <SelectTrigger className="w-full lg:w-36"><SelectValue placeholder="Deal Value" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Deals</SelectItem><SelectItem value="under-50k">Under $50k</SelectItem><SelectItem value="50k-150k">$50k-$150k</SelectItem><SelectItem value="150k-plus">$150k+</SelectItem>
              </SelectContent>
            </Select>
            <Select value={taskFilter} onValueChange={(value) => setTaskFilter(value as typeof taskFilter)}>
              <SelectTrigger className="w-full lg:w-36"><SelectValue placeholder="Open Tasks" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem><SelectItem value="none">No Tasks</SelectItem><SelectItem value="1-3">1-3 Tasks</SelectItem><SelectItem value="4-plus">4+ Tasks</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Filter className="h-4 w-4 text-[#0C5DFF]" /> {filteredItems.length} athletes</div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center">
            <h3 className="text-lg font-semibold">No athletes yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">Add your first athlete to start building your roster.</p>
            <Button className="mt-6 bg-[#01FB64] text-black hover:bg-[#01FB64]/90" onClick={onOpenAdd}>Add Athlete</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_300px]">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filteredItems.map((athlete) => (
                <div key={athlete.id} className="rounded-2xl border bg-card p-5 shadow-sm transition hover:shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      {athlete.avatar ? (
                        <img src={athlete.avatar} alt={athlete.name} className="h-14 w-14 rounded-full object-cover border" />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0C5DFF]/15 text-[#0C5DFF] font-semibold">{athlete.initials}</div>
                      )}
                      <div>
                        <h3 className="font-semibold">{athlete.name}</h3>
                        <p className="text-sm text-muted-foreground">{athlete.sport} • {athlete.position}</p>
                        <p className="text-xs text-muted-foreground">{athlete.team} • {athlete.classYear}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={cn('capitalize', statusColors[athlete.status])}>{athlete.status}</Badge>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3 rounded-xl bg-muted/30 p-3">
                    <div><p className="text-xs text-muted-foreground">Deal Value</p><p className="font-semibold text-sm">{formatCurrency(athlete.dealValue)}</p></div>
                    <div><p className="text-xs text-muted-foreground">Active Deals</p><p className="font-semibold text-sm">{athlete.activeDeals}</p></div>
                    <div><p className="text-xs text-muted-foreground">Open Tasks</p><p className="font-semibold text-sm">{athlete.openTasks}</p></div>
                  </div>

                  <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">{athlete.agentNotes || 'No notes yet.'}</p>

                  <div className="mt-4 flex items-center justify-between">
                    <Button size="sm" variant="outline" className="gap-2" onClick={() => onEdit(athlete)}><Pencil className="h-3.5 w-3.5" />View / Edit</Button>
                    <Button size="icon" variant="ghost" onClick={() => onDelete(athlete.id)} aria-label="Delete athlete"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
              ))}
            </div>

            <aside className="hidden xl:block rounded-2xl border bg-card p-5 h-fit">
              <h4 className="font-semibold">Roster Summary</h4>
              <div className="mt-4 space-y-3 text-sm">
                <p className="flex justify-between"><span>Total Athletes</span><span className="font-semibold">{items.length}</span></p>
                <p className="flex justify-between"><span>High Priority</span><span className="font-semibold">{items.filter((a) => a.status === 'prospect').length}</span></p>
                <p className="flex justify-between"><span>Total Open Tasks</span><span className="font-semibold">{items.reduce((s, a) => s + a.openTasks, 0)}</span></p>
                <p className="flex justify-between"><span>Roster Deal Value</span><span className="font-semibold">{formatCurrency(items.reduce((s, a) => s + a.dealValue, 0))}</span></p>
              </div>
            </aside>
          </div>
        )}
      </PageTransition>
    </AppLayout>
  );
}
