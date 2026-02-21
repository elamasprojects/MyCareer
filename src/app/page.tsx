import AppShell from "@/components/layout/AppShell";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { getSubjects, getProgress, getBusinessContext } from "@/lib/queries";

export default async function DashboardPage() {
  const [subjects, progress, business] = await Promise.all([
    getSubjects(),
    getProgress(),
    getBusinessContext(),
  ]);

  return (
    <AppShell>
      <DashboardContent
        subjects={subjects}
        progress={progress}
        business={business}
      />
    </AppShell>
  );
}
