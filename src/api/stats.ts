import { apiRequest } from "@/api/client";
import type { HealthCheck, Throughput } from "@/api/types";

export function getThroughput(): Promise<Throughput> {
  return apiRequest<Throughput>("/api/v1/stats/throughput");
}

export function getHealth(): Promise<HealthCheck> {
  return apiRequest<HealthCheck>("/api/v1/health");
}
