"use client";

import { useState, useTransition, useEffect } from "react";
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
  Trash2,
  LucideIcon,
} from "lucide-react";
import { updateSubject, deleteSubject } from "@/lib/mutations";
import Button from "@/components/ui/Button";

const iconOptions: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "BookOpen", label: "Libro", icon: BookOpen },
  { value: "Users", label: "Personas", icon: Users },
  { value: "Workflow", label: "Procesos", icon: Workflow },
  { value: "BarChart3", label: "Analitica", icon: BarChart3 },
  { value: "Megaphone", label: "Marketing", icon: Megaphone },
];

const statusOptions = [
  { value: "draft", label: "Borrador" },
  { value: "active", label: "Activa" },
  { value: "completed", label: "Completada" },
  { value: "paused", label: "Pausada" },
] as const;

interface SubjectData {
  id: string;
  title: string;
  description: string | null;
  orientation: string;
  status: string;
  priority_score: number;
  icon: string;
}

interface EditSubjectModalProps {
  open: boolean;
  onClose: () => void;
  subject: SubjectData;
}

export default function EditSubjectModal({
  open,
  onClose,
  subject,
}: EditSubjectModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: subject.title,
    description: subject.description ?? "",
    orientation: subject.orientation as "base" | "business_oriented",
    status: subject.status as "draft" | "active" | "completed" | "paused",
    priority_score: subject.priority_score,
    icon: subject.icon,
  });

  // Reset form when subject changes or modal opens
  useEffect(() => {
    if (open) {
      setForm({
        title: subject.title,
        description: subject.description ?? "",
        orientation: subject.orientation as "base" | "business_oriented",
        status: subject.status as "draft" | "active" | "completed" | "paused",
        priority_score: subject.priority_score,
        icon: subject.icon,
      });
      setError(null);
      setShowDeleteConfirm(false);
    }
  }, [open, subject]);

  function handleClose() {
    if (isPending || isDeleting) return;
    setShowDeleteConfirm(false);
    onClose();
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;

    setError(null);
    startTransition(async () => {
      try {
        await updateSubject(subject.id, {
          title: form.title.trim(),
          description: form.description.trim() || undefined,
          orientation: form.orientation,
          status: form.status,
          priority_score: form.priority_score,
          icon: form.icon,
        });
        onClose();
        router.refresh();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error al actualizar la materia";
        setError(message);
      }
    });
  }

  function handleDelete() {
    setIsDeleting(true);
    setError(null);
    startTransition(async () => {
      try {
        await deleteSubject(subject.id);
        onClose();
        router.push("/subjects");
        router.refresh();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error al eliminar la materia";
        setError(message);
        setIsDeleting(false);
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
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[var(--border)]">
              <h2 className="text-lg font-semibold text-[var(--text)]">
                Editar materia
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
            <form onSubmit={handleSave} className="p-6 space-y-5">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                  Titulo *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="form-input"
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
                />
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                  Estado
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {statusOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({ ...prev, status: opt.value }))
                      }
                      className={`
                        px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border
                        ${
                          form.status === opt.value
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
                        px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border
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

              {/* Priority */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                  Prioridad: {form.priority_score}
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={form.priority_score}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      priority_score: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-[var(--accent)]"
                />
                <div className="flex justify-between text-[10px] font-mono text-[var(--text-dim)]">
                  <span>0</span>
                  <span>100</span>
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
              <div className="flex items-center justify-between pt-2">
                {/* Delete */}
                {!showDeleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-1.5 text-sm text-[var(--text-dim)] hover:text-[var(--danger)] transition-colors"
                  >
                    <Trash2 size={14} />
                    Eliminar
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--danger)]/10 text-[var(--danger)] border border-[var(--danger)]/20 hover:bg-[var(--danger)]/20 transition-colors disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Trash2 size={12} />
                      )}
                      Confirmar
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="text-xs text-[var(--text-dim)] hover:text-[var(--text-muted)] transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                )}

                {/* Save / Cancel */}
                <div className="flex items-center gap-3">
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
                    {isPending && !isDeleting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      "Guardar"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
