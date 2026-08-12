import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "focus-ring h-9 w-full appearance-none rounded-md border border-border bg-surface pl-3 pr-8 text-sm text-ink",
            "transition-colors hover:border-ink-faint/50",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          size={14}
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-faint"
        />
      </div>
    );
  }
);
Select.displayName = "Select";
