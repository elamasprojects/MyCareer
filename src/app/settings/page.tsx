import AppShell from "@/components/layout/AppShell";
import Header from "@/components/layout/Header";
import SettingsContent from "./SettingsContent";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <AppShell>
      <Header
        title="Settings"
        subtitle="Preferencias y configuracion de tu cuenta"
      />
      <SettingsContent
        userEmail={user?.email ?? ""}
        userName={user?.user_metadata?.name ?? user?.email?.split("@")[0] ?? ""}
      />
    </AppShell>
  );
}
