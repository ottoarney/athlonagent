import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getDashboardRoute, setStoredRole, UserRole } from '@/lib/auth-flow';
import { getSession, upsertProfile } from '@/lib/auth-service';
import { Logo } from '@/components/brand/Logo';

export default function RoleOnboarding() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const chooseRole = async (role: UserRole) => {
    setSaving(true);
    setStoredRole(role);
    const { session } = await getSession();

    if (session?.user?.id) {
      await upsertProfile(session.user.id, role, session.user.user_metadata?.full_name as string | undefined);
    }

    navigate(getDashboardRoute(role));
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-8">
        <Link to="/" aria-label="Athlon home" className="inline-flex items-center rounded-lg px-1 py-1 -ml-1 transition duration-300 hover:opacity-85">
          <Logo size="md" priority />
        </Link>
        <p className="text-sm uppercase tracking-[0.12em] text-muted-foreground">Onboarding</p>
        <h1 className="mt-2 text-4xl">Choose your Athlon role</h1>
        <p className="mt-3 text-muted-foreground">We tailor your workflows, permissions, and landing experience based on role.</p>
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <Button disabled={saving} variant="outline" className="h-24 text-left justify-start" onClick={() => chooseRole('agent')}>
            Agent / Agency
          </Button>
          <Button disabled={saving} variant="outline" className="h-24 text-left justify-start" onClick={() => chooseRole('athlete')}>
            Athlete
          </Button>
        </div>
      </div>
    </div>
  );
}
