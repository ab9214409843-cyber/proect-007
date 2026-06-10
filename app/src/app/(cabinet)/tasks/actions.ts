"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TASK_PRIORITIES, TASK_STATUSES } from "@/lib/tasks";
import { MAX_TEXT_LEN, MAX_TITLE_LEN } from "@/lib/validation";

// Пустую строку из формы превращаем в null (для необязательных полей БД).
function emptyToNull(value: FormDataEntryValue | null): string | null {
  const s = String(value ?? "").trim();
  return s === "" ? null : s;
}

// Поля задачи из формы (общие для создания и редактирования).
// priority/status сверяются со справочниками; неизвестный код → значение по умолчанию.
function readTaskFields(formData: FormData) {
  const priority = emptyToNull(formData.get("priority"));
  const status = emptyToNull(formData.get("status"));
  return {
    title: String(formData.get("title") ?? "").trim(),
    description: emptyToNull(formData.get("description")),
    due_date: emptyToNull(formData.get("due_date")),
    priority: TASK_PRIORITIES.some((p) => p.code === priority) ? priority! : "medium",
    status: TASK_STATUSES.some((s) => s.code === status) ? status! : "todo",
    // event_id: пусто → null (задача может быть не привязана к мероприятию).
    event_id: emptyToNull(formData.get("event_id")),
  };
}

// Проверка длины текстовых полей. Возвращает сообщение или null.
function validateTaskFields(
  fields: ReturnType<typeof readTaskFields>,
): string | null {
  if (fields.title.length > MAX_TITLE_LEN) {
    return `Название слишком длинное (до ${MAX_TITLE_LEN} символов).`;
  }
  if (fields.description && fields.description.length > MAX_TEXT_LEN) {
    return `Описание слишком длинное (до ${MAX_TEXT_LEN} символов).`;
  }
  return null;
}

// Создание задачи вручную. Привязка к мероприятию — необязательна.
export async function createTask(formData: FormData) {
  const fields = readTaskFields(formData);
  const eventParam = fields.event_id ? `&event=${fields.event_id}` : "";
  if (!fields.title) {
    redirect(`/tasks/new?error=${encodeURIComponent("Укажи название задачи.")}${eventParam}`);
  }
  const invalid = validateTaskFields(fields);
  if (invalid) redirect(`/tasks/new?error=${encodeURIComponent(invalid)}${eventParam}`);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("tasks")
    .insert({ ...fields, user_id: user.id })
    .select("id")
    .single();

  if (error) {
    redirect(
      `/tasks/new?error=${encodeURIComponent("Не удалось создать задачу. Попробуй ещё раз.")}${eventParam}`,
    );
  }

  revalidatePath("/tasks");
  if (fields.event_id) revalidatePath(`/events/${fields.event_id}`);
  redirect(`/tasks/${data.id}`);
}

// Редактирование задачи. RLS гарантирует, что чужую изменить нельзя.
export async function updateTask(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const fields = readTaskFields(formData);
  if (!id) redirect("/tasks");
  if (!fields.title) {
    redirect(`/tasks/${id}/edit?error=${encodeURIComponent("Укажи название задачи.")}`);
  }
  const invalid = validateTaskFields(fields);
  if (invalid) redirect(`/tasks/${id}/edit?error=${encodeURIComponent(invalid)}`);

  const supabase = await createClient();
  const { error } = await supabase.from("tasks").update(fields).eq("id", id);

  if (error) {
    redirect(`/tasks/${id}/edit?error=${encodeURIComponent("Не удалось сохранить изменения. Попробуй ещё раз.")}`);
  }

  revalidatePath("/tasks");
  revalidatePath(`/tasks/${id}`);
  if (fields.event_id) revalidatePath(`/events/${fields.event_id}`);
  redirect(`/tasks/${id}`);
}

// Быстрая смена статуса — с карточки задачи и из списка.
// redirectTo (необязательно) — querystring списка, чтобы вернуться к тем же фильтрам.
export async function updateTaskStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const redirectTo = emptyToNull(formData.get("redirectTo"));
  const allowed = TASK_STATUSES.some((s) => s.code === status);
  if (!id || !allowed) redirect(id ? `/tasks/${id}` : "/tasks");

  const supabase = await createClient();
  const { error } = await supabase.from("tasks").update({ status }).eq("id", id);

  // redirectTo принимаем только как локальный путь (защита от open redirect).
  const target =
    redirectTo && redirectTo.startsWith("/") ? redirectTo : `/tasks/${id}`;

  if (error) {
    const sep = target.includes("?") ? "&" : "?";
    redirect(`${target}${sep}error=${encodeURIComponent("Не удалось изменить статус. Попробуй ещё раз.")}`);
  }

  revalidatePath("/tasks");
  revalidatePath(`/tasks/${id}`);
  redirect(target);
}

// Удаление задачи. RLS защищает чужие записи.
export async function deleteTask(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/tasks");

  const supabase = await createClient();
  const { error } = await supabase.from("tasks").delete().eq("id", id);

  if (error) {
    redirect(`/tasks/${id}?error=${encodeURIComponent("Не удалось удалить задачу. Попробуй ещё раз.")}`);
  }

  revalidatePath("/tasks");
  redirect("/tasks");
}
