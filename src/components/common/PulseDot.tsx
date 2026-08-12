import { cn } from "@/lib/utils";

interface PulseDotProps {
  /** status color token, e.g. "succeeded" | "processing" | "cancelled" ... */
  token: string;
  pulse?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function PulseDot({ token, pulse = true, size = "sm", className }: PulseDotProps) {
  const dim = size === "sm" ? "h-1.5 w-1.5" : "h-2.5 w-2.5";
  return (
    <span className={cn("relative inline-flex items-center justify-center", dim, className)}>
      {pulse && (
        <span
          className={cn("absolute inline-flex h-full w-full animate-pulse-ring rounded-full", `bg-status-${token}`)}
        />
      )}
      <span className={cn("relative inline-flex rounded-full", dim, `bg-status-${token}`)} />
    </span>
  );
}
