"use client";

import StatsCard from "./StatsCard";
import SubjectCard from "./SubjectCard";
import WelcomeBanner from "./WelcomeBanner";
import ProgressBar from "@/components/ui/ProgressBar";
import ProgressRing from "@/components/ui/ProgressRing";
import { Subject, BusinessContext, ProgressWithLevels } from "@/lib/types";

interface DashboardContentProps {
  subjects: Subject[];
  progress: ProgressWithLevels | null;
  business: BusinessContext | null;
}

export default function DashboardContent({
  subjects,
  progress,
  business,
}: DashboardContentProps) {
  const p = progress ?? {
    total_xp: 0,
    level: 1,
    current_streak: 0,
    classes_completed: 0,
    xp_for_current_level: 0,
    xp_for_next_level: 100,
  };

  const xpInLevel = p.total_xp - p.xp_for_current_level;
  const xpNeeded = p.xp_for_next_level - p.xp_for_current_level;

  const sortedSubjects = [...subjects].sort(
    (a, b) => b.priority_score - a.priority_score
  );

  return (
    <>
      <WelcomeBanner streak={p.current_streak} />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
        <StatsCard
          label="XP Total"
          value={`${p.total_xp} XP`}
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
                Nv {p.level + 1}
              </span>
            </div>
          }
        />
        <StatsCard
          label="Nivel"
          value={`Nivel ${p.level}`}
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
                  {p.level}
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
          value={`${p.current_streak} dias`}
          icon="Flame"
          iconColor="var(--warm)"
          index={2}
          extra={
            p.current_streak > 5 ? (
              <span className="text-[11px] text-[var(--warm)] font-mono animate-pulse">
                En racha
              </span>
            ) : null
          }
        />
        <StatsCard
          label="Clases"
          value={`${p.classes_completed}`}
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
        {sortedSubjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedSubjects.map((subject, i) => (
              <SubjectCard key={subject.id} subject={subject} index={i} />
            ))}
          </div>
        ) : (
          <div className="rounded-card border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
            <p className="text-sm text-[var(--text-dim)]">
              Aun no tienes materias. Crea tu primera materia para empezar.
            </p>
          </div>
        )}
      </section>

      {/* Suggestion */}
      {business && (
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
                  {business.business_name}
                </span>{" "}
                esta en fase de{" "}
                <span className="text-[var(--accent)]">
                  {business.current_phase}
                </span>
                . Enfocate en las materias de mayor prioridad.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
