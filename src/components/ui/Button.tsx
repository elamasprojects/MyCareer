import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  primary:
    "bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hover)] font-semibold",
  secondary:
    "bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--border-hover)]",
  ghost:
    "bg-transparent text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]",
  outline:
    "bg-transparent text-[var(--accent)] border border-[var(--accent)]/30 hover:border-[var(--accent)] hover:bg-[var(--accent-dim)]",
};

const sizeStyles: Record<string, string> = {
  sm: "text-xs px-3 py-1.5 gap-1.5",
  md: "text-sm px-4 py-2 gap-2",
  lg: "text-sm px-5 py-2.5 gap-2",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center rounded-lg font-medium
          transition-all duration-200 ease-out
          disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
