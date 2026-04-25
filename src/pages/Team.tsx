import { FormEvent, useMemo, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type Department = 'Creative' | 'Public Relations' | 'Account Managers' | 'Research' | 'Operations';
type CapacityStatus = 'Wide open' | 'Balanced' | 'Near capacity';

interface Teammate {
  id: string;
  name: string;
  role: string;
  department: Department;
  freePercent: number;
  openTasks: number;
  leads: string;
  skills: string[];
}

const departments: Array<Department | 'Everyone'> = [
  'Everyone',
  'Creative',
  'Public Relations',
  'Account Managers',
  'Research',
  'Operations',
];

const initialTeammates: Teammate[] = [
  { id: 'tm-1', name: 'Jordan Lee', role: 'Creative Director', department: 'Creative', freePercent: 42, openTasks: 8, leads: 'Nike', skills: ['Brand', 'Copy'] },
  { id: 'tm-2', name: 'Sofia Patel', role: 'Designer', department: 'Creative', freePercent: 66, openTasks: 5, leads: 'Moda Health', skills: ['Design', 'Motion'] },
  { id: 'tm-3', name: 'Marcus Chen', role: 'Video Producer', department: 'Creative', freePercent: 35, openTasks: 9, leads: 'Dutch Bros', skills: ['Video', 'Production'] },
  { id: 'tm-4', name: 'Avery Brooks', role: 'Copywriter', department: 'Creative', freePercent: 71, openTasks: 4, leads: 'Ruffles', skills: ['Copy', 'Social'] },
  { id: 'tm-5', name: 'Nina Alvarez', role: 'PR Strategist', department: 'Public Relations', freePercent: 29, openTasks: 10, leads: 'Columbia Sportswear', skills: ['Media', 'PR'] },
  { id: 'tm-6', name: 'Tyler Nguyen', role: 'Press Manager', department: 'Public Relations', freePercent: 58, openTasks: 6, leads: 'Tillamook', skills: ['PR', 'Comms'] },
  { id: 'tm-7', name: 'Emma Price', role: 'Account Lead', department: 'Account Managers', freePercent: 39, openTasks: 11, leads: 'Nike', skills: ['Client Ops', 'Reporting'] },
  { id: 'tm-8', name: 'Liam Torres', role: 'Account Manager', department: 'Account Managers', freePercent: 64, openTasks: 5, leads: 'Leatherman', skills: ['Client Ops', 'Planning'] },
  { id: 'tm-9', name: 'Maya Hassan', role: 'Research Analyst', department: 'Research', freePercent: 75, openTasks: 3, leads: 'Moda Health', skills: ['Insights', 'Audience'] },
  { id: 'tm-10', name: 'Noah Kim', role: 'Research Associate', department: 'Research', freePercent: 48, openTasks: 7, leads: 'Dutch Bros', skills: ['Insights', 'Data'] },
  { id: 'tm-11', name: 'Ivy Wallace', role: 'Operations Manager', department: 'Operations', freePercent: 22, openTasks: 14, leads: 'Internal', skills: ['Ops', 'Routing'] },
  { id: 'tm-12', name: 'Caleb Foster', role: 'Workflow Coordinator', department: 'Operations', freePercent: 53, openTasks: 13, leads: 'Internal', skills: ['Routing', 'Resourcing'] },
];

interface AddTeammateForm {
  name: string;
  role: string;
  department: Department;
  freePercent: string;
  openTasks: string;
  leads: string;
  skills: string;
}

const defaultForm: AddTeammateForm = {
  name: '',
  role: '',
  department: 'Creative',
  freePercent: '50',
  openTasks: '0',
  leads: 'Unassigned',
  skills: '',
};

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function getCapacityStatus(freePercent: number): CapacityStatus {
  if (freePercent >= 60) return 'Wide open';
  if (freePercent >= 35) return 'Balanced';
  return 'Near capacity';
}

function statusClass(status: CapacityStatus) {
  if (status === 'Wide open') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (status === 'Balanced') return 'bg-slate-50 text-slate-700 border-slate-200';
  return 'bg-amber-50 text-amber-700 border-amber-200';
}

export default function Team() {
  const [teammates, setTeammates] = useState<Teammate[]>(initialTeammates);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | 'Everyone'>('Everyone');
  const [searchTerm, setSearchTerm] = useState('');
  const [capacityDepartment, setCapacityDepartment] = useState<Department | 'All departments'>('All departments');
  const [capacitySkill, setCapacitySkill] = useState<string>('All skills');
  const [selectedTeammate, setSelectedTeammate] = useState<Teammate | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [form, setForm] = useState<AddTeammateForm>(defaultForm);

  const skillOptions = useMemo(() => {
    const values = new Set<string>();
    teammates.forEach((teammate) => teammate.skills.forEach((skill) => values.add(skill)));
    return ['All skills', ...Array.from(values).sort((a, b) => a.localeCompare(b))];
  }, [teammates]);

  const directoryRows = useMemo(() => {
    return teammates.filter((teammate) => {
      const departmentMatch = selectedDepartment === 'Everyone' ? true : teammate.department === selectedDepartment;
      const term = searchTerm.trim().toLowerCase();
      const searchMatch =
        term.length === 0 ? true : teammate.name.toLowerCase().includes(term) || teammate.role.toLowerCase().includes(term);
      return departmentMatch && searchMatch;
    });
  }, [teammates, selectedDepartment, searchTerm]);

  const whoIsFreeRows = useMemo(() => {
    const filtered = teammates.filter((teammate) => {
      const departmentMatch = capacityDepartment === 'All departments' ? true : teammate.department === capacityDepartment;
      const skillMatch = capacitySkill === 'All skills' ? true : teammate.skills.includes(capacitySkill);
      return departmentMatch && skillMatch;
    });

    return filtered.sort((a, b) => b.freePercent - a.freePercent).slice(0, 4);
  }, [teammates, capacityDepartment, capacitySkill]);

  const departmentCount = useMemo(() => {
    return departments.reduce<Record<string, number>>((acc, department) => {
      acc[department] =
        department === 'Everyone'
          ? teammates.length
          : teammates.filter((teammate) => teammate.department === department).length;
      return acc;
    }, {});
  }, [teammates]);

  const submitTeammate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.role.trim()) return;

    const parsedFree = Number(form.freePercent);
    const parsedTasks = Number(form.openTasks);

    const newTeammate: Teammate = {
      id: `tm-${Date.now()}`,
      name: form.name.trim(),
      role: form.role.trim(),
      department: form.department,
      freePercent: Number.isFinite(parsedFree) ? Math.max(0, Math.min(100, parsedFree)) : 50,
      openTasks: Number.isFinite(parsedTasks) ? Math.max(0, parsedTasks) : 0,
      leads: form.leads.trim() || 'Unassigned',
      skills: form.skills
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean),
    };

    setTeammates((prev) => [newTeammate, ...prev]);
    setForm(defaultForm);
    setIsAddModalOpen(false);
  };

  return (
    <AppLayout>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">TEAM</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">Departments &amp; directory</h1>
            <p className="mt-1 text-sm text-muted-foreground">12 teammates · 5 departments · 95 open tasks routed</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>+ Add teammate</Button>
        </header>

        <section className="rounded-xl border border-border bg-white p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Departments</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((department) => (
              <button
                key={department}
                type="button"
                onClick={() => setSelectedDepartment(department)}
                className={cn(
                  'rounded-xl border bg-white p-4 text-left transition-colors',
                  selectedDepartment === department
                    ? 'border-emerald-500 ring-1 ring-emerald-500/30'
                    : 'border-border hover:border-emerald-300',
                )}
              >
                <p className="text-sm font-medium text-foreground">{department}</p>
                <p className="mt-1 text-xs text-muted-foreground">{departmentCount[department]} people</p>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-border bg-white p-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Who&apos;s free</h2>
              <p className="text-sm text-muted-foreground">Spot available teammates by department and skill.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={capacityDepartment}
                onChange={(event) => setCapacityDepartment(event.target.value as Department | 'All departments')}
                className="h-10 rounded-md border border-border bg-white px-3 text-sm text-foreground"
              >
                <option value="All departments">All departments</option>
                {departments
                  .filter((department): department is Department => department !== 'Everyone')
                  .map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
              </select>
              <select
                value={capacitySkill}
                onChange={(event) => setCapacitySkill(event.target.value)}
                className="h-10 rounded-md border border-border bg-white px-3 text-sm text-foreground"
              >
                {skillOptions.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {whoIsFreeRows.map((teammate, index) => (
              <article key={teammate.id} className="rounded-xl border border-border bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{teammate.name}</p>
                    <p className="text-xs text-muted-foreground">{teammate.department}</p>
                  </div>
                  {index === 0 ? (
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                      Top Match
                    </span>
                  ) : null}
                </div>
                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Capacity</span>
                    <span>{teammate.freePercent}% free</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${teammate.freePercent}%` }} />
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">{teammate.openTasks} open tasks</p>
              </article>
            ))}
            {whoIsFreeRows.length === 0 ? (
              <p className="col-span-full rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No teammates match your filters.
              </p>
            ) : null}
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-border bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-foreground">Directory</h2>
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search name or role"
              className="max-w-xs"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-3 py-1 font-medium">Teammate</th>
                  <th className="px-3 py-1 font-medium">Role</th>
                  <th className="px-3 py-1 font-medium">Department</th>
                  <th className="px-3 py-1 font-medium">Capacity</th>
                  <th className="px-3 py-1 font-medium">Open tasks</th>
                  <th className="px-3 py-1 font-medium">Leads</th>
                  <th className="px-3 py-1 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {directoryRows.map((teammate) => {
                  const capacityStatus = getCapacityStatus(teammate.freePercent);
                  return (
                    <tr key={teammate.id} className="rounded-lg border border-border bg-white shadow-sm">
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-slate-50 text-xs font-semibold text-slate-700">
                            {getInitials(teammate.name)}
                          </span>
                          <span className="text-sm font-medium text-foreground">{teammate.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-sm text-foreground">{teammate.role}</td>
                      <td className="px-3 py-3 text-sm text-foreground">{teammate.department}</td>
                      <td className="px-3 py-3">
                        <span className={cn('rounded-full border px-2 py-1 text-xs font-medium', statusClass(capacityStatus))}>
                          {capacityStatus}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-sm text-foreground">{teammate.openTasks}</td>
                      <td className="px-3 py-3 text-sm text-foreground">{teammate.leads}</td>
                      <td className="px-3 py-3 text-right">
                        <Button size="sm" variant="outline" onClick={() => setSelectedTeammate(teammate)}>
                          View
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {directoryRows.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                No teammates found with the selected filters.
              </p>
            ) : null}
          </div>
        </section>
      </div>

      <Dialog open={Boolean(selectedTeammate)} onOpenChange={(open) => (!open ? setSelectedTeammate(null) : null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTeammate?.name}</DialogTitle>
          </DialogHeader>
          {selectedTeammate ? (
            <div className="space-y-2 text-sm text-foreground">
              <p>
                <span className="font-medium">Role:</span> {selectedTeammate.role}
              </p>
              <p>
                <span className="font-medium">Department:</span> {selectedTeammate.department}
              </p>
              <p>
                <span className="font-medium">Capacity:</span> {selectedTeammate.freePercent}% free
              </p>
              <p>
                <span className="font-medium">Open tasks:</span> {selectedTeammate.openTasks}
              </p>
              <p>
                <span className="font-medium">Leads:</span> {selectedTeammate.leads}
              </p>
              <p>
                <span className="font-medium">Skills:</span> {selectedTeammate.skills.join(', ') || '—'}
              </p>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add teammate</DialogTitle>
          </DialogHeader>
          <form className="space-y-3" onSubmit={submitTeammate}>
            <Input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Full name"
              required
            />
            <Input
              value={form.role}
              onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
              placeholder="Role"
              required
            />
            <select
              value={form.department}
              onChange={(event) => setForm((prev) => ({ ...prev, department: event.target.value as Department }))}
              className="h-10 w-full rounded-md border border-border bg-white px-3 text-sm text-foreground"
            >
              {departments
                .filter((department): department is Department => department !== 'Everyone')
                .map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
            </select>
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={form.freePercent}
                onChange={(event) => setForm((prev) => ({ ...prev, freePercent: event.target.value }))}
                placeholder="% free"
                type="number"
                min={0}
                max={100}
              />
              <Input
                value={form.openTasks}
                onChange={(event) => setForm((prev) => ({ ...prev, openTasks: event.target.value }))}
                placeholder="Open tasks"
                type="number"
                min={0}
              />
            </div>
            <Input
              value={form.leads}
              onChange={(event) => setForm((prev) => ({ ...prev, leads: event.target.value }))}
              placeholder="Lead account"
            />
            <Input
              value={form.skills}
              onChange={(event) => setForm((prev) => ({ ...prev, skills: event.target.value }))}
              placeholder="Skills (comma separated)"
            />
            <DialogFooter>
              <Button type="submit">Add teammate</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
