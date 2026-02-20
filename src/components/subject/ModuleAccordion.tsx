"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Lock } from "lucide-react";
import ClassRow from "./ClassRow";
import { Module } from "@/lib/types";

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
  const [open, setOpen] = useState(defaultOpen);
  const completedCount = module.classes.filter(
    (c) => c.status === "completed"
  ).length;
  const totalCount = module.classes.length;
  const allCompleted = completedCount === totalCount && totalCount > 0;

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
      <button
        onClick={() => !module.is_locked && setOpen(!open)}
        disabled={module.is_locked}
        className={`w-full flex items-center gap-3 p-4 text-left transition-colors duration-200 ${
          module.is_locked
            ? "cursor-not-allowed"
            : "hover:bg-[var(--surface-2)]"
        }`}
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
        </div>

        {!module.is_locked && (
          <ChevronDown
            size={16}
            className={`text-[var(--text-dim)] transition-transform duration-200 shrink-0 ${
              open ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
