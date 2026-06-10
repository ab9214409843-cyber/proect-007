"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EVENT_STATUSES, EVENT_TYPES } from "@/lib/events";
import { addDaysISO } from "@/lib/tasks";
import { MAX_TEXT_LEN, MAX_TITLE_LEN } from "@/lib/validation";

// Типизированный клиент Supabase (как возвращает createClient) — для вспомогательных функций.
type DbClient = Awaited<ReturnType<typeof createClient>>;

// Пустую строку из формы превращаем в null (для необязательных полей БД).
function emptyToNull(value: FormDataEntryValue | null): string | null {
  const s = String(value ?? "").trim();
  return s === "" ? null : s;
}

// Поля мероприятия из формы (общие для создания и редактирования).
// event_type сверяется со справочником EVENT_TYPES; неизвестный код → null.
function readEventFields(formData: FormData) {
  const eventType = emptyToNull(formData.get("event_type"));
  return {
    title: String(formData.get("title") ?? "").trim(),
    event_type: EVENT_TYPES.some((t) => t.code === eventType) ? eventType : null,
    start_date: emptyToNull(formData.get("start_date")),
    end_date: emptyToNull(formData.get("end_date")),
    location: emptyToNull(formData.get("location")),
    description: emptyToNull(formData.get("description")),
  };
}

// Общие проверки полей (длина текста, порядок дат). Возвращает сообщение или null.
// Сравнение дат строкой работает корректно для ISO-формата yyyy-mm-dd.
function validateEventFields(
  fields: ReturnType<typeof readEventFields>,
): string | null {
  if (fields.title.length > MAX_TITLE_LEN) {
    return `Название слишком длинное (до ${MAX_TITLE_LEN} символов).`;
  }
  if (fields.description && fields.description.length > MAX_TEXT_LEN) {
    return `Описание слишком длинное (до ${MAX_TEXT_LEN} символов).`;
  }
  if (fields.start_date && fields.end_date && fields.end_date < fields.start_date) {
    return "Дата окончания не может быть раньше даты начала.";
  }
  return null;
}

// Автоплан (Этап 5): по типу и дате мероприятия разворачиваем задачи из checklist_templates.
// Срок: due_date = дата начала − offset_days. Вызывается только при создании мероприятия.
// Ошибку генерации не «роняем» — мероприятие уже создано, задачи можно добавить вручную (Этап 6).
async function createTasksForEvent(
  supabase: DbClient,
  {
    eventId,
    userId,
    eventType,
    startDate,
  }: { eventId: string; userId: string; eventType: string; startDate: string },
) {
  const { data: templates } = await supabase
    .from("checklist_templates")
    .select("title, description, offset_days, priority")
    .eq("event_type", eventType);

  if (!templates || templates.length === 0) return;

  const rows = templates.map((t) => ({
    event_id: eventId,
    user_id: userId,
    title: t.title,
    description: t.description,
    due_date: addDaysISO(startDate, -t.offset_days),
    priority: t.priority,
    // status по умолчанию 'todo' (задаёт БД).
  }));

  await supabase.from("tasks").insert(rows);
}

// Создание мероприятия + автогенерация плана задач. Статус по умолчанию — planned (задаёт БД).
export async function createEvent(formData: FormData) {
  const fields = readEventFields(formData);
  if (!fields.title) {
    redirect(`/events/new?error=${encodeURIComponent("Укажи название мероприятия.")}`);
  }
  if (!fields.event_type) {
    redirect(`/events/new?error=${encodeURIComponent("Выбери тип мероприятия.")}`);
  }
  if (!fields.start_date) {
    redirect(
      `/events/new?error=${encodeURIComponent("Укажи дату начала — от неё строится план задач.")}`,
    );
  }
  const invalid = validateEventFields(fields);
  if (invalid) redirect(`/events/new?error=${encodeURIComponent(invalid)}`);

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

  // start_date и event_type здесь гарантированно заполнены (проверены выше).
  await createTasksForEvent(supabase, {
    eventId: data.id,
    userId: user.id,
    eventType: fields.event_type,
    startDate: fields.start_date,
  });

  revalidatePath("/events");
  revalidatePath("/tasks");
  redirect(`/events/${data.id}`);
}

// Редактирование мероприятия. RLS гарантирует, что чужое изменить нельзя.
// Задачи при редактировании НЕ пересоздаём (автоплан — разовый, при создании).
export async function updateEvent(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const fields = readEventFields(formData);
  if (!id) redirect("/events");
  if (!fields.title) {
    redirect(`/events/${id}/edit?error=${encodeURIComponent("Укажи название мероприятия.")}`);
  }
  if (!fields.event_type) {
    redirect(`/events/${id}/edit?error=${encodeURIComponent("Выбери тип мероприятия.")}`);
  }
  if (!fields.start_date) {
    redirect(`/events/${id}/edit?error=${encodeURIComponent("Укажи дату начала.")}`);
  }
  const invalid = validateEventFields(fields);
  if (invalid) redirect(`/events/${id}/edit?error=${encodeURIComponent(invalid)}`);

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
  const { error } = await supabase.from("events").update({ status }).eq("id", id);

  if (error) {
    redirect(`/events/${id}?error=${encodeURIComponent("Не удалось изменить статус. Попробуй ещё раз.")}`);
  }

  revalidatePath("/events");
  revalidatePath(`/events/${id}`);
  redirect(`/events/${id}`);
}

// Удаление мероприятия (связанные задачи/документы/заметки удалятся каскадом — ON DELETE CASCADE).
export async function deleteEvent(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/events");

  const supabase = await createClient();
  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) {
    redirect(`/events/${id}?error=${encodeURIComponent("Не удалось удалить мероприятие. Попробуй ещё раз.")}`);
  }

  revalidatePath("/events");
  revalidatePath("/tasks");
  redirect("/events");
}
