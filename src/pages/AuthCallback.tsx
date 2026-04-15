import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession, resolveUserRole } from '@/lib/auth-service';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handle = async () => {
      const { session } = await getSession();
      const role = await resolveUserRole(session?.user ?? null);

      if (!session?.user) {
        navigate('/signup/agent', { replace: true });
        return;
      }

      if (!role) {
        navigate('/onboarding/role', { replace: true });
        return;
      }

      navigate(role === 'agent' ? '/dashboard' : '/dashboard?view=athlete', { replace: true });
    };

    void handle();
  }, [navigate]);

  return <div className="min-h-screen grid place-items-center text-muted-foreground">Finalizing secure sign-in…</div>;
}
