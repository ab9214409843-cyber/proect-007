import Link from "next/link";
import { TASK_PRIORITIES, TASK_STATUSES, type TaskRow } from "@/lib/tasks";
import { MAX_TEXT_LEN, MAX_TITLE_LEN } from "@/lib/validation";
import { btnPrimary, btnSecondary, inputBase } from "@/components/ui";

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

      <label className="flex flex-col gap-1 text-sm text-espresso">
        Название <span className="text-red-500">*</span>
        <input
          name="title"
          type="text"
          required
          maxLength={MAX_TITLE_LEN}
          defaultValue={task?.title ?? ""}
          placeholder="Например: Заказать застройку площадки"
          className={inputBase}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-espresso">
        Описание
        <textarea
          name="description"
          rows={4}
          maxLength={MAX_TEXT_LEN}
          defaultValue={task?.description ?? ""}
          placeholder="Подробности задачи (необязательно)"
          className={inputBase}
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-espresso">
          Срок
          <input
            name="due_date"
            type="date"
            defaultValue={task?.due_date ?? ""}
            className={inputBase}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-espresso">
          Приоритет
          <select
            name="priority"
            defaultValue={task?.priority ?? "medium"}
            className={inputBase}
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
        <label className="flex flex-col gap-1 text-sm text-espresso">
          Статус
          <select
            name="status"
            defaultValue={task?.status ?? "todo"}
            className={inputBase}
          >
            {TASK_STATUSES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm text-espresso">
          Мероприятие
          <select
            name="event_id"
            defaultValue={selectedEvent}
            className={inputBase}
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
        <button type="submit" className={btnPrimary}>
          {submitLabel}
        </button>
        <Link href={cancelHref} className={btnSecondary}>
          Отмена
        </Link>
      </div>
    </form>
  );
}
