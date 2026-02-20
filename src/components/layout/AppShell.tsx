"use client";

import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Sidebar />
      <main className="lg:pl-[260px] transition-all duration-300">
        <div className="max-w-5xl mx-auto px-6 py-8 pt-16 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
