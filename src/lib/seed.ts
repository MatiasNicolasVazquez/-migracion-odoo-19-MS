import { MODULES } from "@/data/modules";
import type { SupabaseClient } from "@supabase/supabase-js";

const KNOWN_IDS = new Set(MODULES.map((m) => m.id));

/** Upserts pending rows for any missing modules / test steps. */
export async function ensureSeed(sb: SupabaseClient): Promise<void> {
  const statusRows = MODULES.map((m) => ({
    module_id: m.id,
    status: "pending" as const,
  }));

  const { error: stErr } = await sb
    .from("module_status")
    .upsert(statusRows, { onConflict: "module_id", ignoreDuplicates: true });
  if (stErr) throw stErr;

  const stepRows = MODULES.flatMap((m) =>
    m.testPlan.map((step) => ({
      module_id: m.id,
      step_id: step.id,
      done: false,
      result: "pending" as const,
    })),
  );

  const chunkSize = 80;
  for (let i = 0; i < stepRows.length; i += chunkSize) {
    const chunk = stepRows.slice(i, i + chunkSize);
    const { error } = await sb.from("test_progress").upsert(chunk, {
      onConflict: "module_id,step_id",
      ignoreDuplicates: true,
    });
    if (error) throw error;
  }
}

/** Deletes modules that no longer exist in the app catalog. */
export async function removeOrphanModules(
  sb: SupabaseClient,
  existingIds: string[],
): Promise<boolean> {
  const orphans = existingIds.filter((id) => !KNOWN_IDS.has(id));
  if (orphans.length === 0) return false;

  const { error: progErr } = await sb
    .from("test_progress")
    .delete()
    .in("module_id", orphans);
  if (progErr) throw progErr;

  const { error: stErr } = await sb
    .from("module_status")
    .delete()
    .in("module_id", orphans);
  if (stErr) throw stErr;

  return true;
}
