import Link from "next/link";
import {
  DOCUMENT_TEMPLATES,
  documentTypeBadgeClass,
  documentTypeLabel,
} from "@/lib/documents";

// Библиотека шаблонов документов (задача 10) — пока каркас: список с описанием.
// Реальные файлы Андрей готовит сам (см. _шаблоны/README.md); тогда кнопка «Скоро»
// заменится на скачивание/использование с автозаполнением данными мероприятия.
export default function DocumentTemplatesPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/documents"
        className="text-sm font-medium text-muted transition hover:text-espresso"
      >
        ← К документам
      </Link>

      <h1 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-espresso">Шаблоны документов</h1>
      <p className="mt-2 text-muted">
        Готовые заготовки документов для мероприятия. Скачивание и автозаполнение данными
        мероприятия появятся позже — сейчас это список с описанием.
      </p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {DOCUMENT_TEMPLATES.map((tpl) => (
          <li
            key={tpl.title}
            className="flex flex-col rounded-lg border border-sand bg-card p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-semibold text-espresso">{tpl.title}</h2>
              <span
                className={
                  "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium " +
                  documentTypeBadgeClass(tpl.type)
                }
              >
                {documentTypeLabel(tpl.type)}
              </span>
            </div>
            <p className="mt-2 flex-1 text-sm text-muted">{tpl.description}</p>
            <button
              type="button"
              disabled
              className="mt-4 cursor-not-allowed self-start rounded-md border border-sand bg-paper-2 px-4 py-2 text-sm font-medium text-muted"
            >
              Скоро
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
