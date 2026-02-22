"use client";

import { useState } from "react";
import { Settings2, LucideIcon } from "lucide-react";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import EditSubjectModal from "./EditSubjectModal";

interface SubjectHeaderProps {
  subject: {
    id: string;
    title: string;
    description: string | null;
    orientation: string;
    status: string;
    priority_score: number;
    icon: string;
    progress_percent: number;
    classes_completed: number;
    classes_total: number;
  };
  Icon: LucideIcon;
  statusConfig: { label: string; variant: "green" | "accent" | "warm" | "muted" };
}

export default function SubjectHeader({
  subject,
  Icon,
  statusConfig: status,
}: SubjectHeaderProps) {
  const [showEdit, setShowEdit] = useState(false);

  return (
    <>
      <div className="mb-8">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
            <Icon size={22} className="text-[var(--text-muted)]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
              <h1 className="font-serif text-2xl text-[var(--text)] tracking-tight">
                {subject.title}
              </h1>
              <Badge variant={status.variant} size="sm">
                {status.label}
              </Badge>
              <Badge variant="blue" size="sm">
                Prioridad: {subject.priority_score}
              </Badge>
            </div>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              {subject.description}
            </p>
          </div>

          {/* Edit button */}
          <button
            onClick={() => setShowEdit(true)}
            className="p-2 rounded-lg text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] border border-transparent hover:border-[var(--border)] transition-all duration-200"
            title="Editar materia"
          >
            <Settings2 size={18} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="rounded-card border border-[var(--border)] bg-[var(--surface)] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--text-dim)]">
              Progreso general
            </span>
            <span className="text-sm font-mono font-medium text-[var(--text)]">
              {subject.progress_percent}%
            </span>
          </div>
          <ProgressBar
            value={subject.progress_percent}
            color={subject.progress_percent > 50 ? "green" : "accent"}
            size="md"
          />
          <p className="text-[12px] text-[var(--text-dim)] mt-2">
            {subject.classes_completed} de {subject.classes_total} clases
            completadas
          </p>
        </div>
      </div>

      {/* Edit modal */}
      <EditSubjectModal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        subject={subject}
      />
    </>
  );
}
