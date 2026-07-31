"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MODULES } from "@/data/modules";
import { ensureSeed, removeOrphanModules } from "@/lib/seed";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type {
  ModuleStatusRow,
  ModuleStatusValue,
  TestProgressRow,
  TestResult,
} from "@/lib/types";

function emptyStatuses(): Record<string, ModuleStatusRow> {
  const now = new Date().toISOString();
  return Object.fromEntries(
    MODULES.map((m) => [
      m.id,
      {
        module_id: m.id,
        status: "pending" as const,
        assignee: null,
        notes: null,
        updated_at: now,
        updated_by: null,
      },
    ]),
  );
}

export function useMigrationData() {
  const [statuses, setStatuses] =
    useState<Record<string, ModuleStatusRow>>(emptyStatuses);
  const [progress, setProgress] = useState<TestProgressRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      setError(
        "Faltan variables de entorno de Supabase. En local: .env.local. En Vercel: Project → Settings → Environment Variables → redeploy.",
      );
      return;
    }
    try {
      const sb = createClient();
      let [stRes, prRes] = await Promise.all([
        sb.from("module_status").select("*"),
        sb.from("test_progress").select("*"),
      ]);
      if (stRes.error) throw stRes.error;
      if (prRes.error) throw prRes.error;

      const existingIds = (stRes.data ?? []).map(
        (r: { module_id: string }) => r.module_id,
      );
      const needsSeed =
        existingIds.length < MODULES.length ||
        (prRes.data?.length ?? 0) === 0;
      const removedOrphans = await removeOrphanModules(sb, existingIds);
      if (needsSeed) {
        await ensureSeed(sb);
      }
      if (needsSeed || removedOrphans) {
        [stRes, prRes] = await Promise.all([
          sb.from("module_status").select("*"),
          sb.from("test_progress").select("*"),
        ]);
        if (stRes.error) throw stRes.error;
        if (prRes.error) throw prRes.error;
      }

      const map = emptyStatuses();
      for (const row of (stRes.data ?? []) as ModuleStatusRow[]) {
        map[row.module_id] = row;
      }
      setStatuses(map);
      setProgress((prRes.data ?? []) as TestProgressRow[]);
      setConnected(true);
      setError(null);
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : typeof e === "object" && e && "message" in e
            ? String((e as { message: unknown }).message)
            : "Error al cargar datos";
      setError(message);
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const sb = createClient();
    const channel = sb
      .channel("migration-sync")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "module_status" },
        (payload) => {
          const row = payload.new as ModuleStatusRow;
          if (!row?.module_id) {
            void refresh();
            return;
          }
          setStatuses((prev) => ({ ...prev, [row.module_id]: row }));
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "test_progress" },
        () => {
          void refresh();
        },
      )
      .subscribe();
    return () => {
      void sb.removeChannel(channel);
    };
  }, [refresh]);

  const updateStatus = useCallback(
    async (
      moduleId: string,
      patch: Partial<
        Pick<ModuleStatusRow, "status" | "assignee" | "notes" | "updated_by">
      >,
    ) => {
      if (!isSupabaseConfigured()) return;
      const sb = createClient();
      const payload = {
        module_id: moduleId,
        ...patch,
        updated_at: new Date().toISOString(),
      };
      const { data, error: err } = await sb
        .from("module_status")
        .upsert(payload)
        .select()
        .single();
      if (err) throw err;
      setStatuses((prev) => ({
        ...prev,
        [moduleId]: data as ModuleStatusRow,
      }));
    },
    [],
  );

  const updateStep = useCallback(
    async (
      moduleId: string,
      stepId: string,
      patch: Partial<Pick<TestProgressRow, "done" | "result" | "note">>,
    ) => {
      if (!isSupabaseConfigured()) return;
      const sb = createClient();
      const payload = {
        module_id: moduleId,
        step_id: stepId,
        done: patch.done ?? false,
        result: (patch.result ?? "pending") as TestResult,
        note: patch.note ?? null,
        updated_at: new Date().toISOString(),
      };
      const { data, error: err } = await sb
        .from("test_progress")
        .upsert(payload)
        .select()
        .single();
      if (err) throw err;
      setProgress((prev) => {
        const rest = prev.filter(
          (p) => !(p.module_id === moduleId && p.step_id === stepId),
        );
        return [...rest, data as TestProgressRow];
      });
    },
    [],
  );

  const setStatus = useCallback(
    async (moduleId: string, status: ModuleStatusValue) => {
      await updateStatus(moduleId, { status });
    },
    [updateStatus],
  );

  const progressByModule = useMemo(() => {
    const map: Record<string, TestProgressRow[]> = {};
    for (const row of progress) {
      (map[row.module_id] ??= []).push(row);
    }
    return map;
  }, [progress]);

  return {
    statuses,
    progress,
    progressByModule,
    loading,
    error,
    connected,
    refresh,
    updateStatus,
    updateStep,
    setStatus,
  };
}
