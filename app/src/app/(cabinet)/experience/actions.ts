"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EXPERIENCE_CATEGORIES, EXPERIENCE_KINDS } from "@/lib/experience";

// Пустую строку из формы превращаем в null (для необязательных полей БД).
function emptyToNull(value: FormDataEntryValue | null): string | null {
  const s = String(value ?? "").trim();
  return s === "" ? null : s;
}

// Поля заметки из формы. kind по умолчанию 'positive'; невалидная category → null.
function readFields(formData: FormData) {
  const kind = emptyToNull(formData.get("kind"));
  const category = emptyToNull(formData.get("category"));
  return {
    title: emptyToNull(formData.get("title")),
    description: emptyToNull(formData.get("description")),
    kind: EXPERIENCE_KINDS.some((k) => k.code === kind) ? kind! : "positive",
    category: EXPERIENCE_CATEGORIES.some((c) => c.code === category) ? category : null,
    // event_id: пусто → null (заметка может быть не привязана к мероприятию).
    event_id: emptyToNull(formData.get("event_id")),
  };
}

// Создание заметки опыта.
export async function createNote(formData: FormData) {
  const fields = readFields(formData);
  if (!fields.title) {
    const eventParam = fields.event_id ? `&event=${fields.event_id}` : "";
    redirect(
      `/experience/new?error=${encodeURIComponent("Укажи заголовок заметки.")}${eventParam}`,
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("experience_notes")
    .insert({ ...fields, user_id: user.id })
    .select("id")
    .single();

  if (error || !data) {
    const eventParam = fields.event_id ? `&event=${fields.event_id}` : "";
    redirect(
      `/experience/new?error=${encodeURIComponent("Не удалось сохранить заметку. Попробуй ещё раз.")}${eventParam}`,
    );
  }

  revalidatePath("/experience");
  if (fields.event_id) revalidatePath(`/events/${fields.event_id}`);
  redirect(`/experience/${data!.id}`);
}

// Редактирование заметки.
export async function updateNote(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const fields = readFields(formData);
  if (!id) redirect("/experience");
  if (!fields.title) {
    redirect(`/experience/${id}/edit?error=${encodeURIComponent("Укажи заголовок заметки.")}`);
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("experience_notes")
    .update(fields)
    .eq("id", id);

  if (error) {
    redirect(
      `/experience/${id}/edit?error=${encodeURIComponent("Не удалось сохранить изменения. Попробуй ещё раз.")}`,
    );
  }

  revalidatePath("/experience");
  revalidatePath(`/experience/${id}`);
  if (fields.event_id) revalidatePath(`/events/${fields.event_id}`);
  redirect(`/experience/${id}`);
}

// Удаление заметки. RLS защищает чужие записи.
export async function deleteNote(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/experience");

  const supabase = await createClient();
  await supabase.from("experience_notes").delete().eq("id", id);

  revalidatePath("/experience");
  redirect("/experience");
}
