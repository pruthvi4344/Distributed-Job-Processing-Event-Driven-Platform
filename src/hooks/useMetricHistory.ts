import { useEffect, useState } from "react";

/**
 * Accumulates a rolling client-side history for a polled metric so stat cards can
 * render a real trend sparkline (the API only exposes a point-in-time snapshot).
 * `updatedAt` should be the query's dataUpdatedAt timestamp so a poll that returns
 * an unchanged value still records a new sample.
 */
export function useMetricHistory(value: number | undefined, updatedAt: number, maxPoints = 20) {
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => {
    if (value === undefined || Number.isNaN(value) || !updatedAt) return;
    setHistory((prev) => {
      const next = [...prev, value];
      return next.length > maxPoints ? next.slice(next.length - maxPoints) : next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedAt]);

  return history;
}
