import {
  CirclePlus,
  Clock,
  PlayCircle,
  TrendingUp,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Skull,
  Ban,
  Activity,
  type LucideIcon,
} from "lucide-react";
import type { JobEvent } from "@/api/types";
import { formatAbsoluteTime, formatRelativeTime, cn } from "@/lib/utils";
import { EmptyState } from "@/components/common/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";

const EVENT_ICON: Record<string, { icon: LucideIcon; token: string }> = {
  created: { icon: CirclePlus, token: "queued" },
  queued: { icon: Clock, token: "queued" },
  started: { icon: PlayCircle, token: "processing" },
  processing: { icon: PlayCircle, token: "processing" },
  progress: { icon: TrendingUp, token: "processing" },
  succeeded: { icon: CheckCircle2, token: "succeeded" },
  completed: { icon: CheckCircle2, token: "succeeded" },
  failed: { icon: XCircle, token: "failed" },
  retrying: { icon: RotateCcw, token: "queued" },
  retried: { icon: RotateCcw, token: "queued" },
  dead_letter: { icon: Skull, token: "dead_letter" },
  cancelled: { icon: Ban, token: "cancelled" },
};

function iconFor(eventType: string) {
  const key = eventType.toLowerCase();
  return EVENT_ICON[key] ?? { icon: Activity, token: "processing" };
}

export function JobTimeline({ events, loading }: { events: JobEvent[] | undefined; loading: boolean }) {
  if (loading) {
    return (
      <div className="space-y-4 p-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-7 w-7 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <EmptyState icon={Activity} title="No events yet" description="Timeline events will appear here as the job progresses." className="py-10" />
    );
  }

  return (
    <ol className="space-y-0 p-5">
      {events.map((event, idx) => {
        const { icon: Icon, token } = iconFor(event.event_type);
        const isLast = idx === events.length - 1;
        const hasDetail = event.detail && Object.keys(event.detail).length > 0;
        return (
          <li key={event.id} className="relative flex gap-3 pb-6 last:pb-0">
            {!isLast && (
              <span className="absolute left-[13px] top-7 h-[calc(100%-14px)] w-px bg-border" aria-hidden />
            )}
            <span
              className={cn(
                "z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border bg-surface",
                `border-status-${token}/30 text-status-${token}`
              )}
            >
              <Icon size={13} strokeWidth={2.25} />
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <p className="text-sm font-medium capitalize text-ink">{event.event_type.replace(/_/g, " ")}</p>
                <p className="text-xs text-ink-faint" title={formatAbsoluteTime(event.created_at)}>
                  {formatRelativeTime(event.created_at)}
                </p>
              </div>
              {hasDetail && (
                <pre className="mt-1.5 overflow-x-auto rounded-md border border-border-subtle bg-surface-raised p-2.5 font-mono text-[11px] leading-relaxed text-ink-muted">
                  {JSON.stringify(event.detail, null, 2)}
                </pre>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
