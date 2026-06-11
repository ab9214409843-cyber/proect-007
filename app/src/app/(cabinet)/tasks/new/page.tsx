import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createTask } from "../actions";
import TaskForm from "../TaskForm";
import { alertError } from "@/components/ui";

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
        className="text-sm font-medium text-muted transition hover:text-espresso"
      >
        ← К задачам
      </Link>

      <h1 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-espresso">Новая задача</h1>

      {error && <p className={"mt-4 " + alertError}>{error}</p>}

      <TaskForm
        action={createTask}
        events={events ?? []}
        defaultEventId={event}
        submitLabel="Создать"
      />
    </div>
  );
}
