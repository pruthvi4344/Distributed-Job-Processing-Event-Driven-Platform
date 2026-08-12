import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { truncateMiddle } from "@/lib/utils";

export function CopyableId({ id, truncate = true, className }: { id: string; truncate?: boolean; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard not available — ignore
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "focus-ring inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-raised px-2 py-1 font-mono text-xs text-ink-muted transition hover:border-ink-faint/50 hover:text-ink",
        className
      )}
      title={id}
    >
      <span>{truncate ? truncateMiddle(id, 16) : id}</span>
      {copied ? <Check size={12} className="text-status-succeeded" /> : <Copy size={12} />}
    </button>
  );
}
