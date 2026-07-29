import { MODULES } from "@/data/modules";
import type { SupabaseClient } from "@supabase/supabase-js";

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

  // Upsert in chunks to avoid payload limits
  const chunkSize = 80;
  for (let i = 0; i < stepRows.length; i += chunkSize) {
    const chunk = stepRows.slice(i, i + chunkSize);
    const { error } = await sb
      .from("test_progress")
      .upsert(chunk, {
        onConflict: "module_id,step_id",
        ignoreDuplicates: true,
      });
    if (error) throw error;
  }
}
