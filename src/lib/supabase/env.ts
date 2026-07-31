/** Prefer publishable key; fall back to classic anon key.
 * IMPORTANT: access env vars with static property names so Next.js
 * can inline NEXT_PUBLIC_* values into the client bundle at build time.
 */
export function getSupabaseUrl(): string {
  return (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
}

export function getSupabaseKey(): string {
  const publishable = (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? ""
  ).trim();
  const anon = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();
  return publishable || anon;
}

export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl();
  const key = getSupabaseKey();
  if (!url || !key) return false;
  if (url.includes("TU_PROJECT_REF")) return false;
  if (key.includes("tu_publishable_key") || key.includes("your_")) return false;
  return true;
}
