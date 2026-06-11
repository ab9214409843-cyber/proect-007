import Link from "next/link";
import { createEvent } from "../actions";
import EventForm from "../EventForm";
import { alertError } from "@/components/ui";

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

      {error && <p className={"mt-4 " + alertError}>{error}</p>}

      <EventForm action={createEvent} submitLabel="Создать" />
    </div>
  );
}
