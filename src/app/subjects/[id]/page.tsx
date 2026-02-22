import { notFound } from "next/navigation";
import {
  Users,
  Workflow,
  BarChart3,
  Megaphone,
  BookOpen,
  LucideIcon,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SubjectSidebar from "@/components/subject/SubjectSidebar";
import SubjectModules from "./SubjectModules";
import SubjectHeader from "./SubjectHeader";
import { getSubjectById, getModulesWithClasses } from "@/lib/queries";

const iconMap: Record<string, LucideIcon> = {
  Users,
  Workflow,
  BarChart3,
  Megaphone,
  BookOpen,
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

export default async function SubjectPage({
  params,
}: {
  params: { id: string };
}) {
  const [subject, modules] = await Promise.all([
    getSubjectById(params.id),
    getModulesWithClasses(params.id),
  ]);

  if (!subject) return notFound();

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
          {/* Header with edit button */}
          <SubjectHeader
            subject={subject}
            Icon={Icon}
            statusConfig={status}
          />

          {/* Modules */}
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--accent)] mb-4 block">
              Modulos
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
