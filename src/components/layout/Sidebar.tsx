"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  Calendar,
  Building2,
  Settings,
  ChevronLeft,
  Flame,
  Menu,
  X,
  Zap,
  LogOut,
} from "lucide-react";
import { signOut } from "@/lib/auth-actions";
import { createClient } from "@/lib/supabase/client";
import { computeLevelXP, type ProgressWithLevels } from "@/lib/types";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/subjects", label: "Materias", icon: BookOpen },
  {
    href: "#",
    label: "Calendario",
    icon: Calendar,
    disabled: true,
    tooltip: "Proximamente",
  },
  { href: "/business", label: "Mi Negocio", icon: Building2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

const defaultProgress: ProgressWithLevels = {
  id: "",
  user_id: "",
  total_xp: 0,
  level: 1,
  current_streak: 0,
  longest_streak: 0,
  classes_completed: 0,
  last_study_date: null,
  xp_for_current_level: 0,
  xp_for_next_level: 100,
};

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [progress, setProgress] = useState<ProgressWithLevels>(defaultProgress);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("progress")
        .select("*")
        .eq("user_id", user.id)
        .single()
        .then(({ data }) => {
          if (data) setProgress(computeLevelXP(data));
        });
    });
  }, [pathname]); // refresh when navigating

  const xpInLevel = progress.total_xp - progress.xp_for_current_level;
  const xpNeeded = progress.xp_for_next_level - progress.xp_for_current_level;
  const xpPercent = xpNeeded > 0 ? Math.round((xpInLevel / xpNeeded) * 100) : 0;

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)]"
      >
        <Menu size={20} className="text-[var(--text)]" />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen z-50 flex flex-col
          bg-[var(--surface)] border-r border-[var(--border)]
          transition-all duration-300 ease-out
          ${collapsed ? "w-[60px]" : "w-[260px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        `}
      >
        <div className="flex items-center justify-between h-14 px-4 border-b border-[var(--border)]">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-0.5">
              <span className="text-lg font-semibold text-[var(--text)]">
                My
              </span>
              <span className="text-lg font-semibold text-[var(--accent)]">
                Degree
              </span>
            </Link>
          )}
          <button
            onClick={() => {
              setCollapsed(!collapsed);
              setMobileOpen(false);
            }}
            className="p-1.5 rounded-md hover:bg-[var(--surface-2)] transition-colors duration-200 lg:block hidden"
          >
            <ChevronLeft
              size={16}
              className={`text-[var(--text-dim)] transition-transform duration-300 ${
                collapsed ? "rotate-180" : ""
              }`}
            />
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-md hover:bg-[var(--surface-2)] transition-colors duration-200 lg:hidden"
          >
            <X size={16} className="text-[var(--text-dim)]" />
          </button>
        </div>

        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href) && item.href !== "#";
            const Icon = item.icon;

            return (
              <div key={item.label} className="relative group">
                <Link
                  href={item.disabled ? "#" : item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                    transition-all duration-200 ease-out relative
                    ${
                      item.disabled
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-[var(--surface-2)]"
                    }
                    ${
                      isActive
                        ? "bg-[var(--surface-2)] text-[var(--text)]"
                        : "text-[var(--text-muted)]"
                    }
                  `}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-[var(--accent)] rounded-r-full" />
                  )}
                  <Icon
                    size={18}
                    className={isActive ? "text-[var(--accent)]" : ""}
                  />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
                {item.disabled && (
                  <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-[10px] font-mono bg-[var(--surface-2)] text-[var(--text-dim)] border border-[var(--border)] rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    {item.tooltip}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-2 pb-1">
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-all duration-200 w-full"
            >
              <LogOut size={18} />
              {!collapsed && <span>Salir</span>}
            </button>
          </form>
        </div>

        {/* Bottom gamification section */}
        <div className="border-t border-[var(--border)] p-3 space-y-2.5">
          {collapsed ? (
            <div className="flex flex-col items-center gap-2">
              <Flame size={16} className="text-[var(--warm)]" />
              <span className="text-[10px] font-mono text-[var(--text-dim)]">
                {progress.current_streak}
              </span>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5">
                  <Flame
                    size={14}
                    className={`text-[var(--warm)] ${
                      progress.current_streak > 5 ? "animate-pulse" : ""
                    }`}
                  />
                  <span className="text-xs font-mono text-[var(--text-muted)]">
                    {progress.current_streak} dias
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap size={12} className="text-[var(--accent)]" />
                  <span className="text-xs font-mono text-[var(--text-dim)]">
                    {progress.total_xp} XP
                  </span>
                </div>
              </div>
              <div className="px-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-[var(--text-dim)]">
                    Nivel {progress.level}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--text-dim)]">
                    {xpInLevel}/{xpNeeded} XP
                  </span>
                </div>
                <div className="h-1 rounded-full bg-[var(--surface-2)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
