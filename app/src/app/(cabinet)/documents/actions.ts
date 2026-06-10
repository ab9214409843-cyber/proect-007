"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  DOCUMENTS_BUCKET,
  DOCUMENT_TYPES,
  MAX_FILE_BYTES,
} from "@/lib/documents";
import { MAX_TITLE_LEN } from "@/lib/validation";

// Пустую строку из формы превращаем в null (для необязательных полей БД).
function emptyToNull(value: FormDataEntryValue | null): string | null {
  const s = String(value ?? "").trim();
  return s === "" ? null : s;
}

// Расширение файла по имени (без точки), в нижнем регистре. Нет расширения → "bin".
function fileExt(name: string): string {
  const dot = name.lastIndexOf(".");
  if (dot <= 0 || dot === name.length - 1) return "bin";
  return name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
}

// Метаданные документа из формы (общие для типа и привязки).
function readMetaFields(formData: FormData) {
  const type = emptyToNull(formData.get("type"));
  return {
    title: emptyToNull(formData.get("title")),
    type: DOCUMENT_TYPES.some((t) => t.code === type) ? type! : "other",
    // event_id: пусто → null (документ может быть не привязан к мероприятию).
    event_id: emptyToNull(formData.get("event_id")),
  };
}

// Загрузка документа: файл → Supabase Storage, метаданные → таблица documents.
export async function createDocument(formData: FormData) {
  const meta = readMetaFields(formData);
  const file = formData.get("file");
  const eventParam = meta.event_id ? `&event=${meta.event_id}` : "";
  const fail = (msg: string) =>
    redirect(`/documents/new?error=${encodeURIComponent(msg)}${eventParam}`);

  if (!(file instanceof File) || file.size === 0) {
    fail("Выбери файл для загрузки.");
    return;
  }
  if (file.size > MAX_FILE_BYTES) {
    fail("Файл больше 25 МБ. Выбери файл поменьше.");
    return;
  }
  if (meta.title && meta.title.length > MAX_TITLE_LEN) {
    fail(`Название слишком длинное (до ${MAX_TITLE_LEN} символов).`);
    return;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Путь объекта: {user_id}/{uuid}.{ext} — имя латиницей (без кириллицы/пробелов в ключе).
  // Первый сегмент = user.id, на нём держится RLS бакета.
  const path = `${user.id}/${crypto.randomUUID()}.${fileExt(file.name)}`;

  const { error: uploadError } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .upload(path, file, { contentType: file.type || undefined });

  if (uploadError) {
    fail("Не удалось загрузить файл. Попробуй ещё раз.");
    return;
  }

  const { data, error } = await supabase
    .from("documents")
    .insert({
      user_id: user.id,
      title: meta.title ?? file.name,
      type: meta.type,
      event_id: meta.event_id,
      file_url: path,
      file_name: file.name,
      file_size: file.size,
    })
    .select("id")
    .single();

  if (error || !data) {
    // Откат: убираем уже загруженный объект, чтобы не оставлять «сирот» в Storage.
    await supabase.storage.from(DOCUMENTS_BUCKET).remove([path]);
    fail("Не удалось сохранить документ. Попробуй ещё раз.");
    return;
  }

  revalidatePath("/documents");
  if (meta.event_id) revalidatePath(`/events/${meta.event_id}`);
  redirect(`/documents/${data.id}`);
}

// Редактирование метаданных документа (название, тип, мероприятие). Сам файл не заменяем.
export async function updateDocument(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const meta = readMetaFields(formData);
  if (!id) redirect("/documents");
  if (!meta.title) {
    redirect(`/documents/${id}/edit?error=${encodeURIComponent("Укажи название документа.")}`);
  }
  if (meta.title.length > MAX_TITLE_LEN) {
    redirect(
      `/documents/${id}/edit?error=${encodeURIComponent(`Название слишком длинное (до ${MAX_TITLE_LEN} символов).`)}`,
    );
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("documents")
    .update({ title: meta.title, type: meta.type, event_id: meta.event_id })
    .eq("id", id);

  if (error) {
    redirect(
      `/documents/${id}/edit?error=${encodeURIComponent("Не удалось сохранить изменения. Попробуй ещё раз.")}`,
    );
  }

  revalidatePath("/documents");
  revalidatePath(`/documents/${id}`);
  if (meta.event_id) revalidatePath(`/events/${meta.event_id}`);
  redirect(`/documents/${id}`);
}

// Скачивание: бакет приватный → создаём временную подписанную ссылку и переходим на неё.
// download: file_name — чтобы файл сохранился под исходным именем.
export async function downloadDocument(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/documents");

  const supabase = await createClient();
  const { data: doc } = await supabase
    .from("documents")
    .select("file_url, file_name")
    .eq("id", id)
    .single();

  if (!doc?.file_url) redirect(`/documents/${id}`);

  const { data, error } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .createSignedUrl(doc.file_url, 60, { download: doc.file_name ?? undefined });

  if (error || !data?.signedUrl) {
    redirect(`/documents/${id}?error=${encodeURIComponent("Не удалось подготовить файл к скачиванию.")}`);
  }

  redirect(data!.signedUrl);
}

// Удаление: убираем объект из Storage и строку из БД. RLS защищает чужие записи.
export async function deleteDocument(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/documents");

  const supabase = await createClient();
  const { data: doc } = await supabase
    .from("documents")
    .select("file_url")
    .eq("id", id)
    .single();

  if (doc?.file_url) {
    await supabase.storage.from(DOCUMENTS_BUCKET).remove([doc.file_url]);
  }
  const { error } = await supabase.from("documents").delete().eq("id", id);

  if (error) {
    redirect(`/documents/${id}?error=${encodeURIComponent("Не удалось удалить документ. Попробуй ещё раз.")}`);
  }

  revalidatePath("/documents");
  redirect("/documents");
}
