import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Sparkles } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Slider } from "@/components/ui/Slider";
import { createJob } from "@/api/jobs";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

const SUGGESTED_JOB_TYPES = ["flaky_task", "always_fails", "report_generation", "image_resize"];

interface NewJobModalProps {
  open: boolean;
  onClose: () => void;
}

export function NewJobModal({ open, onClose }: NewJobModalProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [jobType, setJobType] = useState("");
  const [payloadText, setPayloadText] = useState("{\n  \n}");
  const [payloadError, setPayloadError] = useState<string | null>(null);
  const [priority, setPriority] = useState(5);
  const [maxAttempts, setMaxAttempts] = useState(3);

  const mutation = useMutation({
    mutationFn: createJob,
    onSuccess: (job) => {
      toast.success("Job submitted", `${job.job_type} is now queued.`);
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["throughput"] });
      resetForm();
      onClose();
      navigate(`/jobs/${job.id}`);
    },
  });

  function resetForm() {
    setJobType("");
    setPayloadText("{\n  \n}");
    setPayloadError(null);
    setPriority(5);
    setMaxAttempts(3);
  }

  function handleClose() {
    if (mutation.isPending) return;
    resetForm();
    mutation.reset();
    onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!jobType.trim()) {
      toast.error("Job type is required");
      return;
    }

    let payload: Record<string, unknown> = {};
    const trimmed = payloadText.trim();
    if (trimmed) {
      try {
        const parsed = JSON.parse(trimmed);
        if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
          setPayloadError("Payload must be a JSON object, e.g. { \"key\": \"value\" }");
          return;
        }
        payload = parsed;
      } catch (err) {
        setPayloadError(err instanceof Error ? err.message : "Invalid JSON");
        return;
      }
    }
    setPayloadError(null);

    mutation.mutate({
      job_type: jobType.trim(),
      payload,
      priority,
      max_attempts: maxAttempts,
    });
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="New Job"
      description="Enqueue a job for the worker fleet to pick up."
    >
      <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-muted">Job type</label>
          <Input
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            placeholder="e.g. report_generation"
            autoFocus
            required
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {SUGGESTED_JOB_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setJobType(t)}
                className={cn(
                  "focus-ring inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                  jobType === t
                    ? "border-accent/30 bg-accent-soft text-accent"
                    : "border-border bg-surface-raised text-ink-muted hover:text-ink"
                )}
              >
                <Sparkles size={10} />
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-muted">Payload (JSON)</label>
          <Textarea
            value={payloadText}
            onChange={(e) => {
              setPayloadText(e.target.value);
              if (payloadError) setPayloadError(null);
            }}
            rows={5}
            spellCheck={false}
            className={cn(payloadError && "border-status-failed focus-visible:outline-status-failed")}
          />
          {payloadError && (
            <p className="mt-1.5 flex items-start gap-1.5 text-xs text-status-failed">
              <AlertCircle size={13} className="mt-0.5 shrink-0" />
              {payloadError}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs font-medium text-ink-muted">Priority</label>
              <span className="text-xs font-semibold tabular-nums text-ink">{priority}</span>
            </div>
            <Slider value={priority} min={0} max={10} step={1} onChange={setPriority} className="mt-2.5" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-muted">Max attempts</label>
            <Input
              type="number"
              min={1}
              max={10}
              value={maxAttempts}
              onChange={(e) => setMaxAttempts(Math.min(10, Math.max(1, Number(e.target.value) || 1)))}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border-subtle pt-4">
          <Button type="button" variant="ghost" onClick={handleClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={mutation.isPending}>
            Submit Job
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
