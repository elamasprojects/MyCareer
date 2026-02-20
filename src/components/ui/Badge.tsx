interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "warm" | "blue" | "green" | "muted";
  size?: "sm" | "md";
}

const variantStyles: Record<string, string> = {
  default:
    "bg-[var(--surface-2)] text-[var(--text-muted)] border-[var(--border)]",
  accent: "bg-[var(--accent-dim)] text-[var(--accent)] border-[var(--accent)]/20",
  warm: "bg-[var(--warm-dim)] text-[var(--warm)] border-[var(--warm)]/20",
  blue: "bg-[var(--blue-dim)] text-[var(--blue)] border-[var(--blue)]/20",
  green: "bg-[var(--green-dim)] text-[var(--green)] border-[var(--green)]/20",
  muted:
    "bg-[var(--surface-2)] text-[var(--text-dim)] border-[var(--border)]",
};

export default function Badge({
  children,
  variant = "default",
  size = "sm",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center font-mono font-medium border rounded-full
        ${size === "sm" ? "text-[11px] px-2.5 py-0.5" : "text-xs px-3 py-1"}
        ${variantStyles[variant]}
      `}
    >
      {children}
    </span>
  );
}
