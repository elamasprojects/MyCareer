"use client";

import { useState } from "react";
import SubjectCard from "@/components/dashboard/SubjectCard";
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

interface SubjectsListProps {
  subjects: Subject[];
}

export default function SubjectsList({ subjects }: SubjectsListProps) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const sorted = [...subjects].sort(
    (a, b) => b.priority_score - a.priority_score
  );
  const filtered = filterSubjects(sorted, activeFilter);

  return (
    <>
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
    </>
  );
}
