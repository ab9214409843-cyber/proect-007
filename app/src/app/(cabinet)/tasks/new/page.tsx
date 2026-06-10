import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createTask } from "../actions";
import TaskForm from "../TaskForm";

// Страница создания задачи. Ошибки приходят через ?error=; ?event= предзаполняет привязку
// (заход из карточки мероприятия). params/searchParams в Next.js 16 — асинхронные.
export default async function NewTaskPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; event?: string }>;
}) {
  const { error, event } = await searchParams;

  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select("id, title")
    .order("start_date", { ascending: true, nullsFirst: false });

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/tasks"
        className="text-sm font-medium text-gray-500 transition hover:text-gray-900"
      >
        ← К задачам
      </Link>

      <h1 className="mt-3 text-2xl font-semibold text-gray-900">Новая задача</h1>

      {error && (
        <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <TaskForm
        action={createTask}
        events={events ?? []}
        defaultEventId={event}
        submitLabel="Создать"
      />
    </div>
  );
}
