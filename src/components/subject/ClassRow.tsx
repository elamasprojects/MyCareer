"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Clock, Pencil } from "lucide-react";
import { Class } from "@/lib/types";
import EditClassModal from "./EditClassModal";

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
  const [showEdit, setShowEdit] = useState(false);
  const isCompleted = classData.status === "completed";

  return (
    <>
      <div
        className={`flex items-center gap-3 py-2.5 px-2 -mx-2 rounded-lg transition-all duration-200 group/row ${
          isActive
            ? "bg-[var(--accent-dim)] border border-[var(--accent)]/20"
            : "hover:bg-[var(--surface-2)]"
        }`}
      >
        <Link
          href={`/subjects/${subjectId}/classes/${classData.id}`}
          className="flex items-center gap-3 flex-1 min-w-0"
        >
          {isCompleted ? (
            <CheckCircle2
              size={16}
              className="text-[var(--green)] shrink-0"
            />
          ) : (
            <Circle
              size={16}
              className="text-[var(--text-dim)] shrink-0 group-hover/row:text-[var(--text-muted)]"
            />
          )}

          <span
            className={`flex-1 text-sm truncate ${
              isActive
                ? "text-[var(--accent)] font-medium"
                : isCompleted
                ? "text-[var(--text-muted)]"
                : "text-[var(--text)] group-hover/row:text-[var(--text)]"
            }`}
          >
            {classData.title}
          </span>
        </Link>

        <div className="flex items-center gap-1 shrink-0">
          <div className="flex items-center gap-1">
            <Clock size={12} className="text-[var(--text-dim)]" />
            <span className="text-[11px] font-mono text-[var(--text-dim)]">
              {classData.estimated_minutes}m
            </span>
          </div>

          {/* Edit button — visible on hover */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowEdit(true);
            }}
            className="p-1 rounded text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-all opacity-0 group-hover/row:opacity-100"
            title="Editar clase"
          >
            <Pencil size={12} />
          </button>
        </div>
      </div>

      {/* Edit modal */}
      <EditClassModal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        classData={classData}
      />
    </>
  );
}
