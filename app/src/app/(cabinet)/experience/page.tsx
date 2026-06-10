import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatEventDate } from "@/lib/events";
import {
  EXPERIENCE_CATEGORIES,
  EXPERIENCE_KINDS,
  categoryBadgeClass,
  categoryLabel,
  kindBadgeClass,
  kindLabel,
} from "@/lib/experience";

// Список всех заметок опыта пользователя (RLS отдаёт только свои) с фильтрами по типу вывода,
// категории и мероприятию. Фильтры — через searchParams; Next.js 16: searchParams асинхронные.
export default async function ExperiencePage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string; category?: string; event?: string }>;
}) {
  const { kind, category, event } = await searchParams;
  const activeKind = EXPERIENCE_KINDS.some((k) => k.code === kind) ? kind : undefined;
  const activeCategory = EXPERIENCE_CATEGORIES.some((c) => c.code === category)
    ? category
    : undefined;

  const supabase = await createClient();

  // Мероприятия пользователя — для фильтра по мероприятию.
  const { data: events } = await supabase
    .from("events")
    .select("id, title")
    .order("start_date", { ascending: true, nullsFirst: false });

  let query = supabase
    .from("experience_notes")
    .select("*, events(id, title)")
    .order("created_at", { ascending: false });

  if (activeKind) query = query.eq("kind", activeKind);
  if (activeCategory) query = query.eq("category", activeCategory);
  if (event) query = query.eq("event_id", event);

  const { data } = await query;
  const notes = data ?? [];

  const hasFilters = Boolean(activeKind || activeCategory || event);

  // Ссылка на чип типа вывода — сохраняем остальные фильтры (категория, мероприятие).
  const kindHref = (code?: string) => {
    const qs = new URLSearchParams();
    if (code) qs.set("kind", code);
    if (activeCategory) qs.set("category", activeCategory);
    if (event) qs.set("event", event);
    return "/experience" + (qs.toString() ? `?${qs}` : "");
  };

  const chip = (active: boolean) =>
    "rounded-full px-3 py-1 text-sm font-medium transition " +
    (active
      ? "bg-gray-900 text-white"
      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100");

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">База опыта</h1>
        <Link
          href="/experience/new"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
        >
          + Заметка
        </Link>
      </div>
      <p className="mt-2 text-gray-600">
        Выводы после мероприятий: что прошло хорошо, где ошиблись, что улучшить.
      </p>

      {/* Фильтры по типу вывода (чипы) + категории и мероприятию (select) */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={kindHref()} className={chip(!activeKind)}>
            Все
          </Link>
          {EXPERIENCE_KINDS.map((k) => (
            <Link
              key={k.code}
              href={kindHref(k.code)}
              className={chip(activeKind === k.code)}
            >
              {k.label}
            </Link>
          ))}
        </div>

        <form method="GET" className="ml-auto flex items-center gap-2">
          {activeKind && <input type="hidden" name="kind" value={activeKind} />}
          <select
            name="category"
            defaultValue={activeCategory ?? ""}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none"
          >
            <option value="">Все категории</option>
            {EXPERIENCE_CATEGORIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
          {events && events.length > 0 && (
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
          )}
          <button
            type="submit"
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Применить
          </button>
        </form>
      </div>

      {notes.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-gray-700">
            {hasFilters ? "Под фильтры ничего не подходит." : "Пока нет заметок."}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {hasFilters
              ? "Измени фильтры или добавь новую заметку."
              : "Нажми «+ Заметка», чтобы записать первый вывод."}
          </p>
        </div>
      ) : (
        <ul className="mt-8 flex flex-col gap-2">
          {notes.map((note) => (
            <li
              key={note.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <Link href={`/experience/${note.id}`} className="min-w-0 flex-1">
                <p className="truncate font-medium text-gray-900 hover:underline">
                  {note.title}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {note.events && <>{note.events.title} · </>}
                  {formatEventDate(note.created_at)}
                </p>
              </Link>
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={
                    "rounded-full px-2.5 py-1 text-xs font-medium " +
                    kindBadgeClass(note.kind)
                  }
                >
                  {kindLabel(note.kind)}
                </span>
                {note.category && (
                  <span
                    className={
                      "rounded-full px-2.5 py-1 text-xs font-medium " +
                      categoryBadgeClass(note.category)
                    }
                  >
                    {categoryLabel(note.category)}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
