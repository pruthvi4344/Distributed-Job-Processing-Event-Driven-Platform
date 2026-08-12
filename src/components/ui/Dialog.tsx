import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  /** "modal" centers a card; "drawer" slides in from the right, full height. */
  variant?: "modal" | "drawer";
  className?: string;
}

export function Dialog({ open, onClose, title, description, children, variant = "modal", className }: DialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 animate-fade-in bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      {variant === "modal" ? (
        <div className="relative m-auto w-full max-w-lg animate-scale-in px-4">
          <div className={cn("rounded-xl border border-border bg-surface-raised shadow-popover", className)}>
            {(title || description) && (
              <div className="flex items-start justify-between gap-3 border-b border-border-subtle px-5 py-4">
                <div>
                  {title && <h2 className="text-sm font-semibold text-ink">{title}</h2>}
                  {description && <p className="mt-0.5 text-xs text-ink-muted">{description}</p>}
                </div>
                <button
                  onClick={onClose}
                  className="focus-ring shrink-0 rounded-md p-1.5 text-ink-faint transition hover:bg-surface hover:text-ink"
                  aria-label="Close dialog"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            {children}
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "relative ml-auto flex h-full w-full max-w-md animate-slide-in-right flex-col border-l border-border bg-surface-raised shadow-popover",
            className
          )}
        >
          {(title || description) && (
            <div className="flex items-start justify-between gap-3 border-b border-border-subtle px-5 py-4">
              <div>
                {title && <h2 className="text-sm font-semibold text-ink">{title}</h2>}
                {description && <p className="mt-0.5 text-xs text-ink-muted">{description}</p>}
              </div>
              <button
                onClick={onClose}
                className="focus-ring shrink-0 rounded-md p-1.5 text-ink-faint transition hover:bg-surface hover:text-ink"
                aria-label="Close dialog"
              >
                <X size={16} />
              </button>
            </div>
          )}
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      )}
    </div>,
    document.body
  );
}
