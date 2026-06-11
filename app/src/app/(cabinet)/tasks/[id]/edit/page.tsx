import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateTask } from "../../actions";
import TaskForm from "../../TaskForm";
import { alertError } from "@/components/ui";

// Страница редактирования задачи. params и searchParams в Next.js 16 — асинхронные.
export default async function EditTaskPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();
  const [{ data: task }, { data: events }] = await Promise.all([
    supabase.from("tasks").select("*").eq("id", id).single(),
    supabase
      .from("events")
      .select("id, title")
      .order("start_date", { ascending: true, nullsFirst: false }),
  ]);

  if (!task) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href={`/tasks/${id}`}
        className="text-sm font-medium text-muted transition hover:text-espresso"
      >
        ← К задаче
      </Link>

      <h1 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-espresso">
        Редактирование
      </h1>

      {error && <p className={"mt-4 " + alertError}>{error}</p>}

      <TaskForm
        action={updateTask}
        task={task}
        events={events ?? []}
        submitLabel="Сохранить"
      />
    </div>
  );
}
