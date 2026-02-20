export interface BusinessContext {
  id: string;
  user_id: string;
  business_name: string;
  description: string;
  current_phase: string;
  current_needs: string[];
  revenue_monthly: number;
  team_size: number;
  updated_at: string;
}

export interface Subject {
  id: string;
  user_id: string;
  title: string;
  description: string;
  orientation: "base" | "business_oriented";
  status: "draft" | "active" | "completed" | "paused";
  priority_score: number;
  icon: string;
  created_at: string;
  modules_count: number;
  classes_completed: number;
  classes_total: number;
  progress_percent: number;
}

export interface Module {
  id: string;
  subject_id: string;
  title: string;
  description: string;
  sort_order: number;
  is_locked: boolean;
  classes: Class[];
}

export interface Class {
  id: string;
  module_id: string;
  title: string;
  description: string;
  youtube_url: string | null;
  youtube_transcript: string | null;
  apply_to_business: string | null;
  sort_order: number;
  status: "pending" | "completed";
  completed_at: string | null;
  estimated_minutes: number;
  resources: Resource[];
}

export interface Resource {
  id: string;
  class_id: string;
  type: "pdf" | "paper" | "article" | "youtube" | "other";
  title: string;
  url: string;
  ai_summary: string | null;
  file_path: string | null;
}

export interface Progress {
  id: string;
  user_id: string;
  total_xp: number;
  level: number;
  xp_for_current_level: number;
  xp_for_next_level: number;
  current_streak: number;
  longest_streak: number;
  classes_completed: number;
  last_study_date: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  timezone: string;
  created_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  study_hours_per_day: number;
  study_days_per_week: number;
  theme: "dark" | "light";
  updated_at: string;
}
