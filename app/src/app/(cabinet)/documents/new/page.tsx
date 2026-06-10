import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createDocument } from "../actions";
import DocumentForm from "../DocumentForm";

// Страница загрузки документа. Ошибки приходят через ?error=; ?event= предзаполняет привязку
// (заход из карточки мероприятия). searchParams в Next.js 16 — асинхронные.
export default async function NewDocumentPage({
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
        href="/documents"
        className="text-sm font-medium text-muted transition hover:text-espresso"
      >
        ← К документам
      </Link>

      <h1 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-espresso">Загрузить документ</h1>

      {error && (
        <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <DocumentForm
        action={createDocument}
        events={events ?? []}
        defaultEventId={event}
        submitLabel="Загрузить"
      />
    </div>
  );
}
