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
  positive: "bg-green-100 text-green-800",
  negative: "bg-red-100 text-red-800",
  improvement: "bg-amber-100 text-amber-800",
};

export function kindBadgeClass(code: string | null): string {
  if (!code) return "bg-gray-100 text-gray-700";
  return EXPERIENCE_KIND_BADGE[code] ?? "bg-gray-100 text-gray-700";
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

const EXPERIENCE_CATEGORY_BADGE: Record<string, string> = {
  organization: "bg-blue-100 text-blue-800",
  venue: "bg-indigo-100 text-indigo-800",
  contractors: "bg-purple-100 text-purple-800",
  documents: "bg-teal-100 text-teal-800",
  participants: "bg-pink-100 text-pink-800",
  budget: "bg-emerald-100 text-emerald-800",
  other: "bg-gray-100 text-gray-700",
};

export function categoryBadgeClass(code: string | null): string {
  if (!code) return "bg-gray-100 text-gray-700";
  return EXPERIENCE_CATEGORY_BADGE[code] ?? "bg-gray-100 text-gray-700";
}
