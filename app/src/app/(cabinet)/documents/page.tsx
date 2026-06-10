import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatEventDate } from "@/lib/events";
import {
  DOCUMENT_TYPES,
  documentTypeBadgeClass,
  documentTypeLabel,
  formatFileSize,
} from "@/lib/documents";
import { downloadDocument } from "./actions";

// Список всех документов пользователя (RLS отдаёт только свои) с фильтрами по типу и мероприятию.
// Фильтры — через searchParams (type, event); Next.js 16: searchParams асинхронные.
export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; event?: string }>;
}) {
  const { type, event } = await searchParams;
  const activeType = DOCUMENT_TYPES.some((t) => t.code === type) ? type : undefined;

  const supabase = await createClient();

  // Мероприятия пользователя — для фильтра по мероприятию.
  const { data: events } = await supabase
    .from("events")
    .select("id, title")
    .order("start_date", { ascending: true, nullsFirst: false });

  let query = supabase
    .from("documents")
    .select("*, events(id, title)")
    .order("created_at", { ascending: false });

  if (activeType) query = query.eq("type", activeType);
  if (event) query = query.eq("event_id", event);

  const { data } = await query;
  const documents = data ?? [];

  // Ссылка на чип типа — сохраняем фильтр по мероприятию.
  const typeHref = (code?: string) => {
    const qs = new URLSearchParams();
    if (code) qs.set("type", code);
    if (event) qs.set("event", event);
    return "/documents" + (qs.toString() ? `?${qs}` : "");
  };

  const chip = (active: boolean) =>
    "rounded-full px-3 py-1 text-sm font-medium transition " +
    (active
      ? "bg-gray-900 text-white"
      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100");

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Документы</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/documents/templates"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Шаблоны
          </Link>
          <Link
            href="/documents/new"
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
          >
            Загрузить
          </Link>
        </div>
      </div>
      <p className="mt-2 text-gray-600">
        Положение, смета, приказ, сценарий и другие файлы — рядом с мероприятием.
      </p>

      {/* Фильтры */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={typeHref()} className={chip(!activeType)}>
            Все
          </Link>
          {DOCUMENT_TYPES.map((t) => (
            <Link
              key={t.code}
              href={typeHref(t.code)}
              className={chip(activeType === t.code)}
            >
              {t.label}
            </Link>
          ))}
        </div>

        {events && events.length > 0 && (
          <form method="GET" className="ml-auto flex items-center gap-2">
            {activeType && <input type="hidden" name="type" value={activeType} />}
            <select
              name="event"
              defaultValue={event ?? ""}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none"
            >
              <option value="">Все мероприятия</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Применить
            </button>
          </form>
        )}
      </div>

      {documents.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-gray-700">
            {activeType || event ? "Под фильтры ничего не подходит." : "Пока нет документов."}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {activeType || event
              ? "Измени фильтры или загрузи новый документ."
              : "Нажми «Загрузить», чтобы добавить первый файл."}
          </p>
        </div>
      ) : (
        <ul className="mt-8 flex flex-col gap-2">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <Link href={`/documents/${doc.id}`} className="min-w-0 flex-1">
                <p className="truncate font-medium text-gray-900 hover:underline">
                  {doc.title}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {formatFileSize(doc.file_size)}
                  {doc.events && <> · {doc.events.title}</>}
                  <> · {formatEventDate(doc.created_at)}</>
                </p>
              </Link>
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={
                    "rounded-full px-2.5 py-1 text-xs font-medium " +
                    documentTypeBadgeClass(doc.type)
                  }
                >
                  {documentTypeLabel(doc.type)}
                </span>
                <form action={downloadDocument}>
                  <input type="hidden" name="id" value={doc.id} />
                  <button
                    type="submit"
                    className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                  >
                    Скачать
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
