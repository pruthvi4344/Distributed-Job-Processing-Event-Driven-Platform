import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "focus-ring h-9 w-full rounded-md border border-border bg-surface px-3 text-sm text-ink placeholder:text-ink-faint",
          "transition-colors hover:border-ink-faint/50",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
