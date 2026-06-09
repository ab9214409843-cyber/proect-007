import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateEvent } from "../../actions";
import EventForm from "../../EventForm";

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
        className="text-sm font-medium text-gray-500 transition hover:text-gray-900"
      >
        ← К мероприятию
      </Link>

      <h1 className="mt-3 text-2xl font-semibold text-gray-900">
        Редактирование
      </h1>

      {error && (
        <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <EventForm action={updateEvent} event={event} submitLabel="Сохранить" />
    </div>
  );
}
