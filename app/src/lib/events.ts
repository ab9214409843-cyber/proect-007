// Общие константы и хелперы модуля мероприятий (этап 4).
// Статусы хранятся в БД английскими кодами (CHECK в миграции 0001), подписи — здесь.

import type { Tables } from "@/lib/supabase/database.types";

export type EventRow = Tables<"events">;

// Упорядоченный список статусов: код в БД → подпись в интерфейсе.
export const EVENT_STATUSES = [
  { code: "planned", label: "Планируется" },
  { code: "preparing", label: "В подготовке" },
  { code: "in_progress", label: "Проводится" },
  { code: "done", label: "Завершено" },
] as const;

export type EventStatus = (typeof EVENT_STATUSES)[number]["code"];

// Подпись статуса по коду (если код незнаком — возвращаем сам код).
export function statusLabel(code: string): string {
  return EVENT_STATUSES.find((s) => s.code === code)?.label ?? code;
}

// Tailwind-классы цветного бейджа статуса.
const STATUS_BADGE: Record<string, string> = {
  planned: "bg-gray-100 text-gray-700",
  preparing: "bg-amber-100 text-amber-800",
  in_progress: "bg-blue-100 text-blue-800",
  done: "bg-green-100 text-green-800",
};

export function statusBadgeClass(code: string): string {
  return STATUS_BADGE[code] ?? "bg-gray-100 text-gray-700";
}

// Дата вида '2026-06-09' → «9 июня 2026». Пусто → «—».
// timeZone: 'UTC' — чтобы дата не «съезжала» на день из-за часового пояса.
export function formatEventDate(date: string | null): string {
  if (!date) return "—";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

// Диапазон дат: «9 июня 2026 — 11 июня 2026», или одна дата, или «—».
export function formatEventRange(
  start: string | null,
  end: string | null,
): string {
  if (!start && !end) return "—";
  if (start && end && start !== end) {
    return `${formatEventDate(start)} — ${formatEventDate(end)}`;
  }
  return formatEventDate(start ?? end);
}
