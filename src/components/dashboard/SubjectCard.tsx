"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Workflow,
  BarChart3,
  Megaphone,
  LucideIcon,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import ProgressRing from "@/components/ui/ProgressRing";
import { Subject } from "@/lib/types";

const iconMap: Record<string, LucideIcon> = {
  Users,
  Workflow,
  BarChart3,
  Megaphone,
};

const statusConfig: Record<
  string,
  { label: string; variant: "green" | "accent" | "warm" | "muted" | "blue" }
> = {
  active: { label: "Activa", variant: "green" },
  draft: { label: "Borrador", variant: "muted" },
  completed: { label: "Completada", variant: "accent" },
  paused: { label: "Pausada", variant: "warm" },
};

const ringColorMap: Record<string, string> = {
  active: "var(--green)",
  draft: "var(--text-dim)",
  completed: "var(--accent)",
  paused: "var(--warm)",
};

interface SubjectCardProps {
  subject: Subject;
  index?: number;
}

export default function SubjectCard({ subject, index = 0 }: SubjectCardProps) {
  const Icon = iconMap[subject.icon] || BarChart3;
  const status = statusConfig[subject.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay: index * 0.06 }}
    >
      <Link href={`/subjects/${subject.id}`}>
        <div className="group rounded-card border border-[var(--border)] bg-[var(--surface)] p-5 transition-all duration-200 ease-out hover:border-[var(--accent)]/40 hover:-translate-y-0.5 cursor-pointer h-full flex flex-col">
          {/* Top row */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <ProgressRing
                value={subject.progress_percent}
                size={40}
                strokeWidth={2.5}
                color={ringColorMap[subject.status] || "var(--accent)"}
              >
                <Icon size={16} className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors duration-200" />
              </ProgressRing>
              <div>
                <h3 className="text-[15px] font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors duration-200 leading-tight">
                  {subject.title}
                </h3>
                <span className="text-[11px] font-mono text-[var(--text-dim)]">
                  {subject.classes_completed}/{subject.classes_total} clases ·{" "}
                  {subject.progress_percent}%
                </span>
              </div>
            </div>
            <Badge variant={status.variant} size="sm">
              {status.label}
            </Badge>
          </div>

          <p className="text-sm text-[var(--text-muted)] line-clamp-2 mb-4 flex-1">
            {subject.description}
          </p>

          <div className="flex items-center justify-between">
            <Badge variant="blue" size="sm">
              Prioridad: {subject.priority_score}
            </Badge>
            <span className="text-[11px] font-mono text-[var(--text-dim)] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Ver materia →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
