export type JobStatus =
  | "queued"
  | "processing"
  | "succeeded"
  | "failed"
  | "dead_letter"
  | "cancelled";

export type WorkerType = "go" | "python" | "scheduler";
export type WorkerStatus = "idle" | "busy" | "offline";

export interface Envelope<T> {
  data: T | null;
  meta: { page: number; limit: number; total: number } | null;
  error: string | null;
}

export interface JobRead {
  id: string;
  job_type: string;
  payload: Record<string, unknown>;
  status: JobStatus;
  priority: number;
  attempt_count: number;
  max_attempts: number;
  created_at: string;
  updated_at: string;
  started_at: string | null;
  completed_at: string | null;
  progress?: number | null;
}

export interface JobEvent {
  id: string;
  job_id: string;
  event_type: string;
  detail: Record<string, unknown>;
  created_at: string;
}

export interface JobResult {
  job_id: string;
  result: Record<string, unknown> | null;
  error_message: string | null;
  created_at: string;
}

export interface Worker {
  id: string;
  name: string;
  worker_type: WorkerType;
  status: WorkerStatus;
  last_heartbeat: string;
  started_at: string;
}

export interface HealthCheck {
  status: "healthy" | "degraded";
  checks: {
    database: "up" | "down";
    redis: "up" | "down";
  };
}

export interface Throughput {
  jobs_per_second: number;
  avg_latency_ms: number;
  total_jobs: number;
  succeeded: number;
  failed: number;
  dead_letter: number;
  queued: number;
  processing: number;
}

export interface CreateJobPayload {
  job_type: string;
  payload: Record<string, unknown>;
  priority: number;
  max_attempts: number;
}

export interface JobListParams {
  page?: number;
  limit?: number;
  status?: JobStatus;
  job_type?: string;
}
