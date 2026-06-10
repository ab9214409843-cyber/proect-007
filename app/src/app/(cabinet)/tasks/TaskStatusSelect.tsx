"use client";

import { useRef } from "react";
import { TASK_STATUSES, taskStatusBadgeClass } from "@/lib/tasks";
import { updateTaskStatus } from "./actions";

// Быстрая смена статуса задачи прямо в списке: выбор в <select> сразу сабмитит форму.
// redirectTo — querystring списка, чтобы после смены вернуться к тем же фильтрам.
export default function TaskStatusSelect({
  id,
  status,
  redirectTo,
}: {
  id: string;
  status: string;
  redirectTo: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form action={updateTaskStatus} ref={formRef}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <select
        name="status"
        defaultValue={status}
        onChange={() => formRef.current?.requestSubmit()}
        className={
          "cursor-pointer rounded-full border-0 px-2.5 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-gray-300 " +
          taskStatusBadgeClass(status)
        }
      >
        {TASK_STATUSES.map((s) => (
          <option key={s.code} value={s.code}>
            {s.label}
          </option>
        ))}
      </select>
    </form>
  );
}
