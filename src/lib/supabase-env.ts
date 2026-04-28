export const supabaseEnv = {
  url: import.meta.env.VITE_SUPABASE_URL,
  publishableKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY,
  redirectTo: import.meta.env.VITE_AUTH_REDIRECT_TO,
  enableGoogleAuth: import.meta.env.VITE_ENABLE_GOOGLE_AUTH,
};

export const isSupabaseConfigured = Boolean(supabaseEnv.url && supabaseEnv.publishableKey);

export const isGoogleAuthEnabled = supabaseEnv.enableGoogleAuth !== 'false';
