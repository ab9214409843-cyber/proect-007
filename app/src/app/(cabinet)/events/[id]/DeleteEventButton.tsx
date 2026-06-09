"use client";

import { deleteEvent } from "../actions";

// Кнопка удаления мероприятия с подтверждением — защита от случайного клика.
export default function DeleteEventButton({ id }: { id: string }) {
  return (
    <form
      action={deleteEvent}
      onSubmit={(e) => {
        if (
          !window.confirm(
            "Удалить мероприятие? Связанные задачи, документы и заметки тоже удалятся. Это действие необратимо.",
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded-md border border-red-200 bg-white px-5 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
      >
        Удалить
      </button>
    </form>
  );
}
