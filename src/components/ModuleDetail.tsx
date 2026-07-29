"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MODULE_BY_ID, STATUS_LABELS, CATEGORY_LABELS } from "@/data/modules";
import { StatusBadge } from "@/components/StatusBadge";
import { useMigrationData } from "@/hooks/useMigrationData";
import {
  checklistProgress,
  displayName,
  getBlockers,
} from "@/lib/status";
import type { ModuleStatusValue, TestResult } from "@/lib/types";

export function ModuleDetail({ moduleId }: { moduleId: string }) {
  const mod = MODULE_BY_ID[moduleId];
  const {
    statuses,
    progressByModule,
    loading,
    error,
    connected,
    updateStatus,
    updateStep,
  } = useMigrationData();

  const [saving, setSaving] = useState(false);
  const [localNotes, setLocalNotes] = useState<string | null>(null);
  const [localAssignee, setLocalAssignee] = useState<string | null>(null);

  const stepsProgress = progressByModule[moduleId] ?? [];
  const stepMap = useMemo(
    () => Object.fromEntries(stepsProgress.map((s) => [s.step_id, s])),
    [stepsProgress],
  );

  if (!mod) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <p className="text-[21px] font-semibold tracking-[-0.02em]">
          Módulo no encontrado
        </p>
        <Link
          href="/"
          className="mt-4 inline-block text-[15px] text-[var(--accent)] hover:underline"
        >
          Volver al listado
        </Link>
      </div>
    );
  }

  const st = statuses[mod.id];
  const notes = localNotes ?? st?.notes ?? "";
  const assignee = localAssignee ?? st?.assignee ?? "";
  const blockers = getBlockers(mod, statuses);
  const { done, total, pct } = checklistProgress(
    mod.id,
    stepsProgress,
    mod.testPlan.length,
  );

  async function saveMeta() {
    setSaving(true);
    try {
      await updateStatus(mod.id, {
        notes: notes || null,
        assignee: assignee || null,
        updated_by: assignee || null,
      });
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(status: ModuleStatusValue) {
    setSaving(true);
    try {
      await updateStatus(mod.id, { status, updated_by: assignee || null });
    } finally {
      setSaving(false);
    }
  }

  async function toggleStep(stepId: string, checked: boolean) {
    const result: TestResult = checked ? "pass" : "pending";
    await updateStep(mod.id, stepId, { done: checked, result });
  }

  async function setStepResult(stepId: string, result: TestResult) {
    await updateStep(mod.id, stepId, {
      done: result === "pass",
      result,
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-[720px] flex-col gap-6 px-5 py-12 sm:px-8 sm:py-16">
      <Link
        href="/"
        className="text-[14px] text-[var(--accent)] hover:underline"
      >
        ← Volver al listado
      </Link>

      <header className="apple-card p-7 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#1d1d1f] px-2.5 py-0.5 text-[11px] font-semibold text-white">
            {mod.priority}
          </span>
          <span className="text-[13px] text-[var(--muted)]">
            {CATEGORY_LABELS[mod.category]} · v{mod.version}
          </span>
          <StatusBadge status={st?.status ?? "pending"} />
        </div>
        <h1 className="mt-4 text-[32px] font-semibold leading-[1.1] tracking-[-0.035em] text-[var(--ink)] sm:text-[40px]">
          {mod.displayName}
        </h1>
        <p className="mt-2 font-mono text-[13px] text-[var(--muted)]">
          {mod.technicalName}
        </p>
        <p className="mt-4 text-[16px] leading-relaxed text-[var(--muted)]">
          {mod.summary}
        </p>

        <div className="mt-6">
          <div className="mb-2 flex justify-between text-[13px] text-[var(--muted)]">
            <span>
              Checklist {done}/{total}
            </span>
            <span>{pct}%</span>
          </div>
          <div className="apple-progress">
            <span style={{ width: `${pct}%` }} />
          </div>
        </div>

        {!connected || error ? (
          <p className="mt-5 rounded-[12px] bg-[#fff4e5] px-4 py-3 text-[14px] text-[#b25e09]">
            {error ||
              "Sin conexión a Supabase: los cambios no se van a guardar."}
          </p>
        ) : null}
        {loading ? (
          <p className="mt-3 text-[14px] text-[var(--muted)]">
            Cargando estado…
          </p>
        ) : null}
      </header>

      <section className="apple-card p-6">
        <h2 className="text-[21px] font-semibold tracking-[-0.02em]">
          Dependencias custom
        </h2>
        {mod.depends.length === 0 ? (
          <p className="mt-2 text-[14px] text-[var(--muted)]">
            Sin dependencias custom (solo Odoo estándar / externos).
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {mod.depends.map((d) => {
              const blocked = blockers.includes(d);
              const depStatus = statuses[d]?.status ?? "pending";
              return (
                <li key={d}>
                  <Link
                    href={`/module/${d}`}
                    className={`flex items-center justify-between rounded-[12px] px-4 py-3 text-[14px] transition-opacity hover:opacity-90 ${
                      blocked ? "bg-[#fff0ed]" : "bg-[#e8f8ee]"
                    }`}
                  >
                    <span>
                      <span className="font-medium">{displayName(d)}</span>
                      <span className="ml-2 font-mono text-[12px] text-[var(--muted)]">
                        {d}
                      </span>
                    </span>
                    <StatusBadge status={depStatus} />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="apple-card p-6">
        <h2 className="text-[21px] font-semibold tracking-[-0.02em]">
          Estado y asignación
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-[14px]">
            <span className="text-[12px] font-medium text-[var(--muted)]">
              Estado
            </span>
            <select
              value={st?.status ?? "pending"}
              disabled={!connected || saving}
              onChange={(e) =>
                void changeStatus(e.target.value as ModuleStatusValue)
              }
              className="apple-input"
            >
              {(Object.keys(STATUS_LABELS) as ModuleStatusValue[]).map((k) => (
                <option key={k} value={k}>
                  {STATUS_LABELS[k]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-[14px]">
            <span className="text-[12px] font-medium text-[var(--muted)]">
              Asignado a
            </span>
            <input
              value={assignee}
              onChange={(e) => setLocalAssignee(e.target.value)}
              onBlur={() => void saveMeta()}
              placeholder="Nombre"
              disabled={!connected}
              className="apple-input"
            />
          </label>
        </div>
        <label className="mt-4 flex flex-col gap-1.5 text-[14px]">
          <span className="text-[12px] font-medium text-[var(--muted)]">
            Notas
          </span>
          <textarea
            value={notes}
            onChange={(e) => setLocalNotes(e.target.value)}
            onBlur={() => void saveMeta()}
            rows={4}
            disabled={!connected}
            placeholder="Errores encontrados, PRs, links a tickets…"
            className="apple-input resize-y"
          />
        </label>
      </section>

      <section className="apple-card p-6">
        <h2 className="text-[21px] font-semibold tracking-[-0.02em]">
          Plan de pruebas
        </h2>
        <ol className="mt-5 space-y-3">
          {mod.testPlan.map((step, idx) => {
            const row = stepMap[step.id];
            const checked = Boolean(row?.done || row?.result === "pass");
            const result = row?.result ?? "pending";
            return (
              <li
                key={step.id}
                className="rounded-[14px] bg-[#f5f5f7] p-4"
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 size-[15px] accent-[var(--accent)]"
                    checked={checked}
                    disabled={!connected}
                    onChange={(e) =>
                      void toggleStep(step.id, e.target.checked)
                    }
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium tracking-[-0.01em] text-[var(--ink)]">
                      <span className="mr-2 text-[var(--muted)]">
                        {idx + 1}.
                      </span>
                      {step.title}
                    </p>
                    {step.detail ? (
                      <p className="mt-1 text-[14px] leading-relaxed text-[var(--muted)]">
                        {step.detail}
                      </p>
                    ) : null}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {(
                        ["pending", "pass", "fail", "skip"] as TestResult[]
                      ).map((r) => (
                        <button
                          key={r}
                          type="button"
                          disabled={!connected}
                          onClick={() => void setStepResult(step.id, r)}
                          className={`rounded-full px-2.5 py-1 text-[11px] font-medium capitalize transition-colors ${
                            result === r
                              ? "bg-[#1d1d1f] text-white"
                              : "bg-white text-[#6e6e73] hover:bg-[#e8e8ed]"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
