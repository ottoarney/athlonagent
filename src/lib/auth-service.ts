import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { getStoredRole, isUserRole, setStoredRole, UserRole } from '@/lib/auth-flow';
import { supabaseEnv } from './supabase-env';

export type AuthUser = User;

export function isAuthEnabled() {
  return Boolean(supabase);
}

export async function signInWithGoogle(role?: UserRole) {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.');
  }

  if (role) {
    setStoredRole(role);
  }

  const selectedRole = role ?? getStoredRole();
  const redirectTo = supabaseEnv.redirectTo ?? `${window.location.origin}/auth/callback`;

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      ...(selectedRole ? { data: { role: selectedRole } } : {}),
    },
  });

  if (error) {
    throw error;
  }
}

export async function signInWithPassword(email: string, password: string) {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  return data;
}

export async function signUpWithPassword(email: string, password: string, role: UserRole) {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.');
  }

  setStoredRole(role);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
      },
      emailRedirectTo: supabaseEnv.redirectTo ?? `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
}

export async function getSession() {
  if (!supabase) return { session: null as Session | null };

  const { data } = await supabase.auth.getSession();
  return data;
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function upsertProfile(userId: string, role: UserRole, fullName?: string | null) {
  if (!supabase) return;

  await (supabase as any).from('profiles').upsert(
    {
      id: userId,
      role,
      full_name: fullName ?? null,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' },
  );
}

export async function resolveUserRole(user: User | null): Promise<UserRole | null> {
  if (!user) return null;

  const metadataRole = user.user_metadata?.role;
  if (isUserRole(metadataRole)) {
    setStoredRole(metadataRole);
    return metadataRole;
  }

  if (supabase) {
    const { data } = await (supabase as any).from('profiles').select('role').eq('id', user.id).maybeSingle();
    if (isUserRole(data?.role)) {
      setStoredRole(data.role);
      return data.role;
    }
  }

  return getStoredRole();
}

export function onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
  if (!supabase) {
    return { data: { subscription: { unsubscribe: () => undefined } } };
  }

  return supabase.auth.onAuthStateChange(callback);
}
