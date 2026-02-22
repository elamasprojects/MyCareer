"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Loader2, X } from "lucide-react";
import { createModule } from "@/lib/mutations";

interface AddModuleFormProps {
  subjectId: string;
}

export default function AddModuleForm({ subjectId }: AddModuleFormProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
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
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    startTransition(async () => {
      try {
        await createModule(subjectId, { title: title.trim() });
        setTitle("");
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
          className="w-full flex items-center justify-center gap-2 py-3 rounded-card border border-dashed border-[var(--border)] text-sm text-[var(--text-dim)] hover:text-[var(--text-muted)] hover:border-[var(--border-hover)] transition-all duration-200"
        >
          <Plus size={16} />
          Agregar modulo
        </motion.button>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.15 }}
          onSubmit={handleSubmit}
          className="flex items-center gap-2 p-3 rounded-card border border-[var(--border)] bg-[var(--surface)]"
        >
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nombre del modulo..."
            className="form-input flex-1"
            disabled={isPending}
            onKeyDown={(e) => e.key === "Escape" && handleClose()}
          />
          <button
            type="submit"
            disabled={isPending || !title.trim()}
            className="px-3 py-2 rounded-lg text-sm font-medium bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            {isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Agregar"
            )}
          </button>
          <button
            type="button"
            onClick={handleClose}
            disabled={isPending}
            className="p-2 rounded-lg text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
          >
            <X size={16} />
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
