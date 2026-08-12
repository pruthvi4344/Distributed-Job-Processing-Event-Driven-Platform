import { SettingsPanel } from "@/components/settings/SettingsPanel";

export function Settings() {
  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-1">
        <h2 className="text-lg font-semibold tracking-tight text-ink">Settings</h2>
        <p className="text-sm text-ink-muted">Manage your API key and view backend connectivity.</p>
      </div>
      <div className="-mx-5">
        <SettingsPanel />
      </div>
    </div>
  );
}
