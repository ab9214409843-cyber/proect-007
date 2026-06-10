import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateDocument } from "../../actions";
import DocumentForm from "../../DocumentForm";

// Страница редактирования метаданных документа (название, тип, мероприятие).
// Сам файл не заменяется. params и searchParams в Next.js 16 — асинхронные.
export default async function EditDocumentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();
  const [{ data: document }, { data: events }] = await Promise.all([
    supabase.from("documents").select("*").eq("id", id).single(),
    supabase
      .from("events")
      .select("id, title")
      .order("start_date", { ascending: true, nullsFirst: false }),
  ]);

  if (!document) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href={`/documents/${id}`}
        className="text-sm font-medium text-muted transition hover:text-espresso"
      >
        ← К документу
      </Link>

      <h1 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-espresso">Редактирование</h1>

      {error && (
        <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <DocumentForm
        action={updateDocument}
        document={document}
        events={events ?? []}
        submitLabel="Сохранить"
      />
    </div>
  );
}
