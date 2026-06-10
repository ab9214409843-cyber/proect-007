import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatEventDate } from "@/lib/events";
import {
  TASK_STATUSES,
  taskPriorityBadgeClass,
  taskPriorityLabel,
  taskStatusBadgeClass,
  taskStatusLabel,
} from "@/lib/tasks";
import { deleteTask, updateTaskStatus } from "../actions";
import ConfirmDeleteButton from "@/components/ConfirmDeleteButton";
import { badgeBase, btnSecondary, inputBase } from "@/components/ui";

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
        className="text-sm font-medium text-gray-500 transition hover:text-gray-900"
      >
        ← К задачам
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold text-gray-900">{task.title}</h1>
        <span className={badgeBase + " " + taskPriorityBadgeClass(task.priority)}>
          {taskPriorityLabel(task.priority)}
        </span>
        <span className={badgeBase + " " + taskStatusBadgeClass(task.status)}>
          {taskStatusLabel(task.status)}
        </span>
      </div>

      {error && (
        <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      {/* Основные поля */}
      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <dt className="text-xs uppercase tracking-wide text-gray-500">Срок</dt>
          <dd className="mt-1 text-gray-900">{formatEventDate(task.due_date)}</dd>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <dt className="text-xs uppercase tracking-wide text-gray-500">
            Мероприятие
          </dt>
          <dd className="mt-1 text-gray-900">
            {task.events ? (
              <Link
                href={`/events/${task.events.id}`}
                className="text-gray-900 underline-offset-2 hover:underline"
              >
                {task.events.title}
              </Link>
            ) : (
              "—"
            )}
          </dd>
        </div>
        {task.description && (
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:col-span-2">
            <dt className="text-xs uppercase tracking-wide text-gray-500">
              Описание
            </dt>
            <dd className="mt-1 whitespace-pre-line text-gray-900">
              {task.description}
            </dd>
          </div>
        )}
      </dl>

      {/* Смена статуса + действия */}
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <form action={updateTaskStatus} className="flex items-end gap-2">
          <input type="hidden" name="id" value={task.id} />
          <label className="flex flex-col gap-1 text-sm text-gray-700">
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
