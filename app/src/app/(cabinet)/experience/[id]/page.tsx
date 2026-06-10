import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatEventDate } from "@/lib/events";
import {
  categoryBadgeClass,
  categoryLabel,
  kindBadgeClass,
  kindLabel,
} from "@/lib/experience";
import DeleteNoteButton from "./DeleteNoteButton";

// Карточка заметки опыта. В Next.js 16 params — асинхронные.
export default async function NotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: note } = await supabase
    .from("experience_notes")
    .select("*, events(id, title)")
    .eq("id", id)
    .single();

  if (!note) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/experience"
        className="text-sm font-medium text-gray-500 transition hover:text-gray-900"
      >
        ← К базе опыта
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold text-gray-900">{note.title}</h1>
        <span
          className={
            "rounded-full px-3 py-1 text-xs font-medium " + kindBadgeClass(note.kind)
          }
        >
          {kindLabel(note.kind)}
        </span>
        {note.category && (
          <span
            className={
              "rounded-full px-3 py-1 text-xs font-medium " +
              categoryBadgeClass(note.category)
            }
          >
            {categoryLabel(note.category)}
          </span>
        )}
      </div>

      {/* Основные поля */}
      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <dt className="text-xs uppercase tracking-wide text-gray-500">Мероприятие</dt>
          <dd className="mt-1 text-gray-900">
            {note.events ? (
              <Link
                href={`/events/${note.events.id}`}
                className="text-gray-900 underline-offset-2 hover:underline"
              >
                {note.events.title}
              </Link>
            ) : (
              "—"
            )}
          </dd>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <dt className="text-xs uppercase tracking-wide text-gray-500">Добавлена</dt>
          <dd className="mt-1 text-gray-900">{formatEventDate(note.created_at)}</dd>
        </div>
      </dl>

      <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <dt className="text-xs uppercase tracking-wide text-gray-500">Текст вывода</dt>
        <dd className="mt-1 whitespace-pre-wrap text-gray-900">
          {note.description ?? "—"}
        </dd>
      </div>

      {/* Действия */}
      <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
        <Link
          href={`/experience/${note.id}/edit`}
          className="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
        >
          Редактировать
        </Link>
        <DeleteNoteButton id={note.id} />
      </div>
    </div>
  );
}
