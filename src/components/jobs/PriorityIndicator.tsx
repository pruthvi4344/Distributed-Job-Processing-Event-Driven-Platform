import { cn } from "@/lib/utils";

/** Five-bar indicator (priority 0-10 mapped to 0-5 bars) with the numeric value alongside. */
export function PriorityIndicator({ priority, className }: { priority: number; className?: string }) {
  const filledBars = Math.max(1, Math.ceil((priority / 10) * 5));
  const level = priority >= 8 ? "high" : priority >= 4 ? "mid" : "low";
  const colorClass =
    level === "high" ? "bg-status-failed" : level === "mid" ? "bg-status-queued" : "bg-ink-faint";

  return (
    <div className={cn("flex items-center gap-1.5", className)} title={`Priority ${priority}`}>
      <div className="flex items-end gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "w-1 rounded-sm transition-colors",
              i < filledBars ? colorClass : "bg-border-subtle"
            )}
            style={{ height: `${6 + i * 2.5}px` }}
          />
        ))}
      </div>
      <span className="text-xs tabular-nums text-ink-muted">{priority}</span>
    </div>
  );
}
