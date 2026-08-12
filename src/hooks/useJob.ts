import { useQuery } from "@tanstack/react-query";
import { getJob, getJobEvents, getJobResult } from "@/api/jobs";

export function useJob(id: string | undefined) {
  return useQuery({
    queryKey: ["job", id],
    queryFn: () => getJob(id as string),
    enabled: !!id,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "processing" || status === "queued") return 2000;
      return false;
    },
  });
}

export function useJobEvents(id: string | undefined, isTerminal: boolean) {
  return useQuery({
    queryKey: ["job-events", id],
    queryFn: () => getJobEvents(id as string),
    enabled: !!id,
    refetchInterval: isTerminal ? false : 3000,
  });
}

export function useJobResult(id: string | undefined, isTerminal: boolean) {
  return useQuery({
    queryKey: ["job-result", id],
    queryFn: () => getJobResult(id as string),
    enabled: !!id && isTerminal,
    retry: false,
  });
}
