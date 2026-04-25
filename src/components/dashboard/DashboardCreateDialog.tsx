import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDashboardData, type CampaignStage } from '@/context/dashboard-context';

const stageOptions: { value: CampaignStage; label: string }[] = [
  { value: 'pitching', label: 'Pitching' },
  { value: 'active', label: 'Active' },
  { value: 'review', label: 'In Review' },
  { value: 'complete', label: 'Complete' },
];

export function DashboardCreateDialog() {
  const { activeModal, closeModal, addAthlete, addCampaign, addTask, athletes } = useDashboardData();
  const hasAthletes = athletes.length > 0;

  const defaultAthleteId = athletes?.[0]?.id ?? '';
  const [athleteForm, setAthleteForm] = useState({ name: '', sport: '', team: '', position: '', classYear: '', location: '' });
  const [campaignForm, setCampaignForm] = useState({ brand: '', athleteId: defaultAthleteId, value: '', stage: 'pitching' as CampaignStage });
  const [taskForm, setTaskForm] = useState({ title: '', athleteId: defaultAthleteId, dueDate: '', priority: 'medium' as const });

  useEffect(() => {
    setCampaignForm((prev) => ({ ...prev, athleteId: prev.athleteId || defaultAthleteId }));
    setTaskForm((prev) => ({ ...prev, athleteId: prev.athleteId || defaultAthleteId }));
  }, [defaultAthleteId]);

  const title = useMemo(() => {
    if (activeModal === 'athlete') return 'Add Athlete';
    if (activeModal === 'campaign') return 'New Campaign';
    if (activeModal === 'task') return 'Create Task';
    return 'Create';
  }, [activeModal]);

  const handleAthleteSubmit = (event: FormEvent) => {
    event.preventDefault();
    addAthlete(athleteForm);
    setAthleteForm({ name: '', sport: '', team: '', position: '', classYear: '', location: '' });
    closeModal();
  };

  const handleCampaignSubmit = (event: FormEvent) => {
    event.preventDefault();
    addCampaign({
      brand: campaignForm.brand,
      athleteId: campaignForm.athleteId || defaultAthleteId,
      value: Number(campaignForm.value),
      stage: campaignForm.stage,
    });
    setCampaignForm({ brand: '', athleteId: defaultAthleteId, value: '', stage: 'pitching' });
    closeModal();
  };

  const handleTaskSubmit = (event: FormEvent) => {
    event.preventDefault();
    addTask({ ...taskForm, athleteId: taskForm.athleteId || defaultAthleteId });
    setTaskForm({ title: '', athleteId: defaultAthleteId, dueDate: '', priority: 'medium' });
    closeModal();
  };

  return (
    <Dialog open={activeModal !== null} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {activeModal === 'athlete' && (
          <form className="space-y-4" onSubmit={handleAthleteSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'name', label: 'Full name' },
                { key: 'sport', label: 'Sport' },
                { key: 'team', label: 'Team' },
                { key: 'position', label: 'Position' },
                { key: 'classYear', label: 'Class year' },
                { key: 'location', label: 'Location' },
              ].map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <Label htmlFor={field.key}>{field.label}</Label>
                  <Input
                    id={field.key}
                    required
                    value={athleteForm[field.key as keyof typeof athleteForm]}
                    onChange={(event) =>
                      setAthleteForm((prev) => ({ ...prev, [field.key]: event.target.value }))
                    }
                  />
                </div>
              ))}
            </div>
            <Button type="submit" className="w-full">Save athlete</Button>
          </form>
        )}

        {activeModal === 'campaign' && (
          <form className="space-y-4" onSubmit={handleCampaignSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="brand">Brand / campaign</Label>
              <Input id="brand" required value={campaignForm.brand} onChange={(event) => setCampaignForm((prev) => ({ ...prev, brand: event.target.value }))} />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Athlete</Label>
                <Select value={campaignForm.athleteId} onValueChange={(value) => setCampaignForm((prev) => ({ ...prev, athleteId: value }))} disabled={!hasAthletes}>
                  <SelectTrigger><SelectValue placeholder="Select athlete" /></SelectTrigger>
                  <SelectContent>
                    {athletes.map((athlete) => (<SelectItem key={athlete.id} value={athlete.id}>{athlete.name}</SelectItem>))}
                  </SelectContent>
                </Select>
                {!hasAthletes && <p className="text-xs text-muted-foreground">Add an athlete first to create a campaign.</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="value">Campaign value</Label>
                <Input id="value" required min={1000} type="number" value={campaignForm.value} onChange={(event) => setCampaignForm((prev) => ({ ...prev, value: event.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Stage</Label>
              <Select value={campaignForm.stage} onValueChange={(value) => setCampaignForm((prev) => ({ ...prev, stage: value as CampaignStage }))}>
                <SelectTrigger><SelectValue placeholder="Select stage" /></SelectTrigger>
                <SelectContent>
                  {stageOptions.map((option) => (<SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={!hasAthletes}>Create campaign</Button>
          </form>
        )}

        {activeModal === 'task' && (
          <form className="space-y-4" onSubmit={handleTaskSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="task-title">Task title</Label>
              <Input id="task-title" required value={taskForm.title} onChange={(event) => setTaskForm((prev) => ({ ...prev, title: event.target.value }))} />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Athlete</Label>
                <Select value={taskForm.athleteId} onValueChange={(value) => setTaskForm((prev) => ({ ...prev, athleteId: value }))} disabled={!hasAthletes}>
                  <SelectTrigger><SelectValue placeholder="Select athlete" /></SelectTrigger>
                  <SelectContent>
                    {athletes.map((athlete) => (<SelectItem key={athlete.id} value={athlete.id}>{athlete.name}</SelectItem>))}
                  </SelectContent>
                </Select>
                {!hasAthletes && <p className="text-xs text-muted-foreground">Add an athlete first to create a task.</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dueDate">Due date</Label>
                <Input id="dueDate" required type="date" value={taskForm.dueDate} onChange={(event) => setTaskForm((prev) => ({ ...prev, dueDate: event.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select value={taskForm.priority} onValueChange={(value) => setTaskForm((prev) => ({ ...prev, priority: value as typeof taskForm.priority }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={!hasAthletes}>Create task</Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
