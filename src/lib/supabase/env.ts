function readEnv(name: string): string {
  return (process.env[name] ?? "").trim();
}

/** Prefer publishable key; fall back to classic anon key. */
export function getSupabaseUrl(): string {
  return readEnv("NEXT_PUBLIC_SUPABASE_URL");
}

export function getSupabaseKey(): string {
  return (
    readEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") ||
    readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  );
}

export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl();
  const key = getSupabaseKey();
  if (!url || !key) return false;
  if (url.includes("TU_PROJECT_REF")) return false;
  if (key.includes("tu_publishable_key") || key.includes("your_")) return false;
  return true;
}
