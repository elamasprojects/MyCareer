interface ProgressBarProps {
  value: number;
  max?: number;
  color?: "accent" | "warm" | "blue" | "green";
  size?: "sm" | "md";
  showLabel?: boolean;
}

const colorMap: Record<string, string> = {
  accent: "bg-[var(--accent)]",
  warm: "bg-[var(--warm)]",
  blue: "bg-[var(--blue)]",
  green: "bg-[var(--green)]",
};

export default function ProgressBar({
  value,
  max = 100,
  color = "accent",
  size = "sm",
  showLabel = false,
}: ProgressBarProps) {
  const percent = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className="flex items-center gap-2.5 w-full">
      <div
        className={`
          flex-1 rounded-full bg-[var(--surface-2)] overflow-hidden
          ${size === "sm" ? "h-1.5" : "h-2.5"}
        `}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorMap[color]}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-[11px] font-mono text-[var(--text-dim)] tabular-nums min-w-[32px] text-right">
          {percent}%
        </span>
      )}
    </div>
  );
}
