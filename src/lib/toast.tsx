/* eslint-disable react-refresh/only-export-components -- this module intentionally
   pairs the imperative `toast` API with the <ToastProvider> that renders it; splitting
   them would make the "call toast.error() from anywhere, including api/client.ts" API
   pattern awkward for no real benefit here. */
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: number;
  variant: ToastVariant;
  title: string;
  description?: string;
}

type Listener = (toast: Omit<ToastItem, "id">) => void;

let listener: Listener | null = null;

function emit(variant: ToastVariant, title: string, description?: string) {
  if (listener) {
    listener({ variant, title, description });
  }
}

/** Imperative toast API — usable from anywhere, including outside React (e.g. the API client). */
export const toast = {
  success: (title: string, description?: string) => emit("success", title, description),
  error: (title: string, description?: string) => emit("error", title, description),
  info: (title: string, description?: string) => emit("info", title, description),
  warning: (title: string, description?: string) => emit("warning", title, description),
};

const ToastCtx = createContext<null>(null);

const VARIANT_STYLES: Record<ToastVariant, { icon: typeof CheckCircle2; classes: string }> = {
  success: { icon: CheckCircle2, classes: "text-status-succeeded bg-status-succeeded/10 border-status-succeeded/30" },
  error: { icon: XCircle, classes: "text-status-failed bg-status-failed/10 border-status-failed/30" },
  warning: { icon: AlertTriangle, classes: "text-status-queued bg-status-queued/10 border-status-queued/30" },
  info: { icon: Info, classes: "text-status-processing bg-status-processing/10 border-status-processing/30" },
};

let idCounter = 1;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  useEffect(() => {
    listener = (t) => {
      const id = idCounter++;
      setItems((prev) => [...prev, { ...t, id }]);
      const timer = setTimeout(() => dismiss(id), 5000);
      timers.current.set(id, timer);
    };
    return () => {
      listener = null;
    };
  }, [dismiss]);

  return (
    <ToastCtx.Provider value={null}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2 sm:bottom-6 sm:right-6"
        aria-live="polite"
      >
        {items.map((t) => {
          const style = VARIANT_STYLES[t.variant];
          const Icon = style.icon;
          return (
            <div
              key={t.id}
              className={cn(
                "pointer-events-auto animate-slide-in-right rounded-lg border bg-surface-raised/95 p-3.5 shadow-popover backdrop-blur-sm",
                "flex items-start gap-3"
              )}
              role="status"
            >
              <div className={cn("mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border", style.classes)}>
                <Icon size={14} strokeWidth={2.5} />
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium text-ink">{t.title}</p>
                {t.description && <p className="mt-0.5 text-xs text-ink-muted">{t.description}</p>}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="focus-ring shrink-0 rounded p-1 text-ink-faint transition hover:bg-surface hover:text-ink"
                aria-label="Dismiss notification"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToastContext() {
  return useContext(ToastCtx);
}
