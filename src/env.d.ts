/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Supabase project URL, e.g. https://xxxx.supabase.co */
  readonly VITE_SUPABASE_URL?: string;
  /** Supabase anon/publishable key. Client-side — see supabase/schema.sql. */
  readonly VITE_SUPABASE_ANON_KEY?: string;
  /** Fixed string identifying this user's rows. A shared secret, not auth. */
  readonly VITE_OWNER_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
