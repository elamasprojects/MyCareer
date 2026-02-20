"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Sparkles } from "lucide-react";
import { Class } from "@/lib/types";

interface ClassContentProps {
  classData: Class;
}

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export default function ClassContent({ classData }: ClassContentProps) {
  const [completed, setCompleted] = useState(classData.status === "completed");
  const videoId = classData.youtube_url
    ? getYouTubeId(classData.youtube_url)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Video */}
      {videoId && (
        <div className="rounded-card overflow-hidden border border-[var(--border)] bg-black">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}`}
              title={classData.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Description */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--text-dim)]">
          Sobre esta clase
        </span>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          {classData.description}
        </p>
      </div>

      {/* Apply to business */}
      <div className="rounded-card border border-[var(--accent)]/20 bg-[var(--accent-dim)] p-5">
        <div className="flex items-center gap-2 mb-2.5">
          <Sparkles size={15} className="text-[var(--accent)]" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--accent)]">
            Aplicar a tu negocio
          </span>
        </div>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          {classData.apply_to_business ||
            "Este contenido se generará automáticamente con IA basado en tu contexto de negocio."}
        </p>
      </div>

      {/* Complete button */}
      <button
        onClick={() => setCompleted(!completed)}
        className={`
          w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium
          transition-all duration-200 ease-out border
          ${
            completed
              ? "bg-[var(--green-dim)] border-[var(--green)]/20 text-[var(--green)]"
              : "bg-[var(--surface)] border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
          }
        `}
      >
        {completed ? (
          <>
            <CheckCircle2 size={16} />
            Completada
          </>
        ) : (
          <>
            <Circle size={16} />
            Marcar como completada
          </>
        )}
      </button>
    </motion.div>
  );
}
