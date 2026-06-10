"use client";

import { deleteDocument } from "../actions";

// Кнопка удаления документа с подтверждением — защита от случайного клика.
export default function DeleteDocumentButton({ id }: { id: string }) {
  return (
    <form
      action={deleteDocument}
      onSubmit={(e) => {
        if (!window.confirm("Удалить документ? Файл будет удалён безвозвратно.")) {
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
