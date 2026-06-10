import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatEventDate } from "@/lib/events";
import {
  TASK_STATUSES,
  taskPriorityBadgeClass,
  taskPriorityLabel,
} from "@/lib/tasks";
import TaskStatusSelect from "./TaskStatusSelect";

// Список всех задач пользователя (RLS отдаёт только свои) с фильтрами по статусу и мероприятию.
// Фильтры — через searchParams (status, event); Next.js 16: searchParams асинхронные.
export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; event?: string }>;
}) {
  const { status, event } = await searchParams;
  const activeStatus = TASK_STATUSES.some((s) => s.code === status) ? status : undefined;

  const supabase = await createClient();

  // Мероприятия пользователя — для фильтра по мероприятию.
  const { data: events } = await supabase
    .from("events")
    .select("id, title")
    .order("start_date", { ascending: true, nullsFirst: false });

  let query = supabase
    .from("tasks")
    .select("*, events(id, title)")
    .order("due_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (activeStatus) query = query.eq("status", activeStatus);
  if (event) query = query.eq("event_id", event);

  const { data } = await query;
  const tasks = data ?? [];

  // Текущий querystring списка — чтобы быстрая смена статуса в строке вернула к тем же фильтрам.
  const currentQs = new URLSearchParams();
  if (activeStatus) currentQs.set("status", activeStatus);
  if (event) currentQs.set("event", event);
  const redirectTo = "/tasks" + (currentQs.toString() ? `?${currentQs}` : "");

  // Ссылка на чип статуса — сохраняем фильтр по мероприятию.
  const statusHref = (code?: string) => {
    const qs = new URLSearchParams();
    if (code) qs.set("status", code);
    if (event) qs.set("event", event);
    return "/tasks" + (qs.toString() ? `?${qs}` : "");
  };

  const chip = (active: boolean) =>
    "rounded-full px-3 py-1 text-sm font-medium transition " +
    (active
      ? "bg-gray-900 text-white"
      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100");

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Задачи</h1>
        <Link
          href="/tasks/new"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
        >
          Создать
        </Link>
      </div>
      <p className="mt-2 text-gray-600">
        Все задачи по подготовке мероприятий в одном месте.
      </p>

      {/* Фильтры */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={statusHref()} className={chip(!activeStatus)}>
            Все
          </Link>
          {TASK_STATUSES.map((s) => (
            <Link
              key={s.code}
              href={statusHref(s.code)}
              className={chip(activeStatus === s.code)}
            >
              {s.label}
            </Link>
          ))}
        </div>

        {events && events.length > 0 && (
          <form method="GET" className="ml-auto flex items-center gap-2">
            {activeStatus && (
              <input type="hidden" name="status" value={activeStatus} />
            )}
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

      {tasks.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-gray-700">
            {activeStatus || event ? "Под фильтры ничего не подходит." : "Пока нет задач."}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {activeStatus || event
              ? "Измени фильтры или создай новую задачу."
              : "Нажми «Создать» или добавь мероприятие — план задач появится автоматически."}
          </p>
        </div>
      ) : (
        <ul className="mt-8 flex flex-col gap-2">
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
                  {task.events && <> · {task.events.title}</>}
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
                <TaskStatusSelect
                  id={task.id}
                  status={task.status}
                  redirectTo={redirectTo}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
