"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MODULES, sortModules } from "@/data/modules";
import {
  ModuleFilters,
  type FiltersState,
} from "@/components/ModuleFilters";
import { ModuleTable } from "@/components/ModuleTable";
import { StatsBar } from "@/components/StatsBar";
import { useMigrationData } from "@/hooks/useMigrationData";
import { countByStatus, isReadyToTest } from "@/lib/status";

const initialFilters: FiltersState = {
  q: "",
  priority: "all",
  category: "all",
  status: "all",
  readyOnly: false,
};

export function Dashboard() {
  const { statuses, progress, loading, error, connected } = useMigrationData();
  const [filters, setFilters] = useState<FiltersState>(initialFilters);

  const sorted = useMemo(() => sortModules(MODULES), []);

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return sorted.filter((m) => {
      if (filters.priority !== "all" && m.priority !== filters.priority)
        return false;
      if (filters.category !== "all" && m.category !== filters.category)
        return false;
      const st = statuses[m.id]?.status ?? "pending";
      if (filters.status !== "all" && st !== filters.status) return false;
      if (filters.readyOnly && !isReadyToTest(m, statuses)) return false;
      if (!q) return true;
      return (
        m.displayName.toLowerCase().includes(q) ||
        m.technicalName.toLowerCase().includes(q) ||
        m.summary.toLowerCase().includes(q)
      );
    });
  }, [sorted, filters, statuses]);

  const nextUp = useMemo(
    () =>
      sorted
        .filter((m) => m.priority === "P0" && isReadyToTest(m, statuses))
        .slice(0, 5),
    [sorted, statuses],
  );

  const counts = countByStatus(
    statuses,
    MODULES.map((m) => m.id),
  );

  return (
    <div className="mx-auto flex w-full max-w-[1080px] flex-col gap-10 px-5 py-12 sm:px-8 sm:py-16">
      <header className="text-center sm:text-left">
        <p className="text-[13px] font-medium text-[var(--accent)]">
          MacStation · web-macstation
        </p>
        <h1 className="mt-2 text-[40px] font-semibold leading-[1.05] tracking-[-0.045em] text-[var(--ink)] sm:text-[52px]">
          Migración Odoo
          <br className="hidden sm:block" />{" "}
          <span className="text-[var(--muted)]">17 → 19</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-[var(--muted)] sm:mx-0">
          Control compartido de {MODULES.length} módulos: prioridad por
          dependencias, plan de pruebas y estado en tiempo real.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-medium ${
              connected
                ? "bg-[#e8f8ee] text-[#1b7a3d]"
                : "bg-[#fff4e5] text-[#b25e09]"
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${
                connected ? "bg-[var(--green)]" : "bg-[var(--orange)]"
              }`}
            />
            {connected ? "Supabase conectado" : "Sin conexión remota"}
          </span>
          {loading ? (
            <span className="text-[13px] text-[var(--muted)]">Cargando…</span>
          ) : null}
        </div>
        {error ? (
          <div className="apple-card mt-6 border border-[#ffd0cc] bg-[#fff8f7] p-5 text-left text-[14px] text-[#1d1d1f]">
            <p className="font-medium">{error}</p>
            <ol className="mt-2 list-decimal space-y-1 pl-4 text-[var(--muted)]">
              <li>
                Pegá URL y publishable key en{" "}
                <code className="rounded bg-black/5 px-1.5 py-0.5 text-[13px]">
                  .env.local
                </code>
              </li>
              <li>
                Ejecutá{" "}
                <code className="rounded bg-black/5 px-1.5 py-0.5 text-[13px]">
                  001_migration_control.sql
                </code>{" "}
                en el SQL Editor
              </li>
              <li>
                Reiniciá{" "}
                <code className="rounded bg-black/5 px-1.5 py-0.5 text-[13px]">
                  npm run dev
                </code>
              </li>
            </ol>
          </div>
        ) : null}
      </header>

      <StatsBar counts={counts} total={MODULES.length} />

      {nextUp.length > 0 ? (
        <section className="apple-card p-6">
          <h2 className="text-[21px] font-semibold tracking-[-0.02em] text-[var(--ink)]">
            Siguiente a probar
          </h2>
          <p className="mt-1 text-[14px] text-[var(--muted)]">
            P0 con dependencias resueltas
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {nextUp.map((m) => (
              <li key={m.id}>
                <Link
                  href={`/module/${m.id}`}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[#f5f5f7] px-3.5 py-2 text-[14px] transition-colors hover:bg-[#e8e8ed]"
                >
                  <span className="rounded-full bg-[#1d1d1f] px-2 py-0.5 text-[10px] font-semibold text-white">
                    P0
                  </span>
                  {m.displayName}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <ModuleFilters value={filters} onChange={setFilters} />

      <ModuleTable
        modules={filtered}
        statuses={statuses}
        progress={progress}
      />
    </div>
  );
}
