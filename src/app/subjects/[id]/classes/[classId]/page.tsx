import { notFound } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ClassContent from "@/components/class/ClassContent";
import ClassSidebar from "@/components/class/ClassSidebar";
import {
  getSubjectById,
  getClassById,
  getAdjacentClasses,
  getModulesWithClasses,
} from "@/lib/queries";

export default async function ClassPage({
  params,
}: {
  params: { id: string; classId: string };
}) {
  const [subject, classData, adjacent, modules] = await Promise.all([
    getSubjectById(params.id),
    getClassById(params.classId),
    getAdjacentClasses(params.id, params.classId),
    getModulesWithClasses(params.id),
  ]);

  if (!subject || !classData) return notFound();

  // Find the module this class belongs to
  const currentModule = modules.find((m) =>
    m.classes.some((c) => c.id === params.classId)
  );
  if (!currentModule) return notFound();

  return (
    <AppShell>
      <Breadcrumb
        items={[
          { label: "Materias", href: "/subjects" },
          { label: subject.title, href: `/subjects/${subject.id}` },
          { label: currentModule.title },
          { label: classData.title },
        ]}
      />

      <h1 className="font-serif text-2xl text-[var(--text)] tracking-tight mb-6">
        {classData.title}
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main */}
        <div className="flex-1 min-w-0 lg:max-w-[65%]">
          <ClassContent classData={classData} />
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[35%] shrink-0">
          <ClassSidebar
            classData={classData}
            module={currentModule}
            subjectId={params.id}
            prevClass={adjacent.prev}
            nextClass={adjacent.next}
          />
        </div>
      </div>
    </AppShell>
  );
}
