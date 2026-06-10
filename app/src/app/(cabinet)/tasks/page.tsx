import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatEventDate } from "@/lib/events";
import {
  taskPriorityBadgeClass,
  taskPriorityLabel,
  taskStatusBadgeClass,
  taskStatusLabel,
} from "@/lib/tasks";

// Все задачи пользователя (RLS отдаёт только свои). Название мероприятия — через связь events(id, title).
export default async function TasksPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tasks")
    .select("*, events(id, title)")
    .order("due_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  const tasks = data ?? [];

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-semibold text-gray-900">Задачи</h1>
      <p className="mt-2 text-gray-600">
        Все задачи по подготовке мероприятий в одном месте.
      </p>

      {tasks.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-gray-700">Пока нет задач.</p>
          <p className="mt-1 text-sm text-gray-500">
            Создай мероприятие с типом и датой — план задач появится автоматически.
          </p>
        </div>
      ) : (
        <ul className="mt-8 flex flex-col gap-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="min-w-0">
                <p className="font-medium text-gray-900">{task.title}</p>
                <p className="mt-1 text-sm text-gray-500">
                  Срок: {formatEventDate(task.due_date)}
                  {task.events && (
                    <>
                      {" · "}
                      <Link
                        href={`/events/${task.events.id}`}
                        className="text-gray-600 underline-offset-2 hover:underline"
                      >
                        {task.events.title}
                      </Link>
                    </>
                  )}
                </p>
              </div>
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
      )}
    </div>
  );
}
