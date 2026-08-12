import {
  Clock,
  Loader2,
  CheckCircle2,
  XCircle,
  Skull,
  Ban,
  type LucideIcon,
} from "lucide-react";
import type { JobStatus, WorkerStatus, WorkerType } from "@/api/types";

export interface StatusVisual {
  label: string;
  icon: LucideIcon;
  /** Tailwind color token, e.g. "queued" -> text-status-queued */
  token: string;
  spin?: boolean;
}

export const JOB_STATUS_CONFIG: Record<JobStatus, StatusVisual> = {
  queued: { label: "Queued", icon: Clock, token: "queued" },
  processing: { label: "Processing", icon: Loader2, token: "processing", spin: true },
  succeeded: { label: "Succeeded", icon: CheckCircle2, token: "succeeded" },
  failed: { label: "Failed", icon: XCircle, token: "failed" },
  dead_letter: { label: "Dead Letter", icon: Skull, token: "dead_letter" },
  cancelled: { label: "Cancelled", icon: Ban, token: "cancelled" },
};

export const JOB_STATUS_ORDER: JobStatus[] = [
  "queued",
  "processing",
  "succeeded",
  "failed",
  "dead_letter",
  "cancelled",
];

export const WORKER_STATUS_CONFIG: Record<WorkerStatus, { label: string; dot: string }> = {
  idle: { label: "Idle", dot: "succeeded" },
  busy: { label: "Busy", dot: "processing" },
  offline: { label: "Offline", dot: "cancelled" },
};

export const WORKER_TYPE_LABEL: Record<WorkerType, string> = {
  go: "Go",
  python: "Python",
  scheduler: "Scheduler",
};
