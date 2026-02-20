import { notFound } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ClassContent from "@/components/class/ClassContent";
import ClassSidebar from "@/components/class/ClassSidebar";
import {
  getSubjectById,
  getClassById,
  getAdjacentClasses,
} from "@/lib/mock-data";

export default function ClassPage({
  params,
}: {
  params: { id: string; classId: string };
}) {
  const subject = getSubjectById(params.id);
  if (!subject) return notFound();

  const result = getClassById(params.id, params.classId);
  if (!result) return notFound();

  const { module, classData } = result;
  const { prev, next } = getAdjacentClasses(params.id, params.classId);

  return (
    <AppShell>
      <Breadcrumb
        items={[
          { label: "Materias", href: "/subjects" },
          { label: subject.title, href: `/subjects/${subject.id}` },
          { label: module.title },
          { label: classData.title },
        ]}
      />

      <h1 className="font-serif text-2xl text-[var(--text)] tracking-tight mb-6">
        {classData.title}
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main — 65% */}
        <div className="flex-1 min-w-0 lg:max-w-[65%]">
          <ClassContent classData={classData} />
        </div>

        {/* Sidebar — 35% */}
        <div className="w-full lg:w-[35%] shrink-0">
          <ClassSidebar
            classData={classData}
            module={module}
            subjectId={params.id}
            prevClass={prev}
            nextClass={next}
          />
        </div>
      </div>
    </AppShell>
  );
}
