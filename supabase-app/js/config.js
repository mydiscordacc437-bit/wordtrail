// Integration point: add your Supabase project URL and browser-safe anon/publishable key here.
// Never put a service_role key in a browser app. RLS in ../schema.sql is mandatory.
const SUPABASE_URL = 'https://YOUR_PROJECT_REF.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
const SUPABASE_CDN = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const validProjectUrl = /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(SUPABASE_URL);
const validPublicKey = typeof SUPABASE_ANON_KEY === 'string'
  && SUPABASE_ANON_KEY.length > 20
  && !/YOUR_|PLACEHOLDER|REPLACE_ME/i.test(SUPABASE_ANON_KEY);
export const isSupabaseConfigured = validProjectUrl && validPublicKey;

let createClient = null;
// Load Supabase only when configured. If the CDN/network is unavailable, guest mode remains usable.
if (isSupabaseConfigured) {
  try {
    const supabaseModule = await import(SUPABASE_CDN);
    createClient = supabaseModule.createClient || null;
  } catch (error) {
    console.warn('Supabase client could not be loaded; continuing in local guest mode.');
  }
}

export const supabase = createClient && isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;
export const isSupabaseReady = Boolean(supabase);
