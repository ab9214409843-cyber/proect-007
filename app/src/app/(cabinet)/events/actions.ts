"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EVENT_STATUSES } from "@/lib/events";

// Пустую строку из формы превращаем в null (для необязательных полей БД).
function emptyToNull(value: FormDataEntryValue | null): string | null {
  const s = String(value ?? "").trim();
  return s === "" ? null : s;
}

// Поля мероприятия из формы (общие для создания и редактирования).
function readEventFields(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    start_date: emptyToNull(formData.get("start_date")),
    end_date: emptyToNull(formData.get("end_date")),
    location: emptyToNull(formData.get("location")),
    description: emptyToNull(formData.get("description")),
  };
}

// Создание мероприятия. Статус по умолчанию — planned (задаёт БД).
export async function createEvent(formData: FormData) {
  const fields = readEventFields(formData);
  if (!fields.title) {
    redirect(`/events/new?error=${encodeURIComponent("Укажи название мероприятия.")}`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("events")
    .insert({ ...fields, user_id: user.id })
    .select("id")
    .single();

  if (error) {
    redirect(`/events/new?error=${encodeURIComponent("Не удалось создать мероприятие. Попробуй ещё раз.")}`);
  }

  revalidatePath("/events");
  redirect(`/events/${data.id}`);
}

// Редактирование мероприятия. RLS гарантирует, что чужое изменить нельзя.
export async function updateEvent(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const fields = readEventFields(formData);
  if (!id) redirect("/events");
  if (!fields.title) {
    redirect(`/events/${id}/edit?error=${encodeURIComponent("Укажи название мероприятия.")}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.from("events").update(fields).eq("id", id);

  if (error) {
    redirect(`/events/${id}/edit?error=${encodeURIComponent("Не удалось сохранить изменения. Попробуй ещё раз.")}`);
  }

  revalidatePath("/events");
  revalidatePath(`/events/${id}`);
  redirect(`/events/${id}`);
}

// Смена статуса мероприятия с карточки.
export async function updateEventStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const allowed = EVENT_STATUSES.some((s) => s.code === status);
  if (!id || !allowed) redirect(id ? `/events/${id}` : "/events");

  const supabase = await createClient();
  await supabase.from("events").update({ status }).eq("id", id);

  revalidatePath("/events");
  revalidatePath(`/events/${id}`);
  redirect(`/events/${id}`);
}

// Удаление мероприятия (связанные задачи/документы/заметки удалятся каскадом — ON DELETE CASCADE).
export async function deleteEvent(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/events");

  const supabase = await createClient();
  await supabase.from("events").delete().eq("id", id);

  revalidatePath("/events");
  redirect("/events");
}
