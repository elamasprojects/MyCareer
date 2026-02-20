"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Globe,
  Youtube,
  BookOpen,
  FileQuestion,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { Class, Module, Resource } from "@/lib/types";

const resourceIcons: Record<Resource["type"], typeof FileText> = {
  pdf: FileText,
  paper: BookOpen,
  article: Globe,
  youtube: Youtube,
  other: FileQuestion,
};

interface ClassSidebarProps {
  classData: Class;
  module: Module;
  subjectId: string;
  prevClass: Class | null;
  nextClass: Class | null;
}

export default function ClassSidebar({
  classData,
  module,
  subjectId,
  prevClass,
  nextClass,
}: ClassSidebarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay: 0.1 }}
      className="space-y-5"
    >
      {/* Resources */}
      {classData.resources.length > 0 && (
        <div className="rounded-card border border-[var(--border)] bg-[var(--surface)] p-4">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--text-dim)]">
            Recursos
          </span>
          <div className="mt-3 space-y-1.5">
            {classData.resources.map((resource) => {
              const Icon = resourceIcons[resource.type] || FileQuestion;
              return (
                <a
                  key={resource.id}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 py-2 px-2 -mx-2 rounded-lg hover:bg-[var(--surface-2)] transition-colors duration-200 group"
                >
                  <Icon
                    size={14}
                    className="text-[var(--text-dim)] group-hover:text-[var(--text-muted)] shrink-0"
                  />
                  <span className="text-sm text-[var(--text-muted)] group-hover:text-[var(--text)] truncate">
                    {resource.title}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--text-dim)] uppercase ml-auto shrink-0">
                    {resource.type}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-2">
        {prevClass ? (
          <Link
            href={`/subjects/${subjectId}/classes/${prevClass.id}`}
            className="flex-1 flex items-center gap-2 py-2.5 px-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-hover)] transition-colors duration-200 text-sm text-[var(--text-muted)] hover:text-[var(--text)]"
          >
            <ChevronLeft size={14} className="shrink-0" />
            <span className="truncate">Anterior</span>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
        {nextClass ? (
          <Link
            href={`/subjects/${subjectId}/classes/${nextClass.id}`}
            className="flex-1 flex items-center justify-end gap-2 py-2.5 px-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-hover)] transition-colors duration-200 text-sm text-[var(--text-muted)] hover:text-[var(--text)]"
          >
            <span className="truncate">Siguiente</span>
            <ChevronRight size={14} className="shrink-0" />
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>

      {/* Module index */}
      <div className="rounded-card border border-[var(--border)] bg-[var(--surface)] p-4">
        <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--text-dim)]">
          {module.title}
        </span>
        <div className="mt-3 space-y-0.5">
          {module.classes
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((cls) => {
              const isCurrent = cls.id === classData.id;
              const isDone = cls.status === "completed";
              return (
                <Link
                  key={cls.id}
                  href={`/subjects/${subjectId}/classes/${cls.id}`}
                >
                  <div
                    className={`flex items-center gap-2.5 py-2 px-2 -mx-2 rounded-lg text-sm transition-colors duration-200 ${
                      isCurrent
                        ? "bg-[var(--accent-dim)] text-[var(--accent)] font-medium"
                        : "text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2
                        size={14}
                        className={
                          isCurrent
                            ? "text-[var(--accent)] shrink-0"
                            : "text-[var(--green)] shrink-0"
                        }
                      />
                    ) : (
                      <Circle
                        size={14}
                        className={
                          isCurrent
                            ? "text-[var(--accent)] shrink-0"
                            : "text-[var(--text-dim)] shrink-0"
                        }
                      />
                    )}
                    <span className="truncate">{cls.title}</span>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </motion.div>
  );
}
