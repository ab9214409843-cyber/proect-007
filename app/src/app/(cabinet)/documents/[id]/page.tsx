import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatEventDate } from "@/lib/events";
import {
  documentTypeBadgeClass,
  documentTypeLabel,
  formatFileSize,
} from "@/lib/documents";
import { downloadDocument } from "../actions";
import DeleteDocumentButton from "./DeleteDocumentButton";

// Карточка документа. В Next.js 16 params — асинхронные.
export default async function DocumentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();
  const { data: doc } = await supabase
    .from("documents")
    .select("*, events(id, title)")
    .eq("id", id)
    .single();

  if (!doc) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/documents"
        className="text-sm font-medium text-gray-500 transition hover:text-gray-900"
      >
        ← К документам
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold text-gray-900">{doc.title}</h1>
        <span
          className={
            "rounded-full px-3 py-1 text-xs font-medium " +
            documentTypeBadgeClass(doc.type)
          }
        >
          {documentTypeLabel(doc.type)}
        </span>
      </div>

      {error && (
        <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      {/* Основные поля */}
      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <dt className="text-xs uppercase tracking-wide text-gray-500">Файл</dt>
          <dd className="mt-1 break-all text-gray-900">{doc.file_name ?? "—"}</dd>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <dt className="text-xs uppercase tracking-wide text-gray-500">Размер</dt>
          <dd className="mt-1 text-gray-900">{formatFileSize(doc.file_size)}</dd>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <dt className="text-xs uppercase tracking-wide text-gray-500">
            Мероприятие
          </dt>
          <dd className="mt-1 text-gray-900">
            {doc.events ? (
              <Link
                href={`/events/${doc.events.id}`}
                className="text-gray-900 underline-offset-2 hover:underline"
              >
                {doc.events.title}
              </Link>
            ) : (
              "—"
            )}
          </dd>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <dt className="text-xs uppercase tracking-wide text-gray-500">Загружен</dt>
          <dd className="mt-1 text-gray-900">{formatEventDate(doc.created_at)}</dd>
        </div>
      </dl>

      {/* Действия */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <form action={downloadDocument}>
          <input type="hidden" name="id" value={doc.id} />
          <button
            type="submit"
            className="rounded-md bg-gray-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
          >
            Скачать
          </button>
        </form>

        <div className="flex items-center gap-3">
          <Link
            href={`/documents/${doc.id}/edit`}
            className="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Редактировать
          </Link>
          <DeleteDocumentButton id={doc.id} />
        </div>
      </div>
    </div>
  );
}
