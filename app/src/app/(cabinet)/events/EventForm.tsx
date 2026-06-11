import Link from "next/link";
import { EVENT_TYPES, type EventRow } from "@/lib/events";
import { MAX_TEXT_LEN, MAX_TITLE_LEN } from "@/lib/validation";
import { btnPrimary, btnSecondary, inputBase } from "@/components/ui";

// Общая форма создания/редактирования мероприятия.
// action — server action (createEvent или updateEvent); event — для предзаполнения при редактировании.
export default function EventForm({
  action,
  event,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  event?: EventRow;
  submitLabel: string;
}) {
  const cancelHref = event ? `/events/${event.id}` : "/events";

  return (
    <form action={action} className="mt-8 flex max-w-2xl flex-col gap-5">
      {event && <input type="hidden" name="id" value={event.id} />}

      <label className="flex flex-col gap-1 text-sm text-espresso">
        Название <span className="text-danger">*</span>
        <input
          name="title"
          type="text"
          required
          maxLength={MAX_TITLE_LEN}
          defaultValue={event?.title ?? ""}
          placeholder="Например: Кубок по гонкам дронов 2026"
          className={inputBase}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-espresso">
        Тип мероприятия <span className="text-danger">*</span>
        <select
          name="event_type"
          required
          defaultValue={event?.event_type ?? ""}
          className={inputBase}
        >
          <option value="" disabled>
            — выбери тип —
          </option>
          {EVENT_TYPES.map((t) => (
            <option key={t.code} value={t.code}>
              {t.label}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-espresso">
          Дата начала <span className="text-danger">*</span>
          <input
            name="start_date"
            type="date"
            required
            defaultValue={event?.start_date ?? ""}
            className={inputBase}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-espresso">
          Дата окончания
          <input
            name="end_date"
            type="date"
            defaultValue={event?.end_date ?? ""}
            className={inputBase}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-espresso">
        Место проведения
        <input
          name="location"
          type="text"
          maxLength={MAX_TITLE_LEN}
          defaultValue={event?.location ?? ""}
          placeholder="Город, адрес или площадка"
          className={inputBase}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-espresso">
        Описание
        <textarea
          name="description"
          rows={4}
          maxLength={MAX_TEXT_LEN}
          defaultValue={event?.description ?? ""}
          placeholder="Короткое описание мероприятия (необязательно)"
          className={inputBase}
        />
      </label>

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
