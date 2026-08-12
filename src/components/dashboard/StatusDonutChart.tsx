import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { JOB_STATUS_CONFIG, JOB_STATUS_ORDER } from "@/lib/statusConfig";
import type { JobStatus } from "@/api/types";
import { formatNumber } from "@/lib/utils";
import { EmptyState } from "@/components/common/EmptyState";
import { PieChart as PieIcon } from "lucide-react";

interface StatusDonutChartProps {
  counts: Partial<Record<JobStatus, number>>;
}

interface TooltipPayloadItem {
  payload: { status: JobStatus; count: number };
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) {
  if (!active || !payload?.length) return null;
  const { status, count } = payload[0].payload;
  const config = JOB_STATUS_CONFIG[status];
  return (
    <div className="rounded-lg border border-border bg-surface-raised px-3 py-2 text-xs shadow-popover">
      <div className="flex items-center gap-1.5 font-medium text-ink">
        <span className={`inline-block h-2 w-2 rounded-full bg-status-${config.token}`} />
        {config.label}
      </div>
      <div className="mt-0.5 text-ink-muted">{formatNumber(count)} jobs</div>
    </div>
  );
}

export function StatusDonutChart({ counts }: StatusDonutChartProps) {
  const total = JOB_STATUS_ORDER.reduce((sum, s) => sum + (counts[s] ?? 0), 0);

  if (total === 0) {
    return (
      <EmptyState
        icon={PieIcon}
        title="No jobs yet"
        description="Submit a job to see the status breakdown here."
        className="py-10"
      />
    );
  }

  const data = JOB_STATUS_ORDER.filter((s) => (counts[s] ?? 0) > 0).map((status) => ({
    status,
    count: counts[status] ?? 0,
  }));

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
      <div className="relative shrink-0">
        <PieChart width={168} height={168}>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            cx="50%"
            cy="50%"
            innerRadius={54}
            outerRadius={78}
            paddingAngle={data.length > 1 ? 2 : 0}
            stroke="none"
            isAnimationActive={false}
          >
            {data.map((d) => (
              <Cell key={d.status} fill={`rgb(var(--status-${d.status}))`} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold tabular-nums text-ink">{formatNumber(total)}</span>
          <span className="text-[11px] text-ink-faint">total jobs</span>
        </div>
      </div>

      <div className="grid w-full grid-cols-1 gap-1.5 sm:grid-cols-2">
        {JOB_STATUS_ORDER.map((status) => {
          const config = JOB_STATUS_CONFIG[status];
          const count = counts[status] ?? 0;
          const Icon = config.icon;
          return (
            <div key={status} className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 hover:bg-surface-raised">
              <div className="flex items-center gap-2 text-xs text-ink-muted">
                <Icon size={12} className={`text-status-${config.token}`} />
                <span>{config.label}</span>
              </div>
              <span className="text-xs font-semibold tabular-nums text-ink">{formatNumber(count)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
