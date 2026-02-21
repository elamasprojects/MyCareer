import { createClient } from "@/lib/supabase/server";
import type {
  Subject,
  SubjectWithProgress,
  ModuleWithClasses,
  ClassWithResources,
  BusinessContext,
  Progress,
  Resource,
  ClassRow,
  ModuleRow,
} from "./types";
import { computeLevelXP, type ProgressWithLevels } from "./types";

// ── Helpers ──

function mapSubjectView(row: SubjectWithProgress): Subject {
  return {
    ...row,
    id: row.subject_id,
    modules_count: Number(row.total_modules),
    classes_completed: Number(row.completed_classes),
    classes_total: Number(row.total_classes),
    progress_percent: Number(row.progress_percent),
    total_classes: Number(row.total_classes),
    completed_classes: Number(row.completed_classes),
    total_modules: Number(row.total_modules),
    total_minutes: Number(row.total_minutes),
  };
}

// ── Subjects ──

export async function getSubjects(): Promise<Subject[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("subject_progress")
    .select("*")
    .order("priority_score", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapSubjectView);
}

export async function getSubjectById(id: string): Promise<Subject | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("subject_progress")
    .select("*")
    .eq("subject_id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data ? mapSubjectView(data) : null;
}

// ── Modules with classes and resources ──

export async function getModulesWithClasses(
  subjectId: string
): Promise<ModuleWithClasses[]> {
  const supabase = createClient();

  // Fetch modules
  const { data: modules, error: modError } = await supabase
    .from("modules")
    .select("*")
    .eq("subject_id", subjectId)
    .order("sort_order");

  if (modError) throw modError;
  if (!modules || modules.length === 0) return [];

  const moduleIds = modules.map((m: ModuleRow) => m.id);

  // Fetch classes for all modules
  const { data: classes, error: clsError } = await supabase
    .from("classes")
    .select("*")
    .in("module_id", moduleIds)
    .order("sort_order");

  if (clsError) throw clsError;

  const classIds = (classes ?? []).map((c: ClassRow) => c.id);

  // Fetch resources for all classes
  let resources: Resource[] = [];
  if (classIds.length > 0) {
    const { data: resData, error: resError } = await supabase
      .from("resources")
      .select("*")
      .in("class_id", classIds);

    if (resError) throw resError;
    resources = resData ?? [];
  }

  // Group resources by class_id
  const resourcesByClass = new Map<string, Resource[]>();
  for (const r of resources) {
    const list = resourcesByClass.get(r.class_id) ?? [];
    list.push(r);
    resourcesByClass.set(r.class_id, list);
  }

  // Group classes by module_id and attach resources
  const classesByModule = new Map<string, ClassWithResources[]>();
  for (const c of classes ?? []) {
    const classWithRes: ClassWithResources = {
      ...c,
      resources: resourcesByClass.get(c.id) ?? [],
    };
    const list = classesByModule.get(c.module_id) ?? [];
    list.push(classWithRes);
    classesByModule.set(c.module_id, list);
  }

  // Assemble
  return modules.map((m: ModuleRow) => ({
    ...m,
    classes: classesByModule.get(m.id) ?? [],
  }));
}

// ── Single class ──

export async function getClassById(
  classId: string
): Promise<ClassWithResources | null> {
  const supabase = createClient();

  const { data: cls, error: clsError } = await supabase
    .from("classes")
    .select("*")
    .eq("id", classId)
    .single();

  if (clsError) {
    if (clsError.code === "PGRST116") return null;
    throw clsError;
  }

  const { data: resources, error: resError } = await supabase
    .from("resources")
    .select("*")
    .eq("class_id", classId);

  if (resError) throw resError;

  return { ...cls, resources: resources ?? [] };
}

// ── Adjacent classes (for prev/next navigation) ──

export async function getAdjacentClasses(
  subjectId: string,
  classId: string
): Promise<{ prev: ClassRow | null; next: ClassRow | null }> {
  const modules = await getModulesWithClasses(subjectId);
  const allClasses = modules.flatMap((m) => m.classes);
  const idx = allClasses.findIndex((c) => c.id === classId);

  return {
    prev: idx > 0 ? allClasses[idx - 1] : null,
    next: idx < allClasses.length - 1 ? allClasses[idx + 1] : null,
  };
}

// ── Business context ──

export async function getBusinessContext(): Promise<BusinessContext | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("business_context")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data;
}

// ── Progress ──

export async function getProgress(): Promise<ProgressWithLevels | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("progress")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No progress row yet — return defaults
      return computeLevelXP({
        id: "",
        user_id: user.id,
        total_xp: 0,
        level: 1,
        current_streak: 0,
        longest_streak: 0,
        classes_completed: 0,
        last_study_date: null,
      });
    }
    throw error;
  }

  return computeLevelXP(data as Progress);
}

// ── Get subject ID from class ID (for navigation) ──

export async function getSubjectIdForClass(
  classId: string
): Promise<string | null> {
  const supabase = createClient();

  const { data: cls } = await supabase
    .from("classes")
    .select("module_id")
    .eq("id", classId)
    .single();

  if (!cls) return null;

  const { data: mod } = await supabase
    .from("modules")
    .select("subject_id")
    .eq("id", cls.module_id)
    .single();

  return mod?.subject_id ?? null;
}
