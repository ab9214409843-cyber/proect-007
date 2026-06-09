import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  EVENT_STATUSES,
  formatEventRange,
  statusBadgeClass,
  statusLabel,
} from "@/lib/events";
import { updateEventStatus } from "../actions";
import DeleteEventButton from "./DeleteEventButton";

// Карточка мероприятия. В Next.js 16 params — асинхронные.
export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (!event) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/events"
        className="text-sm font-medium text-gray-500 transition hover:text-gray-900"
      >
        ← К мероприятиям
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold text-gray-900">{event.title}</h1>
        <span
          className={
            "rounded-full px-3 py-1 text-xs font-medium " +
            statusBadgeClass(event.status)
          }
        >
          {statusLabel(event.status)}
        </span>
      </div>

      {/* Основные поля */}
      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <dt className="text-xs uppercase tracking-wide text-gray-500">Дата</dt>
          <dd className="mt-1 text-gray-900">
            {formatEventRange(event.start_date, event.end_date)}
          </dd>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <dt className="text-xs uppercase tracking-wide text-gray-500">
            Место
          </dt>
          <dd className="mt-1 text-gray-900">{event.location ?? "—"}</dd>
        </div>
        {event.description && (
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:col-span-2">
            <dt className="text-xs uppercase tracking-wide text-gray-500">
              Описание
            </dt>
            <dd className="mt-1 whitespace-pre-line text-gray-900">
              {event.description}
            </dd>
          </div>
        )}
      </dl>

      {/* Смена статуса + действия */}
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <form action={updateEventStatus} className="flex items-end gap-2">
          <input type="hidden" name="id" value={event.id} />
          <label className="flex flex-col gap-1 text-sm text-gray-700">
            Статус
            <select
              name="status"
              defaultValue={event.status}
              className="rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-gray-900 focus:outline-none"
            >
              {EVENT_STATUSES.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Обновить
          </button>
        </form>

        <div className="flex items-center gap-3">
          <Link
            href={`/events/${event.id}/edit`}
            className="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Редактировать
          </Link>
          <DeleteEventButton id={event.id} />
        </div>
      </div>

      {/* Связанные модули — появятся на следующих этапах */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { title: "Задачи", note: "появятся на этапе 5" },
          { title: "Документы", note: "появятся на этапе 6" },
          { title: "Заметки опыта", note: "появятся на этапе 7" },
        ].map((block) => (
          <div
            key={block.title}
            className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center"
          >
            <h2 className="font-semibold text-gray-900">{block.title}</h2>
            <p className="mt-1 text-sm text-gray-500">{block.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
