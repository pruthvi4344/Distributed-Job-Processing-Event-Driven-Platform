import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";

interface SparklineProps {
  data: number[];
  colorVar?: string; // css var name, e.g. "--color-accent"
  height?: number;
}

export function Sparkline({ data, colorVar = "--color-accent", height = 32 }: SparklineProps) {
  if (data.length < 2) {
    return <div style={{ height }} className="flex items-center text-[11px] text-ink-faint">collecting…</div>;
  }
  const points = data.map((v, i) => ({ i, v }));
  const gradientId = `spark-${colorVar.replace(/[^a-z0-9]/gi, "")}`;

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`rgb(var(${colorVar}))`} stopOpacity={0.35} />
              <stop offset="100%" stopColor={`rgb(var(${colorVar}))`} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis domain={["dataMin", "dataMax"]} hide />
          <Area
            type="monotone"
            dataKey="v"
            stroke={`rgb(var(${colorVar}))`}
            strokeWidth={1.75}
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
