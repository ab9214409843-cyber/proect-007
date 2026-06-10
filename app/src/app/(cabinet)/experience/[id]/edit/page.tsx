import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateNote } from "../../actions";
import ExperienceForm from "../../ExperienceForm";

// Страница редактирования заметки опыта. params и searchParams в Next.js 16 — асинхронные.
export default async function EditNotePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();
  const [{ data: note }, { data: events }] = await Promise.all([
    supabase.from("experience_notes").select("*").eq("id", id).single(),
    supabase
      .from("events")
      .select("id, title")
      .order("start_date", { ascending: true, nullsFirst: false }),
  ]);

  if (!note) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href={`/experience/${id}`}
        className="text-sm font-medium text-gray-500 transition hover:text-gray-900"
      >
        ← К заметке
      </Link>

      <h1 className="mt-3 text-2xl font-semibold text-gray-900">Редактирование</h1>

      {error && (
        <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <ExperienceForm
        action={updateNote}
        note={note}
        events={events ?? []}
        submitLabel="Сохранить"
      />
    </div>
  );
}
