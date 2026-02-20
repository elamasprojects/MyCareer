import { notFound } from "next/navigation";
import {
  Users,
  Workflow,
  BarChart3,
  Megaphone,
  LucideIcon,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import SubjectSidebar from "@/components/subject/SubjectSidebar";
import SubjectModules from "./SubjectModules";
import { getSubjectById, getModulesForSubject } from "@/lib/mock-data";

const iconMap: Record<string, LucideIcon> = {
  Users,
  Workflow,
  BarChart3,
  Megaphone,
};

const statusConfig: Record<
  string,
  { label: string; variant: "green" | "accent" | "warm" | "muted" }
> = {
  active: { label: "Activa", variant: "green" },
  draft: { label: "Borrador", variant: "muted" },
  completed: { label: "Completada", variant: "accent" },
  paused: { label: "Pausada", variant: "warm" },
};

export default function SubjectPage({ params }: { params: { id: string } }) {
  const subject = getSubjectById(params.id);
  if (!subject) return notFound();

  const modules = getModulesForSubject(params.id);
  const Icon = iconMap[subject.icon] || BarChart3;
  const status = statusConfig[subject.status];

  return (
    <AppShell>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Materias", href: "/subjects" },
          { label: subject.title },
        ]}
      />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
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

          {/* Modules */}
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--accent)] mb-4 block">
              Módulos
            </span>
            <SubjectModules modules={modules} subjectId={params.id} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[280px] shrink-0">
          <SubjectSidebar subject={subject} modules={modules} />
        </div>
      </div>
    </AppShell>
  );
}
