import { useLocation } from "react-router-dom";
import { Menu, Moon, Sun, Settings as SettingsIcon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useHealth } from "@/hooks/useStats";
import { cn } from "@/lib/utils";
import { PulseDot } from "@/components/common/PulseDot";

const PAGE_TITLES: { match: (path: string) => boolean; title: string }[] = [
  { match: (p) => p === "/", title: "Overview" },
  { match: (p) => p.startsWith("/jobs/"), title: "Job Detail" },
  { match: (p) => p === "/jobs", title: "Jobs" },
  { match: (p) => p.startsWith("/workers"), title: "Workers" },
  { match: (p) => p.startsWith("/settings"), title: "Settings" },
];

function getPageTitle(pathname: string): string {
  return PAGE_TITLES.find((p) => p.match(pathname))?.title ?? "FlowGrid";
}

interface TopbarProps {
  onOpenMobileMenu: () => void;
  onOpenSettings: () => void;
}

export function Topbar({ onOpenMobileMenu, onOpenSettings }: TopbarProps) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { data: health } = useHealth();

  const healthy = health?.status === "healthy";
  const healthToken = health ? (healthy ? "succeeded" : "failed") : "cancelled";
  const healthLabel = health ? (healthy ? "All systems operational" : "Degraded — check Settings") : "Connecting...";

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-surface/80 px-4 backdrop-blur-md sm:px-6">
      <button
        onClick={onOpenMobileMenu}
        className="focus-ring -ml-1.5 rounded-md p-1.5 text-ink-muted hover:bg-surface-raised hover:text-ink md:hidden"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      <h1 className="text-[15px] font-semibold tracking-tight text-ink">{getPageTitle(location.pathname)}</h1>

      <div className="ml-auto flex items-center gap-1.5">
        <div
          className="hidden items-center gap-2 rounded-full border border-border bg-surface-raised px-2.5 py-1 sm:flex"
          title={healthLabel}
        >
          <PulseDot token={healthToken} pulse={healthy} />
          <span className="text-xs font-medium text-ink-muted">{healthLabel}</span>
        </div>

        <button
          onClick={toggleTheme}
          className="focus-ring rounded-md p-2 text-ink-muted transition hover:bg-surface-raised hover:text-ink"
          aria-label="Toggle color theme"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <button
          onClick={onOpenSettings}
          className={cn(
            "focus-ring rounded-md p-2 text-ink-muted transition hover:bg-surface-raised hover:text-ink"
          )}
          aria-label="Open settings"
        >
          <SettingsIcon size={16} />
        </button>
      </div>
    </header>
  );
}
