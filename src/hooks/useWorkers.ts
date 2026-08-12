import { useQuery } from "@tanstack/react-query";
import { listWorkers } from "@/api/workers";

export function useWorkers(opts?: { refetchInterval?: number | false }) {
  return useQuery({
    queryKey: ["workers"],
    queryFn: listWorkers,
    refetchInterval: opts?.refetchInterval ?? 4000,
  });
}
