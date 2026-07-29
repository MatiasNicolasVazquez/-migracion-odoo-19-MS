import type { ModuleDef } from "@/lib/types";
import { MODULE_BY_ID } from "@/data/modules";
import type {
  ModuleStatusRow,
  ModuleStatusValue,
  TestProgressRow,
} from "@/lib/types";

export function getBlockers(
  mod: ModuleDef,
  statuses: Record<string, ModuleStatusRow>,
): string[] {
  return mod.depends.filter((depId) => {
    const st = statuses[depId]?.status;
    return st !== "passed";
  });
}

export function isReadyToTest(
  mod: ModuleDef,
  statuses: Record<string, ModuleStatusRow>,
): boolean {
  const current = statuses[mod.id]?.status;
  if (current === "passed" || current === "failed") return false;
  return getBlockers(mod, statuses).length === 0;
}

export function checklistProgress(
  moduleId: string,
  progress: TestProgressRow[],
  totalSteps: number,
): { done: number; total: number; pct: number } {
  const rows = progress.filter((p) => p.module_id === moduleId);
  const done = rows.filter((r) => r.done || r.result === "pass").length;
  const total = totalSteps || rows.length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return { done, total, pct };
}

export function countByStatus(
  statuses: Record<string, ModuleStatusRow>,
  moduleIds: string[],
): Record<ModuleStatusValue, number> {
  const counts: Record<ModuleStatusValue, number> = {
    pending: 0,
    in_progress: 0,
    blocked: 0,
    passed: 0,
    failed: 0,
  };
  for (const id of moduleIds) {
    const s = statuses[id]?.status ?? "pending";
    counts[s] += 1;
  }
  return counts;
}

export function displayName(id: string): string {
  return MODULE_BY_ID[id]?.displayName ?? id;
}
