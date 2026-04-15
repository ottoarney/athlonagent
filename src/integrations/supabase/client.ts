import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { isSupabaseConfigured, supabaseEnv } from '@/lib/supabase-env';

let client: SupabaseClient<Database> | null = null;

if (isSupabaseConfigured) {
  client = createClient<Database>(supabaseEnv.url!, supabaseEnv.publishableKey!, {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

export const supabase = client;
