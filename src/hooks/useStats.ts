import { useQuery } from "@tanstack/react-query";
import { getHealth, getThroughput } from "@/api/stats";

export function useThroughput(opts?: { refetchInterval?: number | false }) {
  return useQuery({
    queryKey: ["throughput"],
    queryFn: getThroughput,
    refetchInterval: opts?.refetchInterval ?? 5000,
  });
}

export function useHealth(opts?: { refetchInterval?: number | false }) {
  return useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
    refetchInterval: opts?.refetchInterval ?? 5000,
    retry: 1,
  });
}
