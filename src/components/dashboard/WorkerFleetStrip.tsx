import { Link } from "react-router-dom";
import { Cpu, ArrowRight } from "lucide-react";
import type { Worker } from "@/api/types";
import { WorkerCard } from "@/components/workers/WorkerCard";
import { EmptyState } from "@/components/common/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";

export function WorkerFleetStrip({ workers, loading }: { workers: Worker[] | undefined; loading: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!workers || workers.length === 0) {
    return (
      <EmptyState
        icon={Cpu}
        title="No workers registered"
        description="Start a Go, Python, or scheduler worker and it will appear here automatically."
        className="py-10"
      />
    );
  }

  const visible = workers.slice(0, 8);

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {visible.map((w) => (
          <WorkerCard key={w.id} worker={w} compact />
        ))}
      </div>
      {workers.length > visible.length && (
        <Link
          to="/workers"
          className="focus-ring mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
        >
          View all {workers.length} workers <ArrowRight size={12} />
        </Link>
      )}
    </div>
  );
}
