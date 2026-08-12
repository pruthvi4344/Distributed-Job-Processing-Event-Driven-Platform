import { useState } from "react";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useJobs } from "@/hooks/useJobs";
import { JobsTable } from "@/components/jobs/JobsTable";
import { NewJobModal } from "@/components/jobs/NewJobModal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { JOB_STATUS_CONFIG, JOB_STATUS_ORDER } from "@/lib/statusConfig";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { JobStatus } from "@/api/types";

const LIMIT = 20;

export function Jobs() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<JobStatus | "">("");
  const [jobTypeInput, setJobTypeInput] = useState("");
  const jobType = useDebouncedValue(jobTypeInput, 350);
  const [newJobOpen, setNewJobOpen] = useState(false);

  const { data, isLoading, isPlaceholderData } = useJobs({
    page,
    limit: LIMIT,
    status: status || undefined,
    job_type: jobType || undefined,
  });

  const total = data?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  function handleFilterChange<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v);
      setPage(1);
    };
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-ink">Jobs</h2>
          <p className="text-sm text-ink-muted">{total > 0 ? `${total} total jobs` : "Browse and manage jobs"}</p>
        </div>
        <Button variant="primary" onClick={() => setNewJobOpen(true)}>
          <Plus size={15} />
          New Job
        </Button>
      </div>

      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <div className="relative sm:w-64">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <Input
            value={jobTypeInput}
            onChange={(e) => handleFilterChange(setJobTypeInput)(e.target.value)}
            placeholder="Filter by job type…"
            className="pl-8"
          />
        </div>
        <Select
          value={status}
          onChange={(e) => handleFilterChange(setStatus)(e.target.value as JobStatus | "")}
          className="sm:w-48"
        >
          <option value="">All statuses</option>
          {JOB_STATUS_ORDER.map((s) => (
            <option key={s} value={s}>
              {JOB_STATUS_CONFIG[s].label}
            </option>
          ))}
        </Select>
      </div>

      <Card className={isPlaceholderData ? "opacity-70 transition-opacity" : "transition-opacity"}>
        <JobsTable
          jobs={data?.data ?? undefined}
          loading={isLoading}
          emptyAction={
            <Button variant="primary" onClick={() => setNewJobOpen(true)}>
              <Plus size={15} />
              New Job
            </Button>
          }
        />
      </Card>

      {total > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-ink-muted">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              <ChevronLeft size={14} />
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Next
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}

      <NewJobModal open={newJobOpen} onClose={() => setNewJobOpen(false)} />
    </div>
  );
}
