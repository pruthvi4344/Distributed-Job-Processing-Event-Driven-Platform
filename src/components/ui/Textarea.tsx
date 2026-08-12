import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "focus-ring w-full rounded-md border border-border bg-surface px-3 py-2 font-mono text-sm text-ink placeholder:text-ink-faint placeholder:font-sans",
          "transition-colors hover:border-ink-faint/50",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";
