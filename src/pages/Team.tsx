import { FormEvent, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, ArrowUpRight } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

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

const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

const initialTeammates: Teammate[] = [
  { id: 'tm-1', name: 'Jack Turpen', role: 'Creative', department: 'Creative', skills: ['Brand design', 'Campaign concepts'], openTasks: 6, leads: 2, capacity: 38 },
  { id: 'tm-2', name: 'Devon Asare', role: 'Content Producer', department: 'Creative', skills: ['Video editing', 'Social content'], openTasks: 3, leads: 1, capacity: 64 },
  { id: 'tm-3', name: 'Noelle Park', role: 'PR Director', department: 'Public Relations', skills: ['Press strategy', 'Crisis response'], openTasks: 5, leads: 4, capacity: 47 },
  { id: 'tm-4', name: 'Theo Alderson', role: 'Publicist', department: 'Public Relations', skills: ['Media pitching', 'Story placement'], openTasks: 2, leads: 2, capacity: 72 },
  { id: 'tm-5', name: 'Hana Reyes', role: 'Research Lead', department: 'Research', skills: ['Audience insights', 'Trend analysis'], openTasks: 4, leads: 3, capacity: 52 },
  { id: 'tm-6', name: 'Kwame Brooks', role: 'Data Analyst', department: 'Research', skills: ['Data modeling', 'Performance reporting'], openTasks: 2, leads: 1, capacity: 76 },
  { id: 'tm-7', name: 'Lena Orkney', role: 'Graphic Designer', department: 'Creative', skills: ['Typography', 'Presentation design'], openTasks: 1, leads: 1, capacity: 84 },
  { id: 'tm-8', name: 'Marco Haidari', role: 'Operations Manager', department: 'Operations', skills: ['Process design', 'Resource planning'], openTasks: 7, leads: 4, capacity: 28 },
  { id: 'tm-9', name: 'Margot Liu', role: 'Compliance Manager', department: 'Operations', skills: ['Compliance review', 'Risk controls'], openTasks: 4, leads: 2, capacity: 56 },
  { id: 'tm-10', name: 'Priya Nakamura', role: 'Creative Lead', department: 'Creative', skills: ['Creative direction', 'Pitch narratives'], openTasks: 5, leads: 5, capacity: 44 },
  { id: 'tm-11', name: 'Amari Cole', role: 'Account Manager', department: 'Account Managers', skills: ['Client communication', 'Project scoping'], openTasks: 3, leads: 6, capacity: 63 },
  { id: 'tm-12', name: 'Tessa Grant', role: 'Account Coordinator', department: 'Account Managers', skills: ['Scheduling', 'Status reporting'], openTasks: 2, leads: 2, capacity: 79 },
];

const departmentOrder: Array<Department | 'Everyone'> = ['Everyone', 'Creative', 'Public Relations', 'Account Managers', 'Research', 'Operations'];

const capacityStatus = (capacity: number) => {
  if (capacity >= 70) return 'High capacity';
  if (capacity >= 45) return 'Balanced';
  return 'Near limit';
};

const initialsFor = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

export default function Team() {
  const [teammates, setTeammates] = useState<Teammate[]>(initialTeammates);
  const [activeDepartmentCard, setActiveDepartmentCard] = useState<Department | 'Everyone'>('Everyone');
  const [capacityDepartment, setCapacityDepartment] = useState<Department | 'All'>('All');
  const [capacitySkill, setCapacitySkill] = useState<string>('All skills');
  const [search, setSearch] = useState('');
  const [selectedTeammate, setSelectedTeammate] = useState<Teammate | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formDepartment, setFormDepartment] = useState<Department>('Creative');
  const [formSkills, setFormSkills] = useState('');
  const [formOpenTasks, setFormOpenTasks] = useState('0');
  const [formLeads, setFormLeads] = useState('0');
  const [formCapacity, setFormCapacity] = useState('60');

  const departmentCounts = useMemo(() => {
    return departmentOrder.reduce<Record<string, number>>((acc, department) => {
      if (department === 'Everyone') {
        acc[department] = teammates.length;
      } else {
        acc[department] = teammates.filter((person) => person.department === department).length;
      }
      return acc;
    }, {});
  }, [teammates]);

  const allSkills = useMemo(() => {
    const skillSet = new Set<string>();
    teammates.forEach((person) => {
      person.skills.forEach((skill) => skillSet.add(skill));
    });
    return ['All skills', ...Array.from(skillSet).sort((a, b) => a.localeCompare(b))];
  }, [teammates]);

  const filteredDirectory = useMemo(() => {
    return teammates.filter((person) => {
      const matchesDepartment = activeDepartmentCard === 'Everyone' || person.department === activeDepartmentCard;
      const normalizedSearch = search.trim().toLowerCase();
      const matchesSearch =
        normalizedSearch.length === 0 ||
        person.name.toLowerCase().includes(normalizedSearch) ||
        person.role.toLowerCase().includes(normalizedSearch);
      return matchesDepartment && matchesSearch;
    });
  }, [activeDepartmentCard, search, teammates]);

  const filteredCapacity = useMemo(() => {
    return teammates
      .filter((person) => {
        const matchesDepartment = capacityDepartment === 'All' || person.department === capacityDepartment;
        const matchesSkill = capacitySkill === 'All skills' || person.skills.includes(capacitySkill);
        return matchesDepartment && matchesSkill;
      })
      .sort((a, b) => b.capacity - a.capacity || a.openTasks - b.openTasks);
  }, [capacityDepartment, capacitySkill, teammates]);

  const topMatchId = filteredCapacity[0]?.id;

  const handleAddTeammate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedOpenTasks = Number(formOpenTasks);
    const parsedLeads = Number(formLeads);
    const parsedCapacity = Number(formCapacity);

    if (!formName.trim() || !formRole.trim() || Number.isNaN(parsedCapacity)) {
      return;
    }

    const nextTeammate: Teammate = {
      id: `tm-${Date.now()}`,
      name: formName.trim(),
      role: formRole.trim(),
      department: formDepartment,
      skills: formSkills
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean),
      openTasks: Number.isNaN(parsedOpenTasks) ? 0 : Math.max(0, parsedOpenTasks),
      leads: Number.isNaN(parsedLeads) ? 0 : Math.max(0, parsedLeads),
      capacity: Math.min(100, Math.max(0, parsedCapacity)),
    };

    setTeammates((prev) => [nextTeammate, ...prev]);
    setFormName('');
    setFormRole('');
    setFormDepartment('Creative');
    setFormSkills('');
    setFormOpenTasks('0');
    setFormLeads('0');
    setFormCapacity('60');
    setIsAddOpen(false);
  };

  return (
    <AppLayout>
      <motion.div className="max-w-[1600px] mx-auto space-y-6" initial="initial" animate="animate">
        <motion.div variants={fadeIn} className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground">TEAM</p>
            <h1 className="mt-2 text-2xl font-display font-semibold tracking-tight">Departments & directory</h1>
            <p className="mt-1 text-muted-foreground">12 teammates · 5 departments · 95 open tasks routed</p>
          </div>
          <Button className="gap-2" onClick={() => setIsAddOpen(true)}>
            <Plus className="h-4 w-4" />
            Add teammate
          </Button>
        </motion.div>

        <motion.section variants={fadeIn} className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
          {departmentOrder.map((department) => {
            const isActive = activeDepartmentCard === department;
            return (
              <button
                type="button"
                key={department}
                onClick={() => setActiveDepartmentCard(department)}
                className={cn(
                  'rounded-xl border bg-card p-4 text-left transition-all',
                  isActive ? 'border-primary ring-1 ring-primary/30' : 'border-border hover:border-border-strong',
                )}
              >
                <p className="text-sm font-medium text-foreground">{department}</p>
                <p className="mt-2 text-xs text-muted-foreground">{departmentCounts[department]} people</p>
              </button>
            );
          })}
        </motion.section>

        <motion.section variants={fadeIn} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Who&apos;s free?</h2>
              <p className="mt-1 text-sm text-muted-foreground">Find a teammate with capacity to take on a new project</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="min-w-52">
                <p className="mb-1 text-xs font-medium text-muted-foreground">Department</p>
                <Select value={capacityDepartment} onValueChange={(value) => setCapacityDepartment(value as Department | 'All')}>
                  <SelectTrigger>
                    <SelectValue placeholder="All departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All departments</SelectItem>
                    {departmentOrder
                      .filter((department): department is Department => department !== 'Everyone')
                      .map((department) => (
                        <SelectItem key={department} value={department}>
                          {department}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="min-w-52">
                <p className="mb-1 text-xs font-medium text-muted-foreground">Skill</p>
                <Select value={capacitySkill} onValueChange={setCapacitySkill}>
                  <SelectTrigger>
                    <SelectValue placeholder="All skills" />
                  </SelectTrigger>
                  <SelectContent>
                    {allSkills.map((skill) => (
                      <SelectItem key={skill} value={skill}>
                        {skill}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
            {filteredCapacity.map((person) => (
              <div key={person.id} className="rounded-xl border border-border bg-background p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{person.name}</p>
                    <p className="text-sm text-muted-foreground">{person.role}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{person.department}</p>
                  </div>
                  {topMatchId === person.id && <Badge className="bg-primary text-primary-foreground">Top Match</Badge>}
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Capacity</span>
                    <span>{person.capacity}% free</span>
                  </div>
                  <Progress value={person.capacity} className="h-2" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{person.openTasks} open tasks</span>
                    <span className="font-medium">{capacityStatus(person.capacity)}</span>
                  </div>
                </div>
              </div>
            ))}
            {filteredCapacity.length === 0 && (
              <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground lg:col-span-3">
                No teammates match this department + skill combination.
              </div>
            )}
          </div>
        </motion.section>

        <motion.section variants={fadeIn} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Directory</h2>
            <div className="relative w-full sm:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name or role..."
                className="pl-9"
              />
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <div className="divide-y divide-border">
              {filteredDirectory.map((person) => (
                <div key={person.id} className="grid grid-cols-1 gap-3 p-4 md:grid-cols-[2.4fr_1.6fr_1.2fr_1fr_1fr_auto] md:items-center">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-muted text-xs font-semibold">
                      {initialsFor(person.name)}
                    </div>
                    <div>
                      <p className="font-medium">{person.name}</p>
                      <p className="text-sm text-muted-foreground">{person.role}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{person.department}</p>
                  <p className="text-sm">{capacityStatus(person.capacity)}</p>
                  <p className="text-sm text-muted-foreground">{person.openTasks} tasks</p>
                  <p className="text-sm text-muted-foreground">{person.leads} leads</p>
                  <Button variant="outline" size="sm" onClick={() => setSelectedTeammate(person)}>
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {filteredDirectory.length === 0 && (
                <div className="p-8 text-center text-sm text-muted-foreground">No teammates found for this filter/search.</div>
              )}
            </div>
          </div>
        </motion.section>
      </motion.div>

      <Dialog open={Boolean(selectedTeammate)} onOpenChange={(open) => !open && setSelectedTeammate(null)}>
        <DialogContent>
          {selectedTeammate && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedTeammate.name}</DialogTitle>
                <DialogDescription>{selectedTeammate.role}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <p>
                  <span className="text-muted-foreground">Department:</span> {selectedTeammate.department}
                </p>
                <p>
                  <span className="text-muted-foreground">Skills:</span> {selectedTeammate.skills.join(', ') || 'None listed'}
                </p>
                <p>
                  <span className="text-muted-foreground">Open tasks:</span> {selectedTeammate.openTasks}
                </p>
                <p>
                  <span className="text-muted-foreground">Leads:</span> {selectedTeammate.leads}
                </p>
                <p>
                  <span className="text-muted-foreground">Capacity:</span> {selectedTeammate.capacity}% free
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add teammate</DialogTitle>
            <DialogDescription>Create a teammate profile for local planning.</DialogDescription>
          </DialogHeader>

          <form className="space-y-3" onSubmit={handleAddTeammate}>
            <Input value={formName} onChange={(event) => setFormName(event.target.value)} placeholder="Name" required />
            <Input value={formRole} onChange={(event) => setFormRole(event.target.value)} placeholder="Role" required />

            <Select value={formDepartment} onValueChange={(value) => setFormDepartment(value as Department)}>
              <SelectTrigger>
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                {departmentOrder
                  .filter((department): department is Department => department !== 'Everyone')
                  .map((department) => (
                    <SelectItem key={department} value={department}>
                      {department}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Input
              value={formSkills}
              onChange={(event) => setFormSkills(event.target.value)}
              placeholder="Skills (comma-separated)"
            />

            <div className="grid grid-cols-3 gap-3">
              <Input
                type="number"
                min={0}
                value={formOpenTasks}
                onChange={(event) => setFormOpenTasks(event.target.value)}
                placeholder="Open tasks"
              />
              <Input
                type="number"
                min={0}
                value={formLeads}
                onChange={(event) => setFormLeads(event.target.value)}
                placeholder="Leads"
              />
              <Input
                type="number"
                min={0}
                max={100}
                value={formCapacity}
                onChange={(event) => setFormCapacity(event.target.value)}
                placeholder="Capacity %"
              />
            </div>

            <DialogFooter>
              <Button type="submit">Save teammate</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
