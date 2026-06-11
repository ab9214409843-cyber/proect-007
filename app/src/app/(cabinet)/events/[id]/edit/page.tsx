import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateEvent } from "../../actions";
import EventForm from "../../EventForm";
import { alertError } from "@/components/ui";

// Страница редактирования мероприятия. params и searchParams в Next.js 16 — асинхронные.
export default async function EditEventPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (!event) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href={`/events/${id}`}
        className="text-sm font-medium text-muted transition hover:text-espresso"
      >
        ← К мероприятию
      </Link>

      <h1 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-espresso">
        Редактирование
      </h1>

      {error && <p className={"mt-4 " + alertError}>{error}</p>}

      <EventForm action={updateEvent} event={event} submitLabel="Сохранить" />
    </div>
  );
}
