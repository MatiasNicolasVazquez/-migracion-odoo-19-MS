import { ModuleDetail } from "@/components/ModuleDetail";
import { MODULES } from "@/data/modules";

export function generateStaticParams() {
  return MODULES.map((m) => ({ id: m.id }));
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ModuleDetail moduleId={id} />;
}
