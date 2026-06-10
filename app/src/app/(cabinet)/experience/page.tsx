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
    chipBase + " " + (active ? chipActive : chipInactive);

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="База опыта"
        description="Выводы после мероприятий: что прошло хорошо, где ошиблись, что улучшить."
        action={
          <Link href="/experience/new" className={btnPrimary}>
            + Заметка
          </Link>
        }
      />

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
            className={inputBase + " py-1.5 text-sm"}
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
              className={inputBase + " py-1.5 text-sm"}
            >
              <option value="">Все мероприятия</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title}
                </option>
              ))}
            </select>
          )}
          <button type="submit" className={btnSecondary + " py-1.5"}>
            Применить
          </button>
        </form>
      </div>

      {notes.length === 0 ? (
        <EmptyState
          title={hasFilters ? "Под фильтры ничего не подходит." : "Пока нет заметок."}
          hint={
            hasFilters
              ? "Измени фильтры или добавь новую заметку."
              : "Нажми «+ Заметка», чтобы записать первый вывод."
          }
        />
      ) : (
        <ul className="mt-8 flex flex-col gap-2">
          {notes.map((note) => (
            <li key={note.id} className={rowCard}>
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
                <span className={badgeBase + " " + kindBadgeClass(note.kind)}>
                  {kindLabel(note.kind)}
                </span>
                {note.category && (
                  <span className={badgeBase + " " + categoryBadgeClass(note.category)}>
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
