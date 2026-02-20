"use client";

import { motion } from "framer-motion";
import { Zap, Trophy, Flame, CheckCircle2, LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Zap,
  Trophy,
  Flame,
  CheckCircle2,
};

interface StatsCardProps {
  label: string;
  value: string;
  icon: string;
  iconColor?: string;
  extra?: React.ReactNode;
  index?: number;
}

export default function StatsCard({
  label,
  value,
  icon,
  iconColor = "var(--text-muted)",
  extra,
  index = 0,
}: StatsCardProps) {
  const Icon = iconMap[icon] || Zap;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut", delay: index * 0.05 }}
      className="rounded-card border border-[var(--border)] bg-[var(--surface)] p-4 flex flex-col gap-3 hover:border-[var(--border-hover)] transition-colors duration-200"
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-dim)]">
          {label}
        </span>
        <Icon size={16} style={{ color: iconColor }} />
      </div>
      <div>
        <span className="text-2xl font-semibold text-[var(--text)] tracking-tight">
          {value}
        </span>
      </div>
      {extra && <div>{extra}</div>}
    </motion.div>
  );
}
