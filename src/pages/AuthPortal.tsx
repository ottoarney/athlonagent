import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getStoredRole, isUserRole, setStoredRole } from '@/lib/auth-flow';

export default function AuthPortal() {
  const navigate = useNavigate();
  const { mode, role } = useParams<{ mode: 'signup' | 'login'; role: string }>();

  if (!mode || (mode !== 'signup' && mode !== 'login') || !isUserRole(role)) {
    return <Navigate to="/auth" replace />;
  }

  const selectedRole = role;
  const counterpart = selectedRole === 'agent' ? 'athlete' : 'agent';
  const storedRole = getStoredRole();

  if (storedRole !== selectedRole) {
    setStoredRole(selectedRole);
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-3xl border border-border bg-card p-6 md:p-8 shadow-lg">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-5">
          <ArrowLeft className="h-4 w-4" /> Back to landing page
        </Link>

        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <h1 className="text-3xl mt-4 capitalize">{mode === 'signup' ? 'Create your' : 'Sign in to'} {selectedRole} portal</h1>
        <p className="text-muted-foreground mt-3">
          This is a functional placeholder for the {selectedRole} {mode} flow. Hook this route into your auth backend when ready.
        </p>

        <div className="mt-7 rounded-2xl border border-border bg-background p-4 space-y-3 text-sm">
          <p><span className="font-medium">Role:</span> <span className="capitalize">{selectedRole}</span></p>
          <p><span className="font-medium">Flow:</span> {mode === 'signup' ? 'Get Started / Request Access' : 'Sign In'}</p>
          <p><span className="font-medium">Persistence:</span> Role is saved to local storage for intentional routing.</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={() => navigate('/dashboard')}>Open Dashboard Preview</Button>
          <Button variant="outline" onClick={() => navigate(`/auth?mode=${mode}`)}>Change role</Button>
          <Button variant="ghost" onClick={() => navigate(`/${mode}/${counterpart}`)} className="capitalize">
            Continue as {counterpart}
          </Button>
        </div>
      </div>
    </div>
  );
}
