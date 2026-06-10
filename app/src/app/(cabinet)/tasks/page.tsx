import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatEventDate } from "@/lib/events";
import {
  TASK_STATUSES,
  taskPriorityBadgeClass,
  taskPriorityLabel,
} from "@/lib/tasks";
import TaskStatusSelect from "./TaskStatusSelect";
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

// Список всех задач пользователя (RLS отдаёт только свои) с фильтрами по статусу и мероприятию.
// Фильтры — через searchParams (status, event); Next.js 16: searchParams асинхронные.
export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; event?: string; error?: string }>;
}) {
  const { status, event, error } = await searchParams;
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
    chipBase + " " + (active ? chipActive : chipInactive);

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Задачи"
        description="Все задачи по подготовке мероприятий в одном месте."
        action={
          <Link href="/tasks/new" className={btnPrimary}>
            Создать
          </Link>
        }
      />

      {error && (
        <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

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

      {tasks.length === 0 ? (
        <EmptyState
          title={
            activeStatus || event
              ? "Под фильтры ничего не подходит."
              : "Пока нет задач."
          }
          hint={
            activeStatus || event
              ? "Измени фильтры или создай новую задачу."
              : "Нажми «Создать» или добавь мероприятие — план задач появится автоматически."
          }
        />
      ) : (
        <ul className="mt-8 flex flex-col gap-2">
          {tasks.map((task) => (
            <li key={task.id} className={rowCard}>
              <Link href={`/tasks/${task.id}`} className="min-w-0 flex-1">
                <p className="font-medium text-espresso hover:underline">
                  {task.title}
                </p>
                <p className="mt-1 text-sm text-muted">
                  Срок: {formatEventDate(task.due_date)}
                  {task.events && <> · {task.events.title}</>}
                </p>
              </Link>
              <div className="flex shrink-0 items-center gap-2">
                <span className={badgeBase + " " + taskPriorityBadgeClass(task.priority)}>
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
