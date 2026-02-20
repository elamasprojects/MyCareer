"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Clock, Sun, Moon, Globe, Save, Check } from "lucide-react";
import {
  mockUserProfile,
  mockUserSettings,
} from "@/lib/mock-data";

const timezones = [
  "America/Argentina/Buenos_Aires",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Sao_Paulo",
  "America/Mexico_City",
  "America/Bogota",
  "Europe/London",
  "Europe/Madrid",
];

export default function SettingsContent() {
  const [profile, setProfile] = useState({ ...mockUserProfile });
  const [settings, setSettings] = useState({ ...mockUserSettings });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-2xl space-y-8">
      {/* Profile */}
      <SettingsSection title="Perfil" icon={User} index={0}>
        <div className="flex items-start gap-5 mb-5">
          <div className="w-14 h-14 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center shrink-0">
            <span className="text-xl font-serif text-[var(--accent)]">
              {profile.name.charAt(0)}
            </span>
          </div>
          <div className="flex-1 space-y-3">
            <div className="space-y-1.5">
              <label className="text-[12px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                Nombre
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, name: e.target.value }))
                }
                className="form-input w-full"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, email: e.target.value }))
                }
                className="form-input w-full"
              />
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Study Preferences */}
      <SettingsSection title="Preferencias de estudio" icon={Clock} index={1}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[12px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
              Horas por día
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0.5}
                max={8}
                step={0.5}
                value={settings.study_hours_per_day}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    study_hours_per_day: Number(e.target.value),
                  }))
                }
                className="flex-1 accent-[var(--accent)]"
              />
              <span className="text-sm font-mono text-[var(--text)] min-w-[40px] text-right">
                {settings.study_hours_per_day}h
              </span>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
              Días por semana
            </label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <button
                  key={day}
                  onClick={() =>
                    setSettings((s) => ({
                      ...s,
                      study_days_per_week: day,
                    }))
                  }
                  className={`
                    w-8 h-8 rounded-lg text-xs font-mono font-medium transition-all duration-200
                    ${
                      day <= settings.study_days_per_week
                        ? "bg-[var(--accent)] text-[var(--bg)]"
                        : "bg-[var(--surface-2)] text-[var(--text-dim)] border border-[var(--border)] hover:border-[var(--border-hover)]"
                    }
                  `}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>
        <p className="text-[11px] text-[var(--text-dim)] font-mono mt-3">
          {settings.study_hours_per_day * settings.study_days_per_week}h/semana
          de estudio planificadas
        </p>
      </SettingsSection>

      {/* Theme */}
      <SettingsSection title="Tema" icon={settings.theme === "dark" ? Moon : Sun} index={2}>
        <div className="flex gap-3">
          {(["dark", "light"] as const).map((theme) => (
            <button
              key={theme}
              onClick={() => setSettings((s) => ({ ...s, theme }))}
              className={`
                flex items-center gap-2.5 px-4 py-3 rounded-card border transition-all duration-200
                ${
                  settings.theme === theme
                    ? "border-[var(--accent)]/40 bg-[var(--accent-dim)]"
                    : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-hover)]"
                }
              `}
            >
              {theme === "dark" ? (
                <Moon
                  size={16}
                  className={
                    settings.theme === "dark"
                      ? "text-[var(--accent)]"
                      : "text-[var(--text-dim)]"
                  }
                />
              ) : (
                <Sun
                  size={16}
                  className={
                    settings.theme === "light"
                      ? "text-[var(--accent)]"
                      : "text-[var(--text-dim)]"
                  }
                />
              )}
              <span
                className={`text-sm font-medium ${
                  settings.theme === theme
                    ? "text-[var(--text)]"
                    : "text-[var(--text-muted)]"
                }`}
              >
                {theme === "dark" ? "Oscuro" : "Claro"}
              </span>
              {settings.theme === theme && (
                <Check size={14} className="text-[var(--accent)] ml-auto" />
              )}
            </button>
          ))}
        </div>
        {settings.theme === "light" && (
          <p className="text-[11px] text-[var(--warm)] font-mono mt-2">
            El tema claro estará disponible próximamente. Por ahora solo dark mode.
          </p>
        )}
      </SettingsSection>

      {/* Timezone */}
      <SettingsSection title="Zona horaria" icon={Globe} index={3}>
        <select
          value={profile.timezone}
          onChange={(e) =>
            setProfile((p) => ({ ...p, timezone: e.target.value }))
          }
          className="form-input w-full appearance-none cursor-pointer"
        >
          {timezones.map((tz) => (
            <option key={tz} value={tz}>
              {tz.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </SettingsSection>

      {/* Save */}
      <div className="pt-2 pb-8">
        <button
          onClick={handleSave}
          className={`
            inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium
            transition-all duration-200 ease-out
            ${
              saved
                ? "bg-[var(--green-dim)] border border-[var(--green)]/20 text-[var(--green)]"
                : "bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hover)]"
            }
          `}
        >
          {saved ? (
            <>
              <Check size={16} />
              Guardado
            </>
          ) : (
            <>
              <Save size={16} />
              Guardar cambios
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function SettingsSection({
  title,
  icon: Icon,
  index,
  children,
}: {
  title: string;
  icon: React.ElementType;
  index: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut", delay: index * 0.06 }}
      className="rounded-card border border-[var(--border)] bg-[var(--surface)] p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Icon size={15} className="text-[var(--text-dim)]" />
        <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--text-dim)]">
          {title}
        </span>
      </div>
      {children}
    </motion.div>
  );
}
