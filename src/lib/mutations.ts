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
