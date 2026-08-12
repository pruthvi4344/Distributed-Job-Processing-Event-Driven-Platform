import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Dialog } from "@/components/ui/Dialog";
import { SettingsPanel } from "@/components/settings/SettingsPanel";

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenMobileMenu={() => setMobileOpen(true)} onOpenSettings={() => setSettingsOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          <div key={location.pathname} className="mx-auto max-w-[1400px] animate-fade-in px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>

      <Dialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        variant="drawer"
        title="Settings"
        description="API key, connection, and system health"
      >
        <SettingsPanel />
      </Dialog>
    </div>
  );
}
