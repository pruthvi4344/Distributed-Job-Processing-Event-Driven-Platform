import { apiRequest, apiRequestWithMeta } from "@/api/client";
import type { CreateJobPayload, Envelope, JobEvent, JobListParams, JobRead, JobResult } from "@/api/types";

export function listJobs(params: JobListParams): Promise<Envelope<JobRead[]>> {
  return apiRequestWithMeta<JobRead[]>("/api/v1/jobs", {
    query: {
      page: params.page,
      limit: params.limit,
      status: params.status,
      job_type: params.job_type,
    },
  });
}

export function getJob(id: string): Promise<JobRead> {
  return apiRequest<JobRead>(`/api/v1/jobs/${id}`);
}

export function getJobEvents(id: string): Promise<JobEvent[]> {
  return apiRequest<JobEvent[]>(`/api/v1/jobs/${id}/events`);
}

export function getJobResult(id: string): Promise<JobResult> {
  return apiRequest<JobResult>(`/api/v1/jobs/${id}/result`);
}

export function createJob(payload: CreateJobPayload): Promise<JobRead> {
  return apiRequest<JobRead>("/api/v1/jobs", { method: "POST", body: payload });
}

export function cancelJob(id: string): Promise<JobRead> {
  return apiRequest<JobRead>(`/api/v1/jobs/${id}/cancel`, { method: "POST" });
}

export function retryJob(id: string): Promise<JobRead> {
  return apiRequest<JobRead>(`/api/v1/jobs/${id}/retry`, { method: "POST" });
}
