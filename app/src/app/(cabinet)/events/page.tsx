import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  formatEventRange,
  statusBadgeClass,
  statusLabel,
  type EventRow,
} from "@/lib/events";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { badgeBase, btnPrimary, rowCard } from "@/components/ui";

// Список мероприятий. RLS отдаёт только записи текущего пользователя.
export default async function EventsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .order("start_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  const events: EventRow[] = data ?? [];

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Мероприятия"
        action={
          <Link href="/events/new" className={btnPrimary}>
            Создать
          </Link>
        }
      />

      {events.length === 0 ? (
        <EmptyState
          title="Пока нет мероприятий."
          hint="Нажми «Создать», чтобы добавить первое мероприятие."
        />
      ) : (
        <ul className="mt-8 flex flex-col gap-3">
          {events.map((event) => (
            <li key={event.id}>
              <Link
                href={`/events/${event.id}`}
                className="flex items-center justify-between gap-4 rounded-lg border border-sand bg-card p-5 shadow-sm transition hover:border-sand hover:shadow"
              >
                <div className="min-w-0">
                  <h2 className="truncate font-semibold text-espresso">
                    {event.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    {formatEventRange(event.start_date, event.end_date)}
                    {event.location ? ` · ${event.location}` : ""}
                  </p>
                </div>
                <span
                  className={"shrink-0 " + badgeBase + " " + statusBadgeClass(event.status)}
                >
                  {statusLabel(event.status)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
