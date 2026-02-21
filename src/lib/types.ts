// ── DB row types (match Supabase tables) ──

export interface BusinessContext {
  id: string;
  user_id: string;
  business_name: string;
  description: string | null;
  current_phase: string | null;
  current_needs: string[];
  revenue_monthly: number;
  team_size: number;
  updated_at: string;
  created_at: string;
}

export interface SubjectRow {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  orientation: "base" | "business_oriented";
  status: "draft" | "active" | "completed" | "paused";
  priority_score: number;
  icon: string;
  created_at: string;
}

export interface ModuleRow {
  id: string;
  subject_id: string;
  title: string;
  description: string | null;
  sort_order: number;
  is_locked: boolean;
}

export interface ClassRow {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  youtube_url: string | null;
  youtube_transcript: string | null;
  apply_to_business: string | null;
  sort_order: number;
  status: "pending" | "completed";
  completed_at: string | null;
  estimated_minutes: number;
}

export interface Resource {
  id: string;
  class_id: string;
  type: "pdf" | "paper" | "article" | "youtube" | "other";
  title: string;
  url: string | null;
  ai_summary: string | null;
  file_path: string | null;
  created_at?: string;
}

export interface Progress {
  id: string;
  user_id: string;
  total_xp: number;
  level: number;
  current_streak: number;
  longest_streak: number;
  classes_completed: number;
  last_study_date: string | null;
}

export interface ActionDoc {
  id: string;
  class_id: string;
  content: string | null;
  ai_suggestion: string | null;
  user_notes: string | null;
  created_at: string;
}

// ── View types (from subject_progress view) ──

export interface SubjectWithProgress {
  subject_id: string;
  user_id: string;
  title: string;
  description: string | null;
  orientation: "base" | "business_oriented";
  status: "draft" | "active" | "completed" | "paused";
  priority_score: number;
  icon: string;
  created_at: string;
  total_classes: number;
  completed_classes: number;
  progress_percent: number;
  total_modules: number;
  total_minutes: number;
}

// ── Frontend composite types ──

export interface ClassWithResources extends ClassRow {
  resources: Resource[];
}

export interface ModuleWithClasses extends ModuleRow {
  classes: ClassWithResources[];
}

// ── Gamification computed values ──

export interface ProgressWithLevels extends Progress {
  xp_for_current_level: number;
  xp_for_next_level: number;
}

export function computeLevelXP(progress: Progress): ProgressWithLevels {
  const xpPerLevel = 100;
  const xp_for_current_level = (progress.level - 1) * xpPerLevel;
  const xp_for_next_level = progress.level * xpPerLevel;
  return { ...progress, xp_for_current_level, xp_for_next_level };
}

// ── RPC response types ──

export interface CompleteClassResult {
  success: boolean;
  reason?: string;
  xp_earned?: number;
  streak_bonus?: number;
  new_streak?: number;
  new_level?: number;
  total_xp?: number;
}

// ── Legacy aliases (for compatibility during migration) ──

export type Subject = SubjectWithProgress & {
  // Map view column names to legacy frontend names
  id: string; // will be mapped from subject_id
  modules_count: number; // mapped from total_modules
  classes_completed: number; // mapped from completed_classes
  classes_total: number; // mapped from total_classes
};

export interface Module extends ModuleRow {
  classes: ClassWithResources[];
}

export type Class = ClassWithResources;

export interface UserSettings {
  id: string;
  user_id: string;
  study_hours_per_day: number;
  study_days_per_week: number;
  theme: "dark" | "light";
  updated_at: string;
}
