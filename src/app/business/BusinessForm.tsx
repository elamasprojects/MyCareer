"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Check,
  X,
  Plus,
  Building2,
  DollarSign,
  UsersRound,
  Rocket,
  Tag,
} from "lucide-react";
import { mockBusinessContext } from "@/lib/mock-data";
import { BusinessContext } from "@/lib/types";

export default function BusinessForm() {
  const [form, setForm] = useState<BusinessContext>({
    ...mockBusinessContext,
  });
  const [tagInput, setTagInput] = useState("");
  const [saved, setSaved] = useState(false);

  const handleChange = useCallback(
    (field: keyof BusinessContext, value: string | number | string[]) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setSaved(false);
    },
    []
  );

  const addTag = useCallback(() => {
    const val = tagInput.trim();
    if (val && !form.current_needs.includes(val)) {
      handleChange("current_needs", [...form.current_needs, val]);
      setTagInput("");
    }
  }, [tagInput, form.current_needs, handleChange]);

  const removeTag = useCallback(
    (tag: string) => {
      handleChange(
        "current_needs",
        form.current_needs.filter((t) => t !== tag)
      );
    },
    [form.current_needs, handleChange]
  );

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Form */}
      <div className="flex-1 min-w-0 space-y-5">
        <FormField label="Nombre del negocio" icon={Building2}>
          <input
            type="text"
            value={form.business_name}
            onChange={(e) => handleChange("business_name", e.target.value)}
            className="form-input"
          />
        </FormField>

        <FormField label="Descripción">
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={4}
            className="form-input resize-none"
          />
        </FormField>

        <FormField label="Fase actual" icon={Rocket}>
          <input
            type="text"
            value={form.current_phase}
            onChange={(e) => handleChange("current_phase", e.target.value)}
            className="form-input"
            placeholder="ej: scaling, mvp, product-market-fit..."
          />
        </FormField>

        <FormField label="Necesidades actuales" icon={Tag}>
          <div className="space-y-2.5">
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {form.current_needs.map((tag) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono bg-[var(--accent-dim)] text-[var(--accent)] border border-[var(--accent)]/20 rounded-full"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-[var(--text)] transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Agregar necesidad..."
                className="form-input flex-1"
              />
              <button
                onClick={addTag}
                disabled={!tagInput.trim()}
                className="px-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-muted)] hover:border-[var(--border-hover)] hover:text-[var(--text)] transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Revenue mensual (USD)" icon={DollarSign}>
            <input
              type="number"
              value={form.revenue_monthly}
              onChange={(e) =>
                handleChange("revenue_monthly", Number(e.target.value))
              }
              className="form-input"
              min={0}
            />
          </FormField>

          <FormField label="Tamaño del equipo" icon={UsersRound}>
            <input
              type="number"
              value={form.team_size}
              onChange={(e) =>
                handleChange("team_size", Number(e.target.value))
              }
              className="form-input"
              min={1}
            />
          </FormField>
        </div>

        {/* Save button */}
        <div className="pt-2">
          <button
            onClick={handleSave}
            className={`
              inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium
              transition-all duration-200 ease-out
              ${
                saved
                  ? "bg-[var(--green-dim)] border border-[var(--green)]/20 text-[var(--green)]"
                  : "bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hover)]"
              }
            `}
          >
            {saved ? (
              <>
                <Check size={16} />
                Guardado
              </>
            ) : (
              <>
                <Save size={16} />
                Guardar cambios
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview card */}
      <div className="w-full lg:w-[340px] shrink-0">
        <div className="rounded-card border border-[var(--border)] bg-[var(--surface)] p-5 sticky top-8">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--accent)] block mb-4">
            Vista IA
          </span>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">
            Así es como la IA interpreta tu contexto para generar contenido
            personalizado:
          </p>
          <div className="space-y-3 text-sm">
            <PreviewRow
              label="Negocio"
              value={form.business_name || "—"}
            />
            <PreviewRow
              label="Fase"
              value={form.current_phase || "—"}
              highlight
            />
            <PreviewRow
              label="Revenue"
              value={
                form.revenue_monthly > 0
                  ? `$${form.revenue_monthly.toLocaleString()}/mes`
                  : "—"
              }
            />
            <PreviewRow
              label="Equipo"
              value={
                form.team_size > 0
                  ? `${form.team_size} persona${form.team_size !== 1 ? "s" : ""}`
                  : "—"
              }
            />
            {form.current_needs.length > 0 && (
              <div>
                <span className="text-[11px] font-mono text-[var(--text-dim)] uppercase">
                  Enfoque
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {form.current_needs.map((need) => (
                    <span
                      key={need}
                      className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--border)]"
                    >
                      {need}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          {form.description && (
            <div className="mt-4 pt-4 border-t border-[var(--border)]">
              <span className="text-[11px] font-mono text-[var(--text-dim)] uppercase">
                Descripción
              </span>
              <p className="text-[13px] text-[var(--text-muted)] mt-1 leading-relaxed line-clamp-4">
                {form.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-[12px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
        {Icon && <Icon size={13} className="text-[var(--text-dim)]" />}
        {label}
      </label>
      {children}
    </div>
  );
}

function PreviewRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-mono text-[var(--text-dim)] uppercase">
        {label}
      </span>
      <span
        className={`text-sm font-medium ${
          highlight ? "text-[var(--accent)]" : "text-[var(--text)]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
