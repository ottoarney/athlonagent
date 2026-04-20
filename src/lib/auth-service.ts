import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { getStoredRole, setStoredRole } from '@/lib/auth-flow';
import { supabaseEnv } from './supabase-env';

export type AuthUser = User;

export function isAuthEnabled() {
  return Boolean(supabase);
}

export async function signInWithGoogle() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.');
  }

  setStoredRole('agent');
  const redirectTo = supabaseEnv.redirectTo ?? `${window.location.origin}/auth/callback`;

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      data: { role: 'agent' },
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

export async function signUpWithPassword(email: string, password: string) {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.');
  }

  setStoredRole('agent');

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: 'agent',
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

export async function upsertProfile(userId: string, fullName?: string | null) {
  if (!supabase) return;

  await (supabase as any).from('profiles').upsert(
    {
      id: userId,
      role: 'agent',
      full_name: fullName ?? null,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' },
  );
}

export async function resolveUserRole(user: User | null): Promise<'agent' | null> {
  if (!user) return null;

  setStoredRole('agent');

  if (supabase) {
    await (supabase as any)
      .from('profiles')
      .upsert(
        {
          id: user.id,
          role: 'agent',
          full_name: user.user_metadata?.full_name ?? null,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' },
      );
  }

  return getStoredRole() ?? 'agent';
}

export function onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
  if (!supabase) {
    return { data: { subscription: { unsubscribe: () => undefined } } };
  }

  return supabase.auth.onAuthStateChange(callback);
}
