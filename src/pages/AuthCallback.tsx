import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession, resolveUserRole } from '@/lib/auth-service';
import { getDashboardRoute } from '@/lib/auth-flow';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handle = async () => {
      const { session } = await getSession();

      if (!session?.user) {
        navigate('/signup', { replace: true });
        return;
      }

      await resolveUserRole(session.user);
      navigate(getDashboardRoute(), { replace: true });
    };

    void handle();
  }, [navigate]);

  return <div className="min-h-screen grid place-items-center text-muted-foreground">Finalizing secure sign-in…</div>;
}
