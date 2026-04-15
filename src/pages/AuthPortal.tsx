import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getStoredRole, isUserRole, setStoredRole, UserRole } from '@/lib/auth-flow';
import { isAuthEnabled, signInWithGoogle, signInWithPassword, signUpWithPassword } from '@/lib/auth-service';
import { toast } from 'sonner';
import { Logo } from '@/components/brand/Logo';

export default function AuthPortal() {
  const navigate = useNavigate();
  const { mode, role } = useParams<{ mode: 'signup' | 'login'; role: string }>();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const safeMode = location.pathname.startsWith('/login') || mode === 'login' ? 'login' : 'signup';
  const selectedRole: UserRole = isUserRole(role) ? role : getStoredRole() ?? 'agent';

  const redirectAfterAuth = (resolvedRole: UserRole) => {
    const target = resolvedRole === 'agent' ? '/dashboard' : '/dashboard?view=athlete';
    navigate(target);
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await signInWithGoogle(selectedRole);
      toast.success('Redirecting to Google…');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to start Google sign-in');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      setStoredRole(selectedRole);
      if (safeMode === 'signup') {
        await signUpWithPassword(email, password, selectedRole);
        toast.success('Account created. Check your email to confirm, then sign in.');
      } else {
        await signInWithPassword(email, password);
        toast.success('Signed in successfully.');
        redirectAfterAuth(selectedRole);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface p-4 md:p-8">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-border bg-background shadow-xl">
        <div className="grid lg:grid-cols-[1.1fr_1fr]">
          <div className="relative overflow-hidden border-b lg:border-b-0 lg:border-r border-border p-8 md:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--accent)/0.18),transparent_40%)]" />
            <div className="relative space-y-6">
              <Link
                to="/"
                aria-label="Athlon home"
                className="inline-flex w-fit items-center rounded-lg px-1 py-1 -ml-1 transition duration-300 hover:opacity-85"
              >
                <Logo size="md" priority />
              </Link>
              <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" /> Back to Athlon
              </Link>
              <Badge className="rounded-full border-accent/30 bg-accent/15 text-foreground">{safeMode === 'signup' ? 'Role onboarding' : 'Role sign-in'}</Badge>
              <h1 className="text-4xl md:text-5xl leading-[0.95] capitalize">{safeMode === 'signup' ? 'Build your' : 'Enter your'} {selectedRole} workspace.</h1>
              <p className="text-muted-foreground">Athlon keeps athlete communication, deadlines, and deal execution aligned in one operational system.</p>
              <div className="space-y-3 text-sm">
                {['Google OAuth + email fallback', 'Role-aware routing and onboarding', 'Expandable permissions + profile model'].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-8 md:p-10">
            {!isAuthEnabled() && (
              <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                Supabase env vars are missing. Configure <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> to enable live auth.
              </div>
            )}
            <Link
              to="/"
              aria-label="Athlon home"
              className="mb-6 inline-flex w-fit items-center rounded-lg px-1 py-1 -ml-1 transition duration-300 hover:opacity-85 lg:hidden"
            >
              <Logo size="md" />
            </Link>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">{safeMode === 'signup' ? 'Create account' : 'Sign in'}</h2>
              <Button variant="ghost" className="capitalize" onClick={() => navigate(`/${safeMode}/${selectedRole === 'agent' ? 'athlete' : 'agent'}`)}>
                Switch to {selectedRole === 'agent' ? 'athlete' : 'agent'}
              </Button>
            </div>

            <div className="space-y-3">
              <Button disabled={loading || !isAuthEnabled()} onClick={handleGoogle} className="w-full h-11">
                Continue with Google
              </Button>
              <div className="relative text-center text-xs text-muted-foreground py-2">
                <span className="bg-background px-2 relative z-10">or use email</span>
                <div className="absolute inset-x-0 top-1/2 border-t border-border" />
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="work@email.com" />
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} placeholder="••••••••" />
                <Button disabled={loading || !isAuthEnabled()} className="w-full h-11" type="submit">
                  {safeMode === 'signup' ? 'Create account' : 'Sign in'} <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </form>
            </div>

            <div className="mt-6 text-sm text-muted-foreground">
              {safeMode === 'signup' ? 'Already have access?' : "Need an account?"}{' '}
              <button className="text-foreground underline underline-offset-4" onClick={() => navigate(`/${safeMode === 'signup' ? 'login' : 'signup'}/${selectedRole}`)}>
                {safeMode === 'signup' ? 'Sign in instead' : 'Create account'}
              </button>
            </div>

            <div className="mt-8 rounded-xl border border-border bg-surface p-4 text-sm">
              <p className="font-medium">Path selected</p>
              <p className="text-muted-foreground mt-1 capitalize">{selectedRole} • {safeMode}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
