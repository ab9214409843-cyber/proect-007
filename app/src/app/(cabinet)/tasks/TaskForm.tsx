import Link from "next/link";
import { TASK_PRIORITIES, TASK_STATUSES, type TaskRow } from "@/lib/tasks";

// Минимум данных мероприятия для выпадашки привязки.
export type EventOption = { id: string; title: string };

// Общая форма создания/редактирования задачи.
// action — server action (createTask или updateTask); task — для предзаполнения при редактировании;
// events — список мероприятий пользователя; defaultEventId — предзаполнить привязку (заход из карточки).
export default function TaskForm({
  action,
  task,
  events,
  submitLabel,
  defaultEventId,
}: {
  action: (formData: FormData) => void | Promise<void>;
  task?: TaskRow;
  events: EventOption[];
  submitLabel: string;
  defaultEventId?: string;
}) {
  const cancelHref = task ? `/tasks/${task.id}` : "/tasks";
  const selectedEvent = task?.event_id ?? defaultEventId ?? "";

  return (
    <form action={action} className="mt-8 flex max-w-2xl flex-col gap-5">
      {task && <input type="hidden" name="id" value={task.id} />}

      <label className="flex flex-col gap-1 text-sm text-gray-700">
        Название <span className="text-red-500">*</span>
        <input
          name="title"
          type="text"
          required
          defaultValue={task?.title ?? ""}
          placeholder="Например: Заказать застройку площадки"
          className="rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-gray-900 focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-gray-700">
        Описание
        <textarea
          name="description"
          rows={4}
          defaultValue={task?.description ?? ""}
          placeholder="Подробности задачи (необязательно)"
          className="rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-gray-900 focus:outline-none"
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-gray-700">
          Срок
          <input
            name="due_date"
            type="date"
            defaultValue={task?.due_date ?? ""}
            className="rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-gray-900 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-gray-700">
          Приоритет
          <select
            name="priority"
            defaultValue={task?.priority ?? "medium"}
            className="rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-gray-900 focus:outline-none"
          >
            {TASK_PRIORITIES.map((p) => (
              <option key={p.code} value={p.code}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-gray-700">
          Статус
          <select
            name="status"
            defaultValue={task?.status ?? "todo"}
            className="rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-gray-900 focus:outline-none"
          >
            {TASK_STATUSES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm text-gray-700">
          Мероприятие
          <select
            name="event_id"
            defaultValue={selectedEvent}
            className="rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-gray-900 focus:outline-none"
          >
            <option value="">— без мероприятия —</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="rounded-md bg-gray-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
        >
          {submitLabel}
        </button>
        <Link
          href={cancelHref}
          className="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
        >
          Отмена
        </Link>
      </div>
    </form>
  );
}
