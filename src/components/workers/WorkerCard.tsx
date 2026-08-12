import { Bot, Container, CalendarClock, type LucideIcon } from "lucide-react";
import type { Worker } from "@/api/types";
import { WORKER_STATUS_CONFIG, WORKER_TYPE_LABEL } from "@/lib/statusConfig";
import { formatRelativeTime, formatUptime, cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { PulseDot } from "@/components/common/PulseDot";

const TYPE_ICON: Record<string, LucideIcon> = {
  go: Container,
  python: Bot,
  scheduler: CalendarClock,
};

export function WorkerCard({ worker, compact = false }: { worker: Worker; compact?: boolean }) {
  const statusConfig = WORKER_STATUS_CONFIG[worker.status];
  const TypeIcon = TYPE_ICON[worker.worker_type] ?? Bot;
  const offline = worker.status === "offline";
  const active = worker.status === "busy" || worker.status === "idle";

  return (
    <Card
      className={cn(
        "relative overflow-hidden p-4 transition-all",
        offline ? "opacity-60" : "hover:shadow-raised",
        compact && "p-3"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-surface-raised text-ink-muted"
            )}
          >
            <TypeIcon size={15} strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink" title={worker.name}>
              {worker.name}
            </p>
            <p className="text-[11px] text-ink-faint">{WORKER_TYPE_LABEL[worker.worker_type] ?? worker.worker_type}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface-raised px-2 py-1">
          <PulseDot token={statusConfig.dot} pulse={active} />
          <span className="text-[11px] font-medium text-ink-muted">{statusConfig.label}</span>
        </div>
      </div>

      {!compact && (
        <div className="mt-3.5 grid grid-cols-2 gap-2 border-t border-border-subtle pt-3 text-xs">
          <div>
            <p className="text-ink-faint">Uptime</p>
            <p className="mt-0.5 font-medium tabular-nums text-ink">{offline ? "—" : formatUptime(worker.started_at)}</p>
          </div>
          <div>
            <p className="text-ink-faint">Heartbeat</p>
            <p className="mt-0.5 font-medium tabular-nums text-ink">{formatRelativeTime(worker.last_heartbeat)}</p>
          </div>
        </div>
      )}
    </Card>
  );
}
