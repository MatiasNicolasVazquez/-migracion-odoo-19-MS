import type { ModuleStatusValue } from "@/lib/types";
import { STATUS_LABELS } from "@/data/modules";

const STYLES: Record<ModuleStatusValue, string> = {
  pending: "bg-[#f5f5f7] text-[#6e6e73]",
  in_progress: "bg-[#fff4e5] text-[#b25e09]",
  blocked: "bg-[#fff0ed] text-[#c93400]",
  passed: "bg-[#e8f8ee] text-[#1b7a3d]",
  failed: "bg-[#ffeceb] text-[#d70015]",
};

export function StatusBadge({ status }: { status: ModuleStatusValue }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-[-0.01em] ${STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
