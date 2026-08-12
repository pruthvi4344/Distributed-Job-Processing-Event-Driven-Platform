import { cn } from "@/lib/utils";

interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  className?: string;
}

export function Slider({ value, min = 0, max = 10, step = 1, onChange, className }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className={cn("relative flex h-5 items-center", className)}>
      <div
        className="pointer-events-none absolute h-1.5 w-full rounded-full bg-border-subtle"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute h-1.5 rounded-full bg-accent"
        style={{ width: `${pct}%` }}
        aria-hidden
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          "focus-ring relative z-10 h-5 w-full cursor-pointer appearance-none bg-transparent",
          "[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none",
          "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:border-2",
          "[&::-webkit-slider-thumb]:border-surface [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer",
          "[&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110",
          "[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:appearance-none",
          "[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-accent [&::-moz-range-thumb]:border-2",
          "[&::-moz-range-thumb]:border-surface [&::-moz-range-thumb]:cursor-pointer"
        )}
      />
    </div>
  );
}
