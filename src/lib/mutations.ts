"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { CompleteClassResult } from "./types";

// ── Complete / Uncomplete class ──

export async function completeClass(
  classId: string
): Promise<CompleteClassResult> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("complete_class", {
    p_class_id: classId,
  });

  if (error) throw error;
  revalidatePath("/", "layout");
  return data as CompleteClassResult;
}

export async function uncompleteClass(classId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.rpc("uncomplete_class", {
    p_class_id: classId,
  });

  if (error) throw error;
  revalidatePath("/", "layout");
}

// ── Business context ──

export async function updateBusinessContext(formData: {
  business_name: string;
  description?: string;
  current_phase?: string;
  current_needs?: string[];
  revenue_monthly?: number;
  team_size?: number;
}): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("business_context").upsert(
    {
      user_id: user.id,
      ...formData,
    },
    { onConflict: "user_id" }
  );

  if (error) throw error;
  revalidatePath("/business");
  revalidatePath("/");
}

// ── Subjects ──

export async function createSubject(data: {
  title: string;
  description?: string;
  orientation?: "base" | "business_oriented";
  icon?: string;
}): Promise<string> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: subject, error } = await supabase
    .from("subjects")
    .insert({
      user_id: user.id,
      title: data.title,
      description: data.description ?? null,
      orientation: data.orientation ?? "business_oriented",
      icon: data.icon ?? "BookOpen",
    })
    .select("id")
    .single();

  if (error) throw error;
  revalidatePath("/subjects");
  revalidatePath("/");
  return subject.id;
}

export async function updateSubject(
  id: string,
  data: {
    title?: string;
    description?: string;
    orientation?: "base" | "business_oriented";
    status?: "draft" | "active" | "completed" | "paused";
    priority_score?: number;
    icon?: string;
  }
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("subjects").update(data).eq("id", id);

  if (error) throw error;
  revalidatePath("/subjects");
  revalidatePath(`/subjects/${id}`);
  revalidatePath("/");
}

export async function deleteSubject(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("subjects").delete().eq("id", id);

  if (error) throw error;
  revalidatePath("/subjects");
  revalidatePath("/");
}

// ── Modules ──

export async function createModule(
  subjectId: string,
  data: { title: string; description?: string }
): Promise<string> {
  const supabase = createClient();

  // Get the next sort_order
  const { data: existing } = await supabase
    .from("modules")
    .select("sort_order")
    .eq("subject_id", subjectId)
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextOrder = existing && existing.length > 0 ? existing[0].sort_order + 1 : 0;

  const { data: mod, error } = await supabase
    .from("modules")
    .insert({
      subject_id: subjectId,
      title: data.title,
      description: data.description ?? null,
      sort_order: nextOrder,
    })
    .select("id")
    .single();

  if (error) throw error;
  revalidatePath(`/subjects/${subjectId}`);
  return mod.id;
}

export async function updateModule(
  id: string,
  data: { title?: string; description?: string; sort_order?: number }
): Promise<void> {
  const supabase = createClient();

  // Get the subject_id for revalidation
  const { data: mod } = await supabase
    .from("modules")
    .select("subject_id")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("modules").update(data).eq("id", id);
  if (error) throw error;

  if (mod) revalidatePath(`/subjects/${mod.subject_id}`);
}

export async function deleteModule(id: string): Promise<void> {
  const supabase = createClient();

  // Get the subject_id for revalidation
  const { data: mod } = await supabase
    .from("modules")
    .select("subject_id")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("modules").delete().eq("id", id);
  if (error) throw error;

  if (mod) revalidatePath(`/subjects/${mod.subject_id}`);
  revalidatePath("/");
}

// ── Classes ──

export async function createClass(
  moduleId: string,
  data: {
    title: string;
    description?: string;
    youtube_url?: string;
    estimated_minutes?: number;
  }
): Promise<string> {
  const supabase = createClient();

  // Get the next sort_order
  const { data: existing } = await supabase
    .from("classes")
    .select("sort_order")
    .eq("module_id", moduleId)
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextOrder = existing && existing.length > 0 ? existing[0].sort_order + 1 : 0;

  const { data: cls, error } = await supabase
    .from("classes")
    .insert({
      module_id: moduleId,
      title: data.title,
      description: data.description ?? null,
      youtube_url: data.youtube_url ?? null,
      estimated_minutes: data.estimated_minutes ?? 15,
      sort_order: nextOrder,
    })
    .select("id")
    .single();

  if (error) throw error;

  // Get subject_id from module for revalidation
  const { data: mod } = await supabase
    .from("modules")
    .select("subject_id")
    .eq("id", moduleId)
    .single();

  if (mod) revalidatePath(`/subjects/${mod.subject_id}`);
  revalidatePath("/");
  return cls.id;
}

export async function updateClass(
  id: string,
  data: {
    title?: string;
    description?: string;
    youtube_url?: string;
    estimated_minutes?: number;
    apply_to_business?: string;
  }
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.from("classes").update(data).eq("id", id);
  if (error) throw error;

  // Revalidate by getting the module → subject chain
  const { data: cls } = await supabase
    .from("classes")
    .select("module_id")
    .eq("id", id)
    .single();

  if (cls) {
    const { data: mod } = await supabase
      .from("modules")
      .select("subject_id")
      .eq("id", cls.module_id)
      .single();
    if (mod) revalidatePath(`/subjects/${mod.subject_id}`);
  }

  revalidatePath(`/subjects`);
}

export async function deleteClass(id: string): Promise<void> {
  const supabase = createClient();

  // Get module → subject chain for revalidation before deleting
  const { data: cls } = await supabase
    .from("classes")
    .select("module_id")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("classes").delete().eq("id", id);
  if (error) throw error;

  if (cls) {
    const { data: mod } = await supabase
      .from("modules")
      .select("subject_id")
      .eq("id", cls.module_id)
      .single();
    if (mod) revalidatePath(`/subjects/${mod.subject_id}`);
  }

  revalidatePath("/");
}

// ── Resources ──

export async function createResource(data: {
  class_id: string;
  title: string;
  type: "pdf" | "paper" | "article" | "youtube" | "other";
  url?: string;
  file_path?: string;
}): Promise<string> {
  const supabase = createClient();

  const { data: resource, error } = await supabase
    .from("resources")
    .insert({
      class_id: data.class_id,
      title: data.title,
      type: data.type,
      url: data.url ?? null,
      file_path: data.file_path ?? null,
    })
    .select("id")
    .single();

  if (error) throw error;

  // Revalidate class pages
  revalidatePath("/", "layout");
  return resource.id;
}

export async function deleteResource(resourceId: string): Promise<void> {
  const supabase = createClient();

  // Get the resource to find its file_path for Storage cleanup
  const { data: resource } = await supabase
    .from("resources")
    .select("file_path")
    .eq("id", resourceId)
    .single();

  // Delete the file from Storage if it exists
  if (resource?.file_path) {
    await supabase.storage.from("class-resources").remove([resource.file_path]);
  }

  // Delete the DB row
  const { error } = await supabase
    .from("resources")
    .delete()
    .eq("id", resourceId);

  if (error) throw error;
  revalidatePath("/", "layout");
}
