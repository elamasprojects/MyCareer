"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Loader2,
  BookOpen,
  Users,
  Workflow,
  BarChart3,
  Megaphone,
  LucideIcon,
} from "lucide-react";
import { createSubject } from "@/lib/mutations";
import Button from "@/components/ui/Button";

const iconOptions: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "BookOpen", label: "Libro", icon: BookOpen },
  { value: "Users", label: "Personas", icon: Users },
  { value: "Workflow", label: "Procesos", icon: Workflow },
  { value: "BarChart3", label: "Analitica", icon: BarChart3 },
  { value: "Megaphone", label: "Marketing", icon: Megaphone },
];

interface CreateSubjectModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateSubjectModal({
  open,
  onClose,
}: CreateSubjectModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    orientation: "business_oriented" as "base" | "business_oriented",
    icon: "BookOpen",
  });

  // Focus title input when modal opens
  useEffect(() => {
    if (open) {
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [open]);

  function resetForm() {
    setForm({
      title: "",
      description: "",
      orientation: "business_oriented",
      icon: "BookOpen",
    });
    setError(null);
  }

  function handleClose() {
    if (isPending) return;
    resetForm();
    onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;

    setError(null);
    startTransition(async () => {
      try {
        await createSubject({
          title: form.title.trim(),
          description: form.description.trim() || undefined,
          orientation: form.orientation,
          icon: form.icon,
        });
        resetForm();
        onClose();
        router.refresh();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error al crear la materia";
        setError(message);
      }
    });
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[var(--border)]">
              <h2 className="text-lg font-semibold text-[var(--text)]">
                Nueva materia
              </h2>
              <button
                onClick={handleClose}
                disabled={isPending}
                className="p-1.5 rounded-lg text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                  Titulo *
                </label>
                <input
                  ref={titleRef}
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="form-input"
                  placeholder="ej: Marketing Digital"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                  Descripcion
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className="form-input resize-none"
                  placeholder="De que trata esta materia..."
                />
              </div>

              {/* Orientation */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                  Orientacion
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      {
                        value: "business_oriented",
                        label: "Orientada al negocio",
                      },
                      { value: "base", label: "Base / General" },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          orientation: opt.value,
                        }))
                      }
                      className={`
                        px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                        border
                        ${
                          form.orientation === opt.value
                            ? "border-[var(--accent)]/40 bg-[var(--accent-dim)] text-[var(--accent)]"
                            : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-muted)] hover:border-[var(--border-hover)]"
                        }
                      `}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Icon */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                  Icono
                </label>
                <div className="flex gap-2">
                  {iconOptions.map((opt) => {
                    const IconComp = opt.icon;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({ ...prev, icon: opt.value }))
                        }
                        title={opt.label}
                        className={`
                          p-2.5 rounded-lg transition-all duration-200 border
                          ${
                            form.icon === opt.value
                              ? "border-[var(--accent)]/40 bg-[var(--accent-dim)] text-[var(--accent)]"
                              : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-dim)] hover:text-[var(--text-muted)] hover:border-[var(--border-hover)]"
                          }
                        `}
                      >
                        <IconComp size={18} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="text-xs text-[var(--danger)] bg-[var(--danger)]/10 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={handleClose}
                  disabled={isPending}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isPending || !form.title.trim()}
                >
                  {isPending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Creando...
                    </>
                  ) : (
                    "Crear materia"
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
