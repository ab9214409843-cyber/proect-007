import Link from "next/link";
import {
  DOCUMENT_TYPES,
  formatFileSize,
  type DocumentRow,
} from "@/lib/documents";
import { MAX_TITLE_LEN } from "@/lib/validation";
import { btnPrimary, btnSecondary, inputBase } from "@/components/ui";

// Минимум данных мероприятия для выпадашки привязки.
export type EventOption = { id: string; title: string };

// Общая форма создания/редактирования документа.
// action — server action (createDocument или updateDocument); document — для предзаполнения при
// редактировании (тогда поле файла скрыто, меняем только метаданные); events — мероприятия
// пользователя; defaultEventId — предзаполнить привязку (заход из карточки мероприятия).
export default function DocumentForm({
  action,
  document,
  events,
  submitLabel,
  defaultEventId,
}: {
  action: (formData: FormData) => void | Promise<void>;
  document?: DocumentRow;
  events: EventOption[];
  submitLabel: string;
  defaultEventId?: string;
}) {
  const isEdit = Boolean(document);
  const cancelHref = document ? `/documents/${document.id}` : "/documents";
  const selectedEvent = document?.event_id ?? defaultEventId ?? "";

  return (
    <form action={action} className="mt-8 flex max-w-2xl flex-col gap-5">
      {document && <input type="hidden" name="id" value={document.id} />}

      {isEdit ? (
        // При редактировании файл не меняем — показываем, какой прикреплён.
        <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600">
          Файл: <span className="text-gray-900">{document!.file_name ?? "—"}</span>
          {document!.file_size != null && (
            <> · {formatFileSize(document!.file_size)}</>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Сам файл заменить нельзя — для нового файла загрузи документ заново.
          </p>
        </div>
      ) : (
        <label className="flex flex-col gap-1 text-sm text-gray-700">
          Файл <span className="text-red-500">*</span>
          <input
            name="file"
            type="file"
            required
            className={
              inputBase +
              " file:mr-3 file:rounded file:border-0 file:bg-gray-900 file:px-3 file:py-1 file:text-sm file:text-white hover:file:bg-gray-700"
            }
          />
          <span className="text-xs text-gray-500">Любой файл до 25 МБ.</span>
        </label>
      )}

      <label className="flex flex-col gap-1 text-sm text-gray-700">
        Название
        <input
          name="title"
          type="text"
          maxLength={MAX_TITLE_LEN}
          defaultValue={document?.title ?? ""}
          placeholder={isEdit ? "" : "Если пусто — возьмём имя файла"}
          className={inputBase}
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-gray-700">
          Тип документа
          <select
            name="type"
            defaultValue={document?.type ?? "other"}
            className={inputBase}
          >
            {DOCUMENT_TYPES.map((t) => (
              <option key={t.code} value={t.code}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm text-gray-700">
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
