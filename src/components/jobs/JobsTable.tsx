import { useNavigate } from "react-router-dom";
import { ListChecks } from "lucide-react";
import type { JobRead } from "@/api/types";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/Table";
import { JobStatusBadge } from "@/components/jobs/JobStatusBadge";
import { PriorityIndicator } from "@/components/jobs/PriorityIndicator";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { formatRelativeTime, formatAbsoluteTime } from "@/lib/utils";

interface JobsTableProps {
  jobs: JobRead[] | undefined;
  loading?: boolean;
  compact?: boolean;
  emptyAction?: React.ReactNode;
}

export function JobsTable({ jobs, loading, compact, emptyAction }: JobsTableProps) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="space-y-2 p-4">
        {Array.from({ length: compact ? 5 : 8 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <EmptyState
        icon={ListChecks}
        title="No jobs found"
        description="Try adjusting your filters, or submit a new job to get started."
        action={emptyAction}
        className="py-14"
      />
    );
  }

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Job</Th>
          <Th>Status</Th>
          <Th>Priority</Th>
          <Th>Attempts</Th>
          {!compact && <Th>Created</Th>}
          <Th className="text-right">ID</Th>
        </Tr>
      </Thead>
      <Tbody>
        {jobs.map((job) => (
          <Tr
            key={job.id}
            onClick={() => navigate(`/jobs/${job.id}`)}
            className="cursor-pointer hover:bg-surface-raised"
          >
            <Td className="font-medium">{job.job_type}</Td>
            <Td>
              <JobStatusBadge status={job.status} />
            </Td>
            <Td>
              <PriorityIndicator priority={job.priority} />
            </Td>
            <Td className="tabular-nums text-ink-muted">
              {job.attempt_count}/{job.max_attempts}
            </Td>
            {!compact && (
              <Td className="text-ink-muted" title={formatAbsoluteTime(job.created_at)}>
                {formatRelativeTime(job.created_at)}
              </Td>
            )}
            <Td className="text-right font-mono text-xs text-ink-faint">{job.id.slice(0, 8)}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
