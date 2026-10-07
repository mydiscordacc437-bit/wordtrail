import { supabase, isSupabaseConfigured, isSupabaseReady } from './config.js';

export { isSupabaseConfigured, isSupabaseReady };

function requireClient() {
  if (!supabase) {
    throw new Error('Cloud accounts are not configured. Add your Supabase URL and public anon key in js/config.js.');
  }
  return supabase;
}

export async function getCurrentSession() {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session || null;
}

export function subscribeToAuthChanges(callback) {
  if (!supabase) return () => {};
  const { data } = supabase.auth.onAuthStateChange((event, session) => callback(event, session));
  return () => data.subscription.unsubscribe();
}

export async function signInWithEmail(email, password) {
  const client = requireClient();
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUpWithEmail(email, password, username) {
  const client = requireClient();
  const cleanName = String(username || '').replace(/[<>\u0000-\u001f\u007f-\u009f]/g, '').trim().slice(0, 40);
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: { data: { username: cleanName } }
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const client = requireClient();
  const { error } = await client.auth.signOut();
  if (error) throw error;
}
