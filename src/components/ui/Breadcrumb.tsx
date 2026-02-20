import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 text-[12px] font-mono mb-6">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && (
            <ChevronRight size={12} className="text-[var(--text-dim)]" />
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="text-[var(--text-dim)] hover:text-[var(--text-muted)] transition-colors duration-200"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[var(--text-muted)]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
