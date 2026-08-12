import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Sparkline } from "@/components/dashboard/Sparkline";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  history?: number[];
  loading?: boolean;
  accentVar?: string;
  hint?: string;
}

export function StatCard({ label, value, icon: Icon, history, loading, accentVar = "--color-accent", hint }: StatCardProps) {
  if (loading) {
    return (
      <Card className="p-5">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="mt-3 h-7 w-20" />
        <Skeleton className="mt-4 h-8 w-full" />
      </Card>
    );
  }

  return (
    <Card className="group relative overflow-hidden p-5 transition-shadow hover:shadow-raised">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-ink-faint">{label}</span>
        <div
          className={cn("flex h-7 w-7 items-center justify-center rounded-md")}
          style={{ backgroundColor: `rgb(var(${accentVar}) / 0.1)`, color: `rgb(var(${accentVar}))` }}
        >
          <Icon size={14} strokeWidth={2.25} />
        </div>
      </div>
      <div className="mt-2 text-2xl font-bold tracking-tight text-ink tabular-nums">{value}</div>
      {hint && <div className="mt-0.5 text-xs text-ink-muted">{hint}</div>}
      <div className="mt-3">
        <Sparkline data={history ?? []} colorVar={accentVar} />
      </div>
    </Card>
  );
}
