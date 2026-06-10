import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  EVENT_STATUSES,
  formatEventDate,
  formatEventRange,
  statusBadgeClass,
  statusLabel,
} from "@/lib/events";
import {
  taskPriorityBadgeClass,
  taskPriorityLabel,
  taskStatusBadgeClass,
  taskStatusLabel,
} from "@/lib/tasks";
import {
  documentTypeBadgeClass,
  documentTypeLabel,
  formatFileSize,
} from "@/lib/documents";
import {
  categoryBadgeClass,
  categoryLabel,
  kindBadgeClass,
  kindLabel,
} from "@/lib/experience";
import { updateEventStatus } from "../actions";
import { downloadDocument } from "../../documents/actions";
import DeleteEventButton from "./DeleteEventButton";

// Карточка мероприятия. В Next.js 16 params — асинхронные.
export default async function EventPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (!event) notFound();

  // Задачи автоплана этого мероприятия — по сроку (ближайшие сверху).
  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("event_id", id)
    .order("due_date", { ascending: true, nullsFirst: false });

  // Документы этого мероприятия — свежие сверху.
  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("event_id", id)
    .order("created_at", { ascending: false });

  // Заметки опыта этого мероприятия — свежие сверху.
  const { data: notes } = await supabase
    .from("experience_notes")
    .select("*")
    .eq("event_id", id)
    .order("created_at", { ascending: false });

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

      {error && (
        <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

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

      {/* Задачи — автоплан (этап 5) + ручное управление (этап 6) */}
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">План задач</h2>
          <Link
            href={`/tasks/new?event=${event.id}`}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            + Добавить задачу
          </Link>
        </div>
        {tasks && tasks.length > 0 ? (
          <ul className="mt-4 flex flex-col gap-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
              >
                <Link href={`/tasks/${task.id}`} className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 hover:underline">
                    {task.title}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Срок: {formatEventDate(task.due_date)}
                  </p>
                </Link>
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={
                      "rounded-full px-2.5 py-1 text-xs font-medium " +
                      taskPriorityBadgeClass(task.priority)
                    }
                  >
                    {taskPriorityLabel(task.priority)}
                  </span>
                  <span
                    className={
                      "rounded-full px-2.5 py-1 text-xs font-medium " +
                      taskStatusBadgeClass(task.status)
                    }
                  >
                    {taskStatusLabel(task.status)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-4 rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center">
            <p className="text-gray-700">Пока нет задач.</p>
            <p className="mt-1 text-sm text-gray-500">
              План задач создаётся автоматически при создании мероприятия с типом и датой.
            </p>
          </div>
        )}
      </section>

      {/* Документы мероприятия (этап 7) */}
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Документы</h2>
          <Link
            href={`/documents/new?event=${event.id}`}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            + Добавить документ
          </Link>
        </div>
        {documents && documents.length > 0 ? (
          <ul className="mt-4 flex flex-col gap-2">
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
        ) : (
          <div className="mt-4 rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center">
            <p className="text-gray-700">Пока нет документов.</p>
            <p className="mt-1 text-sm text-gray-500">
              Нажми «+ Добавить документ», чтобы загрузить первый файл.
            </p>
          </div>
        )}
      </section>

      {/* Заметки опыта мероприятия (этап 8) */}
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Заметки опыта</h2>
          <Link
            href={`/experience/new?event=${event.id}`}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            + Добавить заметку
          </Link>
        </div>
        {notes && notes.length > 0 ? (
          <ul className="mt-4 flex flex-col gap-2">
            {notes.map((note) => (
              <li
                key={note.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
              >
                <Link href={`/experience/${note.id}`} className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-900 hover:underline">
                    {note.title}
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
        ) : (
          <div className="mt-4 rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center">
            <p className="text-gray-700">Пока нет заметок.</p>
            <p className="mt-1 text-sm text-gray-500">
              После мероприятия запиши выводы — нажми «+ Добавить заметку».
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
