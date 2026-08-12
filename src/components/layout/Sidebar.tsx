import { NavLink } from "react-router-dom";
import { LayoutDashboard, ListChecks, Cpu, Settings, Workflow, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/jobs", label: "Jobs", icon: ListChecks },
  { to: "/workers", label: "Workers", icon: Cpu },
  { to: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center gap-2.5 px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-accent-ink shadow-sm shadow-accent/30">
          <Workflow size={16} strokeWidth={2.5} />
        </div>
        <span className="text-[15px] font-bold tracking-tight text-ink">FlowGrid</span>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "focus-ring group flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent-soft text-accent"
                  : "text-ink-muted hover:bg-surface-raised hover:text-ink"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={16}
                  strokeWidth={2.25}
                  className={cn(isActive ? "text-accent" : "text-ink-faint group-hover:text-ink-muted")}
                />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-4 text-[11px] text-ink-faint">
        <p>FlowGrid Dashboard</p>
        <p className="mt-0.5">v0.1.0</p>
      </div>
    </div>
  );
}

export function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <>
      {/* Desktop */}
      <aside className="hidden w-60 shrink-0 border-r border-border bg-surface md:flex">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="absolute inset-0 animate-fade-in bg-black/40" onClick={onCloseMobile} />
          <div className="relative flex w-64 animate-slide-in-left flex-col border-r border-border bg-surface shadow-popover">
            <button
              onClick={onCloseMobile}
              className="focus-ring absolute right-3 top-3 rounded-md p-1.5 text-ink-faint hover:bg-surface-raised hover:text-ink"
              aria-label="Close menu"
            >
              <X size={16} />
            </button>
            <SidebarContent onNavigate={onCloseMobile} />
          </div>
        </div>
      )}
    </>
  );
}
