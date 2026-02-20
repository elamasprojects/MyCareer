import Link from "next/link";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { Class } from "@/lib/types";

interface ClassRowProps {
  classData: Class;
  subjectId: string;
  isActive?: boolean;
}

export default function ClassRow({
  classData,
  subjectId,
  isActive = false,
}: ClassRowProps) {
  const isCompleted = classData.status === "completed";

  return (
    <Link href={`/subjects/${subjectId}/classes/${classData.id}`}>
      <div
        className={`flex items-center gap-3 py-2.5 px-2 -mx-2 rounded-lg transition-all duration-200 group ${
          isActive
            ? "bg-[var(--accent-dim)] border border-[var(--accent)]/20"
            : "hover:bg-[var(--surface-2)]"
        }`}
      >
        {isCompleted ? (
          <CheckCircle2
            size={16}
            className="text-[var(--green)] shrink-0"
          />
        ) : (
          <Circle
            size={16}
            className="text-[var(--text-dim)] shrink-0 group-hover:text-[var(--text-muted)]"
          />
        )}

        <span
          className={`flex-1 text-sm truncate ${
            isActive
              ? "text-[var(--accent)] font-medium"
              : isCompleted
              ? "text-[var(--text-muted)]"
              : "text-[var(--text)] group-hover:text-[var(--text)]"
          }`}
        >
          {classData.title}
        </span>

        <div className="flex items-center gap-1 shrink-0">
          <Clock size={12} className="text-[var(--text-dim)]" />
          <span className="text-[11px] font-mono text-[var(--text-dim)]">
            {classData.estimated_minutes}m
          </span>
        </div>
      </div>
    </Link>
  );
}
