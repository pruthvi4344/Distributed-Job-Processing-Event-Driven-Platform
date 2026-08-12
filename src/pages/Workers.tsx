import { useMemo, useState } from "react";
import { Cpu } from "lucide-react";
import { useWorkers } from "@/hooks/useWorkers";
import { WorkerCard } from "@/components/workers/WorkerCard";
import { Tabs } from "@/components/ui/Tabs";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import type { WorkerType } from "@/api/types";

const TYPE_FILTERS: { value: WorkerType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "go", label: "Go" },
  { value: "python", label: "Python" },
  { value: "scheduler", label: "Scheduler" },
];

export function Workers() {
  const { data: workers, isLoading } = useWorkers();
  const [typeFilter, setTypeFilter] = useState<WorkerType | "all">("all");

  const filtered = useMemo(() => {
    if (!workers) return [];
    if (typeFilter === "all") return workers;
    return workers.filter((w) => w.worker_type === typeFilter);
  }, [workers, typeFilter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: workers?.length ?? 0, go: 0, python: 0, scheduler: 0 };
    workers?.forEach((w) => {
      c[w.worker_type] = (c[w.worker_type] ?? 0) + 1;
    });
    return c;
  }, [workers]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-ink">Workers</h2>
          <p className="text-sm text-ink-muted">Live status of every registered worker in the fleet.</p>
        </div>
        <Tabs
          tabs={TYPE_FILTERS.map((f) => ({ value: f.value, label: f.label, count: counts[f.value] }))}
          value={typeFilter}
          onChange={(v) => setTypeFilter(v as WorkerType | "all")}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Cpu}
          title="No workers found"
          description={
            workers && workers.length > 0
              ? "No workers match this filter."
              : "Start a Go, Python, or scheduler worker process and it will register here automatically."
          }
          className="py-20"
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((worker) => (
            <WorkerCard key={worker.id} worker={worker} />
          ))}
        </div>
      )}
    </div>
  );
}
