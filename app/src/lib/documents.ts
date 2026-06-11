// Общие константы и хелперы модуля документов (этап 7).
// Типы хранятся в БД английскими кодами (CHECK в миграции 0001), подписи — здесь.

import type { Tables } from "@/lib/supabase/database.types";

export type DocumentRow = Tables<"documents">;

// Имя приватного бакета Supabase Storage (создан миграцией 0006).
export const DOCUMENTS_BUCKET = "documents";

// Максимальный размер файла — 25 МБ (совпадает с лимитом бакета и bodySizeLimit в next.config.ts).
export const MAX_FILE_BYTES = 25 * 1024 * 1024;

// Типы документов: код в БД → подпись в интерфейсе. Коды строго как в CHECK миграции 0001.
export const DOCUMENT_TYPES = [
  { code: "regulation", label: "Положение" },
  { code: "rules", label: "Регламент" },
  { code: "memo", label: "Служебная записка" },
  { code: "estimate", label: "Смета" },
  { code: "tor", label: "Техническое задание" },
  { code: "scenario", label: "Сценарный план" },
  { code: "report", label: "Отчёт" },
  { code: "other", label: "Другое" },
] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number]["code"];

export function documentTypeLabel(code: string | null): string {
  if (!code) return "—";
  return DOCUMENT_TYPES.find((t) => t.code === code)?.label ?? code;
}

// Тип документа — единая тёплая нейтраль (как категории в «Базе опыта»): сам тип
// различается подписью, а цветом за внимание конкурируют только смысловые бейджи
// (статусы, приоритеты, состояние срока). Палитра v2 — см. globals.css.
export function documentTypeBadgeClass(_code: string | null): string {
  return "bg-paper-2 text-muted";
}

// Размер файла в байтах → человекочитаемо: «340 КБ», «1.2 МБ». Пусто → «—».
export function formatFileSize(bytes: number | null): string {
  if (bytes === null || bytes === undefined) return "—";
  if (bytes < 1024) return `${bytes} Б`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} КБ`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} МБ`;
}

// Библиотека шаблонов документов (задача 10) — пока каркас: список с описанием.
// Реальные файлы Андрей готовит сам и кладёт в _шаблоны/ (см. _шаблоны/README.md);
// тогда подключим скачивание. Поэтому кнопка в UI — заглушка «Скоро».
export const DOCUMENT_TEMPLATES: {
  type: DocumentType;
  title: string;
  description: string;
}[] = [
  {
    type: "regulation",
    title: "Положение о мероприятии",
    description:
      "Основной документ мероприятия: цели, сроки, место, участники, программа, награждение.",
  },
  {
    type: "rules",
    title: "Регламент",
    description: "Порядок проведения, тайминг, зоны ответственности служб и организаторов.",
  },
  {
    type: "memo",
    title: "Служебная записка",
    description: "Внутреннее обращение по организационным вопросам (согласования, ресурсы).",
  },
  {
    type: "estimate",
    title: "Смета",
    description: "Расчёт расходов по статьям: площадка, оборудование, наградная продукция, услуги.",
  },
  {
    type: "tor",
    title: "Техническое задание",
    description: "Требования к подрядчику: что, в каком объёме и к какому сроку нужно выполнить.",
  },
  {
    type: "scenario",
    title: "Сценарный план",
    description: "Поминутный сценарий мероприятия: блоки, ведущие, реплики, переходы.",
  },
  {
    type: "report",
    title: "Отчёт об итогах мероприятия",
    description: "Итоговая справка: результаты, число участников, выводы, фотоотчёт.",
  },
];
