import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createNote } from "../actions";
import ExperienceForm from "../ExperienceForm";

// Страница создания заметки опыта. Ошибки приходят через ?error=; ?event= предзаполняет привязку
// (заход из карточки мероприятия). searchParams в Next.js 16 — асинхронные.
export default async function NewNotePage({
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
        href="/experience"
        className="text-sm font-medium text-muted transition hover:text-espresso"
      >
        ← К базе опыта
      </Link>

      <h1 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-espresso">Новая заметка</h1>

      {error && (
        <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <ExperienceForm
        action={createNote}
        events={events ?? []}
        defaultEventId={event}
        submitLabel="Создать"
      />
    </div>
  );
}
