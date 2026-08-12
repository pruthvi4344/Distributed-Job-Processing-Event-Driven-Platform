import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "accent" | "outline";
}

export function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
  const variants = {
    neutral: "bg-surface-raised text-ink-muted border border-border",
    accent: "bg-accent-soft text-accent border border-accent/20",
    outline: "bg-transparent text-ink-muted border border-border",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
