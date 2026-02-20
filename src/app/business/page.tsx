import AppShell from "@/components/layout/AppShell";
import Header from "@/components/layout/Header";
import BusinessForm from "./BusinessForm";

export default function BusinessPage() {
  return (
    <AppShell>
      <Header
        title="Mi Negocio"
        subtitle="Contexto de negocio para personalizar tu programa"
      />
      <p className="text-sm text-[var(--text-muted)] mb-8 -mt-4 max-w-2xl leading-relaxed">
        Esta información se usa para personalizar todo tu programa. Cada vez que
        la actualices, tus materias se re-priorizan automáticamente.
      </p>
      <BusinessForm />
    </AppShell>
  );
}
