import { cn } from "@/lib/utils";

interface TabsProps {
  tabs: { value: string; label: string; count?: number }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Tabs({ tabs, value, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex items-center gap-1 rounded-lg bg-surface-raised p-1", className)} role="tablist">
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={cn(
              "focus-ring relative rounded-md px-3 py-1.5 text-sm font-medium transition-all",
              active ? "bg-surface text-ink shadow-sm" : "text-ink-muted hover:text-ink"
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn("ml-1.5 text-xs", active ? "text-ink-muted" : "text-ink-faint")}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
