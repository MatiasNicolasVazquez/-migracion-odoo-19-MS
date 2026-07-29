"use client";

import Link from "next/link";
import type { ModuleDef } from "@/lib/types";
import type { ModuleStatusRow, TestProgressRow } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import {
  checklistProgress,
  displayName,
  getBlockers,
  isReadyToTest,
} from "@/lib/status";
import { CATEGORY_LABELS } from "@/data/modules";

const PRIORITY_STYLE: Record<string, string> = {
  P0: "bg-[#1d1d1f] text-white",
  P1: "bg-[#424245] text-white",
  P2: "bg-[#e8e8ed] text-[#1d1d1f]",
  P3: "bg-[#f5f5f7] text-[#86868b]",
};

export function ModuleTable({
  modules,
  statuses,
  progress,
}: {
  modules: ModuleDef[];
  statuses: Record<string, ModuleStatusRow>;
  progress: TestProgressRow[];
}) {
  return (
    <div className="apple-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-[14px]">
          <thead className="border-b border-[var(--border)] text-[12px] font-medium text-[var(--muted)]">
            <tr>
              <th className="px-5 py-3.5 font-medium">Prioridad</th>
              <th className="px-5 py-3.5 font-medium">Módulo</th>
              <th className="px-5 py-3.5 font-medium">Deps</th>
              <th className="px-5 py-3.5 font-medium">Checklist</th>
              <th className="px-5 py-3.5 font-medium">Estado</th>
              <th className="px-5 py-3.5 font-medium">Asignado</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((mod) => {
              const st = statuses[mod.id];
              const blockers = getBlockers(mod, statuses);
              const ready = isReadyToTest(mod, statuses);
              const { done, total, pct } = checklistProgress(
                mod.id,
                progress,
                mod.testPlan.length,
              );
              return (
                <tr
                  key={mod.id}
                  className="border-b border-[var(--border)] last:border-0 transition-colors hover:bg-[#fbfbfd]"
                >
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-[-0.01em] ${PRIORITY_STYLE[mod.priority]}`}
                    >
                      {mod.priority}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/module/${mod.id}`}
                      className="group block max-w-md"
                    >
                      <span className="font-medium tracking-[-0.01em] text-[var(--ink)] transition-colors group-hover:text-[var(--accent)]">
                        {mod.displayName}
                      </span>
                      <span className="mt-0.5 block font-mono text-[12px] text-[var(--muted)]">
                        {mod.technicalName}
                      </span>
                      <span className="mt-1 block text-[12px] text-[var(--muted)]">
                        {CATEGORY_LABELS[mod.category]}
                        {ready ? (
                          <span className="ml-2 text-[var(--green)]">
                            · listo
                          </span>
                        ) : null}
                      </span>
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    {mod.depends.length === 0 ? (
                      <span className="text-[var(--muted)]">—</span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {mod.depends.map((d) => {
                          const blocked = blockers.includes(d);
                          return (
                            <Link
                              key={d}
                              href={`/module/${d}`}
                              className={`rounded-full px-2 py-0.5 font-mono text-[11px] transition-opacity hover:opacity-80 ${
                                blocked
                                  ? "bg-[#fff0ed] text-[#c93400]"
                                  : "bg-[#e8f8ee] text-[#1b7a3d]"
                              }`}
                              title={displayName(d)}
                            >
                              {d}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="min-w-[110px]">
                      <div className="mb-1.5 flex justify-between text-[12px] text-[var(--muted)]">
                        <span>
                          {done}/{total}
                        </span>
                        <span>{pct}%</span>
                      </div>
                      <div className="apple-progress">
                        <span style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={st?.status ?? "pending"} />
                  </td>
                  <td className="px-5 py-4 text-[var(--muted)]">
                    {st?.assignee || "—"}
                  </td>
                </tr>
              );
            })}
            {modules.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-14 text-center text-[var(--muted)]"
                >
                  Ningún módulo coincide con los filtros.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
