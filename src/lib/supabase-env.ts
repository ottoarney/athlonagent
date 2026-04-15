export const supabaseEnv = {
  url: import.meta.env.VITE_SUPABASE_URL,
  publishableKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  redirectTo: import.meta.env.VITE_AUTH_REDIRECT_TO,
};

export const isSupabaseConfigured = Boolean(supabaseEnv.url && supabaseEnv.publishableKey);
