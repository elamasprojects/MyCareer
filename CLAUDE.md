# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build (also runs TypeScript + ESLint checks)
npm run lint         # ESLint only
```

No test framework is configured yet.

## Architecture

**MyDegree** is a personalized on-demand university platform for entrepreneurs. Next.js 14 App Router + Supabase (PostgreSQL, Auth, RLS).

### Data flow

1. `src/middleware.ts` refreshes the Supabase auth session on every request and redirects unauthenticated users to `/login`
2. Pages are **async server components** that fetch data via `src/lib/queries.ts` (uses the server Supabase client)
3. Data is passed as **props** to `"use client"` components for interactivity
4. Writes go through **server actions** in `src/lib/mutations.ts` which call Supabase RPCs or direct table operations, then `revalidatePath()` to refresh
5. The Sidebar is a client component that fetches progress via the browser Supabase client

### Two Supabase clients

- `src/lib/supabase/server.ts` — uses `createServerClient` + cookies from `next/headers` (for server components, server actions, route handlers)
- `src/lib/supabase/client.ts` — uses `createBrowserClient` (for `"use client"` components). **Never call at module scope** in pages that get statically prerendered — move inside event handlers or `useEffect`

### Key data layer files

- `src/lib/types.ts` — DB row types (`SubjectRow`, `ClassRow`, etc.), view types (`SubjectWithProgress`), composite types (`ModuleWithClasses`, `ClassWithResources`), computed types (`ProgressWithLevels`), and legacy aliases (`Subject`, `Module`, `Class`)
- `src/lib/queries.ts` — all read operations; maps the `subject_progress` view columns to frontend names via `mapSubjectView()`
- `src/lib/mutations.ts` — server actions for `completeClass`/`uncompleteClass` (Supabase RPCs), `updateBusinessContext` (upsert), subject CRUD

### Database

All tables have RLS policies filtering by `auth.uid() = user_id`. Key tables: `subjects`, `modules`, `classes`, `resources`, `business_context`, `progress`. The `subject_progress` view joins subjects with computed progress stats.

Two RPC functions: `complete_class(p_class_id)` and `uncomplete_class(p_class_id)` handle XP, levels, and streaks server-side.

### Auth

Email/password via Supabase Auth. Login at `/login` (client component), callback at `/auth/callback`, sign-out via `src/lib/auth-actions.ts` server action.

## Conventions

- **Styling**: CSS variables for theming (dark mode only), used as `className="bg-[var(--accent)]"`. Reusable classes like `.form-input` defined in `globals.css`
- **Icons**: `lucide-react` — icon names stored as strings in DB `subjects.icon` field, mapped to components via an icon map in subject pages
- **Animations**: `framer-motion` for transitions and micro-interactions
- **Path alias**: `@/*` maps to `./src/*`
- **Fonts**: DM Sans (body), JetBrains Mono (mono), Instrument Serif (display) — loaded via `next/font`

## Environment

Required env vars (set in Vercel for all environments):
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Supabase project ref: `uprfiwxfgooeqdfasggh`
