import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getStoredRole } from '@/lib/auth-flow';
import { getSession, isAuthEnabled } from '@/lib/auth-service';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      if (!isAuthEnabled()) {
        if (isMounted) {
          setIsAuthenticated(Boolean(getStoredRole()));
          setIsChecking(false);
        }
        return;
      }

      const { session } = await getSession();
      if (isMounted) {
        setIsAuthenticated(Boolean(session?.user));
        setIsChecking(false);
      }
    };

    void checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
        <div className="rounded-xl border border-border bg-card px-5 py-4 text-sm text-muted-foreground">Checking access…</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

