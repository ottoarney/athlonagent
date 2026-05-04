import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useDashboardData } from '@/context/dashboard-context';
import { signOut } from '@/lib/auth-service';
import { clearStoredRole } from '@/lib/auth-flow';

interface AppHeaderProps {
  showAuthLinks?: boolean;
}

export function AppHeader({ showAuthLinks = false }: AppHeaderProps) {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useDashboardData();

  const handleSignOut = async () => {
    await signOut();
    clearStoredRole();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6 gap-4">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search athletes, tasks, deals, campaigns, brands..."
            className="pl-10 bg-surface border-border h-10"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">

        {showAuthLinks ? (
          <div className="flex items-center gap-2 ml-2">
            <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => navigate('/login')}>
              Sign in
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/demo')}>
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
              <DropdownMenuItem onClick={() => void handleSignOut()}>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
