// Общие константы и хелперы модуля «База опыта» (этап 8).
// Коды хранятся в БД английскими (CHECK в миграциях 0001 и 0007), подписи — здесь.

import type { Tables } from "@/lib/supabase/database.types";

export type ExperienceNoteRow = Tables<"experience_notes">;

// Тип вывода: что прошло хорошо / ошибка / что улучшить. Коды строго как в CHECK миграции 0007.
export const EXPERIENCE_KINDS = [
  { code: "positive", label: "✅ Что хорошо" },
  { code: "negative", label: "⚠️ Ошибка" },
  { code: "improvement", label: "💡 Что улучшить" },
] as const;

export type ExperienceKind = (typeof EXPERIENCE_KINDS)[number]["code"];

export function kindLabel(code: string | null): string {
  if (!code) return "—";
  return EXPERIENCE_KINDS.find((k) => k.code === code)?.label ?? code;
}

const EXPERIENCE_KIND_BADGE: Record<string, string> = {
  positive: "bg-success-bg text-success",
  negative: "bg-danger-bg text-danger",
  improvement: "bg-warn-bg text-warn",
};

export function kindBadgeClass(code: string | null): string {
  if (!code) return "bg-paper-2 text-muted";
  return EXPERIENCE_KIND_BADGE[code] ?? "bg-paper-2 text-muted";
}

// Категории (тема вывода): код в БД → подпись. Коды строго как в CHECK миграции 0001.
export const EXPERIENCE_CATEGORIES = [
  { code: "organization", label: "Организация" },
  { code: "venue", label: "Площадка" },
  { code: "contractors", label: "Подрядчики" },
  { code: "documents", label: "Документы" },
  { code: "participants", label: "Участники" },
  { code: "budget", label: "Бюджет" },
  { code: "other", label: "Другое" },
] as const;

export type ExperienceCategory = (typeof EXPERIENCE_CATEGORIES)[number]["code"];

export function categoryLabel(code: string | null): string {
  if (!code) return "—";
  return EXPERIENCE_CATEGORIES.find((c) => c.code === code)?.label ?? code;
}

// Категории — единая тёплая нейтраль: смысловой цвет несёт «тип вывода» (kind ✅/⚠️/💡),
// а категория лишь помечает тему, поэтому не конкурирует за внимание цветом.
export function categoryBadgeClass(_code: string | null): string {
  return "bg-paper-2 text-muted";
}
