import { FormEvent, useMemo, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Department = 'Creative' | 'Public Relations' | 'Account Managers' | 'Research' | 'Operations';

interface Teammate {
  id: string;
  name: string;
  role: string;
  department: Department;
  skills: string[];
  openTasks: number;
  leads: number;
  capacity: number;
}

const starterTeammates: Teammate[] = [
  { id: 'tm-1', name: 'Jack Turpen', role: 'Creative', department: 'Creative', skills: ['Brand voice', 'Copy editing'], openTasks: 8, leads: 2, capacity: 74 },
  { id: 'tm-2', name: 'Devon Asare', role: 'Content Producer', department: 'Creative', skills: ['Video production', 'Editing'], openTasks: 9, leads: 1, capacity: 78 },
  { id: 'tm-3', name: 'Noelle Park', role: 'PR Director', department: 'Public Relations', skills: ['Media strategy', 'Press kits'], openTasks: 7, leads: 3, capacity: 70 },
  { id: 'tm-4', name: 'Theo Alderson', role: 'Publicist', department: 'Public Relations', skills: ['Press outreach', 'Talent stories'], openTasks: 6, leads: 2, capacity: 66 },
  { id: 'tm-5', name: 'Hana Reyes', role: 'Research Lead', department: 'Research', skills: ['Market analysis', 'Trend reports'], openTasks: 8, leads: 2, capacity: 72 },
  { id: 'tm-6', name: 'Kwame Brooks', role: 'Data Analyst', department: 'Research', skills: ['Data visualization', 'Reporting'], openTasks: 6, leads: 1, capacity: 63 },
  { id: 'tm-7', name: 'Lena Orkney', role: 'Graphic Designer', department: 'Creative', skills: ['Brand design', 'Social templates'], openTasks: 9, leads: 1, capacity: 80 },
  { id: 'tm-8', name: 'Marco Haidari', role: 'Operations Manager', department: 'Operations', skills: ['Process design', 'Sprint planning'], openTasks: 8, leads: 3, capacity: 68 },
  { id: 'tm-9', name: 'Margot Liu', role: 'Compliance Manager', department: 'Operations', skills: ['Compliance', 'Risk review'], openTasks: 7, leads: 2, capacity: 71 },
  { id: 'tm-10', name: 'Priya Nakamura', role: 'Creative Lead', department: 'Creative', skills: ['Creative direction', 'Campaign concepts'], openTasks: 10, leads: 4, capacity: 83 },
  { id: 'tm-11', name: 'Amari Cole', role: 'Account Manager', department: 'Account Managers', skills: ['Client management', 'Pitch prep'], openTasks: 9, leads: 4, capacity: 76 },
  { id: 'tm-12', name: 'Tessa Grant', role: 'Account Coordinator', department: 'Account Managers', skills: ['Scheduling', 'Client updates'], openTasks: 8, leads: 2, capacity: 69 },
];

const departmentOptions: Array<{ key: 'Everyone' | Department; label: string }> = [
  { key: 'Everyone', label: 'Everyone' },
  { key: 'Creative', label: 'Creative' },
  { key: 'Public Relations', label: 'Public Relations' },
  { key: 'Account Managers', label: 'Account Managers' },
  { key: 'Research', label: 'Research' },
  { key: 'Operations', label: 'Operations' },
];

const capacityStatus = (freePct: number) => {
  if (freePct >= 35) return 'Available';
  if (freePct >= 20) return 'Balanced';
  return 'At capacity';
};

const initialsFor = (name: string) =>
  name
    .split(' ')
    .map((chunk) => chunk[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export default function Team() {
  const [teammates, setTeammates] = useState<Teammate[]>(starterTeammates);
  const [activeDepartment, setActiveDepartment] = useState<'Everyone' | Department>('Everyone');
  const [search, setSearch] = useState('');
  const [capacityDepartment, setCapacityDepartment] = useState<'All Departments' | Department>('All Departments');
  const [capacitySkill, setCapacitySkill] = useState('Any skill');
  const [selectedTeammate, setSelectedTeammate] = useState<Teammate | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTeammate, setNewTeammate] = useState({
    name: '',
    role: '',
    department: 'Creative' as Department,
    skills: '',
    openTasks: '0',
    leads: '0',
    capacity: '55',
  });

  const teamCountByDepartment = useMemo(() => {
    const summary: Record<'Everyone' | Department, number> = {
      Everyone: teammates.length,
      Creative: 0,
      'Public Relations': 0,
      'Account Managers': 0,
      Research: 0,
      Operations: 0,
    };

    teammates.forEach((person) => {
      summary[person.department] += 1;
    });

    return summary;
  }, [teammates]);

  const filteredDirectory = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return teammates.filter((person) => {
      const matchesDepartment = activeDepartment === 'Everyone' || person.department === activeDepartment;
      const matchesSearch =
        searchText.length === 0 ||
        person.name.toLowerCase().includes(searchText) ||
        person.role.toLowerCase().includes(searchText);

      return matchesDepartment && matchesSearch;
    });
  }, [teammates, activeDepartment, search]);

  const capacityCandidates = useMemo(() => {
    return teammates
      .filter((person) => {
        const matchesDepartment = capacityDepartment === 'All Departments' || person.department === capacityDepartment;
        const matchesSkill =
          capacitySkill === 'Any skill' ||
          person.skills.some((skill) => skill.toLowerCase().includes(capacitySkill.toLowerCase()));

        return matchesDepartment && matchesSkill;
      })
      .map((person) => ({ ...person, free: 100 - person.capacity }))
      .sort((a, b) => b.free - a.free)
      .slice(0, 4);
  }, [teammates, capacityDepartment, capacitySkill]);

  const skillOptions = useMemo(() => {
    const allSkills = new Set<string>();
    teammates.forEach((person) => {
      person.skills.forEach((skill) => allSkills.add(skill));
    });
    return ['Any skill', ...Array.from(allSkills).sort((a, b) => a.localeCompare(b))];
  }, [teammates]);

  const routedTasks = useMemo(() => teammates.reduce((sum, person) => sum + person.openTasks, 0), [teammates]);

  const handleAddTeammate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedCapacity = Number(newTeammate.capacity);
    const parsedOpenTasks = Number(newTeammate.openTasks);
    const parsedLeads = Number(newTeammate.leads);

    if (!newTeammate.name.trim() || !newTeammate.role.trim()) return;

    setTeammates((prev) => [
      ...prev,
      {
        id: `tm-${Date.now()}`,
        name: newTeammate.name.trim(),
        role: newTeammate.role.trim(),
        department: newTeammate.department,
        skills: newTeammate.skills
          .split(',')
          .map((skill) => skill.trim())
          .filter(Boolean),
        openTasks: Number.isFinite(parsedOpenTasks) ? parsedOpenTasks : 0,
        leads: Number.isFinite(parsedLeads) ? parsedLeads : 0,
        capacity: Math.min(100, Math.max(0, Number.isFinite(parsedCapacity) ? parsedCapacity : 55)),
      },
    ]);

    setNewTeammate({
      name: '',
      role: '',
      department: 'Creative',
      skills: '',
      openTasks: '0',
      leads: '0',
      capacity: '55',
    });
    setIsAddOpen(false);
  };

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto space-y-6 pb-8">
        <section className="rounded-xl border border-border bg-card p-6">
          <p className="text-xs font-semibold tracking-[0.16em] text-primary">TEAM</p>
          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-display font-semibold tracking-tight">Departments & directory</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {teammates.length} teammates · 5 departments · {routedTasks} open tasks routed
              </p>
            </div>
            <Button onClick={() => setIsAddOpen(true)}>+ Add teammate</Button>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
          {departmentOptions.map((department) => {
            const isActive = activeDepartment === department.key;
            return (
              <button
                key={department.key}
                type="button"
                onClick={() => setActiveDepartment(department.key)}
                className={`rounded-xl border p-4 text-left transition ${
                  isActive ? 'border-primary bg-primary/5 ring-1 ring-primary/30' : 'border-border bg-card hover:border-primary/40'
                }`}
              >
                <p className="text-sm font-semibold">{department.label}</p>
                <p className="text-xs text-muted-foreground">{teamCountByDepartment[department.key]} people</p>
              </button>
            );
          })}
        </section>

        <section className="rounded-xl border border-border bg-card p-6 space-y-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Who&apos;s free?</h2>
              <p className="text-sm text-muted-foreground">Find a teammate with capacity to take on a new project</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 w-full lg:w-auto lg:min-w-[460px]">
              <div className="space-y-1.5">
                <Label>Department</Label>
                <Select value={capacityDepartment} onValueChange={(value) => setCapacityDepartment(value as 'All Departments' | Department)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Departments">All Departments</SelectItem>
                    {departmentOptions
                      .filter((department) => department.key !== 'Everyone')
                      .map((department) => (
                        <SelectItem key={department.key} value={department.key}>
                          {department.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Skill</Label>
                <Select value={capacitySkill} onValueChange={setCapacitySkill}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {skillOptions.map((skill) => (
                      <SelectItem key={skill} value={skill}>
                        {skill}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {capacityCandidates.map((person, index) => (
              <Card key={person.id} className="border-border p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold leading-tight">{person.name}</p>
                    <p className="text-xs text-muted-foreground">{person.role}</p>
                  </div>
                  {index === 0 && <Badge className="bg-green-600 hover:bg-green-600">Top Match</Badge>}
                </div>
                <div className="space-y-2">
                  <Progress value={person.free} className="h-2 bg-green-100" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-green-700 font-medium">{person.free}% free</span>
                    <span className="text-muted-foreground">{person.openTasks} open tasks</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Directory</h2>
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or role"
              className="sm:w-72"
            />
          </div>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-muted/40 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Teammate</th>
                  <th className="px-4 py-3 font-medium">Department</th>
                  <th className="px-4 py-3 font-medium">Capacity status</th>
                  <th className="px-4 py-3 font-medium">Open tasks</th>
                  <th className="px-4 py-3 font-medium">Leads</th>
                  <th className="px-4 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredDirectory.map((person) => {
                  const free = 100 - person.capacity;
                  return (
                    <tr key={person.id} className="border-t border-border">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full border border-border bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                            {initialsFor(person.name)}
                          </div>
                          <div>
                            <p className="font-medium">{person.name}</p>
                            <p className="text-xs text-muted-foreground">{person.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{person.department}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium text-green-700">{capacityStatus(free)}</span>
                      </td>
                      <td className="px-4 py-3">{person.openTasks}</td>
                      <td className="px-4 py-3">{person.leads}</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="outline" size="sm" onClick={() => setSelectedTeammate(person)}>
                          View
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <Dialog open={selectedTeammate !== null} onOpenChange={(open) => !open && setSelectedTeammate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTeammate?.name}</DialogTitle>
            <DialogDescription>{selectedTeammate?.role}</DialogDescription>
          </DialogHeader>
          {selectedTeammate && (
            <div className="space-y-3 text-sm">
              <p><span className="font-medium">Department:</span> {selectedTeammate.department}</p>
              <p><span className="font-medium">Skills:</span> {selectedTeammate.skills.join(', ') || 'None listed'}</p>
              <p><span className="font-medium">Open tasks:</span> {selectedTeammate.openTasks}</p>
              <p><span className="font-medium">Leads:</span> {selectedTeammate.leads}</p>
              <p><span className="font-medium">Capacity:</span> {selectedTeammate.capacity}% used ({100 - selectedTeammate.capacity}% free)</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>Add teammate</DialogTitle>
            <DialogDescription>Create a teammate profile and add them to the directory.</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleAddTeammate}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="team-name">Name</Label>
                <Input id="team-name" value={newTeammate.name} onChange={(event) => setNewTeammate((prev) => ({ ...prev, name: event.target.value }))} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="team-role">Role</Label>
                <Input id="team-role" value={newTeammate.role} onChange={(event) => setNewTeammate((prev) => ({ ...prev, role: event.target.value }))} required />
              </div>
              <div className="space-y-1.5">
                <Label>Department</Label>
                <Select value={newTeammate.department} onValueChange={(value) => setNewTeammate((prev) => ({ ...prev, department: value as Department }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {departmentOptions
                      .filter((department) => department.key !== 'Everyone')
                      .map((department) => (
                        <SelectItem key={department.key} value={department.key}>{department.label}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="team-skills">Skills</Label>
                <Input
                  id="team-skills"
                  placeholder="Comma-separated"
                  value={newTeammate.skills}
                  onChange={(event) => setNewTeammate((prev) => ({ ...prev, skills: event.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="team-open-tasks">Open tasks</Label>
                <Input id="team-open-tasks" type="number" min={0} value={newTeammate.openTasks} onChange={(event) => setNewTeammate((prev) => ({ ...prev, openTasks: event.target.value }))} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="team-leads">Leads</Label>
                <Input id="team-leads" type="number" min={0} value={newTeammate.leads} onChange={(event) => setNewTeammate((prev) => ({ ...prev, leads: event.target.value }))} required />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="team-capacity">Capacity %</Label>
              <Input id="team-capacity" type="number" min={0} max={100} value={newTeammate.capacity} onChange={(event) => setNewTeammate((prev) => ({ ...prev, capacity: event.target.value }))} required />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button type="submit">Add teammate</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
