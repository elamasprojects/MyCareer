"use client";

import { motion } from "framer-motion";

interface WelcomeBannerProps {
  streak: number;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
}

export default function WelcomeBanner({ streak }: WelcomeBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative overflow-hidden rounded-card border border-[var(--border)] bg-[var(--surface)] p-6"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-dim)] via-transparent to-transparent pointer-events-none" />
      <div className="relative z-10">
        <h2 className="font-serif text-2xl text-[var(--text)] tracking-tight">
          {getGreeting()}, Ezequiel
        </h2>
        <p className="mt-1.5 text-sm text-[var(--text-muted)]">
          Llevas{" "}
          <span className="text-[var(--accent)] font-medium">
            {streak} días seguidos
          </span>{" "}
          aprendiendo. No pares.
        </p>
      </div>
      <div className="absolute top-3 right-4 text-[var(--accent)] opacity-[0.07] font-serif text-[80px] leading-none select-none pointer-events-none">
        {streak}
      </div>
    </motion.div>
  );
}
