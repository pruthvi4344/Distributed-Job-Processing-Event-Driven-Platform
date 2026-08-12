import { Link } from "react-router-dom";
import { Zap, Timer, Gauge, CheckCircle2, ArrowRight, Cpu, ListChecks } from "lucide-react";
import { useThroughput } from "@/hooks/useStats";
import { useWorkers } from "@/hooks/useWorkers";
import { useJobs } from "@/hooks/useJobs";
import { useMetricHistory } from "@/hooks/useMetricHistory";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusDonutChart } from "@/components/dashboard/StatusDonutChart";
import { WorkerFleetStrip } from "@/components/dashboard/WorkerFleetStrip";
import { JobsTable } from "@/components/jobs/JobsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatNumber, formatPercent } from "@/lib/utils";

export function Dashboard() {
  const { data: throughput, isLoading: throughputLoading, dataUpdatedAt } = useThroughput();
  const { data: workers, isLoading: workersLoading } = useWorkers();
  const { data: recentJobsEnvelope, isLoading: jobsLoading } = useJobs({ page: 1, limit: 8 });

  const successRate =
    throughput && throughput.total_jobs > 0 ? (throughput.succeeded / throughput.total_jobs) * 100 : 0;

  const jpsHistory = useMetricHistory(throughput?.jobs_per_second, dataUpdatedAt);
  const latencyHistory = useMetricHistory(throughput?.avg_latency_ms, dataUpdatedAt);
  const totalHistory = useMetricHistory(throughput?.total_jobs, dataUpdatedAt);
  const successHistory = useMetricHistory(successRate, dataUpdatedAt);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-ink">Overview</h2>
        <p className="text-sm text-ink-muted">Real-time snapshot of your job processing pipeline.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Jobs"
          value={formatNumber(throughput?.total_jobs)}
          icon={ListChecks}
          history={totalHistory}
          loading={throughputLoading}
          accentVar="--color-accent"
        />
        <StatCard
          label="Jobs / sec"
          value={throughput ? throughput.jobs_per_second.toFixed(2) : "—"}
          icon={Zap}
          history={jpsHistory}
          loading={throughputLoading}
          accentVar="--status-processing"
        />
        <StatCard
          label="Avg Latency"
          value={throughput ? `${formatNumber(Math.round(throughput.avg_latency_ms))}ms` : "—"}
          icon={Timer}
          history={latencyHistory}
          loading={throughputLoading}
          accentVar="--status-queued"
        />
        <StatCard
          label="Success Rate"
          value={formatPercent(successRate)}
          icon={CheckCircle2}
          history={successHistory}
          loading={throughputLoading}
          accentVar="--status-succeeded"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge size={15} className="text-ink-faint" />
              Jobs by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StatusDonutChart
              counts={{
                queued: throughput?.queued ?? 0,
                processing: throughput?.processing ?? 0,
                succeeded: throughput?.succeeded ?? 0,
                failed: throughput?.failed ?? 0,
                dead_letter: throughput?.dead_letter ?? 0,
              }}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu size={15} className="text-ink-faint" />
              Worker Fleet
            </CardTitle>
            <Link to="/workers" className="focus-ring flex items-center gap-1 text-xs font-medium text-accent hover:underline">
              View all <ArrowRight size={12} />
            </Link>
          </CardHeader>
          <CardContent>
            <WorkerFleetStrip workers={workers} loading={workersLoading} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks size={15} className="text-ink-faint" />
            Recent Jobs
          </CardTitle>
          <Link to="/jobs" className="focus-ring flex items-center gap-1 text-xs font-medium text-accent hover:underline">
            View all <ArrowRight size={12} />
          </Link>
        </CardHeader>
        <JobsTable jobs={recentJobsEnvelope?.data ?? undefined} loading={jobsLoading} compact />
      </Card>
    </div>
  );
}
