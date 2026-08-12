import { useParams, useNavigate, Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, XCircle, RotateCcw, Activity, FileJson2 } from "lucide-react";
import { useJob, useJobEvents, useJobResult } from "@/hooks/useJob";
import { cancelJob, retryJob } from "@/api/jobs";
import { JobStatusBadge } from "@/components/jobs/JobStatusBadge";
import { PriorityIndicator } from "@/components/jobs/PriorityIndicator";
import { JobTimeline } from "@/components/jobs/JobTimeline";
import { JobResultPanel } from "@/components/jobs/JobResultPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Skeleton } from "@/components/ui/Skeleton";
import { CopyableId } from "@/components/common/CopyableId";
import { EmptyState } from "@/components/common/EmptyState";
import { formatAbsoluteTime, formatRelativeTime } from "@/lib/utils";
import { toast } from "@/lib/toast";

const TERMINAL_STATUSES = new Set(["succeeded", "failed", "dead_letter", "cancelled"]);

export function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: job, isLoading, isError } = useJob(id);
  const isTerminal = job ? TERMINAL_STATUSES.has(job.status) : false;

  const { data: events, isLoading: eventsLoading } = useJobEvents(id, isTerminal);
  const { data: result, isLoading: resultLoading } = useJobResult(id, isTerminal);

  const cancelMutation = useMutation({
    mutationFn: () => cancelJob(id as string),
    onSuccess: () => {
      toast.success("Job cancelled");
      queryClient.invalidateQueries({ queryKey: ["job", id] });
      queryClient.invalidateQueries({ queryKey: ["job-events", id] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: () => toast.error("Could not cancel job", "It may have already reached a terminal state."),
  });

  const retryMutation = useMutation({
    mutationFn: () => retryJob(id as string),
    onSuccess: () => {
      toast.success("Job re-queued");
      queryClient.invalidateQueries({ queryKey: ["job", id] });
      queryClient.invalidateQueries({ queryKey: ["job-events", id] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: () => toast.error("Could not retry job", "It may not be in a retryable state."),
  });

  if (isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <EmptyState
        icon={FileJson2}
        title="Job not found"
        description="This job may not exist, or the API is unreachable."
        action={
          <Link to="/jobs">
            <Button variant="primary">Back to jobs</Button>
          </Link>
        }
        className="py-24"
      />
    );
  }

  const canCancel = job.status === "queued" || job.status === "processing";
  const canRetry = job.status === "failed" || job.status === "dead_letter";

  return (
    <div className="space-y-5">
      <button
        onClick={() => navigate("/jobs")}
        className="focus-ring inline-flex items-center gap-1.5 text-sm text-ink-muted transition hover:text-ink"
      >
        <ArrowLeft size={14} />
        Back to jobs
      </button>

      <Card>
        <CardContent className="p-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-bold tracking-tight text-ink">{job.job_type}</h2>
                <JobStatusBadge status={job.status} />
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-muted">
                <span className="flex items-center gap-1.5">
                  ID <CopyableId id={job.id} />
                </span>
                <div className="flex items-center gap-1.5">
                  Priority <PriorityIndicator priority={job.priority} />
                </div>
                <span>
                  Attempts <b className="text-ink">{job.attempt_count}</b>/{job.max_attempts}
                </span>
              </div>
            </div>

            <div className="flex shrink-0 gap-2">
              {canCancel && (
                <Button variant="danger" onClick={() => cancelMutation.mutate()} loading={cancelMutation.isPending}>
                  <XCircle size={14} />
                  Cancel
                </Button>
              )}
              {canRetry && (
                <Button variant="primary" onClick={() => retryMutation.mutate()} loading={retryMutation.isPending}>
                  <RotateCcw size={14} />
                  Retry
                </Button>
              )}
            </div>
          </div>

          {job.status === "processing" && typeof job.progress === "number" && (
            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-xs text-ink-muted">
                <span>Progress</span>
                <span className="font-medium tabular-nums text-ink">{Math.round(job.progress)}%</span>
              </div>
              <ProgressBar value={job.progress} />
            </div>
          )}

          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border-subtle pt-4 text-xs sm:grid-cols-4">
            <div>
              <p className="text-ink-faint">Created</p>
              <p className="mt-0.5 font-medium text-ink" title={formatAbsoluteTime(job.created_at)}>
                {formatRelativeTime(job.created_at)}
              </p>
            </div>
            <div>
              <p className="text-ink-faint">Started</p>
              <p className="mt-0.5 font-medium text-ink" title={formatAbsoluteTime(job.started_at)}>
                {formatRelativeTime(job.started_at)}
              </p>
            </div>
            <div>
              <p className="text-ink-faint">Completed</p>
              <p className="mt-0.5 font-medium text-ink" title={formatAbsoluteTime(job.completed_at)}>
                {formatRelativeTime(job.completed_at)}
              </p>
            </div>
            <div>
              <p className="text-ink-faint">Updated</p>
              <p className="mt-0.5 font-medium text-ink" title={formatAbsoluteTime(job.updated_at)}>
                {formatRelativeTime(job.updated_at)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payload</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-lg border border-border-subtle bg-surface-raised p-4 font-mono text-xs leading-relaxed text-ink">
            {JSON.stringify(job.payload, null, 2)}
          </pre>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity size={15} className="text-ink-faint" />
              Timeline
            </CardTitle>
          </CardHeader>
          <JobTimeline events={events} loading={eventsLoading} />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileJson2 size={15} className="text-ink-faint" />
              Result
            </CardTitle>
          </CardHeader>
          <JobResultPanel result={result} loading={resultLoading} isTerminal={isTerminal} />
        </Card>
      </div>
    </div>
  );
}

