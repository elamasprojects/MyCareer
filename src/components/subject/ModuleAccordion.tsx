"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Lock,
  MoreVertical,
  Pencil,
  Trash2,
  Loader2,
  Check,
  X,
} from "lucide-react";
import ClassRow from "./ClassRow";
import AddClassForm from "./AddClassForm";
import { Module } from "@/lib/types";
import { updateModule, deleteModule } from "@/lib/mutations";

interface ModuleAccordionProps {
  module: Module;
  subjectId: string;
  index: number;
  defaultOpen?: boolean;
}

export default function ModuleAccordion({
  module,
  subjectId,
  index,
  defaultOpen = false,
}: ModuleAccordionProps) {
  const router = useRouter();
  const [open, setOpen] = useState(defaultOpen);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(module.title);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const completedCount = module.classes.filter(
    (c) => c.status === "completed"
  ).length;
  const totalCount = module.classes.length;
  const allCompleted = completedCount === totalCount && totalCount > 0;

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    }
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showMenu]);

  // Focus edit input
  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }
  }, [isEditing]);

  function handleStartEdit() {
    setEditTitle(module.title);
    setIsEditing(true);
    setShowMenu(false);
  }

  function handleSaveEdit() {
    if (!editTitle.trim() || editTitle.trim() === module.title) {
      setIsEditing(false);
      return;
    }

    startTransition(async () => {
      try {
        await updateModule(module.id, { title: editTitle.trim() });
        setIsEditing(false);
        router.refresh();
      } catch {
        // Keep editing on error
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteModule(module.id);
        setShowDeleteConfirm(false);
        router.refresh();
      } catch {
        setShowDeleteConfirm(false);
      }
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut", delay: index * 0.06 }}
      className={`rounded-card border bg-[var(--surface)] overflow-hidden ${
        module.is_locked
          ? "border-[var(--border)] opacity-50"
          : "border-[var(--border)]"
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center gap-3 p-4 transition-colors duration-200 ${
          module.is_locked
            ? "cursor-not-allowed"
            : "hover:bg-[var(--surface-2)]"
        }`}
      >
        <button
          onClick={() => !module.is_locked && setOpen(!open)}
          disabled={module.is_locked}
          className="flex items-center gap-3 flex-1 min-w-0 text-left"
        >
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] shrink-0">
            {module.is_locked ? (
              <Lock size={13} className="text-[var(--text-dim)]" />
            ) : (
              <span className="text-[11px] font-mono font-semibold text-[var(--text-dim)]">
                {module.sort_order}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div
                className="flex items-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  ref={editInputRef}
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit();
                    if (e.key === "Escape") setIsEditing(false);
                  }}
                  className="form-input text-sm py-1"
                  disabled={isPending}
                />
                <button
                  onClick={handleSaveEdit}
                  disabled={isPending || !editTitle.trim()}
                  className="p-1 rounded text-[var(--green)] hover:bg-[var(--green-dim)] transition-colors disabled:opacity-40"
                >
                  {isPending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Check size={14} />
                  )}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  disabled={isPending}
                  className="p-1 rounded text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-sm font-semibold text-[var(--text)] truncate">
                  {module.title}
                </h3>
                <p className="text-[12px] text-[var(--text-dim)] mt-0.5">
                  {module.is_locked ? (
                    "Bloqueado — completa el módulo anterior"
                  ) : (
                    <>
                      {completedCount}/{totalCount} clases
                      {allCompleted && (
                        <span className="text-[var(--green)] ml-1.5">
                          · Completado
                        </span>
                      )}
                    </>
                  )}
                </p>
              </>
            )}
          </div>
        </button>

        {/* Kebab menu + chevron */}
        {!module.is_locked && !isEditing && (
          <div className="flex items-center gap-1 shrink-0">
            {/* Kebab menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-1.5 rounded-lg text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors opacity-0 group-hover:opacity-100"
                style={{ opacity: showMenu ? 1 : undefined }}
              >
                <MoreVertical size={14} />
              </button>

              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                    className="absolute right-0 top-full mt-1 z-20 w-36 rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-xl py-1"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartEdit();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
                    >
                      <Pencil size={14} />
                      Renombrar
                    </button>
                    {!showDeleteConfirm ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--surface-2)] transition-colors"
                      >
                        <Trash2 size={14} />
                        Eliminar
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete();
                        }}
                        disabled={isPending}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--danger)] bg-[var(--danger)]/5 hover:bg-[var(--danger)]/10 transition-colors disabled:opacity-50"
                      >
                        {isPending ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                        Confirmar
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Chevron */}
            <button
              onClick={() => setOpen(!open)}
              className="p-1"
            >
              <ChevronDown
                size={16}
                className={`text-[var(--text-dim)] transition-transform duration-200 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <AnimatePresence initial={false}>
        {open && !module.is_locked && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-[var(--border)] px-4 py-2">
              {module.classes
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((cls) => (
                  <ClassRow
                    key={cls.id}
                    classData={cls}
                    subjectId={subjectId}
                  />
                ))}

              {/* Add class form */}
              <AddClassForm moduleId={module.id} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
