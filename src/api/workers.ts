import { apiRequest } from "@/api/client";
import type { Worker } from "@/api/types";

export function listWorkers(): Promise<Worker[]> {
  return apiRequest<Worker[]>("/api/v1/workers");
}

export function getWorker(id: string): Promise<Worker> {
  return apiRequest<Worker>(`/api/v1/workers/${id}`);
}
