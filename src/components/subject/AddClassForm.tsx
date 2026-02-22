"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Loader2 } from "lucide-react";
import { createClass } from "@/lib/mutations";

interface AddClassFormProps {
  moduleId: string;
}

export default function AddClassForm({ moduleId }: AddClassFormProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [minutes, setMinutes] = useState("15");
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleOpen() {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function handleClose() {
    if (isPending) return;
    setIsOpen(false);
    setTitle("");
    setMinutes("15");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    startTransition(async () => {
      try {
        await createClass(moduleId, {
          title: title.trim(),
          estimated_minutes: Number(minutes) || 15,
        });
        setTitle("");
        setMinutes("15");
        setIsOpen(false);
        router.refresh();
      } catch {
        // Keep form open on error
      }
    });
  }

  return (
    <AnimatePresence mode="wait">
      {!isOpen ? (
        <motion.button
          key="trigger"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOpen}
          className="w-full flex items-center gap-1.5 py-2 px-2 -mx-2 rounded-lg text-[12px] text-[var(--text-dim)] hover:text-[var(--text-muted)] hover:bg-[var(--surface-2)] transition-all duration-200"
        >
          <Plus size={14} />
          Agregar clase
        </motion.button>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.15 }}
          onSubmit={handleSubmit}
          className="space-y-2 py-2 overflow-hidden"
        >
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nombre de la clase..."
              className="form-input flex-1 text-sm"
              disabled={isPending}
              onKeyDown={(e) => e.key === "Escape" && handleClose()}
            />
            <input
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              placeholder="min"
              min={1}
              className="form-input w-16 text-sm text-center"
              disabled={isPending}
              title="Minutos estimados"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={isPending || !title.trim()}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              {isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                "Agregar"
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              className="px-3 py-1.5 rounded-lg text-xs text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
            >
              Cancelar
            </button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
