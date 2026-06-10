import Link from "next/link";
import {
  EXPERIENCE_CATEGORIES,
  EXPERIENCE_KINDS,
  type ExperienceNoteRow,
} from "@/lib/experience";
import { MAX_TEXT_LEN, MAX_TITLE_LEN } from "@/lib/validation";

// Минимум данных мероприятия для выпадашки привязки.
export type EventOption = { id: string; title: string };

// Общая форма создания/редактирования заметки опыта.
// action — server action (createNote или updateNote); note — для предзаполнения при
// редактировании; events — мероприятия пользователя; defaultEventId — предзаполнить привязку
// (заход из карточки мероприятия).
export default function ExperienceForm({
  action,
  note,
  events,
  submitLabel,
  defaultEventId,
}: {
  action: (formData: FormData) => void | Promise<void>;
  note?: ExperienceNoteRow;
  events: EventOption[];
  submitLabel: string;
  defaultEventId?: string;
}) {
  const cancelHref = note ? `/experience/${note.id}` : "/experience";
  const selectedEvent = note?.event_id ?? defaultEventId ?? "";

  return (
    <form action={action} className="mt-8 flex max-w-2xl flex-col gap-5">
      {note && <input type="hidden" name="id" value={note.id} />}

      <label className="flex flex-col gap-1 text-sm text-gray-700">
        Заголовок <span className="text-red-500">*</span>
        <input
          name="title"
          type="text"
          required
          maxLength={MAX_TITLE_LEN}
          defaultValue={note?.title ?? ""}
          placeholder="Коротко: о чём вывод"
          className="rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-gray-900 focus:outline-none"
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-gray-700">
          Тип вывода
          <select
            name="kind"
            defaultValue={note?.kind ?? "positive"}
            className="rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-gray-900 focus:outline-none"
          >
            {EXPERIENCE_KINDS.map((k) => (
              <option key={k.code} value={k.code}>
                {k.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm text-gray-700">
          Категория
          <select
            name="category"
            defaultValue={note?.category ?? "organization"}
            className="rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-gray-900 focus:outline-none"
          >
            {EXPERIENCE_CATEGORIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
      </div>

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

      <label className="flex flex-col gap-1 text-sm text-gray-700">
        Текст вывода
        <textarea
          name="description"
          rows={5}
          maxLength={MAX_TEXT_LEN}
          defaultValue={note?.description ?? ""}
          placeholder="Что именно произошло и какой вывод на будущее"
          className="rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-gray-900 focus:outline-none"
        />
      </label>

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
