import { useEffect, useState } from "react";
import { KeyRound, Database, Server, Eye, EyeOff, Check } from "lucide-react";
import { useApiKey } from "@/hooks/useApiKey";
import { useHealth } from "@/hooks/useStats";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { toast } from "@/lib/toast";
import { API_BASE } from "@/api/client";
import { cn } from "@/lib/utils";

function CheckBadge({ label, status }: { label: string; status: "up" | "down" | undefined }) {
  const ok = status === "up";
  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-surface-raised px-3 py-2.5">
      <span className="text-sm text-ink-muted">{label}</span>
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium border",
          ok
            ? "bg-status-succeeded/10 text-status-succeeded border-status-succeeded/25"
            : "bg-status-failed/10 text-status-failed border-status-failed/25"
        )}
      >
        <span className={cn("h-1.5 w-1.5 rounded-full", ok ? "bg-status-succeeded" : "bg-status-failed")} />
        {status === undefined ? "unknown" : ok ? "up" : "down"}
      </span>
    </div>
  );
}

export function SettingsPanel() {
  const { apiKey, setApiKey } = useApiKey();
  const [draft, setDraft] = useState(apiKey);
  const [visible, setVisible] = useState(false);
  const [saved, setSaved] = useState(false);
  const { data: health, isLoading: healthLoading, isError: healthError } = useHealth();

  useEffect(() => {
    setDraft(apiKey);
  }, [apiKey]);

  const handleSave = () => {
    setApiKey(draft);
    setSaved(true);
    toast.success("Settings saved", draft ? "API key updated." : "API key cleared.");
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="space-y-5 p-5">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound size={15} className="text-ink-faint" />
            API Key
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-ink-muted">
            Only required if the server has <code className="rounded bg-surface-raised px-1 py-0.5 font-mono">REQUIRE_API_KEY=true</code>.
            Sent as <code className="rounded bg-surface-raised px-1 py-0.5 font-mono">X-API-Key</code> on every request. Stored locally in your browser only.
          </p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type={visible ? "text" : "password"}
                placeholder="sk-flowgrid-..."
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="pr-9"
              />
              <button
                onClick={() => setVisible((v) => !v)}
                className="focus-ring absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-ink-faint hover:text-ink"
                aria-label={visible ? "Hide API key" : "Show API key"}
                type="button"
              >
                {visible ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <Button variant="primary" onClick={handleSave}>
              {saved ? <Check size={14} /> : "Save"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server size={15} className="text-ink-faint" />
            Connection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-md border border-border bg-surface-raised px-3 py-2.5">
            <span className="text-sm text-ink-muted">API base URL</span>
            <span className="font-mono text-xs text-ink">{API_BASE}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database size={15} className="text-ink-faint" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {healthLoading ? (
            <>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </>
          ) : healthError ? (
            <p className="text-sm text-status-failed">Could not reach the health endpoint.</p>
          ) : (
            <>
              <CheckBadge label="Database" status={health?.checks.database} />
              <CheckBadge label="Redis" status={health?.checks.redis} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
