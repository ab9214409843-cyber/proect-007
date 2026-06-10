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
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import {
  badgeBase,
  btnPrimary,
  btnSecondary,
  chipActive,
  chipBase,
  chipInactive,
  inputBase,
  rowCard,
} from "@/components/ui";

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
    chipBase + " " + (active ? chipActive : chipInactive);

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Документы"
        description="Положение, смета, приказ, сценарий и другие файлы — рядом с мероприятием."
        action={
          <div className="flex items-center gap-3">
            <Link href="/documents/templates" className={btnSecondary}>
              Шаблоны
            </Link>
            <Link href="/documents/new" className={btnPrimary}>
              Загрузить
            </Link>
          </div>
        }
      />

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
              className={inputBase + " py-1.5 text-sm"}
            >
              <option value="">Все мероприятия</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title}
                </option>
              ))}
            </select>
            <button type="submit" className={btnSecondary + " py-1.5"}>
              Применить
            </button>
          </form>
        )}
      </div>

      {documents.length === 0 ? (
        <EmptyState
          title={
            activeType || event
              ? "Под фильтры ничего не подходит."
              : "Пока нет документов."
          }
          hint={
            activeType || event
              ? "Измени фильтры или загрузи новый документ."
              : "Нажми «Загрузить», чтобы добавить первый файл."
          }
        />
      ) : (
        <ul className="mt-8 flex flex-col gap-2">
          {documents.map((doc) => (
            <li key={doc.id} className={rowCard}>
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
                <span className={badgeBase + " " + documentTypeBadgeClass(doc.type)}>
                  {documentTypeLabel(doc.type)}
                </span>
                <form action={downloadDocument}>
                  <input type="hidden" name="id" value={doc.id} />
                  <button type="submit" className={btnSecondary + " py-1.5"}>
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
