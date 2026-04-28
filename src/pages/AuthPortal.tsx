import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getDashboardRoute, setStoredRole } from '@/lib/auth-flow';
import { isAuthEnabled, isGoogleOAuthEnabled, signInWithGoogle, signInWithPassword, signUpWithPasswordAndProfile } from '@/lib/auth-service';
import { toast } from 'sonner';
import { Logo } from '@/components/brand/Logo';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AuthPortal() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [agencyCompanyName, setAgencyCompanyName] = useState('');
  const [signupRole, setSignupRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authMessage, setAuthMessage] = useState<string | null>(null);

  const safeMode = location.pathname.startsWith('/login') ? 'login' : 'signup';

  const redirectAfterAuth = () => {
    navigate(getDashboardRoute());
  };

  const handleGoogle = async () => {
    setGoogleError(null);
    setAuthError(null);
    setAuthMessage(null);

    if (!isAuthEnabled()) {
      setStoredRole('agent');
      toast.success('Demo sign-in complete.');
      redirectAfterAuth();
      return;
    }

    if (!isGoogleOAuthEnabled()) {
      setGoogleError('Google sign-in is not enabled yet. Please use email and password for now.');
      return;
    }

    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Redirecting to Google…');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to start Google sign-in';
      if (message.toLowerCase().includes('google sign-in is not enabled yet') || message.toLowerCase().includes('unsupported provider')) {
        setGoogleError('Google sign-in is not enabled yet. Please use email and password for now.');
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setAuthError(null);
    setAuthMessage(null);

    if (safeMode === 'signup') {
      if (!firstName.trim()) {
        setAuthError('First name is required.');
        return;
      }
      if (!lastName.trim()) {
        setAuthError('Last name is required.');
        return;
      }
      if (password.length < 8) {
        setAuthError('Password must be at least 8 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setAuthError('Password and confirm password must match.');
        return;
      }
    }

    setLoading(true);

    try {
      setStoredRole('agent');
      if (!isAuthEnabled()) {
        toast.success(safeMode === 'signup' ? 'Demo account created.' : 'Demo sign-in complete.');
        redirectAfterAuth();
        return;
      }

      if (safeMode === 'signup') {
        const { data, error } = await signUpWithPasswordAndProfile(email, password, {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          agencyCompanyName: agencyCompanyName.trim() || undefined,
          role: signupRole || undefined,
        });

        if (error) {
          throw new Error(error.message);
        }

        if (!data?.user && !data?.session) {
          throw new Error('Sign-up was blocked or returned an empty response. Please try again or contact support.');
        }

        if (data?.session) {
          toast.success('Account created successfully.');
          redirectAfterAuth();
        } else if (data?.user) {
          try {
            await signInWithPassword(email, password);
            toast.success('Account created successfully.');
            redirectAfterAuth();
          } catch (signInError) {
            const message = signInError instanceof Error ? signInError.message : 'Unable to sign in after signup.';
            if (message.toLowerCase().includes('email') && message.toLowerCase().includes('confirm')) {
              setAuthError('Email confirmation is still enabled in Supabase. Turn it off in Authentication → Providers → Email.');
            } else {
              setAuthError(message);
            }
          }
        }
      } else {
        await signInWithPassword(email, password);
        toast.success('Signed in successfully.');
        redirectAfterAuth();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Authentication failed';
      setAuthError(message);
      if (safeMode !== 'signup') {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 p-4 md:p-8">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-border bg-background shadow-xl">
        <div className="grid lg:min-h-[640px] lg:grid-cols-[1.1fr_1fr]">
          <div className="border-b border-border p-8 md:p-10 lg:border-b-0 lg:border-r">
            <div className="flex h-full flex-col justify-center space-y-6">
              <Link
                to="/#hero"
                aria-label="Athlon home"
                className="inline-flex w-fit items-center rounded-lg px-1 py-1 -ml-1 transition duration-300 hover:opacity-85"
              >
                <Logo size="md" priority />
              </Link>
              <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" /> Back to Athlon
              </Link>
              <h1 className="text-4xl md:text-5xl leading-[0.95]">
                {safeMode === 'signup' ? 'Build your' : 'Enter your'} agency workspace.
              </h1>
              <p className="text-muted-foreground">Athlon keeps deadlines, deal execution, and team communication aligned in one operational system.</p>
              <div className="space-y-3 text-sm">
                {['Google OAuth + email fallback', 'Agency-first dashboard routing', 'Expandable permissions + profile model'].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-8 md:p-10">
            <div className="flex h-full flex-col justify-center">
            {!isAuthEnabled() && (
              <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                Supabase env vars are missing, so this page is running in demo auth mode with dashboard routing.
              </div>
            )}
            <Link
              to="/#hero"
              aria-label="Athlon home"
              className="mb-6 inline-flex w-fit items-center rounded-lg px-1 py-1 -ml-1 transition duration-300 hover:opacity-85 lg:hidden"
            >
              <Logo size="md" />
            </Link>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">{safeMode === 'signup' ? 'Create account' : 'Sign in'}</h2>
            </div>

            <div className="space-y-3">
              <Button disabled={loading} onClick={handleGoogle} className="w-full h-11">
                Continue with Google
              </Button>
              {googleError && <p className="text-sm text-destructive">{googleError}</p>}
              <div className="relative text-center text-xs text-muted-foreground py-2">
                <span className="bg-background px-2 relative z-10">or use email</span>
                <div className="absolute inset-x-0 top-1/2 border-t border-border" />
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                {safeMode === 'signup' && (
                  <>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="firstName">First name</Label>
                        <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required placeholder="Jordan" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="lastName">Last name</Label>
                        <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required placeholder="Lee" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="companyName">Agency / Company name (optional)</Label>
                      <Input id="companyName" value={agencyCompanyName} onChange={(e) => setAgencyCompanyName(e.target.value)} placeholder="Athlon Sports" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="role">Role (optional)</Label>
                      <Select value={signupRole} onValueChange={setSignupRole}>
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Agent">Agent</SelectItem>
                          <SelectItem value="Agency Owner">Agency Owner</SelectItem>
                          <SelectItem value="Marketing Manager">Marketing Manager</SelectItem>
                          <SelectItem value="Athlete Ops">Athlete Ops</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="work@email.com" />
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} placeholder="••••••••" />
                {safeMode === 'signup' && (
                  <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8} placeholder="Confirm password" />
                )}
                {authError && <p className="text-sm text-destructive">{authError}</p>}
                {authMessage && <p className="text-sm text-emerald-600">{authMessage}</p>}
                <Button disabled={loading} className="w-full h-11" type="submit">
                  {safeMode === 'signup' ? 'Create account' : 'Sign in'} <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </form>
            </div>

            <div className="mt-6 text-sm text-muted-foreground">
              {safeMode === 'signup' ? 'Already have access?' : 'Need an account?'}{' '}
              <button className="text-foreground underline underline-offset-4" onClick={() => navigate(`/${safeMode === 'signup' ? 'login' : 'signup'}`)}>
                {safeMode === 'signup' ? 'Sign in instead' : 'Create account'}
              </button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
