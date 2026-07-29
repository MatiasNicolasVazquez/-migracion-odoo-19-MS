const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
const publishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ?? "";

const looksLikePlaceholder =
  !url ||
  !publishableKey ||
  url.includes("TU_PROJECT_REF") ||
  publishableKey.includes("tu_publishable_key") ||
  publishableKey.includes("your_");

export const isSupabaseConfigured = !looksLikePlaceholder;
