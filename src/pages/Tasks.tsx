import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, List, LayoutGrid, GripVertical } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { tasks, getAthlete, formatDate, isPastDue, TaskStatus } from '@/lib/data';
import { cn } from '@/lib/utils';

const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

const columns: { key: TaskStatus; label: string; color: string }[] = [
  { key: 'todo', label: 'To Do', color: 'bg-muted' },
  { key: 'in-progress', label: 'In Progress', color: 'bg-info/10' },
  { key: 'review', label: 'Review', color: 'bg-warning/10' },
  { key: 'done', label: 'Done', color: 'bg-success/10' },
];

const priorityColors: Record<string, string> = {
  urgent: 'bg-destructive/10 text-destructive border-destructive/20',
  high: 'bg-warning/10 text-warning border-warning/20',
  medium: 'bg-info/10 text-info border-info/20',
  low: 'bg-muted text-muted-foreground border-border',
};

export default function Tasks() {
  const [view, setView] = useState<'kanban' | 'list'>('kanban');

  return (
    <AppLayout>
      <motion.div 
        className="h-full flex flex-col"
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <motion.div variants={fadeIn} className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display font-semibold tracking-tight">Tasks</h1>
            <p className="text-muted-foreground mt-1">
              Track deadlines and manage deliverables
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-border rounded-lg p-1">
              <Button
                variant={view === 'kanban' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setView('kanban')}
                className="gap-1.5"
              >
                <LayoutGrid className="h-4 w-4" />
                Board
              </Button>
              <Button
                variant={view === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setView('list')}
                className="gap-1.5"
              >
                <List className="h-4 w-4" />
                List
              </Button>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </div>
        </motion.div>

        {/* Kanban Board */}
        {view === 'kanban' && (
          <motion.div 
            variants={fadeIn}
            className="flex-1 overflow-x-auto"
          >
            <div className="flex gap-4 h-full min-w-max pb-4">
              {columns.map((column) => {
                const columnTasks = tasks.filter(t => t.status === column.key);
                
                return (
                  <div 
                    key={column.key}
                    className="w-80 flex flex-col bg-surface rounded-xl border border-border"
                  >
                    {/* Column Header */}
                    <div className={cn(
                      "px-4 py-3 border-b border-border flex items-center justify-between",
                      column.color,
                      "rounded-t-xl"
                    )}>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">{column.label}</h3>
                        <span className="text-xs text-muted-foreground bg-background/50 px-2 py-0.5 rounded-full">
                          {columnTasks.length}
                        </span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    {/* Tasks */}
                    <div className="flex-1 p-3 space-y-2 overflow-y-auto">
                      {columnTasks.map((task) => {
                        const athlete = getAthlete(task.athleteId);
                        const isOverdue = isPastDue(task.dueDate) && task.status !== 'done';
                        
                        return (
                          <div
                            key={task.id}
                            className={cn(
                              "p-3 rounded-lg bg-card border border-border cursor-pointer group",
                              "hover:border-border-strong hover:shadow-sm transition-all duration-200",
                              isOverdue && "border-destructive/30 bg-destructive/5"
                            )}
                          >
                            <div className="flex items-start gap-2">
                              <GripVertical className="h-4 w-4 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 cursor-grab" />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm mb-1">{task.title}</h4>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Badge 
                                    variant="outline" 
                                    className={cn("text-[10px] capitalize", priorityColors[task.priority])}
                                  >
                                    {task.priority}
                                  </Badge>
                                  {athlete && (
                                    <span className="text-xs text-muted-foreground">
                                      {athlete.name.split(' ')[0]}
                                    </span>
                                  )}
                                </div>
                                <div className={cn(
                                  "text-xs mt-2",
                                  isOverdue ? "text-destructive font-medium" : "text-muted-foreground"
                                )}>
                                  {isOverdue ? 'Overdue: ' : 'Due: '}
                                  {formatDate(task.dueDate)}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* List View */}
        {view === 'list' && (
          <motion.div variants={fadeIn} className="flex-1 space-y-2">
            {tasks.map((task) => {
              const athlete = getAthlete(task.athleteId);
              const isOverdue = isPastDue(task.dueDate) && task.status !== 'done';
              
              return (
                <div
                  key={task.id}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-lg bg-card border border-border",
                    "hover:border-border-strong hover:shadow-sm transition-all duration-200 cursor-pointer",
                    isOverdue && "border-destructive/30 bg-destructive/5"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {athlete?.name} • Due {formatDate(task.dueDate)}
                    </p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={cn("capitalize", priorityColors[task.priority])}
                  >
                    {task.priority}
                  </Badge>
                  <Badge variant="secondary" className="capitalize">
                    {task.status}
                  </Badge>
                </div>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </AppLayout>
  );
}
