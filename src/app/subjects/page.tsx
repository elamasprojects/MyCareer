import AppShell from "@/components/layout/AppShell";
import Header from "@/components/layout/Header";
import SubjectsList from "./SubjectsList";
import { getSubjects, getProgress } from "@/lib/queries";

export default async function SubjectsPage() {
  const [subjects, progress] = await Promise.all([
    getSubjects(),
    getProgress(),
  ]);

  return (
    <AppShell>
      <Header
        title="Materias"
        subtitle={`${subjects.length} materias · ${progress?.classes_completed ?? 0} clases completadas`}
      />
      <SubjectsList subjects={subjects} />
    </AppShell>
  );
}
