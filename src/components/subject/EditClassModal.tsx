"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Trash2 } from "lucide-react";
import { updateClass, deleteClass } from "@/lib/mutations";
import Button from "@/components/ui/Button";
import { ClassRow } from "@/lib/types";

interface EditClassModalProps {
  open: boolean;
  onClose: () => void;
  classData: ClassRow;
}

export default function EditClassModal({
  open,
  onClose,
  classData,
}: EditClassModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: classData.title,
    description: classData.description ?? "",
    youtube_url: classData.youtube_url ?? "",
    estimated_minutes: classData.estimated_minutes,
  });

  useEffect(() => {
    if (open) {
      setForm({
        title: classData.title,
        description: classData.description ?? "",
        youtube_url: classData.youtube_url ?? "",
        estimated_minutes: classData.estimated_minutes,
      });
      setError(null);
      setShowDeleteConfirm(false);
    }
  }, [open, classData]);

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
        await updateClass(classData.id, {
          title: form.title.trim(),
          description: form.description.trim() || undefined,
          youtube_url: form.youtube_url.trim() || undefined,
          estimated_minutes: form.estimated_minutes,
        });
        onClose();
        router.refresh();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error al actualizar la clase";
        setError(message);
      }
    });
  }

  function handleDelete() {
    setIsDeleting(true);
    setError(null);
    startTransition(async () => {
      try {
        await deleteClass(classData.id);
        onClose();
        router.refresh();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error al eliminar la clase";
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
            className="relative w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[var(--border)]">
              <h2 className="text-lg font-semibold text-[var(--text)]">
                Editar clase
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
            <form onSubmit={handleSave} className="p-6 space-y-4">
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

              {/* YouTube URL */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                  YouTube URL
                </label>
                <input
                  type="url"
                  value={form.youtube_url}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      youtube_url: e.target.value,
                    }))
                  }
                  className="form-input"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              {/* Estimated minutes */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                  Minutos estimados
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.estimated_minutes}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      estimated_minutes: Number(e.target.value) || 1,
                    }))
                  }
                  className="form-input w-24"
                />
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
