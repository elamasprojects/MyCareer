import AppShell from "@/components/layout/AppShell";
import Header from "@/components/layout/Header";
import BusinessForm from "./BusinessForm";
import { getBusinessContext } from "@/lib/queries";

export default async function BusinessPage() {
  const business = await getBusinessContext();

  return (
    <AppShell>
      <Header
        title="Mi Negocio"
        subtitle="Contexto de negocio para personalizar tu programa"
      />
      <p className="text-sm text-[var(--text-muted)] mb-8 -mt-4 max-w-2xl leading-relaxed">
        Esta informacion se usa para personalizar todo tu programa. Cada vez que
        la actualices, tus materias se re-priorizan automaticamente.
      </p>
      <BusinessForm initialData={business} />
    </AppShell>
  );
}
