import type { ModuleStatusValue } from "@/lib/types";
import { STATUS_LABELS } from "@/data/modules";

const ORDER: ModuleStatusValue[] = [
  "pending",
  "in_progress",
  "blocked",
  "passed",
  "failed",
];

const DOT: Record<ModuleStatusValue, string> = {
  pending: "bg-[#86868b]",
  in_progress: "bg-[#ff9500]",
  blocked: "bg-[#ff3b30]",
  passed: "bg-[#34c759]",
  failed: "bg-[#ff3b30]",
};

export function StatsBar({
  counts,
  total,
}: {
  counts: Record<ModuleStatusValue, number>;
  total: number;
}) {
  const passed = counts.passed;
  const pct = total === 0 ? 0 : Math.round((passed / total) * 100);

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
      <div className="apple-card p-5 sm:col-span-2">
        <p className="text-[13px] font-medium text-[var(--muted)]">
          Avance general
        </p>
        <p className="mt-1 text-[40px] font-semibold leading-none tracking-[-0.04em] text-[var(--ink)]">
          {pct}%
        </p>
        <p className="mt-2 text-[13px] text-[var(--muted)]">
          {passed} de {total} módulos OK
        </p>
        <div className="apple-progress mt-4">
          <span style={{ width: `${pct}%` }} />
        </div>
      </div>
      {ORDER.map((key) => (
        <div key={key} className="apple-card p-5">
          <div className="flex items-center gap-2">
            <span className={`size-1.5 rounded-full ${DOT[key]}`} />
            <p className="text-[13px] font-medium text-[var(--muted)]">
              {STATUS_LABELS[key]}
            </p>
          </div>
          <p className="mt-3 text-[28px] font-semibold leading-none tracking-[-0.03em]">
            {counts[key]}
          </p>
        </div>
      ))}
    </div>
  );
}
