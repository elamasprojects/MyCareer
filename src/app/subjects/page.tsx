"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Header from "@/components/layout/Header";
import SubjectCard from "@/components/dashboard/SubjectCard";
import Button from "@/components/ui/Button";
import { mockSubjects, mockProgress } from "@/lib/mock-data";
import { Subject } from "@/lib/types";

type FilterTab = "all" | "active" | "completed" | "draft";

const tabs: { key: FilterTab; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "active", label: "Activas" },
  { key: "completed", label: "Completadas" },
  { key: "draft", label: "Borrador" },
];

function filterSubjects(subjects: Subject[], filter: FilterTab): Subject[] {
  if (filter === "all") return subjects;
  return subjects.filter((s) => s.status === filter);
}

export default function SubjectsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const sorted = [...mockSubjects].sort(
    (a, b) => b.priority_score - a.priority_score
  );
  const filtered = filterSubjects(sorted, activeFilter);

  return (
    <AppShell>
      <Header
        title="Materias"
        subtitle={`${mockSubjects.length} materias · ${mockProgress.classes_completed} clases completadas`}
        action={
          <div className="relative group">
            <Button variant="outline" size="sm" disabled>
              <Plus size={14} />
              Nueva materia
            </Button>
            <span className="absolute right-0 top-full mt-2 px-2.5 py-1.5 text-[10px] font-mono bg-[var(--surface-2)] text-[var(--text-dim)] border border-[var(--border)] rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Próximamente con IA
            </span>
          </div>
        }
      />

      {/* Filter tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-[var(--border)]">
        {tabs.map((tab) => {
          const count = filterSubjects(sorted, tab.key).length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`
                px-4 py-2.5 text-sm font-medium transition-all duration-200 relative
                ${
                  activeFilter === tab.key
                    ? "text-[var(--text)]"
                    : "text-[var(--text-dim)] hover:text-[var(--text-muted)]"
                }
              `}
            >
              {tab.label}
              <span className="ml-1.5 text-[11px] font-mono text-[var(--text-dim)]">
                {count}
              </span>
              {activeFilter === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--accent)] rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((subject, i) => (
            <SubjectCard key={subject.id} subject={subject} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-sm text-[var(--text-dim)]">
            No hay materias con este filtro.
          </p>
        </div>
      )}
    </AppShell>
  );
}
