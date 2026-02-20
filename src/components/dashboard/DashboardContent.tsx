"use client";

import StatsCard from "./StatsCard";
import SubjectCard from "./SubjectCard";
import WelcomeBanner from "./WelcomeBanner";
import ProgressBar from "@/components/ui/ProgressBar";
import ProgressRing from "@/components/ui/ProgressRing";
import { mockSubjects, mockProgress, mockBusinessContext } from "@/lib/mock-data";

const sortedSubjects = [...mockSubjects].sort(
  (a, b) => b.priority_score - a.priority_score
);

export default function DashboardContent() {
  const xpInLevel =
    mockProgress.total_xp - mockProgress.xp_for_current_level;
  const xpNeeded =
    mockProgress.xp_for_next_level - mockProgress.xp_for_current_level;

  return (
    <>
      <WelcomeBanner streak={mockProgress.current_streak} />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
        <StatsCard
          label="XP Total"
          value={`${mockProgress.total_xp} XP`}
          icon="Zap"
          iconColor="var(--accent)"
          index={0}
          extra={
            <div className="flex items-center gap-2">
              <ProgressBar
                value={xpInLevel}
                max={xpNeeded}
                color="accent"
                size="sm"
              />
              <span className="text-[10px] font-mono text-[var(--text-dim)] whitespace-nowrap">
                Nv {mockProgress.level + 1}
              </span>
            </div>
          }
        />
        <StatsCard
          label="Nivel"
          value={`Nivel ${mockProgress.level}`}
          icon="Trophy"
          iconColor="var(--blue)"
          index={1}
          extra={
            <div className="flex items-center gap-2">
              <ProgressRing
                value={xpInLevel}
                max={xpNeeded}
                size={32}
                strokeWidth={2.5}
                color="var(--blue)"
              >
                <span className="text-[9px] font-mono font-bold text-[var(--blue)]">
                  {mockProgress.level}
                </span>
              </ProgressRing>
              <span className="text-[10px] font-mono text-[var(--text-dim)]">
                {xpInLevel}/{xpNeeded} XP
              </span>
            </div>
          }
        />
        <StatsCard
          label="Streak"
          value={`${mockProgress.current_streak} días`}
          icon="Flame"
          iconColor="var(--warm)"
          index={2}
          extra={
            mockProgress.current_streak > 5 ? (
              <span className="text-[11px] text-[var(--warm)] font-mono animate-pulse">
                En racha
              </span>
            ) : null
          }
        />
        <StatsCard
          label="Clases"
          value={`${mockProgress.classes_completed}`}
          icon="CheckCircle2"
          iconColor="var(--green)"
          index={3}
          extra={
            <span className="text-[11px] text-[var(--text-dim)] font-mono">
              completadas
            </span>
          }
        />
      </div>

      {/* Subjects */}
      <section className="mt-10">
        <div className="mb-5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--accent)]">
            Tus Materias
          </span>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Ordenadas por relevancia para tu negocio ahora
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedSubjects.map((subject, i) => (
            <SubjectCard key={subject.id} subject={subject} index={i} />
          ))}
        </div>
      </section>

      {/* Suggestion */}
      <div className="mt-8 rounded-card border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="flex items-start gap-3">
          <span className="text-lg leading-none mt-0.5">📌</span>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--text-dim)]">
              Sugerencia
            </span>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Tu negocio{" "}
              <span className="text-[var(--text)]">
                {mockBusinessContext.business_name}
              </span>{" "}
              está en fase de{" "}
              <span className="text-[var(--accent)]">
                {mockBusinessContext.current_phase}
              </span>
              . Enfocate en{" "}
              <span className="text-[var(--text)]">
                Liderazgo y Gestión de Equipos
              </span>{" "}
              y{" "}
              <span className="text-[var(--text)]">
                Optimización de Procesos
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
