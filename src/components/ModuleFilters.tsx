"use client";

import type { Category, ModuleStatusValue, Priority } from "@/lib/types";
import { CATEGORY_LABELS } from "@/data/modules";

export interface FiltersState {
  q: string;
  priority: Priority | "all";
  category: Category | "all";
  status: ModuleStatusValue | "all";
  readyOnly: boolean;
}

export function ModuleFilters({
  value,
  onChange,
}: {
  value: FiltersState;
  onChange: (next: FiltersState) => void;
}) {
  return (
    <div className="apple-card flex flex-col gap-4 p-5 lg:flex-row lg:items-end lg:gap-3">
      <label className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="text-[12px] font-medium text-[var(--muted)]">
          Buscar
        </span>
        <input
          value={value.q}
          onChange={(e) => onChange({ ...value, q: e.target.value })}
          placeholder="Nombre técnico o display…"
          className="apple-input w-full"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-[12px] font-medium text-[var(--muted)]">
          Prioridad
        </span>
        <select
          value={value.priority}
          onChange={(e) =>
            onChange({
              ...value,
              priority: e.target.value as FiltersState["priority"],
            })
          }
          className="apple-input min-w-[110px]"
        >
          <option value="all">Todas</option>
          <option value="P0">P0</option>
          <option value="P1">P1</option>
          <option value="P2">P2</option>
          <option value="P3">P3</option>
        </select>
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-[12px] font-medium text-[var(--muted)]">
          Categoría
        </span>
        <select
          value={value.category}
          onChange={(e) =>
            onChange({
              ...value,
              category: e.target.value as FiltersState["category"],
            })
          }
          className="apple-input min-w-[150px]"
        >
          <option value="all">Todas</option>
          {Object.entries(CATEGORY_LABELS).map(([k, label]) => (
            <option key={k} value={k}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-[12px] font-medium text-[var(--muted)]">
          Estado
        </span>
        <select
          value={value.status}
          onChange={(e) =>
            onChange({
              ...value,
              status: e.target.value as FiltersState["status"],
            })
          }
          className="apple-input min-w-[130px]"
        >
          <option value="all">Todos</option>
          <option value="pending">Pendiente</option>
          <option value="in_progress">En curso</option>
          <option value="blocked">Bloqueado</option>
          <option value="passed">OK</option>
          <option value="failed">Fallido</option>
        </select>
      </label>
      <label className="flex items-center gap-2.5 pb-2.5 text-[14px] text-[var(--ink)]">
        <input
          type="checkbox"
          checked={value.readyOnly}
          onChange={(e) => onChange({ ...value, readyOnly: e.target.checked })}
          className="size-[15px] rounded accent-[var(--accent)]"
        />
        Listos para probar
      </label>
    </div>
  );
}
