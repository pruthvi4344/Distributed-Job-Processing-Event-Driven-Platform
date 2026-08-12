import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-ink hover:bg-accent-hover shadow-sm shadow-accent/20 disabled:hover:bg-accent",
  secondary:
    "bg-surface-raised text-ink border border-border hover:bg-canvas",
  outline:
    "bg-transparent text-ink border border-border hover:bg-surface-raised",
  ghost: "bg-transparent text-ink-muted hover:bg-surface-raised hover:text-ink",
  danger:
    "bg-status-failed text-white hover:bg-status-failed/90 shadow-sm shadow-status-failed/20",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-9 px-4 text-sm gap-2",
  lg: "h-11 px-5 text-sm gap-2",
  icon: "h-9 w-9 shrink-0",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "focus-ring inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-all duration-150",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "active:scale-[0.98]",
          VARIANT_CLASSES[variant],
          SIZE_CLASSES[size],
          className
        )}
        {...props}
      >
        {loading && <Loader2 size={14} className="animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
