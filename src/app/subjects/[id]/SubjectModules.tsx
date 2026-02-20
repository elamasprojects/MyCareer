"use client";

import ModuleAccordion from "@/components/subject/ModuleAccordion";
import { Module } from "@/lib/types";

interface SubjectModulesProps {
  modules: Module[];
  subjectId: string;
}

export default function SubjectModules({
  modules,
  subjectId,
}: SubjectModulesProps) {
  const firstIncompleteIndex = modules.findIndex((m) =>
    m.classes.some((c) => c.status === "pending")
  );

  return (
    <div className="space-y-3">
      {modules.map((mod, i) => (
        <ModuleAccordion
          key={mod.id}
          module={mod}
          subjectId={subjectId}
          index={i}
          defaultOpen={i === firstIncompleteIndex}
        />
      ))}
    </div>
  );
}
