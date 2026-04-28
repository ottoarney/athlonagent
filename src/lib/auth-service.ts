import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { getStoredRole, setStoredRole } from '@/lib/auth-flow';
import { isGoogleAuthEnabled, supabaseEnv } from './supabase-env';

export type AuthUser = User;

export function isAuthEnabled() {
  return Boolean(supabase);
}

export function isGoogleOAuthEnabled() {
  return isAuthEnabled() && isGoogleAuthEnabled;
}

function getAuthCallbackUrl() {
  if (typeof window === 'undefined') {
    return supabaseEnv.redirectTo ?? '/auth/callback';
  }

  const currentOriginCallback = `${window.location.origin}/auth/callback`;
  const configuredRedirect = supabaseEnv.redirectTo?.trim();

  if (!configuredRedirect) {
    return currentOriginCallback;
  }

  try {
    const configuredUrl = new URL(configuredRedirect, window.location.origin);

    if (configuredUrl.pathname !== '/auth/callback') {
      configuredUrl.pathname = '/auth/callback';
      configuredUrl.search = '';
      configuredUrl.hash = '';
    }

    if (window.location.hostname !== 'localhost' && configuredUrl.hostname === 'localhost') {
      return currentOriginCallback;
    }

    return configuredUrl.toString();
  } catch {
    return currentOriginCallback;
  }
}

export async function signInWithGoogle() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.');
  }

  if (!isGoogleAuthEnabled) {
    throw new Error('Google sign-in is not enabled yet. Please use email and password for now.');
  }

  setStoredRole('agent');
  const redirectTo = getAuthCallbackUrl();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      skipBrowserRedirect: true,
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

  if (!data?.url) {
    throw new Error('Google sign-in is not enabled yet. Please use email and password for now.');
  }

  window.location.assign(data.url);
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
  const emailRedirectTo = getAuthCallbackUrl();
  const currentOrigin = typeof window === 'undefined' ? null : window.location.origin;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: 'agent',
      },
      emailRedirectTo,
    },
  });

  console.info('[AuthPortal Debug] signup response', data);
  console.info('[AuthPortal Debug] signup error', error);
  console.info('[AuthPortal Debug] emailRedirectTo', emailRedirectTo);
  console.info('[AuthPortal Debug] window.location.origin', currentOrigin);

  return { data, error };
}

export type SignupProfileInput = {
  firstName: string;
  lastName: string;
  agencyCompanyName?: string;
  role?: string;
};

export async function signUpWithPasswordAndProfile(email: string, password: string, profile: SignupProfileInput) {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.');
  }

  setStoredRole('agent');
  const emailRedirectTo = getAuthCallbackUrl();
  const fullName = `${profile.firstName} ${profile.lastName}`.trim();

  const metadata = {
    role: 'agent',
    first_name: profile.firstName,
    last_name: profile.lastName,
    full_name: fullName,
    agency_company_name: profile.agencyCompanyName || null,
    signup_role: profile.role || null,
  };

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo,
    },
  });

  if (error) return { data, error };

  if (data?.user) {
    // MVP note: email confirmation is intentionally disabled while validating session-based signup.
    await (supabase as any).from('profiles').upsert(
      {
        id: data.user.id,
        role: 'agent',
        full_name: fullName,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' },
    );
  }

  return { data, error };
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
