import { AlertOctagon, FileJson, Hourglass } from "lucide-react";
import type { JobResult } from "@/api/types";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/common/EmptyState";

export function JobResultPanel({ result, loading, isTerminal }: { result: JobResult | undefined; loading: boolean; isTerminal: boolean }) {
  if (!isTerminal) {
    return (
      <EmptyState
        icon={Hourglass}
        title="Awaiting completion"
        description="Results will appear here once the job finishes running."
        className="py-10"
      />
    );
  }

  if (loading) {
    return (
      <div className="space-y-2 p-5">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (result?.error_message) {
    return (
      <div className="p-5">
        <div className="flex items-start gap-3 rounded-lg border border-status-failed/25 bg-status-failed/10 p-4">
          <AlertOctagon size={16} className="mt-0.5 shrink-0 text-status-failed" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-status-failed">Job failed</p>
            <pre className="mt-1.5 whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-ink-muted">
              {result.error_message}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  if (result?.result) {
    return (
      <div className="p-5">
        <div className="flex items-center gap-2 pb-2 text-xs font-medium text-ink-muted">
          <FileJson size={13} />
          Result payload
        </div>
        <pre className="overflow-x-auto rounded-lg border border-border-subtle bg-surface-raised p-4 font-mono text-xs leading-relaxed text-ink">
          {JSON.stringify(result.result, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <EmptyState
      icon={FileJson}
      title="No result available"
      description="This job finished without producing a result payload."
      className="py-10"
    />
  );
}
