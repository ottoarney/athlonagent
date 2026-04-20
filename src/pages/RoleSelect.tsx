import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthMode, getStoredRole, setStoredRole, UserRole } from '@/lib/auth-flow';
import { Logo } from '@/components/brand/Logo';

function isAuthMode(value: string | null): value is AuthMode {
  return value === 'signup' || value === 'login';
}

export default function RoleSelect() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode: AuthMode = isAuthMode(searchParams.get('mode')) ? searchParams.get('mode') : 'signup';
  const storedRole = getStoredRole();

  const handleRoleSelect = (role: UserRole) => {
    setStoredRole(role);
    navigate(`/${mode}/${role}`);
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-6 md:p-8 shadow-lg">
        <Link to="/" aria-label="Athlon home" className="mb-5 inline-flex items-center rounded-lg px-1 py-1 -ml-1 transition duration-300 hover:opacity-85">
          <Logo size="md" priority />
        </Link>
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-5">
          <ArrowLeft className="h-4 w-4" /> Back to landing page
        </Link>

        <p className="text-sm uppercase tracking-[0.12em] text-muted-foreground">{mode === 'signup' ? 'Onboarding' : 'Sign in'}</p>
        <h1 className="text-3xl md:text-4xl mt-2">Choose your portal</h1>
        <p className="text-muted-foreground mt-3">Select your path so Athlon can route and personalize your experience.</p>

        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <button className="rounded-2xl border border-border bg-surface p-5 text-left hover:border-[#01FB64] transition-all" onClick={() => handleRoleSelect('agent')}>
            <p className="font-semibold text-lg">Agent / Agency</p>
            <p className="text-sm text-muted-foreground mt-2">Manage athletes, deals, tasks, schedules, and deliverables in one place.</p>
          </button>
          <button className="rounded-2xl border border-border bg-surface p-5 text-left hover:border-[#01FB64] transition-all" onClick={() => handleRoleSelect('athlete')}>
            <p className="font-semibold text-lg">Athlete</p>
            <p className="text-sm text-muted-foreground mt-2">Track obligations, view deal status, and stay aligned with your team.</p>
          </button>
        </div>

        {storedRole && (
          <div className="mt-6 rounded-xl border border-border bg-background p-4 flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">Last selected portal: <span className="font-medium text-foreground capitalize">{storedRole}</span></p>
            <Button variant="outline" onClick={() => navigate(`/${mode}/${storedRole}`)}>Continue</Button>
          </div>
        )}
      </div>
    </div>
  );
}
