import { Search, Plus, Bell, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { athletes, Athlete } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface AppHeaderProps {
  selectedAthlete: Athlete | null;
  onAthleteChange: (athlete: Athlete | null) => void;
  showAuthLinks?: boolean;
}

export function AppHeader({ selectedAthlete, onAthleteChange, showAuthLinks = false }: AppHeaderProps) {
  const [notificationCount] = useState(3);

  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search athletes, tasks, deals..." 
            className="pl-10 bg-surface border-border h-10"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {/* Create Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              <Plus className="h-4 w-4" />
              Create
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>New Task</DropdownMenuItem>
            <DropdownMenuItem>New Event</DropdownMenuItem>
            <DropdownMenuItem>New Deal</DropdownMenuItem>
            <DropdownMenuItem>New Content</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>New Athlete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Athlete Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 min-w-[140px] justify-between">
              {selectedAthlete ? (
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center text-xs font-medium">
                    {selectedAthlete.initials}
                  </div>
                  <span className="truncate">{selectedAthlete.name.split(' ')[0]}</span>
                </div>
              ) : (
                <span>All Athletes</span>
              )}
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => onAthleteChange(null)}>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-xs font-medium">All</span>
                </div>
                <span>All Athletes</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {athletes.map((athlete) => (
              <DropdownMenuItem 
                key={athlete.id} 
                onClick={() => onAthleteChange(athlete)}
                className={cn(selectedAthlete?.id === athlete.id && "bg-accent/10")}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="text-xs font-medium">{athlete.initials}</span>
                  </div>
                  <div>
                    <div className="font-medium">{athlete.name}</div>
                    <div className="text-xs text-muted-foreground">{athlete.sport}</div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-accent text-accent-foreground text-[10px] font-medium flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </Button>

        {/* Profile / Auth Links */}
        {showAuthLinks ? (
          <div className="flex items-center gap-2 ml-2">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              Sign in
            </Button>
            <Button variant="outline" size="sm">
              Request access
            </Button>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-xs font-medium text-primary-foreground">JD</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
