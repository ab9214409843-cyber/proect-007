"use client";

import { useState } from "react";
import Modal from "./Modal";
import { btnDanger, btnSecondary } from "./ui";

// Кнопка удаления с подтверждением в аккуратном модальном окне (вместо window.confirm).
// action — server action удаления; id передаётся скрытым полем.
export default function ConfirmDeleteButton({
  action,
  id,
  title,
  message,
  buttonLabel = "Удалить",
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  title: string;
  message: string;
  buttonLabel?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className={btnDanger} onClick={() => setOpen(true)}>
        {buttonLabel}
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title={title}>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className={btnSecondary}
            onClick={() => setOpen(false)}
          >
            Отмена
          </button>
          <form action={action}>
            <input type="hidden" name="id" value={id} />
            <button type="submit" className={btnDanger}>
              {buttonLabel}
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
}
