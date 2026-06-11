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
import { deleteNote } from "../actions";
import ConfirmDeleteButton from "@/components/ConfirmDeleteButton";
import { alertError, badgeBase, btnSecondary } from "@/components/ui";

// Карточка заметки опыта. В Next.js 16 params — асинхронные.
export default async function NotePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

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
        className="text-sm font-medium text-muted transition hover:text-espresso"
      >
        ← К базе опыта
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="font-serif text-2xl font-semibold tracking-tight text-espresso">{note.title}</h1>
        <span className={badgeBase + " " + kindBadgeClass(note.kind)}>
          {kindLabel(note.kind)}
        </span>
        {note.category && (
          <span className={badgeBase + " " + categoryBadgeClass(note.category)}>
            {categoryLabel(note.category)}
          </span>
        )}
      </div>

      {error && <p className={"mt-4 " + alertError}>{error}</p>}

      {/* Основные поля */}
      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-sand bg-card p-4 shadow-sm">
          <dt className="text-xs uppercase tracking-wide text-muted">Мероприятие</dt>
          <dd className="mt-1 text-espresso">
            {note.events ? (
              <Link
                href={`/events/${note.events.id}`}
                className="text-espresso underline-offset-2 hover:underline"
              >
                {note.events.title}
              </Link>
            ) : (
              "—"
            )}
          </dd>
        </div>
        <div className="rounded-lg border border-sand bg-card p-4 shadow-sm">
          <dt className="text-xs uppercase tracking-wide text-muted">Добавлена</dt>
          <dd className="mt-1 text-espresso">{formatEventDate(note.created_at)}</dd>
        </div>
      </dl>

      <div className="mt-4 rounded-lg border border-sand bg-card p-4 shadow-sm">
        <dt className="text-xs uppercase tracking-wide text-muted">Текст вывода</dt>
        <dd className="mt-1 whitespace-pre-wrap text-espresso">
          {note.description ?? "—"}
        </dd>
      </div>

      {/* Действия */}
      <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
        <Link href={`/experience/${note.id}/edit`} className={btnSecondary}>
          Редактировать
        </Link>
        <ConfirmDeleteButton
          action={deleteNote}
          id={note.id}
          title="Удалить заметку?"
          message="Это действие необратимо."
        />
      </div>
    </div>
  );
}
