import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatEventDate } from "@/lib/events";
import {
  TASK_STATUSES,
  dueState,
  dueStateBadgeClass,
  dueStateLabel,
  taskPriorityBadgeClass,
  taskPriorityLabel,
  taskStatusBadgeClass,
  taskStatusLabel,
} from "@/lib/tasks";
import { deleteTask, updateTaskStatus } from "../actions";
import ConfirmDeleteButton from "@/components/ConfirmDeleteButton";
import { alertError, badgeBase, btnSecondary, inputBase } from "@/components/ui";

// Карточка задачи. В Next.js 16 params — асинхронные.
export default async function TaskPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();
  const { data: task } = await supabase
    .from("tasks")
    .select("*, events(id, title)")
    .eq("id", id)
    .single();

  if (!task) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/tasks"
        className="text-sm font-medium text-muted transition hover:text-espresso"
      >
        ← К задачам
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="font-serif text-2xl font-semibold tracking-tight text-espresso">{task.title}</h1>
        <span className={badgeBase + " " + taskPriorityBadgeClass(task.priority)}>
          {taskPriorityLabel(task.priority)}
        </span>
        <span className={badgeBase + " " + taskStatusBadgeClass(task.status)}>
          {taskStatusLabel(task.status)}
        </span>
      </div>

      {error && <p className={"mt-4 " + alertError}>{error}</p>}

      {/* Основные поля */}
      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-sand bg-card p-4 shadow-sm">
          <dt className="text-xs uppercase tracking-wide text-muted">Срок</dt>
          <dd className="mt-1 flex flex-wrap items-center gap-2 text-espresso">
            {formatEventDate(task.due_date)}
            {(() => {
              const ds = dueState(task.due_date, task.status);
              return ds === "none" ? null : (
                <span className={badgeBase + " " + dueStateBadgeClass(ds)}>
                  {dueStateLabel(ds)}
                </span>
              );
            })()}
          </dd>
        </div>
        <div className="rounded-lg border border-sand bg-card p-4 shadow-sm">
          <dt className="text-xs uppercase tracking-wide text-muted">
            Мероприятие
          </dt>
          <dd className="mt-1 text-espresso">
            {task.events ? (
              <Link
                href={`/events/${task.events.id}`}
                className="text-espresso underline-offset-2 hover:underline"
              >
                {task.events.title}
              </Link>
            ) : (
              "—"
            )}
          </dd>
        </div>
        {task.description && (
          <div className="rounded-lg border border-sand bg-card p-4 shadow-sm sm:col-span-2">
            <dt className="text-xs uppercase tracking-wide text-muted">
              Описание
            </dt>
            <dd className="mt-1 whitespace-pre-line text-espresso">
              {task.description}
            </dd>
          </div>
        )}
      </dl>

      {/* Смена статуса + действия */}
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <form action={updateTaskStatus} className="flex items-end gap-2">
          <input type="hidden" name="id" value={task.id} />
          <label className="flex flex-col gap-1 text-sm text-espresso">
            Статус
            <select
              name="status"
              defaultValue={task.status}
              className={inputBase}
            >
              {TASK_STATUSES.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className={btnSecondary}>
            Обновить
          </button>
        </form>

        <div className="flex items-center gap-3">
          <Link href={`/tasks/${task.id}/edit`} className={btnSecondary}>
            Редактировать
          </Link>
          <ConfirmDeleteButton
            action={deleteTask}
            id={task.id}
            title="Удалить задачу?"
            message="Это действие необратимо."
          />
        </div>
      </div>
    </div>
  );
}
