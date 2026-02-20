import AppShell from "@/components/layout/AppShell";
import Header from "@/components/layout/Header";
import SettingsContent from "./SettingsContent";

export default function SettingsPage() {
  return (
    <AppShell>
      <Header title="Settings" subtitle="Preferencias y configuración de tu cuenta" />
      <SettingsContent />
    </AppShell>
  );
}
