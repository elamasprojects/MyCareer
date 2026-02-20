import { BookOpen, Clock, Calendar } from "lucide-react";
import { Subject, Module } from "@/lib/types";

interface SubjectSidebarProps {
  subject: Subject;
  modules: Module[];
}

function formatMinutes(mins: number): string {
  const hours = Math.floor(mins / 60);
  const remaining = mins % 60;
  if (hours === 0) return `${remaining}min`;
  return remaining > 0 ? `${hours}h ${remaining}min` : `${hours}h`;
}

export default function SubjectSidebar({
  subject,
  modules,
}: SubjectSidebarProps) {
  const totalMinutes = modules.reduce(
    (sum, mod) =>
      sum + mod.classes.reduce((s, c) => s + c.estimated_minutes, 0),
    0
  );

  const completedMinutes = modules.reduce(
    (sum, mod) =>
      sum +
      mod.classes
        .filter((c) => c.status === "completed")
        .reduce((s, c) => s + c.estimated_minutes, 0),
    0
  );

  const stats = [
    {
      icon: BookOpen,
      label: "Clases completadas",
      value: `${subject.classes_completed} / ${subject.classes_total}`,
    },
    {
      icon: Clock,
      label: "Tiempo total",
      value: formatMinutes(totalMinutes),
      sub: `${formatMinutes(completedMinutes)} cursadas`,
    },
    {
      icon: Calendar,
      label: "Fecha inicio",
      value: new Date(subject.created_at).toLocaleDateString("es-AR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    },
  ];

  return (
    <div className="rounded-card border border-[var(--border)] bg-[var(--surface)] p-4 space-y-4">
      <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--text-dim)]">
        Estadísticas
      </span>
      <div className="space-y-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="flex items-start gap-3">
              <Icon
                size={15}
                className="text-[var(--text-dim)] mt-0.5 shrink-0"
              />
              <div>
                <p className="text-[12px] text-[var(--text-dim)]">
                  {stat.label}
                </p>
                <p className="text-sm font-medium text-[var(--text)]">
                  {stat.value}
                </p>
                {stat.sub && (
                  <p className="text-[11px] text-[var(--text-dim)]">
                    {stat.sub}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
