import Link from "next/link";
import { createEvent } from "../actions";
import EventForm from "../EventForm";

// Страница создания мероприятия. Ошибки приходят через ?error= (паттерн как в register).
export default async function NewEventPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/events"
        className="text-sm font-medium text-muted transition hover:text-espresso"
      >
        ← К мероприятиям
      </Link>

      <h1 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-espresso">
        Новое мероприятие
      </h1>

      {error && (
        <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <EventForm action={createEvent} submitLabel="Создать" />
    </div>
  );
}
