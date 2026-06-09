import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  formatEventRange,
  statusBadgeClass,
  statusLabel,
  type EventRow,
} from "@/lib/events";

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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Мероприятия</h1>
        <Link
          href="/events/new"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
        >
          Создать
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-gray-700">Пока нет мероприятий.</p>
          <p className="mt-1 text-sm text-gray-500">
            Нажми «Создать», чтобы добавить первое мероприятие.
          </p>
        </div>
      ) : (
        <ul className="mt-8 flex flex-col gap-3">
          {events.map((event) => (
            <li key={event.id}>
              <Link
                href={`/events/${event.id}`}
                className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 hover:shadow"
              >
                <div className="min-w-0">
                  <h2 className="truncate font-semibold text-gray-900">
                    {event.title}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {formatEventRange(event.start_date, event.end_date)}
                    {event.location ? ` · ${event.location}` : ""}
                  </p>
                </div>
                <span
                  className={
                    "shrink-0 rounded-full px-3 py-1 text-xs font-medium " +
                    statusBadgeClass(event.status)
                  }
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
