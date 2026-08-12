import { JOB_STATUS_CONFIG } from "@/lib/statusConfig";
import type { JobStatus } from "@/api/types";
import { cn } from "@/lib/utils";

export function JobStatusBadge({ status, className }: { status: JobStatus; className?: string }) {
  const config = JOB_STATUS_CONFIG[status];
  if (!config) {
    return (
      <span className={cn("inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-raised px-2.5 py-1 text-xs font-medium text-ink-muted", className)}>
        {status}
      </span>
    );
  }
  const Icon = config.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border",
        `bg-status-${config.token}/10 text-status-${config.token} border-status-${config.token}/25`,
        className
      )}
    >
      <Icon size={12} strokeWidth={2.5} className={config.spin ? "animate-spin" : ""} />
      {config.label}
    </span>
  );
}
