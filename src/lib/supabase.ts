import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase client, built from env only — no key is ever hardcoded.
 *
 * When any of the three vars is missing the client is `null` and the whole app
 * falls back to local-only storage, exactly as it behaved in v1. That keeps
 * `npm run dev` working with no .env file at all.
 */

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

/** Identifies this user's rows. A shared secret, not authentication. */
export const OWNER_KEY = import.meta.env.VITE_OWNER_KEY?.trim() ?? '';

export const isSupabaseConfigured = Boolean(url && anonKey && OWNER_KEY);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;
